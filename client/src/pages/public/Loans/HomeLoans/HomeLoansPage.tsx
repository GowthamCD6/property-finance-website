import homeLoanHeroImage from '../../../../assets/images/home-loan.jpg';
import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  Home,
  CheckCircle2,
  FileCheck2,
  ArrowRight,
  TrendingUp,
  Percent,
  Layers,
  HelpCircle,
  Building,
  Landmark,
  Compass,
  FileText,
  ShieldCheck,
  ChevronRight,
  Calculator,
  AlertCircle,
  Sparkles,
  MapPin,
  Check,
} from 'lucide-react';
import { EnquiryForm } from '../../../../components/EnquiryForm/EnquiryForm';
import { InteractiveDocumentVault } from '../../../../components/common/InteractiveDocumentVault';
import { Service } from '../../../../types';

export const HomeLoansPage: React.FC = () => {
  const context = useOutletContext<{ services?: Service[] }>();
  const services = context?.services || [];
  const homeLoanService = services.find((s) => s.slug === 'home-loans') || null;

  const [activeProfile, setActiveProfile] = useState<'salaried' | 'selfEmployed' | 'nri'>('salaried');
  const [selectedCollateralType, setSelectedCollateralType] = useState<'plot' | 'composite' | 'ready'>('plot');
  const [mounted, setMounted] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [counterValues, setCounterValues] = useState({
    turnaround: 7.25,
    lenders: 0,
    sanction: 0,
    capital: 0,
  });

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(timer);
  }, []);

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
        turnaround: 7.25,
        lenders: Math.round(40 * eased),
        sanction: Number((98.4 * eased).toFixed(1)),
        capital: Math.round(120 * eased), // 120 Cr
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

  // Key Financial Benchmarks for Land & Home Loans
  const metrics = [
    { value: '7.25%*', label: 'Starting Benchmark ROI', sub: 'With Government Subsidy' },
    { value: 'Up to 85%', label: 'Loan-to-Value (LTV)', sub: '75%–80% for Plot Loans' },
    { value: 'Up to 30 Yrs', label: 'Repayment Tenure', sub: 'Extended Amortization' },
    { value: 'Govt. Subsidy', label: 'PMAY & State Schemes', sub: 'Government & Private Banks' },
  ];

  // Specialized Financing Categories for Land & Homes
  const fundingPathways = [
    {
      title: 'Self-Construction Loan on Owned Site',
      badge: 'Core Speciality',
      desc: 'Financing for landowners constructing independent houses, villas, duplexes, or multi-floor residential properties against approved civil estimates.',
      highlights: [
        'Disbursements against stage-wise architect completion certificates',
        'Starting interest rates from 7.25% p.a. with government subsidy',
        'Interest-only pre-EMI option during active construction phase',
      ],
      icon: (
        <svg className="w-6 h-6 text-brand-teal" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" d="M3 6a3 3 0 013-3h2.25a3 3 0 013 3v2.25a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm9.75 0a3 3 0 013-3H18a3 3 0 013 3v2.25a3 3 0 01-3 3h-2.25a3 3 0 01-3-3V6zM3 15.75a3 3 0 013-3h2.25a3 3 0 013 3V18a3 3 0 01-3 3H6a3 3 0 01-3-3v-2.25zm9.75 0a3 3 0 013-3H18a3 3 0 013 3V18a3 3 0 01-3 3h-2.25a3 3 0 01-3-3v-2.25z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      title: 'Plot Purchase with Construction (Composite)',
      badge: 'Single Sanction',
      desc: 'A seamless composite package combining funding for vacant plot acquisition followed by progressive construction tranches as your home building progresses.',
      highlights: [
        'Unified processing and single sanction letter across partner banks',
        'Phased disbursement linked to civil milestones',
        'Government subsidy eligibility assistance under housing schemes',
      ],
      icon: (
        <svg className="w-6 h-6 text-brand-teal" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
          <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
        </svg>
      ),
    },
    {
      title: 'New Home Purchase Loan',
      badge: 'New Property',
      desc: 'Competitive bank financing for newly constructed independent bungalows, villas, and residential apartments with maximum tenure up to 30 years.',
      highlights: [
        'Tie-ups across government PSU and leading private banks',
        'Speedy valuation and sanction letter within 48 hours',
        'Subsidy support for eligible first-time homebuyers',
      ],
      icon: (
        <svg className="w-6 h-6 text-brand-teal" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.728-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      title: 'Old Home Purchase Loan',
      badge: 'Resale Property',
      desc: 'Purchase financing for existing pre-owned residential homes and resale properties with thorough title deed chain scrutiny and technical valuation.',
      highlights: [
        'Complete mother deed verification (30-year search report)',
        'Realistic age-of-building residual life assessments',
        'Smooth settlement with seller’s existing banker if encumbered',
      ],
      icon: (
        <svg className="w-6 h-6 text-brand-teal" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" d="M4.5 2.25a.75.75 0 000 1.5v16.5h-.75a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5h-.75V3.75a.75.75 0 000-1.5h-15zM9 6a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5H9zm-.75 5.25a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75zm.75 3.75a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5H9zm4.5-9a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zm-.75 5.25a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zm.75 3.75a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5h-1.5z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      title: 'Tiled House Purchase & Renovation Loan',
      badge: 'Traditional Homes',
      desc: 'Specialized loan assistance for acquiring or restoring heritage and traditional tiled houses across municipal, town, and rural jurisdictions.',
      highlights: [
        'Acceptable with leading PSU & private banks with legal clearance',
        'Financing available for purchase as well as structural renovation',
        'Government subsidy guidance for eligible applicants',
      ],
      icon: (
        <svg className="w-6 h-6 text-brand-teal" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" d="M12 2.25a.75.75 0 01.75.75v1.168l7.854 3.142A1.5 1.5 0 0121.5 8.65v.6a.75.75 0 01-.75.75H3.25a.75.75 0 01-.75-.75v-.6c0-.62.38-1.18.966-1.39L11.25 4.168V3a.75.75 0 01.75-.75z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      title: 'Loan Takeover from Private to Govt. Banks',
      badge: 'Lowest Interest Rates',
      desc: 'Transfer high-interest loans from private banks and NBFCs to low-rate Government (PSU) banks to permanently reduce your monthly EMI burden.',
      highlights: [
        'Switch to lowest starting interest rates from 7.25% p.a.',
        'Zero advance fees and end-to-end documentation takeover',
        'Top-up facility available for additional personal/business funding',
      ],
      icon: (
        <svg className="w-6 h-6 text-brand-teal" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z" clipRule="evenodd" />
        </svg>
      ),
    },
  ];

  // Critical Land Financing Advisory Nuances
  const landAdvisoryPoints = [
    {
      title: 'Agricultural vs. Non-Agricultural (NA) Land',
      detail: 'Banks in India strictly prohibit home loan financing on un-converted agricultural farmland. The plot must possess official DC conversion to non-agricultural residential use and have approved layout sanctions from local metropolitan authorities (e.g. BDA, BMRDA, DTCP, HMDA).',
    },
    {
      title: 'Construction Timeline Mandate on Plots',
      detail: 'Most public and private sector banks sanction plot loans under the condition that residential construction must commence within 2 to 3 years from the date of plot registration. Failure to begin construction may result in conversion of the rate to commercial interest.',
    },
    {
      title: 'Khata Classification & Title Regularity',
      detail: 'Properties situated in municipal jurisdictions must have legitimate A-Khata or equivalent freehold mutation extracts. Gram Panchayat / B-Khata properties face restricted lender appetite and require specialized private lending avenues.',
    },
  ];

  return (
    <div className="bg-brand-bg min-h-screen text-brand-navy">
      {/* ────────────────────────────────────────────────────────────
          1. CONTENT-SPECIFIC HERO: LAND & HOME LOAN ARCHITECTURE
          ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-slate-950 text-white pt-10 sm:pt-14 lg:pt-16 pb-12 sm:pb-16 lg:pb-20 border-b border-white/10">
        {/* Background Photographic Image: Brighter, Fixed & Stable */}
        <div className="absolute inset-0 z-0">
          <img
            src={homeLoanHeroImage}
            alt="Land & Home Loans Architecture"
            className="w-full h-full object-cover object-center brightness-[1.05] contrast-[1.02]"
            loading="eager"
          />
          {/* Calibrated lightweight translucent overlays */}
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-950/30 to-transparent" />
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
            
            {/* Left Column: Dedicated Heading & Value Proposition */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-7">
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
                  <span>Land Acquisition &amp; Home Loan Advisory Desk • Est. 2011</span>
                </div>
                <div className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-300 font-medium bg-white/5 px-3 py-1 rounded-full border border-white/10 font-sans">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Government Subsidy Aligned</span>
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
                  Land &amp; Home Loans,{' '}
                  <span className="shimmer-headline-text text-[#38bdf8]">
                    Engineered for Lowest Lifetime Cost.
                  </span>
                </h1>
              </div>

              <p
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateY(0)' : 'translateY(24px)',
                  transition: 'opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.35s, transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.35s',
                }}
                className="text-xs sm:text-sm md:text-base text-slate-200 font-sans font-normal leading-relaxed max-w-2xl pt-1"
              >
                From purchasing residential plots in BDA/DTCP layouts to composite plot-plus-construction financing and ready resale homes, our advisors evaluate 40+ lending criteria to secure maximum permissible LTV and benchmark interest rates.
              </p>

              {/* 4 Interactive Institutional Metrics Grid */}
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
                      Benchmark
                    </span>
                  </div>
                  <div className="text-xl xs:text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono tabular-nums">
                    7.25%*
                  </div>
                  <div className="text-xs font-bold text-slate-200 mt-1 font-heading">
                    Starting ROI
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 leading-snug line-clamp-1 font-sans">
                    With Govt Subsidy
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

              {/* Quick Action Buttons */}
              <div
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateY(0)' : 'translateY(24px)',
                  transition: 'opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.5s, transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.5s',
                }}
                className="pt-2 flex flex-wrap items-center gap-3.5"
              >
                <a
                  href="#enquiry-form"
                  className="px-6 sm:px-8 py-3.5 rounded-full bg-gradient-to-r from-teal-500 to-[#20B2AA] hover:from-teal-400 hover:to-teal-500 text-white font-extrabold text-xs sm:text-sm tracking-wide shadow-lg shadow-teal-950/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 font-heading cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  <span>Request Land &amp; Home Assessment</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <Link
                  to="/calculator"
                  className="px-6 py-3.5 rounded-full bg-slate-900/85 hover:bg-slate-800/90 text-white font-bold text-xs sm:text-sm border border-white/20 hover:border-teal-400/50 backdrop-blur-md shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 font-heading cursor-pointer"
                >
                  <Calculator className="w-4 h-4 text-brand-teal" />
                  <span>Composite EMI Calculator</span>
                </Link>
              </div>

              {/* Title & Layout Assurance Tags */}
              <div
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateY(0)' : 'translateY(24px)',
                  transition: 'opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.6s, transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.6s',
                }}
                className="pt-2 flex flex-wrap gap-2 text-[11px] font-semibold text-slate-300 font-sans"
              >
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> BDA / DTCP / HMDA Approved Sites
                </span>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Freehold A-Khata Titles
                </span>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> 30-Year EC Form 15 Vetted
                </span>
              </div>
            </div>

            {/* Right Column: Interactive Land & Home Loan Term Matrix Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#12263a] to-[#0d1d2c] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs uppercase font-bold tracking-wider text-brand-teal-light">
                    Current Lending Benchmarks
                  </span>
                </div>
                <span className="text-[11px] text-gray-400 font-mono">Q3 FY26 Update</span>
              </div>

              {/* Interactive Property Type Selector Inside Hero Card */}
              <div className="mt-4 grid grid-cols-3 gap-2 p-1 bg-white/5 rounded-xl border border-white/10 text-xs font-bold text-center">
                <button
                  onClick={() => setSelectedCollateralType('plot')}
                  className={`py-2 rounded-lg transition-all ${
                    selectedCollateralType === 'plot'
                      ? 'bg-brand-teal text-white shadow'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Plot Loan
                </button>
                <button
                  onClick={() => setSelectedCollateralType('composite')}
                  className={`py-2 rounded-lg transition-all ${
                    selectedCollateralType === 'composite'
                      ? 'bg-brand-teal text-white shadow'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Composite
                </button>
                <button
                  onClick={() => setSelectedCollateralType('ready')}
                  className={`py-2 rounded-lg transition-all ${
                    selectedCollateralType === 'ready'
                      ? 'bg-brand-teal text-white shadow'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Ready Home
                </button>
              </div>

              {/* Dynamic Rate & LTV Display */}
              <div className="mt-5 grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                  <span className="text-[11px] text-gray-400 block font-medium">Starting Interest Rate</span>
                  <span className="text-2xl font-black text-emerald-400 font-mono">
                    {selectedCollateralType === 'plot' ? '7.45%*' : selectedCollateralType === 'composite' ? '7.30%*' : '7.25%*'}
                  </span>
                  <span className="text-[10px] text-gray-400 block mt-0.5">Repo-Linked EBLR</span>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                  <span className="text-[11px] text-gray-400 block font-medium">Maximum LTV</span>
                  <span className="text-2xl font-black text-brand-gold font-mono">
                    {selectedCollateralType === 'plot' ? 'Up to 75%' : selectedCollateralType === 'composite' ? 'Up to 80%' : 'Up to 85%'}
                  </span>
                  <span className="text-[10px] text-gray-400 block mt-0.5">Of market valuation</span>
                </div>
              </div>

              {/* Context Summary for selected type */}
              <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-300 leading-relaxed">
                {selectedCollateralType === 'plot' && (
                  <span><strong>Plot Financing Rule:</strong> Land must hold DC conversion for residential use. Construction of dwelling must start within 2–3 years to maintain home loan rates.</span>
                )}
                {selectedCollateralType === 'composite' && (
                  <span><strong>Composite Mandate:</strong> Single sanction letter financing plot purchase plus phased construction disbursements against structural engineer milestone certificates.</span>
                )}
                {selectedCollateralType === 'ready' && (
                  <span><strong>Resale &amp; Ready Home:</strong> Full verification of Occupancy Certificate (OC), Khata extract, and society non-objection certificate (NOC). Fast 5-day sanction.</span>
                )}
              </div>

              {/* Card Footer CTA */}
              <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-gray-400">40+ Empanelled Banks</span>
                <a
                  href="#enquiry-form"
                  className="text-xs font-bold text-brand-teal-light hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>Check Eligibility</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────
          2. SIX SPECIALIZED PATHWAYS (Interactive Grid)
          ──────────────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-24 bg-white border-b border-brand-border">
        <div className="w-[92%] sm:w-[88%] lg:w-[85%] max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-[0.08em] text-brand-teal block">
              Specialized Mortgage Structures
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-brand-navy tracking-tight font-heading">
              Six Tailored Pathways for Land &amp; Property Buyers
            </h2>
            <p className="text-brand-slate text-base leading-relaxed">
              Every property transaction features distinct title, valuation, and regulatory nuances. We align your borrowing dossier directly with lenders optimized for your specific purchase profile.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {fundingPathways.map((item, idx) => (
              <div
                key={idx}
                className="bg-brand-ivory/50 rounded-2xl border border-brand-border p-7 hover:border-brand-teal/40 transition-all duration-300 hover:shadow-card flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-brand-teal-light flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                      {item.icon}
                    </div>
                    <span className="text-[11px] font-bold text-brand-teal bg-brand-teal-light px-3 py-1 rounded-full uppercase tracking-wider">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-brand-navy mb-2 font-heading">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-brand-slate leading-relaxed mb-6">
                    {item.desc}
                  </p>
                </div>

                <div className="space-y-2 pt-4 border-t border-brand-border/60">
                  {item.highlights.map((h, hIdx) => (
                    <div key={hIdx} className="flex items-start gap-2 text-xs font-medium text-brand-navy">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-teal flex-shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────
          3. CRITICAL LAND FINANCING ADVISORY (Must-Know Nuances)
          ──────────────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-24 bg-brand-ivory/60 border-b border-brand-border">
        <div className="w-[92%] sm:w-[88%] lg:w-[85%] max-w-7xl mx-auto">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-teal block mb-1">
              Title Due Diligence
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-navy font-heading tracking-tight">
              Essential Due Diligence for Land &amp; Plot Borrowers
            </h2>
            <p className="mt-3 text-brand-slate text-sm sm:text-base leading-relaxed">
              Unlike standardized apartment purchases, residential land purchases involve zoning restrictions, agricultural conversion records, and municipal layout approvals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {landAdvisoryPoints.map((pt, idx) => (
              <div
                key={idx}
                className="p-7 bg-white rounded-2xl border border-brand-border shadow-subtle space-y-3 hover:border-brand-teal/40 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-navy text-white flex items-center justify-center font-bold text-sm">
                  0{idx + 1}
                </div>
                <h3 className="font-bold text-base text-brand-navy font-heading">{pt.title}</h3>
                <p className="text-xs sm:text-sm text-brand-slate leading-relaxed">{pt.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────
          4. DOCUMENTATION CHECKLIST
          ──────────────────────────────────────────────────────────── */}
      <InteractiveDocumentVault loanType="home-loans" />

      {/* ────────────────────────────────────────────────────────────
          5. PRELOADED CONSULTATION FORM
          ──────────────────────────────────────────────────────────── */}
      <div id="enquiry-form">
        <EnquiryForm
          services={services}
          selectedService={homeLoanService}
          onClearSelectedService={() => {}}
        />
      </div>
    </div>
  );
};
