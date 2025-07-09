import express from 'express';
import { 
  makeReservation, 
  getUserReservations, 
  getCurrentUserReservations,
  updateReservation, 
  cancelReservation,
  getReservationById
} from '../controllers/reservationController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Create new reservation
router.post('/', makeReservation);

// Get current user's reservations
router.get('/me', getCurrentUserReservations);

// Get specific user's reservations (admin functionality)
router.get('/user/:userId', getUserReservations);

// Get specific reservation
router.get('/:id', getReservationById);

// Update reservation
router.patch('/:id', updateReservation);

// Cancel reservation
router.delete('/:id', cancelReservation);

export default router; 