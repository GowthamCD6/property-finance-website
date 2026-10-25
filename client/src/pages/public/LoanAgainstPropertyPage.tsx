import React, { useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  Building,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  FileSpreadsheet,
  Briefcase,
  Landmark,
  Scale,
  Coins,
  Warehouse,
  Store,
  Layers,
  Calculator,
  AlertCircle,
} from 'lucide-react';
import { EnquiryForm } from '../../components/public/EnquiryForm';
import { Service } from '../../types';

export const LoanAgainstPropertyPage: React.FC = () => {
  const context = useOutletContext<{ services?: Service[] }>();
  const services = context?.services || [];
  const lapService = services.find((s) => s.slug === 'loan-against-property') || null;

  const [activeFacility, setActiveFacility] = useState<'termLoan' | 'overdraft' | 'lrd'>('termLoan');

  // Key Financial Benchmarks for LAP
  const metrics = [
    { value: '9.25%*', label: 'Starting Secured ROI', sub: 'Repo Linked Benchmark' },
    { value: 'Up to 75%', label: 'Loan-to-Value (LTV)', sub: 'Distress Valuation Model' },
    { value: 'Up to 20 Yrs', label: 'Repayment Horizon', sub: 'Lowest Monthly Outflow' },
    { value: '₹50L – ₹50Cr+', label: 'Ticket Flexibility', sub: 'High-Ticket Capital' },
  ];

  // 4 Accepted Real Estate Asset Classes
  const assetClasses = [
    {
      title: 'Residential Real Estate',
      badge: 'Highest LTV Tier',
      sub: 'Villas, Penthouses, Apartments & Independent Homes',
      desc: 'Freehold, unencumbered residential property offers the lowest risk weighting for banks, unlocking maximum LTV (up to 75%) and the most competitive pricing.',
      ltv: 'Up to 75% LTV',
      tenure: 'Up to 20 Years',
      icon: (
        <svg className="w-6 h-6 text-brand-teal" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
          <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
        </svg>
      ),
    },
    {
      title: 'Commercial Office & Retail Assets',
      badge: 'Commercial Grade',
      sub: 'Grade-A Office Units, High-Street Retail & Corporate Showrooms',
      desc: 'Pledge self-occupied or tenanted commercial spaces to unlock strategic working capital for business growth without relinquishing possession.',
      ltv: 'Up to 65%–70% LTV',
      tenure: 'Up to 15 Years',
      icon: (
        <svg className="w-6 h-6 text-brand-teal" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" d="M4.5 2.25a.75.75 0 000 1.5v16.5h-.75a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5h-.75V3.75a.75.75 0 000-1.5h-15zM9 6a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5H9zm-.75 5.25a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75zm.75 3.75a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5H9zm4.5-9a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zm-.75 5.25a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zm.75 3.75a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5h-1.5z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      title: 'Approved Industrial Sheds & Logistics Warehouses',
      badge: 'Industrial Collateral',
      sub: 'KIADB, MIDC, GIDC, RIICO & Freehold Industrial Real Estate',
      desc: 'Specialized institutional debt syndication against industrial manufacturing plants and logistics warehousing with environmental clearances.',
      ltv: 'Up to 55%–60% LTV',
      tenure: 'Up to 12–15 Years',
      icon: (
        <svg className="w-6 h-6 text-brand-teal" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" d="M3 6a3 3 0 013-3h2.25a3 3 0 013 3v2.25a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm9.75 0a3 3 0 013-3H18a3 3 0 013 3v2.25a3 3 0 01-3 3h-2.25a3 3 0 01-3-3V6zM3 15.75a3 3 0 013-3h2.25a3 3 0 013 3V18a3 3 0 01-3 3H6a3 3 0 01-3-3v-2.25zm9.75 0a3 3 0 013-3H18a3 3 0 013 3V18a3 3 0 01-3 3h-2.25a3 3 0 01-3-3v-2.25z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      title: 'Multi-Tenant Commercial Rent Discounting (LRD)',
      badge: 'Rental Escrow',
      sub: 'Properties Leased to Banks, MNCs, IT Corporates & Retail Chains',
      desc: 'Discount forward lease rentals into immediate upfront liquidity via a tripartite escrow structure with the lending bank and tenant.',
      ltv: 'Up to 80%–85% of Net Rents',
      tenure: 'Matches Residual Lease',
      icon: (
        <svg className="w-6 h-6 text-brand-teal" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" d="M12 2.25a.75.75 0 01.75.75v1.168l7.854 3.142A1.5 1.5 0 0121.5 8.65v.6a.75.75 0 01-.75.75H3.25a.75.75 0 01-.75-.75v-.6c0-.62.38-1.18.966-1.39L11.25 4.168V3a.75.75 0 01.75-.75zM4.5 12a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v6a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75v-6zm5.25 0a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v6a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75v-6zm5.25 0a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v6a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75v-6zm-12.75 8.25a.75.75 0 000 1.5h19.5a.75.75 0 000-1.5H2.25z" clipRule="evenodd" />
        </svg>
      ),
    },
  ];

  return (
    <div className="bg-brand-bg min-h-screen text-brand-navy">
      {/* ────────────────────────────────────────────────────────────
          1. HERO BANNER
          ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0c1b29] via-[#102538] to-[#0c1b29] text-white pt-24 pb-20 lg:pt-32 lg:pb-28 border-b border-brand-teal/20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-teal/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-teal/15 border border-brand-teal/30 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-[0.08em] text-teal-300">
                Secured Property Debt &amp; Liquidity Advisory
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-bold text-white tracking-tight leading-[1.14]">
              Monetize Real Estate Equity <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-emerald-300 to-sky-300">Without Relinquishing Ownership.</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-slate-300 font-normal leading-relaxed max-w-3xl mx-auto">
              Unlock substantial capital from residential, commercial, or industrial properties at secured interest rates. We evaluate title legality, maximize cash-flow eligibility, and negotiate direct senior credit terms across 40+ leading lenders.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#enquiry-form"
                className="cta-button group !py-3.5 !px-8 text-base shadow-xl"
              >
                <span>Request Custom LAP Assessment</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </a>
              <Link
                to="/calculator"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm transition-all duration-200"
              >
                <Calculator className="w-4 h-4 text-teal-300" />
                <span>Simulate Feasible Monthly EMI</span>
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
          2. ASSET CLASSES ACCEPTED (Interactive Cards)
          ──────────────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-24 bg-white border-b border-brand-border">
        <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-10">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-[0.08em] text-brand-teal block">
              Collateral Diversity
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-brand-navy tracking-tight">
              Accepted Property Collateral Classes
            </h2>
            <p className="text-brand-slate text-base leading-relaxed">
              Every real estate collateral type follows distinct bank valuation guidelines and distress haircuts. We align your asset with lenders offering the highest sanctioned headroom.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {assetClasses.map((item, idx) => (
              <div
                key={idx}
                className="card-hover bg-brand-bg/60 hover:bg-white p-7 rounded-2xl border border-brand-border flex flex-col justify-between group shadow-subtle hover:shadow-card"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-brand-teal-light flex items-center justify-center transition-colors duration-300 group-hover:bg-brand-teal group-hover:text-white">
                      {item.icon}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-teal bg-brand-teal-light/80 px-2.5 py-1 rounded-full">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-brand-navy leading-snug group-hover:text-brand-teal transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs font-semibold text-brand-slate/90">
                    {item.sub}
                  </p>

                  <p className="text-xs text-brand-slate leading-relaxed border-t border-brand-border/60 pt-3">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-brand-border/60 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-brand-slate">Target LTV:</span>
                    <span className="text-brand-teal">{item.ltv}</span>
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-brand-slate">Max Tenure:</span>
                    <span className="text-brand-navy">{item.tenure}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────
          3. STRUCTURE COMPARISON (Term Loan vs. Overdraft vs. LRD)
          ──────────────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-24 bg-brand-bg border-b border-brand-border">
        <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-10">
          
          <div className="max-w-3xl mb-12 space-y-3">
            <span className="text-xs font-bold uppercase tracking-[0.08em] text-brand-teal block">
              Facility Structuring
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-brand-navy tracking-tight">
              Selecting the Optimal Facility Architecture
            </h2>
            <p className="text-brand-slate text-base leading-relaxed">
              Depending on whether your requirement is one-time capital, flexible working capital, or monetizing future rent streams, we structure your facility accordingly:
            </p>
          </div>

          {/* Interactive Facility Selector */}
          <div className="flex border-b border-brand-border gap-6 mb-8">
            {[
              { id: 'termLoan', label: '1. Standard Term Loan (LAP)' },
              { id: 'overdraft', label: '2. Drop-Line Overdraft (OD against Property)' },
              { id: 'lrd', label: '3. Lease Rental Discounting (LRD)' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFacility(tab.id as any)}
                className={`pb-3 text-sm font-semibold transition-colors cursor-pointer relative ${
                  activeFacility === tab.id
                    ? 'text-brand-teal border-b-2 border-brand-teal -mb-[2px]'
                    : 'text-brand-slate hover:text-brand-navy'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Facility Details Card */}
          <div className="bg-white p-8 rounded-2xl border border-brand-border shadow-card max-w-5xl">
            {activeFacility === 'termLoan' && (
              <div className="space-y-4">
                <div className="inline-block px-3 py-1 rounded bg-brand-teal-light text-brand-teal text-xs font-bold uppercase tracking-wider">
                  Predictable Amortization
                </div>
                <h4 className="text-xl font-bold text-brand-navy">Fixed Monthly Amortizing Term Loan</h4>
                <p className="text-sm text-brand-slate leading-relaxed">
                  Lump sum disbursement into your account with scheduled monthly EMI repayments over 10 to 20 years. Ideal for major business expansions, permanent debt restructuring, or asset acquisitions where predictable cash outflows are essential.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-brand-border/60 text-xs">
                  <div>
                    <span className="text-brand-slate block">Interest Method:</span>
                    <span className="font-bold text-brand-navy">Monthly Reducing Balance</span>
                  </div>
                  <div>
                    <span className="text-brand-slate block">Tenure Range:</span>
                    <span className="font-bold text-brand-navy">Up to 240 Months</span>
                  </div>
                  <div>
                    <span className="text-brand-slate block">Prepayment Terms:</span>
                    <span className="font-bold text-brand-teal">Zero Penalty for Individuals</span>
                  </div>
                </div>
              </div>
            )}

            {activeFacility === 'overdraft' && (
              <div className="space-y-4">
                <div className="inline-block px-3 py-1 rounded bg-brand-teal-light text-brand-teal text-xs font-bold uppercase tracking-wider">
                  Pay Only on Utilized Funds
                </div>
                <h4 className="text-xl font-bold text-brand-navy">Drop-Line Overdraft / Revolving Credit Line</h4>
                <p className="text-sm text-brand-slate leading-relaxed">
                  A sanctioned drawing power limit against property collateral. You draw funds as needed and pay interest purely on the daily utilized balance. The limit systematically drops every quarter/month, keeping interest costs minimized.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-brand-border/60 text-xs">
                  <div>
                    <span className="text-brand-slate block">Interest Calculation:</span>
                    <span className="font-bold text-brand-navy">Daily Utilization Basis</span>
                  </div>
                  <div>
                    <span className="text-brand-slate block">Ideal For:</span>
                    <span className="font-bold text-brand-navy">Cyclical Working Capital</span>
                  </div>
                  <div>
                    <span className="text-brand-slate block">Annual Review:</span>
                    <span className="font-bold text-brand-teal">Hassle-Free Limit Renewal</span>
                  </div>
                </div>
              </div>
            )}

            {activeFacility === 'lrd' && (
              <div className="space-y-4">
                <div className="inline-block px-3 py-1 rounded bg-brand-teal-light text-brand-teal text-xs font-bold uppercase tracking-wider">
                  Self-Liquidating Commercial Debt
                </div>
                <h4 className="text-xl font-bold text-brand-navy">Lease Rental Discounting (LRD)</h4>
                <p className="text-sm text-brand-slate leading-relaxed">
                  For owners of commercial real estate tenanted by high-credit corporations, banks, or prime retail chains. The bank discounts future lease rental flows through a dedicated tripartite escrow account, releasing immediate high-ticket capital.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-brand-border/60 text-xs">
                  <div>
                    <span className="text-brand-slate block">Debt Servicing:</span>
                    <span className="font-bold text-brand-navy">Direct Tenant Escrow Escrow</span>
                  </div>
                  <div>
                    <span className="text-brand-slate block">Ticket Capability:</span>
                    <span className="font-bold text-brand-navy">₹5 Crore to ₹100 Crore+</span>
                  </div>
                  <div>
                    <span className="text-brand-slate block">Key Requirement:</span>
                    <span className="font-bold text-brand-teal">Registered Lease Agreement</span>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────
          4. APPLICATION INTAKE & ADVISORY CONSULTATION
          ──────────────────────────────────────────────────────────── */}
      <div id="enquiry-form">
        <EnquiryForm
          services={services}
          selectedService={lapService}
          onClearSelectedService={() => {}}
        />
      </div>
    </div>
  );
};
