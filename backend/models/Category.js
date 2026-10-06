import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  image: { url: String, public_id: String },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  active: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Category', categorySchema);
