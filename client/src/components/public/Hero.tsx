import React from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Building2,
  Quote,
  Landmark,
  BadgePercent,
  Clock,
} from 'lucide-react';
import { SiteContent } from '../../types';

interface HeroProps {
  content?: SiteContent | null;
}

export const Hero: React.FC<HeroProps> = ({ content }) => {
  // Real, authentic architectural property photograph (Unsplash real photography)
  const heroRealImageUrl =
    content?.heroImageUrl ||
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85';

  return (
    <section id="hero" className="relative bg-gradient-to-b from-white via-brand-ivory/40 to-white pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-brand-border/60 overflow-hidden">
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Bold Strategic Headline, Company Quote & Advisory CTAs */}
          <div className="lg:col-span-7 space-y-6 animate-fade-in-up">
            
            {/* Top Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-teal-light text-brand-teal text-xs font-bold uppercase tracking-wider border border-brand-teal/20 select-none">
              <span className="w-2 h-2 rounded-full bg-brand-teal animate-pulse"></span>
              <span>Independent Property Finance Advisory</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-brand-navy tracking-tight leading-[1.14] font-heading">
              Strategic Property Loans, <br className="hidden sm:inline" />
              <span className="text-brand-teal">Anchored In Trust.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-brand-slate leading-relaxed max-w-2xl font-sans">
              We connect homebuyers, property owners, and business enterprises with 40+ leading commercial banks and NBFCs across India. Experience transparent multi-lender evaluation, lowest benchmark rates, and zero upfront sanction fees.
            </p>

            {/* Company Mission & Advisory Quote Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border-l-4 border-brand-teal border-y border-r border-brand-border shadow-subtle relative group hover:shadow-card transition-all duration-300">
              <Quote className="w-8 h-8 text-brand-teal/15 absolute top-3 right-4 pointer-events-none" />
              <p className="text-xs sm:text-sm font-medium text-brand-navy italic leading-relaxed pr-6">
                “Your real estate is the bedrock of your family's financial security. At WealthAnchor, we eliminate lending bias and hidden broker cuts to structure institutional capital aligned with your long-term wealth.”
              </p>
              <div className="mt-3.5 flex items-center justify-between pt-2.5 border-t border-brand-border/60 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-brand-teal text-white flex items-center justify-center font-bold text-[10px]">
                    WA
                  </div>
                  <div>
                    <span className="font-bold text-brand-navy block leading-tight">The WealthAnchor Advisory Charter</span>
                    <span className="text-[10px] text-brand-slate">Fiduciary Client Advocacy</span>
                  </div>
                </div>
                <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                  Zero Advance Fees
                </span>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-1">
              <Link
                to="/enquire"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm sm:text-base font-bold text-white bg-brand-teal hover:bg-brand-teal-hover rounded-corporate transition-all duration-150 shadow-sm hover:shadow btn-primary-glow shimmer-effect text-center"
              >
                <span>Apply for Loan Advisory</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/services/home-loans"
                className="inline-flex items-center justify-center px-6 py-3.5 text-sm sm:text-base font-semibold text-brand-navy bg-white hover:bg-brand-ivory border border-brand-border rounded-corporate transition-colors text-center shadow-2xs"
              >
                Explore Loan Solutions
              </Link>
            </div>

            {/* 3 Core Trust Pillars */}
            <div className="pt-4 border-t border-brand-border/80 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-brand-teal flex-shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-brand-navy">
                  Zero Upfront Charges
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-brand-teal flex-shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-brand-navy">
                  40+ Partner Lenders
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-brand-teal flex-shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-brand-navy">
                  24–48h Turnaround
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Authentic Real Property Photography with Layered Floating Cards */}
          <div className="lg:col-span-5 relative animate-fade-in-up">
            
            {/* Subtle background ambient blur glow */}
            <div className="absolute -inset-3 bg-gradient-to-tr from-brand-teal/20 via-brand-teal/5 to-brand-navy/10 rounded-3xl blur-2xl opacity-70 pointer-events-none" />

            {/* Main Real Architectural Photography Card */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-white bg-white group">
              <img
                src={heroRealImageUrl}
                alt="Luxury residential real estate property finance architecture"
                className="w-full h-[420px] sm:h-[480px] lg:h-[520px] object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="eager"
              />
              
              {/* Image Gradient Scrim for Card Contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/85 via-brand-navy/20 to-transparent" />

              {/* Floating Top Left Badge: Institutional Network */}
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md py-2 px-3.5 rounded-xl border border-white shadow-lg flex items-center gap-2.5 z-20 select-none">
                <div className="w-7 h-7 rounded-lg bg-brand-teal-light text-brand-teal flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-brand-slate block leading-tight">Institutional Trust</span>
                  <span className="text-xs font-extrabold text-brand-navy">RBI Regulated Lenders</span>
                </div>
              </div>

              {/* Floating Top Right: Rating Pill */}
              <div className="absolute top-4 right-4 bg-brand-navy/90 backdrop-blur-md py-1.5 px-3 rounded-full border border-white/20 shadow-lg flex items-center gap-1.5 text-white text-xs font-bold select-none">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>4.9 / 5.0 Rating</span>
              </div>

              {/* Floating Bottom Card: Customer Story Quote / Sanction Milestone */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-white shadow-xl space-y-2 select-none">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    ⚡ Verified Sanction
                  </span>
                  <span className="text-brand-slate">Bengaluru, Karnataka</span>
                </div>
                <p className="text-xs font-semibold text-brand-navy leading-snug">
                  “₹2.4 Cr Loan Against Property sanctioned with a 0.75% lower rate through WealthAnchor's multi-lender title audit.”
                </p>
                <div className="flex items-center justify-between pt-1 border-t border-gray-100 text-[10px] text-brand-slate">
                  <span>Residential &amp; Commercial LAP</span>
                  <span className="font-bold text-brand-teal">Sanctioned in 48 Hours</span>
                </div>
              </div>
            </div>

            {/* Floating Left Pill: 40+ Partner Lenders */}
            <div className="hidden sm:flex absolute -bottom-4 -left-4 bg-white py-2.5 px-4 rounded-xl shadow-xl border border-brand-border items-center gap-3 z-30 pulse-badge select-none">
              <div className="w-8 h-8 rounded-full bg-brand-teal text-white flex items-center justify-center font-bold text-xs shadow-sm">
                40+
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-brand-slate block leading-tight">Partner Lenders</span>
                <span className="text-xs font-extrabold text-brand-navy">All Leading PSU &amp; Pvt Banks</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
