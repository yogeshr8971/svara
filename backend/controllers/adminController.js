import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import CreditBalance from '../models/CreditBalance.js';
import CreditTransaction from '../models/CreditTransaction.js';
import CreditPackage from '../models/CreditPackage.js';
import VirtualTryOnGeneration from '../models/VirtualTryOnGeneration.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';

export const getDashboardStats = asyncHandler(async (req, res) => {
  const [userCount, productCount, orderCount, vtoCount, revenueAgg] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments(),
    Order.countDocuments(),
    VirtualTryOnGeneration.countDocuments({ status: 'COMPLETED' }),
    Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]),
  ]);

  res.json({
    success: true,
    stats: {
      users: userCount,
      products: productCount,
      orders: orderCount,
      vtoGenerations: vtoCount,
      totalRevenue: revenueAgg[0]?.total || 0,
    },
  });
});

export const getUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search } = req.query;
  const filter = search ? { $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }] } : {};
  const skip = (Number(page) - 1) * Number(limit);
  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    User.countDocuments(filter),
  ]);
  const userIds = users.map((u) => u._id);
  const balances = await CreditBalance.find({ userId: { $in: userIds } });
  const balanceMap = Object.fromEntries(balances.map((b) => [b.userId.toString(), b.balance]));
  const result = users.map((u) => ({ ...u.toObject(), credits: balanceMap[u._id.toString()] || 0 }));
  res.json({ success: true, users: result, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
});

export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found.');
  const credits = await CreditBalance.findOne({ userId: user._id });
  const orders = await Order.find({ userId: user._id }).sort({ createdAt: -1 }).limit(5);
  res.json({ success: true, user, credits: credits?.balance || 0, recentOrders: orders });
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (!['user', 'admin'].includes(role)) throw new ApiError(400, 'Role must be "user" or "admin".');
  if (req.params.id === req.user._id.toString()) throw new ApiError(400, 'Cannot change your own role.');
  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
  if (!user) throw new ApiError(404, 'User not found.');
  res.json({ success: true, user });
});

export const getVtoGenerations = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);
  const [generations, total] = await Promise.all([
    VirtualTryOnGeneration.find()
      .populate('userId', 'name email')
      .populate('productId', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    VirtualTryOnGeneration.countDocuments(),
  ]);
  res.json({ success: true, generations, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
});

export const getAdminTransactions = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);
  const [transactions, total] = await Promise.all([
    CreditTransaction.find().populate('userId', 'name email').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    CreditTransaction.countDocuments(),
  ]);
  res.json({ success: true, transactions, total });
});

export const getAdminPackages = asyncHandler(async (req, res) => {
  const packages = await CreditPackage.find().sort({ order: 1 });
  res.json({ success: true, packages });
});

export const createPackage = asyncHandler(async (req, res) => {
  const pkg = await CreditPackage.create(req.body);
  res.status(201).json({ success: true, package: pkg });
});

export const updatePackage = asyncHandler(async (req, res) => {
  const pkg = await CreditPackage.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!pkg) throw new ApiError(404, 'Package not found.');
  res.json({ success: true, package: pkg });
});
