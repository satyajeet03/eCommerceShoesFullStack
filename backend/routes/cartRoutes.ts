import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { addToCart, getCart, updateCartQuantity } from '../controllers/cartControllers';

const router = express.Router();

router.route('/').post(protect, addToCart); // Add to cart
router.route('/').get(protect, getCart); // Get cart items
router.route('/update').put(protect, updateCartQuantity); // Update cart item quantity

export default router;
