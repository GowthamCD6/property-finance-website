import { z } from 'zod';

export const createEnquirySchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name cannot exceed 100 characters'),
  mobileNumber: z
    .string()
    .trim()
    .transform((val) => val.replace(/[\s-]/g, ''))
    .refine(
      (val) => /^(?:\+91|0)?[6789]\d{9}$/.test(val),
      'Please enter a valid 10-digit Indian mobile number'
    ),
  email: z
    .string()
    .trim()
    .email('Please enter a valid email address')
    .optional()
    .or(z.literal('')),
  preferredContactMethod: z.enum(['phone', 'email', 'whatsapp'], {
    errorMap: () => ({ message: 'Please select a preferred contact method' }),
  }),
  cityState: z
    .string()
    .trim()
    .min(2, 'City and State are required')
    .max(120, 'Location text is too long'),
  
  loanType: z.string().trim().min(2, 'Please select a loan type'),
  serviceId: z.string().optional().nullable(),
  loanAmount: z
    .number({ invalid_type_error: 'Loan amount must be a number' })
    .positive('Loan amount must be greater than zero')
    .min(100000, 'Loan amount should be at least ₹1,00,000'),
  
  propertyType: z.enum(['residential', 'commercial', 'land', 'other'], {
    errorMap: () => ({ message: 'Please select a valid property type' }),
  }),
  propertyLocation: z
    .string()
    .trim()
    .min(2, 'Property location is required')
    .max(200, 'Property location cannot exceed 200 characters'),
  propertyOwnershipStatus: z.enum(['owned', 'jointly_owned', 'purchasing', 'other'], {
    errorMap: () => ({ message: 'Please select property ownership status' }),
  }),
  employmentType: z.enum(['salaried', 'self_employed', 'business_owner', 'other'], {
    errorMap: () => ({ message: 'Please select employment type' }),
  }),

  preferredDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Preferred date must be in YYYY-MM-DD format')
    .refine((dateStr) => {
      const selected = new Date(dateStr);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selected >= today;
    }, 'Preferred meeting date cannot be in the past'),

  preferredTimeSlot: z
    .string()
    .trim()
    .min(3, 'Preferred time slot is required'),
  meetingMode: z.enum(['phone', 'video', 'in_person'], {
    errorMap: () => ({ message: 'Please select a meeting mode' }),
  }),
  additionalNotes: z
    .string()
    .trim()
    .max(1000, 'Additional notes cannot exceed 1000 characters')
    .optional()
    .nullable(),
  preferredBank: z.string().optional().nullable(),
  carLoanDetails: z.any().optional().nullable(),
  documents: z.array(z.any()).optional().nullable(),
  consentGiven: z.literal(true, {
    errorMap: () => ({
      message: 'You must review and consent to the privacy notice to submit your enquiry',
    }),
  }),
}).passthrough();

export type CreateEnquiryInput = z.infer<typeof createEnquirySchema>;
