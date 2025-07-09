import express from 'express';
import { 
  createPaymentIntent, 
  confirmPayment, 
  getPaymentStatus, 
  refundPayment 
} from '../controllers/paymentController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Create payment intent
router.post('/create-payment-intent', createPaymentIntent);

// Confirm payment
router.post('/confirm-payment', confirmPayment);

// Get payment status
router.get('/status/:orderId', getPaymentStatus);

// Refund payment
router.post('/refund/:orderId', refundPayment);

export default router; 