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
} from 'lucide-react';

export const CalculatorPage: React.FC = () => {
  const [calcMode, setCalcMode] = useState<'emi' | 'eligibility' | 'composite'>('emi');

  // Mode 1: Standard EMI States
  const [loanAmount, setLoanAmount] = useState<number>(5000000); // ₹50 Lakhs
  const [interestRate, setInterestRate] = useState<number>(8.65); // 8.65%
  const [tenureYears, setTenureYears] = useState<number>(20); // 20 years

  // Mode 2: Eligibility & FOIR States
  const [monthlyIncome, setMonthlyIncome] = useState<number>(150000); // ₹1.5 Lakhs net
  const [existingEmis, setExistingEmis] = useState<number>(20000); // ₹20k existing EMIs
  const [eligibilityTenure, setEligibilityTenure] = useState<number>(20); // 20 yrs
  const [eligibilityRate, setEligibilityRate] = useState<number>(8.60); // 8.60%
  const [foirPercentage, setFoirPercentage] = useState<number>(55); // 55% FOIR norm standard in Indian banks

  // Mode 3: Composite Plot + Construction Loan States
  const [plotCost, setPlotCost] = useState<number>(4000000); // ₹40 Lakhs plot
  const [constructionCost, setConstructionCost] = useState<number>(5000000); // ₹50 Lakhs construction
  const [compositeRate, setCompositeRate] = useState<number>(8.75); // 8.75%
  const [compositeTenure, setCompositeTenure] = useState<number>(20); // 20 yrs
  const [disbursedTranchePercent, setDisbursedTranchePercent] = useState<number>(50); // 50% construction done

  // Mode 1 Calculations: EMI Formula: E = P * r * (1 + r)^n / ((1 + r)^n - 1)
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

  // Mode 2 Calculations: Permissible EMI = (Monthly Income * FOIR%) - Existing EMIs
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

  // Mode 3 Calculations: Plot Loan (70% LTV) + Construction Loan (80% LTV)
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

  // Pre-EMI during construction: Interest only on plot loan + disbursed construction tranche
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
    <div className="bg-white">
      {/* 1. Header Hero Banner */}
      <section className="relative bg-gradient-to-br from-brand-navy via-[#102434] to-[#0A1824] text-white pt-20 pb-20 lg:pt-24 lg:pb-24 border-b border-white/10 overflow-hidden">
        {/* Ambient Backdrops */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-teal/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-teal/20 border border-brand-teal/30 text-brand-teal-light text-xs font-bold uppercase tracking-wider mb-5">
              <CalcIcon className="w-4 h-4 text-brand-teal" />
              <span>Interactive Financial Simulator</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight font-heading leading-tight sm:leading-tight">
              Mortgage &amp; Land Loan <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-teal via-emerald-400 to-brand-gold">
                Financial Calculator Suite
              </span>
            </h1>

            <p className="mt-5 text-gray-300 text-base sm:text-lg lg:text-xl font-normal leading-relaxed max-w-3xl">
              Model your monthly cash outgo, verify maximum loan ceiling against Indian banking FOIR guidelines, or calculate composite plot purchase and phased house construction pre-EMIs.
            </p>

            {/* Mode Switcher Tabs */}
            <div className="mt-10 inline-flex flex-wrap gap-2 p-1.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15">
              <button
                onClick={() => setCalcMode('emi')}
                className={`px-5 py-3 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center gap-2 ${
                  calcMode === 'emi'
                    ? 'bg-brand-teal text-white shadow-lg shadow-brand-teal/30 scale-102'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <CalcIcon className="w-4 h-4" />
                <span>1. Standard EMI Outflow</span>
              </button>
              <button
                onClick={() => setCalcMode('eligibility')}
                className={`px-5 py-3 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center gap-2 ${
                  calcMode === 'eligibility'
                    ? 'bg-brand-teal text-white shadow-lg shadow-brand-teal/30 scale-102'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>2. FOIR &amp; Max Borrowing Capacity</span>
              </button>
              <button
                onClick={() => setCalcMode('composite')}
                className={`px-5 py-3 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center gap-2 ${
                  calcMode === 'composite'
                    ? 'bg-brand-teal text-white shadow-lg shadow-brand-teal/30 scale-102'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>3. Composite Plot + Construction</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Calculator Section */}
      <section className="py-16 sm:py-20 bg-brand-ivory/50 border-b border-brand-border">
        <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-10">
          {calcMode === 'emi' && (
            /* TAB 1: STANDARD EMI CALCULATOR */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Sliders Input Column (7 cols) */}
              <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-brand-border shadow-subtle space-y-8">
                <div>
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
                    <label className="text-xs sm:text-sm font-bold text-brand-navy">
                      Loan Amount Required
                    </label>
                    <span className="text-base sm:text-lg font-black text-brand-teal font-mono">
                      {formatINR(loanAmount)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="500000"
                    max="100000000"
                    step="250000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-teal"
                  />
                  <div className="flex justify-between text-[11px] text-brand-slate font-medium">
                    <span>₹ 5 Lakhs</span>
                    <span className="font-bold text-brand-navy">{getVerbalAmount(loanAmount)}</span>
                    <span>₹ 10 Crores</span>
                  </div>
                </div>

                {/* Slider 2: Interest Rate */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs sm:text-sm font-bold text-brand-navy">
                      Indicative Annual Interest Rate (% p.a.)
                    </label>
                    <span className="text-base sm:text-lg font-black text-brand-teal font-mono">
                      {interestRate.toFixed(2)} %
                    </span>
                  </div>
                  <input
                    type="range"
                    min="7.5"
                    max="16.0"
                    step="0.05"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-teal"
                  />
                  <div className="flex justify-between text-[11px] text-brand-slate font-medium">
                    <span>7.50% (Prime Home Loan)</span>
                    <span>9.25% (Standard LAP)</span>
                    <span>16.00%</span>
                  </div>
                </div>

                {/* Slider 3: Loan Tenure */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs sm:text-sm font-bold text-brand-navy">
                      Repayment Horizon (Tenure in Years)
                    </label>
                    <span className="text-base sm:text-lg font-black text-brand-teal font-mono">
                      {tenureYears} Years ({totalMonths} Months)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    step="1"
                    value={tenureYears}
                    onChange={(e) => setTenureYears(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-teal"
                  />
                  <div className="flex justify-between text-[11px] text-brand-slate font-medium">
                    <span>1 Year</span>
                    <span>15 Years (Standard Mortgage)</span>
                    <span>30 Years (Max Home Loan)</span>
                  </div>
                </div>

                <div className="p-4 bg-brand-ivory rounded-xl border border-brand-border text-xs text-brand-slate leading-relaxed">
                  <span className="font-semibold text-brand-navy block mb-0.5">Disclaimer:</span>
                  Calculations are based on monthly reducing balance amortization. Actual sanction interest rates and fees depend on CIBIL bureau tier and property classification.
                </div>
              </div>

              {/* Results & Breakdown Column (5 cols) */}
              <div className="lg:col-span-5 bg-gradient-to-br from-brand-navy to-[#183247] text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-teal-light block">
                    Estimated Monthly Outflow
                  </span>
                  <div className="mt-2 text-3xl sm:text-4xl font-extrabold text-white font-mono">
                    {formatINR(emi)}
                    <span className="text-xs font-normal text-gray-300 block sm:inline sm:ml-2">/ month</span>
                  </div>
                </div>

                {/* Visual Breakdown Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-emerald-400">Principal: {principalPercent}%</span>
                    <span className="text-brand-gold">Interest: {interestPercent}%</span>
                  </div>
                  <div className="h-3.5 w-full bg-white/10 rounded-full overflow-hidden flex border border-white/10">
                    <div
                      style={{ width: `${principalPercent}%` }}
                      className="bg-emerald-500 h-full transition-all duration-300"
                    />
                    <div
                      style={{ width: `${interestPercent}%` }}
                      className="bg-brand-gold h-full transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Breakdown Cards */}
                <div className="space-y-3 pt-2 text-xs sm:text-sm">
                  <div className="flex justify-between items-center p-3.5 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-gray-300 font-medium">Principal Borrowed:</span>
                    <span className="font-bold text-white font-mono">{formatINR(loanAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3.5 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-gray-300 font-medium">Total Interest Over Tenure:</span>
                    <span className="font-bold text-brand-gold font-mono">{formatINR(totalInterest)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3.5 rounded-xl bg-white/10 border border-white/20">
                    <span className="text-white font-bold">Total Repayment Amount:</span>
                    <span className="font-black text-emerald-400 font-mono">{formatINR(totalPayment)}</span>
                  </div>
                </div>

                {/* CTA */}
                <div className="pt-2">
                  <Link
                    to="/enquire"
                    className="w-full py-4 px-4 bg-brand-teal hover:bg-brand-teal-hover text-white text-xs sm:text-sm font-bold rounded-corporate shadow-lg shadow-brand-teal/20 flex items-center justify-center gap-2 transition-all text-center"
                  >
                    <span>Apply with this Repayment Quote</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {calcMode === 'eligibility' && (
            /* TAB 2: ELIGIBILITY & FOIR ESTIMATOR */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Sliders Input Column (7 cols) */}
              <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-brand-border shadow-subtle space-y-8">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-brand-navy font-heading">
                    Maximum Borrowing Capacity &amp; Banking FOIR
                  </h2>
                  <p className="text-xs sm:text-sm text-brand-slate mt-1">
                    Banks restrict maximum loan sanctions based on your Fixed Obligation to Income Ratio (FOIR).
                  </p>
                </div>

                {/* Income Slider */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs sm:text-sm font-bold text-brand-navy">
                      Net Monthly Take-Home Income (Salary / Business Profit)
                    </label>
                    <span className="text-base sm:text-lg font-black text-brand-teal font-mono">
                      {formatINR(monthlyIncome)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="30000"
                    max="1000000"
                    step="10000"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-teal"
                  />
                  <div className="flex justify-between text-[11px] text-brand-slate font-medium">
                    <span>₹ 30,000 / mo</span>
                    <span className="font-bold text-brand-navy">{getVerbalAmount(monthlyIncome)}</span>
                    <span>₹ 10 Lakhs / mo</span>
                  </div>
                </div>

                {/* Existing EMIs Slider */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs sm:text-sm font-bold text-brand-navy">
                      Existing Monthly Obligations (Car, Personal Loans, Active EMIs)
                    </label>
                    <span className="text-base sm:text-lg font-black text-amber-700 font-mono">
                      {formatINR(existingEmis)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="300000"
                    step="5000"
                    value={existingEmis}
                    onChange={(e) => setExistingEmis(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                  />
                  <div className="flex justify-between text-[11px] text-brand-slate font-medium">
                    <span>₹ 0 (Debt Free)</span>
                    <span className="font-bold text-brand-navy">{getVerbalAmount(existingEmis)}</span>
                    <span>₹ 3 Lakhs / mo</span>
                  </div>
                </div>

                {/* Target Tenure & Expected Rate */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-xs sm:text-sm font-bold text-brand-navy">
                        Tenure (Years)
                      </label>
                      <span className="text-sm font-extrabold text-brand-teal font-mono">
                        {eligibilityTenure} Yrs
                      </span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="30"
                      step="1"
                      value={eligibilityTenure}
                      onChange={(e) => setEligibilityTenure(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-teal"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-xs sm:text-sm font-bold text-brand-navy">
                        Expected Rate (% p.a.)
                      </label>
                      <span className="text-sm font-extrabold text-brand-teal font-mono">
                        {eligibilityRate.toFixed(2)} %
                      </span>
                    </div>
                    <input
                      type="range"
                      min="8.0"
                      max="14.0"
                      step="0.1"
                      value={eligibilityRate}
                      onChange={(e) => setEligibilityRate(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-teal"
                    />
                  </div>
                </div>

                {/* Banking FOIR Benchmark Selector */}
                <div className="p-4 bg-brand-ivory rounded-2xl border border-brand-border space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-brand-navy">
                    <span>Lender FOIR Benchmark Norm:</span>
                    <span className="text-brand-teal">{foirPercentage}% of Net Income</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-1 text-xs font-semibold">
                    {[50, 55, 65].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => setFoirPercentage(pct)}
                        className={`py-2 px-3 rounded-lg border text-center transition-all ${
                          foirPercentage === pct
                            ? 'bg-brand-navy text-white border-brand-navy'
                            : 'bg-white text-brand-slate border-gray-200 hover:border-brand-teal'
                        }`}
                      >
                        {pct}% {pct === 50 ? '(Conservative)' : pct === 55 ? '(Standard Bank)' : '(High Income)'}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-brand-slate pt-1 leading-relaxed">
                    FOIR represents the percentage of monthly income permitted for loan servicing under RBI retail risk guidelines.
                  </p>
                </div>
              </div>

              {/* Eligibility Results Card (5 cols) */}
              <div className="lg:col-span-5 bg-gradient-to-br from-brand-navy to-[#183247] text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-teal-light block">
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
                  <div className="flex justify-between items-center p-3.5 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-gray-300 font-medium">Permissible Monthly EMI:</span>
                    <span className="font-bold text-white font-mono">{formatINR(permissibleEmi)} / mo</span>
                  </div>
                  <div className="flex justify-between items-center p-3.5 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-gray-300 font-medium">Current Obligation Drain:</span>
                    <span className="font-bold text-amber-400 font-mono">{formatINR(existingEmis)} / mo</span>
                  </div>
                  <div className="flex justify-between items-center p-3.5 rounded-xl bg-white/10 border border-white/20">
                    <span className="text-white font-bold">Unleveraged Net Income:</span>
                    <span className="font-black text-emerald-400 font-mono">{formatINR(monthlyIncome - existingEmis)} / mo</span>
                  </div>
                </div>

                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-xs text-gray-300 leading-relaxed">
                  <div className="flex items-center gap-2 font-bold text-white mb-1">
                    <Info className="w-4 h-4 text-brand-teal" />
                    <span>How to enhance your loan limit:</span>
                  </div>
                  Adding a co-borrower (spouse / earning family member), foreclosing small personal loans, or reporting rental yields can increase your borrowing ceiling by up to 35%–50%.
                </div>

                <div className="pt-2">
                  <Link
                    to="/enquire"
                    className="w-full py-4 px-4 bg-brand-teal hover:bg-brand-teal-hover text-white text-xs sm:text-sm font-bold rounded-corporate shadow-lg shadow-brand-teal/20 flex items-center justify-center gap-2 transition-all text-center"
                  >
                    <span>Request Full Multi-Bank Assessment</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {calcMode === 'composite' && (
            /* TAB 3: COMPOSITE PLOT + CONSTRUCTION LOAN CALCULATOR */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Inputs Column (7 cols) */}
              <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-brand-border shadow-subtle space-y-8">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-brand-navy font-heading">
                    Plot Purchase + House Construction Financing
                  </h2>
                  <p className="text-xs sm:text-sm text-brand-slate mt-1">
                    Calculate funding split between land acquisition and phased civil construction disbursements.
                  </p>
                </div>

                {/* Plot Cost Slider */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs sm:text-sm font-bold text-brand-navy">
                      Plot / Land Purchase Cost (A-Khata / DTCP / BDA)
                    </label>
                    <span className="text-base sm:text-lg font-black text-brand-teal font-mono">
                      {formatINR(plotCost)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1500000"
                    max="50000000"
                    step="250000"
                    value={plotCost}
                    onChange={(e) => setPlotCost(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-teal"
                  />
                  <div className="flex justify-between text-[11px] text-brand-slate font-medium">
                    <span>₹ 15 Lakhs</span>
                    <span className="font-bold text-brand-navy">70% Max LTV: {formatINR(maxPlotLoan)}</span>
                    <span>₹ 5 Crores</span>
                  </div>
                </div>

                {/* Construction Cost Slider */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs sm:text-sm font-bold text-brand-navy">
                      Estimated House / Villa Construction Budget
                    </label>
                    <span className="text-base sm:text-lg font-black text-brand-teal font-mono">
                      {formatINR(constructionCost)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="2000000"
                    max="50000000"
                    step="250000"
                    value={constructionCost}
                    onChange={(e) => setConstructionCost(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-teal"
                  />
                  <div className="flex justify-between text-[11px] text-brand-slate font-medium">
                    <span>₹ 20 Lakhs</span>
                    <span className="font-bold text-brand-navy">80% Max LTV: {formatINR(maxConstructionLoan)}</span>
                    <span>₹ 5 Crores</span>
                  </div>
                </div>

                {/* Construction Progress Slider for Pre-EMI Simulation */}
                <div className="space-y-3 p-4 bg-brand-ivory rounded-2xl border border-brand-border">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-brand-navy">
                      Simulated Construction Stage Drawdown:
                    </label>
                    <span className="text-sm font-black text-brand-teal font-mono">
                      {disbursedTranchePercent}% Disbursed
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="25"
                    value={disbursedTranchePercent}
                    onChange={(e) => setDisbursedTranchePercent(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-teal"
                  />
                  <div className="flex justify-between text-[10px] text-brand-slate font-medium">
                    <span>0% (Plot Only)</span>
                    <span>25% (Foundation)</span>
                    <span>50% (Slab Complete)</span>
                    <span>75% (Finishing)</span>
                    <span>100% (Completed)</span>
                  </div>
                </div>

                {/* Construction Rule Note */}
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 leading-relaxed space-y-1">
                  <span className="font-bold block">Critical Land Finance Rule:</span>
                  Indian banking norms mandate construction completion within 2 to 3 years from plot loan disbursement. If construction does not commence, the bank reserves the right to charge commercial loan interest rates.
                </div>
              </div>

              {/* Composite Results Column (5 cols) */}
              <div className="lg:col-span-5 bg-gradient-to-br from-brand-navy to-[#183247] text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-teal-light block">
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
                  <div className="flex justify-between items-center p-3.5 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-gray-300 font-medium">Plot Loan Sanction (70%):</span>
                    <span className="font-bold text-white font-mono">{formatINR(maxPlotLoan)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3.5 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-gray-300 font-medium">Construction Sanction (80%):</span>
                    <span className="font-bold text-white font-mono">{formatINR(maxConstructionLoan)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <div>
                      <span className="text-brand-gold font-bold block">Active Pre-EMI (Interest Only):</span>
                      <span className="text-[10px] text-gray-400">At {disbursedTranchePercent}% construction stage</span>
                    </div>
                    <span className="font-black text-brand-gold font-mono text-base">{formatINR(preEmiInterestOnly)} / mo</span>
                  </div>
                  <div className="flex justify-between items-center p-3.5 rounded-xl bg-white/10 border border-white/20">
                    <span className="text-white font-bold">Full EMI (Upon Handover):</span>
                    <span className="font-black text-emerald-400 font-mono text-base">{formatINR(fullCompositeEmi)} / mo</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    to="/enquire"
                    className="w-full py-4 px-4 bg-brand-teal hover:bg-brand-teal-hover text-white text-xs sm:text-sm font-bold rounded-corporate shadow-lg shadow-brand-teal/20 flex items-center justify-center gap-2 transition-all text-center"
                  >
                    <span>Consult on Composite Plot Loan</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
