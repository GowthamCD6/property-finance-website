import React, { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { Hero } from '../../components/public/Hero';
import { LenderPartners } from '../../components/public/LenderPartners';
import { ServicesSection } from '../../components/public/ServicesSection';
import { RateComparisonMatrix } from '../../components/public/RateComparisonMatrix';
import { WhyWorkWithUs } from '../../components/public/WhyWorkWithUs';
import { CaseStudiesSection } from '../../components/public/CaseStudiesSection';
import { HowItWorks } from '../../components/public/HowItWorks';
import { InteractiveDocumentVault } from '../../components/public/InteractiveDocumentVault';
import { EnquiryForm } from '../../components/public/EnquiryForm';
import { FaqSection } from '../../components/public/FaqSection';
import { Service, Faq, SiteContent } from '../../types';
import { Calculator, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { content, services, faqs } = useOutletContext<{
    content: SiteContent | null;
    services: Service[];
    faqs: Faq[];
  }>();

  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const handleSelectService = (service: Service) => {
    setSelectedService(service);
    const formEl = document.getElementById('enquiry-form');
    if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col">
      {/* 1. Hero Section */}
      <Hero content={content} />

      {/* 2. Top Lender & Banking Network (SBI, HDFC, ICICI, etc.) */}
      <LenderPartners />

      {/* 3. Core Specialized Loan Services */}
      <ServicesSection
        services={services}
        onSelectService={handleSelectService}
      />

      {/* 4. Live Multi-Lender Rate Comparison Matrix */}
      <RateComparisonMatrix />

      {/* 5. Interactive EMI & Eligibility Calculator Teaser */}
      <section className="py-16 sm:py-20 bg-brand-ivory/50 border-b border-brand-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-2xl bg-white border border-brand-border flex flex-col lg:flex-row items-center justify-between gap-8 shadow-card">
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

      {/* 6. Why Work With Us & Advisory Principles */}
      <WhyWorkWithUs content={content} />

      {/* 7. Real Client Advisory Case Studies */}
      <CaseStudiesSection />

      {/* 8. Step-by-Step Advisory Workflow */}
      <HowItWorks />

      {/* 9. Interactive Pre-Application Document Vault */}
      <InteractiveDocumentVault />

      {/* 10. Direct Online Loan Consultation Form */}
      <EnquiryForm
        services={services}
        selectedService={selectedService}
        onClearSelectedService={() => setSelectedService(null)}
      />

      {/* 11. Frequently Asked Questions */}
      <FaqSection faqs={faqs} />
    </div>
  );
};
