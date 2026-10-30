import React, { useState, useEffect, useRef } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { SiteContent } from '../../../types';
import {
  Calculator as CalcIcon,
  IndianRupee,
  Calendar,
  Percent,
  ArrowRight,
  CheckCircle2,
  Building2,
  FileCheck2,
  TrendingUp,
  UserCheck,
  ShieldCheck,
  Info,
  Layers,
  Sparkles,
  HelpCircle,
  FileText,
  BadgeAlert,
  Sliders,
  PhoneCall,
  Clock,
  Landmark,
  Shield,
  Award,
  Wallet,
  Scale,
  Lock,
  ArrowDownCircle,
  BadgePercent,
  ChevronRight,
} from 'lucide-react';
import emiHeroImage from '../../../assets/images/emi.webp';

/* ────────────────────────────────────────────────────────────
   1. ANIMATED KINETIC HEADLINE (Matching Home Page Signature)
   ──────────────────────────────────────────────────────────── */
const ROTATING_WORDS = [
  'Lowest 7.25% EMI.',
  'Maximum FOIR.',
  'Composite Plot Loans.',
  'Zero Advance Fee.',
  'Instant Sanctions.',
];

const AnimatedHeadline: React.FC = () => {
  const [wordIndex, setWordIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState(ROTATING_WORDS[0]);
  const [exitingWord, setExitingWord] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prevIdx) => {
        const nextIdx = (prevIdx + 1) % ROTATING_WORDS.length;
        setExitingWord(ROTATING_WORDS[prevIdx]);
        setCurrentWord(ROTATING_WORDS[nextIdx]);
        setIsTransitioning(true);

        setTimeout(() => {
          setExitingWord(null);
          setIsTransitioning(false);
        }, 900);

        return nextIdx;
      });
    }, 3600);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 8;
      const y = -(e.clientY / innerHeight - 0.5) * 8;
      setTilt({ x: y, y: x });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: 'transform 0.2s cubic-bezier(0.25, 1, 0.5, 1)',
        transformStyle: 'preserve-3d',
      }}
      className="will-change-transform block w-full"
    >
      <h1 className="text-[23px] xs:text-[27px] sm:text-[38px] md:text-[48px] lg:text-[56px] font-extrabold text-white tracking-tight leading-[1.2] sm:leading-[1.15] font-heading drop-shadow-[0_3px_10px_rgba(0,0,0,0.9)] max-w-5xl mx-auto select-none px-2">
        <span
          className="relative inline-block overflow-hidden"
          style={{
            display: 'inline-block',
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(32px)',
            transition: 'opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.25s, transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.25s',
          }}
        >
          <span className="shimmer-headline-text">Institutional Mortgage Analytics,</span>
        </span>
        <br className="hidden sm:inline" />{' '}
        <span
          className="inline-flex items-center justify-center flex-wrap gap-x-2"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(32px)',
            transition: 'opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.42s, transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.42s',
          }}
        >
          <span>Anchored in</span>{' '}
          <span
            className="inline-block relative overflow-visible"
            style={{
              minWidth: '170px',
              textAlign: 'left',
              verticalAlign: 'baseline',
            }}
          >
            {exitingWord && (
              <span
                className="absolute left-0 top-0 pointer-events-none whitespace-nowrap select-none text-[#38bdf8] drop-shadow-[0_4px_22px_rgba(56,189,248,0.65)] font-extrabold"
                aria-hidden="true"
              >
                {exitingWord.split('').map((char, idx) => {
                  const scatterX = (idx % 2 === 0 ? -1 : 1) * (5 + (idx % 3) * 3);
                  const scatterRot = (idx % 2 === 0 ? -1 : 1) * (10 + (idx % 4) * 4);
                  return (
                    <span
                      key={`exit-${idx}`}
                      className="animate-letter-break"
                      style={
                        {
                          '--char-index': idx,
                          '--scatter-x': `${scatterX}px`,
                          '--scatter-rot': `${scatterRot}deg`,
                        } as React.CSSProperties
                      }
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </span>
                  );
                })}
              </span>
            )}

            <span className="relative inline-block whitespace-nowrap text-[#38bdf8] drop-shadow-[0_4px_22px_rgba(56,189,248,0.65)] font-extrabold">
              {currentWord.split('').map((char, idx) => {
                const enterX = (idx % 2 === 0 ? 1 : -1) * (4 + (idx % 3) * 2);
                const enterRot = (idx % 2 === 0 ? 1 : -1) * (6 + (idx % 3) * 2);
                return (
                  <span
                    key={`enter-${wordIndex}-${idx}`}
                    className={isTransitioning ? 'animate-letter-assemble' : 'inline-block'}
                    style={
                      {
                        '--char-index': idx,
                        '--enter-x': `${enterX}px`,
                        '--enter-rot': `${enterRot}deg`,
                      } as React.CSSProperties
                    }
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                );
              })}
            </span>
          </span>
        </span>
      </h1>
      <style>{`
        @keyframes letterBreakOut {
          0% {
            opacity: 1;
            transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
            filter: blur(0px);
          }
          35% {
            opacity: 0.85;
            transform: translate3d(var(--scatter-x, 0px), -12px, 0) rotate(var(--scatter-rot, 0deg)) scale(1.06);
            filter: blur(2px);
          }
          100% {
            opacity: 0;
            transform: translate3d(calc(var(--scatter-x, 0px) * 2.2), -34px, 0) rotate(calc(var(--scatter-rot, 0deg) * 2)) scale(0.65);
            filter: blur(10px);
          }
        }

        @keyframes letterAssembleIn {
          0% {
            opacity: 0;
            transform: translate3d(var(--enter-x, 0px), 30px, 0) rotate(var(--enter-rot, 0deg)) scale(0.72);
            filter: blur(10px);
          }
          65% {
            opacity: 1;
            transform: translate3d(0, -3px, 0) rotate(0deg) scale(1.05);
            filter: blur(0px);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
            filter: blur(0px);
          }
        }

        .animate-letter-break {
          display: inline-block;
          animation: letterBreakOut 0.45s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          animation-delay: calc(var(--char-index, 0) * 26ms);
          will-change: transform, opacity, filter;
        }

        .animate-letter-assemble {
          display: inline-block;
          animation: letterAssembleIn 0.55s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          animation-delay: calc(100ms + var(--char-index, 0) * 32ms);
          will-change: transform, opacity, filter;
        }
      `}</style>
    </div>
  );
};

/* ────────────────────────────────────────────────────────────
   2. MAIN CALCULATOR PAGE COMPONENT
   ──────────────────────────────────────────────────────────── */
export const CalculatorPage: React.FC = () => {
  const context = useOutletContext<{ content?: SiteContent | null }>();
  const content = context?.content || null;

  const [calcMode, setCalcMode] = useState<'emi' | 'eligibility' | 'composite'>('emi');
  const [mounted, setMounted] = useState<boolean>(false);
  const dashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(timer);
  }, []);

  // Mode 1: Standard EMI States
  const [loanAmount, setLoanAmount] = useState<number>(content?.calcDefaultAmount || 5000000); // ₹50 Lakhs
  const [interestRate, setInterestRate] = useState<number>(content?.calcDefaultHomeRate || 7.25); // Starts from 7.25% p.a.
  const [tenureYears, setTenureYears] = useState<number>(content?.calcDefaultTenure || 20); // 20 years

  useEffect(() => {
    if (content?.calcDefaultAmount) setLoanAmount(content.calcDefaultAmount);
    if (content?.calcDefaultHomeRate) setInterestRate(content.calcDefaultHomeRate);
    if (content?.calcDefaultTenure) setTenureYears(content.calcDefaultTenure);
  }, [content]);

  // Mode 2: Eligibility & FOIR States
  const [monthlyIncome, setMonthlyIncome] = useState<number>(150000); // ₹1.5 Lakhs net
  const [existingEmis, setExistingEmis] = useState<number>(20000); // ₹20k existing EMIs
  const [eligibilityTenure, setEligibilityTenure] = useState<number>(20); // 20 yrs
  const [eligibilityRate, setEligibilityRate] = useState<number>(7.25); // 7.25%
  const [foirPercentage, setFoirPercentage] = useState<number>(55); // 55% FOIR norm standard in Indian banks

  // Mode 3: Composite Plot + Construction Loan States
  const [plotCost, setPlotCost] = useState<number>(4000000); // ₹40 Lakhs plot
  const [constructionCost, setConstructionCost] = useState<number>(5000000); // ₹50 Lakhs construction
  const [compositeRate, setCompositeRate] = useState<number>(7.35); // 7.35%
  const [compositeTenure, setCompositeTenure] = useState<number>(20); // 20 yrs
  const [disbursedTranchePercent, setDisbursedTranchePercent] = useState<number>(50); // 50% construction done

  // Mode 1 Calculations
  const monthlyRate = interestRate / 12 / 100;
  const totalMonths = tenureYears * 12;

  const emi =
    totalMonths > 0 && monthlyRate > 0
      ? Math.round(
          (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
            (Math.pow(1 + monthlyRate, totalMonths) - 1)
        )
      : 0;

  const totalPayment = emi * totalMonths;
  const totalInterest = Math.max(0, totalPayment - loanAmount);
  const principalPercent = totalPayment > 0 ? Math.round((loanAmount / totalPayment) * 100) : 100;
  const interestPercent = totalPayment > 0 ? 100 - principalPercent : 0;

  // Mode 2 Calculations
  const eligMonthlyRate = eligibilityRate / 12 / 100;
  const eligTotalMonths = eligibilityTenure * 12;
  const permissibleEmi = Math.max(0, monthlyIncome * (foirPercentage / 100) - existingEmis);

  const maxLoanEligible =
    eligTotalMonths > 0 && eligMonthlyRate > 0 && permissibleEmi > 0
      ? Math.round(
          (permissibleEmi * (Math.pow(1 + eligMonthlyRate, eligTotalMonths) - 1)) /
            (eligMonthlyRate * Math.pow(1 + eligMonthlyRate, eligTotalMonths))
        )
      : 0;

  // Mode 3 Calculations
  const maxPlotLoan = Math.round(plotCost * 0.70);
  const maxConstructionLoan = Math.round(constructionCost * 0.80);
  const totalCompositeLoan = maxPlotLoan + maxConstructionLoan;
  const totalProjectCost = plotCost + constructionCost;
  const selfContribution = totalProjectCost - totalCompositeLoan;

  const compositeMonthlyRate = compositeRate / 12 / 100;
  const compositeMonths = compositeTenure * 12;

  const fullCompositeEmi =
    compositeMonths > 0 && compositeMonthlyRate > 0
      ? Math.round(
          (totalCompositeLoan * compositeMonthlyRate * Math.pow(1 + compositeMonthlyRate, compositeMonths)) /
            (Math.pow(1 + compositeMonthlyRate, compositeMonths) - 1)
        )
      : 0;

  const activeDrawdown = maxPlotLoan + Math.round((maxConstructionLoan * disbursedTranchePercent) / 100);
  const preEmiInterestOnly = Math.round((activeDrawdown * (compositeRate / 100)) / 12);

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getVerbalAmount = (num: number) => {
    if (num >= 10000000) {
      return `₹ ${(num / 10000000).toFixed(2)} Cr`;
    }
    if (num >= 100000) {
      return `₹ ${(num / 100000).toFixed(1)} Lakhs`;
    }
    return `₹ ${num.toLocaleString('en-IN')}`;
  };

  const handleSelectMode = (mode: 'emi' | 'eligibility' | 'composite') => {
    setCalcMode(mode);
    if (dashboardRef.current) {
      dashboardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="bg-[#f8f8f4] min-h-screen text-brand-navy font-sans antialiased selection:bg-brand-teal selection:text-white">
      {/* ────────────────────────────────────────────────────────────
          1. DISTINCTIVE HERO: CENTERED KINETIC LAUNCHPAD WITH 3-INSTRUMENT DECK
          ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-slate-950 text-white pt-10 sm:pt-14 lg:pt-16 pb-12 sm:pb-16 lg:pb-20 border-b border-white/10">
        {/* Background Photographic Image: Brighter, Fixed & Stable */}
        <div className="absolute inset-0 z-0">
          <img
            src={emiHeroImage}
            alt="Institutional Mortgage & EMI Financial Analytics"
            className="w-full h-full object-cover object-center brightness-[1.12] contrast-[1.02]"
            loading="eager"
          />
          {/* Calibrated lightweight translucent overlays so image is vividly visible and bright while text remains crisp */}
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 via-slate-950/25 to-slate-950/55" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-slate-950/70" />
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

          {/* Ambient atmospheric lighting pulses */}
          <div
            className="absolute -top-24 -left-20 w-80 sm:w-96 h-80 sm:h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none animate-pulse"
            style={{ animationDuration: '6s' }}
          />
          <div className="absolute top-1/3 -right-20 w-80 sm:w-96 h-80 sm:h-96 bg-sky-500/12 rounded-full blur-3xl pointer-events-none" />
        </div>

        <div className="w-[92%] sm:w-[88%] lg:w-[85%] max-w-7xl mx-auto relative z-10">
          {/* Top Centered Section: Eyebrow + Kinetic Animated Headline + Subtitle */}
          <div className="flex flex-col items-center text-center space-y-5 sm:space-y-6 max-w-4xl mx-auto">
            {/* Live Eyebrow Beacon */}
            <div
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(-14px)',
                transition: 'opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1) 0.1s, transform 0.75s cubic-bezier(0.16, 1, 0.3, 1) 0.1s',
              }}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/80 border border-white/20 text-slate-100 text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-[#20B2AA] animate-pulse"></span>
              <span className="font-heading">Institutional Financial Engineering • RBI EBLR Linked Suite</span>
            </div>

            {/* Kinetic Animated Headline with 3D Tilt */}
            <div className="w-full">
              <AnimatedHeadline />
            </div>

            {/* Authority Subtitle */}
            <p
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(24px)',
                transition: 'opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.45s, transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.45s',
              }}
              className="text-sm xs:text-base sm:text-lg text-slate-200 font-sans font-normal leading-relaxed max-w-3xl mx-auto px-2"
            >
              Simulate exact monthly repayment schedules, stress-test your borrowing ceiling against banking FOIR guidelines, or model tranche-based pre-EMI interest during staged property construction across 40+ empanelled banks.
            </p>
          </div>

          {/* ────────────────────────────────────────────────────────────
              2. UNIQUE 3-INSTRUMENT COMMAND DECK
              ──────────────────────────────────────────────────────────── */}
          <div
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(24px)',
              transition: 'opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.60s, transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.60s',
            }}
            className="mt-8 sm:mt-10 grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4.5"
          >
            {/* Instrument 1: Standard EMI */}
            <button
              type="button"
              onClick={() => handleSelectMode('emi')}
              className={`p-5 sm:p-6 rounded-2xl text-left transition-all duration-300 relative overflow-hidden group cursor-pointer border ${
                calcMode === 'emi'
                  ? 'bg-slate-900/95 border-teal-400 ring-2 ring-teal-400/40 shadow-2xl shadow-teal-950/70 scale-[1.01]'
                  : 'bg-slate-900/60 hover:bg-slate-900/80 border-white/15 hover:border-white/30 backdrop-blur-md'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300 group-hover:scale-105 transition-transform">
                  <CalcIcon className="w-5 h-5 text-teal-300" />
                </div>
                <span
                  className={`text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full border ${
                    calcMode === 'emi'
                      ? 'bg-teal-500/25 text-teal-200 border-teal-400/50'
                      : 'bg-white/5 text-slate-400 border-white/10'
                  }`}
                >
                  {calcMode === 'emi' ? '● Active Mode' : 'Mode 01'}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-white font-heading group-hover:text-teal-300 transition-colors">
                Standard Monthly EMI Outflow
              </h3>
              <p className="text-xs text-slate-300 font-sans mt-1 leading-relaxed">
                Model exact monthly payments, total interest amortization, and loan horizons starting from 7.25% p.a.
              </p>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="font-mono text-teal-300 font-semibold">From 7.25% p.a.</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-heading font-bold text-white group-hover:translate-x-1 transition-transform">
                  <span>Simulate Outflow</span>
                  <ChevronRight className="w-3.5 h-3.5 text-teal-300" />
                </span>
              </div>
            </button>

            {/* Instrument 2: FOIR & Max Borrowing */}
            <button
              type="button"
              onClick={() => handleSelectMode('eligibility')}
              className={`p-5 sm:p-6 rounded-2xl text-left transition-all duration-300 relative overflow-hidden group cursor-pointer border ${
                calcMode === 'eligibility'
                  ? 'bg-slate-900/95 border-teal-400 ring-2 ring-teal-400/40 shadow-2xl shadow-teal-950/70 scale-[1.01]'
                  : 'bg-slate-900/60 hover:bg-slate-900/80 border-white/15 hover:border-white/30 backdrop-blur-md'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300 group-hover:scale-105 transition-transform">
                  <UserCheck className="w-5 h-5 text-sky-300" />
                </div>
                <span
                  className={`text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full border ${
                    calcMode === 'eligibility'
                      ? 'bg-sky-500/25 text-sky-200 border-sky-400/50'
                      : 'bg-white/5 text-slate-400 border-white/10'
                  }`}
                >
                  {calcMode === 'eligibility' ? '● Active Mode' : 'Mode 02'}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-white font-heading group-hover:text-sky-300 transition-colors">
                Banking FOIR &amp; Max Borrowing
              </h3>
              <p className="text-xs text-slate-300 font-sans mt-1 leading-relaxed">
                Stress-test net disposable income against obligations to compute maximum eligible borrowing ceiling.
              </p>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="font-mono text-sky-300 font-semibold">50% – 65% Bank FOIR</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-heading font-bold text-white group-hover:translate-x-1 transition-transform">
                  <span>Test Debt Ceiling</span>
                  <ChevronRight className="w-3.5 h-3.5 text-sky-300" />
                </span>
              </div>
            </button>

            {/* Instrument 3: Composite Plot + Construction */}
            <button
              type="button"
              onClick={() => handleSelectMode('composite')}
              className={`p-5 sm:p-6 rounded-2xl text-left transition-all duration-300 relative overflow-hidden group cursor-pointer border ${
                calcMode === 'composite'
                  ? 'bg-slate-900/95 border-teal-400 ring-2 ring-teal-400/40 shadow-2xl shadow-teal-950/70 scale-[1.01]'
                  : 'bg-slate-900/60 hover:bg-slate-900/80 border-white/15 hover:border-white/30 backdrop-blur-md'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 group-hover:scale-105 transition-transform">
                  <Building2 className="w-5 h-5 text-emerald-300" />
                </div>
                <span
                  className={`text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full border ${
                    calcMode === 'composite'
                      ? 'bg-emerald-500/25 text-emerald-200 border-emerald-400/50'
                      : 'bg-white/5 text-slate-400 border-white/10'
                  }`}
                >
                  {calcMode === 'composite' ? '● Active Mode' : 'Mode 03'}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-white font-heading group-hover:text-emerald-300 transition-colors">
                Composite Plot + Villa Build
              </h3>
              <p className="text-xs text-slate-300 font-sans mt-1 leading-relaxed">
                Simulate dual-tranche funding for land acquisition (70% LTV) and stage-wise civil construction (80% LTV).
              </p>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="font-mono text-emerald-400 font-semibold">70:80 Split Tranches</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-heading font-bold text-white group-hover:translate-x-1 transition-transform">
                  <span>Model Pre-EMIs</span>
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-300" />
                </span>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────
          4. INTERACTIVE SLIDER DASHBOARD (Anchored via ref)
          ──────────────────────────────────────────────────────────── */}
      <section ref={dashboardRef} className="pt-12 sm:pt-16 pb-16 bg-[#f8f8f4]">
        <div className="w-[92%] sm:w-[88%] lg:w-[85%] max-w-7xl mx-auto">
          {calcMode === 'emi' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
              <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-brand-border/80 shadow-card ring-1 ring-slate-900/5 space-y-7">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-teal-light text-brand-teal text-xs font-bold uppercase tracking-wider mb-2 font-heading">
                    <CalcIcon className="w-3.5 h-3.5" />
                    <span>Mode 01 Simulation</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-brand-navy font-heading">
                    Standard Monthly EMI Simulation
                  </h2>
                  <p className="text-xs sm:text-sm text-brand-slate font-sans mt-1">
                    Adjust loan principal, interest rates, and loan horizons to inspect your repayment schedule.
                  </p>
                </div>

                {/* Slider 1: Loan Amount */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs sm:text-sm font-bold text-brand-navy font-heading">Loan Amount Required</label>
                    <span className="text-base sm:text-lg font-black text-brand-teal font-mono">{formatINR(loanAmount)}</span>
                  </div>
                  <input
                    type="range"
                    min="500000"
                    max="100000000"
                    step="250000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-teal"
                  />
                  <div className="flex justify-between text-[11px] text-brand-slate font-sans font-medium">
                    <span>₹ 5 Lakhs</span>
                    <span className="font-bold text-brand-navy font-heading">{getVerbalAmount(loanAmount)}</span>
                    <span>₹ 10 Crores</span>
                  </div>
                  {/* Quick Preset Buttons */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {[
                      { label: '₹25L', val: 2500000 },
                      { label: '₹50L', val: 5000000 },
                      { label: '₹75L', val: 7500000 },
                      { label: '₹1 Cr', val: 10000000 },
                      { label: '₹2 Cr', val: 20000000 },
                      { label: '₹5 Cr', val: 50000000 },
                    ].map((chip) => (
                      <button
                        key={chip.val}
                        type="button"
                        onClick={() => setLoanAmount(chip.val)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold font-heading transition-all cursor-pointer ${
                          loanAmount === chip.val
                            ? 'bg-brand-teal text-white shadow-sm'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Slider 2: Interest Rate */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs sm:text-sm font-bold text-brand-navy font-heading">Indicative Annual Interest Rate (% p.a.)</label>
                    <span className="text-base sm:text-lg font-black text-brand-teal font-mono">{interestRate.toFixed(2)} %</span>
                  </div>
                  <input
                    type="range"
                    min="7.25"
                    max="16.0"
                    step="0.05"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-teal"
                  />
                  <div className="flex justify-between text-[11px] text-brand-slate font-sans font-medium">
                    <span>7.25% (Prime Home Loan)</span>
                    <span>9.25% (Standard LAP)</span>
                    <span>16.00%</span>
                  </div>
                  {/* Quick Rate Presets */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {[
                      { label: '7.25% (Prime HL)', val: 7.25 },
                      { label: '7.75% (Standard HL)', val: 7.75 },
                      { label: '8.50% (Prime LAP)', val: 8.50 },
                      { label: '9.25% (Comm. LAP)', val: 9.25 },
                      { label: '10.50% (Project)', val: 10.50 },
                    ].map((chip) => (
                      <button
                        key={chip.val}
                        type="button"
                        onClick={() => setInterestRate(chip.val)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold font-heading transition-all cursor-pointer ${
                          interestRate === chip.val
                            ? 'bg-brand-teal text-white shadow-sm'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Slider 3: Tenure */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs sm:text-sm font-bold text-brand-navy font-heading">Repayment Horizon (Tenure in Years)</label>
                    <span className="text-base sm:text-lg font-black text-brand-teal font-mono">{tenureYears} Years ({totalMonths} Months)</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    step="1"
                    value={tenureYears}
                    onChange={(e) => setTenureYears(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-teal"
                  />
                  <div className="flex justify-between text-[11px] text-brand-slate font-sans font-medium">
                    <span>1 Year</span>
                    <span>15 Years (Standard Mortgage)</span>
                    <span>30 Years (Max Home Loan)</span>
                  </div>
                  {/* Quick Tenure Presets */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {[5, 10, 15, 20, 25, 30].map((yr) => (
                      <button
                        key={yr}
                        type="button"
                        onClick={() => setTenureYears(yr)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold font-heading transition-all cursor-pointer ${
                          tenureYears === yr
                            ? 'bg-brand-teal text-white shadow-sm'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {yr} Years
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Cockpit Card: Outflow Analytics */}
              <div className="lg:col-span-5 bg-gradient-to-br from-[#0c1e30] via-[#0f273d] to-[#14324f] text-white p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/15 space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-300 font-heading block">Estimated Monthly Outflow</span>
                  <div className="mt-2 text-3xl sm:text-4xl font-extrabold text-white font-mono">
                    {formatINR(emi)}
                    <span className="text-xs font-normal text-slate-300 block sm:inline sm:ml-2 font-sans">/ month</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold font-heading">
                    <span className="text-emerald-400">Principal: {principalPercent}%</span>
                    <span className="text-sky-300">Interest: {interestPercent}%</span>
                  </div>
                  <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden flex border border-white/10">
                    <div style={{ width: `${principalPercent}%` }} className="bg-emerald-500 h-full transition-all duration-300" />
                    <div style={{ width: `${interestPercent}%` }} className="bg-sky-400 h-full transition-all duration-300" />
                  </div>
                </div>

                <div className="space-y-3 pt-2 text-xs sm:text-sm">
                  <div className="flex justify-between items-center p-3.5 rounded-xl bg-white/[0.05] border border-white/10 backdrop-blur-md">
                    <span className="text-slate-300 font-sans font-medium">Principal Borrowed:</span>
                    <span className="font-bold text-white font-mono">{formatINR(loanAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3.5 rounded-xl bg-white/[0.05] border border-white/10 backdrop-blur-md">
                    <span className="text-slate-300 font-sans font-medium">Total Interest Over Tenure:</span>
                    <span className="font-bold text-sky-300 font-mono">{formatINR(totalInterest)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3.5 rounded-xl bg-white/[0.08] border border-white/20 backdrop-blur-md">
                    <span className="text-white font-bold font-heading">Total Repayment Amount:</span>
                    <span className="font-black text-emerald-400 font-mono">{formatINR(totalPayment)}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    to="/enquire"
                    className="hero-btn-primary w-full py-4 px-6 text-xs sm:text-sm font-bold font-heading text-white flex items-center justify-center gap-2.5 text-center cursor-pointer tracking-wide"
                  >
                    <span>Apply with this Repayment Quote</span>
                    <ArrowRight className="w-4 h-4 hero-btn-arrow" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {calcMode === 'eligibility' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
              <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-brand-border/80 shadow-card ring-1 ring-slate-900/5 space-y-7">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-teal-light text-brand-teal text-xs font-bold uppercase tracking-wider mb-2 font-heading">
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Mode 02 Analysis</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-brand-navy font-heading">
                    Maximum Borrowing Capacity &amp; Banking FOIR
                  </h2>
                  <p className="text-xs sm:text-sm text-brand-slate font-sans mt-1">
                    Banks restrict maximum loan sanctions based on your Fixed Obligation to Income Ratio (FOIR).
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs sm:text-sm font-bold text-brand-navy font-heading">Net Monthly Take-Home Income</label>
                    <span className="text-base sm:text-lg font-black text-brand-teal font-mono">{formatINR(monthlyIncome)}</span>
                  </div>
                  <input
                    type="range"
                    min="30000"
                    max="1000000"
                    step="10000"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-teal"
                  />
                  <div className="flex justify-between text-[11px] text-brand-slate font-sans font-medium">
                    <span>₹ 30,000 / mo</span>
                    <span className="font-bold text-brand-navy font-heading">{getVerbalAmount(monthlyIncome)}</span>
                    <span>₹ 10 Lakhs / mo</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs sm:text-sm font-bold text-brand-navy font-heading">Existing Monthly Obligations (EMIs)</label>
                    <span className="text-base sm:text-lg font-black text-amber-700 font-mono">{formatINR(existingEmis)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="300000"
                    step="5000"
                    value={existingEmis}
                    onChange={(e) => setExistingEmis(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                  />
                  <div className="flex justify-between text-[11px] text-brand-slate font-sans font-medium">
                    <span>₹ 0 (Debt Free)</span>
                    <span className="font-bold text-brand-navy font-heading">{getVerbalAmount(existingEmis)}</span>
                    <span>₹ 3 Lakhs / mo</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-brand-border space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-brand-navy font-heading">
                    <span>Lender FOIR Benchmark Norm:</span>
                    <span className="text-brand-teal font-mono">{foirPercentage}% of Net Income</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-1 text-xs font-semibold font-heading">
                    {[50, 55, 65].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => setFoirPercentage(pct)}
                        className={`py-2 px-3 rounded-xl border text-center transition-all cursor-pointer ${
                          foirPercentage === pct
                            ? 'bg-brand-navy text-white border-brand-navy shadow-sm'
                            : 'bg-white text-brand-slate border-slate-200 hover:border-brand-teal'
                        }`}
                      >
                        {pct}% {pct === 50 ? '(Conservative)' : pct === 55 ? '(Standard Bank)' : '(High Income)'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Cockpit Card: Eligibility Analytics */}
              <div className="lg:col-span-5 bg-gradient-to-br from-[#0c1e30] via-[#0f273d] to-[#14324f] text-white p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/15 space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-300 font-heading block">
                    Estimated Maximum Loan Capacity
                  </span>
                  <div className="mt-2 text-3xl sm:text-4xl font-extrabold text-white font-mono">
                    {formatINR(maxLoanEligible)}
                  </div>
                  <span className="text-xs font-medium font-sans text-emerald-300 bg-emerald-500/20 px-2.5 py-1 rounded inline-block mt-2">
                    Governed by {foirPercentage}% banking FOIR threshold
                  </span>
                </div>

                <div className="space-y-3 pt-2 text-xs sm:text-sm">
                  <div className="flex justify-between items-center p-3.5 rounded-xl bg-white/[0.05] border border-white/10 backdrop-blur-md">
                    <span className="text-slate-300 font-sans font-medium">Permissible Monthly EMI:</span>
                    <span className="font-bold text-white font-mono">{formatINR(permissibleEmi)} / mo</span>
                  </div>
                  <div className="flex justify-between items-center p-3.5 rounded-xl bg-white/[0.05] border border-white/10 backdrop-blur-md">
                    <span className="text-slate-300 font-sans font-medium">Current Obligation Drain:</span>
                    <span className="font-bold text-amber-400 font-mono">{formatINR(existingEmis)} / mo</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    to="/enquire"
                    className="hero-btn-primary w-full py-4 px-6 text-xs sm:text-sm font-bold font-heading text-white flex items-center justify-center gap-2.5 text-center cursor-pointer tracking-wide"
                  >
                    <span>Request Full Multi-Bank Assessment</span>
                    <ArrowRight className="w-4 h-4 hero-btn-arrow" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {calcMode === 'composite' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
              <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-brand-border/80 shadow-card ring-1 ring-slate-900/5 space-y-7">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-teal-light text-brand-teal text-xs font-bold uppercase tracking-wider mb-2 font-heading">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Mode 03 Simulation</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-brand-navy font-heading">
                    Plot Purchase + House Construction Financing
                  </h2>
                  <p className="text-xs sm:text-sm text-brand-slate font-sans mt-1">
                    Calculate funding split between land acquisition and phased civil construction disbursements.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs sm:text-sm font-bold text-brand-navy font-heading">Plot / Land Purchase Cost (A-Khata / DTCP / BDA)</label>
                    <span className="text-base sm:text-lg font-black text-brand-teal font-mono">{formatINR(plotCost)}</span>
                  </div>
                  <input
                    type="range"
                    min="1500000"
                    max="50000000"
                    step="250000"
                    value={plotCost}
                    onChange={(e) => setPlotCost(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-teal"
                  />
                  <div className="flex justify-between text-[11px] text-brand-slate font-sans font-medium">
                    <span>₹ 15 Lakhs</span>
                    <span className="font-bold text-brand-navy font-heading">70% Max LTV: {formatINR(maxPlotLoan)}</span>
                    <span>₹ 5 Crores</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs sm:text-sm font-bold text-brand-navy font-heading">Estimated House Construction Budget</label>
                    <span className="text-base sm:text-lg font-black text-brand-teal font-mono">{formatINR(constructionCost)}</span>
                  </div>
                  <input
                    type="range"
                    min="2000000"
                    max="50000000"
                    step="250000"
                    value={constructionCost}
                    onChange={(e) => setConstructionCost(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-teal"
                  />
                  <div className="flex justify-between text-[11px] text-brand-slate font-sans font-medium">
                    <span>₹ 20 Lakhs</span>
                    <span className="font-bold text-brand-navy font-heading">80% Max LTV: {formatINR(maxConstructionLoan)}</span>
                    <span>₹ 5 Crores</span>
                  </div>
                </div>

                <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-brand-border">
                  <div className="flex justify-between items-center font-heading">
                    <label className="text-xs font-bold text-brand-navy">Simulated Construction Stage Drawdown:</label>
                    <span className="text-sm font-black text-brand-teal font-mono">{disbursedTranchePercent}% Disbursed</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="25"
                    value={disbursedTranchePercent}
                    onChange={(e) => setDisbursedTranchePercent(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-teal"
                  />
                  <div className="flex justify-between text-[10px] text-brand-slate font-sans font-medium">
                    <span>0% (Plot Only)</span>
                    <span>25% (Foundation)</span>
                    <span>50% (Slab Complete)</span>
                    <span>75% (Finishing)</span>
                    <span>100% (Completed)</span>
                  </div>
                </div>
              </div>

              {/* Right Cockpit Card: Composite Project Analytics */}
              <div className="lg:col-span-5 bg-gradient-to-br from-[#0c1e30] via-[#0f273d] to-[#14324f] text-white p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/15 space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-300 font-heading block">
                    Total Project Debt Sanction
                  </span>
                  <div className="mt-2 text-3xl sm:text-4xl font-extrabold text-white font-mono">
                    {formatINR(totalCompositeLoan)}
                  </div>
                  <span className="text-xs font-medium font-sans text-emerald-300 bg-emerald-500/20 px-2.5 py-1 rounded inline-block mt-2">
                    Total Outlay: {formatINR(totalProjectCost)} (Self: {formatINR(selfContribution)})
                  </span>
                </div>

                <div className="space-y-3 pt-2 text-xs sm:text-sm">
                  <div className="flex justify-between items-center p-3.5 rounded-xl bg-white/[0.05] border border-white/10 backdrop-blur-md">
                    <span className="text-slate-300 font-sans font-medium">Plot Loan Sanction (70%):</span>
                    <span className="font-bold text-white font-mono">{formatINR(maxPlotLoan)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3.5 rounded-xl bg-white/[0.05] border border-white/10 backdrop-blur-md">
                    <span className="text-slate-300 font-sans font-medium">Construction Sanction (80%):</span>
                    <span className="font-bold text-white font-mono">{formatINR(maxConstructionLoan)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
                    <div>
                      <span className="text-amber-300 font-bold font-heading block">Active Pre-EMI (Interest Only):</span>
                      <span className="text-[10px] text-slate-300 font-sans">At {disbursedTranchePercent}% construction stage</span>
                    </div>
                    <span className="font-black text-amber-300 font-mono text-base">{formatINR(preEmiInterestOnly)} / mo</span>
                  </div>
                  <div className="flex justify-between items-center p-3.5 rounded-xl bg-white/[0.08] border border-white/20">
                    <span className="text-white font-bold font-heading">Full EMI (Upon Handover):</span>
                    <span className="font-black text-emerald-400 font-mono text-base">{formatINR(fullCompositeEmi)} / mo</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    to="/enquire"
                    className="hero-btn-primary w-full py-4 px-6 text-xs sm:text-sm font-bold font-heading text-white flex items-center justify-center gap-2.5 text-center cursor-pointer tracking-wide"
                  >
                    <span>Consult on Composite Plot Loan</span>
                    <ArrowRight className="w-4 h-4 hero-btn-arrow" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Institutional EMI Breakdown & Amortization Architecture Section */}
          <div className="mt-14 pt-12 border-t border-brand-border/70">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              {/* Left Column: Visual EMI Card */}
              <div className="lg:col-span-5">
                <div className="relative rounded-3xl overflow-hidden border border-brand-border/80 shadow-card bg-slate-900 group">
                  <img
                    src={emiHeroImage}
                    alt="EMI Financial Planning & Calculation"
                    className="w-full h-72 sm:h-80 object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-110 contrast-[1.02]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5 space-y-1.5">
                    <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-200 text-[10px] font-bold uppercase tracking-wider">
                      <Sparkles className="w-3 h-3 text-teal-300" />
                      <span>Financial Planning Desk</span>
                    </div>
                    <div className="text-white text-base sm:text-lg font-bold font-heading">
                      Smart EMI Optimization &amp; Prepayment Planning
                    </div>
                    <p className="text-slate-300 text-xs font-sans leading-relaxed">
                      Our institutional advisors help structure step-down EMI models and scheduled prepayments to save up to 40% on total interest outflow.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: 4 Key EMI Repayment Principles */}
              <div className="lg:col-span-7 space-y-5">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-teal-light text-brand-teal text-xs font-bold uppercase tracking-wider mb-2 font-heading">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Lender Economics &amp; Amortization</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-brand-navy font-heading">
                    Mastering Your Repayment Dynamics
                  </h3>
                  <p className="text-brand-slate text-xs sm:text-sm leading-relaxed mt-1 font-sans">
                    An Equated Monthly Installment (EMI) consists of two shifting components: principal repayment and interest charge. In the initial tenure years, up to 70% of each EMI pays off interest. Here is how institutional borrowers optimize this curve:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="p-4 bg-white rounded-2xl border border-brand-border/80 shadow-xs space-y-1.5">
                    <div className="flex items-center gap-2 text-brand-navy font-bold text-xs sm:text-sm font-heading">
                      <BadgePercent className="w-4 h-4 text-brand-teal flex-shrink-0" />
                      <span>EBLR Rate Reset Benefits</span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-brand-slate font-sans leading-relaxed">
                      Floating loans linked to RBI Repo rate adjust automatically. We ensure your lender passes repo rate cuts without administrative delays.
                    </p>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-brand-border/80 shadow-xs space-y-1.5">
                    <div className="flex items-center gap-2 text-brand-navy font-bold text-xs sm:text-sm font-heading">
                      <Scale className="w-4 h-4 text-brand-teal flex-shrink-0" />
                      <span>Zero Prepayment Penalty</span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-brand-slate font-sans leading-relaxed">
                      Per RBI mandate, individual floating rate home &amp; mortgage loans attract 0% penalty on partial prepayments or balance transfers.
                    </p>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-brand-border/80 shadow-xs space-y-1.5">
                    <div className="flex items-center gap-2 text-brand-navy font-bold text-xs sm:text-sm font-heading">
                      <Wallet className="w-4 h-4 text-brand-teal flex-shrink-0" />
                      <span>Annual 1-EMI Prepayment</span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-brand-slate font-sans leading-relaxed">
                      Paying just one extra EMI each financial year cuts a 20-year home loan duration down to nearly 16 years, saving lakhs in interest.
                    </p>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-brand-border/80 shadow-xs space-y-1.5">
                    <div className="flex items-center gap-2 text-brand-navy font-bold text-xs sm:text-sm font-heading">
                      <FileCheck2 className="w-4 h-4 text-brand-teal flex-shrink-0" />
                      <span>Tax Deductions Under 80C &amp; 24(b)</span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-brand-slate font-sans leading-relaxed">
                      Claim up to ₹2 Lakhs annual deduction on home loan interest under Sec 24(b), plus up to ₹1.5 Lakhs principal repayment under Sec 80C.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Institutional Banking Benchmark Strip */}
          <div className="mt-12 p-4 sm:px-8 rounded-2xl bg-white border border-brand-border/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-slate-600">
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 justify-center sm:justify-start">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span className="font-semibold text-brand-navy font-heading">RBI EBLR Benchmark Pegged</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span className="font-semibold text-brand-navy font-heading">Zero Prepayment Penalty on Floating Rates</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span className="font-semibold text-brand-navy font-heading">Direct Zonal Processing Desk</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-500 text-xs justify-center mx-auto sm:mx-0">
              <ShieldCheck className="w-4 h-4 text-brand-teal" />
              <span className="font-sans">Certified Multi-Bank Loan Syndication Desk</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
