import express from 'express';
import { processOrder, getOrders } from '../controllers/checkoutController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/mock-checkout', authenticate, processOrder);
router.get('/orders', authenticate, getOrders);

export default router;
