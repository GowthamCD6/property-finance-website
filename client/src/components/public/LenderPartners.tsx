import React, { useState, useMemo, useCallback } from 'react';
import { Award, CheckCircle2, ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

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
      className="group relative bg-white p-6 rounded-2xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 shrink-0 w-[320px] sm:w-[360px] lg:w-[380px] overflow-hidden no-underline cursor-pointer block"
      style={{
        border: isHovered
          ? `2px solid ${p.accentColor}`
          : '2px solid rgba(229, 231, 235, 0.85)',
        boxShadow: isHovered
          ? `0 18px 38px -6px ${p.accentColor}35, 0 8px 18px rgba(24, 50, 71, 0.08)`
          : '0 3px 14px rgba(24, 50, 71, 0.05)',
      }}
    >
      {/* Subtle Radial Gradient Glow on Hover Matching Bank Color */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
        style={{
          background: `radial-gradient(circle at top right, ${p.accentColor}14, transparent 65%)`,
        }}
      />

      <div>
        {/* Top Bar: Official Bank Logo Image (Clear & High Visibility, No Constrained Box) + Code Badge */}
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

        {/* Bank Name & Category Subtitle */}
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

        {/* Highlighted Benchmark Rate Chip (Bank Card Specification Style) */}
        <div
          className="mt-4 rounded-xl px-3.5 py-2.5 border flex items-center justify-between relative z-10 transition-colors"
          style={{
            backgroundColor: isHovered ? '#ffffff' : '#f8f8f4',
            borderColor: isHovered ? `${p.accentColor}40` : '#e5e7eb',
          }}
        >
          <span className="text-xs text-brand-slate font-medium">
            Home Loan
          </span>
          <span
            className="text-sm font-extrabold font-heading transition-colors"
            style={{ color: isHovered ? p.accentColor : '#183247' }}
          >
            {p.ratesFrom}*
          </span>
        </div>
      </div>

      {/* Key Advantage / Perk Pill Badge */}
      <div className="mt-4.5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs relative z-10">
        <span className="inline-flex items-center gap-1.5 text-emerald-800 font-semibold bg-emerald-50 px-3 py-1.5 rounded-lg text-[11px] border border-emerald-100/80 tracking-tight truncate">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="truncate">{p.badge}</span>
        </span>
      </div>
    </Link>
  );
};

export const LenderPartners: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'psu' | 'private' | 'nbfc'>('all');
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isAnyCardHovered, setIsAnyCardHovered] = useState(false);
  const [manualOffset, setManualOffset] = useState(0);

  const partners: Partner[] = [
    {
      id: 'sbi',
      name: 'State Bank of India',
      short: 'SBI',
      category: 'psu',
      type: 'Public Sector Bank',
      ratesFrom: '8.40%',
      badge: 'Lowest Benchmark Rate',
      accentColor: '#0072BB',
      logoUrl: '/images/lenders/sbi.svg',
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
      logoUrl: '/images/lenders/hdfc.svg',
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
      logoUrl: '/images/lenders/icici.svg',
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
      logoUrl: '/images/lenders/axis.svg',
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
      logoUrl: '/images/lenders/kotak.svg',
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
      logoUrl: '/images/lenders/bob.svg',
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
      logoUrl: '/images/lenders/bajaj.svg',
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
      logoUrl: '/images/lenders/tata.svg',
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
      logoUrl: '/images/lenders/pnb.svg',
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
      logoUrl: '/images/lenders/lic.png',
    },
  ];

  const filteredPartners = useMemo(() => {
    return selectedCategory === 'all'
      ? partners
      : partners.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  // Create an extended duplicate list for seamless, infinite looping
  const singleSet = useMemo(() => {
    if (filteredPartners.length === 0) return [];
    let list = [...filteredPartners];
    // Ensure we have enough items so the track width comfortably exceeds ultra-wide screen widths
    while (list.length < 8) {
      list = [...list, ...filteredPartners];
    }
    return list;
  }, [filteredPartners]);

  // Handle manual steps
  const handleStep = useCallback((direction: 'prev' | 'next') => {
    const cardStep = 380;
    if (direction === 'next') {
      setManualOffset((prev) => prev - cardStep);
    } else {
      setManualOffset((prev) => prev + cardStep);
    }
  }, []);

  const toggleAutoPlay = () => {
    setIsAutoPlay((prev) => !prev);
  };

  const handleCategorySelect = (categoryId: 'all' | 'psu' | 'private' | 'nbfc') => {
    setSelectedCategory(categoryId);
    setManualOffset(0);
  };

  const isPaused = !isAutoPlay || isAnyCardHovered;

  return (
    <section className="pt-16 sm:pt-20 lg:pt-24 pb-14 sm:pb-16 bg-transparent border-b border-brand-border/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-teal-light text-brand-teal text-xs font-bold tracking-wider uppercase mb-3.5 shadow-xs">
            <Award className="w-3.5 h-3.5" />
            <span>Multi-Lender Access</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-navy tracking-tight font-heading">
            Direct Channel Advisory with India’s Leading Lenders
          </h2>
          <p className="mt-3 text-sm sm:text-base text-brand-slate leading-relaxed">
            We partner with 40+ leading public sector banks, private financial institutions, and housing finance companies (HFCs) to evaluate and secure the most cost-effective loan terms for your specific property.
          </p>
        </div>

        {/* Controls Bar: Category Filter Pills + Slider Navigation in a STRICT SINGLE ROW */}
        <div className="flex items-center justify-between gap-3 w-full mb-6 flex-nowrap overflow-x-auto scrollbar-none py-1">
          
          {/* Interactive Category Filter Pills (Single Row, No Wrap) */}
          <div className="flex items-center gap-2 shrink-0">
            {[
              { id: 'all', label: 'All Lenders (10)' },
              { id: 'psu', label: 'Public Sector Banks' },
              { id: 'private', label: 'Premier Private Banks' },
              { id: 'nbfc', label: 'NBFCs & Housing Finance' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleCategorySelect(tab.id as any)}
                className={`text-xs font-semibold px-4 py-1.5 rounded-full transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 ${
                  selectedCategory === tab.id
                    ? 'bg-brand-navy text-white shadow-sm'
                    : 'bg-white text-brand-slate hover:text-brand-navy hover:bg-slate-100 border border-brand-border/70'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Slider Controls: Auto-Slide Status, Play/Pause & Left/Right Arrows (Single Row, No Wrap, aligned right) */}
          <div className="flex items-center gap-2 shrink-0 ml-auto">
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100/90 text-[11px] text-brand-slate font-medium whitespace-nowrap">
              <span
                className={`w-2 h-2 rounded-full transition-colors ${
                  isPaused ? 'bg-amber-400' : 'bg-emerald-500 animate-pulse'
                }`}
              />
              <span>
                {isAnyCardHovered ? 'Paused on Card' : isAutoPlay ? 'Continuous Sliding' : 'Paused'}
              </span>
            </div>

            {/* Play / Pause Toggle Button */}
            <button
              type="button"
              onClick={toggleAutoPlay}
              aria-label={isAutoPlay ? 'Pause sliding animation' : 'Start sliding animation'}
              title={isAutoPlay ? 'Pause sliding animation' : 'Start sliding animation'}
              className="w-8 h-8 rounded-full bg-white border border-brand-border hover:border-brand-teal/50 text-brand-navy hover:text-brand-teal flex items-center justify-center transition-all shadow-xs cursor-pointer shrink-0"
            >
              {isAutoPlay ? (
                <Pause className="w-3.5 h-3.5 text-brand-slate hover:text-brand-navy" />
              ) : (
                <Play className="w-3.5 h-3.5 text-brand-teal ml-0.5" />
              )}
            </button>

            {/* Previous Slide Button */}
            <button
              type="button"
              onClick={() => handleStep('prev')}
              aria-label="Previous lender"
              title="Slide left"
              className="w-8 h-8 rounded-full bg-white border border-brand-border hover:border-brand-teal/50 text-brand-navy hover:text-brand-teal flex items-center justify-center transition-all shadow-xs cursor-pointer shrink-0"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Next Slide Button */}
            <button
              type="button"
              onClick={() => handleStep('next')}
              aria-label="Next lender"
              title="Slide right"
              className="w-8 h-8 rounded-full bg-white border border-brand-border hover:border-brand-teal/50 text-brand-navy hover:text-brand-teal flex items-center justify-center transition-all shadow-xs cursor-pointer shrink-0"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dynamic & Premium Continuous Sliding Carousel (Wider Content & Full-Bleed Panoramic Slide) */}
        <div className="relative w-screen left-1/2 -translate-x-1/2 overflow-hidden my-3">
          {/* Left & Right Gradient Fade Overlays for seamless edge transition */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-r from-brand-bg to-transparent z-20" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-l from-brand-bg to-transparent z-20" />

          {/* Interactive Sliding Track with Expanded Width and Continuous CSS Hardware Acceleration */}
          <div
            className="transition-transform duration-500 ease-out"
            style={{ transform: `translateX(${manualOffset}px)` }}
          >
            <div
              className="animate-continuous-scroll flex items-stretch gap-5 sm:gap-6 py-5 px-6 sm:px-12 select-none"
              style={{
                animationPlayState: isPaused ? 'paused' : 'running',
              }}
            >
              {/* Set 1 */}
              {singleSet.map((p, idx) => (
                <LenderCard
                  key={`p1-${p.id}-${idx}`}
                  partner={p}
                  onHoverChange={setIsAnyCardHovered}
                />
              ))}
              {/* Set 2 (Exact Duplicate for Seamless Continuous Loop) */}
              {singleSet.map((p, idx) => (
                <LenderCard
                  key={`p2-${p.id}-${idx}`}
                  partner={p}
                  ariaHidden
                  onHoverChange={setIsAnyCardHovered}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Four Core Ethical Commitments */}
        <div className="mt-12 bg-white rounded-2xl border border-brand-border p-6 sm:p-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
            <div className="flex flex-col items-center md:items-start space-y-1.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm mb-1 font-heading">
                ₹0
              </div>
              <h4 className="font-bold text-sm text-brand-navy font-heading">Zero Upfront Fees</h4>
              <p className="text-xs text-brand-slate leading-relaxed">
                We never charge advance advisory fees. All processing fees are paid directly to the lending institution.
              </p>
            </div>

            <div className="flex flex-col items-center md:items-start space-y-1.5 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-sm mb-1 font-heading">
                40+
              </div>
              <h4 className="font-bold text-sm text-brand-navy font-heading">Single Application</h4>
              <p className="text-xs text-brand-slate leading-relaxed">
                One complete document dossier evaluated across multiple banks without repeated CIBIL bureau damage.
              </p>
            </div>

            <div className="flex flex-col items-center md:items-start space-y-1.5 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-sm mb-1 font-heading">
                100%
              </div>
              <h4 className="font-bold text-sm text-brand-navy font-heading">Legal &amp; Technical Audit</h4>
              <p className="text-xs text-brand-slate leading-relaxed">
                Pre-login title search and plan compliance verification to prevent rejection during legal clearance.
              </p>
            </div>

            <div className="flex flex-col items-center md:items-start space-y-1.5 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-brand-teal flex items-center justify-center font-bold text-sm mb-1 font-heading">
                1:1
              </div>
              <h4 className="font-bold text-sm text-brand-navy font-heading">Dedicated Case Officer</h4>
              <p className="text-xs text-brand-slate leading-relaxed">
                Direct phone &amp; in-person coordination from application login until loan agreement execution.
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="mt-6 text-center text-[11px] text-brand-slate max-w-4xl mx-auto">
          *Note: Interest rates indicated are indicative starting benchmark rates linked to RBI Repo Rate (EBLR/RLLR) and lender internal risk policies. Final sanctioned interest rate, processing fee, and LTV depend strictly on applicant credit assessment, ITR history, and property legal/valuation clearance by the respective lender.
        </p>
      </div>
    </section>
  );
};
