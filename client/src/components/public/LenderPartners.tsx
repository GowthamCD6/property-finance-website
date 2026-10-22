import React, { useState } from 'react';
import { Award, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LenderPartners: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'psu' | 'private' | 'nbfc'>('all');

  const partners = [
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

  const filteredPartners = selectedCategory === 'all'
    ? partners
    : partners.filter((p) => p.category === selectedCategory);

  return (
    <section className="pt-2 sm:pt-3 pb-14 sm:pb-16 bg-transparent border-b border-brand-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-teal-light text-brand-teal text-xs font-bold tracking-wider uppercase mb-3 shadow-xs">
            <Award className="w-3.5 h-3.5" />
            <span>Multi-Lender Access</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-navy tracking-tight font-heading">
            Direct Channel Advisory with India’s Leading Lenders
          </h2>
          <p className="mt-3 text-sm sm:text-base text-brand-slate leading-relaxed">
            We partner with 40+ leading public sector banks, private financial institutions, and housing finance companies (HFCs) to evaluate and secure the most cost-effective loan terms for your specific property.
          </p>

          {/* Interactive Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {[
              { id: 'all', label: 'All Lenders (10)' },
              { id: 'psu', label: 'Public Sector Banks' },
              { id: 'private', label: 'Premier Private Banks' },
              { id: 'nbfc', label: 'NBFCs & Housing Finance' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCategory(tab.id as any)}
                className={`text-xs font-semibold px-4 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                  selectedCategory === tab.id
                    ? 'bg-brand-navy text-white shadow-sm'
                    : 'bg-white text-brand-slate hover:text-brand-navy hover:bg-slate-100 border border-brand-border/70'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic & Premium Partners Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4.5">
          {filteredPartners.map((p) => (
            <Link
              key={p.id}
              to={`/enquire?lender=${encodeURIComponent(p.name)}`}
              className="group relative bg-white p-4 sm:p-5 rounded-2xl border border-brand-border/80 hover:border-transparent flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl overflow-hidden cursor-pointer no-underline block"
              style={{
                boxShadow: '0 2px 10px rgba(24, 50, 71, 0.04)',
              }}
            >
              {/* Top Accent Stripe on Hover with Brand Color */}
              <div
                className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ backgroundColor: p.accentColor }}
              />

              {/* Subtle Radial Gradient Glow on Hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
                style={{
                  background: `radial-gradient(circle at top right, ${p.accentColor}12, transparent 65%)`,
                }}
              />

              <div>
                {/* Top Bar: Official Bank Logo Image + Category + Action Icon */}
                <div className="flex items-start justify-between gap-2.5 mb-3.5 relative z-10">
                  <div className="w-12 h-12 rounded-xl p-2 bg-white border border-slate-100 shadow-xs flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:shadow-md transition-all duration-300">
                    <img
                      src={p.logoUrl}
                      alt={`${p.name} official logo`}
                      className="max-w-full max-h-full object-contain"
                      loading="lazy"
                    />
                  </div>

                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-100/90 text-slate-600 group-hover:bg-slate-200/80 transition-colors">
                      {p.short}
                    </span>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-slate-300 group-hover:text-brand-teal group-hover:bg-brand-teal-light transition-all">
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>
                </div>

                {/* Bank Name & Category Subtitle */}
                <div className="relative z-10">
                  <h3 className="font-bold text-sm sm:text-[15px] text-brand-navy tracking-tight leading-snug group-hover:text-brand-teal transition-colors font-heading">
                    {p.name}
                  </h3>
                  <span className="text-[11px] text-brand-slate block mt-0.5 font-medium">
                    {p.type}
                  </span>
                </div>

                {/* Highlighted Benchmark Rate Chip */}
                <div className="mt-3 bg-brand-ivory/60 rounded-xl px-2.5 py-1.5 border border-brand-border/60 flex items-center justify-between relative z-10 group-hover:bg-white group-hover:border-brand-teal/30 transition-colors">
                  <span className="text-[11px] text-brand-slate font-medium">
                    Home Loan
                  </span>
                  <span className="text-xs sm:text-[13px] font-extrabold text-brand-navy font-heading group-hover:text-brand-teal transition-colors">
                    {p.ratesFrom}*
                  </span>
                </div>
              </div>

              {/* Key Advantage / Perk Pill Badge */}
              <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] relative z-10">
                <span className="inline-flex items-center gap-1.5 text-emerald-800 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg text-[10.5px] border border-emerald-100/80 tracking-tight">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span className="truncate">{p.badge}</span>
                </span>
              </div>
            </Link>
          ))}
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
