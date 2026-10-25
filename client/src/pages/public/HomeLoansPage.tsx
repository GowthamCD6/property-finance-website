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
} from 'lucide-react';
import { EnquiryForm } from '../../components/public/EnquiryForm';
import { Service } from '../../types';

export const HomeLoansPage: React.FC = () => {
  const context = useOutletContext<{ services?: Service[] }>();
  const services = context?.services || [];
  const homeLoanService = services.find((s) => s.slug === 'home-loans') || null;

  const [activeProfile, setActiveProfile] = useState<'salaried' | 'selfEmployed' | 'nri'>('salaried');

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
          1. HERO HEADER
          ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0c1b29] via-[#102538] to-[#0c1b29] text-white pt-24 pb-20 lg:pt-32 lg:pb-28 border-b border-brand-teal/20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-teal/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-teal/15 border border-brand-teal/30 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-[0.08em] text-teal-300">
                Land &amp; Residential Mortgage Advisory
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-bold text-white tracking-tight leading-[1.14]">
              Strategic Home Loans &amp; Land Financing, <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-emerald-300 to-sky-300">Engineered for Lowest Lifetime Cost.</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-slate-300 font-normal leading-relaxed max-w-3xl mx-auto">
              Whether acquiring a residential plot, constructing a custom home, purchasing a luxury apartment, or refinancing high-cost debt, our senior mortgage advisors evaluate 40+ lending criteria to secure maximum LTV and benchmark interest rates.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#enquiry-form"
                className="cta-button group !py-3.5 !px-8 text-base shadow-xl"
              >
                <span>Request Custom Assessment</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </a>
              <Link
                to="/calculator"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm transition-all duration-200"
              >
                <Calculator className="w-4 h-4 text-teal-300" />
                <span>Simulate Monthly EMI</span>
              </Link>
            </div>
          </div>

          {/* Metric KPI Strip */}
          <div className="mt-16 pt-12 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {metrics.map((m, idx) => (
              <div key={idx} className="text-center group">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-teal-100 to-teal-300 tracking-tight transition-transform duration-300 group-hover:scale-105">
                  {m.value}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-white mt-1">
                  {m.label}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {m.sub}
                </div>
              </div>
            ))}
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
            <h2 className="text-3xl sm:text-4xl font-bold text-brand-navy tracking-tight">
              Six Tailored Pathways for Land &amp; Property Buyers
            </h2>
            <p className="text-brand-slate text-base leading-relaxed">
              Every property transaction features distinct title, valuation, and regulatory nuances. We align your borrowing dossier directly with lenders optimized for your specific purchase profile.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {fundingPathways.map((pathway, idx) => (
              <div
                key={idx}
                className="card-hover bg-brand-bg/50 hover:bg-white p-7 rounded-2xl border border-brand-border flex flex-col justify-between group shadow-subtle hover:shadow-card"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-brand-teal-light flex items-center justify-center transition-colors duration-300 group-hover:bg-brand-teal group-hover:text-white">
                      {pathway.icon}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-teal bg-brand-teal-light/80 px-2.5 py-1 rounded-full">
                      {pathway.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-brand-navy leading-snug group-hover:text-brand-teal transition-colors">
                    {pathway.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-brand-slate leading-relaxed">
                    {pathway.desc}
                  </p>

                  <div className="space-y-2 pt-3 border-t border-brand-border/60">
                    {pathway.highlights.map((h, hIdx) => (
                      <div key={hIdx} className="flex items-start gap-2 text-xs font-medium text-brand-navy">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-teal shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-brand-border/60">
                  <a
                    href="#enquiry-form"
                    className="w-full py-2.5 px-4 rounded-xl border border-brand-border text-xs font-semibold text-brand-navy hover:bg-brand-teal hover:text-white hover:border-brand-teal transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Assess Eligibility for this Loan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────
          3. CRITICAL LAND FINANCING ADVISORY POINTS
          ──────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-brand-ivory border-b border-brand-border">
        <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-wider">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Essential Land Finance Due Diligence</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-brand-navy tracking-tight">
              Key Underwriting Realities for Land &amp; Plot Loans
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              {landAdvisoryPoints.map((pt, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-brand-border shadow-sm space-y-2.5">
                  <h4 className="text-sm font-bold text-brand-navy">{pt.title}</h4>
                  <p className="text-xs text-brand-slate leading-relaxed">{pt.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────
          4. UNDERWRITING CRITERIA & BORROWER PROFILES (Tabs)
          ──────────────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-24 bg-white border-b border-brand-border">
        <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-10">
          
          <div className="max-w-3xl mb-12 space-y-3">
            <span className="text-xs font-bold uppercase tracking-[0.08em] text-brand-teal block">
              Borrower Alignment
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-brand-navy tracking-tight">
              Underwriting Standards Across Profile Types
            </h2>
            <p className="text-brand-slate text-base leading-relaxed">
              Banks deploy sharply differing FOIR (Fixed Obligation to Income Ratio) benchmarks for salaried vs. self-employed applicants. Here is how your borrowing power is structured:
            </p>
          </div>

          {/* Interactive Profile Tabs */}
          <div className="flex border-b border-brand-border gap-6 mb-8">
            {[
              { id: 'salaried', label: 'Salaried Corporate Executives' },
              { id: 'selfEmployed', label: 'Self-Employed & Business Promoters' },
              { id: 'nri', label: 'Non-Resident Indians (NRIs)' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveProfile(tab.id as any)}
                className={`pb-3 text-sm font-semibold transition-colors cursor-pointer relative ${
                  activeProfile === tab.id
                    ? 'text-brand-teal border-b-2 border-brand-teal -mb-[2px]'
                    : 'text-brand-slate hover:text-brand-navy'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Profile Specific Content Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activeProfile === 'salaried' && (
              <>
                <div className="p-6 rounded-2xl bg-brand-bg border border-brand-border space-y-2">
                  <div className="text-xs font-bold uppercase text-brand-teal">Experience &amp; Age</div>
                  <h4 className="text-base font-bold text-brand-navy">Minimum 21 – 60 Years</h4>
                  <p className="text-xs text-brand-slate leading-relaxed">
                    At least 2 years total work experience with minimum 6 months in current corporate employment. Form 16 and salary slips mandatory.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-brand-bg border border-brand-border space-y-2">
                  <div className="text-xs font-bold uppercase text-brand-teal">Permissible FOIR</div>
                  <h4 className="text-base font-bold text-brand-navy">Up to 60% – 65% of Net Salary</h4>
                  <p className="text-xs text-brand-slate leading-relaxed">
                    Net take-home salary determines EMI capacity after deducting existing car loans, personal loans, and credit card minimums.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-brand-bg border border-brand-border space-y-2">
                  <div className="text-xs font-bold uppercase text-brand-teal">Preferred Bureau Score</div>
                  <h4 className="text-base font-bold text-brand-navy">CIBIL 750+ for Lowest ROI</h4>
                  <p className="text-xs text-brand-slate leading-relaxed">
                    Tier-1 PSU &amp; private banks offer special 10–25 bps concessions on home loan rates for borrowers maintaining pristine credit hygiene.
                  </p>
                </div>
              </>
            )}

            {activeProfile === 'selfEmployed' && (
              <>
                <div className="p-6 rounded-2xl bg-brand-bg border border-brand-border space-y-2">
                  <div className="text-xs font-bold uppercase text-brand-teal">Business Vintage</div>
                  <h4 className="text-base font-bold text-brand-navy">Minimum 3 Years Operational</h4>
                  <p className="text-xs text-brand-slate leading-relaxed">
                    3 consecutive years of audited balance sheets, profit &amp; loss statements, and ITR computations certified by a practicing Chartered Accountant.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-brand-bg border border-brand-border space-y-2">
                  <div className="text-xs font-bold uppercase text-brand-teal">Cash-Flow Normalization</div>
                  <h4 className="text-base font-bold text-brand-navy">Up to 75% FOIR on Cash Profits</h4>
                  <p className="text-xs text-brand-slate leading-relaxed">
                    We assist in adding back depreciation, promoter compensation, and non-cash write-offs to expand borrowing eligibility legally.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-brand-bg border border-brand-border space-y-2">
                  <div className="text-xs font-bold uppercase text-brand-teal">GST &amp; Banking Recourse</div>
                  <h4 className="text-base font-bold text-brand-navy">12-Month Continuous Banking</h4>
                  <p className="text-xs text-brand-slate leading-relaxed">
                    Average monthly bank balance (ABB) across primary current accounts must demonstrate sustainable debt-servicing buffer.
                  </p>
                </div>
              </>
            )}

            {activeProfile === 'nri' && (
              <>
                <div className="p-6 rounded-2xl bg-brand-bg border border-brand-border space-y-2">
                  <div className="text-xs font-bold uppercase text-brand-teal">Overseas Employment</div>
                  <h4 className="text-base font-bold text-brand-navy">Valid Work Visa / OCI Status</h4>
                  <p className="text-xs text-brand-slate leading-relaxed">
                    Minimum 1 year overseas tenure with salary credits in local currency bank account. Indian Embassy / notary attested salary certificate.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-brand-bg border border-brand-border space-y-2">
                  <div className="text-xs font-bold uppercase text-brand-teal">Local Representative</div>
                  <h4 className="text-base font-bold text-brand-navy">Registered Power of Attorney (POA)</h4>
                  <p className="text-xs text-brand-slate leading-relaxed">
                    A resident Indian co-applicant or blood-relative appointed via registered specific POA is required to execute lender documentation.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-brand-bg border border-brand-border space-y-2">
                  <div className="text-xs font-bold uppercase text-brand-teal">Repayment Routing</div>
                  <h4 className="text-base font-bold text-brand-navy">NRE / NRO Bank Accounts</h4>
                  <p className="text-xs text-brand-slate leading-relaxed">
                    EMIs must be remitted strictly through standard banking channels via NRE or NRO accounts in compliance with FEMA guidelines.
                  </p>
                </div>
              </>
            )}
          </div>

        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────
          5. APPLICATION INTAKE & ADVISORY CONSULTATION
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
