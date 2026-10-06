import mongoose from 'mongoose';

const avatarSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  imageUrl: { type: String, required: true },
  publicId: { type: String },
  thumbnailUrl: { type: String },
  validationStatus: { type: String, enum: ['pending', 'valid', 'invalid'], default: 'pending' },
  validationConfidence: { type: Number },
  validationReason: { type: String },
  validationIssues: [{ type: String }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

avatarSchema.index({ userId: 1, isActive: 1 });

export default mongoose.model('Avatar', avatarSchema);
