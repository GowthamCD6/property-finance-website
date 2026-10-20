import React from 'react';
import { Link } from 'react-router-dom';
import {
  Home,
  CheckCircle2,
  FileCheck2,
  ArrowRight,
  TrendingUp,
  Percent,
  Layers,
  HelpCircle,
  Building,
} from 'lucide-react';
import { EnquiryForm } from '../../components/public/EnquiryForm';
import { Service } from '../../types';
import { useOutletContext } from 'react-router-dom';

export const HomeLoansPage: React.FC = () => {
  const context = useOutletContext<{ services?: Service[] }>();
  const services = context?.services || [];
  const homeLoanService = services.find((s) => s.slug === 'home-loans') || null;

  const categories = [
    {
      title: 'Ready-to-Move & Resale Property Purchase',
      desc: 'Assistance in evaluating resale title clearances, society NOCs, prior chain of deeds, and lender valuation norms.',
      highlights: ['Title deed verification audit', 'LTV typically up to 75%–80%', 'Guidance on stamp duty financing limits'],
    },
    {
      title: 'Under-Construction Builder Purchases',
      desc: 'Navigating builder approval project codes (APF), RERA compliance verification, and construction-linked disbursement tranches.',
      highlights: ['Pre-approved builder tie-up evaluation', 'RERA registration confirmation', 'Tranche-based interest guidance'],
    },
    {
      title: 'Plot Purchase + Home Construction Loan',
      desc: 'Composite funding structured for purchasing a residential site followed by architectural milestone-based construction.',
      highlights: ['Composite loan disbursement stages', 'Approved building plan validation', 'Cost estimation appraisal guidance'],
    },
    {
      title: 'Balance Transfer & Additional Top-Up',
      desc: 'Reviewing options to shift an existing high-cost home loan to a lower rate regime with additional liquidity via a top-up facility.',
      highlights: ['Foreclosure letter assistance', 'Rate difference calculation', 'Top-up facility eligibility review'],
    },
  ];

  const eligibilityChecklist = [
    {
      profile: 'Salaried Professionals',
      criteria: 'Minimum age 21, at least 2 years continuous work experience, stable monthly net salary, and healthy FOIR (Fixed Obligation to Income Ratio).',
    },
    {
      profile: 'Self-Employed & Business Owners',
      criteria: 'Minimum 3 years in current business/profession, audited balance sheets & ITRs with computation of income, and satisfactory GST returns.',
    },
    {
      profile: 'Credit Score Expectations',
      criteria: 'A CIBIL credit score of 750 or higher is preferred by most regulated banks for favorable risk pricing and smooth processing.',
    },
    {
      profile: 'Property Clearances',
      criteria: 'Freehold title, sanction plan approval from local development authorities (e.g. BDA, BBMP, CIDCO, DDA), and legal search report.',
    },
  ];

  return (
    <div className="bg-white">
      {/* 1. Page Hero Banner */}
      <section className="bg-brand-ivory border-b border-brand-border py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-brand-teal-light text-brand-teal text-xs font-bold uppercase tracking-wider mb-4">
              <Home className="w-4 h-4" />
              <span>Specialized Loan Advisory</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-navy tracking-tight leading-tight">
              Home Loan Guidance &amp; Application Advisory
            </h1>
            <p className="mt-4 text-brand-slate text-base sm:text-lg leading-relaxed">
              Navigating residential property financing with structured eligibility assessment, lender underwriting comparisons, and transparent documentation preparation.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#enquiry-form"
                className="px-6 py-3 bg-brand-teal hover:bg-brand-teal-hover text-white text-sm font-semibold rounded-corporate shadow-sm transition-colors flex items-center gap-2"
              >
                <span>Request Home Loan Assessment</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                to="/calculator"
                className="px-6 py-3 bg-white hover:bg-brand-ivory text-brand-navy border border-brand-border rounded-corporate text-sm font-semibold transition-colors"
              >
                Calculate Monthly EMI
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Distinct Home Loan Categories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-teal block mb-1">
              Funding Structures
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight">
              Tailored Pathways for Every Property Scenario
            </h2>
            <p className="text-sm text-brand-slate mt-2">
              Lenders evaluate resale, under-construction, and construction loans differently. We help align your purchase with appropriate criteria.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((cat, idx) => (
              <div
                key={idx}
                className="p-6 bg-brand-ivory/50 rounded-xl border border-brand-border hover:border-brand-teal/40 transition-colors space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-teal text-white flex items-center justify-center font-bold text-xs">
                    0{idx + 1}
                  </div>
                  <h3 className="text-base font-bold text-brand-navy">{cat.title}</h3>
                </div>

                <p className="text-xs sm:text-sm text-brand-slate leading-relaxed">
                  {cat.desc}
                </p>

                <div className="space-y-1.5 pt-2 border-t border-brand-border/60">
                  {cat.highlights.map((h, hIdx) => (
                    <div key={hIdx} className="flex items-center gap-2 text-xs font-medium text-brand-navy">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-teal flex-shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Eligibility Matrix & Document Checklist */}
      <section className="py-16 bg-brand-teal-light/30 border-y border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-teal block mb-1">
              Underwriting Standards
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight">
              Eligibility &amp; Documentation Checklist
            </h2>
            <p className="text-sm text-brand-slate mt-2">
              Preparing your financial dossier beforehand ensures realistic borrowing assessments and faster turnaround.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {eligibilityChecklist.map((item, idx) => (
              <div key={idx} className="bg-white p-5 rounded-xl border border-brand-border shadow-subtle space-y-2">
                <h4 className="text-sm font-bold text-brand-navy">{item.profile}</h4>
                <p className="text-xs text-brand-slate leading-relaxed">{item.criteria}</p>
              </div>
            ))}
          </div>

          {/* Regulatory Note */}
          <div className="mt-8 p-4 bg-white rounded-xl border border-brand-border text-xs text-brand-slate text-center max-w-3xl mx-auto">
            <span className="font-semibold text-brand-navy">Advisory Disclosure: </span>
            We do not issue loan sanctions directly. Actual interest rates, loan-to-value limits, processing fees, and final sanctions are determined solely by the partner lending institutions based on independent legal search and property valuation.
          </div>
        </div>
      </section>

      {/* 4. Consultation Request Form (Preloaded with Home Loan) */}
      <EnquiryForm
        services={services}
        selectedService={homeLoanService}
        onClearSelectedService={() => {}}
      />
    </div>
  );
};
