import { Router } from 'express';
import { generateContent } from '../controllers/ai.controller';
import { requireAuth } from '../../middlewares/auth.middleware';
import { aiRateLimiter } from '../../middlewares/rateLimiter.middleware';

const router = Router();

// Protect AI routes in production
router.post('/generate', requireAuth, aiRateLimiter, generateContent);

export default router;
