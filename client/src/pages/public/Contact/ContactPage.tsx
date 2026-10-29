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
import { EnquiryForm } from '../../../components/EnquiryForm/EnquiryForm';
import { useOutletContext } from 'react-router-dom';
import contactHeroImage from '../../../assets/images/contact-hero.webp';

export const ContactPage: React.FC = () => {
  const context = useOutletContext<{ content?: SiteContent | null; services?: Service[] }>();
  const content = context?.content || null;
  const services = context?.services || [];

  const businessName = content?.businessName || 'Prime Associates — Loans & Constructions';
  const businessPhone = content?.businessPhone || '+91 96555 66613, +91 95144 66600';
  const businessEmail = content?.businessEmail || 'primeassociates2008@gmail.com';
  const officeAddress = content?.officeAddress || 'No. 48, 49, P.R. Complex, Binny Compound Main Street, Kumaran Road, Tirupur - 641601';
  const businessHours = content?.businessHours || 'Monday – Saturday: 9:30 AM – 6:30 PM (IST)';
  const [mounted, setMounted] = React.useState(false);
  const [tilt, setTilt] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 6;
      const y = -(e.clientY / innerHeight - 0.5) * 6;
      setTilt({ x: y, y: x });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
    <div className="bg-[#f8f8f4] min-h-screen text-brand-navy">
      {/* ────────────────────────────────────────────────────────────
          1. CONTENT-SPECIFIC HERO: DIRECT ADVISORY & OFFICE CONNECT
          ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-slate-950 text-white pt-16 pb-16 lg:pt-24 lg:pb-20 border-b border-brand-teal/20">
        {/* Background Photographic Image with Professional Contrast Overlays */}
        <div className="absolute inset-0 z-0">
          <img
            src={contactHeroImage}
            alt="Direct Advisory & Office Connect"
            className={`w-full h-full object-cover object-center brightness-[0.88] transition-transform duration-1000 ease-out ${
              mounted ? 'scale-100' : 'scale-105'
            }`}
            loading="eager"
          />
          {/* Calibrated lightweight overlay stack so image is clearly visible while text is high contrast */}
          <div className="absolute inset-0 bg-black/25" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/50 to-slate-950/25" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/75" />

          {/* Ambient atmospheric pulse glows */}
          <div
            className="absolute -top-24 -left-20 w-80 sm:w-96 h-80 sm:h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none animate-pulse"
            style={{ animationDuration: '6s' }}
          />
          <div className="absolute top-1/3 -right-20 w-80 sm:w-96 h-80 sm:h-96 bg-sky-500/12 rounded-full blur-3xl pointer-events-none" />
        </div>

        <div className="w-[92%] sm:w-[88%] lg:w-[85%] max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Column: Heading & Live Status with 3D Tilt */}
            <div
              style={{
                transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                transition: 'transform 0.25s cubic-bezier(0.25, 1, 0.5, 1)',
                transformStyle: 'preserve-3d',
              }}
              className="lg:col-span-7 space-y-6 will-change-transform"
            >
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
                <span>Advisory Desks Active • Mon–Sat 9:30 AM to 6:30 PM (IST)</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white tracking-tight font-heading leading-tight">
                Connect Directly with Our <br />
                <span className="text-[#38bdf8] drop-shadow-[0_4px_22px_rgba(56,189,248,0.65)] font-extrabold">
                  Senior Property Finance Advisors.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl">
                Have a query regarding property title chain clarity, municipal plot approvals, or high-value mortgage feasibility? Reach our senior advisory desk via phone, email, or schedule an in-person meeting.
              </p>

              {/* Direct Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3.5">
                <a
                  href={`tel:${businessPhone.replace(/\s+/g, '')}`}
                  className="px-6 sm:px-8 py-3.5 bg-brand-teal hover:bg-brand-teal-hover text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-teal-950/40 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Advisory Desk: {businessPhone}</span>
                </a>
                <a
                  href={`mailto:${businessEmail}`}
                  className="px-6 py-3.5 bg-white/[0.08] hover:bg-white/[0.15] text-white border border-white/20 rounded-xl text-xs sm:text-sm font-semibold transition-all backdrop-blur-sm flex items-center gap-2"
                >
                  <Mail className="w-4 h-4 text-brand-teal" />
                  <span>Email Document Dossiers</span>
                </a>
              </div>
            </div>

            {/* Right Column: Corporate Headquarters Snapshot Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#102235]/90 to-[#0a1826]/90 backdrop-blur-xl border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-teal-400" />
                  <span className="text-xs uppercase font-bold tracking-wider text-brand-teal-light font-heading">
                    Corporate Headquarters
                  </span>
                </div>
                <span className="text-[11px] text-emerald-400 font-mono font-bold">Tirupur Central</span>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white font-heading">{businessName}</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {officeAddress}
                </p>
                <div className="text-[11px] text-teal-300 font-medium pt-1">
                  Landmark: Binny Compound Main Street, Kumaran Road, Tirupur
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 text-xs border-t border-white/10">
                <div className="bg-white/[0.04] p-3 rounded-xl border border-white/10">
                  <span className="text-slate-400 block text-[11px]">Direct Phone:</span>
                  <a href={`tel:${businessPhone.replace(/\s+/g, '')}`} className="font-mono text-white font-bold hover:text-teal-300 transition-colors">
                    {businessPhone}
                  </a>
                </div>
                <div className="bg-white/[0.04] p-3 rounded-xl border border-white/10">
                  <span className="text-slate-400 block text-[11px]">Audit Mail:</span>
                  <a href={`mailto:${businessEmail}`} className="font-mono text-white font-bold hover:text-teal-300 truncate block transition-colors">
                    {businessEmail}
                  </a>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="#enquiry-form"
                  className="w-full py-3.5 bg-brand-teal hover:bg-brand-teal-hover text-white text-xs sm:text-sm font-bold rounded-xl text-center transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
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
      <section className="pt-12 sm:pt-16 pb-16 bg-[#f8f8f4]">
        <div className="w-[92%] sm:w-[88%] lg:w-[85%] max-w-7xl mx-auto">
          <div className="max-w-3xl mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-teal-light text-brand-teal text-xs font-bold uppercase tracking-wider mb-2 font-heading border border-brand-teal/20">
              <Navigation className="w-3.5 h-3.5" />
              <span>Geographic Specialization</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-navy font-heading tracking-tight">
              Specialized Regional Lending Desks
            </h2>
            <p className="mt-2 text-brand-slate text-sm sm:text-base leading-relaxed">
              Property regulations and layout approvals differ across micro-markets. Our senior syndication advisors specialize by zone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {regionalDesks.map((desk, idx) => (
              <div
                key={idx}
                className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-brand-border/80 shadow-card ring-1 ring-slate-900/5 p-6 flex flex-col justify-between hover:border-teal-400 hover:shadow-xl transition-all duration-300 group space-y-4"
              >
                <div className="space-y-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-teal-light text-brand-teal flex items-center justify-center font-bold text-xs font-mono border border-brand-teal/20 group-hover:bg-brand-teal group-hover:text-white transition-colors">
                    0{idx + 1}
                  </div>
                  <h3 className="font-bold text-base text-brand-navy font-heading leading-snug">{desk.region}</h3>
                  <p className="text-xs text-brand-slate leading-relaxed">{desk.focus}</p>
                </div>
                
                <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
                  <div className="text-[11px] font-bold text-slate-500 font-heading">
                    {desk.desk}
                  </div>
                  <a
                    href={`tel:${desk.phone.replace(/\s+/g, '')}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-teal group-hover:text-teal-700 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Direct: {desk.phone}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────
          3. ENQUIRY FORM
          ──────────────────────────────────────────────────────────── */}
      <div id="enquiry-form" className="bg-[#f8f8f4]">
        <EnquiryForm
          services={services}
          selectedService={null}
          onClearSelectedService={() => {}}
        />
      </div>
    </div>
  );
};
