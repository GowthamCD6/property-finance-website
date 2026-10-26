import React, { useState } from 'react';
import { Award, CheckCircle2, ArrowUpRight, ShieldCheck, Layers, FileSearch, UserCheck } from 'lucide-react';
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

  return (
    <section className="py-12 sm:py-16 bg-transparent overflow-hidden">
      <div className="w-[85%] max-w-7xl mx-auto">
        
        {/* Section Header */}
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

        {/* Dynamic Continuous Sliding Carousel */}
        <div className="relative w-screen left-1/2 -translate-x-1/2 overflow-hidden my-3">
          {/* Left & Right Gradient Fade Overlays for seamless edge transition */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-r from-brand-bg to-transparent z-20" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-l from-brand-bg to-transparent z-20" />

          {/* Continuous CSS Hardware Acceleration Track */}
          <div
            className="animate-continuous-scroll flex items-stretch gap-5 sm:gap-6 py-4 px-6 sm:px-12 select-none"
            style={{
              animationPlayState: isHovered ? 'paused' : 'running',
            }}
          >
            {/* Set 1 */}
            {partners.map((p, idx) => (
              <LenderCard
                key={`p1-${p.id}-${idx}`}
                partner={p}
                onHoverChange={setIsHovered}
              />
            ))}
            {/* Set 2 (Exact Duplicate for Seamless Continuous Loop) */}
            {partners.map((p, idx) => (
              <LenderCard
                key={`p2-${p.id}-${idx}`}
                partner={p}
                ariaHidden
                onHoverChange={setIsHovered}
              />
            ))}
          </div>
        </div>

        {/* Four Core Ethical Commitments */}
        <div className="mt-14 relative rounded-3xl p-3 sm:p-4 bg-gradient-to-b from-slate-100/70 via-white to-slate-100/40 border border-slate-200/90 shadow-[0_20px_50px_-15px_rgba(24,50,71,0.07),0_1px_3px_rgba(0,0,0,0.03)] backdrop-blur-sm">
          {/* Subtle ambient decorative blur behind cards */}
          <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none -z-10">
            <div className="absolute -top-16 -left-16 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-brand-teal/10 rounded-full blur-3xl" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
            
            {/* Card 1: Zero Upfront Fees */}
            <div className="group relative bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 hover:border-emerald-300 transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-[0_20px_35px_-8px_rgba(16,185,129,0.22)] flex flex-col justify-between overflow-hidden cursor-default">
              {/* Card top radiant glow edge */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {/* Card ambient corner glow */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-100/50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/90 text-emerald-700 border border-emerald-200/70 flex items-center justify-center font-extrabold text-base font-heading shadow-xs transition-all duration-300 ease-out group-hover:scale-110 group-hover:rotate-1 group-hover:bg-gradient-to-br group-hover:from-emerald-500 group-hover:to-emerald-600 group-hover:text-white group-hover:border-emerald-500 group-hover:shadow-lg group-hover:shadow-emerald-500/30">
                    ₹0
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-emerald-600 group-hover:bg-emerald-50 group-hover:border-emerald-200 group-hover:scale-110 transition-all duration-300">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                </div>

                <h4 className="font-bold text-base text-brand-navy font-heading group-hover:text-emerald-700 transition-colors duration-200 mb-2">
                  Zero Upfront Fees
                </h4>
                <p className="text-xs text-brand-slate leading-relaxed group-hover:text-slate-700 transition-colors duration-200">
                  We never charge advance advisory fees. All processing fees are paid directly to the lending institution.
                </p>
              </div>

              <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>100% Direct Bank Billing</span>
              </div>
            </div>

            {/* Card 2: Single Application */}
            <div className="group relative bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 hover:border-blue-300 transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-[0_20px_35px_-8px_rgba(37,99,235,0.22)] flex flex-col justify-between overflow-hidden cursor-default">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-blue-600 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-100/50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100/90 text-blue-700 border border-blue-200/70 flex items-center justify-center font-extrabold text-base font-heading shadow-xs transition-all duration-300 ease-out group-hover:scale-110 group-hover:rotate-1 group-hover:bg-gradient-to-br group-hover:from-blue-600 group-hover:to-indigo-700 group-hover:text-white group-hover:border-blue-600 group-hover:shadow-lg group-hover:shadow-blue-500/30">
                    40+
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 group-hover:border-blue-200 group-hover:scale-110 transition-all duration-300">
                    <Layers className="w-4 h-4" />
                  </div>
                </div>

                <h4 className="font-bold text-base text-brand-navy font-heading group-hover:text-blue-700 transition-colors duration-200 mb-2">
                  Single Application
                </h4>
                <p className="text-xs text-brand-slate leading-relaxed group-hover:text-slate-700 transition-colors duration-200">
                  One complete document dossier evaluated across multiple banks without repeated CIBIL bureau damage.
                </p>
              </div>

              <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-semibold text-blue-700">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                <span>CIBIL Score Shielded</span>
              </div>
            </div>

            {/* Card 3: Legal & Technical Audit */}
            <div className="group relative bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 hover:border-amber-300 transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-[0_20px_35px_-8px_rgba(245,158,11,0.22)] flex flex-col justify-between overflow-hidden cursor-default">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-100/50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-100/90 text-amber-700 border border-amber-200/70 flex items-center justify-center font-extrabold text-base font-heading shadow-xs transition-all duration-300 ease-out group-hover:scale-110 group-hover:rotate-1 group-hover:bg-gradient-to-br group-hover:from-amber-500 group-hover:to-orange-600 group-hover:text-white group-hover:border-amber-500 group-hover:shadow-lg group-hover:shadow-amber-500/30">
                    100%
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-amber-600 group-hover:bg-amber-50 group-hover:border-amber-200 group-hover:scale-110 transition-all duration-300">
                    <FileSearch className="w-4 h-4" />
                  </div>
                </div>

                <h4 className="font-bold text-base text-brand-navy font-heading group-hover:text-amber-700 transition-colors duration-200 mb-2">
                  Legal &amp; Technical Audit
                </h4>
                <p className="text-xs text-brand-slate leading-relaxed group-hover:text-slate-700 transition-colors duration-200">
                  Pre-login title search and plan compliance verification to prevent rejection during legal clearance.
                </p>
              </div>

              <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-semibold text-amber-700">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                <span>Pre-Login Title Search</span>
              </div>
            </div>

            {/* Card 4: Dedicated Case Officer */}
            <div className="group relative bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 hover:border-teal-300 transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-[0_20px_35px_-8px_rgba(24,124,120,0.22)] flex flex-col justify-between overflow-hidden cursor-default">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-brand-teal to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-teal-100/50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-100/70 text-brand-teal border border-teal-200/70 flex items-center justify-center font-extrabold text-base font-heading shadow-xs transition-all duration-300 ease-out group-hover:scale-110 group-hover:rotate-1 group-hover:bg-gradient-to-br group-hover:from-brand-teal group-hover:to-teal-800 group-hover:text-white group-hover:border-brand-teal group-hover:shadow-lg group-hover:shadow-teal-500/30">
                    1:1
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-brand-teal group-hover:bg-teal-50 group-hover:border-teal-200 group-hover:scale-110 transition-all duration-300">
                    <UserCheck className="w-4 h-4" />
                  </div>
                </div>

                <h4 className="font-bold text-base text-brand-navy font-heading group-hover:text-brand-teal transition-colors duration-200 mb-2">
                  Dedicated Case Officer
                </h4>
                <p className="text-xs text-brand-slate leading-relaxed group-hover:text-slate-700 transition-colors duration-200">
                  Direct phone &amp; in-person coordination from application login until loan agreement execution.
                </p>
              </div>

              <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-semibold text-brand-teal">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-teal animate-pulse" />
                <span>Single Point of Contact</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
