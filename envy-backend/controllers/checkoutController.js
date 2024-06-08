import { pool } from '../db/database.js';
import { clearCart } from './cartController.js';

// Mock orders storage for demonstration purposes
let orders = [];

// Helper function to reduce stock
const reduceStock = async (cartItems) => {
  for (const item of cartItems) {
    const query = 'UPDATE products SET stock = stock - $1 WHERE id = $2';
    await pool.query(query, [item.quantity, item.product_id]);
  }
};

export const processOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { userData, cartItems } = req.body;

    // Reduce stock
    await reduceStock(cartItems);

    // Create order
    const order = {
      id: Date.now(),
      user: userData,
      items: cartItems,
      total: cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0),
      date: new Date(),
    };

    // Save order
    orders.push(order);

    // Clear the cart
    await clearCart(req, res);

    res.send({ success: true, orderId: order.id });
  } catch (error) {
    console.error('Error processing order:', error);
    res.status(500).send('Server error');
  }
};

export const getOrders = async (req, res) => {
  const userId = req.query.userId;
  if (userId) {
    const userOrders = orders.filter(order => order.user.email === userId);
    res.json(userOrders);
  } else {
    res.json(orders);
  }
};
