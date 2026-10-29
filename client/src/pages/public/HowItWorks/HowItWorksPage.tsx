import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  ShieldCheck,
  Building,
  CheckCircle2,
  FileCheck2,
  Landmark,
  Scale,
  Sparkles,
  ChevronRight,
  ArrowRight,
  Zap,
  Lock,
  BadgePercent,
  Coins,
  Search,
  Check,
  PhoneCall,
  HelpCircle,
  FileText,
  UserCheck,
  AlertCircle,
  Layers,
  FileCheck,
  Sliders,
  Activity,
  Calculator,
  TrendingUp,
  BarChart3,
  Wallet,
} from 'lucide-react';
import { CHANNEL_PARTNERS, ChannelPartnersGroup } from '../../../constants/loanDocuments';
import howItsWorkHero from '../../../assets/images/how-its-work.avif';
import faqVisualImage from '../../../assets/images/how-its-work-faq.webp';
import consultationVisualImage from '../../../assets/images/contact-consultation-desk.webp';

export const HowItWorksPage: React.FC = () => {
  const [activePhase, setActivePhase] = useState<number>(1);
  const [activeBankCategory, setActiveBankCategory] = useState<string>('ALL');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [mounted, setMounted] = useState<boolean>(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

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

  // Interactive Hero Loan Simulator States
  const [simLoanType, setSimLoanType] = useState<'home' | 'lap' | 'car' | 'project'>('home');
  const [simAmountLakhs, setSimAmountLakhs] = useState<number>(65);
  const [simTenureYears, setSimTenureYears] = useState<number>(20);

  // Animated counters on mount
  const [counterValues, setCounterValues] = useState({
    turnaround: 8,
    lenders: 0,
    sanction: 0,
    capital: 0,
  });

  // Filtered banks for sliding marquee animation
  const filteredBanksList = useMemo(() => {
    return CHANNEL_PARTNERS.filter(
      (group: ChannelPartnersGroup) => activeBankCategory === 'ALL' || group.category === activeBankCategory
    ).flatMap((group: ChannelPartnersGroup) =>
      group.banks.map((bank: string) => ({
        bank,
        category: group.category.split(' ')[0],
      }))
    );
  }, [activeBankCategory]);

  const row1Banks = useMemo(() => {
    const half = Math.ceil(filteredBanksList.length / 2);
    const list = filteredBanksList.slice(0, half);
    const source = list.length > 0 ? list : filteredBanksList;
    let res = [...source];
    while (res.length < 10) res = [...res, ...source];
    return res;
  }, [filteredBanksList]);

  const row2Banks = useMemo(() => {
    const half = Math.ceil(filteredBanksList.length / 2);
    const list = filteredBanksList.slice(half);
    const source = list.length > 0 ? list : filteredBanksList;
    let res = [...source];
    while (res.length < 10) res = [...res, ...source];
    return res;
  }, [filteredBanksList]);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
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
        turnaround: 8,
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

  // Simulator computations
  const getRateForType = (type: 'home' | 'lap' | 'car' | 'project') => {
    switch (type) {
      case 'home':
        return 8.35;
      case 'lap':
        return 8.85;
      case 'car':
        return 8.65;
      case 'project':
        return 9.25;
    }
  };

  const currentRate = getRateForType(simLoanType);
  const p = simAmountLakhs * 100000;
  const r = currentRate / 12 / 100;
  const n = simTenureYears * 12;
  const estimatedEmi = Math.round((p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
  const estimatedFeeSaved = Math.round(p * 0.005); // 0.50% fee waiver benefit


  const advisoryPhases = [
    {
      phase: 1,
      number: '01',
      title: 'Financial Underwriting & FOIR Stress-Testing',
      turnaround: 'Day 1 – 2',
      badgeText: 'Pre-Audit & Bureau Safety',
      tagline: 'Algorithmic debt capacity modeling before formal bank submission',
      summary:
        'We analyze your net disposable income, tax computation, existing EMIs, and credit bureau footprint to determine your exact borrowing capacity under RBI retail lending guidelines—with zero hard inquiries on your CIBIL score.',
      steps: [
        'FOIR (Fixed Obligation to Income Ratio) calculation: 55% for salaried, up to 75% for corporate/business entities',
        'Soft bureau footprint audit: Identifying unresolved DPD, settlements, or credit card utilization spikes without triggering score dips',
        'Income enhancement structuring: Adding earning co-applicants (spouse, parents) and factoring verified secondary rental yields',
        'Debt-to-income stress testing to ensure repayment buffers across fluctuating interest rate cycles',
      ],
      deliverable: 'Certified Borrowing Capacity & Lender Eligibility Matrix',
      metric: '98.4%',
      metricLabel: 'First-Attempt Sanction Ratio',
      interactiveType: 'foir_calculator',
    },
    {
      phase: 2,
      number: '02',
      title: 'Lender Selection & In-Principle Sanction',
      turnaround: 'Day 2 – 4',
      badgeText: 'Channel Partner Syndication',
      tagline: 'Negotiating institutional spreads & processing fee concessions',
      summary:
        'We syndicate your dossier across our 40+ lending partners (Public Sector Banks, Private Commercial Banks, and specialized HFCs) to secure the lowest spread over the Repo Linked Lending Rate (RLLR).',
      steps: [
        'Evaluating lender-specific underwriting policies (matching land purchases, self-constructions, or commercial units with the highest LTV lender)',
        'Negotiating institutional processing fee waivers (aiming for 0.15% - 0.25% flat caps rather than standard 0.50% rack rates)',
        'Securing formal In-Principle Sanction Letter detailing sanctioned quantum, approved ROI, and pre-disbursement conditions',
        'Scrutinizing reset clauses (Repo rate change pass-through schedules) and locking zero-penalty foreclosure rights',
      ],
      deliverable: 'Formal Lender Sanction Letter with Binding Term Sheet',
      metric: '40+',
      metricLabel: 'Zonal Bank Panel Desks',
      interactiveType: 'lender_grid',
    },
    {
      phase: 3,
      number: '03',
      title: 'Legal Search (TSR) & Property Valuation',
      turnaround: 'Day 4 – 8',
      badgeText: 'Forensic Title & Engineering',
      tagline: 'Bank panel advocate vetting & civil engineer appraisal',
      summary:
        'Empanelled high court advocates and certified chartered engineers conduct exhaustive physical and legal due diligence to guarantee clear, marketable, and unencumbered ownership.',
      steps: [
        '30-Year Title Search Report (TSR): Tracing chain of ownership through parent mother deeds, partition deeds, and registered sale deeds',
        'Statutory revenue verification: 30-year Encumbrance Certificate (EC Form 15), Chitta/Patta extracts, and tax receipts',
        'Physical site valuation: Measuring carpet vs super built-up area, setback adherence, and road width access',
        'Layout approval verification: DTCP, CMDA, RERA, or local panchayat layout approval compliance',
      ],
      deliverable: 'Clear Title Clearance Certificate & Technical Valuation Report',
      metric: '30 Yrs',
      metricLabel: 'Unbroken Chain Scrutiny',
      interactiveType: 'title_audit',
    },
    {
      phase: 4,
      number: '04',
      title: 'MODT Execution & Fund Disbursement',
      turnaround: 'Day 8 – 12',
      badgeText: 'Sub-Registrar Closing',
      tagline: 'Safe fund transfer directly to seller or builder escrow',
      summary:
        'Final documentation, Memorandum of Deposit of Title Deeds (MODT) registration at the local Sub-Registrar office, and safe fund disbursement to your account or builder escrow.',
      steps: [
        'Executing the tripartite loan agreement, ECS/NACH auto-debit mandates, and disbursement requests',
        'Registration of MODT / equitable mortgage with the Sub-Registrar against official stamp duty receipts',
        'Original title deed deposit into the bank’s secure fireproof custody vault against a formal acknowledgement receipt',
        'Disbursement release via RTGS: Direct credit to property seller, builder RERA escrow, or stage-wise releases for construction',
      ],
      deliverable: 'Disbursement Advice & Amortization Repayment Schedule',
      metric: '24–48h',
      metricLabel: 'Post-MODT Fund Release',
      interactiveType: 'disbursement_pipeline',
    },
  ];

  const comparisonData = [
    {
      metric: 'Turnaround Time',
      traditional: '45 to 60 Days (Prolonged branch queues)',
      prime: '8 to 12 Business Days (Fast-Track Zonal Access)',
      highlight: true,
    },
    {
      metric: 'Bureau / CIBIL Impact',
      traditional: 'Multiple hard inquiries submitted across banks',
      prime: 'Zero hard inquiry; algorithmic pre-audit only',
      highlight: true,
    },
    {
      metric: 'Interest Rate Spread',
      traditional: 'Standard retail rack rates without negotiation',
      prime: 'Institutional wholesale spreads from 7.25% p.a.',
      highlight: false,
    },
    {
      metric: 'Processing Fee',
      traditional: 'Up to 0.50% – 1.00% + GST with no waivers',
      prime: 'Discounted to 0.15% – 0.25% or flat fee waivers',
      highlight: false,
    },
    {
      metric: 'Title & Legal Scrutiny',
      traditional: 'Single-tier branch legal report prone to queries',
      prime: 'Forensic 30-year mother deed audit & revenue vetting',
      highlight: true,
    },
    {
      metric: 'Multi-Bank Comparison',
      traditional: 'Borrower must visit each branch individually',
      prime: 'Single window syndication across 40+ PSU & Private banks',
      highlight: false,
    },
  ];

  const faqs = [
    {
      q: 'How does Prime Associates negotiate lower interest rates than direct branch walk-ins?',
      a: 'Banks categorize loan applications into retail branch walk-ins and high-volume institutional syndications. Because Prime Associates facilitates over ₹1,200+ Cr in cumulative loan disbursements, our advisory desk has direct access to zonal credit managers. This allows us to secure special institutional rate spreads over RLLR and substantial processing fee waivers that individual branch officers cannot grant.',
    },
    {
      q: 'Will checking my loan eligibility through this process impact my CIBIL score?',
      a: 'No. In Phase 1, our underwriters evaluate your FOIR and debt servicing ratios using soft mathematical modeling and applicant-provided data. We never trigger multiple unauthorized bureau pulls. A single formal inquiry is only placed after we finalize the exact lender offering you the best sanction terms.',
    },
    {
      q: 'What happens if my property title has a missing link document in the 30-year mother deed chain?',
      a: 'This is our core specialty. Our legal panel traces archival records through local sub-registrar offices, town survey records (TSLR), and certified copies to rectify missing links, partition discrepancies, or revenue patta variations before lender submission, preventing painful rejections.',
    },
    {
      q: 'How do stage-wise disbursements work for self-construction home loans?',
      a: 'For self-construction, funds are not released as a single lump sum. Instead, disbursements are released in tranches corresponding to physical construction milestones (Foundation, Plinth, Lintel, Roof Slab, and Plastering/Finishing). A certified civil engineer inspects each stage to authorize the next tranche release within 24 to 48 hours.',
    },
    {
      q: 'Can I transfer an existing high-cost private bank or NBFC loan to a low-rate government bank?',
      a: 'Yes. Our Balance Transfer (Takeover) protocol manages the entire transition: obtaining the foreclosure quote and List of Documents (LOD) from your existing lender, executing the new sanction with a PSU bank (e.g. SBI, Indian Bank, Canara Bank), and unlocking additional top-up capital at benchmark home loan rates.',
    },
  ];

  return (
    <div className="bg-[#f8f8f4] min-h-screen text-brand-navy font-sans">
      {/* ────────────────────────────────────────────────────────────
          1. HERO SECTION: THE 4-STAGE LENDING ARCHITECTURE (Matching Calculator Suite Palette)
          ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-slate-950 text-white pt-10 sm:pt-14 lg:pt-16 pb-12 sm:pb-16 lg:pb-20 border-b border-white/10">
        {/* Background Architectural Photographic Image: Brighter, Fixed & Stable */}
        <div className="absolute inset-0 z-0">
          <img
            src={howItsWorkHero}
            alt="Institutional Property Finance Architecture & Workflow"
            className="w-full h-full object-cover object-center brightness-[1.05] contrast-[1.02]"
            loading="eager"
          />
          {/* Calibrated lightweight translucent overlays so image is clearly visible and bright while text remains crisp */}
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/65 via-slate-950/25 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-slate-950/50" />

          {/* Ambient atmospheric lighting pulses */}
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
              {/* Institutional Header Tag with Live Status Beacon - Fixed in place */}
              <div
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateY(0)' : 'translateY(24px)',
                  transition: 'opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.12s, transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.12s',
                }}
                className="flex flex-wrap items-center gap-3"
              >
                <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-white/15 text-slate-100 text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-[#20B2AA] animate-pulse"></span>
                  <span className="font-heading">
                    Institutional Lending Pipeline &amp; FOIR Engine
                  </span>
                </div>
                <div className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-300 font-medium bg-white/5 px-3 py-1 rounded-full border border-white/10 font-sans">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Fast-Track Zonal Desk • Est. 2011</span>
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
                  From Algorithmic Pre-Audit to{' '}
                  <span className="shimmer-headline-text text-[#38bdf8]">
                    Direct Account Credit.
                  </span>
                </h1>
              </div>

              {/* Description Paragraph - Stays firmly in its place */}
              <p
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateY(0)' : 'translateY(24px)',
                  transition: 'opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.35s, transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.35s',
                }}
                className="text-xs sm:text-sm md:text-base text-slate-200 font-sans font-normal leading-relaxed max-w-2xl pt-1"
              >
                Eliminate 45-day branch queues, arbitrary credit rejections, and hidden broker markups. Our fiduciary 4-stage lending architecture transitions your file from preliminary FOIR assessment to Sub-Registrar MODT registration in <strong className="text-white font-semibold">8 to 12 business days</strong> across 40+ empanelled banks.
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
                      Fast-Track
                    </span>
                  </div>
                  <div className="text-xl xs:text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono tabular-nums">
                    {counterValues.turnaround}–12d
                  </div>
                  <div className="text-xs font-bold text-slate-200 mt-1 font-heading">
                    Sanction to Credit
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 leading-snug line-clamp-1 font-sans">
                    vs 45d Branch Queue
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
                    Capital Facilitated
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 leading-snug line-clamp-1 font-sans">
                    15-Year Practice
                  </div>
                </div>
              </div>

              {/* Call-to-Action Group */}
              <div
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateY(0)' : 'translateY(16px)',
                  transition: 'opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.45s, transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.45s',
                }}
                className="pt-1 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3"
              >
                <Link
                  to="/enquire"
                  className="hero-btn-primary inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3.5 text-white font-bold text-xs sm:text-sm font-heading shadow-lg shadow-teal-900/40 text-center cursor-pointer tracking-wide"
                >
                  <Sparkles className="w-4 h-4 text-teal-100" />
                  <span>Initiate Pre-Approval Application</span>
                  <ArrowRight className="w-4 h-4 hero-btn-arrow" />
                </Link>

                <a
                  href="#cockpit-breakdown"
                  className="hero-btn-secondary inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3.5 text-white font-semibold text-xs sm:text-sm font-heading shadow-sm backdrop-blur-sm text-center cursor-pointer"
                >
                  <FileCheck2 className="w-4 h-4 text-teal-300" />
                  <span>Explore 4-Stage Protocol</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </a>

                <a
                  href="tel:+919655566613"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-teal-300 border border-white/15 text-xs font-semibold font-heading backdrop-blur-sm transition-colors shadow-sm text-center"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-teal-300" />
                  <span>+91 96555 66613</span>
                </a>
              </div>

              {/* Institutional Safety Pillars Strip */}
              <div className="pt-2 border-t border-white/15 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-300 font-sans font-medium">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-400" />
                  <span>RBI Fair Practice Code Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-teal-400" />
                  <span>Zero Unauthorized Bureau Hard Pings</span>
                </div>
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-teal-400" />
                  <span>Zero Cash Collection Guarantee</span>
                </div>
              </div>
            </div>

            {/* ── RIGHT COLUMN: Interactive Live Loan Syndication Console & Simulator ── */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl bg-slate-900/85 backdrop-blur-xl border border-white/15 p-6 sm:p-7 shadow-2xl space-y-4 font-sans text-white">
                {/* Console Header with Brand Heading & Mono Fonts */}
                <div className="relative z-10 flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                    <span className="text-xs uppercase font-extrabold tracking-wider text-teal-200 font-heading">
                      Live Syndication Simulator
                    </span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-[10px] font-mono font-bold text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>Live Benchmarks</span>
                  </div>
                </div>

                {/* Loan Archetype Switcher Pills */}
                <div className="relative z-10 pt-3">
                  <span className="text-[10px] uppercase font-bold text-slate-300 font-heading tracking-wider block mb-2">
                    Select Credit Facility
                  </span>
                  <div className="grid grid-cols-4 gap-1.5 p-1 bg-black/40 rounded-xl border border-white/10">
                    {(
                      [
                        { id: 'home', label: 'Home Loan', rate: '8.35%' },
                        { id: 'lap', label: 'Mortgage LAP', rate: '8.85%' },
                        { id: 'car', label: 'Car Loan', rate: '8.65%' },
                        { id: 'project', label: 'Builder Project', rate: '9.25%' },
                      ] as const
                    ).map((facility) => {
                      const isSel = simLoanType === facility.id;
                      return (
                        <button
                          key={facility.id}
                          type="button"
                          onClick={() => setSimLoanType(facility.id)}
                          className={`py-2 px-1 rounded-lg text-center transition-all cursor-pointer font-heading ${
                            isSel
                              ? 'bg-gradient-to-r from-brand-teal to-teal-700 text-white font-bold shadow-sm'
                              : 'text-slate-300 hover:text-white hover:bg-white/5 font-semibold'
                          }`}
                        >
                          <span className="text-[11px] block leading-tight font-heading font-bold">{facility.label}</span>
                          <span className="text-[9px] block text-teal-200 opacity-90 font-mono font-bold">{facility.rate}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Interactive Sliders: Quantum & Tenure */}
                <div className="relative z-10 space-y-4 pt-3">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-slate-200 font-medium font-heading flex items-center gap-1.5">
                        <Wallet className="w-3.5 h-3.5 text-teal-400" /> Loan Quantum Required:
                      </span>
                      <span className="text-sm font-extrabold text-teal-300 font-mono tabular-nums">
                        ₹{simAmountLakhs} Lakhs
                      </span>
                    </div>
                    <input
                      type="range"
                      min={15}
                      max={300}
                      step={5}
                      value={simAmountLakhs}
                      onChange={(e) => setSimAmountLakhs(Number(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 pt-1 font-mono font-semibold">
                      <span>₹15 Lakhs</span>
                      <span>₹1.50 Crore</span>
                      <span>₹3.00 Crore</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-slate-200 font-medium font-heading flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-sky-400" /> Repayment Tenure:
                      </span>
                      <span className="text-sm font-extrabold text-sky-300 font-mono tabular-nums">
                        {simTenureYears} Years
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {[10, 15, 20, 25, 30].map((yr) => (
                        <button
                          key={yr}
                          type="button"
                          onClick={() => setSimTenureYears(yr)}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
                            simTenureYears === yr
                              ? 'bg-sky-500 text-white shadow-sm'
                              : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10'
                          }`}
                        >
                          {yr}y
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Dynamic Computation Result Cards */}
                <div className="relative z-10 grid grid-cols-3 gap-2 pt-3">
                  <div className="p-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-center">
                    <span className="text-[10px] text-slate-300 uppercase font-bold font-heading tracking-wider block">
                      Estimated EMI
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-white font-mono tabular-nums block mt-0.5">
                      ₹{estimatedEmi.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[9px] text-teal-300 font-semibold font-mono block">
                      @{currentRate}% Benchmark
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-teal-500/15 border border-teal-400/30 text-center">
                    <span className="text-[10px] text-teal-200 uppercase font-bold font-heading tracking-wider block">
                      Fee Waiver Saved
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-teal-100 font-mono tabular-nums block mt-0.5">
                      ₹{estimatedFeeSaved.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[9px] text-teal-200/90 font-medium font-sans block">
                      Direct Zonal Benefit
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-center">
                    <span className="text-[10px] text-slate-300 uppercase font-bold font-heading tracking-wider block">
                      Turnaround
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-white font-mono tabular-nums block mt-0.5">
                      8–12 Days
                    </span>
                    <span className="text-[9px] text-emerald-400 font-semibold font-sans block">
                      35d Faster vs Branch
                    </span>
                  </div>
                </div>

                {/* Interactive 4-Phase Stepper Inside Console */}
                <div className="relative z-10 pt-3 border-t border-white/10 mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-bold text-slate-300 font-heading tracking-wider">
                      Interactive Stage Synchronization
                    </span>
                    <span className="text-[10px] font-mono font-bold text-teal-300">
                      Phase {activePhase} / 4 Active
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {advisoryPhases.map((p) => {
                      const isAct = activePhase === p.phase;
                      return (
                        <button
                          key={p.phase}
                          type="button"
                          onClick={() => setActivePhase(p.phase)}
                          className={`py-2 px-1 rounded-xl text-center transition-all cursor-pointer border font-heading ${
                            isAct
                              ? 'bg-teal-500/25 border-teal-400 text-white shadow-sm'
                              : 'bg-black/30 border-white/10 text-slate-300 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <span
                            className={`w-5 h-5 mx-auto rounded-full flex items-center justify-center text-[10px] font-extrabold font-mono mb-1 ${
                              isAct ? 'bg-teal-400 text-slate-950' : 'bg-white/10 text-slate-300'
                            }`}
                          >
                            {p.number}
                          </span>
                          <span className="text-[9px] block font-bold font-heading truncate">
                            {p.phase === 1 && 'Pre-Audit'}
                            {p.phase === 2 && 'Syndication'}
                            {p.phase === 3 && 'TSR & Site'}
                            {p.phase === 4 && 'Disbursement'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Console Fast-Track Action Button */}
                <div className="relative z-10 pt-3">
                  <Link
                    to="/enquire"
                    className="w-full py-3.5 px-4 rounded-xl bg-brand-teal hover:bg-brand-teal-hover text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-teal-950/40 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer font-heading tracking-wide"
                  >
                    <Zap className="w-4 h-4 text-white fill-white" />
                    <span>Fast-Track Pre-Approval for ₹{simAmountLakhs} Lakhs</span>
                  </Link>
                </div>
              </div>
            </div>

          </div>

          {/* Interactive Horizontal Timeline Ribbon */}
          <div className="mt-12 sm:mt-16 max-w-5xl mx-auto">
            {/* Timeline Progress Line */}
            <div className="hidden lg:block relative mb-4">
              <div className="h-1 bg-white/10 rounded-full w-full">
                <div
                  className="h-1 bg-brand-teal rounded-full transition-all duration-500"
                  style={{ width: `${(activePhase / 4) * 100}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
              {advisoryPhases.map((phase) => {
                const isActive = activePhase === phase.phase;
                return (
                  <div
                    key={phase.phase}
                    onClick={() => setActivePhase(phase.phase)}
                    className={`relative p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all duration-300 text-left group ${
                      isActive
                        ? 'bg-gradient-to-br from-[#102235] to-[#0a1826] border-brand-teal text-white shadow-xl scale-[1.02]'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`w-8 h-8 rounded-xl flex items-center justify-center font-extrabold text-xs font-heading ${
                          isActive
                            ? 'bg-brand-teal text-white shadow-sm'
                            : 'bg-white/10 text-gray-300 group-hover:bg-white/15'
                        }`}
                      >
                        {phase.number}
                      </span>
                      <span className="text-[11px] font-mono text-emerald-400 font-bold bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-400/30">
                        {phase.turnaround}
                      </span>
                    </div>

                    <h3 className={`font-bold text-sm leading-snug ${isActive ? 'text-white' : 'text-slate-200'}`}>
                      {phase.title.split('&')[0]}
                    </h3>
                    <span className="text-[11px] block mt-1 text-slate-400 line-clamp-1">
                      {phase.badgeText}
                    </span>

                    {isActive && (
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-teal-400 rotate-45 rounded-xs hidden lg:block" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────
          2. DETAILED ACTIVE PHASE COCKPIT & INTERACTIVE ENGINE
          ──────────────────────────────────────────────────────────── */}
      <section id="cockpit-breakdown" className="pt-12 sm:pt-16 pb-0 bg-[#f8f8f4]">
        <div className="w-[92%] sm:w-[88%] lg:w-[85%] max-w-7xl mx-auto">
          {advisoryPhases
            .filter((p) => p.phase === activePhase)
            .map((curr) => (
              <div
                key={curr.phase}
                className="bg-white rounded-3xl border border-brand-border shadow-card p-6 sm:p-10 lg:p-12 transition-all animate-in fade-in zoom-in-95 duration-200"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                  
                  {/* Left Column: Full Phase Narrative & Key Advisory Actions */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                          Phase {curr.number} • {curr.badgeText}
                        </span>
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-mono">
                          {curr.turnaround}
                        </span>
                      </div>

                      <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy font-heading pt-1">
                        {curr.title}
                      </h2>

                      <p className="text-slate-600 text-sm sm:text-base leading-relaxed pt-1">
                        {curr.summary}
                      </p>
                    </div>

                    {/* Step Actions Checklist */}
                    <div className="space-y-3 pt-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Institutional Protocol Executed in this Phase:
                      </h4>
                      <div className="space-y-2.5">
                        {curr.steps.map((st, sIdx) => (
                          <div
                            key={sIdx}
                            className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs sm:text-sm text-slate-800 font-medium"
                          >
                            <CheckCircle2 className="w-4 h-4 text-brand-teal flex-shrink-0 mt-0.5" />
                            <span className="leading-snug">{st}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Phase Deliverable Banner */}
                    <div className="p-4 bg-teal-50/70 rounded-2xl border border-teal-200 flex items-center gap-3 text-xs sm:text-sm font-bold text-teal-950">
                      <Sparkles className="w-5 h-5 text-brand-teal flex-shrink-0" />
                      <div>
                        <span className="text-slate-500 font-medium block text-[11px] uppercase tracking-wider">
                          Certified Phase Milestone:
                        </span>
                        <span className="text-teal-900 font-bold">{curr.deliverable}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: High-Tech Interactive Cockpit Card */}
                  <div className="lg:col-span-5 bg-gradient-to-br from-[#102235] to-[#0a1826] text-white p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6 border border-white/15">
                    <div className="flex items-center justify-between pb-4 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs uppercase font-bold tracking-wider text-brand-teal-light font-heading">
                          Workflow Position
                        </span>
                      </div>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-mono">
                        Step {curr.number} of 04
                      </span>
                    </div>

                    {/* Phase Metric Hero Pill */}
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-gray-400 uppercase tracking-wider block font-semibold">
                          {curr.metricLabel}
                        </span>
                        <span className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                          {curr.metric}
                        </span>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-300 border border-emerald-400/30">
                        <Check className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Interactive Step Switcher */}
                    <div className="space-y-2.5">
                      <span className="text-[11px] uppercase font-bold tracking-wider text-gray-400 block font-heading">
                        Jump to Phase:
                      </span>
                      {advisoryPhases.map((item) => (
                        <div
                          key={item.phase}
                          onClick={() => setActivePhase(item.phase)}
                          className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                            item.phase === curr.phase
                              ? 'bg-brand-teal text-white shadow-sm border-brand-teal'
                              : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span
                              className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs ${
                                item.phase === curr.phase
                                  ? 'bg-white text-slate-900'
                                  : 'bg-white/10 text-slate-300'
                              }`}
                            >
                              {item.number}
                            </span>
                            <span className="text-xs font-semibold truncate max-w-[170px] font-heading">
                              {item.title.split('&')[0]}
                            </span>
                          </div>
                          <span className="text-[10px] text-emerald-400 font-mono font-bold">
                            {item.turnaround}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Call to Action */}
                    <div className="pt-2">
                      <Link
                        to="/enquire"
                        className="w-full py-3.5 bg-brand-teal hover:bg-brand-teal-hover text-white text-xs sm:text-sm font-bold rounded-corporate text-center transition-all flex items-center justify-center gap-2 shadow-lg shadow-teal-950/40"
                      >
                        <Sparkles className="w-4 h-4 text-emerald-300" />
                        <span>Initiate Step 01 Intake Now</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>

                </div>
              </div>
            ))}
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────
          3. COMPARISON MATRIX: TRADITIONAL QUEUE VS PRIME ASSOCIATES (Glassmorphism Table)
          ──────────────────────────────────────────────────────────── */}
      <section className="pt-12 sm:pt-16 pb-0 bg-[#f8f8f4]">
        <div className="w-[92%] sm:w-[88%] lg:w-[85%] max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-teal-light text-brand-teal text-xs font-bold uppercase tracking-wider border border-brand-teal/20 font-heading">
              <Scale className="w-3.5 h-3.5" />
              <span>Comparative Advantage</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-navy tracking-tight font-heading">
              Traditional Branch Queues vs.{' '}
              <span className="text-brand-teal">
                Institutional Syndication
              </span>
            </h2>
            <p className="text-brand-slate text-sm sm:text-base leading-relaxed font-sans">
              Why prospective homeowners, promoters, and corporate borrowers choose Prime Associates over standard walk-in branch applications.
            </p>
          </div>

          {/* Glassmorphism Table Container (Clean Normal Color) */}
          <div className="max-w-4xl mx-auto rounded-2xl sm:rounded-3xl border border-brand-border/80 bg-white/90 backdrop-blur-xl shadow-card ring-1 ring-slate-900/5 overflow-hidden">
            <div className="grid grid-cols-12 bg-slate-50/90 backdrop-blur-md border-b border-brand-border p-4 sm:p-5 text-xs font-extrabold uppercase tracking-wider text-slate-700 font-heading">
              <div className="col-span-4 sm:col-span-4 flex items-center gap-2 text-brand-navy">
                <span>Evaluation Metric</span>
              </div>
              <div className="col-span-4 sm:col-span-4 text-slate-500 font-semibold">
                Retail Branch Walk-In
              </div>
              <div className="col-span-4 sm:col-span-4 text-brand-teal font-extrabold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-teal" />
                <span>Prime Associates Desk</span>
              </div>
            </div>

            <div className="divide-y divide-slate-100 text-xs sm:text-sm font-sans">
              {comparisonData.map((row, idx) => (
                <div
                  key={idx}
                  className={`grid grid-cols-12 p-4 sm:p-5 items-center transition-all duration-200 hover:bg-teal-50/25 ${
                    row.highlight ? 'bg-teal-50/10' : ''
                  }`}
                >
                  <div className="col-span-4 font-bold text-brand-navy font-heading pr-2">
                    {row.metric}
                  </div>
                  <div className="col-span-4 text-slate-500 pr-3">
                    <span className="inline-block px-2.5 py-1.5 rounded-xl bg-red-50 border border-red-200/80 text-red-700 text-xs font-medium line-through">
                      {row.traditional}
                    </span>
                  </div>
                  <div className="col-span-4 font-bold text-teal-800 flex items-center gap-2">
                    <div className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-teal-50 border border-teal-200/80 text-teal-900 shadow-2xs font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-brand-teal flex-shrink-0" />
                      <span>{row.prime}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────
          4. 40+ CHANNEL PARTNER NETWORK (FROM MASTER PAGE 1)
          ──────────────────────────────────────────────────────────── */}
      <section className="pt-12 sm:pt-16 pb-0 bg-[#f8f8f4]">
        <div className="w-[92%] sm:w-[88%] lg:w-[85%] max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-teal-light text-brand-teal text-xs font-bold uppercase tracking-wider border border-brand-teal/20 font-heading">
              <Landmark className="w-3.5 h-3.5 text-brand-teal" />
              <span>Page 1 Channel Partners</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-navy tracking-tight font-heading">
              Our Regulated Lending Partner Ecosystem
            </h2>
            <p className="text-brand-slate text-sm sm:text-base leading-relaxed">
              We benchmark interest rates and negotiate sanction approvals directly across India's leading Public Sector, Private Commercial, and Housing Finance institutions.
            </p>

            {/* Category Filter Tabs */}
            <div className="pt-4 flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() => setActiveBankCategory('ALL')}
                className={`px-4 py-2 rounded-xl text-xs font-bold font-heading transition-all cursor-pointer ${
                  activeBankCategory === 'ALL'
                    ? 'bg-brand-teal text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-brand-border hover:bg-slate-50'
                }`}
              >
                All 40+ Channel Partners
              </button>
              {CHANNEL_PARTNERS.map((cat: ChannelPartnersGroup) => (
                <button
                  key={cat.category}
                  type="button"
                  onClick={() => setActiveBankCategory(cat.category)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold font-heading transition-all cursor-pointer ${
                    activeBankCategory === cat.category
                      ? 'bg-brand-navy text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-brand-border hover:bg-slate-50'
                  }`}
                >
                  {cat.category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sliding Bank Marquee Streams (Full Viewport Width) */}
        <div className="relative w-full overflow-hidden mt-6 sm:mt-8 space-y-3.5">
          {/* Edge Blur Gradients */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-36 lg:w-48 bg-gradient-to-r from-[#f8f8f4] via-[#f8f8f4]/80 to-transparent z-20" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-36 lg:w-48 bg-gradient-to-l from-[#f8f8f4] via-[#f8f8f4]/80 to-transparent z-20" />

            {/* Row 1: Leftward Stream */}
            <div className="overflow-hidden">
              <div className="animate-continuous-scroll flex items-stretch gap-3 sm:gap-4 py-1 select-none">
                {row1Banks.map((item, idx) => (
                  <div
                    key={`r1-${idx}`}
                    className="p-3.5 rounded-xl bg-white border border-brand-border/80 shadow-2xs hover:border-teal-400 hover:shadow-card transition-all flex flex-col justify-between shrink-0 w-[190px] sm:w-[220px] h-[78px] cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Landmark className="w-3.5 h-3.5 text-teal-600" />
                      <span className="text-[9px] uppercase font-bold text-slate-400 font-heading">
                        {item.category}
                      </span>
                    </div>
                    <span className="text-xs font-bold font-heading text-brand-navy leading-snug truncate">
                      {item.bank}
                    </span>
                  </div>
                ))}
                {/* Duplicate for seamless infinite loop */}
                {row1Banks.map((item, idx) => (
                  <div
                    key={`r1-dup-${idx}`}
                    aria-hidden="true"
                    className="p-3.5 rounded-xl bg-white border border-brand-border/80 shadow-2xs hover:border-teal-400 hover:shadow-card transition-all flex flex-col justify-between shrink-0 w-[190px] sm:w-[220px] h-[78px] cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Landmark className="w-3.5 h-3.5 text-teal-600" />
                      <span className="text-[9px] uppercase font-bold text-slate-400 font-heading">
                        {item.category}
                      </span>
                    </div>
                    <span className="text-xs font-bold font-heading text-brand-navy leading-snug truncate">
                      {item.bank}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Row 2: Rightward Reverse Stream */}
            <div className="overflow-hidden">
              <div className="animate-continuous-scroll-reverse flex items-stretch gap-3 sm:gap-4 py-1 select-none">
                {row2Banks.map((item, idx) => (
                  <div
                    key={`r2-${idx}`}
                    className="p-3.5 rounded-xl bg-white border border-brand-border/80 shadow-2xs hover:border-teal-400 hover:shadow-card transition-all flex flex-col justify-between shrink-0 w-[190px] sm:w-[220px] h-[78px] cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Landmark className="w-3.5 h-3.5 text-teal-600" />
                      <span className="text-[9px] uppercase font-bold text-slate-400 font-heading">
                        {item.category}
                      </span>
                    </div>
                    <span className="text-xs font-bold font-heading text-brand-navy leading-snug truncate">
                      {item.bank}
                    </span>
                  </div>
                ))}
                {/* Duplicate for seamless infinite loop */}
                {row2Banks.map((item, idx) => (
                  <div
                    key={`r2-dup-${idx}`}
                    aria-hidden="true"
                    className="p-3.5 rounded-xl bg-white border border-brand-border/80 shadow-2xs hover:border-teal-400 hover:shadow-card transition-all flex flex-col justify-between shrink-0 w-[190px] sm:w-[220px] h-[78px] cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Landmark className="w-3.5 h-3.5 text-teal-600" />
                      <span className="text-[9px] uppercase font-bold text-slate-400 font-heading">
                        {item.category}
                      </span>
                    </div>
                    <span className="text-xs font-bold font-heading text-brand-navy leading-snug truncate">
                      {item.bank}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <style>{`
              @keyframes continuousScroll {
                0% { transform: translate3d(0, 0, 0); }
                100% { transform: translate3d(-50%, 0, 0); }
              }

              @keyframes continuousScrollReverse {
                0% { transform: translate3d(-50%, 0, 0); }
                100% { transform: translate3d(0, 0, 0); }
              }

              .animate-continuous-scroll {
                display: flex;
                width: max-content;
                animation: continuousScroll 40s linear infinite;
                will-change: transform;
              }

              .animate-continuous-scroll-reverse {
                display: flex;
                width: max-content;
                animation: continuousScrollReverse 40s linear infinite;
                will-change: transform;
              }

              .animate-continuous-scroll:hover,
              .animate-continuous-scroll:active,
              .animate-continuous-scroll-reverse:hover,
              .animate-continuous-scroll-reverse:active {
                animation-play-state: paused !important;
              }
            `}</style>
          </div>
      </section>

      {/* ────────────────────────────────────────────────────────────
          5. INTERACTIVE FREQUENTLY ASKED QUESTIONS (FAQS)
          ──────────────────────────────────────────────────────────── */}
      <section className="pt-12 sm:pt-16 pb-0 bg-[#f8f8f4]">
        <div className="w-[92%] sm:w-[88%] lg:w-[85%] max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left FAQ Visual & Description Card */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-teal-light text-brand-teal text-xs font-bold uppercase tracking-wider border border-brand-teal/20 font-heading">
                  <HelpCircle className="w-3.5 h-3.5 text-brand-teal" />
                  <span>Borrower Queries</span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-navy tracking-tight font-heading">
                  Frequently Asked Questions About the 4 Phases
                </h2>
                <p className="text-brand-slate text-sm sm:text-base leading-relaxed">
                  Clear answers to the most common queries regarding bureau audits, title verification, and disbursement procedures.
                </p>
              </div>

              {/* FAQ Visual Card */}
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-brand-border/80 shadow-card bg-slate-900 group">
                <img
                  src={faqVisualImage}
                  alt="Frequently Asked Questions Assistance Desk"
                  className="w-full h-56 sm:h-64 object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-95"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 space-y-1">
                  <div className="text-white text-sm font-bold font-heading">
                    Have a specific collateral or eligibility query?
                  </div>
                  <p className="text-slate-300 text-xs">
                    Our credit underwriting and title diligence panel provides one-on-one consultation.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Accordion List */}
            <div className="lg:col-span-7 space-y-3.5">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="border border-brand-border rounded-xl overflow-hidden bg-brand-ivory/40 transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-brand-ivory/60 transition-colors focus:outline-none font-bold font-heading text-sm sm:text-base text-brand-navy hover:text-brand-teal"
                  >
                    <span className="pr-4 flex items-center gap-3">
                      <HelpCircle className="w-4 h-4 text-brand-teal flex-shrink-0" />
                      <span>{faq.q}</span>
                    </span>
                    <ChevronRight
                      className={`w-5 h-5 text-brand-slate transition-transform duration-200 shrink-0 ${
                        isOpen ? 'rotate-90 text-brand-teal' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="p-5 pt-2 text-xs sm:text-sm text-brand-slate bg-white leading-relaxed border-t border-brand-border/40 animate-in fade-in duration-150">
                      <p className="pl-7">{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────
          6. CONVERSION CTA BANNER
          ──────────────────────────────────────────────────────────── */}
      <section className="py-12 sm:py-16 bg-[#f8f8f4]">
        <div className="w-[92%] sm:w-[88%] lg:w-[85%] max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-[#091522] to-[#102235] text-white border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-14 relative overflow-hidden shadow-xl text-center">
            {/* Visual Background Integration */}
            <div className="absolute inset-0 z-0">
              <img
                src={consultationVisualImage}
                alt="Direct Advisory & Underwriting Consultation Desk"
                className="w-full h-full object-cover object-right opacity-25 mix-blend-luminosity brightness-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#091522] via-[#091522]/90 to-[#102235]/80" />
            </div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-teal/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-4xl mx-auto space-y-6 relative z-10">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-teal/15 border border-brand-teal/30 text-brand-teal-light text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Fast-Track Pre-Underwriting</span>
              </span>

              <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-heading leading-tight">
                Ready to Secure Institutional Financing <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-teal via-emerald-400 to-sky-300">
                  Without the Standard Bank Hassle?
                </span>
              </h2>

              <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Book a confidential Phase 1 consultation or submit your property loan dossier with attached reference documents for preliminary 24–48h review.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
                <Link
                  to="/enquire"
                  className="w-full sm:w-auto px-8 py-4 bg-brand-teal hover:bg-brand-teal-hover text-white font-bold text-sm rounded-corporate shadow-xl shadow-teal-950/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <span>Initiate Phase 1 Consultation</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="tel:+919655566613"
                  className="w-full sm:w-auto px-6 py-4 bg-white/10 hover:bg-white/15 text-white font-semibold text-sm rounded-corporate border border-white/20 backdrop-blur-sm transition-all flex items-center justify-center gap-2"
                >
                  <PhoneCall className="w-4 h-4 text-teal-300" />
                  <span>Call Advisory Desk: +91 96555 66613</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
