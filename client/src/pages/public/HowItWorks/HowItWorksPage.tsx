import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  PhoneCall,
  SearchCheck,
  ClipboardCheck,
  ArrowRight,
  Clock,
  ShieldCheck,
  Building,
  CheckCircle2,
  FileCheck2,
  Banknote,
  Landmark,
  Scale,
  Calendar,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const [activePhase, setActivePhase] = useState<number>(1);

  const advisoryPhases = [
    {
      phase: 1,
      number: '01',
      title: 'Financial Underwriting & FOIR Eligibility',
      turnaround: 'Day 1 – 2',
      tagline: 'Precision calculation before formal bank submission',
      summary:
        'We analyze your net disposable income, tax computation, existing EMIs, and credit bureau footprint to determine your exact borrowing capacity under RBI retail lending guidelines.',
      steps: [
        'FOIR (Fixed Obligation to Income Ratio) calculation (55% for salaried, up to 75% for corporate/business entities)',
        'CIBIL bureau health assessment: Identifying unresolved DPD, settlements, or credit card spikes without hard bureau inquiries',
        'Income enhancement structuring: Adding earning co-applicants (spouse, parents) and factoring secondary rental yields',
        'Debt-to-income stress testing to ensure repayment buffers across fluctuating interest rate cycles',
      ],
      deliverable: 'Certified Borrowing Limit & Lender Shortlist Matrix',
    },
    {
      phase: 2,
      number: '02',
      title: 'Lender Selection & In-Principle Sanction',
      turnaround: 'Day 2 – 4',
      tagline: 'Negotiating optimal spreads and fee concessions',
      summary:
        'We match your profile against our 40+ lending partners (PSU banks, private commercial banks, and specialized HFCs) to secure the lowest spread over Repo Linked Lending Rate (RLLR).',
      steps: [
        'Evaluating lender-specific policies (e.g. some banks favor land purchases, while others offer higher LTV on residential apartments)',
        'Negotiating processing fee waivers (aiming for 0.15% - 0.25% or flat fee caps rather than standard 0.50% rack rates)',
        'Securing the formal In-Principle Sanction Letter detailing loan amount, approved ROI, and pre-disbursement conditions',
        'Reviewing reset clauses (Repo rate change pass-through schedules) and zero prepayment penalty terms',
      ],
      deliverable: 'Formal Lender Sanction Letter with Term Sheet',
    },
    {
      phase: 3,
      number: '03',
      title: 'Legal Search (TSR) & Property Valuation',
      turnaround: 'Day 4 – 8',
      tagline: 'Bank panel advocate vetting & civil engineer appraisal',
      summary:
        'Lender-empanelled advocates and chartered engineers conduct exhaustive physical and legal due diligence to guarantee clear, marketable, and unencumbered title.',
      steps: [
        '30-Year Title Search Report (TSR): Tracing chain of ownership through parent deeds, gift deeds, partitions, and sale agreements',
        'Statutory revenue verification: Non-encumbrance certificate (EC Form 15), Khata extract/certificate (A-Khata vs B-Khata), and tax receipts',
        'Physical site valuation by certified valuer: Measuring carpet vs super built-up area, setback adherence, and road width access',
        'Layout approval verification: BDA, DTCP, HMDA, or RERA project registration compliance',
      ],
      deliverable: 'Clear Title Clearance Certificate & Fair Market Valuation',
    },
    {
      phase: 4,
      number: '04',
      title: 'MODT Execution & Disbursement Release',
      turnaround: 'Day 8 – 12',
      tagline: 'Safe fund transfer directly to seller or builder escrow',
      summary:
        'Final documentation, Memorandum of Deposit of Title Deeds (MODT) registration at the local Sub-Registrar office, and safe fund disbursement.',
      steps: [
        'Executing the tripartite loan agreement, ECS/NACH auto-debit mandates, and post-dated security cheques',
        'Registration of MODT / equitable mortgage with the Sub-Registrar (stamp duty typically 0.2% - 0.5% depending on state)',
        'Original title deed deposit into the bank’s secure custody vault against a formal acknowledgement receipt',
        'Disbursement check/RTGS: Direct credit to the property seller, builder RERA escrow, or stage-wise releases for self-construction',
      ],
      deliverable: 'Disbursement Advice & Amortization Repayment Schedule',
    },
  ];

  return (
    <div className="bg-brand-bg min-h-screen text-brand-navy">
      {/* ────────────────────────────────────────────────────────────
          1. CONTENT-SPECIFIC HERO: INTERACTIVE PROCESS JOURNEY
          ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#0A1726] text-white pt-20 pb-16 lg:pt-28 lg:pb-24 border-b border-brand-teal/20">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-teal/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-teal/15 border border-brand-teal/30 backdrop-blur-md">
              <Clock className="w-4 h-4 text-brand-teal" />
              <span className="text-xs font-bold uppercase tracking-wider text-brand-teal-light">
                Transparent 4-Stage Lending Architecture
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight font-heading leading-tight">
              The Journey from Pre-Audit <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-teal via-emerald-400 to-brand-gold">
                to Property Fund Disbursement.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-gray-300 font-normal leading-relaxed max-w-2xl mx-auto">
              No branch queues, no guesswork, and zero hidden markups. Here is exactly how your property loan moves from initial credit audit to bank panel advocate vetting and final registration.
            </p>
          </div>

          {/* Interactive Horizontal Process Timeline Ribbon inside Hero */}
          <div className="mt-14 max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {advisoryPhases.map((phase) => (
              <div
                key={phase.phase}
                onClick={() => setActivePhase(phase.phase)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                  activePhase === phase.phase
                    ? 'bg-brand-teal text-white border-brand-teal shadow-xl scale-105'
                    : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                    activePhase === phase.phase ? 'bg-brand-navy text-white' : 'bg-brand-teal text-white'
                  }`}>
                    {phase.number}
                  </span>
                  <span className="text-[11px] font-mono opacity-80">{phase.turnaround}</span>
                </div>
                <h3 className="font-bold text-sm leading-snug">{phase.title.split('&')[0]}</h3>
                <span className="text-[11px] block mt-1 opacity-75">{phase.tagline}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────
          2. DETAILED ACTIVE PHASE BREAKDOWN CARD
          ──────────────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-24 bg-white border-b border-brand-border">
        <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-10">
          {advisoryPhases
            .filter((p) => p.phase === activePhase)
            .map((curr) => (
              <div
                key={curr.phase}
                className="bg-brand-ivory/50 rounded-3xl border border-brand-border shadow-subtle p-6 sm:p-10 lg:p-12 transition-all"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                  <div className="lg:col-span-7 space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-brand-teal bg-brand-teal-light px-3 py-1 rounded">
                          Phase {curr.number} • {curr.tagline}
                        </span>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white text-brand-navy border border-brand-border">
                          {curr.turnaround}
                        </span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-brand-navy font-heading">
                        {curr.title}
                      </h3>
                      <p className="text-brand-slate text-sm sm:text-base leading-relaxed pt-1">
                        {curr.summary}
                      </p>
                    </div>

                    <div className="space-y-3 pt-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-brand-navy">
                        Key Advisory Actions in this Phase:
                      </h4>
                      <div className="space-y-3">
                        {curr.steps.map((st, sIdx) => (
                          <div key={sIdx} className="flex items-start gap-3 text-xs sm:text-sm text-brand-navy font-medium">
                            <CheckCircle2 className="w-4 h-4 text-brand-teal flex-shrink-0 mt-0.5" />
                            <span className="leading-snug">{st}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-white rounded-xl border border-brand-border/80 flex items-center gap-3 text-xs font-bold text-brand-navy">
                      <Sparkles className="w-5 h-5 text-brand-teal flex-shrink-0" />
                      <span>Phase Deliverable: <span className="text-brand-teal">{curr.deliverable}</span></span>
                    </div>
                  </div>

                  <div className="lg:col-span-5 bg-gradient-to-br from-brand-navy to-[#183247] text-white p-6 sm:p-8 rounded-2xl shadow-xl space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-white/10">
                      <span className="text-xs uppercase font-bold tracking-wider text-brand-teal-light">Workflow Position</span>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                        Step {curr.number} of 04
                      </span>
                    </div>

                    <div className="space-y-4">
                      {advisoryPhases.map((item) => (
                        <div
                          key={item.phase}
                          onClick={() => setActivePhase(item.phase)}
                          className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                            item.phase === curr.phase
                              ? 'bg-white/10 border-brand-teal'
                              : 'bg-transparent border-white/5 opacity-60 hover:opacity-100'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-7 h-7 rounded-lg bg-brand-teal text-white flex items-center justify-center font-bold text-xs">
                              {item.number}
                            </span>
                            <span className="text-xs font-semibold text-white truncate max-w-[180px]">
                              {item.title}
                            </span>
                          </div>
                          <span className="text-[11px] text-gray-300 font-mono">{item.turnaround}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2">
                      <Link
                        to="/enquire"
                        className="w-full py-3 bg-brand-teal hover:bg-brand-teal-hover text-white text-xs sm:text-sm font-bold rounded-corporate text-center transition-all flex items-center justify-center gap-2 shadow-md"
                      >
                        <span>Schedule Phase 1 Consultation</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
};
