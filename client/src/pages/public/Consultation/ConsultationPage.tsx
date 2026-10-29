import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  FileCheck2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Search,
  Calculator,
  UserCheck,
  Video,
  PhoneCall,
  MapPin,
  Clock,
  Sparkles,
  Lock,
  FileText,
  BadgeAlert,
  HelpCircle,
  Award,
  Phone,
  Shield,
  Scale,
  Car,
  Truck,
  Zap,
} from 'lucide-react';
import { EnquiryForm } from '../../../components/EnquiryForm/EnquiryForm';
import { InteractiveDocumentVault } from '../../../components/common/InteractiveDocumentVault';
import { Service } from '../../../types';
import vehicleHeroImage from '../../../assets/images/vehicle-loan.avif';

export const ConsultationPage: React.FC = () => {
  const context = useOutletContext<{ services?: Service[] }>();
  const services = context?.services || [];
  const consultationService =
    services.find((s) => s.slug === 'loan-consultation' || s.slug === 'vehicle-loans') || null;

  const [activeVehicleType, setActiveVehicleType] = useState<'new-car' | 'used-car' | 'commercial' | 'refinance'>('new-car');
  const [vehicleAmountLakhs, setVehicleAmountLakhs] = useState<number>(12);
  const [vehicleTenureYears, setVehicleTenureYears] = useState<number>(5);
  const [mounted, setMounted] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const [counterValues, setCounterValues] = useState({
    turnaround: 24,
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
        turnaround: 24,
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

  const vehicleRates: Record<string, number> = {
    'new-car': 8.65,
    'used-car': 10.25,
    'commercial': 9.75,
    'refinance': 9.90,
  };
  const currentRate = vehicleRates[activeVehicleType] || 8.65;
  const p = vehicleAmountLakhs * 100000;
  const r = currentRate / (12 * 100);
  const n = vehicleTenureYears * 12;
  const estimatedVehicleEmi = Math.round((p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));

  const consultationPillars = [
    {
      step: '01',
      title: 'Preliminary FOIR & True Borrowing Capacity',
      desc: 'We calculate your Fixed Obligation to Income Ratio (FOIR) across existing EMIs, active personal debts, and vehicle limits to determine your exact borrowing ceiling under current RBI retail directives.',
      icon: <Calculator className="w-5 h-5 text-brand-teal" />,
      outcome: 'Clear maximum loan eligibility amount before bank submission',
    },
    {
      step: '02',
      title: 'Credit Bureau & CIBIL Score Health Audit',
      desc: 'We inspect your bureau footprint for negative DPD (Days Past Due), settled loan flags, and high revolving utilization that would trigger automatic rejection.',
      icon: <UserCheck className="w-5 h-5 text-brand-teal" />,
      outcome: 'Zero hard bureau inquiries; score preservation strategy',
    },
    {
      step: '03',
      title: 'Vehicle Asset Valuation & Loan-to-Value',
      desc: 'Our vehicle finance desk evaluates on-road invoices, dealer quotations, used car depreciation grids, and commercial fleet valuation matrices to secure up to 100% on-road funding.',
      icon: <Car className="w-5 h-5 text-brand-teal" />,
      outcome: 'Maximum permissible LTV with zero unexpected hidden markups',
    },
    {
      step: '04',
      title: 'Fast-Track Zonal Sanction & Delivery Clearance',
      desc: 'Direct tie-ups across PSU and Tier-1 private bank zonal desks ensure delivery orders (DO) and disbursement letters are issued within 24 to 48 hours of document intake.',
      icon: <ShieldCheck className="w-5 h-5 text-brand-teal" />,
      outcome: 'Immediate bank DO issued directly to automobile dealership',
    },
  ];

  return (
    <div className="bg-[#f8f8f4] min-h-screen text-brand-navy">
      <section className="relative overflow-hidden bg-slate-950 text-white pt-10 sm:pt-14 lg:pt-16 pb-12 sm:pb-16 lg:pb-20 border-b border-white/10">
        <div className="absolute inset-0 z-0">
          <img
            src={vehicleHeroImage}
            alt="Vehicle Loans, Automotive Fleet & Refinance Architecture"
            className="w-full h-full object-cover object-center brightness-[1.05] contrast-[1.02]"
            loading="eager"
          />
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-950/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-slate-950/50" />

          <div
            className="absolute -top-24 -left-20 w-80 sm:w-96 h-80 sm:h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none animate-pulse"
            style={{ animationDuration: '6s' }}
          />
          <div className="absolute top-1/3 -right-20 w-80 sm:w-96 h-80 sm:h-96 bg-sky-500/12 rounded-full blur-3xl pointer-events-none" />
        </div>

        <div className="w-[92%] sm:w-[88%] lg:w-[85%] max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
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
                  <span>Vehicle Finance &amp; Asset Refinance Desk • Est. 2011</span>
                </div>
                <div className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-300 font-medium bg-white/5 px-3 py-1 rounded-full border border-white/10 font-sans">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Direct Bank Zonal Sanction</span>
                </div>
              </div>

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
                  Vehicle Loans, Commercial Fleet &amp;{' '}
                  <span className="shimmer-headline-text text-[#38bdf8]">
                    Refinancing Solutions.
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
                Secure rapid funding for new passenger cars, pre-owned cars, commercial fleet vehicles, and existing car refinancing to unlock urgent working capital without selling valuable business assets.
              </p>

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
                    {counterValues.turnaround}–48h
                  </div>
                  <div className="text-xs font-bold text-slate-200 mt-1 font-heading">
                    Sanction to DO
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 leading-snug line-clamp-1 font-sans">
                    Fast Dealer Delivery
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
                    Forensic Asset Verification
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
                  <span>Initiate Vehicle Loan Application</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="tel:+919655566613"
                  className="px-6 py-3.5 rounded-full bg-slate-900/85 hover:bg-slate-800/90 text-white font-bold text-xs sm:text-sm border border-white/20 hover:border-teal-400/50 backdrop-blur-md shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2.5 font-heading cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>Direct Hotline: +91 96555 66613</span>
                </a>
              </div>

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

            <div className="lg:col-span-5">
              <div className="relative rounded-3xl bg-slate-900/85 backdrop-blur-xl border border-white/15 p-6 sm:p-7 shadow-2xl space-y-4 font-sans text-white">
                <div className="relative z-10 flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-emerald-400 animate-pulse" />
                    <span className="text-xs uppercase font-extrabold tracking-wider text-teal-200 font-heading">
                      Vehicle Syndication Console
                    </span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-[10px] font-mono font-bold text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>Live Bank Rates</span>
                  </div>
                </div>

                <div className="relative z-10 pt-2">
                  <span className="text-[10px] uppercase font-bold text-slate-300 font-heading tracking-wider block mb-2">
                    Select Vehicle Facility
                  </span>
                  <div className="grid grid-cols-4 gap-1.5 p-1 bg-black/40 rounded-xl border border-white/10">
                    {[
                      { id: 'new-car', label: 'New Car', rate: '8.65%' },
                      { id: 'used-car', label: 'Used Car', rate: '10.25%' },
                      { id: 'commercial', label: 'Commercial', rate: '9.75%' },
                      { id: 'refinance', label: 'Refinance', rate: '9.90%' },
                    ].map((facility) => {
                      const isSel = activeVehicleType === facility.id;
                      return (
                        <button
                          key={facility.id}
                          type="button"
                          onClick={() => setActiveVehicleType(facility.id as any)}
                          className={`py-2 px-1 rounded-lg text-center transition-all cursor-pointer font-heading ${
                            isSel
                              ? 'bg-gradient-to-r from-brand-teal to-teal-700 text-white font-bold shadow-sm'
                              : 'text-slate-300 hover:text-white hover:bg-white/5 font-semibold'
                          }`}
                        >
                          <span className="text-[10px] block leading-tight font-heading font-bold">{facility.label}</span>
                          <span className="text-[9px] block text-teal-200 opacity-90 font-mono font-bold">{facility.rate}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="relative z-10 space-y-3.5 pt-2">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-slate-200 font-medium font-heading">Loan Quantum Required:</span>
                      <span className="text-sm font-extrabold text-teal-300 font-mono tabular-nums">
                        ₹{vehicleAmountLakhs} Lakhs
                      </span>
                    </div>
                    <input
                      type="range"
                      min={3}
                      max={75}
                      step={1}
                      value={vehicleAmountLakhs}
                      onChange={(e) => setVehicleAmountLakhs(Number(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 pt-1 font-mono font-semibold">
                      <span>₹3 Lakhs</span>
                      <span>₹35 Lakhs</span>
                      <span>₹75 Lakhs</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-slate-200 font-medium font-heading">Repayment Tenure:</span>
                      <span className="text-sm font-extrabold text-sky-300 font-mono tabular-nums">
                        {vehicleTenureYears} Years
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5, 7].map((yr) => (
                        <button
                          key={yr}
                          type="button"
                          onClick={() => setVehicleTenureYears(yr)}
                          className={`flex-1 py-1 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
                            vehicleTenureYears === yr
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

                <div className="relative z-10 grid grid-cols-3 gap-2 pt-2">
                  <div className="p-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-center">
                    <span className="text-[10px] text-slate-300 uppercase font-bold font-heading tracking-wider block">
                      Estimated EMI
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-white font-mono tabular-nums block mt-0.5">
                      ₹{estimatedVehicleEmi.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[9px] text-teal-300 font-semibold font-mono block">
                      @{currentRate}% Benchmark
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-teal-500/15 border border-teal-400/30 text-center">
                    <span className="text-[10px] text-teal-200 uppercase font-bold font-heading tracking-wider block">
                      Max LTV
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-teal-100 font-mono tabular-nums block mt-0.5">
                      Up to 100%
                    </span>
                    <span className="text-[9px] text-teal-200/90 font-medium font-sans block">
                      On-Road Pricing
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-center">
                    <span className="text-[10px] text-slate-300 uppercase font-bold font-heading tracking-wider block">
                      Disbursement
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-white font-mono tabular-nums block mt-0.5">
                      24–48 Hours
                    </span>
                    <span className="text-[9px] text-emerald-400 font-semibold font-sans block">
                      Direct Dealer DO
                    </span>
                  </div>
                </div>

                <div className="relative z-10 pt-2">
                  <a
                    href="#enquiry-form"
                    className="w-full py-3.5 px-4 rounded-xl bg-brand-teal hover:bg-brand-teal-hover text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-teal-950/40 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer font-heading tracking-wide"
                  >
                    <Zap className="w-4 h-4 text-white fill-white" />
                    <span>Fast-Track Pre-Approval for ₹{vehicleAmountLakhs} Lakhs</span>
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-white border-b border-brand-border">
        <div className="w-[92%] sm:w-[88%] lg:w-[85%] max-w-7xl mx-auto">
          <div className="max-w-3xl mb-12 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-teal font-heading">
              Complete Automotive Debt Syndication
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-navy font-heading tracking-tight">
              Four Specialized Vehicle Financing Categories
            </h2>
            <p className="text-sm sm:text-base text-brand-slate leading-relaxed">
              Whether you are acquiring a luxury private car, modernizing a commercial transport fleet, or unlocking liquidity from existing vehicles, our desk manages the entire process from valuation to sanction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {consultationPillars.map((p, idx) => (
              <div
                key={idx}
                className="bg-[#f8f8f4] rounded-2xl p-6 border border-brand-border/80 shadow-card hover:shadow-xl transition-all duration-300 hover:border-teal-400 group space-y-4"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-teal-light text-brand-teal flex items-center justify-center font-bold text-xs font-mono border border-brand-teal/20 group-hover:bg-brand-teal group-hover:text-white transition-colors">
                  {p.step}
                </div>
                <h3 className="font-bold text-base text-brand-navy font-heading leading-snug">
                  {p.title}
                </h3>
                <p className="text-xs text-brand-slate leading-relaxed font-sans">
                  {p.desc}
                </p>
                <div className="pt-3 border-t border-slate-200/80 text-[11px] font-semibold text-emerald-700 font-sans flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>{p.outcome}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#f8f8f4] border-b border-brand-border">
        <div className="w-[92%] sm:w-[88%] lg:w-[85%] max-w-7xl mx-auto">
          <InteractiveDocumentVault />
        </div>
      </section>

      <div id="enquiry-form" className="bg-[#f8f8f4]">
        <EnquiryForm
          services={services}
          selectedService={consultationService}
          onClearSelectedService={() => {}}
        />
      </div>
    </div>
  );
};
