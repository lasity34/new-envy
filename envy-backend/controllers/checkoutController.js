import sgMail from '@sendgrid/mail';
import { pool } from '../db/database.js';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const processOrder = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const userId = req.user.userId;
    const { userData, cartItems } = req.body;

    // Create order
    console.log(`Creating order for user ${userId}`);

    const orderResult = await client.query(
      'INSERT INTO orders (user_id, status, total_amount, first_name, last_name) VALUES ($1, $2, $3, $4, $5) RETURNING id, created_at',
      [userId, 'Processing', cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0), userData.firstName, userData.lastName]
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

    const totalAmount = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0).toFixed(2);

    // Send email to customer
    const customerMsg = {
      to: userData.email,
      from: process.env.EMAIL_USER,
      subject: 'Order Confirmation',
      text: `Thank you for your order!\n\nOrder ID: ${orderId}\nOrder Date: ${orderDate}\n\nOrder Details:\n${orderDetails}\n\nTotal Amount: R${totalAmount}\n\nWe'll notify you when it ships.`,
      html: `<h1>Order Confirmation</h1>
             <p>Thank you for your order!</p>
             <p>Order ID: <strong>${orderId}</strong></p>
             <p>Order Date: ${orderDate}</p>
             <h2>Order Details:</h2>
             <ul>
               ${cartItems.map(item => `<li>${item.name} - Quantity: ${item.quantity}, Price: R${item.price.toFixed(2)}</li>`).join('')}
             </ul>
             <p>Total Amount: <strong>R${totalAmount}</strong></p>
             <p>We'll notify you when it ships.</p>`
    };

    await sgMail.send(customerMsg);

    // Send email to admin
    const adminMsg = {
      to: process.env.ADMIN_EMAIL,
      from: process.env.EMAIL_USER,
      subject: 'New Order Received',
      text: `A new order has been placed.\n\nOrder ID: ${orderId}\nOrder Date: ${orderDate}\nCustomer: ${userData.firstName} ${userData.lastName}\nEmail: ${userData.email}\n\nOrder Details:\n${orderDetails}\n\nTotal Amount: R${totalAmount}`,
      html: `<h1>New Order Received</h1>
             <p>A new order has been placed.</p>
             <p>Order ID: <strong>${orderId}</strong></p>
             <p>Order Date: ${orderDate}</p>
             <p>Customer: ${userData.firstName} ${userData.lastName}</p>
             <p>Email: ${userData.email}</p>
             <h2>Order Details:</h2>
             <ul>
               ${cartItems.map(item => `<li>${item.name} - Quantity: ${item.quantity}, Price: R${item.price.toFixed(2)}</li>`).join('')}
             </ul>
             <p>Total Amount: <strong>R${totalAmount}</strong></p>`
    };

    await sgMail.send(adminMsg);

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
    const userId = req.user.userId;

    const { rows } = await pool.query(
      `SELECT o.id, o.user_id, o.status, o.total_amount, o.created_at, 
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
      SELECT o.id, o.user_id, o.first_name, o.last_name, o.status, o.total_amount, o.created_at, 
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

    let emailSubject = '';
    let emailText = '';
    let emailHtml = '';

    switch (status) {
      case 'Shipped':
        emailSubject = 'Your Order Has Been Shipped';
        emailText = `Your order (ID: ${id}) has been shipped. You will receive it soon!`;
        emailHtml = `<h1>Your Order Has Been Shipped</h1>
                     <p>Your order (ID: <strong>${id}</strong>) has been shipped. You will receive it soon!</p>`;
        break;
      case 'Delivered':
        emailSubject = 'Your Order Has Been Delivered';
        emailText = `Your order (ID: ${id}) has been delivered. We hope you enjoy your purchase!`;
        emailHtml = `<h1>Your Order Has Been Delivered</h1>
                     <p>Your order (ID: <strong>${id}</strong>) has been delivered. We hope you enjoy your purchase!</p>`;
        break;
      default:
        emailSubject = 'Order Status Update';
        emailText = `Your order (ID: ${id}) status has been updated to: ${status}`;
        emailHtml = `<h1>Order Status Update</h1>
                     <p>Your order (ID: <strong>${id}</strong>) status has been updated to: <strong>${status}</strong></p>`;
    }

    // Add order details to email
    emailText += `\n\nOrder Details:\n${orderItems.map(item => `${item.name} - Quantity: ${item.quantity}, Price: R${item.price.toFixed(2)}`).join('\n')}`;
    emailHtml += `<h2>Order Details:</h2>
                  <ul>
                    ${orderItems.map(item => `<li>${item.name} - Quantity: ${item.quantity}, Price: R${item.price.toFixed(2)}</li>`).join('')}
                  </ul>`;

    // Send email to customer
    const msg = {
      to: userEmail,
      from: process.env.EMAIL_USER,
      subject: emailSubject,
      text: emailText,
      html: emailHtml
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