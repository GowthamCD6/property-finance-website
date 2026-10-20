import React from 'react';
import { Star, CheckCircle, Quote, Building2, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TestimonialsSection: React.FC = () => {
  const reviews = [
    {
      name: 'Shyamsundar Chaure',
      role: 'Self-Employed Professional',
      location: 'Bengaluru, Karnataka',
      product: 'Home Construction Loan',
      rating: 5,
      content:
        'Constructing a home on our family plot was our dream for over 5 years. With multiple banks delaying over layout approvals, Vardhan Finance audited our document chain, aligned with the right lender, and expedited tranche sanction in just 10 days.',
      amount: '₹65 Lakhs Sanctioned',
      highlight: 'Turned dream into reality without hassle',
    },
    {
      name: 'Naresh Ganesh Shelar',
      role: 'MSME Manufacturing Owner',
      location: 'Whitefield, Bengaluru',
      product: 'Loan Against Property (LAP)',
      rating: 5,
      content:
        'I availed a loan against our industrial shed to expand production and purchase raw materials. The entire documentation process was digital, transparent, and completely structured. No hidden fees or unexpected broker cuts. Outstanding advisory!',
      amount: '₹1.80 Crore Sanctioned',
      highlight: 'Smooth, fast & transparent working capital',
    },
    {
      name: 'Priyanka & Rajesh Menon',
      role: 'Senior IT Consultants',
      location: 'Sarjapur Road, Bengaluru',
      product: 'Resale Home Loan + Top-Up',
      rating: 5,
      content:
        'Our apartment purchase involved a complex seller balance transfer and tripartite bank escrow. The team guided us step-by-step through title clearance and secured the lowest repo-linked floating rate at 8.45%. Highly recommended!',
      amount: '₹95 Lakhs Sanctioned',
      highlight: 'Complex legal title scrutiny resolved',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-brand-ivory/60 border-b border-brand-border/60">
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-brand-teal-light text-brand-teal text-xs font-bold tracking-wider uppercase mb-3">
            <Star className="w-3.5 h-3.5 fill-brand-teal" />
            <span>Verified Customer Stories</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-navy tracking-tight">
            Trusted by 1,000+ Indian Homebuyers &amp; Entrepreneurs
          </h2>
          <p className="mt-3 text-sm sm:text-base text-brand-slate leading-relaxed">
            Read authentic feedback from families and business owners who secured prompt sanctions through our transparent multi-lender advisory.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
          {reviews.map((r, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 sm:p-7 border border-brand-border shadow-card hover:border-brand-teal/40 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Rating & Product Tag */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(r.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-brand-teal-light text-brand-teal">
                    {r.product}
                  </span>
                </div>

                {/* Highlight Quote */}
                <h3 className="font-extrabold text-sm sm:text-base text-brand-navy tracking-tight mb-3">
                  "{r.highlight}"
                </h3>

                <p className="text-xs sm:text-sm text-brand-slate leading-relaxed mb-6">
                  {r.content}
                </p>
              </div>

              {/* Author Footer */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs sm:text-sm text-brand-navy block">
                    {r.name}
                  </span>
                  <span className="text-[11px] text-brand-slate flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-brand-teal" />
                    {r.location}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-1 rounded block">
                    {r.amount}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
