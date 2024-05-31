import pg from 'pg';
import { readFileSync } from 'fs';
const { Pool } = pg;

let pool;

export async function connectDatabase(credentials, sslCertPath) {
  try {
    const ssl = process.env.USE_SSL === 'true' ? {
      rejectUnauthorized: process.env.REJECT_UNAUTHORIZED !== 'false',
      ca: readFileSync(sslCertPath).toString()
    } : false;

    pool = new Pool({
      user: process.env.DB_USER || credentials.username,
      host: process.env.DB_HOST || credentials.host,
      database: process.env.DB_NAME || credentials.dbname,
      password: process.env.DB_PASSWORD || credentials.password,
      port: process.env.DB_PORT || credentials.port,
      ssl: ssl
    });

    console.log('Database pool created successfully');
  } catch (error) {
    console.error('Failed to create database pool:', error);
    throw error;
  }
}

export async function getProducts() {
  try {
    if (!pool) {
      throw new Error('Database pool is not initialized');
    }

    const query = 'SELECT id, name, description, price, stock, imageUrl as "imageUrl" FROM products';
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

export async function getProductById(id) {
  try {
    if (!pool) {
      throw new Error('Database pool is not initialized');
    }

    const query = 'SELECT id, name, description, price, stock, imageUrl as "imageUrl" FROM products WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    throw error;
  }
}

export async function createProduct({ name, description, price, stock, imageUrl }) {
  try {
    if (!pool) {
      throw new Error('Database pool is not initialized');
    }

    const query = 'INSERT INTO products (name, description, price, stock, imageUrl) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const values = [name, description, price, stock, imageUrl];
    const { rows } = await pool.query(query, values);
    return rows[0];
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}

export async function updateProduct(id, { name, description, price, stock, imageUrl }) {
  try {
    if (!pool) {
      throw new Error('Database pool is not initialized');
    }

    const query = 'UPDATE products SET name = $1, description = $2, price = $3, stock = $4, imageUrl = $5 WHERE id = $6 RETURNING *';
    const values = [name, description, price, stock, imageUrl, id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}

export async function deleteProduct(id) {
  try {
    if (!pool) {
      throw new Error('Database pool is not initialized');
    }

    const query = 'DELETE FROM products WHERE id = $1 RETURNING *';
    const values = [id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}

export async function createUser(username, email, hashedPassword) {
  try {
    if (!pool) {
      throw new Error('Database pool is not initialized');
    }

    const query = 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, created_at';
    const values = [username, email, hashedPassword];
    const { rows } = await pool.query(query, values);
    return rows[0];
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function getUserByEmail(email) {
  try {
    if (!pool) {
      throw new Error('Database pool is not initialized');
    }

    const query = 'SELECT * FROM users WHERE email = $1';
    const values = [email];
    const { rows } = await pool.query(query, values);
    return rows[0];
  } catch (error) {
    console.error('Error fetching user by email:', error);
    throw error;
  }
}

export async function getUserByUsername(username) {
  try {
    if (!pool) {
      throw new Error('Database pool is not initialized');
    }

    const query = 'SELECT * FROM users WHERE username = $1';
    const values = [username];
    const { rows } = await pool.query(query, values);
    return rows[0];
  } catch (error) {
    console.error('Error fetching user by username:', error);
    throw error;
  }
}

export async function getUserById(id) {
  try {
    if (!pool) {
      throw new Error('Database pool is not initialized');
    }

    const query = 'SELECT * FROM users WHERE id = $1';
    const values = [id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  } catch (error) {
    console.error('Error fetching user by id:', error);
    throw error;
  }
}

export { pool };
