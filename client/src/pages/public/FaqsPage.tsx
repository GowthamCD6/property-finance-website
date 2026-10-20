import React, { useState } from 'react';
import { HelpCircle, Search, ChevronDown, Phone, ArrowRight } from 'lucide-react';
import { Faq } from '../../types';
import { useOutletContext } from 'react-router-dom';

export const FaqsPage: React.FC = () => {
  const context = useOutletContext<{ faqs?: Faq[] }>();
  const faqs = context?.faqs || [];
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const categories = ['ALL', ...Array.from(new Set(faqs.map((f) => f.category)))];

  const filteredFaqs = faqs.filter((f) => {
    const matchesCategory = selectedCategory === 'ALL' || f.category === selectedCategory;
    const matchesSearch =
      searchTerm.trim() === '' ||
      f.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-white">
      {/* 1. Header Banner */}
      <section className="bg-brand-ivory border-b border-brand-border py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-brand-teal-light text-brand-teal text-xs font-bold uppercase tracking-wider mb-4">
              <HelpCircle className="w-4 h-4" />
              <span>Knowledge Base &amp; FAQ</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-navy tracking-tight leading-tight">
              Frequently Asked Questions
            </h1>
            <p className="mt-4 text-brand-slate text-base sm:text-lg leading-relaxed">
              Find factual answers regarding property loan requirements, eligibility parameters, required documentation, and consultation procedures.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Search & Category Filter */}
      <section className="py-12 border-b border-gray-100 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-slate" />
            <input
              type="text"
              placeholder="Search by keywords (e.g. CIBIL, Loan Against Property, down payment, documents)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-brand-ivory border border-brand-border rounded-xl text-sm text-brand-navy focus:bg-white transition-colors"
            />
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setOpenIndex(null);
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  selectedCategory === cat
                    ? 'bg-brand-teal text-white shadow-xs'
                    : 'bg-brand-ivory text-brand-slate hover:bg-gray-200'
                }`}
              >
                {cat === 'ALL' ? 'All Questions' : cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Accordion List */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredFaqs.length === 0 ? (
            <div className="p-8 text-center text-brand-slate bg-brand-ivory rounded-xl border border-brand-border">
              No questions found matching your search. Try different keywords or contact our team directly.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFaqs.map((faq, idx) => {
                const isOpen = openIndex === idx;

                return (
                  <div
                    key={faq.id || idx}
                    className="border border-brand-border rounded-xl overflow-hidden bg-brand-ivory/30 transition-colors"
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-brand-ivory/60 transition-colors focus:outline-none"
                    >
                      <span className="text-sm sm:text-base font-bold text-brand-navy pr-4 flex items-center gap-3">
                        <HelpCircle className="w-4 h-4 text-brand-teal flex-shrink-0" />
                        <span>{faq.question}</span>
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-brand-slate transition-transform duration-200 flex-shrink-0 ${
                          isOpen ? 'rotate-180 text-brand-teal' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="p-5 pt-2 text-sm text-brand-slate bg-white leading-relaxed border-t border-brand-border/40">
                        <p className="pl-7">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Contact Box */}
          <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-brand-teal-light border border-brand-teal/20 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left">
              <h3 className="text-base sm:text-lg font-bold text-brand-navy">Have a custom question about your property?</h3>
              <p className="text-xs sm:text-sm text-brand-slate mt-1">
                Our property finance advisory team is available to review your scenario in detail.
              </p>
            </div>
            <a
              href="/enquire"
              className="px-6 py-3 bg-brand-teal hover:bg-brand-teal-hover text-white text-xs sm:text-sm font-semibold rounded-corporate shadow-sm transition-colors flex-shrink-0"
            >
              Book a Consultation
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
