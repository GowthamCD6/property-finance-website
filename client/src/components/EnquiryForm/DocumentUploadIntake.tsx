import React, { useState, useRef } from 'react';
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
  FileUp,
} from 'lucide-react';
import { UploadedDocument } from '../../types';
import {
  DocumentItemDef,
  CHANNEL_PARTNERS,
  getRequiredDocumentsForPlan,
} from '../../constants/loanDocuments';

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
  const [dragActive, setDragActive] = useState<boolean>(false);
  const generalFileInputRef = useRef<HTMLInputElement>(null);

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

  // Convert File to Base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  // Handle single item upload
  const handleItemFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, item: DocumentItemDef) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    try {
      const base64 = await fileToBase64(file);
      const newDoc: UploadedDocument = {
        id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        name: file.name,
        size: file.size,
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
      console.error('File reading failed', err);
    }
    // Reset file input
    e.target.value = '';
  };

  // Handle multiple bulk file upload
  const handleBulkFiles = async (fileList: FileList) => {
    const newDocs: UploadedDocument[] = [];
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      try {
        const base64 = await fileToBase64(file);
        newDocs.push({
          id: `bulk-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 5)}`,
          name: file.name,
          size: file.size,
          type: file.type || 'image/jpeg',
          category: 'General',
          documentName: file.name.replace(/\.[^/.]+$/, ''),
          previewUrl: base64,
          uploadedAt: new Date().toISOString(),
        });
      } catch (err) {
        console.error('Failed reading file', file.name, err);
      }
    }
    if (newDocs.length > 0) {
      onDocumentsChange([...documents, ...newDocs]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleBulkFiles(e.dataTransfer.files);
    }
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
      {/* SECTION HEADER & REAL-PLAN INTENT */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0C1E30] via-[#0E263D] to-[#0A1826] text-white border border-teal-500/30 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 text-xs font-bold uppercase tracking-wider">
              <FileCheck className="w-3.5 h-3.5" />
              <span>Real Document Intake &amp; Reference Portal</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight font-heading">
              Submit Reference Documents for Fast-Track Sanction
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Upload clear photos or scans of your property, identity, and income documents. These will be securely referenced by our senior credit underwriters to formulate your sanction proposal across 40+ banks.
            </p>
          </div>

          <div className="shrink-0 flex items-center sm:flex-col sm:items-end justify-between gap-2 p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-300" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">Documents Attached</span>
            </div>
            <div className="text-2xl font-extrabold text-teal-300 font-mono">
              {documents.length} <span className="text-xs font-normal text-slate-300">File(s)</span>
            </div>
          </div>
        </div>

        {/* Reassurance banner */}
        <div className="mt-4 pt-3 border-t border-white/15 flex flex-wrap items-center gap-y-2 gap-x-6 text-[11px] text-slate-300">
          <span className="flex items-center gap-1.5 text-teal-300 font-medium">
            <ShieldCheck className="w-4 h-4" /> 256-Bit Bank Grade Encryption
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Zero CIBIL Inquiry On Document Upload
          </span>
          <span className="text-slate-400 italic">
            * Optional: If you don't have all documents now, you can submit the form and share the rest via WhatsApp.
          </span>
        </div>
      </div>

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
              ⭐ Any / Best Available Lowest Rate (Recommended — Algorithmic Comparison)
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
          All Required Documents ({checklist.length})
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
                        ? 'bg-red-50 text-red-700 border border-red-200'
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
                    💡 <span className="font-semibold">Tip:</span> {item.sampleHint}
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

      {/* QUICK BULK UPLOAD DROPZONE */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`p-6 border-2 border-dashed rounded-2xl text-center transition-all ${
          dragActive
            ? 'border-brand-teal bg-brand-teal-light/60 scale-[1.01]'
            : 'border-brand-border bg-white hover:border-brand-teal/50 hover:bg-brand-ivory/30'
        }`}
      >
        <div className="max-w-md mx-auto space-y-2">
          <div className="w-12 h-12 rounded-full bg-brand-teal-light text-brand-teal flex items-center justify-center mx-auto">
            <FileUp className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-brand-navy">
            Or Drag &amp; Drop All Available Document Photos At Once
          </h4>
          <p className="text-xs text-brand-slate">
            Take photos with your phone camera or select multiple PNG, JPG, or PDF files. Our system attaches them automatically for admin reference.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => generalFileInputRef.current?.click()}
              className="px-4 py-2 bg-brand-navy hover:bg-slate-800 text-white rounded-corporate text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              Browse Files from Device
            </button>
            <input
              ref={generalFileInputRef}
              type="file"
              multiple
              accept="image/*,application/pdf"
              onChange={(e) => {
                if (e.target.files) handleBulkFiles(e.target.files);
                e.target.value = '';
              }}
              className="sr-only"
            />
          </div>
        </div>
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
