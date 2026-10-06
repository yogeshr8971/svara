import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Product name is required'], trim: true },
  slug: { type: String, unique: true },
  description: { type: String },
  shortDescription: { type: String },
  price: { type: Number, required: [true, 'Price is required'], min: 0 },
  compareAtPrice: { type: Number },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  subcategory: { type: String },
  images: [{
    url: { type: String, required: true },
    alt: { type: String, default: '' },
    public_id: { type: String, default: '' },
  }],
  tryOnImage: {
    url: { type: String },
    public_id: { type: String },
  },
  colors: [{ name: String, hex: String }],
  sizes: [{ type: String }],
  stock: { type: Number, default: 0, min: 0 },
  brand: { type: String, default: 'SVARA' },
  material: { type: String },
  careInstructions: [{ type: String }],
  featured: { type: Boolean, default: false },
  trending: { type: Boolean, default: false },
  tags: [{ type: String }],
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
  },
}, { timestamps: true });

productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, featured: 1, trending: 1, price: 1 });

export default mongoose.model('Product', productSchema);
