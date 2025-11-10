import express from 'express';
import { createPaymentIntent, getStripeConfig, confirmPayment } from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/create-payment-intent', protect, createPaymentIntent);
router.post('/confirm-payment', protect, confirmPayment);
router.get('/config', getStripeConfig);

export default router;
