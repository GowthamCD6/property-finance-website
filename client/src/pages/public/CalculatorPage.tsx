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
  FileCheck,
  TrendingUp,
  UserCheck,
  ShieldCheck,
  Info,
} from 'lucide-react';

export const CalculatorPage: React.FC = () => {
  const [calcMode, setCalcMode] = useState<'emi' | 'eligibility'>('emi');

  // Mode 1: EMI Calculator States
  const [loanAmount, setLoanAmount] = useState<number>(5000000); // 50 Lakhs default
  const [interestRate, setInterestRate] = useState<number>(8.75); // 8.75% default
  const [tenureYears, setTenureYears] = useState<number>(20); // 20 years default

  // Mode 2: Eligibility Calculator States
  const [monthlyIncome, setMonthlyIncome] = useState<number>(150000); // ₹1.5 Lakhs net
  const [existingEmis, setExistingEmis] = useState<number>(20000); // ₹20k existing EMIs
  const [eligibilityTenure, setEligibilityTenure] = useState<number>(20); // 20 yrs
  const [eligibilityRate, setEligibilityRate] = useState<number>(8.60); // 8.60%
  const [foirPercentage, setFoirPercentage] = useState<number>(55); // 55% FOIR norm standard in Indian banks

  // EMI Formula: E = P * r * (1 + r)^n / ((1 + r)^n - 1)
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

  // Eligibility Calculation:
  // Permissible EMI = (Monthly Income * FOIR%) - Existing EMIs
  // Max Loan = Permissible EMI * [ (1+r)^n - 1 ] / [ r * (1+r)^n ]
  const eligMonthlyRate = eligibilityRate / 12 / 100;
  const eligTotalMonths = eligibilityTenure * 12;
  const permissibleEmi = Math.max(0, (monthlyIncome * (foirPercentage / 100)) - existingEmis);

  const maxLoanEligible =
    eligTotalMonths > 0 && eligMonthlyRate > 0 && permissibleEmi > 0
      ? Math.round(
          (permissibleEmi * (Math.pow(1 + eligMonthlyRate, eligTotalMonths) - 1)) /
            (eligMonthlyRate * Math.pow(1 + eligMonthlyRate, eligTotalMonths))
        )
      : 0;

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
    <div>
      {/* 1. Header Banner */}
      <section className="bg-brand-ivory border-b border-brand-border py-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-brand-teal-light text-brand-teal text-xs font-bold uppercase tracking-wider mb-4">
              <CalcIcon className="w-4 h-4" />
              <span>Interactive Mortgage Analytics</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-navy tracking-tight">
              Property Loan EMI &amp; Eligibility Calculator
            </h1>
            <p className="mt-3 text-brand-slate text-base sm:text-lg leading-relaxed">
              Explore your tentative monthly repayment schedules or evaluate your maximum borrowing capacity based on Indian banking FOIR (Fixed Obligation to Income Ratio) norms.
            </p>

            {/* Mode Switcher */}
            <div className="mt-8 inline-flex items-center p-1.5 bg-white border border-brand-border rounded-xl shadow-xs">
              <button
                onClick={() => setCalcMode('emi')}
                className={`px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                  calcMode === 'emi'
                    ? 'bg-brand-teal text-white shadow-sm'
                    : 'text-brand-navy hover:text-brand-teal'
                }`}
              >
                1. Monthly EMI Calculator
              </button>
              <button
                onClick={() => setCalcMode('eligibility')}
                className={`px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                  calcMode === 'eligibility'
                    ? 'bg-brand-teal text-white shadow-sm'
                    : 'text-brand-navy hover:text-brand-teal'
                }`}
              >
                2. Max Loan Eligibility &amp; FOIR Estimator
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Calculator Section */}
      <section className="py-14 sm:py-18">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {calcMode === 'emi' ? (
            /* TAB 1: STANDARD EMI CALCULATOR */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Sliders Input Column (7 cols) */}
              <div className="lg:col-span-7 bg-brand-ivory/50 p-6 sm:p-8 rounded-2xl border border-brand-border shadow-subtle space-y-8">
                {/* Slider 1: Loan Amount */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs sm:text-sm font-bold text-brand-navy">
                      Loan Amount Required
                    </label>
                    <span className="text-base font-extrabold text-brand-teal font-mono">
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
                      Indicative Interest Rate (% p.a.)
                    </label>
                    <span className="text-base font-extrabold text-brand-teal font-mono">
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
                    <span>7.50% (Prime HL)</span>
                    <span>9.50% (LAP Standard)</span>
                    <span>16.00%</span>
                  </div>
                </div>

                {/* Slider 3: Loan Tenure */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs sm:text-sm font-bold text-brand-navy">
                      Loan Tenure (Years)
                    </label>
                    <span className="text-base font-extrabold text-brand-teal font-mono">
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
                    <span>15 Years (Standard LAP)</span>
                    <span>30 Years (Home Loan Max)</span>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-brand-border text-xs text-brand-slate leading-relaxed">
                  <span className="font-semibold text-brand-navy block mb-0.5">Disclaimer:</span>
                  This calculation is for illustrative estimation purposes only. Final EMI, interest rate, and sanction terms are set by the designated lending institution following complete underwriting and credit evaluation.
                </div>
              </div>

              {/* Results & Breakdown Column (5 cols) */}
              <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-brand-teal/30 shadow-card space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-teal block">
                    Estimated Monthly Outflow
                  </span>
                  <div className="mt-2 text-3xl sm:text-4xl font-extrabold text-brand-navy font-mono">
                    {formatINR(emi)}
                    <span className="text-xs font-normal text-brand-slate block sm:inline sm:ml-2">/ month</span>
                  </div>
                </div>

                {/* Visual Breakdown Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-brand-teal">Principal: {principalPercent}%</span>
                    <span className="text-brand-slate">Interest: {interestPercent}%</span>
                  </div>
                  <div className="h-3 w-full bg-brand-ivory rounded-full overflow-hidden flex border border-brand-border">
                    <div
                      style={{ width: `${principalPercent}%` }}
                      className="bg-brand-teal h-full transition-all duration-300"
                    />
                    <div
                      style={{ width: `${interestPercent}%` }}
                      className="bg-amber-500/80 h-full transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Breakdown Cards */}
                <div className="space-y-3 pt-2 text-xs sm:text-sm">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-brand-ivory/60 border border-brand-border/60">
                    <span className="text-brand-slate font-medium">Principal Borrowed:</span>
                    <span className="font-bold text-brand-navy font-mono">{formatINR(loanAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-brand-ivory/60 border border-brand-border/60">
                    <span className="text-brand-slate font-medium">Total Interest Payable:</span>
                    <span className="font-bold text-amber-700 font-mono">{formatINR(totalInterest)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-brand-teal-light border border-brand-teal/20">
                    <span className="text-brand-navy font-bold">Total Repayment Amount:</span>
                    <span className="font-extrabold text-brand-teal font-mono">{formatINR(totalPayment)}</span>
                  </div>
                </div>

                {/* CTA */}
                <div className="pt-2">
                  <Link
                    to="/enquire"
                    className="w-full py-3.5 px-4 bg-brand-teal hover:bg-brand-teal-hover text-white text-xs sm:text-sm font-semibold rounded-corporate shadow-sm flex items-center justify-center gap-2 transition-colors text-center"
                  >
                    <span>Discuss Loan Application with this Quote</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            /* TAB 2: ELIGIBILITY & FOIR ESTIMATOR */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Sliders Input Column (7 cols) */}
              <div className="lg:col-span-7 bg-brand-ivory/50 p-6 sm:p-8 rounded-2xl border border-brand-border shadow-subtle space-y-8">
                {/* Income Slider */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs sm:text-sm font-bold text-brand-navy">
                      Net Monthly Take-Home Income (Salary / Business Profit)
                    </label>
                    <span className="text-base font-extrabold text-brand-teal font-mono">
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
                      Existing Monthly EMI Obligations (Car, Personal, Credit Cards)
                    </label>
                    <span className="text-base font-extrabold text-amber-700 font-mono">
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
                <div className="p-4 bg-white rounded-xl border border-brand-border space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-brand-navy">
                    <span>Bank FOIR Benchmark Norm:</span>
                    <span className="text-brand-teal">{foirPercentage}% of Net Income</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-1 text-xs font-semibold">
                    {[50, 55, 65].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => setFoirPercentage(pct)}
                        className={`py-2 px-3 rounded-lg border text-center transition-colors ${
                          foirPercentage === pct
                            ? 'bg-brand-navy text-white border-brand-navy'
                            : 'bg-brand-ivory text-brand-slate border-gray-200 hover:border-brand-teal'
                        }`}
                      >
                        {pct}% {pct === 50 ? '(Conservative)' : pct === 55 ? '(Standard Bank)' : '(High Earner)'}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-brand-slate pt-1 leading-relaxed">
                    FOIR (Fixed Obligation to Income Ratio) is the percentage of your monthly income that banks allow toward total EMI repayments.
                  </p>
                </div>
              </div>

              {/* Eligibility Results Card (5 cols) */}
              <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-brand-teal/40 shadow-card space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-teal block">
                    Estimated Maximum Loan Capacity
                  </span>
                  <div className="mt-2 text-3xl sm:text-4xl font-extrabold text-brand-navy font-mono">
                    {formatINR(maxLoanEligible)}
                  </div>
                  <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded inline-block mt-2">
                    Based on {foirPercentage}% banking FOIR threshold
                  </span>
                </div>

                <div className="space-y-3 pt-2 text-xs sm:text-sm">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-brand-ivory/60 border border-brand-border/60">
                    <span className="text-brand-slate font-medium">Permissible Monthly EMI:</span>
                    <span className="font-bold text-brand-navy font-mono">{formatINR(permissibleEmi)} / mo</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-brand-ivory/60 border border-brand-border/60">
                    <span className="text-brand-slate font-medium">Current Obligation Drain:</span>
                    <span className="font-bold text-amber-700 font-mono">{formatINR(existingEmis)} / mo</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-brand-teal-light border border-brand-teal/20">
                    <span className="text-brand-navy font-bold">Unleveraged Net Income:</span>
                    <span className="font-extrabold text-brand-teal font-mono">{formatINR(monthlyIncome - existingEmis)} / mo</span>
                  </div>
                </div>

                <div className="p-4 bg-brand-ivory rounded-xl border border-brand-border text-xs text-brand-slate leading-relaxed">
                  <div className="flex items-center gap-2 font-bold text-brand-navy mb-1">
                    <Info className="w-4 h-4 text-brand-teal" />
                    <span>How to enhance eligibility:</span>
                  </div>
                  Adding a co-borrower (spouse / earning family member), foreclosing small personal loans, or showing rental income can increase this loan ceiling by up to 35%–50%.
                </div>

                <div className="pt-2">
                  <Link
                    to="/enquire"
                    className="w-full py-3.5 px-4 bg-brand-teal hover:bg-brand-teal-hover text-white text-xs sm:text-sm font-semibold rounded-corporate shadow-sm flex items-center justify-center gap-2 transition-colors text-center"
                  >
                    <span>Check Multi-Bank Eligibility Report</span>
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
