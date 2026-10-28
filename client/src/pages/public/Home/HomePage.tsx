import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import {
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Calculator,
  Calendar,
  PhoneCall,
  Clock,
  Award,
  TrendingUp,
  ArrowUpRight,
  Layers,
  FileSearch,
  UserCheck,
  Percent,
  SlidersHorizontal,
  ShieldAlert,
  HelpCircle,
  CheckCircle,
  FileText,
  Smartphone,
  Zap,
  Star,
  MapPin,
  Target,
  FileSpreadsheet,
  ChevronDown,
} from 'lucide-react';
import { Service, Faq, SiteContent } from '../../../types';
import defaultHeroImage from '../../../assets/images/hero-property-finance.jpg';

import sbiLogo from '../../../assets/images/lenders/sbi.svg';
import hdfcLogo from '../../../assets/images/lenders/hdfc.svg';
import iciciLogo from '../../../assets/images/lenders/icici.svg';
import axisLogo from '../../../assets/images/lenders/axis.svg';
import kotakLogo from '../../../assets/images/lenders/kotak.svg';
import bobLogo from '../../../assets/images/lenders/bob.svg';
import bajajLogo from '../../../assets/images/lenders/bajaj.svg';
import tataLogo from '../../../assets/images/lenders/tata.svg';
import pnbLogo from '../../../assets/images/lenders/pnb.svg';
import licLogo from '../../../assets/images/lenders/lic.png';

/* ────────────────────────────────────────────────────────────
   1. ANIMATED HEADLINE COMPONENT
   ──────────────────────────────────────────────────────────── */
const ROTATING_WORDS = [
  'Lowest Rates.',
  'Govt. Subsidy.',
  '7.25% Home Loans.',
  '8.50% LAP.',
  'Bank Takeover.',
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
    const timer = setTimeout(() => setMounted(true), 120);
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
      className="will-change-transform inline-block"
    >
      <h1 className="text-[23px] xs:text-[27px] sm:text-[38px] md:text-[48px] lg:text-[58px] font-extrabold text-white tracking-tight leading-[1.2] sm:leading-[1.15] font-heading drop-shadow-[0_3px_10px_rgba(0,0,0,0.9)] max-w-4xl mx-auto select-none px-2">
        <span
          className="relative inline-block overflow-hidden"
          style={{
            display: 'inline-block',
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(32px)',
            transition: 'opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.25s, transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.25s',
          }}
        >
          <span className="shimmer-headline-text">Strategic Property Loans,</span>
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
        .shimmer-headline-text {
          background: linear-gradient(
            90deg,
            #ffffff 0%,
            #ffffff 35%,
            #bae6fd 50%,
            #ffffff 65%,
            #ffffff 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer-text-flow 5s ease-in-out infinite;
          display: inline-block;
        }

        @keyframes shimmer-text-flow {
          0%, 15% { background-position: 200% center; }
          45%, 100% { background-position: -200% center; }
        }

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
   2. HERO SECTION
   ──────────────────────────────────────────────────────────── */
interface HeroProps {
  content?: SiteContent | null;
}

const Hero: React.FC<HeroProps> = ({ content }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(timer);
  }, []);

  const heroBgImage =
    content?.heroImageUrl && !content.heroImageUrl.includes('photo-1600585154340')
      ? content.heroImageUrl
      : defaultHeroImage;

  return (
    <section
      id="hero"
      className="relative min-h-[620px] lg:min-h-[700px] flex items-center justify-center bg-slate-950 overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        <img
          src={heroBgImage}
          alt="Institutional Property Finance Architecture"
          className="w-full h-full object-cover object-center scale-[1.01] brightness-[0.80] transform motion-safe:transition-transform motion-safe:duration-1000"
          loading="eager"
        />
        <div className="absolute inset-0 bg-black/28" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/70" />
      </div>

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-10 xl:px-12 pt-12 pb-24 sm:pt-16 sm:pb-28 lg:pt-16 lg:pb-32">
        <div className="max-w-5xl mx-auto text-center space-y-6 sm:space-y-7">
          <div
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(-14px)',
              transition: 'opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1) 0.1s, transform 0.75s cubic-bezier(0.16, 1, 0.3, 1) 0.1s',
            }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-950/70 border border-white/20 text-slate-100 text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-[#20B2AA] animate-pulse"></span>
            <span>{content?.heroEyebrow || 'Institutional Property Finance Advisory • 40+ Partner Lenders'}</span>
          </div>

          <AnimatedHeadline />

          <p
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(24px)',
              transition: 'opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.55s, transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.55s',
            }}
            className="text-sm xs:text-base sm:text-lg lg:text-[19px] text-white/95 font-medium leading-relaxed max-w-3xl mx-auto drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)] px-2"
          >
            {content?.heroSubtitle ||
              'Unlock institutional funding for high-value residential, commercial, and industrial properties. We partner with 40+ leading PSU & private banks and NBFCs across India to secure lowest benchmark interest rates, maximized borrowing eligibility, and zero advance fees.'}
          </p>

          <div
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(24px)',
              transition: 'opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.70s, transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.70s',
            }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 pt-3 sm:pt-4 max-w-md sm:max-w-none mx-auto"
          >
            <Link
              to="/enquire"
              className="hero-btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 sm:px-9 py-3.5 sm:py-4 text-xs xs:text-sm sm:text-base font-bold text-white text-center cursor-pointer tracking-wide"
            >
              <span>{content?.heroCtaText || 'Discuss Your Loan'}</span>
              <ArrowRight className="w-4.5 h-4.5 hero-btn-arrow" />
            </Link>

            <Link
              to="/calculator"
              className="hero-btn-secondary w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 sm:px-8.5 py-3.5 sm:py-4 text-xs xs:text-sm sm:text-base font-bold text-white text-center cursor-pointer tracking-wide"
            >
              <Calculator className="w-4.5 h-4.5 text-teal-300 hero-calc-icon" />
              <span>Simulate EMI &amp; FOIR</span>
            </Link>

            <Link
              to="/services/home-loans"
              className="hero-btn-tertiary w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 sm:py-4 text-xs xs:text-sm sm:text-base font-semibold text-slate-200 hover:text-white transition-all text-center group cursor-pointer hover:-translate-y-0.5"
            >
              <span>Explore All Solutions</span>
              <span className="hero-explore-arrow">→</span>
            </Link>
          </div>

          <div
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(24px)',
              transition: 'opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.85s, transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.85s',
            }}
            className="mt-6 sm:mt-8 pt-3.5 pb-3.5 px-4 sm:px-8 rounded-xl bg-slate-950/65 backdrop-blur-md border border-slate-800/80 shadow-lg flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 text-xs sm:text-sm text-slate-200"
          >
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 justify-center sm:justify-start">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#20B2AA] flex-shrink-0" />
                <span className="font-semibold text-white">Zero Advance Fees</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#20B2AA] flex-shrink-0" />
                <span className="font-semibold text-white">40+ Partner Lenders</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#20B2AA] flex-shrink-0" />
                <span className="font-semibold text-white">24–48h Rapid Sanction</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-300 text-xs justify-center mx-auto sm:mx-0">
              <ShieldCheck className="w-4 h-4 text-[#20B2AA]" />
              <span>Institutional Banking Partners: <strong className="text-white">SBI • HDFC • ICICI • AXIS • KOTAK</strong></span>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .hero-btn-primary {
          position: relative;
          overflow: hidden;
          border-radius: 9999px;
          background: linear-gradient(135deg, #187C78 0%, #126763 50%, #0e524f 100%);
          border: 1px solid rgba(255, 255, 255, 0.22);
          border-top-color: rgba(255, 255, 255, 0.55);
          box-shadow: 
            0 10px 25px -4px rgba(24, 124, 120, 0.55),
            0 4px 10px rgba(0, 0, 0, 0.35),
            inset 0 1.5px 0 rgba(255, 255, 255, 0.45);
          transition: transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.28s ease, background 0.28s ease, border-color 0.28s ease;
        }

        .hero-btn-primary::before {
          content: '';
          position: absolute;
          top: 0;
          left: -120%;
          width: 60%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.4),
            transparent
          );
          transform: skewX(-20deg);
          transition: left 0.75s cubic-bezier(0.19, 1, 0.22, 1);
          pointer-events: none;
        }

        .hero-btn-primary:hover::before {
          left: 180%;
        }

        .hero-btn-primary:hover {
          transform: translateY(-3px) scale(1.02);
          background: linear-gradient(135deg, #1ea39e 0%, #187C78 50%, #126763 100%);
          border-color: rgba(255, 255, 255, 0.4);
          border-top-color: rgba(255, 255, 255, 0.75);
          box-shadow: 
            0 16px 38px -4px rgba(24, 124, 120, 0.75),
            0 0 24px rgba(45, 212, 191, 0.45),
            inset 0 1.5px 0 rgba(255, 255, 255, 0.6);
        }

        .hero-btn-primary:active {
          transform: translateY(-0.5px) scale(0.99);
        }

        .hero-btn-primary .hero-btn-arrow {
          transition: transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .hero-btn-primary:hover .hero-btn-arrow {
          transform: translateX(4px);
        }

        .hero-btn-secondary {
          position: relative;
          overflow: hidden;
          border-radius: 9999px;
          background: rgba(15, 23, 42, 0.65);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.24);
          border-top-color: rgba(255, 255, 255, 0.55);
          box-shadow: 
            0 10px 25px -4px rgba(0, 0, 0, 0.45),
            inset 0 1.5px 0 rgba(255, 255, 255, 0.35);
          transition: all 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .hero-btn-secondary:hover {
          transform: translateY(-3px) scale(1.02);
          background: rgba(15, 23, 42, 0.88);
          border-color: rgba(45, 212, 191, 0.65);
          border-top-color: rgba(255, 255, 255, 0.8);
          box-shadow: 
            0 16px 36px -4px rgba(24, 124, 120, 0.45),
            0 0 20px rgba(56, 189, 248, 0.3),
            inset 0 1.5px 0 rgba(255, 255, 255, 0.55);
        }

        .hero-btn-secondary:active {
          transform: translateY(-0.5px) scale(0.99);
        }

        .hero-btn-secondary .hero-calc-icon {
          transition: transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.25s ease;
        }

        .hero-btn-secondary:hover .hero-calc-icon {
          transform: scale(1.15) rotate(-6deg);
          color: #38bdf8 !important;
        }

        .hero-btn-tertiary {
          position: relative;
          transition: color 0.25s ease, transform 0.25s ease;
        }

        .hero-btn-tertiary::after {
          content: '';
          position: absolute;
          bottom: 8px;
          left: 24px;
          right: 42px;
          height: 1.5px;
          background: #38bdf8;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .hero-btn-tertiary:hover::after {
          transform: scaleX(1);
        }

        .hero-btn-tertiary .hero-explore-arrow {
          transition: transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .hero-btn-tertiary:hover .hero-explore-arrow {
          transform: translateX(5px);
        }
      `}</style>
    </section>
  );
};

/* ────────────────────────────────────────────────────────────
   3. STATS BAR SECTION
   ──────────────────────────────────────────────────────────── */
const StatsBar: React.FC = () => {
  const stats = [
    {
      value: 'From 7.25%*',
      label: 'Home Loans & Subsidy',
      sub: 'Self-construction, plots & tiled houses',
      icon: <TrendingUp className="w-5 h-5 text-brand-teal" />,
    },
    {
      value: 'From 8.50%*',
      label: 'Mortgage Loans (LAP)',
      sub: 'Concrete, tiled house, empty land & commercial',
      icon: <Award className="w-5 h-5 text-brand-teal" />,
    },
    {
      value: 'Govt. & Private',
      label: 'Banking Network',
      sub: 'Leading PSU & commercial private banks',
      icon: <Clock className="w-5 h-5 text-brand-teal" />,
    },
    {
      value: 'Low ROI Switch',
      label: 'Bank Takeover Desk',
      sub: 'Private to Govt. bank lowest rate transfer',
      icon: <ShieldCheck className="w-5 h-5 text-brand-teal" />,
    },
  ];

  return (
    <section className="relative z-20 -mt-6 sm:-mt-8 lg:-mt-12 px-3 sm:px-4 pb-6 sm:pb-8 lg:pb-10">
      <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-brand-border/80 shadow-xl shadow-brand-navy/10">
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {stats.map((s, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 p-4 rounded-xl bg-brand-ivory/40 border border-brand-border/60 hover:bg-white hover:border-brand-teal/40 hover:shadow-subtle transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-lg bg-brand-teal-light text-brand-teal flex items-center justify-center shrink-0 mt-0.5">
                  {s.icon}
                </div>
                <div>
                  <span className="text-xl xs:text-2xl sm:text-3xl font-extrabold tracking-tight text-brand-navy block font-heading">
                    {s.value}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-brand-navy block mt-0.5">
                    {s.label}
                  </span>
                  <span className="text-[11px] text-brand-slate block mt-0.5 leading-snug">
                    {s.sub}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ────────────────────────────────────────────────────────────
   4. LENDER PARTNERS SECTION
   ──────────────────────────────────────────────────────────── */
interface Partner {
  id: string;
  name: string;
  short: string;
  category: string;
  type: string;
  ratesFrom: string;
  badge: string;
  accentColor: string;
  logoUrl: string;
}

const LenderCard: React.FC<{
  partner: Partner;
  ariaHidden?: boolean;
  onHoverChange: (isHovered: boolean) => void;
}> = ({ partner: p, ariaHidden, onHoverChange }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      to={`/enquire?lender=${encodeURIComponent(p.name)}`}
      aria-hidden={ariaHidden}
      tabIndex={ariaHidden ? -1 : undefined}
      onMouseEnter={() => {
        setIsHovered(true);
        onHoverChange(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        onHoverChange(false);
      }}
      onMouseDown={() => onHoverChange(true)}
      onMouseUp={() => onHoverChange(false)}
      onTouchStart={() => onHoverChange(true)}
      onTouchEnd={() => onHoverChange(false)}
      className="group relative bg-white p-4.5 sm:p-6 rounded-2xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 shrink-0 w-[270px] xs:w-[300px] sm:w-[350px] lg:w-[370px] overflow-hidden no-underline cursor-pointer block"
      style={{
        border: isHovered
          ? `2px solid ${p.accentColor}`
          : '2px solid rgba(229, 231, 235, 0.85)',
        boxShadow: isHovered
          ? `0 18px 38px -6px ${p.accentColor}35, 0 8px 18px rgba(24, 50, 71, 0.08)`
          : '0 3px 14px rgba(24, 50, 71, 0.05)',
      }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
        style={{
          background: `radial-gradient(circle at top right, ${p.accentColor}14, transparent 65%)`,
        }}
      />

      <div>
        <div className="flex items-center justify-between gap-3 mb-4.5 h-12 relative z-10">
          <div className="flex items-center h-full max-w-[170px]">
            <img
              src={p.logoUrl}
              alt={`${p.name} official logo`}
              className="h-8.5 max-h-10 w-auto max-w-[160px] object-contain object-left transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span
              className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full transition-colors"
              style={{
                backgroundColor: isHovered ? `${p.accentColor}15` : '#f1f5f9',
                color: isHovered ? p.accentColor : '#475569',
              }}
            >
              {p.short}
            </span>
            <div
              className="w-6.5 h-6.5 rounded-full flex items-center justify-center transition-all"
              style={{
                backgroundColor: isHovered ? `${p.accentColor}15` : 'transparent',
                color: isHovered ? p.accentColor : '#94a3b8',
              }}
            >
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <h3
            className="font-bold text-[15px] sm:text-base tracking-tight leading-snug transition-colors font-heading truncate"
            style={{ color: isHovered ? p.accentColor : '#183247' }}
          >
            {p.name}
          </h3>
          <span className="text-xs text-brand-slate block mt-0.5 font-medium truncate">
            {p.type}
          </span>
        </div>

        <div
          className="mt-4 rounded-xl px-3.5 py-2.5 border flex items-center justify-between relative z-10 transition-colors"
          style={{
            backgroundColor: isHovered ? '#ffffff' : '#f8f8f4',
            borderColor: isHovered ? `${p.accentColor}40` : '#e5e7eb',
          }}
        >
          <span className="text-xs text-brand-slate font-medium">Home Loan</span>
          <span
            className="text-sm font-extrabold font-heading transition-colors"
            style={{ color: isHovered ? p.accentColor : '#183247' }}
          >
            {p.ratesFrom}*
          </span>
        </div>
      </div>

      <div className="mt-4.5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs relative z-10">
        <span className="inline-flex items-center gap-1.5 text-emerald-800 font-semibold bg-emerald-50 px-3 py-1.5 rounded-lg text-[11px] border border-emerald-100/80 tracking-tight truncate">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="truncate">{p.badge}</span>
        </span>
      </div>
    </Link>
  );
};

const LenderPartners: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  const partners: Partner[] = [
    {
      id: 'sbi',
      name: 'State Bank of India',
      short: 'SBI',
      category: 'psu',
      type: 'Public Sector Bank',
      ratesFrom: '7.25%',
      badge: 'Lowest Rate with Subsidy',
      accentColor: '#0072BB',
      logoUrl: sbiLogo,
    },
    {
      id: 'hdfc',
      name: 'HDFC Bank',
      short: 'HDFC',
      category: 'private',
      type: 'Premier Private Bank',
      ratesFrom: '8.55%',
      badge: 'Fast Digital Sanction',
      accentColor: '#004C8F',
      logoUrl: hdfcLogo,
    },
    {
      id: 'icici',
      name: 'ICICI Bank',
      short: 'ICICI',
      category: 'private',
      type: 'Premier Private Bank',
      ratesFrom: '8.60%',
      badge: 'High LTV Flexibility',
      accentColor: '#F37021',
      logoUrl: iciciLogo,
    },
    {
      id: 'axis',
      name: 'Axis Bank',
      short: 'AXIS',
      category: 'private',
      type: 'Private Bank',
      ratesFrom: '8.65%',
      badge: 'Balance Transfer Perks',
      accentColor: '#97144D',
      logoUrl: axisLogo,
    },
    {
      id: 'kotak',
      name: 'Kotak Mahindra Bank',
      short: 'KOTAK',
      category: 'private',
      type: 'Private Bank',
      ratesFrom: '8.60%',
      badge: 'Custom LAP Structuring',
      accentColor: '#ED1C24',
      logoUrl: kotakLogo,
    },
    {
      id: 'bob',
      name: 'Bank of Baroda',
      short: 'BOB',
      category: 'psu',
      type: 'Public Sector Bank',
      ratesFrom: '8.45%',
      badge: 'Low Processing Fees',
      accentColor: '#F26522',
      logoUrl: bobLogo,
    },
    {
      id: 'bajaj',
      name: 'Bajaj Finserv',
      short: 'BAJAJ',
      category: 'nbfc',
      type: 'Regulated NBFC',
      ratesFrom: '9.25%',
      badge: 'High-Ticket Flexibility',
      accentColor: '#004B8D',
      logoUrl: bajajLogo,
    },
    {
      id: 'tata',
      name: 'Tata Capital',
      short: 'TATA',
      category: 'nbfc',
      type: 'Corporate NBFC',
      ratesFrom: '9.30%',
      badge: 'MSME Working Capital',
      accentColor: '#1A5BA8',
      logoUrl: tataLogo,
    },
    {
      id: 'pnb',
      name: 'PNB Housing Finance',
      short: 'PNB HFL',
      category: 'nbfc',
      type: 'Housing Finance Co.',
      ratesFrom: '8.65%',
      badge: 'Self-Construction Expert',
      accentColor: '#A20032',
      logoUrl: pnbLogo,
    },
    {
      id: 'lic',
      name: 'LIC Housing Finance',
      short: 'LIC HFL',
      category: 'nbfc',
      type: 'Housing Finance Co.',
      ratesFrom: '8.50%',
      badge: 'Long 30-Yr Tenures',
      accentColor: '#00488F',
      logoUrl: licLogo,
    },
  ];

  const row1Partners = partners.slice(0, 5);
  const row2Partners = partners.slice(5);

  return (
    <section className="pt-12 sm:pt-16 pb-0 bg-transparent overflow-hidden">
      <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-brand-teal-light text-brand-teal text-xs font-bold tracking-wider uppercase mb-3">
            <Award className="w-3.5 h-3.5" />
            <span>Multi-Lender Access</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-navy tracking-tight font-heading">
            Direct Channel Advisory with India’s Leading Lenders
          </h2>
          <p className="mt-2.5 text-sm sm:text-base text-brand-slate leading-relaxed">
            Direct channel access to 40+ premier banks and housing finance institutions to secure optimal borrowing terms.
          </p>
        </div>
      </div>

      {/* ─── 1. TOP SLIDING BANK CARDS MARQUEE (Full Width - Forward Stream) ─── */}
      <div className="relative w-full overflow-hidden mb-6 sm:mb-10">
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-32 bg-gradient-to-r from-brand-bg to-transparent z-20" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-32 bg-gradient-to-l from-brand-bg to-transparent z-20" />

        <div
          className="animate-continuous-scroll flex items-stretch gap-5 sm:gap-6 py-2 px-4 sm:px-6 select-none"
          style={{
            animationPlayState: isHovered ? 'paused' : 'running',
          }}
        >
          {row1Partners.map((p, idx) => (
            <LenderCard
              key={`p1-${p.id}-${idx}`}
              partner={p}
              onHoverChange={setIsHovered}
            />
          ))}
          {row1Partners.map((p, idx) => (
            <LenderCard
              key={`p1-dup-${p.id}-${idx}`}
              partner={p}
              ariaHidden
              onHoverChange={setIsHovered}
            />
          ))}
        </div>
      </div>

      {/* ─── 2. MIDDLE 4-PILLAR FEATURES CARD (Compact & Sleek) ─── */}
      <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="bg-white rounded-2xl border border-brand-border/80 p-4 sm:p-6 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-4.5">
            <div className="group flex flex-col justify-between p-4 rounded-xl bg-slate-50/70 border border-slate-100 hover:bg-white hover:border-teal-500/40 hover:shadow-sm transition-all duration-300">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="min-w-[40px] px-2.5 h-8 rounded-lg bg-gradient-to-br from-teal-50 to-emerald-100/70 text-brand-teal border border-teal-200/70 inline-flex items-center justify-center font-bold text-xs font-heading shadow-xs transition-all duration-300 ease-out group-hover:scale-105 group-hover:bg-gradient-to-br group-hover:from-brand-teal group-hover:to-teal-800 group-hover:text-white group-hover:border-brand-teal whitespace-nowrap">
                    0%
                  </div>
                  <div className="w-7 h-7 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-brand-teal group-hover:bg-teal-50 group-hover:border-teal-200 transition-all duration-300">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                </div>
                <h4 className="font-bold text-sm text-brand-navy font-heading group-hover:text-brand-teal transition-colors duration-200 mb-1.5">
                  Zero Upfront Fees
                </h4>
                <p className="text-[11px] sm:text-xs text-brand-slate leading-relaxed group-hover:text-slate-700 transition-colors duration-200">
                  We never charge advance advisory fees. All processing fees are paid directly to the lending institution.
                </p>
              </div>
              <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold text-brand-teal">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-teal animate-pulse shrink-0" />
                <span className="whitespace-nowrap">100% Direct Bank Billing</span>
              </div>
            </div>

            <div className="group flex flex-col justify-between p-4 rounded-xl bg-slate-50/70 border border-slate-100 hover:bg-white hover:border-blue-500/40 hover:shadow-sm transition-all duration-300">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="min-w-[46px] px-2.5 h-8 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-100/70 text-blue-700 border border-blue-200/70 inline-flex items-center justify-center font-bold text-xs font-heading shadow-xs transition-all duration-300 ease-out group-hover:scale-105 group-hover:bg-gradient-to-br group-hover:from-blue-600 group-hover:to-indigo-800 group-hover:text-white group-hover:border-blue-600 whitespace-nowrap">
                    1-App
                  </div>
                  <div className="w-7 h-7 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 group-hover:border-blue-200 transition-all duration-300">
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                </div>
                <h4 className="font-bold text-sm text-brand-navy font-heading group-hover:text-blue-700 transition-colors duration-200 mb-1.5">
                  Single Application
                </h4>
                <p className="text-[11px] sm:text-xs text-brand-slate leading-relaxed group-hover:text-slate-700 transition-colors duration-200">
                  One complete document dossier evaluated across multiple banks without repeated CIBIL bureau damage.
                </p>
              </div>
              <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold text-blue-600">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse shrink-0" />
                <span className="whitespace-nowrap">CIBIL Score Shielded</span>
              </div>
            </div>

            <div className="group flex flex-col justify-between p-4 rounded-xl bg-slate-50/70 border border-slate-100 hover:bg-white hover:border-amber-500/40 hover:shadow-sm transition-all duration-300">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="min-w-[46px] px-2.5 h-8 rounded-lg bg-gradient-to-br from-amber-50 to-orange-100/70 text-amber-700 border border-amber-200/70 inline-flex items-center justify-center font-bold text-xs font-heading shadow-xs transition-all duration-300 ease-out group-hover:scale-105 group-hover:bg-gradient-to-br group-hover:from-amber-600 group-hover:to-orange-700 group-hover:text-white group-hover:border-amber-600 whitespace-nowrap">
                    30-Yr
                  </div>
                  <div className="w-7 h-7 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-amber-600 group-hover:bg-amber-50 group-hover:border-amber-200 transition-all duration-300">
                    <FileSearch className="w-3.5 h-3.5" />
                  </div>
                </div>
                <h4 className="font-bold text-sm text-brand-navy font-heading group-hover:text-amber-700 transition-colors duration-200 mb-1.5">
                  Legal &amp; Technical Audit
                </h4>
                <p className="text-[11px] sm:text-xs text-brand-slate leading-relaxed group-hover:text-slate-700 transition-colors duration-200">
                  Pre-login title search and plan compliance verification to prevent rejection during legal clearance.
                </p>
              </div>
              <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold text-amber-600">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse shrink-0" />
                <span className="whitespace-nowrap">Pre-Login Title Search</span>
              </div>
            </div>

            <div className="group flex flex-col justify-between p-4 rounded-xl bg-slate-50/70 border border-slate-100 hover:bg-white hover:border-teal-500/40 hover:shadow-sm transition-all duration-300">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="min-w-[40px] px-2.5 h-8 rounded-lg bg-gradient-to-br from-teal-50 to-emerald-100/70 text-brand-teal border border-teal-200/70 inline-flex items-center justify-center font-bold text-xs font-heading shadow-xs transition-all duration-300 ease-out group-hover:scale-105 group-hover:bg-gradient-to-br group-hover:from-brand-teal group-hover:to-teal-800 group-hover:text-white group-hover:border-brand-teal whitespace-nowrap">
                    1:1
                  </div>
                  <div className="w-7 h-7 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-brand-teal group-hover:bg-teal-50 group-hover:border-teal-200 transition-all duration-300">
                    <UserCheck className="w-3.5 h-3.5" />
                  </div>
                </div>
                <h4 className="font-bold text-sm text-brand-navy font-heading group-hover:text-brand-teal transition-colors duration-200 mb-1.5">
                  Dedicated Case Officer
                </h4>
                <p className="text-[11px] sm:text-xs text-brand-slate leading-relaxed group-hover:text-slate-700 transition-colors duration-200">
                  Direct phone &amp; in-person coordination from application login until loan agreement execution.
                </p>
              </div>
              <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold text-brand-teal">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-teal animate-pulse shrink-0" />
                <span className="whitespace-nowrap">Single Point of Contact</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 3. BOTTOM SLIDING BANK CARDS MARQUEE (Full Width - Reverse Stream) ─── */}
      <div className="relative w-full overflow-hidden mt-6 sm:mt-10">
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-32 bg-gradient-to-r from-brand-bg to-transparent z-20" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-32 bg-gradient-to-l from-brand-bg to-transparent z-20" />

        <div
          className="animate-continuous-scroll-reverse flex items-stretch gap-5 sm:gap-6 py-2 px-4 sm:px-6 select-none"
          style={{
            animationPlayState: isHovered ? 'paused' : 'running',
          }}
        >
          {row2Partners.map((p, idx) => (
            <LenderCard
              key={`p2-${p.id}-${idx}`}
              partner={p}
              onHoverChange={setIsHovered}
            />
          ))}
          {row2Partners.map((p, idx) => (
            <LenderCard
              key={`p2-dup-${p.id}-${idx}`}
              partner={p}
              ariaHidden
              onHoverChange={setIsHovered}
            />
          ))}
        </div>
      </div>
      <style>{`
        @keyframes continuousScroll {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }

        @keyframes continuousScrollReverse {
          0% { transform: translate3d(-50%, 0, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }

        .animate-continuous-scroll {
          display: flex;
          width: max-content;
          animation: continuousScroll 48s linear infinite;
          will-change: transform;
        }

        .animate-continuous-scroll-reverse {
          display: flex;
          width: max-content;
          animation: continuousScrollReverse 48s linear infinite;
          will-change: transform;
        }

        .animate-continuous-scroll:hover,
        .animate-continuous-scroll:active,
        .animate-continuous-scroll:focus-within,
        .animate-continuous-scroll-reverse:hover,
        .animate-continuous-scroll-reverse:active,
        .animate-continuous-scroll-reverse:focus-within {
          animation-play-state: paused !important;
        }
      `}</style>
    </section>
  );
};

/* ────────────────────────────────────────────────────────────
   5. RATE COMPARISON MATRIX SECTION
   ──────────────────────────────────────────────────────────── */
interface LenderRateRow {
  lender: string;
  category: 'Public Bank' | 'Private Bank' | 'HFC / NBFC';
  homeLoanRate: string;
  lapRate: string;
  maxTenureHL: string;
  maxTenureLAP: string;
  maxLtv: string;
  processingFee: string;
}

const RateComparisonMatrix: React.FC = () => {
  const [filterCategory, setFilterCategory] = useState<'All' | 'Public Bank' | 'Private Bank' | 'HFC / NBFC'>('All');
  const [activeTab, setActiveTab] = useState<'home' | 'lap'>('home');

  const rateData: LenderRateRow[] = [
    {
      lender: 'State Bank of India (SBI)',
      category: 'Public Bank',
      homeLoanRate: '7.25% – 8.75%*',
      lapRate: '8.50% – 9.75%*',
      maxTenureHL: '30 Years',
      maxTenureLAP: '15 Years',
      maxLtv: 'Up to 85% (HL) / 70% (LAP)',
      processingFee: '0.35% (Special Concession for Govt Subsidy)',
    },
    {
      lender: 'Punjab National Bank (PNB)',
      category: 'Public Bank',
      homeLoanRate: '7.25% – 8.80%*',
      lapRate: '8.50% – 9.85%*',
      maxTenureHL: '30 Years',
      maxTenureLAP: '15 Years',
      maxLtv: 'Up to 85% (HL) / 65% (LAP)',
      processingFee: '0.25% to 0.40%',
    },
    {
      lender: 'Bank of Baroda',
      category: 'Public Bank',
      homeLoanRate: '8.40% – 8.85%*',
      lapRate: '8.75% – 10.15%*',
      maxTenureHL: '30 Years',
      maxTenureLAP: '15 Years',
      maxLtv: 'Up to 80% (HL) / 65% (LAP)',
      processingFee: '0.25% (Min ₹8,500)',
    },
    {
      lender: 'Canara Bank',
      category: 'Public Bank',
      homeLoanRate: '8.40% – 8.90%*',
      lapRate: '8.75% – 10.25%*',
      maxTenureHL: '30 Years',
      maxTenureLAP: '15 Years',
      maxLtv: 'Up to 80% (HL) / 65% (LAP)',
      processingFee: '0.50% (Max ₹10,000)',
    },
    {
      lender: 'HDFC Bank',
      category: 'Private Bank',
      homeLoanRate: '8.70% – 9.40%*',
      lapRate: '9.00% – 10.25%*',
      maxTenureHL: '30 Years',
      maxTenureLAP: '15 Years',
      maxLtv: 'Up to 80% (HL) / 70% (LAP)',
      processingFee: '0.50% or ₹3,000',
    },
    {
      lender: 'ICICI Bank',
      category: 'Private Bank',
      homeLoanRate: '8.75% – 9.50%*',
      lapRate: '9.10% – 10.50%*',
      maxTenureHL: '30 Years',
      maxTenureLAP: '15 Years',
      maxLtv: 'Up to 80% (HL) / 70% (LAP)',
      processingFee: '0.50% to 1.00%',
    },
    {
      lender: 'Axis Bank',
      category: 'Private Bank',
      homeLoanRate: '8.75% – 9.45%*',
      lapRate: '9.25% – 10.75%*',
      maxTenureHL: '30 Years',
      maxTenureLAP: '20 Years',
      maxLtv: 'Up to 80% (HL) / 65% (LAP)',
      processingFee: 'Up to 1.00%',
    },
    {
      lender: 'Kotak Mahindra Bank',
      category: 'Private Bank',
      homeLoanRate: '8.70% – 9.40%*',
      lapRate: '9.15% – 10.45%*',
      maxTenureHL: '25 Years',
      maxTenureLAP: '15 Years',
      maxLtv: 'Up to 80% (HL) / 65% (LAP)',
      processingFee: '0.50% + GST',
    },
    {
      lender: 'LIC Housing Finance',
      category: 'HFC / NBFC',
      homeLoanRate: '8.50% – 9.40%*',
      lapRate: '9.25% – 10.50%*',
      maxTenureHL: '30 Years',
      maxTenureLAP: '15 Years',
      maxLtv: 'Up to 85% (HL) / 70% (LAP)',
      processingFee: '0.25% to 0.50%',
    },
    {
      lender: 'Bajaj Finserv',
      category: 'HFC / NBFC',
      homeLoanRate: '8.60% – 9.95%*',
      lapRate: '9.50% – 11.25%*',
      maxTenureHL: '30 Years',
      maxTenureLAP: '18 Years',
      maxLtv: 'Up to 75% (HL) / 75% (LAP)',
      processingFee: 'Up to 1.25% + GST',
    },
  ];

  const filtered = filterCategory === 'All'
    ? rateData
    : rateData.filter((r) => r.category === filterCategory);

  return (
    <section className="pt-12 sm:pt-16 pb-0 bg-[#f8f8f4]">
      <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-brand-teal-light text-brand-teal text-xs font-bold tracking-wider uppercase mb-3">
              <Percent className="w-3.5 h-3.5" />
              <span>Multi-Lender Comparison</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight">
              Indicative Interest Rate &amp; Terms Matrix
            </h2>
            <p className="mt-2 text-sm sm:text-base text-brand-slate">
              Compare current floating benchmark rates across prominent public banks, private lenders, and housing finance companies.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <div className="bg-white p-1 rounded-xl border border-brand-border flex items-center shadow-2xs">
              <button
                onClick={() => setActiveTab('home')}
                className={`flex-1 sm:flex-initial text-center px-3 sm:px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                  activeTab === 'home'
                    ? 'bg-brand-teal text-white shadow-xs'
                    : 'text-brand-slate hover:text-brand-navy'
                }`}
              >
                Home Loans
              </button>
              <button
                onClick={() => setActiveTab('lap')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'lap'
                    ? 'bg-brand-teal text-white shadow-xs'
                    : 'text-brand-slate hover:text-brand-navy'
                }`}
              >
                Loan Against Property (LAP)
              </button>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 sm:pb-0 text-xs w-full sm:w-auto">
              <span className="text-brand-slate font-medium mr-1 flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5" /> Filter:
              </span>
              {(['All', 'Public Bank', 'Private Bank', 'HFC / NBFC'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3 py-1.5 rounded-full font-medium transition-colors ${
                    filterCategory === cat
                      ? 'bg-brand-navy text-white shadow-2xs'
                      : 'bg-white border border-brand-border text-brand-slate hover:bg-gray-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile View: Responsive Cards (< 768px) */}
        <div className="md:hidden space-y-3">
          {filtered.map((row, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-brand-border/80 p-4 shadow-sm hover:shadow-md transition-shadow space-y-3"
            >
              <div className="flex items-start justify-between gap-2 border-b border-gray-100 pb-2.5">
                <div>
                  <h3 className="font-bold text-sm text-brand-navy font-heading">
                    {row.lender}
                  </h3>
                  <span
                    className={`inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded ${
                      row.category === 'Public Bank'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : row.category === 'Private Bank'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-purple-50 text-purple-700 border border-purple-200'
                    }`}
                  >
                    {row.category}
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] uppercase font-bold text-brand-slate block">
                    {activeTab === 'home' ? 'Home Loan Rate' : 'LAP Rate'}
                  </span>
                  <span className="text-base font-extrabold text-brand-teal font-heading block">
                    {activeTab === 'home' ? row.homeLoanRate : row.lapRate}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 text-xs">
                <div>
                  <span className="text-[10px] text-brand-slate block">Max Tenure</span>
                  <span className="font-semibold text-brand-navy block text-[11px] mt-0.5">
                    {activeTab === 'home' ? row.maxTenureHL : row.maxTenureLAP}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-brand-slate block">Indicative LTV</span>
                  <span className="font-semibold text-brand-navy block text-[11px] mt-0.5 truncate" title={row.maxLtv}>
                    {row.maxLtv.split('(')[0].trim()}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-brand-slate block">Est. Fee</span>
                  <span className="font-semibold text-brand-navy block text-[11px] mt-0.5 truncate" title={row.processingFee}>
                    {row.processingFee.split('(')[0].trim()}
                  </span>
                </div>
              </div>

              <Link
                to={`/enquire?lender=${encodeURIComponent(row.lender)}`}
                className="w-full py-2.5 px-3 rounded-corporate bg-brand-teal-light text-brand-teal hover:bg-brand-teal hover:text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Check Suitability &amp; Eligibility</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>

        {/* Desktop & Tablet Table (md+) */}
        <div className="hidden md:block bg-white rounded-2xl border border-brand-border overflow-x-auto shadow-card">
          <table className="w-full min-w-[700px] text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-brand-navy text-white text-[11px] uppercase tracking-wider font-semibold">
                <th className="py-4 px-5">Lender Name &amp; Category</th>
                <th className="py-4 px-5">
                  {activeTab === 'home' ? 'Home Loan Rate (p.a.)*' : 'LAP Rate (p.a.)*'}
                </th>
                <th className="py-4 px-5">Max Tenure</th>
                <th className="py-4 px-5">Indicative LTV</th>
                <th className="py-4 px-5">Est. Processing Fee</th>
                <th className="py-4 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-brand-navy">
              {filtered.map((row, idx) => (
                <tr key={idx} className="hover:bg-brand-ivory/50 transition-colors">
                  <td className="py-4 px-5">
                    <span className="font-bold text-sm block">{row.lender}</span>
                    <span
                      className={`inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded ${
                        row.category === 'Public Bank'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : row.category === 'Private Bank'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-purple-50 text-purple-700 border border-purple-200'
                      }`}
                    >
                      {row.category}
                    </span>
                  </td>
                  <td className="py-4 px-5 font-extrabold text-brand-teal text-sm sm:text-base font-heading">
                    {activeTab === 'home' ? row.homeLoanRate : row.lapRate}
                  </td>
                  <td className="py-4 px-5 text-brand-slate font-medium">
                    {activeTab === 'home' ? row.maxTenureHL : row.maxTenureLAP}
                  </td>
                  <td className="py-4 px-5 text-brand-slate font-medium">
                    {row.maxLtv}
                  </td>
                  <td className="py-4 px-5 text-brand-slate text-xs">
                    {row.processingFee}
                  </td>
                  <td className="py-4 px-5 text-right">
                    <Link
                      to={`/enquire?lender=${encodeURIComponent(row.lender)}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-teal-light text-brand-teal font-semibold text-xs hover:bg-brand-teal hover:text-white transition-colors"
                    >
                      <span>Check Suitability</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 p-4 rounded-xl bg-brand-ivory border border-brand-border/80 flex items-start gap-3 text-xs text-brand-slate">
          <ShieldAlert className="w-4 h-4 text-brand-teal flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed text-[11px] sm:text-xs">
            <strong>Advisory Notice &amp; Compliance:</strong> Prime Associate Loans is an authorized loan advisor and corporate channel liaison. Rates presented are indicative published floating rates linked to EBLR / Repo Rate as of Q4 2024. Final interest rate, sanction amount, and legal eligibility depend strictly on lender underwriting policy, CIBIL score (&gt;750 preferred), title clearance, and property valuation. No guarantee of interest rate or approval is implied.
          </p>
        </div>
      </div>
    </section>
  );
};

/* ────────────────────────────────────────────────────────────
   6. HOW IT WORKS SECTION
   ──────────────────────────────────────────────────────────── */
const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: '3-Minute Digital Application',
      desc: 'Submit your contact details, funding amount, and property context via our simple online interface. Zero paperwork to get started.',
      tag: 'Instant Pre-Check',
      icon: <Smartphone className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />,
    },
    {
      number: '02',
      title: 'Digital KYC & Income Audit',
      desc: 'Our automated surrogate checks assess salary/ITR banking statements and calculate your precise maximum permissible loan headroom.',
      tag: 'Paperless Review',
      icon: <FileText className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />,
    },
    {
      number: '03',
      title: 'Legal & Title Scrutiny',
      desc: 'Certified panel advocates conduct an unhindered 30-year parent deed and municipal approval search to ensure zero legal clearance hurdles.',
      tag: 'Zero-Risk Title Check',
      icon: <ShieldCheck className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />,
    },
    {
      number: '04',
      title: 'Sanction & 24–48h Disbursement',
      desc: 'Compare sanction letters from competitive lenders, choose your preferred repayment tenure, and unlock swift fund release.',
      tag: 'Direct Bank Disbursement',
      icon: <Zap className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />,
    },
  ];

  return (
    <section id="how-it-works" className="pt-12 sm:pt-16 pb-0 bg-[#f8f8f4]">
      <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-teal-light text-brand-teal text-xs font-bold uppercase tracking-wider mb-3">
            <Zap className="w-3.5 h-3.5" />
            <span>Digital-First Processing</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-navy tracking-tight font-heading">
            How Your Loan Gets Approved in 4 Simple Steps
          </h2>
          <p className="mt-2.5 text-sm sm:text-base text-brand-slate leading-relaxed">
            A structured advisory workflow that fast-tracks your loan from initial eligibility check to direct fund disbursement.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 relative">
          {steps.map((st, idx) => (
            <div
              key={idx}
              className="group bg-white p-7 rounded-2xl border border-brand-border/80 shadow-2xs hover:shadow-card hover:border-brand-teal/40 transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-brand-teal-light/60 to-transparent rounded-bl-3xl -z-0 group-hover:scale-110 transition-transform" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-brand-teal text-white flex items-center justify-center font-bold text-base shadow-sm">
                    {st.icon}
                  </div>
                  <span className="text-3xl font-black text-gray-200 group-hover:text-brand-teal-light font-heading transition-colors">
                    {st.number}
                  </span>
                </div>

                <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-ivory text-brand-slate mb-2">
                  {st.tag}
                </span>

                <h3 className="font-bold text-base sm:text-lg text-brand-navy font-heading mb-2 leading-snug">
                  {st.title}
                </h3>

                <p className="text-xs sm:text-sm text-brand-slate leading-relaxed">
                  {st.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/enquire"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-brand-teal hover:bg-brand-teal-hover text-white text-xs sm:text-sm font-bold rounded-corporate shadow-sm transition-all btn-primary-glow shimmer-effect"
          >
            <span>Start Your 3-Minute Digital Application</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }

        .shimmer-effect {
          position: relative;
          overflow: hidden;
        }
        .shimmer-effect::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 50%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent);
          transform: skewX(-20deg);
          animation: shimmer 4s infinite;
        }

        .btn-primary-glow {
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .btn-primary-glow:hover {
          transform: translateY(-1.5px);
          box-shadow: 0 8px 20px -4px rgba(24, 124, 120, 0.35);
        }
      `}</style>
    </section>
  );
};

/* ────────────────────────────────────────────────────────────
   7. TESTIMONIALS SECTION
   ──────────────────────────────────────────────────────────── */
interface Review {
  id: string;
  name: string;
  role: string;
  location: string;
  product: string;
  rating: number;
  content: string;
  amount: string;
  highlight: string;
  lenderTag: string;
}

const REVIEWS: Review[] = [
  {
    id: 'rev-1',
    name: 'Senthilkumar & Devika',
    role: 'Textile Business Proprietor',
    location: 'Tirupur, Tamil Nadu',
    product: 'Self Construction Loan + Subsidy',
    rating: 5,
    content:
      'Constructing our home on an owned site was delayed due to documentation queries. Prime Associates audited our building plan, applied for the central government subsidy, and sanctioned our loan at 7.25% in 8 days.',
    amount: '₹65 Lakhs Sanctioned',
    highlight: '7.25% interest rate + Government subsidy unlocked',
    lenderTag: 'SBI Home Loan',
  },
  {
    id: 'rev-2',
    name: 'Murugesan K.',
    role: 'Garment Export Unit Founder',
    location: 'Binny Compound, Tirupur',
    product: 'Loan Against Property (LAP)',
    rating: 5,
    content:
      'Availed a mortgage loan against our concrete commercial building to expand working capital. Prime Associates secured an 8.50% rate across government banks with zero hidden charges. Highly recommended!',
    amount: '₹1.80 Crore Sanctioned',
    highlight: '8.50% LAP on concrete building without advance fees',
    lenderTag: 'Bank of Baroda LAP',
  },
  {
    id: 'rev-3',
    name: 'Ramesh & Anitha Sundaram',
    role: 'Land Buyer & Builder',
    location: 'Kumaran Road, Tirupur',
    product: 'Plot Purchase + Construction Loan',
    rating: 5,
    content:
      'We wanted to buy an empty plot and construct a new house together. The team structured a single composite sanction letter with phased construction disbursements and full title scrutiny.',
    amount: '₹85 Lakhs Sanctioned',
    highlight: 'Integrated composite plot and construction funding',
    lenderTag: 'Punjab National Bank',
  },
  {
    id: 'rev-4',
    name: 'Suresh Kumar V.',
    role: 'Apparel Manufacturer',
    location: 'Coimbatore, Tamil Nadu',
    product: 'Private to Govt. Bank Takeover',
    rating: 5,
    content:
      'Our existing loan with a private NBFC was charging 10.80% interest. Prime Associates transferred the loan to a government bank at 7.25%, slashing our EMI and saving us over ₹22 Lakhs in interest!',
    amount: '₹1.10 Crore Takeover',
    highlight: 'Saved 355 bps by switching from private to PSU bank',
    lenderTag: 'State Bank of India',
  },
  {
    id: 'rev-5',
    name: 'Dr. Rajendran & Gomathi',
    role: 'Clinic Founder & Heritage Owner',
    location: 'Erode, Tamil Nadu',
    product: 'Tiled House Purchase & Renovation',
    rating: 5,
    content:
      'Traditional tiled houses often face valuation issues at standard banks. Prime Associates handled the legal clearances and arranged funding for both purchase and renovation at benchmark rates.',
    amount: '₹75 Lakhs Sanctioned',
    highlight: 'Smooth funding for ancestral tiled house property',
    lenderTag: 'Canara Bank',
  },
  {
    id: 'rev-6',
    name: 'Dhandapani P.',
    role: 'Logistics Fleet Operator',
    location: 'Tirupur, Tamil Nadu',
    product: 'Commercial Vehicle & Car Refinance',
    rating: 5,
    content:
      'Needed immediate liquidity against our transport vehicles and cars. Prime Associates arranged quick refinancing with minimal paperwork and transparent terms within 4 days.',
    amount: '₹42 Lakhs Sanctioned',
    highlight: 'Fast vehicle refinance and liquidity release',
    lenderTag: 'Vehicle Finance Desk',
  },
];

const ReviewCard: React.FC<{
  review: Review;
  ariaHidden?: boolean;
  onHoverChange: (hovered: boolean) => void;
}> = ({ review: r, ariaHidden, onHoverChange }) => {
  return (
    <div
      aria-hidden={ariaHidden}
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
      onTouchStart={() => onHoverChange(true)}
      onTouchEnd={() => onHoverChange(false)}
      className="bg-white rounded-2xl p-5 sm:p-7 border border-brand-border/80 shadow-subtle flex flex-col justify-between shrink-0 w-[275px] xs:w-[310px] sm:w-[360px] lg:w-[400px] transition-all duration-300 hover:-translate-y-1 hover:shadow-card hover:border-brand-teal/40 cursor-pointer relative select-none"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-1">
            {[...Array(r.rating)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded bg-brand-teal-light text-brand-teal border border-brand-teal/20 truncate max-w-[210px]">
            {r.product}
          </span>
        </div>

        <h3 className="font-bold text-sm sm:text-base text-brand-navy tracking-tight mb-2.5 font-heading leading-snug">
          "{r.highlight}"
        </h3>

        <p className="text-xs sm:text-sm text-brand-slate leading-relaxed mb-6">
          {r.content}
        </p>
      </div>

      <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-xs sm:text-sm text-brand-navy truncate block">
              {r.name}
            </span>
            <span title="Verified Customer" className="inline-flex items-center">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            </span>
          </div>
          <span className="text-[11px] text-brand-slate flex items-center gap-1 mt-0.5 truncate">
            <MapPin className="w-3 h-3 text-brand-teal shrink-0" />
            <span className="truncate">{r.location}</span>
          </span>
        </div>

        <div className="text-right shrink-0">
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200/60 block whitespace-nowrap">
            {r.amount}
          </span>
          <span className="text-[10px] text-brand-slate block mt-0.5 font-medium">
            {r.lenderTag}
          </span>
        </div>
      </div>
    </div>
  );
};

const TestimonialsSection: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  const repeatedReviews = useMemo(() => {
    return [...REVIEWS, ...REVIEWS];
  }, []);

  return (
    <section className="pt-12 sm:pt-16 pb-0 bg-transparent overflow-hidden">
      <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-brand-teal-light text-brand-teal text-xs font-bold tracking-wider uppercase mb-3">
            <Star className="w-3.5 h-3.5 fill-brand-teal" />
            <span>Verified Customer Stories</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-navy tracking-tight font-heading">
            Trusted by 1,000+ Indian Homebuyers &amp; Entrepreneurs
          </h2>
          <p className="mt-2.5 text-sm sm:text-base text-brand-slate leading-relaxed">
            Real feedback from borrowers who secured prompt sanctions through our transparent multi-lender advisory.
          </p>
        </div>
      </div>

      {/* Sliding Reviews (Full Width) */}
      <div className="relative w-full overflow-hidden my-4 sm:my-6">
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-32 bg-gradient-to-r from-brand-bg via-brand-bg/90 to-transparent z-20" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-32 bg-gradient-to-l from-brand-bg via-brand-bg/90 to-transparent z-20" />

        {/* Single Sliding Stream */}
        <div
          className="animate-continuous-scroll-reverse flex items-stretch gap-5 sm:gap-6 py-4 px-4 sm:px-6 select-none"
          style={{
            animationPlayState: isHovered ? 'paused' : 'running',
          }}
        >
          {repeatedReviews.map((r, idx) => (
            <ReviewCard
              key={`r1-${r.id}-${idx}`}
              review={r}
              onHoverChange={setIsHovered}
            />
          ))}
          {repeatedReviews.map((r, idx) => (
            <ReviewCard
              key={`r2-${r.id}-${idx}`}
              review={r}
              ariaHidden
              onHoverChange={setIsHovered}
            />
          ))}
        </div>
      </div>

      <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="mt-10 bg-white rounded-2xl border border-brand-border p-6 sm:p-7 shadow-2xs">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center space-y-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-brand-navy font-heading">
                1,000+
              </span>
              <span className="text-xs text-brand-slate font-medium">
                Sanctions Assisted
              </span>
            </div>

            <div className="flex flex-col items-center space-y-1 border-l border-gray-100">
              <span className="text-2xl sm:text-3xl font-extrabold text-brand-teal font-heading flex items-center gap-1">
                4.9<Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              </span>
              <span className="text-xs text-brand-slate font-medium">
                Customer Rating
              </span>
            </div>

            <div className="flex flex-col items-center space-y-1 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0">
              <span className="text-2xl sm:text-3xl font-extrabold text-brand-navy font-heading">
                ₹350+ Cr
              </span>
              <span className="text-xs text-brand-slate font-medium">
                Loan Volume Advised
              </span>
            </div>

            <div className="flex flex-col items-center space-y-1 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-heading">
                100%
              </span>
              <span className="text-xs text-brand-slate font-medium">
                Direct Lender Login
              </span>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes continuousScroll {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }

        @keyframes continuousScrollReverse {
          0% { transform: translate3d(-50%, 0, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }

        .animate-continuous-scroll {
          display: flex;
          width: max-content;
          animation: continuousScroll 50s linear infinite;
          will-change: transform;
        }

        .animate-continuous-scroll-reverse {
          display: flex;
          width: max-content;
          animation: continuousScrollReverse 50s linear infinite;
          will-change: transform;
        }

        .animate-continuous-scroll:hover,
        .animate-continuous-scroll:active,
        .animate-continuous-scroll:focus-within,
        .animate-continuous-scroll-reverse:hover,
        .animate-continuous-scroll-reverse:active,
        .animate-continuous-scroll-reverse:focus-within {
          animation-play-state: paused !important;
        }
      `}</style>
    </section>
  );
};

/* ────────────────────────────────────────────────────────────
   8. WHY WORK WITH US SECTION
   ──────────────────────────────────────────────────────────── */
interface WhyWorkWithUsProps {
  content?: SiteContent | null;
}

const WhyWorkWithUs: React.FC<WhyWorkWithUsProps> = ({ content }) => {
  const aboutHeading =
    content?.aboutHeading || 'Prime Associates — Loans & Constructions';
  const aboutText =
    content?.aboutText ||
    'Get your home loans and mortgage loans at the lowest interest rates with government subsidy across government and private banks. We provide complete advisory and syndication for self-construction, new/old home purchase, tiled houses, empty plots, commercial buildings, vehicle loans, and low-interest bank takeovers.';
  const aboutImg =
    content?.aboutImageUrl ||
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1000&q=80';

  const benefits = [
    {
      icon: <Target className="w-5 h-5 text-brand-teal" />,
      title: 'Government Subsidy (PMAY) Guidance',
      desc: 'Expert assistance in securing maximum central and state government housing subsidy benefits across eligible PSU and private banks.',
    },
    {
      icon: <Layers className="w-5 h-5 text-brand-teal" />,
      title: 'Private to Govt. Bank Loan Takeovers',
      desc: 'Transfer high-interest loans from private lenders to lowest government bank rates starting from 7.25% p.a. with zero hassle.',
    },
    {
      icon: <FileSpreadsheet className="w-5 h-5 text-brand-teal" />,
      title: 'Self-Construction & Composite Packages',
      desc: 'Specialized phased funding for building custom homes on owned sites or combined plot purchase with construction.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-brand-teal" />,
      title: 'Concrete Buildings, Tiled Houses & Empty Land',
      desc: 'Unlocking liquidity against owned concrete structures, traditional tiled houses, empty plots, and commercial properties from 8.50% p.a.',
    },
    {
      icon: <HelpCircle className="w-5 h-5 text-brand-teal" />,
      title: 'Vehicle Loans & Commercial Fleet Refinance',
      desc: 'Quick sanction for new cars, used cars, used car refinancing, and commercial transport vehicles with minimum paperwork.',
    },
  ];

  return (
    <section id="why-us" className="pt-12 sm:pt-16 pb-0 bg-[#f8f8f4]">
      <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-brand-border/80 shadow-card aspect-[16/10] sm:aspect-[4/3] lg:aspect-[4/5] bg-white">
              <img
                src={aboutImg}
                alt="Property document review and consultation"
                className="w-full h-full object-cover object-center"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1000&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/30 via-transparent to-transparent pointer-events-none"></div>

              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm p-4 rounded-2xl border border-white/60 shadow-sm text-xs text-brand-navy">
                <span className="font-bold block text-sm mb-0.5">Objective Advisory</span>
                <p className="text-brand-slate text-[11px] leading-relaxed">
                  We clarify lender expectations without making unsupported sanction promises.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 order-1 lg:order-2 space-y-5">
            <div className="inline-block px-3 py-1 rounded-full bg-brand-teal-light text-brand-teal text-xs font-bold uppercase tracking-wider">
              Why Consult With Us
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-navy tracking-tight font-heading leading-tight">
              {aboutHeading}
            </h2>

            <p className="text-brand-slate text-sm sm:text-base leading-relaxed">
              {aboutText}
            </p>

            <div className="space-y-3 pt-2">
              {benefits.map((b, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white border border-brand-border/70 hover:border-brand-teal/40 transition-all shadow-2xs"
                >
                  <div className="p-2 rounded-xl bg-brand-teal-light text-brand-teal flex-shrink-0 mt-0.5">
                    {b.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-brand-navy mb-0.5 font-heading">{b.title}</h4>
                    <p className="text-xs sm:text-sm text-brand-slate leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ────────────────────────────────────────────────────────────
   9. FAQ SECTION
   ──────────────────────────────────────────────────────────── */
interface FaqSectionProps {
  faqs: Faq[];
}

const FaqSection: React.FC<FaqSectionProps> = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = ['ALL', ...Array.from(new Set(faqs.map((f) => f.category)))];

  const filteredFaqs =
    selectedCategory === 'ALL'
      ? faqs
      : faqs.filter((f) => f.category === selectedCategory);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faqs" className="py-12 sm:py-16 bg-[#f8f8f4]">
      <div className="w-[92%] sm:w-[88%] lg:w-[85%] max-w-4xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-block px-3 py-1 rounded bg-brand-teal-light text-brand-teal text-xs font-bold uppercase tracking-wider mb-3">
            Common Inquiries
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-navy tracking-tight font-heading">
            Frequently Asked Questions
          </h2>
          <p className="mt-2.5 text-brand-slate text-sm sm:text-base leading-relaxed">
            Essential facts on property loan evaluation, eligibility parameters, documentation, and advisory appointments.
          </p>

          {categories.length > 2 && (
            <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mt-4 sm:mt-6">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setOpenIndex(null);
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    selectedCategory === cat
                      ? 'bg-brand-teal text-white shadow-sm'
                      : 'bg-brand-ivory text-brand-slate hover:bg-gray-200'
                  }`}
                >
                  {cat === 'ALL' ? 'All Inquiries' : cat}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-3.5">
          {filteredFaqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.id || index}
                className="border border-brand-border rounded-xl overflow-hidden bg-brand-ivory/40 transition-colors"
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-brand-ivory/60 transition-colors focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-semibold text-brand-navy pr-4 flex items-center gap-3">
                    <HelpCircle className="w-4 h-4 text-brand-teal flex-shrink-0" />
                    <span>{faq.question}</span>
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-brand-slate transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? 'rotate-180 text-brand-teal' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="p-5 pt-2 text-sm text-brand-slate bg-white leading-relaxed border-t border-brand-border/40 animate-in fade-in duration-150">
                    <p className="pl-7">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-12 p-6 rounded-xl bg-brand-teal-light border border-brand-teal/20 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h4 className="text-sm font-bold text-brand-navy">Have a specific question not covered here?</h4>
            <p className="text-xs text-brand-slate mt-0.5">
              Speak with a dedicated property finance advisor directly.
            </p>
          </div>
          <a
            href="/enquire"
            className="px-5 py-2.5 bg-brand-teal hover:bg-brand-teal-hover text-white text-xs font-semibold rounded-corporate transition-colors flex-shrink-0 shadow-sm"
          >
            Submit an Inquiry
          </a>
        </div>
      </div>
    </section>
  );
};

/* ────────────────────────────────────────────────────────────
   10. MAIN HOMEPAGE COMPONENT
   ──────────────────────────────────────────────────────────── */
export const HomePage: React.FC = () => {
  const { content, faqs } = useOutletContext<{
    content: SiteContent | null;
    services: Service[];
    faqs: Faq[];
  }>();

  return (
    <div className="flex flex-col">
      {/* 1. Hero with Instant Loan Estimator Card */}
      <Hero content={content} />

      {/* 2. Live Key Stats Counter */}
      <StatsBar />

      {/* 3. Premier Lender Partners Network */}
      <LenderPartners />

      {/* 4. Live Multi-Lender Rate Comparison Matrix */}
      <RateComparisonMatrix />

      {/* 5. Dynamic EMI & FOIR Calculator Banner */}
      <section className="pt-12 sm:pt-16 pb-0 bg-transparent">
        <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="p-6 sm:p-10 lg:p-12 rounded-2xl sm:rounded-3xl bg-white border border-brand-border/80 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 shadow-card">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-brand-teal-light text-brand-teal text-xs font-bold uppercase tracking-wider">
                <Calculator className="w-3.5 h-3.5" />
                <span>Interactive Estimation Engine</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight">
                Simulate Repayments &amp; Banking FOIR Eligibility
              </h2>
              <p className="text-sm sm:text-base text-brand-slate leading-relaxed">
                Estimate monthly EMIs, total interest amortization, and maximum permissible borrowing capacity based on Indian banking FOIR limits before logging your file.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0 w-full sm:w-auto">
              <Link
                to="/calculator"
                className="px-6 py-3.5 bg-brand-teal hover:bg-brand-teal-hover text-white text-xs sm:text-sm font-semibold rounded-corporate shadow-sm flex items-center justify-center gap-2 transition-colors text-center"
              >
                <span>Open Dynamic Calculator</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/services/home-loans"
                className="px-6 py-3.5 bg-brand-ivory hover:bg-gray-100 text-brand-navy border border-brand-border text-xs sm:text-sm font-semibold rounded-corporate text-center transition-colors"
              >
                Home Loan Options
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. 4-Step Digital Application Journey */}
      <HowItWorks />

      {/* 7. Customer Testimonials & Reviews */}
      <TestimonialsSection />

      {/* 8. Why Work With Us & Advisory Principles */}
      <WhyWorkWithUs content={content} />

      {/* 9. Consultation Invitation CTA */}
      <section className="pt-12 sm:pt-16 pb-0 bg-transparent">
        <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="bg-gradient-to-br from-[#12263a] to-[#183247] text-white border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-teal/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="max-w-2xl space-y-4 text-center lg:text-left z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-teal/20 text-brand-teal-light text-xs font-bold uppercase tracking-wider">
                <Calendar className="w-3.5 h-3.5" />
                <span>Schedule Confidential Consultation</span>
              </div>
              <h2 className="text-2xl xs:text-3xl sm:text-4xl font-extrabold tracking-tight font-heading leading-tight">
                Ready to Discuss Your Loan Requirements?
              </h2>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                Connect directly with our senior financial advisors for customized loan structuring, document audits, and bank rate comparison across government and leading private banks.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-gray-300">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-brand-teal" /> 100% Confidential
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-brand-teal" /> Lowest Bank ROI
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-brand-teal" /> Zero Upfront Sanction Fees
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3.5 w-full sm:w-auto z-10 shrink-0">
              <Link
                to="/enquire"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-teal hover:bg-brand-teal-hover text-white font-bold text-sm rounded-corporate shadow-md transition-all hover:scale-[1.02] text-center"
              >
                <span>Schedule an Advisory Meeting</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/services/home-loans"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-corporate border border-white/15 transition-colors text-center"
              >
                <span>Explore Loan Solutions</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Frequently Asked Questions */}
      <FaqSection faqs={faqs} />
    </div>
  );
};

export default HomePage;
