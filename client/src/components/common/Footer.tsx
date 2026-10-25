import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Lock,
  ArrowUp,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Send,
  Building2,
  Scale,
  Landmark,
  FileCheck2,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Headphones,
} from 'lucide-react';
import { SiteContent } from '../../types';
import { PrivacyModal } from './PrivacyModal';
import { WealthAnchorLogo } from './WealthAnchorLogo';

interface FooterProps {
  content?: SiteContent | null;
}

export const Footer: React.FC<FooterProps> = ({ content }) => {
  const [modalType, setModalType] = useState<'privacy' | 'terms' | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const businessName = content?.businessName || 'WealthAnchor';
  const businessPhone = content?.businessPhone || '+91 98765 43210';
  const businessEmail = content?.businessEmail || 'contact@wealthanchor.in';
  const officeAddress = content?.officeAddress || 'Suite 402, Prestige Meridian, M.G. Road, Bengaluru, Karnataka 560001';
  const businessHours = content?.businessHours || 'Monday – Saturday: 9:30 AM – 6:30 PM (IST)';
  const disclaimerText = content?.disclaimerText || 'WealthAnchor is an independent commercial credit advisory firm and loan syndication facilitator. We are not a bank, non-banking financial company (NBFC), or direct financial institution, and do not directly disburse funds or issue loan sanctions. All credit facilities, interest rates, tenures, processing fees, and collateral appraisals are determined solely by partner RBI-regulated lending institutions. We adhere strictly to the Digital Lending Guidelines and fair practices code.';
  const privacyPolicy = content?.privacyPolicy || 'We respect your confidentiality. Personal and financial details shared are solely used for eligibility assessment and arranging consultations with partner lending institutions.';
  const termsConditions = content?.termsConditions || 'Information provided on this website is for advisory and consultation scheduling purposes only and does not constitute a formal financial commitment or binding loan offer.';
  const copyrightText = content?.copyrightText || 'WealthAnchor Advisory Services LLP. All rights reserved.';

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Empanelled Lending Institutions
  const partnerLenders = [
    'State Bank of India',
    'HDFC Bank',
    'ICICI Bank',
    'Axis Bank',
    'Kotak Mahindra Bank',
    'Bajaj Housing Finance',
    'Tata Capital',
    'PNB Housing',
    'Bank of Baroda',
    'Aditya Birla Finance',
    'Godrej Capital',
    'L&T Finance',
  ];

  // Financing Solutions
  const serviceLinks = [
    { label: 'Home & Plot Purchase Loans', to: '/services/home-loans' },
    { label: 'Loan Against Property (LAP)', to: '/services/loan-against-property' },
    { label: 'Commercial Real Estate & LRD', to: '/services/property-backed-funding' },
    { label: 'Balance Transfer & Top-Up Desk', to: '/services/loan-against-property' },
    { label: 'Senior Loan Consultation', to: '/services/loan-consultation' },
  ];

  // Client Advisory Resources
  const companyLinks = [
    { label: 'About Our Senior Practice', to: '/about' },
    { label: 'Advisory Process & Roadmap', to: '/how-it-works' },
    { label: 'EMI & FOIR Calculator Desk', to: '/calculator' },
    { label: 'FAQs & Due Diligence Guide', to: '/faqs' },
    { label: 'Contact Corporate Desk', to: '/contact' },
    { label: 'Schedule Free Assessment', to: '/enquire' },
  ];

  return (
    <footer className="relative bg-[#07131e] text-white overflow-hidden border-t border-slate-800/80">

      {/* Top 1px Elegant Accent Shimmer */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-teal-400/60 to-transparent z-20 pointer-events-none" />

      {/* Ambient Radial Background Lighting */}
      <div className="absolute -top-32 right-1/4 w-[600px] h-[300px] bg-teal-500/[0.04] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-32 w-[500px] h-[500px] bg-sky-600/[0.03] rounded-full blur-3xl pointer-events-none" />

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 1: STRATEGIC PRE-FOOTER ADVISORY GATEWAY
          ═══════════════════════════════════════════════════════════════ */}
      <div className="relative border-b border-white/[0.08] bg-gradient-to-b from-[#0a1827] to-[#07131e]">
        <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-12 py-12 lg:py-14">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-10">

            {/* Left Content */}
            <div className="max-w-3xl space-y-3.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-xs font-semibold text-teal-300 tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                <span>Institutional Property Finance Desk</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-white tracking-tight leading-tight font-heading">
                Need Guidance on High-Value Property Finance?
              </h2>
              <p className="text-sm sm:text-base text-slate-300/90 leading-relaxed font-normal">
                From ₹50 Lakhs to ₹100+ Crores — leverage senior credit committee relationships across 40+ premier institutional lenders with structured underwriting and zero advance consultancy fees.
              </p>

              {/* Performance Metrics Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3">
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm">
                  <div className="text-lg sm:text-xl font-extrabold text-teal-300 font-heading">₹500Cr+</div>
                  <div className="text-[11px] text-slate-400 font-medium mt-0.5">Disbursal Volume</div>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm">
                  <div className="text-lg sm:text-xl font-extrabold text-teal-300 font-heading">40+</div>
                  <div className="text-[11px] text-slate-400 font-medium mt-0.5">Empanelled Lenders</div>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm">
                  <div className="text-lg sm:text-xl font-extrabold text-teal-300 font-heading">0%</div>
                  <div className="text-[11px] text-slate-400 font-medium mt-0.5">Upfront Fee Guarantee</div>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm">
                  <div className="text-lg sm:text-xl font-extrabold text-teal-300 font-heading">24–48h</div>
                  <div className="text-[11px] text-slate-400 font-medium mt-0.5">Sanction Fast-Track</div>
                </div>
              </div>
            </div>

            {/* Right CTAs */}
            <div className="flex flex-col sm:flex-row xl:flex-col gap-3.5 shrink-0 sm:items-center xl:items-stretch">
              <Link
                to="/enquire"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-teal-500 to-[#0e6f6b] hover:from-teal-400 hover:to-teal-600 text-white font-bold text-sm shadow-xl shadow-teal-950/50 hover:shadow-teal-900/70 transition-all duration-300 border border-teal-400/30"
              >
                <span>Schedule Confidential Assessment</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <a
                href={`tel:${businessPhone.replace(/\s+/g, '')}`}
                className="group inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] border border-white/10 hover:border-teal-400/40 text-white font-semibold text-sm transition-all duration-300 backdrop-blur-sm"
              >
                <div className="relative">
                  <Phone className="w-4 h-4 text-teal-400" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="text-left">
                  <span className="text-[10px] block text-slate-400 font-normal uppercase tracking-wider">Advisory Helpline (Direct)</span>
                  <span className="text-sm font-bold text-slate-100 group-hover:text-teal-300 transition-colors">{businessPhone}</span>
                </div>
              </a>
            </div>

          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 2: EMPANELLED LENDING INSTITUTIONS STRIP
          ═══════════════════════════════════════════════════════════════ */}
      <div className="relative border-b border-white/[0.06] bg-[#050e17]/80 py-6">
        <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center mb-4">
            <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              <Building2 className="w-3.5 h-3.5 text-teal-400/70" />
              Financing & Syndication Across India's Premier Lending Institutions
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
            {partnerLenders.map((bank) => (
              <div
                key={bank}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-teal-500/30 text-xs font-medium text-slate-300 hover:text-white transition-all duration-200 cursor-default"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400/60" />
                <span>{bank}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 3: INSTITUTIONAL MEGA-FOOTER GRID
          ═══════════════════════════════════════════════════════════════ */}
      <div className="relative z-10 max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-12 pt-14 sm:pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14 border-b border-white/[0.08]">

          {/* ── Column 1: Firm Overview & Governance (5 cols) ── */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-3">
              <WealthAnchorLogo size={44} showWordmark={true} variant="light" />
            </div>

            <p className="text-[13px] text-slate-300/80 leading-[1.75] max-w-md font-normal">
              Specialized private property finance advisory representing high-net-worth borrowers, business promoters, and property developers. We bridge capital requirements with 40+ leading institutional lenders through forensic debt structuring, FOIR optimization, and direct credit committee syndication.
            </p>

            {/* Institutional Trust Badges (2x2 Grid) */}
            <div className="grid grid-cols-2 gap-2.5 max-w-md pt-1">
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
                <span className="text-[11px] font-semibold text-slate-200">RBI Guidelines Adherent</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                <Scale className="w-4 h-4 text-teal-400 shrink-0" />
                <span className="text-[11px] font-semibold text-slate-200">Zero Advance Fees</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                <FileCheck2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span className="text-[11px] font-semibold text-slate-200">Strict Client NDA Protocol</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                <Landmark className="w-4 h-4 text-teal-400 shrink-0" />
                <span className="text-[11px] font-semibold text-slate-200">40+ Institutional Desks</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 flex items-center gap-2 pt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span>Pan-India Advisory Coverage: Bengaluru (HQ) &bull; Mumbai &bull; Hyderabad &bull; Delhi NCR &bull; Chennai</span>
            </div>
          </div>

          {/* ── Column 2: Financing Desks (2 cols) ── */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-teal-400 mb-6 flex items-center gap-2">
              <span className="w-4 h-0.5 bg-teal-400" />
              Financing Desks
            </h3>
            <ul className="space-y-3.5">
              {serviceLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="group flex items-center gap-2 text-[13px] text-slate-300 hover:text-white transition-all duration-200"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-teal-400/40 group-hover:text-teal-400 transition-all duration-200 group-hover:translate-x-0.5" />
                    <span className="group-hover:translate-x-0.5 transition-transform duration-200">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 3: Client Resources (2 cols) ── */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-teal-400 mb-6 flex items-center gap-2">
              <span className="w-4 h-0.5 bg-teal-400" />
              Client Resources
            </h3>
            <ul className="space-y-3.5">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="group flex items-center gap-2 text-[13px] text-slate-300 hover:text-white transition-all duration-200"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-teal-400/40 group-hover:text-teal-400 transition-all duration-200 group-hover:translate-x-0.5" />
                    <span className="group-hover:translate-x-0.5 transition-transform duration-200">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 4: Advisory Headquarters (3 cols) ── */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-teal-400 mb-6 flex items-center gap-2">
              <span className="w-4 h-0.5 bg-teal-400" />
              Advisory Headquarters
            </h3>

            <div className="space-y-3">
              {/* Address Card */}
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-teal-500/25 transition-all duration-200">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-teal-400" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white/90">Registered Corporate Office</div>
                    <div className="text-[12px] text-slate-300/80 leading-relaxed mt-0.5">{officeAddress}</div>
                  </div>
                </div>
              </div>

              {/* Phone Card */}
              <a
                href={`tel:${businessPhone.replace(/\s+/g, '')}`}
                className="group block p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-teal-500/30 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center shrink-0 group-hover:bg-teal-500/20 transition-colors">
                    <Phone className="w-4 h-4 text-teal-400" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white/90 group-hover:text-teal-300 transition-colors">Senior Advisory Helpline</div>
                    <div className="text-[12px] text-slate-300/80 font-medium mt-0.5">{businessPhone}</div>
                  </div>
                </div>
              </a>

              {/* Email Card */}
              <a
                href={`mailto:${businessEmail}`}
                className="group block p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-teal-500/30 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center shrink-0 group-hover:bg-teal-500/20 transition-colors">
                    <Mail className="w-4 h-4 text-teal-400" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white/90 group-hover:text-teal-300 transition-colors">Direct Desk Email</div>
                    <div className="text-[12px] text-slate-300/80 font-medium mt-0.5">{businessEmail}</div>
                  </div>
                </div>
              </a>

              {/* Hours */}
              <div className="flex items-center gap-2.5 px-3 pt-1 text-slate-400 text-xs">
                <Clock className="w-3.5 h-3.5 text-teal-400/70 shrink-0" />
                <span className="text-[11px] leading-tight">{businessHours}</span>
              </div>
            </div>
          </div>

        </div>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 4: STATUTORY & REGULATORY COMPLIANCE DISCLOSURE
            ═══════════════════════════════════════════════════════════════ */}
        <div className="pt-8 pb-4">
          <div className="p-4 sm:p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex flex-col sm:flex-row items-start gap-4">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
              <Landmark className="w-4.5 h-4.5 text-amber-400" />
            </div>
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-amber-300/90 flex items-center gap-2">
                <span>Statutory Compliance & Regulatory Notice</span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400/60" />
                <span className="text-[10px] text-slate-400 font-normal lowercase tracking-normal">non-lending advisory intermediary</span>
              </div>
              <p className="text-[11px] sm:text-[12px] text-slate-400 leading-[1.75]">
                {disclaimerText}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 5: THE EXECUTIVE FOOTER BAR (PROFESSIONAL INSTITUTIONAL TIER)
          ═══════════════════════════════════════════════════════════════ */}
      <div className="relative z-10 border-t border-white/[0.08] bg-[#040c14] pt-6 pb-20 sm:py-7">
        <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-12">
          {/* Main Bar Flex - designed with padding clear of floating WhatsApp widget */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-5 sm:gap-6 sm:pr-48">

            {/* Left: Entity & Copyright */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start lg:items-center gap-2 sm:gap-4 text-center sm:text-left">
              <div className="text-xs font-semibold text-slate-200">
                &copy; {currentYear} {businessName}.
              </div>
              <div className="hidden sm:inline-block text-slate-700">&bull;</div>
              <div className="text-[11px] text-slate-400">
                Institutional Property Finance Advisory &bull; Pan-India Syndication
              </div>
            </div>

            {/* Center: Security Credential */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] text-[11px] text-slate-400">
              <Lock className="w-3 h-3 text-teal-400" />
              <span>256-Bit SSL Encrypted Desk &bull; Digital Lending Guidelines Compliant</span>
            </div>

            {/* Right: Interactive Actions (Privacy, Terms, Admin, Back to Top) */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              <button
                onClick={() => setModalType('privacy')}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.06] transition-all duration-200 cursor-pointer"
              >
                Privacy Notice
              </button>
              <span className="text-slate-700 text-xs">&bull;</span>
              <button
                onClick={() => setModalType('terms')}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.06] transition-all duration-200 cursor-pointer"
              >
                Terms of Advisory
              </button>
              <span className="text-slate-700 text-xs">&bull;</span>
              <a
                href="/admin/login"
                className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
                title="Institutional Admin Portal"
              >
                <Lock className="w-3 h-3 text-teal-400/80 group-hover:text-teal-400 transition-colors" />
                <span>Admin Portal</span>
              </a>
              <span className="text-slate-700 text-xs hidden sm:inline-block">&bull;</span>
              <button
                onClick={scrollToTop}
                className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/20 text-xs font-semibold text-teal-300 hover:text-teal-200 transition-all duration-200 cursor-pointer"
                title="Scroll back to top"
              >
                <span>Back to Top</span>
                <ArrowUp className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-y-0.5" />
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          FLOATING BACK-TO-TOP BUTTON (POSITIONED CLEANLY ABOVE WHATSAPP)
          WhatsApp widget is at bottom-6 right-6.
          This button is positioned at bottom-24 right-6 so they NEVER overlap!
          ═══════════════════════════════════════════════════════════════ */}
      <button
        onClick={scrollToTop}
        aria-label="Scroll to top"
        title="Scroll to top"
        className={`fixed bottom-24 right-6 z-40 w-10 h-10 rounded-full bg-[#0a202d]/90 hover:bg-teal-600 text-teal-300 hover:text-white shadow-xl shadow-black/50 flex items-center justify-center backdrop-blur-md border border-teal-500/30 hover:border-teal-400 transition-all duration-300 cursor-pointer ${
          showScrollTop
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 translate-y-3 scale-90 pointer-events-none'
        }`}
      >
        <ArrowUp className="w-4 h-4" />
      </button>

      {/* Modals for Privacy and Terms */}
      <PrivacyModal
        isOpen={modalType === 'privacy'}
        onClose={() => setModalType(null)}
        title="Privacy Notice & Data Governance"
        content={privacyPolicy}
        disclaimer={disclaimerText}
      />
      <PrivacyModal
        isOpen={modalType === 'terms'}
        onClose={() => setModalType(null)}
        title="Terms of Advisory Engagement & Disclaimer"
        content={termsConditions}
        disclaimer={disclaimerText}
      />
    </footer>
  );
};
