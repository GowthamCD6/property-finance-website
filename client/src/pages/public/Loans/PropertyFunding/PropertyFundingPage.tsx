import React, { useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  Building2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  FileSpreadsheet,
} from 'lucide-react';
import { EnquiryForm } from '../../../../components/EnquiryForm/EnquiryForm';
import { InteractiveDocumentVault } from '../../../../components/common/InteractiveDocumentVault';
import { Service } from '../../../../types';
import purchaseLoanHeroImage from '../../../../assets/images/purchase-loan.jpg';

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

  return (
    <div className="bg-[#f7f7f3] min-h-screen text-brand-navy">
      {/* ────────────────────────────────────────────────────────────
          1. CONTENT-SPECIFIC HERO: COMMERCIAL REAL ESTATE & LRD DESK
          ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-slate-950 text-white pt-12 sm:pt-16 lg:pt-20 pb-16 lg:pb-24 border-b border-brand-teal/20">
        {/* Background Photographic Image for Purchase Loans & Takeover */}
        <div className="absolute inset-0 z-0">
          <img
            src={purchaseLoanHeroImage}
            alt="Purchase Loans & Property Takeover Architecture"
            className="w-full h-full object-cover object-[80%_center] brightness-[1.15] contrast-[1.02]"
            loading="eager"
          />
          {/* Softened directional gradient: Keeps left side readable for text while letting the image shine brightly */}
          <div className="absolute inset-0 bg-slate-950/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/75 via-slate-950/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-slate-950/70" />
        </div>

        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-teal/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="w-[92%] sm:w-[88%] lg:w-[85%] max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Column: Commercial & Retail Mandate */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/85 border border-emerald-500/35 backdrop-blur-md shadow-sm">
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 font-heading">
                  Purchase Loans &amp; Private to Govt. Bank Takeover Desk
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white tracking-tight font-heading leading-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
                Purchase Loans &amp; Takeovers, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-emerald-300 to-amber-200 drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
                  Engineered for Lowest Interest Rates.
                </span>
              </h1>

              <p className="text-sm sm:text-base lg:text-lg text-slate-200 font-normal leading-relaxed max-w-2xl drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                Specialized purchase loans for plot acquisition, plot with construction, new/old homes, tiled houses, and commercial buildings. Plus our signature bank takeover desk transferring loans from private banks to government banks at lowest interest rates.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-wrap items-center gap-3.5">
                <a
                  href="#enquiry-form"
                  className="px-6 sm:px-8 py-3.5 rounded-full bg-gradient-to-r from-teal-500 to-[#20B2AA] hover:from-teal-400 hover:to-teal-500 text-white font-extrabold text-xs sm:text-sm tracking-wide shadow-lg shadow-teal-950/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 font-heading cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  <span>Request Purchase &amp; Takeover Assessment</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <Link
                  to="/calculator"
                  className="px-6 py-3.5 rounded-full bg-slate-900/85 hover:bg-slate-800/90 text-white font-bold text-xs sm:text-sm border border-white/20 hover:border-teal-400/50 backdrop-blur-md shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 font-heading cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 text-brand-teal" />
                  <span>Calculate Takeover Savings</span>
                </Link>
              </div>

              {/* Key Institutional Benchmarks */}
              <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-semibold text-slate-300 font-sans">
                <span className="px-3 py-1 rounded-full bg-slate-900/85 border border-white/15 backdrop-blur-sm">
                  Plot &amp; Home: From 7.25%*
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-900/85 border border-white/15 backdrop-blur-sm">
                  Commercial: From 8.50%*
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-900/85 border border-white/15 backdrop-blur-sm">
                  Amortization: Up to 30 Years
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-900/85 border border-white/15 backdrop-blur-sm">
                  Zero Advance Fees
                </span>
              </div>
            </div>

            {/* Right Column: Institutional Term Sheet Matrix Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#112334]/95 to-[#0c1b29]/95 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-7 shadow-2xl relative font-sans text-white">
              <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs uppercase font-extrabold tracking-wider text-teal-200 font-heading">
                    Current Lending Benchmarks
                  </span>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-400/40">
                  Govt. &amp; Private Panel
                </span>
              </div>

              <div className="mt-4.5 grid grid-cols-2 gap-3.5">
                <div className="bg-white/5 p-3.5 sm:p-4 rounded-2xl border border-white/10">
                  <span className="text-[11px] text-slate-300 block font-medium">Starting Interest Rate</span>
                  <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">From 7.25%*</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">PSU Bank Linked EBLR</span>
                </div>
                <div className="bg-white/5 p-3.5 sm:p-4 rounded-2xl border border-white/10">
                  <span className="text-[11px] text-slate-300 block font-medium">Takeover Savings</span>
                  <span className="text-xl sm:text-2xl font-black text-white font-mono">Save up to 2.5%</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">ROI drop on transfer</span>
                </div>
                <div className="bg-white/5 p-3.5 sm:p-4 rounded-2xl border border-white/10">
                  <span className="text-[11px] text-slate-300 block font-medium">Maximum LTV</span>
                  <span className="text-xl sm:text-2xl font-black text-brand-gold font-mono">Up to 85%</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Of market valuation</span>
                </div>
                <div className="bg-white/5 p-3.5 sm:p-4 rounded-2xl border border-white/10">
                  <span className="text-[11px] text-slate-300 block font-medium">Extended Tenor</span>
                  <span className="text-xl sm:text-2xl font-black text-brand-teal-light font-mono">Up to 30 Yrs</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Substantially lower EMI</span>
                </div>
              </div>

              <div className="mt-4 p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-200 leading-relaxed font-sans">
                <span><strong>Bank Takeover Advantage:</strong> Government bank pays off existing private financier, retrieves original mother documents directly, and significantly slashes monthly EMI.</span>
              </div>

              <div className="mt-4 pt-3.5 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-slate-400">Zero Advance Processing Fees</span>
                <a
                  href="#enquiry-form"
                  className="text-xs font-bold text-teal-300 hover:text-white flex items-center gap-1 transition-colors font-heading"
                >
                  <span>Check Takeover Eligibility</span>
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
      <section className="py-20 lg:py-24 bg-[#f7f7f3] border-b border-brand-border">
        <div className="w-[92%] sm:w-[88%] lg:w-[85%] max-w-7xl mx-auto">
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

                <div className="p-4 bg-[#f7f7f3] rounded-xl border border-brand-border/80 space-y-2 text-xs">
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
      <div id="enquiry-form" className="bg-[#f7f7f3]">
        <EnquiryForm
          services={services}
          selectedService={fundingService}
          onClearSelectedService={() => {}}
        />
      </div>
    </div>
  );
};

export const PurchaseLoansPage = PropertyFundingPage;
export default PropertyFundingPage;
