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
} from 'lucide-react';
import { Service } from '../../types';
import { submitLoanEnquiry, getPublicAvailability } from '../../services/api';

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

  const [loanType, setLoanType] = useState('Home Loan');
  const [loanAmount, setLoanAmount] = useState<string>('5000000');
  const [propertyType, setPropertyType] = useState<'residential' | 'commercial' | 'land' | 'other'>('residential');
  const [propertyLocation, setPropertyLocation] = useState('');
  const [propertyOwnershipStatus, setPropertyOwnershipStatus] = useState<'owned' | 'jointly_owned' | 'purchasing' | 'other'>('purchasing');
  const [employmentType, setEmploymentType] = useState<'salaried' | 'self_employed' | 'business_owner' | 'other'>('salaried');

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
      .catch((err) => {
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
  const formatAmountINR = (val: string) => {
    const num = parseFloat(val);
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

    if (!propertyLocation.trim()) {
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
      const payload = {
        fullName: fullName.trim(),
        mobileNumber: cleanPhone,
        email: email.trim() || undefined,
        preferredContactMethod,
        cityState: cityState.trim(),
        loanType,
        serviceId: services.find((s) => s.title === loanType)?.id || null,
        loanAmount: numAmount,
        propertyType,
        propertyLocation: propertyLocation.trim(),
        propertyOwnershipStatus,
        employmentType,
        preferredDate,
        preferredTimeSlot,
        meetingMode,
        additionalNotes: additionalNotes.trim() || undefined,
        consentGiven: true,
      };

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
  };

  // Get minimum date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateString = tomorrow.toISOString().split('T')[0];

  return (
    <section id="enquiry-form" className="py-12 sm:py-16 bg-brand-teal-light/40 border-t border-brand-border">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-block px-3 py-1 rounded bg-brand-teal-light text-brand-teal text-xs font-bold uppercase tracking-wider mb-3">
            Confidential Consultation
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-navy tracking-tight font-heading">
            Schedule a Confidential Consultation
          </h2>
          <p className="mt-2.5 text-brand-slate text-sm sm:text-base leading-relaxed">
            Share your loan requirements to connect directly with a dedicated property finance advisory specialist.
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
                Thank You, {submissionSuccess.fullName}
              </h3>
              <p className="text-sm text-brand-slate max-w-lg mx-auto">
                Your enquiry reference has been created. Our team has received your submission and will prepare for your consultation.
              </p>
            </div>

            {/* Reference Badge */}
            <div className="p-4 bg-brand-ivory rounded-xl border border-brand-border max-w-md mx-auto text-left space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between items-center pb-2 border-b border-brand-border">
                <span className="text-brand-slate">Reference Number:</span>
                <span className="font-mono font-bold text-brand-navy text-base">
                  {submissionSuccess.referenceNumber}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-brand-slate">Loan Type:</span>
                <span className="font-semibold text-brand-navy">{submissionSuccess.loanType}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-brand-slate">Requested Amount:</span>
                <span className="font-semibold text-brand-navy">
                  {formatAmountINR(submissionSuccess.loanAmount)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-brand-slate">Requested Meeting:</span>
                <span className="font-semibold text-brand-navy">
                  {submissionSuccess.meetingDate} ({submissionSuccess.meetingSlot})
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-brand-border">
                <span className="text-brand-slate">Status:</span>
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800">
                  {submissionSuccess.appointmentStatus || 'Requested'}
                </span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
              <button
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

            <form onSubmit={handleSubmit} className="space-y-8">
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

              {/* SECTION 2: LOAN & PROPERTY SPECIFICATIONS */}
              <div>
                <div className="flex items-center gap-2 pb-3 mb-5 border-b border-brand-border text-brand-navy">
                  <Building className="w-5 h-5 text-brand-teal" />
                  <h3 className="text-base font-bold">2. Loan &amp; Property Requirements</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                      Loan Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={loanType}
                      onChange={(e) => setLoanType(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-sm text-brand-navy focus:bg-white transition-colors font-medium"
                    >
                      {services.map((s) => (
                        <option key={s.id} value={s.title}>
                          {s.title}
                        </option>
                      ))}
                      {!services.some((s) => s.title.includes('Home Loan')) && (
                        <option value="Home Loans & Self Construction">Home Loans &amp; Self Construction (from 7.25%)</option>
                      )}
                      {!services.some((s) => s.title.includes('Mortgage')) && (
                        <option value="Mortgage Loans (LAP)">Mortgage Loans / LAP (from 8.50%)</option>
                      )}
                      <option value="Purchase Loans (Plot / Home / Commercial)">Purchase Loans (Plot / Home / Commercial)</option>
                      <option value="Vehicle Loans & Refinance">Vehicle Loans (New / Used / Commercial)</option>
                      <option value="Private to Govt Bank Takeover">Private Bank to Govt Bank Takeover</option>
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
                      <option value="other">Vehicle (New / Used Car / Commercial Vehicle) / Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                      Property / Asset Location (City / Locality) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
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

                  <div>
                    <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                      Applicant Employment Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={employmentType}
                      onChange={(e) => setEmploymentType(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-sm text-brand-navy focus:bg-white transition-colors"
                    >
                      <option value="salaried">Salaried (Private / Govt / MNC)</option>
                      <option value="self_employed">Self-Employed Professional (Doctor, CA, etc.)</option>
                      <option value="business_owner">Business Owner / Proprietorship / LLP</option>
                      <option value="other">Other / NRI</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 3: APPOINTMENT PREFERENCES */}
              <div>
                <div className="flex items-center gap-2 pb-3 mb-5 border-b border-brand-border text-brand-navy">
                  <Calendar className="w-5 h-5 text-brand-teal" />
                  <h3 className="text-base font-bold">3. Schedule Your Advisory Meeting</h3>
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

              {/* DATA PRIVACY & CONSENT CHECKBOX (STRICT: NOT PRESELECTED) */}
              <div className="pt-2 border-t border-brand-border space-y-4">
                <div className="p-4 bg-brand-ivory rounded-xl border border-brand-border text-xs text-brand-slate space-y-2">
                  <div className="flex items-center gap-2 text-brand-navy font-semibold">
                    <ShieldCheck className="w-4 h-4 text-brand-teal" />
                    <span>Confidentiality &amp; Privacy Notice</span>
                  </div>
                  <p>
                    Your contact and loan requirements are strictly used to evaluate loan eligibility and organize your advisory meeting. We will never sell your information or trigger unauthorized credit bureau inquiries.
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
                  className="w-full py-3.5 px-6 bg-brand-teal hover:bg-brand-teal-hover disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold text-base rounded-corporate shadow-sm transition-all duration-150 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Registering Your Enquiry...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Loan Enquiry &amp; Schedule Meeting</span>
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
