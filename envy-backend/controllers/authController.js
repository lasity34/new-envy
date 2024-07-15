import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import sgMail from '@sendgrid/mail';
import { createUser, getUserByEmail, getUserByUsername, getUserById, pool } from '../db/database.js';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

export const signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    const existingUserByEmail = await getUserByEmail(email);
    if (existingUserByEmail) {
      return res.status(400).json({ message: 'Email is already in use' });
    }

    const existingUserByUsername = await getUserByUsername(username);
    if (existingUserByUsername) {
      return res.status(400).json({ message: 'Username is already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUser(username, email, hashedPassword);

    const token = generateToken(newUser.id, newUser.role);

    res.status(201).json({ message: 'User created successfully', token, user: { id: newUser.id, username: newUser.username, email: newUser.email, role: newUser.role } });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};

export const login = async (req, res) => {
  console.log('Login request body:', req.body);
  const { identifier, password } = req.body;

  try {
    console.log('Login attempt with identifier:', identifier);

    if (!identifier || !password) {
      console.log('Missing identifier or password');
      return res.status(400).json({ message: 'Identifier and password are required' });
    }

    let user;
    if (identifier.includes('@')) {
      user = await getUserByEmail(identifier);
    } else {
      user = await getUserByUsername(identifier);
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = generateToken(user.id, user.role);
    res.status(200).json({ message: 'Login successful', token, user: { id: user.id, username: user.username, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Error logging in', error: error.message, stack: error.stack });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await getUserById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'Email not found' });
    }

    const token = crypto.randomBytes(20).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    const query = 'UPDATE users SET reset_password_token = $1, reset_password_expires = $2 WHERE id = $3';
    try {
      await pool.query(query, [token, resetTokenExpiry, user.id]);
    } catch (dbError) {
      console.error('Database query error:', dbError);
      return res.status(500).json({ message: 'Internal server error', error: dbError.message });
    }

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    const msg = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: 'Password Reset',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
      Please click on the following link, or paste this into your browser to complete the process:\n\n
      ${resetUrl}\n\n
      If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    try {
      console.log('Sending email to:', user.email); // Debugging log
      await sgMail.send(msg);
      console.log('Email sent successfully'); // Debugging log
      res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
      console.error('Error sending email:', error); // Log the error
      res.status(500).json({ message: 'Error sending email', error: error.message });
    }
  } catch (error) {
    console.error('Error in forgotPassword:', error); // Log the error
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const userQuery = 'SELECT * FROM users WHERE reset_password_token = $1 AND reset_password_expires > $2';
    const user = (await pool.query(userQuery, [token, new Date()])).rows[0];

    if (!user) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const updateQuery = 'UPDATE users SET password = $1, reset_password_token = NULL, reset_password_expires = NULL WHERE id = $2';
    await pool.query(updateQuery, [hashedPassword, user.id]);

    res.status(200).json({ message: 'Password has been reset' });
  } catch (error) {
    console.error('Error in resetPassword:', error); // Log the error
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


export const logout = async (req, res) => {
  // Since JWT is stateless, we don't need to do anything server-side
  // We'll just send a success response
  res.status(200).json({ message: 'Logged out successfully' });
};