export interface SiteContent {
  id: string;
  businessName: string;
  businessPhone: string;
  businessEmail: string;
  officeAddress: string;
  cityState: string;
  businessHours: string;
  heroEyebrow: string;
  heroHeadline: string;
  heroSubtitle: string;
  heroCtaText: string;
  heroSecondaryCtaText: string;
  heroImageUrl: string;
  aboutHeading: string;
  aboutText: string;
  aboutImageUrl: string;
  disclaimerText: string;
  privacyPolicy: string;
  termsConditions: string;
  copyrightText: string;
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  iconName: string;
  displayOrder: number;
  isActive: boolean;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  category: string;
  displayOrder: number;
  isPublished: boolean;
}

export interface Appointment {
  id: string;
  enquiryId: string;
  date: string;
  timeSlot: string;
  timezone: string;
  meetingMode: string;
  status: 'Requested' | 'Confirmed' | 'Rescheduled' | 'Cancelled' | 'Completed';
  rescheduleReason?: string | null;
  cancellationReason?: string | null;
  adminNotes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface EnquiryNote {
  id: string;
  enquiryId: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface StatusHistory {
  id: string;
  enquiryId: string;
  fromStatus: string;
  toStatus: string;
  changedBy: string;
  note?: string | null;
  createdAt: string;
}

export interface Enquiry {
  id: string;
  referenceNumber: string;
  fullName: string;
  mobileNumber: string;
  email?: string | null;
  preferredContactMethod: 'phone' | 'email' | 'whatsapp';
  cityState: string;
  loanType: string;
  serviceId?: string | null;
  service?: Service;
  loanAmount: number;
  propertyType: 'residential' | 'commercial' | 'land' | 'other';
  propertyLocation: string;
  propertyOwnershipStatus: 'owned' | 'jointly_owned' | 'purchasing' | 'other';
  employmentType: 'salaried' | 'self_employed' | 'business_owner' | 'other';
  preferredDate: string;
  preferredTimeSlot: string;
  meetingMode: 'phone' | 'video' | 'in_person';
  additionalNotes?: string | null;
  status:
    | 'New'
    | 'Contacted'
    | 'Follow-up Required'
    | 'Appointment Requested'
    | 'Appointment Confirmed'
    | 'In Review'
    | 'Converted'
    | 'Closed';
  consentGiven: boolean;
  createdAt: string;
  updatedAt: string;
  appointments?: Appointment[];
  notes?: EnquiryNote[];
  statusHistory?: StatusHistory[];
  _count?: {
    notes: number;
  };
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface DashboardStats {
  totalEnquiries: number;
  newEnquiries: number;
  awaitingFollowUp: number;
  upcomingAppointments: number;
  confirmedAppointments: number;
  recentEnquiries: Array<{
    id: string;
    referenceNumber: string;
    fullName: string;
    mobileNumber: string;
    loanType: string;
    loanAmount: number;
    status: string;
    createdAt: string;
  }>;
  recentActivities: Array<{
    id: string;
    enquiryId: string;
    fromStatus: string;
    toStatus: string;
    changedBy: string;
    note?: string | null;
    createdAt: string;
    enquiry: {
      referenceNumber: string;
      fullName: string;
    };
  }>;
}

export interface WeeklyConfig {
  id: string;
  dayOfWeek: number;
  dayName: string;
  startTime: string;
  endTime: string;
  slotDurationMinutes: number;
  isAvailable: boolean;
}

export interface BlockedDate {
  id: string;
  date: string;
  reason: string;
}
