import React from 'react';
import { Target, FileSpreadsheet, ShieldCheck, HelpCircle, Layers } from 'lucide-react';
import { SiteContent } from '../../types';

interface WhyWorkWithUsProps {
  content?: SiteContent | null;
}

export const WhyWorkWithUs: React.FC<WhyWorkWithUsProps> = ({ content }) => {
  const aboutHeading =
    content?.aboutHeading || 'Dedicated Property Loan Consultancy with Transparent Guidance';
  const aboutText =
    content?.aboutText ||
    'We assist property owners, buyers, and business professionals in navigating the loan evaluation process. Our focus is helping you understand eligibility guidelines, assemble required documentation, and connect with reputable lending institutions suited to your profile.';
  const aboutImg =
    content?.aboutImageUrl ||
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1000&q=80';

  const benefits = [
    {
      icon: <Target className="w-5 h-5 text-brand-teal" />,
      title: 'Guidance Tailored to Individual Requirements',
      desc: 'We analyse your specific property characteristics, cash flow profile, and tenure expectations before recommending possible loan structures.',
    },
    {
      icon: <Layers className="w-5 h-5 text-brand-teal" />,
      title: 'Help Understanding Lender Eligibility Criteria',
      desc: 'Lenders apply distinct loan-to-value (LTV) and debt-service ratios. We clarify what each institution looks for to avoid unnecessary rejections.',
    },
    {
      icon: <FileSpreadsheet className="w-5 h-5 text-brand-teal" />,
      title: 'Assistance Organising Application Documents',
      desc: 'Proper document collation reduces processing turnaround. We provide an exact checklist for KYC, title deeds, and income statements.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-brand-teal" />,
      title: 'Transparent & Confidential Process',
      desc: 'Your data is handled with strict discretion. We do not engage in unauthorized sharing or unvetted multiple bureau inquiries.',
    },
    {
      icon: <HelpCircle className="w-5 h-5 text-brand-teal" />,
      title: 'Consultation to Discuss Potential Funding Options',
      desc: 'Scheduled one-on-one sessions via phone, video, or in-person at our office to address your queries directly with a loan consultant.',
    },
  ];

  return (
    <section id="why-us" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Image with authentic property consultation atmosphere */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative rounded-2xl overflow-hidden border border-brand-border shadow-card aspect-[4/3] lg:aspect-[4/5] bg-brand-ivory">
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
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm p-4 rounded-xl border border-white/50 shadow-sm text-xs text-brand-navy">
                <span className="font-bold block text-sm mb-0.5">Objective Advisory</span>
                <p className="text-brand-slate text-[11px] leading-relaxed">
                  We clarify lender expectations without making unsupported sanction promises.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial points */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
            <div className="inline-block px-3 py-1 rounded bg-brand-teal-light text-brand-teal text-xs font-bold uppercase tracking-wider">
              Why Consult With Us
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-navy tracking-tight leading-tight">
              {aboutHeading}
            </h2>

            <p className="text-brand-slate text-base leading-relaxed">
              {aboutText}
            </p>

            <div className="space-y-4 pt-2">
              {benefits.map((b, idx) => (
                <div key={idx} className="flex items-start gap-3.5 p-3 rounded-lg hover:bg-brand-ivory/80 transition-colors">
                  <div className="p-2 rounded-md bg-brand-teal-light flex-shrink-0 mt-0.5">
                    {b.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-brand-navy mb-1">{b.title}</h4>
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
