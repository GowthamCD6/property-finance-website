import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { Faq } from '../../types';

interface FaqSectionProps {
  faqs: Faq[];
}

export const FaqSection: React.FC<FaqSectionProps> = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = ['ALL', ...Array.from(new Set(faqs.map((f) => f.category)))];

  const filteredFaqs =
    selectedCategory === 'ALL'
      ? faqs
      : faqs.filter((f) => f.category === selectedCategory);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faqs" className="py-12 sm:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-block px-3 py-1 rounded bg-brand-teal-light text-brand-teal text-xs font-bold uppercase tracking-wider mb-3">
            Common Inquiries
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-navy tracking-tight font-heading">
            Frequently Asked Questions
          </h2>
          <p className="mt-2.5 text-brand-slate text-sm sm:text-base leading-relaxed">
            Essential facts on property loan evaluation, eligibility parameters, documentation, and advisory appointments.
          </p>

          {/* Category Tabs */}
          {categories.length > 2 && (
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setOpenIndex(null);
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    selectedCategory === cat
                      ? 'bg-brand-teal text-white shadow-sm'
                      : 'bg-brand-ivory text-brand-slate hover:bg-gray-200'
                  }`}
                >
                  {cat === 'ALL' ? 'All Inquiries' : cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5">
          {filteredFaqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.id || index}
                className="border border-brand-border rounded-xl overflow-hidden bg-brand-ivory/40 transition-colors"
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-brand-ivory/60 transition-colors focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-semibold text-brand-navy pr-4 flex items-center gap-3">
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
                  <div className="p-5 pt-2 text-sm text-brand-slate bg-white leading-relaxed border-t border-brand-border/40 animate-in fade-in duration-150">
                    <p className="pl-7">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Clear Assistance CTA */}
        <div className="mt-12 p-6 rounded-xl bg-brand-teal-light border border-brand-teal/20 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h4 className="text-sm font-bold text-brand-navy">Have a specific question not covered here?</h4>
            <p className="text-xs text-brand-slate mt-0.5">
              Speak with a dedicated property finance advisor directly.
            </p>
          </div>
          <a
            href="#enquiry-form"
            className="px-5 py-2.5 bg-brand-teal hover:bg-brand-teal-hover text-white text-xs font-semibold rounded-corporate transition-colors flex-shrink-0 shadow-sm"
          >
            Submit an Inquiry
          </a>
        </div>
      </div>
    </section>
  );
};
