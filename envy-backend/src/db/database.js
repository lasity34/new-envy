import pg from 'pg';

const { Pool } = pg;

// Create a pool instance and configure it with environment variables
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

// Export the pool and query function for use throughout your application
export const query = (text, params) => pool.query(text, params);

// Example function to demonstrate a database query
export async function fetchExample() {
    const res = await query('SELECT NOW()');
    console.log('Current Timestamp:', res.rows[0]);
}

// Uncomment the following line to test the database connection directly from this file
fetchExample();
