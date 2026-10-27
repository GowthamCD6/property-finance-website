import React, { useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  FileCheck2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Search,
  Calculator,
  UserCheck,
  Video,
  PhoneCall,
  MapPin,
  Clock,
  Sparkles,
  Lock,
  FileText,
  BadgeAlert,
  HelpCircle,
  Award,
} from 'lucide-react';
import { EnquiryForm } from '../../../components/common/EnquiryForm';
import { InteractiveDocumentVault } from '../../../components/common/InteractiveDocumentVault';
import { Service } from '../../../types';

export const ConsultationPage: React.FC = () => {
  const context = useOutletContext<{ services?: Service[] }>();
  const services = context?.services || [];
  const consultationService =
    services.find((s) => s.slug === 'loan-consultation') || null;

  const [activeMode, setActiveMode] = useState<'video' | 'phone' | 'in-person'>('video');

  const consultationPillars = [
    {
      step: '01',
      title: 'Preliminary FOIR & True Borrowing Capacity',
      desc: 'We calculate your Fixed Obligation to Income Ratio (FOIR) across existing EMIs, active personal debts, and credit card limits to determine your exact borrowing ceiling under current RBI retail lending directives.',
      icon: <Calculator className="w-5 h-5 text-brand-teal" />,
      outcome: 'Clear maximum loan eligibility amount before bank submission',
    },
    {
      step: '02',
      title: 'Credit Bureau & CIBIL Score Health Audit',
      desc: 'We inspect your bureau footprint for negative DPD (Days Past Due), settled loan flags, written-off disputes, and high revolving utilization that would trigger automatic credit committee rejection.',
      icon: <UserCheck className="w-5 h-5 text-brand-teal" />,
      outcome: 'Zero hard bureau inquiries; score preservation strategy',
    },
    {
      step: '03',
      title: 'Property Title & Khata Readiness Pre-Audit',
      desc: 'Our legal specialists review property title chains, non-agricultural DC conversions, layout approvals (BDA, DTCP, HMDA), A-Khata certificates, and 30-year EC Form 15 to identify panel query risks early.',
      icon: <FileCheck2 className="w-5 h-5 text-brand-teal" />,
      outcome: 'Resolution of missing mother deeds before lender scrutiny',
    },
    {
      step: '04',
      title: 'Co-Applicant Structuring & Tax Optimization',
      desc: 'We structure co-applicants (spouse, parent, business partner) to legitimately augment overall family income multipliers while maximizing joint tax deduction brackets under Sections 24(b) and 80C.',
      icon: <ShieldCheck className="w-5 h-5 text-brand-teal" />,
      outcome: 'Enhanced loan limit and up to ₹3.5L+ yearly tax benefits',
    },
  ];

  return (
    <div className="bg-brand-bg min-h-screen text-brand-navy">
      {/* ────────────────────────────────────────────────────────────
          1. CONTENT-SPECIFIC HERO: PRIVATE ADVISORY & CONSULTATION DESK
          ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#0C1B26] text-white pt-20 pb-16 lg:pt-28 lg:pb-24 border-b border-brand-teal/20">
        <div className="absolute top-0 right-10 w-96 h-96 bg-brand-teal/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Heading & Pre-Underwriting Assurance */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-teal/15 border border-brand-teal/30 backdrop-blur-md">
                <FileCheck2 className="w-4 h-4 text-brand-teal" />
                <span className="text-xs font-bold uppercase tracking-wider text-brand-teal-light">
                  1-on-1 Pre-Underwriting &amp; Eligibility Audit
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white tracking-tight font-heading leading-tight">
                Private Property Loan Consultation, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-teal via-emerald-400 to-sky-300">
                  Before You Apply to Any Bank.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-gray-300 font-normal leading-relaxed max-w-2xl">
                Do not risk automated bank loan rejection or unnecessary credit score dips. Our senior property finance specialists review title documents, compute exact FOIR borrowing limits, and formulate an airtight application.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href="#enquiry-form"
                  className="px-7 py-3.5 bg-brand-teal hover:bg-brand-teal-hover text-white text-sm font-bold rounded-corporate shadow-lg shadow-brand-teal/20 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <span>Schedule Consultation Slot</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <Link
                  to="/calculator"
                  className="px-6 py-3.5 bg-white/10 hover:bg-white/15 text-white border border-white/20 rounded-corporate text-sm font-semibold transition-all backdrop-blur-sm flex items-center gap-2"
                >
                  <Calculator className="w-4 h-4 text-brand-teal" />
                  <span>Check FOIR Limits</span>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 flex flex-wrap gap-2 text-[11px] font-semibold text-gray-400">
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Zero Advance Fees
                </span>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-brand-teal" /> Zero Hard CIBIL Inquiries
                </span>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-sky-400" /> 30-Min Focused Audit
                </span>
              </div>
            </div>

            {/* Right Column: Interactive Mode & Booking Quick Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#122535] to-[#0c1a24] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs uppercase font-bold tracking-wider text-emerald-300">
                    Live Booking Desk
                  </span>
                </div>
                <span className="text-[11px] text-gray-400 font-mono">Today / Tomorrow</span>
              </div>

              {/* Mode Selector */}
              <div className="mt-5 space-y-2">
                <label className="text-xs font-semibold text-gray-300 block">Select Consultation Mode:</label>
                <div className="grid grid-cols-3 gap-2 text-xs font-bold text-center">
                  <button
                    onClick={() => setActiveMode('video')}
                    className={`py-2.5 px-2 rounded-xl transition-all flex flex-col items-center gap-1 ${
                      activeMode === 'video'
                        ? 'bg-brand-teal text-white shadow-md'
                        : 'bg-white/5 text-gray-300 hover:text-white border border-white/10'
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    <span>Google Meet</span>
                  </button>
                  <button
                    onClick={() => setActiveMode('phone')}
                    className={`py-2.5 px-2 rounded-xl transition-all flex flex-col items-center gap-1 ${
                      activeMode === 'phone'
                        ? 'bg-brand-teal text-white shadow-md'
                        : 'bg-white/5 text-gray-300 hover:text-white border border-white/10'
                    }`}
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Phone Call</span>
                  </button>
                  <button
                    onClick={() => setActiveMode('in-person')}
                    className={`py-2.5 px-2 rounded-xl transition-all flex flex-col items-center gap-1 ${
                      activeMode === 'in-person'
                        ? 'bg-brand-teal text-white shadow-md'
                        : 'bg-white/5 text-gray-300 hover:text-white border border-white/10'
                    }`}
                  >
                    <MapPin className="w-4 h-4" />
                    <span>Office Visit</span>
                  </button>
                </div>
              </div>

              {/* Active Mode Summary */}
              <div className="mt-5 p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-300 leading-relaxed">
                {activeMode === 'video' && (
                  <span><strong>Virtual Screen-Share:</strong> Ideal for reviewing digital income tax portals, builder blueprint layouts, and comparative lender matrices with our senior desk.</span>
                )}
                {activeMode === 'phone' && (
                  <span><strong>Direct Advisor Line:</strong> Fast 20-minute eligibility review. We compute your FOIR limits and provide an immediate bank sanction feasibility report.</span>
                )}
                {activeMode === 'in-person' && (
                  <span><strong>Tirupur Head Office:</strong> No. 48, 49, P.R. Complex, Binny Compound Main Street, Kumaran Road, Tirupur - 641601. In-person inspection of parent title documents, deed binders, and subsidy eligibility.</span>
                )}
              </div>

              {/* Slot Availability Banner */}
              <div className="mt-4 flex items-center justify-between text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-2 rounded-xl">
                <span>Slots confirmed within 2 business hours</span>
                <span className="font-bold">Zero Fee</span>
              </div>

              <div className="mt-5 pt-4 border-t border-white/10">
                <a
                  href="#enquiry-form"
                  className="w-full py-3 bg-brand-teal hover:bg-brand-teal-hover text-white text-xs sm:text-sm font-bold rounded-corporate text-center transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  <span>Select Slot on Calendar</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────
          2. FOUR UNDERWRITING PILLARS
          ──────────────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-24 bg-brand-ivory/60 border-b border-brand-border">
        <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-teal block mb-2">
              Comprehensive Pre-Underwriting
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-navy font-heading tracking-tight">
              What We Audit Before Bank Submission
            </h2>
            <p className="mt-3 text-sm sm:text-base text-brand-slate leading-relaxed">
              Banks decline over 30% of property loan files due to document gaps, high FOIR obligations, or disputed title chains. We identify and rectify these hurdles beforehand.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {consultationPillars.map((p, idx) => (
              <div
                key={idx}
                className="p-8 bg-white rounded-2xl border border-brand-border shadow-subtle hover:border-brand-teal/40 transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-brand-teal-light text-brand-teal flex items-center justify-center font-bold text-sm">
                      {p.icon}
                    </div>
                    <span className="text-xs font-bold text-brand-slate/60 font-mono">PHASE {p.step}</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-brand-navy font-heading">{p.title}</h3>
                  <p className="text-xs sm:text-sm text-brand-slate leading-relaxed">{p.desc}</p>
                </div>

                <div className="pt-4 border-t border-brand-border/60 flex items-center gap-2 text-xs font-semibold text-brand-teal">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>Deliverable: {p.outcome}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────
          3. DOCUMENTATION CHECKLIST
          ──────────────────────────────────────────────────────────── */}
      <InteractiveDocumentVault loanType="loan-consultation" />

      {/* ────────────────────────────────────────────────────────────
          4. PRELOADED CONSULTATION FORM
          ──────────────────────────────────────────────────────────── */}
      <div id="enquiry-form">
        <EnquiryForm
          services={services}
          selectedService={consultationService}
          onClearSelectedService={() => {}}
        />
      </div>
    </div>
  );
};
