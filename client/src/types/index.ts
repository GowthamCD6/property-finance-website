export interface RateMatrixItem {
  id: string;
  bankName: string;
  homeLoanRate: string;
  lapRate: string;
  maxTenure: string;
  processingFee: string;
  ltv: string;
  popularTag?: string;
}

export interface WhyChooseUsPillar {
  title: string;
  description: string;
  metric: string;
  icon?: string;
}

export interface ProcessStep {
  stepNumber: string;
  title: string;
  description: string;
  turnaround: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  loanType: string;
  amount: string;
  review: string;
  rating: number;
  avatarUrl?: string;
}

export interface AboutMilestone {
  year: string;
  title: string;
  description: string;
  stat?: string;
}

export interface AboutTeamMember {
  id: string;
  name: string;
  role: string;
  experience: string;
  bio: string;
  imageUrl?: string;
  linkedinUrl?: string;
}

export interface AboutPillar {
  title: string;
  desc: string;
  icon?: string;
}

export interface BranchOffice {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  timings?: string;
  mapEmbedUrl?: string;
}

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  youtube?: string;
  mapUrl?: string;
}

export interface SiteContent {
  id: string;
  businessName: string;
  tagline?: string | null;
  businessPhone: string;
  businessEmail: string;
  officeAddress: string;
  cityState: string;
  businessHours: string;
  
  // Header & Floating
  announcementText?: string | null;
  announcementActive?: boolean;
  announcementLink?: string | null;
  whatsappNumber?: string | null;
  whatsappMessage?: string | null;
  socialLinks?: string | null;
  registrationDetails?: string | null;

  // Homepage Hero
  heroEyebrow: string;
  heroHeadline: string;
  heroRotatingWords?: string | null;
  heroSubtitle: string;
  heroCtaText: string;
  heroSecondaryCtaText: string;
  heroImageUrl: string;
  heroBadges?: string | null;
  
  // Stats Counters
  statsCapital?: string | null;
  statsCapitalSuffix?: string | null;
  statsCapitalLabel?: string | null;
  statsLenders?: string | null;
  statsLendersSuffix?: string | null;
  statsLendersLabel?: string | null;
  statsSanction?: string | null;
  statsSanctionSuffix?: string | null;
  statsSanctionLabel?: string | null;
  statsTurnaround?: string | null;
  statsTurnaroundSuffix?: string | null;
  statsTurnaroundLabel?: string | null;

  // Multi-Lender Rate Comparison Matrix
  rateMatrix?: string | null;

  // Why Choose Us
  whyChooseUsTitle?: string | null;
  whyChooseUsSubtitle?: string | null;
  whyChooseUsPillars?: string | null;

  // Process Steps
  processTitle?: string | null;
  processSubtitle?: string | null;
  processSteps?: string | null;

  // Document Checklist
  salariedDocs?: string | null;
  selfEmployedDocs?: string | null;
  propertyDocs?: string | null;

  // Client Testimonials
  testimonials?: string | null;

  // About Page
  aboutHeading: string;
  aboutText: string;
  aboutImageUrl: string;
  aboutMission?: string | null;
  aboutVision?: string | null;
  aboutMilestones?: string | null;
  aboutTeam?: string | null;
  aboutPillars?: string | null;

  // Contact Page & Branches
  contactHeroTitle?: string | null;
  contactHeroSubtitle?: string | null;
  contactHeroImageUrl?: string | null;
  branchOffices?: string | null;

  // Calculator Parameters
  calcDefaultHomeRate?: number | null;
  calcDefaultLapRate?: number | null;
  calcDefaultAmount?: number | null;
  calcDefaultTenure?: number | null;

  // Legal & Regulatory
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

export interface UploadedDocument {
  id: string;
  name: string;
  size: number;
  type: string;
  category: 'KYC' | 'Income' | 'Legal' | 'Technical' | 'Mortgage_LAP' | 'Vehicle' | 'General';
  documentName: string;
  previewUrl: string;
  uploadedAt: string;
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
  preferredBank?: string;
  carLoanDetails?: {
    carType: 'new' | 'used' | 'refinance';
    onRoadPrice?: number;
    showroomName?: string;
    area?: string;
    modelYear?: string;
    ownersCount?: number;
    purchaseValue?: number;
  };
  documents?: UploadedDocument[];
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
  avatar?: string | null;
}

export interface CustomerUser {
  id: string;
  email: string;
  name: string;
  picture?: string | null;
  phone?: string | null;
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
