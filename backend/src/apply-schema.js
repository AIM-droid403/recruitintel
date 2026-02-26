const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

const applySql = async () => {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('Connected to database to apply schema.');

        const schemaPath = path.join(__dirname, '../../database/schema.sql');
        const seedPath = path.join(__dirname, '../../database/seed.sql');

        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        const seedSql = fs.readFileSync(seedPath, 'utf8');

        console.log('Applying schema.sql...');
        await client.query(schemaSql);
        console.log('Schema applied successfully.');

        console.log('Applying seed.sql...');
        await client.query(seedSql);
        console.log('Seed data applied successfully.');

        await client.end();
    } catch (err) {
        console.error('Error applying SQL:', err.stack);
        process.exit(1);
    }
};

applySql();
