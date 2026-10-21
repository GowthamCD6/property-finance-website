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
  // Use high-resolution property finance architectural image (bundled via Vite)
  const heroBgImage =
    content?.heroImageUrl && !content.heroImageUrl.includes('photo-1600585154340')
      ? content.heroImageUrl
      : defaultHeroImage;

  return (
    <section
      id="hero"
      className="relative min-h-[620px] lg:min-h-[700px] flex items-center justify-center bg-[#03060c] overflow-hidden border-b border-brand-border/40"
    >
      {/* ─── 1. Full-Bleed Property Finance Background Visual ─── */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBgImage}
          alt="Institutional Property Finance Architecture"
          className="w-full h-full object-cover object-center scale-105 transform motion-safe:transition-transform motion-safe:duration-1000"
          loading="eager"
        />

        {/* Balanced cinematic scrim: crisp midnight base that lets photograph lighting breathe */}
        <div className="absolute inset-0 bg-[#03060c]/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#03060c] via-transparent to-[#040912]/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#03060c]/60 via-transparent to-[#03060c]/60" />

        {/* ── Dynamic Multi-Hue Ambient Glows (Distinct from Navbar) ── */}
        {/* Radiant Emerald-Cyan Luminous Blur (Left-Center) */}
        <div className="absolute top-1/5 left-1/3 -translate-x-1/2 w-[720px] h-[380px] bg-cyan-500/22 rounded-full blur-[110px] pointer-events-none" />
        
        {/* Warm Architectural Amber Glow (Echoing the illuminated luxury property glazing) */}
        <div className="absolute top-1/4 right-1/4 w-[520px] h-[350px] bg-amber-500/20 rounded-full blur-[100px] pointer-events-none" />

        {/* Vibrant Teal Core Halo (Directly framing the headline) */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[580px] h-[280px] bg-teal-400/22 rounded-full blur-[90px] pointer-events-none" />
      </div>

      {/* ─── 2. Expansive Hero Content Filling the Page ─── */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-10 xl:px-12 pt-12 pb-20 sm:pt-16 sm:pb-24 lg:pt-18 lg:pb-28">
        <div className="max-w-6xl mx-auto text-center space-y-6 sm:space-y-8 animate-fade-in-up">
          
          {/* Top Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-950/80 border border-teal-400/50 text-teal-300 text-xs sm:text-sm font-bold uppercase tracking-wider backdrop-blur-md shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse"></span>
            <span>{content?.heroEyebrow || 'Institutional Property Finance Advisory • 40+ Partner Lenders'}</span>
          </div>

          {/* Grand Headline Spanning the Page */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.12] font-heading drop-shadow-md max-w-5xl mx-auto">
            Strategic Property Loans, <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-emerald-200 to-cyan-200">
              Anchored in Trust.
            </span>
          </h1>

          {/* Subtitle / Value Proposition Filling the Space */}
          <p className="text-base sm:text-lg lg:text-xl text-gray-100 font-normal leading-relaxed max-w-3xl mx-auto drop-shadow-sm">
            {content?.heroSubtitle ||
              'Unlock institutional funding for high-value residential, commercial, and industrial properties. We partner with 40+ leading PSU & private banks and NBFCs across India to secure lowest benchmark interest rates, maximized borrowing eligibility, and zero advance fees.'}
          </p>

          {/* Prominent Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 pt-2">
            <Link
              to="/enquire"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 text-sm sm:text-base font-bold text-white bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 rounded-corporate transition-all duration-200 shadow-xl shadow-teal-950/70 hover:shadow-teal-700/50 btn-primary-glow shimmer-effect text-center"
            >
              <span>{content?.heroCtaText || 'Apply for Loan Advisory'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/calculator"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 text-sm sm:text-base font-bold text-white bg-white/15 hover:bg-white/25 border-2 border-white/30 hover:border-white/60 rounded-corporate transition-all backdrop-blur-md text-center shadow-md"
            >
              <Calculator className="w-4 h-4 text-teal-300" />
              <span>Simulate EMI &amp; FOIR</span>
            </Link>

            <Link
              to="/services/home-loans"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 text-sm sm:text-base font-semibold text-slate-200 hover:text-white transition-colors text-center"
            >
              <span>Explore All Solutions →</span>
            </Link>
          </div>

          {/* ─── 4. Trust Badges & Partner Network Strip ─── */}
          <div className="pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm text-slate-200">
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 justify-center sm:justify-start">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-300 flex-shrink-0" />
                <span className="font-semibold text-white">Zero Advance Fees</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-300 flex-shrink-0" />
                <span className="font-semibold text-white">40+ Partner Lenders</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-300 flex-shrink-0" />
                <span className="font-semibold text-white">24–48h Rapid Sanction</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-300 text-xs justify-center mx-auto sm:mx-0">
              <ShieldCheck className="w-4 h-4 text-teal-300" />
              <span>Institutional Banking Partners: <strong className="text-white">SBI • HDFC • ICICI • AXIS • KOTAK</strong></span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
