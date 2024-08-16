import express, { Router } from 'express';
import { getShoes, createShoe, getShoeById } from '../controllers/shoeController';
import { admin, protect } from '../middleware/authMiddleware';

const router: Router = express.Router();

// router.route('/').get(getShoes).post(createShoe);
router.route('/').get(getShoes);

// Admin-only route to create a new shoe
router.route('/').post(protect, admin, createShoe);

router.route('/:id').get(getShoeById);

export default router;
