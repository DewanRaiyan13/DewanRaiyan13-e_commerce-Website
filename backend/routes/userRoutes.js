import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  changePassword,
  addAddress,
  deleteAddress,
  toggleWishlist,
  getAdminUsers,
  updateUserRole,
  deleteUser,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.put('/password', protect, changePassword);
router.post('/addresses', protect, addAddress);
router.delete('/addresses/:id', protect, deleteAddress);
router.put('/wishlist/:productId', protect, toggleWishlist);

// Admin
router.get('/admin/all', protect, admin, getAdminUsers);
router.put('/admin/:id/role', protect, admin, updateUserRole);
router.delete('/admin/:id', protect, admin, deleteUser);

export default router;
