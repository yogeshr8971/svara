import Cart from '../models/Cart.js';
import Order from '../models/Order.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { createRazorpayOrder, verifyPaymentSignature } from '../services/paymentService.js';

const FREE_SHIPPING_THRESHOLD = 2000;
const SHIPPING_COST = 99;

export const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress } = req.body;
  if (!shippingAddress) throw new ApiError(400, 'Shipping address is required.');

  const cart = await Cart.findOne({ userId: req.user._id });
  if (!cart || cart.items.length === 0) throw new ApiError(400, 'Cart is empty.');

  const subtotal = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingAmount = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const totalAmount = subtotal + shippingAmount;

  const receipt = `order_${req.user._id}_${Date.now()}`;
  const rzOrder = await createRazorpayOrder(totalAmount * 100, receipt);

  const order = await Order.create({
    userId: req.user._id,
    items: cart.items.map((i) => ({
      productId: i.productId,
      name: i.name,
      image: i.image,
      price: i.price,
      size: i.size,
      color: i.color,
      quantity: i.quantity,
    })),
    shippingAddress,
    subtotal,
    shippingAmount,
    totalAmount,
    razorpayOrderId: rzOrder.id,
  });

  res.status(201).json({
    success: true,
    order,
    razorpayOrderId: rzOrder.id,
    amountInPaise: totalAmount * 100,
    keyId: process.env.RAZORPAY_KEY_ID,
  });
});

export const verifyOrderPayment = asyncHandler(async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
  const order = await Order.findOne({ _id: req.params.id, userId: req.user._id });
  if (!order) throw new ApiError(404, 'Order not found.');

  const valid = verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);
  if (!valid) throw new ApiError(400, 'Payment verification failed.');

  order.razorpayPaymentId = razorpayPaymentId;
  order.razorpaySignature = razorpaySignature;
  order.paymentStatus = 'paid';
  order.orderStatus = 'confirmed';
  await order.save();

  // Clear cart
  await Cart.findOneAndUpdate({ userId: req.user._id }, { items: [] });

  res.json({ success: true, order, message: 'Payment verified. Order confirmed!' });
});

export const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, orders });
});

export const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, userId: req.user._id });
  if (!order) throw new ApiError(404, 'Order not found.');
  res.json({ success: true, order });
});
