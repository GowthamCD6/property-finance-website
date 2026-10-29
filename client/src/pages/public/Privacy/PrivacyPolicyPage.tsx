import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  FileText,
  Building2,
  CheckCircle2,
  Scale,
  Clock,
  PhoneCall,
  Mail,
  Printer,
  ChevronRight,
  AlertTriangle,
  ArrowRight,
  Database,
  EyeOff,
  UserCheck,
  Share2,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { SiteContent } from '../../../types';
import privacyHeroImage from '../../../assets/images/privacy-hero-security.jpg';

export const PrivacyPolicyPage: React.FC = () => {
  const context = useOutletContext<{ content?: SiteContent | null }>();
  const content = context?.content || null;
  const businessName = content?.businessName || 'Prime Associates — Loans & Constructions';
  const businessPhone = content?.businessPhone || '+91 96555 66613, +91 95144 66600';
  const businessEmail = content?.businessEmail || 'primeassociates2008@gmail.com';
  const officeAddress =
    content?.officeAddress ||
    'No. 48, 49, P.R. Complex, Binny Compound Main Street, Kumaran Road, Tirupur - 641601';

  const [activeSection, setActiveSection] = useState<string>('governance');
  const [copiedLink, setCopiedLink] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const timer = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(timer);
  }, []);

  // 3D Mouse Parallax Tilt for Hero
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 6;
      const y = -(e.clientY / innerHeight - 0.5) * 6;
      setTilt({ x: y, y: x });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Scrollspy to auto-detect active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(sections[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const sections = [
    { id: 'governance', title: '1. Governance & DPDP Act Alignment' },
    { id: 'categories', title: '2. Information We Collect' },
    { id: 'processing', title: '3. Purpose & FOIR Algorithmic Modeling' },
    { id: 'bureau', title: '4. CIBIL & Zero Multi-Pinging Guarantee' },
    { id: 'lender-sharing', title: '5. Regulated Lender Disclosures' },
    { id: 'document-vaulting', title: '6. 30-Year Deed Custody & Vaulting' },
    { id: 'client-rights', title: '7. Sovereign Client Rights (Access & Erasure)' },
    { id: 'cookies', title: '8. Cookies & Digital Telemetry' },
    { id: 'dpo', title: '9. Data Protection Officer (DPO) Contact' },
  ];

  return (
    <div className="bg-[#f8f8f4] min-h-screen text-brand-navy font-sans antialiased selection:bg-brand-teal selection:text-white">
      {/* ────────────────────────────────────────────────────────────
          1. HERO SECTION — PRIVACY & SOVEREIGN DATA SECURITY VAULT
          ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-slate-950 text-white pt-10 sm:pt-14 lg:pt-16 pb-12 sm:pb-16 lg:pb-20 border-b border-white/10">
        {/* Background Image + Clean Lightweight Overlay Stack with Subtle Zoom Animation */}
        <div className="absolute inset-0 z-0">
          <img
            src={privacyHeroImage}
            alt="Institutional Privacy & Data Security Vault"
            className={`w-full h-full object-cover object-center brightness-[0.88] transition-transform duration-1000 ease-out ${
              mounted ? 'scale-100' : 'scale-105'
            }`}
            loading="eager"
          />
          {/* Clean overlays matching Home page pattern */}
          <div className="absolute inset-0 bg-black/28" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/75 via-slate-950/35 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/75" />

          {/* Ambient atmospheric pulse glows */}
          <div
            className="absolute -top-24 -left-20 w-80 sm:w-96 h-80 sm:h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none animate-pulse"
            style={{ animationDuration: '6s' }}
          />
          <div className="absolute top-1/3 -right-20 w-80 sm:w-96 h-80 sm:h-96 bg-sky-500/12 rounded-full blur-3xl pointer-events-none" />
        </div>

        <div className="w-[92%] sm:w-[88%] lg:w-[85%] max-w-7xl mx-auto relative z-10">
          <div
            style={{
              transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              transition: 'transform 0.25s cubic-bezier(0.25, 1, 0.5, 1)',
              transformStyle: 'preserve-3d',
            }}
            className="max-w-3xl space-y-6 will-change-transform"
          >
            {/* Breadcrumb & Institutional Tag */}
            <div
              className="flex flex-wrap items-center gap-3"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1) 0.15s, transform 0.75s cubic-bezier(0.16, 1, 0.3, 1) 0.15s',
              }}
            >
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-950/70 border border-white/20 text-slate-100 text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md shadow-sm font-heading">
                <span className="w-2 h-2 rounded-full bg-[#20B2AA] animate-pulse"></span>
                <span>DPDP Act 2023 &amp; RBI IT Framework Aligned</span>
              </div>
              <div className="hidden sm:inline-flex items-center gap-1.5 text-xs text-gray-300 font-medium bg-slate-950/50 px-3 py-1 rounded-full border border-white/15 backdrop-blur-md font-heading">
                <Lock className="w-3.5 h-3.5 text-teal-400" />
                <span>256-Bit Bank-Grade Vaulting</span>
              </div>
            </div>

            {/* Headline */}
            <div
              className="space-y-3"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(24px)',
                transition: 'opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1) 0.28s, transform 0.75s cubic-bezier(0.16, 1, 0.3, 1) 0.28s',
              }}
            >
              <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-[50px] font-extrabold text-white tracking-tight leading-[1.18] sm:leading-[1.14] font-heading">
                Sovereign Privacy,{' '}
                <span className="shimmer-headline-text text-[#38bdf8]">Bureau Integrity</span>{' '}
                &amp; Data Governance.
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-gray-300 font-normal leading-relaxed max-w-2xl pt-1">
                How <strong className="text-white font-bold">{businessName}</strong> protects,
                evaluates, and vaults your confidential property titles, IT filings, and banking
                statements. We adhere to a strict zero multi-bureau broadcast mandate to safeguard
                your credit score.
              </p>
            </div>

            {/* Action Bar: Print, Share, Timestamp */}
            <div
              className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-slate-300"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(24px)',
                transition: 'opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1) 0.42s, transform 0.75s cubic-bezier(0.16, 1, 0.3, 1) 0.42s',
              }}
            >
              <span className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/15 backdrop-blur-sm">
                <Clock className="w-3.5 h-3.5 text-teal-300" />
                <span>Effective Date: October 2026</span>
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/15 backdrop-blur-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Audit Version: v3.4 Institutional</span>
              </span>
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg border border-white/15 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Policy</span>
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg border border-white/15 transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedLink ? 'Link Copied!' : 'Share Document'}</span>
              </button>
            </div>

            {/* 4 Trust Metrics */}
            <div
              className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5 pt-3"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(24px)',
                transition: 'opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1) 0.56s, transform 0.75s cubic-bezier(0.16, 1, 0.3, 1) 0.56s',
              }}
            >
              {[
                { label: 'CIBIL Pings', val: '0', sub: 'Zero Blast Inquiries' },
                { label: 'Encryption', val: '256-Bit', sub: 'AES Bank Standard' },
                { label: 'Custody Return', val: '100%', sub: 'Original Deed Safety' },
                { label: 'Third-Party Sales', val: '0%', sub: 'Strict Non-Commercial' },
              ].map((m, idx) => (
                <div
                  key={idx}
                  className="p-3 sm:p-4 rounded-2xl bg-white/[0.07] backdrop-blur-md border border-white/15 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-white/30 hover:bg-white/[0.12]"
                >
                  <div className="text-xl sm:text-2xl font-extrabold text-white font-mono">
                    {m.val}
                  </div>
                  <div className="text-xs font-bold text-slate-200 mt-0.5">{m.label}</div>
                  <div className="text-[10px] text-slate-400">{m.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────
          2. CORE CONTENT — INTERACTIVE SIDEBAR & DOCUMENT ARTICLES
          ──────────────────────────────────────────────────────────── */}
      <section className="py-12 sm:py-16 bg-[#f8f8f4]">
        <div className="w-[92%] sm:w-[88%] lg:w-[85%] max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start relative">
            
            {/* ── LEFT SIDEBAR: Table of Contents & Quick Contact (Sticky in position while right slides) ── */}
            <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto pr-1">
              {/* Table of Contents Card */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-brand-border/80 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-brand-border/60">
                  <FileText className="w-4 h-4 text-brand-teal" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-brand-navy font-heading">
                    Document Navigation
                  </h3>
                </div>

                <nav className="space-y-1">
                  {sections.map((sec) => (
                    <a
                      key={sec.id}
                      href={`#${sec.id}`}
                      onClick={(e) => scrollToSection(e, sec.id)}
                      className={`block px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200 cursor-pointer ${
                        activeSection === sec.id
                          ? 'bg-brand-teal text-white font-bold shadow-xs translate-x-1'
                          : 'text-brand-slate hover:bg-slate-100 hover:text-brand-navy hover:translate-x-0.5'
                      }`}
                    >
                      {sec.title}
                    </a>
                  ))}
                </nav>
              </div>

              {/* Data Protection Officer Quick Card */}
              <div className="bg-gradient-to-br from-[#12263a] to-[#183247] text-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/10 shadow-card space-y-4">
                <div className="flex items-center gap-2 text-teal-300">
                  <ShieldCheck className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Grievance &amp; DPO Desk
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  For statutory requests under India's Digital Personal Data Protection Act 2023, data
                  portability, or immediate record revocation:
                </p>
                <div className="space-y-2 text-xs pt-1">
                  <a
                    href={`mailto:${businessEmail}`}
                    className="flex items-center gap-2 text-slate-200 hover:text-teal-300 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    <span className="truncate">{businessEmail}</span>
                  </a>
                  <a
                    href={`tel:${businessPhone.split(',')[0].replace(/\s+/g, '')}`}
                    className="flex items-center gap-2 text-slate-200 hover:text-teal-300 transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    <span>{businessPhone.split(',')[0]}</span>
                  </a>
                </div>
                <div className="pt-2 border-t border-white/10 text-[11px] text-slate-400">
                  Response SLA: <strong>Within 48 Business Hours</strong>
                </div>
              </div>
            </aside>

            {/* ── RIGHT MAIN CONTENT: In-Depth Policy Articles ── */}
            <main className="lg:col-span-8 space-y-8">
              
              {/* Executive Notice Banner */}
              <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-teal-50/80 border border-teal-200 text-teal-950 space-y-2">
                <div className="flex items-center gap-2 text-teal-800 font-bold text-sm font-heading">
                  <Sparkles className="w-4 h-4 text-brand-teal" />
                  <span>The Prime Associates Fiduciary Privacy Guarantee</span>
                </div>
                <p className="text-xs text-teal-900/90 leading-relaxed">
                  Unlike digital lead generators and loan comparison portals that broadcast your
                  phone number and PAN to dozens of unregulated telemarketers,{' '}
                  <strong>{businessName}</strong> operates strictly as an independent high-touch
                  advisory desk. We execute zero blast inquiries and route documents exclusively to
                  designated senior zonal credit heads upon formal, signed written mandate.
                </p>
              </div>

              {/* ARTICLE 1: Governance & Statutory Framework */}
              <article
                id="governance"
                className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-brand-border/80 shadow-2xs space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-brand-border/60">
                  <div className="flex items-center gap-2">
                    <Scale className="w-5 h-5 text-brand-teal" />
                    <h2 className="text-lg sm:text-xl font-bold text-brand-navy font-heading">
                      1. Governance &amp; DPDP Act 2023 Alignment
                    </h2>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-brand-slate px-2.5 py-1 rounded">
                    Statutory Compliance
                  </span>
                </div>

                <div className="text-xs sm:text-sm text-brand-slate leading-relaxed space-y-3">
                  <p>
                    This Privacy Notice articulates the data collection, safeguarding, and
                    transmission protocols of <strong>{businessName}</strong> ("we", "our", or
                    "the Firm"), having its principal practice office at {officeAddress}.
                  </p>
                  <p>
                    We process, hold, and archive personal and financial information in strict
                    conformity with:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs text-brand-slate">
                    <li>
                      <strong>The Digital Personal Data Protection Act, 2023 (DPDP Act)</strong> and
                      its accompanying implementation rules.
                    </li>
                    <li>
                      <strong>Reserve Bank of India (RBI)</strong> IT and Cybersecurity Directions for
                      Authorized Banking Correspondents, Direct Sourcing Partners, and Financial
                      Intermediaries.
                    </li>
                    <li>
                      <strong>Information Technology Act, 2000</strong> (as amended) and the
                      Reasonable Security Practices and Procedures and Sensitive Personal Data or
                      Information Rules, 2011.
                    </li>
                  </ul>
                  <p>
                    By engaging our loan syndication, title scrutiny, or FOIR modeling advisory, you
                    expressly acknowledge and authorize the lawful, specified data processing
                    activities set forth herein.
                  </p>
                </div>
              </article>

              {/* ARTICLE 2: Categories of Information Collected */}
              <article
                id="categories"
                className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-brand-border/80 shadow-2xs space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-brand-border/60">
                  <div className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-brand-teal" />
                    <h2 className="text-lg sm:text-xl font-bold text-brand-navy font-heading">
                      2. Categories of Information We Collect
                    </h2>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-brand-slate px-2.5 py-1 rounded">
                    Data Scope
                  </span>
                </div>

                <div className="text-xs sm:text-sm text-brand-slate leading-relaxed space-y-3">
                  <p>
                    To structure fiduciary-grade borrowing dossiers for Tier-1 public sector and
                    private commercial banks, we collect the following specified categories:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-brand-border/60 space-y-1">
                      <div className="font-bold text-xs text-brand-navy">
                        A. Identity &amp; Statutory KYC
                      </div>
                      <p className="text-[11px] text-brand-slate">
                        Aadhaar card numbers (masked), PAN card copies, passport records, voter ID,
                        and permanent residential verification.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-brand-border/60 space-y-1">
                      <div className="font-bold text-xs text-brand-navy">
                        B. Financial Statement Normalization
                      </div>
                      <p className="text-[11px] text-brand-slate">
                        Last 3 years Income Tax Returns (ITR-V, computation &amp; audit reports),
                        GST returns (GSTR-3B &amp; 1), 12-month current/savings bank statements, and
                        Form 16/salary slips.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-brand-border/60 space-y-1">
                      <div className="font-bold text-xs text-brand-navy">
                        C. Collateral &amp; Title Deeds
                      </div>
                      <p className="text-[11px] text-brand-slate">
                        30-year mother deed continuity documents, Sub-Registrar Encumbrance
                        Certificates (Form 15 &amp; 16), Patta/Khata mutation extracts, DTCP/CMDA/RERA
                        layout sanctions, and property tax receipts.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-brand-border/60 space-y-1">
                      <div className="font-bold text-xs text-brand-navy">
                        D. Existing Obligation Schedules
                      </div>
                      <p className="text-[11px] text-brand-slate">
                        Sanction letters and amortization repayment tracks of ongoing loans (for
                        balance transfer, takeover, and composite top-up debt syndications).
                      </p>
                    </div>
                  </div>
                </div>
              </article>

              {/* ARTICLE 3: Purpose of Processing */}
              <article
                id="processing"
                className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-brand-border/80 shadow-2xs space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-brand-border/60">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-brand-teal" />
                    <h2 className="text-lg sm:text-xl font-bold text-brand-navy font-heading">
                      3. Purpose &amp; Algorithmic FOIR Modeling
                    </h2>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-brand-slate px-2.5 py-1 rounded">
                    Advisory Scope
                  </span>
                </div>

                <div className="text-xs sm:text-sm text-brand-slate leading-relaxed space-y-3">
                  <p>
                    We collect your records exclusively for explicit, pre-defined institutional loan
                    underwriting purposes:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs text-brand-slate">
                    <li>
                      <strong>Algorithmic FOIR / Fixed Obligation to Income Ratio Computation:</strong>{' '}
                      Stress-testing your maximum borrowing eligibility against RBI policy benchmarks
                      before lender introduction.
                    </li>
                    <li>
                      <strong>Forensic Title Pre-Audits:</strong> Pre-clearing legal chain defects
                      through independent legal counsel to avoid delayed bank rejections.
                    </li>
                    <li>
                      <strong>Lender Matching:</strong> Comparing product benchmarks across 40+ PSU
                      and private banking desks to determine the single most advantageous interest
                      spread.
                    </li>
                    <li>
                      <strong>Zonal Committee Preparation:</strong> Compiling executive credit
                      appraisal dossiers for expedited senior underwriting approval.
                    </li>
                  </ul>
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-900 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Absolute Prohibition on Data Monetization:</strong> We will never sell,
                      rent, license, or monetize your contact information or financial statements to
                      telemarketing aggregators, credit card brokers, or insurance sales networks.
                    </span>
                  </div>
                </div>
              </article>

              {/* ARTICLE 4: CIBIL Multi-Ping Prevention */}
              <article
                id="bureau"
                className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-brand-border/80 shadow-2xs space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-brand-border/60">
                  <div className="flex items-center gap-2">
                    <EyeOff className="w-5 h-5 text-brand-teal" />
                    <h2 className="text-lg sm:text-xl font-bold text-brand-navy font-heading">
                      4. CIBIL &amp; Zero Multi-Pinging Guarantee
                    </h2>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded font-mono">
                    Score Shield
                  </span>
                </div>

                <div className="text-xs sm:text-sm text-brand-slate leading-relaxed space-y-3">
                  <p>
                    A critical flaw in the unorganized loan brokerage market is "multi-bureau
                    blasting"—where brokers simultaneously broadcast applicant files to 8–15 banks,
                    triggering multiple hard inquiries that drop your CIBIL score by 25 to 60 points
                    within days.
                  </p>
                  <p>
                    <strong>The Prime Associates Shield Protocol:</strong>
                  </p>
                  <div className="p-4 rounded-xl bg-slate-50 border border-brand-border/80 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-brand-navy">
                      <CheckCircle2 className="w-4 h-4 text-brand-teal" />
                      <span>Single-Dossier Channel Routing</span>
                    </div>
                    <p className="text-xs text-brand-slate leading-relaxed">
                      We pre-vet eligibility using off-bureau institutional matrices. Formal bank
                      submission and hard credit inquiries occur only with the single pre-selected
                      lender approved by you in writing, guaranteeing zero unsolicited multi-bureau
                      degradation.
                    </p>
                  </div>
                </div>
              </article>

              {/* ARTICLE 5: Controlled Disclosures to Regulated Lenders */}
              <article
                id="lender-sharing"
                className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-brand-border/80 shadow-2xs space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-brand-border/60">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-brand-teal" />
                    <h2 className="text-lg sm:text-xl font-bold text-brand-navy font-heading">
                      5. Regulated Lender Disclosures
                    </h2>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-brand-slate px-2.5 py-1 rounded">
                    Authorized Desks
                  </span>
                </div>

                <div className="text-xs sm:text-sm text-brand-slate leading-relaxed space-y-3">
                  <p>
                    We disclose your loan dossier exclusively to RBI-regulated banking partners
                    authorized under our institutional syndication network, including:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-xs text-brand-slate">
                    <li>
                      <strong>Public Sector Banks:</strong> State Bank of India (SBI), Bank of Baroda
                      (BOB), Canara Bank, Union Bank of India.
                    </li>
                    <li>
                      <strong>Private Scheduled Commercial Banks:</strong> HDFC Bank, ICICI Bank, Axis
                      Bank, Kotak Mahindra Bank, IndusInd Bank.
                    </li>
                    <li>
                      <strong>Premier Housing Finance Companies:</strong> LIC Housing Finance Limited,
                      Tata Capital Housing Finance, Bajaj Housing Finance, PNB Housing Finance.
                    </li>
                  </ul>
                  <p className="text-xs text-brand-slate">
                    All partner institutions are bound by statutory Non-Disclosure Agreements (NDAs)
                    and the RBI Fair Practice Code governing applicant confidentiality.
                  </p>
                </div>
              </article>

              {/* ARTICLE 6: 30-Year Deed Custody & Vaulting */}
              <article
                id="document-vaulting"
                className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-brand-border/80 shadow-2xs space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-brand-border/60">
                  <div className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-brand-teal" />
                    <h2 className="text-lg sm:text-xl font-bold text-brand-navy font-heading">
                      6. 30-Year Deed Custody &amp; Document Vaulting
                    </h2>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-brand-slate px-2.5 py-1 rounded font-mono">
                    256-Bit Vault
                  </span>
                </div>

                <div className="text-xs sm:text-sm text-brand-slate leading-relaxed space-y-3">
                  <p>
                    Property title documents are irreplaceable sovereign assets. Our firm maintains
                    two rigorous safeguarding layers:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-brand-border/60 space-y-1.5">
                      <div className="font-bold text-xs text-brand-navy">
                        Physical Custody Standard
                      </div>
                      <p className="text-[11px] text-brand-slate leading-relaxed">
                        Original property documents received for legal inspection are secured in
                        dual-key fire-rated safes. Written formal intake receipts are issued with
                        mandatory physical return protocol within 2 business days of audit completion.
                      </p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-brand-border/60 space-y-1.5">
                      <div className="font-bold text-xs text-brand-navy">
                        Digital Vault Security
                      </div>
                      <p className="text-[11px] text-brand-slate leading-relaxed">
                        Scanned dossiers are encrypted at rest with AES-256 and transmitted exclusively
                        via TLS 1.3 encrypted pipelines. Digital copies are purged within 90 days of
                        final bank disbursement upon client written request.
                      </p>
                    </div>
                  </div>
                </div>
              </article>

              {/* ARTICLE 7: Sovereign Client Rights */}
              <article
                id="client-rights"
                className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-brand-border/80 shadow-2xs space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-brand-border/60">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-brand-teal" />
                    <h2 className="text-lg sm:text-xl font-bold text-brand-navy font-heading">
                      7. Sovereign Client Rights (Access &amp; Erasure)
                    </h2>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-brand-slate px-2.5 py-1 rounded">
                    DPDP Act Rights
                  </span>
                </div>

                <div className="text-xs sm:text-sm text-brand-slate leading-relaxed space-y-3">
                  <p>
                    Under Section 11 of the Digital Personal Data Protection Act 2023, you possess the
                    following sovereign, enforceable rights:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div className="p-3 rounded-xl bg-slate-50 border border-brand-border/60 text-center space-y-1">
                      <div className="text-xs font-bold text-brand-navy">Right to Summary</div>
                      <p className="text-[10.5px] text-brand-slate">
                        Request a full itemized ledger of personal data processed.
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-brand-border/60 text-center space-y-1">
                      <div className="text-xs font-bold text-brand-navy">Right to Correction</div>
                      <p className="text-[10.5px] text-brand-slate">
                        Update or rectify obsolete income or title information.
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-brand-border/60 text-center space-y-1">
                      <div className="text-xs font-bold text-brand-navy">Right to Erasure</div>
                      <p className="text-[10.5px] text-brand-slate">
                        Require complete digital file shredding once loan is completed.
                      </p>
                    </div>
                  </div>
                </div>
              </article>

              {/* ARTICLE 8: Cookies & Digital Telemetry */}
              <article
                id="cookies"
                className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-brand-border/80 shadow-2xs space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-brand-border/60">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-brand-teal" />
                    <h2 className="text-lg sm:text-xl font-bold text-brand-navy font-heading">
                      8. Cookies &amp; Digital Telemetry
                    </h2>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-brand-slate px-2.5 py-1 rounded">
                    Technical Scope
                  </span>
                </div>

                <div className="text-xs sm:text-sm text-brand-slate leading-relaxed space-y-3">
                  <p>
                    Our web portal utilizes strictly technical and analytical cookies to ensure
                    calculator session integrity, interactive EMI amortization persistence, and
                    secure form dispatch. We do not deploy third-party advertising retargeting
                    trackers (e.g. Meta Pixel or Google Ads tracking cookies) on confidential loan
                    consultation pages.
                  </p>
                </div>
              </article>

              {/* ARTICLE 9: Data Protection Officer Contact */}
              <article
                id="dpo"
                className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-brand-border/80 shadow-2xs space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-brand-border/60">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-brand-teal" />
                    <h2 className="text-lg sm:text-xl font-bold text-brand-navy font-heading">
                      9. Data Protection Officer (DPO) &amp; Grievance Redressal
                    </h2>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-50 text-brand-teal border border-teal-200 px-2.5 py-1 rounded font-mono">
                    Statutory Desk
                  </span>
                </div>

                <div className="text-xs sm:text-sm text-brand-slate leading-relaxed space-y-3">
                  <p>
                    For grievances, statutory notices, or immediate document return requests,
                    contact our designated Grievance Officer:
                  </p>
                  <div className="p-4 rounded-xl bg-slate-50 border border-brand-border/80 space-y-2">
                    <div className="text-xs font-bold text-brand-navy">
                      Data Protection &amp; Legal Compliance Division
                    </div>
                    <div className="text-xs text-brand-slate space-y-1">
                      <p>
                        <strong>Firm Name:</strong> {businessName}
                      </p>
                      <p>
                        <strong>Office Address:</strong> {officeAddress}
                      </p>
                      <p>
                        <strong>Email:</strong> {businessEmail}
                      </p>
                      <p>
                        <strong>Direct Phone:</strong> {businessPhone}
                      </p>
                      <p>
                        <strong>Operating Hours:</strong> Monday – Saturday: 9:30 AM – 6:30 PM (IST)
                      </p>
                    </div>
                  </div>
                </div>
              </article>

              {/* Bottom Conversion Strip */}
              <div className="bg-[#091522] text-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-white/10 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-1 text-center sm:text-left">
                  <div className="text-base sm:text-lg font-bold font-heading text-white">
                    Need a Confidential Mortgage Feasibility Review?
                  </div>
                  <p className="text-xs text-slate-300">
                    Schedule a private, off-bureau advisory session with zero CIBIL inquiry risk.
                  </p>
                </div>
                <Link
                  to="/enquire"
                  className="hero-btn-primary inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs sm:text-sm font-bold text-white shrink-0 tracking-wide"
                >
                  <span>Initiate Consultation</span>
                  <ArrowRight className="w-4 h-4 hero-btn-arrow" />
                </Link>
              </div>

            </main>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicyPage;

