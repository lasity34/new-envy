import express from 'express';
import multer from 'multer';
import {
  getAllProducts,
  getProduct,
  addProduct,
  updateProductDetails,
  removeProduct,
  uploadImage,
  updateProductStock
} from '../controllers/productsController.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get('/', getAllProducts);
router.get('/:id', getProduct);
router.post('/', authenticateAdmin, upload.single('image'), addProduct);
router.put('/:id', authenticateAdmin, upload.single('image'), updateProductDetails);
router.delete('/:id', authenticateAdmin, removeProduct);
router.post('/upload', authenticateAdmin, upload.single('image'), uploadImage);
router.patch('/:id/stock', authenticateAdmin, updateProductStock);

export default router;
