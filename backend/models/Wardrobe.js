import mongoose from 'mongoose';

const wardrobeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  avatarId: { type: mongoose.Schema.Types.ObjectId, ref: 'Avatar' },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  // For image-mode providers (FASHN, Fal); optional when using text-mode (Gemini free)
  generatedImageUrl: { type: String },
  publicId: { type: String },
  provider: { type: String },
  resultType: { type: String, enum: ['image', 'style_description'], default: 'style_description' },
  // For Gemini free-tier text-mode results
  styleDescription: { type: String },
  styleData: { type: mongoose.Schema.Types.Mixed },
  generationId: { type: mongoose.Schema.Types.ObjectId, ref: 'VirtualTryOnGeneration' },
  favorite: { type: Boolean, default: false },
  productSnapshot: { name: String, image: String, price: Number },
}, { timestamps: true });

wardrobeSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('Wardrobe', wardrobeSchema);
