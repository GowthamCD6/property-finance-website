import { Router } from 'express';
import { resolveOptionalAuth } from '../middleware/auth';
import { documentUploadMiddleware } from '../middleware/upload';
import {
  uploadEnquiryDocument,
  getEnquiryDocuments,
  getDocumentPreviewUrl,
  deleteEnquiryDocument,
} from '../controllers/document.controller';
import { generalApiLimiter } from '../middleware/rateLimiter';

const router = Router();

// Apply general API rate limiter & optional auth resolver to populate req.admin / req.customer
router.use(generalApiLimiter);
router.use(resolveOptionalAuth);

// Upload document(s) for an enquiry
router.post(
  '/upload',
  documentUploadMiddleware.fields([
    { name: 'file', maxCount: 1 },
    { name: 'files', maxCount: 5 },
  ]),
  uploadEnquiryDocument
);

// Retrieve all documents for an enquiry
router.get('/enquiry/:enquiryId', getEnquiryDocuments);

// Generate short-lived signed preview URL
router.get('/:documentId/preview', getDocumentPreviewUrl);

// Delete document from Cloudinary and database
router.delete('/:documentId', deleteEnquiryDocument);

export default router;
