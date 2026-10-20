import React from 'react';
import { ArrowRight, FileText, PhoneCall, SearchCheck, ClipboardCheck } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Share Your Requirements',
      desc: 'Submit basic property details, funding requirement, and preferred consultation schedule via our online form.',
      icon: <FileText className="w-5 h-5 text-brand-teal" />,
    },
    {
      number: '02',
      title: 'Initial Discussion',
      desc: 'Our advisory team connects with you at your chosen time slot to review income streams, property status, and goals.',
      icon: <PhoneCall className="w-5 h-5 text-brand-teal" />,
    },
    {
      number: '03',
      title: 'Explore Suitable Options',
      desc: 'We evaluate viable funding avenues across institutional lenders, detailing expected eligibility norms and paperwork.',
      icon: <SearchCheck className="w-5 h-5 text-brand-teal" />,
    },
    {
      number: '04',
      title: 'Application Guidance',
      desc: 'We assist you in organizing documentation cleanly for presentation to your chosen lending institution.',
      icon: <ClipboardCheck className="w-5 h-5 text-brand-teal" />,
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-brand-ivory border-t border-brand-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-3 py-1 rounded bg-brand-teal-light text-brand-teal text-xs font-bold uppercase tracking-wider mb-3">
            Structured Process
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-navy tracking-tight">
            How Our Consultation Works
          </h2>
          <p className="mt-4 text-brand-slate text-base sm:text-lg leading-relaxed">
            A straightforward, transparent four-step approach designed to bring clarity to your property financing journey.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-6 border border-brand-border shadow-subtle hover:shadow-card transition-all duration-200 relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-3xl font-extrabold text-brand-navy/20">
                    {step.number}
                  </span>
                  <div className="w-10 h-10 rounded-lg bg-brand-teal-light flex items-center justify-center">
                    {step.icon}
                  </div>
                </div>

                <h3 className="text-base font-bold text-brand-navy mb-2 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-sm text-brand-slate leading-relaxed">
                  {step.desc}
                </p>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 z-10 text-brand-teal/40">
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Clear Institutional Disclaimer */}
        <div className="mt-12 bg-white rounded-xl p-6 border border-brand-border/80 text-xs sm:text-sm text-brand-slate text-center max-w-3xl mx-auto leading-relaxed">
          <span className="font-semibold text-brand-navy">Lender Discretion: </span>
          Approval, interest rates, processing timelines, and final fund disbursement are strictly governed by the underwriting policies, legal title scrutiny, and independent valuation of the respective lending institution.
        </div>
      </div>
    </section>
  );
};
