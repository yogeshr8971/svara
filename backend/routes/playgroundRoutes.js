import express from 'express';
import { getPlayground, addProductToPlayground, removeProductFromPlayground } from '../controllers/playgroundController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.get('/', getPlayground);
router.post('/products', addProductToPlayground);
router.delete('/products/:productId', removeProductFromPlayground);

export default router;
