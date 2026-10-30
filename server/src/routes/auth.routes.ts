import { Router } from 'express';
import {
  login,
  googleAdminLogin,
  logout,
  getMe,
  googleUserLogin,
  getCustomerMe,
  getCustomerEnquiries,
} from '../controllers/auth.controller';
import { loginRateLimiter } from '../middleware/rateLimiter';
import { requireAdminAuth, requireCustomerAuth } from '../middleware/auth';

const router = Router();

// Admin Authentication Endpoints
router.post('/login', loginRateLimiter, login);
router.post('/google/admin', loginRateLimiter, googleAdminLogin);
router.post('/logout', logout);
router.get('/me', requireAdminAuth, getMe);

// Public Customer / Borrower Authentication Endpoints (Google SSO)
router.post('/google/user', googleUserLogin);
router.get('/customer/me', requireCustomerAuth, getCustomerMe);
router.get('/customer/enquiries', requireCustomerAuth, getCustomerEnquiries);

export default router;
