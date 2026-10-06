import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import CreditBalance from '../models/CreditBalance.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { addBonusCredits } from '../services/creditService.js';

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

const sendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
    },
  });
};

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) throw new ApiError(400, 'Name, email, and password are required.');
  if (password.length < 6) throw new ApiError(400, 'Password must be at least 6 characters.');

  const exists = await User.findOne({ email });
  if (exists) throw new ApiError(400, 'An account with this email already exists.');

  const user = await User.create({ name, email, password });

  // Initialize credit balance with 5 welcome credits
  await CreditBalance.create({ userId: user._id, balance: 0 });
  await addBonusCredits(user._id, 5, 'Welcome bonus credits');

  sendToken(user, 201, res);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new ApiError(400, 'Email and password are required.');

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  sendToken(user, 200, res);
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out successfully.' });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const credits = await CreditBalance.findOne({ userId: req.user._id });
  res.json({
    success: true,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      profileImage: user.profileImage,
      createdAt: user.createdAt,
    },
    credits: credits ? credits.balance : 0,
  });
});
