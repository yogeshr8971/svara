import CreditBalance from '../models/CreditBalance.js';
import CreditTransaction from '../models/CreditTransaction.js';
import CreditPackage from '../models/CreditPackage.js';
import Payment from '../models/Payment.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { createRazorpayOrder, verifyPaymentSignature } from '../services/paymentService.js';
import { addCredits, getBalance } from '../services/creditService.js';

export const getBalance_ = asyncHandler(async (req, res) => {
  const balance = await getBalance(req.user._id);
  res.json({ success: true, balance: balance.balance, reserved: balance.reservedBalance });
});

export const getTransactions = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);
  const [transactions, total] = await Promise.all([
    CreditTransaction.find({ userId: req.user._id }).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    CreditTransaction.countDocuments({ userId: req.user._id }),
  ]);
  res.json({ success: true, transactions, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
});

export const getPackages = asyncHandler(async (req, res) => {
  const packages = await CreditPackage.find({ active: true }).sort({ order: 1 });
  res.json({ success: true, packages });
});

export const createCreditOrder = asyncHandler(async (req, res) => {
  const { packageId } = req.body;
  if (!packageId) throw new ApiError(400, 'Package ID is required.');

  const pkg = await CreditPackage.findById(packageId);
  if (!pkg || !pkg.active) throw new ApiError(404, 'Credit package not found or inactive.');

  const receipt = `credit_${req.user._id}_${Date.now()}`;
  const rzOrder = await createRazorpayOrder(pkg.priceInPaise, receipt);

  const payment = await Payment.create({
    userId: req.user._id,
    creditPackageId: pkg._id,
    razorpayOrderId: rzOrder.id,
    amountInPaise: pkg.priceInPaise,
    credits: pkg.credits,
    status: 'created',
  });

  res.json({
    success: true,
    razorpayOrderId: rzOrder.id,
    amountInPaise: pkg.priceInPaise,
    keyId: process.env.RAZORPAY_KEY_ID,
    paymentId: payment._id,
    package: pkg,
  });
});

export const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature, paymentId } = req.body;
  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature || !paymentId) {
    throw new ApiError(400, 'Missing payment verification fields.');
  }

  const payment = await Payment.findOne({ _id: paymentId, userId: req.user._id });
  if (!payment) throw new ApiError(404, 'Payment record not found.');
  if (payment.status === 'paid') return res.json({ success: true, message: 'Payment already verified.' });

  const valid = verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);
  if (!valid) {
    await Payment.findByIdAndUpdate(paymentId, { status: 'failed' });
    throw new ApiError(400, 'Payment verification failed. Signature mismatch.');
  }

  await Payment.findByIdAndUpdate(paymentId, {
    razorpayPaymentId,
    razorpaySignature,
    status: 'paid',
    verifiedAt: new Date(),
  });

  const balance = await addCredits(
    req.user._id,
    payment.credits,
    `Purchased ${payment.credits} credits`,
    razorpayPaymentId
  );

  res.json({ success: true, message: `${payment.credits} credits added to your account.`, balance: balance.balance });
});
