import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
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
  Copy,
  Check,
  MessageCircle,
  FileText,
  Car,
  Compass,
  ArrowUpRight,
  Landmark,
  BadgePercent,
  Layers,
} from 'lucide-react';
import { SiteContent, Service } from '../../../types';
import { CDN_IMAGES, getHeroSrcSet } from '../../../constants/cloudinaryImages';

const contactHeroImage = CDN_IMAGES.contactHero;

interface SpecializedDesk {
  number: string;
  region: string;
  badge: string;
  tag: string;
  focus: string;
  bulletPoints: string[];
  officer: string;
  desk: string;
  phone: string;
  cleanPhone: string;
  timings: string;
  icon: React.ReactNode;
}

export const ContactPage: React.FC = () => {
  const context = useOutletContext<{ content?: SiteContent | null; services?: Service[] }>();
  const content = context?.content || null;

  const businessName = content?.businessName || 'Prime Associates — Loans & Constructions';
  const businessPhone = content?.businessPhone || '+91 96555 66613, +91 95144 66600';
  const businessEmail = content?.businessEmail || 'primeassociates2008@gmail.com';
  const officeAddress =
    content?.officeAddress ||
    'No. 48, 49, P.R. Complex, Binny Compound Main Street, Kumaran Road, Tirupur - 641601';

  const [mounted, setMounted] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [currentTimeIST, setCurrentTimeIST] = useState<string>('');
  const [isOfficeOpen, setIsOfficeOpen] = useState<boolean>(true);

  const [counterValues, setCounterValues] = useState({
    turnaround: 2,
    lenders: 0,
    sanction: 0,
    capital: 0,
  });

  // Calculate real-time IST office status (Monday-Saturday, 9:30 AM - 6:30 PM)
  useEffect(() => {
    const updateOfficeStatus = () => {
      const now = new Date();
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const istDate = new Date(utc + 3600000 * 5.5);
      const day = istDate.getDay(); // 0 is Sunday, 1-6 is Mon-Sat
      const hours = istDate.getHours();
      const minutes = istDate.getMinutes();
      const totalMinutes = hours * 60 + minutes;

      // 9:30 AM is 570 mins, 6:30 PM is 1110 mins
      const open = day >= 1 && day <= 6 && totalMinutes >= 570 && totalMinutes <= 1110;
      setIsOfficeOpen(open);

      setCurrentTimeIST(
        istDate.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      );
    };

    updateOfficeStatus();
    const timer = setInterval(updateOfficeStatus, 30000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let animationFrameId: number;
    let startTime: number | null = null;
    const duration = 1400;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);

      setCounterValues({
        turnaround: 2,
        lenders: Math.round(40 * eased),
        sanction: Number((98.4 * eased).toFixed(1)),
        capital: Math.round(120 * eased),
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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth < 768) return;
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 6;
      const y = -(e.clientY / innerHeight - 0.5) * 6;
      setTilt({ x: y, y: x });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(
      `${businessName}, ${officeAddress}, Landmark: Binny Compound Main St, Kumaran Road, Tirupur - 641601, Tamil Nadu`
    );
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2500);
  };

  // 4 Core Specialized Loan & Advisory Desks of Prime Associates
  const specializedDesks: SpecializedDesk[] = [
    {
      number: '01',
      region: 'Land & Home Loans Desk',
      badge: 'From 7.25% p.a.',
      tag: 'Core Speciality',
      focus: 'Self-construction financing on owned plots, ready villa purchase, apartment booking, and PMAY interest subsidy syndication.',
      bulletPoints: [
        'Disbursements against architect stage completion certificates',
        'Starting interest rate from 7.25% with government subsidy',
        'Extended repayment tenure up to 30 years',
      ],
      officer: 'Senior Housing Syndication Lead',
      desk: 'Tirupur HQ • Ground Floor Desk 01',
      phone: '+91 96555 66613',
      cleanPhone: '919655566613',
      timings: 'Monday – Saturday: 9:30 AM – 6:30 PM',
      icon: <Building2 className="w-5 h-5 text-brand-teal" />,
    },
    {
      number: '02',
      region: 'Mortgage (LAP) & Commercial Desk',
      badge: 'From 8.50% p.a.',
      tag: 'Secured Liquidity',
      focus: 'High-value business liquidity against residential houses, industrial sheds, empty converted plots, and commercial showroom collateral.',
      bulletPoints: [
        'High sanction quantum up to ₹25 Crores for businesses',
        'Acceptable against concrete buildings, tiled houses & plots',
        'Fast in-principle sanction within 48 to 72 hours',
      ],
      officer: 'Commercial Mortgage Underwriting Specialist',
      desk: 'Tirupur HQ • 1st Floor Mortgage Syndicate',
      phone: '+91 95144 66600',
      cleanPhone: '919514466600',
      timings: 'Monday – Saturday: 9:30 AM – 6:30 PM',
      icon: <ShieldCheck className="w-5 h-5 text-brand-teal" />,
    },
    {
      number: '03',
      region: 'Bank Takeover & Rate Reduction',
      badge: 'Zero Advance Fees',
      tag: 'Debt Takeover',
      focus: 'Transfer high-rate mortgage and home loans from private NBFCs to Government (PSU) banks, saving lakhs in monthly interest charges.',
      bulletPoints: [
        'Reduce interest rate down to 7.25% benchmark PSU rate',
        'Zero advance fees with end-to-end documentation takeover',
        'Additional high-value top-up facility sanctioned',
      ],
      officer: 'Portfolio Takeover & Debt Consolidation Lead',
      desk: 'Tirupur HQ • Zonal Transfer Desk 03',
      phone: '+91 96555 66613',
      cleanPhone: '919655566613',
      timings: 'Monday – Saturday: 9:30 AM – 6:30 PM',
      icon: <Scale className="w-5 h-5 text-brand-teal" />,
    },
    {
      number: '04',
      region: 'Vehicle & Commercial Fleet Desk',
      badge: 'Quick 24h Clearance',
      tag: 'Automotive Fleet',
      focus: 'Funding for private cars, commercial transport vehicles, school buses, JCB/construction machinery, and existing fleet refinance.',
      bulletPoints: [
        'Financing available for both new and used vehicles',
        'Up to 90% on-road funding with flexible repayment',
        'Minimal paperwork with quick 24-hour sanction',
      ],
      officer: 'Automotive & Commercial Fleet Manager',
      desk: 'Tirupur HQ • Transport Finance Desk 04',
      phone: '+91 95144 66600',
      cleanPhone: '919514466600',
      timings: 'Monday – Saturday: 9:30 AM – 6:30 PM',
      icon: <Car className="w-5 h-5 text-brand-teal" />,
    },
  ];

  return (
    <div className="bg-[#f8f8f4] min-h-screen text-brand-navy font-sans antialiased selection:bg-brand-teal selection:text-white">
      {/* ────────────────────────────────────────────────────────────
          1. HERO SECTION: DIRECT ADVISORY & REAL-TIME CONNECT
          ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-slate-950 text-white pt-10 sm:pt-14 lg:pt-16 pb-12 sm:pb-16 lg:pb-20 border-b border-white/10">
        <div className="absolute inset-0 z-0">
          <img
            src={contactHeroImage}
            srcSet={getHeroSrcSet(contactHeroImage)}
            sizes="100vw"
            alt="Direct Advisory & Office Connect"
            className="w-full h-full object-cover object-center brightness-[1.05] contrast-[1.02]"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-950/35 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-slate-950/60" />

          {/* Ambient lighting glows */}
          <div
            className="absolute -top-24 -left-20 w-80 sm:w-96 h-80 sm:h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none animate-pulse"
            style={{ animationDuration: '6s' }}
          />
          <div className="absolute top-1/3 -right-20 w-80 sm:w-96 h-80 sm:h-96 bg-sky-500/12 rounded-full blur-3xl pointer-events-none" />
        </div>

        <div className="w-[92%] sm:w-[88%] lg:w-[85%] max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-5 sm:space-y-6">
              {/* Real-time Office Status Indicator */}
              <div
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateY(0)' : 'translateY(24px)',
                  transition:
                    'opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.12s, transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.12s',
                }}
                className="flex flex-wrap items-center gap-2.5 sm:gap-3"
              >
                <div
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md shadow-sm font-heading border ${
                    isOfficeOpen
                      ? 'bg-emerald-950/80 text-emerald-200 border-emerald-500/40'
                      : 'bg-amber-950/80 text-amber-200 border-amber-500/40'
                  }`}
                >
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      isOfficeOpen ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                    }`}
                  />
                  <span>
                    {isOfficeOpen
                      ? `Tirupur Office OPEN NOW • Closes 6:30 PM IST (${currentTimeIST})`
                      : `Office Closed Now • Re-opens at 9:30 AM IST (Mon–Sat)`}
                  </span>
                </div>

                <div className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-300 font-medium bg-white/5 px-3 py-1 rounded-full border border-white/10 font-sans">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-300" />
                  <span>Direct Zonal Advisory • Est. 2008</span>
                </div>
              </div>

              {/* Display Headline */}
              <div
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted
                    ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
                    : 'translateY(28px)',
                  transition:
                    'opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.25s, transform 0.2s cubic-bezier(0.25, 1, 0.5, 1)',
                  transformStyle: 'preserve-3d',
                }}
                className="space-y-3 will-change-transform"
              >
                <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-[46px] font-extrabold text-white tracking-tight leading-[1.18] sm:leading-[1.14] font-heading drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
                  Connect Directly with Our{' '}
                  <span className="shimmer-headline-text text-[#38bdf8]">
                    Senior Property Finance Advisors.
                  </span>
                </h1>
              </div>

              {/* Description */}
              <p
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateY(0)' : 'translateY(24px)',
                  transition:
                    'opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.35s, transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.35s',
                }}
                className="text-xs sm:text-sm md:text-base text-slate-200 font-sans font-normal leading-relaxed max-w-2xl pt-1"
              >
                Have a query regarding property title regularities, layout conversion orders, or private-to-government bank takeovers? Reach our senior advisory desk directly via phone, WhatsApp, email, or visit our Tirupur central headquarters.
              </p>

              {/* Real-Time Fast Action Buttons */}
              <div
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateY(0)' : 'translateY(24px)',
                  transition:
                    'opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.45s, transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.45s',
                }}
                className="pt-2 flex flex-wrap items-center gap-3"
              >
                <a
                  href="tel:+919655566613"
                  className="px-5 sm:px-7 py-3 rounded-full bg-gradient-to-r from-teal-500 to-[#20B2AA] hover:from-teal-400 hover:to-teal-500 text-white font-extrabold text-xs sm:text-sm tracking-wide shadow-lg shadow-teal-950/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 font-heading cursor-pointer whitespace-nowrap"
                >
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span>Call: +91 96555 66613</span>
                </a>

                <a
                  href="https://wa.me/919655566613?text=Hello%20Prime%20Associates,%20I%20would%20like%20to%20consult%20on%20property%20loans."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 sm:px-6 py-3 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm tracking-wide shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 font-heading cursor-pointer whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4 flex-shrink-0" />
                  <span>Chat on WhatsApp</span>
                </a>

                <a
                  href={`mailto:${businessEmail}?subject=Property%20Loan%20Consultation%20Dossier`}
                  className="px-5 sm:px-6 py-3 rounded-full bg-slate-900/85 hover:bg-slate-800/90 text-white font-bold text-xs sm:text-sm border border-white/20 hover:border-teal-400/50 backdrop-blur-md shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 font-heading cursor-pointer whitespace-nowrap"
                >
                  <Mail className="w-4 h-4 text-teal-300 flex-shrink-0" />
                  <span>Email Dossier</span>
                </a>
              </div>

              {/* Trust Badges */}
              <div
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateY(0)' : 'translateY(24px)',
                  transition:
                    'opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.55s, transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.55s',
                }}
                className="pt-1 flex flex-wrap items-center gap-3 sm:gap-6 text-xs text-slate-300 font-sans"
              >
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>RBI Fair Practice Code Compliant</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-teal-400 flex-shrink-0" />
                  <span>Zero Advance Processing Fees</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span>40+ PSU &amp; Private Bank Desks</span>
                </div>
              </div>
            </div>

            {/* Right Column: Corporate Headquarters Snapshot Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#102235]/95 to-[#0a1826]/95 backdrop-blur-xl border border-white/15 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-2xl relative space-y-4 sm:space-y-5 font-sans">
              <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-teal-400" />
                  <span className="text-xs uppercase font-extrabold tracking-wider text-teal-200 font-heading">
                    Corporate Headquarters
                  </span>
                </div>
                <span className="text-[11px] text-emerald-400 font-mono font-bold bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-400/30">
                  Tirupur Central
                </span>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-base sm:text-lg font-bold text-white font-heading">{businessName}</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                  {officeAddress}
                </p>
                <div className="text-[11px] text-teal-300 font-medium pt-0.5 font-sans">
                  Landmark: Binny Compound Main Street, Kumaran Road, Tirupur
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs border-t border-white/10">
                <div className="bg-white/[0.04] p-3 rounded-xl border border-white/10">
                  <span className="text-slate-400 block text-[10px] font-heading uppercase tracking-wider">
                    Primary Phone Lines:
                  </span>
                  <a
                    href="tel:+919655566613"
                    className="font-mono text-white font-bold hover:text-teal-300 transition-colors block mt-0.5"
                  >
                    +91 96555 66613
                  </a>
                  <a
                    href="tel:+919514466600"
                    className="font-mono text-slate-300 text-[11px] font-semibold hover:text-teal-300 transition-colors block"
                  >
                    +91 95144 66600
                  </a>
                </div>
                <div className="bg-white/[0.04] p-3 rounded-xl border border-white/10">
                  <span className="text-slate-400 block text-[10px] font-heading uppercase tracking-wider">
                    Direct Email Desk:
                  </span>
                  <a
                    href={`mailto:${businessEmail}`}
                    className="font-mono text-teal-200 font-bold hover:text-white truncate block mt-0.5 transition-colors text-xs"
                  >
                    {businessEmail}
                  </a>
                  <span className="text-slate-400 text-[10px] block mt-0.5">Scanned files &amp; ITRs</span>
                </div>
              </div>

              <div className="pt-1 flex flex-col sm:flex-row gap-2">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=P.R.+Complex+Binny+Compound+Kumaran+Road+Tirupur+641601"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 bg-brand-teal hover:bg-brand-teal-hover text-white text-xs font-bold rounded-xl text-center transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer font-heading tracking-wide"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Get Directions on Map</span>
                </a>
                <button
                  type="button"
                  onClick={handleCopyAddress}
                  className="py-3 px-4 bg-white/10 hover:bg-white/15 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 border border-white/15 cursor-pointer font-heading"
                >
                  {copiedAddress ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300">Address Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-300" />
                      <span>Copy Address</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────
          2. REAL-TIME DIRECT CONTACT CHANNELS (4 EXECUTIVE CARDS)
          ──────────────────────────────────────────────────────────── */}
      <section className="pt-12 sm:pt-16 pb-12 sm:pb-14 bg-white border-b border-brand-border/70">
        <div className="w-[92%] sm:w-[88%] lg:w-[85%] max-w-7xl mx-auto">
          <div className="max-w-3xl mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-teal-light text-brand-teal text-xs font-bold uppercase tracking-wider mb-2 font-heading border border-brand-teal/20">
              <Phone className="w-3.5 h-3.5" />
              <span>Direct Real-Time Communication</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-navy font-heading tracking-tight">
              Direct Contact &amp; Underwriting Channels
            </h2>
            <p className="mt-2 text-brand-slate text-xs sm:text-sm md:text-base leading-relaxed font-sans">
              Connect directly with our authorized banking syndication officers without intermediary agents or call centers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {/* Card 1: Direct Phone Lines */}
            <div className="bg-slate-50/80 rounded-2xl p-5 sm:p-6 border border-slate-200/90 hover:border-teal-400/60 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/15 border border-teal-500/30 text-brand-teal flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Phone className="w-5 h-5 text-brand-teal" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-brand-navy font-heading">
                  Priority Phone Lines
                </h3>
                <p className="text-xs text-brand-slate font-sans leading-relaxed">
                  Direct telephone contact with our senior loan underwriting officers during business hours.
                </p>
                <div className="space-y-1.5 pt-1 font-mono text-xs font-bold">
                  <a
                    href="tel:+919655566613"
                    className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 text-brand-navy hover:text-brand-teal hover:border-brand-teal transition-colors"
                  >
                    <span>+91 96555 66613</span>
                    <span className="text-[10px] font-sans text-emerald-600 font-bold">Home Loans</span>
                  </a>
                  <a
                    href="tel:+919514466600"
                    className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 text-brand-navy hover:text-brand-teal hover:border-brand-teal transition-colors"
                  >
                    <span>+91 95144 66600</span>
                    <span className="text-[10px] font-sans text-sky-600 font-bold">Mortgage &amp; LAP</span>
                  </a>
                </div>
              </div>
              <a
                href="tel:+919655566613"
                className="inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-brand-navy text-white text-xs font-bold font-heading hover:bg-slate-800 transition-colors"
              >
                <span>Call Primary Line</span>
                <Phone className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Card 2: WhatsApp Advisory */}
            <div className="bg-slate-50/80 rounded-2xl p-5 sm:p-6 border border-slate-200/90 hover:border-emerald-400/60 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <MessageCircle className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-brand-navy font-heading">
                  WhatsApp Direct Chat
                </h3>
                <p className="text-xs text-brand-slate font-sans leading-relaxed">
                  Send property documents, preliminary queries, or sanction letters for instant preliminary review.
                </p>
                <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200/60 text-[11px] text-emerald-800 font-sans">
                  <span className="font-bold block">Avg Response: Under 15 Minutes</span>
                  <span className="text-[10px] text-emerald-700">Encrypted document verification via WhatsApp</span>
                </div>
              </div>
              <a
                href="https://wa.me/919655566613?text=Hello%20Prime%20Associates,%20I%20would%20like%20to%20consult%20on%20property%20loans."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold font-heading shadow-xs transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Open WhatsApp Chat</span>
              </a>
            </div>

            {/* Card 3: Email Audit & Dossier */}
            <div className="bg-slate-50/80 rounded-2xl p-5 sm:p-6 border border-slate-200/90 hover:border-sky-400/60 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Mail className="w-5 h-5 text-sky-600" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-brand-navy font-heading">
                  Official Audit Email
                </h3>
                <p className="text-xs text-brand-slate font-sans leading-relaxed">
                  Send complete financial dossiers, 3-year ITRs, parent deeds, and municipal layout approvals.
                </p>
                <div className="p-2.5 rounded-lg bg-sky-50/70 border border-sky-200/60 text-xs font-mono font-bold text-sky-950 truncate">
                  {businessEmail}
                </div>
              </div>
              <a
                href={`mailto:${businessEmail}?subject=Loan%20Application%20Dossier`}
                className="inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-slate-900 text-white text-xs font-bold font-heading hover:bg-slate-800 transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Compose Email</span>
              </a>
            </div>

            {/* Card 4: Operating Hours & In-Person */}
            <div className="bg-slate-50/80 rounded-2xl p-5 sm:p-6 border border-slate-200/90 hover:border-brand-teal/60 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-brand-teal-light border border-brand-teal/30 text-brand-teal flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Clock className="w-5 h-5 text-brand-teal" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-brand-navy font-heading">
                  Office Hours (IST)
                </h3>
                <div className="space-y-1.5 text-xs text-brand-slate font-sans">
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="font-semibold text-brand-navy font-heading">Monday – Friday:</span>
                    <span className="font-mono text-emerald-700 font-bold">9:30 AM – 6:30 PM</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="font-semibold text-brand-navy font-heading">Saturday:</span>
                    <span className="font-mono text-emerald-700 font-bold">9:30 AM – 6:30 PM</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="font-semibold text-brand-navy font-heading">Sunday:</span>
                    <span className="text-rose-600 font-medium font-sans">Closed (By Appointment)</span>
                  </div>
                </div>
              </div>
              <div className="text-[11px] text-center font-medium text-slate-500 font-sans">
                Walk-in Document Review Welcome
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────
          3. CORPORATE HEADQUARTERS & INTERACTIVE LOCATION MAP
          ──────────────────────────────────────────────────────────── */}
      <section className="pt-12 sm:pt-16 pb-16 bg-[#f8f8f4]">
        <div className="w-[92%] sm:w-[88%] lg:w-[85%] max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            {/* Left Column: Physical Office Guide */}
            <div className="lg:col-span-5 bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-brand-border/80 shadow-card flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-teal-light text-brand-teal text-xs font-bold uppercase tracking-wider font-heading border border-brand-teal/20">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Head Office Location</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-extrabold text-brand-navy font-heading tracking-tight">
                  Visit Prime Associates Headquarters
                </h3>

                <p className="text-xs sm:text-sm text-brand-slate leading-relaxed font-sans">
                  Located in the commercial heart of Tirupur at P.R. Complex on Kumaran Road, our central office houses our senior legal auditors, banking desk managers, and documentation officers.
                </p>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="text-xs font-bold text-brand-navy font-heading flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-brand-teal" />
                    <span>Exact Postal Address:</span>
                  </div>
                  <p className="text-xs text-brand-slate font-sans leading-relaxed">
                    <strong className="font-heading text-brand-navy">Prime Associates — Loans &amp; Constructions</strong><br />
                    No. 48, 49, P.R. Complex, Binny Compound Main Street,<br />
                    Kumaran Road, Tirupur - 641601, Tamil Nadu, India.
                  </p>
                </div>

                <div className="space-y-2 text-xs font-sans text-brand-slate">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span><strong className="text-brand-navy font-semibold">5 Minutes</strong> from Tirupur Central Railway Station</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span><strong className="text-brand-navy font-semibold">2 Minutes</strong> from Old Bus Stand / Kumaran Road Junction</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>Dedicated two-wheeler &amp; four-wheeler parking at complex</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=P.R.+Complex+Binny+Compound+Kumaran+Road+Tirupur+641601"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero-btn-primary flex-1 py-3.5 px-4 text-xs sm:text-sm font-bold font-heading text-white flex items-center justify-center gap-2 text-center cursor-pointer tracking-wide"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Open in Google Maps</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopyAddress}
                  className="py-3.5 px-4 rounded-xl border border-slate-300 hover:border-brand-teal text-brand-navy text-xs sm:text-sm font-bold font-heading bg-slate-50 hover:bg-slate-100 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {copiedAddress ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700 font-heading">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-500" />
                      <span className="font-heading">Copy Address</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right Column: Google Maps Interactive Embed */}
            <div className="lg:col-span-7 bg-white rounded-2xl sm:rounded-3xl border border-brand-border/80 shadow-card overflow-hidden flex flex-col relative min-h-[380px] sm:min-h-[440px]">
              <div className="p-3.5 sm:p-4 bg-slate-900 text-white flex items-center justify-between z-10 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-teal-400" />
                  <span className="text-xs font-bold font-heading">
                    P.R. Complex, Binny Compound Main Street, Kumaran Road, Tirupur
                  </span>
                </div>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=P.R.+Complex+Binny+Compound+Kumaran+Road+Tirupur+641601"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-teal-300 hover:text-white flex items-center gap-1 font-heading font-semibold"
                >
                  <span>Fullscreen</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="w-full flex-1 relative bg-slate-100">
                <iframe
                  title="Prime Associates Office Location Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3914.887293881474!2d77.3485!3d11.1085!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba907b22a07c309%3A0x6b772b8418f43058!2sKumaran%20Rd%2C%20Binny%20Compound%2C%20Tiruppur%2C%20Tamil%20Nadu%20641601!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  className="w-full h-full min-h-[340px] sm:min-h-[400px] border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────
          4. SPECIALIZED LOAN & ADVISORY DESKS (FULL 4-COLUMN RICH GRID)
          ──────────────────────────────────────────────────────────── */}
      <section className="pt-12 sm:pt-16 pb-16 bg-white border-t border-brand-border/70">
        <div className="w-[92%] sm:w-[88%] lg:w-[85%] max-w-7xl mx-auto">
          <div className="max-w-3xl mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-teal-light text-brand-teal text-xs font-bold uppercase tracking-wider mb-2 font-heading border border-brand-teal/20">
              <Compass className="w-3.5 h-3.5" />
              <span>Departmental Specialization</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-navy font-heading tracking-tight">
              Specialized Loan &amp; Advisory Desks
            </h2>
            <p className="mt-2 text-brand-slate text-xs sm:text-sm md:text-base leading-relaxed font-sans">
              Connect directly with dedicated desks specialized in home financing, mortgage liquidity, bank takeovers, and fleet syndication.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {specializedDesks.map((desk) => (
              <div
                key={desk.number}
                className="bg-[#fafaf8] rounded-2xl sm:rounded-3xl border border-brand-border hover:border-brand-teal shadow-xs hover:shadow-xl transition-all duration-300 p-5 sm:p-6 flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3.5">
                  {/* Top Bar: Desk Number + Tag + Icon */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-xl bg-brand-teal-light text-brand-teal flex items-center justify-center font-extrabold text-xs font-mono border border-brand-teal/20 group-hover:bg-brand-teal group-hover:text-white transition-colors">
                        {desk.number}
                      </span>
                      <span className="text-[10px] uppercase font-bold font-heading px-2 py-0.5 rounded-full bg-slate-200/70 text-slate-700">
                        {desk.tag}
                      </span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-white border border-slate-200 text-brand-teal group-hover:scale-110 transition-transform">
                      {desk.icon}
                    </div>
                  </div>

                  {/* Title & Badge */}
                  <div>
                    <h3 className="font-extrabold text-base sm:text-lg text-brand-navy font-heading leading-snug group-hover:text-brand-teal transition-colors">
                      {desk.region}
                    </h3>
                    <span className="inline-block mt-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded font-heading">
                      {desk.badge}
                    </span>
                  </div>

                  {/* Focus Description */}
                  <p className="text-xs text-brand-slate font-sans leading-relaxed">
                    {desk.focus}
                  </p>

                  {/* Department Highlights */}
                  <ul className="space-y-1.5 pt-1 text-[11px] text-slate-600 font-sans border-t border-slate-200/80">
                    {desk.bulletPoints.map((point, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-teal flex-shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Desk Footer Details */}
                <div className="pt-3.5 border-t border-slate-200 space-y-2.5 font-sans">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-heading">
                      Lead Underwriter:
                    </span>
                    <span className="text-xs font-bold text-brand-navy font-heading block">
                      {desk.officer}
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      {desk.desk}
                    </span>
                  </div>

                  {/* Direct Contact Buttons */}
                  <div className="flex items-center gap-2 pt-1">
                    <a
                      href={`tel:${desk.phone.replace(/\s+/g, '')}`}
                      className="flex-1 py-2 px-2.5 rounded-xl bg-brand-navy hover:bg-slate-800 text-white text-[11px] font-bold font-heading flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap shadow-xs"
                    >
                      <Phone className="w-3 h-3 flex-shrink-0" />
                      <span>{desk.phone}</span>
                    </a>
                    <a
                      href={`https://wa.me/${desk.cleanPhone}?text=Hello%20Prime%20Associates,%20I%20would%20like%20to%20enquire%20with%20the%20${encodeURIComponent(desk.region)}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white transition-colors flex items-center justify-center shadow-xs flex-shrink-0"
                      title="Chat on WhatsApp"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────
          5. DOCUMENT CHECKLIST BEFORE VISITING IN PERSON
          ──────────────────────────────────────────────────────────── */}
      <section className="pt-12 sm:pt-14 pb-14 sm:pb-16 bg-[#f8f8f4] border-t border-brand-border/70">
        <div className="w-[92%] sm:w-[88%] lg:w-[85%] max-w-7xl mx-auto">
          <div className="max-w-3xl mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-teal-light text-brand-teal text-xs font-bold uppercase tracking-wider mb-2 font-heading border border-brand-teal/20">
              <FileText className="w-3.5 h-3.5" />
              <span>Office Visit Preparation</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy font-heading tracking-tight">
              Documents to Bring for In-Person Underwriting Review
            </h2>
            <p className="mt-2 text-brand-slate text-xs sm:text-sm leading-relaxed font-sans">
              Carrying these initial copies ensures our senior advisors can perform an instant preliminary eligibility calculation and legal review during your visit.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-2xl border border-brand-border space-y-2">
              <div className="text-xs font-bold text-brand-navy font-heading flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>1. KYC Identity Proof</span>
              </div>
              <p className="text-xs text-brand-slate font-sans leading-relaxed">
                Aadhaar Card, PAN Card, and passport-size photographs of primary applicant and co-applicants.
              </p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-brand-border space-y-2">
              <div className="text-xs font-bold text-brand-navy font-heading flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>2. Income Proofs</span>
              </div>
              <p className="text-xs text-brand-slate font-sans leading-relaxed">
                Salaried: Last 3 months payslips &amp; Form 16.<br />
                Self-Employed: Last 3 years ITR with computation &amp; 6 months bank statement.
              </p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-brand-border space-y-2">
              <div className="text-xs font-bold text-brand-navy font-heading flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>3. Property Title Copies</span>
              </div>
              <p className="text-xs text-brand-slate font-sans leading-relaxed">
                Sale Deed / Parent Deed copy, latest Encumbrance Certificate (EC), Patta / Chitta, and Khata extract.
              </p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-brand-border space-y-2">
              <div className="text-xs font-bold text-brand-navy font-heading flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>4. Civil / Plan Estimates</span>
              </div>
              <p className="text-xs text-brand-slate font-sans leading-relaxed">
                For self-construction: Licensed engineer approved building blueprint plan and construction stage estimate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────
          6. STREAMLINED NEXT STEP: DEDICATED ONLINE ENQUIRY PORTAL
          ──────────────────────────────────────────────────────────── */}
      <section className="py-12 sm:py-14 bg-gradient-to-r from-[#0c1e30] via-[#0f273d] to-[#14324f] text-white border-t border-white/10">
        <div className="w-[92%] sm:w-[88%] lg:w-[85%] max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-300 uppercase tracking-wider font-heading">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Looking to Apply Online?</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-heading text-white tracking-tight">
              Submit Your Complete Loan Application Dossier Online
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-sans max-w-2xl leading-relaxed">
              Use our dedicated Online Enquiry Portal to specify loan requirements, upload financial records, and get instant multi-bank evaluation from 40+ empanelled lenders.
            </p>
          </div>

          <div className="flex-shrink-0">
            <Link
              to="/enquire"
              className="hero-btn-primary py-3.5 px-7 text-xs sm:text-sm font-bold font-heading text-white flex items-center justify-center gap-2 text-center cursor-pointer tracking-wide whitespace-nowrap shadow-xl"
            >
              <span>Go to Online Loan Enquiry</span>
              <ArrowRight className="w-4 h-4 hero-btn-arrow" />
            </Link>
          </div>
        </div>
      </section>

      {/* Synchronized Headline & Button Visual Effects */}
      <style>{`
        .shimmer-headline-text {
          background: linear-gradient(
            90deg,
            #ffffff 0%,
            #ffffff 35%,
            #bae6fd 50%,
            #ffffff 65%,
            #ffffff 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer-text-flow 5s ease-in-out infinite;
          display: inline-block;
        }

        @keyframes shimmer-text-flow {
          0%, 15% { background-position: 200% center; }
          45%, 100% { background-position: -200% center; }
        }

        .hero-btn-primary {
          position: relative;
          overflow: hidden;
          border-radius: 9999px;
          background: linear-gradient(135deg, #187C78 0%, #126763 50%, #0e524f 100%);
          border: 1px solid rgba(255, 255, 255, 0.22);
          border-top-color: rgba(255, 255, 255, 0.55);
          box-shadow: 
            0 10px 25px -4px rgba(24, 124, 120, 0.55),
            0 4px 10px rgba(0, 0, 0, 0.35),
            inset 0 1.5px 0 rgba(255, 255, 255, 0.45);
          transition: transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.28s ease, background 0.28s ease, border-color 0.28s ease;
        }

        .hero-btn-primary:hover {
          transform: translateY(-2px) scale(1.02);
          background: linear-gradient(135deg, #1ea39e 0%, #187C78 50%, #126763 100%);
          box-shadow: 
            0 14px 28px -4px rgba(24, 124, 120, 0.65),
            0 6px 12px rgba(0, 0, 0, 0.4),
            inset 0 1.5px 0 rgba(255, 255, 255, 0.55);
        }

        .hero-btn-arrow {
          transition: transform 0.25s ease;
        }

        .hero-btn-primary:hover .hero-btn-arrow {
          transform: translateX(4px);
        }
      `}</style>
    </div>
  );
};
