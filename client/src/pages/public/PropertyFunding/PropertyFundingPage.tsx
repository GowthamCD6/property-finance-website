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
import { EnquiryForm } from '../../../components/common/EnquiryForm';
import { InteractiveDocumentVault } from '../../../components/common/InteractiveDocumentVault';
import { Service } from '../../../types';

export const PropertyFundingPage: React.FC = () => {
  const context = useOutletContext<{ services?: Service[] }>();
  const services = context?.services || [];
  const fundingService = services.find((s) => s.slug === 'property-backed-funding') || null;

  const [activeTab, setActiveTab] = useState<'bank-takeover' | 'plot-purchase' | 'home-purchase' | 'commercial-purchase'>('bank-takeover');

  const fundingSolutions = [
    {
      id: 'bank-takeover',
      title: 'Loan Takeover: Private to Govt. Bank',
      tagline: 'Transfer high-interest loans to lowest PSU government bank rates',
      roi: 'From 7.25%* (HL) / 8.50%* (LAP)',
      ltv: 'Up to 85% of Current Valuation',
      tenor: 'Extended Amortization up to 30 Yrs',
      ticket: '₹10 Lakhs to ₹25+ Crore',
      overview:
        'Our signature loan takeover desk transfers existing high-interest loans from private banks, NBFCs, or housing finance companies to low-interest Government (PSU) banks like SBI, PNB, and Bank of Baroda at the lowest interest rates.',
      keyFeatures: [
        'Drastically slash your interest rates down to benchmark lows starting from 7.25% p.a.',
        'Zero advance fees with end-to-end List of Documents (LOD) and foreclosure retrieval',
        'Significant monthly EMI reduction that frees up critical household & business cash flow',
        'Top-up facility available at matching low home/mortgage loan interest rates',
      ],
      idealFor: 'Borrowers currently paying high interest rates with private banks/NBFCs seeking government bank stability and lowest EMIs.',
      escrowImpact: 'Seamless transfer: The government bank directly takes over original title deeds from your current private lender.',
    },
    {
      id: 'plot-purchase',
      title: 'Plot Purchase & Plot + Construction Loans',
      tagline: 'Financing for vacant plot acquisition and composite house construction',
      roi: 'From 7.25%*',
      ltv: 'Up to 80% of Agreement Value',
      tenor: 'Up to 30 Years',
      ticket: '₹15 Lakhs to ₹10+ Crore',
      overview:
        'Specialized financing for purchasing vacant residential plots, layout plots, and combined composite packages where plot purchase and progressive house construction are sanctioned together under one unified approval.',
      keyFeatures: [
        'Financing for Plot Purchase in approved layout developments',
        'Integrated composite sanction for Plot Purchase + Phased House Construction',
        'Disbursements linked to civil engineering construction milestones',
        'Assistance with government subsidy under applicable housing schemes',
      ],
      idealFor: 'Families and land buyers acquiring plots or building custom independent homes and villas.',
      escrowImpact: 'Phased fund releases ensure construction progresses smoothly without funding shortages.',
    },
    {
      id: 'home-purchase',
      title: 'New & Old Home Purchase & Tiled House Loans',
      tagline: 'Ready homes, resale properties, and traditional tiled house purchase',
      roi: 'From 7.25%*',
      ltv: 'Up to 85% of Property Value',
      tenor: 'Up to 30 Years',
      ticket: '₹15 Lakhs to ₹15+ Crore',
      overview:
        'Comprehensive purchase loan syndication covering brand-new ready-to-move homes, pre-owned resale homes, and traditional tiled houses across leading government and private banks.',
      keyFeatures: [
        'New Home Purchase with expedited valuation and bank sanction within 48 hours',
        'Old Home Purchase with thorough 30-year mother deed audit and structural life assessment',
        'Tiled House Purchase financing with specialized regional title clearances',
        'Government subsidy guidance for eligible applicants under PMAY guidelines',
      ],
      idealFor: 'Homebuyers acquiring ready villas, apartments, resale houses, or heritage tiled homes.',
      escrowImpact: 'Banker cheque issued directly to seller upon flawless execution of the registered sale deed.',
    },
    {
      id: 'commercial-purchase',
      title: 'Commercial Building Purchase & LRD',
      tagline: 'Capital for commercial complexes, retail units & rental discounting',
      roi: 'From 8.50%*',
      ltv: 'Up to 70% of Valuation',
      tenor: 'Up to 15 Years',
      ticket: '₹50 Lakhs to ₹50+ Crore',
      overview:
        'Long-term term debt tailored for business entities and commercial investors purchasing standalone commercial buildings, shopping complexes, textile units, and retail showrooms.',
      keyFeatures: [
        'Financing against commercial building purchases with customized business amortization',
        'Lease Rental Discounting (LRD) against future corporate tenant lease receivables',
        'Starting interest rates from 8.50% p.a. across PSU and commercial bank networks',
        'Debt Service Coverage Ratio (DSCR) underwriting tailored to business cash flows',
      ],
      idealFor: 'Textile manufacturers, business owners, retail showroom promoters, and commercial investors.',
      escrowImpact: 'Dual valuation methodology ensures maximum permissible borrowing eligibility.',
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
                  Purchase Loans &amp; Private to Govt. Bank Takeover Desk
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white tracking-tight font-heading leading-tight">
                Purchase Loans &amp; Takeovers, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-teal via-emerald-400 to-brand-gold">
                  Engineered for Lowest Interest Rates.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-gray-300 font-normal leading-relaxed max-w-2xl">
                Specialized purchase loans for plot acquisition, plot with construction, new/old homes, tiled houses, and commercial buildings. Plus our high-impact loan takeover desk transferring loans from private banks to government banks at lowest interest rates.
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
          3. DOCUMENTATION CHECKLIST
          ──────────────────────────────────────────────────────────── */}
      <InteractiveDocumentVault loanType="property-backed-funding" />

      {/* ────────────────────────────────────────────────────────────
          4. PRELOADED CONSULTATION FORM
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
