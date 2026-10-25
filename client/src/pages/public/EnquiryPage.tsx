import React from 'react';
import {
  ShieldCheck,
  Calendar,
  CheckCircle2,
  Lock,
  Clock,
  Landmark,
  BadgePercent,
  Sparkles,
} from 'lucide-react';
import { EnquiryForm } from '../../components/public/EnquiryForm';
import { Service } from '../../types';
import { useOutletContext } from 'react-router-dom';

export const EnquiryPage: React.FC = () => {
  const context = useOutletContext<{ services?: Service[] }>();
  const services = context?.services || [];

  return (
    <div className="bg-white">
      {/* 1. Header Hero Banner */}
      <section className="relative bg-gradient-to-br from-brand-navy via-[#102434] to-[#0A1824] text-white pt-20 pb-16 lg:pt-24 lg:pb-20 border-b border-white/10 overflow-hidden">
        {/* Ambient Backdrops */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-teal/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-teal/20 border border-brand-teal/30 text-brand-teal-light text-xs font-bold uppercase tracking-wider mb-5">
              <Calendar className="w-4 h-4 text-brand-teal" />
              <span>Priority Consultation Scheduling</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight font-heading leading-tight sm:leading-tight">
              Book a Private Property Loan <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-teal via-emerald-400 to-brand-gold">
                Consultation &amp; Feasibility Audit
              </span>
            </h1>

            <p className="mt-5 text-gray-300 text-base sm:text-lg lg:text-xl font-normal leading-relaxed max-w-3xl">
              Provide your required borrowing amount, property context, and preferred time slot. A senior property finance advisor will review your eligibility across 40+ lending partners before your meeting.
            </p>

            {/* Quick Assurance Badges */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 text-xs font-medium text-white">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Zero Obligation Session</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Lock className="w-4 h-4 text-brand-teal flex-shrink-0" />
                <span>100% Confidential Data</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-brand-gold flex-shrink-0" />
                <span>Zero Bureau Hard Inquiries</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-brand-teal-light flex-shrink-0" />
                <span>Same-Day Slot Confirmation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Form Component */}
      <div id="enquiry-form">
        <EnquiryForm
          services={services}
          selectedService={null}
          onClearSelectedService={() => {}}
        />
      </div>
    </div>
  );
};
