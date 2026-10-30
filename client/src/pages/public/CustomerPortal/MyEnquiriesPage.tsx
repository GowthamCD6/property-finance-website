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
} from 'lucide-react';
import { useCustomerAuth } from '../../../context/CustomerAuthContext';
import { GoogleIcon } from '../../../components/common/GoogleIcon';
import { triggerGoogleOAuth } from '../../../utils/googleAuth';
import { Enquiry } from '../../../types';

export const MyEnquiriesPage: React.FC = () => {
  const { customer, isAuthenticated, isLoading, enquiries, loginWithGoogle, logout, refreshEnquiries } = useCustomerAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

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
    if (s.includes('sanction') || s.includes('converted') || s.includes('approved')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Sanctioned / Approved</span>
        </span>
      );
    }
    if (s.includes('appoint') || s.includes('slot') || s.includes('confirmed')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-100 text-teal-800 text-xs font-bold rounded-full">
          <Calendar className="w-3.5 h-3.5 text-teal-600" />
          <span>Consultation Slot Allotted</span>
        </span>
      );
    }
    if (s.includes('review') || s.includes('contacted')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
          <Clock className="w-3.5 h-3.5 text-blue-600" />
          <span>Under Advisor Review</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full">
        <Clock className="w-3.5 h-3.5 text-amber-600" />
        <span>Submitted • Awaiting Allotment</span>
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F7F9FB] pt-28 pb-16 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-brand-teal" />
          <p className="text-xs font-semibold text-brand-slate">Loading customer portal...</p>
        </div>
      </div>
    );
  }

  // Not signed in: Login Gateway
  if (!isAuthenticated || !customer) {
    return (
      <div className="min-h-screen bg-[#F7F9FB] pt-32 pb-20 px-4 sm:px-6">
        <div className="max-w-md mx-auto bg-white rounded-3xl shadow-[0_4px_24px_-2px_rgba(24,50,71,0.08)] border border-slate-200/90 p-8 sm:p-10 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-100 mx-auto flex items-center justify-center text-brand-teal">
            <User className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black text-brand-navy">Borrower Portal</h1>
            <p className="text-xs text-brand-slate leading-relaxed">
              Sign in with your Google account to track your submitted loan enquiries, view assigned advisor consultation slots, and download sanction notes.
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2 text-left">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <button
            type="button"
            onClick={() => triggerGoogleLogin()}
            disabled={isSigningIn}
            className="w-full h-12 px-5 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 text-slate-700 font-semibold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60"
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

          <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-teal" />
            <span>Secure 256-bit encrypted authentication</span>
          </div>
        </div>
      </div>
    );
  }

  // Signed in: Borrower Dashboard
  return (
    <div className="min-h-screen bg-[#F7F9FB] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
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
              <div className="w-16 h-16 rounded-2xl bg-brand-teal text-white text-2xl font-black flex items-center justify-center shadow-xs">
                {customer.name.charAt(0)}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-brand-navy">Welcome, {customer.name}</h1>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Google Verified</span>
              </div>
              <p className="text-xs text-brand-slate mt-0.5">{customer.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/enquire"
              className="px-5 py-2.5 bg-brand-teal hover:bg-brand-teal-hover text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Loan Enquiry</span>
            </Link>
            <button
              type="button"
              onClick={logout}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Enquiries Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-brand-navy">Your Loan Enquiries &amp; Consultations</h2>
            <span className="text-xs font-semibold text-brand-slate">
              {enquiries.length} {enquiries.length === 1 ? 'Record' : 'Records'} Found
            </span>
          </div>

          {enquiries.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/90 shadow-xs space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <FileText className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-brand-navy">No Active Loan Enquiries</h3>
                <p className="text-xs text-brand-slate max-w-md mx-auto">
                  You haven't submitted any loan requests under this Google account yet. Submit an enquiry to check your eligibility with 40+ banking partners.
                </p>
              </div>
              <Link
                to="/enquire"
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-teal hover:bg-brand-teal-hover text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                <span>Submit Loan Enquiry</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {enquiries.map((enq) => {
                const latestAppointment = enq.appointments && enq.appointments.length > 0 ? enq.appointments[0] : null;

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
                          <span className="text-xs text-slate-400">
                            • Submitted on {new Date(enq.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                        <h3 className="text-lg font-black text-brand-navy mt-1">
                          {enq.loanType}
                        </h3>
                      </div>

                      <div>{getStatusBadge(enq.status)}</div>
                    </div>

                    {/* Loan Details Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                      <div className="p-3 bg-slate-50 rounded-xl">
                        <span className="text-slate-400 font-medium block">Requested Loan</span>
                        <span className="text-sm font-bold text-brand-navy mt-0.5 block">
                          {formatAmountINR(enq.loanAmount)}
                        </span>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl">
                        <span className="text-slate-400 font-medium block">Location</span>
                        <span className="text-sm font-bold text-brand-navy mt-0.5 block truncate">
                          {enq.cityState || enq.propertyLocation || 'Tamil Nadu'}
                        </span>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl">
                        <span className="text-slate-400 font-medium block">Employment</span>
                        <span className="text-sm font-bold text-brand-navy mt-0.5 block capitalize">
                          {enq.employmentType?.replace('_', ' ') || 'Salaried'}
                        </span>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl">
                        <span className="text-slate-400 font-medium block">Preferred Mode</span>
                        <span className="text-sm font-bold text-brand-navy mt-0.5 block capitalize">
                          {enq.meetingMode?.replace('_', ' ') || 'Phone Call'}
                        </span>
                      </div>
                    </div>

                    {/* APPOINTMENT / CONSULTATION SLOT ALLOTMENT BOX */}
                    <div className="p-5 bg-gradient-to-br from-teal-50/60 to-emerald-50/30 border border-teal-100 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-brand-teal font-bold text-xs uppercase tracking-wider">
                          <Calendar className="w-4 h-4" />
                          <span>Advisor Consultation Slot Allotment</span>
                        </div>
                        {latestAppointment?.status && (
                          <span className="text-[10px] bg-teal-200/70 text-teal-900 font-bold px-2 py-0.5 rounded-full uppercase">
                            {latestAppointment.status}
                          </span>
                        )}
                      </div>

                      {latestAppointment && latestAppointment.date && latestAppointment.date !== 'Pending Advisor Allotment' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
                          <div className="flex items-center gap-2.5">
                            <Calendar className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                            <div>
                              <span className="text-[11px] text-slate-500 block">Allotted Date</span>
                              <span className="font-bold text-slate-900">{latestAppointment.date}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2.5">
                            <Clock className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                            <div>
                              <span className="text-[11px] text-slate-500 block">Time Slot</span>
                              <span className="font-bold text-slate-900">{latestAppointment.timeSlot}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2.5">
                            <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                            <div>
                              <span className="text-[11px] text-slate-500 block">Mode</span>
                              <span className="font-bold text-slate-900 capitalize">
                                {latestAppointment.meetingMode?.replace('_', ' ') || enq.meetingMode || 'Phone Call'}
                              </span>
                            </div>
                          </div>

                          {latestAppointment.adminNotes && (
                            <div className="sm:col-span-3 p-3 bg-white/80 rounded-xl border border-teal-100 text-xs text-slate-700 mt-1">
                              <span className="font-semibold text-brand-teal">Advisor Note: </span>
                              {latestAppointment.adminNotes}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-start gap-3 text-xs text-slate-600">
                          <Clock className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                          <p>
                            Your loan request is queued with our Tirupur advisory desk. Once an advisor examines your requirements, your consultation date and time slot will appear here and will be confirmed via WhatsApp &amp; Email.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Direct Contact Button */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <a
                        href={`https://wa.me/919655566613?text=${encodeURIComponent(
                          `Hello Prime Associates, this is ${customer.name}. I am following up on my loan enquiry ${enq.referenceNumber} for ${enq.loanType}.`
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

