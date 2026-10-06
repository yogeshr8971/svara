import Category from '../models/Category.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { uploadToCloudinary } from '../services/cloudinaryService.js';

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ active: true }).sort({ order: 1, name: 1 });
  res.json({ success: true, categories });
});

export const getCategory = asyncHandler(async (req, res) => {
  const cat = await Category.findOne({ slug: req.params.slug });
  if (!cat) throw new ApiError(404, 'Category not found.');
  res.json({ success: true, category: cat });
});

export const createCategory = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (req.file) {
    const result = await uploadToCloudinary(req.file.buffer, 'categories', 'cat');
    data.image = { url: result.secure_url, public_id: result.public_id };
  }
  const category = await Category.create(data);
  res.status(201).json({ success: true, category });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (req.file) {
    const result = await uploadToCloudinary(req.file.buffer, 'categories', 'cat');
    data.image = { url: result.secure_url, public_id: result.public_id };
  }
  const category = await Category.findByIdAndUpdate(req.params.id, data, { new: true });
  if (!category) throw new ApiError(404, 'Category not found.');
  res.json({ success: true, category });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) throw new ApiError(404, 'Category not found.');
  res.json({ success: true, message: 'Category deleted.' });
});
