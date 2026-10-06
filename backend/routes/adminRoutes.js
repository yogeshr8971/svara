import express from 'express';
import {
  getDashboardStats, getUsers, getUser, updateUserRole,
  getVtoGenerations, getAdminTransactions,
  getAdminPackages, createPackage, updatePackage,
} from '../controllers/adminController.js';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/admin.js';

const router = express.Router();

router.use(protect, adminOnly);
router.get('/stats', getDashboardStats);
router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.patch('/users/:id/role', updateUserRole);
router.get('/vto', getVtoGenerations);
router.get('/transactions', getAdminTransactions);
router.get('/packages', getAdminPackages);
router.post('/packages', createPackage);
router.put('/packages/:id', updatePackage);

export default router;
