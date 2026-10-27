import React from 'react';
import { ArrowRight, FileText, Smartphone, ShieldCheck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: '3-Minute Digital Application',
      desc: 'Submit your contact details, funding amount, and property context via our simple online interface. Zero paperwork to get started.',
      tag: 'Instant Pre-Check',
      icon: <Smartphone className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />,
    },
    {
      number: '02',
      title: 'Digital KYC & Income Audit',
      desc: 'Our automated surrogate checks assess salary/ITR banking statements and calculate your precise maximum permissible loan headroom.',
      tag: 'Paperless Review',
      icon: <FileText className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />,
    },
    {
      number: '03',
      title: 'Legal & Title Scrutiny',
      desc: 'Certified panel advocates conduct an unhindered 30-year parent deed and municipal approval search to ensure zero legal clearance hurdles.',
      tag: 'Zero-Risk Title Check',
      icon: <ShieldCheck className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />,
    },
    {
      number: '04',
      title: 'Sanction & 24–48h Disbursement',
      desc: 'Receive your formal multi-lender sanction letters with transparent EBLR/RLLR rates, followed by rapid fund transfer to your account.',
      tag: 'Fast-Track Payout',
      icon: <Zap className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />,
    },
  ];

  return (
    <section id="how-it-works" className="py-12 sm:py-16 bg-[#f8f8f4]">
      <div className="w-[85%] max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-teal-light text-brand-teal text-xs font-bold uppercase tracking-wider mb-3">
            <Zap className="w-3.5 h-3.5" />
            <span>Digital-First Processing</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-navy tracking-tight font-heading">
            How Your Loan Gets Approved in 4 Simple Steps
          </h2>
          <p className="mt-2.5 text-sm sm:text-base text-brand-slate leading-relaxed">
            A structured advisory workflow that fast-tracks your loan from initial eligibility check to direct fund disbursement.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="group relative bg-white rounded-3xl p-6 sm:p-7 border border-brand-border/80 hover:border-brand-teal/60 shadow-subtle hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="text-3xl font-black text-slate-200 group-hover:text-brand-teal/40 transition-colors duration-300 font-mono tracking-tighter">
                    {step.number}
                  </span>
                  <div className="w-11 h-11 rounded-2xl bg-brand-teal-light text-brand-teal group-hover:bg-brand-teal group-hover:text-white transition-all duration-300 flex items-center justify-center shadow-xs group-hover:shadow-md group-hover:shadow-brand-teal/25">
                    {step.icon}
                  </div>
                </div>

                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full inline-block mb-3 border border-emerald-200/50">
                  {step.tag}
                </span>

                <h3 className="text-base sm:text-lg font-bold text-brand-navy mb-2 tracking-tight group-hover:text-brand-teal transition-colors duration-200 font-heading">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-brand-slate leading-relaxed group-hover:text-slate-600 transition-colors duration-200">
                  {step.desc}
                </p>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden lg:flex items-center justify-center absolute -right-4 translate-x-1/2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white border border-brand-teal/30 shadow-md text-brand-teal group-hover:bg-brand-teal group-hover:text-white group-hover:border-brand-teal group-hover:scale-110 transition-all duration-300 pointer-events-none">
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            to="/enquire"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-brand-teal hover:bg-brand-teal-hover text-white text-xs sm:text-sm font-bold rounded-corporate shadow-sm transition-all btn-primary-glow shimmer-effect"
          >
            <span>Start Your 3-Minute Digital Application</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }

        .shimmer-effect {
          position: relative;
          overflow: hidden;
        }
        .shimmer-effect::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 50%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent);
          transform: skewX(-20deg);
          animation: shimmer 4s infinite;
        }

        .btn-primary-glow {
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .btn-primary-glow:hover {
          transform: translateY(-1.5px);
          box-shadow: 0 8px 20px -4px rgba(24, 124, 120, 0.35);
        }
      `}</style>
    </section>
  );
};
