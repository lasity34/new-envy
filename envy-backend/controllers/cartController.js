import { pool } from '../db/database.js';

export const getCartItems = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { rows } = await pool.query(`
      SELECT c.id, c.quantity, p.id as product_id, p.name as product_name, p.price, p.imageurl, p.stock
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = $1
    `, [userId]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id: product_id, quantity } = req.body;

    const query = `
      INSERT INTO cart (user_id, product_id, quantity) 
      VALUES ($1, $2, $3) 
      ON CONFLICT (user_id, product_id) 
      DO UPDATE SET quantity = cart.quantity + EXCLUDED.quantity
      RETURNING *`;
    const values = [userId, product_id, quantity];
    const { rows } = await pool.query(query, values);
    res.json(rows[0]);
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const { quantity } = req.body;

    const query = 'UPDATE cart SET quantity = $1 WHERE user_id = $2 AND product_id = $3 RETURNING *';
    const values = [quantity, userId, id];
    const { rows } = await pool.query(query, values);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Cart item not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const query = 'DELETE FROM cart WHERE user_id = $1 AND product_id = $2 RETURNING *';
    const values = [userId, id];
    const { rows } = await pool.query(query, values);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Cart item not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error removing cart item:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.user.userId;

    const query = 'DELETE FROM cart WHERE user_id = $1 RETURNING *';
    const { rows } = await pool.query(query, [userId]);
    res.json(rows);
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const syncCart = async (req, res) => {
  const client = await pool.connect();
  try {
    const userId = req.user.userId;
    const { items } = req.body;

    await client.query('BEGIN');

    // Clear existing cart
    await client.query('DELETE FROM cart WHERE user_id = $1', [userId]);

    // Insert new cart items
    for (let item of items) {
      await client.query(
        'INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3)',
        [userId, item.id, item.quantity]
      );
    }

    await client.query('COMMIT');

    // Fetch and return the updated cart
    const { rows } = await client.query(`
      SELECT c.id, c.quantity, p.id as product_id, p.name as product_name, p.price, p.imageurl, p.stock
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = $1
    `, [userId]);

    res.status(200).json(rows);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error syncing cart:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  } finally {
    client.release();
  }
};