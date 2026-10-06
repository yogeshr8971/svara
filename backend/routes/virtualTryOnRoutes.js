import express from 'express';
import { generateVTO, getGeneration } from '../controllers/virtualTryOnController.js';
import { protect } from '../middleware/auth.js';
import { vtoLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.use(protect);
router.post('/', vtoLimiter, generateVTO);
router.get('/:id', getGeneration);

export default router;
