import React from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  FileCheck,
  Building2,
  Landmark,
} from 'lucide-react';
import { EnquiryForm } from '../../components/public/EnquiryForm';
import { Service } from '../../types';
import { useOutletContext } from 'react-router-dom';

export const PropertyFundingPage: React.FC = () => {
  const context = useOutletContext<{ services?: Service[] }>();
  const services = context?.services || [];
  const fundingService = services.find((s) => s.slug === 'property-backed-funding') || null;

  const fundingSolutions = [
    {
      title: 'Lease Rental Discounting (LRD)',
      desc: 'Monetize predictable future lease rental streams from long-term institutional tenants occupying your commercial or industrial real estate.',
      highlights: ['Discounting based on tripartite agreement with reputed corporate tenants', 'Tenures mapped up to residual lease lock-in periods', 'Competitive commercial borrowing rates'],
    },
    {
      title: 'High-Value Commercial Real Estate Expansion',
      desc: 'Bespoke debt packaging for business entities seeking to acquire additional commercial land, warehousing, or manufacturing facilities.',
      highlights: ['Structured debt amortization profiles', 'Collateral assessment against industrial or commercial assets', 'Cash-flow and debt-service coverage ratio (DSCR) modeling'],
    },
    {
      title: 'Construction Finance Advisory for Developers',
      desc: 'Guidance on project loan packaging for RERA-registered residential and commercial developers with verifiable project viability.',
      highlights: ['Escrow and milestone disbursement oversight', 'Preliminary financial model review', 'Institutional underwriting facilitation'],
    },
  ];

  return (
    <div>
      {/* 1. Hero Banner */}
      <section className="bg-brand-ivory border-b border-brand-border py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-brand-teal-light text-brand-teal text-xs font-bold uppercase tracking-wider mb-4">
              <Briefcase className="w-4 h-4" />
              <span>Commercial Real Estate Finance</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-navy tracking-tight leading-tight">
              Property-Backed Funding &amp; Commercial Advisory
            </h1>
            <p className="mt-4 text-brand-slate text-base sm:text-lg leading-relaxed">
              Assisting mid-to-large business entities, commercial landlords, and enterprises with structured real estate debt, lease rental discounting (LRD), and capital deployment.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#enquiry-form"
                className="px-6 py-3 bg-brand-teal hover:bg-brand-teal-hover text-white text-sm font-semibold rounded-corporate shadow-sm transition-colors flex items-center gap-2"
              >
                <span>Request Commercial Assessment</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                to="/how-it-works"
                className="px-6 py-3 bg-white hover:bg-brand-ivory text-brand-navy border border-brand-border rounded-corporate text-sm font-semibold transition-colors"
              >
                Review Process &amp; Guidelines
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Structured Solutions */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-teal block mb-1">
              Institutional Products
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight">
              Structured Capital for Commercial Assets
            </h2>
            <p className="text-sm text-brand-slate mt-2">
              Large-ticket property funding requires disciplined financial modeling, tenant profile scrutiny, and precise lender matching.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {fundingSolutions.map((sol, idx) => (
              <div
                key={idx}
                className="p-6 bg-brand-ivory/50 rounded-xl border border-brand-border hover:border-brand-teal/40 transition-colors flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="w-8 h-8 rounded-lg bg-brand-teal text-white flex items-center justify-center font-bold text-xs mb-3">
                    0{idx + 1}
                  </div>
                  <h3 className="text-base font-bold text-brand-navy mb-2">{sol.title}</h3>
                  <p className="text-xs sm:text-sm text-brand-slate leading-relaxed">
                    {sol.desc}
                  </p>
                </div>

                <div className="space-y-1.5 pt-3 border-t border-brand-border/60">
                  {sol.highlights.map((h, hIdx) => (
                    <div key={hIdx} className="flex items-start gap-2 text-xs font-medium text-brand-navy">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-teal flex-shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Enquiry Form Preloaded */}
      <EnquiryForm
        services={services}
        selectedService={fundingService}
        onClearSelectedService={() => {}}
      />
    </div>
  );
};
