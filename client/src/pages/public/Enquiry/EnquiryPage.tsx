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
  ArrowRight,
} from 'lucide-react';
import { EnquiryForm } from '../../../components/EnquiryForm/EnquiryForm';
import { Service } from '../../../types';
import { useOutletContext } from 'react-router-dom';

export const EnquiryPage: React.FC = () => {
  const context = useOutletContext<{ services?: Service[] }>();
  const services = context?.services || [];

  return (
    <div className="bg-brand-bg min-h-screen text-brand-navy">
      {/* ────────────────────────────────────────────────────────────
          1. CONTENT-SPECIFIC HERO: CONFIDENTIAL INTAKE & SCHEDULING
          ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#0A1624] text-white pt-20 pb-16 lg:pt-28 lg:pb-20 border-b border-brand-teal/20">
        <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Heading & Intake Purpose */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-teal/15 border border-brand-teal/30 backdrop-blur-md">
                <Lock className="w-4 h-4 text-brand-teal" />
                <span className="text-xs font-bold uppercase tracking-wider text-brand-teal-light">
                  Direct &amp; Encrypted Advisory Intake
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight font-heading leading-tight">
                Submit Your Property Loan Dossier <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-teal via-emerald-400 to-brand-gold">
                  for Pre-Underwriting Review.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-gray-300 font-normal leading-relaxed max-w-2xl">
                Share your required borrowing amount, property context, and preferred consultation mode. A dedicated credit manager will evaluate loan feasibility across 40+ lending institutions before your scheduled meeting.
              </p>
            </div>

            {/* Right Column: Trust Safeguards Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#112335] to-[#0c1a24] border border-white/15 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs uppercase font-bold tracking-wider text-brand-teal-light">
                  Intake Safeguards
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">100% Secure</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Zero Advance Upfront Fees</span>
                    <span className="text-gray-400">Our preliminary eligibility audit and consultations are completely free of charge.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                  <Lock className="w-4 h-4 text-brand-teal flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Zero Hard CIBIL Inquiries</span>
                    <span className="text-gray-400">We perform only soft credit assessments that will not lower your credit bureau score.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                  <Clock className="w-4 h-4 text-brand-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Same-Day Slot Confirmation</span>
                    <span className="text-gray-400">Your requested appointment time is verified by our desk within 2 business hours.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────
          2. INTERACTIVE FORM COMPONENT
          ──────────────────────────────────────────────────────────── */}
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
