import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Send,
  Building,
  User,
  Phone,
  Mail,
  MapPin,
  IndianRupee,
  Briefcase,
  Car,
  FileCheck,
  Landmark,
} from 'lucide-react';
import { Service, UploadedDocument } from '../../types';
import { submitLoanEnquiry, getPublicAvailability } from '../../services/api';
import { InteractiveDocumentVault } from '../common/InteractiveDocumentVault';
import { DocumentUploadIntake } from './DocumentUploadIntake';

interface EnquiryFormProps {
  services: Service[];
  selectedService: Service | null;
  onClearSelectedService: () => void;
}

export const EnquiryForm: React.FC<EnquiryFormProps> = ({
  services,
  selectedService,
}) => {
  // Form State
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [preferredContactMethod, setPreferredContactMethod] = useState<'phone' | 'email' | 'whatsapp'>('phone');
  const [cityState, setCityState] = useState('');

  const [loanType, setLoanType] = useState('Home Loans & Self Construction');
  const [loanAmount, setLoanAmount] = useState<string>('5000000');
  const [propertyType, setPropertyType] = useState<'residential' | 'commercial' | 'land' | 'other'>('residential');
  const [propertyLocation, setPropertyLocation] = useState('');
  const [propertyOwnershipStatus, setPropertyOwnershipStatus] = useState<'owned' | 'jointly_owned' | 'purchasing' | 'other'>('purchasing');
  const [employmentType, setEmploymentType] = useState<'salaried' | 'self_employed' | 'cash_salary' | 'business_owner' | 'other'>('salaried');

  // Channel Partner & Vehicle State (from Master Plan)
  const [preferredBank, setPreferredBank] = useState('Any (Best Market Rate Finder across 40+ Channel Partners)');
  const [carType, setCarType] = useState<'new' | 'used' | 'refinance'>('new');
  const [carOnRoadPrice, setCarOnRoadPrice] = useState('');
  const [carShowroomName, setCarShowroomName] = useState('');
  const [carArea, setCarArea] = useState('');
  const [carModelYear, setCarModelYear] = useState('');
  const [carOwnersCount, setCarOwnersCount] = useState('1');
  const [carPurchaseValue, setCarPurchaseValue] = useState('');

  // Attached Document Images State
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);

  // Appointment & Date State
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTimeSlot, setPreferredTimeSlot] = useState('');
  const [meetingMode, setMeetingMode] = useState<'phone' | 'video' | 'in_person'>('phone');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [consentGiven, setConsentGiven] = useState(false);

  // Dynamic slot availability
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotError, setSlotError] = useState<string | null>(null);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState<any | null>(null);

  // Set default preferred date to 2 days from today
  useEffect(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    const dateStr = d.toISOString().split('T')[0];
    setPreferredDate(dateStr);
  }, []);

  // Update loan type when a service is selected from the services section
  useEffect(() => {
    if (selectedService) {
      setLoanType(selectedService.title);
      const formEl = document.getElementById('enquiry-form');
      if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedService]);

  // Adjust defaults when loan type changes
  useEffect(() => {
    const lower = loanType.toLowerCase();
    if (lower.includes('car') || lower.includes('vehicle')) {
      setPropertyType('other');
      if (loanAmount === '5000000') setLoanAmount('1200000');
    }
  }, [loanType]);

  // Fetch slots whenever preferredDate changes
  useEffect(() => {
    if (!preferredDate) return;

    let isMounted = true;
    setLoadingSlots(true);
    setSlotError(null);

    getPublicAvailability(preferredDate)
      .then((data) => {
        if (!isMounted) return;
        if (!data.isAvailable) {
          setAvailableSlots([]);
          setSlotError(data.reason || 'No appointment slots available on this date.');
          setPreferredTimeSlot('');
        } else {
          setAvailableSlots(data.availableSlots || []);
          if (data.availableSlots && data.availableSlots.length > 0) {
            setPreferredTimeSlot(data.availableSlots[0]);
          } else {
            setPreferredTimeSlot('');
            setSlotError('All consultation slots on this date are fully booked. Please choose another date.');
          }
        }
      })
      .catch(() => {
        if (!isMounted) return;
        setSlotError('Unable to check slot availability. Using standard hours.');
        const fallback = ['10:00 AM - 11:00 AM', '11:30 AM - 12:30 PM', '02:00 PM - 03:00 PM', '04:00 PM - 05:00 PM'];
        setAvailableSlots(fallback);
        setPreferredTimeSlot(fallback[0]);
      })
      .finally(() => {
        if (isMounted) setLoadingSlots(false);
      });

    return () => {
      isMounted = false;
    };
  }, [preferredDate]);

  // Format currency display
  const formatAmountINR = (val: string | number) => {
    const num = typeof val === 'number' ? val : parseFloat(val);
    if (isNaN(num)) return '₹ 0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  // Indian currency verbal description (e.g. 50 Lakhs, 1.5 Crores)
  const getVerbalAmount = (val: string) => {
    const num = parseFloat(val);
    if (isNaN(num) || num <= 0) return '';
    if (num >= 10000000) {
      const cr = (num / 10000000).toFixed(2);
      return `(~ ₹ ${cr.endsWith('.00') ? cr.slice(0, -3) : cr} Crores)`;
    }
    if (num >= 100000) {
      const lakh = (num / 100000).toFixed(1);
      return `(~ ₹ ${lakh.endsWith('.0') ? lakh.slice(0, -2) : lakh} Lakhs)`;
    }
    return '';
  };

  const isCarLoan = loanType.toLowerCase().includes('car') || loanType.toLowerCase().includes('vehicle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Client-side validations
    if (!fullName.trim() || fullName.trim().length < 2) {
      setFormError('Please enter your full name (at least 2 characters).');
      return;
    }

    const cleanPhone = mobileNumber.replace(/[\s-]/g, '');
    if (!/^(?:\+91|0)?[6-9]\d{9}$/.test(cleanPhone)) {
      setFormError('Please enter a valid 10-digit Indian mobile number (e.g. 98765 43210).');
      return;
    }

    if (!cityState.trim()) {
      setFormError('Please provide your current city and state.');
      return;
    }

    const numAmount = parseFloat(loanAmount);
    if (isNaN(numAmount) || numAmount < 100000) {
      setFormError('Please enter a valid approximate loan amount of at least ₹1,00,000.');
      return;
    }

    if (!propertyLocation.trim() && !isCarLoan) {
      setFormError('Please specify the property location (City/Area).');
      return;
    }

    if (!preferredDate) {
      setFormError('Please select a preferred meeting date.');
      return;
    }

    if (!preferredTimeSlot) {
      setFormError('Please select an available appointment time slot.');
      return;
    }

    if (!consentGiven) {
      setFormError('You must review and consent to the privacy policy to submit your enquiry.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: any = {
        fullName: fullName.trim(),
        mobileNumber: cleanPhone,
        email: email.trim() || undefined,
        preferredContactMethod,
        cityState: cityState.trim(),
        loanType,
        serviceId: services.find((s) => s.title === loanType)?.id || null,
        loanAmount: numAmount,
        propertyType: isCarLoan ? 'other' : propertyType,
        propertyLocation: isCarLoan ? (carArea.trim() || cityState.trim()) : propertyLocation.trim(),
        propertyOwnershipStatus: isCarLoan ? 'purchasing' : propertyOwnershipStatus,
        employmentType: employmentType === 'cash_salary' ? 'salaried' : employmentType,
        preferredBank,
        preferredDate,
        preferredTimeSlot,
        meetingMode,
        additionalNotes: additionalNotes.trim() || undefined,
        documents,
        consentGiven: true,
      };

      if (isCarLoan) {
        payload.carLoanDetails = {
          carType,
          onRoadPrice: carOnRoadPrice ? parseFloat(carOnRoadPrice) : undefined,
          showroomName: carShowroomName.trim() || undefined,
          area: carArea.trim() || undefined,
          modelYear: carModelYear.trim() || undefined,
          ownersCount: parseInt(carOwnersCount) || 1,
          purchaseValue: carPurchaseValue ? parseFloat(carPurchaseValue) : undefined,
        };
      }

      const result = await submitLoanEnquiry(payload);
      setSubmissionSuccess(result.data);
    } catch (err: any) {
      setFormError(err.message || 'An error occurred while submitting your enquiry. Please check your inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmissionSuccess(null);
    setFormError(null);
    setFullName('');
    setMobileNumber('');
    setEmail('');
    setAdditionalNotes('');
    setConsentGiven(false);
    setDocuments([]);
    setCarShowroomName('');
    setCarOnRoadPrice('');
    setCarArea('');
    setCarModelYear('');
    setCarPurchaseValue('');
    setPreferredBank('Any (Best Market Rate Finder across 40+ Channel Partners)');
  };

  // Get minimum date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateString = tomorrow.toISOString().split('T')[0];

  const getMappedLoanType = (type?: string): 'home-loans' | 'loan-against-property' | 'property-backed-funding' | 'loan-consultation' => {
    if (!type) return 'home-loans';
    const lower = type.toLowerCase();
    if (lower.includes('home') || lower.includes('construction')) return 'home-loans';
    if (lower.includes('lap') || lower.includes('against property') || lower.includes('mortgage')) return 'loan-against-property';
    if (lower.includes('purchase') || lower.includes('takeover') || lower.includes('commercial') || lower.includes('funding')) return 'property-backed-funding';
    if (lower.includes('vehicle') || lower.includes('car') || lower.includes('consultation')) return 'loan-consultation';
    return 'home-loans';
  };

  return (
    <section id="enquiry-form" className="py-12 sm:py-16 bg-brand-teal-light/40 border-t border-brand-border">
      <div className="w-[92%] sm:w-[88%] lg:w-[85%] max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className="inline-block px-3 py-1 rounded-full bg-brand-teal-light text-brand-teal text-xs font-bold uppercase tracking-wider mb-3 border border-brand-teal/20">
            Confidential Consultation &amp; Document Intake
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-navy tracking-tight font-heading">
            Schedule a Confidential Consultation
          </h2>
          <p className="mt-2.5 text-brand-slate text-sm sm:text-base leading-relaxed">
            Select your financing plan, attach reference documents for fast-track 24–48h underwriting, and book your consultation with our senior advisory team.
          </p>
        </div>

        {/* Confirmation Screen on Success */}
        {submissionSuccess ? (
          <div className="bg-white rounded-2xl p-8 sm:p-12 border border-brand-teal/30 shadow-card text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-brand-teal-light text-brand-teal flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-teal">
                Enquiry Registered Successfully
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-brand-navy">
                Thank You, {submissionSuccess.fullName || fullName}
              </h3>
              <p className="text-sm text-brand-slate max-w-lg mx-auto">
                Your enquiry reference has been created. Our team has received your submission and will review your attached reference documents.
              </p>
            </div>

            {/* Reference Badge */}
            <div className="p-4 bg-brand-ivory rounded-xl border border-brand-border max-w-md mx-auto text-left space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between items-center pb-2 border-b border-brand-border">
                <span className="text-brand-slate">Reference Number:</span>
                <span className="font-mono font-bold text-brand-navy text-base">
                  {submissionSuccess.referenceNumber || 'Generated'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-brand-slate">Loan Plan:</span>
                <span className="font-semibold text-brand-navy">{loanType}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-brand-slate">Requested Amount:</span>
                <span className="font-semibold text-brand-navy">
                  {formatAmountINR(loanAmount)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-brand-slate">Preferred Channel Partner:</span>
                <span className="font-semibold text-brand-navy truncate max-w-[200px]">
                  {preferredBank}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-brand-slate">Requested Meeting:</span>
                <span className="font-semibold text-brand-navy">
                  {preferredDate} ({preferredTimeSlot})
                </span>
              </div>
              {documents.length > 0 && (
                <div className="flex justify-between items-center pt-2 border-t border-brand-border text-teal-800 bg-teal-50 px-2 py-1 rounded">
                  <span className="font-bold flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-brand-teal" />
                    Reference Documents Attached:
                  </span>
                  <span className="font-extrabold font-mono text-brand-teal">
                    {documents.length} File(s)
                  </span>
                </div>
              )}
            </div>

            {/* Document Checklist for the OK Confirmation Screen */}
            <div className="pt-6 border-t border-brand-border/80 text-left">
              <div className="p-4 bg-brand-teal-light/40 border border-brand-teal/20 rounded-2xl mb-2 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-brand-teal shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-brand-navy">
                    Document Checklist for Your Scheduled Meeting:
                  </h4>
                  <p className="text-xs text-brand-slate mt-0.5 leading-relaxed">
                    Having these documents ready during your consultation enables our specialists to evaluate your sanction limit and secure lowest interest rates across partner banks.
                  </p>
                </div>
              </div>

              <InteractiveDocumentVault
                loanType={getMappedLoanType(loanType)}
                embedded={true}
              />
            </div>

            <div className="pt-6 flex flex-col sm:flex-row justify-center gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-brand-teal hover:bg-brand-teal-hover rounded-corporate transition-colors"
              >
                Submit Another Enquiry
              </button>
              <a
                href="#services"
                className="px-6 py-2.5 text-sm font-semibold text-brand-navy bg-brand-ivory border border-brand-border rounded-corporate hover:bg-gray-100 transition-colors"
              >
                Return to Services
              </a>
            </div>
          </div>
        ) : (
          /* Interactive Form Card */
          <div className="bg-white rounded-2xl p-6 sm:p-10 border border-brand-border shadow-card">
            {formError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-800 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-10">
              {/* SECTION 1: APPLICANT INFORMATION */}
              <div>
                <div className="flex items-center gap-2 pb-3 mb-5 border-b border-brand-border text-brand-navy">
                  <User className="w-5 h-5 text-brand-teal" />
                  <h3 className="text-base font-bold">1. Contact &amp; Personal Details</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-sm text-brand-navy focus:bg-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-slate text-xs">
                        +91
                      </div>
                      <input
                        type="tel"
                        required
                        placeholder="98765 43210"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        className="w-full pl-11 pr-3.5 py-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-sm text-brand-navy focus:bg-white transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                      Email Address <span className="text-brand-slate font-normal">(Optional)</span>
                    </label>
                    <input
                      type="email"
                      placeholder="ramesh.kumar@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-sm text-brand-navy focus:bg-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                      City &amp; State <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tirupur, Tamil Nadu"
                      value={cityState}
                      onChange={(e) => setCityState(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-sm text-brand-navy focus:bg-white transition-colors"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-brand-navy mb-2">
                      Preferred Mode of Initial Contact
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['phone', 'whatsapp', 'email'] as const).map((method) => (
                        <label
                          key={method}
                          className={`flex items-center justify-center gap-2 p-2.5 border rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                            preferredContactMethod === method
                              ? 'border-brand-teal bg-brand-teal-light text-brand-teal font-semibold'
                              : 'border-brand-border hover:bg-brand-ivory text-brand-slate'
                          }`}
                        >
                          <input
                            type="radio"
                            name="preferredContactMethod"
                            value={method}
                            checked={preferredContactMethod === method}
                            onChange={() => setPreferredContactMethod(method)}
                            className="sr-only"
                          />
                          <span className="capitalize">{method === 'phone' ? 'Phone Call' : method === 'whatsapp' ? 'WhatsApp' : 'Email'}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: LOAN & PROPERTY REQUIREMENTS */}
              <div>
                <div className="flex items-center gap-2 pb-3 mb-5 border-b border-brand-border text-brand-navy">
                  <Building className="w-5 h-5 text-brand-teal" />
                  <h3 className="text-base font-bold">2. Loan &amp; Collateral Specifications</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                      Financing Plan / Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={loanType}
                      onChange={(e) => setLoanType(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-sm text-brand-navy focus:bg-white transition-colors font-medium"
                    >
                      <option value="Home Loans & Self Construction">
                        🏠 Home Loans &amp; Self Construction (from 7.25%)
                      </option>
                      <option value="Mortgage Loans (LAP)">
                        🏢 Mortgage Loans / LAP (from 8.50%)
                      </option>
                      <option value="Car Loans (New / Used / Refinance)">
                        🚗 Car Loans &amp; Vehicle Refinance (Up to 90% On-Road)
                      </option>
                      <option value="Purchase Loans (Plot / Home / Commercial)">
                        📐 Purchase Loans (Plot / House / Commercial Site)
                      </option>
                      <option value="Private to Govt Bank Takeover">
                        🔄 Private Bank to Govt Bank Takeover &amp; Top-Up
                      </option>
                      <option value="Commercial Property & Project Funding">
                        🏗️ Commercial Property &amp; Builder Project Funding
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                      Approximate Loan Amount (INR) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-slate text-xs font-semibold">
                        ₹
                      </div>
                      <input
                        type="number"
                        min="100000"
                        step="50000"
                        required
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(e.target.value)}
                        className="w-full pl-8 pr-3.5 py-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-sm text-brand-navy focus:bg-white transition-colors font-medium"
                      />
                    </div>
                    <div className="flex justify-between items-center mt-1 text-[11px] text-brand-slate">
                      <span>{formatAmountINR(loanAmount)}</span>
                      <span className="font-medium text-brand-teal">{getVerbalAmount(loanAmount)}</span>
                    </div>
                  </div>

                  {/* CAR LOAN SPECIFIC FIELDS (PAGE 4) */}
                  {isCarLoan ? (
                    <div className="md:col-span-2 p-4 rounded-xl bg-teal-50/50 border border-teal-200/80 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-brand-navy">
                          <Car className="w-4 h-4 text-brand-teal" />
                          <span className="text-xs font-bold uppercase tracking-wider">
                            Vehicle Loan Specifications (Page 4 Master Plan)
                          </span>
                        </div>
                        <span className="text-[11px] font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded">
                          Up to 90% Funding
                        </span>
                      </div>

                      {/* Car Type Selector */}
                      <div className="grid grid-cols-3 gap-2">
                        {(['new', 'used', 'refinance'] as const).map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setCarType(type)}
                            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                              carType === type
                                ? 'bg-brand-teal text-white shadow-xs'
                                : 'bg-white text-brand-slate border border-brand-border hover:bg-gray-50'
                            }`}
                          >
                            {type === 'new' && '✨ New Car'}
                            {type === 'used' && '🚗 Used Car'}
                            {type === 'refinance' && '🔄 Car Re-Finance'}
                          </button>
                        ))}
                      </div>

                      {/* Car Specific Inputs */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {carType === 'new' && (
                          <>
                            <div>
                              <label className="block text-[11px] font-semibold text-brand-navy mb-1">
                                On-Road Price (INR)
                              </label>
                              <input
                                type="number"
                                placeholder="e.g. 1500000"
                                value={carOnRoadPrice}
                                onChange={(e) => setCarOnRoadPrice(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-brand-border rounded-lg text-xs text-brand-navy"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-brand-navy mb-1">
                                Showroom Name
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. Tata Motors / Hyundai"
                                value={carShowroomName}
                                onChange={(e) => setCarShowroomName(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-brand-border rounded-lg text-xs text-brand-navy"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-brand-navy mb-1">
                                Area / City
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. Tirupur / Coimbatore"
                                value={carArea}
                                onChange={(e) => setCarArea(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-brand-border rounded-lg text-xs text-brand-navy"
                              />
                            </div>
                          </>
                        )}

                        {carType === 'used' && (
                          <>
                            <div>
                              <label className="block text-[11px] font-semibold text-brand-navy mb-1">
                                Model &amp; Year
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. Innova Crysta 2020"
                                value={carModelYear}
                                onChange={(e) => setCarModelYear(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-brand-border rounded-lg text-xs text-brand-navy"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-brand-navy mb-1">
                                Number of Owners
                              </label>
                              <select
                                value={carOwnersCount}
                                onChange={(e) => setCarOwnersCount(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-brand-border rounded-lg text-xs text-brand-navy"
                              >
                                <option value="1">1st Owner</option>
                                <option value="2">2nd Owner</option>
                                <option value="3">3rd Owner</option>
                                <option value="4">4+ Owners</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-brand-navy mb-1">
                                Purchase / Valuation Value (INR)
                              </label>
                              <input
                                type="number"
                                placeholder="e.g. 1200000"
                                value={carPurchaseValue}
                                onChange={(e) => setCarPurchaseValue(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-brand-border rounded-lg text-xs text-brand-navy"
                              />
                            </div>
                          </>
                        )}

                        {carType === 'refinance' && (
                          <>
                            <div>
                              <label className="block text-[11px] font-semibold text-brand-navy mb-1">
                                Vehicle Model &amp; Make
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. Swift Dzire 2021"
                                value={carModelYear}
                                onChange={(e) => setCarModelYear(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-brand-border rounded-lg text-xs text-brand-navy"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-brand-navy mb-1">
                                Number of Owners
                              </label>
                              <select
                                value={carOwnersCount}
                                onChange={(e) => setCarOwnersCount(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-brand-border rounded-lg text-xs text-brand-navy"
                              >
                                <option value="1">1st Owner</option>
                                <option value="2">2nd Owner</option>
                                <option value="3">3rd Owner</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-brand-navy mb-1">
                                Current Financer (If Any)
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. HDFC / Cholamandalam / Free"
                                value={carShowroomName}
                                onChange={(e) => setCarShowroomName(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-brand-border rounded-lg text-xs text-brand-navy"
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                          Property / Collateral Type <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={propertyType}
                          onChange={(e) => setPropertyType(e.target.value as any)}
                          className="w-full px-3.5 py-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-sm text-brand-navy focus:bg-white transition-colors"
                        >
                          <option value="residential">Concrete Building / Tiled House / Independent Home</option>
                          <option value="land">Plots (Empty Land / Vacant Site / Layout Plot)</option>
                          <option value="commercial">Commercial Building (Showroom / Complex / Unit)</option>
                          <option value="other">Agricultural / Industrial / Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                          Property Location (City / Locality) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required={!isCarLoan}
                          placeholder="e.g. Kumaran Road, Tirupur"
                          value={propertyLocation}
                          onChange={(e) => setPropertyLocation(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-sm text-brand-navy focus:bg-white transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                          Property Ownership Status <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={propertyOwnershipStatus}
                          onChange={(e) => setPropertyOwnershipStatus(e.target.value as any)}
                          className="w-full px-3.5 py-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-sm text-brand-navy focus:bg-white transition-colors"
                        >
                          <option value="purchasing">In Process of Purchasing (New / Resale)</option>
                          <option value="owned">Solely Owned &amp; Freehold</option>
                          <option value="jointly_owned">Jointly Owned</option>
                          <option value="other">Inherited / Under Partition</option>
                        </select>
                      </div>
                    </>
                  )}

                  {/* EMPLOYMENT TYPE WITH CASH/HAND SALARY (PAGE 2) */}
                  <div>
                    <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                      Applicant Employment / Income Profile <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={employmentType}
                      onChange={(e) => setEmploymentType(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-sm text-brand-navy focus:bg-white transition-colors font-medium"
                    >
                      <option value="salaried">💼 Salaried (Bank Transfer / Payslips / Form 16)</option>
                      <option value="self_employed">🏢 Self-Employed Professional / Business (ITR / GST)</option>
                      <option value="cash_salary">💵 Cash Salary (Hand Salary / Cash Income with 1-Yr Banking)</option>
                      <option value="business_owner">🏭 Business Owner / Proprietor / MSME</option>
                      <option value="other">🌐 NRI / Other Income Profile</option>
                    </select>
                    <span className="text-[11px] text-brand-slate mt-1 block">
                      {employmentType === 'cash_salary' && '✨ Requires 1-Yr Bank Statement + Salary Certificate.'}
                      {employmentType === 'salaried' && '✨ Requires 6-Mo Bank Statement + Payslips / Form 16.'}
                      {employmentType === 'self_employed' && '✨ Requires 1-Yr Bank Statement + ITR (1-3 Yrs) / GST.'}
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION 3: REAL DOCUMENT INTAKE & REFERENCE ATTACHMENT */}
              <div className="pt-2">
                <DocumentUploadIntake
                  loanType={loanType}
                  employmentType={employmentType}
                  carType={carType}
                  preferredBank={preferredBank}
                  onSelectPreferredBank={setPreferredBank}
                  documents={documents}
                  onDocumentsChange={setDocuments}
                />
              </div>

              {/* SECTION 4: APPOINTMENT PREFERENCES */}
              <div>
                <div className="flex items-center gap-2 pb-3 mb-5 border-b border-brand-border text-brand-navy">
                  <Calendar className="w-5 h-5 text-brand-teal" />
                  <h3 className="text-base font-bold">4. Schedule Your Advisory Meeting</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                      Preferred Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      min={minDateString}
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-sm text-brand-navy focus:bg-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                      Available Time Slot <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      {loadingSlots ? (
                        <div className="flex items-center gap-2 py-2.5 px-3.5 border border-brand-border rounded-lg bg-gray-50 text-xs text-brand-slate">
                          <Loader2 className="w-4 h-4 animate-spin text-brand-teal" />
                          <span>Checking slot availability...</span>
                        </div>
                      ) : availableSlots.length > 0 ? (
                        <select
                          value={preferredTimeSlot}
                          onChange={(e) => setPreferredTimeSlot(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-sm text-brand-navy focus:bg-white transition-colors"
                        >
                          {availableSlots.map((slot) => (
                            <option key={slot} value={slot}>
                              {slot}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="py-2.5 px-3 text-xs text-amber-700 bg-amber-50 rounded-lg border border-amber-200">
                          {slotError || 'No slots available on this date'}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                      Meeting Mode <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={meetingMode}
                      onChange={(e) => setMeetingMode(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-sm text-brand-navy focus:bg-white transition-colors"
                    >
                      <option value="phone">Phone Discussion</option>
                      <option value="video">Google Meet / Video Call</option>
                      <option value="in_person">In-Person (Tirupur Office)</option>
                    </select>
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                      Specific Inquiries or Additional Context{' '}
                      <span className="text-brand-slate font-normal">(Optional)</span>
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Existing home loan balance transfer, query regarding co-applicant eligibility, or construction milestone stage..."
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-sm text-brand-navy focus:bg-white transition-colors resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* DATA PRIVACY & CONSENT CHECKBOX */}
              <div className="pt-2 border-t border-brand-border space-y-4">
                <div className="p-4 bg-brand-ivory rounded-xl border border-brand-border text-xs text-brand-slate space-y-2">
                  <div className="flex items-center gap-2 text-brand-navy font-semibold">
                    <ShieldCheck className="w-4 h-4 text-brand-teal" />
                    <span>Confidentiality &amp; Privacy Notice</span>
                  </div>
                  <p>
                    Your contact, financial requirements, and uploaded reference documents are strictly used to evaluate loan eligibility and prepare for your advisory consultation. We will never sell your information or trigger unauthorized credit bureau inquiries.
                  </p>
                </div>

                <label className="flex items-start gap-3 cursor-pointer text-xs sm:text-sm text-brand-navy select-none">
                  <input
                    type="checkbox"
                    required
                    checked={consentGiven}
                    onChange={(e) => setConsentGiven(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded border-gray-300 text-brand-teal focus:ring-brand-teal"
                  />
                  <span>
                    I confirm that the details provided are accurate and I consent to being contacted by the advisory team regarding my property loan enquiry.
                  </span>
                </label>
              </div>

              {/* SUBMIT BUTTON */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || availableSlots.length === 0}
                  className="w-full py-4 px-6 bg-brand-teal hover:bg-brand-teal-hover disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold text-base rounded-corporate shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Submitting Enquiry &amp; Attaching Documents...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>
                        Submit Loan Enquiry {documents.length > 0 ? `(${documents.length} Reference Docs Attached)` : ''}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
};
