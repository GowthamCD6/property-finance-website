import React from 'react';
import { ShieldCheck, Calendar, CheckCircle2, Lock } from 'lucide-react';
import { EnquiryForm } from '../../components/public/EnquiryForm';
import { Service } from '../../types';
import { useOutletContext } from 'react-router-dom';

export const EnquiryPage: React.FC = () => {
  const context = useOutletContext<{ services?: Service[] }>();
  const services = context?.services || [];
  return (
    <div className="bg-white">
      {/* 1. Header Banner */}
      <section className="bg-brand-ivory border-b border-brand-border py-14 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-brand-teal-light text-brand-teal text-xs font-bold uppercase tracking-wider mb-3">
              <Calendar className="w-4 h-4" />
              <span>Direct Consultation Scheduling</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-navy tracking-tight">
              Book a Property Loan Advisory Consultation
            </h1>
            <p className="mt-3 text-brand-slate text-sm sm:text-base leading-relaxed">
              Share your contact details, funding requirements, and preferred meeting mode. Our team will verify slot availability and confirm your consultation schedule.
            </p>

            {/* Quick Assurance Badges */}
            <div className="mt-6 flex flex-wrap gap-4 text-xs font-medium text-brand-navy">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-teal" />
                <span>Zero Obligation Consultation</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-brand-teal" />
                <span>100% Confidential Data Handling</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-teal" />
                <span>Transparent Regulatory Guidance</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Form Component */}
      <EnquiryForm
        services={services}
        selectedService={null}
        onClearSelectedService={() => {}}
      />
    </div>
  );
};
