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
  ExternalLink,
  Landmark,
  Scale,
  FileCheck,
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
  const disclaimerText = content?.disclaimerText || 'WealthAnchor is an independent property finance consultancy firm. We do not disburse funds or grant loan approvals ourselves. Loan sanctions and terms are subject to lender underwriting criteria.';
  const privacyPolicy = content?.privacyPolicy || 'We respect your confidentiality. Personal and financial details shared are solely used for eligibility assessment and arranging consultations.';
  const termsConditions = content?.termsConditions || 'Information provided on this website is for advisory and consultation scheduling purposes only and does not constitute a formal financial commitment or binding loan offer.';
  const copyrightText = content?.copyrightText || 'WealthAnchor. All rights reserved.';

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

  // Service links
  const serviceLinks = [
    { label: 'Home & Plot Loans', to: '/services/home-loans' },
    { label: 'Loan Against Property', to: '/services/loan-against-property' },
    { label: 'Commercial & LRD Desk', to: '/services/property-backed-funding' },
    { label: 'Loan Consultation', to: '/services/loan-consultation' },
  ];

  // Company links
  const companyLinks = [
    { label: 'About Our Practice', to: '/about' },
    { label: 'How It Works', to: '/how-it-works' },
    { label: 'EMI & FOIR Calculator', to: '/calculator' },
    { label: 'FAQs & Knowledge Base', to: '/faqs' },
    { label: 'Contact Us', to: '/contact' },
  ];

  return (
    <footer className="relative bg-[#0c1b29] text-white overflow-hidden">

      {/* ─── Decorative Geometric Accents ─── */}
      <div className="absolute top-0 right-0 w-[450px] h-[450px] border border-teal-500/[0.06] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-gradient-to-tr from-teal-600/[0.05] via-transparent to-transparent rounded-full translate-y-1/3 -translate-x-1/4 blur-xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/[0.02] rounded-full blur-3xl pointer-events-none" />

      {/* ═══════════════════════════════════════════════════════════════
          PRE-FOOTER: Consultation CTA Banner
          ═══════════════════════════════════════════════════════════════ */}
      <div className="relative border-b border-white/[0.06]">
        <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="py-10 sm:py-12 flex flex-col lg:flex-row items-center justify-between gap-8">

            <div className="flex items-center gap-5 max-w-2xl">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500/20 to-sky-500/15 border border-teal-400/25 flex items-center justify-center shrink-0 backdrop-blur-sm">
                <Send className="w-6 h-6 text-teal-400" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Ready to Begin Your Property Finance Journey?
                </h3>
                <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                  Speak with our senior advisory desk for a complimentary eligibility pre-assessment and institutional rate comparison.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <Link
                to="/enquire"
                className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-gradient-to-r from-brand-teal to-[#158a86] hover:from-[#158a86] hover:to-brand-teal text-white font-semibold text-sm shadow-lg shadow-teal-900/30 hover:shadow-teal-900/50 transition-all duration-300"
              >
                <span>Schedule Free Assessment</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <a
                href={`tel:${businessPhone.replace(/\s+/g, '')}`}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 hover:border-teal-400/30 text-white font-semibold text-sm transition-all duration-300 backdrop-blur-sm"
              >
                <Phone className="w-4 h-4 text-teal-400" />
                <span>Call {businessPhone}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          MAIN FOOTER GRID
          ═══════════════════════════════════════════════════════════════ */}
      <div className="relative z-10 max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-10 pt-14 sm:pt-16 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-white/[0.07]">

          {/* ── Column 1: Brand & Mission (wider) ── */}
          <div className="lg:col-span-4 space-y-5">
            <div className="flex items-center gap-3 group">
              <WealthAnchorLogo size={42} showWordmark={false} />
              <span className="font-extrabold text-xl tracking-tight text-white font-heading">
                WealthAnchor
              </span>
            </div>

            <p className="text-[13px] text-slate-400 leading-[1.7] max-w-sm">
              India's institutional-grade property finance advisory, bridging HNW property owners with 40+ premier regulated lending institutions through forensic due diligence, FOIR optimization, and direct senior credit desk syndication.
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.05] border border-white/[0.08] text-[10px] font-semibold text-slate-300 uppercase tracking-wider">
                <ShieldCheck className="w-3 h-3 text-teal-400" />
                <span>RBI Compliant</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.05] border border-white/[0.08] text-[10px] font-semibold text-slate-300 uppercase tracking-wider">
                <Scale className="w-3 h-3 text-teal-400" />
                <span>Zero Advance Fees</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.05] border border-white/[0.08] text-[10px] font-semibold text-slate-300 uppercase tracking-wider">
                <FileCheck className="w-3 h-3 text-teal-400" />
                <span>40+ Lenders</span>
              </div>
            </div>
          </div>

          {/* ── Column 2: Advisory Solutions ── */}
          <div className="lg:col-span-2">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.12em] text-teal-400 mb-5 flex items-center gap-2">
              <span className="w-5 h-px bg-teal-500/50" />
              Solutions
            </h4>
            <ul className="space-y-3">
              {serviceLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="group flex items-center gap-2 text-[13px] text-slate-400 hover:text-white transition-all duration-200"
                  >
                    <ChevronRight className="w-3 h-3 text-teal-500/50 group-hover:text-teal-400 transition-all duration-200 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0" />
                    <span className="group-hover:translate-x-1 transition-transform duration-200">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 3: Company Links ── */}
          <div className="lg:col-span-2">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.12em] text-teal-400 mb-5 flex items-center gap-2">
              <span className="w-5 h-px bg-teal-500/50" />
              Company
            </h4>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="group flex items-center gap-2 text-[13px] text-slate-400 hover:text-white transition-all duration-200"
                  >
                    <ChevronRight className="w-3 h-3 text-teal-500/50 group-hover:text-teal-400 transition-all duration-200 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0" />
                    <span className="group-hover:translate-x-1 transition-transform duration-200">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 4: Advisory Office Contact ── */}
          <div className="lg:col-span-4">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.12em] text-teal-400 mb-5 flex items-center gap-2">
              <span className="w-5 h-px bg-teal-500/50" />
              Advisory Office
            </h4>

            <div className="space-y-4">
              {/* Address Card */}
              <div className="group flex items-start gap-3.5 p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] hover:border-teal-400/20 transition-all duration-300 cursor-default">
                <div className="w-9 h-9 rounded-lg bg-teal-500/10 flex items-center justify-center shrink-0 group-hover:bg-teal-500/20 transition-colors duration-300">
                  <MapPin className="w-4 h-4 text-teal-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white/80 mb-0.5">Head Office</p>
                  <p className="text-[12px] text-slate-400 leading-relaxed">{officeAddress}</p>
                </div>
              </div>

              {/* Phone */}
              <a
                href={`tel:${businessPhone.replace(/\s+/g, '')}`}
                className="group flex items-center gap-3.5 p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] hover:border-teal-400/20 transition-all duration-300"
              >
                <div className="w-9 h-9 rounded-lg bg-teal-500/10 flex items-center justify-center shrink-0 group-hover:bg-teal-500/20 transition-colors duration-300">
                  <Phone className="w-4 h-4 text-teal-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white/80 mb-0.5">Advisory Helpline</p>
                  <p className="text-[12px] text-slate-400 group-hover:text-teal-300 transition-colors duration-200">{businessPhone}</p>
                </div>
              </a>

              {/* Email */}
              <a
                href={`mailto:${businessEmail}`}
                className="group flex items-center gap-3.5 p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] hover:border-teal-400/20 transition-all duration-300"
              >
                <div className="w-9 h-9 rounded-lg bg-teal-500/10 flex items-center justify-center shrink-0 group-hover:bg-teal-500/20 transition-colors duration-300">
                  <Mail className="w-4 h-4 text-teal-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white/80 mb-0.5">Email Advisory</p>
                  <p className="text-[12px] text-slate-400 group-hover:text-teal-300 transition-colors duration-200">{businessEmail}</p>
                </div>
              </a>

              {/* Hours */}
              <div className="flex items-center gap-3.5 px-3.5 py-2.5">
                <Clock className="w-4 h-4 text-teal-500/60 shrink-0" />
                <p className="text-[12px] text-slate-500">{businessHours}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            REGULATORY COMPLIANCE STRIP
            ═══════════════════════════════════════════════════════════════ */}
        <div className="py-6 border-b border-white/[0.06]">
          <div className="flex items-start gap-4 max-w-5xl">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
              <Landmark className="w-4 h-4 text-amber-400/80" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-amber-400/80 mb-1.5">
                Legal & Regulatory Disclosure
              </p>
              <p className="text-[11px] text-slate-500 leading-[1.7]">
                {disclaimerText}
              </p>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            BOTTOM BAR: Copyright, Legal Links, Admin, Back to Top
            ═══════════════════════════════════════════════════════════════ */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">

          {/* Left: Copyright */}
          <div className="text-[11px] text-slate-500 text-center sm:text-left">
            &copy; {currentYear} {copyrightText}
          </div>

          {/* Right: Links Row */}
          <div className="flex flex-wrap items-center justify-center gap-1">
            <button
              onClick={() => setModalType('privacy')}
              className="px-3 py-1.5 rounded-md text-[11px] text-slate-500 hover:text-white hover:bg-white/[0.05] transition-all duration-200"
            >
              Privacy Policy
            </button>
            <span className="text-slate-700 text-[10px]">•</span>
            <button
              onClick={() => setModalType('terms')}
              className="px-3 py-1.5 rounded-md text-[11px] text-slate-500 hover:text-white hover:bg-white/[0.05] transition-all duration-200"
            >
              Terms & Disclaimers
            </button>
            <span className="text-slate-700 text-[10px]">•</span>
            <a
              href="/admin/login"
              className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] text-slate-500 hover:text-white hover:bg-white/[0.05] transition-all duration-200"
              title="Admin Portal Sign In"
            >
              <Lock className="w-3 h-3 text-teal-500/60 group-hover:text-teal-400 transition-colors" />
              <span>Admin Portal</span>
            </a>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          FLOATING BACK-TO-TOP BUTTON
          ═══════════════════════════════════════════════════════════════ */}
      <button
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className={`fixed bottom-6 right-6 z-50 w-11 h-11 rounded-xl bg-brand-teal/90 hover:bg-brand-teal text-white shadow-lg shadow-teal-900/40 hover:shadow-teal-900/60 flex items-center justify-center backdrop-blur-md border border-teal-400/20 transition-all duration-300 cursor-pointer ${
          showScrollTop
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <ArrowUp className="w-5 h-5" />
      </button>

      {/* Modals for Privacy and Terms */}
      <PrivacyModal
        isOpen={modalType === 'privacy'}
        onClose={() => setModalType(null)}
        title="Privacy Notice & Data Handling"
        content={privacyPolicy}
        disclaimer={disclaimerText}
      />
      <PrivacyModal
        isOpen={modalType === 'terms'}
        onClose={() => setModalType(null)}
        title="Terms of Service & Advisory Scope"
        content={termsConditions}
        disclaimer={disclaimerText}
      />
    </footer>
  );
};
