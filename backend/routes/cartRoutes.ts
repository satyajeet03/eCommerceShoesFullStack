import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { addToCart, getCart } from '../controllers/cartControllers';

const router = express.Router();

router.route('/').post(protect, addToCart); // Add to cart
router.route('/').get(protect, getCart); // Get cart items

export default router;
