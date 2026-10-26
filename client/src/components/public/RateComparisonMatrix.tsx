import React, { useState } from 'react';
import { ArrowRight, HelpCircle, CheckCircle, Percent, SlidersHorizontal, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LenderRateRow {
  lender: string;
  category: 'Public Bank' | 'Private Bank' | 'HFC / NBFC';
  homeLoanRate: string;
  lapRate: string;
  maxTenureHL: string;
  maxTenureLAP: string;
  maxLtv: string;
  processingFee: string;
}

export const RateComparisonMatrix: React.FC = () => {
  const [filterCategory, setFilterCategory] = useState<'All' | 'Public Bank' | 'Private Bank' | 'HFC / NBFC'>('All');
  const [activeTab, setActiveTab] = useState<'home' | 'lap'>('home');

  const rateData: LenderRateRow[] = [
    {
      lender: 'State Bank of India (SBI)',
      category: 'Public Bank',
      homeLoanRate: '8.40% – 9.15%',
      lapRate: '9.35% – 10.45%',
      maxTenureHL: '30 Years',
      maxTenureLAP: '15 Years',
      maxLtv: 'Up to 80% (HL) / 65% (LAP)',
      processingFee: '0.35% (Min ₹2,000 to Max ₹10,000)',
    },
    {
      lender: 'HDFC Bank',
      category: 'Private Bank',
      homeLoanRate: '8.55% – 9.40%',
      lapRate: '9.50% – 10.75%',
      maxTenureHL: '30 Years',
      maxTenureLAP: '15 Years',
      maxLtv: 'Up to 80% (HL) / 70% (LAP)',
      processingFee: '0.50% of loan amount or ₹3,000',
    },
    {
      lender: 'ICICI Bank',
      category: 'Private Bank',
      homeLoanRate: '8.60% – 9.50%',
      lapRate: '9.60% – 10.90%',
      maxTenureHL: '30 Years',
      maxTenureLAP: '15 Years',
      maxLtv: 'Up to 80% (HL) / 70% (LAP)',
      processingFee: '0.50% to 1.00% + GST',
    },
    {
      lender: 'Bank of Baroda',
      category: 'Public Bank',
      homeLoanRate: '8.45% – 9.20%',
      lapRate: '9.40% – 10.50%',
      maxTenureHL: '30 Years',
      maxTenureLAP: '15 Years',
      maxLtv: 'Up to 85% (HL) / 60% (LAP)',
      processingFee: '0.25% to 0.50% (Capped)',
    },
    {
      lender: 'Kotak Mahindra Bank',
      category: 'Private Bank',
      homeLoanRate: '8.60% – 9.45%',
      lapRate: '9.65% – 10.85%',
      maxTenureHL: '25 Years',
      maxTenureLAP: '15 Years',
      maxLtv: 'Up to 75% (HL) / 65% (LAP)',
      processingFee: '0.50% + GST',
    },
    {
      lender: 'Axis Bank',
      category: 'Private Bank',
      homeLoanRate: '8.65% – 9.60%',
      lapRate: '9.75% – 11.00%',
      maxTenureHL: '30 Years',
      maxTenureLAP: '15 Years',
      maxLtv: 'Up to 80% (HL) / 65% (LAP)',
      processingFee: 'Up to 1.00% or ₹10,000 min',
    },
    {
      lender: 'LIC Housing Finance',
      category: 'HFC / NBFC',
      homeLoanRate: '8.50% – 9.40%',
      lapRate: '9.55% – 10.75%',
      maxTenureHL: '30 Years',
      maxTenureLAP: '15 Years',
      maxLtv: 'Up to 85% (HL) / 60% (LAP)',
      processingFee: '0.25% to 0.50%',
    },
    {
      lender: 'Bajaj Finserv',
      category: 'HFC / NBFC',
      homeLoanRate: '8.80% – 10.50%',
      lapRate: '9.75% – 12.00%',
      maxTenureHL: '30 Years',
      maxTenureLAP: '18 Years',
      maxLtv: 'Up to 75% (HL) / 75% (LAP)',
      processingFee: 'Up to 1.50% + GST',
    },
  ];

  const filtered = filterCategory === 'All'
    ? rateData
    : rateData.filter((r) => r.category === filterCategory);

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-brand-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-brand-teal-light text-brand-teal text-xs font-bold tracking-wider uppercase mb-3">
              <Percent className="w-3.5 h-3.5" />
              <span>Multi-Lender Comparison</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight">
              Indicative Interest Rate &amp; Terms Matrix
            </h2>
            <p className="mt-2 text-sm sm:text-base text-brand-slate">
              Compare current floating benchmark rates across prominent public banks, private lenders, and housing finance companies.
            </p>
          </div>

          {/* Product Switcher */}
          <div className="flex items-center p-1 bg-brand-ivory border border-brand-border rounded-xl self-start md:self-auto">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors ${
                activeTab === 'home'
                  ? 'bg-brand-teal text-white shadow-sm'
                  : 'text-brand-navy hover:text-brand-teal'
              }`}
            >
              Home Loans
            </button>
            <button
              onClick={() => setActiveTab('lap')}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors ${
                activeTab === 'lap'
                  ? 'bg-brand-teal text-white shadow-sm'
                  : 'text-brand-navy hover:text-brand-teal'
              }`}
            >
              Loan Against Property (LAP)
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 text-xs select-none">
          <span className="text-brand-slate font-semibold flex items-center gap-1 mr-2">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Filter:
          </span>
          {(['All', 'Public Bank', 'Private Bank', 'HFC / NBFC'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-full border transition-colors whitespace-nowrap ${
                filterCategory === cat
                  ? 'bg-brand-navy text-white border-brand-navy font-semibold'
                  : 'bg-white text-brand-slate border-gray-200 hover:border-brand-teal'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto rounded-xl border border-brand-border shadow-sm">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-brand-navy text-white text-xs uppercase tracking-wider font-semibold">
                <th className="py-4 px-4 sm:px-6">Lender Name &amp; Category</th>
                <th className="py-4 px-4 sm:px-6">
                  {activeTab === 'home' ? 'Home Loan Rate (p.a.)*' : 'LAP Rate (p.a.)*'}
                </th>
                <th className="py-4 px-4 sm:px-6">Max Tenure</th>
                <th className="py-4 px-4 sm:px-6">Indicative LTV</th>
                <th className="py-4 px-4 sm:px-6">Est. Processing Fee</th>
                <th className="py-4 px-4 sm:px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filtered.map((item, idx) => (
                <tr key={idx} className="hover:bg-brand-ivory/50 transition-colors">
                  <td className="py-4 px-4 sm:px-6 font-semibold text-brand-navy">
                    <div>{item.lender}</div>
                    <span className="text-[10px] uppercase font-bold text-brand-slate bg-gray-100 px-2 py-0.5 rounded mt-1 inline-block">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-4 px-4 sm:px-6 font-bold text-brand-teal text-sm sm:text-base">
                    {activeTab === 'home' ? item.homeLoanRate : item.lapRate}
                  </td>
                  <td className="py-4 px-4 sm:px-6 text-brand-slate">
                    {activeTab === 'home' ? item.maxTenureHL : item.maxTenureLAP}
                  </td>
                  <td className="py-4 px-4 sm:px-6 text-brand-slate">{item.maxLtv}</td>
                  <td className="py-4 px-4 sm:px-6 text-brand-slate text-xs">{item.processingFee}</td>
                  <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                    <Link
                      to="/enquire"
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-brand-teal-light text-brand-teal hover:bg-brand-teal hover:text-white rounded-corporate text-xs font-semibold transition-colors"
                    >
                      <span>Check Suitability</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Compliance Footer */}
        <div className="mt-4 p-4 rounded-xl bg-brand-ivory border border-brand-border/80 flex items-start gap-3 text-xs text-brand-slate">
          <ShieldAlert className="w-4 h-4 text-brand-teal flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed text-[11px] sm:text-xs">
            <strong>Advisory Notice &amp; Compliance:</strong> Prime Associate Loans is an authorized loan advisor and corporate channel liaison. Rates presented are indicative published floating rates linked to EBLR / Repo Rate as of Q4 2024. Final interest rate, sanction amount, and legal eligibility depend strictly on lender underwriting policy, CIBIL score (&gt;750 preferred), title clearance, and property valuation. No guarantee of interest rate or approval is implied.
          </p>
        </div>
      </div>
    </section>
  );
};
