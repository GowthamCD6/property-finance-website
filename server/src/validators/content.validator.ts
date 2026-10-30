import { z } from 'zod';

export const updateSiteContentSchema = z.object({
  businessName: z.string().trim().optional(),
  tagline: z.string().trim().optional().nullable(),
  businessPhone: z.string().trim().optional(),
  businessEmail: z.string().trim().optional(),
  officeAddress: z.string().trim().optional(),
  cityState: z.string().trim().optional(),
  businessHours: z.string().trim().optional(),
  
  // Announcement & Floating Contact
  announcementText: z.string().trim().optional().nullable(),
  announcementActive: z.boolean().optional(),
  announcementLink: z.string().trim().optional().nullable(),
  whatsappNumber: z.string().trim().optional().nullable(),
  whatsappMessage: z.string().trim().optional().nullable(),
  socialLinks: z.string().trim().optional().nullable(),
  registrationDetails: z.string().trim().optional().nullable(),

  // Homepage Hero
  heroEyebrow: z.string().trim().optional(),
  heroHeadline: z.string().trim().optional(),
  heroRotatingWords: z.string().trim().optional().nullable(),
  heroSubtitle: z.string().trim().optional(),
  heroCtaText: z.string().trim().optional(),
  heroSecondaryCtaText: z.string().trim().optional(),
  heroImageUrl: z.string().trim().optional(),
  heroBadges: z.string().trim().optional().nullable(),

  // Stats Counters
  statsCapital: z.string().trim().optional().nullable(),
  statsCapitalSuffix: z.string().trim().optional().nullable(),
  statsCapitalLabel: z.string().trim().optional().nullable(),
  statsLenders: z.string().trim().optional().nullable(),
  statsLendersSuffix: z.string().trim().optional().nullable(),
  statsLendersLabel: z.string().trim().optional().nullable(),
  statsSanction: z.string().trim().optional().nullable(),
  statsSanctionSuffix: z.string().trim().optional().nullable(),
  statsSanctionLabel: z.string().trim().optional().nullable(),
  statsTurnaround: z.string().trim().optional().nullable(),
  statsTurnaroundSuffix: z.string().trim().optional().nullable(),
  statsTurnaroundLabel: z.string().trim().optional().nullable(),

  // Multi-Lender Rate Comparison Matrix
  rateMatrix: z.string().trim().optional().nullable(),

  // Why Choose Us
  whyChooseUsTitle: z.string().trim().optional().nullable(),
  whyChooseUsSubtitle: z.string().trim().optional().nullable(),
  whyChooseUsPillars: z.string().trim().optional().nullable(),

  // Process Steps
  processTitle: z.string().trim().optional().nullable(),
  processSubtitle: z.string().trim().optional().nullable(),
  processSteps: z.string().trim().optional().nullable(),

  // Document Checklist
  salariedDocs: z.string().trim().optional().nullable(),
  selfEmployedDocs: z.string().trim().optional().nullable(),
  propertyDocs: z.string().trim().optional().nullable(),

  // Client Testimonials
  testimonials: z.string().trim().optional().nullable(),

  // About Page
  aboutHeading: z.string().trim().optional(),
  aboutText: z.string().trim().optional(),
  aboutImageUrl: z.string().trim().optional(),
  aboutMission: z.string().trim().optional().nullable(),
  aboutVision: z.string().trim().optional().nullable(),
  aboutMilestones: z.string().trim().optional().nullable(),
  aboutTeam: z.string().trim().optional().nullable(),
  aboutPillars: z.string().trim().optional().nullable(),

  // Contact Page & Branches
  contactHeroTitle: z.string().trim().optional().nullable(),
  contactHeroSubtitle: z.string().trim().optional().nullable(),
  contactHeroImageUrl: z.string().trim().optional().nullable(),
  branchOffices: z.string().trim().optional().nullable(),

  // Calculator Parameters
  calcDefaultHomeRate: z.number().optional().nullable(),
  calcDefaultLapRate: z.number().optional().nullable(),
  calcDefaultAmount: z.number().optional().nullable(),
  calcDefaultTenure: z.number().optional().nullable(),

  // Legal & Regulatory
  disclaimerText: z.string().trim().optional(),
  privacyPolicy: z.string().trim().optional(),
  termsConditions: z.string().trim().optional(),
  copyrightText: z.string().trim().optional(),
});

export const serviceSchema = z.object({
  slug: z.string().trim().min(2).regex(/^[a-z0-9-]+$/, 'Slug must be lower-case alphanumeric with hyphens'),
  title: z.string().trim().min(2),
  shortDescription: z.string().trim().min(10),
  fullDescription: z.string().trim().min(20),
  iconName: z.string().trim().default('Home'),
  displayOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export const faqSchema = z.object({
  question: z.string().trim().min(5),
  answer: z.string().trim().min(10),
  category: z.string().trim().default('General'),
  displayOrder: z.number().int().default(0),
  isPublished: z.boolean().default(true),
});

export const updateEnquiryStatusSchema = z.object({
  status: z.enum([
    'New',
    'Contacted',
    'Follow-up Required',
    'Appointment Requested',
    'Appointment Confirmed',
    'In Review',
    'Converted',
    'Closed',
  ]),
  note: z.string().trim().max(1000).optional(),
});

export const addEnquiryNoteSchema = z.object({
  content: z.string().trim().min(1, 'Note content cannot be empty').max(2000),
});

export const updateAppointmentSchema = z.object({
  status: z.enum(['Requested', 'Confirmed', 'Rescheduled', 'Cancelled', 'Completed']),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  timeSlot: z.string().min(3).optional(),
  meetingMode: z.enum(['phone', 'video', 'in_person']).optional(),
  rescheduleReason: z.string().trim().max(500).optional(),
  cancellationReason: z.string().trim().max(500).optional(),
  adminNotes: z.string().trim().max(1000).optional(),
});

export const createAppointmentSchema = z.object({
  enquiryId: z.string().min(1, 'Enquiry ID is required'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  timeSlot: z.string().min(3, 'Time slot is required'),
  meetingMode: z.enum(['phone', 'video', 'in_person']).default('phone'),
  status: z.enum(['Requested', 'Confirmed', 'Rescheduled', 'Completed']).default('Confirmed'),
  adminNotes: z.string().trim().max(1000).optional(),
});
