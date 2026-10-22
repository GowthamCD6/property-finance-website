import React from 'react';
import { Link } from 'react-router-dom';
import {
  Building,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  FileSpreadsheet,
  Briefcase,
} from 'lucide-react';
import { EnquiryForm } from '../../components/public/EnquiryForm';
import { Service } from '../../types';
import { useOutletContext } from 'react-router-dom';

export const LoanAgainstPropertyPage: React.FC = () => {
  const context = useOutletContext<{ services?: Service[] }>();
  const services = context?.services || [];
  const lapService = services.find((s) => s.slug === 'loan-against-property') || null;

  const lapUseCases = [
    {
      title: 'Business Working Capital & Expansion',
      desc: 'Pledge self-owned registered residential or commercial property to infuse long-term liquidity into your business at secured interest rates.',
      highlights: ['Lower cost compared to unsecured business loans', 'Longer repayment tenures up to 15 years', 'Substantial borrowing headroom'],
    },
    {
      title: 'Commercial Real Estate Mortgages',
      desc: 'Obtaining mortgage debt against eligible commercial offices, industrial sheds, or retail spaces subject to title clear reports.',
      highlights: ['Appraisal based on commercial rental yield or market value', 'Corporate and individual ownership structures', 'Clear guidance on lease deed terms'],
    },
    {
      title: 'Debt Consolidation & Restructuring',
      desc: 'Replacing multiple high-interest short-term liabilities (personal loans, credit lines) with a single unified secured property loan.',
      highlights: ['Single consolidated monthly EMI', 'Improved monthly cash flow flexibility', 'Structured amortization schedule'],
    },
    {
      title: 'High-Value Personal Liquidity Needs',
      desc: 'Funding major life goals such as overseas higher education, family medical contingencies, or token advances for secondary acquisitions.',
      highlights: ['Retain complete property ownership', 'No restriction on legitimate end-use', 'Transparent processing benchmarks'],
    },
  ];

  return (
    <div>
      {/* 1. Page Hero Banner */}
      <section className="bg-brand-ivory border-b border-brand-border py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-brand-teal-light text-brand-teal text-xs font-bold uppercase tracking-wider mb-4">
              <Building className="w-4 h-4" />
              <span>Secured Mortgage Advisory</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-navy tracking-tight leading-tight">
              Loans Against Property (LAP) Guidance
            </h1>
            <p className="mt-4 text-brand-slate text-base sm:text-lg leading-relaxed">
              Unlock the latent liquidity in your unencumbered residential or commercial real estate with professional eligibility evaluation, realistic LTV benchmarks, and structured lender alignment.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#enquiry-form"
                className="px-6 py-3 bg-brand-teal hover:bg-brand-teal-hover text-white text-sm font-semibold rounded-corporate shadow-sm transition-colors flex items-center gap-2"
              >
                <span>Request LAP Assessment</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                to="/calculator"
                className="px-6 py-3 bg-white hover:bg-brand-ivory text-brand-navy border border-brand-border rounded-corporate text-sm font-semibold transition-colors"
              >
                Estimate Feasible EMI
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. LAP Funding Avenues */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-teal block mb-1">
              Collateral Liquidity
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight">
              Strategic Applications of Property Mortgage
            </h2>
            <p className="text-sm text-brand-slate mt-2">
              Unlike unsecured borrowing, loans against property provide access to higher ticket sizes and longer repayment horizons.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {lapUseCases.map((uc, idx) => (
              <div
                key={idx}
                className="p-6 bg-brand-ivory/50 rounded-xl border border-brand-border hover:border-brand-teal/40 transition-colors space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-teal text-white flex items-center justify-center font-bold text-xs">
                    0{idx + 1}
                  </div>
                  <h3 className="text-base font-bold text-brand-navy">{uc.title}</h3>
                </div>

                <p className="text-xs sm:text-sm text-brand-slate leading-relaxed">
                  {uc.desc}
                </p>

                <div className="space-y-1.5 pt-2 border-t border-brand-border/60">
                  {uc.highlights.map((h, hIdx) => (
                    <div key={hIdx} className="flex items-center gap-2 text-xs font-medium text-brand-navy">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-teal flex-shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Valuation & Critical Property Parameters */}
      <section className="py-16 bg-brand-teal-light/30 border-y border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-teal block mb-1">
              Critical Considerations
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight">
              Key Factors Lenders Evaluate for LAP
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs sm:text-sm">
            <div className="p-5 bg-white rounded-xl border border-brand-border shadow-subtle space-y-2">
              <span className="font-bold text-brand-navy block text-sm">Loan-to-Value (LTV)</span>
              <p className="text-brand-slate leading-relaxed text-xs">
                Lenders generally sanction between 50% to 65% of the property's verified distress market value, depending on property type and occupancy.
              </p>
            </div>

            <div className="p-5 bg-white rounded-xl border border-brand-border shadow-subtle space-y-2">
              <span className="font-bold text-brand-navy block text-sm">Title Freehold Status</span>
              <p className="text-brand-slate leading-relaxed text-xs">
                Clear marketable title chain (typically 30 years historical search report), up-to-date property tax receipts, and approved sanction plans.
              </p>
            </div>

            <div className="p-5 bg-white rounded-xl border border-brand-border shadow-subtle space-y-2">
              <span className="font-bold text-brand-navy block text-sm">Repayment Capacity</span>
              <p className="text-brand-slate leading-relaxed text-xs">
                Demonstrated cash flow via bank statements, ITR filings, and audited business accounts. Fixed obligation ratios must remain sustainable.
              </p>
            </div>

            <div className="p-5 bg-white rounded-xl border border-brand-border shadow-subtle space-y-2">
              <span className="font-bold text-brand-navy block text-sm">Property Occupancy</span>
              <p className="text-brand-slate leading-relaxed text-xs">
                Self-occupied, vacant, or rented spaces. Rented commercial properties may also qualify for lease rental discounting structures.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Enquiry Form Preloaded with LAP */}
      <EnquiryForm
        services={services}
        selectedService={lapService}
        onClearSelectedService={() => {}}
      />
    </div>
  );
};
