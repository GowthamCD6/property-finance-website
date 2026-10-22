import React from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  ShieldCheck,
  Target,
  Users,
  CheckCircle2,
  ArrowRight,
  Landmark,
  Scale,
} from 'lucide-react';
import { SiteContent } from '../../types';
import { useOutletContext } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  const context = useOutletContext<{ content?: SiteContent | null }>();
  const content = context?.content || null;
  const businessName = content?.businessName || 'WealthAnchor Property Finance Advisory';
  const aboutHeading =
    content?.aboutHeading || 'Dedicated Property Loan Consultancy with Transparent Guidance';
  const aboutText =
    content?.aboutText ||
    'We assist property owners, buyers, and business professionals in navigating the loan evaluation process. Our focus is helping you understand eligibility guidelines, assemble required documentation, and connect with reputable lending institutions suited to your profile.';
  const aboutImg =
    content?.aboutImageUrl ||
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1000&q=80';

  const principles = [
    {
      title: 'Independent, Unbiased Advisory',
      desc: 'We are not tied to any single lender. Our objective is to recommend funding options that align with your cash flows, tenure preference, and title profile.',
      icon: <Scale className="w-5 h-5 text-brand-teal" />,
    },
    {
      title: 'Zero False Sanction Guarantees',
      desc: 'We never promise instant disbursements or guaranteed approvals. We clearly communicate that underwriting authority resides solely with regulated institutions.',
      icon: <ShieldCheck className="w-5 h-5 text-brand-teal" />,
    },
    {
      title: 'Confidential Data Stewardship',
      desc: 'Your financial statements and property titles are handled with strict discretion. We never trigger unauthorized multi-bureau queries.',
      icon: <CheckCircle2 className="w-5 h-5 text-brand-teal" />,
    },
    {
      title: 'End-to-End Application Guidance',
      desc: 'From initial debt calculation and legal chain scrutiny to final lender document filing, our team assists you at each milestone.',
      icon: <Target className="w-5 h-5 text-brand-teal" />,
    },
  ];

  return (
    <div>
      {/* 1. Header Banner */}
      <section className="bg-brand-ivory border-b border-brand-border py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-brand-teal-light text-brand-teal text-xs font-bold uppercase tracking-wider mb-4">
              <Building2 className="w-4 h-4" />
              <span>About Our Practice</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-navy tracking-tight leading-tight">
              A Transparent Approach to Property Financing
            </h1>
            <p className="mt-4 text-brand-slate text-base sm:text-lg leading-relaxed">
              Founded on the belief that borrowers deserve unbiased guidance, realistic borrowing appraisals, and structured document preparation before approaching financial institutions.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Narrative & Image Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-teal block">
                Our Advisory Ethos
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight leading-tight">
                {aboutHeading}
              </h2>
              <p className="text-brand-slate text-sm sm:text-base leading-relaxed">
                {aboutText}
              </p>
              <p className="text-brand-slate text-sm sm:text-base leading-relaxed">
                In India's dynamic mortgage landscape, every lender maintains distinct risk appetites for property age, legal title clearance, and cash flow structures. We bridge the gap between borrowers and lending institutions by ensuring your dossier is clean, complete, and targeted to the right underwriting parameters.
              </p>

              <div className="pt-2">
                <Link
                  to="/enquire"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-brand-teal hover:bg-brand-teal-hover text-white text-xs sm:text-sm font-semibold rounded-corporate shadow-sm transition-colors"
                >
                  <span>Schedule an Advisory Meeting</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-2xl overflow-hidden border border-brand-border shadow-card aspect-[4/3] bg-brand-ivory">
                <img
                  src={aboutImg}
                  alt="Property advisory meeting and documentation review"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Guiding Principles Grid */}
      <section className="py-16 bg-brand-ivory border-t border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-teal block mb-1">
              Commitment to Borrowers
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight">
              Our Core Advisory Principles
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {principles.map((pr, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl border border-brand-border shadow-subtle space-y-3">
                <div className="w-10 h-10 rounded-lg bg-brand-teal-light flex items-center justify-center">
                  {pr.icon}
                </div>
                <h4 className="text-sm font-bold text-brand-navy">{pr.title}</h4>
                <p className="text-xs text-brand-slate leading-relaxed">{pr.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
