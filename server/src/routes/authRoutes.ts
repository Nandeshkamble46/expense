import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController';
import protect from '../middleware/authMiddleware';

const router = Router();

/**
 * Auth Routes
 * POST /api/auth/register  - Register new user
 * POST /api/auth/login     - Login user
 * GET  /api/auth/me        - Get current user (protected)
 */
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

export default router;
