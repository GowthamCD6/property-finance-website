import { Router } from 'express';
import { login, logout, getMe } from '../controllers/auth.controller';
import { loginRateLimiter } from '../middleware/rateLimiter';
import { requireAdminAuth } from '../middleware/auth';

const router = Router();

router.post('/login', loginRateLimiter, login);
router.post('/logout', logout);
router.get('/me', requireAdminAuth, getMe);

export default router;
