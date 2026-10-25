import React, { useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  Building2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Percent,
  Coins,
  FileCheck,
  Sparkles,
  HelpCircle,
  Building,
  Home,
  Factory,
  Layers,
  Calculator,
  Compass,
} from 'lucide-react';
import { EnquiryForm } from '../../../components/public/EnquiryForm';
import { Service } from '../../../types';

export const LoanAgainstPropertyPage: React.FC = () => {
  const context = useOutletContext<{ services?: Service[] }>();
  const services = context?.services || [];
  const lapService = services.find((s) => s.slug === 'loan-against-property') || null;

  const [activeFacility, setActiveFacility] = useState<'term' | 'dropline' | 'lrd'>('term');
  const [estimatedPropertyVal, setEstimatedPropertyVal] = useState<number>(30000000); // 3 Cr
  const [propertyClass, setPropertyClass] = useState<'residential' | 'commercial' | 'industrial'>('residential');

  // LTV and Max Loan calculation for Hero Card
  const ltvPercent = propertyClass === 'residential' ? 75 : propertyClass === 'commercial' ? 65 : 50;
  const maxLiquidity = Math.round((estimatedPropertyVal * ltvPercent) / 100);
  const startingRate = propertyClass === 'residential' ? '9.25%*' : propertyClass === 'commercial' ? '9.65%*' : '10.25%*';

  const collateralTypes = [
    {
      title: 'Residential Real Estate Collateral',
      badge: 'Up to 75% LTV',
      desc: 'Self-occupied, vacant, or rented residential apartments, builder floors, standalone bungalows, and gated community villas with clear 30-year mother deed chains.',
      features: ['Lowest interest rates (from 9.25%*)', 'Tenure up to 15–20 years', 'Option for Drop-line OD limit'],
      icon: <Home className="w-5 h-5 text-brand-teal" />,
    },
    {
      title: 'Commercial Office & Retail Assets',
      badge: 'Up to 65% LTV',
      desc: 'Standalone commercial plots, Grade-A office units, shopping arcade showrooms, and commercial IT complexes with valid Occupancy Certificates (OC).',
      features: ['Multi-crore high ticket syndication', 'Debt Service Coverage Ratio (DSCR) underwriting', 'Flexible principal moratoriums'],
      icon: <Building2 className="w-5 h-5 text-brand-teal" />,
    },
    {
      title: 'Industrial Sheds & Warehousing Units',
      badge: 'Up to 55% LTV',
      desc: 'Industrial land parcels, manufacturing factory units, and logistic warehousing hubs with statutory industrial clearances and pollution board consents.',
      features: ['Working capital augmentation', 'Capex and plant modernization funding', 'Takeout financing of existing debts'],
      icon: <Factory className="w-5 h-5 text-brand-teal" />,
    },
  ];

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="bg-brand-bg min-h-screen text-brand-navy">
      {/* ────────────────────────────────────────────────────────────
          1. CONTENT-SPECIFIC HERO: SECURED MORTGAGE & LIQUIDITY DESK
          ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#0C1B2B] via-[#0E2235] to-[#122B43] text-white pt-20 pb-16 lg:pt-28 lg:pb-24 border-b border-brand-teal/20">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-brand-teal/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Heading & LAP Specialization */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-gold/15 border border-brand-gold/30 backdrop-blur-md">
                <Coins className="w-4 h-4 text-brand-gold" />
                <span className="text-xs font-bold uppercase tracking-wider text-brand-gold">
                  Secured Mortgage Equity Unlocking Desk
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white tracking-tight font-heading leading-tight">
                Turn Idle Real Estate Equity Into <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold via-amber-200 to-emerald-400">
                  High-Growth Business Liquidity.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-gray-300 font-normal leading-relaxed max-w-2xl">
                Leverage clear-title residential, commercial, or industrial properties to unlock working capital, expand business operations, or consolidate high-cost debts up to ₹50 Crore with disciplined amortization up to 20 years.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href="#enquiry-form"
                  className="px-7 py-3.5 bg-brand-teal hover:bg-brand-teal-hover text-white text-sm font-bold rounded-corporate shadow-lg shadow-brand-teal/20 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <span>Request LAP Feasibility Audit</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <Link
                  to="/calculator"
                  className="px-6 py-3.5 bg-white/10 hover:bg-white/15 text-white border border-white/20 rounded-corporate text-sm font-semibold transition-all backdrop-blur-sm flex items-center gap-2"
                >
                  <Calculator className="w-4 h-4 text-brand-teal" />
                  <span>Simulate Mortgage EMI</span>
                </Link>
              </div>

              {/* Collateral Assurance Pills */}
              <div className="pt-4 flex flex-wrap gap-2 text-[11px] font-semibold text-gray-400">
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
                  Residential: Up to 75% LTV
                </span>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
                  Commercial: Up to 65% LTV
                </span>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
                  Industrial: Up to 50% LTV
                </span>
              </div>
            </div>

            {/* Right Column: Live Equity Liquidity Calculator Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#13283c] to-[#0d1d2c] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-brand-gold" />
                  <span className="text-xs uppercase font-bold tracking-wider text-brand-gold">
                    Instant Equity Estimator
                  </span>
                </div>
                <span className="text-[11px] text-gray-400 font-mono">Soft Valuation</span>
              </div>

              {/* Property Class Selector */}
              <div className="mt-4">
                <label className="text-xs font-semibold text-gray-300 block mb-2">Collateral Category:</label>
                <div className="grid grid-cols-3 gap-2 text-xs font-bold text-center">
                  {(['residential', 'commercial', 'industrial'] as const).map((cls) => (
                    <button
                      key={cls}
                      onClick={() => setPropertyClass(cls)}
                      className={`py-2 px-2 rounded-lg capitalize transition-all ${
                        propertyClass === cls
                          ? 'bg-brand-gold text-brand-navy shadow-md font-extrabold'
                          : 'bg-white/5 text-gray-300 hover:text-white border border-white/10'
                      }`}
                    >
                      {cls}
                    </button>
                  ))}
                </div>
              </div>

              {/* Property Valuation Slider */}
              <div className="mt-5 space-y-2">
                <div className="flex justify-between items-center text-xs font-semibold text-gray-300">
                  <span>Estimated Market Value:</span>
                  <span className="font-mono text-white text-sm font-bold">{formatINR(estimatedPropertyVal)}</span>
                </div>
                <input
                  type="range"
                  min="10000000"
                  max="200000000"
                  step="5000000"
                  value={estimatedPropertyVal}
                  onChange={(e) => setEstimatedPropertyVal(Number(e.target.value))}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-brand-gold"
                />
                <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                  <span>₹1.00 Cr</span>
                  <span>₹20.00 Cr</span>
                </div>
              </div>

              {/* Computed Liquidity & Rate Display */}
              <div className="mt-5 grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                  <span className="text-[11px] text-gray-400 block font-medium">Permissible Loan ({ltvPercent}%)</span>
                  <span className="text-xl sm:text-2xl font-black text-brand-gold font-mono">
                    {formatINR(maxLiquidity)}
                  </span>
                  <span className="text-[10px] text-gray-400 block mt-0.5">Maximum Net Release</span>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                  <span className="text-[11px] text-gray-400 block font-medium">Indicative ROI</span>
                  <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
                    {startingRate}
                  </span>
                  <span className="text-[10px] text-gray-400 block mt-0.5">Based on CIBIL 750+</span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-gray-400">Zero Advance Processing Fee</span>
                <a
                  href="#enquiry-form"
                  className="text-xs font-bold text-brand-gold hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>Apply with this Quote</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────
          2. ACCEPTED COLLATERAL ASSETS
          ──────────────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-24 bg-white border-b border-brand-border">
        <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="max-w-3xl mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-teal block mb-1">
              Collateral Assessment
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-navy font-heading tracking-tight">
              Accepted Real Estate Asset Classes
            </h2>
            <p className="mt-3 text-brand-slate text-sm sm:text-base leading-relaxed">
              We structure mortgages across diverse real estate holdings, ensuring the highest valuation and lowest interest margins.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {collateralTypes.map((col, idx) => (
              <div
                key={idx}
                className="p-7 bg-brand-ivory/50 rounded-2xl border border-brand-border shadow-subtle hover:border-brand-teal/40 transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-teal-light text-brand-teal flex items-center justify-center">
                      {col.icon}
                    </div>
                    <span className="text-xs font-bold text-brand-teal bg-brand-teal-light px-3 py-1 rounded-full">
                      {col.badge}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-brand-navy font-heading mb-2">{col.title}</h3>
                  <p className="text-xs sm:text-sm text-brand-slate leading-relaxed">{col.desc}</p>
                </div>

                <div className="space-y-2 pt-4 border-t border-brand-border/60">
                  {col.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2 text-xs font-medium text-brand-navy">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-teal flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────
          3. PRELOADED CONSULTATION FORM
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
