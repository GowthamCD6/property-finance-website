import React, { useState } from 'react';
import {
  UploadCloud,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  Trash2,
  Eye,
  AlertCircle,
  ShieldCheck,
  Building,
  Car,
  Landmark,
  FileCheck,
  Sparkles,
  X,
} from 'lucide-react';
import { UploadedDocument } from '../../types';
import {
  DocumentItemDef,
  CHANNEL_PARTNERS,
  getRequiredDocumentsForPlan,
} from '../../constants/loanDocuments';
import { compressImageFile } from '../../utils/formDraftStorage';

interface DocumentUploadIntakeProps {
  loanType: string;
  employmentType: 'salaried' | 'self_employed' | 'cash_salary' | 'business_owner' | 'other';
  carType?: 'new' | 'used' | 'refinance';
  preferredBank: string;
  onSelectPreferredBank: (bank: string) => void;
  documents: UploadedDocument[];
  onDocumentsChange: (docs: UploadedDocument[]) => void;
}

export const DocumentUploadIntake: React.FC<DocumentUploadIntakeProps> = ({
  loanType,
  employmentType,
  carType = 'new',
  preferredBank,
  onSelectPreferredBank,
  documents,
  onDocumentsChange,
}) => {
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('ALL');
  const [previewModalDoc, setPreviewModalDoc] = useState<UploadedDocument | null>(null);

  // Generate dynamic checklist definition based on user's current selections
  const checklist = getRequiredDocumentsForPlan(loanType, employmentType, carType);

  // Categories present in this checklist
  const categories = Array.from(new Set(checklist.map((c) => c.category)));

  // Filtered items
  const filteredChecklist =
    activeCategoryFilter === 'ALL'
      ? checklist
      : checklist.filter((item) => item.category === activeCategoryFilter);

  // Map category to user-friendly label & color
  const getCategoryMeta = (cat: string) => {
    switch (cat) {
      case 'KYC':
        return { label: 'KYC & Identity', badge: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
      case 'Income':
        return { label: 'Income & Banking', badge: 'bg-blue-50 text-blue-800 border-blue-200' };
      case 'Legal':
        return { label: 'Legal & Title Deeds', badge: 'bg-purple-50 text-purple-800 border-purple-200' };
      case 'Technical':
        return { label: 'Technical & Estimates', badge: 'bg-amber-50 text-amber-800 border-amber-200' };
      case 'Mortgage_LAP':
        return { label: 'Mortgage / LAP Bills', badge: 'bg-rose-50 text-rose-800 border-rose-200' };
      case 'Vehicle':
        return { label: 'Vehicle Documentation', badge: 'bg-teal-50 text-teal-800 border-teal-200' };
      default:
        return { label: cat, badge: 'bg-gray-50 text-gray-800 border-gray-200' };
    }
  };

  // Handle single item upload
  const handleItemFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, item: DocumentItemDef) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    try {
      const base64 = await compressImageFile(file);
      const newDoc: UploadedDocument = {
        id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        name: file.name,
        size: Math.round((base64.length * 3) / 4),
        type: file.type || 'image/jpeg',
        category: item.category,
        documentName: item.name,
        previewUrl: base64,
        uploadedAt: new Date().toISOString(),
      };

      // Replace if document of same name exists, else append
      const updated = documents.filter((d) => d.documentName !== item.name).concat(newDoc);
      onDocumentsChange(updated);
    } catch (err) {
      console.error('File reading and compression failed', err);
    }
    // Reset file input
    e.target.value = '';
  };



  const handleRemoveDoc = (id: string) => {
    onDocumentsChange(documents.filter((d) => d.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">


      {/* CHANNEL PARTNER / PREFERRED BANK PICKER (PAGE 1) */}
      <div className="p-4 sm:p-5 rounded-xl bg-brand-ivory border border-brand-border space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-brand-navy">
            <Landmark className="w-4 h-4 text-brand-teal" />
            <label className="text-xs sm:text-sm font-bold">
              Preferred Channel Partner / Bank Selection <span className="text-brand-slate font-normal">(Optional)</span>
            </label>
          </div>
          <span className="text-[10px] uppercase font-bold text-brand-teal tracking-wider bg-brand-teal-light px-2 py-0.5 rounded">
            40+ Institutions
          </span>
        </div>

        <p className="text-xs text-brand-slate">
          Choose a specific partner bank or leave as "Best Available Rate" to allow our advisory team to benchmark terms across Public, Private, and NBFC lenders.
        </p>

        <div className="relative">
          <select
            value={preferredBank}
            onChange={(e) => onSelectPreferredBank(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white border border-brand-border rounded-lg text-sm text-brand-navy font-semibold focus:ring-2 focus:ring-brand-teal focus:border-transparent transition-all"
          >
            <option value="Any (Best Market Rate Finder across 40+ Channel Partners)">
              Any / Best Available Lowest Rate (Recommended — Algorithmic Comparison)
            </option>
            {CHANNEL_PARTNERS.map((group) => (
              <optgroup key={group.category} label={`── ${group.category} ──`}>
                {group.banks.map((bank) => (
                  <option key={bank} value={bank}>
                    {bank}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
      </div>

      {/* CATEGORY FILTER PILLS */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveCategoryFilter('ALL')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeCategoryFilter === 'ALL'
              ? 'bg-brand-teal text-white shadow-xs'
              : 'bg-brand-ivory hover:bg-gray-200 text-brand-slate'
          }`}
        >
          All Documents ({checklist.length})
        </button>
        {categories.map((cat) => {
          const meta = getCategoryMeta(cat);
          const count = checklist.filter((i) => i.category === cat).length;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeCategoryFilter === cat
                  ? 'bg-brand-navy text-white shadow-xs'
                  : 'bg-brand-ivory hover:bg-gray-200 text-brand-slate'
              }`}
            >
              {meta.label} ({count})
            </button>
          );
        })}
      </div>

      {/* DYNAMIC CHECKLIST GRID WITH INLINE UPLOADERS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredChecklist.map((item) => {
          const uploadedDoc = documents.find((d) => d.documentName === item.name);
          const isUploaded = !!uploadedDoc;
          const meta = getCategoryMeta(item.category);

          return (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between gap-3 ${
                isUploaded
                  ? 'bg-teal-50/70 border-teal-300 shadow-2xs'
                  : 'bg-white border-brand-border hover:border-brand-teal/40 hover:shadow-2xs'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${meta.badge}`}>
                    {meta.label}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      item.tag === 'Mandatory'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : item.tag === 'Optional'
                        ? 'bg-slate-100 text-slate-600 border border-slate-200'
                        : item.tag === 'If Available'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {item.tag}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-brand-navy flex items-center gap-1.5">
                  {isUploaded && <CheckCircle2 className="w-4 h-4 text-brand-teal shrink-0" />}
                  <span>{item.name}</span>
                </h4>

                <p className="text-xs text-brand-slate leading-relaxed">{item.desc}</p>

                {item.sampleHint && (
                  <p className="text-[11px] text-teal-700 bg-teal-50/50 p-1.5 rounded border border-teal-100">
                    <Sparkles className="w-3.5 h-3.5 inline mr-1 text-amber-500" /><span className="font-semibold">Tip:</span> {item.sampleHint}
                  </p>
                )}
              </div>

              {/* UPLOADED ATTACHMENT CARD OR UPLOAD ACTION */}
              <div className="pt-2 border-t border-brand-border/60">
                {isUploaded ? (
                  <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-white border border-teal-200 shadow-2xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {uploadedDoc.type.includes('image') ? (
                        <img
                          src={uploadedDoc.previewUrl}
                          alt={uploadedDoc.name}
                          onClick={() => setPreviewModalDoc(uploadedDoc)}
                          className="w-10 h-10 object-cover rounded border border-brand-border cursor-pointer hover:opacity-80 transition-opacity shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded bg-red-50 border border-red-200 flex items-center justify-center text-red-700 shrink-0 font-bold text-[10px]">
                          PDF
                        </div>
                      )}
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-brand-navy truncate block">
                          {uploadedDoc.name}
                        </span>
                        <span className="text-[10px] text-brand-slate">
                          {formatFileSize(uploadedDoc.size)} • Ready for Admin
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {uploadedDoc.type.includes('image') && (
                        <button
                          type="button"
                          onClick={() => setPreviewModalDoc(uploadedDoc)}
                          title="View Image"
                          className="p-1.5 rounded text-brand-slate hover:text-brand-navy hover:bg-gray-100"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveDoc(uploadedDoc.id)}
                        title="Remove Document"
                        className="p-1.5 rounded text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="flex items-center justify-center gap-2 py-2 px-3 border border-dashed border-brand-border rounded-lg bg-brand-ivory/60 hover:bg-brand-teal-light/50 hover:border-brand-teal cursor-pointer transition-colors text-xs font-semibold text-brand-navy">
                    <UploadCloud className="w-4 h-4 text-brand-teal" />
                    <span>Upload Image / Scan</span>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={(e) => handleItemFileUpload(e, item)}
                      className="sr-only"
                    />
                  </label>
                )}
              </div>
            </div>
          );
        })}
      </div>


      {/* FULL IMAGE PREVIEW MODAL */}
      {previewModalDoc && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-brand-border flex items-center justify-between bg-brand-ivory">
              <div>
                <span className="text-[10px] uppercase font-bold text-brand-teal tracking-wider block">
                  Reference Document Preview
                </span>
                <h4 className="text-sm font-bold text-brand-navy">{previewModalDoc.documentName}</h4>
              </div>
              <button
                type="button"
                onClick={() => setPreviewModalDoc(null)}
                className="p-1.5 rounded-lg text-brand-slate hover:text-brand-navy hover:bg-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-gray-900">
              <img
                src={previewModalDoc.previewUrl}
                alt={previewModalDoc.name}
                className="max-h-[75vh] object-contain rounded"
              />
            </div>
            <div className="p-3 border-t border-brand-border flex items-center justify-between text-xs text-brand-slate bg-white">
              <span>{previewModalDoc.name} ({formatFileSize(previewModalDoc.size)})</span>
              <a
                href={previewModalDoc.previewUrl}
                download={previewModalDoc.name}
                className="font-bold text-brand-teal hover:underline"
              >
                Download Original
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
