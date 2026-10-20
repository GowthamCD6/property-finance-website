import React from 'react';
import { ShieldCheck, Award, CheckCircle2, Building, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LenderPartners: React.FC = () => {
  const partners = [
    {
      name: 'State Bank of India',
      short: 'SBI',
      type: 'Public Sector Bank',
      ratesFrom: '8.40%*',
      badge: 'Lowest Benchmark Rate',
    },
    {
      name: 'HDFC Bank',
      short: 'HDFC',
      type: 'Premier Private Bank',
      ratesFrom: '8.55%*',
      badge: 'Fast Digital Sanction',
    },
    {
      name: 'ICICI Bank',
      short: 'ICICI',
      type: 'Premier Private Bank',
      ratesFrom: '8.60%*',
      badge: 'High LTV Flexibility',
    },
    {
      name: 'Axis Bank',
      short: 'AXIS',
      type: 'Private Bank',
      ratesFrom: '8.65%*',
      badge: 'Balance Transfer Perks',
    },
    {
      name: 'Kotak Mahindra Bank',
      short: 'KOTAK',
      type: 'Private Bank',
      ratesFrom: '8.60%*',
      badge: 'Custom LAP Structuring',
    },
    {
      name: 'Bank of Baroda',
      short: 'BOB',
      type: 'Public Sector Bank',
      ratesFrom: '8.45%*',
      badge: 'Low Processing Fees',
    },
    {
      name: 'Bajaj Finserv',
      short: 'BAJAJ',
      type: 'Regulated NBFC',
      ratesFrom: '9.25%*',
      badge: 'High-Ticket Flexibility',
    },
    {
      name: 'Tata Capital',
      short: 'TATA',
      type: 'Corporate NBFC',
      ratesFrom: '9.30%*',
      badge: 'MSME Working Capital',
    },
    {
      name: 'PNB Housing Finance',
      short: 'PNB HFL',
      type: 'Housing Finance Co.',
      ratesFrom: '8.65%*',
      badge: 'Self-Construction Expert',
    },
    {
      name: 'LIC Housing Finance',
      short: 'LIC HFL',
      type: 'Housing Finance Co.',
      ratesFrom: '8.50%*',
      badge: 'Long 30-Yr Tenures',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-brand-ivory/60 border-b border-brand-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-brand-teal-light text-brand-teal text-xs font-bold tracking-wider uppercase mb-3">
            <Award className="w-3.5 h-3.5" />
            <span>Multi-Lender Access</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-navy tracking-tight">
            Direct Channel Advisory with India’s Leading Lenders
          </h2>
          <p className="mt-3 text-sm sm:text-base text-brand-slate leading-relaxed">
            We partner with 40+ leading public sector banks, private financial institutions, and housing finance companies (HFCs) to evaluate and secure the most cost-effective loan terms for your specific property.
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {partners.map((p, idx) => (
            <div
              key={idx}
              className="bg-white p-4 sm:p-5 rounded-xl border border-brand-border hover:border-brand-teal/40 hover:shadow-card transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-brand-ivory text-brand-slate group-hover:bg-brand-teal-light group-hover:text-brand-teal transition-colors">
                    {p.type}
                  </span>
                  <Building className="w-4 h-4 text-gray-300 group-hover:text-brand-teal transition-colors" />
                </div>
                <h3 className="font-bold text-sm sm:text-base text-brand-navy tracking-tight group-hover:text-brand-teal transition-colors">
                  {p.name}
                </h3>
                <span className="text-xs text-brand-slate mt-1 block">
                  Home Loan from <span className="font-semibold text-brand-navy">{p.ratesFrom}</span>
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px]">
                <span className="text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded text-[10px]">
                  {p.badge}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Four Core Ethical Commitments */}
        <div className="mt-12 bg-white rounded-2xl border border-brand-border p-6 sm:p-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
            <div className="flex flex-col items-center md:items-start space-y-1.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm mb-1">
                ₹0
              </div>
              <h4 className="font-bold text-sm text-brand-navy">Zero Upfront Fees</h4>
              <p className="text-xs text-brand-slate leading-relaxed">
                We never charge advance advisory fees. All processing fees are paid directly to the lending institution.
              </p>
            </div>

            <div className="flex flex-col items-center md:items-start space-y-1.5 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-sm mb-1">
                40+
              </div>
              <h4 className="font-bold text-sm text-brand-navy">Single Application</h4>
              <p className="text-xs text-brand-slate leading-relaxed">
                One complete document dossier evaluated across multiple banks without repeated CIBIL bureau damage.
              </p>
            </div>

            <div className="flex flex-col items-center md:items-start space-y-1.5 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-sm mb-1">
                100%
              </div>
              <h4 className="font-bold text-sm text-brand-navy">Legal &amp; Technical Audit</h4>
              <p className="text-xs text-brand-slate leading-relaxed">
                Pre-login title search and plan compliance verification to prevent rejection during legal clearance.
              </p>
            </div>

            <div className="flex flex-col items-center md:items-start space-y-1.5 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-brand-teal flex items-center justify-center font-bold text-sm mb-1">
                1:1
              </div>
              <h4 className="font-bold text-sm text-brand-navy">Dedicated Case Officer</h4>
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
