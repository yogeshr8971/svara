import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { generateSlug } from '../utils/generateSlug.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../services/cloudinaryService.js';
import { getRecommendations } from '../services/recommendationService.js';

export const getProducts = asyncHandler(async (req, res) => {
  const {
    page = 1, limit = 12, category, minPrice, maxPrice,
    size, color, featured, trending, search, sort,
  } = req.query;

  const filter = {};
  if (category) {
    const cat = await Category.findOne({ slug: category });
    if (cat) filter.category = cat._id;
  }
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }
  if (size) filter.sizes = size;
  if (color) filter['colors.name'] = { $regex: color, $options: 'i' };
  if (featured === 'true') filter.featured = true;
  if (trending === 'true') filter.trending = true;
  if (search) filter.$or = [
    { name: { $regex: search, $options: 'i' } },
    { description: { $regex: search, $options: 'i' } },
    { tags: { $regex: search, $options: 'i' } },
  ];

  const sortOptions = {
    newest: { createdAt: -1 },
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    popular: { 'ratings.count': -1, trending: -1 },
  };
  const sortBy = sortOptions[sort] || { createdAt: -1 };

  const skip = (Number(page) - 1) * Number(limit);
  const [products, total] = await Promise.all([
    Product.find(filter).populate('category', 'name slug').sort(sortBy).skip(skip).limit(Number(limit)),
    Product.countDocuments(filter),
  ]);

  res.json({
    success: true,
    products,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
  });
});

export const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findOne(
    id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { slug: id }
  ).populate('category', 'name slug');
  if (!product) throw new ApiError(404, 'Product not found.');

  const recommendations = await getRecommendations(product._id, product.category?._id);
  res.json({ success: true, product, recommendations });
});

export const createProduct = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (!data.name || !data.price) throw new ApiError(400, 'Name and price are required.');

  data.slug = generateSlug(data.name);
  if (data.colors && typeof data.colors === 'string') data.colors = JSON.parse(data.colors);
  if (data.sizes && typeof data.sizes === 'string') data.sizes = JSON.parse(data.sizes);
  if (data.careInstructions && typeof data.careInstructions === 'string')
    data.careInstructions = JSON.parse(data.careInstructions);

  // Handle image uploads via Cloudinary
  const images = [];
  if (req.files?.images) {
    for (const file of req.files.images) {
      const result = await uploadToCloudinary(file.buffer, 'products', 'prod');
      images.push({ url: result.secure_url, public_id: result.public_id, alt: data.name });
    }
  } else if (data.imageUrl) {
    images.push({ url: data.imageUrl, alt: data.name, public_id: '' });
  }
  if (images.length) data.images = images;

  if (req.files?.tryOnImage?.[0]) {
    const result = await uploadToCloudinary(req.files.tryOnImage[0].buffer, 'garments', 'garm');
    data.tryOnImage = { url: result.secure_url, public_id: result.public_id };
  } else if (data.tryOnImageUrl) {
    data.tryOnImage = { url: data.tryOnImageUrl, public_id: '' };
  } else if (images.length) {
    data.tryOnImage = { url: images[0].url, public_id: images[0].public_id || '' };
  }

  const product = await Product.create(data);
  res.status(201).json({ success: true, product });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found.');

  const data = { ...req.body };
  if (data.colors && typeof data.colors === 'string') data.colors = JSON.parse(data.colors);
  if (data.sizes && typeof data.sizes === 'string') data.sizes = JSON.parse(data.sizes);

  if (req.files?.images) {
    const images = [];
    for (const file of req.files.images) {
      const result = await uploadToCloudinary(file.buffer, 'products', 'prod');
      images.push({ url: result.secure_url, public_id: result.public_id, alt: data.name || product.name });
    }
    data.images = images;
  }

  if (req.files?.tryOnImage?.[0]) {
    if (product.tryOnImage?.public_id) await deleteFromCloudinary(product.tryOnImage.public_id);
    const result = await uploadToCloudinary(req.files.tryOnImage[0].buffer, 'garments', 'garm');
    data.tryOnImage = { url: result.secure_url, public_id: result.public_id };
  }

  const updated = await Product.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
  res.json({ success: true, product: updated });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found.');

  // Clean up Cloudinary assets
  for (const img of product.images) {
    if (img.public_id) await deleteFromCloudinary(img.public_id);
  }
  if (product.tryOnImage?.public_id) await deleteFromCloudinary(product.tryOnImage.public_id);

  await product.deleteOne();
  res.json({ success: true, message: 'Product deleted.' });
});

export const searchProducts = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q || q.length < 2) return res.json({ success: true, products: [] });

  const products = await Product.find({
    $or: [
      { name: { $regex: q, $options: 'i' } },
      { tags: { $regex: q, $options: 'i' } },
    ],
  })
    .populate('category', 'name slug')
    .limit(10)
    .select('name slug price images category trending');

  res.json({ success: true, products });
});
