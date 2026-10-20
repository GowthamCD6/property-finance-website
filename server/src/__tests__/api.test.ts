import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../app';
import prisma from '../database/client';

describe('Property Loan Consultancy System Tests', () => {
  let adminToken: string = '';
  let testEnquiryId: string = '';
  let testEnquiryReference: string = '';

  beforeAll(async () => {
    // Ensure test database is primed
    const admin = await prisma.adminUser.findUnique({
      where: { email: 'admin@vardhanfinance.in' },
    });
    if (!admin) {
      throw new Error('Database not seeded. Run seed before tests.');
    }
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Public API Endpoints', () => {
    it('GET /api/public/site-content returns published site information', async () => {
      const res = await request(app).get('/api/public/site-content');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.businessName).toBe('Vardhan Property Finance Advisory');
      expect(res.body.data.cityState).toContain('Bengaluru');
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
    it('Protected endpoints reject unauthenticated requests with 401', async () => {
      const res = await request(app).get('/api/admin/dashboard-stats');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('POST /api/auth/login rejects incorrect password with generic message', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'admin@vardhanfinance.in',
        password: 'WrongPassword@123',
      });
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Invalid email address or password.');
    });

    it('POST /api/auth/login authenticates valid admin and returns JWT token', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'admin@vardhanfinance.in',
        password: 'Admin@123456',
      });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.admin.email).toBe('admin@vardhanfinance.in');

      adminToken = res.body.data.token;
    });

    it('GET /api/auth/me returns current authenticated administrator profile', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data.email).toBe('admin@vardhanfinance.in');
    });
  });

  describe('Admin Portal Management', () => {
    it('GET /api/admin/dashboard-stats returns calculated live metrics', async () => {
      const res = await request(app)
        .get('/api/admin/dashboard-stats')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data.totalEnquiries).toBeGreaterThanOrEqual(1);
      expect(res.body.data.recentEnquiries).toBeDefined();
    });

    it('GET /api/admin/enquiries supports search, filtering, and pagination', async () => {
      const res = await request(app)
        .get(`/api/admin/enquiries?search=${encodeURIComponent('Ananya')}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data.enquiries.length).toBeGreaterThanOrEqual(1);
      expect(res.body.data.enquiries[0].referenceNumber).toBe(testEnquiryReference);
    });

    it('PATCH /api/admin/enquiries/:id/status updates status and logs audit history', async () => {
      const res = await request(app)
        .patch(`/api/admin/enquiries/${testEnquiryId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
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
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          content: 'Verified applicant CIBIL score is 780+. Ready for lender comparison.',
        });

      expect(res.status).toBe(201);
      expect(res.body.data.content).toContain('780+');
    });

    it('GET /api/admin/enquiries/export produces RFC-compliant CSV download', async () => {
      const res = await request(app)
        .get('/api/admin/enquiries/export')
        .set('Authorization', `Bearer ${adminToken}`);

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
        .set('Authorization', `Bearer ${adminToken}`)
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
