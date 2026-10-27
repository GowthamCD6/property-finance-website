import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Calculator,
} from 'lucide-react';
import { SiteContent } from '../../../types';
import defaultHeroImage from '../../../assets/images/hero-property-finance.jpg';
import { AnimatedHeadline } from './AnimatedHeadline';

interface HeroProps {
  content?: SiteContent | null;
}

export const Hero: React.FC<HeroProps> = ({ content }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(timer);
  }, []);

  // Use property finance architectural image
  const heroBgImage =
    content?.heroImageUrl && !content.heroImageUrl.includes('photo-1600585154340')
      ? content.heroImageUrl
      : defaultHeroImage;

  return (
    <section
      id="hero"
      className="relative min-h-[620px] lg:min-h-[700px] flex items-center justify-center bg-slate-950 overflow-hidden"
    >
      {/* ─── 1. Full-Bleed Property Finance Background Visual ─── */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBgImage}
          alt="Institutional Property Finance Architecture"
          className="w-full h-full object-cover object-center scale-[1.01] brightness-[0.80] transform motion-safe:transition-transform motion-safe:duration-1000"
          loading="eager"
        />

        {/* ── Balanced Scrim: Image is clearly visible, while text maintains contrast ── */}
        <div className="absolute inset-0 bg-black/28" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/70" />
      </div>

      {/* ─── 2. Expansive Hero Content Filling the Page ─── */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-10 xl:px-12 pt-12 pb-24 sm:pt-16 sm:pb-28 lg:pt-16 lg:pb-32">
        <div className="max-w-5xl mx-auto text-center space-y-6 sm:space-y-7">
          
          {/* Top Eyebrow Badge - Entrance Animation */}
          <div
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(-14px)',
              transition: 'opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1) 0.1s, transform 0.75s cubic-bezier(0.16, 1, 0.3, 1) 0.1s',
            }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-950/70 border border-white/20 text-slate-100 text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-[#20B2AA] animate-pulse"></span>
            <span>{content?.heroEyebrow || 'PRIME ASSOCIATES • LOANS & CONSTRUCTIONS • GOVT. SUBSIDY'}</span>
          </div>

          {/* Animated 3D Headline with Dynamic Word Rotation & Mouse Parallax Tilt */}
          <AnimatedHeadline />

          {/* Subtitle / Normal Text - Staggered Entrance */}
          <p
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(24px)',
              transition: 'opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.55s, transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.55s',
            }}
            className="text-[17px] sm:text-[19px] lg:text-[20px] text-white/95 font-medium leading-relaxed max-w-3xl mx-auto drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)]"
          >
            {content?.heroSubtitle ||
              'Get your home loans and mortgage loans at the lowest interest rates with government subsidy across government and private banks. Home loans from 7.25% p.a., Mortgage loans (LAP) from 8.50% p.a., Purchase Loans, Vehicle Loans, and Private-to-Government Bank Takeovers.'}
          </p>

          {/* Prominent Action CTAs with Professional Micro-Animations - Staggered Entrance */}
          <div
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(24px)',
              transition: 'opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.70s, transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.70s',
            }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3 sm:pt-4"
          >
            <Link
              to="/enquire"
              className="hero-btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 sm:px-9 py-4 text-sm sm:text-base font-bold text-white text-center cursor-pointer tracking-wide"
            >
              <span>{content?.heroCtaText || 'Discuss Your Loan'}</span>
              <ArrowRight className="w-4.5 h-4.5 hero-btn-arrow" />
            </Link>

            <Link
              to="/calculator"
              className="hero-btn-secondary w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 sm:px-8.5 py-4 text-sm sm:text-base font-bold text-white text-center cursor-pointer tracking-wide"
            >
              <Calculator className="w-4.5 h-4.5 text-teal-300 hero-calc-icon" />
              <span>Simulate EMI &amp; ROI</span>
            </Link>

            <Link
              to="/services/home-loans"
              className="hero-btn-tertiary w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 text-sm sm:text-base font-semibold text-slate-200 hover:text-white transition-all text-center group cursor-pointer hover:-translate-y-0.5"
            >
              <span>Explore All Solutions</span>
              <span className="hero-explore-arrow">→</span>
            </Link>
          </div>

          {/* ─── 4. Trust Badges & Partner Network Strip (Clean Glass Card) - Staggered Entrance ─── */}
          <div
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(24px)',
              transition: 'opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.85s, transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.85s',
            }}
            className="mt-8 pt-4 pb-4 px-6 sm:px-8 rounded-xl bg-slate-950/65 backdrop-blur-md border border-slate-800/80 shadow-lg flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm text-slate-200"
          >
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 justify-center sm:justify-start">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#20B2AA] flex-shrink-0" />
                <span className="font-semibold text-white">Government Subsidy Assistance</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#20B2AA] flex-shrink-0" />
                <span className="font-semibold text-white">Home Loans from 7.25%*</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#20B2AA] flex-shrink-0" />
                <span className="font-semibold text-white">Mortgage (LAP) from 8.50%*</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-300 text-xs justify-center mx-auto sm:mx-0">
              <ShieldCheck className="w-4 h-4 text-[#20B2AA]" />
              <span>Network: <strong className="text-white">Government (PSU) &amp; Private Commercial Banks</strong></span>
            </div>
          </div>

        </div>
      </div>
      <style>{`
        /* Hero Button Professional Micro-Animations & Premium Rounded Styling */
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

        /* Secondary Button Premium Frosted Glassmorphism */
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

        /* Tertiary Link Hover Micro-Animation */
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
