import React, { useState } from 'react';
import { MessageSquare, X, Send, ShieldCheck, CheckCheck } from 'lucide-react';
import { SiteContent } from '../../types';

interface WhatsAppFloatingWidgetProps {
  content?: SiteContent | null;
}

export const WhatsAppFloatingWidget: React.FC<WhatsAppFloatingWidgetProps> = ({ content }) => {
  const [isOpen, setIsOpen] = useState(false);
  const phone = content?.businessPhone || '+91 98765 43210';
  const cleanPhone = phone.replace(/[^0-9]/g, '');

  const defaultMessage = encodeURIComponent(
    'Hello Prime Associate Loans, I would like to consult with an advisor regarding a Property Loan / LAP requirement.'
  );

  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${defaultMessage}`;

  return (
    <aside aria-label="Direct WhatsApp Advisory" className="fixed bottom-6 right-6 z-40 select-none">
      {/* Expanded Quick Advisory Card */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-88 bg-white rounded-2xl shadow-modal border border-brand-border p-4 animate-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                WA
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-xs text-brand-navy">Advisory Desk</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Advisors Active Now (IST)
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-md"
              aria-label="Close WhatsApp chat card"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-brand-ivory p-3 rounded-xl border border-brand-border/60 text-xs text-brand-slate mb-3 leading-relaxed">
            <p className="text-brand-navy font-semibold mb-0.5">Need quick loan assistance?</p>
            Connect directly on WhatsApp with our property loan advisors for initial eligibility checks and document guidance.
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-corporate text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Chat on WhatsApp ({phone})</span>
          </a>

          <div className="mt-2 text-center text-[10px] text-brand-slate">
            <span>🔒 Confidential &bull; Zero Spam &bull; No Upfront Fees</span>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3.5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        aria-label="Direct WhatsApp Loan Advisory"
      >
        <div className="relative">
          <MessageSquare className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-300 rounded-full animate-ping"></span>
        </div>
        <span className="text-xs font-bold tracking-wide pr-1 hidden sm:inline-block">
          WhatsApp Advisory
        </span>
      </button>
    </aside>
  );
};
