import { Client } from 'pg';
import dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join(__dirname, '../.env') });

const testConnection = async () => {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('Successfully connected to the database.');
        const res = await client.query('SELECT current_database(), current_user, version();');
        console.log('Connection Info:', res.rows[0]);
        await client.end();
    } catch (err: any) {
        console.error('Connection error:', err.stack);
        process.exit(1);
    }
};

testConnection();
