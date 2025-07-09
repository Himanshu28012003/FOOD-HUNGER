import express from 'express';
import { getRestaurants, getRestaurant, addReview, getRandomRestaurants, addOrUpdateMenu } from '../controllers/restaurantController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getRestaurants);
router.get('/random', getRandomRestaurants);
router.get('/:id', getRestaurant);
router.post('/:id/reviews', authMiddleware, addReview);
router.post('/:id/menu', authMiddleware, addOrUpdateMenu);

export default router; 