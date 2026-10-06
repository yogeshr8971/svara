import mongoose from 'mongoose';

const creditTransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  type: {
    type: String,
    enum: ['PURCHASE', 'TRY_ON', 'REFUND', 'BONUS', 'ADMIN_ADJUSTMENT'],
    required: true,
  },
  description: { type: String },
  referenceId: { type: String },
  balanceAfter: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

creditTransactionSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('CreditTransaction', creditTransactionSchema);
