import express from 'express';
import { 
  processOrder, 
  getOrders, 
  getOrderById, 
  getAllOrders, 
  updateOrderStatus, 
  cancelOrder 
} from '../controllers/checkoutController.js';
import { authenticate, authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/process', authenticate, processOrder);
router.get('/orders', authenticate, getOrders);
router.get('/orders/:id', authenticate, getOrderById);
router.post('/cancel-order/:id', authenticate, cancelOrder);
router.get('/admin/orders', authenticateAdmin, getAllOrders);
router.put('/admin/orders/:id/status', authenticateAdmin, updateOrderStatus);

export default router;