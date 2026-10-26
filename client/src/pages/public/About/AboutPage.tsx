import React, { useState } from 'react';
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
} from 'lucide-react';
import { SiteContent } from '../../../types';

export const AboutPage: React.FC = () => {
  const context = useOutletContext<{ content?: SiteContent | null }>();
  const content = context?.content || null;
  const businessName = content?.businessName || 'Prime Associates — Loans & Constructions';
  const businessPhone = content?.businessPhone || '+91 96555 66613, +91 95144 66600';

  const [activeTab, setActiveTab] = useState<'mission' | 'vision' | 'governance'>('mission');

  // Key performance indicators & institutional proof
  const kpis = [
    { value: '₹1,200+ Cr', label: 'Facilitated Capital', subtext: 'Across Prime Property Assets' },
    { value: '40+', label: 'Partner Lending Desks', subtext: 'PSU, Private Banks & NBFCs' },
    { value: '98.4%', label: 'File Sanction Ratio', subtext: 'Through Rigorous Pre-Underwriting' },
    { value: '15+ Years', label: 'Advisory Leadership', subtext: 'Specialized Mortgage Practice' },
  ];

  // Core Pillars of Advisory
  const advisoryPillars = [
    {
      title: 'Forensic Title & Legal Due Diligence',
      badge: 'Pre-Submission Audit',
      description:
        'We conduct in-depth 30-year mother deed chain audits, encumbrance verification, and municipal zoning checks before submission to prevent underwriting rejections.',
      icon: (
        <svg className="w-6 h-6 text-brand-teal" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.728-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
        </svg>
      ),
      metrics: '30-Year Title Traceability',
    },
    {
      title: 'Bespoke FOIR & Cash-Flow Sculpting',
      badge: 'Optimized Eligibility',
      description:
        'Self-employed promoters, business owners, and non-salaried professionals benefit from customized balance sheet normalization to unlock maximum borrowing potential.',
      icon: (
        <svg className="w-6 h-6 text-brand-teal" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.375 2.25c.621 0 1.125.504 1.125 1.125v16.5c0 .621-.504 1.125-1.125 1.125h-2.25c-.621 0-1.125-.504-1.125-1.125V3.375c0-.621.504-1.125 1.125-1.125h2.25zM12 7.875c.621 0 1.125.504 1.125 1.125v10.875c0 .621-.504 1.125-1.125 1.125H9.75c-.621 0-1.125-.504-1.125-1.125V9c0-.621.504-1.125 1.125-1.125H12zM5.625 13.5c.621 0 1.125.504 1.125 1.125v5.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125v-5.25c0-.621.504-1.125 1.125-1.125h2.25z" />
        </svg>
      ),
      metrics: 'Up to 75% FOIR Realization',
    },
    {
      title: 'Direct Senior Credit Head Syndication',
      badge: 'Zero Middlemen',
      description:
        'We route dossiers directly to senior zonal credit committees and underwriting chiefs, bypassing multi-tiered branch queues for expedited 24–48h initial sanctions.',
      icon: (
        <svg className="w-6 h-6 text-brand-teal" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" d="M12 2.25a.75.75 0 01.75.75v1.168l7.854 3.142A1.5 1.5 0 0121.5 8.65v.6a.75.75 0 01-.75.75H3.25a.75.75 0 01-.75-.75v-.6c0-.62.38-1.18.966-1.39L11.25 4.168V3a.75.75 0 01.75-.75zM4.5 12a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v6a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75v-6zm5.25 0a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v6a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75v-6zm5.25 0a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v6a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75v-6zm-12.75 8.25a.75.75 0 000 1.5h19.5a.75.75 0 000-1.5H2.25z" clipRule="evenodd" />
        </svg>
      ),
      metrics: '24–48h Decision Cycles',
    },
    {
      title: 'Sovereign Bureau & Data Confidentiality',
      badge: 'Zero Multi-Pinging',
      description:
        'Traditional brokers blast documents to dozens of banks, tanking CIBIL scores. Prime Associate Loans executes targeted, pre-screened filings with strict institutional privacy.',
      icon: (
        <svg className="w-6 h-6 text-brand-teal" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" d="M15.75 1.5a6.75 6.75 0 00-6.651 7.906c-.067.39-.099.79-.099 1.194 0 .804.129 1.578.368 2.302l-7.79 7.791a2.25 2.25 0 00-.659 1.591v1.966a.75.75 0 00.75.75h2.25a.75.75 0 00.75-.75v-1.5h1.5a.75.75 0 00.75-.75v-1.5h1.5a.75.75 0 00.75-.75v-1.5h1.5a.75.75 0 00.75-.75l1.09-1.09a6.744 6.744 0 003.141.786 6.75 6.75 0 100-13.5zm3.75 5.25a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" clipRule="evenodd" />
        </svg>
      ),
      metrics: 'Zero Unsolicited Enquiries',
    },
  ];

  // Leadership Team Profiles (Ready for Real Content Substitution)
  const leadership = [
    {
      name: 'Vikramaditya Rao',
      role: 'Managing Principal & Head of Structured Debt',
      experience: '18+ Years Experience',
      credentials: 'ex-HDFC Capital & Standard Chartered Commercial Banking',
      bio: 'Pioneered structured property financing models for high-net-worth individuals and corporate land aggregators across South India.',
      tag: 'Mortgage Syndication',
      image: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Adv. Sharada Sundaram',
      role: 'Chief Legal Officer – Title Due Diligence',
      experience: '22+ Years High Court Practice',
      credentials: 'Specialist in Karnataka Land Reforms & RERA Compliance',
      bio: 'Oversees 30-year mother deed audit, Khata bifurcation analysis, and encumbrance clearing to assure pristine collateral legitimacy.',
      tag: 'Property Law & Clear Title',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'K. Chandrashekar, CA',
      role: 'VP – Promoter Credit Assessment & FOIR Modeling',
      experience: '15+ Years Corporate Finance',
      credentials: 'Fellow Chartered Accountant (FCA), Former Zonal Credit Committee Member',
      bio: 'Expert in balance sheet normalization, enterprise cash flow adjustments, and non-conventional liquidity appraisal for HNW promoters.',
      tag: 'Balance Sheet Structuring',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Ananya Deshmukh',
      role: 'Director – Lease Rental Discounting (LRD) & LAP',
      experience: '13+ Years Banking Relations',
      credentials: 'Master of Finance, ex-ICICI Wholesale Banking',
      bio: 'Manages high-ticket commercial asset refinancing, escrow mechanism design, and tripartite lease structures for commercial retail parks.',
      tag: 'LRD & Commercial LAP',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
    },
  ];

  // Institutional Milestone Journey
  const milestones = [
    {
      year: '2011',
      title: 'Practice Inception',
      desc: 'Founded in Bengaluru as an independent real estate title audit and private mortgage advisory desk.',
    },
    {
      year: '2015',
      title: 'LRD & LAP Institutional Expansion',
      desc: 'Formed dedicated institutional syndication pipelines for commercial asset discounting exceeding ₹100 Cr.',
    },
    {
      year: '2019',
      title: '₹500 Cr Facilitation Milestone',
      desc: 'Expanded coverage across Tier-1 metros (Bengaluru, Hyderabad, Mumbai, Chennai) across 30+ regulated lenders.',
    },
    {
      year: '2023',
      title: 'Institutional Desk Integration',
      desc: 'Established priority underwriting access across 40+ premier PSU, private banks, and AAA-rated housing finance companies.',
    },
    {
      year: '2026',
      title: '₹1,200+ Cr Advisory Milestone',
      desc: 'Launched proprietary digital FOIR calculators, document vaulting, and institutional rate monitoring.',
    },
  ];

  return (
    <div className="bg-brand-bg min-h-screen text-brand-navy">
      {/* ────────────────────────────────────────────────────────────
          1. ABOUT PAGE HERO — Split Asymmetric Narrative Layout
          ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0a1628] via-[#0f2236] to-[#091620] text-white pt-24 pb-20 lg:pt-28 lg:pb-24 border-b border-brand-teal/20">
        
        {/* Geometric Accent Shapes — distinctly different from home hero */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] border border-teal-500/10 rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute top-20 right-20 w-[350px] h-[350px] border border-teal-400/8 rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-teal-600/10 via-transparent to-transparent rounded-full translate-y-1/3 -translate-x-1/4 blur-2xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-sky-500/[0.03] rounded-full blur-3xl pointer-events-none" />

        {/* Diagonal Line Accents */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-[15%] -left-20 w-[120%] h-px bg-gradient-to-r from-transparent via-teal-500/15 to-transparent rotate-[3deg]" />
          <div className="absolute bottom-[20%] -left-20 w-[120%] h-px bg-gradient-to-r from-transparent via-sky-400/10 to-transparent -rotate-[2deg]" />
        </div>

        <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* ── LEFT: Company Story & Origin Narrative ── */}
            <div className="lg:col-span-7 space-y-7">
              
              {/* Breadcrumb & Page Identifier */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white/[0.06] border border-white/10 backdrop-blur-md">
                  <Building2 className="w-4 h-4 text-teal-400" />
                  <span className="text-xs font-bold uppercase tracking-[0.1em] text-teal-300">About Our Practice</span>
                </div>
                <div className="hidden sm:block h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" />
              </div>

              {/* Founding Year Badge — Unique to About Hero */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-teal-500/20 to-sky-500/20 border border-teal-400/30 flex items-center justify-center backdrop-blur-sm">
                    <span className="text-2xl font-extrabold text-teal-300 tracking-tight">11</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 bg-teal-500 rounded text-[9px] font-bold text-white">EST</div>
                </div>
                <div>
                  <p className="text-sm font-bold text-white/90">Established Advisory Practice</p>
                  <p className="text-xs text-slate-400">Kumaran Road, Tirupur, Tamil Nadu • Independent Practice</p>
                </div>
              </div>

              {/* Display Headline — About-specific messaging */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-bold text-white tracking-tight leading-[1.12]">
                The People & Principles Behind{' '}
                <span className="relative inline-block">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-emerald-300 to-sky-300">
                    India's Trusted
                  </span>
                  <span className="absolute -bottom-1 left-0 w-full h-[3px] bg-gradient-to-r from-teal-400 via-emerald-400 to-sky-400 rounded-full opacity-60" />
                </span>{' '}
                Property Finance Advisory.
              </h1>

              {/* Origin Story Paragraph — tells the company story */}
              <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl">
                {businessName} was born from a singular conviction: property owners deserve fiduciary-grade financial counsel — not commissioned salesmanship. Over 15 years, we've built an advisory desk trusted by HNW families, institutional developers, and NRI investors across India's prime metros.
              </p>

              {/* CTA Group — About-specific actions */}
              <div className="pt-2 flex flex-wrap items-start gap-4">
                <Link
                  to="/enquire"
                  className="cta-button group !py-3.5 !px-8 text-base shadow-lg hover:shadow-teal-900/40"
                >
                  <span>Meet Our Advisory Desk</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/how-it-works"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/8 hover:bg-white/12 border border-white/15 text-white font-semibold text-sm transition-all duration-200 backdrop-blur-sm"
                >
                  <span>Our Advisory Process</span>
                  <ChevronRight className="w-4 h-4 text-teal-300" />
                </Link>
              </div>

              {/* Trust Indicators Row — Unique to About */}
              <div className="pt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-teal-400" />
                  <span>RBI Fair Practice Compliant</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
                  <Lock className="w-4 h-4 text-teal-400" />
                  <span>Zero Cash Collection Policy</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
                  <Scale className="w-4 h-4 text-teal-400" />
                  <span>Independent & Unbiased</span>
                </div>
              </div>
            </div>

            {/* ── RIGHT: Stacked Glassmorphic Credential Cards ── */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* KPI Cards — displayed as a 2×2 grid of glass cards */}
              <div className="grid grid-cols-2 gap-3">
                {kpis.map((kpi, idx) => (
                  <div
                    key={idx}
                    className="group relative bg-white/[0.05] hover:bg-white/[0.09] border border-white/10 hover:border-teal-400/30 rounded-xl p-5 backdrop-blur-md transition-all duration-300 cursor-default"
                  >
                    <div className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-teal-100 to-teal-300 tracking-tight transition-transform duration-300 group-hover:scale-105">
                      {kpi.value}
                    </div>
                    <div className="text-xs font-semibold text-white/90 mt-1.5">
                      {kpi.label}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                      {kpi.subtext}
                    </div>
                    {/* Hover glow */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-teal-500/0 to-sky-500/0 group-hover:from-teal-500/[0.06] group-hover:to-sky-500/[0.04] transition-all duration-300 pointer-events-none" />
                  </div>
                ))}
              </div>

              {/* Institutional Quality Banner Card */}
              <div className="relative bg-gradient-to-br from-teal-500/15 via-white/[0.05] to-sky-500/10 border border-teal-400/25 rounded-xl p-5 backdrop-blur-md">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-lg bg-teal-500/20 border border-teal-400/30 flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5 text-teal-300" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-bold text-white">Institutional-Grade Practice</h3>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Our advisory desk operates with the same compliance, documentation, and ethical framework expected of RBI-regulated entities — ensuring your credit profile and legal interests are safeguarded at every step.
                    </p>
                  </div>
                </div>
                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-teal-400/10 to-transparent rounded-tr-xl pointer-events-none" />
              </div>

              {/* Timeline Mini-Strip — founding to present */}
              <div className="relative bg-white/[0.04] border border-white/8 rounded-xl px-5 py-4 backdrop-blur-md">
                <div className="flex items-center justify-between text-center">
                  <div>
                    <div className="text-lg font-extrabold text-teal-300">2011</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Founded</div>
                  </div>
                  <div className="flex-1 mx-3 relative">
                    <div className="h-px bg-white/10 w-full" />
                    <div className="h-px bg-gradient-to-r from-teal-400/60 to-teal-400/20 w-3/4 absolute top-0 left-0" />
                    <div className="absolute top-1/2 left-[25%] -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-teal-400/60" />
                    <div className="absolute top-1/2 left-[50%] -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-teal-400/40" />
                    <div className="absolute top-1/2 left-[75%] -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-teal-400/20" />
                  </div>
                  <div>
                    <div className="text-lg font-extrabold text-white">Today</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">₹1,200+ Cr</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────
          2. OUR ORIGIN & VALUE ARCHITECTURE (Interactive Tabs)
          ──────────────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-28 bg-white border-b border-brand-border">
        <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Narrative Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-brand-teal-light text-brand-teal text-xs font-bold uppercase tracking-wider">
                <Landmark className="w-3.5 h-3.5" />
                <span>Our Institutional Mandate</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-navy tracking-tight leading-tight">
                Eliminating the Asymmetry in Mortgage Lending.
              </h2>

              <p className="text-brand-slate text-base leading-relaxed">
                In India's complex retail and commercial debt landscape, loan applicants often face conflicting interest quotes, aggressive DSAs who broadcast credit files across multiple bureaus, and unexpected technical title rejections weeks into underwriting.
              </p>

              <p className="text-brand-slate text-base leading-relaxed">
                <strong>{businessName}</strong> was established with a singular objective: to operate as a high-fidelity client advocate. We evaluate your borrowing capacity using the exact credit risk and FOIR algorithms deployed by Tier-1 institutions, verifying mother deeds and cash flow sustainability prior to formal lender introduction.
              </p>

              {/* Interactive Vision / Mission / Governance Tabs */}
              <div className="pt-2">
                <div className="flex border-b border-brand-border gap-6">
                  {(['mission', 'vision', 'governance'] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`pb-3 text-sm font-semibold capitalize transition-colors relative cursor-pointer ${
                        activeTab === tab
                          ? 'text-brand-teal border-b-2 border-brand-teal -mb-[2px]'
                          : 'text-brand-slate hover:text-brand-navy'
                      }`}
                    >
                      {tab === 'governance' ? 'Regulatory Governance' : `Our ${tab}`}
                    </button>
                  ))}
                </div>

                <div className="pt-4 text-sm text-brand-slate leading-relaxed bg-brand-ivory/60 p-5 rounded-xl border border-brand-border/80 mt-3">
                  {activeTab === 'mission' && (
                    <div className="space-y-2">
                      <p className="font-semibold text-brand-navy">
                        Empower property owners to secure lowest benchmark debt without predatory terms or CIBIL degradation.
                      </p>
                      <p>
                        We rigorously test each dossier against 40+ lending policy guidelines to identify the single most competitive institutional home for your mortgage.
                      </p>
                    </div>
                  )}

                  {activeTab === 'vision' && (
                    <div className="space-y-2">
                      <p className="font-semibold text-brand-navy">
                        To be the gold-standard independent property finance advisory across India's metropolitan wealth corridors.
                      </p>
                      <p>
                        Setting the benchmark for transparency, zero-hidden commission structures, and forensic pre-sanction diligence.
                      </p>
                    </div>
                  )}

                  {activeTab === 'governance' && (
                    <div className="space-y-2">
                      <p className="font-semibold text-brand-navy">
                        Uncompromising Compliance & Zero False Guarantees.
                      </p>
                      <p>
                        Underwriting and sanction authority resides exclusively with regulated RBI-licensed Banks and NBFCs. We maintain zero unauthorized multi-bureau pings and collect zero cash advances.
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
                {/* Decorative Background Accent */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-brand-teal/20 via-transparent to-sky-500/10 rounded-3xl blur-xl" />

                <div className="relative rounded-2xl overflow-hidden border border-brand-border shadow-xl bg-brand-ivory">
                  <img
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80"
                    alt="High value property portfolio advisory"
                    className="w-full h-[420px] object-cover transition-transform duration-700 hover:scale-105"
                  />

                  {/* Floating Metric Card Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-brand-border/80 shadow-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <span className="text-xs font-bold text-brand-navy">Institutional Quality Standard</span>
                      </div>
                      <span className="text-xs font-bold text-brand-teal">Home Loans from 7.25%* • LAP from 8.50%*</span>
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
          3. OUR CORE ADVISORY PILLARS (Interactive Cards)
          ──────────────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-24 bg-brand-bg border-b border-brand-border">
        <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-10">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-[0.08em] text-brand-teal block">
              Methodological Rigor
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-brand-navy tracking-tight">
              Four Pillars of Institutional Integrity
            </h2>
            <p className="text-brand-slate text-base leading-relaxed">
              Why leading high-net-worth property buyers and commercial real estate developers entrust their financing dossiers to our desk.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {advisoryPillars.map((pillar, idx) => (
              <div
                key={idx}
                className="card-hover bg-white p-7 rounded-2xl border border-brand-border flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-brand-teal-light flex items-center justify-center transition-colors duration-300 group-hover:bg-brand-teal group-hover:text-white">
                      {pillar.icon}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-teal bg-brand-teal-light/80 px-2 py-0.5 rounded">
                      {pillar.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-brand-navy leading-snug group-hover:text-brand-teal transition-colors">
                    {pillar.title}
                  </h3>

                  <p className="text-sm text-brand-slate leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-brand-border/60 flex items-center justify-between text-xs font-semibold text-brand-navy">
                  <span className="text-brand-slate font-medium">Core Metric:</span>
                  <span className="text-brand-teal">{pillar.metrics}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────
          4. COMPARATIVE MATRIX: TRADITIONAL BROKER VS. PRIME ASSOCIATE LOANS
          ──────────────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-24 bg-white border-b border-brand-border">
        <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-10">
          
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold uppercase tracking-[0.08em] text-brand-teal block">
              Market Differentiation
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-brand-navy tracking-tight">
              The Prime Associate Loans Institutional Advantage
            </h2>
            <p className="text-brand-slate text-base leading-relaxed">
              Compare our structured, client-first advisory model against traditional unregulated mortgage brokers.
            </p>
          </div>

          <div className="max-w-4xl mx-auto overflow-hidden rounded-2xl border border-brand-border shadow-card bg-white">
            <div className="grid grid-cols-12 bg-brand-ivory border-b border-brand-border p-4 text-xs font-bold uppercase tracking-wider text-brand-navy">
              <div className="col-span-5 sm:col-span-4">Evaluation Dimension</div>
              <div className="col-span-3 sm:col-span-4 text-center text-slate-500">Traditional Broker</div>
              <div className="col-span-4 sm:col-span-4 text-center text-brand-teal">Prime Associate Loans Practice</div>
            </div>

            <div className="divide-y divide-brand-border/80 text-sm">
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
              ].map((row, i) => (
                <div key={i} className="grid grid-cols-12 p-4 sm:p-5 items-center hover:bg-brand-ivory/40 transition-colors">
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

        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────
          5. LEADERSHIP & ADVISORY COUNCIL (Profiles)
          ──────────────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-24 bg-brand-bg border-b border-brand-border">
        <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl space-y-3">
              <span className="text-xs font-bold uppercase tracking-[0.08em] text-brand-teal block">
                Executive Leadership
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-brand-navy tracking-tight">
                Senior Banking & Legal Practitioners
              </h2>
              <p className="text-brand-slate text-base leading-relaxed">
                Our practice is directed by seasoned mortgage bankers, High Court advocates, and chartered accountants with decades of combined capital markets leadership.
              </p>
            </div>

            <Link
              to="/contact"
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-teal hover:text-brand-teal-hover transition-colors shrink-0"
            >
              <span>Connect with our leadership team</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {leadership.map((member, idx) => (
              <div
                key={idx}
                className="card-hover bg-white rounded-2xl overflow-hidden border border-brand-border group flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[4/3] overflow-hidden bg-slate-100 relative">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-brand-navy border border-brand-border">
                      {member.experience}
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold bg-brand-teal-light text-brand-teal">
                      {member.tag}
                    </div>

                    <h3 className="text-base font-bold text-brand-navy group-hover:text-brand-teal transition-colors">
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
                    className="w-full py-2.5 px-3 rounded-lg border border-brand-border text-xs font-semibold text-brand-navy hover:bg-brand-teal-light hover:text-brand-teal hover:border-brand-teal/40 transition-all flex items-center justify-center gap-1.5"
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
          6. PRACTICE TIMELINE & MILESTONES
          ──────────────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-24 bg-white border-b border-brand-border">
        <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-10">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-[0.08em] text-brand-teal block">
              15-Year Evolution
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-brand-navy tracking-tight">
              Our Journey of Capital Facilitation
            </h2>
            <p className="text-brand-slate text-base leading-relaxed">
              From a boutique land title scrutiny desk to one of South India's premier property finance syndication practices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
            {milestones.map((ms, idx) => (
              <div
                key={idx}
                className="relative bg-brand-ivory/60 p-6 rounded-2xl border border-brand-border hover:border-brand-teal/40 hover:bg-white transition-all duration-300 group shadow-subtle hover:shadow-card"
              >
                <div className="text-2xl font-extrabold text-brand-teal font-heading">
                  {ms.year}
                </div>
                <h4 className="text-sm font-bold text-brand-navy mt-2 mb-2 group-hover:text-brand-teal transition-colors">
                  {ms.title}
                </h4>
                <p className="text-xs text-brand-slate leading-relaxed">
                  {ms.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────
          7. REGULATORY COMPLIANCE & LEGAL NOTICE
          ──────────────────────────────────────────────────────────── */}
      <section className="py-14 bg-brand-ivory border-b border-brand-border">
        <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-2xl border border-brand-border shadow-sm flex flex-col sm:flex-row items-start gap-5">
            <div className="w-12 h-12 rounded-xl bg-brand-teal-light flex items-center justify-center shrink-0 text-brand-teal">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-brand-navy uppercase tracking-wider">
                Regulatory Status & Clear Disclosures
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
          8. HIGH-IMPACT CONVERSION BANNER
          ──────────────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-24 bg-gradient-to-br from-[#0c1b29] via-[#102a3f] to-[#0c1b29] text-white">
        <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-teal/20 border border-brand-teal/30 text-teal-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Direct Underwriter Access</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              Ready to Secure Optimal Funding for Your Property?
            </h2>

            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Connect directly with our senior loan advisory desk for a comprehensive borrowing capacity and title feasibility evaluation.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/enquire"
                className="cta-button group !py-3.5 !px-8 text-base shadow-xl"
              >
                <span>Book Confidential Advisory Call</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              
              <a
                href={`tel:${businessPhone.replace(/\s+/g, '')}`}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm transition-all duration-200"
              >
                <PhoneCall className="w-4 h-4 text-teal-300" />
                <span>Call {businessPhone}</span>
              </a>
            </div>

            <p className="text-xs text-slate-400 pt-2">
              Confidentiality Guaranteed • Zero Advance Fees • 40+ Partner Institutions
            </p>

          </div>
        </div>
      </section>

    </div>
  );
};
