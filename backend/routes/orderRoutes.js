import express from 'express';
import { createOrder, verifyOrderPayment, getOrders, getOrder } from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrder);
router.post('/:id/verify-payment', verifyOrderPayment);

export default router;
