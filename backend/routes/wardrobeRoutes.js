import express from 'express';
import { getWardrobe, getWardrobeItem, deleteWardrobeItem, toggleFavorite } from '../controllers/wardrobeController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.get('/', getWardrobe);
router.get('/:id', getWardrobeItem);
router.delete('/:id', deleteWardrobeItem);
router.patch('/:id/favorite', toggleFavorite);

export default router;
