import express from 'express';
import { processOrder, getOrders, getOrderById } from '../controllers/checkoutController.js';
import { authenticate, authenticateAdmin } from '../middleware/auth.js';
import { getAllOrders, updateOrderStatus } from '../controllers/checkoutController.js';

const router = express.Router();

router.post('/mock-checkout', authenticate, processOrder);
router.get('/orders', authenticate, getOrders);
router.get('/orders/:id', authenticate, getOrderById);  // Add this line if it's missing
router.get('/admin/orders', authenticateAdmin, getAllOrders);
router.put('/admin/orders/:id/status', authenticateAdmin, updateOrderStatus);

export default router;