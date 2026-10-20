import React from 'react';
import { ArrowRight, FileText, Smartphone, ShieldCheck, CheckCircle2, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: '3-Minute Digital Application',
      desc: 'Submit your contact details, funding amount, and property context via our simple online interface. Zero paperwork to get started.',
      tag: 'Instant Pre-Check',
      icon: <Smartphone className="w-5 h-5 text-brand-teal" />,
    },
    {
      number: '02',
      title: 'Digital KYC & Income Audit',
      desc: 'Our automated surrogate checks assess salary/ITR banking statements and calculate your precise maximum permissible loan headroom.',
      tag: 'Paperless Review',
      icon: <FileText className="w-5 h-5 text-brand-teal" />,
    },
    {
      number: '03',
      title: 'Legal & Title Scrutiny',
      desc: 'Certified panel advocates conduct an unhindered 30-year parent deed and municipal approval search to ensure zero legal clearance hurdles.',
      tag: 'Zero-Risk Title Check',
      icon: <ShieldCheck className="w-5 h-5 text-brand-teal" />,
    },
    {
      number: '04',
      title: 'Sanction & 24–48h Disbursement',
      desc: 'Receive your formal multi-lender sanction letters with transparent EBLR/RLLR rates, followed by rapid fund transfer to your account.',
      tag: 'Fast-Track Payout',
      icon: <Zap className="w-5 h-5 text-brand-teal" />,
    },
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-20 bg-brand-ivory/60 border-t border-brand-border/60">
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-brand-teal-light text-brand-teal text-xs font-bold uppercase tracking-wider mb-3">
            <Zap className="w-3.5 h-3.5" />
            <span>Digital-First Processing</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-navy tracking-tight">
            How Your Loan Gets Approved in 4 Simple Steps
          </h2>
          <p className="mt-3 text-sm sm:text-base text-brand-slate leading-relaxed">
            Eliminate endless bank branch visits. Our streamlined digital workflow fast-tracks your loan from initial eligibility check to direct fund disbursement.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 sm:p-7 border border-brand-border shadow-subtle hover:shadow-card hover:border-brand-teal/40 transition-all duration-200 relative flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="text-3xl font-extrabold text-brand-navy/20 group-hover:text-brand-teal/30 transition-colors font-mono">
                    {step.number}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-brand-teal-light text-brand-teal group-hover:bg-brand-teal group-hover:text-white transition-colors flex items-center justify-center">
                    {step.icon}
                  </div>
                </div>

                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded inline-block mb-3">
                  {step.tag}
                </span>

                <h3 className="text-base sm:text-lg font-bold text-brand-navy mb-2 tracking-tight group-hover:text-brand-teal transition-colors">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-brand-slate leading-relaxed">
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

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            to="/enquire"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-brand-teal hover:bg-brand-teal-hover text-white text-xs sm:text-sm font-bold rounded-corporate shadow-sm transition-all"
          >
            <span>Start Your 3-Minute Digital Application</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
