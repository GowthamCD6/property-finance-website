import React, { useState } from 'react';
import { MessageSquare, X, Send, ShieldCheck, Lock, CheckCheck } from 'lucide-react';
import { SiteContent } from '../../types';

interface WhatsAppFloatingWidgetProps {
  content?: SiteContent | null;
}

export const WhatsAppFloatingWidget: React.FC<WhatsAppFloatingWidgetProps> = ({ content }) => {
  const [isOpen, setIsOpen] = useState(false);
  const rawPhone = content?.whatsappNumber || content?.businessPhone || '+91 96555 66613';
  const cleanPhone = rawPhone.split(',')[0].replace(/[^0-9]/g, '') || '919655566613';

  const defaultMessage = encodeURIComponent(
    content?.whatsappMessage ||
      'Hello Prime Associates, I would like to consult with an advisor regarding a Home Loan / Mortgage Loan / Subsidy requirement.'
  );

  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${defaultMessage}`;

  return (
    <aside aria-label="Direct WhatsApp Advisory" className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 select-none">
      {/* Expanded Quick Advisory Card */}
      {isOpen && (
        <div className="mb-3 w-[calc(100vw-2.5rem)] max-w-xs sm:w-88 bg-white rounded-2xl shadow-modal border border-brand-border p-4 animate-in slide-in-from-bottom-3 duration-200">
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
            <span>Chat on WhatsApp ({rawPhone.split(',')[0].trim()})</span>
          </a>

          <div className="mt-2 text-center text-[10px] text-brand-slate">
            <span className="inline-flex items-center gap-1.5"><Lock className="w-3 h-3 text-emerald-400" /> Confidential &bull; Zero Spam &bull; No Upfront Fees</span>
          </div>
        </div>
      )}

      {/* Floating Trigger Button (Round & Proper) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 sm:w-14 sm:h-14 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 relative focus:outline-none focus:ring-4 focus:ring-emerald-400/40 group"
        aria-label="Direct WhatsApp Loan Advisory"
        title="Chat on WhatsApp"
      >
        <svg
          className="w-7 h-7 fill-current"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        <span className="absolute top-1 right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>
      </button>
    </aside>
  );
};
