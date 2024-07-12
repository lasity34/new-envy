import pg from 'pg';
import { readFileSync } from 'fs';
const { Pool } = pg;

let pool;

async function createPool(credentials, sslCertPath) {
  const ssl = process.env.USE_SSL === 'true' ? {
    rejectUnauthorized: process.env.REJECT_UNAUTHORIZED !== 'false',
    ca: readFileSync(sslCertPath).toString()
  } : false;

  return new Pool({
    user: process.env.DB_USER || credentials.username,
    host: process.env.DB_HOST || credentials.host,
    database: process.env.DB_NAME || credentials.dbname,
    password: process.env.DB_PASSWORD || credentials.password,
    port: process.env.DB_PORT || credentials.port || 5432,
    ssl: ssl,
    connectionTimeoutMillis: 20000, // Increase timeout to 20 seconds
    idleTimeoutMillis: 30000, // Idle client timeout
    max: 10, // Maximum number of clients in the pool
  });
}

export async function connectDatabase(credentials, sslCertPath) {
  try {
    pool = await createPool(credentials, sslCertPath);
    console.log('Database pool created successfully');
  } catch (error) {
    console.error('Failed to create database pool:', error);
    throw error;
  }
}

const executeQuery = async (query, params = []) => {
  if (!pool) {
    throw new Error('Database pool is not initialized');
  }
  try {
    const { rows } = await pool.query(query, params);
    return rows;
  } catch (error) {
    console.error('Error executing query:', query, params, error);
    throw error;
  }
};

export async function getProducts() {
  const query = 'SELECT id, name, description, price, stock, imageUrl as "imageUrl" FROM products';
  return await executeQuery(query);
}

export async function getProductById(id) {
  const query = 'SELECT id, name, description, price, stock, imageUrl as "imageUrl" FROM products WHERE id = $1';
  return (await executeQuery(query, [id]))[0];
}

export async function createProduct({ name, description, price, stock, imageUrl }) {
  const query = 'INSERT INTO products (name, description, price, stock, imageUrl) VALUES ($1, $2, $3, $4, $5) RETURNING *';
  return (await executeQuery(query, [name, description, price, stock, imageUrl]))[0];
}

export async function updateProduct(id, { name, description, price, stock, imageUrl }) {
  const query = 'UPDATE products SET name = $1, description = $2, price = $3, stock = $4, imageUrl = $5 WHERE id = $6 RETURNING *';
  return (await executeQuery(query, [name, description, price, stock, imageUrl, id]))[0];
}

export async function deleteProduct(id) {
  const query = 'DELETE FROM products WHERE id = $1 RETURNING *';
  return (await executeQuery(query, [id]))[0];
}

export async function createUser(username, email, hashedPassword) {
  const query = 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, created_at';
  return (await executeQuery(query, [username, email, hashedPassword]))[0];
}

export async function getUserByEmail(email) {
  const query = 'SELECT * FROM users WHERE email = $1';
  return (await executeQuery(query, [email]))[0];
}

export async function getUserByUsername(username) {
  const query = 'SELECT * FROM users WHERE username = $1';
  return (await executeQuery(query, [username]))[0];
}

export async function getUserById(id) {
  const query = 'SELECT * FROM users WHERE id = $1';
  return (await executeQuery(query, [id]))[0];
}

export { pool };
