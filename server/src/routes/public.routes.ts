import { Router } from 'express';
import {
  getPublicBootstrap,
  getSiteContent,
  getServices,
  getFaqs,
  getAvailability,
  createEnquiry,
} from '../controllers/public.controller';
import { enquiryRateLimiter, generalApiLimiter } from '../middleware/rateLimiter';

const router = Router();

router.get('/bootstrap', generalApiLimiter, getPublicBootstrap);

router.get('/site-content', generalApiLimiter, getSiteContent);
router.get('/services', generalApiLimiter, getServices);
router.get('/faqs', generalApiLimiter, getFaqs);
router.get('/availability', generalApiLimiter, getAvailability);
router.post('/enquiries', enquiryRateLimiter, createEnquiry);

export default router;
