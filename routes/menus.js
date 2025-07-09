import express from 'express';
import { getMenu, addMenuReview } from '../controllers/menuController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/:restaurantId', getMenu);
router.post('/:restaurantId/items/:itemId/reviews', authMiddleware, addMenuReview);

export default router; 