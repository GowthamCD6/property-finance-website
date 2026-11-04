import dotenv from 'dotenv';
dotenv.config();
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../app';
import prisma from '../database/client';
import { config } from '../config';

const testAdminEmail = 'automated_test_admin@primeassociatesloans.in';
const testAdminPassword = 'TestPassword@123456';

describe('Property Loan Consultancy System Tests', { timeout: 30000 }, () => {
  let adminToken: string = '';
  let testEnquiryId: string = '';
  let testEnquiryReference: string = '';
  let originalHeroHeadline: string = '';

  beforeAll(async () => {
    // Ensure isolated test admin exists with known credentials
    const passwordHash = await bcrypt.hash(testAdminPassword, 10);
    await prisma.adminUser.upsert({
      where: { email: testAdminEmail },
      update: { passwordHash, isActive: true, role: 'superadmin' },
      create: {
        email: testAdminEmail,
        passwordHash,
        name: 'Automated Test Admin',
        role: 'superadmin',
        phone: '9999999999',
        isActive: true,
      },
    });

    const currentContent = await prisma.siteContent.findUnique({ where: { id: 'default_content' } });
    if (currentContent?.heroHeadline) {
      originalHeroHeadline = currentContent.heroHeadline;
    }
  });

  afterAll(async () => {
    // Clean up test data
    try {
      if (testEnquiryReference) {
        await prisma.statusHistory.deleteMany({ where: { enquiryId: testEnquiryId } });
        await prisma.appointment.deleteMany({ where: { enquiryId: testEnquiryId } });
        await prisma.enquiry.deleteMany({ where: { referenceNumber: testEnquiryReference } });
      }
      if (originalHeroHeadline) {
        await prisma.siteContent.update({
          where: { id: 'default_content' },
          data: { heroHeadline: originalHeroHeadline },
        });
      }
      await prisma.adminUser.deleteMany({ where: { email: testAdminEmail } });
    } catch (e) {
      console.warn('Test cleanup warning:', e);
    } finally {
      await prisma.$disconnect();
    }
  });

  const getAdminHeaders = () => ({
    Authorization: `Bearer ${adminToken}`,
    'x-admin-api-key': config.adminApiKey,
  });

  describe('Public API Endpoints', () => {
    it('GET /api/public/site-content returns published site information', async () => {
      const res = await request(app).get('/api/public/site-content');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.businessName).toMatch(/Prime Associates|WealthAnchor/);
      expect(res.body.data.cityState).toBeDefined();
    });

    it('GET /api/public/services returns active services list', async () => {
      const res = await request(app).get('/api/public/services');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(4);
    });

    it('GET /api/public/faqs returns published FAQs', async () => {
      const res = await request(app).get('/api/public/faqs');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(5);
    });

    it('GET /api/public/availability returns available consultation schedule', async () => {
      const res = await request(app).get('/api/public/availability');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.schedule).toBeDefined();
    });

    it('POST /api/public/enquiries rejects invalid or incomplete submissions', async () => {
      const res = await request(app).post('/api/public/enquiries').send({
        fullName: 'A', // too short
        mobileNumber: '123', // invalid phone
      });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
    });

    it('POST /api/public/enquiries successfully persists a valid enquiry and schedules requested appointment', async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 2);
      const testDate = tomorrow.toISOString().split('T')[0];

      const res = await request(app)
        .post('/api/public/enquiries')
        .send({
          fullName: 'Ananya Sharma',
          mobileNumber: '+91 98765 11223',
          email: 'ananya.sharma@example.com',
          preferredContactMethod: 'phone',
          cityState: 'Bengaluru, Karnataka',
          loanType: 'Home Loan',
          loanAmount: 5000000,
          propertyType: 'residential',
          propertyLocation: 'Indiranagar, Bengaluru',
          propertyOwnershipStatus: 'purchasing',
          employmentType: 'salaried',
          preferredDate: testDate,
          preferredTimeSlot: '11:30 AM - 12:30 PM',
          meetingMode: 'video',
          additionalNotes: 'Need preliminary eligibility verification before token payment.',
          consentGiven: true,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.referenceNumber).toMatch(/^VPF-\d{4}-\d+/);
      expect(res.body.data.appointmentStatus).toBe('Requested');

      testEnquiryReference = res.body.data.referenceNumber;

      // Verify database record
      const dbRecord = await prisma.enquiry.findUnique({
        where: { referenceNumber: testEnquiryReference },
      });
      expect(dbRecord).not.toBeNull();
      expect(dbRecord?.fullName).toBe('Ananya Sharma');
      testEnquiryId = dbRecord!.id;
    });
  });

  describe('Admin Authentication & Security', () => {
    it('Protected endpoints reject unauthenticated requests with 401 or 403', async () => {
      const res = await request(app).get('/api/admin/dashboard-stats');
      expect([401, 403]).toContain(res.status);
      expect(res.body.success).toBe(false);
    });

    it('POST /api/auth/login rejects incorrect password with generic message', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: testAdminEmail,
        password: 'WrongPassword@123',
      });
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Invalid registered mobile number or password|Invalid email address or password/);
    });

    it('POST /api/auth/login authenticates valid admin and returns JWT token', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: testAdminEmail,
        password: testAdminPassword,
      });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.admin.email).toBe(testAdminEmail);

      adminToken = res.body.data.token;
    });

    it('GET /api/auth/me returns current authenticated administrator profile', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set(getAdminHeaders());
      expect(res.status).toBe(200);
      expect(res.body.data.email).toBe(testAdminEmail);
    });
  });

  describe('Admin Portal Management', () => {
    it('GET /api/admin/dashboard-stats returns calculated live metrics', async () => {
      const res = await request(app)
        .get('/api/admin/dashboard-stats')
        .set(getAdminHeaders());
      expect(res.status).toBe(200);
      expect(res.body.data.totalEnquiries).toBeGreaterThanOrEqual(1);
      expect(res.body.data.recentEnquiries).toBeDefined();
    });

    it('GET /api/admin/enquiries supports search, filtering, and pagination', async () => {
      const res = await request(app)
        .get(`/api/admin/enquiries?search=${encodeURIComponent('Ananya')}`)
        .set(getAdminHeaders());
      expect(res.status).toBe(200);
      expect(res.body.data.enquiries.length).toBeGreaterThanOrEqual(1);
      expect(res.body.data.enquiries[0].referenceNumber).toBe(testEnquiryReference);
    });

    it('PATCH /api/admin/enquiries/:id/status updates status and logs audit history', async () => {
      const res = await request(app)
        .patch(`/api/admin/enquiries/${testEnquiryId}/status`)
        .set(getAdminHeaders())
        .send({
          status: 'Contacted',
          note: 'Called client to verify property documents',
        });

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('Contacted');

      // Verify audit history record in DB
      const history = await prisma.statusHistory.findFirst({
        where: { enquiryId: testEnquiryId, toStatus: 'Contacted' },
      });
      expect(history).not.toBeNull();
      expect(history?.note).toContain('Called client');
    });

    it('POST /api/admin/enquiries/:id/notes records an internal consultant note', async () => {
      const res = await request(app)
        .post(`/api/admin/enquiries/${testEnquiryId}/notes`)
        .set(getAdminHeaders())
        .send({
          content: 'Verified applicant CIBIL score is 780+. Ready for lender comparison.',
        });

      expect(res.status).toBe(201);
      expect(res.body.data.content).toContain('780+');
    });

    it('GET /api/admin/enquiries/export produces RFC-compliant CSV download', async () => {
      const res = await request(app)
        .get('/api/admin/enquiries/export')
        .set(getAdminHeaders());

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toContain('text/csv');
      expect(res.text).toContain('Reference Number');
      expect(res.text).toContain('Ananya Sharma');
    });

    it('PUT /api/admin/content updates published website content persistently', async () => {
      const current = await prisma.siteContent.findUnique({ where: { id: 'default_content' } });
      const updatedHeadline = 'Find the Right Funding Path for Your Property Today.';

      const res = await request(app)
        .put('/api/admin/content')
        .set(getAdminHeaders())
        .send({
          ...current,
          heroHeadline: updatedHeadline,
        });

      expect(res.status).toBe(200);
      expect(res.body.data.heroHeadline).toBe(updatedHeadline);

      // Verify public API reflects the updated headline immediately
      const publicRes = await request(app).get('/api/public/site-content');
      expect(publicRes.body.data.heroHeadline).toBe(updatedHeadline);
    });
  });
});
