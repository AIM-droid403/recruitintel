import { Response, NextFunction } from 'express';
import { Pool } from 'pg';
import { AuthRequest } from './auth';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export const enforceTokenomics = (cost: number) => {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

        try {
            // Re-verify balance from DB
            const userRes = await pool.query('SELECT tokens FROM users WHERE id = $1', [req.user.id]);
            const currentTokens = userRes.rows[0].tokens;

            if (currentTokens < cost) {
                return res.status(402).json({
                    error: 'Insufficient Tokens',
                    required: cost,
                    current: currentTokens
                });
            }

            // Deduct tokens
            await pool.query(
                'UPDATE users SET tokens = tokens - $1 WHERE id = $2',
                [cost, req.user.id]
            );

            // Log the deduction
            await pool.query(
                'INSERT INTO system_logs (user_id, action, payload) VALUES ($1, $2, $3)',
                [req.user.id, 'TOKEN_DEDUCTION', JSON.stringify({ cost, remaining: currentTokens - cost })]
            );

            next();
        } catch (error) {
            console.error('Tokenomics Error:', error);
            return res.status(500).json({ error: 'Balance verification failed' });
        }
    };
};
