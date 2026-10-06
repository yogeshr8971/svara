import mongoose from 'mongoose';

const playgroundSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  selectedProducts: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    addedAt: { type: Date, default: Date.now },
  }],
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Playground', playgroundSchema);
