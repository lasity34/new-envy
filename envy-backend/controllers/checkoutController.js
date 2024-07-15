import { pool } from '../db/database.js';
import { clearCart } from './cartController.js';

export const processOrder = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const userId = req.user.id;
    const { cartItems } = req.body;

    // Create order
    const orderResult = await client.query(
      'INSERT INTO orders (user_id, status, total_amount) VALUES ($1, $2, $3) RETURNING id',
      [userId, 'Processing', cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0)]
    );
    const orderId = orderResult.rows[0].id;

    // Create order items and reduce stock
    for (const item of cartItems) {
      await client.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [orderId, item.id, item.quantity, item.price]
      );
      await client.query(
        'UPDATE products SET stock = stock - $1 WHERE id = $2',
        [item.quantity, item.id]
      );
    }

    // Clear the cart
    await client.query('DELETE FROM cart WHERE user_id = $1', [userId]);

    await client.query('COMMIT');

    res.status(200).json({ success: true, orderId: orderId });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error processing order:', error);
    res.status(500).json({ success: false, message: 'Error processing order' });
  } finally {
    client.release();
  }
};

export const getOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const { rows } = await pool.query(
      `SELECT o.id, o.status, o.total_amount, o.created_at, 
              json_agg(json_build_object('id', oi.id, 'product_id', oi.product_id, 'quantity', oi.quantity, 'price', oi.price)) as items
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       WHERE o.user_id = $1
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [userId]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user.id;

    const { rows } = await pool.query(
      `SELECT o.id, o.status, o.total_amount, o.created_at, 
              json_agg(json_build_object('id', oi.id, 'product_id', oi.product_id, 'quantity', oi.quantity, 'price', oi.price)) as items
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       WHERE o.id = $1 AND o.user_id = $2
       GROUP BY o.id`,
      [orderId, userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};