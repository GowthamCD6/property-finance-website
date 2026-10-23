import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Calculator,
} from 'lucide-react';
import { SiteContent } from '../../types';
import defaultHeroImage from '../../assets/images/hero-property-finance.jpg';
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
            <span>{content?.heroEyebrow || 'Institutional Property Finance Advisory • 40+ Partner Lenders'}</span>
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
              'Unlock institutional funding for high-value residential, commercial, and industrial properties. We partner with 40+ leading PSU & private banks and NBFCs across India to secure lowest benchmark interest rates, maximized borrowing eligibility, and zero advance fees.'}
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
              <span>Simulate EMI &amp; FOIR</span>
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
    </section>
  );
};
