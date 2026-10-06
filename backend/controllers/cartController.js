import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';

export const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId', 'name images price stock');
  res.json({ success: true, cart: cart || { userId: req.user._id, items: [] } });
});

export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1, size, color } = req.body;
  if (!productId) throw new ApiError(400, 'Product ID is required.');

  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, 'Product not found.');
  if (product.stock < 1) throw new ApiError(400, 'Product is out of stock.');

  let cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) cart = new Cart({ userId: req.user._id, items: [] });

  const existingIndex = cart.items.findIndex(
    (i) => i.productId.toString() === productId && i.size === size && i.color === color
  );

  if (existingIndex > -1) {
    cart.items[existingIndex].quantity += quantity;
  } else {
    cart.items.push({
      productId,
      name: product.name,
      image: product.images[0]?.url || '',
      price: product.price,
      size: size || '',
      color: color || '',
      quantity,
    });
  }
  cart.updatedAt = new Date();
  await cart.save();
  res.json({ success: true, cart });
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  if (!quantity || quantity < 1) throw new ApiError(400, 'Quantity must be at least 1.');

  const cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) throw new ApiError(404, 'Cart not found.');

  const item = cart.items.id(req.params.itemId);
  if (!item) throw new ApiError(404, 'Cart item not found.');

  item.quantity = quantity;
  cart.updatedAt = new Date();
  await cart.save();
  res.json({ success: true, cart });
});

export const removeCartItem = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) throw new ApiError(404, 'Cart not found.');

  cart.items = cart.items.filter((i) => i._id.toString() !== req.params.itemId);
  cart.updatedAt = new Date();
  await cart.save();
  res.json({ success: true, cart });
});

export const clearCart = asyncHandler(async (req, res) => {
  await Cart.findOneAndUpdate({ userId: req.user._id }, { items: [], updatedAt: new Date() });
  res.json({ success: true, message: 'Cart cleared.' });
});
