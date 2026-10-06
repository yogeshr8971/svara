import Playground from '../models/Playground.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';

export const getPlayground = asyncHandler(async (req, res) => {
  const playground = await Playground.findOne({ userId: req.user._id }).populate(
    'selectedProducts.productId',
    'name slug price images tryOnImage category'
  );
  res.json({ success: true, playground: playground || { selectedProducts: [] } });
});

export const addProductToPlayground = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  if (!productId) throw new ApiError(400, 'Product ID is required.');

  let playground = await Playground.findOne({ userId: req.user._id });
  if (!playground) playground = new Playground({ userId: req.user._id, selectedProducts: [] });

  const exists = playground.selectedProducts.some((p) => p.productId.toString() === productId);
  if (!exists) {
    if (playground.selectedProducts.length >= 10) throw new ApiError(400, 'Playground can hold up to 10 products.');
    playground.selectedProducts.push({ productId });
    playground.updatedAt = new Date();
    await playground.save();
  }

  res.json({ success: true, playground });
});

export const removeProductFromPlayground = asyncHandler(async (req, res) => {
  const playground = await Playground.findOneAndUpdate(
    { userId: req.user._id },
    { $pull: { selectedProducts: { productId: req.params.productId } }, $set: { updatedAt: new Date() } },
    { new: true }
  );
  res.json({ success: true, playground });
});
