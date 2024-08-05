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
    connectionTimeoutMillis: 60000, // Increase timeout to 30 seconds
    idleTimeoutMillis: 60000, // Increase idle timeout to 60 seconds
    max: 5, // Reduce max connections to 5
  });
}

export async function connectDatabase(credentials, sslCertPath) {
  try {
    pool = await createPool(credentials, sslCertPath);
    
    pool.on('error', (err, client) => {
      console.error('Unexpected error on idle client', err);
    });

    // Test the connection
    const client = await pool.connect();
    try {
      await client.query('SELECT NOW()');
      console.log('Database connection successful');
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Failed to create database pool:', error);
    throw error;
  }
}

const executeQuery = async (query, params = []) => {
  if (!pool) {
    console.error('Database pool is not initialized');
    throw new Error('Database pool is not initialized');
  }
  const client = await pool.connect();
  try {
    const start = Date.now();
    const result = await client.query(query, params);
    const duration = Date.now() - start;
    return result.rows;
  } catch (error) {
    console.error('Error executing query:', query, 'with params:', params, 'Error:', error);
    throw error;
  } finally {
    client.release();
  }
};

export async function checkDatabaseConnection() {
  if (!pool) {
    console.error('Database pool is not initialized');
    return false;
  }
  try {
    const client = await pool.connect();
    try {
      await client.query('SELECT NOW()');
      return true;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Database connection check failed:', error);
    return false;
  }
}

export async function getProducts() {
  console.log('Fetching all products');
  const query = 'SELECT id, name, description, price, stock, imageUrl as "imageUrl" FROM products';
  return await executeQuery(query);
}

export async function getProductById(id) {
  console.log(`Fetching product with id: ${id}`);
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

export async function updateUserDetails(userId, { firstName, lastName, address, city, province, postalCode, phone }) {
  const query = `
    UPDATE users 
    SET first_name = $1, last_name = $2, address = $3, city = $4, province = $5, postal_code = $6, phone = $7 
    WHERE id = $8 
    RETURNING id, username, email, first_name, last_name, address, city, province, postal_code, phone
  `;
  return (await executeQuery(query, [firstName, lastName, address, city, province, postalCode, phone, userId]))[0];
}

export async function getUserDetails(userId) {
  const query = `
    SELECT id, username, email, first_name, last_name, address, city, province, postal_code, phone 
    FROM users 
    WHERE id = $1
  `;
  return (await executeQuery(query, [userId]))[0];
}

export async function hasUserDetails(userId) {
  const query = `
    SELECT 
      CASE WHEN first_name IS NOT NULL AND 
                last_name IS NOT NULL AND 
                address IS NOT NULL AND 
                city IS NOT NULL AND 
                province IS NOT NULL AND 
                postal_code IS NOT NULL AND 
                phone IS NOT NULL 
      THEN true 
      ELSE false 
      END AS has_details 
    FROM users 
    WHERE id = $1
  `;
  const result = await executeQuery(query, [userId]);
  return result[0].has_details;
}

export { pool };
