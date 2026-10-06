import Avatar from '../models/Avatar.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { validateAvatar } from '../services/avatarValidationService.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../services/cloudinaryService.js';
import { validateFileType } from '../utils/validateFileType.js';

export const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'Please upload an image file.');

  // Validate magic bytes
  const detectedType = validateFileType(req.file.buffer);
  if (!detectedType) throw new ApiError(400, 'Invalid file type. Only JPEG, PNG, and WEBP are allowed.');

  // AI validation
  const validation = await validateAvatar(req.file.buffer, detectedType);

  if (!validation.valid) {
    return res.status(400).json({
      success: false,
      validationFailed: true,
      validation,
      message: 'Photo validation failed.',
    });
  }

  // Deactivate previous avatar
  await Avatar.updateMany({ userId: req.user._id }, { isActive: false });

  // Upload to Cloudinary
  const result = await uploadToCloudinary(req.file.buffer, 'avatars', `avatar_${req.user._id}`);

  const avatar = await Avatar.create({
    userId: req.user._id,
    imageUrl: result.secure_url,
    publicId: result.public_id,
    thumbnailUrl: result.secure_url.replace('/upload/', '/upload/w_300,q_auto,f_auto/'),
    validationStatus: 'valid',
    validationConfidence: validation.confidence,
    validationReason: validation.reason,
    validationIssues: validation.issues,
    isActive: true,
  });

  res.status(201).json({ success: true, avatar, validation });
});

export const getAvatar = asyncHandler(async (req, res) => {
  const avatar = await Avatar.findOne({ userId: req.user._id, isActive: true }).sort({ createdAt: -1 });
  res.json({ success: true, avatar: avatar || null });
});

export const deleteAvatar = asyncHandler(async (req, res) => {
  const avatar = await Avatar.findOne({ userId: req.user._id, isActive: true });
  if (!avatar) throw new ApiError(404, 'No active avatar found.');

  if (avatar.publicId) await deleteFromCloudinary(avatar.publicId);
  await Avatar.findByIdAndUpdate(avatar._id, { isActive: false });

  res.json({ success: true, message: 'Avatar deleted.' });
});

export const updateAvatarImageUrl = asyncHandler(async (req, res) => {
  const { imageUrl } = req.body;
  if (!imageUrl) throw new ApiError(400, 'Image URL is required.');

  let avatar = await Avatar.findOne({ userId: req.user._id, isActive: true });
  if (avatar) {
    avatar.imageUrl = imageUrl;
    avatar.thumbnailUrl = imageUrl.replace('/upload/', '/upload/w_300,q_auto,f_auto/');
    await avatar.save();
  } else {
    avatar = await Avatar.create({
      userId: req.user._id,
      imageUrl,
      thumbnailUrl: imageUrl.replace('/upload/', '/upload/w_300,q_auto,f_auto/'),
      validationStatus: 'valid',
      isActive: true,
    });
  }

  res.json({ success: true, avatar, message: 'Avatar updated with new look.' });
});
