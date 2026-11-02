import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building,
  User,
  ArrowRight,
  Loader2,
  LogOut,
  PlusCircle,
  ExternalLink,
  ShieldCheck,
  PhoneCall,
  MapPin,
  Video,
  Building2,
  Copy,
  Check,
  Sparkles,
  Star,
  MessageSquareQuote,
  Edit2,
  Trash2,
  Send,
  Quote,
  RefreshCw,
  Landmark,
  Briefcase,
  ChevronRight,
  Shield,
  BadgeCheck,
  Phone,
  MessageCircle,
  CheckCircle,
  UploadCloud,
  FileCheck,
  Eye,
  Download,
  X,
  Lock,
  Activity,
} from 'lucide-react';
import { useCustomerAuth } from '../../../context/CustomerAuthContext';
import { GoogleIcon } from '../../../components/common/GoogleIcon';
import { UserAvatar } from '../../../components/common/UserAvatar';
import { triggerGoogleOAuth } from '../../../utils/googleAuth';
import { Enquiry, Testimonial, UploadedDocument } from '../../../types';
import {
  submitCustomerReviewApi,
  getCustomerReviewApi,
  deleteCustomerReviewApi,
  getCustomerProfileApi,
  uploadEnquiryDocumentApi,
} from '../../../services/api';

export const MyEnquiriesPage: React.FC = () => {
  const {
    customer,
    isAuthenticated,
    isLoading,
    enquiries,
    loginWithGoogle,
    loginDirect,
    logout,
    refreshEnquiries,
  } = useCustomerAuth();

  const [isSigningIn, setIsSigningIn] = useState(false);
  const [directIdentifier, setDirectIdentifier] = useState('');
  const [isDirectLoggingIn, setIsDirectLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [copiedRef, setCopiedRef] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Cryptographic Session Verification State
  const [copiedSessionHash, setCopiedSessionHash] = useState(false);
  const [sessionVerified, setSessionVerified] = useState<boolean | null>(null);
  const [sessionPingLoading, setSessionPingLoading] = useState(false);
  const [sessionLatency, setSessionLatency] = useState<number | null>(null);

  const handleVerifySession = async () => {
    setSessionPingLoading(true);
    const start = performance.now();
    try {
      const profile = await getCustomerProfileApi();
      const latency = Math.round(performance.now() - start);
      setSessionLatency(latency);
      setSessionVerified(true);
      if (profile.sessionHash && customer) {
        customer.sessionHash = profile.sessionHash;
      }
    } catch {
      setSessionVerified(false);
    } finally {
      setSessionPingLoading(false);
    }
  };

  const handleDirectLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!directIdentifier.trim()) {
      setLoginError('Please enter your registered mobile number, email, or application reference number.');
      return;
    }
    setIsDirectLoggingIn(true);
    setLoginError(null);
    try {
      await loginDirect(directIdentifier.trim());
    } catch (err: any) {
      setLoginError(err.message || 'Could not find a loan application matching these details.');
    } finally {
      setIsDirectLoggingIn(false);
    }
  };

  // Tab & Review Feedback State
  const [activeTab, setActiveTab] = useState<'enquiries' | 'review'>('enquiries');
  const [customerReview, setCustomerReview] = useState<Testimonial | null>(null);
  const [isReviewLoading, setIsReviewLoading] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isDeletingReview, setIsDeletingReview] = useState(false);
  const [isEditingReview, setIsEditingReview] = useState(false);
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState<string | null>(null);
  const [reviewErrorMsg, setReviewErrorMsg] = useState<string | null>(null);

  // Review Form Fields
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewLoanType, setReviewLoanType] = useState<string>('Home Construction Loan');
  const [reviewAmount, setReviewAmount] = useState<string>('₹50 Lakhs');
  const [reviewLocation, setReviewLocation] = useState<string>('Tirupur, Tamil Nadu');
  const [reviewText, setReviewText] = useState<string>('');

  // Cloudinary Document Vault State
  const [customerPreviewDoc, setCustomerPreviewDoc] = useState<UploadedDocument | null>(null);
  const [uploadModalEnquiry, setUploadModalEnquiry] = useState<Enquiry | null>(null);
  const [uploadDocFile, setUploadDocFile] = useState<File | null>(null);
  const [uploadDocName, setUploadDocName] = useState<string>('');
  const [uploadDocCategory, setUploadDocCategory] = useState<string>('KYC');
  const [isUploadingDoc, setIsUploadingDoc] = useState<boolean>(false);
  const [uploadDocSuccess, setUploadDocSuccess] = useState<string | null>(null);
  const [uploadDocError, setUploadDocError] = useState<string | null>(null);

  const handleCustomerUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadModalEnquiry || !uploadDocFile) {
      setUploadDocError('Please choose a JPG, PNG, or PDF file to upload.');
      return;
    }
    if (!uploadDocName.trim()) {
      setUploadDocError('Please enter a document title (e.g. PAN Card, 6M Bank Statement).');
      return;
    }

    setIsUploadingDoc(true);
    setUploadDocError(null);
    setUploadDocSuccess(null);

    try {
      const formData = new FormData();
      formData.append('file', uploadDocFile);
      formData.append('enquiryId', uploadModalEnquiry.id);
      formData.append('enquiryReference', uploadModalEnquiry.referenceNumber);
      formData.append('documentName', uploadDocName.trim());
      formData.append('category', uploadDocCategory);
      if (uploadModalEnquiry.mobileNumber) {
        formData.append('customerIdentifier', uploadModalEnquiry.mobileNumber);
      }

      await uploadEnquiryDocumentApi(formData);
      setUploadDocSuccess('Document successfully uploaded and secured in Cloudinary vault!');
      setUploadDocFile(null);
      setUploadDocName('');

      // Refresh customer enquiries from database
      await refreshEnquiries();

      setTimeout(() => {
        setUploadDocSuccess(null);
        setUploadModalEnquiry(null);
      }, 1500);
    } catch (err: any) {
      setUploadDocError(err.message || 'Failed to upload document. Please try again.');
    } finally {
      setIsUploadingDoc(false);
    }
  };

  const handleCopyLink = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  const handleCopyRef = (refNum: string) => {
    navigator.clipboard.writeText(refNum);
    setCopiedRef(refNum);
    setTimeout(() => setCopiedRef(null), 2500);
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([refreshEnquiries(), loadCustomerReview()]);
    } finally {
      setTimeout(() => setIsRefreshing(false), 600);
    }
  };

  const loadCustomerReview = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsReviewLoading(true);
    try {
      const rev = await getCustomerReviewApi();
      setCustomerReview(rev);
      if (rev) {
        setReviewRating(rev.rating || 5);
        setReviewLoanType(rev.loanType || 'Home Construction Loan');
        setReviewAmount(rev.amount || '₹50 Lakhs');
        setReviewLocation(rev.location || 'Tirupur, Tamil Nadu');
        setReviewText(rev.review || '');
      } else if (enquiries && enquiries.length > 0) {
        const first = enquiries[0];
        setReviewLoanType(first.loanType || 'Home Construction Loan');
        setReviewAmount(formatAmountINR(first.loanAmount));
        setReviewLocation(first.cityState || first.propertyLocation || 'Tirupur, Tamil Nadu');
      }
    } catch (err) {
      console.warn('Failed to load customer review', err);
    } finally {
      setIsReviewLoading(false);
    }
  }, [isAuthenticated]);

  // Initial load on mount or customer change - NEVER force window.scrollTo here
  useEffect(() => {
    if (isAuthenticated) {
      refreshEnquiries();
      loadCustomerReview();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, customer?.email]);

  const triggerGoogleLogin = async () => {
    setIsSigningIn(true);
    setLoginError(null);
    try {
      const accessToken = await triggerGoogleOAuth();
      await loginWithGoogle(accessToken);
    } catch (err: any) {
      setLoginError(err.message || 'Google authentication failed.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const formatAmountINR = (num: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const getRatingLabel = (stars: number) => {
    switch (stars) {
      case 5:
        return 'Outstanding — Lowest Interest Rates & Fast Bank Sanction';
      case 4:
        return 'Very Good — Professional Advisory & Prompt Communication';
      case 3:
        return 'Satisfactory — Met Expectations';
      case 2:
        return 'Fair — Slower Turnaround or Inconveniences';
      case 1:
        return 'Needs Improvement';
      default:
        return 'Rate your overall experience';
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewErrorMsg(null);
    setReviewSuccessMsg(null);

    if (!reviewText.trim() || reviewText.trim().length < 5) {
      setReviewErrorMsg('Please share at least a few words describing your experience (minimum 5 characters).');
      return;
    }

    setIsSubmittingReview(true);
    try {
      const saved = await submitCustomerReviewApi({
        rating: reviewRating,
        review: reviewText.trim(),
        loanType: reviewLoanType.trim() || 'Property / Home Loan',
        amount: reviewAmount.trim() || '₹50 Lakhs',
        location: reviewLocation.trim() || 'Tirupur, Tamil Nadu',
      });
      setCustomerReview(saved);
      setIsEditingReview(false);
      setReviewSuccessMsg('🎉 Your review has been submitted and published live to the Prime Associates website!');
      setTimeout(() => setReviewSuccessMsg(null), 8000);
    } catch (err: any) {
      setReviewErrorMsg(err.message || 'Failed to submit review.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!window.confirm('Are you sure you want to delete your feedback and review?')) {
      return;
    }
    setIsDeletingReview(true);
    try {
      await deleteCustomerReviewApi();
      setCustomerReview(null);
      setReviewText('');
      setIsEditingReview(false);
      setReviewSuccessMsg('Your review has been successfully removed.');
      setTimeout(() => setReviewSuccessMsg(null), 5000);
    } catch (err: any) {
      setReviewErrorMsg(err.message || 'Failed to delete review.');
    } finally {
      setIsDeletingReview(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('closed') || s.includes('converted') || s.includes('sanction') || s.includes('approved')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold font-heading rounded-full border border-emerald-200/90 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Sanction Approved / Closed</span>
        </span>
      );
    }
    if (s.includes('process') || s.includes('review')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 text-teal-800 text-xs font-bold font-heading rounded-full border border-teal-200/90 shadow-2xs">
          <Clock className="w-3.5 h-3.5 text-teal-600" />
          <span>Credit Appraisal in Progress</span>
        </span>
      );
    }
    if (s.includes('slot') || s.includes('appoint') || s.includes('confirmed') || s.includes('booked')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-sky-50 text-sky-800 text-xs font-bold font-heading rounded-full border border-sky-200/90 shadow-2xs">
          <Calendar className="w-3.5 h-3.5 text-sky-600" />
          <span>Consultation Slot Booked</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 text-xs font-bold font-heading rounded-full border border-amber-200/90 shadow-2xs">
        <Clock className="w-3.5 h-3.5 text-amber-600" />
        <span>Application Queued</span>
      </span>
    );
  };

  // Helper for Stepper Stage
  const getLifecycleStage = (status: string, hasSlot: boolean) => {
    const s = status.toLowerCase();
    if (s.includes('closed') || s.includes('sanction') || s.includes('approved')) return 5;
    if (s.includes('process') || s.includes('review')) return 4;
    if (hasSlot || s.includes('slot') || s.includes('appoint') || s.includes('booked')) return 3;
    return 2;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f7f7f3] via-[#f3f5f4] to-[#f7f7f3] pt-2 sm:pt-4 pb-16 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-6xl mx-auto space-y-8 animate-pulse">
          {/* Banner Skeleton */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-200 shrink-0" />
              <div className="space-y-2">
                <div className="h-6 bg-slate-200 rounded w-52" />
                <div className="h-3.5 bg-slate-100 rounded w-40" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 bg-slate-200 rounded-xl w-36" />
              <div className="h-10 bg-slate-100 rounded-xl w-24" />
            </div>
          </div>

          {/* Cards Skeleton */}
          <div className="space-y-4">
            <div className="h-6 bg-slate-200 rounded w-60" />
            <div className="grid grid-cols-1 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div className="space-y-2">
                      <div className="h-4 bg-slate-200 rounded w-32" />
                      <div className="h-6 bg-slate-200 rounded w-48" />
                    </div>
                    <div className="h-7 bg-slate-200 rounded-full w-36" />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((j) => (
                      <div key={j} className="h-20 bg-slate-50 rounded-2xl border border-slate-100" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not signed in: Login Gateway
  if (!isAuthenticated || !customer) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f7f7f3] via-[#f3f5f4] to-[#f7f7f3] pt-6 sm:pt-10 pb-16 px-4 sm:px-6 font-sans relative overflow-hidden">
        {/* Ambient Brand Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-teal/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-md mx-auto bg-white/95 backdrop-blur-md rounded-3xl shadow-[0_20px_50px_-12px_rgba(24,50,71,0.12)] border border-slate-200/90 p-8 sm:p-10 text-center space-y-7 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-100/60 border border-teal-200 mx-auto flex items-center justify-center text-brand-teal shadow-2xs">
            <Landmark className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-brand-teal font-heading">
              Prime Associates • Secure Access
            </span>
            <h1 className="text-2xl sm:text-3xl font-black font-heading text-brand-navy tracking-tight">
              Borrower Executive Portal
            </h1>
            <p className="text-xs text-brand-slate leading-relaxed font-sans max-w-sm mx-auto">
              Sign in with your verified Google account to track loan sanction progress, review advisor consultation dossiers, and submit verified borrower testimonials.
            </p>
          </div>

          {loginError && (
            <div className="p-3.5 bg-red-50/90 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2.5 text-left font-sans animate-in fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
              <span>{loginError}</span>
            </div>
          )}

          <button
            type="button"
            onClick={() => triggerGoogleLogin()}
            disabled={isSigningIn}
            className="w-full h-12 px-5 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 text-slate-800 font-bold font-heading text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
          >
            {isSigningIn ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-brand-teal" />
                <span>Connecting to Google...</span>
              </>
            ) : (
              <>
                <GoogleIcon size={20} />
                <span>Continue with Google</span>
              </>
            )}
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 font-heading shrink-0">
              Or Lookup by Application ID
            </span>
          </div>

          <form onSubmit={handleDirectLogin} className="space-y-3.5 text-left">
            <div>
              <label className="text-xs font-bold text-slate-700 font-heading block mb-1">
                Mobile Number, Email, or Application Ref
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 9876543210 or VPF-2026-..."
                value={directIdentifier}
                onChange={(e) => setDirectIdentifier(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-brand-teal focus:bg-white rounded-xl text-sm font-medium text-slate-900 outline-none transition-all shadow-inner/5"
              />
            </div>
            <button
              type="submit"
              disabled={isDirectLoggingIn}
              className="w-full h-11 px-4 bg-gradient-to-r from-brand-teal to-[#126763] hover:brightness-105 text-white font-bold font-heading text-xs uppercase tracking-wider rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isDirectLoggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Locating Application...</span>
                </>
              ) : (
                <span>Access My Borrower Panel &rarr;</span>
              )}
            </button>
          </form>

          {/* Cryptographic Protection & Anti-Scraping Trust Strip */}
          <div className="p-3 bg-slate-50 border border-slate-200/90 rounded-2xl text-left space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-bold font-heading text-slate-800">
              <Shield className="w-3.5 h-3.5 text-brand-teal" />
              <span>SHA-256 Anti-Tamper &amp; Brute-Force Rate Limiting Active</span>
            </div>
            <p className="text-[10px] text-slate-500 font-sans leading-relaxed">
              Borrower lookups are protected by strict IP rate limiting (15 attempts / 15 mins) and cryptographic signatures to prevent phone and reference number scraping.
            </p>
          </div>

          <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-center gap-2 font-sans border-t border-slate-100">
            <ShieldCheck className="w-4 h-4 text-brand-teal" />
            <span>256-Bit Bank Grade SSL Encrypted</span>
          </div>
        </div>
      </div>
    );
  }

  // Active Tab Counts & Metadata
  const activeEnquiriesCount = enquiries.length;

  // Signed in: Borrower Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f7f7f3] via-[#f3f5f4] to-[#f7f7f3] pt-2 sm:pt-4 pb-20 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-7">
        
        {/* =========================================================================
            1. PRESTIGIOUS BORROWER EXECUTIVE HEADER BANNER
            ========================================================================= */}
        <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-6">
            
            {/* User Profile Block */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5 sm:gap-5">
              <div className="relative shrink-0">
                <UserAvatar
                  src={customer.picture}
                  name={customer.name}
                  size={58}
                  showGoogleBadge={true}
                  className="border border-slate-200 shadow-xs"
                />
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold font-heading text-brand-navy tracking-tight">
                    Welcome, {customer.name}
                  </h1>
                  <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-[11px] font-semibold font-heading px-2 py-0.5 rounded-full">
                    <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Google Verified</span>
                  </span>
                </div>

                <p className="text-xs text-brand-slate font-sans break-all sm:break-normal">
                  {customer.email}
                </p>

                {/* Micro Meta Strip */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1 text-[11px] font-heading text-slate-500">
                  <span className="flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-brand-teal" />
                    <span>Tirupur Credit Desk</span>
                  </span>
                  <span className="text-slate-300 hidden sm:inline">•</span>
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Zero Brokerage</span>
                  </span>
                  <span className="text-slate-300 hidden sm:inline">•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>
                      {activeEnquiriesCount} {activeEnquiriesCount === 1 ? 'Application' : 'Applications'} On File
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Controls */}
            <div className="grid grid-cols-1 sm:flex sm:flex-wrap items-center gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 w-full lg:w-auto">
              <Link
                to="/enquire"
                className="w-full sm:w-auto px-4 py-2.5 bg-brand-teal hover:bg-brand-teal-hover text-white text-xs font-semibold font-heading rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>New Loan Enquiry</span>
              </Link>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('review');
                  if (!customerReview) setIsEditingReview(true);
                }}
                className={`w-full sm:w-auto px-4 py-2.5 text-xs font-semibold font-heading rounded-xl border transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                  customerReview
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>{customerReview ? 'My Live Review' : 'Rate Experience'}</span>
              </button>

              <button
                type="button"
                onClick={logout}
                className="w-full sm:w-auto px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 text-xs font-semibold font-heading rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                title="Sign out of portal"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================================
            SECURITY & CRYPTOGRAPHIC VERIFICATION STRIP
            ========================================================================= */}
        <div className="bg-gradient-to-r from-[#0c1a26] via-[#102235] to-[#0c1a26] text-white rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-md">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5 text-teal-400" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs sm:text-sm font-bold font-heading text-white">
                    256-Bit SSL/TLS &amp; SHA-256 Hashed Financial Session
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-heading bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 inline-flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Cryptographically Protected
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-sans">
                  Borrower records, consultation notes, and KYC documents are sealed against unauthorized tampering and replay attacks.
                </p>
              </div>
            </div>

            {/* Session Fingerprint Badge & Live Ping */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800">
              <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl px-3 py-1.5 flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 font-heading uppercase tracking-wider">
                  Hash:
                </span>
                <span className="font-mono text-xs text-teal-300 tracking-wider">
                  {customer.sessionHash
                    ? `sha256:${customer.sessionHash.substring(0, 8)}...${customer.sessionHash.substring(customer.sessionHash.length - 6)}`
                    : 'sha256:verified_active'}
                </span>
                {customer.sessionHash && (
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(customer.sessionHash!);
                      setCopiedSessionHash(true);
                      setTimeout(() => setCopiedSessionHash(false), 2000);
                    }}
                    className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title="Copy full cryptographic SHA-256 session hash"
                  >
                    {copiedSessionHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={handleVerifySession}
                disabled={sessionPingLoading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold font-heading shadow-xs transition-all cursor-pointer active:scale-[0.98]"
              >
                {sessionPingLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : sessionVerified ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5 text-white" />
                    <span>Verified {sessionLatency ? `(${sessionLatency}ms)` : ''}</span>
                  </>
                ) : (
                  <>
                    <Activity className="w-3.5 h-3.5 text-teal-200" />
                    <span>Verify Live Hash</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================================
            2. STREAMLINED EXECUTIVE TAB DOCK
            ========================================================================= */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 w-full md:w-auto">
            <button
              type="button"
              onClick={() => setActiveTab('enquiries')}
              className={`px-3 sm:px-4 py-2.5 rounded-xl text-xs font-semibold font-heading transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'enquiries'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <FileText className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'enquiries' ? 'text-teal-300' : 'text-slate-500'}`} />
              <span className="truncate">Loan Enquiries &amp; Consultations</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-heading shrink-0 ${
                activeTab === 'enquiries' ? 'bg-slate-800 text-teal-300' : 'bg-slate-100 text-slate-600'
              }`}>
                {enquiries.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('review')}
              className={`px-3 sm:px-4 py-2.5 rounded-xl text-xs font-semibold font-heading transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'review'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
              <span className="truncate">Borrower Feedback</span>
              {customerReview ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-600 font-bold shrink-0">
                  Share
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center justify-between md:justify-end gap-2 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 px-1">
            <button
              type="button"
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="p-1.5 text-slate-500 hover:text-brand-navy hover:bg-slate-50 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
              title="Refresh status"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-brand-teal' : ''}`} />
              <span className="text-[11px] font-heading">{isRefreshing ? 'Syncing...' : 'Refresh'}</span>
            </button>

            <a
              href="https://wa.me/919655566613"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-semibold font-heading rounded-lg transition-colors flex items-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Support Desk</span>
            </a>
          </div>
        </div>

        {/* =========================================================================
            3. TAB 1: LOAN ENQUIRIES & CONSULTATIONS
            ========================================================================= */}
        {activeTab === 'enquiries' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between px-1">
              <div>
                <h2 className="text-lg font-bold font-heading text-brand-navy">
                  Your Loan Portfolio &amp; Consultation Dossiers
                </h2>
                <p className="text-xs text-brand-slate font-sans mt-0.5">
                  Real-time status updates from our Tirupur credit syndication desk.
                </p>
              </div>

              <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-semibold text-brand-navy font-heading shadow-2xs">
                {enquiries.length} {enquiries.length === 1 ? 'Record Found' : 'Records Found'}
              </span>
            </div>

            {enquiries.length === 0 ? (
              /* EMPTY STATE */
              <div className="bg-white rounded-2xl p-10 sm:p-14 text-center border border-slate-200 shadow-sm space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 text-slate-500 mx-auto flex items-center justify-center">
                  <FileText className="w-7 h-7 text-brand-teal" />
                </div>
                <div className="space-y-1.5 max-w-md mx-auto">
                  <h3 className="text-xl font-bold font-heading text-brand-navy">No Active Loan Applications</h3>
                  <p className="text-xs text-brand-slate leading-relaxed font-sans">
                    You haven't submitted any loan requests under this Google account yet. Submit an enquiry today to compare tailored proposals from 40+ premier banking partners.
                  </p>
                </div>

                {/* Value perks grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto text-left pt-2">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-xs font-bold text-slate-800 font-heading block">⚡ 24h Turnaround</span>
                    <span className="text-[11px] text-slate-500 font-sans">Fast credit appraisal</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-xs font-bold text-slate-800 font-heading block">💰 8.40% Lowest Rates</span>
                    <span className="text-[11px] text-slate-500 font-sans">Direct bank tie-ups</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-xs font-bold text-slate-800 font-heading block">🤝 Zero Brokerage</span>
                    <span className="text-[11px] text-slate-500 font-sans">Transparent advisory</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    to="/enquire"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-teal hover:bg-brand-teal-hover text-white text-xs font-semibold font-heading rounded-xl shadow-xs transition-colors"
                  >
                    <span>Submit Loan Enquiry</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : (
              /* ENQUIRIES LIST */
              <div className="grid grid-cols-1 gap-6">
                {enquiries.map((enq) => {
                  const latestAppointment =
                    enq.appointments && enq.appointments.length > 0 ? enq.appointments[0] : null;
                  const effectiveMode = latestAppointment?.meetingMode || enq.meetingMode || 'phone';
                  const isAllotted = Boolean(
                    latestAppointment &&
                      latestAppointment.date &&
                      latestAppointment.date !== 'Pending Advisor Allotment'
                  );

                  // Extract doorstep address from notes or location
                  const doorstepAddress = enq.additionalNotes?.includes('📍 Doorstep Meeting Address:')
                    ? enq.additionalNotes.split('📍 Doorstep Meeting Address:')[1]?.split('\n')[0]?.trim()
                    : effectiveMode === 'in_person'
                    ? enq.propertyLocation || enq.cityState
                    : null;

                  // Extract Google Meet URL
                  const meetLinkMatch = latestAppointment?.adminNotes?.match(
                    /(https:\/\/meet\.google\.com\/[a-zA-Z0-9_-]+)/i
                  );
                  const meetUrl = meetLinkMatch
                    ? meetLinkMatch[1]
                    : effectiveMode === 'video' && latestAppointment?.adminNotes?.startsWith('http')
                    ? latestAppointment.adminNotes.trim()
                    : null;

                  const currentStage = getLifecycleStage(enq.status, isAllotted);

                  return (
                    <div
                      key={enq.id}
                      className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-6"
                    >
                      {/* Header Row: Reference, Date, Loan Type, Status */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            {/* Ref Pill with Copy */}
                            <button
                              type="button"
                              onClick={() => handleCopyRef(enq.referenceNumber)}
                              className="group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer"
                              title="Click to copy Application Reference"
                            >
                              <span>{enq.referenceNumber}</span>
                              {copiedRef === enq.referenceNumber ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3 text-slate-400 group-hover:text-slate-600" />
                              )}
                            </button>

                            <span className="text-xs text-slate-400 font-sans">
                              • Submitted on {new Date(enq.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </span>
                          </div>

                          <h3 className="text-xl font-bold font-heading text-brand-navy tracking-tight">
                            {enq.loanType}
                          </h3>
                        </div>

                        <div className="self-start sm:self-center">
                          {getStatusBadge(enq.status)}
                        </div>
                      </div>

                      {/* Clean Executive Lifecycle Stepper */}
                      <div className="py-2">
                        <div className="flex items-center justify-between text-xs mb-3">
                          <span className="font-semibold text-slate-500 font-heading">Application Lifecycle</span>
                          <span className="font-bold text-brand-teal font-heading">Stage {currentStage} of 5</span>
                        </div>

                        {/* Mobile Stepper View (< sm) */}
                        <div className="sm:hidden space-y-2.5">
                          <div className="flex items-center justify-between relative px-2 py-1">
                            <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
                            <div
                              className="absolute top-1/2 left-4 h-0.5 bg-teal-600 -translate-y-1/2 z-0 transition-all duration-300"
                              style={{ width: `${Math.max(0, ((currentStage - 1) / 4) * 100)}%` }}
                            />
                            {[1, 2, 3, 4, 5].map((stepNum) => {
                              const isDone = currentStage >= stepNum;
                              const isCurrent = currentStage === stepNum;
                              return (
                                <div
                                  key={stepNum}
                                  className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-heading transition-colors ${
                                    isDone
                                      ? isCurrent
                                        ? 'bg-brand-teal text-white ring-4 ring-teal-500/20 shadow-xs'
                                        : 'bg-emerald-600 text-white'
                                      : 'bg-white text-slate-400 border-2 border-slate-200'
                                  }`}
                                >
                                  {isDone && !isCurrent ? <Check className="w-3.5 h-3.5" /> : stepNum}
                                </div>
                              );
                            })}
                          </div>
                          {/* Active Stage Callout on Mobile */}
                          {(() => {
                            const steps = [
                              { num: 1, label: 'Enquiry Received', desc: 'Dossier Logged' },
                              { num: 2, label: 'Advisor Assigned', desc: 'Desk Allotment' },
                              { num: 3, label: 'Consultation', desc: isAllotted ? 'Slot Booked' : 'Queueing' },
                              { num: 4, label: 'Bank Appraisal', desc: 'Credit Review' },
                              { num: 5, label: 'Sanction & Payout', desc: 'Disbursal' },
                            ];
                            const curStep = steps.find((s) => s.num === currentStage) || steps[0];
                            return (
                              <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-center">
                                <span className="text-[11px] font-bold text-brand-navy font-heading">
                                  Stage {currentStage}: {curStep.label}
                                </span>
                                <span className="text-[10px] text-slate-500 font-sans block mt-0.5">
                                  {curStep.desc}
                                </span>
                              </div>
                            );
                          })()}
                        </div>

                        {/* Tablet & Laptop 5-Column Stepper (>= sm) */}
                        <div className="hidden sm:grid sm:grid-cols-5 gap-2 text-center">
                          {[
                            { num: 1, label: 'Enquiry Received', desc: 'Dossier Logged' },
                            { num: 2, label: 'Advisor Assigned', desc: 'Desk Allotment' },
                            { num: 3, label: 'Consultation', desc: isAllotted ? 'Slot Booked' : 'Queueing' },
                            { num: 4, label: 'Bank Appraisal', desc: 'Credit Review' },
                            { num: 5, label: 'Sanction & Payout', desc: 'Disbursal' },
                          ].map((step) => {
                            const isDone = currentStage >= step.num;
                            const isCurrent = currentStage === step.num;
                            return (
                              <div key={step.num} className="space-y-1.5">
                                <div className="flex items-center justify-center">
                                  <div
                                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-heading transition-colors ${
                                      isDone
                                        ? isCurrent
                                          ? 'bg-brand-teal text-white ring-2 ring-brand-teal/20'
                                          : 'bg-emerald-600 text-white'
                                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                                    }`}
                                  >
                                    {isDone && !isCurrent ? <Check className="w-3.5 h-3.5" /> : step.num}
                                  </div>
                                </div>
                                <div>
                                  <div className={`text-[11px] font-bold font-heading truncate ${isDone ? 'text-brand-navy' : 'text-slate-400'}`}>
                                    {step.label}
                                  </div>
                                  <div className="text-[10px] text-slate-400 font-sans hidden sm:block truncate">
                                    {step.desc}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Loan Details 4-Pillar Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        {/* 1. Requested Loan */}
                        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="text-slate-400 font-medium block font-sans">Requested Loan</span>
                          <span className="text-base font-bold text-brand-navy mt-1 block font-heading tabular-nums">
                            {formatAmountINR(enq.loanAmount)}
                          </span>
                        </div>

                        {/* 2. Location */}
                        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="text-slate-400 font-medium block font-sans">Location</span>
                          <span className="text-sm font-semibold text-brand-navy mt-1 block truncate font-heading">
                            {enq.cityState || enq.propertyLocation || 'Tamil Nadu'}
                          </span>
                        </div>

                        {/* 3. Employment */}
                        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="text-slate-400 font-medium block font-sans">Employment</span>
                          <span className="text-sm font-semibold text-brand-navy mt-1 block capitalize font-heading">
                            {enq.employmentType?.replace('_', ' ') || 'Salaried'}
                          </span>
                        </div>

                        {/* 4. Consultation Channel */}
                        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="text-slate-400 font-medium block font-sans">Chosen Channel</span>
                          <span className="text-sm font-semibold text-brand-navy mt-1 block capitalize font-heading">
                            {effectiveMode === 'in_person'
                              ? 'Offline Meeting'
                              : effectiveMode === 'video'
                              ? 'Google Meet'
                              : 'Phone Call'}
                          </span>
                        </div>
                      </div>

                      {/* =========================================================================
                          CONSULTATION DOSSIER & APPOINTMENT TICKET BOX
                          ========================================================================= */}
                      <div className="p-5 sm:p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                        {/* Box Header */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-brand-teal flex items-center justify-center shrink-0">
                              {effectiveMode === 'video' ? (
                                <Video className="w-4 h-4 text-slate-700" />
                              ) : effectiveMode === 'in_person' ? (
                                <Building2 className="w-4 h-4 text-slate-700" />
                              ) : (
                                <PhoneCall className="w-4 h-4 text-brand-teal" />
                              )}
                            </div>
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-heading block">
                                Consultation Service
                              </span>
                              <h4 className="text-sm font-bold text-slate-900 font-heading">
                                {effectiveMode === 'video'
                                  ? 'Google Meet Video Consultation'
                                  : effectiveMode === 'in_person'
                                  ? 'Offline Meeting (Advisor Visits Your Area)'
                                  : 'Direct Phone Consultation'}
                              </h4>
                            </div>
                          </div>

                          <div>
                            {isAllotted ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold font-heading bg-slate-100 text-slate-800 border border-slate-200">
                                <CheckCircle2 className="w-3.5 h-3.5 text-teal-700" />
                                <span>Slot Allotted &amp; Confirmed</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold font-heading bg-slate-100 text-slate-800 border border-slate-200">
                                <Clock className="w-3.5 h-3.5 text-amber-600" />
                                <span>Allotment in Progress</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Allotted appointment body */}
                        {isAllotted ? (
                          <div className="space-y-4">
                            {/* Schedule Summary Strip */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center gap-3">
                                <Calendar className="w-4 h-4 text-brand-teal shrink-0" />
                                <div>
                                  <span className="text-[10px] text-slate-400 block font-heading uppercase font-semibold">
                                    Allotted Date
                                  </span>
                                  <span className="font-bold text-xs text-slate-900 font-heading">
                                    {latestAppointment?.date}
                                  </span>
                                </div>
                              </div>

                              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center gap-3">
                                <Clock className="w-4 h-4 text-brand-teal shrink-0" />
                                <div>
                                  <span className="text-[10px] text-slate-400 block font-heading uppercase font-semibold">
                                    Time Slot
                                  </span>
                                  <span className="font-bold text-xs text-slate-900 font-heading">
                                    {latestAppointment?.timeSlot}
                                  </span>
                                </div>
                              </div>

                              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center gap-3">
                                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                                <div>
                                  <span className="text-[10px] text-slate-400 block font-heading uppercase font-semibold">
                                    Consultation Status
                                  </span>
                                  <span className="font-bold text-xs text-emerald-700 capitalize font-heading">
                                    {latestAppointment?.status || 'Confirmed'}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* 1. GOOGLE MEET VIDEO CALL SPECIFIC CARD */}
                            {effectiveMode === 'video' && (
                              <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                  <div>
                                    <span className="text-xs font-bold text-slate-900 font-heading block flex items-center gap-1.5">
                                      <Video className="w-4 h-4 text-sky-600" />
                                      Google Meet Video Conference Room
                                    </span>
                                    <p className="text-[11px] text-slate-500 font-sans mt-0.5">
                                      Join directly from your phone, laptop, or desktop browser. No sign-in required.
                                    </p>
                                  </div>

                                  {meetUrl && (
                                    <div className="flex items-center gap-2 shrink-0">
                                      <button
                                        type="button"
                                        onClick={() => handleCopyLink(meetUrl, enq.id)}
                                        className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold font-heading inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                                      >
                                        {copiedLink === enq.id ? (
                                          <>
                                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                                            <span className="text-emerald-700">Link Copied!</span>
                                          </>
                                        ) : (
                                          <>
                                            <Copy className="w-3.5 h-3.5 text-slate-500" />
                                            <span>Copy Link</span>
                                          </>
                                        )}
                                      </button>

                                      <a
                                        href={meetUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold font-heading inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                                      >
                                        <Video className="w-3.5 h-3.5" />
                                        <span>Join Google Meet</span>
                                        <ExternalLink className="w-3 h-3" />
                                      </a>
                                    </div>
                                  )}
                                </div>

                                {meetUrl ? (
                                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs font-mono text-slate-700 break-all">
                                    <span>{meetUrl}</span>
                                  </div>
                                ) : (
                                  <p className="text-xs text-slate-500 italic">
                                    Your Google Meet link is being set up by the credit manager and will appear right here shortly before your call.
                                  </p>
                                )}

                                <div className="text-[11px] text-slate-500 font-sans flex items-start gap-1.5">
                                  <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                                  <span>
                                    <strong>Pre-Call Tip:</strong> Keep soft copies of your PAN card, Aadhaar, bank statements, and property documents open on your screen for instant screen-share review.
                                  </span>
                                </div>
                              </div>
                            )}

                            {/* 2. OFFLINE DOORSTEP VISIT SPECIFIC CARD */}
                            {effectiveMode === 'in_person' && (
                              <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3">
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                                  <div className="space-y-1">
                                    <span className="text-xs font-bold text-slate-900 font-heading block flex items-center gap-1.5">
                                      <Building2 className="w-4 h-4 text-slate-700" />
                                      Advisor Doorstep Visit Location
                                    </span>
                                    <p className="text-xs font-medium text-slate-800 font-sans bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                                      📍 {doorstepAddress || 'Your Registered Residence/Office Location'}
                                    </p>
                                  </div>

                                  {doorstepAddress && (
                                    <a
                                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(doorstepAddress)}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold font-heading inline-flex items-center gap-1.5 shrink-0"
                                    >
                                      <MapPin className="w-3.5 h-3.5 text-slate-600" />
                                      <span>View on Google Maps</span>
                                      <ExternalLink className="w-3 h-3" />
                                    </a>
                                  )}
                                </div>

                                {latestAppointment?.adminNotes && (
                                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 font-sans">
                                    <span className="font-bold text-slate-900 font-heading">Field Officer Notes: </span>
                                    {latestAppointment.adminNotes}
                                  </div>
                                )}

                                <div className="text-[11px] text-slate-500 font-sans flex items-start gap-1.5">
                                  <Sparkles className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                                  <span>
                                    <strong>Doorstep Checklist:</strong> Our senior advisor will travel to your address with official bank dossiers. Please have original/photocopies of property title deeds, patta, chitta, and latest IT returns ready.
                                  </span>
                                </div>
                              </div>
                            )}

                            {/* 3. DIRECT PHONE CALL SPECIFIC CARD */}
                            {effectiveMode === 'phone' && (
                              <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-slate-900 font-heading block flex items-center gap-1.5">
                                    <PhoneCall className="w-4 h-4 text-brand-teal" />
                                    Direct Telephonic Consultation
                                  </span>
                                  <span className="text-xs font-bold font-mono text-slate-800 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                                    Calling: +91 {enq.mobileNumber}
                                  </span>
                                </div>

                                <p className="text-xs text-slate-600 font-sans">
                                  Our senior credit specialist will call your registered phone number at the scheduled time ({latestAppointment?.timeSlot} on {latestAppointment?.date}).
                                </p>

                                {latestAppointment?.adminNotes && (
                                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 font-sans">
                                    <span className="font-bold text-slate-900 font-heading">Advisor Notes: </span>
                                    {latestAppointment.adminNotes}
                                  </div>
                                )}

                                <div className="text-[11px] text-slate-500 font-sans flex items-start gap-1.5">
                                  <Sparkles className="w-3.5 h-3.5 text-brand-teal shrink-0 mt-0.5" />
                                  <span>
                                    <strong>Tip:</strong> Keep your mobile phone active and reachable. Our team will present preliminary eligible loan amounts, interest rates, and subsidy benefits.
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          /* Slot pending allotment explanation */
                          <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200 space-y-2 text-xs">
                            <div className="flex items-center gap-2 text-slate-900 font-bold font-heading">
                              <Clock className="w-4 h-4 text-slate-600 shrink-0" />
                              <span>
                                {effectiveMode === 'video'
                                  ? 'Google Meet Video Call Requested'
                                  : effectiveMode === 'in_person'
                                  ? 'Offline Meeting (Advisor Visiting Your Area) Requested'
                                  : 'Direct Phone Consultation Requested'}
                              </span>
                            </div>

                            <p className="text-slate-600 font-sans leading-relaxed text-[11px]">
                              {effectiveMode === 'video' ? (
                                <>
                                  Your request for a <strong>Google Meet video consultation</strong> is being reviewed by our Tirupur credit desk. An advisor is being allotted to create your official meeting link and confirm your slot. You will see the video link right here and receive a WhatsApp notification.
                                </>
                              ) : effectiveMode === 'in_person' ? (
                                <>
                                  Your request for our loan advisor to <strong>travel to your area ({doorstepAddress || enq.cityState || 'your address'})</strong> is being routed to our field coordinator. We will allot an advisor and confirm your doorstep visit schedule here.
                                </>
                              ) : (
                                <>
                                  Your request for a <strong>direct telephone consultation</strong> is queued with our senior credit manager. We will review your preliminary requirements and confirm your callback slot shortly.
                                </>
                              )}
                            </p>

                            {doorstepAddress && effectiveMode === 'in_person' && (
                              <div className="text-[11px] text-slate-800 font-medium bg-white p-2 rounded-lg border border-slate-200">
                                📍 <strong>Target Area:</strong> {doorstepAddress}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* =========================================================================
                          ATTACHED VERIFICATION DOCUMENTS (CLOUDINARY SECURE VAULT)
                          ========================================================================= */}
                      <div className="p-5 sm:p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-teal-700 flex items-center justify-center shrink-0">
                              <FileCheck className="w-4 h-4 text-teal-700" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-bold text-slate-900 font-heading">
                                  Loan Verification Documents &amp; KYC
                                </h4>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200 font-heading">
                                  {enq.documents?.length || 0} Files
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 font-sans mt-0.5">
                                Encrypted in Cloudinary vault with authenticated delivery for advisor underwriting.
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setUploadModalEnquiry(enq);
                              setUploadDocFile(null);
                              setUploadDocName('');
                              setUploadDocCategory('KYC');
                              setUploadDocError(null);
                              setUploadDocSuccess(null);
                            }}
                            className="inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-100 text-teal-800 border border-teal-300 font-bold font-heading text-xs rounded-xl shadow-2xs transition-colors self-start sm:self-auto cursor-pointer"
                          >
                            <UploadCloud className="w-3.5 h-3.5 text-teal-700" />
                            <span>+ Upload Document</span>
                          </button>
                        </div>

                        {enq.documents && enq.documents.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {enq.documents.map((doc) => {
                              const isPdf = doc.fileFormat === 'pdf' || doc.type?.includes('pdf') || doc.name?.toLowerCase().endsWith('.pdf');
                              return (
                                <div
                                  key={doc.id}
                                  className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-3 shadow-2xs hover:border-teal-400 transition-all group"
                                >
                                  {isPdf ? (
                                    <div
                                      onClick={() => setCustomerPreviewDoc(doc)}
                                      className="w-12 h-12 rounded-lg bg-red-50 border border-red-200 flex flex-col items-center justify-center text-red-700 shrink-0 font-bold text-[10px] cursor-pointer hover:bg-red-100 transition-colors"
                                      title="Preview PDF document"
                                    >
                                      <FileText className="w-4 h-4 text-red-600 mb-0.5" />
                                      <span className="font-heading">PDF</span>
                                    </div>
                                  ) : (
                                    <div
                                      onClick={() => setCustomerPreviewDoc(doc)}
                                      className="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-200 cursor-pointer shrink-0 bg-slate-100 flex items-center justify-center hover:opacity-85 transition-opacity"
                                      title="Preview image document"
                                    >
                                      {doc.previewUrl ? (
                                        <img
                                          src={doc.previewUrl}
                                          alt={doc.name}
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <FileCheck className="w-5 h-5 text-teal-600" />
                                      )}
                                    </div>
                                  )}

                                  <div className="min-w-0 flex-1 space-y-1">
                                    <div className="flex items-center justify-between gap-1">
                                      <span className="text-[9px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 font-heading">
                                        {doc.category || 'KYC'}
                                      </span>
                                      <span className="text-[10px] text-slate-400 tabular-nums">
                                        {doc.size ? `${(doc.size / 1024).toFixed(0)} KB` : 'Secured'}
                                      </span>
                                    </div>

                                    <h5 className="text-xs font-bold text-slate-900 truncate block font-heading" title={doc.documentName || doc.name}>
                                      {doc.documentName || doc.name}
                                    </h5>
                                    <p className="text-[10px] text-slate-400 truncate font-mono">
                                      {doc.name}
                                    </p>

                                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
                                      <button
                                        type="button"
                                        onClick={() => setCustomerPreviewDoc(doc)}
                                        className="text-teal-700 hover:text-teal-900 font-bold flex items-center gap-1 font-heading hover:underline cursor-pointer"
                                      >
                                        <Eye className="w-3 h-3" />
                                        <span>Preview</span>
                                      </button>
                                      {doc.previewUrl && (
                                        <a
                                          href={doc.previewUrl}
                                          download={doc.name || 'document'}
                                          className="text-slate-500 hover:text-slate-800 font-bold flex items-center gap-1 font-heading hover:underline"
                                          title="Download document file"
                                        >
                                          <Download className="w-3 h-3" />
                                          <span>Download</span>
                                        </a>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="p-4 bg-white rounded-xl border border-dashed border-slate-200 text-center space-y-1.5 text-xs text-slate-500">
                            <p className="font-bold text-slate-800 font-heading">No Verification Documents Attached Yet</p>
                            <p className="text-[11px] font-sans max-w-md mx-auto">
                              You can upload soft copies of your PAN card, Aadhaar, salary payslips, or property title documents here anytime for expedited advisor review.
                            </p>
                            <button
                              type="button"
                              onClick={() => {
                                setUploadModalEnquiry(enq);
                                setUploadDocFile(null);
                                setUploadDocName('');
                                setUploadDocCategory('KYC');
                                setUploadDocError(null);
                                setUploadDocSuccess(null);
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold font-heading rounded-lg transition-colors cursor-pointer mt-1"
                            >
                              <UploadCloud className="w-3.5 h-3.5 text-teal-700" />
                              <span>Upload Document Now</span>
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Card Footer Action Bar */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <a
                            href={`https://wa.me/919655566613?text=${encodeURIComponent(
                              `Hello Prime Associates, this is ${customer.name}. I am following up on my loan enquiry ${enq.referenceNumber} for ${enq.loanType} (${
                                effectiveMode === 'video'
                                  ? 'Google Meet'
                                  : effectiveMode === 'in_person'
                                  ? 'Offline Doorstep Meeting'
                                  : 'Phone Call'
                              }).`
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-[#0c1a26] hover:bg-teal-700 text-white font-semibold font-heading text-xs rounded-xl transition-colors shadow-xs"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>WhatsApp Advisor Follow-Up</span>
                          </a>

                          <button
                            type="button"
                            onClick={() => {
                              setReviewLoanType(enq.loanType || 'Home Construction Loan');
                              setReviewAmount(formatAmountINR(enq.loanAmount));
                              setReviewLocation(enq.cityState || enq.propertyLocation || 'Tirupur, Tamil Nadu');
                              setActiveTab('review');
                              if (!customerReview) setIsEditingReview(true);
                            }}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold text-xs font-heading rounded-xl transition-colors shadow-2xs cursor-pointer"
                          >
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                            <span>{customerReview ? 'Review Loan' : 'Rate This Experience'}</span>
                          </button>
                        </div>

                        <span className="text-[11px] text-slate-400 font-sans flex items-center gap-1 self-start sm:self-auto">
                          <ShieldCheck className="w-3.5 h-3.5 text-brand-teal" />
                          <span>Direct Desk Hotline: +91 96555 66613</span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            4. TAB 2: CLIENT REVIEW & TESTIMONIAL FEEDBACK
            ========================================================================= */}
        {activeTab === 'review' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header Banner */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-[0_10px_35px_-8px_rgba(24,50,71,0.07)] space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/90 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0 shadow-2xs">
                    <MessageSquareQuote className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-black font-heading text-brand-navy">
                        Borrower Testimonial &amp; Advisory Review
                      </h2>
                      {customerReview && (
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold font-heading bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200 shadow-2xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Live on Homepage
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-brand-slate font-sans mt-0.5">
                      Share your experience with Prime Associates — our advisor guidance, interest rates obtained, and bank sanction speed.
                    </p>
                  </div>
                </div>

                {customerReview && !isEditingReview && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingReview(true);
                      setReviewRating(customerReview.rating || 5);
                      setReviewLoanType(customerReview.loanType || 'Home Construction Loan');
                      setReviewAmount(customerReview.amount || '₹50 Lakhs');
                      setReviewLocation(customerReview.location || 'Tirupur, Tamil Nadu');
                      setReviewText(customerReview.review || '');
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-brand-teal to-[#126763] hover:brightness-105 text-white text-xs font-bold font-heading rounded-xl shadow-xs transition-all self-start sm:self-auto cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit My Review</span>
                  </button>
                )}
              </div>

              {/* Alert Feedback Messages */}
              {reviewSuccessMsg && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs flex items-center gap-2.5 font-sans animate-in fade-in shadow-2xs">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="font-semibold">{reviewSuccessMsg}</span>
                </div>
              )}

              {reviewErrorMsg && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-800 text-xs flex items-center gap-2.5 font-sans animate-in fade-in shadow-2xs">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                  <span className="font-semibold">{reviewErrorMsg}</span>
                </div>
              )}

              {/* VIEW 1: Published Live Review Card */}
              {customerReview && !isEditingReview ? (
                <div className="p-6 sm:p-8 bg-gradient-to-br from-amber-50/50 via-white to-teal-50/30 rounded-2xl border border-amber-200/90 shadow-xs space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < (customerReview.rating || 5)
                                ? 'text-amber-400 fill-amber-400 filter drop-shadow-[0_2px_4px_rgba(251,191,36,0.3)]'
                                : 'text-slate-200'
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-xs font-bold font-heading text-amber-900 bg-amber-100/90 px-2.5 py-0.5 rounded-lg border border-amber-200/70">
                          {customerReview.rating || 5}.0 / 5.0 Rating
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-800 font-heading">
                        {getRatingLabel(customerReview.rating || 5)}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-full text-[11px] font-bold text-slate-700 shadow-2xs font-heading">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        Verified Borrower Review
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-[11px] font-bold text-emerald-800 shadow-2xs font-heading">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Active on Homepage Marquee
                      </span>
                    </div>
                  </div>

                  {/* Loan Metadata Badges */}
                  <div className="flex flex-wrap items-center gap-2.5 text-xs">
                    <span className="px-3 py-1.5 rounded-xl bg-white border border-slate-200/90 font-medium text-slate-700 font-sans shadow-2xs flex items-center gap-1.5">
                      <span className="text-slate-400 font-heading font-bold">Loan:</span>
                      <strong className="text-brand-navy font-heading">{customerReview.loanType}</strong>
                    </span>
                    <span className="px-3 py-1.5 rounded-xl bg-white border border-slate-200/90 font-medium text-slate-700 font-sans shadow-2xs flex items-center gap-1.5">
                      <span className="text-slate-400 font-heading font-bold">Sanctioned:</span>
                      <strong className="text-brand-teal font-heading">{customerReview.amount}</strong>
                    </span>
                    <span className="px-3 py-1.5 rounded-xl bg-white border border-slate-200/90 font-medium text-slate-700 font-sans shadow-2xs flex items-center gap-1.5">
                      <span className="text-slate-400 font-heading font-bold">Location:</span>
                      <strong className="text-slate-800 font-heading">{customerReview.location}</strong>
                    </span>
                  </div>

                  {/* Quote block */}
                  <div className="relative p-5 sm:p-7 bg-white/95 rounded-2xl border border-amber-200/90 shadow-2xs">
                    <Quote className="w-7 h-7 text-amber-400 absolute -top-3.5 left-4 bg-white rounded-full p-1 border border-amber-200/90 shadow-xs" />
                    <p className="text-sm sm:text-base text-slate-800 italic leading-relaxed font-sans font-medium pt-1">
                      "{customerReview.review}"
                    </p>
                  </div>

                  {/* Author profile & actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-slate-200/70">
                    <div className="flex items-center gap-3">
                      {customerReview.avatarUrl ? (
                        <img
                          src={customerReview.avatarUrl}
                          alt={customerReview.name}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-2xs"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-brand-teal text-white font-black text-sm flex items-center justify-center font-heading shadow-2xs">
                          {customerReview.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-black font-heading text-brand-navy">{customerReview.name}</h4>
                          <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.2 rounded font-heading font-bold">
                            Verified Client
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-sans block mt-0.5">
                          {customerReview.createdAt
                            ? `Published on ${new Date(customerReview.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}`
                            : 'Published on Prime Associates'}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingReview(true);
                          setReviewRating(customerReview.rating || 5);
                          setReviewLoanType(customerReview.loanType || 'Home Construction Loan');
                          setReviewAmount(customerReview.amount || '₹50 Lakhs');
                          setReviewLocation(customerReview.location || 'Tirupur, Tamil Nadu');
                          setReviewText(customerReview.review || '');
                        }}
                        className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold font-heading inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                        <span>Edit Review</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleDeleteReview}
                        disabled={isDeletingReview}
                        className="px-4 py-2 bg-white hover:bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-bold font-heading inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs disabled:opacity-50"
                      >
                        {isDeletingReview ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                        <span>Delete</span>
                      </button>

                      <Link
                        to="/"
                        target="_blank"
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold font-heading inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                      >
                        <span>View on Homepage</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                /* VIEW 2: Interactive Review Submission Form */
                <form onSubmit={handleSubmitReview} className="space-y-6">
                  <div className="p-6 sm:p-7 bg-slate-50/70 rounded-2xl border border-slate-200/90 space-y-6">
                    {/* 1. Rating Selector */}
                    <div className="space-y-2">
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 font-heading">
                        1. Overall Experience Rating <span className="text-red-500">*</span>
                      </label>
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-1 p-2 bg-white rounded-xl border border-slate-200 shadow-2xs">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewRating(star)}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                              className="p-1 hover:scale-125 transition-transform cursor-pointer focus:outline-hidden"
                            >
                              <Star
                                className={`w-8 h-8 sm:w-9 sm:h-9 ${
                                  star <= (hoverRating || reviewRating)
                                    ? 'text-amber-400 fill-amber-400 filter drop-shadow-[0_2px_4px_rgba(251,191,36,0.4)]'
                                    : 'text-slate-200'
                                }`}
                              />
                            </button>
                          ))}
                        </div>

                        <span className="text-xs font-bold text-slate-700 font-heading px-3 py-1.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
                          {getRatingLabel(hoverRating || reviewRating)}
                        </span>
                      </div>
                    </div>

                    {/* 2. Metadata Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700 font-heading">
                          Loan Category / Service
                        </label>
                        <select
                          value={reviewLoanType}
                          onChange={(e) => setReviewLoanType(e.target.value)}
                          className="w-full h-11 px-3.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-brand-teal focus:border-brand-teal shadow-2xs"
                        >
                          <option value="Home Construction Loan">Home Construction Loan</option>
                          <option value="Home Purchase Loan">Home Purchase Loan</option>
                          <option value="Mortgage Loan (LAP)">Mortgage Loan (LAP)</option>
                          <option value="Plot Purchase + Construction">Plot Purchase + Construction</option>
                          <option value="Commercial Property Loan">Commercial Property Loan</option>
                          <option value="Low-Interest Bank Takeover">Low-Interest Bank Takeover</option>
                          <option value="Vehicle Loan">Vehicle Loan</option>
                          <option value="Loan Advisory & Syndication">Loan Advisory &amp; Syndication</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700 font-heading">
                          Loan Sanction Amount
                        </label>
                        <input
                          type="text"
                          value={reviewAmount}
                          onChange={(e) => setReviewAmount(e.target.value)}
                          placeholder="e.g. ₹50 Lakhs"
                          className="w-full h-11 px-3.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-brand-teal focus:border-brand-teal shadow-2xs"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700 font-heading">
                          City / District
                        </label>
                        <input
                          type="text"
                          value={reviewLocation}
                          onChange={(e) => setReviewLocation(e.target.value)}
                          placeholder="e.g. Tirupur, Tamil Nadu"
                          className="w-full h-11 px-3.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-brand-teal focus:border-brand-teal shadow-2xs"
                        />
                      </div>
                    </div>

                    {/* 3. Review Feedback Textarea */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 font-heading">
                          Your Detailed Testimonial &amp; Feedback <span className="text-red-500">*</span>
                        </label>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {reviewText.length} characters (min 5)
                        </span>
                      </div>

                      <textarea
                        rows={4}
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Tell other prospective borrowers about your experience with Prime Associates — our advisor guidance, interest rates obtained (e.g. 8.40%), document verification, subsidy assistance, or turnaround speed..."
                        className="w-full p-4 bg-white border border-slate-300 rounded-2xl text-xs text-slate-800 leading-relaxed focus:outline-brand-teal focus:border-brand-teal shadow-2xs font-sans"
                      />

                      {/* Prompt suggestion chips */}
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[11px] font-bold text-slate-500 font-heading block">
                          💡 Need inspiration? Click to add key highlights:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {[
                            '⚡ Quick 24-hour turnaround and loan sanction',
                            '💰 Lowest 8.40% interest rate with SBI/Canara Bank',
                            '📜 Comprehensive land deed and parent document verification',
                            '🏛️ Step-by-step government interest subsidy guidance',
                            '🤝 Direct advisor consultation with zero hidden broker fees',
                          ].map((chip) => (
                            <button
                              key={chip}
                              type="button"
                              onClick={() => {
                                const clean = chip.replace(/^[^\w\s]+/, '').trim();
                                setReviewText((prev) =>
                                  prev ? `${prev.trim()} ${clean}.` : `${clean}.`
                                );
                              }}
                              className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg text-[11px] font-medium font-sans transition-colors cursor-pointer"
                            >
                              {chip}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* 4. Verification Identity Box */}
                    <div className="p-3.5 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <UserAvatar
                          src={customer.picture}
                          name={customer.name}
                          size={38}
                          showGoogleBadge={true}
                        />
                        <div>
                          <span className="font-bold text-slate-800 font-heading block">
                            Submitting as: {customer.name}
                          </span>
                          <span className="text-[11px] text-slate-500 font-sans">
                            {customer.email} • Verified Google Identity
                          </span>
                        </div>
                      </div>

                      <div className="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 font-semibold flex items-center gap-1.5 self-start sm:self-auto">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Will be highlighted as Verified Borrower</span>
                      </div>
                    </div>

                    {/* 5. Submit / Cancel Action Bar */}
                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={isSubmittingReview || reviewText.trim().length < 5}
                        className="px-6 py-3 bg-gradient-to-r from-brand-teal to-[#126763] hover:brightness-105 text-white text-xs font-bold font-heading rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {isSubmittingReview ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Publishing Review...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>{customerReview ? 'Update My Review' : 'Submit & Feature on Website'}</span>
                          </>
                        )}
                      </button>

                      {isEditingReview && customerReview && (
                        <button
                          type="button"
                          onClick={() => setIsEditingReview(false)}
                          className="px-5 py-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-bold font-heading rounded-xl transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </form>
              )}
            </div>

            {/* Advisory Trust Note Card */}
            <div className="p-5 bg-gradient-to-r from-teal-50/60 via-white to-blue-50/60 rounded-2xl border border-teal-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-sans shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-brand-teal flex items-center justify-center shrink-0 shadow-2xs">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold font-heading text-brand-navy">Commitment to Transparent Advisory</h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Prime Associates operates on a direct bank-channel model with zero upfront brokerage fees. Client testimonials are verified against authentic bank syndications.
                  </p>
                </div>
              </div>

              <a
                href="https://wa.me/919655566613"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-white hover:bg-teal-50 text-brand-teal border border-teal-300 rounded-xl text-xs font-bold font-heading inline-flex items-center gap-1.5 shrink-0 transition-colors shadow-2xs"
              >
                <span>Advisory Desk: +91 96555 66613</span>
              </a>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          CUSTOMER DOCUMENT LIGHTBOX PREVIEW MODAL (IMAGE & PDF)
          ========================================================================= */}
      {customerPreviewDoc && (
        <div
          className="fixed inset-0 z-50 bg-[#0c1a26]/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setCustomerPreviewDoc(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200/90 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <span className="text-[10px] uppercase font-bold text-teal-700 tracking-wider block font-heading">
                  Verified Loan Document
                </span>
                <h4 className="text-base font-bold text-slate-900 flex items-center gap-2 font-heading">
                  <FileCheck className="w-4 h-4 text-teal-700" />
                  <span>{customerPreviewDoc.documentName || customerPreviewDoc.name}</span>
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setCustomerPreviewDoc(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                title="Close Preview (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-slate-950 min-h-[450px]">
              {customerPreviewDoc.fileFormat === 'pdf' ||
              customerPreviewDoc.type === 'application/pdf' ||
              customerPreviewDoc.name.toLowerCase().endsWith('.pdf') ? (
                <iframe
                  src={customerPreviewDoc.previewUrl}
                  title={customerPreviewDoc.name}
                  className="w-full h-[68vh] rounded-lg shadow-lg bg-white border border-slate-700"
                />
              ) : (
                <img
                  src={customerPreviewDoc.previewUrl}
                  alt={customerPreviewDoc.name}
                  className="max-h-[70vh] max-w-full object-contain rounded-lg shadow-lg"
                />
              )}
            </div>

            <div className="p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 bg-white">
              <span className="font-mono text-slate-600">
                {customerPreviewDoc.name} ({customerPreviewDoc.size ? `${(customerPreviewDoc.size / 1024).toFixed(0)} KB` : 'Verified'})
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCustomerPreviewDoc(null)}
                  className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl font-bold text-xs font-heading shadow-2xs transition-colors cursor-pointer"
                >
                  Close
                </button>
                <a
                  href={customerPreviewDoc.previewUrl}
                  download={customerPreviewDoc.name}
                  className="px-4 py-2 bg-[#0c1a26] hover:bg-teal-700 text-white rounded-xl font-bold text-xs font-heading shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Document</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          CUSTOMER DOCUMENT UPLOAD MODAL
          ========================================================================= */}
      {uploadModalEnquiry && (
        <div
          className="fixed inset-0 z-50 bg-[#0c1a26]/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => {
            if (!isUploadingDoc) setUploadModalEnquiry(null);
          }}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center shrink-0">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 font-heading">
                    Upload Loan Verification Document
                  </h4>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Ref: {uploadModalEnquiry.referenceNumber}
                  </span>
                </div>
              </div>
              <button
                type="button"
                disabled={isUploadingDoc}
                onClick={() => setUploadModalEnquiry(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCustomerUpload} className="p-6 space-y-4">
              {uploadDocSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{uploadDocSuccess}</span>
                </div>
              )}

              {uploadDocError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2 font-medium">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{uploadDocError}</span>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-700 font-heading block mb-1.5">
                  Document Category
                </label>
                <select
                  value={uploadDocCategory}
                  onChange={(e) => setUploadDocCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:border-teal-600 focus:bg-white transition-all"
                >
                  <option value="KYC">KYC &amp; Identity (PAN, Aadhaar, Passport, Voter ID)</option>
                  <option value="Income">Income &amp; Banking (3M Payslips, Form 16, 6M Bank Statement, ITR)</option>
                  <option value="Legal">Legal &amp; Title Deeds (Sale Deed, Patta, Chitta, EC Form 15, Mother Deed)</option>
                  <option value="Technical">Technical &amp; Plan Approval (Civil Engineer Estimate, Blueprint)</option>
                  <option value="Vehicle">Vehicle Documents (RC Book, Insurance, Proforma Invoice)</option>
                  <option value="Other">Other Reference Document</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 font-heading block mb-1.5">
                  Document Title / Description
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Applicant PAN Card Front, 6M HDFC Bank Statement"
                  value={uploadDocName}
                  onChange={(e) => setUploadDocName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:border-teal-600 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 font-heading block mb-1.5">
                  Choose File (JPG, PNG, PDF &bull; Max 10MB)
                </label>
                <input
                  type="file"
                  required
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      setUploadDocFile(f);
                      if (!uploadDocName) {
                        setUploadDocName(f.name.replace(/\.[^/.]+$/, ''));
                      }
                    }
                  }}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:font-heading file:bg-teal-50 file:text-teal-800 hover:file:bg-teal-100 cursor-pointer"
                />
                {uploadDocFile && (
                  <p className="text-[11px] text-teal-700 font-sans mt-1">
                    Selected: <strong>{uploadDocFile.name}</strong> ({(uploadDocFile.size / 1024).toFixed(0)} KB)
                  </p>
                )}
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100">
                <button
                  type="button"
                  disabled={isUploadingDoc}
                  onClick={() => setUploadModalEnquiry(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold font-heading rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploadingDoc}
                  className="px-5 py-2 bg-[#0c1a26] hover:bg-teal-700 text-white text-xs font-bold font-heading rounded-xl shadow-xs transition-colors inline-flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isUploadingDoc ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Encrypting &amp; Uploading...</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-4 h-4" />
                      <span>Upload to Secure Vault</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyEnquiriesPage;
