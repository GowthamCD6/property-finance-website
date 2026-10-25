import React from 'react';
import { Briefcase, CheckCircle2, TrendingUp, Building2, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CaseStudiesSection: React.FC = () => {
  const caseStudies = [
    {
      badge: 'MSME Working Capital',
      title: '₹1.65 Cr Loan Against Property (LAP)',
      client: 'Precision CNC Engineering Firm, Bengaluru',
      challenge:
        'Client needed urgent liquidity to procure raw materials for an export order. Earlier direct bank approach was stalled due to multi-partner firm structure and 3 distinct revenue streams across 2 GST accounts.',
      solution:
        'Our advisory team conducted a comprehensive cash flow audit, prepared a consolidated banking surrogate assessment, and matched the file with an institutional bank offering 65% LTV on self-occupied industrial property.',
      metrics: [
        { label: 'Sanctioned Amount', value: '₹1.65 Crore' },
        { label: 'Interest Rate', value: '9.45% p.a. (Floating)' },
        { label: 'Turnaround Time', value: '11 Business Days' },
        { label: 'Collateral Type', value: 'Industrial Unit' },
      ],
    },
    {
      badge: 'Complex Salaried + Freelance',
      title: '₹92 Lakh Home Loan with Top-Up',
      client: 'Senior IT Consultant, Bengaluru',
      challenge:
        'Borrower had a base salary plus quarterly offshore consultancy payments into a separate foreign currency account. Standard online bank algorithms rejected the application citing inconsistent net monthly inflows.',
      solution:
        'We audited 24 months of Form 16, 26AS, foreign remittance certificates (FIRC), and tax filings to establish verifiable average earnings, securing approval from a leading private bank.',
      metrics: [
        { label: 'Sanctioned Amount', value: '₹92 Lakhs' },
        { label: 'Tenure', value: '25 Years' },
        { label: 'Benchmark Rate', value: '8.55% p.a.' },
        { label: 'Sanction Speed', value: '6 Working Days' },
      ],
    },
    {
      badge: 'Commercial Real Estate',
      title: '₹4.80 Cr Lease Rental Discounting (LRD)',
      client: 'Commercial Property Investor, Karnataka',
      challenge:
        'Asset owner sought to monetize future lease receivables of an 18,000 sq.ft tenanted commercial floor to acquire another residential land parcel, requiring clean tripartite escrow structuring.',
      solution:
        'We structured a compliant LRD facility with a scheduled commercial bank, establishing a rent escrow mechanism and securing favorable pre-payment terms without early foreclosure penalties.',
      metrics: [
        { label: 'Sanctioned Amount', value: '₹4.80 Crore' },
        { label: 'Discounting Period', value: '9 Years' },
        { label: 'Interest Rate', value: '9.20% p.a.' },
        { label: 'Tenanted Tenant', value: 'MNC Software Co.' },
      ],
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-brand-ivory/50 border-b border-brand-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-brand-teal-light text-brand-teal text-xs font-bold tracking-wider uppercase mb-3">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Advisory Track Record</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-navy tracking-tight font-heading">
            Recent Advisory Sanctions
          </h2>
          <p className="mt-2.5 text-sm sm:text-base text-brand-slate leading-relaxed">
            Real case summaries illustrating how structured multi-lender evaluation resolves complex eligibility and high-ticket funding hurdles.
          </p>
        </div>

        {/* Case Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {caseStudies.map((cs, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-brand-border p-6 sm:p-7 flex flex-col justify-between shadow-card hover:border-brand-teal/40 transition-all duration-200"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-brand-teal bg-brand-teal-light px-2.5 py-1 rounded">
                    {cs.badge}
                  </span>
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </div>

                <h3 className="text-lg sm:text-xl font-extrabold text-brand-navy tracking-tight mb-1">
                  {cs.title}
                </h3>
                <span className="text-xs font-medium text-brand-slate block mb-4 pb-3 border-b border-gray-100">
                  {cs.client}
                </span>

                <div className="space-y-3.5 text-xs text-brand-slate leading-relaxed">
                  <div>
                    <strong className="text-brand-navy block mb-1 font-semibold">The Hurdle:</strong>
                    <p>{cs.challenge}</p>
                  </div>
                  <div>
                    <strong className="text-brand-navy block mb-1 font-semibold">Our Advisory Action:</strong>
                    <p>{cs.solution}</p>
                  </div>
                </div>
              </div>

              {/* Metrics Box */}
              <div className="mt-6 pt-5 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-3 bg-brand-ivory/70 p-3.5 rounded-xl border border-brand-border/60">
                  {cs.metrics.map((m, mIdx) => (
                    <div key={mIdx}>
                      <span className="text-[10px] uppercase font-bold text-brand-slate block">
                        {m.label}
                      </span>
                      <span className="text-xs font-extrabold text-brand-navy block mt-0.5">
                        {m.value}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 text-center">
                  <Link
                    to="/enquire"
                    className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-brand-teal hover:text-brand-teal-hover transition-colors"
                  >
                    <span>Discuss Similar Requirement</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
