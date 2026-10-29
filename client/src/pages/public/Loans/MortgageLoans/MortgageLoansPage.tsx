import lapHeroImage from '../../../../assets/images/lap-loan.jpg';
import React, { useState, useEffect } from 'react';
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
import { EnquiryForm } from '../../../../components/EnquiryForm/EnquiryForm';
import { InteractiveDocumentVault } from '../../../../components/common/InteractiveDocumentVault';
import { Service } from '../../../../types';

export const MortgageLoansPage: React.FC = () => {
  const context = useOutletContext<{ services?: Service[] }>();
  const services = context?.services || [];
  const lapService = services.find((s) => s.slug === 'loan-against-property') || null;

  const [activeFacility, setActiveFacility] = useState<'term' | 'dropline' | 'lrd'>('term');
  const [estimatedPropertyVal, setEstimatedPropertyVal] = useState<number>(30000000); // 3 Cr
  const [propertyClass, setPropertyClass] = useState<'residential' | 'commercial' | 'industrial'>('residential');
  const [mounted, setMounted] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [counterValues, setCounterValues] = useState({
    turnaround: 8.5,
    lenders: 0,
    sanction: 0,
    capital: 0,
  });

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 6;
      const y = -(e.clientY / innerHeight - 0.5) * 6;
      setTilt({ x: y, y: x });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    let animationFrameId: number;
    let startTime: number | null = null;
    const duration = 1400;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);

      setCounterValues({
        turnaround: 8.5,
        lenders: Math.round(40 * eased),
        sanction: Number((98.4 * eased).toFixed(1)),
        capital: Math.round(120 * eased),
      });

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      }
    };

    const timer = setTimeout(() => {
      animationFrameId = requestAnimationFrame(step);
    }, 180);

    return () => {
      clearTimeout(timer);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // LTV and Max Loan calculation for Hero Card
  const ltvPercent = propertyClass === 'residential' ? 75 : propertyClass === 'commercial' ? 65 : 55;
  const maxLiquidity = Math.round((estimatedPropertyVal * ltvPercent) / 100);
  const startingRate = propertyClass === 'residential' ? '8.50%*' : propertyClass === 'commercial' ? '8.75%*' : '9.10%*';

  const collateralTypes = [
    {
      title: 'Concrete Building (Residential & Commercial)',
      badge: 'Starts from 8.50% p.a.',
      desc: 'Self-occupied, vacant, or rented concrete residential and commercial buildings, independent houses, and multi-floor RCC properties with clear title records.',
      features: ['Lowest interest rates (from 8.50%*)', 'Tenure up to 15–20 years', 'Option for Term Loan or Dropline OD'],
      icon: <Home className="w-5 h-5 text-brand-teal" />,
    },
    {
      title: 'Tiled House (Traditional / Heritage Property)',
      badge: 'Starts from 8.50% p.a.',
      desc: 'Unlock substantial liquidity against unencumbered traditional tiled houses and residential properties with dedicated legal opinion assistance.',
      features: ['Specialized valuation support', 'Flexible business or personal utilization', 'Fast file appraisal across PSU/private banks'],
      icon: <Building className="w-5 h-5 text-brand-teal" />,
    },
    {
      title: 'Plots (Empty Land / Vacant Sites)',
      badge: 'Up to 65% LTV',
      desc: 'Securing funding against approved vacant plots, layout sites, and empty land parcels without mandatory construction timelines.',
      features: ['Monetize idle land assets into liquid cash', 'No compulsory immediate building clause', 'Clean legal scrutiny and search report'],
      icon: <Layers className="w-5 h-5 text-brand-teal" />,
    },
    {
      title: 'Commercial Building & Office Complexes',
      badge: 'High-Value Liquidity',
      desc: 'Commercial shopping arcades, Grade-A office units, industrial textile complexes, and standalone commercial showrooms with valid municipal approvals.',
      features: ['High-ticket syndication up to ₹50 Crore+', 'Debt Service Coverage Ratio (DSCR) underwriting', 'Competitive rates from 8.75%*'],
      icon: <Building2 className="w-5 h-5 text-brand-teal" />,
    },
    {
      title: 'Takeover from Other Banks at Lowest Rates',
      badge: 'Rate Optimization Desk',
      desc: 'Take over existing high-interest loans from private banks, NBFCs, or cooperative lenders to government and leading commercial banks at rock-bottom rates.',
      features: ['Substantial reduction in monthly EMI', 'Top-up loan facility for capital expansion', 'Complete documentation and foreclosure assistance'],
      icon: <TrendingUp className="w-5 h-5 text-brand-teal" />,
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
      <section className="relative overflow-hidden bg-slate-950 text-white pt-10 sm:pt-14 lg:pt-16 pb-12 sm:pb-16 lg:pb-20 border-b border-white/10">
        {/* Background Photographic Image: Brighter, Fixed & Stable */}
        <div className="absolute inset-0 z-0">
          <img
            src={lapHeroImage}
            alt="Secured Mortgage Equity & Loan Against Property Desk"
            className="w-full h-full object-cover object-center brightness-[1.05] contrast-[1.02]"
            loading="eager"
          />
          {/* Calibrated lightweight translucent overlays */}
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-950/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-slate-950/50" />

          {/* Ambient atmospheric pulse glows */}
          <div
            className="absolute -top-24 -left-20 w-80 sm:w-96 h-80 sm:h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none animate-pulse"
            style={{ animationDuration: '6s' }}
          />
          <div className="absolute top-1/3 -right-20 w-80 sm:w-96 h-80 sm:h-96 bg-sky-500/12 rounded-full blur-3xl pointer-events-none" />
        </div>

        <div className="w-[92%] sm:w-[88%] lg:w-[85%] max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* Left Column: Heading & LAP Specialization */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-7">
              <div
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateY(0)' : 'translateY(24px)',
                  transition: 'opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.12s, transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.12s',
                }}
                className="flex flex-wrap items-center gap-3"
              >
                <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-white/15 text-slate-100 text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md shadow-sm font-heading">
                  <span className="w-2 h-2 rounded-full bg-[#20B2AA] animate-pulse"></span>
                  <span>Secured Mortgage &amp; Loan Against Property Desk • Est. 2011</span>
                </div>
                <div className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-300 font-medium bg-white/5 px-3 py-1 rounded-full border border-white/10 font-sans">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Up to 75% Fair Market LTV</span>
                </div>
              </div>

              {/* Display Headline - ONLY THIS HEADLINE TEXT RESPONDS TO CURSOR TILT */}
              <div
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted
                    ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
                    : 'translateY(28px)',
                  transition: 'opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.25s, transform 0.2s cubic-bezier(0.25, 1, 0.5, 1)',
                  transformStyle: 'preserve-3d',
                }}
                className="space-y-3 will-change-transform"
              >
                <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-extrabold text-white tracking-tight leading-[1.18] sm:leading-[1.14] font-heading drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
                  Turn Idle Real Estate Equity Into{' '}
                  <span className="shimmer-headline-text text-[#38bdf8]">
                    High-Growth Business Liquidity.
                  </span>
                </h1>
              </div>

              <p
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateY(0)' : 'translateY(24px)',
                  transition: 'opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.35s, transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.35s',
                }}
                className="text-xs sm:text-sm md:text-base text-slate-200 font-sans font-normal leading-relaxed max-w-2xl pt-1"
              >
                Leverage clear-title residential, commercial, or industrial properties to unlock working capital, expand business operations, or consolidate high-cost debts up to ₹50 Crore with disciplined amortization up to 20 years.
              </p>

              {/* 4 Interactive Institutional Metrics Grid */}
              <div
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateY(0)' : 'translateY(28px)',
                  transition: 'opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.42s, transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.42s',
                }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5 pt-1"
              >
                <div className="relative group p-3 sm:p-4 rounded-2xl bg-white/[0.08] backdrop-blur-md border border-white/15 hover:border-teal-400/50 hover:bg-white/[0.14] shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-400/30 font-heading">
                      Starting ROI
                    </span>
                  </div>
                  <div className="text-xl xs:text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono tabular-nums">
                    8.50%*
                  </div>
                  <div className="text-xs font-bold text-slate-200 mt-1 font-heading">
                    Benchmark Spread
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 leading-snug line-clamp-1 font-sans">
                    Residential &amp; Commercial
                  </div>
                </div>

                <div className="relative group p-3 sm:p-4 rounded-2xl bg-white/[0.08] backdrop-blur-md border border-white/15 hover:border-teal-400/50 hover:bg-white/[0.14] shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-400/30 font-heading">
                      Zonal Panel
                    </span>
                  </div>
                  <div className="text-xl xs:text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono tabular-nums min-w-[50px]">
                    {counterValues.lenders}+
                  </div>
                  <div className="text-xs font-bold text-slate-200 mt-1 font-heading">
                    Partner Banks
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 leading-snug line-clamp-1 font-sans">
                    PSU, Private &amp; NBFCs
                  </div>
                </div>

                <div className="relative group p-3 sm:p-4 rounded-2xl bg-white/[0.08] backdrop-blur-md border border-white/15 hover:border-teal-400/50 hover:bg-white/[0.14] shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-400/30 font-heading">
                      Pre-Audited
                    </span>
                  </div>
                  <div className="text-xl xs:text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono tabular-nums min-w-[70px]">
                    {counterValues.sanction}%
                  </div>
                  <div className="text-xs font-bold text-slate-200 mt-1 font-heading">
                    Sanction Ratio
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 leading-snug line-clamp-1 font-sans">
                    30-Yr Legal Due Diligence
                  </div>
                </div>

                <div className="relative group p-3 sm:p-4 rounded-2xl bg-white/[0.08] backdrop-blur-md border border-white/15 hover:border-teal-400/50 hover:bg-white/[0.14] shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-400/30 font-heading">
                      Volume
                    </span>
                  </div>
                  <div className="text-xl xs:text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono tabular-nums min-w-[70px]">
                    ₹{counterValues.capital}+ Cr
                  </div>
                  <div className="text-xs font-bold text-slate-200 mt-1 font-heading">
                    Facilitated Capital
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 leading-snug line-clamp-1 font-sans">
                    15-Year Practice
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateY(0)' : 'translateY(24px)',
                  transition: 'opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.5s, transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.5s',
                }}
                className="pt-2 flex flex-wrap items-center gap-3.5"
              >
                <a
                  href="#enquiry-form"
                  className="px-6 sm:px-8 py-3.5 rounded-full bg-gradient-to-r from-teal-500 to-[#20B2AA] hover:from-teal-400 hover:to-teal-500 text-white font-extrabold text-xs sm:text-sm tracking-wide shadow-lg shadow-teal-950/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 font-heading cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  <span>Request LAP Feasibility Audit</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <Link
                  to="/calculator"
                  className="px-6 py-3.5 rounded-full bg-slate-900/85 hover:bg-slate-800/90 text-white font-bold text-xs sm:text-sm border border-white/20 hover:border-teal-400/50 backdrop-blur-md shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 font-heading cursor-pointer"
                >
                  <Calculator className="w-4 h-4 text-brand-teal" />
                  <span>Simulate Mortgage EMI</span>
                </Link>
              </div>

              {/* Collateral Assurance Pills */}
              <div
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateY(0)' : 'translateY(24px)',
                  transition: 'opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.6s, transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.6s',
                }}
                className="pt-2 flex flex-wrap gap-2 text-[11px] font-semibold text-slate-300 font-sans"
              >
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Residential: Up to 75% LTV
                </span>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Commercial: Up to 65% LTV
                </span>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Industrial: Up to 50% LTV
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
        <div className="w-[92%] sm:w-[88%] lg:w-[85%] max-w-7xl mx-auto">
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
          3. DOCUMENTATION CHECKLIST
          ──────────────────────────────────────────────────────────── */}
      <InteractiveDocumentVault loanType="loan-against-property" />

      {/* ────────────────────────────────────────────────────────────
          4. PRELOADED CONSULTATION FORM
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

export const LoanAgainstPropertyPage = MortgageLoansPage;
export default MortgageLoansPage;
