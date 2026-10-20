import { z } from 'zod';

export const updateSiteContentSchema = z.object({
  businessName: z.string().trim().min(2),
  businessPhone: z.string().trim().min(8),
  businessEmail: z.string().trim().email(),
  officeAddress: z.string().trim().min(5),
  cityState: z.string().trim().min(3),
  businessHours: z.string().trim().min(3),
  heroEyebrow: z.string().trim().min(2),
  heroHeadline: z.string().trim().min(5),
  heroSubtitle: z.string().trim().min(10),
  heroCtaText: z.string().trim().min(2),
  heroSecondaryCtaText: z.string().trim().min(2),
  heroImageUrl: z.string().trim().url(),
  aboutHeading: z.string().trim().min(5),
  aboutText: z.string().trim().min(10),
  aboutImageUrl: z.string().trim().url(),
  disclaimerText: z.string().trim().min(10),
  privacyPolicy: z.string().trim().min(10),
  termsConditions: z.string().trim().min(10),
  copyrightText: z.string().trim().min(2),
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
  rescheduleReason: z.string().trim().max(500).optional(),
  cancellationReason: z.string().trim().max(500).optional(),
  adminNotes: z.string().trim().max(1000).optional(),
});
