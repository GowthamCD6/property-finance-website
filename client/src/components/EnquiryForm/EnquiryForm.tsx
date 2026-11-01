import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Send,
  Building,
  Building2,
  Video,
  User,
  Phone,
  Mail,
  MapPin,
  IndianRupee,
  Briefcase,
  Car,
  Sparkles,
  RotateCcw,
  FileCheck,
  Landmark,
  CreditCard,
  MessageSquare,
} from 'lucide-react';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { GoogleIcon } from '../common/GoogleIcon';
import { triggerGoogleOAuth } from '../../utils/googleAuth';
import { Service, UploadedDocument } from '../../types';
import { submitLoanEnquiry, getPublicAvailability } from '../../services/api';
import { InteractiveDocumentVault } from '../common/InteractiveDocumentVault';
import { DocumentUploadIntake } from './DocumentUploadIntake';

interface EnquiryFormProps {
  services: Service[];
  selectedService: Service | null;
  onClearSelectedService: () => void;
  hideHeader?: boolean;
}

export const EnquiryForm: React.FC<EnquiryFormProps> = ({
  services,
  selectedService,
  hideHeader = false,
}) => {
  // Form State
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [preferredContactMethod, setPreferredContactMethod] = useState<'phone' | 'email' | 'whatsapp'>('phone');
  const [cityState, setCityState] = useState('');

  // Optional KYC State
  const [panNumber, setPanNumber] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');

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

  // Consultation & Callback State
  const [meetingMode, setMeetingMode] = useState<'phone' | 'video' | 'in_person'>('phone');
  const [offlineMeetingAddress, setOfflineMeetingAddress] = useState('');
  const [preferredCallbackWindow, setPreferredCallbackWindow] = useState('Any Time (Fastest Callback)');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [consentGiven, setConsentGiven] = useState(false);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState<any | null>(null);
  const [isGoogleSigningIn, setIsGoogleSigningIn] = useState(false);

  // Customer Authentication Context
  const { customer, isAuthenticated, loginWithGoogle } = useCustomerAuth();

  // Auto-fill from authenticated customer profile
  useEffect(() => {
    if (customer) {
      if (customer.name && (!fullName || fullName === '')) {
        setFullName(customer.name);
      }
      if (customer.email && (!email || email === '')) {
        setEmail(customer.email);
      }
    }
  }, [customer]);

  const triggerGoogleLogin = async () => {
    setIsGoogleSigningIn(true);
    setFormError(null);
    try {
      const accessToken = await triggerGoogleOAuth();
      const authedUser = await loginWithGoogle(accessToken);
      if (authedUser.name) setFullName(authedUser.name);
      if (authedUser.email) setEmail(authedUser.email);
    } catch (err: any) {
      setFormError(err.message || 'Google authentication failed.');
    } finally {
      setIsGoogleSigningIn(false);
    }
  };

  // Update loan type when a service is selected from the services section
  useEffect(() => {
    if (selectedService) {
      setLoanType(selectedService.title);
      // Only scroll down if the URL explicitly targets the #enquiry-form anchor
      if (window.location.hash === '#enquiry-form') {
        const formEl = document.getElementById('enquiry-form');
        if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
      }
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

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setFormError('Please enter a valid personal or business email address.');
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

    if (meetingMode === 'in_person' && !offlineMeetingAddress.trim()) {
      setFormError('Please enter your full meeting address/area so our loan advisor can visit you for the offline meeting.');
      return;
    }

    if (!consentGiven) {
      setFormError('You must review and consent to the privacy policy to submit your enquiry.');
      return;
    }

    // Google Sign-In Requirement check
    if (!isAuthenticated || !customer) {
      setFormError('Google Sign-In is required before submitting your loan enquiry so that our advisors can allot and send your appointment schedule directly to your account.');
      triggerGoogleLogin();
      return;
    }

    setIsSubmitting(true);

    try {
      const kycNotes = [
        panNumber.trim() ? `PAN: ${panNumber.trim().toUpperCase()}` : null,
        aadhaarNumber.trim() ? `Aadhaar: ${aadhaarNumber.trim()}` : null,
      ].filter(Boolean).join(' | ');

      const combinedNotes = [
        meetingMode === 'in_person' ? `📍 Doorstep Meeting Address: ${offlineMeetingAddress.trim()}` : null,
        kycNotes ? `Optional KYC Details: ${kycNotes}` : null,
        additionalNotes.trim() || null,
      ]
        .filter(Boolean)
        .join('\n\n');

      const payload: any = {
        fullName: fullName.trim() || customer.name,
        mobileNumber: cleanPhone,
        email: customer.email || email.trim() || undefined,
        customerId: customer.id,
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
        preferredDate: 'Pending Advisor Allotment',
        preferredTimeSlot: preferredCallbackWindow,
        preferredContactWindow: preferredCallbackWindow,
        meetingMode,
        additionalNotes: combinedNotes || undefined,
        kycDetails: {
          panNumber: panNumber.trim().toUpperCase() || undefined,
          aadhaarNumber: aadhaarNumber.trim() || undefined,
        },
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
    setPanNumber('');
    setAadhaarNumber('');
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
    <section id="enquiry-form" className="py-16 sm:py-20 lg:py-24 bg-[#f7f7f3]">
      <div className="w-[92%] sm:w-[88%] lg:w-[85%] max-w-7xl mx-auto">
        {/* Section Heading - Conditionally rendered */}
        {!hideHeader && (
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
        )}

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
                <span className="text-brand-slate">Consultation Status:</span>
                <span className="font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200 text-xs">
                  Awaiting Slot Allotment by Advisor
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-brand-slate">Preferred Channel:</span>
                <span className="font-semibold text-brand-navy">
                  {meetingMode === 'in_person'
                    ? 'In-Person (Tirupur Office)'
                    : meetingMode === 'video'
                    ? 'Google Meet Video Call'
                    : 'Direct Phone Call'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-brand-slate">Callback Window:</span>
                <span className="font-semibold text-brand-navy">
                  {preferredCallbackWindow}
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
              <Link
                to="/my-enquiries"
                className="px-6 py-2.5 text-sm font-semibold text-white bg-brand-navy hover:bg-brand-navy/90 rounded-corporate transition-colors flex items-center justify-center gap-2"
              >
                <span>Track in My Enquiries Portal &rarr;</span>
              </Link>
              <a
                href={`https://wa.me/919655566613?text=${encodeURIComponent(
                  `Hello Prime Associates, I have submitted my loan enquiry ${submissionSuccess.referenceNumber || ''} for ${loanType} of ${formatAmountINR(loanAmount)}. Please allocate my consultation date and slot.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-corporate transition-colors flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4 text-white" />
                <span>Connect on WhatsApp</span>
              </a>
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-2.5 text-sm font-semibold text-brand-navy bg-brand-ivory border border-brand-border rounded-corporate hover:bg-gray-100 transition-colors"
              >
                Submit Another Enquiry
              </button>
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
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between mb-1.5 font-heading">
                      <span>Full Name</span>
                      <span className="text-rose-600 font-bold ml-1">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ramesh Kumar"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-teal focus:ring-4 focus:ring-brand-teal/10 shadow-2xs transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between mb-1.5 font-heading">
                      <span>Mobile Number</span>
                      <span className="text-rose-600 font-bold ml-1">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 font-semibold text-xs border-r border-slate-200 pr-2.5 my-1.5">
                        <Phone className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        +91
                      </div>
                      <input
                        type="tel"
                        required
                        placeholder="98765 43210"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        className="w-full pl-20 pr-4 py-2.5 bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-teal focus:ring-4 focus:ring-brand-teal/10 shadow-2xs transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between mb-1.5 font-heading">
                      <span>Email Address</span>
                      <span className="text-rose-600 font-bold ml-1">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        required
                        placeholder="e.g. ramesh.kumar@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-teal focus:ring-4 focus:ring-brand-teal/10 shadow-2xs transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between mb-1.5 font-heading">
                      <span>City &amp; State</span>
                      <span className="text-rose-600 font-bold ml-1">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Tirupur, Tamil Nadu"
                        value={cityState}
                        onChange={(e) => setCityState(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-teal focus:ring-4 focus:ring-brand-teal/10 shadow-2xs transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between mb-2 font-heading">
                      <span>Preferred Mode of Initial Contact</span>
                      <span className="text-rose-600 font-bold ml-1">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['phone', 'whatsapp', 'email'] as const).map((method) => (
                        <label
                          key={method}
                          className={`flex items-center justify-center gap-2 p-3 border rounded-xl text-xs font-bold cursor-pointer transition-all duration-150 ${
                            preferredContactMethod === method
                              ? 'border-brand-teal bg-teal-50/80 text-brand-teal shadow-2xs ring-2 ring-brand-teal/20'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-600'
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
                          {method === 'phone' && <Phone className="w-3.5 h-3.5 text-brand-teal" />}
                          {method === 'whatsapp' && <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />}
                          {method === 'email' && <Mail className="w-3.5 h-3.5 text-sky-600" />}
                          <span>{method === 'phone' ? 'Phone Call' : method === 'whatsapp' ? 'WhatsApp' : 'Email'}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Optional KYC Details - marked Optional clearly */}
                  <div className="md:col-span-2 pt-3 pb-1 border-t border-slate-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-brand-teal" />
                        <span className="text-xs font-bold uppercase tracking-wider text-brand-navy font-heading">
                          KYC &amp; Identity Details
                        </span>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                        Optional
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-700 flex items-center justify-between mb-1.5 font-heading">
                          <span>PAN Number</span>
                          <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">Optional</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <CreditCard className="w-4 h-4" />
                          </div>
                          <input
                            type="text"
                            maxLength={10}
                            placeholder="e.g. ABCDE1234F"
                            value={panNumber}
                            onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-300 rounded-xl text-sm font-mono uppercase text-slate-900 placeholder:text-slate-400 placeholder:font-sans focus:outline-none focus:border-brand-teal focus:ring-4 focus:ring-brand-teal/10 shadow-2xs transition-all duration-200"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 flex items-center justify-between mb-1.5 font-heading">
                          <span>Aadhaar Number</span>
                          <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">Optional</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <ShieldCheck className="w-4 h-4" />
                          </div>
                          <input
                            type="text"
                            maxLength={14}
                            placeholder="e.g. 1234 5678 9012"
                            value={aadhaarNumber}
                            onChange={(e) => setAadhaarNumber(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-300 rounded-xl text-sm font-mono text-slate-900 placeholder:text-slate-400 placeholder:font-sans focus:outline-none focus:border-brand-teal focus:ring-4 focus:ring-brand-teal/10 shadow-2xs transition-all duration-200"
                          />
                        </div>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-2">
                      * KYC verification is optional during initial consultation and will be completed prior to formal bank submission.
                    </p>
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
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between mb-1.5 font-heading">
                      <span>Financing Plan / Category</span>
                      <span className="text-rose-600 font-bold ml-1">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <select
                        value={loanType}
                        onChange={(e) => setLoanType(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-brand-teal focus:ring-4 focus:ring-brand-teal/10 shadow-2xs transition-all duration-200"
                      >
                        <option value="Home Loans & Self Construction">
                          Home Loans &amp; Self Construction (from 7.25%)
                        </option>
                        <option value="Mortgage Loans (LAP)">
                          Mortgage Loans / LAP (from 8.50%)
                        </option>
                        <option value="Car Loans (New / Used / Refinance)">
                          Car Loans &amp; Vehicle Refinance (Up to 90% On-Road)
                        </option>
                        <option value="Purchase Loans (Plot / Home / Commercial)">
                          Purchase Loans (Plot / House / Commercial Site)
                        </option>
                        <option value="Private to Govt Bank Takeover">
                          Private Bank to Govt Bank Takeover &amp; Top-Up
                        </option>
                        <option value="Commercial Property & Project Funding">
                          Commercial Property &amp; Builder Project Funding
                        </option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between mb-1.5 font-heading">
                      <span>Approximate Loan Amount (INR)</span>
                      <span className="text-rose-600 font-bold ml-1">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <IndianRupee className="w-4 h-4" />
                      </div>
                      <input
                        type="number"
                        min="100000"
                        step="50000"
                        required
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-300 rounded-xl text-sm font-mono font-bold text-slate-900 focus:outline-none focus:border-brand-teal focus:ring-4 focus:ring-brand-teal/10 shadow-2xs transition-all duration-200"
                      />
                    </div>
                    <div className="flex justify-between items-center mt-1 text-[11px] text-slate-500">
                      <span>{formatAmountINR(loanAmount)}</span>
                      <span className="font-semibold text-brand-teal">{getVerbalAmount(loanAmount)}</span>
                    </div>
                  </div>

                  {/* CAR LOAN SPECIFIC FIELDS (PAGE 4) */}
                  {isCarLoan ? (
                    <div className="md:col-span-2 p-4 rounded-xl bg-teal-50/50 border border-teal-200/80 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-brand-navy">
                          <Car className="w-4 h-4 text-brand-teal" />
                          <span className="text-xs font-bold uppercase tracking-wider font-heading">
                            Vehicle Loan Specifications
                          </span>
                        </div>
                        <span className="text-[11px] font-bold text-teal-800 bg-teal-100 px-2.5 py-0.5 rounded-full">
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
                            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                              carType === type
                                ? 'bg-brand-teal text-white shadow-2xs'
                                : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                            }`}
                          >
                            {type === 'new' && <span className="inline-flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-teal-300" /> New Car</span>}
                            {type === 'used' && <span className="inline-flex items-center gap-1.5"><Car className="w-3.5 h-3.5 text-teal-300" /> Used Car</span>}
                            {type === 'refinance' && <span className="inline-flex items-center gap-1.5"><RotateCcw className="w-3.5 h-3.5 text-teal-300" /> Car Re-Finance</span>}
                          </button>
                        ))}
                      </div>

                      {/* Car Specific Inputs */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {carType === 'new' && (
                          <>
                            <div>
                              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between mb-1 font-heading">
                                <span>On-Road Price (INR)</span>
                                <span className="text-rose-600 font-bold ml-0.5">*</span>
                              </label>
                              <input
                                type="number"
                                required
                                placeholder="e.g. 1500000"
                                value={carOnRoadPrice}
                                onChange={(e) => setCarOnRoadPrice(e.target.value)}
                                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/15"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between mb-1 font-heading">
                                <span>Showroom Name</span>
                                <span className="text-rose-600 font-bold ml-0.5">*</span>
                              </label>
                              <input
                                type="text"
                                required
                                placeholder="e.g. Tata Motors / Hyundai"
                                value={carShowroomName}
                                onChange={(e) => setCarShowroomName(e.target.value)}
                                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/15"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between mb-1 font-heading">
                                <span>Area / City</span>
                                <span className="text-rose-600 font-bold ml-0.5">*</span>
                              </label>
                              <input
                                type="text"
                                required
                                placeholder="e.g. Tirupur / Coimbatore"
                                value={carArea}
                                onChange={(e) => setCarArea(e.target.value)}
                                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/15"
                              />
                            </div>
                          </>
                        )}

                        {carType === 'used' && (
                          <>
                            <div>
                              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between mb-1 font-heading">
                                <span>Model &amp; Year</span>
                                <span className="text-rose-600 font-bold ml-0.5">*</span>
                              </label>
                              <input
                                type="text"
                                required
                                placeholder="e.g. Innova Crysta 2020"
                                value={carModelYear}
                                onChange={(e) => setCarModelYear(e.target.value)}
                                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/15"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between mb-1 font-heading">
                                <span>Number of Owners</span>
                                <span className="text-rose-600 font-bold ml-0.5">*</span>
                              </label>
                              <select
                                value={carOwnersCount}
                                onChange={(e) => setCarOwnersCount(e.target.value)}
                                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/15"
                              >
                                <option value="1">1st Owner</option>
                                <option value="2">2nd Owner</option>
                                <option value="3">3rd Owner</option>
                                <option value="4">4+ Owners</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between mb-1 font-heading">
                                <span>Valuation (INR)</span>
                                <span className="text-rose-600 font-bold ml-0.5">*</span>
                              </label>
                              <input
                                type="number"
                                required
                                placeholder="e.g. 1200000"
                                value={carPurchaseValue}
                                onChange={(e) => setCarPurchaseValue(e.target.value)}
                                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/15"
                              />
                            </div>
                          </>
                        )}

                        {carType === 'refinance' && (
                          <>
                            <div>
                              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between mb-1 font-heading">
                                <span>Vehicle Model &amp; Make</span>
                                <span className="text-rose-600 font-bold ml-0.5">*</span>
                              </label>
                              <input
                                type="text"
                                required
                                placeholder="e.g. Swift Dzire 2021"
                                value={carModelYear}
                                onChange={(e) => setCarModelYear(e.target.value)}
                                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/15"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between mb-1 font-heading">
                                <span>Number of Owners</span>
                                <span className="text-rose-600 font-bold ml-0.5">*</span>
                              </label>
                              <select
                                value={carOwnersCount}
                                onChange={(e) => setCarOwnersCount(e.target.value)}
                                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/15"
                              >
                                <option value="1">1st Owner</option>
                                <option value="2">2nd Owner</option>
                                <option value="3">3rd Owner</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between mb-1 font-heading">
                                <span>Current Financer</span>
                                <span className="text-rose-600 font-bold ml-0.5">*</span>
                              </label>
                              <input
                                type="text"
                                required
                                placeholder="e.g. HDFC / Cholamandalam / Free"
                                value={carShowroomName}
                                onChange={(e) => setCarShowroomName(e.target.value)}
                                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/15"
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between mb-1.5 font-heading">
                          <span>Property / Collateral Type</span>
                          <span className="text-rose-600 font-bold ml-1">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <Building className="w-4 h-4" />
                          </div>
                          <select
                            value={propertyType}
                            onChange={(e) => setPropertyType(e.target.value as any)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-brand-teal focus:ring-4 focus:ring-brand-teal/10 shadow-2xs transition-all duration-200"
                          >
                            <option value="residential">Concrete Building / Tiled House / Independent Home</option>
                            <option value="land">Plots (Empty Land / Vacant Site / Layout Plot)</option>
                            <option value="commercial">Commercial Building (Showroom / Complex / Unit)</option>
                            <option value="other">Agricultural / Industrial / Other</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between mb-1.5 font-heading">
                          <span>Property Location (City / Locality)</span>
                          <span className="text-rose-600 font-bold ml-1">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <MapPin className="w-4 h-4" />
                          </div>
                          <input
                            type="text"
                            required={!isCarLoan}
                            placeholder="e.g. Kumaran Road, Tirupur"
                            value={propertyLocation}
                            onChange={(e) => setPropertyLocation(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-teal focus:ring-4 focus:ring-brand-teal/10 shadow-2xs transition-all duration-200"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between mb-1.5 font-heading">
                          <span>Property Ownership Status</span>
                          <span className="text-rose-600 font-bold ml-1">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <FileCheck className="w-4 h-4" />
                          </div>
                          <select
                            value={propertyOwnershipStatus}
                            onChange={(e) => setPropertyOwnershipStatus(e.target.value as any)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-brand-teal focus:ring-4 focus:ring-brand-teal/10 shadow-2xs transition-all duration-200"
                          >
                            <option value="purchasing">In Process of Purchasing (New / Resale)</option>
                            <option value="owned">Solely Owned &amp; Freehold</option>
                            <option value="jointly_owned">Jointly Owned</option>
                            <option value="other">Inherited / Under Partition</option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}

                  {/* EMPLOYMENT TYPE WITH CASH/HAND SALARY (PAGE 2) */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between mb-1.5 font-heading">
                      <span>Applicant Employment / Income Profile</span>
                      <span className="text-rose-600 font-bold ml-1">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <select
                        value={employmentType}
                        onChange={(e) => setEmploymentType(e.target.value as any)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-brand-teal focus:ring-4 focus:ring-brand-teal/10 shadow-2xs transition-all duration-200"
                      >
                        <option value="salaried">Salaried (Bank Transfer / Payslips / Form 16)</option>
                        <option value="self_employed">Self-Employed Professional / Business (ITR / GST)</option>
                        <option value="cash_salary">Cash Salary (Hand Salary / Cash Income with 1-Yr Banking)</option>
                        <option value="business_owner">Business Owner / Proprietor / MSME</option>
                        <option value="other">NRI / Other Income Profile</option>
                      </select>
                    </div>
                    <span className="text-[11px] text-slate-500 mt-1.5 block">
                      {employmentType === 'cash_salary' && <span className="inline-flex items-center gap-1 text-brand-teal font-medium"><Sparkles className="w-3 h-3 text-brand-teal" /> Requires 1-Yr Bank Statement + Salary Certificate.</span>}
                      {employmentType === 'salaried' && <span className="inline-flex items-center gap-1 text-brand-teal font-medium"><Sparkles className="w-3 h-3 text-brand-teal" /> Requires 6-Mo Bank Statement + Payslips / Form 16.</span>}
                      {employmentType === 'self_employed' && <span className="inline-flex items-center gap-1 text-brand-teal font-medium"><Sparkles className="w-3 h-3 text-brand-teal" /> Requires 1-Yr Bank Statement + ITR (1-3 Yrs) / GST.</span>}
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

              {/* SECTION 4: CONSULTATION & CALLBACK PREFERENCES */}
              <div>
                <div className="flex items-center gap-2 pb-3 mb-5 border-b border-brand-border text-brand-navy">
                  <Calendar className="w-5 h-5 text-brand-teal" />
                  <div>
                    <h3 className="text-base font-bold">4. Consultation &amp; Contact Preferences</h3>
                    <p className="text-xs text-brand-slate font-sans mt-0.5">
                      Our senior loan advisor will review your application and allocate your consultation meeting date &amp; time slot.
                    </p>
                  </div>
                </div>

                {/* 3 Interactive Meeting Mode Option Cards */}
                <div className="space-y-4 mb-5">
                  <label className="block text-xs font-bold text-brand-navy font-heading uppercase tracking-wider">
                    Select Your Consultation Mode <span className="text-red-500">*</span>
                  </label>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Option 1: Offline Meeting / Doorstep Field Visit */}
                    <div
                      onClick={() => setMeetingMode('in_person')}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                        meetingMode === 'in_person'
                          ? 'border-brand-teal bg-teal-50/60 shadow-sm ring-2 ring-brand-teal/20'
                          : 'border-brand-border bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            meetingMode === 'in_person'
                              ? 'bg-brand-teal text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-xs sm:text-sm font-heading text-brand-navy">
                            Offline Meeting
                          </h4>
                          <span className="text-[10px] text-brand-teal font-extrabold uppercase">
                            Advisor Visits Your Area
                          </span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-600 font-sans mt-2.5 leading-relaxed">
                        Our loan advisor travels directly to your home, office, or site location in your area to review property deeds in person.
                      </p>
                    </div>

                    {/* Option 2: Google Meet Video Call */}
                    <div
                      onClick={() => setMeetingMode('video')}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                        meetingMode === 'video'
                          ? 'border-brand-teal bg-teal-50/60 shadow-sm ring-2 ring-brand-teal/20'
                          : 'border-brand-border bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            meetingMode === 'video'
                              ? 'bg-brand-teal text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          <Video className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-xs sm:text-sm font-heading text-brand-navy">
                            Google Meet
                          </h4>
                          <span className="text-[10px] text-sky-700 font-extrabold uppercase">
                            Video Conference
                          </span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-600 font-sans mt-2.5 leading-relaxed">
                        Online video consultation. Admin generates an official Google Meet link delivered directly to your portal and email.
                      </p>
                    </div>

                    {/* Option 3: Direct Phone Call */}
                    <div
                      onClick={() => setMeetingMode('phone')}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                        meetingMode === 'phone'
                          ? 'border-brand-teal bg-teal-50/60 shadow-sm ring-2 ring-brand-teal/20'
                          : 'border-brand-border bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            meetingMode === 'phone'
                              ? 'bg-brand-teal text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          <Phone className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-xs sm:text-sm font-heading text-brand-navy">
                            Direct Phone Call
                          </h4>
                          <span className="text-[10px] text-emerald-700 font-extrabold uppercase">
                            Fastest Callback
                          </span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-600 font-sans mt-2.5 leading-relaxed">
                        Our credit manager dials your registered mobile number (+91 {mobileNumber || '...'}) directly at the confirmed slot time.
                      </p>
                    </div>
                  </div>

                  {/* Mode-specific context box */}
                  {meetingMode === 'in_person' && (
                    <div className="p-4 bg-teal-50/80 border border-teal-200/90 rounded-2xl space-y-2 animate-in fade-in duration-200 shadow-2xs">
                      <div className="flex items-center gap-2 text-brand-teal font-extrabold text-xs uppercase tracking-wide font-heading">
                        <MapPin className="w-4 h-4 text-brand-teal" />
                        <span>Meeting Address / Area for Advisor Doorstep Visit <span className="text-red-500">*</span></span>
                      </div>
                      <p className="text-xs text-slate-600 font-sans">
                        Please provide your complete door number, building, street, and landmark in your area so the loan advisor can navigate and visit you in person:
                      </p>
                      <textarea
                        rows={2}
                        required
                        placeholder="e.g. Door No. 42, 2nd Cross, Rayapuram, Kumaran Road, Tirupur - 641601 (Near Old Bus Stand)"
                        value={offlineMeetingAddress}
                        onChange={(e) => setOfflineMeetingAddress(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-teal-200 rounded-xl text-xs sm:text-sm text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal resize-none font-medium placeholder:text-slate-400"
                      />
                    </div>
                  )}

                  {meetingMode === 'video' && (
                    <div className="p-4 bg-sky-50/80 border border-sky-200/90 rounded-2xl flex items-start gap-3 text-xs text-sky-950 animate-in fade-in duration-200 shadow-2xs">
                      <Video className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                      <p className="font-sans leading-relaxed">
                        <strong>Google Meet Video Flow:</strong> Once you submit, our advisory operations desk will verify available loan officers, schedule your slot, and generate your dedicated Google Meet conference link. This link will appear instantly in your <strong>Borrower Portal</strong> and be sent via WhatsApp &amp; Email.
                      </p>
                    </div>
                  )}

                  {meetingMode === 'phone' && (
                    <div className="p-4 bg-emerald-50/80 border border-emerald-200/90 rounded-2xl flex items-start gap-3 text-xs text-emerald-950 animate-in fade-in duration-200 shadow-2xs">
                      <Phone className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <p className="font-sans leading-relaxed">
                        <strong>Direct Phone Call Flow:</strong> Our senior loan manager will initiate a priority phone consultation to your mobile number <strong>{mobileNumber ? `+91 ${mobileNumber}` : '(your number)'}</strong> at the confirmed slot.
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between mb-1.5 font-heading">
                    <span>Best Time Window for Advisor to Reach You</span>
                    <span className="text-rose-600 font-bold ml-1">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Clock className="w-4 h-4" />
                    </div>
                    <select
                      value={preferredCallbackWindow}
                      onChange={(e) => setPreferredCallbackWindow(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-brand-teal focus:ring-4 focus:ring-brand-teal/10 shadow-2xs transition-all duration-200"
                    >
                      <option value="Any Time (Fastest Callback)">Any Time (Fastest Callback)</option>
                      <option value="Morning (10:00 AM – 01:00 PM)">Morning (10:00 AM – 01:00 PM)</option>
                      <option value="Afternoon (01:00 PM – 04:00 PM)">Afternoon (01:00 PM – 04:00 PM)</option>
                      <option value="Evening (04:00 PM – 07:00 PM)">Evening (04:00 PM – 07:00 PM)</option>
                    </select>
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

              {/* SUBMISSION / GOOGLE AUTHENTICATION STEP */}
              <div className="pt-2">
                {!isAuthenticated || !customer ? (
                  <div className="p-6 bg-gradient-to-br from-slate-50 via-white to-brand-teal/5 border-2 border-brand-teal/30 rounded-2xl shadow-xs space-y-4">
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center flex-shrink-0">
                        <GoogleIcon size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-brand-navy">
                          Google Sign-In Required Before Submitting
                        </h4>
                        <p className="text-xs text-brand-slate mt-0.5 leading-relaxed">
                          Prime Associates links consultation appointments and advisor calls directly to your Google account. You will receive real-time notifications as soon as an advisor allots your consultation slot.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => triggerGoogleLogin()}
                      disabled={isGoogleSigningIn}
                      className="w-full py-4 px-6 bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-300 hover:border-slate-400 text-slate-800 font-bold text-sm rounded-corporate shadow-xs hover:shadow transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60"
                    >
                      {isGoogleSigningIn ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-brand-teal" />
                          <span>Connecting to Google...</span>
                        </>
                      ) : (
                        <>
                          <GoogleIcon size={18} />
                          <span>Sign in with Google to Submit Loan Enquiry</span>
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {customer.picture ? (
                          <img
                            src={customer.picture}
                            alt={customer.name}
                            className="w-8 h-8 rounded-full border border-emerald-300 object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-xs">
                            {customer.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                            <span>Ready to Submit as: {customer.name}</span>
                            <span className="text-[10px] bg-emerald-200/70 text-emerald-900 px-1.5 py-0.5 rounded font-bold">
                              Verified
                            </span>
                          </div>
                          <div className="text-[11px] text-emerald-700">
                            {customer.email} • Consultation slot will be allotted to this account
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
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
                            Submit Loan Enquiry as {customer.name.split(' ')[0]} {documents.length > 0 ? `(${documents.length} Reference Docs Attached)` : ''}
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
};
