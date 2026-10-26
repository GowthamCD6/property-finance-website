import React from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { Hero } from '../../../components/public/Hero';
import { StatsBar } from '../../../components/public/StatsBar';
import { LenderPartners } from '../../../components/public/LenderPartners';
import { RateComparisonMatrix } from '../../../components/public/RateComparisonMatrix';
import { HowItWorks } from '../../../components/public/HowItWorks';
import { TestimonialsSection } from '../../../components/public/TestimonialsSection';
import { WhyWorkWithUs } from '../../../components/public/WhyWorkWithUs';
import { FaqSection } from '../../../components/public/FaqSection';
import { Service, Faq, SiteContent } from '../../../types';
import { Calculator, ArrowRight, Calendar, PhoneCall, ShieldCheck } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { content, services, faqs } = useOutletContext<{
    content: SiteContent | null;
    services: Service[];
    faqs: Faq[];
  }>();

  return (
    <div className="flex flex-col">
      {/* 1. Hero with Instant Loan Estimator Card */}
      <Hero content={content} />

      {/* 2. Live Key Stats Counter */}
      <StatsBar />

      {/* 3. Premier Lender Partners Network */}
      <LenderPartners />

      {/* 4. Live Multi-Lender Rate Comparison Matrix */}
      <RateComparisonMatrix />

      {/* 5. Dynamic EMI & FOIR Calculator Banner */}
      <section className="py-12 sm:py-16 bg-transparent">
        <div className="w-[85%] max-w-7xl mx-auto">
          <div className="p-8 sm:p-12 rounded-3xl bg-white border border-brand-border/80 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-card">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-brand-teal-light text-brand-teal text-xs font-bold uppercase tracking-wider">
                <Calculator className="w-3.5 h-3.5" />
                <span>Interactive Estimation Engine</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight">
                Simulate Repayments &amp; Banking FOIR Eligibility
              </h2>
              <p className="text-sm sm:text-base text-brand-slate leading-relaxed">
                Estimate monthly EMIs, total interest amortization, and maximum permissible borrowing capacity based on Indian banking FOIR limits before logging your file.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0 w-full sm:w-auto">
              <Link
                to="/calculator"
                className="px-6 py-3.5 bg-brand-teal hover:bg-brand-teal-hover text-white text-xs sm:text-sm font-semibold rounded-corporate shadow-sm flex items-center justify-center gap-2 transition-colors text-center"
              >
                <span>Open Dynamic Calculator</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/services/home-loans"
                className="px-6 py-3.5 bg-brand-ivory hover:bg-gray-100 text-brand-navy border border-brand-border text-xs sm:text-sm font-semibold rounded-corporate text-center transition-colors"
              >
                Home Loan Options
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. 4-Step Digital Application Journey */}
      <HowItWorks />

      {/* 7. Customer Testimonials & Reviews */}
      <TestimonialsSection />

      {/* 8. Why Work With Us & Advisory Principles */}
      <WhyWorkWithUs content={content} />

      {/* 9. Consultation Invitation CTA */}
      <section className="py-12 sm:py-16 bg-transparent">
        <div className="w-[85%] max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-[#12263a] to-[#183247] text-white border border-white/10 rounded-3xl p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-teal/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="max-w-2xl space-y-4 text-center lg:text-left z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-teal/20 text-brand-teal-light text-xs font-bold uppercase tracking-wider">
                <Calendar className="w-3.5 h-3.5" />
                <span>Schedule Confidential Consultation</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-heading leading-tight">
                Ready to Discuss Your Loan Requirements?
              </h2>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                Connect directly with our senior financial advisors for customized loan structuring, document audits, and bank rate comparison across government and leading private banks.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-gray-300">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-brand-teal" /> 100% Confidential
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-brand-teal" /> Lowest Bank ROI
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-brand-teal" /> Zero Upfront Sanction Fees
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3.5 w-full sm:w-auto z-10 shrink-0">
              <Link
                to="/enquire"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-teal hover:bg-brand-teal-hover text-white font-bold text-sm rounded-corporate shadow-md transition-all hover:scale-[1.02] text-center"
              >
                <span>Schedule an Advisory Meeting</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/services/home-loans"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-corporate border border-white/15 transition-colors text-center"
              >
                <span>Explore Loan Solutions</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 12. Frequently Asked Questions */}
      <FaqSection faqs={faqs} />
    </div>
  );
};
