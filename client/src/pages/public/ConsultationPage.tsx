import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileCheck,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Search,
  Calculator,
  UserCheck,
} from 'lucide-react';
import { EnquiryForm } from '../../components/public/EnquiryForm';
import { Service } from '../../types';
import { useOutletContext } from 'react-router-dom';

export const ConsultationPage: React.FC = () => {
  const context = useOutletContext<{ services?: Service[] }>();
  const services = context?.services || [];
  const consultationService =
    services.find((s) => s.slug === 'loan-consultation') || null;

  const consultationPillars = [
    {
      title: 'Preliminary FOIR & Eligibility Computation',
      desc: 'We calculate your Fixed Obligation to Income Ratio (FOIR) across existing EMIs and credit card limits to determine your true borrowing capacity before formal bank submission.',
    },
    {
      title: 'Credit Bureau & CIBIL Health Review',
      desc: 'Identifying inaccuracies, overdue settlement remarks, or high credit utilization on your bureau record that could otherwise trigger automated rejection.',
    },
    {
      title: 'Co-Applicant & Tax Optimization',
      desc: 'Evaluating whether adding a spouse, parent, or business co-applicant increases feasible loan limits and yields optimal tax benefits under applicable sections.',
    },
    {
      title: 'Title & Property Document Readiness Audit',
      desc: 'Reviewing the completeness of prior sale deeds, mutation certificates, Khata extract / 7/12 extract, and occupancy certificates to prevent legal queries from bank panels.',
    },
  ];

  return (
    <div className="bg-white">
      {/* 1. Hero Banner */}
      <section className="bg-brand-ivory border-b border-brand-border py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-brand-teal-light text-brand-teal text-xs font-bold uppercase tracking-wider mb-4">
              <FileCheck className="w-4 h-4" />
              <span>Independent Advisory</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-navy tracking-tight leading-tight">
              Property Loan Consultation &amp; Eligibility Audit
            </h1>
            <p className="mt-4 text-brand-slate text-base sm:text-lg leading-relaxed">
              Before submitting your paperwork to multiple lenders, consult with experienced property loan specialists to evaluate debt feasibility, audit documents, and identify optimal financing paths.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#enquiry-form"
                className="px-6 py-3 bg-brand-teal hover:bg-brand-teal-hover text-white text-sm font-semibold rounded-corporate shadow-sm transition-colors flex items-center gap-2"
              >
                <span>Schedule a Private Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                to="/calculator"
                className="px-6 py-3 bg-white hover:bg-brand-ivory text-brand-navy border border-brand-border rounded-corporate text-sm font-semibold transition-colors"
              >
                Try Eligibility Calculator
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Four Pillars */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-teal block mb-1">
              Advisory Scope
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight">
              What We Assess During Your Consultation
            </h2>
            <p className="text-sm text-brand-slate mt-2">
              Objective guidance focused on aligning your application with institutional underwriting requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {consultationPillars.map((p, idx) => (
              <div
                key={idx}
                className="p-6 bg-brand-ivory/50 rounded-xl border border-brand-border space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-teal text-white flex items-center justify-center font-bold text-xs">
                    0{idx + 1}
                  </div>
                  <h3 className="text-base font-bold text-brand-navy">{p.title}</h3>
                </div>
                <p className="text-xs sm:text-sm text-brand-slate leading-relaxed">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Enquiry Form Preloaded */}
      <EnquiryForm
        services={services}
        selectedService={consultationService}
        onClearSelectedService={() => {}}
      />
    </div>
  );
};
