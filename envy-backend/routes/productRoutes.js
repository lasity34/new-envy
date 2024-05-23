import express from 'express';
import {
  getAllProducts,
  getProduct,
  addProduct,
  updateProductDetails,
  removeProduct,
} from '../controllers/productsController.js';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getProduct);
router.post('/', addProduct);
router.put('/:id', updateProductDetails);
router.delete('/:id', removeProduct);

export default router;
