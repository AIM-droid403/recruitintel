const { Client } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const testConnection = async () => {
    // Manual override for testing encoded password
    const password = 'Sakamoto.days';
    const encodedPassword = encodeURIComponent(password);
    const dbUrl = `postgresql://postgres:${encodedPassword}@db.esmkucjzrsrnlvqngfgo.supabase.co:5432/postgres`;

    console.log('Testing with encoded password...');

    const client = new Client({
        connectionString: dbUrl,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('Successfully connected to the database.');
        const res = await client.query('SELECT current_database(), current_user, version();');
        console.log('Connection Info:', res.rows[0]);
        await client.end();
    } catch (err) {
        console.error('Connection error:', err.stack);
        process.exit(1);
    }
};

testConnection();
