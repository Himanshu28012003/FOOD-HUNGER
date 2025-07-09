import express from 'express';
import { 
  createOrder, 
  getUserOrders, 
  getOrderById, 
  updateOrderStatus, 
  cancelOrder 
} from '../controllers/orderController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Create new order
router.post('/', createOrder);

// Get user's orders
router.get('/user', getUserOrders);

// Get specific order
router.get('/:id', getOrderById);

// Update order status (for restaurant staff)
router.put('/:id/status', updateOrderStatus);

// Cancel order
router.post('/:id/cancel', cancelOrder);

export default router; 