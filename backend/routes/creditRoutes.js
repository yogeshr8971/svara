import express from 'express';
import { getBalance_, getTransactions, getPackages, createCreditOrder, verifyPayment } from '../controllers/creditController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/packages', getPackages);
router.use(protect);
router.get('/', getBalance_);
router.get('/transactions', getTransactions);
router.post('/create-order', createCreditOrder);
router.post('/verify-payment', verifyPayment);

export default router;
