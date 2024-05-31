// hashAdminPassword.js

import bcrypt from 'bcryptjs';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Configure your database connection using environment variables
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: process.env.USE_SSL === 'true' ? { rejectUnauthorized: process.env.REJECT_UNAUTHORIZED !== 'false' } : false,
});

const adminUsername = 'admin';
const adminEmail = 'bjornworrall89@gmail.com';
const adminPassword = 'Unicorn26!'; // Replace with your desired admin password

// Hash the password
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

// Insert admin user into the database
const insertAdminUser = async (username, email, hashedPassword) => {
  const client = await pool.connect();
  try {
    const query = `
      INSERT INTO users (username, email, password, role)
      VALUES ($1, $2, $3, 'admin')
      RETURNING id, username, email, role;
    `;
    const values = [username, email, hashedPassword];
    const res = await client.query(query, values);
    console.log('Admin user created:', res.rows[0]);
  } catch (err) {
    console.error('Error inserting admin user:', err);
  } finally {
    client.release();
  }
};

// Main function
const createAdminUser = async () => {
  try {
    const hashedPassword = await hashPassword(adminPassword);
    console.log('Hashed password:', hashedPassword); // Log the hashed password
    await insertAdminUser(adminUsername, adminEmail, hashedPassword);
  } catch (err) {
    console.error('Error creating admin user:', err);
  } finally {
    pool.end();
  }
};

createAdminUser();



