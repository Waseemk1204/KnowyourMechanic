import express from 'express';
import {
    initiateService,
    verifyServiceOtp,
    completePayment,
    getPortfolio,
    getPendingServices,
    getMyServices
} from '../controllers/serviceController.js';
import { protect, garageOnly } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Garage-only routes
router.post('/initiate', garageOnly, initiateService);
router.post('/:id/verify', garageOnly, verifyServiceOtp);
router.post('/:id/complete-payment', garageOnly, completePayment);
router.get('/portfolio', garageOnly, getPortfolio);
router.get('/pending', garageOnly, getPendingServices);

// Customer routes
router.get('/my-services', getMyServices);

export default router;
