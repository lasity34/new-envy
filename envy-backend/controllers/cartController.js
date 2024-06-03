import { pool } from '../db/database.js';

export const getCartItems = async (req, res) => {
  try {
    const userId = req.user.id;
    const query = 'SELECT * FROM cart WHERE user_id = $1';
    const { rows } = await pool.query(query, [userId]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).send('Server error');
  }
};

export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id, quantity } = req.body;

    const query = 'INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3) ON CONFLICT (user_id, product_id) DO UPDATE SET quantity = cart.quantity + EXCLUDED.quantity RETURNING *';
    const values = [userId, product_id, quantity];
    const { rows } = await pool.query(query, values);
    res.json(rows[0]);
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).send('Server error');
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { quantity } = req.body;

    const query = 'UPDATE cart SET quantity = $1 WHERE user_id = $2 AND id = $3 RETURNING *';
    const values = [quantity, userId, id];
    const { rows } = await pool.query(query, values);
    res.json(rows[0]);
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).send('Server error');
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const query = 'DELETE FROM cart WHERE user_id = $1 AND id = $2 RETURNING *';
    const values = [userId, id];
    const { rows } = await pool.query(query, values);
    res.json(rows[0]);
  } catch (error) {
    console.error('Error removing cart item:', error);
    res.status(500).send('Server error');
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const query = 'DELETE FROM cart WHERE user_id = $1 RETURNING *';
    const { rows } = await pool.query(query, [userId]);
    res.json(rows);
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).send('Server error');
  }
};
