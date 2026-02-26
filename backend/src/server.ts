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

// --- AUTH ROUTES ---
app.post('/api/auth/register', async (req, res) => {
    const { email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const result = await pool.query(
            'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id, email, role',
            [email, hashedPassword, role || 'CANDIDATE']
        );
        res.json(result.rows[0]);
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
app.post('/api/jobs', verifyJWT, roleGuard(['EMPLOYER', 'ADMIN']), enforceTokenomics(10), async (req, res) => {
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
        const revenue = await pool.query('SELECT SUM(amount) FROM transactions WHERE status = "SUCCESS"');
        const usersCount = await pool.query('SELECT COUNT(*) FROM users');
        res.json({
            totalJobs: jobsCount.rows[0].count,
            totalRevenue: revenue.rows[0].sum || 0,
            totalUsers: usersCount.rows[0].count
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
});

app.listen(port, () => {
    console.log(`RecruitIntel Backend running on http://0.0.0.0:${port}`);
});
