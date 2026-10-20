import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  PhoneCall,
  SearchCheck,
  ClipboardCheck,
  ArrowRight,
  Clock,
  ShieldCheck,
  Building,
} from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const detailedSteps = [
    {
      step: '01',
      title: 'Step 1: Share Your Requirements & Property Context',
      desc: 'Submit your contact details, required borrowing amount, and preliminary property information (residential, commercial, or plot) via our secure enquiry form. Choose your preferred date, time slot, and meeting mode (Phone, Google Meet, or In-Person at our Bengaluru office).',
      timeframe: 'Same-day slot confirmation',
      icon: <FileText className="w-5 h-5 text-brand-teal" />,
    },
    {
      step: '02',
      title: 'Step 2: Preliminary Discussion & Eligibility Review',
      desc: 'During the scheduled consultation, a dedicated property finance specialist analyzes your cash flows, income proofs (ITR / Salary slips), credit history, and current loan commitments (FOIR) to determine a realistic borrowing capacity.',
      timeframe: '30–45 minute consultation',
      icon: <PhoneCall className="w-5 h-5 text-brand-teal" />,
    },
    {
      step: '03',
      title: 'Step 3: Comparative Lender Evaluation',
      desc: 'Based on your specific scenario, we review potential financing avenues across regulated commercial banks and NBFCs, discussing comparative interest rates (fixed vs floating), processing fees, LTV parameters, and specific legal requirements.',
      timeframe: '1–2 business days',
      icon: <SearchCheck className="w-5 h-5 text-brand-teal" />,
    },
    {
      step: '04',
      title: 'Step 4: Application Filing & Underwriting Support',
      desc: 'We assist you in organizing a clean documentation dossier (KYC, income proofs, property chain deeds, tax receipts, and builder NOCs) to ensure smooth submission to the chosen lending institution.',
      timeframe: 'Subject to lender processing',
      icon: <ClipboardCheck className="w-5 h-5 text-brand-teal" />,
    },
  ];

  return (
    <div className="bg-white">
      {/* 1. Header Banner */}
      <section className="bg-brand-ivory border-b border-brand-border py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-brand-teal-light text-brand-teal text-xs font-bold uppercase tracking-wider mb-4">
              <Clock className="w-4 h-4" />
              <span>Step-by-Step Advisory</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-navy tracking-tight leading-tight">
              How Our Consultation Process Works
            </h1>
            <p className="mt-4 text-brand-slate text-base sm:text-lg leading-relaxed">
              A transparent, structured four-stage advisory model designed to bring clarity, eliminate guesswork, and streamline your property loan application.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Detailed Steps Timeline */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {detailedSteps.map((s, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-8 bg-brand-ivory/40 rounded-2xl border border-brand-border shadow-subtle flex flex-col sm:flex-row gap-6 items-start hover:border-brand-teal/40 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-teal text-white flex items-center justify-center font-extrabold text-lg flex-shrink-0">
                {s.step}
              </div>

              <div className="space-y-3 flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <h3 className="text-base sm:text-lg font-bold text-brand-navy">{s.title}</h3>
                  <span className="text-[11px] font-semibold text-brand-teal bg-brand-teal-light px-2.5 py-0.5 rounded-full self-start">
                    {s.timeframe}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-brand-slate leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}

          {/* Institutional Underwriting Disclaimer */}
          <div className="p-5 bg-white rounded-xl border border-brand-border text-xs text-brand-slate leading-relaxed">
            <span className="font-bold text-brand-navy block mb-1">Regulatory &amp; Underwriting Notice:</span>
            Approval, interest rates, valuation, legal search reports, and disbursement decisions remain strictly with the respective lending banks and NBFCs. Our advisory services focus on eligibility preparation, document structuring, and application guidance.
          </div>

          <div className="pt-4 text-center">
            <Link
              to="/enquire"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-teal hover:bg-brand-teal-hover text-white text-sm font-semibold rounded-corporate shadow-sm transition-colors"
            >
              <span>Begin Your Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
