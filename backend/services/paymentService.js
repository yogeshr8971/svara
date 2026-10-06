import Razorpay from 'razorpay';
import crypto from 'crypto';

const getRazorpay = () =>
  new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

/**
 * Create a Razorpay order.
 * @param {number} amountInPaise - Amount in smallest currency unit (paise for INR)
 * @param {string} receipt - Unique receipt ID
 */
export const createRazorpayOrder = async (amountInPaise, receipt) => {
  const razorpay = getRazorpay();
  return razorpay.orders.create({
    amount: amountInPaise,
    currency: 'INR',
    receipt: receipt.toString().substring(0, 40),
  });
};

/**
 * Verify Razorpay payment signature server-side.
 * NEVER add credits without calling this first.
 */
export const verifyPaymentSignature = (razorpayOrderId, razorpayPaymentId, signature) => {
  const body = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');
  return expectedSignature === signature;
};
