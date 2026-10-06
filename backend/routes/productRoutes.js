import express from 'express';
import {
  getProducts, getProduct, createProduct, updateProduct, deleteProduct, searchProducts
} from '../controllers/productController.js';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/admin.js';

import { uploadProductFields } from '../middleware/upload.js';

const router = express.Router();

router.get('/search', searchProducts);
router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', protect, adminOnly, uploadProductFields, createProduct);
router.put('/:id', protect, adminOnly, uploadProductFields, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

export default router;
