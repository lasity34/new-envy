import pg from 'pg';
import { readFileSync } from 'fs';
const { Pool } = pg;

let pool;

function createPool(credentials, sslCertPath) {
  let ssl = false;
  if (process.env.USE_SSL === 'true') {
    ssl = {
      rejectUnauthorized: process.env.REJECT_UNAUTHORIZED !== 'false',
    };
    if (sslCertPath) {
      try {
        ssl.ca = readFileSync(sslCertPath).toString();
      } catch (error) {
        console.warn('Warning: Error reading SSL certificate. SSL will be enabled without a custom CA.', error);
      }
    }
  }

  return new Pool({
    user: process.env.DB_USER || credentials.username,
    host: process.env.DB_HOST || credentials.host,
    database: process.env.DB_NAME || credentials.dbname,
    password: process.env.DB_PASSWORD || credentials.password,
    port: parseInt(process.env.DB_PORT, 10) || credentials.port || 5432,
    ssl: ssl,
    connectionTimeoutMillis: 60000, // 60 seconds timeout
    idleTimeoutMillis: 60000, // 60 seconds idle timeout
    max: 5, // Maximum 5 connections
  });
}

export async function connectDatabase(credentials, sslCertPath) {
  try {

    pool = createPool(credentials, sslCertPath);
    
  
    const client = await pool.connect();
    try {
      
      await client.query('SELECT NOW()');
  
    } finally {
      client.release();
    }

    return pool;
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


export const updateUserDetails = async (userId, userDetails) => {
  const { 
    first_name, 
    last_name, 
    email, 
    address, 
    city, 
    province, 
    postal_code, 
    phone 
  } = userDetails;

  const query = `
    UPDATE users 
    SET 
      first_name = COALESCE($1, first_name),
      last_name = COALESCE($2, last_name),
      email = COALESCE($3, email),
      address = COALESCE($4, address),
      city = COALESCE($5, city),
      province = COALESCE($6, province),
      postal_code = COALESCE($7, postal_code),
      phone = COALESCE($8, phone)
    WHERE id = $9
    RETURNING *
  `;

  const values = [
    first_name,
    last_name,
    email,
    address,
    city,
    province,
    postal_code,
    phone,
    userId
  ];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error in updateUserDetails:', error);
    throw error;
  }
};


export async function hasUserDetails(userId) {
  const client = await pool.connect();
  try {
    const query = `
      SELECT 
        first_name, last_name, address, city, province, postal_code, phone
      FROM users 
      WHERE id = $1
    `;

    const result = await client.query(query, [userId]);


    if (result.rows.length === 0) {
      console.log('User not found');
      return false;
    }

    const user = result.rows[0];
    const hasAllDetails = 
      user.first_name && 
      user.last_name && 
      user.address && 
      user.city && 
      user.province && 
      user.postal_code && 
      user.phone;

    console.log('Has all details:', hasAllDetails);
    return hasAllDetails;
  } finally {
    client.release();
  }
}

export async function getUserDetails(userId) {
  // First, let's check which columns exist in the users table
  const checkColumnsQuery = `
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'users'
  `;
  const columns = await executeQuery(checkColumnsQuery);
  const columnNames = columns.map(col => col.column_name);

  // Create an array of column names we want to retrieve
  const desiredColumns = ['id', 'username', 'email', 'first_name', 'last_name', 'address', 'city', 'province', 'postal_code', 'phone'];

  // Filter the desired columns based on what actually exists in the table
  const existingColumns = desiredColumns.filter(col => columnNames.includes(col));

  const query = `
    SELECT ${existingColumns.join(', ')}
    FROM users 
    WHERE id = $1
  `;
  return (await executeQuery(query, [userId]))[0];
}

export { pool };
