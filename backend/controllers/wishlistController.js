import Wishlist from '../models/Wishlist.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';

export const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ userId: req.user._id }).populate(
    'products', 'name slug price compareAtPrice images trending featured'
  );
  res.json({ success: true, wishlist: wishlist || { products: [] } });
});

export const toggleWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  if (!productId) throw new ApiError(400, 'Product ID is required.');

  let wishlist = await Wishlist.findOne({ userId: req.user._id });
  if (!wishlist) wishlist = new Wishlist({ userId: req.user._id, products: [] });

  const index = wishlist.products.indexOf(productId);
  let action;
  if (index > -1) {
    wishlist.products.splice(index, 1);
    action = 'removed';
  } else {
    wishlist.products.push(productId);
    action = 'added';
  }
  await wishlist.save();
  res.json({ success: true, action, wishlist });
});

export const removeFromWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOneAndUpdate(
    { userId: req.user._id },
    { $pull: { products: req.params.productId } },
    { new: true }
  );
  res.json({ success: true, wishlist });
});
