import React, { useEffect, useState } from 'react';
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
} from 'lucide-react';
import { useCustomerAuth } from '../../../context/CustomerAuthContext';
import { GoogleIcon } from '../../../components/common/GoogleIcon';
import { triggerGoogleOAuth } from '../../../utils/googleAuth';
import { Enquiry } from '../../../types';

export const MyEnquiriesPage: React.FC = () => {
  const { customer, isAuthenticated, isLoading, enquiries, loginWithGoogle, logout, refreshEnquiries } = useCustomerAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const handleCopyLink = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (isAuthenticated) {
      refreshEnquiries();
    }
  }, [isAuthenticated, refreshEnquiries]);

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

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('closed') || s.includes('converted') || s.includes('sanction') || s.includes('approved')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-800 text-xs font-bold rounded-full border border-slate-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-slate-600" />
          <span>Closed</span>
        </span>
      );
    }
    if (s.includes('process') || s.includes('review')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 text-teal-800 text-xs font-bold rounded-full border border-teal-200">
          <Clock className="w-3.5 h-3.5 text-teal-600" />
          <span>Process Started</span>
        </span>
      );
    }
    if (s.includes('slot') || s.includes('appoint') || s.includes('confirmed') || s.includes('booked')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-50 text-sky-800 text-xs font-bold rounded-full border border-sky-200">
          <Calendar className="w-3.5 h-3.5 text-sky-600" />
          <span>Slot Booked</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 text-xs font-bold rounded-full border border-amber-200">
        <Clock className="w-3.5 h-3.5 text-amber-600" />
        <span>Pending</span>
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F7F9FB] pt-28 pb-20 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-6xl mx-auto space-y-8 animate-pulse">
          {/* Banner Skeleton */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-200 shrink-0" />
              <div className="space-y-2">
                <div className="h-5 bg-slate-200 rounded w-48" />
                <div className="h-3 bg-slate-100 rounded w-36" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 bg-slate-200 rounded-xl w-36" />
              <div className="h-10 bg-slate-100 rounded-xl w-24" />
            </div>
          </div>

          {/* Cards Skeleton */}
          <div className="space-y-4">
            <div className="h-5 bg-slate-200 rounded w-56" />
            <div className="grid grid-cols-1 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div className="space-y-2">
                      <div className="h-4 bg-slate-200 rounded w-32" />
                      <div className="h-6 bg-slate-200 rounded w-48" />
                    </div>
                    <div className="h-7 bg-slate-200 rounded-full w-36" />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((j) => (
                      <div key={j} className="space-y-1.5">
                        <div className="h-3 bg-slate-100 rounded w-16" />
                        <div className="h-4 bg-slate-200 rounded w-24" />
                      </div>
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
      <div className="min-h-screen bg-[#F7F9FB] pt-32 pb-20 px-4 sm:px-6 font-sans">
        <div className="max-w-md mx-auto bg-white rounded-3xl shadow-[0_4px_24px_-2px_rgba(24,50,71,0.08)] border border-slate-200/90 p-8 sm:p-10 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-100 mx-auto flex items-center justify-center text-brand-teal">
            <User className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black font-heading text-brand-navy">Borrower Portal</h1>
            <p className="text-xs text-brand-slate leading-relaxed font-sans">
              Sign in with your Google account to track your submitted loan enquiries, view assigned advisor consultation slots, and download sanction notes.
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2 text-left font-sans">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <button
            type="button"
            onClick={() => triggerGoogleLogin()}
            disabled={isSigningIn}
            className="w-full h-12 px-5 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 text-slate-700 font-bold font-heading text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60"
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

          <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-center gap-2 font-sans">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-teal" />
            <span>Secure 256-bit encrypted authentication</span>
          </div>
        </div>
      </div>
    );
  }

  // Signed in: Borrower Dashboard
  return (
    <div className="min-h-screen bg-[#F7F9FB] pt-28 pb-20 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* User Welcome Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-[0_4px_24px_-2px_rgba(24,50,71,0.06)] flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {customer.picture ? (
              <img
                src={customer.picture}
                alt={customer.name}
                className="w-16 h-16 rounded-2xl border-2 border-brand-teal/20 shadow-xs object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-brand-teal text-white text-2xl font-black font-heading flex items-center justify-center shadow-xs">
                {customer.name.charAt(0)}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black font-heading text-brand-navy">Welcome, {customer.name}</h1>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold font-heading px-2 py-0.5 rounded-full">Google Verified</span>
              </div>
              <p className="text-xs text-brand-slate font-sans mt-0.5">{customer.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/enquire"
              className="px-5 py-2.5 bg-brand-teal hover:bg-brand-teal-hover text-white text-xs font-bold font-heading rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Loan Enquiry</span>
            </Link>
            <button
              type="button"
              onClick={logout}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold font-heading rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Enquiries Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-heading text-brand-navy">Your Loan Enquiries &amp; Consultations</h2>
            <span className="text-xs font-semibold text-brand-slate font-sans">
              {enquiries.length} {enquiries.length === 1 ? 'Record' : 'Records'} Found
            </span>
          </div>

          {enquiries.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/90 shadow-xs space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <FileText className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold font-heading text-brand-navy">No Active Loan Enquiries</h3>
                <p className="text-xs text-brand-slate max-w-md mx-auto font-sans">
                  You haven't submitted any loan requests under this Google account yet. Submit an enquiry to check your eligibility with 40+ banking partners.
                </p>
              </div>
              <Link
                to="/enquire"
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-teal hover:bg-brand-teal-hover text-white text-xs font-bold font-heading rounded-xl shadow-xs transition-colors"
              >
                <span>Submit Loan Enquiry</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {enquiries.map((enq) => {
                const latestAppointment = enq.appointments && enq.appointments.length > 0 ? enq.appointments[0] : null;
                const effectiveMode = latestAppointment?.meetingMode || enq.meetingMode || 'phone';
                const isAllotted = Boolean(latestAppointment && latestAppointment.date && latestAppointment.date !== 'Pending Advisor Allotment');

                // Extract doorstep address from notes or location
                const doorstepAddress = enq.additionalNotes?.includes('📍 Doorstep Meeting Address:')
                  ? enq.additionalNotes.split('📍 Doorstep Meeting Address:')[1]?.split('\n')[0]?.trim()
                  : (effectiveMode === 'in_person' ? (enq.propertyLocation || enq.cityState) : null);

                // Extract Google Meet URL
                const meetLinkMatch = latestAppointment?.adminNotes?.match(/(https:\/\/meet\.google\.com\/[a-zA-Z0-9_-]+)/i);
                const meetUrl = meetLinkMatch
                  ? meetLinkMatch[1]
                  : (effectiveMode === 'video' && latestAppointment?.adminNotes?.startsWith('http')
                      ? latestAppointment.adminNotes.trim()
                      : null);

                return (
                  <div
                    key={enq.id}
                    className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-[0_4px_24px_-2px_rgba(24,50,71,0.06)] space-y-6"
                  >
                    {/* Top Row: Ref, Loan Type, Status */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-brand-teal bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100">
                            {enq.referenceNumber}
                          </span>
                          <span className="text-xs text-slate-400 font-sans">
                            • Submitted on {new Date(enq.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                        <h3 className="text-lg font-black font-heading text-brand-navy mt-1">
                          {enq.loanType}
                        </h3>
                      </div>

                      <div>{getStatusBadge(enq.status)}</div>
                    </div>

                    {/* Loan Details Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-slate-400 font-medium block font-sans">Requested Loan</span>
                        <span className="text-sm font-extrabold text-brand-navy mt-0.5 block font-heading tabular-nums">
                          {formatAmountINR(enq.loanAmount)}
                        </span>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-slate-400 font-medium block font-sans">Location</span>
                        <span className="text-sm font-bold text-brand-navy mt-0.5 block truncate font-heading">
                          {enq.cityState || enq.propertyLocation || 'Tamil Nadu'}
                        </span>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-slate-400 font-medium block font-sans">Employment</span>
                        <span className="text-sm font-bold text-brand-navy mt-0.5 block capitalize font-heading">
                          {enq.employmentType?.replace('_', ' ') || 'Salaried'}
                        </span>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-slate-400 font-medium block font-sans">Chosen Channel</span>
                        <span className="text-sm font-bold text-brand-navy mt-0.5 block capitalize font-heading">
                          {effectiveMode === 'in_person'
                            ? 'Offline Meeting'
                            : effectiveMode === 'video'
                            ? 'Google Meet'
                            : 'Phone Call'}
                        </span>
                      </div>
                    </div>

                    {/* CONSULTATION SLOT ALLOTMENT BOX */}
                    <div
                      className={`p-5 sm:p-6 rounded-2xl border space-y-4 shadow-2xs transition-all ${
                        isAllotted
                          ? effectiveMode === 'video'
                            ? 'bg-gradient-to-br from-sky-50/90 via-white to-blue-50/50 border-sky-200/90'
                            : effectiveMode === 'in_person'
                            ? 'bg-gradient-to-br from-purple-50/90 via-white to-teal-50/50 border-purple-200/90'
                            : 'bg-gradient-to-br from-teal-50/90 via-white to-emerald-50/50 border-teal-200/90'
                          : 'bg-gradient-to-br from-amber-50/60 via-white to-slate-50/50 border-amber-200/80'
                      }`}
                    >
                      {/* Box Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200/70">
                        <div className="flex items-center gap-2">
                          {effectiveMode === 'video' ? (
                            <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                              <Video className="w-4 h-4" />
                            </div>
                          ) : effectiveMode === 'in_person' ? (
                            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                              <Building2 className="w-4 h-4" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                              <PhoneCall className="w-4 h-4" />
                            </div>
                          )}
                          <div>
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 font-heading block">
                              Consultation Service
                            </span>
                            <h4 className="text-sm font-extrabold text-slate-900 font-heading">
                              {effectiveMode === 'video'
                                ? 'Google Meet Video Call'
                                : effectiveMode === 'in_person'
                                ? 'Offline Meeting (Advisor Visits Your Area)'
                                : 'Direct Advisor Phone Consultation'}
                            </h4>
                          </div>
                        </div>

                        <div>
                          {isAllotted ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold font-heading bg-emerald-100 text-emerald-800 border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Slot Allotted &amp; Confirmed</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold font-heading bg-amber-100 text-amber-800 border border-amber-200">
                              <Clock className="w-3.5 h-3.5 text-amber-600" />
                              <span>Allotment in Progress</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Content when slot is ALLOTTED */}
                      {isAllotted ? (
                        <div className="space-y-4">
                          {/* Schedule summary tiles */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="p-3 bg-white/90 rounded-xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
                              <Calendar className="w-4 h-4 text-teal-600 shrink-0" />
                              <div>
                                <span className="text-[10px] text-slate-400 block font-heading uppercase">Allotted Date</span>
                                <span className="font-extrabold text-xs text-slate-900 font-heading">
                                  {latestAppointment?.date}
                                </span>
                              </div>
                            </div>

                            <div className="p-3 bg-white/90 rounded-xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
                              <Clock className="w-4 h-4 text-teal-600 shrink-0" />
                              <div>
                                <span className="text-[10px] text-slate-400 block font-heading uppercase">Time Slot</span>
                                <span className="font-extrabold text-xs text-slate-900 font-heading">
                                  {latestAppointment?.timeSlot}
                                </span>
                              </div>
                            </div>

                            <div className="p-3 bg-white/90 rounded-xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
                              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                              <div>
                                <span className="text-[10px] text-slate-400 block font-heading uppercase">Consultation Status</span>
                                <span className="font-extrabold text-xs text-emerald-700 capitalize font-heading">
                                  {latestAppointment?.status || 'Confirmed'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* 1. GOOGLE MEET VIDEO CALL SPECIFIC CARD */}
                          {effectiveMode === 'video' && (
                            <div className="p-4 bg-sky-500/10 border border-sky-300/80 rounded-2xl space-y-3">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div>
                                  <span className="text-xs font-bold text-sky-950 font-heading block flex items-center gap-1.5">
                                    <Video className="w-4 h-4 text-sky-600" />
                                    Google Meet Video Conference Room
                                  </span>
                                  <p className="text-[11px] text-sky-800 font-sans mt-0.5">
                                    Join directly from your phone, laptop, or desktop browser. No sign-in required.
                                  </p>
                                </div>

                                {meetUrl && (
                                  <div className="flex items-center gap-2 shrink-0">
                                    <button
                                      type="button"
                                      onClick={() => handleCopyLink(meetUrl, enq.id)}
                                      className="px-3 py-2 bg-white hover:bg-sky-50 text-sky-800 border border-sky-300 rounded-xl text-xs font-bold font-heading inline-flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95"
                                    >
                                      {copiedLink === enq.id ? (
                                        <>
                                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                                          <span className="text-emerald-700">Link Copied!</span>
                                        </>
                                      ) : (
                                        <>
                                          <Copy className="w-3.5 h-3.5 text-sky-600" />
                                          <span>Copy Link</span>
                                        </>
                                      )}
                                    </button>

                                    <a
                                      href={meetUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold font-heading inline-flex items-center gap-1.5 shadow-xs shadow-sky-600/30 transition-all cursor-pointer active:scale-95"
                                    >
                                      <Video className="w-3.5 h-3.5" />
                                      <span>Join Google Meet</span>
                                      <ExternalLink className="w-3 h-3" />
                                    </a>
                                  </div>
                                )}
                              </div>

                              {meetUrl ? (
                                <div className="p-2.5 bg-white rounded-xl border border-sky-200 flex items-center justify-between text-xs font-mono text-sky-900 break-all">
                                  <span>{meetUrl}</span>
                                </div>
                              ) : (
                                <p className="text-xs text-slate-600 italic">
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
                            <div className="p-4 bg-purple-500/10 border border-purple-300/80 rounded-2xl space-y-3">
                              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                                <div className="space-y-1">
                                  <span className="text-xs font-bold text-purple-950 font-heading block flex items-center gap-1.5">
                                    <Building2 className="w-4 h-4 text-purple-600" />
                                    Advisor Doorstep Visit Location
                                  </span>
                                  <p className="text-xs font-bold text-purple-900 font-sans bg-white/90 p-2.5 rounded-xl border border-purple-200">
                                    📍 {doorstepAddress || 'Your Registered Residence/Office Location'}
                                  </p>
                                </div>

                                {doorstepAddress && (
                                  <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(doorstepAddress)}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-3.5 py-2 bg-white hover:bg-purple-50 text-purple-800 border border-purple-300 rounded-xl text-xs font-bold font-heading inline-flex items-center gap-1.5 shrink-0 shadow-2xs"
                                  >
                                    <MapPin className="w-3.5 h-3.5 text-purple-600" />
                                    <span>View on Google Maps</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                )}
                              </div>

                              {latestAppointment?.adminNotes && (
                                <div className="p-3 bg-white/90 rounded-xl border border-purple-200 text-xs text-slate-700 font-sans">
                                  <span className="font-bold text-purple-900 font-heading">Field Officer Notes: </span>
                                  {latestAppointment.adminNotes}
                                </div>
                              )}

                              <div className="text-[11px] text-slate-500 font-sans flex items-start gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                                <span>
                                  <strong>Doorstep Checklist:</strong> Our senior advisor will travel to your address with official bank dossiers. Please have original/photocopies of property title deeds, patta, chitta, and latest IT returns ready.
                                </span>
                              </div>
                            </div>
                          )}

                          {/* 3. DIRECT PHONE CALL SPECIFIC CARD */}
                          {effectiveMode === 'phone' && (
                            <div className="p-4 bg-teal-500/10 border border-teal-300/80 rounded-2xl space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-teal-950 font-heading block flex items-center gap-1.5">
                                  <PhoneCall className="w-4 h-4 text-teal-600" />
                                  Direct Telephonic Consultation
                                </span>
                                <span className="text-xs font-bold font-mono text-teal-800 bg-white px-2.5 py-1 rounded-lg border border-teal-200">
                                  Calling: +91 {enq.mobileNumber}
                                </span>
                              </div>

                              <p className="text-xs text-teal-900 font-sans">
                                Our senior credit specialist will call your registered phone number at the scheduled time ({latestAppointment?.timeSlot} on {latestAppointment?.date}).
                              </p>

                              {latestAppointment?.adminNotes && (
                                <div className="p-3 bg-white/90 rounded-xl border border-teal-200 text-xs text-slate-700 font-sans">
                                  <span className="font-bold text-teal-900 font-heading">Advisor Notes: </span>
                                  {latestAppointment.adminNotes}
                                </div>
                              )}

                              <div className="text-[11px] text-slate-500 font-sans flex items-start gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                                <span>
                                  <strong>Tip:</strong> Keep your mobile phone active and reachable. Our team will present preliminary eligible loan amounts, interest rates, and subsidy benefits.
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        /* Content when slot is PENDING ALLOTMENT */
                        <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200/90 space-y-2 text-xs">
                          <div className="flex items-center gap-2 text-amber-950 font-bold font-heading">
                            <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                            <span>
                              {effectiveMode === 'video'
                                ? 'Google Meet Video Call Requested'
                                : effectiveMode === 'in_person'
                                ? 'Offline Meeting (Advisor Visiting Your Area) Requested'
                                : 'Direct Phone Consultation Requested'}
                            </span>
                          </div>

                          <p className="text-amber-900/90 font-sans leading-relaxed text-[11px]">
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
                            <div className="text-[11px] text-purple-900 font-medium bg-white/80 p-2 rounded-xl border border-amber-200/80">
                              📍 <strong>Target Area:</strong> {doorstepAddress}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Direct Contact / Follow-up Action Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <a
                        href={`https://wa.me/919655566613?text=${encodeURIComponent(
                          `Hello Prime Associates, this is ${customer.name}. I am following up on my loan enquiry ${enq.referenceNumber} for ${enq.loanType} (${effectiveMode === 'video' ? 'Google Meet' : effectiveMode === 'in_person' ? 'Offline Doorstep Meeting' : 'Phone Call'}).`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-colors shadow-xs"
                      >
                        <span>💬 Chat with Advisor on WhatsApp</span>
                      </a>

                      <span className="text-[11px] text-slate-400">
                        Desk Contact: +91 96555 66613 • primeassociates2008@gmail.com
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default MyEnquiriesPage;

