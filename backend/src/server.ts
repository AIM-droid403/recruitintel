import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { verifyJWT, roleGuard } from './middleware/auth';
import { enforceTokenomics } from './middleware/tokenomics';
import * as gemini from './services/geminiService';
import * as payment from './services/paymentService';
import * as emailService from './services/emailService';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
const pdf = require('pdf-parse');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// --- UTILS ---
const createLog = async (userId: string | null, action: string, details: any = {}) => {
    try {
        await pool.query(
            'INSERT INTO system_logs (user_id, action, details) VALUES ($1, $2, $3)',
            [userId, action, JSON.stringify(details)]
        );
    } catch (error) {
        console.error('Logging Error:', error);
    }
};

// --- MULTER CONFIG ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'uploads/';
        if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

const checkMaintenance = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const result = await pool.query("SELECT value FROM system_settings WHERE key = 'maintenance_mode'");
        const isMaintenance = result.rows[0]?.value === true;

        // Admins can bypass maintenance
        if (isMaintenance && (req as any).user?.role !== 'ADMIN') {
            return res.status(503).json({
                error: 'System Lockdown',
                message: 'The system is currently undergoing emergency maintenance. Please try again later.'
            });
        }
        next();
    } catch (error) {
        next(); // Proceed if settings can't be fetched
    }
};

// --- AUTH ROUTES ---
app.post('/api/auth/register', async (req, res) => {
    const { email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const result = await pool.query(
            'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id, email, role',
            [email, hashedPassword, role || 'CANDIDATE']
        );
        const user = result.rows[0];

        await createLog(user.id, 'USER_REGISTERED', { email: user.email, role: user.role });

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Registration failed' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

        const user = result.rows[0];
        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: '24h' }
        );
        await createLog(user.id, 'USER_LOGIN', { email: user.email });

        res.json({ token, user: { id: user.id, email: user.email, role: user.role, tokens: user.tokens } });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

app.get('/api/auth/me', verifyJWT, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, email, role, tokens FROM users WHERE id = $1',
            [req.user!.id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user profile' });
    }
});

app.post('/api/auth/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const result = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.json({ message: 'If that email is in our system, you will receive a reset link.' });
        }

        const user = result.rows[0];
        const token = jwt.sign(
            { id: user.id, purpose: 'password-reset' },
            process.env.JWT_SECRET!,
            { expiresIn: '1h' }
        );

        const sent = await emailService.sendResetEmail(email, token);
        if (!sent) {
            return res.status(500).json({ error: 'Failed to send reset email. Please try again later.' });
        }

        await createLog(user.id, 'PASSWORD_RESET_REQUESTED', { email });

        res.json({ message: 'If that email is in our system, you will receive a reset link.' });
    } catch (error) {
        console.error('Forgot Password Error:', error);
        res.status(500).json({ error: 'Failed to process forgot password' });
    }
});

app.post('/api/auth/reset-password', async (req, res) => {
    const { token, password } = req.body;
    try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
        if (decoded.purpose !== 'password-reset') throw new Error('Invalid token');

        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [hashedPassword, decoded.id]);

        res.json({ message: 'Password reset successful' });
    } catch (error) {
        res.status(401).json({ error: 'Invalid or expired reset token' });
    }
});

// --- USER PROFILE & SECURITY ---
app.put('/api/users/change-password', verifyJWT, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    try {
        const userRes = await pool.query('SELECT password_hash FROM users WHERE id = $1', [req.user!.id]);
        const user = userRes.rows[0];

        const isValid = await bcrypt.compare(currentPassword, user.password_hash);
        if (!isValid) return res.status(401).json({ error: 'Invalid current password' });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [hashedPassword, req.user!.id]);

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update password' });
    }
});

app.put('/api/users/profile', verifyJWT, upload.single('profilePicture'), async (req, res) => {
    try {
        let profilePictureUrl = req.body.profilePictureUrl;

        if (req.file) {
            profilePictureUrl = `/uploads/${req.file.filename}`;
        }

        if (profilePictureUrl) {
            await pool.query('UPDATE users SET profile_picture_url = $1 WHERE id = $2', [profilePictureUrl, req.user!.id]);
        }

        res.json({
            message: 'Profile updated successfully',
            profile_picture_url: profilePictureUrl
        });
    } catch (error) {
        console.error('Profile Update Error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

app.get('/api/jobs/matches', verifyJWT, async (req, res) => {
    try {
        // 1. Get Candidate Embedding
        const profileRes = await pool.query('SELECT embedding FROM candidate_profiles WHERE user_id = $1', [req.user!.id]);
        if (profileRes.rows.length === 0) return res.status(404).json({ error: 'Candidate profile not found. Please upload a CV first.' });

        const candidateEmbedding = profileRes.rows[0].embedding;

        // 2. Vector Search for Jobs (pgvector)
        // Join with users to get employer email for now (acting as company name)
        const jobsRes = await pool.query(
            `SELECT j.id, j.title, j.description, j.persona_description, u.email as employer_name,
                    (j.embedding <=> $1) as distance
             FROM job_vacancies j
             JOIN users u ON j.employer_id = u.id
             ORDER BY distance ASC
             LIMIT 10`,
            [candidateEmbedding]
        );

        // 3. Map to human readable scores
        const matches = jobsRes.rows.map(job => ({
            id: job.id,
            title: job.title,
            company: job.employer_name.split('@')[0].toUpperCase(), // Simple company name mock
            matchScore: Math.max(0, Math.min(100, Math.round((1 - job.distance) * 100))),
            description: job.description,
            persona: job.persona_description,
            tags: ['Remote', 'Full-time'] // Static tags for now
        }));

        res.json(matches);
    } catch (error) {
        console.error('Matching Error:', error);
        res.status(500).json({ error: 'Failed to fetch job matches' });
    }
});

app.get('/api/jobs/employer', verifyJWT, roleGuard(['EMPLOYER', 'ADMIN']), async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM job_vacancies WHERE employer_id = $1 ORDER BY created_at DESC',
            [req.user!.id]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch employer jobs' });
    }
});

// --- JOB ROUTES ---
app.get('/api/jobs', verifyJWT, checkMaintenance, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM job_vacancies ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch jobs' });
    }
});

app.post('/api/jobs/:id/apply', verifyJWT, checkMaintenance, roleGuard(['CANDIDATE']), async (req, res) => {
    const jobId = req.params.id;
    const candidateId = req.user!.id;
    try {
        await pool.query(
            'INSERT INTO job_applications (job_id, candidate_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [jobId, candidateId]
        );
        res.json({ message: 'Application submitted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Application failed' });
    }
});

app.get('/api/employer/applicants', verifyJWT, checkMaintenance, roleGuard(['EMPLOYER']), async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT a.*, j.title as job_title, u.email as candidate_email, u.profile_picture_url
            FROM job_applications a
            JOIN job_vacancies j ON a.job_id = j.id
            JOIN users u ON a.candidate_id = u.id
            WHERE j.employer_id = $1
            ORDER BY a.created_at DESC
        `, [req.user!.id]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch applicants' });
    }
});

app.post('/api/jobs', verifyJWT, checkMaintenance, roleGuard(['EMPLOYER', 'ADMIN']), enforceTokenomics(10), async (req, res) => {
    const { title, description, personaDescription } = req.body;
    try {
        const embedding = await gemini.generateEmbedding(`${title} ${description} ${personaDescription}`);
        const result = await pool.query(
            'INSERT INTO job_vacancies (employer_id, title, description, persona_description, embedding) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [req.user!.id, title, description, personaDescription, JSON.stringify(embedding)]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to post job' });
    }
});

app.post('/api/jobs/:id/match', verifyJWT, roleGuard(['EMPLOYER', 'ADMIN']), enforceTokenomics(20), async (req, res) => {
    const jobId = req.params.id;
    try {
        // 1. Get Job Persona
        const jobRes = await pool.query('SELECT persona_description, embedding FROM job_vacancies WHERE id = $1', [jobId]);
        if (jobRes.rows.length === 0) return res.status(404).json({ error: 'Job not found' });
        const job = jobRes.rows[0];

        // 2. Vector Search for Candidates (pgvector)
        const candidatesRes = await pool.query(
            `SELECT id, structured_data, embedding <=> $1 as distance 
       FROM candidate_profiles 
       ORDER BY distance LIMIT 10`,
            [job.embedding]
        );

        // 3. AI Neural Match for Reasoning
        const matches = await gemini.neuralMatch(job.persona_description, candidatesRes.rows);
        res.json(matches);
    } catch (error) {
        res.status(500).json({ error: 'Neural match failed' });
    }
});

// --- CV ROUTES ---
app.post('/api/cv/upload', verifyJWT, async (req, res) => {
    const { rawText } = req.body;
    try {
        const structuredData = await gemini.extractResume(rawText);
        const embedding = await gemini.generateEmbedding(JSON.stringify(structuredData));

        const result = await pool.query(
            `INSERT INTO candidate_profiles (user_id, structured_data, embedding) 
       VALUES ($1, $2, $3) 
       ON CONFLICT (user_id) DO UPDATE SET structured_data = $2, embedding = $3 
       RETURNING *`,
            [req.user!.id, JSON.stringify(structuredData), JSON.stringify(embedding)]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'CV processing failed' });
    }
});

app.post('/api/documents/upload', verifyJWT, upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const { documentType } = req.body;
    try {
        let aiResult = null;

        if (documentType === 'CV') {
            // 1. Extract Text from PDF
            const dataBuffer = fs.readFileSync(req.file.path);
            const pdfData = await pdf(dataBuffer);
            const rawText = pdfData.text;

            // 2. Gemini Extraction
            const structuredData = await gemini.extractResume(rawText);

            // 3. Generate Embedding
            const embedding = await gemini.generateEmbedding(JSON.stringify(structuredData));

            // 4. Update Profile
            await pool.query(
                `INSERT INTO candidate_profiles (user_id, structured_data, embedding) 
                 VALUES ($1, $2, $3) 
                 ON CONFLICT (user_id) DO UPDATE SET structured_data = $2, embedding = $3`,
                [req.user!.id, JSON.stringify(structuredData), JSON.stringify(embedding)]
            );

            aiResult = { structuredData, message: 'Neural Profile Synchronized' };
        }

        res.json({
            message: 'Document vaulted successfully',
            filename: req.file.filename,
            documentType,
            aiResult
        });
    } catch (error) {
        console.error('Upload Processing Error:', error);
        res.status(500).json({ error: 'Document upload and processing failed' });
    }
});

// --- ADMIN ROUTES ---
app.get('/api/admin/analytics', verifyJWT, roleGuard(['ADMIN']), async (req, res) => {
    try {
        const jobsCount = await pool.query('SELECT COUNT(*) FROM job_vacancies');
        const revenue = await pool.query("SELECT SUM(amount) FROM transactions WHERE status = 'SUCCESS'");
        const usersCount = await pool.query('SELECT COUNT(*) FROM users');
        const maintenance = await pool.query("SELECT value FROM system_settings WHERE key = 'maintenance_mode'");

        res.json({
            totalJobs: parseInt(jobsCount.rows[0].count),
            totalRevenue: parseFloat(revenue.rows[0].sum || 0),
            totalUsers: parseInt(usersCount.rows[0].count),
            isMaintenance: maintenance.rows[0]?.value || false
        });
    } catch (error) {
        console.error('Analytics Error:', error);
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
});

app.post('/api/admin/system/lockdown', verifyJWT, roleGuard(['ADMIN']), async (req, res) => {
    const { lockdown } = req.body;
    try {
        await pool.query(
            "UPDATE system_settings SET value = $1 WHERE key = 'maintenance_mode'",
            [lockdown]
        );
        res.json({ message: lockdown ? 'System locked down' : 'System restored' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to toggle lockdown' });
    }
});

app.get('/api/admin/users', verifyJWT, roleGuard(['ADMIN']), async (req, res) => {
    try {
        const result = await pool.query('SELECT id, email, role, tokens, is_blocked, created_at FROM users ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

app.put('/api/admin/users/:id/status', verifyJWT, roleGuard(['ADMIN']), async (req, res) => {
    const { isBlocked } = req.body;
    try {
        await pool.query('UPDATE users SET is_blocked = $1 WHERE id = $2', [isBlocked, req.params.id]);

        await createLog(req.user!.id, isBlocked ? 'BLOCK_USER' : 'UNBLOCK_USER', { targetUserId: req.params.id });

        res.json({ message: 'User status updated' });
    } catch (error) {
        res.status(500).json({ error: 'Update failed' });
    }
});

app.get('/api/admin/users/:id/logs', verifyJWT, roleGuard(['ADMIN']), async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM system_logs WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50',
            [req.params.id]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch logs' });
    }
});

app.get('/api/admin/users/:id/transactions', verifyJWT, roleGuard(['ADMIN']), async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM transactions WHERE user_id = $1 ORDER BY created_at DESC',
            [req.params.id]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
});

app.post('/api/admin/users/:id/messages', verifyJWT, roleGuard(['ADMIN']), async (req, res) => {
    const { subject, content } = req.body;
    try {
        // 1. Get user email
        const userRes = await pool.query('SELECT email FROM users WHERE id = $1', [req.params.id]);
        if (userRes.rows.length === 0) return res.status(404).json({ error: 'User not found' });
        const userEmail = userRes.rows[0].email;

        // 2. Save message to DB
        await pool.query(
            'INSERT INTO admin_messages (sender_id, receiver_id, subject, content) VALUES ($1, $2, $3, $4)',
            [req.user!.id, req.params.id, subject, content]
        );

        // 3. Send Email
        await emailService.sendAdminMessage(userEmail, subject, content);

        // 4. Log action
        await createLog(req.user!.id, 'SEND_ADMIN_MESSAGE', { targetUserId: req.params.id, subject });

        res.json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('Send Message Error:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

app.listen(port, () => {
    console.log(`RecruitIntel Backend running on http://0.0.0.0:${port}`);
});
