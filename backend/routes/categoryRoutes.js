import express from 'express';
import { getCategories, getCategory, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController.js';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/admin.js';
import { uploadSingle } from '../middleware/upload.js';

const router = express.Router();

router.get('/', getCategories);
router.get('/:slug', getCategory);
router.post('/', protect, adminOnly, uploadSingle, createCategory);
router.put('/:id', protect, adminOnly, uploadSingle, updateCategory);
router.delete('/:id', protect, adminOnly, deleteCategory);

export default router;
