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
  Sparkles,
  Shield,
  Scale,
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
  const [counterValues, setCounterValues] = React.useState({
    turnaround: 2,
    lenders: 0,
    sanction: 0,
    capital: 0,
  });

  React.useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    let animationFrameId: number;
    let startTime: number | null = null;
    const duration = 1400; // 1.4s smooth easing

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Silky Quartic ease out
      const eased = 1 - Math.pow(1 - progress, 4);

      setCounterValues({
        turnaround: 2,
        lenders: Math.round(40 * eased),
        sanction: Number((98.4 * eased).toFixed(1)),
        capital: Math.round(120 * eased), // 120 Cr (one zero removed)
      });

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      }
    };

    const timer = setTimeout(() => {
      animationFrameId = requestAnimationFrame(step);
    }, 180);

    return () => {
      clearTimeout(timer);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
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

  const defaultRegionalDesks = [
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

  const regionalDesks = React.useMemo(() => {
    if (content?.branchOffices) {
      try {
        const parsed = JSON.parse(content.branchOffices);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((b: any) => ({
            region: b.name,
            focus: b.address,
            desk: b.timings || 'Active Regional Desk',
            phone: b.phone,
          }));
        }
      } catch (e) {
        console.warn('Unable to parse dynamic branchOffices', e);
      }
    }
    return defaultRegionalDesks;
  }, [content?.branchOffices]);

  return (
    <div className="bg-[#f8f8f4] min-h-screen text-brand-navy">
      {/* ────────────────────────────────────────────────────────────
          1. CONTENT-SPECIFIC HERO: DIRECT ADVISORY & OFFICE CONNECT
          ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-slate-950 text-white pt-10 sm:pt-14 lg:pt-16 pb-12 sm:pb-16 lg:pb-20 border-b border-white/10">
        {/* Background Architectural Photographic Image: Brighter, Fixed & Stable */}
        <div className="absolute inset-0 z-0">
          <img
            src={contactHeroImage}
            alt="Direct Advisory & Office Connect"
            className="w-full h-full object-cover object-center brightness-[1.05] contrast-[1.02]"
            loading="eager"
          />
          {/* Calibrated lightweight translucent overlays so image is clearly visible and bright while text remains crisp */}
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/65 via-slate-950/25 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-slate-950/50" />

          {/* Ambient atmospheric pulse glows */}
          <div
            className="absolute -top-24 -left-20 w-80 sm:w-96 h-80 sm:h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none animate-pulse"
            style={{ animationDuration: '6s' }}
          />
          <div className="absolute top-1/3 -right-20 w-80 sm:w-96 h-80 sm:h-96 bg-sky-500/12 rounded-full blur-3xl pointer-events-none" />
        </div>

        <div className="w-[92%] sm:w-[88%] lg:w-[85%] max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* ── LEFT COLUMN: Stays firmly in place with staggered entrance ── */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-7">
              {/* Institutional Status Beacon - Fixed in place */}
              <div
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateY(0)' : 'translateY(24px)',
                  transition: 'opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.12s, transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.12s',
                }}
                className="flex flex-wrap items-center gap-3"
              >
                <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-white/15 text-slate-100 text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md shadow-sm font-heading">
                  <span className="w-2 h-2 rounded-full bg-[#20B2AA] animate-pulse"></span>
                  <span>Direct Advisory Desk • Mon–Sat 9:30 AM to 6:30 PM (IST)</span>
                </div>
                <div className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-300 font-medium bg-white/5 px-3 py-1 rounded-full border border-white/10 font-sans">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Confidential Underwriting Protocol</span>
                </div>
              </div>

              {/* Display Headline - ONLY THIS HEADLINE TEXT RESPONDS TO CURSOR TILT */}
              <div
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted
                    ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
                    : 'translateY(28px)',
                  transition: 'opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.25s, transform 0.2s cubic-bezier(0.25, 1, 0.5, 1)',
                  transformStyle: 'preserve-3d',
                }}
                className="space-y-3 will-change-transform"
              >
                <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-extrabold text-white tracking-tight leading-[1.18] sm:leading-[1.14] font-heading drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
                  Connect Directly with Our{' '}
                  <span className="shimmer-headline-text text-[#38bdf8]">
                    Senior Property Finance Advisors.
                  </span>
                </h1>
              </div>

              {/* Description Paragraph - Stays firmly in place */}
              <p
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateY(0)' : 'translateY(24px)',
                  transition: 'opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.35s, transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.35s',
                }}
                className="text-xs sm:text-sm md:text-base text-slate-200 font-sans font-normal leading-relaxed max-w-2xl pt-1"
              >
                Have a query regarding property title chain clarity, municipal plot approvals, or high-value mortgage feasibility? Reach our senior advisory desk via phone, email, or schedule an in-person meeting.
              </p>

              {/* 4 Interactive Institutional Metrics Grid - Silky Smooth Numbers Without Glitch */}
              <div
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateY(0)' : 'translateY(28px)',
                  transition: 'opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.42s, transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.42s',
                }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5 pt-1"
              >
                <div className="relative group p-3 sm:p-4 rounded-2xl bg-white/[0.08] backdrop-blur-md border border-white/15 hover:border-teal-400/50 hover:bg-white/[0.14] shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-400/30 font-heading">
                      Response
                    </span>
                  </div>
                  <div className="text-xl xs:text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono tabular-nums">
                    &lt;{counterValues.turnaround}h
                  </div>
                  <div className="text-xs font-bold text-slate-200 mt-1 font-heading">
                    Direct Callback
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 leading-snug line-clamp-1 font-sans">
                    Fast-Track Priority
                  </div>
                </div>

                <div className="relative group p-3 sm:p-4 rounded-2xl bg-white/[0.08] backdrop-blur-md border border-white/15 hover:border-teal-400/50 hover:bg-white/[0.14] shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-400/30 font-heading">
                      Zonal Panel
                    </span>
                  </div>
                  <div className="text-xl xs:text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono tabular-nums min-w-[50px]">
                    {counterValues.lenders}+
                  </div>
                  <div className="text-xs font-bold text-slate-200 mt-1 font-heading">
                    Partner Banks
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 leading-snug line-clamp-1 font-sans">
                    PSU, Private &amp; NBFCs
                  </div>
                </div>

                <div className="relative group p-3 sm:p-4 rounded-2xl bg-white/[0.08] backdrop-blur-md border border-white/15 hover:border-teal-400/50 hover:bg-white/[0.14] shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-400/30 font-heading">
                      Pre-Audited
                    </span>
                  </div>
                  <div className="text-xl xs:text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono tabular-nums min-w-[70px]">
                    {counterValues.sanction}%
                  </div>
                  <div className="text-xs font-bold text-slate-200 mt-1 font-heading">
                    Sanction Ratio
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 leading-snug line-clamp-1 font-sans">
                    30-Yr Legal Due Diligence
                  </div>
                </div>

                <div className="relative group p-3 sm:p-4 rounded-2xl bg-white/[0.08] backdrop-blur-md border border-white/15 hover:border-teal-400/50 hover:bg-white/[0.14] shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-400/30 font-heading">
                      Volume
                    </span>
                  </div>
                  <div className="text-xl xs:text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono tabular-nums min-w-[70px]">
                    ₹{counterValues.capital}+ Cr
                  </div>
                  <div className="text-xs font-bold text-slate-200 mt-1 font-heading">
                    Facilitated Capital
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 leading-snug line-clamp-1 font-sans">
                    15-Year Practice
                  </div>
                </div>
              </div>

              {/* Direct Buttons */}
              <div
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateY(0)' : 'translateY(24px)',
                  transition: 'opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.5s, transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.5s',
                }}
                className="pt-2 flex flex-wrap items-center gap-3.5"
              >
                <a
                  href={`tel:${businessPhone.replace(/\s+/g, '').split(',')[0]}`}
                  className="px-6 sm:px-8 py-3.5 rounded-full bg-gradient-to-r from-teal-500 to-[#20B2AA] hover:from-teal-400 hover:to-teal-500 text-white font-extrabold text-xs sm:text-sm tracking-wide shadow-lg shadow-teal-950/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 font-heading cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Advisory Desk: {businessPhone}</span>
                </a>
                <a
                  href={`mailto:${businessEmail}`}
                  className="px-6 py-3.5 rounded-full bg-slate-900/85 hover:bg-slate-800/90 text-white font-bold text-xs sm:text-sm border border-white/20 hover:border-teal-400/50 backdrop-blur-md shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 font-heading cursor-pointer"
                >
                  <Mail className="w-4 h-4 text-brand-teal" />
                  <span>Email Document Dossiers</span>
                </a>
              </div>

              {/* Bottom Safety & Compliance Indicators */}
              <div
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateY(0)' : 'translateY(24px)',
                  transition: 'opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.6s, transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.6s',
                }}
                className="pt-2 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-300 font-sans"
              >
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>RBI Fair Practice Code Compliant</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-teal-400" />
                  <span>Zero Unauthorized Bureau Enquiries</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-cyan-400" />
                  <span>Zero Cash Collection Policy</span>
                </div>
              </div>
            </div>

            {/* Right Column: Corporate Headquarters Snapshot Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#102235]/90 to-[#0a1826]/90 backdrop-blur-xl border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative space-y-5 font-sans">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-teal-400" />
                  <span className="text-xs uppercase font-extrabold tracking-wider text-brand-teal-light font-heading">
                    Corporate Headquarters
                  </span>
                </div>
                <span className="text-[11px] text-emerald-400 font-mono font-bold">Tirupur Central</span>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white font-heading">{businessName}</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                  {officeAddress}
                </p>
                <div className="text-[11px] text-teal-300 font-medium pt-1 font-sans">
                  Landmark: Binny Compound Main Street, Kumaran Road, Tirupur
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 text-xs border-t border-white/10">
                <div className="bg-white/[0.04] p-3 rounded-xl border border-white/10">
                  <span className="text-slate-400 block text-[11px] font-heading">Direct Phone:</span>
                  <a href={`tel:${businessPhone.replace(/\s+/g, '').split(',')[0]}`} className="font-mono text-white font-bold hover:text-teal-300 transition-colors">
                    {businessPhone}
                  </a>
                </div>
                <div className="bg-white/[0.04] p-3 rounded-xl border border-white/10">
                  <span className="text-slate-400 block text-[11px] font-heading">Audit Mail:</span>
                  <a href={`mailto:${businessEmail}`} className="font-mono text-white font-bold hover:text-teal-300 truncate block transition-colors">
                    {businessEmail}
                  </a>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="#enquiry-form"
                  className="w-full py-3.5 bg-brand-teal hover:bg-brand-teal-hover text-white text-xs sm:text-sm font-bold rounded-xl text-center transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer font-heading tracking-wide"
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
          3. ENQUIRY FORM (Header 'Schedule a Confidential Consultation' removed for Contact page)
          ──────────────────────────────────────────────────────────── */}
      <div id="enquiry-form" className="bg-[#f8f8f4]">
        <EnquiryForm
          services={services}
          selectedService={null}
          onClearSelectedService={() => {}}
          hideHeader={true}
        />
      </div>
    </div>
  );
};
