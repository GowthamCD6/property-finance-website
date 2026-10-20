import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Zap,
  Building2,
  Clock,
  Landmark,
} from 'lucide-react';
import { SiteContent } from '../../types';

interface HeroProps {
  content?: SiteContent | null;
}

export const Hero: React.FC<HeroProps> = ({ content }) => {
  const navigate = useNavigate();
  const [loanType, setLoanType] = useState<'home' | 'lap'>('home');
  const [amount, setAmount] = useState<number>(5000000); // 50 Lakhs default
  const [tenure, setTenure] = useState<number>(20); // 20 years default

  // Indicative rates
  const rate = loanType === 'home' ? 8.40 : 9.35;
  const monthlyRate = rate / 12 / 100;
  const totalMonths = tenure * 12;

  const estimatedEmi = Math.round(
    (amount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1)
  );

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getVerbalAmount = (num: number) => {
    if (num >= 10000000) return `₹ ${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `₹ ${(num / 100000).toFixed(1)} Lakhs`;
    return `₹ ${num.toLocaleString('en-IN')}`;
  };

  const handleApplyClick = () => {
    navigate('/enquire');
  };

  // Real, authentic architectural property photograph (Unsplash real photography)
  const heroRealImageUrl =
    content?.heroImageUrl ||
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85';

  return (
    <section id="hero" className="relative bg-[#0c1f30] overflow-hidden">
      {/* 1. Real Property Photograph Layer with Deep Navy Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroRealImageUrl}
          alt="Modern property architectural residence"
          className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-1000"
          loading="eager"
        />
        {/* Authoritative multi-stop gradient for razor-sharp typography readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1926]/95 via-[#0e2438]/90 to-[#0a1926]/75 lg:to-[#0a1926]/60 backdrop-blur-[1px]" />
        {/* Subtle radial ambient teal lighting in top corner */}
        <div className="absolute -top-24 right-0 w-[500px] h-[500px] bg-brand-teal/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 2. Hero Content Container (Placed cleanly over the real image) */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-10 xl:px-12 pt-12 pb-16 lg:pt-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Value Proposition & Authoritative Copy */}
          <div className="lg:col-span-7 space-y-6 text-white animate-fade-in-up">
            {/* Top Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/15 border border-teal-400/30 text-teal-300 text-xs font-bold tracking-wider uppercase backdrop-blur-md select-none">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping"></span>
              <span>Fast-Track Property Loan Facilitation</span>
              <span className="text-white/40 hidden sm:inline">•</span>
              <span className="text-white/80 hidden sm:inline">Instant Pre-Check</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white tracking-tight leading-[1.14] font-heading">
              Paperless Home Loans &amp; LAP In As Quick As{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-teal-200 to-emerald-400">
                24 Hours
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl font-sans">
              Get unbiased multi-lender assessments across 40+ leading public &amp; private banks in India. Lowest benchmark interest rates starting from <strong className="text-white font-semibold underline decoration-brand-teal decoration-2 underline-offset-4">8.40%* p.a.</strong> with zero upfront sanction fees.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <Link
                to="/enquire"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm sm:text-base font-bold text-white bg-brand-teal hover:bg-brand-teal-hover rounded-corporate transition-all duration-150 shadow-lg btn-primary-glow shimmer-effect text-center"
              >
                <span>Apply Online in 3 Minutes</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/calculator"
                className="inline-flex items-center justify-center px-6 py-3.5 text-sm sm:text-base font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/20 backdrop-blur-md rounded-corporate transition-colors text-center"
              >
                Explore Full Calculator
              </Link>
            </div>

            {/* 3 Core Trust Pillars (Frosted glass cards placed over real property visual) */}
            <div className="pt-6 border-t border-white/15 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <CheckCircle2 className="w-5 h-5 text-teal-400 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-white">
                  Zero Upfront Advisory Fees
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <Landmark className="w-5 h-5 text-teal-400 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-white">
                  40+ Bank &amp; NBFC Tie-ups
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <ShieldCheck className="w-5 h-5 text-teal-400 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-white">
                  Pre-Login Title Scrutiny
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Embedded Quick-Quote Calculator & Floating Badges */}
          <div className="lg:col-span-5 relative animate-fade-in-up">
            
            {/* Top Floating Badge */}
            <div className="absolute -top-4 -left-3 sm:-top-5 sm:-left-4 bg-white/95 backdrop-blur-md py-2 px-3.5 rounded-xl border border-white shadow-xl flex items-center gap-2.5 z-20 pulse-badge select-none">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Zap className="w-4 h-4 fill-emerald-600" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block leading-tight">Fast Decision</span>
                <span className="text-xs font-extrabold text-brand-navy">24 – 48h In-Principle</span>
              </div>
            </div>

            {/* Bottom Floating Badge */}
            <div className="hidden sm:flex absolute -bottom-4 -right-3 bg-brand-navy/95 backdrop-blur-md py-2 px-3.5 rounded-xl border border-white/20 shadow-xl items-center gap-2 z-20 text-white select-none">
              <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></div>
              <span className="text-xs font-semibold">40+ Partner Lenders Linked</span>
            </div>

            {/* Calculator Card */}
            <div className="bg-white rounded-2xl border border-white/50 p-6 sm:p-7 shadow-2xl relative z-10 space-y-6">
              {/* Card Header & Switcher */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-brand-teal" />
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-navy">
                      Instant Loan Estimator
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Digital Pre-Check
                  </span>
                </div>

                {/* Product Switcher */}
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-brand-ivory rounded-xl border border-brand-border text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setLoanType('home')}
                    className={`py-2 px-3 rounded-lg transition-all text-center ${
                      loanType === 'home'
                        ? 'bg-brand-navy text-white shadow-xs'
                        : 'text-brand-slate hover:text-brand-navy'
                    }`}
                  >
                    Home Loan
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoanType('lap')}
                    className={`py-2 px-3 rounded-lg transition-all text-center ${
                      loanType === 'lap'
                        ? 'bg-brand-navy text-white shadow-xs'
                        : 'text-brand-slate hover:text-brand-navy'
                    }`}
                  >
                    Loan Against Property
                  </button>
                </div>
              </div>

              {/* Slider 1: Loan Amount */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-brand-navy">Loan Amount</span>
                  <span className="text-sm font-extrabold text-brand-teal font-mono">
                    {formatINR(amount)}
                  </span>
                </div>
                <input
                  type="range"
                  min="500000"
                  max="50000000"
                  step="250000"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-teal"
                />
                <div className="flex justify-between text-[10px] text-brand-slate">
                  <span>₹ 5 Lakhs</span>
                  <span className="font-bold text-brand-navy">{getVerbalAmount(amount)}</span>
                  <span>₹ 5 Crores</span>
                </div>
              </div>

              {/* Slider 2: Tenure */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-brand-navy">Loan Tenure</span>
                  <span className="text-sm font-extrabold text-brand-teal font-mono">
                    {tenure} Years
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max={loanType === 'home' ? 30 : 18}
                  step="1"
                  value={tenure}
                  onChange={(e) => setTenure(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-teal"
                />
                <div className="flex justify-between text-[10px] text-brand-slate">
                  <span>5 Years</span>
                  <span>{loanType === 'home' ? 'Max 30 Yrs' : 'Max 18 Yrs'}</span>
                </div>
              </div>

              {/* Live Estimated Repayment Box */}
              <div className="p-4 rounded-xl bg-brand-ivory border border-brand-border/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-slate block">
                    Estimated Monthly EMI
                  </span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-brand-navy font-mono block mt-0.5">
                    {formatINR(estimatedEmi)}
                    <span className="text-xs font-normal text-brand-slate ml-1">/mo</span>
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-slate block">
                    Indicative Rate
                  </span>
                  <span className="text-sm font-bold text-brand-teal block mt-0.5">
                    from {rate.toFixed(2)}%*
                  </span>
                </div>
              </div>

              {/* Apply CTA Button */}
              <button
                type="button"
                onClick={handleApplyClick}
                className="w-full py-3.5 px-4 bg-brand-teal hover:bg-brand-teal-hover text-white text-xs sm:text-sm font-bold rounded-corporate shadow-sm flex items-center justify-center gap-2 transition-all duration-150 group btn-primary-glow shimmer-effect"
              >
                <span>Apply for this Loan in 3 Minutes</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="text-center text-[11px] text-brand-slate">
                <span>🔒 100% Confidential &bull; Zero Bureau Score Impact</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
