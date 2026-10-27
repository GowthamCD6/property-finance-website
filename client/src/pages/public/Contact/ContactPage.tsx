import React from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Building2,
  Calendar,
  MessageSquare,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  Navigation,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { SiteContent, Service } from '../../../types';
import { EnquiryForm } from '../../../components/common/EnquiryForm';
import { useOutletContext } from 'react-router-dom';

export const ContactPage: React.FC = () => {
  const context = useOutletContext<{ content?: SiteContent | null; services?: Service[] }>();
  const content = context?.content || null;
  const services = context?.services || [];

  const businessName = content?.businessName || 'Prime Associates — Loans & Constructions';
  const businessPhone = content?.businessPhone || '+91 96555 66613, +91 95144 66600';
  const businessEmail = content?.businessEmail || 'primeassociates2008@gmail.com';
  const officeAddress = content?.officeAddress || 'No. 48, 49, P.R. Complex, Binny Compound Main Street, Kumaran Road, Tirupur - 641601';
  const businessHours = content?.businessHours || 'Monday – Saturday: 9:30 AM – 6:30 PM (IST)';

  const regionalDesks = [
    {
      region: 'Tirupur Central & Head Office',
      focus: 'Home Loans, Self-Construction, Plot Purchase & Government Subsidies',
      desk: 'P.R. Complex Headquarters',
      phone: '+91 96555 66613',
    },
    {
      region: 'Commercial & Industrial LAP Desk',
      focus: 'Concrete Building, Tiled House, Plots (Empty Land), Commercial Buildings',
      desk: 'Mortgage & LAP Syndicate',
      phone: '+91 95144 66600',
    },
    {
      region: 'Coimbatore & Regional Corridor',
      focus: 'New & Old Home Purchase, Plot Purchase with Construction, Tiled Houses',
      desk: 'Regional Purchase Desk',
      phone: '+91 96555 66613',
    },
    {
      region: 'Bank Takeover & Vehicle Desk',
      focus: 'Private Bank to Govt Bank Takeover at Lowest Rates, Car & Commercial Vehicle Loans',
      desk: 'Takeover & Vehicle Syndicate',
      phone: '+91 95144 66600',
    },
  ];

  return (
    <div className="bg-brand-bg min-h-screen text-brand-navy">
      {/* ────────────────────────────────────────────────────────────
          1. CONTENT-SPECIFIC HERO: DIRECT ADVISORY & OFFICE CONNECT
          ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#0A1724] text-white pt-20 pb-16 lg:pt-28 lg:pb-24 border-b border-brand-teal/20">
        <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Heading & Live Status */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 backdrop-blur-md">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                  Advisory Desks Active • Mon–Sat 9:30 AM to 6:30 PM (IST)
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white tracking-tight font-heading leading-tight">
                Connect Directly with Our <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-teal via-emerald-400 to-sky-300">
                  Senior Property Finance Advisors.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-gray-300 font-normal leading-relaxed max-w-2xl">
                Have a query regarding property title chain clarity, municipal plot approvals, or high-value mortgage feasibility? Reach our senior advisory desk via phone, email, or schedule an in-person meeting.
              </p>

              {/* Direct Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href={`tel:${businessPhone.replace(/\s+/g, '')}`}
                  className="px-7 py-3.5 bg-brand-teal hover:bg-brand-teal-hover text-white text-sm font-bold rounded-corporate shadow-lg shadow-brand-teal/20 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Advisory Desk: {businessPhone}</span>
                </a>
                <a
                  href={`mailto:${businessEmail}`}
                  className="px-6 py-3.5 bg-white/10 hover:bg-white/15 text-white border border-white/20 rounded-corporate text-sm font-semibold transition-all backdrop-blur-sm flex items-center gap-2"
                >
                  <Mail className="w-4 h-4 text-brand-teal" />
                  <span>Email Document Dossiers</span>
                </a>
              </div>
            </div>

            {/* Right Column: Corporate Headquarters Snapshot Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#122536] to-[#0c1a24] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-brand-teal" />
                  <span className="text-xs uppercase font-bold tracking-wider text-brand-teal-light">
                    Corporate Headquarters
                  </span>
                </div>
                <span className="text-[11px] text-gray-400 font-mono">Tirupur Central</span>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white font-heading">{businessName}</h3>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  {officeAddress}
                </p>
                <div className="text-[11px] text-brand-teal font-medium pt-1">
                  Landmark: Binny Compound Main Street, Kumaran Road, Tirupur
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 text-xs border-t border-white/10">
                <div>
                  <span className="text-gray-400 block text-[11px]">Direct Phone:</span>
                  <a href={`tel:${businessPhone.replace(/\s+/g, '')}`} className="font-mono text-white font-bold hover:text-brand-teal">
                    {businessPhone}
                  </a>
                </div>
                <div>
                  <span className="text-gray-400 block text-[11px]">Audit Mail:</span>
                  <a href={`mailto:${businessEmail}`} className="font-mono text-white font-bold hover:text-brand-teal truncate block">
                    {businessEmail}
                  </a>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="#enquiry-form"
                  className="w-full py-3 bg-brand-teal hover:bg-brand-teal-hover text-white text-xs sm:text-sm font-bold rounded-corporate text-center transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  <span>Book In-Person Office Session</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────
          2. REGIONAL ADVISORY DESKS
          ──────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-white border-b border-brand-border">
        <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-teal block mb-1">
              Geographic Specialization
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-navy font-heading tracking-tight">
              Specialized Regional Lending Desks
            </h2>
            <p className="mt-3 text-brand-slate text-sm sm:text-base leading-relaxed">
              Property regulations and layout approvals differ across micro-markets. Our advisors specialize by zone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {regionalDesks.map((desk, idx) => (
              <div
                key={idx}
                className="p-6 bg-brand-ivory/50 rounded-2xl border border-brand-border space-y-3 hover:border-brand-teal/40 transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-brand-navy text-white flex items-center justify-center font-bold text-xs">
                  0{idx + 1}
                </div>
                <h3 className="font-bold text-base text-brand-navy font-heading">{desk.region}</h3>
                <p className="text-xs text-brand-slate leading-relaxed">{desk.focus}</p>
                <div className="pt-3 border-t border-brand-border/60 text-xs font-semibold text-brand-teal">
                  <span>{desk.desk}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────
          3. ENQUIRY FORM
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
