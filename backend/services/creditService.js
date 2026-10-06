import CreditBalance from '../models/CreditBalance.js';
import CreditTransaction from '../models/CreditTransaction.js';
import { ApiError } from '../utils/apiError.js';

/**
 * Reserve credits before AI call.
 * Atomically decrements balance and increments reservedBalance.
 */
export const reserveCredits = async (userId, amount) => {
  const updated = await CreditBalance.findOneAndUpdate(
    { userId, balance: { $gte: amount } },
    { $inc: { balance: -amount, reservedBalance: amount }, $set: { updatedAt: new Date() } },
    { new: true }
  );
  if (!updated) {
    const current = await CreditBalance.findOne({ userId });
    const available = current ? current.balance : 0;
    throw new ApiError(402, `Insufficient credits. You have ${available} credit(s), need ${amount}.`);
  }
  return updated;
};

/**
 * Consume reserved credits after successful AI generation.
 */
export const consumeReservedCredits = async (userId, amount, description, referenceId) => {
  const balance = await CreditBalance.findOneAndUpdate(
    { userId },
    { $inc: { reservedBalance: -amount }, $set: { updatedAt: new Date() } },
    { new: true }
  );
  await CreditTransaction.create({
    userId,
    amount: -amount,
    type: 'TRY_ON',
    description,
    referenceId,
    balanceAfter: balance.balance,
  });
};

/**
 * Refund reserved credits if AI generation fails.
 */
export const refundReservedCredits = async (userId, amount, description, referenceId) => {
  const balance = await CreditBalance.findOneAndUpdate(
    { userId },
    { $inc: { balance: amount, reservedBalance: -amount }, $set: { updatedAt: new Date() } },
    { new: true }
  );
  await CreditTransaction.create({
    userId,
    amount,
    type: 'REFUND',
    description,
    referenceId,
    balanceAfter: balance ? balance.balance : 0,
  });
};

/**
 * Add credits to a user's balance (after purchase or bonus).
 */
export const addCredits = async (userId, amount, description, referenceId) => {
  const balance = await CreditBalance.findOneAndUpdate(
    { userId },
    { $inc: { balance: amount }, $set: { updatedAt: new Date() } },
    { upsert: true, new: true }
  );
  await CreditTransaction.create({
    userId,
    amount,
    type: 'PURCHASE',
    description,
    referenceId,
    balanceAfter: balance.balance,
  });
  return balance;
};

/**
 * Add bonus credits (e.g. welcome bonus).
 */
export const addBonusCredits = async (userId, amount, description) => {
  const balance = await CreditBalance.findOneAndUpdate(
    { userId },
    { $inc: { balance: amount }, $set: { updatedAt: new Date() } },
    { upsert: true, new: true }
  );
  await CreditTransaction.create({
    userId,
    amount,
    type: 'BONUS',
    description,
    balanceAfter: balance.balance,
  });
  return balance;
};

/**
 * Get current credit balance for a user.
 */
export const getBalance = async (userId) => {
  const bal = await CreditBalance.findOne({ userId });
  return bal || { balance: 0, reservedBalance: 0 };
};
