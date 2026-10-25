import React, { useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  Briefcase,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Building2,
  Landmark,
  ShieldCheck,
  FileCheck2,
  Percent,
  Clock,
  Coins,
  ChevronRight,
  Layers,
  ArrowDownRight,
  Sparkles,
  HelpCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { EnquiryForm } from '../../components/public/EnquiryForm';
import { Service } from '../../types';

export const PropertyFundingPage: React.FC = () => {
  const context = useOutletContext<{ services?: Service[] }>();
  const services = context?.services || [];
  const fundingService = services.find((s) => s.slug === 'property-backed-funding') || null;

  const [activeTab, setActiveTab] = useState<'lrd' | 'land-layout' | 'cre-purchase' | 'project-finance'>('lrd');

  const fundingSolutions = [
    {
      id: 'lrd',
      title: 'Lease Rental Discounting (LRD)',
      tagline: 'Monetize predictable long-term corporate rental yields',
      roi: 'From 9.15%*',
      ltv: 'Up to 75% Discounting',
      tenor: 'Up to 15 Years (Aligned to Lease)',
      ticket: '₹5 Cr to ₹200+ Cr',
      overview:
        'Lease Rental Discounting (LRD) unlocks immediate liquidity by pledging future rent receivables from Grade-A commercial, IT park, or industrial warehousing tenants into an automated tripartite escrow account.',
      keyFeatures: [
        'Tripartite escrow mechanism between Landlord, Corporate Tenant, and Financing Institution',
        'Discounting up to 75% - 80% of net discounted monthly rental receivables',
        'Tenure structured to match residual lease period and lock-in milestones',
        'Competitive interest spreads starting at 9.15% for AAA/AA rated corporate lessees',
      ],
      idealFor: 'Owners of Grade-A office buildings, multi-brand retail malls, logistics hubs, and pre-leased tech parks.',
      escrowImpact: 'Low operational friction: Tenant pays rent directly to escrow, bank retains EMI, balance sweeps to owner.',
    },
    {
      id: 'land-layout',
      title: 'Land & Plotted Layout Development Finance',
      tagline: 'Capital syndication for residential & commercial layout infrastructure',
      roi: 'From 10.25%*',
      ltv: 'Up to 60% of Project Cost',
      tenor: '3 to 7 Years (Phased Drawdown)',
      ticket: '₹10 Cr to ₹150 Cr',
      overview:
        'Tailored project loans for plotted land developers holding clear title lands with DTCP, BDA, HMDA, or PMRDA master approvals. Capital is disbursed phase-wise to fund site civil grading, road formation, storm drains, and utility grids.',
      keyFeatures: [
        'Financing mapped against sanctioned layout development costs and civil infrastructure milestones',
        'Quarterly interest servicing with principal amortization tied to plot sales deed registrations',
        'Escrow account management aligned with local town planning and RERA development mandates',
        'Comprehensive 30-year mother deed and agricultural-to-non-agricultural DC conversion vetting',
      ],
      idealFor: 'Established land developers creating gated community plotted townships and villa enclave layouts.',
      escrowImpact: 'Disbursement tranches released against independent Chartered Engineer site progress certificates.',
    },
    {
      id: 'cre-purchase',
      title: 'Commercial Real Estate (CRE) Acquisition',
      tagline: 'High-ticket acquisition debt for commercial expansion',
      roi: 'From 9.45%*',
      ltv: 'Up to 65% of Agreement Value',
      tenor: 'Up to 12 Years',
      ticket: '₹3 Cr to ₹100 Cr',
      overview:
        'Term financing designed for corporate enterprises, medical chains, and private family offices seeking to purchase pre-built commercial office spaces, industrial factories, or standalone retail commercial plots.',
      keyFeatures: [
        'Mortgage against the commercial property being purchased with initial equity down-payment',
        'Cash-flow underwriting evaluated on existing corporate EBITDA or anticipated business expansion',
        'Doorstep legal title evaluation including Occupancy Certificate (OC), fire NOC, and building bylaws',
        'Dual valuation methodology: Cost approach and Income capitalization method for fair market pricing',
      ],
      idealFor: 'Mid-market companies expanding their corporate headquarters, distribution hubs, or medical clinics.',
      escrowImpact: 'Direct payment to seller via banker cheque upon flawless execution of registered sale deed.',
    },
    {
      id: 'project-finance',
      title: 'Developer Construction Debt & Project Funding',
      tagline: 'Structured debt for RERA registered residential & commercial towers',
      roi: 'From 11.00%*',
      ltv: 'Up to 55% of Project Valuation',
      tenor: '4 to 7 Years (Construction Linked)',
      ticket: '₹15 Cr to ₹250+ Cr',
      overview:
        'Institutional construction debt packaging for residential apartment complexes and commercial business parks with complete RERA registration, sanctioned building plans, and environmental clearances.',
      keyFeatures: [
        'Stage-wise construction milestone releases verified by bank-empanelled Quantity Surveyors (QS)',
        'RERA 70:30 designated escrow structure safeguarding homeowner deposits and project continuity',
        'Moratorium on principal repayment during active civil construction phase',
        'Refinancing and takeout finance options for high-cost NBFC debt into scheduled commercial banks',
      ],
      idealFor: 'Tier-1 and Tier-2 developers with proven track record of timely delivery and title transparency.',
      escrowImpact: 'Full RERA regulatory compliance with designated project collection and retention accounts.',
    },
  ];

  const currentSolution = fundingSolutions.find((s) => s.id === activeTab) || fundingSolutions[0];

  const technicalChecklist = [
    {
      title: 'Approved Sanction Plan & OC',
      desc: 'Valid building sanction from local urban body (BBMP, BDA, DTCP, etc.) along with Occupancy Certificate (OC) or completion clearances.',
    },
    {
      title: 'Registered Long-Term Lease Deeds',
      desc: 'Tripartite or registered lease agreements highlighting lock-in periods, security deposit details, and 3-year escalation clauses (typically 12-15%).',
    },
    {
      title: '30-Year Chain of Title & Search Report',
      desc: 'Flawless 30-year mother deed flow, EC Form 15 non-encumbrance verification, and zero pendency of title litigation in civil courts.',
    },
    {
      title: 'Tenant Credit Standing & Rating',
      desc: 'Credit rating of lessee entities (AAA / AA corporate ratings yield the lowest lender pricing spreads and maximum debt multipliers).',
    },
    {
      title: 'Statutory Safety Clearances',
      desc: 'Valid Fire NOC, Pollution Control Board (PCB) consent for operation (if applicable), and structural audit certificates by chartered engineers.',
    },
    {
      title: 'DSCR & Cash Flow Feasibility',
      desc: 'Debt Service Coverage Ratio (DSCR) verified at a minimum of 1.25x – 1.40x to ensure safe servicing buffer across the tenor.',
    },
  ];

  return (
    <div className="bg-white">
      {/* 1. Executive Commercial Hero */}
      <section className="relative bg-gradient-to-br from-brand-navy via-[#102434] to-[#0A1824] text-white pt-20 pb-20 lg:pt-24 lg:pb-24 border-b border-white/10 overflow-hidden">
        {/* Ambient Decorative Accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-teal/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-teal/20 border border-brand-teal/30 text-brand-teal-light text-xs font-bold uppercase tracking-wider mb-5">
              <Building2 className="w-4 h-4 text-brand-teal" />
              <span>Commercial Debt &amp; Real Estate Syndication Desk</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight font-heading leading-tight sm:leading-tight">
              Commercial Property Funding, <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-teal via-emerald-400 to-brand-gold">
                LRD &amp; Land Layout Syndication
              </span>
            </h1>

            <p className="mt-5 text-gray-300 text-base sm:text-lg lg:text-xl font-normal leading-relaxed max-w-3xl">
              From monetizing multi-crore corporate lease rentals to securing capital for DTCP/BDA approved plotted layout developments and commercial real estate acquisitions, our advisory desk structures institutional debt from ₹5 Crore to ₹250+ Crore.
            </p>

            {/* Quick Metrics Bar */}
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
              <div>
                <span className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase block">Ticket Size</span>
                <span className="text-xl sm:text-2xl font-black text-white font-mono">₹5 Cr – ₹250+ Cr</span>
                <span className="text-[11px] text-gray-400 block mt-0.5">Flexible structuring</span>
              </div>
              <div>
                <span className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase block">Starting ROI</span>
                <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">9.15%* p.a.</span>
                <span className="text-[11px] text-gray-400 block mt-0.5">Corporate benchmarks</span>
              </div>
              <div>
                <span className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase block">Max LRD Discounting</span>
                <span className="text-xl sm:text-2xl font-black text-brand-gold font-mono">Up to 75%</span>
                <span className="text-[11px] text-gray-400 block mt-0.5">Of net monthly rentals</span>
              </div>
              <div>
                <span className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase block">Target DSCR</span>
                <span className="text-xl sm:text-2xl font-black text-brand-teal font-mono">1.25x – 1.40x</span>
                <span className="text-[11px] text-gray-400 block mt-0.5">Coverage buffer</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap gap-4 items-center">
              <a
                href="#enquiry-form"
                className="px-7 py-3.5 bg-brand-teal hover:bg-brand-teal-hover text-white text-sm font-bold rounded-corporate shadow-lg shadow-brand-teal/20 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                <span>Request High-Ticket Advisory</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                to="/calculator"
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-corporate text-sm font-semibold transition-all backdrop-blur-sm flex items-center gap-2"
              >
                <FileSpreadsheet className="w-4 h-4 text-brand-teal" />
                <span>Simulate Debt &amp; EMI</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Four Commercial Funding Solutions (Interactive Tabs) */}
      <section className="py-20 lg:py-24 bg-brand-ivory/60 border-b border-brand-border">
        <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-teal block mb-2">
              Bespoke Capital Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-navy font-heading tracking-tight">
              Institutional Solutions for Commercial Assets
            </h2>
            <p className="mt-3 text-sm sm:text-base text-brand-slate leading-relaxed">
              Every commercial asset class requires distinct debt covenant structures. Select a facility below to examine underwriting ratios, tenure horizons, and escrow mechanics.
            </p>

            {/* Tab Pill Selectors */}
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {fundingSolutions.map((sol) => (
                <button
                  key={sol.id}
                  onClick={() => setActiveTab(sol.id as any)}
                  className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                    activeTab === sol.id
                      ? 'bg-brand-navy text-white shadow-md scale-105'
                      : 'bg-white text-brand-slate hover:text-brand-navy border border-brand-border hover:bg-white/80'
                  }`}
                >
                  <Building2 className={`w-4 h-4 ${activeTab === sol.id ? 'text-brand-teal' : 'text-brand-slate'}`} />
                  <span>{sol.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Active Solution Display Card */}
          <div className="bg-white rounded-3xl border border-brand-border shadow-subtle p-6 sm:p-10 lg:p-12 transition-all">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Left Column: Solution Detail */}
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-2">
                  <span className="inline-block px-3 py-1 rounded bg-brand-teal-light text-brand-teal text-xs font-bold uppercase tracking-wider">
                    {currentSolution.tagline}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-brand-navy font-heading">
                    {currentSolution.title}
                  </h3>
                  <p className="text-brand-slate text-sm sm:text-base leading-relaxed pt-1">
                    {currentSolution.overview}
                  </p>
                </div>

                {/* Key Underwriting Highlights */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-brand-navy">
                    Key Underwriting &amp; Structuring Parameters:
                  </h4>
                  <div className="space-y-2.5">
                    {currentSolution.keyFeatures.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-3 text-xs sm:text-sm text-brand-navy font-medium">
                        <CheckCircle2 className="w-4 h-4 text-brand-teal flex-shrink-0 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ideal Fit & Escrow Flow Box */}
                <div className="p-4 bg-brand-ivory rounded-xl border border-brand-border/80 space-y-2 text-xs">
                  <div>
                    <span className="font-bold text-brand-navy">Target Borrower Profile: </span>
                    <span className="text-brand-slate">{currentSolution.idealFor}</span>
                  </div>
                  <div>
                    <span className="font-bold text-brand-navy">Escrow &amp; Cash Flow Dynamic: </span>
                    <span className="text-brand-slate">{currentSolution.escrowImpact}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Facility Metrics Dashboard */}
              <div className="lg:col-span-5 bg-gradient-to-br from-brand-navy to-[#183247] text-white p-6 sm:p-8 rounded-2xl shadow-xl space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <span className="text-xs uppercase font-bold tracking-wider text-brand-teal-light">Facility Metrics</span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                    Live Term Sheet
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <span className="text-[11px] text-gray-400 block font-medium">Interest Rate</span>
                    <span className="text-xl font-black text-emerald-400 font-mono">{currentSolution.roi}</span>
                    <span className="text-[10px] text-gray-400 block mt-0.5">Fixed / Floating spread</span>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <span className="text-[11px] text-gray-400 block font-medium">Sanction Limit</span>
                    <span className="text-xl font-black text-white font-mono">{currentSolution.ticket}</span>
                    <span className="text-[10px] text-gray-400 block mt-0.5">Collateral dependent</span>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <span className="text-[11px] text-gray-400 block font-medium">LTV / Coverage</span>
                    <span className="text-xl font-black text-brand-gold font-mono">{currentSolution.ltv}</span>
                    <span className="text-[10px] text-gray-400 block mt-0.5">Of asset / rent stream</span>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <span className="text-[11px] text-gray-400 block font-medium">Facility Tenor</span>
                    <span className="text-xl font-black text-brand-teal-light font-mono">{currentSolution.tenor}</span>
                    <span className="text-[10px] text-gray-400 block mt-0.5">Structured amortization</span>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href="#enquiry-form"
                    className="w-full py-3 bg-brand-teal hover:bg-brand-teal-hover text-white text-xs sm:text-sm font-bold rounded-corporate text-center transition-all flex items-center justify-center gap-2 shadow-md"
                  >
                    <span>Initiate Confidential Assessment</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The Tripartite Escrow Workflow (Visual Architecture) */}
      <section className="py-20 lg:py-24 bg-white border-b border-brand-border">
        <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="max-w-3xl mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-teal block mb-1">
              Escrow Governance
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-navy font-heading tracking-tight">
              How LRD Escrow Tripartite Mechanics Function
            </h2>
            <p className="mt-3 text-brand-slate text-sm sm:text-base leading-relaxed">
              Institutional lenders mandate a strictly controlled cash-flow routing mechanism to ensure risk-free debt servicing while preserving property owner cash surpluses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 bg-brand-ivory/50 rounded-2xl border border-brand-border relative hover:border-brand-teal/50 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-brand-navy text-white flex items-center justify-center font-bold text-sm mb-4">
                  01
                </div>
                <h3 className="font-bold text-base text-brand-navy mb-2">Corporate Lease Execution</h3>
                <p className="text-xs sm:text-sm text-brand-slate leading-relaxed">
                  Landlord enters into a registered multi-year lease deed with an institutional or MNC corporate tenant with verified lock-in period.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-brand-border/60 flex items-center text-[11px] font-semibold text-brand-teal">
                <span>Tripartite Agreement</span>
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </div>

            <div className="p-6 bg-brand-ivory/50 rounded-2xl border border-brand-border relative hover:border-brand-teal/50 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-brand-teal text-white flex items-center justify-center font-bold text-sm mb-4">
                  02
                </div>
                <h3 className="font-bold text-base text-brand-navy mb-2">Designated Escrow Account</h3>
                <p className="text-xs sm:text-sm text-brand-slate leading-relaxed">
                  Lender creates a dedicated no-lien escrow account. Tenant irrevocably instructs payroll/finance to credit gross rental directly to this escrow.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-brand-border/60 flex items-center text-[11px] font-semibold text-brand-teal">
                <span>Direct Inflow Routing</span>
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </div>

            <div className="p-6 bg-brand-ivory/50 rounded-2xl border border-brand-border relative hover:border-brand-teal/50 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-brand-navy text-white flex items-center justify-center font-bold text-sm mb-4">
                  03
                </div>
                <h3 className="font-bold text-base text-brand-navy mb-2">Automated Debt Servicing</h3>
                <p className="text-xs sm:text-sm text-brand-slate leading-relaxed">
                  On the scheduled billing day, the lender automatically debits the contractual EMI (Principal + Interest) from the escrow cash pool.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-brand-border/60 flex items-center text-[11px] font-semibold text-brand-teal">
                <span>Zero Default Risk</span>
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </div>

            <div className="p-6 bg-brand-ivory/50 rounded-2xl border border-brand-border relative hover:border-brand-teal/50 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm mb-4">
                  04
                </div>
                <h3 className="font-bold text-base text-brand-navy mb-2">Automatic Surplus Sweep</h3>
                <p className="text-xs sm:text-sm text-brand-slate leading-relaxed">
                  All residual surplus rental cash flow over and above the monthly EMI automatically sweeps directly into the property owner’s operational current account.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-brand-border/60 flex items-center text-[11px] font-semibold text-emerald-600">
                <span>Liquid Cash Yield</span>
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Commercial Underwriting & Technical Checklist */}
      <section className="py-20 lg:py-24 bg-brand-ivory/40 border-b border-brand-border">
        <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-teal block mb-1">
              Rigorous Diligence
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-navy font-heading tracking-tight">
              Institutional Technical &amp; Legal Audit Checklist
            </h2>
            <p className="mt-3 text-brand-slate text-sm sm:text-base leading-relaxed">
              Before submitting loan proposals to scheduled commercial banks, our debt advisory team audits each document to preempt institutional committee objections.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {technicalChecklist.map((item, idx) => (
              <div
                key={idx}
                className="p-6 bg-white rounded-2xl border border-brand-border shadow-subtle hover:border-brand-teal/40 transition-all space-y-3"
              >
                <div className="w-9 h-9 rounded-lg bg-brand-teal-light text-brand-teal flex items-center justify-center font-bold text-sm">
                  0{idx + 1}
                </div>
                <h3 className="text-base font-bold text-brand-navy font-heading">{item.title}</h3>
                <p className="text-xs sm:text-sm text-brand-slate leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Underwriting Regulatory Notice */}
          <div className="mt-10 p-5 bg-white rounded-xl border border-brand-border text-xs text-brand-slate leading-relaxed flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-brand-teal flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-brand-navy">Statutory &amp; Underwriting Notice: </span>
              All high-ticket debt proposals, commercial sanctions, valuations, and term sheet releases are governed by RBI credit exposure limits and individual lender underwriting mandates. WealthAnchor acts as an independent debt advisor, structuring applications, negotiating term sheet spreads, and facilitating documentation.
            </div>
          </div>
        </div>
      </section>

      {/* 5. Preloaded High-Ticket Consultation Form */}
      <div id="enquiry-form">
        <EnquiryForm
          services={services}
          selectedService={fundingService}
          onClearSelectedService={() => {}}
        />
      </div>
    </div>
  );
};
