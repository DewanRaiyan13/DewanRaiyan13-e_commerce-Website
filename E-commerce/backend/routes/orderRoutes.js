import express from 'express';
import {
  createOrder,
  getOrderById,
  getMyOrders,
  payOrder,
  getAdminOrders,
  updateOrderStatus,
  getAnalytics,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/my', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/pay', protect, payOrder);

// Admin
router.get('/admin/all', protect, admin, getAdminOrders);
router.put('/admin/:id/status', protect, admin, updateOrderStatus);
router.get('/admin/analytics', protect, admin, getAnalytics);

export default router;
