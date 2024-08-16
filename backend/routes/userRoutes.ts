import express from 'express';
import { authUser, registerUser, getUserProfile, createAdminUser } from '../controllers/userController';
import { admin, protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/login', authUser);
router.route('/profile').get(protect, getUserProfile);
router.post('/register', registerUser); // Changed route to /register
router.post('/admin', protect, admin, createAdminUser);

export default router;
