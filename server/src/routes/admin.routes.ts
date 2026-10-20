import { Router } from 'express';
import { requireAdminAuth } from '../middleware/auth';
import {
  getDashboardStats,
  getEnquiries,
  getEnquiryById,
  updateEnquiryStatus,
  addEnquiryNote,
  exportEnquiriesCsv,
  getAppointments,
  updateAppointment,
  updateSiteContent,
  getAdminServices,
  createService,
  updateService,
  deleteService,
  getAdminFaqs,
  createFaq,
  updateFaq,
  deleteFaq,
  getAvailabilitySettings,
  updateWeeklyConfig,
  blockDate,
  unblockDate,
} from '../controllers/admin.controller';

const router = Router();

// Protect all admin endpoints with requireAdminAuth
router.use(requireAdminAuth);

// Dashboard
router.get('/dashboard-stats', getDashboardStats);

// Enquiries
router.get('/enquiries', getEnquiries);
router.get('/enquiries/export', exportEnquiriesCsv);
router.get('/enquiries/:id', getEnquiryById);
router.patch('/enquiries/:id/status', updateEnquiryStatus);
router.post('/enquiries/:id/notes', addEnquiryNote);

// Appointments
router.get('/appointments', getAppointments);
router.patch('/appointments/:id', updateAppointment);

// Content Management
router.put('/content', updateSiteContent);

// Services CRUD
router.get('/services', getAdminServices);
router.post('/services', createService);
router.put('/services/:id', updateService);
router.delete('/services/:id', deleteService);

// FAQs CRUD
router.get('/faqs', getAdminFaqs);
router.post('/faqs', createFaq);
router.put('/faqs/:id', updateFaq);
router.delete('/faqs/:id', deleteFaq);

// Availability & Schedule Management
router.get('/availability', getAvailabilitySettings);
router.put('/availability/weekly/:id', updateWeeklyConfig);
router.post('/availability/block-date', blockDate);
router.delete('/availability/block-date/:date', unblockDate);

export default router;
