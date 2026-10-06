import { ApiError } from '../utils/apiError.js';

export const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    throw new ApiError(403, 'Access denied. Admin only.');
  }
  next();
};
