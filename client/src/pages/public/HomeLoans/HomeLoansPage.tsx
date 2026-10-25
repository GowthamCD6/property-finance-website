import React, { useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  Home,
  CheckCircle2,
  FileCheck2,
  ArrowRight,
  TrendingUp,
  Percent,
  Layers,
  HelpCircle,
  Building,
  Landmark,
  Compass,
  FileText,
  ShieldCheck,
  ChevronRight,
  Calculator,
  AlertCircle,
  Sparkles,
  MapPin,
  Check,
} from 'lucide-react';
import { EnquiryForm } from '../../../components/public/EnquiryForm';
import { Service } from '../../../types';

export const HomeLoansPage: React.FC = () => {
  const context = useOutletContext<{ services?: Service[] }>();
  const services = context?.services || [];
  const homeLoanService = services.find((s) => s.slug === 'home-loans') || null;

  const [activeProfile, setActiveProfile] = useState<'salaried' | 'selfEmployed' | 'nri'>('salaried');
  const [selectedCollateralType, setSelectedCollateralType] = useState<'plot' | 'composite' | 'ready'>('plot');

  // Key Financial Benchmarks for Land & Home Loans
  const metrics = [
    { value: '8.40%*', label: 'Starting Benchmark ROI', sub: 'RBI Repo-Linked EBLR' },
    { value: 'Up to 85%', label: 'Loan-to-Value (LTV)', sub: '70%–75% for Plot Loans' },
    { value: 'Up to 30 Yrs', label: 'Repayment Tenure', sub: 'Extended Amortization' },
    { value: '₹25L – ₹20Cr+', label: 'Ticket Flexibility', sub: 'Affordable to Ultra-Luxury' },
  ];

  // 6 Specialized Financing Categories for Land & Homes
  const fundingPathways = [
    {
      title: 'Residential Plot / Land Purchase Loan',
      badge: 'Land Acquisition',
      desc: 'Securing bank financing to purchase residential plots in approved layouts (BDA, BMRDA, DTCP, HMDA, PMRDA, CIDCO) with verified freehold titles.',
      highlights: [
        'Financing for non-agricultural converted land',
        'LTV typically 70%–75% of agreement value',
        '30-Year encumbrance certificate (Form 15) verification',
      ],
      icon: (
        <svg className="w-6 h-6 text-brand-teal" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" d="M12 2.25a.75.75 0 01.75.75v1.168l7.854 3.142A1.5 1.5 0 0121.5 8.65v.6a.75.75 0 01-.75.75H3.25a.75.75 0 01-.75-.75v-.6c0-.62.38-1.18.966-1.39L11.25 4.168V3a.75.75 0 01.75-.75zM4.5 12a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v6a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75v-6zm5.25 0a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v6a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75v-6zm5.25 0a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v6a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75v-6zm-12.75 8.25a.75.75 0 000 1.5h19.5a.75.75 0 000-1.5H2.25z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      title: 'Composite Loan (Plot Purchase + Construction)',
      badge: 'Single Integrated Sanction',
      desc: 'A seamless composite package combining funds for land acquisition followed by progressive construction tranches as your home building progresses.',
      highlights: [
        'Single processing fee & unified sanction letter',
        'Phased disbursement linked to civil milestones',
        'Tax advantages under Section 24b upon completion',
      ],
      icon: (
        <svg className="w-6 h-6 text-brand-teal" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
          <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
        </svg>
      ),
    },
    {
      title: 'Self-Construction Loan on Owned Site',
      badge: 'Home Building',
      desc: 'Funding for landowners building an independent villa, duplex, or multi-floor residential property against approved municipal building plans.',
      highlights: [
        'Disbursements against architect stage completion certificates',
        'Up to 80% funding of estimated construction cost',
        'Interest-only pre-EMI during construction phase',
      ],
      icon: (
        <svg className="w-6 h-6 text-brand-teal" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" d="M3 6a3 3 0 013-3h2.25a3 3 0 013 3v2.25a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm9.75 0a3 3 0 013-3H18a3 3 0 013 3v2.25a3 3 0 01-3 3h-2.25a3 3 0 01-3-3V6zM3 15.75a3 3 0 013-3h2.25a3 3 0 013 3V18a3 3 0 01-3 3H6a3 3 0 01-3-3v-2.25zm9.75 0a3 3 0 013-3H18a3 3 0 013 3V18a3 3 0 01-3 3h-2.25a3 3 0 01-3-3v-2.25z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      title: 'Ready-to-Move-In & Resale Mortgages',
      badge: 'Immediate Possession',
      desc: 'Complete title diligence, society NOC verification, and prior deed examination for smooth resale acquisitions across apartments and luxury gated villas.',
      highlights: [
        'Scrutiny of Occupancy Certificate (OC) & Khata A extract',
        'Fast turnaround with direct zonal valuation desks',
        'Guidance on stamp duty and registration financing',
      ],
      icon: (
        <svg className="w-6 h-6 text-brand-teal" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.728-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      title: 'Under-Construction Builder Purchases (RERA)',
      badge: 'RERA Compliant',
      desc: 'Guiding buyers through developer tripartite agreements, Approved Project Financials (APF), and construction-linked payment schedule compliance.',
      highlights: [
        'Cross-verifying builder APF code across 40+ lenders',
        'Pre-EMI and full-EMI disbursement options',
        'Escrow account validation under RERA norms',
      ],
      icon: (
        <svg className="w-6 h-6 text-brand-teal" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" d="M4.5 2.25a.75.75 0 000 1.5v16.5h-.75a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5h-.75V3.75a.75.75 0 000-1.5h-15zM9 6a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5H9zm-.75 5.25a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75zm.75 3.75a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5H9zm4.5-9a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zm-.75 5.25a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zm.75 3.75a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5h-1.5z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      title: 'Balance Transfer + Home Improvement Top-Up',
      badge: 'Rate Optimization',
      desc: 'Refinancing an existing high-cost home loan to current benchmark lows (8.40%–8.65%) while unlocking a low-cost top-up for interiors or personal equity.',
      highlights: [
        'Slashing 50 to 125 bps from your current interest rate',
        'Top-up sanctions up to 100% of original home loan',
        'End-to-end list of documents (LOD) retrieval assistance',
      ],
      icon: (
        <svg className="w-6 h-6 text-brand-teal" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z" clipRule="evenodd" />
        </svg>
      ),
    },
  ];

  // Critical Land Financing Advisory Nuances
  const landAdvisoryPoints = [
    {
      title: 'Agricultural vs. Non-Agricultural (NA) Land',
      detail: 'Banks in India strictly prohibit home loan financing on un-converted agricultural farmland. The plot must possess official DC conversion to non-agricultural residential use and have approved layout sanctions from local metropolitan authorities (e.g. BDA, BMRDA, DTCP, HMDA).',
    },
    {
      title: 'Construction Timeline Mandate on Plots',
      detail: 'Most public and private sector banks sanction plot loans under the condition that residential construction must commence within 2 to 3 years from the date of plot registration. Failure to begin construction may result in conversion of the rate to commercial interest.',
    },
    {
      title: 'Khata Classification & Title Regularity',
      detail: 'Properties situated in municipal jurisdictions must have legitimate A-Khata or equivalent freehold mutation extracts. Gram Panchayat / B-Khata properties face restricted lender appetite and require specialized private lending avenues.',
    },
  ];

  return (
    <div className="bg-brand-bg min-h-screen text-brand-navy">
      {/* ────────────────────────────────────────────────────────────
          1. CONTENT-SPECIFIC HERO: LAND & HOME LOAN ARCHITECTURE
          ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#0A1622] text-white pt-20 pb-16 lg:pt-28 lg:pb-24 border-b border-brand-teal/20">
        {/* Subtle Architectural Blueprint Grid Background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute top-10 right-10 w-96 h-96 bg-brand-teal/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Dedicated Heading & Value Proposition */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-teal/15 border border-brand-teal/30 backdrop-blur-md">
                <Compass className="w-4 h-4 text-brand-teal" />
                <span className="text-xs font-bold uppercase tracking-wider text-brand-teal-light">
                  Land Acquisition &amp; Home Loan Advisory Desk
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white tracking-tight font-heading leading-tight">
                Land &amp; Home Loans, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-teal via-emerald-400 to-sky-300">
                  Engineered for Lowest Lifetime Cost.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-gray-300 font-normal leading-relaxed max-w-2xl">
                From purchasing residential plots in BDA/DTCP layouts to composite plot-plus-construction financing and ready resale homes, our advisors evaluate 40+ lending criteria to secure maximum permissible LTV and benchmark interest rates.
              </p>

              {/* Quick Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href="#enquiry-form"
                  className="px-7 py-3.5 bg-brand-teal hover:bg-brand-teal-hover text-white text-sm font-bold rounded-corporate shadow-lg shadow-brand-teal/20 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <span>Request Land &amp; Home Assessment</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <Link
                  to="/calculator"
                  className="px-6 py-3.5 bg-white/10 hover:bg-white/15 text-white border border-white/20 rounded-corporate text-sm font-semibold transition-all backdrop-blur-sm flex items-center gap-2"
                >
                  <Calculator className="w-4 h-4 text-brand-teal" />
                  <span>Composite EMI Calculator</span>
                </Link>
              </div>

              {/* Title & Layout Assurance Tags */}
              <div className="pt-4 flex flex-wrap gap-2 text-[11px] font-semibold text-gray-400">
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> BDA / DTCP / HMDA Approved Sites
                </span>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Freehold A-Khata Titles
                </span>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> 30-Year EC Form 15 Vetted
                </span>
              </div>
            </div>

            {/* Right Column: Interactive Land & Home Loan Term Matrix Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#12263a] to-[#0d1d2c] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs uppercase font-bold tracking-wider text-brand-teal-light">
                    Current Lending Benchmarks
                  </span>
                </div>
                <span className="text-[11px] text-gray-400 font-mono">Q3 FY26 Update</span>
              </div>

              {/* Interactive Property Type Selector Inside Hero Card */}
              <div className="mt-4 grid grid-cols-3 gap-2 p-1 bg-white/5 rounded-xl border border-white/10 text-xs font-bold text-center">
                <button
                  onClick={() => setSelectedCollateralType('plot')}
                  className={`py-2 rounded-lg transition-all ${
                    selectedCollateralType === 'plot'
                      ? 'bg-brand-teal text-white shadow'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Plot Loan
                </button>
                <button
                  onClick={() => setSelectedCollateralType('composite')}
                  className={`py-2 rounded-lg transition-all ${
                    selectedCollateralType === 'composite'
                      ? 'bg-brand-teal text-white shadow'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Composite
                </button>
                <button
                  onClick={() => setSelectedCollateralType('ready')}
                  className={`py-2 rounded-lg transition-all ${
                    selectedCollateralType === 'ready'
                      ? 'bg-brand-teal text-white shadow'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Ready Home
                </button>
              </div>

              {/* Dynamic Rate & LTV Display */}
              <div className="mt-5 grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                  <span className="text-[11px] text-gray-400 block font-medium">Starting Interest Rate</span>
                  <span className="text-2xl font-black text-emerald-400 font-mono">
                    {selectedCollateralType === 'plot' ? '8.65%*' : selectedCollateralType === 'composite' ? '8.55%*' : '8.40%*'}
                  </span>
                  <span className="text-[10px] text-gray-400 block mt-0.5">Repo-Linked EBLR</span>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                  <span className="text-[11px] text-gray-400 block font-medium">Maximum LTV</span>
                  <span className="text-2xl font-black text-brand-gold font-mono">
                    {selectedCollateralType === 'plot' ? 'Up to 75%' : selectedCollateralType === 'composite' ? 'Up to 80%' : 'Up to 85%'}
                  </span>
                  <span className="text-[10px] text-gray-400 block mt-0.5">Of market valuation</span>
                </div>
              </div>

              {/* Context Summary for selected type */}
              <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-300 leading-relaxed">
                {selectedCollateralType === 'plot' && (
                  <span><strong>Plot Financing Rule:</strong> Land must hold DC conversion for residential use. Construction of dwelling must start within 2–3 years to maintain home loan rates.</span>
                )}
                {selectedCollateralType === 'composite' && (
                  <span><strong>Composite Mandate:</strong> Single sanction letter financing plot purchase plus phased construction disbursements against structural engineer milestone certificates.</span>
                )}
                {selectedCollateralType === 'ready' && (
                  <span><strong>Resale &amp; Ready Home:</strong> Full verification of Occupancy Certificate (OC), Khata extract, and society non-objection certificate (NOC). Fast 5-day sanction.</span>
                )}
              </div>

              {/* Card Footer CTA */}
              <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-gray-400">40+ Empanelled Banks</span>
                <a
                  href="#enquiry-form"
                  className="text-xs font-bold text-brand-teal-light hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>Check Eligibility</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────
          2. SIX SPECIALIZED PATHWAYS (Interactive Grid)
          ──────────────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-24 bg-white border-b border-brand-border">
        <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-10">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-[0.08em] text-brand-teal block">
              Specialized Mortgage Structures
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-brand-navy tracking-tight font-heading">
              Six Tailored Pathways for Land &amp; Property Buyers
            </h2>
            <p className="text-brand-slate text-base leading-relaxed">
              Every property transaction features distinct title, valuation, and regulatory nuances. We align your borrowing dossier directly with lenders optimized for your specific purchase profile.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {fundingPathways.map((item, idx) => (
              <div
                key={idx}
                className="bg-brand-ivory/50 rounded-2xl border border-brand-border p-7 hover:border-brand-teal/40 transition-all duration-300 hover:shadow-card flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-brand-teal-light flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                      {item.icon}
                    </div>
                    <span className="text-[11px] font-bold text-brand-teal bg-brand-teal-light px-3 py-1 rounded-full uppercase tracking-wider">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-brand-navy mb-2 font-heading">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-brand-slate leading-relaxed mb-6">
                    {item.desc}
                  </p>
                </div>

                <div className="space-y-2 pt-4 border-t border-brand-border/60">
                  {item.highlights.map((h, hIdx) => (
                    <div key={hIdx} className="flex items-start gap-2 text-xs font-medium text-brand-navy">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-teal flex-shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────
          3. CRITICAL LAND FINANCING ADVISORY (Must-Know Nuances)
          ──────────────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-24 bg-brand-ivory/60 border-b border-brand-border">
        <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-teal block mb-1">
              Title Due Diligence
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-navy font-heading tracking-tight">
              Essential Due Diligence for Land &amp; Plot Borrowers
            </h2>
            <p className="mt-3 text-brand-slate text-sm sm:text-base leading-relaxed">
              Unlike standardized apartment purchases, residential land purchases involve zoning restrictions, agricultural conversion records, and municipal layout approvals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {landAdvisoryPoints.map((pt, idx) => (
              <div
                key={idx}
                className="p-7 bg-white rounded-2xl border border-brand-border shadow-subtle space-y-3 hover:border-brand-teal/40 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-navy text-white flex items-center justify-center font-bold text-sm">
                  0{idx + 1}
                </div>
                <h3 className="font-bold text-base text-brand-navy font-heading">{pt.title}</h3>
                <p className="text-xs sm:text-sm text-brand-slate leading-relaxed">{pt.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────
          4. PRELOADED CONSULTATION FORM
          ──────────────────────────────────────────────────────────── */}
      <div id="enquiry-form">
        <EnquiryForm
          services={services}
          selectedService={homeLoanService}
          onClearSelectedService={() => {}}
        />
      </div>
    </div>
  );
};
