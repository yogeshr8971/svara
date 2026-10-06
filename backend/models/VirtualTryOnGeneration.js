import mongoose from 'mongoose';

const vtoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  avatarId: { type: mongoose.Schema.Types.ObjectId, ref: 'Avatar' },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  status: { type: String, enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'], default: 'PENDING' },
  resultType: { type: String, enum: ['image', 'style_description'], default: 'style_description' },
  resultImageUrl: { type: String },
  resultPublicId: { type: String },
  // For text-mode (Gemini free): stores the AI style analysis JSON
  styleData: { type: mongoose.Schema.Types.Mixed },
  provider: { type: String },
  providerGenerationId: { type: String },
  creditCost: { type: Number, default: 1 },
  creditReserved: { type: Boolean, default: false },
  creditConsumed: { type: Boolean, default: false },
  errorMessage: { type: String },
  processingStartedAt: { type: Date },
  completedAt: { type: Date },
}, { timestamps: true });

vtoSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('VirtualTryOnGeneration', vtoSchema);

