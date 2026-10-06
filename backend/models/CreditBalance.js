import mongoose from 'mongoose';

const creditBalanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  balance: { type: Number, default: 0, min: 0 },
  reservedBalance: { type: Number, default: 0, min: 0 },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('CreditBalance', creditBalanceSchema);
