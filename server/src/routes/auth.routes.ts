import { Router } from 'express';
import {
  login,
  googleAdminLogin,
  logout,
  getMe,
  googleUserLogin,
  customerDirectLogin,
  getCustomerMe,
  getCustomerEnquiries,
  submitCustomerReview,
  getCustomerReview,
  deleteCustomerReview,
} from '../controllers/auth.controller';
import { loginRateLimiter } from '../middleware/rateLimiter';
import { requireAdminAuth, requireCustomerAuth } from '../middleware/auth';
import {
  customerLoginRateLimiter,
  customerApiRateLimiter,
  requireCustomerApiProtection,
} from '../middleware/apiProtection';

const router = Router();

// Admin Authentication Endpoints
router.post('/login', loginRateLimiter, login);
router.post('/google/admin', loginRateLimiter, googleAdminLogin);
router.post('/logout', logout);
router.get('/me', requireAdminAuth, getMe);

// Public Customer / Borrower Authentication Endpoints (Google SSO & Direct Access)
router.post('/google/user', customerLoginRateLimiter, googleUserLogin);
router.post('/customer/login', customerLoginRateLimiter, customerDirectLogin);

// Protected Customer Portal Operations (Rate-Limited, Cryptographically Signed & Anti-Replay Protected)
router.use('/customer', customerApiRateLimiter);
router.use('/customer', requireCustomerApiProtection);

router.get('/customer/me', requireCustomerAuth, getCustomerMe);
router.get('/customer/enquiries', requireCustomerAuth, getCustomerEnquiries);
router.post('/customer/review', requireCustomerAuth, submitCustomerReview);
router.get('/customer/review', requireCustomerAuth, getCustomerReview);
router.delete('/customer/review', requireCustomerAuth, deleteCustomerReview);

export default router;
