import React, { useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  HelpCircle,
  Search,
  ChevronDown,
  ArrowRight,
  Landmark,
  Building2,
  FileText,
  Scale,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  PhoneCall,
} from 'lucide-react';
import { Faq } from '../../types';

export const FaqsPage: React.FC = () => {
  const context = useOutletContext<{ faqs?: Faq[] }>();
  const apiFaqs = context?.faqs || [];

  const defaultAdvisorFaqs: Faq[] = [
    // Category: Land & Plot Loans
    {
      id: 'faq-1',
      question: 'Can I secure a bank loan for purchasing an agricultural land plot?',
      answer:
        'Standard retail residential and commercial land loans are only extended to non-agricultural, converted land plots holding a valid Deputy Commissioner (DC) conversion order with layout sanctions from local planning authorities (e.g. BDA, DTCP, HMDA, PMRDA). Agricultural land loans are generally restricted to Kisan Credit / rural agricultural finance and are not eligible for standard home mortgage pricing.',
      category: 'Land & Plot Loans',
      displayOrder: 1,
      isPublished: true,
    },
    {
      id: 'faq-2',
      question: 'What is the difference between an A-Khata plot and a B-Khata plot for bank loans?',
      answer:
        'An A-Khata property document certifies that the land parcel has received all statutory layout approvals, paid betterment charges, and is fully registered with the municipal corporation. Scheduled commercial banks (SBI, HDFC, ICICI, Bank of Baroda) lend readily on A-Khata properties at prime rates (up to 75% LTV). B-Khata properties represent tax-paying entries with pending civic layout approvals; standard public sector banks do not finance B-Khata properties, though select specialized NBFCs may consider them under higher risk spreads.',
      category: 'Land & Plot Loans',
      displayOrder: 2,
      isPublished: true,
    },
    {
      id: 'faq-3',
      question: 'What is a Composite Plot + Construction Loan, and what is the 2-3 year construction mandate?',
      answer:
        'A composite loan finances both the purchase of a residential site (plot) and the subsequent construction of a house or villa on it. Indian banking guidelines mandate that borrowers must commence and complete construction within 2 to 3 years from the date of the plot loan disbursement. If construction does not begin within this window, lenders reserve the contractual right to convert the loan into a commercial facility, increasing interest rates by 2% to 4%.',
      category: 'Land & Plot Loans',
      displayOrder: 3,
      isPublished: true,
    },
    {
      id: 'faq-4',
      question: 'What is the maximum Loan-to-Value (LTV) ratio permitted on standalone plot purchases?',
      answer:
        'While ready-to-move residential apartments attract up to 75% - 80% LTV, standalone plot purchase loans are typically capped at 70% to 75% of the registered agreement value or the bank valuer’s fair market appraisal, whichever is lower. The buyer must fund the remaining 25% - 30% plus stamp duty and registration fees as own contribution.',
      category: 'Land & Plot Loans',
      displayOrder: 4,
      isPublished: true,
    },

    // Category: Home Loans
    {
      id: 'faq-5',
      question: 'How do banks determine my maximum home loan eligibility via FOIR?',
      answer:
        'Banks use the Fixed Obligation to Income Ratio (FOIR). For salaried individuals earning above ₹1,00,000/month, banks generally permit a FOIR of 50% to 65%. This means your total monthly loan repayments (including the proposed new home loan EMI and existing car/personal EMIs) cannot exceed 50% - 65% of your net take-home salary. For self-employed individuals, FOIR can extend up to 70% based on audited cash flows and depreciation add-backs.',
      category: 'Home Loans',
      displayOrder: 5,
      isPublished: true,
    },
    {
      id: 'faq-6',
      question: 'What is the difference between RLLR (Repo-Linked Rate) and MCLR for home loans?',
      answer:
        'RLLR (Repo-Linked Lending Rate) is pegged directly to the Reserve Bank of India’s benchmark repo rate. When the RBI raises or cuts rates, banks must pass the rate revision to retail borrowers within a quarterly reset window, ensuring complete transparency. MCLR (Marginal Cost of Funds Based Lending Rate) is tied to the bank’s internal cost of funds and resets only on predetermined annual or semi-annual dates. All new retail floating loans are governed by external benchmarks like RLLR.',
      category: 'Home Loans',
      displayOrder: 6,
      isPublished: true,
    },
    {
      id: 'faq-7',
      question: 'What tax benefits can I claim under Section 24(b) and Section 80C on home loans?',
      answer:
        'Under Section 24(b) of the Income Tax Act, you can deduct up to ₹2,00,000 annually against interest paid on a self-occupied residential property loan. Under Section 80C, you can claim up to ₹1,50,000 on the principal repayment component (within the overall 80C basket). For joint borrowers (e.g. husband and wife co-owning the property and co-borrowing), both applicants can claim these deductions individually, doubling tax savings up to ₹7,00,000 combined.',
      category: 'Home Loans',
      displayOrder: 7,
      isPublished: true,
    },
    {
      id: 'faq-8',
      question: 'What is Pre-EMI during the construction phase of an apartment or villa?',
      answer:
        'Pre-EMI is the monthly interest payable only on the portion of the loan disbursed by the bank based on construction milestones (e.g., plinth, slab, brickwork). You do not pay any principal during this period. Full EMI (Principal + Interest) commences only once construction is completed and the final disbursement tranche is released.',
      category: 'Home Loans',
      displayOrder: 8,
      isPublished: true,
    },

    // Category: Loan Against Property (LAP)
    {
      id: 'faq-9',
      question: 'What collateral is accepted for a Loan Against Property (LAP)?',
      answer:
        'Lenders accept clear-title freehold residential properties (independent houses, villas, apartments), commercial offices, retail shops, and select industrial warehouses. The property must have approved building plans, clear 30-year mother deed records, and an Encumbrance Certificate Form 15 showing zero prior mortgages or attachments.',
      category: 'Loan Against Property (LAP)',
      displayOrder: 9,
      isPublished: true,
    },
    {
      id: 'faq-10',
      question: 'What is the maximum LTV for commercial vs residential Loan Against Property?',
      answer:
        'Residential properties typically command an LTV of 65% to 75% of fair market valuation, offering the lowest interest rates starting around 9.25% p.a. Commercial properties (office spaces, retail outlets) usually qualify for 50% to 65% LTV, while industrial or warehouse properties receive 45% to 55% LTV depending on location and structural approvals.',
      category: 'Loan Against Property (LAP)',
      displayOrder: 10,
      isPublished: true,
    },
    {
      id: 'faq-11',
      question: 'How does Lease Rental Discounting (LRD) differ from a regular Loan Against Property?',
      answer:
        'In a standard LAP, the loan amount is primarily evaluated on your business or personal income and property valuation. In Lease Rental Discounting (LRD), the loan is underwritten on the future rental cash flows of a corporate tenant occupying your commercial asset. Gross rent is paid directly into a tripartite escrow account, from which the bank deducts the EMI and sweeps the remaining surplus to the landlord.',
      category: 'Loan Against Property (LAP)',
      displayOrder: 11,
      isPublished: true,
    },

    // Category: Legal & Title Due Diligence
    {
      id: 'faq-12',
      question: 'What is an Encumbrance Certificate (EC Form 15 vs Form 16)?',
      answer:
        'An Encumbrance Certificate (EC) issued by the Sub-Registrar office records all registered financial transactions and ownership transfers on a property. Form 15 lists all recorded transactions (sale deeds, mortgages, court attachments, gifts) over a specified period (typically 30 years). Form 16 (Nil Encumbrance) certifies that no registered encumbrances or charges exist on the property during the searched timeframe.',
      category: 'Legal & Title Due Diligence',
      displayOrder: 12,
      isPublished: true,
    },
    {
      id: 'faq-13',
      question: 'What is MODT (Memorandum of Deposit of Title Deeds)?',
      answer:
        'MODT is a formal legal document executed by the borrower declaring that original property title deeds have been voluntarily deposited with the lender as security for the loan. The MODT must be formally registered at the local Sub-Registrar office, attracting state-mandated stamp duty and registration charges (usually 0.2% to 0.5% of the sanctioned loan amount).',
      category: 'Legal & Title Due Diligence',
      displayOrder: 13,
      isPublished: true,
    },
    {
      id: 'faq-14',
      question: 'Can Non-Resident Indians (NRIs) obtain loans for purchasing land and houses in India?',
      answer:
        'Yes. Under RBI guidelines (FEMA), NRIs and OCIs can avail home and plot loans in India. Salaried NRIs require an NRE/NRO bank account, valid employment contract, salary slips attested by the Indian Embassy or verified through corporate email, and a designated Power of Attorney (POA) holder resident in India to execute local Sub-Registrar documentation.',
      category: 'Legal & Title Due Diligence',
      displayOrder: 14,
      isPublished: true,
    },
  ];

  const allFaqs = apiFaqs.length > 0 ? apiFaqs : defaultAdvisorFaqs;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const categories = ['ALL', ...Array.from(new Set(allFaqs.map((f) => f.category)))];

  const filteredFaqs = allFaqs.filter((f) => {
    const matchesCategory = selectedCategory === 'ALL' || f.category === selectedCategory;
    const matchesSearch =
      searchTerm.trim() === '' ||
      f.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-white">
      {/* 1. Header Hero Banner */}
      <section className="relative bg-gradient-to-br from-brand-navy via-[#102434] to-[#0A1824] text-white pt-20 pb-20 lg:pt-24 lg:pb-24 border-b border-white/10 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-teal/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-teal/20 border border-brand-teal/30 text-brand-teal-light text-xs font-bold uppercase tracking-wider mb-5">
              <HelpCircle className="w-4 h-4 text-brand-teal" />
              <span>Property Finance Knowledge Base</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight font-heading leading-tight sm:leading-tight">
              Frequently Asked Questions on <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-teal via-emerald-400 to-brand-gold">
                Land, Home Loans &amp; Title Verification
              </span>
            </h1>

            <p className="mt-5 text-gray-300 text-base sm:text-lg lg:text-xl font-normal leading-relaxed max-w-3xl">
              Factual, authoritative answers regarding layout sanctions (BDA/DTCP), Khata classifications, composite loan rules, banking FOIR formulas, and legal due diligence.
            </p>

            {/* Quick Search Input */}
            <div className="mt-8 max-w-2xl relative">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search topics (e.g., A-Khata, CIBIL, Pre-EMI, Plot Loan, MODT, LRD)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:bg-white/15 transition-all shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Category Filter Pills */}
      <section className="py-6 border-b border-brand-border bg-brand-ivory/60 sticky top-16 sm:top-20 z-20 backdrop-blur-md">
        <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-slate mr-2 hidden sm:inline">
              Filter by Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setOpenIndex(null);
                }}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-brand-navy text-white shadow-md scale-105'
                    : 'bg-white text-brand-slate hover:text-brand-navy border border-brand-border hover:bg-white/80'
                }`}
              >
                {cat === 'ALL' ? 'All Questions' : cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Accordion List Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="max-w-4xl mx-auto">
            {filteredFaqs.length === 0 ? (
              <div className="p-12 text-center text-brand-slate bg-brand-ivory rounded-3xl border border-brand-border space-y-4">
                <HelpCircle className="w-10 h-10 text-brand-teal mx-auto" />
                <h3 className="text-lg font-bold text-brand-navy">No matching answers found</h3>
                <p className="text-sm">Try different keywords or speak directly with our senior financial advisors.</p>
                <Link
                  to="/enquire"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-brand-teal text-white text-xs font-bold rounded-corporate shadow-sm hover:bg-brand-teal-hover transition-colors"
                >
                  <span>Ask an Advisor Directly</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFaqs.map((faq, idx) => {
                  const isOpen = openIndex === idx;

                  return (
                    <div
                      key={faq.id || idx}
                      className="border border-brand-border rounded-2xl overflow-hidden bg-brand-ivory/20 transition-all hover:border-brand-teal/40"
                    >
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : idx)}
                        className="w-full flex items-center justify-between p-6 text-left bg-white hover:bg-brand-ivory/40 transition-colors focus:outline-none"
                      >
                        <span className="text-base sm:text-lg font-bold text-brand-navy pr-4 flex items-start gap-3.5 font-heading">
                          <span className="w-6 h-6 rounded-md bg-brand-teal-light text-brand-teal flex items-center justify-center font-mono text-xs flex-shrink-0 mt-0.5">
                            Q
                          </span>
                          <span>{faq.question}</span>
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 text-brand-slate transition-transform duration-300 flex-shrink-0 ${
                            isOpen ? 'rotate-180 text-brand-teal' : ''
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="p-6 pt-2 text-sm text-brand-slate bg-white leading-relaxed border-t border-brand-border/40 space-y-3">
                          <div className="pl-9 text-brand-navy/90 leading-relaxed font-normal">
                            {faq.answer}
                          </div>
                          <div className="pl-9 pt-2 flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-teal bg-brand-teal-light px-2.5 py-0.5 rounded">
                              {faq.category}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Direct Advisor Assistance Card */}
            <div className="mt-14 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-brand-navy to-[#183247] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
              <div className="text-center sm:text-left space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-brand-teal/20 text-brand-teal-light text-xs font-bold uppercase tracking-wider">
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Unsure About Your Specific Property?</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-heading">
                  Have a specific question regarding your deed chain or loan?
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-xl">
                  Our senior advisory desk reviews title paperwork, municipal permissions, and bank rejection cases free of upfront charges.
                </p>
              </div>
              <Link
                to="/enquire"
                className="px-7 py-3.5 bg-brand-teal hover:bg-brand-teal-hover text-white text-xs sm:text-sm font-bold rounded-corporate shadow-lg shadow-brand-teal/20 transition-all flex-shrink-0 flex items-center gap-2"
              >
                <span>Book 1-on-1 Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
