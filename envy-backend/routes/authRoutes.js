// routes/authRoutes.js (make sure the filename matches the import)

import express from 'express';
import { signup, login, getMe, forgotPassword, resetPassword } from '../controllers/authController.js';
import authenticate from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', authenticate, getMe);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

export default router;
