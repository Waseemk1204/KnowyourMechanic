import express from 'express';
import { sendOtp, verifyOtp, firebaseLogin, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/firebase-login', firebaseLogin);

// Protected routes
router.get('/me', protect, getMe);

export default router;
