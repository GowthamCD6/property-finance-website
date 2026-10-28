import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  Building2,
  ShieldCheck,
  Target,
  Users,
  CheckCircle2,
  ArrowRight,
  Landmark,
  Scale,
  Award,
  TrendingUp,
  FileSearch,
  Lock,
  ChevronRight,
  PhoneCall,
  Sparkles,
  Briefcase,
  HelpCircle,
  ExternalLink,
  Layers,
  Activity,
  Check,
  BarChart3,
  Clock,
  Sliders,
  DollarSign,
  Building,
  Cpu,
  BadgePercent,
  FileCheck2,
  BookOpen,
} from 'lucide-react';
import { SiteContent } from '../../../types';
import { AboutHero3D, SceneMode } from './AboutHero3D';

export const AboutPage: React.FC = () => {
  const context = useOutletContext<{ content?: SiteContent | null }>();
  const content = context?.content || null;
  const businessName = content?.businessName || 'Prime Associates — Loans & Constructions';
  const businessPhone = content?.businessPhone || '+91 96555 66613, +91 95144 66600';

  // State management for interactive elements
  const [activeTab, setActiveTab] = useState<'mission' | 'vision' | 'governance' | 'methodology'>('mission');
  const [heroSceneMode, setHeroSceneMode] = useState<SceneMode>('skyline');
  const [activeMilestoneIndex, setActiveMilestoneIndex] = useState<number>(4); // default to 2026
  const [selectedLoanType, setSelectedLoanType] = useState<'home' | 'lap' | 'lrd' | 'construction'>('home');
  const [activePillar, setActivePillar] = useState<number>(0);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(timer);
  }, []);

  // Animated counter effect for hero stats
  const [counterValues, setCounterValues] = useState({
    capital: 0,
    lenders: 0,
    sanction: 0,
    turnaround: 24,
  });

  useEffect(() => {
    let step = 0;
    const interval = setInterval(() => {
      step++;
      const progress = Math.min(step / 30, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCounterValues({
        capital: Math.round(1200 * eased),
        lenders: Math.round(40 * eased),
        sanction: Number((98.4 * eased).toFixed(1)),
        turnaround: 24,
      });
      if (progress >= 1) clearInterval(interval);
    }, 40);

    return () => clearInterval(interval);
  }, []);

  // Institutional proof points
  const kpis = [
    {
      value: `₹${counterValues.capital}+ Cr`,
      label: 'Facilitated Capital',
      subtext: 'Across High-Value Property Assets',
      badge: 'Cumulative 15-Yr',
    },
    {
      value: `${counterValues.lenders}+`,
      label: 'Partner Lending Desks',
      subtext: 'PSU, Private Tier-1 Banks & NBFCs',
      badge: 'Direct Zonal Access',
    },
    {
      value: `${counterValues.sanction}%`,
      label: 'Sanction Ratio',
      subtext: 'Achieved via 30-Yr Legal Due Diligence',
      badge: 'Pre-Audit Protocol',
    },
    {
      value: '24–48h',
      label: 'Credit In-Principle',
      subtext: 'Bypassing Branch Level Bottlenecks',
      badge: 'Fast-Track Desk',
    },
  ];

  // Core Pillars of Advisory
  const advisoryPillars = [
    {
      id: 0,
      title: 'Forensic Title & Legal Due Diligence',
      badge: 'Pre-Submission Audit',
      tagline: 'Zero Risk of Delayed Sanction',
      description:
        'We conduct in-depth 30-year mother deed chain audits, encumbrance verification, patta/khata authenticity scrutiny, and municipal master plan zoning checks before bank submission to ensure pristine collateral approval.',
      metrics: '30-Year Chain Scrutiny',
      icon: <FileSearch className="w-6 h-6 text-teal-400" />,
      features: [
        'Mother Deed lineage trace from 1990 onwards',
        'Sub-Registrar encumbrance certificate (Form 15 & 16) cross-matching',
        'Layout approval validity (DTCP / CMDA / BDA / RERA)',
        'Legal clearance note issued prior to institutional submission',
      ],
    },
    {
      id: 1,
      title: 'Bespoke FOIR & Balance Sheet Normalization',
      badge: 'Optimized Eligibility',
      tagline: 'Unlocking True Borrowing Capacity',
      description:
        'Self-employed promoters, business owners, and non-salaried professionals benefit from customized financial statement restructuring, depreciation add-backs, and cash-flow normalization to unlock maximum borrowing potential.',
      metrics: 'Up to 75% FOIR Realization',
      icon: <BarChart3 className="w-6 h-6 text-teal-400" />,
      features: [
        'Proprietary Cash-Flow & EBITDA add-back appraisal',
        'GST turnover vs. banking credits reconciliation',
        'Multi-entity cross-collateralization structuring',
        'Tax returns normalization for highest sanctioned quantum',
      ],
    },
    {
      id: 2,
      title: 'Direct Senior Credit Head Syndication',
      badge: 'Zero Middlemen',
      tagline: 'Bypassing Junior Sales Delays',
      description:
        'We route dossiers directly to senior zonal credit committees, risk heads, and underwriting chiefs across 40+ partner banks, bypassing multi-tiered branch queues for expedited 24–48h initial sanctions.',
      metrics: 'Direct Zonal Sanctions',
      icon: <Building2 className="w-6 h-6 text-teal-400" />,
      features: [
        'Direct interface with Zonal Credit Committee Members',
        'Pre-underwriting deviation approvals secured in advance',
        'Transparent multi-bank term sheet comparison',
        'Zero mark-up on regulated lender interest spreads',
      ],
    },
    {
      id: 3,
      title: 'Sovereign Bureau & Data Confidentiality',
      badge: 'Zero Multi-Pinging',
      tagline: 'Protecting Your CIBIL Score',
      description:
        'Traditional brokers blast documents to dozens of banks simultaneously, tanking CIBIL scores. Prime Associates executes targeted, single-dossier filings with strict institutional privacy and non-disclosure protocols.',
      metrics: 'Zero Unsolicited Pings',
      icon: <ShieldCheck className="w-6 h-6 text-teal-400" />,
      features: [
        'No multi-bureau blast inquiries',
        'Strict institutional Non-Disclosure Agreement (NDA) guarantee',
        'Encrypted document vaulting with zero external sharing',
        'RBI Fair Practice Code alignment in every interaction',
      ],
    },
  ];

  // Interactive Loan Feasibility Blueprints
  const loanArchetypes = {
    home: {
      title: 'Prime Home Loans & Construction Finance',
      rate: 'Starting at 7.25% p.a.*',
      tenure: 'Up to 30 Years',
      quantum: '₹25 Lakh to ₹25+ Crore',
      turnaround: '4 to 7 Business Days',
      eligibility: 'Salaried Professionals, Doctors, CA, Tech Leads & High-Net-Worth Individuals',
      keyHighlights: [
        'Full PMAY & Government interest subsidy guidance where applicable',
        'Plot purchase + construction composite debt syndication',
        'Balance transfer with instant top-up up to 100% of existing outstanding',
        'Minimal processing fee with zero hidden prepayment penalty',
      ],
      idealFor: 'Purchasing luxury villas, gated apartments, independent homes, or land construction',
    },
    lap: {
      title: 'Loan Against Property (Mortgage LAP)',
      rate: 'Starting at 8.50% p.a.*',
      tenure: 'Up to 15–20 Years',
      quantum: '₹50 Lakh to ₹50+ Crore',
      turnaround: '5 to 9 Business Days',
      eligibility: 'MSME Promoters, Manufacturers, Business Owners & Commercial Landlords',
      keyHighlights: [
        'High LTV up to 75% on fair market valuation of residential & commercial collateral',
        'Flexible overdraft (OD / Drop-line OD) options for working capital requirements',
        'Acceptance of self-occupied, rented, or multi-tenant commercial properties',
        'Interest-only moratorium structures for expansion phases',
      ],
      idealFor: 'Business debt consolidation, factory expansion, working capital, or asset acquisition',
    },
    lrd: {
      title: 'Lease Rental Discounting (LRD)',
      rate: 'Starting at 8.90% p.a.*',
      tenure: 'Tied to Lease Horizon (Up to 15 Years)',
      quantum: '₹2 Crore to ₹100+ Crore',
      turnaround: '7 to 12 Business Days',
      eligibility: 'Owners of Commercial Offices, Retail Showrooms, IT Parks & Warehouses',
      keyHighlights: [
        'Direct discounting of future rental receivables from institutional corporate tenants',
        'Escrow-backed tripartite structure ensuring seamless monthly debt service',
        'Unlocks up to 80% to 85% of net present value (NPV) of future cash flows',
        'Low documentation friction for Grade-A corporate and MNC tenants',
      ],
      idealFor: 'Commercial asset monetization, re-investment liquidity, and portfolio refinancing',
    },
    construction: {
      title: 'Builder & Institutional Project Finance',
      rate: 'Starting at 9.25% p.a.*',
      tenure: 'Milestone-Linked (3 to 7 Years)',
      quantum: '₹5 Crore to ₹150+ Crore',
      turnaround: '10 to 18 Business Days',
      eligibility: 'RERA-Registered Developers, Commercial Real Estate Builders & Land Aggregators',
      keyHighlights: [
        'Structured construction drawdowns synchronized with civil construction milestones',
        'Mezzanine & senior debt syndication via leading AAA-rated Housing Finance Companies',
        'End-to-end customer retail home loan APF (Approved Project Financial) tie-ups',
        'RERA escrow compliance & legal documentation oversight',
      ],
      idealFor: 'Residential township developments, commercial towers, plotted layouts, and mixed-use assets',
    },
  };

  // Leadership Team Profiles
  const leadership = [
    {
      name: 'Vikramaditya Rao',
      role: 'Managing Principal & Head of Structured Debt',
      experience: '18+ Years Banking Practice',
      credentials: 'ex-HDFC Capital & Standard Chartered Wholesale Banking',
      bio: 'Architected structured property financing arrangements and multi-crore syndications for institutional developers, family offices, and NRI investors across South India.',
      tag: 'Mortgage Syndication',
      image: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=600&q=80',
      badge: 'Principal Member',
    },
    {
      name: 'Adv. Sharada Sundaram',
      role: 'Chief Legal Officer – Title Due Diligence',
      experience: '22+ Years High Court Practice',
      credentials: 'Specialist in Karnataka & Tamil Nadu Land Reforms, RERA Compliance',
      bio: 'Directs the 30-year mother deed audit, Khata/Patta mutation verification, and encumbrance validation division to ensure 100% dispute-free bank disbursements.',
      tag: 'Property Law & Clear Title',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
      badge: 'Senior Counsel',
    },
    {
      name: 'K. Chandrashekar, CA',
      role: 'VP – Promoter Credit Assessment & FOIR Modeling',
      experience: '15+ Years Corporate Finance',
      credentials: 'Fellow Chartered Accountant (FCA), Former Bank Zonal Credit Committee Member',
      bio: 'Authority in financial statement restructuring, corporate liquidity normalization, and non-salaried promoter credit evaluation for Tier-1 bank credit committees.',
      tag: 'Balance Sheet Structuring',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      badge: 'Credit Underwriter',
    },
    {
      name: 'Ananya Deshmukh',
      role: 'Director – Lease Rental Discounting (LRD) & LAP',
      experience: '13+ Years Banking Relations',
      credentials: 'Master of Finance, ex-ICICI Wholesale Banking & Commercial Mortgages',
      bio: 'Manages high-ticket commercial asset refinancing, escrow mechanism design, and tripartite lease structures for commercial retail complexes and warehousing portfolios.',
      tag: 'LRD & Commercial LAP',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
      badge: 'Commercial Specialist',
    },
  ];

  // Institutional Milestones
  const milestones = [
    {
      year: '2011',
      title: 'Practice Inception',
      desc: 'Founded in Tirupur, Tamil Nadu as an independent real estate title audit and private mortgage advisory desk with zero broker bias.',
      volume: '₹25 Cr Facilitated',
      focus: 'Forensic Mother Deed Audits',
    },
    {
      year: '2015',
      title: 'Commercial LAP & LRD Desk',
      desc: 'Formed dedicated institutional syndication pipelines for commercial asset discounting and high-ticket business mortgages exceeding ₹100 Cr.',
      volume: '₹180 Cr Facilitated',
      focus: 'Institutional LRD Pipelines',
    },
    {
      year: '2019',
      title: 'Multi-Metro Expansion',
      desc: 'Expanded client advisory coverage across Coimbatore, Tirupur, Bengaluru, and Chennai across 30+ regulated lending partners.',
      volume: '₹550 Cr Facilitated',
      focus: '40+ Lending Desks Integrated',
    },
    {
      year: '2023',
      title: 'Institutional Desk Integration',
      desc: 'Established priority direct underwriting pipelines across top public sector banks, private banking majors, and AAA housing finance corporations.',
      volume: '₹950 Cr Facilitated',
      focus: 'Direct Zonal Sanction Desks',
    },
    {
      year: '2026',
      title: '₹1,200+ Cr Advisory Milestone',
      desc: 'Recognized as South India’s trusted property loan practice with state-of-the-art algorithmic FOIR modeling and zero-inquiry bureau safety.',
      volume: '₹1,200+ Cr Cumulative',
      focus: 'Fiduciary-Grade Leadership',
    },
  ];

  return (
    <div className="bg-[#f8f8f4] min-h-screen text-brand-navy">
      {/* ────────────────────────────────────────────────────────────
          1. 3D HERO SECTION — THE ARCHITECTURE OF CAPITAL (Executive Professional Navy Theme)
          ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0B1E2E] via-[#0D2437] to-[#081521] text-white pt-10 sm:pt-14 lg:pt-16 pb-12 sm:pb-16 lg:pb-20 border-b border-brand-teal/20">
        
        {/* Subtle Ambient Background Grids & Soft Atmospheric Aura */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(20,184,166,0.12),transparent)] pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-sky-500/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Subtle Architectural Blueprint grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(56,189,248,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(56,189,248,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="w-[92%] sm:w-[88%] lg:w-[85%] max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* ── LEFT COLUMN: Authority Narrative & Interactive Statistics ── */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-7">
              
              {/* Institutional Header Tag with Live Status Beacon */}
              <div
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateY(0)' : 'translateY(-12px)',
                  transition: 'opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1) 0.1s, transform 0.75s cubic-bezier(0.16, 1, 0.3, 1) 0.1s',
                }}
                className="flex flex-wrap items-center gap-3"
              >
                <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-teal-500/15 border border-teal-400/30 text-teal-300 shadow-sm backdrop-blur-md">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-400"></span>
                  </span>
                  <span className="text-xs font-bold uppercase tracking-[0.14em]">
                    Institutional Property Advisory Desk
                  </span>
                </div>
                <div className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-300 font-medium bg-white/10 px-3 py-1 rounded-full border border-white/15 backdrop-blur-sm">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                  <span>Est. 2011 • Regulated Bank Syndication</span>
                </div>
              </div>

              {/* Display Headline with High-End Authority Gradient */}
              <div
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateY(0)' : 'translateY(16px)',
                  transition: 'opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.2s, transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
                }}
                className="space-y-3"
              >
                <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-[50px] font-extrabold text-white tracking-tight leading-[1.18] sm:leading-[1.14] font-heading">
                  The Architecture of{' '}
                  <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-teal-200 to-sky-300">
                    Institutional Capital
                  </span>{' '}
                  &amp; Collateral Precision.
                </h1>

                <p className="text-xs sm:text-sm md:text-base text-slate-300 font-normal leading-relaxed max-w-2xl pt-1">
                  <strong className="text-white font-bold">{businessName}</strong> was founded to eliminate the conflict of interest in property financing. Combining forensic 30-year mother deed title scrutiny, algorithmic balance sheet optimization, and direct zonal credit access, we structure fiduciary-grade debt solutions for homeowners, promoters, and real estate developers.
                </p>
              </div>

              {/* 4 Key Interactive Metrics Grid */}
              <div
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateY(0)' : 'translateY(16px)',
                  transition: 'opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.35s, transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.35s',
                }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5 pt-1"
              >
                {kpis.map((kpi, idx) => (
                  <div
                    key={idx}
                    className="relative group p-3 sm:p-4 rounded-2xl bg-white/[0.07] backdrop-blur-md border border-white/15 hover:border-teal-400/50 hover:bg-white/[0.12] shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-default"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-teal-300 bg-teal-500/20 px-2 py-0.5 rounded border border-teal-400/30">
                        {kpi.badge}
                      </span>
                    </div>
                    <div className="text-xl xs:text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-heading">
                      {kpi.value}
                    </div>
                    <div className="text-xs font-bold text-slate-200 mt-1">
                      {kpi.label}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 leading-snug line-clamp-1">
                      {kpi.subtext}
                    </div>
                  </div>
                ))}
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
                  className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3.5 rounded-corporate bg-brand-teal hover:bg-brand-teal-hover text-white font-bold text-xs sm:text-sm shadow-lg shadow-teal-900/40 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group text-center"
                >
                  <Sparkles className="w-4 h-4 text-teal-100" />
                  <span>Initiate Confidential Advisory</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>

                <a
                  href="#diligence-matrix"
                  className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3.5 rounded-corporate bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-xs sm:text-sm shadow-sm backdrop-blur-sm transition-all duration-200 text-center"
                >
                  <FileSearch className="w-4 h-4 text-teal-300" />
                  <span>Explore Diligence Protocol</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </a>

                <a
                  href={`tel:${businessPhone.split(',')[0].replace(/\s+/g, '')}`}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-corporate bg-teal-500/15 hover:bg-teal-500/25 text-teal-200 border border-teal-400/30 text-xs font-semibold backdrop-blur-sm transition-colors shadow-sm text-center"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-teal-300" />
                  <span>Direct Hotline: {businessPhone.split(',')[0]}</span>
                </a>
              </div>

              {/* Institutional Safety Pillars Strip */}
              <div className="pt-2 border-t border-white/15 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-300 font-medium">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-400" />
                  <span>RBI Fair Practice Code Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-teal-400" />
                  <span>Zero Unauthorized Bureau Enquiries</span>
                </div>
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-teal-400" />
                  <span>Zero Cash Collection Policy</span>
                </div>
              </div>

            </div>

            {/* ── RIGHT COLUMN: Interactive Three.js 3D Canvas Showcase ── */}
            <div
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.3s, transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.3s',
              }}
              className="lg:col-span-5 relative"
            >
              <div className="relative rounded-3xl overflow-hidden border border-white/20 bg-slate-900/60 shadow-2xl backdrop-blur-sm ring-1 ring-white/10">
                {/* 3D Canvas Area */}
                <div className="w-full h-[340px] xs:h-[400px] sm:h-[480px] lg:h-[600px] relative">
                  <AboutHero3D onModeChange={(mode) => setHeroSceneMode(mode)} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────
          2. INTERACTIVE LOAN FEASIBILITY & ADVISORY BLUEPRINT
          ──────────────────────────────────────────────────────────── */}
      <section className="pt-12 sm:pt-16 pb-0 bg-[#f8f8f4]">
        <div className="w-[92%] sm:w-[88%] lg:w-[85%] max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-6">
            <div className="max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-brand-teal-light text-brand-teal text-xs font-bold uppercase tracking-wider">
                <Sliders className="w-3.5 h-3.5" />
                <span>Product Feasibility Lab</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-navy tracking-tight font-heading">
                Institutional Borrowing Blueprints
              </h2>
              <p className="text-brand-slate text-sm sm:text-base leading-relaxed">
                Select your asset category to inspect interest benchmarks, structuring tenure, and underwriting prerequisites.
              </p>
            </div>

            {/* Loan Selector Tabs */}
            <div className="flex flex-wrap gap-2 p-1.5 bg-white rounded-xl border border-brand-border/80 shadow-2xs">
              {(['home', 'lap', 'lrd', 'construction'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedLoanType(type)}
                  className={`flex-1 sm:flex-initial text-center px-2.5 sm:px-4 py-2 rounded-lg text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                    selectedLoanType === type
                      ? 'bg-brand-teal text-white shadow-sm scale-[1.02]'
                      : 'text-brand-slate hover:text-brand-navy hover:bg-slate-50'
                  }`}
                >
                  {type === 'home' && 'Home Loans'}
                  {type === 'lap' && 'Mortgage LAP'}
                  {type === 'lrd' && 'Commercial LRD'}
                  {type === 'construction' && 'Project Finance'}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Card for Selected Blueprint */}
          <div
            key={selectedLoanType}
            className="animate-tab-fade bg-white p-4 sm:p-7 lg:p-10 rounded-2xl sm:rounded-3xl border border-brand-border/80 shadow-card"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-7 space-y-5">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-extrabold text-brand-teal uppercase tracking-widest bg-brand-teal-light px-3 py-1 rounded-full border border-brand-teal/20">
                    Selected Product Blueprint
                  </span>
                  <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Verified Lending Protocol
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-brand-navy font-heading">
                  {loanArchetypes[selectedLoanType].title}
                </h3>

                <p className="text-brand-slate text-sm sm:text-base leading-relaxed">
                  <strong>Target Segment:</strong> {loanArchetypes[selectedLoanType].eligibility}
                </p>

                {/* Key Metrics Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-1">
                  <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-brand-border/70 shadow-2xs">
                    <div className="text-[11px] font-semibold text-brand-slate uppercase">Interest Benchmark</div>
                    <div className="text-lg font-bold text-brand-teal mt-0.5">
                      {loanArchetypes[selectedLoanType].rate}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-brand-border/70 shadow-2xs">
                    <div className="text-[11px] font-semibold text-brand-slate uppercase">Facility Tenure</div>
                    <div className="text-lg font-bold text-brand-navy mt-0.5 font-heading">
                      {loanArchetypes[selectedLoanType].tenure}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-brand-border/70 shadow-2xs col-span-2 sm:col-span-1">
                    <div className="text-[11px] font-semibold text-brand-slate uppercase">Ticket Range</div>
                    <div className="text-lg font-bold text-brand-navy mt-0.5 font-heading">
                      {loanArchetypes[selectedLoanType].quantum}
                    </div>
                  </div>
                </div>

                {/* Checklist of highlights */}
                <div className="space-y-2.5 pt-2">
                  <h4 className="text-xs font-bold text-brand-navy uppercase tracking-wider font-heading">
                    Institutional Structuring Advantages:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {loanArchetypes[selectedLoanType].keyHighlights.map((hl, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-brand-slate font-medium">
                        <CheckCircle2 className="w-4 h-4 text-brand-teal shrink-0 mt-0.5" />
                        <span>{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                  <Link
                    to="/enquire"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-corporate bg-brand-teal hover:bg-brand-teal-hover text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-[1.02] text-center"
                  >
                    <span>Request Eligibility Evaluation</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <span className="text-xs text-brand-slate">
                    *Terms subject to lender policy &amp; title appraisal.
                  </span>
                </div>

              </div>

              {/* Right Decorative Showcase Card */}
              <div className="lg:col-span-5">
                <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-brand-border/80 shadow-card bg-gradient-to-br from-[#12263a] to-[#183247] text-white p-5 sm:p-7 sm:p-8 space-y-5 sm:space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-brand-teal/20 border border-brand-teal/40 flex items-center justify-center text-teal-300">
                      <Landmark className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-teal-300 bg-white/10 px-2.5 py-1 rounded-full">
                      Fiduciary Standard
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-lg font-bold text-white font-heading">Why Not Traditional DSAs?</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Most channel partners submit applications without checking 30-year mother deed continuity. If a legal query arises 3 weeks later, your file gets locked in bank dispute committees.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-teal-300">Prime Associates Guarantee</span>
                      <span className="text-emerald-400 font-bold">100% Pre-Audited</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      We pre-clear mother deeds, patta/khata chains, and municipal permits through High Court advocates prior to file intake.
                    </p>
                  </div>

                  <Link
                    to="/how-it-works"
                    className="block text-center py-2.5 px-4 rounded-corporate bg-white/10 hover:bg-white/15 text-xs font-bold text-white transition-colors"
                  >
                    View Our 5-Step Underwriting Process →
                  </Link>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────
          3. OUR ORIGIN & VALUE ARCHITECTURE (Interactive Tabs)
          ──────────────────────────────────────────────────────────── */}
      <section id="diligence-matrix" className="pt-12 sm:pt-16 pb-0 bg-[#f8f8f4]">
        <div className="w-[92%] sm:w-[88%] lg:w-[85%] max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Narrative Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-brand-teal-light text-brand-teal text-xs font-bold uppercase tracking-wider">
                <Landmark className="w-3.5 h-3.5" />
                <span>Our Institutional Mandate</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-navy tracking-tight font-heading leading-tight">
                Eliminating the Asymmetry in Mortgage Lending.
              </h2>

              <p className="text-brand-slate text-sm sm:text-base leading-relaxed">
                In India's fragmented retail and commercial mortgage sector, loan applicants often face conflicting interest quotes, aggressive DSAs who broadcast credit files across multiple bureaus, and unexpected technical title rejections weeks into underwriting.
              </p>

              <p className="text-brand-slate text-sm sm:text-base leading-relaxed">
                <strong>{businessName}</strong> was established with a singular objective: to operate as a high-fidelity client advocate. We evaluate your borrowing capacity using the exact credit risk and FOIR algorithms deployed by Tier-1 institutions, verifying mother deeds and cash flow sustainability prior to formal lender introduction.
              </p>

              {/* Interactive Vision / Mission / Governance / Methodology Tabs */}
              <div className="pt-2">
                <div className="flex overflow-x-auto scrollbar-none border-b border-brand-border/80 gap-3 sm:gap-6">
                  {(['mission', 'vision', 'governance', 'methodology'] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`whitespace-nowrap pb-2.5 sm:pb-3 text-xs sm:text-sm font-semibold capitalize transition-all relative cursor-pointer ${
                        activeTab === tab
                          ? 'text-brand-teal border-b-2 border-brand-teal -mb-[2px] font-bold'
                          : 'text-brand-slate hover:text-brand-navy'
                      }`}
                    >
                      {tab === 'governance'
                        ? 'Regulatory Governance'
                        : tab === 'methodology'
                        ? 'Advisory Methodology'
                        : `Our ${tab}`}
                    </button>
                  ))}
                </div>

                <div
                  key={activeTab}
                  className="animate-tab-fade pt-4 text-xs sm:text-sm text-brand-slate leading-relaxed bg-white p-4 sm:p-6 rounded-2xl border border-brand-border/80 shadow-2xs mt-3"
                >
                  {activeTab === 'mission' && (
                    <div className="space-y-2">
                      <p className="font-bold text-brand-navy text-base font-heading">
                        Empower property owners to secure lowest benchmark debt without predatory terms or CIBIL degradation.
                      </p>
                      <p>
                        We rigorously test each dossier against 40+ lending policy guidelines to identify the single most competitive institutional home for your mortgage.
                      </p>
                    </div>
                  )}

                  {activeTab === 'vision' && (
                    <div className="space-y-2">
                      <p className="font-bold text-brand-navy text-base font-heading">
                        To be the gold-standard independent property finance advisory across India's metropolitan wealth corridors.
                      </p>
                      <p>
                        Setting the benchmark for transparency, zero-hidden commission structures, and forensic pre-sanction diligence.
                      </p>
                    </div>
                  )}

                  {activeTab === 'governance' && (
                    <div className="space-y-2">
                      <p className="font-bold text-brand-navy text-base font-heading">
                        Uncompromising Compliance &amp; Zero False Guarantees.
                      </p>
                      <p>
                        Underwriting and sanction authority resides exclusively with regulated RBI-licensed Banks and NBFCs. We maintain zero unauthorized multi-bureau pings and collect zero cash advances.
                      </p>
                    </div>
                  )}

                  {activeTab === 'methodology' && (
                    <div className="space-y-2">
                      <p className="font-bold text-brand-navy text-base font-heading">
                        Pre-Underwriting Due Diligence Lab.
                      </p>
                      <p>
                        Every property loan dossier passes through legal scrutiny (Form 15/16 EC, parent documents), technical plan appraisal, and FOIR cash flow adjustments prior to institutional committee submission.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Key Bullet Points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2 text-sm font-medium text-brand-navy">
                  <CheckCircle2 className="w-4 h-4 text-brand-teal shrink-0" />
                  <span>Zero Unauthorized CIBIL Queries</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-brand-navy">
                  <CheckCircle2 className="w-4 h-4 text-brand-teal shrink-0" />
                  <span>Direct Credit Zonal Sanctions</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-brand-navy">
                  <CheckCircle2 className="w-4 h-4 text-brand-teal shrink-0" />
                  <span>30-Year Title Search Verification</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-brand-navy">
                  <CheckCircle2 className="w-4 h-4 text-brand-teal shrink-0" />
                  <span>40+ Regulated Partner Desks</span>
                </div>
              </div>
            </div>

            {/* Right Architectural Showcase Card */}
            <div className="lg:col-span-5">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-tr from-brand-teal/15 via-transparent to-sky-500/10 rounded-3xl blur-xl" />

                <div className="relative rounded-3xl overflow-hidden border border-brand-border/80 shadow-card bg-white">
                  <img
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80"
                    alt="High value property portfolio advisory"
                    className="w-full h-[260px] sm:h-[340px] lg:h-[420px] object-cover transition-transform duration-700 hover:scale-105"
                  />

                  {/* Floating Metric Card Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-brand-border/80 shadow-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <span className="text-xs font-bold text-brand-navy">Institutional Quality Standard</span>
                      </div>
                      <span className="text-xs font-bold text-brand-teal">Home Loans 7.25%* • LAP 8.50%*</span>
                    </div>
                    <p className="text-xs text-brand-slate leading-normal">
                      Every application is structured according to internal risk metrics accepted by State Bank of India, HDFC Bank, ICICI Bank, Axis, and Kotak Mahindra.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────
          4. OUR CORE ADVISORY PILLARS (Interactive Expansion Cards)
          ──────────────────────────────────────────────────────────── */}
      <section className="pt-12 sm:pt-16 pb-0 bg-[#f8f8f4]">
        <div className="w-[92%] sm:w-[88%] lg:w-[85%] max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 space-y-3">
            <span className="text-xs font-bold uppercase tracking-[0.08em] text-brand-teal block">
              Methodological Rigor
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-navy tracking-tight font-heading">
              Four Pillars of Institutional Integrity
            </h2>
            <p className="text-brand-slate text-sm sm:text-base leading-relaxed">
              Why leading high-net-worth property buyers and commercial real estate developers entrust their financing dossiers to our desk.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {advisoryPillars.map((pillar) => (
              <div
                key={pillar.id}
                onClick={() => setActivePillar(pillar.id)}
                className={`card-hover bg-white p-5 sm:p-7 rounded-2xl sm:rounded-3xl border transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                  activePillar === pillar.id
                    ? 'border-brand-teal shadow-card ring-2 ring-brand-teal/20 scale-[1.01]'
                    : 'border-brand-border/80 hover:border-brand-teal/40 shadow-2xs'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-brand-teal-light flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                      {pillar.icon}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-teal bg-brand-teal-light/80 px-2 py-0.5 rounded">
                      {pillar.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-brand-navy leading-snug font-heading">
                    {pillar.title}
                  </h3>

                  <p className="text-xs font-semibold text-brand-teal">
                    {pillar.tagline}
                  </p>

                  <p className="text-xs text-brand-slate leading-relaxed">
                    {pillar.description}
                  </p>

                  {/* Feature checklist */}
                  <div className="space-y-1.5 pt-2 border-t border-brand-border/50">
                    {pillar.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-1.5 text-[11px] text-brand-slate">
                        <Check className="w-3.5 h-3.5 text-brand-teal shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-brand-border/60 flex items-center justify-between text-xs font-semibold text-brand-navy">
                  <span className="text-brand-slate font-medium">Core Metric:</span>
                  <span className="text-brand-teal font-bold">{pillar.metrics}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────
          5. COMPARATIVE MATRIX: TRADITIONAL BROKER VS. PRIME ASSOCIATES
          ──────────────────────────────────────────────────────────── */}
      <section className="pt-12 sm:pt-16 pb-0 bg-[#f8f8f4]">
        <div className="w-[92%] sm:w-[88%] lg:w-[85%] max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 space-y-3">
            <span className="text-xs font-bold uppercase tracking-[0.08em] text-brand-teal block">
              Market Differentiation
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-navy tracking-tight font-heading">
              The Prime Associates Institutional Advantage
            </h2>
            <p className="text-brand-slate text-sm sm:text-base leading-relaxed">
              Compare our structured, client-first advisory model against traditional unorganized mortgage brokers.
            </p>
          </div>

          {/* Desktop & Tablet Table (sm+) */}
          <div className="hidden sm:block max-w-4xl mx-auto overflow-hidden rounded-3xl border border-brand-border/80 shadow-card bg-white">
            <div className="grid grid-cols-12 bg-slate-50/80 border-b border-brand-border/80 p-4 sm:p-5 text-xs font-bold uppercase tracking-wider text-brand-navy">
              <div className="col-span-5 sm:col-span-4">Evaluation Dimension</div>
              <div className="col-span-3 sm:col-span-4 text-center text-slate-500">Traditional Unorganized Broker</div>
              <div className="col-span-4 sm:col-span-4 text-center text-brand-teal">Prime Associates Desk</div>
            </div>

            <div className="divide-y divide-brand-border/70 text-sm">
              {[
                {
                  metric: 'Credit Bureau Enquiries',
                  broker: 'Multi-bank blast queries (Damages CIBIL)',
                  anchor: 'Pre-vetted single dossier submission',
                },
                {
                  metric: 'Legal Title Diligence',
                  broker: 'Zero audit until lender rejection',
                  anchor: '30-Year mother deed pre-scrutiny',
                },
                {
                  metric: 'Lender Matching',
                  broker: 'Biased to highest commission kickback',
                  anchor: '100% Client cost & tenure optimization',
                },
                {
                  metric: 'Direct Credit Access',
                  broker: 'Branch-level sales representatives',
                  anchor: 'Zonal & Senior Credit Underwriting Heads',
                },
                {
                  metric: 'Fee Transparency',
                  broker: 'Hidden markups and cash demands',
                  anchor: 'Transparent engagement contract',
                },
                {
                  metric: 'Complex Income Structuring',
                  broker: 'Strict vanilla salary slips only',
                  anchor: 'Balance sheet normalization for promoters',
                },
              ].map((row, i) => (
                <div key={i} className="grid grid-cols-12 p-4 sm:p-5 items-center hover:bg-slate-50/60 transition-colors">
                  <div className="col-span-5 sm:col-span-4 font-semibold text-brand-navy text-xs sm:text-sm">
                    {row.metric}
                  </div>
                  <div className="col-span-3 sm:col-span-4 text-center text-xs sm:text-sm text-slate-500">
                    <span className="hidden sm:inline">{row.broker}</span>
                    <span className="sm:hidden text-red-500">✕</span>
                  </div>
                  <div className="col-span-4 sm:col-span-4 text-center text-xs sm:text-sm font-semibold text-brand-teal flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-teal shrink-0" />
                    <span>{row.anchor}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Card-Based Comparison (< 640px) */}
          <div className="sm:hidden space-y-3 mt-4">
            {[
              {
                metric: 'Credit Bureau Enquiries',
                broker: 'Multi-bank blast queries (Damages CIBIL)',
                anchor: 'Pre-vetted single dossier submission',
              },
              {
                metric: 'Legal Title Diligence',
                broker: 'Zero audit until lender rejection',
                anchor: '30-Year mother deed pre-scrutiny',
              },
              {
                metric: 'Lender Matching',
                broker: 'Biased to highest commission kickback',
                anchor: '100% Client cost & tenure optimization',
              },
              {
                metric: 'Direct Credit Access',
                broker: 'Branch-level sales representatives',
                anchor: 'Zonal & Senior Credit Underwriting Heads',
              },
              {
                metric: 'Fee Transparency',
                broker: 'Hidden markups and cash demands',
                anchor: 'Transparent engagement contract',
              },
              {
                metric: 'Complex Income Structuring',
                broker: 'Strict vanilla salary slips only',
                anchor: 'Balance sheet normalization for promoters',
              },
            ].map((row, i) => (
              <div key={i} className="bg-white p-4 rounded-2xl border border-brand-border/80 shadow-2xs space-y-2.5">
                <div className="text-xs font-bold uppercase tracking-wider text-brand-navy border-b border-gray-100 pb-2">
                  {row.metric}
                </div>
                <div className="flex items-start gap-2 text-xs text-slate-600 bg-red-50/70 p-2.5 rounded-xl border border-red-100/70">
                  <span className="text-red-500 font-bold shrink-0 mt-0.5">✕</span>
                  <div>
                    <span className="font-semibold text-slate-700 block text-[10.5px] uppercase tracking-wide">Traditional Broker:</span>
                    <span className="text-slate-600">{row.broker}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-xs text-brand-teal bg-teal-50/70 p-2.5 rounded-xl border border-teal-100/80">
                  <CheckCircle2 className="w-4 h-4 text-brand-teal shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-teal-900 block text-[10.5px] uppercase tracking-wide">Prime Associates Desk:</span>
                    <span className="font-semibold">{row.anchor}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────
          6. LEADERSHIP & ADVISORY COUNCIL (Profiles)
          ──────────────────────────────────────────────────────────── */}
      <section className="pt-12 sm:pt-16 pb-0 bg-[#f8f8f4]">
        <div className="w-[92%] sm:w-[88%] lg:w-[85%] max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-6">
            <div className="max-w-2xl space-y-3">
              <span className="text-xs font-bold uppercase tracking-[0.08em] text-brand-teal block">
                Executive Leadership
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-navy tracking-tight font-heading">
                Senior Banking &amp; Legal Practitioners
              </h2>
              <p className="text-brand-slate text-sm sm:text-base leading-relaxed">
                Our practice is directed by seasoned mortgage bankers, High Court advocates, and chartered accountants with decades of combined capital markets leadership.
              </p>
            </div>

            <Link
              to="/contact"
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-teal hover:text-brand-teal-hover transition-colors shrink-0 group"
            >
              <span>Connect with our leadership team</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {leadership.map((member, idx) => (
              <div
                key={idx}
                className="card-hover bg-white rounded-3xl overflow-hidden border border-brand-border/80 group flex flex-col justify-between shadow-2xs hover:shadow-card"
              >
                <div>
                  <div className="aspect-[4/3] overflow-hidden bg-slate-100 relative">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-brand-navy border border-brand-border/80">
                      {member.experience}
                    </div>
                    <div className="absolute bottom-3 left-3 bg-brand-navy/90 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-teal-300">
                      {member.badge}
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold bg-brand-teal-light text-brand-teal">
                      {member.tag}
                    </div>

                    <h3 className="text-base font-bold text-brand-navy group-hover:text-brand-teal transition-colors font-heading">
                      {member.name}
                    </h3>

                    <p className="text-xs font-semibold text-brand-slate">
                      {member.role}
                    </p>

                    <p className="text-[11px] text-brand-slate/80 font-medium border-t border-brand-border/60 pt-2">
                      {member.credentials}
                    </p>

                    <p className="text-xs text-brand-slate leading-relaxed pt-1">
                      {member.bio}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Link
                    to="/enquire"
                    className="w-full py-2.5 px-3 rounded-corporate border border-brand-border/80 text-xs font-semibold text-brand-navy hover:bg-brand-teal-light hover:text-brand-teal hover:border-brand-teal/40 transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Request Direct Consultation</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────
          7. PRACTICE TIMELINE & MILESTONES (Interactive Journey)
          ──────────────────────────────────────────────────────────── */}
      <section className="pt-12 sm:pt-16 pb-0 bg-[#f8f8f4]">
        <div className="w-[92%] sm:w-[88%] lg:w-[85%] max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 space-y-3">
            <span className="text-xs font-bold uppercase tracking-[0.08em] text-brand-teal block">
              15-Year Evolution
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-navy tracking-tight font-heading">
              Our Journey of Capital Facilitation
            </h2>
            <p className="text-brand-slate text-sm sm:text-base leading-relaxed">
              From a boutique land title scrutiny desk to one of South India's premier property finance syndication practices.
            </p>
          </div>

          {/* Interactive Milestone Selector Grid */}
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 relative">
            {milestones.map((ms, idx) => (
              <div
                key={idx}
                onClick={() => setActiveMilestoneIndex(idx)}
                className={`p-4 sm:p-6 rounded-2xl sm:rounded-3xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                  activeMilestoneIndex === idx
                    ? 'bg-gradient-to-br from-[#12263a] to-[#183247] text-white border-teal-500 shadow-xl scale-[1.03]'
                    : 'bg-white hover:bg-white border-brand-border/80 hover:border-brand-teal/40 shadow-2xs hover:shadow-card'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-2xl font-extrabold font-heading ${
                        activeMilestoneIndex === idx ? 'text-teal-300' : 'text-brand-teal'
                      }`}
                    >
                      {ms.year}
                    </span>
                    <span
                      className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                        activeMilestoneIndex === idx
                          ? 'bg-teal-500/20 text-teal-200 border border-teal-400/30'
                          : 'bg-brand-teal-light text-brand-teal'
                      }`}
                    >
                      {ms.volume}
                    </span>
                  </div>

                  <h4
                    className={`text-sm font-bold mt-3 mb-2 font-heading ${
                      activeMilestoneIndex === idx ? 'text-white' : 'text-brand-navy'
                    }`}
                  >
                    {ms.title}
                  </h4>

                  <p
                    className={`text-xs leading-relaxed ${
                      activeMilestoneIndex === idx ? 'text-slate-300' : 'text-brand-slate'
                    }`}
                  >
                    {ms.desc}
                  </p>
                </div>

                <div
                  className={`mt-4 pt-3 border-t text-[11px] font-semibold ${
                    activeMilestoneIndex === idx
                      ? 'border-white/10 text-teal-300'
                      : 'border-brand-border/60 text-brand-slate'
                  }`}
                >
                  Focus: {ms.focus}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────
          8. REGULATORY COMPLIANCE & LEGAL NOTICE
          ──────────────────────────────────────────────────────────── */}
      <section className="pt-12 sm:pt-16 pb-0 bg-[#f8f8f4]">
        <div className="w-[92%] sm:w-[88%] lg:w-[85%] max-w-7xl mx-auto">
          <div className="w-full bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-brand-border/80 shadow-card flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
            <div className="w-12 h-12 rounded-2xl bg-brand-teal-light flex items-center justify-center shrink-0 text-brand-teal">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-brand-navy uppercase tracking-wider font-heading">
                Regulatory Status &amp; Clear Disclosures
              </h4>
              <p className="text-xs text-brand-slate leading-relaxed">
                <strong>{businessName}</strong> is an independent property finance consultancy firm. We are not a bank, non-banking financial company (NBFC), or primary lender. All credit approvals, interest rates, loan terms, and disbursement timelines are strictly at the sole discretion of our partner regulated financial institutions, subject to customer credit profiles, title scrutiny, and technical property valuations.
              </p>
              <p className="text-xs text-brand-slate leading-relaxed">
                We operate under strict compliance with Reserve Bank of India (RBI) fair practice guidelines. We never collect cash payments or make fraudulent promises of guaranteed loan sanctions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────
          9. HIGH-IMPACT CONVERSION BANNER (Matching Home Page Rounded Card Style & Spacing)
          ──────────────────────────────────────────────────────────── */}
      <section className="py-12 sm:py-16 bg-[#f8f8f4]">
        <div className="w-[92%] sm:w-[88%] lg:w-[85%] max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-[#12263a] to-[#183247] text-white border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-teal/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="max-w-2xl space-y-4 text-center lg:text-left z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-teal/20 text-brand-teal-light text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Direct Underwriter Access</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight font-heading leading-tight">
                Ready to Secure Optimal Funding for Your Property?
              </h2>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                Connect directly with our senior loan advisory desk for a comprehensive borrowing capacity and title feasibility evaluation across 40+ partner institutions.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-gray-300">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-brand-teal" /> 100% Confidential
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-brand-teal" /> Lowest Bank ROI
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-brand-teal" /> Zero Upfront Sanction Fees
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3.5 w-full sm:w-auto z-10 shrink-0">
              <Link
                to="/enquire"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-teal hover:bg-brand-teal-hover text-white font-bold text-sm rounded-corporate shadow-md transition-all hover:scale-[1.02] text-center group"
              >
                <span>Book Confidential Advisory Call</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <a
                href={`tel:${businessPhone.split(',')[0].replace(/\s+/g, '')}`}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-corporate border border-white/15 transition-colors text-center"
              >
                <PhoneCall className="w-4 h-4 text-brand-teal" />
                <span>Direct Hotline: {businessPhone.split(',')[0]}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes tabFadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-tab-fade {
          animation: tabFadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .card-hover {
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.25s ease;
          will-change: transform, box-shadow;
        }
        .card-hover:hover {
          transform: translateY(-5px);
        }
      `}</style>
    </div>
  );
};
