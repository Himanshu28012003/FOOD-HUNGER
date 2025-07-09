import express from 'express';
import { getUserPreferences, updateUserPreferences, getRecommendations } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/preferences', authMiddleware, getUserPreferences);
router.put('/preferences', authMiddleware, updateUserPreferences);
router.get('/recommendations', authMiddleware, getRecommendations);

export default router; 