import React from 'react';
import { Target, FileSpreadsheet, ShieldCheck, HelpCircle, Layers } from 'lucide-react';
import { SiteContent } from '../../../types';

interface WhyWorkWithUsProps {
  content?: SiteContent | null;
}

export const WhyWorkWithUs: React.FC<WhyWorkWithUsProps> = ({ content }) => {
  const aboutHeading =
    content?.aboutHeading || 'Prime Associates — Loans & Constructions';
  const aboutText =
    content?.aboutText ||
    'Get your home loans and mortgage loans at the lowest interest rates with government subsidy across government and private banks. We provide complete advisory and syndication for self-construction, new/old home purchase, tiled houses, empty plots, commercial buildings, vehicle loans, and low-interest bank takeovers.';
  const aboutImg =
    content?.aboutImageUrl ||
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1000&q=80';

  const benefits = [
    {
      icon: <Target className="w-5 h-5 text-brand-teal" />,
      title: 'Government Subsidy (PMAY) Guidance',
      desc: 'Expert assistance in securing maximum central and state government housing subsidy benefits across eligible PSU and private banks.',
    },
    {
      icon: <Layers className="w-5 h-5 text-brand-teal" />,
      title: 'Private to Govt. Bank Loan Takeovers',
      desc: 'Transfer high-interest loans from private lenders to lowest government bank rates starting from 7.25% p.a. with zero hassle.',
    },
    {
      icon: <FileSpreadsheet className="w-5 h-5 text-brand-teal" />,
      title: 'Self-Construction & Composite Packages',
      desc: 'Specialized phased funding for building custom homes on owned sites or combined plot purchase with construction.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-brand-teal" />,
      title: 'Concrete Buildings, Tiled Houses & Empty Land',
      desc: 'Unlocking liquidity against owned concrete structures, traditional tiled houses, empty plots, and commercial properties from 8.50% p.a.',
    },
    {
      icon: <HelpCircle className="w-5 h-5 text-brand-teal" />,
      title: 'Vehicle Loans & Commercial Fleet Refinance',
      desc: 'Quick sanction for new cars, used cars, used car refinancing, and commercial transport vehicles with minimum paperwork.',
    },
  ];

  return (
    <section id="why-us" className="py-12 sm:py-16 bg-[#f8f8f4]">
      <div className="w-[85%] max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Image with authentic property consultation atmosphere */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden border border-brand-border/80 shadow-card aspect-[4/3] lg:aspect-[4/5] bg-white">
              <img
                src={aboutImg}
                alt="Property document review and consultation"
                className="w-full h-full object-cover object-center"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1000&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/30 via-transparent to-transparent pointer-events-none"></div>

              {/* Verified ethics tag */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm p-4 rounded-2xl border border-white/60 shadow-sm text-xs text-brand-navy">
                <span className="font-bold block text-sm mb-0.5">Objective Advisory</span>
                <p className="text-brand-slate text-[11px] leading-relaxed">
                  We clarify lender expectations without making unsupported sanction promises.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial points */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-5">
            <div className="inline-block px-3 py-1 rounded-full bg-brand-teal-light text-brand-teal text-xs font-bold uppercase tracking-wider">
              Why Consult With Us
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-navy tracking-tight font-heading leading-tight">
              {aboutHeading}
            </h2>

            <p className="text-brand-slate text-sm sm:text-base leading-relaxed">
              {aboutText}
            </p>

            <div className="space-y-3 pt-2">
              {benefits.map((b, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white border border-brand-border/70 hover:border-brand-teal/40 transition-all shadow-2xs"
                >
                  <div className="p-2 rounded-xl bg-brand-teal-light text-brand-teal flex-shrink-0 mt-0.5">
                    {b.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-brand-navy mb-0.5 font-heading">{b.title}</h4>
                    <p className="text-xs sm:text-sm text-brand-slate leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
