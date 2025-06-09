import express from 'express';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller';

import { authenticate } from '../middleware/authMiddleware';
import { authorizeRoles } from '../middleware/roleMiddleware';

const router = express.Router();

// Public: View products
router.get('/', authenticate, getProducts);

// Admin only: create, update, delete
router.post('/', authenticate, authorizeRoles('admin'), createProduct);
router.put('/:id', authenticate, authorizeRoles('admin'), updateProduct);
router.delete('/:id', authenticate, authorizeRoles('admin'), deleteProduct);

export default router;
