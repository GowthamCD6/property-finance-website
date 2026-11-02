import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  Download,
  Eye,
  Clock,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Building2,
  User,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  MessageSquare,
  ShieldCheck,
  Send,
  History,
  FileCheck,
  Image as ImageIcon,
  ExternalLink,
  Car,
  Landmark,
  Video,
  FileSpreadsheet,
  ChevronRight,
  ChevronLeft,
  CalendarCheck2,
  Share2,
  Layers,
  ArrowRight,
  Check,
  FileText,
  Info,
  Trash2,
} from 'lucide-react';
import { Enquiry, UploadedDocument } from '../../../types';
import { UserAvatar } from '../../../components/common/UserAvatar';
import {
  getEnquiriesApi,
  getEnquiryByIdApi,
  updateEnquiryStatusApi,
  addEnquiryNoteApi,
  deleteEnquiryDocumentApi,
} from '../../../services/api';

const ALL_STATUSES = [
  'ALL',
  'Pending',
  'Slot Booked',
  'Process Started',
  'Closed',
] as const;

export interface ParsedEnquiryData {
  documents: UploadedDocument[];
  preferredBank?: string;
  doorstepAddress?: string;
  attachedDocsSummary?: string;
  borrowerRemarks?: string;
}

export function parseEnquiryData(enquiry?: Enquiry | null): ParsedEnquiryData {
  if (!enquiry) {
    return { documents: [] };
  }

  let documents: UploadedDocument[] = Array.isArray(enquiry.documents) ? [...enquiry.documents] : [];
  let notes = enquiry.additionalNotes || '';

  // 1. Extract documents if not already populated or if DOCUMENTS_JSON is embedded
  if (notes.includes('<!--DOCUMENTS_JSON:')) {
    const match = notes.match(/<!--DOCUMENTS_JSON:(.*?)-->/s);
    if (match && match[1] && (!documents || documents.length === 0)) {
      try {
        const parsed = JSON.parse(match[1]);
        if (Array.isArray(parsed)) {
          documents = parsed;
        }
      } catch (e) {
        console.error('Failed to parse DOCUMENTS_JSON from notes', e);
      }
    }
    notes = notes.replace(/<!--DOCUMENTS_JSON:.*?-->/s, '').trim();
  }

  // 2. Extract Preferred Bank / Channel Partner
  let preferredBank = enquiry.preferredBank;
  const bankMatch = notes.match(/(?:🏛️|🏛|\?\?|🏦)?\s*Preferred Bank \/ Channel:\s*([^\n\r]+)/i);
  if (bankMatch && bankMatch[1]) {
    preferredBank = bankMatch[1].trim();
  }

  // 3. Extract Doorstep Meeting Address
  let doorstepAddress: string | undefined = undefined;
  const doorstepMatch = notes.match(/(?:📍|\?\?|📌)?\s*Doorstep Meeting Address:\s*([^\n\r]+)/i);
  if (doorstepMatch && doorstepMatch[1]) {
    doorstepAddress = doorstepMatch[1].trim();
  }

  // 4. Extract Attached Reference Documents summary string
  let attachedDocsSummary: string | undefined = undefined;
  const docsSummaryMatch = notes.match(/(?:📁|\?\?|📄)?\s*Attached Reference Documents:\s*([^\n\r]+)/i);
  if (docsSummaryMatch && docsSummaryMatch[1]) {
    attachedDocsSummary = docsSummaryMatch[1].trim();
  }

  // 5. Clean pure borrower remarks
  let cleanNotes = notes
    .replace(/(?:🏛️|🏛|\?\?|🏦)?\s*Preferred Bank \/ Channel:[^\n\r]*(?:\r?\n|$)/gi, '')
    .replace(/(?:📍|\?\?|📌)?\s*Doorstep Meeting Address:[^\n\r]*(?:\r?\n|$)/gi, '')
    .replace(/(?:📁|\?\?|📄)?\s*Attached Reference Documents:[^\n\r]*(?:\r?\n|$)/gi, '')
    .replace(/🚗 Vehicle Specifications:[^\n\r]*(?:\r?\n|$)/gi, '')
    .trim();

  return {
    documents,
    preferredBank,
    doorstepAddress,
    attachedDocsSummary,
    borrowerRemarks: cleanNotes || undefined,
  };
}

export const formatStatusLabel = (status?: string | null): string => {
  if (!status) return 'Pending';
  switch (status) {
    case 'New':
    case 'Contacted':
    case 'Follow-up Required':
    case 'Appointment Requested':
    case 'Pending':
      return 'Pending';
    case 'Appointment Confirmed':
    case 'Slot Booked':
      return 'Slot Booked';
    case 'In Review':
    case 'Process Started':
      return 'Process Started';
    case 'Converted':
    case 'Closed':
      return 'Closed';
    default:
      return status;
  }
};

export const AdminEnquiriesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Search & Filter state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedStatus, setSelectedStatus] = useState<string>(searchParams.get('status') || 'ALL');
  const [selectedLoanType, setSelectedLoanType] = useState<string>('ALL');
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(15);

  // Data state
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // Detail Modal State
  const [selectedEnquiryId, setSelectedEnquiryId] = useState<string | null>(null);
  const [detailEnquiry, setDetailEnquiry] = useState<Enquiry | null>(null);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);
  const [detailTab, setDetailTab] = useState<'overview' | 'documents' | 'activity'>('overview');
  const [adminPreviewDoc, setAdminPreviewDoc] = useState<UploadedDocument | null>(null);
  const [docCategoryFilter, setDocCategoryFilter] = useState<string>('ALL');

  // Status Change State
  const [newStatus, setNewStatus] = useState<string>('');
  const [statusNote, setStatusNote] = useState<string>('');
  const [statusUpdating, setStatusUpdating] = useState<boolean>(false);

  // Document Deletion State
  const [deletingDocId, setDeletingDocId] = useState<string | null>(null);

  // New Note State
  const [newNoteContent, setNewNoteContent] = useState<string>('');
  const [noteSubmitting, setNoteSubmitting] = useState<boolean>(false);

  const handleDeleteDoc = async (docId: string, docName: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${docName}" from Cloudinary and the database?`)) {
      return;
    }
    setDeletingDocId(docId);
    try {
      await deleteEnquiryDocumentApi(docId);
      if (detailEnquiry) {
        const updatedDocs = (detailEnquiry.documents || []).filter((d) => d.id !== docId);
        setDetailEnquiry({
          ...detailEnquiry,
          documents: updatedDocs,
        });
      }
      fetchList();
    } catch (err: any) {
      alert(err.message || 'Failed to delete document from vault');
    } finally {
      setDeletingDocId(null);
    }
  };

  const fetchList = () => {
    setLoading(true);
    getEnquiriesApi({
      page,
      limit,
      search: search.trim() || undefined,
      status: selectedStatus,
      loanType: selectedLoanType,
    })
      .then((data) => {
        setEnquiries(data.enquiries);
        setTotalPages(data.pagination.totalPages);
        setTotalCount(data.pagination.total);
      })
      .catch((err) => console.error('Error fetching enquiries:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchList();
  }, [page, limit, selectedStatus, selectedLoanType]);

  const isSearchMounted = useRef(false);
  useEffect(() => {
    if (!isSearchMounted.current) {
      isSearchMounted.current = true;
      return;
    }
    const timer = setTimeout(() => {
      setPage(1);
      fetchList();
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  // Handle Escape key to close document preview or side drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (adminPreviewDoc) {
          setAdminPreviewDoc(null);
        } else if (selectedEnquiryId) {
          setSelectedEnquiryId(null);
          setDetailEnquiry(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [adminPreviewDoc, selectedEnquiryId]);

  // Lock background body scroll when drawer or lightbox preview is active
  useEffect(() => {
    if (selectedEnquiryId || adminPreviewDoc) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedEnquiryId, adminPreviewDoc]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchList();
  };

  // Open Enquiry Detail
  const handleOpenDetail = (id: string, initialTab: 'overview' | 'documents' | 'activity' = 'overview') => {
    setSelectedEnquiryId(id);
    setDetailTab(initialTab);
    setDetailLoading(true);
    getEnquiryByIdApi(id)
      .then((enq) => {
        setDetailEnquiry(enq);
        setNewStatus(enq.status);
        setStatusNote('');
      })
      .catch((err) => console.error('Error loading enquiry detail:', err))
      .finally(() => setDetailLoading(false));
  };

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!detailEnquiry || !newStatus) return;

    setStatusUpdating(true);
    try {
      await updateEnquiryStatusApi(detailEnquiry.id, newStatus, statusNote.trim() || undefined);
      const refreshed = await getEnquiryByIdApi(detailEnquiry.id);
      setDetailEnquiry(refreshed);
      setStatusNote('');
      fetchList();
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!detailEnquiry || !newNoteContent.trim()) return;

    setNoteSubmitting(true);
    try {
      await addEnquiryNoteApi(detailEnquiry.id, newNoteContent.trim());
      setNewNoteContent('');
      const refreshed = await getEnquiryByIdApi(detailEnquiry.id);
      setDetailEnquiry(refreshed);
    } catch (err: any) {
      alert(err.message || 'Failed to record note');
    } finally {
      setNoteSubmitting(false);
    }
  };

  const formatAmountINR = (val?: number) => {
    if (!val) return '₹0';
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)} Lakhs`;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr || dateStr === 'Pending Advisor Allotment') return 'Pending';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const getFacilityBadge = (_loanType?: string) => {
    return 'bg-slate-100 text-[#0c1a26] border-slate-200/90 font-medium';
  };

  const getStatusBadgeConfig = (status: string) => {
    const s = formatStatusLabel(status);
    switch (s) {
      case 'Pending':
        return {
          badge: 'bg-amber-50/70 text-amber-900 border-amber-200/80',
          dot: 'bg-amber-500',
        };
      case 'Slot Booked':
        return {
          badge: 'bg-teal-50/70 text-teal-900 border-teal-200/80',
          dot: 'bg-teal-600',
        };
      case 'Process Started':
        return {
          badge: 'bg-teal-50/70 text-teal-900 border-teal-200/80',
          dot: 'bg-teal-600',
        };
      case 'Closed':
        return {
          badge: 'bg-slate-100 text-slate-600 border-slate-200',
          dot: 'bg-slate-400',
        };
      default:
        return {
          badge: 'bg-amber-50/70 text-amber-900 border-amber-200/80',
          dot: 'bg-amber-500',
        };
    }
  };

  const getStatusBadge = (status: string) => {
    return getStatusBadgeConfig(status).badge;
  };

  const getModeBadge = (mode?: string) => {
    switch (mode) {
      case 'video':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold font-heading bg-slate-100 text-slate-800 border border-slate-200">
            <Video className="w-3 h-3 text-slate-600" />
            <span>Google Meet</span>
          </span>
        );
      case 'in_person':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold font-heading bg-slate-100 text-slate-800 border border-slate-200">
            <Building2 className="w-3 h-3 text-slate-600" />
            <span>Tirupur Desk</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold font-heading bg-slate-100 text-slate-800 border border-slate-200">
            <Phone className="w-3 h-3 text-slate-600" />
            <span>Direct Call</span>
          </span>
        );
    }
  };

  // Modern animated skeleton loader for enquiries table
  const EnquiriesTableSkeleton: React.FC<{ rows?: number }> = ({ rows = 6 }) => {
    return (
      <>
        {Array.from({ length: rows }).map((_, idx) => (
          <tr key={idx} className="animate-pulse border-b border-slate-100">
            {/* 1. Applicant & Ref (Sticky Left) */}
            <td className="py-3 px-4 min-w-[210px] sm:min-w-[230px] sticky left-0 z-10 bg-white border-r border-slate-200/80">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-slate-200 shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-4 bg-slate-200 rounded w-28" />
                  <div className="h-3 bg-slate-100 rounded w-20" />
                </div>
              </div>
            </td>

            {/* 2. Contact & Location */}
            <td className="py-3 px-3.5 min-w-[160px]">
              <div className="space-y-1.5">
                <div className="h-3.5 bg-slate-200 rounded w-24" />
                <div className="h-3 bg-slate-100 rounded w-20" />
              </div>
            </td>

            {/* 3. Facility Type */}
            <td className="py-3 px-3.5 min-w-[140px]">
              <div className="h-6 bg-slate-200/80 rounded-lg w-24" />
            </td>

            {/* 4. Sanction Requested */}
            <td className="py-3 px-3.5 min-w-[125px]">
              <div className="h-4 bg-slate-200 rounded w-20" />
            </td>

            {/* 5. Consultation Slot */}
            <td className="py-3 px-3.5 min-w-[165px]">
              <div className="space-y-1.5">
                <div className="h-3.5 bg-slate-200 rounded w-24" />
                <div className="h-3 bg-slate-100 rounded w-20" />
              </div>
            </td>

            {/* 6. Pipeline Status */}
            <td className="py-3 px-3.5 min-w-[130px]">
              <div className="h-6 bg-slate-200/80 rounded-full w-24" />
            </td>

            {/* 7. Actions */}
            <td className="py-3 px-4 text-right min-w-[90px]">
              <div className="h-7 bg-slate-200 rounded-xl w-16 ml-auto" />
            </td>
          </tr>
        ))}
      </>
    );
  };

  // Executive animated skeleton loader for side drawer dossier modal
  const DrawerDossierSkeleton: React.FC<{ tab?: string }> = ({ tab = 'overview' }) => {
    if (tab === 'documents') {
      return (
        <div className="space-y-4 animate-pulse">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="h-4 bg-slate-200 rounded w-48" />
              <div className="h-5 bg-slate-200 rounded-full w-24" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-200 rounded-lg shrink-0" />
                  <div className="space-y-2 flex-1">
                    <div className="h-3.5 bg-slate-200 rounded w-28" />
                    <div className="h-2.5 bg-slate-100 rounded w-20" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (tab === 'activity') {
      return (
        <div className="space-y-4 animate-pulse">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-4 shadow-2xs">
            <div className="h-4 bg-slate-200 rounded w-40" />
            <div className="grid grid-cols-4 gap-2.5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-20 bg-slate-100 rounded-xl" />
              ))}
            </div>
          </div>
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-3 shadow-2xs">
            <div className="h-4 bg-slate-200 rounded w-36" />
            <div className="h-20 bg-slate-50 rounded-xl" />
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4 animate-pulse">
        {/* Card 1: Applicant Details Card Skeleton */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-4 shadow-2xs">
          <div className="h-3 bg-slate-200 rounded w-28" />
          <div className="flex items-center gap-3.5 pb-3 border-b border-slate-100">
            <div className="w-11 h-11 rounded-full bg-slate-200 shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-slate-200 rounded w-36" />
              <div className="h-3 bg-slate-100 rounded w-48" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-1">
            <div className="space-y-1.5">
              <div className="h-2.5 bg-slate-200 rounded w-16" />
              <div className="h-3.5 bg-slate-100 rounded w-28" />
            </div>
            <div className="space-y-1.5">
              <div className="h-2.5 bg-slate-200 rounded w-16" />
              <div className="h-3.5 bg-slate-100 rounded w-24" />
            </div>
            <div className="space-y-1.5">
              <div className="h-2.5 bg-slate-200 rounded w-24" />
              <div className="h-3.5 bg-slate-100 rounded w-20" />
            </div>
            <div className="space-y-1.5">
              <div className="h-2.5 bg-slate-200 rounded w-24" />
              <div className="h-3.5 bg-slate-100 rounded w-32" />
            </div>
          </div>
        </div>

        {/* Card 2: Loan & Property Card Skeleton */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-4 shadow-2xs">
          <div className="h-3 bg-slate-200 rounded w-44" />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="h-2.5 bg-slate-200 rounded w-20" />
              <div className="h-4 bg-slate-100 rounded w-28" />
            </div>
            <div className="space-y-1.5">
              <div className="h-2.5 bg-slate-200 rounded w-24" />
              <div className="h-5 bg-slate-200 rounded w-32" />
            </div>
            <div className="space-y-1.5">
              <div className="h-2.5 bg-slate-200 rounded w-20" />
              <div className="h-3.5 bg-slate-100 rounded w-24" />
            </div>
            <div className="space-y-1.5">
              <div className="h-2.5 bg-slate-200 rounded w-24" />
              <div className="h-3.5 bg-slate-100 rounded w-24" />
            </div>
            <div className="col-span-2 p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-200" />
                <div className="space-y-1.5">
                  <div className="h-3.5 bg-slate-200 rounded w-40" />
                  <div className="h-2.5 bg-slate-100 rounded w-52" />
                </div>
              </div>
              <div className="h-7 bg-slate-200 rounded-lg w-28" />
            </div>
          </div>
        </div>

        {/* Card 3: Consultation Booking Card Skeleton */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-3.5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="h-3.5 bg-slate-200 rounded w-44" />
            <div className="h-7 bg-slate-200 rounded-xl w-32" />
          </div>
          <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/90 space-y-2">
            <div className="h-3.5 bg-slate-200 rounded w-56" />
            <div className="h-3 bg-slate-100 rounded w-full" />
          </div>
          <div className="grid grid-cols-3 gap-3 p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/90">
            <div className="space-y-1.5">
              <div className="h-2.5 bg-slate-200 rounded w-24" />
              <div className="h-3.5 bg-slate-200 rounded w-28" />
            </div>
            <div className="space-y-1.5">
              <div className="h-2.5 bg-slate-200 rounded w-20" />
              <div className="h-3.5 bg-slate-200 rounded w-24" />
            </div>
            <div className="space-y-1.5">
              <div className="h-2.5 bg-slate-200 rounded w-16" />
              <div className="h-5 bg-slate-200 rounded-full w-24" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const parsedDossier = parseEnquiryData(detailEnquiry);
  const docsCount = parsedDossier.documents.length;

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Search & Filters Toolbar - Single Row */}
      <div className="bg-white p-2.5 sm:p-3 rounded-2xl border border-slate-200/90 shadow-2xs">
        <form onSubmit={handleSearchSubmit} className="flex flex-wrap lg:flex-nowrap items-center gap-2 sm:gap-3">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by applicant name, mobile, reference (e.g. VPF-2026-...) or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-[#0c1a26] font-sans placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setPage(1);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Loan Facility Dropdown */}
          <div className="shrink-0">
            <select
              value={selectedLoanType}
              onChange={(e) => {
                setSelectedLoanType(e.target.value);
                setPage(1);
              }}
              className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-heading font-semibold text-[#0c1a26] focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 cursor-pointer"
            >
              <option value="ALL">All Loan Facilities</option>
              <option value="Home Loan">Home Loan</option>
              <option value="Loan Against Property">Loan Against Property</option>
              <option value="Property-Backed Funding">Property-Backed Funding</option>
              <option value="Loan Consultation & Eligibility Review">Loan Consultation</option>
            </select>
          </div>

          {/* Separator */}
          <div className="hidden lg:block w-px h-6 bg-slate-200 shrink-0" />

          {/* Status Tab Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 lg:pb-0 text-xs shrink-0">
            {ALL_STATUSES.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => {
                  setSelectedStatus(status);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl font-heading font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedStatus === status
                    ? 'bg-slate-900 text-white shadow-sm ring-2 ring-teal-500/30'
                    : 'bg-slate-100/90 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                }`}
              >
                {status === 'ALL' ? 'All Statuses' : status}
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/90 border-b border-slate-200/90 text-slate-600 font-bold uppercase tracking-wider text-[11px] font-heading">
                <th className="py-3 px-4 min-w-[210px] sm:min-w-[230px] sticky left-0 z-20 bg-slate-50/95 backdrop-blur-xs border-r border-slate-200/80 shadow-[2px_0_5px_rgba(0,0,0,0.03)]">Applicant &amp; Reference</th>
                <th className="py-3 px-3.5 min-w-[160px]">Contact &amp; Location</th>
                <th className="py-3 px-3.5 min-w-[140px]">Facility Type</th>
                <th className="py-3 px-3.5 min-w-[125px]">Sanction Requested</th>
                <th className="py-3 px-3.5 min-w-[165px]">Consultation Slot</th>
                <th className="py-3 px-3.5 min-w-[130px]">Pipeline Status</th>
                <th className="py-3 px-4 text-right min-w-[90px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {loading ? (
                <EnquiriesTableSkeleton rows={6} />
              ) : enquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-500 font-sans">
                    <FileSpreadsheet className="w-10 h-10 mx-auto text-slate-300 mb-2.5" />
                    <span className="text-sm font-bold text-slate-700 font-heading block">No enquiries found</span>
                    <span className="text-xs text-slate-400 font-sans">No pipeline records match the selected filter criteria.</span>
                  </td>
                </tr>
              ) : (
                enquiries.map((enq) => {
                  const appointment = enq.appointments && enq.appointments[0];
                  const initials =
                    enq.fullName
                      .split(' ')
                      .map((n: string) => n[0])
                      .slice(0, 2)
                      .join('')
                      .toUpperCase() || 'AP';
                  const statusCfg = getStatusBadgeConfig(enq.status);
                  const rowDocs = parseEnquiryData(enq).documents;

                  return (
                    <tr
                      key={enq.id}
                      onClick={() => handleOpenDetail(enq.id, 'overview')}
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer border-b border-slate-100"
                    >
                      {/* 1. Applicant & Reference (Sticky Left) */}
                      <td className="py-3 px-4 min-w-[210px] sm:min-w-[230px] sticky left-0 z-10 bg-white group-hover:bg-slate-50/90 transition-colors border-r border-slate-200/80 shadow-[2px_0_5px_rgba(0,0,0,0.03)]">
                        <div className="flex items-center gap-2.5">
                          <UserAvatar
                            src={enq.customer?.picture}
                            name={enq.fullName}
                            size={36}
                            showGoogleBadge={Boolean(enq.customer?.email || enq.customerId)}
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-900 font-heading text-xs sm:text-sm group-hover:text-teal-700 transition-colors truncate">
                                {enq.fullName}
                              </span>
                              {(enq.customer?.email || enq.customerId) && (
                                <span title="Google Verified Applicant" className="shrink-0 inline-flex items-center">
                                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span
                                className="font-mono text-[10px] font-bold text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200/70 tracking-tight whitespace-nowrap shadow-2xs"
                                title="Application Reference"
                              >
                                {enq.referenceNumber}
                              </span>
                              {rowDocs.length > 0 && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenDetail(enq.id, 'documents');
                                  }}
                                  className="inline-flex items-center gap-0.5 text-[9px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 px-1.5 py-0.5 rounded transition-colors cursor-pointer shrink-0"
                                  title={`${rowDocs.length} reference documents attached - click to view`}
                                >
                                  <FileCheck className="w-2.5 h-2.5 text-teal-600" />
                                  <span>{rowDocs.length} docs</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 2. Contact & Location */}
                      <td className="py-3 px-3.5 min-w-[160px] whitespace-nowrap">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <a
                              href={`tel:${enq.mobileNumber}`}
                              onClick={(e) => e.stopPropagation()}
                              className="font-mono text-xs font-semibold text-slate-800 hover:text-teal-700 hover:underline"
                            >
                              {enq.mobileNumber}
                            </a>
                            {enq.mobileNumber && (
                              <a
                                href={`https://wa.me/91${enq.mobileNumber.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(
                                  enq.fullName
                                )},%20this%20is%20Prime%20Associates%20Loans%20regarding%20your%20property%20loan%20enquiry%20Ref:%20${enq.referenceNumber}.`}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1 text-[10px] text-slate-700 bg-slate-100 hover:bg-slate-200 px-1.5 py-0.5 rounded font-bold border border-slate-200 transition-colors shrink-0"
                                title="Chat on WhatsApp"
                              >
                                <span>WA</span>
                              </a>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate max-w-[130px]">{enq.cityState || 'Tamil Nadu'}</span>
                          </div>
                        </div>
                      </td>

                      {/* 3. Facility Type */}
                      <td className="py-3 px-3.5 whitespace-nowrap min-w-[140px]">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold font-heading border shadow-2xs ${getFacilityBadge(
                            enq.loanType
                          )}`}
                        >
                          {enq.loanType}
                        </span>
                      </td>

                      {/* 4. Sanction Requested Amount */}
                      <td className="py-3 px-3.5 whitespace-nowrap min-w-[125px]">
                        <div className="font-heading font-extrabold text-sm text-slate-900 tracking-tight tabular-nums">
                          {formatAmountINR(enq.loanAmount)}
                        </div>
                      </td>

                      {/* 5. Consultation Slot Column */}
                      <td className="py-3 px-3.5 text-xs whitespace-nowrap min-w-[165px]">
                        {appointment?.date || enq.preferredDate ? (
                          <div className="space-y-0.5">
                            <div className="font-heading font-bold text-slate-900 text-xs flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                              <span>{formatDate(appointment?.date || enq.preferredDate)}</span>
                            </div>
                            <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                              <span>{appointment?.timeSlot || enq.preferredTimeSlot || 'Standard Slot'}</span>
                            </div>
                            <div className="pt-0.5">
                              {getModeBadge(appointment?.meetingMode || enq.meetingMode)}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs italic">— Unallotted —</span>
                        )}
                      </td>

                      {/* 6. Pipeline Status */}
                      <td className="py-3 px-3.5 whitespace-nowrap min-w-[130px]">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border font-heading shadow-2xs ${statusCfg.badge}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                          <span>{formatStatusLabel(enq.status)}</span>
                        </span>
                      </td>

                      {/* 7. Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap min-w-[90px]">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDetail(enq.id, 'overview');
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-teal-700 text-white rounded-xl text-xs font-bold font-heading transition-all border border-slate-900 hover:border-teal-700 cursor-pointer shadow-2xs hover:shadow-xs active:scale-95"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Review</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls (Always visible at the bottom of the table) */}
        <div className="px-4 py-3 sm:px-5 border-t border-slate-200/90 bg-slate-50/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 font-sans">
          <div className="flex flex-wrap items-center gap-3">
            <span>
              Showing{' '}
              <span className="font-bold text-slate-900 font-heading tabular-nums">
                {totalCount === 0 ? 0 : (page - 1) * limit + 1}–{Math.min(page * limit, totalCount)}
              </span>{' '}
              of <span className="font-bold text-slate-900 font-heading tabular-nums">{totalCount}</span> enquiries
            </span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="hidden sm:inline text-slate-500">
              Page <span className="font-bold text-slate-900 font-heading">{page}</span> of{' '}
              <span className="font-bold text-slate-900 font-heading">{Math.max(totalPages, 1)}</span>
            </span>

            {/* Pagination Limit (Rows per page) Selector */}
            <span className="text-slate-300 hidden sm:inline">•</span>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-medium text-[11px]">Rows:</span>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="px-2 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-xs font-heading font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 cursor-pointer shadow-2xs transition-all"
                title="Select records per page"
              >
                <option value={5}>5 / page</option>
                <option value={10}>10 / page</option>
                <option value={15}>15 / page</option>
                <option value={25}>25 / page</option>
                <option value={50}>50 / page</option>
                <option value={100}>100 / page</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-heading font-bold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs hover:shadow-xs transition-all active:scale-95 cursor-pointer"
              title="Previous Page"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            {/* Page Number Pills */}
            {totalPages > 1 && (
              <div className="hidden sm:flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPage(p)}
                    className={`w-7 h-7 rounded-lg text-xs font-heading font-bold transition-all cursor-pointer ${
                      p === page
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}

            <button
              type="button"
              disabled={page >= Math.max(totalPages, 1) || loading}
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-heading font-bold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs hover:shadow-xs transition-all active:scale-95 cursor-pointer"
              title="Next Page"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* DETAIL MODAL / SLIDE-OVER */}
      {selectedEnquiryId && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 top-0 left-0 right-0 bottom-0 z-[100] bg-[#0c1a26]/60 backdrop-blur-sm flex items-center justify-end animate-in fade-in duration-200"
          style={{ zIndex: 100 }}
          onClick={() => {
            setSelectedEnquiryId(null);
            setDetailEnquiry(null);
          }}
        >
          <div
            className="w-full max-w-2xl bg-white h-screen max-h-screen shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-slate-50 to-teal-50/30">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-extrabold text-[#0c1a26] text-lg sm:text-xl">
                    {detailEnquiry?.referenceNumber || 'Loading...'}
                  </span>
                  {detailEnquiry && (
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(detailEnquiry.status)}`}>
                      {detailEnquiry.status}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 font-sans">
                  Borrower Case Dossier &amp; Operational Actions
                </p>
              </div>
              <button
                onClick={() => setSelectedEnquiryId(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Segmented Tabs (Clean 3-Tab Architecture) */}
            <div className="flex items-center gap-1 px-5 pt-3 border-b border-slate-200 bg-white overflow-x-auto text-xs font-heading">
              <button
                type="button"
                onClick={() => setDetailTab('overview')}
                className={`pb-2.5 px-3.5 border-b-2 font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  detailTab === 'overview'
                    ? 'border-teal-600 text-teal-700'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                Case Overview
              </button>
              <button
                type="button"
                onClick={() => setDetailTab('documents')}
                className={`pb-2.5 px-3.5 border-b-2 font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                  detailTab === 'documents'
                    ? 'border-teal-600 text-teal-700'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <span>Attached Documents</span>
                {docsCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800">
                    {docsCount}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setDetailTab('activity')}
                className={`pb-2.5 px-3.5 border-b-2 font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                  detailTab === 'activity'
                    ? 'border-teal-600 text-teal-700'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <span>Activity &amp; Notes</span>
                {((detailEnquiry?.notes?.length || 0) + (detailEnquiry?.statusHistory?.length || 0)) > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                    {(detailEnquiry?.notes?.length || 0) + (detailEnquiry?.statusHistory?.length || 0)}
                  </span>
                )}
              </button>
            </div>

            {/* Modal Content Viewport */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-xs sm:text-sm bg-slate-50/40">
              {detailLoading || !detailEnquiry ? (
                <DrawerDossierSkeleton tab={detailTab} />
              ) : (
                <>
                  {/* TAB 1: CASE OVERVIEW */}
                  {detailTab === 'overview' && (() => {
                    const doorstepAddress = parsedDossier.doorstepAddress || (detailEnquiry.meetingMode === 'in_person' ? (detailEnquiry.propertyLocation || detailEnquiry.cityState) : null);

                    return (
                      <div className="space-y-4">
                        {/* Applicant Details Card */}
                        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-3.5 shadow-2xs">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-heading">
                            Applicant Dossier
                          </h4>
                          <div className="flex items-center gap-3.5 pb-2 border-b border-slate-100">
                            <UserAvatar
                              src={detailEnquiry.customer?.picture}
                              name={detailEnquiry.fullName}
                              size={44}
                              showGoogleBadge={Boolean(detailEnquiry.customer?.email || detailEnquiry.customerId)}
                            />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-[#0c1a26] text-sm font-heading">{detailEnquiry.fullName}</span>
                                {(detailEnquiry.customer?.email || detailEnquiry.customerId) && (
                                  <span title="Google Verified Applicant">
                                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-slate-400 font-sans block">
                                {detailEnquiry.customer?.email ? 'Google Authenticated Borrower' : 'Direct Advisory Intake'}
                              </span>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <span className="text-slate-400 block text-[11px]">Full Name</span>
                              <span className="font-bold text-[#0c1a26] text-xs sm:text-sm font-heading">{detailEnquiry.fullName}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[11px]">Mobile Number</span>
                              <div className="flex items-center gap-1.5">
                                <a
                                  href={`tel:${detailEnquiry.mobileNumber}`}
                                  className="font-bold text-teal-700 hover:underline text-xs sm:text-sm font-mono"
                                >
                                  {detailEnquiry.mobileNumber}
                                </a>
                                {detailEnquiry.mobileNumber && (
                                  <a
                                    href={`https://wa.me/91${detailEnquiry.mobileNumber.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(
                                      detailEnquiry.fullName
                                    )},%20this%20is%20Prime%20Associates%20Loans%20regarding%20your%20property%20loan%20enquiry%20Ref:%20${detailEnquiry.referenceNumber}.`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-1 text-slate-600 hover:bg-slate-100 rounded border border-slate-200 transition-colors inline-flex items-center"
                                    title="Chat on WhatsApp"
                                  >
                                    <Phone className="w-3.5 h-3.5 text-slate-600" />
                                  </a>
                                )}
                              </div>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[11px]">Email</span>
                              <span className="font-medium text-[#0c1a26] text-xs">
                                {detailEnquiry.email || 'Not provided'}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[11px]">Preferred Contact Method</span>
                              <span className="font-semibold text-[#0c1a26] capitalize text-xs">
                                {detailEnquiry.preferredContactMethod}
                              </span>
                            </div>
                            <div className="col-span-2">
                              <span className="text-slate-400 block text-[11px]">Applicant Location</span>
                              <span className="font-medium text-[#0c1a26] text-xs">{detailEnquiry.cityState}</span>
                            </div>
                          </div>
                        </div>

                        {/* Loan & Property Card */}
                        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-3.5 shadow-2xs">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-heading">
                            Loan &amp; Property Specifications
                          </h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <span className="text-slate-400 block text-[11px]">Loan Facility</span>
                              <span className="font-bold text-[#0c1a26] text-xs">{detailEnquiry.loanType}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[11px]">Sanction Requested</span>
                              <span className="font-extrabold text-teal-700 font-mono text-sm sm:text-base">
                                {formatAmountINR(detailEnquiry.loanAmount)}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[11px]">Property Type</span>
                              <span className="font-medium text-[#0c1a26] capitalize text-xs">
                                {detailEnquiry.propertyType}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[11px]">Ownership Status</span>
                              <span className="font-medium text-[#0c1a26] capitalize text-xs">
                                {detailEnquiry.propertyOwnershipStatus.replace('_', ' ')}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[11px]">Property Location</span>
                              <span className="font-medium text-[#0c1a26] text-xs">
                                {detailEnquiry.propertyLocation}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[11px]">Employment Type</span>
                              <span className="font-medium text-[#0c1a26] capitalize text-xs">
                                {detailEnquiry.employmentType.replace('_', ' ')}
                              </span>
                            </div>

                            {(parsedDossier.preferredBank || detailEnquiry.preferredBank) && (
                              <div className="col-span-2 pt-2 border-t border-slate-100">
                                <span className="text-slate-500 block text-[11px] font-heading font-medium">Preferred Channel Partner / Bank</span>
                                <div className="inline-flex items-center gap-1.5 font-bold text-slate-800 bg-slate-100/90 px-2.5 py-1 rounded-lg border border-slate-200/90 mt-1 text-xs">
                                  <Landmark className="w-3.5 h-3.5 text-slate-600" />
                                  <span>{parsedDossier.preferredBank || detailEnquiry.preferredBank}</span>
                                </div>
                              </div>
                            )}

                            {docsCount > 0 && (
                              <div className="col-span-2 p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/90 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-700 flex items-center justify-center shrink-0 shadow-2xs">
                                    <FileCheck className="w-4 h-4 text-teal-700" />
                                  </div>
                                  <div className="min-w-0">
                                    <span className="text-xs font-bold text-slate-900 block font-heading">
                                      {docsCount} Reference {docsCount === 1 ? 'Document' : 'Documents'} Attached
                                    </span>
                                    <p className="text-[11px] text-slate-500 truncate">
                                      {parsedDossier.attachedDocsSummary || 'Uploaded by borrower for pre-underwriting review'}
                                    </p>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setDetailTab('documents')}
                                  className="px-3 py-1.5 bg-[#0c1a26] hover:bg-teal-700 text-white rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1 shadow-2xs cursor-pointer font-heading active:scale-95"
                                >
                                  <span>View Documents</span>
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </div>

                          {/* VEHICLE DETAILS (IF CAR LOAN) */}
                          {detailEnquiry.carLoanDetails && (
                            <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/90 space-y-2 mt-2">
                              <div className="flex items-center gap-1.5 text-[#0c1a26] font-bold text-xs">
                                <Car className="w-4 h-4 text-slate-700" />
                                <span>Vehicle Specifications ({detailEnquiry.carLoanDetails.carType?.toUpperCase()})</span>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                {detailEnquiry.carLoanDetails.onRoadPrice && (
                                  <div>
                                    <span className="text-slate-400 block text-[10px]">On-Road Price</span>
                                    <span className="font-bold text-[#0c1a26]">{formatAmountINR(detailEnquiry.carLoanDetails.onRoadPrice)}</span>
                                  </div>
                                )}
                                {detailEnquiry.carLoanDetails.showroomName && (
                                  <div>
                                    <span className="text-slate-400 block text-[10px]">Showroom / Financer</span>
                                    <span className="font-semibold text-[#0c1a26]">{detailEnquiry.carLoanDetails.showroomName}</span>
                                  </div>
                                )}
                                {detailEnquiry.carLoanDetails.area && (
                                  <div>
                                    <span className="text-slate-400 block text-[10px]">Area</span>
                                    <span className="font-semibold text-[#0c1a26]">{detailEnquiry.carLoanDetails.area}</span>
                                  </div>
                                )}
                                {detailEnquiry.carLoanDetails.modelYear && (
                                  <div>
                                    <span className="text-slate-400 block text-[10px]">Model &amp; Year</span>
                                    <span className="font-semibold text-[#0c1a26]">{detailEnquiry.carLoanDetails.modelYear}</span>
                                  </div>
                                )}
                                {detailEnquiry.carLoanDetails.ownersCount && (
                                  <div>
                                    <span className="text-slate-400 block text-[10px]">Ownership</span>
                                    <span className="font-semibold text-[#0c1a26]">{detailEnquiry.carLoanDetails.ownersCount} Owner(s)</span>
                                  </div>
                                )}
                                {detailEnquiry.carLoanDetails.purchaseValue && (
                                  <div>
                                    <span className="text-slate-400 block text-[10px]">Purchase / Valuation Value</span>
                                    <span className="font-bold text-[#0c1a26]">{formatAmountINR(detailEnquiry.carLoanDetails.purchaseValue)}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {parsedDossier.borrowerRemarks && (
                            <div className="pt-3 border-t border-slate-100">
                              <span className="text-slate-500 block text-[11px] mb-1 font-heading font-bold uppercase tracking-wider">
                                Applicant Remarks:
                              </span>
                              <div className="bg-slate-50 p-3 rounded-xl text-[#0c1a26] border border-slate-200/80 font-sans text-xs">
                                <p className="italic font-medium leading-relaxed">
                                  "{parsedDossier.borrowerRemarks}"
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Consultation Request & Slot Details Card (Integrated into Overview) */}
                        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-3.5 shadow-2xs">
                          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-slate-700" />
                              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-heading">
                                Consultation Booking &amp; Slot
                              </h4>
                            </div>

                            <Link
                              to={`/admin/appointments?allotEnquiryId=${detailEnquiry.id}`}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0c1a26] hover:bg-teal-700 text-white rounded-xl text-xs font-bold font-heading shadow-xs transition-colors"
                            >
                              <CalendarCheck2 className="w-3.5 h-3.5" />
                              <span>Allot / Schedule Slot</span>
                            </Link>
                          </div>

                          {/* Mode-Specific Information Banner (Neutral Corporate Styling) */}
                          {detailEnquiry.meetingMode === 'video' && (
                            <div className="p-3.5 bg-slate-50/80 border border-slate-200/90 rounded-xl text-xs flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2.5">
                                <Video className="w-4 h-4 text-slate-700 shrink-0" />
                                <div>
                                  <span className="font-bold text-slate-900 font-heading block">Google Meet Video Consultation</span>
                                  <span className="text-slate-500 font-sans text-[11px]">
                                    Borrower requested a video conference call. Generate an official Google Meet link during allotment.
                                  </span>
                                </div>
                              </div>
                              <span className="text-[10px] font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200 shrink-0 shadow-2xs font-heading">
                                Google Meet
                              </span>
                            </div>
                          )}

                          {detailEnquiry.meetingMode === 'in_person' && (
                            <div className="p-3.5 bg-slate-50/80 border border-slate-200/90 rounded-xl text-xs space-y-2.5">
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex items-start gap-2.5">
                                  <Building2 className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
                                  <div>
                                    <span className="font-bold text-slate-900 font-heading block">
                                      Offline Doorstep Meeting (Advisor Visits Borrower Area)
                                    </span>
                                    <span className="text-slate-500 font-sans text-[11px]">
                                      Borrower requested an advisor to visit their area for in-person assessment and document pickup.
                                    </span>
                                  </div>
                                </div>

                                {doorstepAddress && (
                                  <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(doorstepAddress)}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200/90 rounded-lg text-[10px] font-bold font-heading shrink-0 shadow-2xs transition-colors"
                                  >
                                    <MapPin className="w-3 h-3 text-slate-600" />
                                    <span>Maps</span>
                                    <ExternalLink className="w-3 h-3 text-slate-400" />
                                  </a>
                                )}
                              </div>

                              {doorstepAddress && (
                                <div className="p-2.5 bg-white rounded-xl border border-slate-200/90 text-xs font-semibold text-slate-800 font-sans shadow-2xs">
                                  <span className="text-slate-500 font-medium">📍 Customer Location:</span> {doorstepAddress}
                                </div>
                              )}
                            </div>
                          )}

                          {(!detailEnquiry.meetingMode || detailEnquiry.meetingMode === 'phone') && (
                            <div className="p-3.5 bg-slate-50/80 border border-slate-200/90 rounded-xl text-xs flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2.5">
                                <Phone className="w-4 h-4 text-slate-700 shrink-0" />
                                <div>
                                  <span className="font-bold text-slate-900 font-heading block">Direct Telephonic Consultation</span>
                                  <span className="text-slate-500 font-sans text-[11px]">
                                    Advisor calls applicant directly at registered phone: <strong>+91 {detailEnquiry.mobileNumber}</strong>.
                                  </span>
                                </div>
                              </div>
                              <a
                                href={`tel:${detailEnquiry.mobileNumber}`}
                                className="text-[11px] font-bold text-slate-800 bg-white hover:bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 shrink-0 shadow-2xs font-heading"
                              >
                                Call
                              </a>
                            </div>
                          )}

                          {/* Preferred Date & Slot Details */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/90">
                            <div>
                              <span className="text-slate-400 block text-[11px] font-medium font-heading">Preferred Date &amp; Slot</span>
                              <span className="font-bold text-slate-900 text-xs font-mono">
                                {detailEnquiry.preferredDate || 'Not Specified'} &bull; {detailEnquiry.preferredTimeSlot || 'Pending'}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[11px] font-medium font-heading">Consultation Mode</span>
                              <span className="font-semibold text-slate-800 capitalize text-xs">
                                {detailEnquiry.meetingMode === 'in_person'
                                  ? 'Doorstep Area Visit'
                                  : detailEnquiry.meetingMode === 'video'
                                  ? 'Google Meet Call'
                                  : 'Direct Phone Call'}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[11px] font-medium font-heading">Queue Status</span>
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold mt-1 bg-white text-slate-700 border border-slate-200 shadow-2xs font-heading">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                <span>Pending Allotment</span>
                              </span>
                            </div>
                          </div>

                          {/* WhatsApp Message Communication Box */}
                          <div className="p-3.5 bg-slate-50/80 border border-slate-200/90 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                            <div className="space-y-0.5">
                              <span className="font-bold text-slate-900 font-heading block">
                                Send Confirmation via WhatsApp
                              </span>
                              <p className="text-slate-500 text-[11px] font-sans">
                                Send consultation slot details and advisor contact directly to borrower.
                              </p>
                            </div>
                            <a
                              href={`https://wa.me/91${detailEnquiry.mobileNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
                                `Dear ${detailEnquiry.fullName}, greetings from Prime Associates.\n\nRegarding your loan enquiry for ${detailEnquiry.loanType} (Ref: ${detailEnquiry.referenceNumber}):\n📅 Preferred Date: ${detailEnquiry.preferredDate || 'To be confirmed'}\n⏰ Preferred Slot: ${detailEnquiry.preferredTimeSlot || 'To be confirmed'}\n📍 Consultation Mode: ${
                                  detailEnquiry.meetingMode === 'in_person'
                                    ? `Doorstep Visit (Advisor Visiting Your Area: ${doorstepAddress || detailEnquiry.cityState})`
                                    : detailEnquiry.meetingMode === 'video'
                                    ? 'Google Meet Video Call'
                                    : 'Direct Phone Call'
                                }\n\nPlease keep your reference KYC & bank statements ready. For questions, call +91 96555 66613.`
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-[#0c1a26] hover:bg-teal-700 text-white rounded-xl text-xs font-bold font-heading shadow-xs transition-colors flex-shrink-0 cursor-pointer active:scale-95"
                            >
                              <Phone className="w-3.5 h-3.5 text-white" />
                              <span>Send WhatsApp Message</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* TAB 2: ATTACHED DOCUMENTS */}
                  {detailTab === 'documents' && (() => {
                    const allDocs = parsedDossier.documents;
                    const categories = Array.from(new Set(allDocs.map((d) => d.category || 'General').filter(Boolean)));
                    const displayedDocs = docCategoryFilter === 'ALL'
                      ? allDocs
                      : allDocs.filter((d) => (d.category || 'General').toLowerCase() === docCategoryFilter.toLowerCase());

                    return (
                      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-4 shadow-2xs">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <FileCheck className="w-4 h-4 text-teal-600" />
                              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0c1a26] font-heading">
                                Submitted Reference Documents
                              </h4>
                            </div>
                            <p className="text-[11px] text-slate-500 font-sans">
                              {allDocs.length} {allDocs.length === 1 ? 'file' : 'files'} submitted by applicant for credit appraisal &amp; pre-underwriting
                            </p>
                          </div>
                          <span className="text-xs font-extrabold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200 self-start sm:self-auto font-heading">
                            {allDocs.length} Files Attached
                          </span>
                        </div>

                        {/* Category Filter Pills */}
                        {categories.length > 1 && (
                          <div className="flex items-center gap-1.5 flex-wrap pt-1">
                            <button
                              type="button"
                              onClick={() => setDocCategoryFilter('ALL')}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold font-heading transition-colors cursor-pointer ${
                                docCategoryFilter === 'ALL'
                                  ? 'bg-teal-600 text-white shadow-2xs'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              All ({allDocs.length})
                            </button>
                            {categories.map((cat) => {
                              const count = allDocs.filter((d) => (d.category || 'General') === cat).length;
                              return (
                                <button
                                  key={cat}
                                  type="button"
                                  onClick={() => setDocCategoryFilter(cat)}
                                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold font-heading transition-colors cursor-pointer ${
                                    docCategoryFilter.toLowerCase() === cat.toLowerCase()
                                      ? 'bg-teal-600 text-white shadow-2xs'
                                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                  }`}
                                >
                                  {cat} ({count})
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {displayedDocs.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                            {displayedDocs.map((doc) => {
                              const isImage = doc.type?.includes('image') || (doc.previewUrl && doc.previewUrl.startsWith('data:image'));
                              return (
                                <div
                                  key={doc.id}
                                  className="p-3.5 rounded-2xl border border-slate-200/90 hover:border-teal-400 bg-slate-50/40 hover:bg-white transition-all flex items-start gap-3 group shadow-2xs hover:shadow-xs"
                                >
                                  {isImage ? (
                                    <div
                                      onClick={() => setAdminPreviewDoc(doc)}
                                      className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 cursor-pointer shrink-0 shadow-2xs group/img bg-slate-100 flex items-center justify-center"
                                      title="Click to view full document"
                                    >
                                      <img
                                        src={doc.previewUrl}
                                        alt={doc.name}
                                        className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-200"
                                      />
                                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white">
                                        <Eye className="w-4 h-4 drop-shadow" />
                                      </div>
                                    </div>
                                  ) : (
                                    <div
                                      onClick={() => setAdminPreviewDoc(doc)}
                                      className="w-16 h-16 rounded-xl bg-red-50 border border-red-200 flex flex-col items-center justify-center text-red-700 shrink-0 font-bold text-xs shadow-2xs cursor-pointer hover:bg-red-100 transition-colors"
                                      title="Click to view PDF document"
                                    >
                                      <FileText className="w-5 h-5 text-red-600 mb-0.5" />
                                      <span className="font-heading text-[10px]">PDF</span>
                                    </div>
                                  )}

                                  <div className="min-w-0 flex-1 space-y-1">
                                    <div className="flex items-center justify-between gap-1">
                                      <span className="text-[9px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200/80 font-heading">
                                        {doc.category || 'Reference'}
                                      </span>
                                      <span className="text-[10px] text-slate-400 font-sans tabular-nums">
                                        {doc.size ? `${(doc.size / 1024).toFixed(0)} KB` : 'Verified'}
                                      </span>
                                    </div>
                                    <h5 className="text-xs font-bold text-[#0c1a26] truncate block pt-0.5 font-heading" title={doc.documentName || doc.name}>
                                      {doc.documentName || doc.name}
                                    </h5>
                                    <p className="text-[10px] text-slate-400 truncate font-mono">
                                      {doc.name}
                                    </p>
                                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
                                      <div className="flex items-center gap-2">
                                        <button
                                          type="button"
                                          onClick={() => setAdminPreviewDoc(doc)}
                                          className="text-teal-700 hover:text-teal-900 font-bold flex items-center gap-1 font-heading hover:underline cursor-pointer"
                                        >
                                          <Eye className="w-3 h-3" />
                                          <span>Preview</span>
                                        </button>
                                        <a
                                          href={doc.previewUrl}
                                          download={doc.name || 'document'}
                                          className="text-slate-600 hover:text-slate-900 font-bold flex items-center gap-1 font-heading hover:underline"
                                          title="Download document file"
                                        >
                                          <Download className="w-3 h-3" />
                                          <span>Download</span>
                                        </a>
                                      </div>

                                      <button
                                        type="button"
                                        onClick={() => handleDeleteDoc(doc.id, doc.documentName || doc.name)}
                                        disabled={deletingDocId === doc.id}
                                        className="text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1 font-heading hover:bg-rose-50 px-1.5 py-0.5 rounded transition-colors cursor-pointer disabled:opacity-50"
                                        title="Delete document permanently"
                                      >
                                        {deletingDocId === doc.id ? (
                                          <Loader2 className="w-3 h-3 animate-spin" />
                                        ) : (
                                          <Trash2 className="w-3 h-3" />
                                        )}
                                        <span>Delete</span>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="p-8 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-2 text-xs text-slate-500">
                            <ImageIcon className="w-8 h-8 text-slate-300 mx-auto" />
                            <p className="font-bold text-[#0c1a26] font-heading">No Document Files Uploaded</p>
                            <p className="text-[11px] max-w-sm mx-auto font-sans">
                              Borrower will provide physical KYC &amp; property documents during consultation.
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* TAB 3: ACTIVITY & NOTES (UNIFIED OPERATIONAL FEED & PIPELINE CONTROLLER) */}
                  {detailTab === 'activity' && (
                    <div className="space-y-4">
                      {/* Loan Approval Pipeline Stepper & Workflow Controller */}
                      {(() => {
                        const PIPELINE_STEPS = [
                          {
                            key: 'Pending',
                            step: '01',
                            title: '1. New Intake',
                            subtitle: 'Application Submitted',
                          },
                          {
                            key: 'Slot Booked',
                            step: '02',
                            title: '2. Slot Scheduled',
                            subtitle: 'Consultation Fixed',
                          },
                          {
                            key: 'Process Started',
                            step: '03',
                            title: '3. Bank Underwriting',
                            subtitle: 'Credit & Verification',
                          },
                          {
                            key: 'Closed',
                            step: '04',
                            title: '4. Disbursed / Closed',
                            subtitle: 'Case Finalized',
                          },
                        ] as const;

                        const currentStepKey = formatStatusLabel(detailEnquiry.status);
                        const currentStepIndex = PIPELINE_STEPS.findIndex((s) => s.key === currentStepKey);
                        const activeIndex = currentStepIndex === -1 ? 0 : currentStepIndex;

                        const targetStepKey = formatStatusLabel(newStatus);
                        const isDirty = targetStepKey !== currentStepKey;
                        const currentStep = PIPELINE_STEPS[activeIndex];
                        const nextStep = activeIndex < PIPELINE_STEPS.length - 1 ? PIPELINE_STEPS[activeIndex + 1] : null;

                        return (
                          <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
                            {/* Header: Stage info & current status */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                                  <Layers className="w-4 h-4 text-slate-700" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-heading">
                                      Loan Approval Pipeline
                                    </h4>
                                    <span className="text-[10px] font-bold font-heading bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full border border-slate-200 shadow-2xs">
                                      Stage {activeIndex + 1} of 4
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-500 font-sans">
                                    Update borrower progress across the sanction and disbursal workflow
                                  </p>
                                </div>
                              </div>

                              <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 border border-slate-200 rounded-full text-xs font-bold font-heading self-start sm:self-auto text-slate-800 shadow-2xs">
                                <span className={`w-2 h-2 rounded-full ${getStatusBadgeConfig(detailEnquiry.status).dot} animate-pulse`} />
                                <span>Current: {currentStepKey}</span>
                              </div>
                            </div>

                            {/* Connected Visual Pipeline Stepper Track */}
                            <div className="relative pt-1 pb-1">
                              {/* Continuous Progress Line (Desktop) */}
                              <div className="hidden sm:block absolute top-7 left-12 right-12 h-1 bg-slate-100 rounded-full z-0">
                                <div
                                  className="h-full bg-teal-600 rounded-full transition-all duration-300"
                                  style={{ width: `${(activeIndex / (PIPELINE_STEPS.length - 1)) * 100}%` }}
                                />
                              </div>

                              {/* 4 Step Nodes */}
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 relative z-10">
                                {PIPELINE_STEPS.map((step, idx) => {
                                  const isCurrent = step.key === currentStepKey;
                                  const isSelectedTarget = isDirty && step.key === targetStepKey;
                                  const isCompleted = idx < activeIndex;
                                  const isNext = idx === activeIndex + 1 && !isDirty;

                                  return (
                                    <button
                                      key={step.key}
                                      type="button"
                                      onClick={() => setNewStatus(step.key)}
                                      className={`text-center p-3 rounded-2xl border transition-all cursor-pointer relative group flex flex-col items-center justify-between min-h-[96px] ${
                                        isCurrent
                                          ? 'bg-[#0c1a26] text-white border-[#0c1a26] shadow-md ring-2 ring-slate-900/10'
                                          : isSelectedTarget
                                          ? 'bg-teal-50 text-teal-950 border-teal-500 ring-2 ring-teal-500/30 shadow-xs'
                                          : isCompleted
                                          ? 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                                          : isNext
                                          ? 'bg-white hover:bg-slate-50 text-slate-700 border-dashed border-teal-400'
                                          : 'bg-white hover:bg-slate-50 text-slate-400 border-slate-200/80'
                                      }`}
                                    >
                                      {/* Step Circle Indicator */}
                                      <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-1.5 transition-transform group-hover:scale-105 shadow-2xs ${
                                          isCurrent
                                            ? 'bg-teal-500 text-white ring-4 ring-white/20'
                                            : isSelectedTarget
                                            ? 'bg-teal-600 text-white ring-4 ring-teal-100'
                                            : isCompleted
                                            ? 'bg-teal-100 text-teal-800'
                                            : isNext
                                            ? 'bg-teal-50 text-teal-700 border border-teal-300'
                                            : 'bg-slate-100 text-slate-400'
                                        }`}
                                      >
                                        {isCompleted ? <Check className="w-4 h-4 text-teal-700 stroke-[3]" /> : idx + 1}
                                      </div>

                                      {/* Step Title & Subtitle */}
                                      <div className="w-full">
                                        <span
                                          className={`block text-xs font-bold font-heading truncate ${
                                            isCurrent ? 'text-white' : isSelectedTarget ? 'text-teal-950' : 'text-slate-900'
                                          }`}
                                        >
                                          {step.title}
                                        </span>
                                        <span
                                          className={`block text-[10px] font-sans truncate mt-0.5 ${
                                            isCurrent ? 'text-slate-300' : isSelectedTarget ? 'text-teal-700 font-medium' : 'text-slate-400'
                                          }`}
                                        >
                                          {step.subtitle}
                                        </span>
                                      </div>

                                      {/* Step Stage Tag */}
                                      <div className="mt-1.5">
                                        {isCurrent && (
                                          <span className="text-[9px] font-bold font-heading uppercase px-2 py-0.5 bg-teal-400/20 text-teal-300 border border-teal-400/30 rounded-full inline-block">
                                            ● Active Stage
                                          </span>
                                        )}
                                        {isSelectedTarget && (
                                          <span className="text-[9px] font-bold font-heading uppercase px-2 py-0.5 bg-teal-200 text-teal-900 border border-teal-300 rounded-full inline-block animate-pulse">
                                            Move Here
                                          </span>
                                        )}
                                        {isCompleted && (
                                          <span className="text-[9px] font-medium text-slate-400 font-sans block">
                                            Completed
                                          </span>
                                        )}
                                        {isNext && (
                                          <span className="text-[9px] font-bold text-teal-700 font-heading block">
                                            Next Stage &rarr;
                                          </span>
                                        )}
                                        {!isCurrent && !isSelectedTarget && !isCompleted && !isNext && (
                                          <span className="text-[9px] font-medium text-slate-400 font-sans block">
                                            Upcoming
                                          </span>
                                        )}
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Stage Action Bar */}
                            {!isDirty ? (
                              <div className="p-3.5 bg-slate-50/90 rounded-xl border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold font-heading text-slate-900">
                                    Current Pipeline Stage: {currentStep.title}
                                  </span>
                                  <span className="text-[10px] font-bold font-heading px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 shadow-2xs">
                                    Step {activeIndex + 1} of 4
                                  </span>
                                </div>

                                {nextStep ? (
                                  <button
                                    type="button"
                                    onClick={() => setNewStatus(nextStep.key)}
                                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#0c1a26] hover:bg-teal-700 text-white rounded-xl text-xs font-bold font-heading shadow-xs transition-colors shrink-0 cursor-pointer active:scale-95 self-start sm:self-auto"
                                  >
                                    <span>Advance to {nextStep.title}</span>
                                    <ArrowRight className="w-4 h-4" />
                                  </button>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold font-heading shrink-0">
                                    <Check className="w-3.5 h-3.5 text-teal-600" />
                                    <span>Pipeline Concluded</span>
                                  </span>
                                )}
                              </div>
                            ) : (
                              /* Status Transition Confirmation Panel */
                              <form
                                onSubmit={handleStatusUpdate}
                                className="p-4 bg-teal-50/40 rounded-xl border border-teal-200 space-y-3 animate-in fade-in duration-150"
                              >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-teal-100">
                                  <div className="flex items-center gap-2 text-xs font-heading">
                                    <span className="text-slate-600 font-medium">Stage Transition:</span>
                                    <span className="font-bold text-slate-800 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                                      {currentStepKey}
                                    </span>
                                    <ArrowRight className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                                    <span className="font-bold text-teal-900 bg-teal-100 px-2.5 py-1 rounded-lg border border-teal-300 shadow-2xs">
                                      {targetStepKey}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-2 self-end sm:self-auto">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setNewStatus(detailEnquiry.status);
                                        setStatusNote('');
                                      }}
                                      className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold font-heading transition-colors cursor-pointer"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      type="submit"
                                      disabled={statusUpdating}
                                      className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#0c1a26] hover:bg-teal-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold font-heading shadow-xs transition-colors cursor-pointer active:scale-95"
                                    >
                                      {statusUpdating ? (
                                        <>
                                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                          <span>Saving...</span>
                                        </>
                                      ) : (
                                        <>
                                          <Check className="w-3.5 h-3.5" />
                                          <span>Confirm &amp; Update Stage</span>
                                        </>
                                      )}
                                    </button>
                                  </div>
                                </div>

                                <div>
                                  <label className="text-[11px] font-bold text-slate-700 font-heading block mb-1">
                                    Optional Reason / Audit Note for Activity Timeline:
                                  </label>
                                  <div className="relative">
                                    <FileText className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    <input
                                      type="text"
                                      placeholder="e.g. In-person consultation complete; submitted dossier to credit department..."
                                      value={statusNote}
                                      onChange={(e) => setStatusNote(e.target.value)}
                                      className="w-full pl-9 pr-3 py-2 bg-white border border-teal-200 rounded-xl text-xs text-[#0c1a26] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 shadow-2xs font-sans"
                                    />
                                  </div>
                                </div>
                              </form>
                            )}
                          </div>
                        );
                      })()}
                      {/* Add note composer */}
                      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-3 shadow-2xs">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-heading flex items-center gap-1.5">
                            <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
                            <span>Add Internal Advisory Note</span>
                          </h4>
                          <span className="text-[11px] text-slate-400 font-sans">Confidential case record</span>
                        </div>

                        <form onSubmit={handleAddNote} className="space-y-2.5">
                          <textarea
                            rows={3}
                            placeholder="Record confidential notes on borrower CIBIL, bank sanction review, document pickup..."
                            value={newNoteContent}
                            onChange={(e) => setNewNoteContent(e.target.value)}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#0c1a26] focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 resize-none"
                          />
                          <button
                            type="submit"
                            disabled={noteSubmitting || !newNoteContent.trim()}
                            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-200 text-white rounded-xl text-xs font-bold font-heading transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>{noteSubmitting ? 'Saving Note...' : 'Post Case Note'}</span>
                          </button>
                        </form>
                      </div>

                      {/* Unified Chronological Activity Feed */}
                      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-3.5 shadow-2xs">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-heading flex items-center gap-1.5">
                            <History className="w-3.5 h-3.5 text-teal-600" />
                            <span>Case Timeline &amp; History</span>
                          </h4>
                          <span className="text-[11px] text-slate-400 font-sans">
                            {(detailEnquiry.notes?.length || 0) + (detailEnquiry.statusHistory?.length || 0)} recorded events
                          </span>
                        </div>

                        <div className="space-y-3 max-h-96 overflow-y-auto pr-1 text-xs">
                          {(() => {
                            const notes = (detailEnquiry.notes || []).map((n) => ({
                              id: `note-${n.id}`,
                              type: 'note' as const,
                              date: new Date(n.createdAt),
                              author: n.authorName,
                              content: n.content,
                            }));
                            const history = (detailEnquiry.statusHistory || []).map((h) => ({
                              id: `hist-${h.id}`,
                              type: 'history' as const,
                              date: new Date(h.createdAt),
                              author: h.changedBy,
                              fromStatus: h.fromStatus,
                              toStatus: h.toStatus,
                              note: h.note,
                            }));
                            const combined = [...notes, ...history].sort(
                              (a, b) => b.date.getTime() - a.date.getTime()
                            );

                            if (combined.length === 0) {
                              return (
                                <p className="text-xs text-slate-400 italic text-center py-6">
                                  No internal notes or status changes recorded yet.
                                </p>
                              );
                            }

                            return combined.map((evt) => (
                              <div
                                key={evt.id}
                                className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50 space-y-1.5"
                              >
                                <div className="flex justify-between items-center text-[10px] text-slate-500">
                                  <div className="flex items-center gap-1.5">
                                    <span
                                      className={`px-1.5 py-0.5 rounded font-bold uppercase text-[9px] ${
                                        evt.type === 'note'
                                          ? 'bg-slate-200 text-slate-800'
                                          : 'bg-teal-50 text-teal-800 border border-teal-200/60'
                                      }`}
                                    >
                                      {evt.type === 'note' ? 'Staff Note' : 'Status Transition'}
                                    </span>
                                    <span className="font-bold text-[#0c1a26] font-heading">{evt.author}</span>
                                  </div>
                                  <span>{evt.date.toLocaleString('en-IN')}</span>
                                </div>

                                {evt.type === 'note' ? (
                                  <p className="text-[#0c1a26] leading-relaxed font-sans">{evt.content}</p>
                                ) : (
                                  <div className="space-y-0.5">
                                    <div className="text-[#0c1a26] font-semibold">
                                      Status updated: <span className="text-slate-500">{evt.fromStatus}</span> &rarr;{' '}
                                      <span className="text-teal-700 font-bold">{evt.toStatus}</span>
                                    </div>
                                    {evt.note && (
                                      <p className="text-slate-600 italic text-[11px] bg-white/70 p-1.5 rounded border border-slate-200/60 mt-1">
                                        "{evt.note}"
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>
                            ));
                          })()}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ADMIN DOCUMENT IMAGE LIGHTBOX MODAL (Z-INDEX ABOVE DRAWER) */}
      {adminPreviewDoc && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 top-0 left-0 right-0 bottom-0 z-[9999] bg-[#0c1a26]/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
          style={{ zIndex: 9999 }}
          onClick={() => setAdminPreviewDoc(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200/90 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <span className="text-[10px] uppercase font-bold text-teal-700 tracking-wider block font-heading">
                  Reference Document Verification
                </span>
                <h4 className="text-base font-bold text-[#0c1a26] flex items-center gap-2 font-heading">
                  <FileCheck className="w-4 h-4 text-teal-700" />
                  <span>{adminPreviewDoc.documentName || adminPreviewDoc.name}</span>
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setAdminPreviewDoc(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                title="Close Preview (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-slate-950 min-h-[480px]">
              {adminPreviewDoc.fileFormat === 'pdf' ||
              adminPreviewDoc.type === 'application/pdf' ||
              adminPreviewDoc.name.toLowerCase().endsWith('.pdf') ? (
                <iframe
                  src={adminPreviewDoc.previewUrl}
                  title={adminPreviewDoc.name}
                  className="w-full h-[72vh] rounded-lg shadow-lg bg-white border border-slate-700"
                />
              ) : (
                <img
                  src={adminPreviewDoc.previewUrl}
                  alt={adminPreviewDoc.name}
                  className="max-h-[72vh] max-w-full object-contain rounded-lg shadow-lg"
                />
              )}
            </div>
            <div className="p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 bg-white">
              <span className="font-mono text-slate-600">
                {adminPreviewDoc.name} ({adminPreviewDoc.size ? `${(adminPreviewDoc.size / 1024).toFixed(0)} KB` : 'Verified'})
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAdminPreviewDoc(null)}
                  className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl font-bold text-xs font-heading shadow-2xs transition-colors cursor-pointer"
                >
                  Close
                </button>
                <a
                  href={adminPreviewDoc.previewUrl}
                  download={adminPreviewDoc.name}
                  className="px-4 py-2 bg-[#0c1a26] hover:bg-teal-700 text-white rounded-xl font-bold text-xs font-heading shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Document</span>
                </a>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default AdminEnquiriesPage;
