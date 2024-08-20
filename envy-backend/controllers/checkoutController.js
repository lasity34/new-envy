import sgMail from '@sendgrid/mail';
import { pool } from '../db/database.js';
import { createShipment } from './shippingcontroller.js';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);



export const processOrder = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const userId = req.user.userId;
    const { userData, cartItems, selectedShipping } = req.body;

    console.log('Processing order with data:', JSON.stringify({ userData, cartItems, selectedShipping }, null, 2));

    // Ensure all required fields are present
    if (!userData.first_name || !userData.last_name || !userData.address || !userData.city || 
        !userData.province || !userData.postal_code || !userData.phone || !userData.email) {
      return res.status(400).json({ success: false, message: 'Missing required user data' });
    }

    // Ensure selectedShipping is properly structured
    if (!selectedShipping || !selectedShipping.service_level || !selectedShipping.service_level.code) {
      return res.status(400).json({ success: false, message: 'Invalid shipping option selected' });
    }

    // Create shipment with ShipLogic
    let shipmentData;
    try {
      shipmentData = await createShipment(userData, cartItems, selectedShipping);
    } catch (shipmentError) {
      console.error('Error creating shipment:', shipmentError);
      await client.query('ROLLBACK');
      return res.status(500).json({ success: false, message: 'Error creating shipment', details: shipmentError.message });
    }

    // Calculate total amount with error handling
    const subtotal = cartItems.reduce((acc, item) => acc + (item.quantity * item.price), 0);
    const shippingCost = selectedShipping.rate || 0;
    const totalAmount = subtotal + shippingCost;

    const orderResult = await client.query(
      'INSERT INTO orders (user_id, status, total_amount, first_name, last_name, shipping_cost, tracking_number) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, created_at',
      [userId, 'Processing', totalAmount, userData.first_name, userData.last_name, shippingCost, shipmentData.tracking_reference]
    );
    const orderId = orderResult.rows[0].id;
    const orderDate = orderResult.rows[0].created_at;

    console.log(`Created order with ID ${orderId}`);

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

    // Prepare order details for email
    const orderDetails = cartItems.map(item => 
      `${item.name} - Quantity: ${item.quantity}, Price: R${item.price.toFixed(2)}`
    ).join('\n');

    // Send email to customer
    const customerMsg = {
      to: userData.email,
      from: process.env.EMAIL_USER,
      subject: 'Order Confirmation',
      text: `Thank you for your order!\n\nOrder ID: ${orderId}\nOrder Date: ${orderDate}\n\nOrder Details:\n${orderDetails}\n\nShipping Cost: R${shippingCost.toFixed(2)}\nTotal Amount: R${totalAmount.toFixed(2)}\nTracking Number: ${shipmentData.tracking_reference}\n\nWe'll notify you when it ships.`,
      html: `<h1>Order Confirmation</h1>
             <p>Thank you for your order!</p>
             <p>Order ID: <strong>${orderId}</strong></p>
             <p>Order Date: ${orderDate}</p>
             <h2>Order Details:</h2>
             <ul>
               ${cartItems.map(item => `<li>${item.name} - Quantity: ${item.quantity}, Price: R${item.price.toFixed(2)}</li>`).join('')}
             </ul>
             <p>Shipping Cost: <strong>R${shippingCost.toFixed(2)}</strong></p>
             <p>Total Amount: <strong>R${totalAmount.toFixed(2)}</strong></p>
             <p>Tracking Number: <strong>${shipmentData.tracking_reference}</strong></p>
             <p>We'll notify you when it ships.</p>`
    };

    await sgMail.send(customerMsg);

    await client.query('COMMIT');

    res.status(200).json({ success: true, orderId: orderId, trackingNumber: shipmentData.tracking_reference });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error processing order:', error);
    res.status(500).json({ success: false, message: 'Error processing order', details: error.message });
  } finally {
    client.release();
  }
};

export const getOrders = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { rows } = await pool.query(
      `SELECT o.id, o.status, o.total_amount, o.created_at, o.shipping_cost, o.tracking_number,
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
    const userId = req.user.userId;

    const { rows } = await pool.query(
      `SELECT o.id, o.user_id, o.status, o.total_amount, o.created_at, o.shipping_cost, o.tracking_number,
              json_agg(json_build_object(
                'id', oi.id, 
                'product_id', oi.product_id, 
                'product_name', p.name, 
                'quantity', oi.quantity, 
                'price', oi.price
              )) as items
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       LEFT JOIN products p ON oi.product_id = p.id
       WHERE o.id = $1
       GROUP BY o.id`,
      [orderId]
    );

    if (rows.length === 0) {
      console.log(`No order found with ID ${orderId}`);
      return res.status(404).json({ message: 'Order not found' });
    }

    if (Number(rows[0].user_id) !== Number(userId)) {
      console.log(`Order ${orderId} does not belong to user ${userId}`);
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT o.id, o.user_id, o.first_name, o.last_name, o.status, o.total_amount, o.created_at, o.shipping_cost, o.tracking_number,
             json_agg(json_build_object(
               'id', oi.id, 
               'product_id', oi.product_id, 
               'product_name', p.name, 
               'quantity', oi.quantity, 
               'price', oi.price
             )) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const { rows } = await client.query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Order not found' });
    }

    const order = rows[0];

    // Fetch user email and order details
    const userQuery = await client.query('SELECT email FROM users WHERE id = $1', [order.user_id]);
    const userEmail = userQuery.rows[0].email;

    const orderItemsQuery = await client.query(`
      SELECT oi.quantity, p.name, p.price
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = $1
    `, [id]);

    const orderItems = orderItemsQuery.rows;

    // Send status update email to customer
    const msg = {
      to: userEmail,
      from: process.env.EMAIL_USER,
      subject: `Order Status Update: ${status}`,
      text: `Your order (ID: ${id}) status has been updated to: ${status}`,
      html: `<h1>Order Status Update</h1>
             <p>Your order (ID: <strong>${id}</strong>) status has been updated to: <strong>${status}</strong></p>`
    };

    await sgMail.send(msg);

    await client.query('COMMIT');
    res.json(order);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  } finally {
    client.release();
  }
};


export const cancelOrder = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { id } = req.params;
    const userId = req.user.userId;

    // Check if the order belongs to the user and is in a cancellable state
    const { rows } = await client.query(
      'SELECT * FROM orders WHERE id = $1 AND user_id = $2 AND status = $3',
      [id, userId, 'Processing']
    );

    if (rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Order cannot be cancelled' });
    }

    const order = rows[0];

    // Cancel the order
    await client.query('UPDATE orders SET status = $1 WHERE id = $2', ['Cancelled', id]);

    // If there's a shipment associated with the order, cancel it
    if (order.tracking_number) {
      await cancelShipment(order.tracking_number);
    }

    // Restore stock
    const orderItems = await client.query('SELECT product_id, quantity FROM order_items WHERE order_id = $1', [id]);
    for (let item of orderItems.rows) {
      await client.query('UPDATE products SET stock = stock + $1 WHERE id = $2', [item.quantity, item.product_id]);
    }

    // Send cancellation email to customer
    const userQuery = await client.query('SELECT email FROM users WHERE id = $1', [userId]);
    const userEmail = userQuery.rows[0].email;

    const msg = {
      to: userEmail,
      from: process.env.EMAIL_USER,
      subject: 'Order Cancellation Confirmation',
      text: `Your order (ID: ${id}) has been cancelled successfully.`,
      html: `<h1>Order Cancellation Confirmation</h1>
             <p>Your order (ID: <strong>${id}</strong>) has been cancelled successfully.</p>`
    };

    await sgMail.send(msg);

    await client.query('COMMIT');
    res.json({ message: 'Order cancelled successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error cancelling order:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  } finally {
    client.release();
  }
};