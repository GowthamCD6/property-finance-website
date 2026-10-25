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
import { EnquiryForm } from '../../components/public/EnquiryForm';
import { Service } from '../../types';

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

  const preparationChecklist = [
    {
      category: 'Income Proofs (Salaried)',
      items: ['Last 3 months payslips', 'Last 6 months salary bank account statement', 'Latest 2 years Form 16 / ITR'],
    },
    {
      category: 'Financials (Self-Employed / Business)',
      items: ['Last 2-3 years ITR with Computation, Balance Sheet, P&L', '12 months primary current bank account statement', 'GST returns (GSTR-3B)'],
    },
    {
      category: 'Property Context (If Identified)',
      items: ['Draft Agreement of Sale / Allotment Letter', 'Latest EC (Encumbrance Certificate) Form 15', 'Approved Layout / Sanction Plan copy'],
    },
  ];

  return (
    <div className="bg-white">
      {/* 1. Executive Consultation Hero */}
      <section className="relative bg-gradient-to-br from-brand-navy via-[#102434] to-[#0A1824] text-white pt-20 pb-20 lg:pt-24 lg:pb-24 border-b border-white/10 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-teal/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-teal/20 border border-brand-teal/30 text-brand-teal-light text-xs font-bold uppercase tracking-wider mb-5">
              <FileCheck2 className="w-4 h-4 text-brand-teal" />
              <span>Independent Property Debt Advisory Desk</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight font-heading leading-tight sm:leading-tight">
              Schedule a Private <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-teal via-emerald-400 to-brand-gold">
                Loan Consultation &amp; Eligibility Audit
              </span>
            </h1>

            <p className="mt-5 text-gray-300 text-base sm:text-lg lg:text-xl font-normal leading-relaxed max-w-3xl">
              Do not risk loan rejection or hard credit score dips by randomly applying to banks. Meet with our senior property finance advisors to evaluate debt feasibility, audit title chains, and formulate an airtight application.
            </p>

            {/* Advisory Commitments Strip */}
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
              <div className="space-y-1">
                <span className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase block">Fee Structure</span>
                <span className="text-lg sm:text-xl font-black text-emerald-400 font-heading">Zero Advance Fee</span>
                <span className="text-[11px] text-gray-400 block">100% transparent advice</span>
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase block">Credit Bureau Impact</span>
                <span className="text-lg sm:text-xl font-black text-white font-heading">Zero Hard Inquiries</span>
                <span className="text-[11px] text-gray-400 block">CIBIL score safe</span>
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase block">Lender Coverage</span>
                <span className="text-lg sm:text-xl font-black text-brand-gold font-heading">40+ Institutions</span>
                <span className="text-[11px] text-gray-400 block">PSU, Private &amp; HFCs</span>
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase block">Session Duration</span>
                <span className="text-lg sm:text-xl font-black text-brand-teal font-heading">30–45 Mins</span>
                <span className="text-[11px] text-gray-400 block">Dedicated advisory slot</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap gap-4 items-center">
              <a
                href="#enquiry-form"
                className="px-7 py-3.5 bg-brand-teal hover:bg-brand-teal-hover text-white text-sm font-bold rounded-corporate shadow-lg shadow-brand-teal/20 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                <span>Reserve Consultation Slot</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                to="/calculator"
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-corporate text-sm font-semibold transition-all backdrop-blur-sm flex items-center gap-2"
              >
                <Calculator className="w-4 h-4 text-brand-teal" />
                <span>Test Online Calculator</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. What We Assess During Consultation (4 Pillars) */}
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

      {/* 3. Three Convenient Meeting Modes */}
      <section className="py-20 lg:py-24 bg-white border-b border-brand-border">
        <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-teal block mb-1">
              Flexible Scheduling
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-navy font-heading tracking-tight">
              Choose Your Preferred Meeting Mode
            </h2>
            <p className="mt-3 text-brand-slate text-sm sm:text-base leading-relaxed">
              Whether you are local in Bengaluru, across another Indian metro, or an NRI residing overseas, we accommodate your schedule seamlessly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              onClick={() => setActiveMode('video')}
              className={`p-7 rounded-2xl border cursor-pointer transition-all ${
                activeMode === 'video'
                  ? 'border-brand-teal bg-brand-teal-light/20 shadow-md ring-2 ring-brand-teal/20'
                  : 'border-brand-border bg-brand-ivory/40 hover:border-brand-teal/40'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-brand-teal text-white flex items-center justify-center mb-5">
                <Video className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-brand-navy font-heading mb-2">Google Meet Video Session</h3>
              <p className="text-xs sm:text-sm text-brand-slate leading-relaxed mb-4">
                Screen-share session ideal for reviewing property floor plans, digital income tax portals, and live EMI schedule modeling.
              </p>
              <span className="text-[11px] font-bold text-brand-teal uppercase tracking-wider block">
                Popular with NRIs &amp; Tech Professionals
              </span>
            </div>

            <div
              onClick={() => setActiveMode('phone')}
              className={`p-7 rounded-2xl border cursor-pointer transition-all ${
                activeMode === 'phone'
                  ? 'border-brand-teal bg-brand-teal-light/20 shadow-md ring-2 ring-brand-teal/20'
                  : 'border-brand-border bg-brand-ivory/40 hover:border-brand-teal/40'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-brand-navy text-white flex items-center justify-center mb-5">
                <PhoneCall className="w-6 h-6 text-brand-teal" />
              </div>
              <h3 className="text-lg font-bold text-brand-navy font-heading mb-2">Direct Advisory Phone Call</h3>
              <p className="text-xs sm:text-sm text-brand-slate leading-relaxed mb-4">
                A focused telephonic review with a senior property advisor to address immediate eligibility queries or urgent loan requirements.
              </p>
              <span className="text-[11px] font-bold text-brand-teal uppercase tracking-wider block">
                Quickest 20-Min Sanction Feasibility
              </span>
            </div>

            <div
              onClick={() => setActiveMode('in-person')}
              className={`p-7 rounded-2xl border cursor-pointer transition-all ${
                activeMode === 'in-person'
                  ? 'border-brand-teal bg-brand-teal-light/20 shadow-md ring-2 ring-brand-teal/20'
                  : 'border-brand-border bg-brand-ivory/40 hover:border-brand-teal/40'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-brand-gold text-brand-navy flex items-center justify-center mb-5">
                <MapPin className="w-6 h-6 text-brand-navy" />
              </div>
              <h3 className="text-lg font-bold text-brand-navy font-heading mb-2">In-Person Advisory Desk</h3>
              <p className="text-xs sm:text-sm text-brand-slate leading-relaxed mb-4">
                Private office consultation at our Bengaluru headquarters to evaluate original deed binders, Khata extracts, and complex builder agreements.
              </p>
              <span className="text-[11px] font-bold text-brand-teal uppercase tracking-wider block">
                Recommended for Large-Ticket Land &amp; LAP
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. What to Keep Ready (Checklist) */}
      <section className="py-20 lg:py-24 bg-brand-ivory/40 border-b border-brand-border">
        <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-teal block mb-1">
              Maximize Advisory Value
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-navy font-heading tracking-tight">
              Recommended Documents to Keep Handy
            </h2>
            <p className="mt-3 text-brand-slate text-sm sm:text-base leading-relaxed">
              Having these soft copies or files available allows us to calculate your exact borrowing limits during your session.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {preparationChecklist.map((group, gIdx) => (
              <div key={gIdx} className="p-6 bg-white rounded-2xl border border-brand-border shadow-subtle space-y-4">
                <h3 className="text-base font-bold text-brand-navy font-heading border-b border-brand-border pb-3">
                  {group.category}
                </h3>
                <ul className="space-y-2.5">
                  {group.items.map((item, iIdx) => (
                    <li key={iIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-brand-navy">
                      <CheckCircle2 className="w-4 h-4 text-brand-teal flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Privacy & Confidentiality Guarantee */}
          <div className="mt-10 p-5 bg-white rounded-xl border border-brand-border text-xs text-brand-slate leading-relaxed flex items-start gap-3">
            <Lock className="w-5 h-5 text-brand-teal flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-brand-navy">Confidentiality Guarantee: </span>
              All documents, financial statements, and property records shared during consultation are protected under strict non-disclosure protocols and used exclusively for your loan eligibility assessment. We never sell your personal data or trigger unsolicited marketing calls.
            </div>
          </div>
        </div>
      </section>

      {/* 5. Preloaded Consultation Booking Form */}
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
