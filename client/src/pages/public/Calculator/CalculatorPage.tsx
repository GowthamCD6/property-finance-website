import React, { useState, useEffect, useRef, useMemo } from 'react';
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
import { CDN_IMAGES } from '../../../constants/cloudinaryImages';

const emiHeroImage = CDN_IMAGES.emiHero;

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
    totalMonths > 0 && monthlyRate > 0 && loanAmount > 0
      ? Math.round(
          (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
            (Math.pow(1 + monthlyRate, totalMonths) - 1)
        )
      : 0;

  const totalPayment = emi * totalMonths;
  const totalInterest = Math.max(0, totalPayment - loanAmount);
  const principalPercent = totalPayment > 0 ? Math.round((loanAmount / totalPayment) * 100) : 100;
  const interestPercent = totalPayment > 0 ? 100 - principalPercent : 0;

  // Year 1 Amortization and Prepayment Analysis
  const year1Amortization = useMemo(() => {
    let balance = loanAmount;
    let yr1Principal = 0;
    let yr1Interest = 0;
    if (loanAmount > 0 && monthlyRate > 0 && emi > 0) {
      for (let m = 1; m <= Math.min(12, totalMonths); m++) {
        const intForMonth = balance * monthlyRate;
        const prinForMonth = Math.min(balance, emi - intForMonth);
        yr1Interest += intForMonth;
        yr1Principal += prinForMonth;
        balance = Math.max(0, balance - prinForMonth);
      }
    }
    return {
      principal: Math.round(yr1Principal),
      interest: Math.round(yr1Interest),
      closingBalance: Math.round(balance),
    };
  }, [loanAmount, monthlyRate, emi, totalMonths]);

  const prepaymentSavings = useMemo(() => {
    if (loanAmount <= 0 || monthlyRate <= 0 || emi <= 0) return { monthsSaved: 0, interestSaved: 0 };
    let balance = loanAmount;
    let totalIntWithPrepay = 0;
    let m = 0;
    while (balance > 0 && m < totalMonths * 2) {
      m++;
      const intForMonth = balance * monthlyRate;
      totalIntWithPrepay += intForMonth;
      let prinPaid = emi - intForMonth;
      if (m % 12 === 0) {
        prinPaid += emi; // extra 1 EMI annual prepayment
      }
      balance -= prinPaid;
      if (balance <= 0) break;
    }
    const monthsSaved = Math.max(0, totalMonths - m);
    const interestSaved = Math.max(0, totalInterest - Math.round(totalIntWithPrepay));
    return { monthsSaved, interestSaved };
  }, [loanAmount, monthlyRate, emi, totalMonths, totalInterest]);

  // Mode 2 Calculations
  const eligMonthlyRate = eligibilityRate / 12 / 100;
  const eligTotalMonths = eligibilityTenure * 12;
  const permissibleEmi = Math.max(0, Math.round(monthlyIncome * (foirPercentage / 100) - existingEmis));

  const maxLoanEligible =
    eligTotalMonths > 0 && eligMonthlyRate > 0 && permissibleEmi > 0
      ? Math.round(
          (permissibleEmi * (Math.pow(1 + eligMonthlyRate, eligTotalMonths) - 1)) /
            (eligMonthlyRate * Math.pow(1 + eligMonthlyRate, eligTotalMonths))
        )
      : 0;
  const currentObligationRatio = monthlyIncome > 0 ? Math.round((existingEmis / monthlyIncome) * 100) : 0;
  const monthlyDisposableSurplus = Math.max(0, monthlyIncome - existingEmis - permissibleEmi);

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
  const preEmiMonthlySavings = Math.max(0, fullCompositeEmi - preEmiInterestOnly);

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
              className="inline-flex items-center gap-2 px-3 xs:px-4 py-1.5 rounded-full bg-slate-900/80 border border-white/20 text-slate-100 text-[10px] xs:text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md shadow-sm max-w-full"
            >
              <span className="w-2 h-2 rounded-full bg-[#20B2AA] animate-pulse shrink-0"></span>
              <span className="font-heading truncate">Institutional Financial Engineering • RBI EBLR Linked</span>
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
              className="text-xs xs:text-sm sm:text-base md:text-lg text-slate-200 font-sans font-normal leading-relaxed max-w-3xl mx-auto px-2"
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
            className="mt-6 sm:mt-10 grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4.5"
          >
            {/* Instrument 1: Standard EMI */}
            <button
              type="button"
              onClick={() => handleSelectMode('emi')}
              className={`p-4 xs:p-5 sm:p-6 rounded-2xl text-left transition-all duration-300 relative overflow-hidden group cursor-pointer border ${
                calcMode === 'emi'
                  ? 'bg-slate-900/95 border-teal-400 ring-2 ring-teal-400/40 shadow-2xl shadow-teal-950/70'
                  : 'bg-slate-900/60 hover:bg-slate-900/80 border-white/15 hover:border-white/30 backdrop-blur-md'
              }`}
            >
              <div className="flex items-center justify-between mb-2.5 sm:mb-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300 group-hover:scale-105 transition-transform">
                  <CalcIcon className="w-4 h-4 sm:w-5 sm:h-5 text-teal-300" />
                </div>
                <span
                  className={`text-[9px] xs:text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full border ${
                    calcMode === 'emi'
                      ? 'bg-teal-500/25 text-teal-200 border-teal-400/50'
                      : 'bg-white/5 text-slate-400 border-white/10'
                  }`}
                >
                  {calcMode === 'emi' ? '● Active Mode' : 'Mode 01'}
                </span>
              </div>

              <h3 className="text-sm xs:text-base sm:text-lg font-bold text-white font-heading group-hover:text-teal-300 transition-colors">
                Standard Monthly EMI Outflow
              </h3>
              <p className="text-xs text-slate-300 font-sans mt-1 leading-relaxed">
                Model exact monthly payments, total interest amortization, and loan horizons starting from 7.25% p.a.
              </p>

              <div className="mt-3.5 sm:mt-4 pt-2.5 sm:pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="font-mono text-teal-300 font-semibold text-[11px] xs:text-xs">From 7.25% p.a.</span>
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
              className={`p-4 xs:p-5 sm:p-6 rounded-2xl text-left transition-all duration-300 relative overflow-hidden group cursor-pointer border ${
                calcMode === 'eligibility'
                  ? 'bg-slate-900/95 border-teal-400 ring-2 ring-teal-400/40 shadow-2xl shadow-teal-950/70'
                  : 'bg-slate-900/60 hover:bg-slate-900/80 border-white/15 hover:border-white/30 backdrop-blur-md'
              }`}
            >
              <div className="flex items-center justify-between mb-2.5 sm:mb-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300 group-hover:scale-105 transition-transform">
                  <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 text-sky-300" />
                </div>
                <span
                  className={`text-[9px] xs:text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full border ${
                    calcMode === 'eligibility'
                      ? 'bg-sky-500/25 text-sky-200 border-sky-400/50'
                      : 'bg-white/5 text-slate-400 border-white/10'
                  }`}
                >
                  {calcMode === 'eligibility' ? '● Active Mode' : 'Mode 02'}
                </span>
              </div>

              <h3 className="text-sm xs:text-base sm:text-lg font-bold text-white font-heading group-hover:text-sky-300 transition-colors">
                Banking FOIR &amp; Max Borrowing
              </h3>
              <p className="text-xs text-slate-300 font-sans mt-1 leading-relaxed">
                Stress-test net disposable income against obligations to compute maximum eligible borrowing ceiling.
              </p>

              <div className="mt-3.5 sm:mt-4 pt-2.5 sm:pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="font-mono text-sky-300 font-semibold text-[11px] xs:text-xs">50% – 65% Bank FOIR</span>
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
              className={`p-4 xs:p-5 sm:p-6 rounded-2xl text-left transition-all duration-300 relative overflow-hidden group cursor-pointer border ${
                calcMode === 'composite'
                  ? 'bg-slate-900/95 border-teal-400 ring-2 ring-teal-400/40 shadow-2xl shadow-teal-950/70'
                  : 'bg-slate-900/60 hover:bg-slate-900/80 border-white/15 hover:border-white/30 backdrop-blur-md'
              }`}
            >
              <div className="flex items-center justify-between mb-2.5 sm:mb-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 group-hover:scale-105 transition-transform">
                  <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-300" />
                </div>
                <span
                  className={`text-[9px] xs:text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full border ${
                    calcMode === 'composite'
                      ? 'bg-emerald-500/25 text-emerald-200 border-emerald-400/50'
                      : 'bg-white/5 text-slate-400 border-white/10'
                  }`}
                >
                  {calcMode === 'composite' ? '● Active Mode' : 'Mode 03'}
                </span>
              </div>

              <h3 className="text-sm xs:text-base sm:text-lg font-bold text-white font-heading group-hover:text-emerald-300 transition-colors">
                Composite Plot + Villa Build
              </h3>
              <p className="text-xs text-slate-300 font-sans mt-1 leading-relaxed">
                Simulate dual-tranche funding for land acquisition (70% LTV) and stage-wise civil construction (80% LTV).
              </p>

              <div className="mt-3.5 sm:mt-4 pt-2.5 sm:pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="font-mono text-emerald-400 font-semibold text-[11px] xs:text-xs">70:80 Split Tranches</span>
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
      <section ref={dashboardRef} className="pt-8 sm:pt-16 pb-12 sm:pb-16 bg-[#f8f8f4]">
        <div className="w-[94%] xs:w-[92%] sm:w-[88%] lg:w-[85%] max-w-7xl mx-auto">
          {calcMode === 'emi' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-start">
              <div className="lg:col-span-7 bg-white p-4 xs:p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-brand-border/80 shadow-card ring-1 ring-slate-900/5 space-y-5 xs:space-y-6 sm:space-y-7">
                <div>
                  <div className="inline-flex items-center gap-1.5 xs:gap-2 px-2.5 xs:px-3 py-1 rounded-full bg-brand-teal-light text-brand-teal text-[10px] xs:text-xs font-bold uppercase tracking-wider mb-2 font-heading">
                    <CalcIcon className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>Mode 01 Simulation</span>
                  </div>
                  <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-brand-navy font-heading">
                    Standard Monthly EMI Simulation
                  </h2>
                  <p className="text-xs sm:text-sm text-brand-slate font-sans mt-1">
                    Adjust loan principal, interest rates, and loan horizons to inspect your repayment schedule.
                  </p>
                </div>

                {/* Slider 1: Loan Amount */}
                <div className="space-y-2.5 xs:space-y-3">
                  <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-1.5 xs:gap-2">
                    <label className="text-xs sm:text-sm font-bold text-brand-navy font-heading">
                      Loan Amount Required
                    </label>
                    <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-xl px-2.5 xs:px-3 py-1 xs:py-1.5 self-end xs:self-auto focus-within:border-brand-teal focus-within:ring-2 focus-within:ring-brand-teal/20 transition-all">
                      <span className="text-brand-teal font-black text-xs sm:text-sm">₹</span>
                      <input
                        type="number"
                        min={100000}
                        max={200000000}
                        step={50000}
                        value={loanAmount === 0 ? '' : loanAmount}
                        onChange={(e) => {
                          const val = e.target.value === '' ? 0 : Math.max(0, Number(e.target.value));
                          setLoanAmount(val);
                        }}
                        className="w-24 xs:w-28 sm:w-36 bg-transparent text-brand-navy font-mono font-black text-xs sm:text-sm text-right outline-none"
                      />
                    </div>
                  </div>
                  <input
                    type="range"
                    min="500000"
                    max="100000000"
                    step="250000"
                    value={loanAmount || 500000}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-teal"
                  />
                  <div className="flex justify-between text-[10px] xs:text-[11px] text-brand-slate font-sans font-medium">
                    <span>₹ 5 Lakhs</span>
                    <span className="font-bold text-brand-navy font-heading truncate mx-1">{getVerbalAmount(loanAmount)}</span>
                    <span>₹ 10 Crores</span>
                  </div>
                  {/* Quick Preset Buttons */}
                  <div className="flex flex-wrap gap-1 xs:gap-1.5 pt-1">
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
                        className={`px-2.5 xs:px-3 py-1 xs:py-1.5 rounded-lg text-[11px] xs:text-xs font-bold font-heading transition-all cursor-pointer ${
                          loanAmount === chip.val
                            ? 'bg-brand-teal text-white shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Slider 2: Interest Rate */}
                <div className="space-y-2.5 xs:space-y-3">
                  <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-1.5 xs:gap-2">
                    <label className="text-xs sm:text-sm font-bold text-brand-navy font-heading">
                      Indicative Annual Interest Rate (% p.a.)
                    </label>
                    <div className="flex items-center gap-1 bg-slate-50 border border-slate-300 rounded-xl px-2.5 xs:px-3 py-1 xs:py-1.5 self-end xs:self-auto focus-within:border-brand-teal focus-within:ring-2 focus-within:ring-brand-teal/20 transition-all">
                      <input
                        type="number"
                        min={5.0}
                        max={20.0}
                        step={0.05}
                        value={interestRate === 0 ? '' : interestRate}
                        onChange={(e) => {
                          const val = e.target.value === '' ? 0 : Number(e.target.value);
                          setInterestRate(val);
                        }}
                        className="w-14 xs:w-16 bg-transparent text-brand-navy font-mono font-black text-xs sm:text-sm text-right outline-none"
                      />
                      <span className="text-brand-teal font-black text-xs sm:text-sm">%</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="6.5"
                    max="16.0"
                    step="0.05"
                    value={interestRate || 7.25}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-teal"
                  />
                  <div className="flex justify-between text-[10px] xs:text-[11px] text-brand-slate font-sans font-medium">
                    <span>6.50% (Prime HL)</span>
                    <span className="font-bold text-brand-navy font-mono">{interestRate.toFixed(2)}% p.a.</span>
                    <span>16.00%</span>
                  </div>
                  {/* Quick Rate Presets */}
                  <div className="flex flex-wrap gap-1 xs:gap-1.5 pt-1">
                    {[
                      { label: '7.25% (Prime HL)', val: 7.25 },
                      { label: '7.75% (Std HL)', val: 7.75 },
                      { label: '8.50% (Prime LAP)', val: 8.50 },
                      { label: '9.25% (Comm. LAP)', val: 9.25 },
                      { label: '10.50% (Project)', val: 10.50 },
                    ].map((chip) => (
                      <button
                        key={chip.val}
                        type="button"
                        onClick={() => setInterestRate(chip.val)}
                        className={`px-2.5 xs:px-3 py-1 xs:py-1.5 rounded-lg text-[11px] xs:text-xs font-bold font-heading transition-all cursor-pointer ${
                          interestRate === chip.val
                            ? 'bg-brand-teal text-white shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Slider 3: Tenure */}
                <div className="space-y-2.5 xs:space-y-3">
                  <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-1.5 xs:gap-2">
                    <label className="text-xs sm:text-sm font-bold text-brand-navy font-heading">
                      Repayment Horizon (Tenure in Years)
                    </label>
                    <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-xl px-2.5 xs:px-3 py-1 xs:py-1.5 self-end xs:self-auto focus-within:border-brand-teal focus-within:ring-2 focus-within:ring-brand-teal/20 transition-all">
                      <input
                        type="number"
                        min={1}
                        max={30}
                        step={1}
                        value={tenureYears === 0 ? '' : tenureYears}
                        onChange={(e) => {
                          const val = e.target.value === '' ? 0 : Math.min(30, Math.max(1, Number(e.target.value)));
                          setTenureYears(val);
                        }}
                        className="w-12 xs:w-14 bg-transparent text-brand-navy font-mono font-black text-xs sm:text-sm text-right outline-none"
                      />
                      <span className="text-brand-slate font-bold text-xs font-mono">Yrs ({totalMonths}m)</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    step="1"
                    value={tenureYears || 1}
                    onChange={(e) => setTenureYears(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-teal"
                  />
                  <div className="flex justify-between text-[10px] xs:text-[11px] text-brand-slate font-sans font-medium">
                    <span>1 Year</span>
                    <span className="font-bold text-brand-navy font-mono">{tenureYears} Years</span>
                    <span>30 Years (Max HL)</span>
                  </div>
                  {/* Quick Tenure Presets */}
                  <div className="flex flex-wrap gap-1 xs:gap-1.5 pt-1">
                    {[5, 10, 15, 20, 25, 30].map((yr) => (
                      <button
                        key={yr}
                        type="button"
                        onClick={() => setTenureYears(yr)}
                        className={`px-2.5 xs:px-3 py-1 xs:py-1.5 rounded-lg text-[11px] xs:text-xs font-bold font-heading transition-all cursor-pointer ${
                          tenureYears === yr
                            ? 'bg-brand-teal text-white shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {yr} Yrs
                      </button>
                    ))}
                  </div>
                </div>

                {/* Year-1 Amortization Snapshot Box */}
                <div className="p-3.5 sm:p-4 bg-slate-50/90 rounded-2xl border border-brand-border space-y-2.5 sm:space-y-3">
                  <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-1 text-xs font-bold text-brand-navy font-heading">
                    <span className="flex items-center gap-1.5 text-[11px] sm:text-xs">
                      <Clock className="w-3.5 h-3.5 text-brand-teal flex-shrink-0" />
                      <span>Year 1 Repayment Distribution</span>
                    </span>
                    <span className="text-[10px] xs:text-[11px] font-mono text-slate-500 font-medium">
                      Annual: {formatINR(emi * 12)}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-center">
                    <div className="p-2 sm:p-2.5 rounded-xl bg-white border border-slate-200 min-w-0">
                      <span className="text-[9px] xs:text-[10px] text-slate-500 uppercase font-bold block truncate">
                        Yr 1 Principal
                      </span>
                      <span className="text-[11px] xs:text-xs sm:text-sm font-bold text-emerald-700 font-mono block mt-0.5 truncate">
                        {formatINR(year1Amortization.principal)}
                      </span>
                    </div>
                    <div className="p-2 sm:p-2.5 rounded-xl bg-white border border-slate-200 min-w-0">
                      <span className="text-[9px] xs:text-[10px] text-slate-500 uppercase font-bold block truncate">
                        Yr 1 Interest
                      </span>
                      <span className="text-[11px] xs:text-xs sm:text-sm font-bold text-sky-700 font-mono block mt-0.5 truncate">
                        {formatINR(year1Amortization.interest)}
                      </span>
                    </div>
                    <div className="p-2 sm:p-2.5 rounded-xl bg-white border border-slate-200 min-w-0">
                      <span className="text-[9px] xs:text-[10px] text-slate-500 uppercase font-bold block truncate">
                        Yr 1 Balance
                      </span>
                      <span className="text-[11px] xs:text-xs sm:text-sm font-bold text-brand-navy font-mono block mt-0.5 truncate">
                        {formatINR(year1Amortization.closingBalance)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Cockpit Card: Outflow Analytics */}
              <div className="lg:col-span-5 bg-gradient-to-br from-[#0c1e30] via-[#0f273d] to-[#14324f] text-white p-4 xs:p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/15 space-y-5 sm:space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

                <div>
                  <span className="text-[11px] xs:text-xs font-bold uppercase tracking-wider text-teal-300 font-heading block">
                    Estimated Monthly Outflow
                  </span>
                  <div className="mt-1.5 xs:mt-2 text-2xl xs:text-3xl sm:text-4xl font-extrabold text-white font-mono break-words">
                    {formatINR(emi)}
                    <span className="text-xs font-normal text-slate-300 block sm:inline sm:ml-2 font-sans">/ month</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-[11px] xs:text-xs font-semibold font-heading">
                    <span className="text-emerald-400">Principal: {principalPercent}%</span>
                    <span className="text-sky-300">Interest: {interestPercent}%</span>
                  </div>
                  <div className="h-2.5 xs:h-3 w-full bg-white/10 rounded-full overflow-hidden flex border border-white/10">
                    <div style={{ width: `${principalPercent}%` }} className="bg-emerald-500 h-full transition-all duration-300" />
                    <div style={{ width: `${interestPercent}%` }} className="bg-sky-400 h-full transition-all duration-300" />
                  </div>
                </div>

                <div className="space-y-2.5 xs:space-y-3 pt-1 text-xs sm:text-sm">
                  <div className="flex justify-between items-center p-3 xs:p-3.5 rounded-xl bg-white/[0.05] border border-white/10 backdrop-blur-md gap-2">
                    <span className="text-slate-300 font-sans font-medium text-xs sm:text-sm">Principal Borrowed:</span>
                    <span className="font-bold text-white font-mono text-xs sm:text-sm truncate">{formatINR(loanAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 xs:p-3.5 rounded-xl bg-white/[0.05] border border-white/10 backdrop-blur-md gap-2">
                    <span className="text-slate-300 font-sans font-medium text-xs sm:text-sm">Total Interest:</span>
                    <span className="font-bold text-sky-300 font-mono text-xs sm:text-sm truncate">{formatINR(totalInterest)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 xs:p-3.5 rounded-xl bg-white/[0.08] border border-white/20 backdrop-blur-md gap-2">
                    <span className="text-white font-bold font-heading text-xs sm:text-sm">Total Repayment:</span>
                    <span className="font-black text-emerald-400 font-mono text-xs sm:text-sm truncate">{formatINR(totalPayment)}</span>
                  </div>
                </div>

                {/* Prepayment Advantage Note */}
                {prepaymentSavings.monthsSaved > 0 && (
                  <div className="p-3 xs:p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-400/30 text-xs text-emerald-200 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold font-heading text-emerald-300">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-300 flex-shrink-0" />
                      <span>Smart Prepayment Advantage</span>
                    </div>
                    <p className="text-[11px] text-emerald-100/90 leading-relaxed font-sans">
                      Paying just 1 extra EMI each year saves approx <strong className="font-mono text-white">{formatINR(prepaymentSavings.interestSaved)}</strong> in interest and finishes the loan <strong className="font-mono text-white">{Math.round(prepaymentSavings.monthsSaved / 12)} years earlier</strong>.
                    </p>
                  </div>
                )}

                <div className="pt-1 xs:pt-2">
                  <Link
                    to={`/enquire?amount=${loanAmount}&tenure=${tenureYears}&rate=${interestRate}&type=home`}
                    className="hero-btn-primary w-full py-3.5 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm font-bold font-heading text-white flex items-center justify-center gap-2 text-center cursor-pointer tracking-wide whitespace-nowrap"
                  >
                    <span>Apply with this Repayment Quote</span>
                    <ArrowRight className="w-4 h-4 hero-btn-arrow flex-shrink-0" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {calcMode === 'eligibility' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-start">
              <div className="lg:col-span-7 bg-white p-4 xs:p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-brand-border/80 shadow-card ring-1 ring-slate-900/5 space-y-5 xs:space-y-6 sm:space-y-7">
                <div>
                  <div className="inline-flex items-center gap-1.5 xs:gap-2 px-2.5 xs:px-3 py-1 rounded-full bg-brand-teal-light text-brand-teal text-[10px] xs:text-xs font-bold uppercase tracking-wider mb-2 font-heading">
                    <UserCheck className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>Mode 02 Analysis</span>
                  </div>
                  <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-brand-navy font-heading">
                    Maximum Borrowing Capacity &amp; Banking FOIR
                  </h2>
                  <p className="text-xs sm:text-sm text-brand-slate font-sans mt-1">
                    Banks restrict maximum loan sanctions based on your Fixed Obligation to Income Ratio (FOIR).
                  </p>
                </div>

                {/* Net Income Control */}
                <div className="space-y-2.5 xs:space-y-3">
                  <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-1.5 xs:gap-2">
                    <label className="text-xs sm:text-sm font-bold text-brand-navy font-heading">
                      Net Monthly Take-Home Income
                    </label>
                    <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-xl px-2.5 xs:px-3 py-1 xs:py-1.5 self-end xs:self-auto focus-within:border-brand-teal focus-within:ring-2 focus-within:ring-brand-teal/20 transition-all">
                      <span className="text-brand-teal font-black text-xs sm:text-sm">₹</span>
                      <input
                        type="number"
                        min={15000}
                        max={5000000}
                        step={5000}
                        value={monthlyIncome === 0 ? '' : monthlyIncome}
                        onChange={(e) => {
                          const val = e.target.value === '' ? 0 : Math.max(0, Number(e.target.value));
                          setMonthlyIncome(val);
                        }}
                        className="w-24 xs:w-28 sm:w-32 bg-transparent text-brand-navy font-mono font-black text-xs sm:text-sm text-right outline-none"
                      />
                    </div>
                  </div>
                  <input
                    type="range"
                    min="30000"
                    max="1000000"
                    step="10000"
                    value={monthlyIncome || 30000}
                    onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-teal"
                  />
                  <div className="flex justify-between text-[10px] xs:text-[11px] text-brand-slate font-sans font-medium">
                    <span>₹ 30,000 / mo</span>
                    <span className="font-bold text-brand-navy font-heading truncate mx-1">{getVerbalAmount(monthlyIncome)}</span>
                    <span>₹ 10 Lakhs / mo</span>
                  </div>
                  <div className="flex flex-wrap gap-1 xs:gap-1.5 pt-1">
                    {[
                      { label: '₹50K', val: 50000 },
                      { label: '₹1L', val: 100000 },
                      { label: '₹1.5L', val: 150000 },
                      { label: '₹2.5L', val: 250000 },
                      { label: '₹5L', val: 500000 },
                    ].map((chip) => (
                      <button
                        key={chip.val}
                        type="button"
                        onClick={() => setMonthlyIncome(chip.val)}
                        className={`px-2.5 xs:px-3 py-1 xs:py-1.5 rounded-lg text-[11px] xs:text-xs font-bold font-heading transition-all cursor-pointer ${
                          monthlyIncome === chip.val
                            ? 'bg-brand-teal text-white shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Existing Obligations Control */}
                <div className="space-y-2.5 xs:space-y-3">
                  <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-1.5 xs:gap-2">
                    <label className="text-xs sm:text-sm font-bold text-brand-navy font-heading">
                      Existing Monthly Obligations (Other EMIs)
                    </label>
                    <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-xl px-2.5 xs:px-3 py-1 xs:py-1.5 self-end xs:self-auto focus-within:border-amber-600 focus-within:ring-2 focus-within:ring-amber-500/20 transition-all">
                      <span className="text-amber-700 font-black text-xs sm:text-sm">₹</span>
                      <input
                        type="number"
                        min={0}
                        max={1000000}
                        step={2000}
                        value={existingEmis === 0 ? '0' : existingEmis}
                        onChange={(e) => {
                          const val = e.target.value === '' ? 0 : Math.max(0, Number(e.target.value));
                          setExistingEmis(val);
                        }}
                        className="w-20 xs:w-24 sm:w-28 bg-transparent text-amber-900 font-mono font-black text-xs sm:text-sm text-right outline-none"
                      />
                    </div>
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
                  <div className="flex justify-between text-[10px] xs:text-[11px] text-brand-slate font-sans font-medium">
                    <span>₹ 0 (Debt Free)</span>
                    <span className="font-bold text-amber-800 font-mono truncate mx-1">{formatINR(existingEmis)}</span>
                    <span>₹ 3 Lakhs / mo</span>
                  </div>
                  <div className="flex flex-wrap gap-1 xs:gap-1.5 pt-1">
                    {[
                      { label: '₹0 (Nil)', val: 0 },
                      { label: '₹15K', val: 15000 },
                      { label: '₹30K', val: 30000 },
                      { label: '₹50K', val: 50000 },
                      { label: '₹1L', val: 100000 },
                    ].map((chip) => (
                      <button
                        key={chip.val}
                        type="button"
                        onClick={() => setExistingEmis(chip.val)}
                        className={`px-2.5 xs:px-3 py-1 xs:py-1.5 rounded-lg text-[11px] xs:text-xs font-bold font-heading transition-all cursor-pointer ${
                          existingEmis === chip.val
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Additional Parameters: Tenure & Rate for Eligibility */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-1">
                  {/* Desired Tenure */}
                  <div className="space-y-2 p-3 sm:p-3.5 bg-slate-50/70 rounded-xl sm:rounded-2xl border border-slate-200">
                    <div className="flex items-center justify-between text-xs font-bold text-brand-navy font-heading">
                      <span>Loan Horizon:</span>
                      <div className="flex items-center gap-1 bg-white border border-slate-300 rounded-lg px-2 py-0.5">
                        <input
                          type="number"
                          min={1}
                          max={30}
                          value={eligibilityTenure}
                          onChange={(e) => setEligibilityTenure(Math.min(30, Math.max(1, Number(e.target.value))))}
                          className="w-8 font-mono font-bold text-xs text-right outline-none"
                        />
                        <span className="text-[11px] text-slate-500 font-mono">Yrs</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="30"
                      step="1"
                      value={eligibilityTenure}
                      onChange={(e) => setEligibilityTenure(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-teal"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>5y</span>
                      <span>{eligTotalMonths} Months</span>
                      <span>30y</span>
                    </div>
                  </div>

                  {/* Benchmark Interest Rate */}
                  <div className="space-y-2 p-3 sm:p-3.5 bg-slate-50/70 rounded-xl sm:rounded-2xl border border-slate-200">
                    <div className="flex items-center justify-between text-xs font-bold text-brand-navy font-heading">
                      <span>Indicative ROI:</span>
                      <div className="flex items-center gap-1 bg-white border border-slate-300 rounded-lg px-2 py-0.5">
                        <input
                          type="number"
                          min={6.0}
                          max={16.0}
                          step={0.05}
                          value={eligibilityRate}
                          onChange={(e) => setEligibilityRate(Number(e.target.value))}
                          className="w-12 font-mono font-bold text-xs text-right outline-none"
                        />
                        <span className="text-[11px] text-slate-500 font-mono">%</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="6.5"
                      max="14.0"
                      step="0.05"
                      value={eligibilityRate}
                      onChange={(e) => setEligibilityRate(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-teal"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>6.5%</span>
                      <span>p.a.</span>
                      <span>14.0%</span>
                    </div>
                  </div>
                </div>

                {/* FOIR Benchmark Norm Selector */}
                <div className="p-3.5 sm:p-4 bg-slate-50 rounded-2xl border border-brand-border space-y-2.5">
                  <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-1.5 text-xs font-bold text-brand-navy font-heading">
                    <span>Lender FOIR Benchmark Norm:</span>
                    <div className="flex items-center gap-1 bg-white border border-slate-300 rounded-lg px-2 py-0.5 self-start xs:self-auto">
                      <input
                        type="number"
                        min={35}
                        max={75}
                        value={foirPercentage}
                        onChange={(e) => setFoirPercentage(Math.min(75, Math.max(30, Number(e.target.value))))}
                        className="w-8 font-mono font-bold text-xs text-right outline-none"
                      />
                      <span className="text-[11px] text-brand-teal font-mono font-bold">% Net Income</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-xs font-semibold font-heading">
                    {[50, 55, 65].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => setFoirPercentage(pct)}
                        className={`py-2 px-1.5 sm:px-3 rounded-xl border text-center transition-all cursor-pointer ${
                          foirPercentage === pct
                            ? 'bg-brand-navy text-white border-brand-navy shadow-xs'
                            : 'bg-white text-brand-slate border-slate-200 hover:border-brand-teal'
                        }`}
                      >
                        <div className="font-bold text-xs sm:text-sm font-mono">{pct}%</div>
                        <div className="text-[9px] sm:text-[10px] opacity-80 leading-tight mt-0.5 truncate">
                          {pct === 50 ? 'Conservative' : pct === 55 ? 'Standard' : 'High Income'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Cockpit Card: Eligibility Analytics */}
              <div className="lg:col-span-5 bg-gradient-to-br from-[#0c1e30] via-[#0f273d] to-[#14324f] text-white p-4 xs:p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/15 space-y-5 sm:space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

                <div>
                  <span className="text-[11px] xs:text-xs font-bold uppercase tracking-wider text-teal-300 font-heading block">
                    Estimated Maximum Loan Capacity
                  </span>
                  <div className="mt-1.5 xs:mt-2 text-2xl xs:text-3xl sm:text-4xl font-extrabold text-white font-mono break-words">
                    {formatINR(maxLoanEligible)}
                  </div>
                  <span className="text-[11px] xs:text-xs font-medium font-sans text-emerald-300 bg-emerald-500/20 px-2.5 py-1 rounded inline-block mt-2">
                    Sanction Ceiling @ {eligibilityRate}% ROI over {eligibilityTenure} Years
                  </span>
                </div>

                <div className="space-y-2.5 xs:space-y-3 pt-1 text-xs sm:text-sm">
                  <div className="flex justify-between items-center p-3 xs:p-3.5 rounded-xl bg-white/[0.05] border border-white/10 backdrop-blur-md gap-2">
                    <span className="text-slate-300 font-sans font-medium text-xs sm:text-sm">Permissible EMI:</span>
                    <span className="font-bold text-white font-mono text-xs sm:text-sm truncate">{formatINR(permissibleEmi)} / mo</span>
                  </div>
                  <div className="flex justify-between items-center p-3 xs:p-3.5 rounded-xl bg-white/[0.05] border border-white/10 backdrop-blur-md gap-2">
                    <span className="text-slate-300 font-sans font-medium text-xs sm:text-sm">Current Obligation:</span>
                    <span className="font-bold text-amber-400 font-mono text-xs sm:text-sm truncate">
                      {formatINR(existingEmis)} ({currentObligationRatio}%)
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 xs:p-3.5 rounded-xl bg-white/[0.08] border border-white/20 backdrop-blur-md gap-2">
                    <span className="text-white font-bold font-heading text-xs sm:text-sm">Disposable Surplus:</span>
                    <span className="font-black text-emerald-400 font-mono text-xs sm:text-sm truncate">{formatINR(monthlyDisposableSurplus)} / mo</span>
                  </div>
                </div>

                {/* Risk and Clearance Rating */}
                <div className="p-3 xs:p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs space-y-1">
                  <div className="flex items-center justify-between font-heading font-bold gap-2">
                    <span className="text-slate-300 text-[11px] xs:text-xs">Underwriting Assessment:</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] xs:text-[10px] font-mono whitespace-nowrap ${
                      currentObligationRatio <= 30
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                        : currentObligationRatio <= 50
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-400/40'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                    }`}>
                      {currentObligationRatio <= 30 ? 'Low Risk • Prime Band' : currentObligationRatio <= 50 ? 'Moderate Leverage' : 'High Obligation Load'}
                    </span>
                  </div>
                  <p className="text-[10px] xs:text-[11px] text-slate-300 leading-relaxed font-sans pt-1">
                    {currentObligationRatio <= 30
                      ? 'Excellent profile. Eligible for top-tier spreads and instant in-principle sanction from our 40+ panel lenders.'
                      : currentObligationRatio <= 50
                      ? 'Healthy borrowing cushion. Co-applicant addition or tenure extension can further expand your sanction ceiling.'
                      : 'Existing obligations occupy substantial cash flow. Debt consolidation or partial loan pre-closure is advised.'}
                  </p>
                </div>

                <div className="pt-1 xs:pt-2">
                  <Link
                    to={`/enquire?amount=${maxLoanEligible}&tenure=${eligibilityTenure}&rate=${eligibilityRate}&type=home`}
                    className="hero-btn-primary w-full py-3.5 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm font-bold font-heading text-white flex items-center justify-center gap-2 text-center cursor-pointer tracking-wide whitespace-nowrap"
                  >
                    <span>Request Full Multi-Bank Assessment</span>
                    <ArrowRight className="w-4 h-4 hero-btn-arrow flex-shrink-0" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {calcMode === 'composite' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-start">
              <div className="lg:col-span-7 bg-white p-4 xs:p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-brand-border/80 shadow-card ring-1 ring-slate-900/5 space-y-5 xs:space-y-6 sm:space-y-7">
                <div>
                  <div className="inline-flex items-center gap-1.5 xs:gap-2 px-2.5 xs:px-3 py-1 rounded-full bg-brand-teal-light text-brand-teal text-[10px] xs:text-xs font-bold uppercase tracking-wider mb-2 font-heading">
                    <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>Mode 03 Simulation</span>
                  </div>
                  <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-brand-navy font-heading">
                    Plot Purchase + House Construction Financing
                  </h2>
                  <p className="text-xs sm:text-sm text-brand-slate font-sans mt-1">
                    Calculate funding split between land acquisition and phased civil construction disbursements.
                  </p>
                </div>

                {/* Plot Cost Control */}
                <div className="space-y-2.5 xs:space-y-3">
                  <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-1.5 xs:gap-2">
                    <label className="text-xs sm:text-sm font-bold text-brand-navy font-heading">
                      Plot / Land Purchase Cost (A-Khata / DTCP)
                    </label>
                    <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-xl px-2.5 xs:px-3 py-1 xs:py-1.5 self-end xs:self-auto focus-within:border-brand-teal focus-within:ring-2 focus-within:ring-brand-teal/20 transition-all">
                      <span className="text-brand-teal font-black text-xs sm:text-sm">₹</span>
                      <input
                        type="number"
                        min={500000}
                        max={100000000}
                        step={100000}
                        value={plotCost === 0 ? '' : plotCost}
                        onChange={(e) => {
                          const val = e.target.value === '' ? 0 : Math.max(0, Number(e.target.value));
                          setPlotCost(val);
                        }}
                        className="w-24 xs:w-28 sm:w-36 bg-transparent text-brand-navy font-mono font-black text-xs sm:text-sm text-right outline-none"
                      />
                    </div>
                  </div>
                  <input
                    type="range"
                    min="1500000"
                    max="50000000"
                    step="250000"
                    value={plotCost || 1500000}
                    onChange={(e) => setPlotCost(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-teal"
                  />
                  <div className="flex justify-between text-[10px] xs:text-[11px] text-brand-slate font-sans font-medium">
                    <span>₹ 15 Lakhs</span>
                    <span className="font-bold text-brand-navy font-heading truncate mx-1">70% Max: {formatINR(maxPlotLoan)}</span>
                    <span>₹ 5 Crores</span>
                  </div>
                  <div className="flex flex-wrap gap-1 xs:gap-1.5 pt-1">
                    {[2500000, 4000000, 6000000, 10000000, 20000000].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setPlotCost(val)}
                        className={`px-2.5 xs:px-3 py-1 xs:py-1.5 rounded-lg text-[11px] xs:text-xs font-bold font-heading transition-all cursor-pointer ${
                          plotCost === val
                            ? 'bg-brand-teal text-white shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {getVerbalAmount(val)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Construction Cost Control */}
                <div className="space-y-2.5 xs:space-y-3">
                  <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-1.5 xs:gap-2">
                    <label className="text-xs sm:text-sm font-bold text-brand-navy font-heading">
                      Estimated House Construction Budget
                    </label>
                    <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-xl px-2.5 xs:px-3 py-1 xs:py-1.5 self-end xs:self-auto focus-within:border-brand-teal focus-within:ring-2 focus-within:ring-brand-teal/20 transition-all">
                      <span className="text-brand-teal font-black text-xs sm:text-sm">₹</span>
                      <input
                        type="number"
                        min={1000000}
                        max={100000000}
                        step={100000}
                        value={constructionCost === 0 ? '' : constructionCost}
                        onChange={(e) => {
                          const val = e.target.value === '' ? 0 : Math.max(0, Number(e.target.value));
                          setConstructionCost(val);
                        }}
                        className="w-24 xs:w-28 sm:w-36 bg-transparent text-brand-navy font-mono font-black text-xs sm:text-sm text-right outline-none"
                      />
                    </div>
                  </div>
                  <input
                    type="range"
                    min="2000000"
                    max="50000000"
                    step="250000"
                    value={constructionCost || 2000000}
                    onChange={(e) => setConstructionCost(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-teal"
                  />
                  <div className="flex justify-between text-[10px] xs:text-[11px] text-brand-slate font-sans font-medium">
                    <span>₹ 20 Lakhs</span>
                    <span className="font-bold text-brand-navy font-heading truncate mx-1">80% Max: {formatINR(maxConstructionLoan)}</span>
                    <span>₹ 5 Crores</span>
                  </div>
                  <div className="flex flex-wrap gap-1 xs:gap-1.5 pt-1">
                    {[3000000, 5000000, 7500000, 10000000, 20000000].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setConstructionCost(val)}
                        className={`px-2.5 xs:px-3 py-1 xs:py-1.5 rounded-lg text-[11px] xs:text-xs font-bold font-heading transition-all cursor-pointer ${
                          constructionCost === val
                            ? 'bg-brand-teal text-white shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {getVerbalAmount(val)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Additional Composite Controls: Tenure & ROI */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-1">
                  <div className="space-y-2 p-3 sm:p-3.5 bg-slate-50/70 rounded-xl sm:rounded-2xl border border-slate-200">
                    <div className="flex items-center justify-between text-xs font-bold text-brand-navy font-heading">
                      <span>Loan Tenure:</span>
                      <div className="flex items-center gap-1 bg-white border border-slate-300 rounded-lg px-2 py-0.5">
                        <input
                          type="number"
                          min={5}
                          max={30}
                          value={compositeTenure}
                          onChange={(e) => setCompositeTenure(Math.min(30, Math.max(5, Number(e.target.value))))}
                          className="w-8 font-mono font-bold text-xs text-right outline-none"
                        />
                        <span className="text-[11px] text-slate-500 font-mono">Yrs</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="30"
                      step="1"
                      value={compositeTenure}
                      onChange={(e) => setCompositeTenure(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-teal"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>5y</span>
                      <span>{compositeMonths} Months</span>
                      <span>30y</span>
                    </div>
                  </div>

                  <div className="space-y-2 p-3 sm:p-3.5 bg-slate-50/70 rounded-xl sm:rounded-2xl border border-slate-200">
                    <div className="flex items-center justify-between text-xs font-bold text-brand-navy font-heading">
                      <span>Indicative ROI:</span>
                      <div className="flex items-center gap-1 bg-white border border-slate-300 rounded-lg px-2 py-0.5">
                        <input
                          type="number"
                          min={6.5}
                          max={16.0}
                          step={0.05}
                          value={compositeRate}
                          onChange={(e) => setCompositeRate(Number(e.target.value))}
                          className="w-12 font-mono font-bold text-xs text-right outline-none"
                        />
                        <span className="text-[11px] text-slate-500 font-mono">%</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="6.5"
                      max="14.0"
                      step="0.05"
                      value={compositeRate}
                      onChange={(e) => setCompositeRate(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-teal"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>6.5%</span>
                      <span>p.a.</span>
                      <span>14.0%</span>
                    </div>
                  </div>
                </div>

                {/* Construction Tranche Drawdown Slider */}
                <div className="space-y-2.5 xs:space-y-3 p-3.5 sm:p-4 bg-slate-50 rounded-2xl border border-brand-border">
                  <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-1 font-heading">
                    <label className="text-xs font-bold text-brand-navy">Simulated Construction Stage Drawdown:</label>
                    <span className="text-xs sm:text-sm font-black text-brand-teal font-mono">{disbursedTranchePercent}% Disbursed</span>
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
                  <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 gap-1.5 pt-1">
                    {[
                      { label: '0% (Plot Only)', val: 0 },
                      { label: '25% (Foundation)', val: 25 },
                      { label: '50% (Slab Done)', val: 50 },
                      { label: '75% (Finishing)', val: 75 },
                      { label: '100% (Complete)', val: 100 },
                    ].map((step) => (
                      <button
                        key={step.val}
                        type="button"
                        onClick={() => setDisbursedTranchePercent(step.val)}
                        className={`py-1.5 px-2 rounded-lg text-[10px] font-bold font-mono transition-all cursor-pointer text-center truncate ${
                          disbursedTranchePercent === step.val
                            ? 'bg-brand-teal text-white shadow-xs'
                            : 'bg-white border border-slate-200 text-slate-600 hover:border-brand-teal'
                        }`}
                      >
                        {step.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Cockpit Card: Composite Project Analytics */}
              <div className="lg:col-span-5 bg-gradient-to-br from-[#0c1e30] via-[#0f273d] to-[#14324f] text-white p-4 xs:p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/15 space-y-5 sm:space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

                <div>
                  <span className="text-[11px] xs:text-xs font-bold uppercase tracking-wider text-teal-300 font-heading block">
                    Total Project Debt Sanction
                  </span>
                  <div className="mt-1.5 xs:mt-2 text-2xl xs:text-3xl sm:text-4xl font-extrabold text-white font-mono break-words">
                    {formatINR(totalCompositeLoan)}
                  </div>
                  <span className="text-[11px] xs:text-xs font-medium font-sans text-emerald-300 bg-emerald-500/20 px-2.5 py-1 rounded inline-block mt-2">
                    Total Outlay: {formatINR(totalProjectCost)} (Self-Margin: {formatINR(selfContribution)})
                  </span>
                </div>

                <div className="space-y-2.5 xs:space-y-3 pt-1 text-xs sm:text-sm">
                  <div className="flex justify-between items-center p-3 xs:p-3.5 rounded-xl bg-white/[0.05] border border-white/10 backdrop-blur-md gap-2">
                    <span className="text-slate-300 font-sans font-medium text-xs sm:text-sm">Plot Loan (70%):</span>
                    <span className="font-bold text-white font-mono text-xs sm:text-sm truncate">{formatINR(maxPlotLoan)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 xs:p-3.5 rounded-xl bg-white/[0.05] border border-white/10 backdrop-blur-md gap-2">
                    <span className="text-slate-300 font-sans font-medium text-xs sm:text-sm">Construction (80%):</span>
                    <span className="font-bold text-white font-mono text-xs sm:text-sm truncate">{formatINR(maxConstructionLoan)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 xs:p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 gap-2">
                    <div className="min-w-0">
                      <span className="text-amber-300 font-bold font-heading block text-xs sm:text-sm truncate">Active Pre-EMI (Interest Only):</span>
                      <span className="text-[10px] text-slate-300 font-sans truncate block">
                        At {disbursedTranchePercent}% stage ({formatINR(activeDrawdown)} drawn)
                      </span>
                    </div>
                    <span className="font-black text-amber-300 font-mono text-sm sm:text-base flex-shrink-0">{formatINR(preEmiInterestOnly)} / mo</span>
                  </div>
                  <div className="flex justify-between items-center p-3 xs:p-3.5 rounded-xl bg-white/[0.08] border border-white/20 gap-2">
                    <div className="min-w-0">
                      <span className="text-white font-bold font-heading block text-xs sm:text-sm truncate">Full Regular EMI:</span>
                      <span className="text-[10px] text-emerald-300 font-sans truncate block">
                        Saves {formatINR(preEmiMonthlySavings)}/mo during build
                      </span>
                    </div>
                    <span className="font-black text-emerald-400 font-mono text-sm sm:text-base flex-shrink-0">{formatINR(fullCompositeEmi)} / mo</span>
                  </div>
                </div>

                <div className="pt-1 xs:pt-2">
                  <Link
                    to={`/enquire?amount=${totalCompositeLoan}&tenure=${compositeTenure}&rate=${compositeRate}&type=project`}
                    className="hero-btn-primary w-full py-3.5 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm font-bold font-heading text-white flex items-center justify-center gap-2 text-center cursor-pointer tracking-wide whitespace-nowrap"
                  >
                    <span>Consult on Composite Plot Loan</span>
                    <ArrowRight className="w-4 h-4 hero-btn-arrow flex-shrink-0" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Institutional EMI Breakdown & Amortization Architecture Section */}
          <div className="mt-10 sm:mt-14 pt-8 sm:pt-12 border-t border-brand-border/70">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-center">
              {/* Left Column: Visual EMI Card */}
              <div className="lg:col-span-5">
                <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-brand-border/80 shadow-card bg-slate-900 group">
                  <img
                    src={emiHeroImage}
                    alt="EMI Financial Planning & Calculation"
                    className="w-full h-56 xs:h-64 sm:h-72 lg:h-80 object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-110 contrast-[1.02]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent" />
                  <div className="absolute bottom-4 xs:bottom-5 left-4 xs:left-5 right-4 xs:right-5 space-y-1 xs:space-y-1.5">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-200 text-[10px] font-bold uppercase tracking-wider">
                      <Sparkles className="w-3 h-3 text-teal-300 flex-shrink-0" />
                      <span>Financial Planning Desk</span>
                    </div>
                    <div className="text-white text-sm xs:text-base sm:text-lg font-bold font-heading">
                      Smart EMI Optimization &amp; Prepayment Planning
                    </div>
                    <p className="text-slate-300 text-[11px] xs:text-xs font-sans leading-relaxed">
                      Our institutional advisors help structure step-down EMI models and scheduled prepayments to save up to 40% on total interest outflow.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: 4 Key EMI Repayment Principles */}
              <div className="lg:col-span-7 space-y-4 sm:space-y-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 xs:gap-2 px-2.5 xs:px-3 py-1 rounded-full bg-brand-teal-light text-brand-teal text-[10px] xs:text-xs font-bold uppercase tracking-wider mb-2 font-heading">
                    <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>Lender Economics &amp; Amortization</span>
                  </div>
                  <h3 className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-extrabold text-brand-navy font-heading">
                    Mastering Your Repayment Dynamics
                  </h3>
                  <p className="text-brand-slate text-xs sm:text-sm leading-relaxed mt-1 font-sans">
                    An Equated Monthly Installment (EMI) consists of two shifting components: principal repayment and interest charge. In the initial tenure years, up to 70% of each EMI pays off interest. Here is how institutional borrowers optimize this curve:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                  <div className="p-3.5 xs:p-4 bg-white rounded-xl sm:rounded-2xl border border-brand-border/80 shadow-xs space-y-1.5">
                    <div className="flex items-center gap-2 text-brand-navy font-bold text-xs sm:text-sm font-heading">
                      <BadgePercent className="w-4 h-4 text-brand-teal flex-shrink-0" />
                      <span>EBLR Rate Reset Benefits</span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-brand-slate font-sans leading-relaxed">
                      Floating loans linked to RBI Repo rate adjust automatically. We ensure your lender passes repo rate cuts without administrative delays.
                    </p>
                  </div>

                  <div className="p-3.5 xs:p-4 bg-white rounded-xl sm:rounded-2xl border border-brand-border/80 shadow-xs space-y-1.5">
                    <div className="flex items-center gap-2 text-brand-navy font-bold text-xs sm:text-sm font-heading">
                      <Scale className="w-4 h-4 text-brand-teal flex-shrink-0" />
                      <span>Zero Prepayment Penalty</span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-brand-slate font-sans leading-relaxed">
                      Per RBI mandate, individual floating rate home &amp; mortgage loans attract 0% penalty on partial prepayments or balance transfers.
                    </p>
                  </div>

                  <div className="p-3.5 xs:p-4 bg-white rounded-xl sm:rounded-2xl border border-brand-border/80 shadow-xs space-y-1.5">
                    <div className="flex items-center gap-2 text-brand-navy font-bold text-xs sm:text-sm font-heading">
                      <Wallet className="w-4 h-4 text-brand-teal flex-shrink-0" />
                      <span>Annual 1-EMI Prepayment</span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-brand-slate font-sans leading-relaxed">
                      Paying just one extra EMI each financial year cuts a 20-year home loan duration down to nearly 16 years, saving lakhs in interest.
                    </p>
                  </div>

                  <div className="p-3.5 xs:p-4 bg-white rounded-xl sm:rounded-2xl border border-brand-border/80 shadow-xs space-y-1.5">
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
          <div className="mt-8 sm:mt-12 p-3.5 xs:p-4 sm:px-8 rounded-xl sm:rounded-2xl bg-white border border-brand-border/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 text-xs sm:text-sm text-slate-600">
            <div className="flex flex-wrap items-center gap-3 sm:gap-6 justify-center md:justify-start">
              <div className="flex items-center gap-1.5 xs:gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span className="font-semibold text-brand-navy font-heading text-[11px] xs:text-xs sm:text-sm">RBI EBLR Benchmark Pegged</span>
              </div>
              <div className="flex items-center gap-1.5 xs:gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span className="font-semibold text-brand-navy font-heading text-[11px] xs:text-xs sm:text-sm">Zero Prepayment Penalty on Floating Rates</span>
              </div>
              <div className="flex items-center gap-1.5 xs:gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span className="font-semibold text-brand-navy font-heading text-[11px] xs:text-xs sm:text-sm">Direct Zonal Processing Desk</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 xs:gap-2 text-slate-500 text-[11px] xs:text-xs justify-center mx-auto md:mx-0 flex-shrink-0">
              <ShieldCheck className="w-4 h-4 text-brand-teal flex-shrink-0" />
              <span className="font-sans">Certified Multi-Bank Loan Syndication Desk</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
