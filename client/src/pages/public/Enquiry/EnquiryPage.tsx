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
  Shield,
  Zap,
} from 'lucide-react';
import { EnquiryForm } from '../../../components/EnquiryForm/EnquiryForm';
import { Service } from '../../../types';
import { useOutletContext } from 'react-router-dom';
import enquiryHeroImg from '../../../assets/images/enquiry-hero.jpg';

export const EnquiryPage: React.FC = () => {
  const context = useOutletContext<{ services?: Service[] }>();
  const services = context?.services || [];

  return (
    <div className="bg-brand-bg min-h-screen text-brand-navy">
      {/* ────────────────────────────────────────────────────────────
          1. CONTENT-SPECIFIC HERO: CONFIDENTIAL INTAKE & SCHEDULING
          ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#0A1624] text-white pt-16 pb-16 lg:pt-24 lg:pb-20 border-b border-brand-teal/20">
        {/* Subtle background ambient glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -left-20 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 -right-20 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl" />
          <img
            src={enquiryHeroImg}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-5 filter blur-2xl scale-125 pointer-events-none"
          />
        </div>

        <div className="w-[92%] sm:w-[88%] lg:w-[85%] max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Heading & Intake Purpose */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-teal/15 border border-brand-teal/30 backdrop-blur-md">
                <Lock className="w-4 h-4 text-brand-teal" />
                <span className="text-xs font-bold uppercase tracking-wider text-brand-teal-light font-heading">
                  Direct &amp; Encrypted Advisory Intake
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight font-heading leading-tight text-white">
                Submit Your Property Loan Dossier <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-teal via-emerald-400 to-brand-gold">
                  for Pre-Underwriting Review.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl font-sans">
                Share your required borrowing amount, property context, and preferred consultation mode. A dedicated credit manager evaluates your scenario across 40+ lending institutions before your scheduled meeting.
              </p>

              {/* Quick Trust Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-xs font-semibold text-slate-200">Zero Upfront Fees</span>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                  <Lock className="w-4 h-4 text-teal-400 shrink-0" />
                  <span className="text-xs font-semibold text-slate-200">Soft CIBIL Only</span>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-xs font-semibold text-slate-200">Same-Day Slot</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Card with Enquiry Image */}
            <div className="lg:col-span-5">
              <div className="relative group rounded-3xl overflow-hidden bg-gradient-to-br from-[#122438] to-[#0A1624] border border-white/20 p-2 shadow-2xl transition-all duration-300 hover:border-teal-500/40">
                {/* Visual Image Container */}
                <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3]">
                  <img
                    src={enquiryHeroImg}
                    alt="Property Loan Consultation & Enquiry Intake Desk"
                    className="w-full h-full object-cover object-center brightness-105 contrast-[1.02] transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="eager"
                  />
                  {/* Subtle Gradient Overlays for Depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A1624]/90 via-[#0A1624]/20 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0A1624]/40 to-transparent" />

                  {/* Overlaid Badges */}
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-[11px] font-bold font-heading text-teal-300 border border-teal-500/30 shadow-lg">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>Pre-Underwriting Desk</span>
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-200 bg-slate-950/75 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 shadow-lg">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="font-heading font-semibold text-[11px] sm:text-xs">Direct Lending Channel</span>
                    </div>
                    <span className="font-mono text-[10px] text-teal-300 font-bold">40+ Bank Desks</span>
                  </div>
                </div>

                {/* Card Sub-Banner */}
                <div className="p-3.5 sm:p-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-wider font-extrabold text-teal-400 font-heading">
                      Standard Turnaround
                    </span>
                    <span className="text-[11px] font-mono text-emerald-400 font-bold">
                      &lt; 2 Business Hours
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                    Complete the 3-step application below. Your dedicated relationship manager will lock in your requested consultation slot and verify eligibility.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────
          2. INTERACTIVE FORM COMPONENT
          ──────────────────────────────────────────────────────────── */}
      <div id="enquiry-form" className="bg-[#f7f7f3]">
        <EnquiryForm
          services={services}
          selectedService={null}
          onClearSelectedService={() => {}}
        />
      </div>
    </div>
  );
};
