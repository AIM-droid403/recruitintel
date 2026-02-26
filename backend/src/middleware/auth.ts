import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                role: 'ADMIN' | 'EMPLOYER' | 'CANDIDATE';
                tokens: number;
                isBlocked: boolean;
            };
        }
    }
}

export type AuthRequest = Request;

export const verifyJWT = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

        // Fetch latest user status from DB to check for blocks or balance
        const userRes = await pool.query(
            'SELECT id, role, tokens, is_blocked FROM users WHERE id = $1',
            [decoded.id]
        );

        if (userRes.rows.length === 0) {
            return res.status(401).json({ error: 'User not found' });
        }

        const user = userRes.rows[0];
        if (user.is_blocked) {
            return res.status(403).json({ error: 'Access denied: User is blocked' });
        }

        req.user = {
            id: user.id,
            role: user.role,
            tokens: user.tokens,
            isBlocked: user.is_blocked,
        };

        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

export const roleGuard = (roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
        }
        next();
    };
};

export const blockCheck = async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user?.isBlocked) {
        return res.status(403).json({ error: 'Account is blocked' });
    }
    next();
};
