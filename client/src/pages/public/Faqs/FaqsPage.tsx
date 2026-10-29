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
  Tag,
} from 'lucide-react';
import { Faq } from '../../../types';
import faqsHeroImage from '../../../assets/images/faqs-hero.webp';

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
  const [mounted, setMounted] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  React.useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 6;
      const y = -(e.clientY / innerHeight - 0.5) * 6;
      setTilt({ x: y, y: x });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const trendingTopics = [
    'A-Khata vs B-Khata',
    'Plot Loan',
    'EC Form 15',
    'Pre-EMI',
    'Section 24(b)',
    'MODT',
    'LRD Escrow',
  ];

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
    <div className="bg-[#f8f8f4] min-h-screen text-brand-navy">
      {/* ────────────────────────────────────────────────────────────
          1. CONTENT-SPECIFIC HERO: SEARCHABLE KNOWLEDGE REPOSITORY
          ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-slate-950 text-white pt-16 pb-16 lg:pt-24 lg:pb-20 border-b border-brand-teal/20">
        {/* Background Photographic Image with Professional Contrast Overlays */}
        <div className="absolute inset-0 z-0">
          <img
            src={faqsHeroImage}
            alt="Property Finance & Title Diligence Encyclopedia"
            className={`w-full h-full object-cover object-center brightness-[0.88] transition-transform duration-1000 ease-out ${
              mounted ? 'scale-100' : 'scale-105'
            }`}
            loading="eager"
          />
          {/* Calibrated lightweight overlay stack so image is clearly visible while text is crisp */}
          <div className="absolute inset-0 bg-black/25" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/75 via-slate-950/45 to-slate-950/90" />

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
            className="max-w-4xl mx-auto text-center space-y-6 will-change-transform"
          >
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-brand-teal/15 border border-brand-teal/30 text-brand-teal-light text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              <span>Property Finance &amp; Title Diligence Encyclopedia</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight font-heading leading-tight text-white">
              Instant Answers on Land, <br />
              <span className="text-[#38bdf8] drop-shadow-[0_4px_22px_rgba(56,189,248,0.65)] font-extrabold">
                Home Loans &amp; Title Verification.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
              Find factual answers regarding municipal layout approvals (BDA/DTCP), Khata classifications, composite plot loan rules, banking FOIR formulas, and legal documentation.
            </p>

            {/* Prominent Knowledge Search Bar inside Hero */}
            <div className="pt-2 max-w-2xl mx-auto relative">
              <Search className="w-5 h-5 absolute left-4.5 top-1/2 -translate-y-1/2 text-teal-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search topics (e.g. A-Khata, CIBIL, Pre-EMI, Plot Loan, MODT, LRD)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/[0.08] backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:bg-white/[0.14] transition-all shadow-2xl"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white bg-white/10 px-2 py-1 rounded-md"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Trending Topic Quick Pills */}
            <div className="pt-2 flex flex-wrap justify-center items-center gap-2 text-xs text-slate-300">
              <span className="text-slate-400 font-medium">Trending Queries:</span>
              {trendingTopics.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => setSearchTerm(topic)}
                  className="px-3 py-1 rounded-full bg-white/[0.06] hover:bg-white/[0.15] border border-white/10 transition-colors text-teal-300 cursor-pointer"
                >
                  #{topic}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────
          2. CATEGORY FILTER TABS
          ──────────────────────────────────────────────────────────── */}
      <section className="py-4 border-b border-brand-border/60 bg-[#f8f8f4]/90 sticky top-16 sm:top-20 z-20 backdrop-blur-xl shadow-2xs">
        <div className="w-[92%] sm:w-[88%] lg:w-[85%] max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mr-2 hidden sm:inline font-heading">
              Filter by Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat);
                  setOpenIndex(null);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold font-heading transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-brand-teal text-white shadow-sm border border-brand-teal'
                    : 'bg-white text-slate-600 border border-brand-border/80 hover:bg-slate-50 hover:text-brand-navy'
                }`}
              >
                {cat === 'ALL' ? 'All Questions' : cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────
          3. ACCORDION Q&A LIST
          ──────────────────────────────────────────────────────────── */}
      <section className="pt-12 sm:pt-16 pb-16 bg-[#f8f8f4]">
        <div className="w-[92%] sm:w-[88%] lg:w-[85%] max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto">
            {filteredFaqs.length === 0 ? (
              <div className="p-12 text-center text-slate-500 bg-white rounded-3xl border border-brand-border/80 shadow-card space-y-4">
                <HelpCircle className="w-10 h-10 text-brand-teal mx-auto" />
                <h3 className="text-lg font-bold text-brand-navy font-heading">No matching answers found</h3>
                <p className="text-sm">Try different keywords or speak directly with our senior financial advisors.</p>
                <div className="pt-2">
                  <Link
                    to="/enquire"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-brand-teal text-white text-xs font-bold rounded-xl shadow-sm hover:bg-brand-teal-hover transition-colors"
                  >
                    <span>Ask an Advisor Directly</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFaqs.map((faq, idx) => {
                  const isOpen = openIndex === idx;

                  return (
                    <div
                      key={faq.id || idx}
                      className={`rounded-2xl overflow-hidden transition-all duration-300 border bg-white/95 backdrop-blur-xl shadow-card ring-1 ring-slate-900/5 ${
                        isOpen
                          ? 'border-brand-teal/60 shadow-lg'
                          : 'border-brand-border/80 hover:border-teal-400'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenIndex(isOpen ? null : idx)}
                        className="w-full flex items-center justify-between p-5 sm:p-6 text-left hover:bg-slate-50/50 transition-colors focus:outline-none cursor-pointer"
                      >
                        <span className="text-base sm:text-lg font-bold text-brand-navy pr-4 flex items-start gap-3.5 font-heading">
                          <span
                            className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-extrabold flex-shrink-0 mt-0.5 transition-colors ${
                              isOpen
                                ? 'bg-brand-teal text-white'
                                : 'bg-brand-teal-light text-brand-teal'
                            }`}
                          >
                            Q
                          </span>
                          <span className="leading-snug">{faq.question}</span>
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 text-slate-400 transition-transform duration-300 flex-shrink-0 ${
                            isOpen ? 'rotate-180 text-brand-teal' : ''
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="p-5 sm:p-6 pt-0 text-sm text-slate-700 bg-white leading-relaxed space-y-3">
                          <div className="pl-10.5 text-slate-700 leading-relaxed font-normal text-sm sm:text-base border-t border-slate-100 pt-4">
                            {faq.answer}
                          </div>
                          <div className="pl-10.5 pt-1 flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-teal bg-brand-teal-light px-2.5 py-1 rounded-md font-heading border border-brand-teal/20">
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

            {/* Still Have Questions Banner */}
            <div className="mt-12 bg-gradient-to-br from-[#091522] via-[#0d2238] to-[#122e4a] text-white p-6 sm:p-10 rounded-3xl shadow-2xl border border-white/15 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-brand-teal/10 rounded-full blur-3xl pointer-events-none" />
              <div className="space-y-2 max-w-xl relative z-10">
                <span className="text-xs uppercase font-bold tracking-wider text-brand-teal-light font-heading">
                  Complex Title or Financing Query?
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold font-heading text-white">
                  Speak Directly with Our Senior Underwriters
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Have unique title paperwork, unapproved layout concerns, or complex commercial valuation questions? Our desk reviews municipal parent deeds directly.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 relative z-10 w-full md:w-auto">
                <Link
                  to="/enquire"
                  className="w-full sm:w-auto px-6 py-3.5 bg-brand-teal hover:bg-brand-teal-hover text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-teal-950/40 flex items-center justify-center gap-2 transition-all text-center cursor-pointer"
                >
                  <span>Initiate Advisory Dossier</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="tel:+919655566613"
                  className="w-full sm:w-auto px-5 py-3.5 bg-white/[0.08] hover:bg-white/[0.15] text-white border border-white/15 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <PhoneCall className="w-4 h-4 text-emerald-400" />
                  <span>+91 96555 66613</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
