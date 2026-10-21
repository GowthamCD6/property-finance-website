import React from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Calculator,
} from 'lucide-react';
import { SiteContent } from '../../types';
import defaultHeroImage from '../../assets/images/hero-property-finance.jpg';

interface HeroProps {
  content?: SiteContent | null;
}

export const Hero: React.FC<HeroProps> = ({ content }) => {
  // Use property finance architectural image
  const heroBgImage =
    content?.heroImageUrl && !content.heroImageUrl.includes('photo-1600585154340')
      ? content.heroImageUrl
      : defaultHeroImage;

  return (
    <section
      id="hero"
      className="relative min-h-[580px] lg:min-h-[640px] flex items-center justify-center bg-slate-950 overflow-hidden"
    >
      {/* ─── 1. Full-Bleed Property Finance Background Visual ─── */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBgImage}
          alt="Institutional Property Finance Architecture"
          className="w-full h-full object-cover object-center scale-[1.01] brightness-[0.95] transform motion-safe:transition-transform motion-safe:duration-1000"
          loading="eager"
        />

        {/* ── Balanced Scrim: Image is clearly visible, while text maintains contrast ── */}
        <div className="absolute inset-0 bg-black/28" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/70" />
      </div>

      {/* ─── 2. Expansive Hero Content Filling the Page ─── */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-10 xl:px-12 pt-10 pb-16 sm:pt-12 sm:pb-20 lg:pt-14 lg:pb-24">
        <div className="max-w-5xl mx-auto text-center space-y-4 sm:space-y-5 animate-fade-in-up">
          
          {/* Top Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-950/70 border border-white/20 text-slate-100 text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#20B2AA]"></span>
            <span>{content?.heroEyebrow || 'Institutional Property Finance Advisory • 40+ Partner Lenders'}</span>
          </div>

          {/* Headline (Refined Proportionate Font Size) */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-extrabold text-white tracking-tight leading-[1.12] font-heading drop-shadow-[0_3px_10px_rgba(0,0,0,0.9)] max-w-4xl mx-auto">
            Strategic Property Loans, <br className="hidden sm:inline" />
            <span className="text-[#38bdf8] drop-shadow-[0_3px_10px_rgba(0,0,0,0.9)]">
              Anchored in Trust.
            </span>
          </h1>

          {/* Subtitle / Value Proposition */}
          <p className="text-sm sm:text-base lg:text-[17px] text-white/95 font-medium leading-relaxed max-w-2xl mx-auto drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)]">
            {content?.heroSubtitle ||
              'Unlock institutional funding for high-value residential, commercial, and industrial properties. We partner with 40+ leading PSU & private banks and NBFCs across India to secure lowest benchmark interest rates, maximized borrowing eligibility, and zero advance fees.'}
          </p>

          {/* Prominent Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Link
              to="/enquire"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm sm:text-base font-bold text-white bg-gradient-to-r from-[#187C78] to-[#126763] hover:from-[#1a8a86] hover:to-[#187C78] rounded-corporate transition-all duration-200 shadow-lg shadow-slate-950/50 hover:shadow-xl text-center border border-white/10"
            >
              <span>{content?.heroCtaText || 'Apply for Loan Advisory'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/calculator"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm sm:text-base font-bold text-white bg-white/10 hover:bg-white/20 border border-white/25 hover:border-white/40 rounded-corporate transition-all duration-200 backdrop-blur-md text-center shadow-md"
            >
              <Calculator className="w-4 h-4 text-teal-300" />
              <span>Simulate EMI &amp; FOIR</span>
            </Link>

            <Link
              to="/services/home-loans"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm sm:text-base font-semibold text-slate-200 hover:text-white transition-colors text-center group"
            >
              <span>Explore All Solutions</span>
              <span className="transform transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>

          {/* ─── 4. Trust Badges & Partner Network Strip (Clean Glass Card) ─── */}
          <div className="mt-6 pt-3.5 pb-3.5 px-5 sm:px-7 rounded-xl bg-slate-950/65 backdrop-blur-md border border-slate-800/80 shadow-lg flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-slate-200">
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
