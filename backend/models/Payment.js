import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  creditPackageId: { type: mongoose.Schema.Types.ObjectId, ref: 'CreditPackage' },
  razorpayOrderId: { type: String, required: true, unique: true },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
  amountInPaise: { type: Number },
  credits: { type: Number },
  status: { type: String, enum: ['created', 'paid', 'failed'], default: 'created' },
  verifiedAt: { type: Date },
}, { timestamps: true });

export default mongoose.model('Payment', paymentSchema);
