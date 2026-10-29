import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  Scale,
  ShieldCheck,
  Building2,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Clock,
  Printer,
  Share2,
  ArrowRight,
  PhoneCall,
  Mail,
  Gavel,
  BadgePercent,
  Landmark,
  FileCheck2,
  Sparkles,
} from 'lucide-react';
import { SiteContent } from '../../../types';
import termsHeroImage from '../../../assets/images/terms-hero-governance.jpg';

export const TermsConditionsPage: React.FC = () => {
  const context = useOutletContext<{ content?: SiteContent | null }>();
  const content = context?.content || null;
  const businessName = content?.businessName || 'Prime Associates — Loans & Constructions';
  const businessPhone = content?.businessPhone || '+91 96555 66613, +91 95144 66600';
  const businessEmail = content?.businessEmail || 'primeassociates2008@gmail.com';
  const officeAddress =
    content?.officeAddress ||
    'No. 48, 49, P.R. Complex, Binny Compound Main Street, Kumaran Road, Tirupur - 641601';

  const [activeSection, setActiveSection] = useState<string>('status');
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
    { id: 'status', title: '1. Regulatory Status & Non-Lending Notice' },
    { id: 'mandate', title: '2. Advisory Representation Mandate' },
    { id: 'borrower-warranties', title: '3. Borrower Warranties & Disclosures' },
    { id: 'fee-structure', title: '4. Fee Transparency & Zero Advance Policy' },
    { id: 'rate-benchmarks', title: '5. Interest Rates & RBI EBLR Pegging' },
    { id: 'title-diligence', title: '6. 30-Year Forensic Mother Deed Scrutiny' },
    { id: 'cashless', title: '7. Zero Cash Handling & Anti-Bribery' },
    { id: 'ip-models', title: '8. Algorithmic FOIR & Intellectual Property' },
    { id: 'liability', title: '9. Limitation of Advisory Liability' },
    { id: 'termination', title: '10. Termination & Record Archival' },
    { id: 'jurisdiction', title: '11. Governing Law & Dispute Resolution' },
  ];

  return (
    <div className="bg-[#f8f8f4] min-h-screen text-brand-navy font-sans antialiased selection:bg-brand-teal selection:text-white">
      {/* ────────────────────────────────────────────────────────────
          1. HERO SECTION — INSTITUTIONAL GOVERNANCE & LEGAL COUNCIL
          ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-slate-950 text-white pt-10 sm:pt-14 lg:pt-16 pb-12 sm:pb-16 lg:pb-20 border-b border-white/10">
        {/* Background Image + Clean Lightweight Overlay Stack with Subtle Zoom Animation */}
        <div className="absolute inset-0 z-0">
          <img
            src={termsHeroImage}
            alt="Institutional Legal Governance Boardroom"
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
                <span>Advisory Mandate &amp; RBI Fair Practice Code Aligned</span>
              </div>
              <div className="hidden sm:inline-flex items-center gap-1.5 text-xs text-gray-300 font-medium bg-slate-950/50 px-3 py-1 rounded-full border border-white/15 backdrop-blur-md font-heading">
                <Scale className="w-3.5 h-3.5 text-teal-400" />
                <span>Statutory Fiduciary Standard</span>
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
                Institutional Advisory Scope,{' '}
                <span className="shimmer-headline-text text-[#38bdf8]">Terms of Service</span>{' '}
                &amp; Disclaimers.
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-gray-300 font-normal leading-relaxed max-w-2xl pt-1">
                The formal legal charter governing advisory representation, underwriting prerequisites,
                transparent fees, and collateral diligence between{' '}
                <strong className="text-white font-bold">{businessName}</strong> and our client
                borrowers.
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
                <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Document Ref: PA-TOS-2026-V3</span>
              </span>
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg border border-white/15 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Terms</span>
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
                { label: 'Primary Lenders', val: '40+', sub: 'PSU & Tier-1 Banks' },
                { label: 'Advance Fees', val: '₹0', sub: 'Zero Upfront Charges' },
                { label: 'Cash Policy', val: '0%', sub: 'Strictly Cashless' },
                { label: 'Title Scrutiny', val: '30-Yr', sub: 'High Court Audits' },
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
          2. CORE CONTENT — INTERACTIVE SIDEBAR & LEGAL CLAUSES
          ──────────────────────────────────────────────────────────── */}
      <section className="py-12 sm:py-16 bg-[#f8f8f4]">
        <div className="w-[92%] sm:w-[88%] lg:w-[85%] max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start relative">
            
            {/* ── LEFT SIDEBAR: Table of Contents & Quick Contact (Sticky in position while right slides) ── */}
            <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto pr-1">
              {/* Table of Contents Card */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-brand-border/80 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-brand-border/60">
                  <Scale className="w-4 h-4 text-brand-teal" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-brand-navy font-heading">
                    Agreement Sections
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

              {/* Legal & Compliance Desk Card */}
              <div className="bg-gradient-to-br from-[#12263a] to-[#183247] text-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/10 shadow-card space-y-4">
                <div className="flex items-center gap-2 text-teal-300">
                  <Gavel className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Legal Advisory Secretariat
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  For formal representations, commercial mandate agreements, or legal title
                  clearance clarifications:
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
                  Principal Seat: <strong>Tirupur, Tamil Nadu, India</strong>
                </div>
              </div>
            </aside>

            {/* ── RIGHT MAIN CONTENT: Terms Clauses & Disclosures ── */}
            <main className="lg:col-span-8 space-y-8">
              
              {/* Mandatory Regulatory Disclosure Callout */}
              <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-amber-50/80 border border-amber-200 text-amber-950 space-y-2">
                <div className="flex items-center gap-2 text-amber-800 font-bold text-sm font-heading">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Important Regulatory Disclaimer — Non-Banking Firm</span>
                </div>
                <p className="text-xs text-amber-900/90 leading-relaxed">
                  <strong>{businessName}</strong> is an independent property finance consultancy firm
                  and loan syndication facilitator. <strong>We are NOT a bank, Non-Banking Financial
                  Company (NBFC), or primary lender.</strong> We do not hold client deposits, issue
                  promissory notes, or disburse funds from our balance sheet. All loan approvals,
                  sanction limits, interest rate spreads, and disbursement schedules are determined
                  solely by our partner regulated institutions under RBI regulatory guidelines.
                </p>
              </div>

              {/* CLAUSE 1: Regulatory Status & Scope */}
              <article
                id="status"
                className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-brand-border/80 shadow-2xs space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-brand-border/60">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-brand-teal" />
                    <h2 className="text-lg sm:text-xl font-bold text-brand-navy font-heading">
                      1. Regulatory Status &amp; Non-Lending Notice
                    </h2>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-brand-slate px-2.5 py-1 rounded">
                    Charter Scope
                  </span>
                </div>

                <div className="text-xs sm:text-sm text-brand-slate leading-relaxed space-y-3">
                  <p>
                    These Terms of Service constitute a legally binding agreement between you ("Client",
                    "Borrower", or "Applicant") and <strong>{businessName}</strong> ("Prime
                    Associates", "Firm", "we", "us").
                  </p>
                  <p>
                    Prime Associates operates as an independent credit facilitator and title due
                    diligence advisory desk under Indian law. By accessing this website, submitting an
                    enquiry, utilizing our loan calculators, or delivering property records to our
                    practice, you confirm and agree that:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs text-brand-slate">
                    <li>
                      We act as your authorized client advocate to structure loan dossiers for
                      introduction to regulated Indian lenders.
                    </li>
                    <li>
                      Nothing on this website constitutes a formal credit approval, legally binding loan
                      commitment, or guarantee of sanction.
                    </li>
                    <li>
                      Final sanction authority resides exclusively with our partner RBI-regulated
                      Scheduled Commercial Banks and Housing Finance Companies.
                    </li>
                  </ul>
                </div>
              </article>

              {/* CLAUSE 2: Advisory Representation Mandate */}
              <article
                id="mandate"
                className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-brand-border/80 shadow-2xs space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-brand-border/60">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-brand-teal" />
                    <h2 className="text-lg sm:text-xl font-bold text-brand-navy font-heading">
                      2. Advisory Representation Mandate
                    </h2>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-brand-slate px-2.5 py-1 rounded">
                    Engagement Scope
                  </span>
                </div>

                <div className="text-xs sm:text-sm text-brand-slate leading-relaxed space-y-3">
                  <p>Upon client onboarding, Prime Associates delivers the following specified advisory services:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-brand-border/60 space-y-1">
                      <div className="font-bold text-xs text-brand-navy">
                        A. FOIR &amp; Balance Sheet Normalization
                      </div>
                      <p className="text-[11px] text-brand-slate">
                        Restructuring ITR depreciation add-backs, promoter cash flows, and GST credits to
                        maximize borrowing capacity up to 75% FOIR.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-brand-border/60 space-y-1">
                      <div className="font-bold text-xs text-brand-navy">
                        B. Forensic 30-Year Title Due Diligence
                      </div>
                      <p className="text-[11px] text-brand-slate">
                        Reviewing mother deeds from 1990 onwards, EC Form 15/16, Patta/Khata mutations,
                        and RERA/CMDA approvals to guarantee zero title queries.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-brand-border/60 space-y-1">
                      <div className="font-bold text-xs text-brand-navy">
                        C. Direct Zonal Credit Syndication
                      </div>
                      <p className="text-[11px] text-brand-slate">
                        Submitting pre-vetted dossiers directly to senior zonal credit committees and
                        risk heads across 40+ partner institutions.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-brand-border/60 space-y-1">
                      <div className="font-bold text-xs text-brand-navy">
                        D. Term Sheet Comparison &amp; Execution
                      </div>
                      <p className="text-[11px] text-brand-slate">
                        Verifying sanction letters to ensure zero hidden processing fees, transparent
                        RLLR/EBLR resets, and zero prepayment penalties.
                      </p>
                    </div>
                  </div>
                </div>
              </article>

              {/* CLAUSE 3: Borrower Warranties */}
              <article
                id="borrower-warranties"
                className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-brand-border/80 shadow-2xs space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-brand-border/60">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-brand-teal" />
                    <h2 className="text-lg sm:text-xl font-bold text-brand-navy font-heading">
                      3. Borrower Warranties &amp; Full Disclosure
                    </h2>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-brand-slate px-2.5 py-1 rounded">
                    Client Obligations
                  </span>
                </div>

                <div className="text-xs sm:text-sm text-brand-slate leading-relaxed space-y-3">
                  <p>As a condition of advisory representation, the Client expressly warrants and covenants that:</p>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs text-brand-slate">
                    <li>
                      All KYC documents, tax returns, bank statements, and title records provided to Prime
                      Associates are authentic, unaltered, and legally verifiable.
                    </li>
                    <li>
                      The mortgaged collateral property has no undisclosed third-party claims, lis pendens
                      litigation, family partition suits, or revenue attachments.
                    </li>
                    <li>
                      The Client has not executed parallel filings through unorganized DSAs for the same
                      lender desk, which could trigger automatic file locking under bank deduplication
                      rules.
                    </li>
                  </ul>
                  <p className="text-xs text-brand-slate">
                    Submission of fraudulent or forged documents will result in immediate termination of
                    representation and reporting to relevant statutory authorities in accordance with Indian
                    Penal Code provisions.
                  </p>
                </div>
              </article>

              {/* CLAUSE 4: Fee Structure & Zero Advance Policy */}
              <article
                id="fee-structure"
                className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-brand-border/80 shadow-2xs space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-brand-border/60">
                  <div className="flex items-center gap-2">
                    <BadgePercent className="w-5 h-5 text-brand-teal" />
                    <h2 className="text-lg sm:text-xl font-bold text-brand-navy font-heading">
                      4. Fee Transparency &amp; Zero Advance Policy
                    </h2>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded font-mono">
                    Zero Advance
                  </span>
                </div>

                <div className="text-xs sm:text-sm text-brand-slate leading-relaxed space-y-3">
                  <p>
                    Prime Associates maintains a strict institutional transparency standard regarding all
                    remuneration:
                  </p>
                  <div className="space-y-2 p-4 rounded-xl bg-slate-50 border border-brand-border/80 text-xs text-brand-slate">
                    <p>
                      <strong>Zero Upfront Sanction Fees:</strong> We do not collect advance "file opening
                      charges", "committee bribe funds", or "speed fees". Initial consultation, borrowing
                      capacity evaluation, and preliminary title scrutiny are provided with zero advance
                      demands.
                    </p>
                    <p>
                      <strong>Lender Origination:</strong> In standard retail and builder APF syndications,
                      remuneration is disbursed directly by regulated lending institutions upon successful
                      loan disbursement, at zero cost markup to the borrower.
                    </p>
                    <p>
                      <strong>Bespoke Corporate Structuring:</strong> For high-ticket commercial asset
                      refinancing (LRD/LAP &gt; ₹10 Cr), project finance, or complex High Court title
                      litigation cures, advisory success fees are governed by an explicit written engagement
                      contract signed prior to work commencement.
                    </p>
                  </div>
                </div>
              </article>

              {/* CLAUSE 5: Interest Rates & Benchmarks */}
              <article
                id="rate-benchmarks"
                className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-brand-border/80 shadow-2xs space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-brand-border/60">
                  <div className="flex items-center gap-2">
                    <Landmark className="w-5 h-5 text-brand-teal" />
                    <h2 className="text-lg sm:text-xl font-bold text-brand-navy font-heading">
                      5. Interest Rates &amp; RBI EBLR Pegging
                    </h2>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-brand-slate px-2.5 py-1 rounded">
                    Market Benchmarks
                  </span>
                </div>

                <div className="text-xs sm:text-sm text-brand-slate leading-relaxed space-y-3">
                  <p>
                    All interest rates cited across our website, calculators, and marketing materials (e.g.
                    "Home loans starting at 7.25%*") are indicative benchmark rates pegged to the Reserve
                    Bank of India Repo-Linked Lending Rate (RLLR / EBLR) or MCLR of partner institutions.
                  </p>
                  <p>
                    Final sanctioned interest rates depend on individual borrower credit risk grades, CIBIL
                    score tiers (e.g., 750+), loan-to-value (LTV) ratios, property category, and lender
                    credit policy at the time of formal sanction letter issuance.
                  </p>
                </div>
              </article>

              {/* CLAUSE 6: 30-Year Forensic Title Scrutiny */}
              <article
                id="title-diligence"
                className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-brand-border/80 shadow-2xs space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-brand-border/60">
                  <div className="flex items-center gap-2">
                    <FileCheck2 className="w-5 h-5 text-brand-teal" />
                    <h2 className="text-lg sm:text-xl font-bold text-brand-navy font-heading">
                      6. 30-Year Forensic Mother Deed Scrutiny
                    </h2>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-brand-slate px-2.5 py-1 rounded font-mono">
                    Audit Standard
                  </span>
                </div>

                <div className="text-xs sm:text-sm text-brand-slate leading-relaxed space-y-3">
                  <p>
                    Our legal due diligence desk provides internal title verification to identify encumbrance
                    defects, patta/khata mutation gaps, or layout approval anomalies before submission.
                  </p>
                  <p>
                    While our pre-audit achieves a 98.4% bank sanction ratio, formal legal clearance and
                    title search reports are finalized by the empaneled High Court legal advocate of the
                    disbursing bank. Prime Associates coordinates directly with lender legal counsels to
                    cure title queries promptly.
                  </p>
                </div>
              </article>

              {/* CLAUSE 7: Zero Cash Handling */}
              <article
                id="cashless"
                className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-brand-border/80 shadow-2xs space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-brand-border/60">
                  <div className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-brand-teal" />
                    <h2 className="text-lg sm:text-xl font-bold text-brand-navy font-heading">
                      7. Zero Cash Handling &amp; Anti-Bribery Enforcement
                    </h2>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-700 border border-red-200 px-2.5 py-1 rounded font-mono">
                    Strict Prohibition
                  </span>
                </div>

                <div className="text-xs sm:text-sm text-brand-slate leading-relaxed space-y-3">
                  <p>
                    Prime Associates enforces an uncompromising, zero-exception cash prohibition policy:
                  </p>
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-900 space-y-1">
                    <p className="font-bold">
                      DO NOT HAND OVER CASH TO ANY REPRESENTATIVE OF PRIME ASSOCIATES OR BANK SALES STAFF.
                    </p>
                    <p>
                      All legitimate banking fees (statutory login charges, processing fees, valuer fees, and
                      MODT stamp duty) must be paid strictly via account payee cheque, digital net-banking, or
                      official lender payment gateway in favor of the lending bank.
                    </p>
                  </div>
                </div>
              </article>

              {/* CLAUSE 8: Algorithmic FOIR & IP */}
              <article
                id="ip-models"
                className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-brand-border/80 shadow-2xs space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-brand-border/60">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-brand-teal" />
                    <h2 className="text-lg sm:text-xl font-bold text-brand-navy font-heading">
                      8. Algorithmic FOIR &amp; Intellectual Property
                    </h2>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-brand-slate px-2.5 py-1 rounded">
                    Proprietary Code
                  </span>
                </div>

                <div className="text-xs sm:text-sm text-brand-slate leading-relaxed space-y-3">
                  <p>
                    All proprietary FOIR stress-testing algorithms, composite loan tranche calculations, 3D
                    interactive Three.js city visualizers, UI components, and advisory blueprints published
                    on this website are the exclusive intellectual property of Prime Associates.
                    Unauthorized reproduction, web scraping, or commercial emulation is strictly
                    actionable under the Copyright Act, 1957.
                  </p>
                </div>
              </article>

              {/* CLAUSE 9: Limitation of Liability */}
              <article
                id="liability"
                className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-brand-border/80 shadow-2xs space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-brand-border/60">
                  <div className="flex items-center gap-2">
                    <Scale className="w-5 h-5 text-brand-teal" />
                    <h2 className="text-lg sm:text-xl font-bold text-brand-navy font-heading">
                      9. Limitation of Advisory Liability
                    </h2>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-brand-slate px-2.5 py-1 rounded">
                    Legal Shield
                  </span>
                </div>

                <div className="text-xs sm:text-sm text-brand-slate leading-relaxed space-y-3">
                  <p>
                    In no event shall Prime Associates, its partners, advocates, or advisory executives be
                    liable for:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs text-brand-slate">
                    <li>
                      Lender credit committee rejection due to adverse CIBIL write-offs, undisclosed tax
                      deficits, or negative bureau telemetry.
                    </li>
                    <li>
                      Lender interest rate changes triggered by RBI monetary policy rate adjustments before
                      sanction execution.
                    </li>
                    <li>
                      Delays caused by municipal offices, sub-registrar servers, or developer non-compliance
                      with RERA escrow mandates.
                    </li>
                  </ul>
                  <p className="text-xs text-brand-slate">
                    Our cumulative liability under any engagement shall not exceed the direct advisory fees
                    received by the Firm for the specific engagement giving rise to the claim.
                  </p>
                </div>
              </article>

              {/* CLAUSE 10: Termination & Records */}
              <article
                id="termination"
                className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-brand-border/80 shadow-2xs space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-brand-border/60">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-brand-teal" />
                    <h2 className="text-lg sm:text-xl font-bold text-brand-navy font-heading">
                      10. Termination &amp; Record Archival
                    </h2>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-brand-slate px-2.5 py-1 rounded">
                    File Protocol
                  </span>
                </div>

                <div className="text-xs sm:text-sm text-brand-slate leading-relaxed space-y-3">
                  <p>
                    Either party may terminate advisory representation upon 7 business days written notice.
                    Upon termination, all original physical documents in our custody will be returned
                    against formal receipt, and digital files will be archived or purged in compliance with
                    our Privacy Policy and RBI record retention guidelines.
                  </p>
                </div>
              </article>

              {/* CLAUSE 11: Governing Law & Jurisdiction */}
              <article
                id="jurisdiction"
                className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-brand-border/80 shadow-2xs space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-brand-border/60">
                  <div className="flex items-center gap-2">
                    <Gavel className="w-5 h-5 text-brand-teal" />
                    <h2 className="text-lg sm:text-xl font-bold text-brand-navy font-heading">
                      11. Governing Law &amp; Dispute Resolution
                    </h2>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-50 text-brand-teal border border-teal-200 px-2.5 py-1 rounded font-mono">
                    Jurisdiction
                  </span>
                </div>

                <div className="text-xs sm:text-sm text-brand-slate leading-relaxed space-y-3">
                  <p>
                    These Terms of Service and any advisory disputes arising hereunder shall be governed by
                    and construed in accordance with the laws of the Republic of India.
                  </p>
                  <p>
                    The courts having exclusive jurisdiction over any legal proceedings arising out of this
                    engagement shall be the competent courts in <strong>Tirupur / Coimbatore, Tamil Nadu,
                    India</strong>.
                  </p>
                  <div className="p-4 rounded-xl bg-slate-50 border border-brand-border/80 space-y-2">
                    <div className="text-xs font-bold text-brand-navy">
                      Institutional Governance Secretariat
                    </div>
                    <div className="text-xs text-brand-slate space-y-1">
                      <p>
                        <strong>Firm:</strong> {businessName}
                      </p>
                      <p>
                        <strong>Principal Address:</strong> {officeAddress}
                      </p>
                      <p>
                        <strong>Legal Desk Email:</strong> {businessEmail}
                      </p>
                      <p>
                        <strong>Advisory Hotline:</strong> {businessPhone}
                      </p>
                    </div>
                  </div>
                </div>
              </article>

              {/* Bottom Conversion Strip */}
              <div className="bg-[#091522] text-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-white/10 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-1 text-center sm:text-left">
                  <div className="text-base sm:text-lg font-bold font-heading text-white">
                    Ready for a Structured Mortgage Syndication?
                  </div>
                  <p className="text-xs text-slate-300">
                    Connect directly with senior advisory credit heads under transparent engagement terms.
                  </p>
                </div>
                <Link
                  to="/enquire"
                  className="hero-btn-primary inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs sm:text-sm font-bold text-white shrink-0 tracking-wide"
                >
                  <span>Request Advisory Intake</span>
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

export default TermsConditionsPage;

