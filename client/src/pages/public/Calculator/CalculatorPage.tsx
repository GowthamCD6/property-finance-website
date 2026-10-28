import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calculator as CalcIcon,
  IndianRupee,
  Calendar,
  Percent,
  ArrowRight,
  CheckCircle2,
  Building2,
  FileCheck2,
  TrendingUp,
  UserCheck,
  ShieldCheck,
  Info,
  Layers,
  Sparkles,
  HelpCircle,
  FileText,
  BadgeAlert,
  Sliders,
} from 'lucide-react';

export const CalculatorPage: React.FC = () => {
  const [calcMode, setCalcMode] = useState<'emi' | 'eligibility' | 'composite'>('emi');

  // Mode 1: Standard EMI States
  const [loanAmount, setLoanAmount] = useState<number>(5000000); // ₹50 Lakhs
  const [interestRate, setInterestRate] = useState<number>(7.25); // Starts from 7.25% p.a.
  const [tenureYears, setTenureYears] = useState<number>(20); // 20 years

  // Mode 2: Eligibility & FOIR States
  const [monthlyIncome, setMonthlyIncome] = useState<number>(150000); // ₹1.5 Lakhs net
  const [existingEmis, setExistingEmis] = useState<number>(20000); // ₹20k existing EMIs
  const [eligibilityTenure, setEligibilityTenure] = useState<number>(20); // 20 yrs
  const [eligibilityRate, setEligibilityRate] = useState<number>(7.25); // 7.25%
  const [foirPercentage, setFoirPercentage] = useState<number>(55); // 55% FOIR norm standard in Indian banks

  // Mode 3: Composite Plot + Construction Loan States
  const [plotCost, setPlotCost] = useState<number>(4000000); // ₹40 Lakhs plot
  const [constructionCost, setConstructionCost] = useState<number>(5000000); // ₹50 Lakhs construction
  const [compositeRate, setCompositeRate] = useState<number>(7.35); // 7.35%
  const [compositeTenure, setCompositeTenure] = useState<number>(20); // 20 yrs
  const [disbursedTranchePercent, setDisbursedTranchePercent] = useState<number>(50); // 50% construction done

  // Mode 1 Calculations
  const monthlyRate = interestRate / 12 / 100;
  const totalMonths = tenureYears * 12;

  const emi =
    totalMonths > 0 && monthlyRate > 0
      ? Math.round(
          (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
            (Math.pow(1 + monthlyRate, totalMonths) - 1)
        )
      : 0;

  const totalPayment = emi * totalMonths;
  const totalInterest = Math.max(0, totalPayment - loanAmount);
  const principalPercent = totalPayment > 0 ? Math.round((loanAmount / totalPayment) * 100) : 100;
  const interestPercent = totalPayment > 0 ? 100 - principalPercent : 0;

  // Mode 2 Calculations
  const eligMonthlyRate = eligibilityRate / 12 / 100;
  const eligTotalMonths = eligibilityTenure * 12;
  const permissibleEmi = Math.max(0, monthlyIncome * (foirPercentage / 100) - existingEmis);

  const maxLoanEligible =
    eligTotalMonths > 0 && eligMonthlyRate > 0 && permissibleEmi > 0
      ? Math.round(
          (permissibleEmi * (Math.pow(1 + eligMonthlyRate, eligTotalMonths) - 1)) /
            (eligMonthlyRate * Math.pow(1 + eligMonthlyRate, eligTotalMonths))
        )
      : 0;

  // Mode 3 Calculations
  const maxPlotLoan = Math.round(plotCost * 0.70);
  const maxConstructionLoan = Math.round(constructionCost * 0.80);
  const totalCompositeLoan = maxPlotLoan + maxConstructionLoan;
  const totalProjectCost = plotCost + constructionCost;
  const selfContribution = totalProjectCost - totalCompositeLoan;

  const compositeMonthlyRate = compositeRate / 12 / 100;
  const compositeMonths = compositeTenure * 12;

  const fullCompositeEmi =
    compositeMonths > 0 && compositeMonthlyRate > 0
      ? Math.round(
          (totalCompositeLoan * compositeMonthlyRate * Math.pow(1 + compositeMonthlyRate, compositeMonths)) /
            (Math.pow(1 + compositeMonthlyRate, compositeMonths) - 1)
        )
      : 0;

  const activeDrawdown = maxPlotLoan + Math.round((maxConstructionLoan * disbursedTranchePercent) / 100);
  const preEmiInterestOnly = Math.round((activeDrawdown * (compositeRate / 100)) / 12);

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getVerbalAmount = (num: number) => {
    if (num >= 10000000) {
      return `₹ ${(num / 10000000).toFixed(2)} Cr`;
    }
    if (num >= 100000) {
      return `₹ ${(num / 100000).toFixed(1)} Lakhs`;
    }
    return `₹ ${num.toLocaleString('en-IN')}`;
  };

  return (
    <div className="bg-[#f8f8f4] min-h-screen text-brand-navy">
      {/* ────────────────────────────────────────────────────────────
          1. CONTENT-SPECIFIC HERO: FINANCIAL INSTRUMENT SUITE
          ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#091522] text-white pt-16 pb-16 lg:pt-24 lg:pb-20 border-b border-brand-teal/20">
        {/* Subtle Atmospheric Light Orbs */}
        <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-brand-teal/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[550px] h-[550px] bg-sky-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-emerald-500/5 rounded-full blur-[160px] pointer-events-none" />

        <div className="w-[92%] sm:w-[88%] lg:w-[85%] max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Heading */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-brand-teal/15 border border-brand-teal/30 text-brand-teal-light text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
                <span>Interactive Mortgage Analytics &amp; FOIR Engine</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight font-heading leading-tight text-white">
                Mortgage, FOIR &amp; <br />
                <span className="text-[#38bdf8] drop-shadow-[0_4px_22px_rgba(56,189,248,0.65)] font-extrabold">
                  Composite Plot Loan Calculator.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl">
                Simulate exact monthly repayment schedules, test your borrowing ceiling against banking FOIR thresholds, or model interest-only pre-EMIs during phased villa construction.
              </p>

              {/* Mode Switcher Tabs inside Hero */}
              <div className="pt-2 flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={() => setCalcMode('emi')}
                  className={`px-5 py-3 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                    calcMode === 'emi'
                      ? 'bg-brand-teal text-white shadow-lg shadow-teal-500/30 border border-teal-400/50 scale-102'
                      : 'bg-white/[0.06] text-slate-300 hover:text-white hover:bg-white/[0.12] border border-white/10 backdrop-blur-md'
                  }`}
                >
                  <CalcIcon className="w-4 h-4 text-emerald-300" />
                  <span>1. Standard EMI Outflow</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCalcMode('eligibility')}
                  className={`px-5 py-3 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                    calcMode === 'eligibility'
                      ? 'bg-brand-teal text-white shadow-lg shadow-teal-500/30 border border-teal-400/50 scale-102'
                      : 'bg-white/[0.06] text-slate-300 hover:text-white hover:bg-white/[0.12] border border-white/10 backdrop-blur-md'
                  }`}
                >
                  <UserCheck className="w-4 h-4 text-emerald-300" />
                  <span>2. FOIR &amp; Max Borrowing</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCalcMode('composite')}
                  className={`px-5 py-3 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                    calcMode === 'composite'
                      ? 'bg-brand-teal text-white shadow-lg shadow-teal-500/30 border border-teal-400/50 scale-102'
                      : 'bg-white/[0.06] text-slate-300 hover:text-white hover:bg-white/[0.12] border border-white/10 backdrop-blur-md'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-emerald-300" />
                  <span>3. Composite Plot + Construction</span>
                </button>
              </div>
            </div>

            {/* Right Column: Live Banking Benchmark Cards */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#102235]/90 to-[#0a1826]/90 backdrop-blur-xl border border-white/15 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs uppercase font-bold tracking-wider text-brand-teal-light font-heading">
                  Active Banking Guidelines (RBI EBLR)
                </span>
                <span className="text-[10px] text-emerald-400 font-mono font-bold">Live Benchmarks</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                  <span className="text-gray-400 block text-[11px]">RBI Repo Rate:</span>
                  <span className="font-mono text-white text-base font-bold">6.50%</span>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                  <span className="text-gray-400 block text-[11px]">Starting Home Loan ROI:</span>
                  <span className="font-mono text-emerald-400 text-base font-bold">7.25%*</span>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                  <span className="text-gray-400 block text-[11px]">Standard Bank FOIR:</span>
                  <span className="font-mono text-sky-300 text-base font-bold">50% – 65%</span>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                  <span className="text-gray-400 block text-[11px]">Prepayment Penalty:</span>
                  <span className="font-mono text-white text-base font-bold">Zero (Floating)</span>
                </div>
              </div>

              <p className="text-[11px] text-gray-300 leading-relaxed pt-1">
                Repo-Linked Lending Rates (RLLR) ensure that external rate changes automatically pass through to you on scheduled quarterly resets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────
          2. INTERACTIVE SLIDER DASHBOARD
          ──────────────────────────────────────────────────────────── */}
      <section className="pt-12 sm:pt-16 pb-16 bg-[#f8f8f4]">
        <div className="w-[92%] sm:w-[88%] lg:w-[85%] max-w-7xl mx-auto">
          {calcMode === 'emi' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
              <div className="lg:col-span-7 bg-white/95 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-brand-border/80 shadow-card ring-1 ring-slate-900/5 space-y-7">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-teal-light text-brand-teal text-xs font-bold uppercase tracking-wider mb-2 font-heading">
                    <CalcIcon className="w-3.5 h-3.5" />
                    <span>Mode 01 Simulation</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-brand-navy font-heading">
                    Standard Monthly EMI Simulation
                  </h2>
                  <p className="text-xs sm:text-sm text-brand-slate mt-1">
                    Adjust loan principal, interest rates, and loan horizons to inspect your repayment schedule.
                  </p>
                </div>

                {/* Slider 1: Loan Amount */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs sm:text-sm font-bold text-brand-navy font-heading">Loan Amount Required</label>
                    <span className="text-base sm:text-lg font-black text-brand-teal font-mono">{formatINR(loanAmount)}</span>
                  </div>
                  <input
                    type="range"
                    min="500000"
                    max="100000000"
                    step="250000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-teal"
                  />
                  <div className="flex justify-between text-[11px] text-brand-slate font-medium">
                    <span>₹ 5 Lakhs</span>
                    <span className="font-bold text-brand-navy">{getVerbalAmount(loanAmount)}</span>
                    <span>₹ 10 Crores</span>
                  </div>
                  {/* Quick Preset Buttons */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {[
                      { label: '₹25L', val: 2500000 },
                      { label: '₹50L', val: 5000000 },
                      { label: '₹75L', val: 7500000 },
                      { label: '₹1 Cr', val: 10000000 },
                      { label: '₹2 Cr', val: 20000000 },
                      { label: '₹5 Cr', val: 50000000 },
                    ].map((chip) => (
                      <button
                        key={chip.val}
                        type="button"
                        onClick={() => setLoanAmount(chip.val)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                          loanAmount === chip.val
                            ? 'bg-brand-teal text-white shadow-2xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Slider 2: Interest Rate */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs sm:text-sm font-bold text-brand-navy font-heading">Indicative Annual Interest Rate (% p.a.)</label>
                    <span className="text-base sm:text-lg font-black text-brand-teal font-mono">{interestRate.toFixed(2)} %</span>
                  </div>
                  <input
                    type="range"
                    min="7.25"
                    max="16.0"
                    step="0.05"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-teal"
                  />
                  <div className="flex justify-between text-[11px] text-brand-slate font-medium">
                    <span>7.25% (Prime Home Loan)</span>
                    <span>9.25% (Standard LAP)</span>
                    <span>16.00%</span>
                  </div>
                  {/* Quick Rate Presets */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {[
                      { label: '7.25% (Prime HL)', val: 7.25 },
                      { label: '7.75% (Standard HL)', val: 7.75 },
                      { label: '8.50% (Prime LAP)', val: 8.50 },
                      { label: '9.25% (Comm. LAP)', val: 9.25 },
                      { label: '10.50% (Project)', val: 10.50 },
                    ].map((chip) => (
                      <button
                        key={chip.val}
                        type="button"
                        onClick={() => setInterestRate(chip.val)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                          interestRate === chip.val
                            ? 'bg-brand-teal text-white shadow-2xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Slider 3: Tenure */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs sm:text-sm font-bold text-brand-navy font-heading">Repayment Horizon (Tenure in Years)</label>
                    <span className="text-base sm:text-lg font-black text-brand-teal font-mono">{tenureYears} Years ({totalMonths} Months)</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    step="1"
                    value={tenureYears}
                    onChange={(e) => setTenureYears(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-teal"
                  />
                  <div className="flex justify-between text-[11px] text-brand-slate font-medium">
                    <span>1 Year</span>
                    <span>15 Years (Standard Mortgage)</span>
                    <span>30 Years (Max Home Loan)</span>
                  </div>
                  {/* Quick Tenure Presets */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {[5, 10, 15, 20, 25, 30].map((yr) => (
                      <button
                        key={yr}
                        type="button"
                        onClick={() => setTenureYears(yr)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                          tenureYears === yr
                            ? 'bg-brand-teal text-white shadow-2xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {yr} Years
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Cockpit Card: Outflow Analytics */}
              <div className="lg:col-span-5 bg-gradient-to-br from-[#091522] via-[#0d2238] to-[#122e4a] text-white p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/15 space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-teal/10 rounded-full blur-3xl pointer-events-none" />

                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-teal-light font-heading block">Estimated Monthly Outflow</span>
                  <div className="mt-2 text-3xl sm:text-4xl font-extrabold text-white font-mono">
                    {formatINR(emi)}
                    <span className="text-xs font-normal text-slate-300 block sm:inline sm:ml-2 font-sans">/ month</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-emerald-400">Principal: {principalPercent}%</span>
                    <span className="text-sky-300">Interest: {interestPercent}%</span>
                  </div>
                  <div className="h-3.5 w-full bg-white/10 rounded-full overflow-hidden flex border border-white/10">
                    <div style={{ width: `${principalPercent}%` }} className="bg-emerald-500 h-full transition-all duration-300" />
                    <div style={{ width: `${interestPercent}%` }} className="bg-sky-400 h-full transition-all duration-300" />
                  </div>
                </div>

                <div className="space-y-3 pt-2 text-xs sm:text-sm">
                  <div className="flex justify-between items-center p-3.5 rounded-xl bg-white/[0.05] border border-white/10 backdrop-blur-md">
                    <span className="text-slate-300 font-medium">Principal Borrowed:</span>
                    <span className="font-bold text-white font-mono">{formatINR(loanAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3.5 rounded-xl bg-white/[0.05] border border-white/10 backdrop-blur-md">
                    <span className="text-slate-300 font-medium">Total Interest Over Tenure:</span>
                    <span className="font-bold text-sky-300 font-mono">{formatINR(totalInterest)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3.5 rounded-xl bg-white/[0.08] border border-white/20 backdrop-blur-md">
                    <span className="text-white font-bold">Total Repayment Amount:</span>
                    <span className="font-black text-emerald-400 font-mono">{formatINR(totalPayment)}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    to="/enquire"
                    className="w-full py-4 px-4 bg-brand-teal hover:bg-brand-teal-hover text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-teal-950/40 flex items-center justify-center gap-2 transition-all text-center cursor-pointer"
                  >
                    <span>Apply with this Repayment Quote</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {calcMode === 'eligibility' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
              <div className="lg:col-span-7 bg-white/95 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-brand-border/80 shadow-card ring-1 ring-slate-900/5 space-y-7">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-teal-light text-brand-teal text-xs font-bold uppercase tracking-wider mb-2 font-heading">
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Mode 02 Analysis</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-brand-navy font-heading">
                    Maximum Borrowing Capacity &amp; Banking FOIR
                  </h2>
                  <p className="text-xs sm:text-sm text-brand-slate mt-1">
                    Banks restrict maximum loan sanctions based on your Fixed Obligation to Income Ratio (FOIR).
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs sm:text-sm font-bold text-brand-navy font-heading">Net Monthly Take-Home Income</label>
                    <span className="text-base sm:text-lg font-black text-brand-teal font-mono">{formatINR(monthlyIncome)}</span>
                  </div>
                  <input
                    type="range"
                    min="30000"
                    max="1000000"
                    step="10000"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-teal"
                  />
                  <div className="flex justify-between text-[11px] text-brand-slate font-medium">
                    <span>₹ 30,000 / mo</span>
                    <span className="font-bold text-brand-navy">{getVerbalAmount(monthlyIncome)}</span>
                    <span>₹ 10 Lakhs / mo</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs sm:text-sm font-bold text-brand-navy font-heading">Existing Monthly Obligations (EMIs)</label>
                    <span className="text-base sm:text-lg font-black text-amber-700 font-mono">{formatINR(existingEmis)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="300000"
                    step="5000"
                    value={existingEmis}
                    onChange={(e) => setExistingEmis(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                  />
                  <div className="flex justify-between text-[11px] text-brand-slate font-medium">
                    <span>₹ 0 (Debt Free)</span>
                    <span className="font-bold text-brand-navy">{getVerbalAmount(existingEmis)}</span>
                    <span>₹ 3 Lakhs / mo</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50/80 rounded-2xl border border-brand-border space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-brand-navy">
                    <span>Lender FOIR Benchmark Norm:</span>
                    <span className="text-brand-teal font-mono">{foirPercentage}% of Net Income</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-1 text-xs font-semibold">
                    {[50, 55, 65].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => setFoirPercentage(pct)}
                        className={`py-2 px-3 rounded-xl border text-center transition-all cursor-pointer ${
                          foirPercentage === pct
                            ? 'bg-brand-navy text-white border-brand-navy shadow-sm'
                            : 'bg-white text-brand-slate border-slate-200 hover:border-brand-teal'
                        }`}
                      >
                        {pct}% {pct === 50 ? '(Conservative)' : pct === 55 ? '(Standard Bank)' : '(High Income)'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Cockpit Card: Eligibility Analytics */}
              <div className="lg:col-span-5 bg-gradient-to-br from-[#091522] via-[#0d2238] to-[#122e4a] text-white p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/15 space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-teal-light font-heading block">
                    Estimated Maximum Loan Capacity
                  </span>
                  <div className="mt-2 text-3xl sm:text-4xl font-extrabold text-white font-mono">
                    {formatINR(maxLoanEligible)}
                  </div>
                  <span className="text-xs font-medium text-emerald-300 bg-emerald-500/20 px-2.5 py-1 rounded inline-block mt-2">
                    Governed by {foirPercentage}% banking FOIR threshold
                  </span>
                </div>

                <div className="space-y-3 pt-2 text-xs sm:text-sm">
                  <div className="flex justify-between items-center p-3.5 rounded-xl bg-white/[0.05] border border-white/10 backdrop-blur-md">
                    <span className="text-slate-300 font-medium">Permissible Monthly EMI:</span>
                    <span className="font-bold text-white font-mono">{formatINR(permissibleEmi)} / mo</span>
                  </div>
                  <div className="flex justify-between items-center p-3.5 rounded-xl bg-white/[0.05] border border-white/10 backdrop-blur-md">
                    <span className="text-slate-300 font-medium">Current Obligation Drain:</span>
                    <span className="font-bold text-amber-400 font-mono">{formatINR(existingEmis)} / mo</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    to="/enquire"
                    className="w-full py-4 px-4 bg-brand-teal hover:bg-brand-teal-hover text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-teal-950/40 flex items-center justify-center gap-2 transition-all text-center cursor-pointer"
                  >
                    <span>Request Full Multi-Bank Assessment</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {calcMode === 'composite' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
              <div className="lg:col-span-7 bg-white/95 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-brand-border/80 shadow-card ring-1 ring-slate-900/5 space-y-7">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-teal-light text-brand-teal text-xs font-bold uppercase tracking-wider mb-2 font-heading">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Mode 03 Simulation</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-brand-navy font-heading">
                    Plot Purchase + House Construction Financing
                  </h2>
                  <p className="text-xs sm:text-sm text-brand-slate mt-1">
                    Calculate funding split between land acquisition and phased civil construction disbursements.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs sm:text-sm font-bold text-brand-navy font-heading">Plot / Land Purchase Cost (A-Khata / DTCP / BDA)</label>
                    <span className="text-base sm:text-lg font-black text-brand-teal font-mono">{formatINR(plotCost)}</span>
                  </div>
                  <input
                    type="range"
                    min="1500000"
                    max="50000000"
                    step="250000"
                    value={plotCost}
                    onChange={(e) => setPlotCost(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-teal"
                  />
                  <div className="flex justify-between text-[11px] text-brand-slate font-medium">
                    <span>₹ 15 Lakhs</span>
                    <span className="font-bold text-brand-navy">70% Max LTV: {formatINR(maxPlotLoan)}</span>
                    <span>₹ 5 Crores</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs sm:text-sm font-bold text-brand-navy font-heading">Estimated House Construction Budget</label>
                    <span className="text-base sm:text-lg font-black text-brand-teal font-mono">{formatINR(constructionCost)}</span>
                  </div>
                  <input
                    type="range"
                    min="2000000"
                    max="50000000"
                    step="250000"
                    value={constructionCost}
                    onChange={(e) => setConstructionCost(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-teal"
                  />
                  <div className="flex justify-between text-[11px] text-brand-slate font-medium">
                    <span>₹ 20 Lakhs</span>
                    <span className="font-bold text-brand-navy">80% Max LTV: {formatINR(maxConstructionLoan)}</span>
                    <span>₹ 5 Crores</span>
                  </div>
                </div>

                <div className="space-y-3 p-4 bg-slate-50/80 rounded-2xl border border-brand-border">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-brand-navy">Simulated Construction Stage Drawdown:</label>
                    <span className="text-sm font-black text-brand-teal font-mono">{disbursedTranchePercent}% Disbursed</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="25"
                    value={disbursedTranchePercent}
                    onChange={(e) => setDisbursedTranchePercent(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-teal"
                  />
                  <div className="flex justify-between text-[10px] text-brand-slate font-medium">
                    <span>0% (Plot Only)</span>
                    <span>25% (Foundation)</span>
                    <span>50% (Slab Complete)</span>
                    <span>75% (Finishing)</span>
                    <span>100% (Completed)</span>
                  </div>
                </div>
              </div>

              {/* Right Cockpit Card: Composite Project Analytics */}
              <div className="lg:col-span-5 bg-gradient-to-br from-[#091522] via-[#0d2238] to-[#122e4a] text-white p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/15 space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-teal/10 rounded-full blur-3xl pointer-events-none" />

                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-teal-light font-heading block">
                    Total Project Debt Sanction
                  </span>
                  <div className="mt-2 text-3xl sm:text-4xl font-extrabold text-white font-mono">
                    {formatINR(totalCompositeLoan)}
                  </div>
                  <span className="text-xs font-medium text-emerald-300 bg-emerald-500/20 px-2.5 py-1 rounded inline-block mt-2">
                    Total Outlay: {formatINR(totalProjectCost)} (Self: {formatINR(selfContribution)})
                  </span>
                </div>

                <div className="space-y-3 pt-2 text-xs sm:text-sm">
                  <div className="flex justify-between items-center p-3.5 rounded-xl bg-white/[0.05] border border-white/10 backdrop-blur-md">
                    <span className="text-slate-300 font-medium">Plot Loan Sanction (70%):</span>
                    <span className="font-bold text-white font-mono">{formatINR(maxPlotLoan)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3.5 rounded-xl bg-white/[0.05] border border-white/10 backdrop-blur-md">
                    <span className="text-slate-300 font-medium">Construction Sanction (80%):</span>
                    <span className="font-bold text-white font-mono">{formatINR(maxConstructionLoan)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
                    <div>
                      <span className="text-amber-300 font-bold block">Active Pre-EMI (Interest Only):</span>
                      <span className="text-[10px] text-slate-300">At {disbursedTranchePercent}% construction stage</span>
                    </div>
                    <span className="font-black text-amber-300 font-mono text-base">{formatINR(preEmiInterestOnly)} / mo</span>
                  </div>
                  <div className="flex justify-between items-center p-3.5 rounded-xl bg-white/[0.08] border border-white/20">
                    <span className="text-white font-bold">Full EMI (Upon Handover):</span>
                    <span className="font-black text-emerald-400 font-mono text-base">{formatINR(fullCompositeEmi)} / mo</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    to="/enquire"
                    className="w-full py-4 px-4 bg-brand-teal hover:bg-brand-teal-hover text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-teal-950/40 flex items-center justify-center gap-2 transition-all text-center cursor-pointer"
                  >
                    <span>Consult on Composite Plot Loan</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Institutional Banking Benchmark Strip */}
          <div className="mt-12 p-4 sm:px-8 rounded-2xl bg-white border border-brand-border/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-slate-600">
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 justify-center sm:justify-start">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span className="font-semibold text-brand-navy">RBI EBLR Benchmark Pegged</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span className="font-semibold text-brand-navy">Zero Prepayment Penalty on Floating Rates</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span className="font-semibold text-brand-navy">Direct Zonal Processing Desk</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-500 text-xs justify-center mx-auto sm:mx-0">
              <ShieldCheck className="w-4 h-4 text-brand-teal" />
              <span>Certified Multi-Bank Loan Syndication Desk</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
