import React from 'react';
import { X, ShieldCheck } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  disclaimer: string;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({
  isOpen,
  onClose,
  title,
  content,
  disclaimer,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-navy/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-xl max-w-2xl w-full p-6 sm:p-8 shadow-modal border border-brand-border animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-brand-border">
          <div className="flex items-center gap-2 text-brand-navy">
            <ShieldCheck className="w-5 h-5 text-brand-teal" />
            <h3 className="text-lg font-bold">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-brand-slate hover:text-brand-navy p-1 rounded-md transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4 text-sm text-brand-slate leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
          <p className="whitespace-pre-line text-brand-navy">{content}</p>

          <div className="mt-4 p-3.5 bg-brand-teal-light rounded-lg border border-brand-teal/20 text-xs text-brand-navy">
            <span className="font-semibold block mb-1">Financial Advisory Notice:</span>
            {disclaimer}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-brand-border flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-white bg-brand-teal hover:bg-brand-teal-hover rounded-corporate transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
