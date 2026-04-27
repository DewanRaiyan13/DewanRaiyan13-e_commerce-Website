import express from 'express';
import {
  getProducts,
  getProductBySlug,
  getFeaturedProducts,
  addReview,
  createProduct,
  updateProduct,
  deleteProduct,
  getAdminProducts,
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:slug', getProductBySlug);
router.post('/:id/reviews', protect, addReview);

// Admin routes
router.get('/admin/all', protect, admin, getAdminProducts);
router.post('/admin', protect, admin, createProduct);
router.put('/admin/:id', protect, admin, updateProduct);
router.delete('/admin/:id', protect, admin, deleteProduct);

export default router;
