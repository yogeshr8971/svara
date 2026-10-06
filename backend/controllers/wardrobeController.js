import Wardrobe from '../models/Wardrobe.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { deleteFromCloudinary } from '../services/cloudinaryService.js';

export const getWardrobe = asyncHandler(async (req, res) => {
  const { favorite } = req.query;
  const filter = { userId: req.user._id };
  if (favorite === 'true') filter.favorite = true;

  const wardrobe = await Wardrobe.find(filter)
    .populate('productId', 'name price images slug')
    .sort({ createdAt: -1 });
  res.json({ success: true, wardrobe });
});

export const getWardrobeItem = asyncHandler(async (req, res) => {
  const item = await Wardrobe.findOne({ _id: req.params.id, userId: req.user._id })
    .populate('productId', 'name price images slug')
    .populate('avatarId', 'imageUrl thumbnailUrl');
  if (!item) throw new ApiError(404, 'Wardrobe item not found.');
  res.json({ success: true, item });
});

export const deleteWardrobeItem = asyncHandler(async (req, res) => {
  const item = await Wardrobe.findOne({ _id: req.params.id, userId: req.user._id });
  if (!item) throw new ApiError(404, 'Wardrobe item not found.');
  if (item.publicId) await deleteFromCloudinary(item.publicId);
  await item.deleteOne();
  res.json({ success: true, message: 'Wardrobe item deleted.' });
});

export const toggleFavorite = asyncHandler(async (req, res) => {
  const item = await Wardrobe.findOne({ _id: req.params.id, userId: req.user._id });
  if (!item) throw new ApiError(404, 'Wardrobe item not found.');
  item.favorite = !item.favorite;
  await item.save();
  res.json({ success: true, item });
});
