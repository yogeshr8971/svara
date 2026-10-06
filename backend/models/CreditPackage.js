import mongoose from 'mongoose';

const creditPackageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  credits: { type: Number, required: true },
  priceInPaise: { type: Number, required: true },
  description: { type: String },
  popular: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('CreditPackage', creditPackageSchema);
