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
import { EnquiryForm } from '../../../components/public/EnquiryForm';
import { Service } from '../../../types';

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
    <div className="bg-brand-bg min-h-screen text-brand-navy">
      {/* ────────────────────────────────────────────────────────────
          1. CONTENT-SPECIFIC HERO: COMMERCIAL REAL ESTATE & LRD DESK
          ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#0A1926] text-white pt-20 pb-16 lg:pt-28 lg:pb-24 border-b border-brand-teal/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-teal/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Commercial Mandate */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 backdrop-blur-md">
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                  Institutional Commercial Real Estate &amp; LRD Desk
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white tracking-tight font-heading leading-tight">
                High-Ticket Commercial Debt, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-teal via-emerald-400 to-brand-gold">
                  Plotted Layouts &amp; LRD Syndication.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-gray-300 font-normal leading-relaxed max-w-2xl">
                Structured capital syndication from ₹5 Crore to ₹250+ Crore for commercial property developers, Grade-A IT office parks, logistics warehousing hubs, and approved plotted layout infrastructure.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href="#enquiry-form"
                  className="px-7 py-3.5 bg-brand-teal hover:bg-brand-teal-hover text-white text-sm font-bold rounded-corporate shadow-lg shadow-brand-teal/20 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <span>Request Term Sheet Feasibility</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <Link
                  to="/calculator"
                  className="px-6 py-3.5 bg-white/10 hover:bg-white/15 text-white border border-white/20 rounded-corporate text-sm font-semibold transition-all backdrop-blur-sm flex items-center gap-2"
                >
                  <FileSpreadsheet className="w-4 h-4 text-brand-teal" />
                  <span>Model Debt Cash Flows</span>
                </Link>
              </div>

              {/* Key Institutional Benchmarks */}
              <div className="pt-4 flex flex-wrap gap-2 text-[11px] font-semibold text-gray-400">
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
                  Ticket Size: ₹5 Cr – ₹250+ Cr
                </span>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
                  LRD Discounting: Up to 75% Net Rent
                </span>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
                  Target DSCR: 1.25x – 1.40x
                </span>
              </div>
            </div>

            {/* Right Column: Institutional Term Sheet Matrix Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#112334] to-[#0c1b29] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs uppercase font-bold tracking-wider text-emerald-300">
                    Institutional Debt Parameters
                  </span>
                </div>
                <span className="text-[11px] text-gray-400 font-mono">Wholesale Desk</span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                  <span className="text-[11px] text-gray-400 block font-medium">Starting Interest Rate</span>
                  <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">From 9.15%*</span>
                  <span className="text-[10px] text-gray-400 block mt-0.5">Corporate AAA lessees</span>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                  <span className="text-[11px] text-gray-400 block font-medium">Loan Quantum</span>
                  <span className="text-xl sm:text-2xl font-black text-white font-mono">₹5 Cr – ₹250 Cr</span>
                  <span className="text-[10px] text-gray-400 block mt-0.5">Multi-bank consortium</span>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                  <span className="text-[11px] text-gray-400 block font-medium">Facility Tenor</span>
                  <span className="text-xl sm:text-2xl font-black text-brand-gold font-mono">Up to 15 Yrs</span>
                  <span className="text-[10px] text-gray-400 block mt-0.5">Aligned to lease lock-in</span>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                  <span className="text-[11px] text-gray-400 block font-medium">Escrow Security</span>
                  <span className="text-xl sm:text-2xl font-black text-brand-teal-light font-mono">Tripartite</span>
                  <span className="text-[10px] text-gray-400 block mt-0.5">Automated surplus sweep</span>
                </div>
              </div>

              <div className="mt-5 p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-300 leading-relaxed">
                <span><strong>LRD Escrow Mechanics:</strong> Lessee pays monthly rent directly to a designated no-lien bank escrow account. Bank debits EMI and automatically sweeps net balance to owner.</span>
              </div>

              <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-gray-400">Strict Non-Disclosure Protocol</span>
                <a
                  href="#enquiry-form"
                  className="text-xs font-bold text-brand-teal-light hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>Initiate Commercial Review</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────
          2. FOUR COMMERCIAL FUNDING SOLUTIONS (Interactive Tabs)
          ──────────────────────────────────────────────────────────── */}
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

      {/* ────────────────────────────────────────────────────────────
          3. PRELOADED CONSULTATION FORM
          ──────────────────────────────────────────────────────────── */}
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
