import express from 'express';
import { getCartItems, addToCart, updateCartItem, removeFromCart, clearCart, mergeCart } from '../controllers/cartController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, getCartItems);
router.post('/add', authenticate, addToCart);
router.put('/:id', authenticate, updateCartItem);
router.delete('/:id', authenticate, removeFromCart);
router.delete('/', authenticate, clearCart);
router.post('/merge', authenticate, mergeCart);

export default router;
