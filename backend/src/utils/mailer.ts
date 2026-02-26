import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Reusable privacy helper for server logs
const maskEmail = (email: string) =>
    email.replace(/^(.)(.*)(@.*)$/, (_, a, b, c) => a + b.replace(/./g, '*') + c);

// Create a SMTP transporter with connection pooling for high throughput
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: Number(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE ? (process.env.SMTP_SECURE === 'true' || process.env.SMTP_SECURE === 'SSL') : process.env.SMTP_PORT === '465',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Verify connection configuration on startup
transporter.verify((error, success) => {
    if (error) {
        console.error('[SMTP] 🔴 Connection Error:', error.message);
    } else {
        console.log('[SMTP] 🟢 Server is ready to take our messages');
    }
});

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
    text?: string;
}

/**
 * Core function to dispatch emails across the RecruitIntel platform.
 */
export const sendEmail = async ({ to, subject, html, text }: EmailOptions): Promise<boolean> => {
    try {
        const from = process.env.EMAIL_FROM || `"${process.env.SMTP_USER}" <${process.env.SMTP_USER}>`;

        // Development Fallback: If no SMTP credentials, log to console
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.warn(`[SMTP] ⚠️ Credentials missing. Masked delivery to ${maskEmail(to)} logged below:`);
            console.log(`[SMTP] 📧 SUBJECT: ${subject}`);
            console.log(`[SMTP] 📧 CONTENT: ${text || 'HTML Content'}`);
            return true;
        }

        const info = await transporter.sendMail({
            from,
            to,
            subject,
            text: text || html.replace(/<[^>]*>?/gm, ''), // Fallback plaintext stripper
            html,
        });

        // Log securely using the masked email
        console.log(`[SMTP] 📧 Email sent to ${maskEmail(to)} | MessageID: ${info.messageId}`);
        return true;
    } catch (error) {
        console.error(`[SMTP] 🔴 Failed to send email to ${maskEmail(to)}:`, error);
        return false;
    }
};
