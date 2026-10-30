import React, { useState } from 'react';
import {
  X,
  UserPlus,
  Phone,
  Mail,
  MapPin,
  Building2,
  Calendar,
  Clock,
  Video,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Landmark,
  FileSpreadsheet,
  Share2,
  ArrowRight,
  Briefcase,
  DollarSign,
  ShieldCheck,
} from 'lucide-react';
import { createAdminEnquiryApi } from '../../services/api';

interface RegisterBorrowerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (enquiry: any) => void;
}

export const RegisterBorrowerModal: React.FC<RegisterBorrowerModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [preferredContactMethod, setPreferredContactMethod] = useState('phone');
  const [cityState, setCityState] = useState('Tirupur, Tamil Nadu');

  const [loanType, setLoanType] = useState('Home Loan');
  const [loanAmount, setLoanAmount] = useState<number>(3500000);
  const [propertyType, setPropertyType] = useState('residential');
  const [propertyLocation, setPropertyLocation] = useState('Tirupur');
  const [propertyOwnershipStatus, setPropertyOwnershipStatus] = useState('owned');
  const [employmentType, setEmploymentType] = useState('salaried');
  const [preferredBank, setPreferredBank] = useState('HDFC Bank');

  const [preferredDate, setPreferredDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [preferredTimeSlot, setPreferredTimeSlot] = useState('11:30 AM - 12:30 PM');
  const [meetingMode, setMeetingMode] = useState('phone');
  const [status, setStatus] = useState('Appointment Confirmed');
  const [additionalNotes, setAdditionalNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdData, setCreatedData] = useState<any | null>(null);

  if (!isOpen) return null;

  const STANDARD_SLOTS = [
    '10:00 AM - 11:00 AM',
    '11:30 AM - 12:30 PM',
    '02:00 PM - 03:00 PM',
    '03:30 PM - 04:30 PM',
    '05:00 PM - 06:00 PM',
  ];

  const formatAmountINR = (val: number) => {
    if (!val) return '₹ 0';
    if (val >= 10000000) return `₹ ${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹ ${(val / 100000).toFixed(1)} Lakhs`;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !mobileNumber.trim()) {
      setError('Please provide applicant name and mobile number.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await createAdminEnquiryApi({
        fullName: fullName.trim(),
        mobileNumber: mobileNumber.trim(),
        email: email.trim() || undefined,
        preferredContactMethod,
        cityState: cityState.trim(),
        loanType,
        loanAmount: Number(loanAmount),
        propertyType,
        propertyLocation: propertyLocation.trim(),
        propertyOwnershipStatus,
        employmentType,
        preferredBank,
        preferredDate,
        preferredTimeSlot,
        meetingMode,
        status,
        additionalNotes: additionalNotes.trim() || undefined,
      });

      setCreatedData(res.enquiry);
      onSuccess(res.enquiry);
    } catch (err: any) {
      setError(err.message || 'Failed to register borrower');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCreatedData(null);
    setFullName('');
    setMobileNumber('');
    setEmail('');
    setAdditionalNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0c1a26]/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="space-y-0.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-700 text-[11px] font-bold font-heading">
              <UserPlus className="w-3.5 h-3.5 text-teal-600" />
              <span>Borrower Dossier Intake &bull; Admin Registration</span>
            </div>
            <h2 className="text-xl font-extrabold text-[#0c1a26] font-heading tracking-tight">
              {createdData ? 'Borrower Dossier Registered!' : 'Register New Borrower Dossier'}
            </h2>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {createdData ? (
          /* SUCCESS VIEW */
          <div className="mt-6 space-y-6 text-center">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border-2 border-emerald-200 shadow-sm animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-extrabold text-[#0c1a26] font-heading">
                Dossier Successfully Created
              </h3>
              <p className="text-xs text-slate-500 font-sans">
                A permanent loan application record has been registered in the database pipeline.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200/80">
                <span className="text-xs font-bold text-slate-500 uppercase font-heading">Reference ID</span>
                <span className="font-mono font-extrabold text-teal-800 text-sm bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200">
                  {createdData.referenceNumber}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Applicant Name</span>
                  <span className="font-bold text-[#0c1a26]">{createdData.fullName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Mobile Number</span>
                  <span className="font-mono font-bold text-[#0c1a26]">{createdData.mobileNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Facility &amp; Sanction</span>
                  <span className="font-bold text-teal-700">
                    {createdData.loanType} &bull; {formatAmountINR(createdData.loanAmount)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Consultation Schedule</span>
                  <span className="font-bold text-[#0c1a26]">
                    {createdData.preferredDate} ({createdData.preferredTimeSlot})
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <a
                href={`https://wa.me/91${createdData.mobileNumber.replace(/[^0-9]/g, '')}?text=Dear%20${encodeURIComponent(
                  createdData.fullName
                )},%20greetings%20from%20Prime%20Associates%20Financial%20Services!%20Your%20property%20loan%20case%20file%20has%20been%20registered%20under%20Reference%20Number%20*${
                  createdData.referenceNumber
                }*.%20Your%20consultation%20is%20scheduled%20for%20*${createdData.preferredDate}*%20at%20*${
                  createdData.preferredTimeSlot
                }*%20via%20${createdData.meetingMode.toUpperCase()}.%20Our%20senior%20advisory%20desk%20will%20connect%20with%20you.`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold font-heading flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Share2 className="w-4 h-4" />
                <span>Send WhatsApp Confirmation</span>
              </a>

              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold font-heading transition-all"
              >
                Done / Register Another
              </button>
            </div>
          </div>
        ) : (
          /* REGISTRATION FORM */
          <form onSubmit={handleSubmit} className="mt-5 space-y-5 text-xs sm:text-sm">
            {/* SECTION 1: APPLICANT PERSONAL & CONTACT */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[#0c1a26] pb-1 border-b border-slate-100">
                <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 font-bold text-[11px] flex items-center justify-center">
                  1
                </span>
                <h4 className="font-bold text-xs uppercase tracking-wider font-heading">
                  Applicant Contact &amp; Identity
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#0c1a26] mb-1 font-heading">
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senthil Kumar R"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-[#0c1a26] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0c1a26] mb-1 font-heading">
                    Mobile Number (WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9842109876"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-[#0c1a26] focus:bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0c1a26] mb-1 font-heading">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. senthil@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#0c1a26] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0c1a26] mb-1 font-heading">
                    Applicant City / State
                  </label>
                  <input
                    type="text"
                    required
                    value={cityState}
                    onChange={(e) => setCityState(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#0c1a26] focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: LOAN FACILITY & PROPERTY SPECIFICATIONS */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[#0c1a26] pb-1 border-b border-slate-100">
                <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 font-bold text-[11px] flex items-center justify-center">
                  2
                </span>
                <h4 className="font-bold text-xs uppercase tracking-wider font-heading">
                  Loan Facility &amp; Asset Specification
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#0c1a26] mb-1 font-heading">
                    Loan Facility Required
                  </label>
                  <select
                    value={loanType}
                    onChange={(e) => setLoanType(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-[#0c1a26] focus:bg-white"
                  >
                    <option value="Home Loan">Home Loan (Purchase / Construction)</option>
                    <option value="Loan Against Property">Loan Against Property (Mortgage)</option>
                    <option value="Property-Backed Funding">Property-Backed Business Funding</option>
                    <option value="Vehicle Loan (New / Used Car)">Vehicle Loan (Commercial/Personal)</option>
                    <option value="Loan Consultation & Eligibility Review">Advisory Consultation</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-[#0c1a26] font-heading">
                      Sanction Requested (INR)
                    </label>
                    <span className="text-xs font-extrabold text-teal-700 font-mono">
                      {formatAmountINR(loanAmount)}
                    </span>
                  </div>
                  <input
                    type="number"
                    min="100000"
                    step="50000"
                    required
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-[#0c1a26] focus:bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0c1a26] mb-1 font-heading">
                    Property Location
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rayapuram, Tirupur"
                    value={propertyLocation}
                    onChange={(e) => setPropertyLocation(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#0c1a26] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0c1a26] mb-1 font-heading">
                    Property Type
                  </label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-[#0c1a26] focus:bg-white"
                  >
                    <option value="residential">Residential (House / Flat)</option>
                    <option value="commercial">Commercial Building</option>
                    <option value="industrial">Industrial Shed / Factory</option>
                    <option value="land">Vacant Residential Plot</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0c1a26] mb-1 font-heading">
                    Borrower Employment Profile
                  </label>
                  <select
                    value={employmentType}
                    onChange={(e) => setEmploymentType(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-[#0c1a26] focus:bg-white"
                  >
                    <option value="salaried">Salaried (Private / Govt)</option>
                    <option value="self_employed">Self-Employed Professional</option>
                    <option value="business_owner">Business Owner / Exporter</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0c1a26] mb-1 font-heading">
                    Preferred Lender / Bank
                  </label>
                  <select
                    value={preferredBank}
                    onChange={(e) => setPreferredBank(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-[#0c1a26] focus:bg-white"
                  >
                    <option value="HDFC Bank">HDFC Bank</option>
                    <option value="State Bank of India">State Bank of India (SBI)</option>
                    <option value="ICICI Bank">ICICI Bank</option>
                    <option value="Axis Bank">Axis Bank</option>
                    <option value="Bajaj Finserv">Bajaj Finserv</option>
                    <option value="LIC Housing Finance">LIC Housing Finance</option>
                    <option value="Bank of Baroda">Bank of Baroda</option>
                    <option value="Best Competitive Rate">Best Competitive Rate</option>
                  </select>
                </div>
              </div>
            </div>

            {/* SECTION 3: CONSULTATION ALLOTMENT */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[#0c1a26] pb-1 border-b border-slate-100">
                <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 font-bold text-[11px] flex items-center justify-center">
                  3
                </span>
                <h4 className="font-bold text-xs uppercase tracking-wider font-heading">
                  Consultation Allotment &amp; Pipeline Status
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#0c1a26] mb-1 font-heading">
                    Consultation Date
                  </label>
                  <input
                    type="date"
                    required
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-[#0c1a26] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0c1a26] mb-1 font-heading">
                    Time Slot
                  </label>
                  <select
                    value={preferredTimeSlot}
                    onChange={(e) => setPreferredTimeSlot(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-[#0c1a26] focus:bg-white"
                  >
                    {STANDARD_SLOTS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0c1a26] mb-1 font-heading">
                    Initial Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-[#0c1a26] focus:bg-white"
                  >
                    <option value="Appointment Confirmed">Appointment Confirmed</option>
                    <option value="New">New (Awaiting Contact)</option>
                    <option value="Contacted">Contacted</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0c1a26] mb-1.5 font-heading">
                  Advisory Meeting Channel
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setMeetingMode('phone')}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      meetingMode === 'phone'
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-400 ring-2 ring-emerald-400/30 font-bold'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Phone className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
                    <span className="text-[11px] block">Direct Phone</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMeetingMode('video')}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      meetingMode === 'video'
                        ? 'bg-sky-50 text-sky-900 border-sky-400 ring-2 ring-sky-400/30 font-bold'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Video className="w-4 h-4 mx-auto mb-1 text-sky-600" />
                    <span className="text-[11px] block">Google Meet</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMeetingMode('in_person')}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      meetingMode === 'in_person'
                        ? 'bg-purple-50 text-purple-900 border-purple-400 ring-2 ring-purple-400/30 font-bold'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Building2 className="w-4 h-4 mx-auto mb-1 text-purple-600" />
                    <span className="text-[11px] block">Tirupur Office</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0c1a26] mb-1 font-heading">
                  Administrative Confidential Notes / Remarks
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Borrower requires quick pre-sanction letter for property auction, CIBIL 780+..."
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#0c1a26] resize-none focus:bg-white"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold font-heading shadow-md shadow-teal-500/20 transition-all flex items-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Registering Case...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Complete Borrower Registration</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegisterBorrowerModal;

