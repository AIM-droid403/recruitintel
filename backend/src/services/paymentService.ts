import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export const processPayment = async (userId: string, amount: number, gateway: 'EcoCash' | 'Paynow' | 'Stripe') => {
    // In a real production app, this would call the respective gateway APIs
    // For this boilerplate, we simulate a successful transaction and update the user's tokens

    const tokenRate = 10; // 1 USD = 10 tokens
    const tokensToAdd = amount * tokenRate;

    try {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // 1. Create Transaction Record
            const txRes = await client.query(
                `INSERT INTO transactions (user_id, tokens_added, amount, gateway, status) 
         VALUES ($1, $2, $3, $4, 'SUCCESS') RETURNING id`,
                [userId, tokensToAdd, amount, gateway]
            );

            // 2. Update User Tokens
            await client.query(
                'UPDATE users SET tokens = tokens + $1 WHERE id = $2',
                [tokensToAdd, userId]
            );

            // 3. Log Audit
            await client.query(
                'INSERT INTO system_logs (user_id, action, payload) VALUES ($1, $2, $3)',
                [userId, 'PAYMENT_RECEIVED', JSON.stringify({ txId: txRes.rows[0].id, amount, tokensToAdd })]
            );

            await client.query('COMMIT');
            return { success: true, txId: txRes.rows[0].id, tokensToAdd };
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Payment Error:', error);
        throw new Error('Payment processing failed');
    }
};

export const generateInvoice = (userId: string, amount: number) => {
    // Logic for PDF generation or DB entry for overdue checks
    return {
        invoiceId: `INV-${Date.now()}`,
        userId,
        amount,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    };
};
