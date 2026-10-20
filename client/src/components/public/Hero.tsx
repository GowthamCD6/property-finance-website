import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { SiteContent } from '../../types';

interface HeroProps {
  content?: SiteContent | null;
}

export const Hero: React.FC<HeroProps> = ({ content }) => {
  const eyebrow = content?.heroEyebrow || 'PROPERTY FINANCE & LOAN ASSISTANCE';
  const headline = content?.heroHeadline || 'Find the Right Funding Path for Your Property.';
  const subtitle = content?.heroSubtitle ||
    'Explore home loan and loan-against-property options with guidance tailored to your property, financial needs and repayment capacity.';
  const primaryCta = content?.heroCtaText || 'Discuss Your Loan';
  const secondaryCta = content?.heroSecondaryCtaText || 'Explore Our Services';
  const heroImg = content?.heroImageUrl ||
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative bg-white pt-8 pb-16 lg:pt-16 lg:pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Content */}
          <div className="lg:col-span-7 space-y-6">
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-brand-teal-light text-brand-teal text-xs font-bold tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-brand-teal"></span>
              <span>{eyebrow}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-navy tracking-tight leading-[1.15]">
              {headline}
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-brand-slate leading-relaxed max-w-2xl">
              {subtitle}
            </p>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <Link
                to="/enquire"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-white bg-brand-teal hover:bg-brand-teal-hover rounded-corporate transition-all duration-150 shadow-sm"
              >
                <span>{primaryCta}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/services/home-loans"
                className="inline-flex items-center justify-center px-6 py-3.5 text-base font-semibold text-brand-navy bg-brand-ivory hover:bg-gray-100 border border-brand-border rounded-corporate transition-colors text-center"
              >
                {secondaryCta}
              </Link>
            </div>

            {/* Three Concrete Trust Commitments */}
            <div className="pt-6 border-t border-brand-border/80 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-brand-teal flex-shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-brand-navy">
                  Zero Upfront Advisory Fees
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-brand-teal flex-shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-brand-navy">
                  40+ Bank &amp; NBFC Partners
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-brand-teal flex-shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-brand-navy">
                  Legal &amp; Title Verification Audit
                </span>
              </div>
            </div>

            {/* High-Impact Trust Metric Chips */}
            <div className="pt-3 flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-baseline gap-1.5 px-3 py-1.5 rounded-lg bg-brand-ivory border border-brand-border">
                <span className="font-extrabold text-sm text-brand-navy">₹450+ Cr</span>
                <span className="text-brand-slate text-[11px]">Loan Inquiries Guided</span>
              </div>
              <div className="flex items-baseline gap-1.5 px-3 py-1.5 rounded-lg bg-brand-ivory border border-brand-border">
                <span className="font-extrabold text-sm text-brand-navy">98.4%</span>
                <span className="text-brand-slate text-[11px]">Clean Dossier Rate</span>
              </div>
              <div className="flex items-baseline gap-1.5 px-3 py-1.5 rounded-lg bg-brand-ivory border border-brand-border">
                <span className="font-extrabold text-sm text-brand-navy">1:1</span>
                <span className="text-brand-slate text-[11px]">Dedicated Case Advisor</span>
              </div>
            </div>
          </div>

          {/* Right Column: Real Residential Property Photography */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-brand-border shadow-card bg-brand-ivory aspect-[4/3] lg:aspect-[5/4]">
              <img
                src={heroImg}
                alt="Contemporary residential home architecture"
                className="w-full h-full object-cover object-center transform hover:scale-[1.01] transition-transform duration-300"
                loading="eager"
                onError={(e) => {
                  // Fallback to high-res property architecture image if primary fails
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80';
                }}
              />
              {/* Subtle bottom gradient for card overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/30 via-transparent to-transparent pointer-events-none"></div>

              {/* Informative pill overlay */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm p-3.5 rounded-lg border border-white/40 shadow-sm flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-brand-navy block">Property Advisory Specialist</span>
                  <span className="text-brand-slate text-[11px]">Unbiased lender assessment &amp; guidance</span>
                </div>
                <span className="px-2.5 py-1 bg-brand-teal-light text-brand-teal font-semibold rounded text-[11px]">
                  Verified Process
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
