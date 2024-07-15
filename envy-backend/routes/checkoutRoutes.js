import express from 'express';
import { processOrder, getOrders, getOrderById } from '../controllers/checkoutController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/mock-checkout', authenticate, processOrder);
router.get('/orders', authenticate, getOrders);
router.get('/orders/:id', authenticate, getOrderById);

export default router;