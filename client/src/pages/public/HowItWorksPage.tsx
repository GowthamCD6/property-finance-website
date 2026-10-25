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

  const landSpecificNuances = [
    {
      title: 'Composite Plot + Construction Mandate',
      desc: 'Most banks (like SBI, HDFC, Bank of Baroda) mandate that construction must commence within 2 to 3 years from the date of plot purchase loan disbursement to retain home loan interest rates.',
    },
    {
      title: 'Agricultural to Non-Agricultural (DC) Order',
      desc: 'Plots converted from agricultural land must have a valid Deputy Commissioner (DC) conversion order along with an approved layout plan from competent authorities (BDA, DTCP, HMDA).',
    },
    {
      title: 'LTV Difference on Land vs Flat',
      desc: 'While ready residential apartments attract up to 75% - 80% LTV, standalone plot purchase loans are typically capped at 70% - 75% of agreement value or circle rate valuation.',
    },
    {
      title: 'Phased Construction Disbursals',
      desc: 'For self-construction or builder projects, loan disbursements are released in tranches based on civil engineering stage milestones (Plinth, Slab, Masonry, Finishing).',
    },
  ];

  return (
    <div className="bg-white">
      {/* 1. Header Hero Banner */}
      <section className="relative bg-gradient-to-br from-brand-navy via-[#102434] to-[#0A1824] text-white pt-20 pb-20 lg:pt-24 lg:pb-24 border-b border-white/10 overflow-hidden">
        {/* Ambient Backdrops */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-teal/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-teal/20 border border-brand-teal/30 text-brand-teal-light text-xs font-bold uppercase tracking-wider mb-5">
              <Clock className="w-4 h-4 text-brand-teal" />
              <span>Step-by-Step Lending Architecture</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight font-heading leading-tight sm:leading-tight">
              From Eligibility to Disbursement: <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-teal via-emerald-400 to-brand-gold">
                The Complete Advisory Process
              </span>
            </h1>

            <p className="mt-5 text-gray-300 text-base sm:text-lg lg:text-xl font-normal leading-relaxed max-w-3xl">
              Eliminate guesswork, avoid bank branch delays, and understand exactly what happens at every turn. Here is our transparent 4-stage advisory methodology designed for property buyers and homeowners.
            </p>

            {/* Turnaround Milestones Strip */}
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
              <div>
                <span className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase block">In-Principle Sanction</span>
                <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">24 – 48 Hours</span>
                <span className="text-[11px] text-gray-400 block mt-0.5">Eligibility confirmed</span>
              </div>
              <div>
                <span className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase block">Legal Title &amp; Val</span>
                <span className="text-xl sm:text-2xl font-black text-brand-teal font-mono">3 – 5 Days</span>
                <span className="text-[11px] text-gray-400 block mt-0.5">Empanelled advocates</span>
              </div>
              <div>
                <span className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase block">Final Disbursement</span>
                <span className="text-xl sm:text-2xl font-black text-brand-gold font-mono">7 – 10 Days</span>
                <span className="text-[11px] text-gray-400 block mt-0.5">End-to-end execution</span>
              </div>
              <div>
                <span className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase block">Fee Transparency</span>
                <span className="text-xl sm:text-2xl font-black text-white font-mono">Zero Hidden</span>
                <span className="text-[11px] text-gray-400 block mt-0.5">Direct lender invoicing</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap gap-4 items-center">
              <Link
                to="/enquire"
                className="px-7 py-3.5 bg-brand-teal hover:bg-brand-teal-hover text-white text-sm font-bold rounded-corporate shadow-lg shadow-brand-teal/20 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                <span>Initiate Your Loan File</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/calculator"
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-corporate text-sm font-semibold transition-all backdrop-blur-sm flex items-center gap-2"
              >
                <Scale className="w-4 h-4 text-brand-teal" />
                <span>Calculate Repayment EMI</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Four Interactive Advisory Phases */}
      <section className="py-20 lg:py-24 bg-brand-ivory/60 border-b border-brand-border">
        <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-teal block mb-2">
              Structured Milestones
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-navy font-heading tracking-tight">
              The 4 Critical Underwriting Phases
            </h2>
            <p className="mt-3 text-sm sm:text-base text-brand-slate leading-relaxed">
              Explore each phase of the mortgage lifecycle to see specific actions, document requirements, and deliverables.
            </p>

            {/* Phase Selector Pills */}
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {advisoryPhases.map((phase) => (
                <button
                  key={phase.phase}
                  onClick={() => setActivePhase(phase.phase)}
                  className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                    activePhase === phase.phase
                      ? 'bg-brand-navy text-white shadow-md scale-105'
                      : 'bg-white text-brand-slate hover:text-brand-navy border border-brand-border hover:bg-white/80'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                    activePhase === phase.phase ? 'bg-brand-teal text-white' : 'bg-brand-ivory text-brand-slate'
                  }`}>
                    {phase.phase}
                  </span>
                  <span>{phase.title.split('&')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Active Phase Card */}
          {advisoryPhases
            .filter((p) => p.phase === activePhase)
            .map((curr) => (
              <div
                key={curr.phase}
                className="bg-white rounded-3xl border border-brand-border shadow-subtle p-6 sm:p-10 lg:p-12 transition-all"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                  {/* Left Column: Phase Details */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-brand-teal bg-brand-teal-light px-3 py-1 rounded">
                          Phase {curr.number} • {curr.tagline}
                        </span>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-ivory text-brand-navy border border-brand-border">
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

                    {/* Step-by-step checklist */}
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

                    {/* Key Deliverable Box */}
                    <div className="p-4 bg-brand-ivory rounded-xl border border-brand-border/80 flex items-center gap-3 text-xs font-bold text-brand-navy">
                      <Sparkles className="w-5 h-5 text-brand-teal flex-shrink-0" />
                      <span>Phase Deliverable: <span className="text-brand-teal">{curr.deliverable}</span></span>
                    </div>
                  </div>

                  {/* Right Column: Visual Stage Summary */}
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

      {/* 3. Critical Land & Plot Loan Nuances Section */}
      <section className="py-20 lg:py-24 bg-white border-b border-brand-border">
        <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="max-w-3xl mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-teal block mb-1">
              Land Advisory Specifics
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-navy font-heading tracking-tight">
              Crucial Nuances for Land &amp; Plot Borrowers
            </h2>
            <p className="mt-3 text-brand-slate text-sm sm:text-base leading-relaxed">
              Purchasing a residential plot or self-constructing a villa entails regulatory caveats not found in standard ready-to-move apartment purchases.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {landSpecificNuances.map((nuance, idx) => (
              <div
                key={idx}
                className="p-6 sm:p-7 bg-brand-ivory/50 rounded-2xl border border-brand-border hover:border-brand-teal/40 transition-all space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-teal text-white flex items-center justify-center font-bold text-xs">
                    0{idx + 1}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-brand-navy font-heading">
                    {nuance.title}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-brand-slate leading-relaxed">
                  {nuance.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Common Banking Traps & How We Protect You */}
      <section className="py-20 lg:py-24 bg-brand-ivory/40 border-b border-brand-border">
        <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-teal block mb-1">
              Borrower Advocacy
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-navy font-heading tracking-tight">
              Hidden Fees We Help You Avoid
            </h2>
            <p className="mt-3 text-brand-slate text-sm sm:text-base leading-relaxed">
              Direct branch applications often bundle unnecessary add-ons. As independent advisors, we audit every line item.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-2xl border border-brand-border shadow-subtle space-y-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-brand-navy font-heading">Bundled Loan Insurance</h3>
              <p className="text-xs sm:text-sm text-brand-slate leading-relaxed">
                Banks often force single-premium insurance products bundled into the loan principal, charging interest on the premium. We insist on pure term insurance separation.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-brand-border shadow-subtle space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-brand-navy font-heading">Exorbitant Processing Surcharges</h3>
              <p className="text-xs sm:text-sm text-brand-slate leading-relaxed">
                Standard bank rack rates range from 0.50% to 1.00% plus GST. Through our institutional relationships, we negotiate fee waivers or fixed caps of ₹10,000 – ₹15,000.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-brand-border shadow-subtle space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-teal-light text-brand-teal flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-brand-navy font-heading">Reset Clause Asymmetries</h3>
              <p className="text-xs sm:text-sm text-brand-slate leading-relaxed">
                We verify that your sanction letter specifies RBI Repo-Linked Lending Rate (RLLR) reset schedules, ensuring rate reductions pass through to you automatically.
              </p>
            </div>
          </div>

          {/* Bottom Legal Disclaimer */}
          <div className="mt-10 p-5 bg-white rounded-xl border border-brand-border text-xs text-brand-slate leading-relaxed flex items-start gap-3">
            <Scale className="w-5 h-5 text-brand-teal flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-brand-navy">Advisory &amp; Regulatory Notice: </span>
              WealthAnchor acts as an independent property debt advisory firm. Final loan sanction, interest rates, property valuation, legal title acceptance, and fund disbursement remain strictly at the sole discretion of the respective lending institutions under RBI directives.
            </div>
          </div>

          {/* Final CTA */}
          <div className="pt-12 text-center">
            <Link
              to="/enquire"
              className="inline-flex items-center gap-2 px-8 py-4 bg-brand-teal hover:bg-brand-teal-hover text-white text-sm font-bold rounded-corporate shadow-lg shadow-brand-teal/20 transition-all transform hover:-translate-y-0.5"
            >
              <span>Schedule Your Free Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
