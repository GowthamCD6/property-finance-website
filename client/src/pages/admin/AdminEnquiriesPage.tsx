import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  Filter,
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
} from 'lucide-react';
import { Enquiry, UploadedDocument } from '../../types';
import {
  getEnquiriesApi,
  getEnquiryByIdApi,
  updateEnquiryStatusApi,
  addEnquiryNoteApi,
  getExportEnquiriesCsvUrl,
} from '../../services/api';

const ALL_STATUSES = [
  'ALL',
  'New',
  'Contacted',
  'Follow-up Required',
  'Appointment Requested',
  'Appointment Confirmed',
  'In Review',
  'Converted',
  'Closed',
] as const;

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
  const [detailTab, setDetailTab] = useState<'overview' | 'documents' | 'appointment' | 'notes' | 'history'>('overview');
  const [adminPreviewDoc, setAdminPreviewDoc] = useState<UploadedDocument | null>(null);

  // Status Change State
  const [newStatus, setNewStatus] = useState<string>('');
  const [statusNote, setStatusNote] = useState<string>('');
  const [statusUpdating, setStatusUpdating] = useState<boolean>(false);

  // New Note State
  const [newNoteContent, setNewNoteContent] = useState<string>('');
  const [noteSubmitting, setNoteSubmitting] = useState<boolean>(false);

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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchList();
  };

  // Open Enquiry Detail
  const handleOpenDetail = (id: string, initialTab: 'overview' | 'documents' | 'appointment' | 'notes' | 'history' = 'overview') => {
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

  const getFacilityBadge = (loanType?: string) => {
    const type = (loanType || 'Home Loan').toLowerCase();
    if (type.includes('lap') || type.includes('property')) {
      return 'bg-indigo-50 text-indigo-700 border-indigo-200/90';
    }
    if (type.includes('vehicle') || type.includes('car')) {
      return 'bg-purple-50 text-purple-700 border-purple-200/90';
    }
    if (type.includes('business') || type.includes('commercial')) {
      return 'bg-amber-50 text-amber-800 border-amber-200/90';
    }
    return 'bg-teal-50 text-teal-800 border-teal-200/90';
  };

  const getStatusBadgeConfig = (status: string) => {
    switch (status) {
      case 'New':
        return {
          badge: 'bg-sky-50 text-sky-800 border-sky-200/90',
          dot: 'bg-sky-500',
        };
      case 'Contacted':
        return {
          badge: 'bg-amber-50 text-amber-800 border-amber-200/90',
          dot: 'bg-amber-500',
        };
      case 'Follow-up Required':
        return {
          badge: 'bg-orange-50 text-orange-800 border-orange-200/90',
          dot: 'bg-orange-500',
        };
      case 'Appointment Requested':
        return {
          badge: 'bg-purple-50 text-purple-800 border-purple-200/90',
          dot: 'bg-purple-500',
        };
      case 'Appointment Confirmed':
        return {
          badge: 'bg-emerald-50 text-emerald-800 border-emerald-200/90',
          dot: 'bg-emerald-500',
        };
      case 'In Review':
        return {
          badge: 'bg-indigo-50 text-indigo-800 border-indigo-200/90',
          dot: 'bg-indigo-500',
        };
      case 'Converted':
        return {
          badge: 'bg-teal-50 text-teal-900 border-teal-300',
          dot: 'bg-teal-600',
        };
      case 'Closed':
        return {
          badge: 'bg-slate-100 text-slate-700 border-slate-200',
          dot: 'bg-slate-400',
        };
      default:
        return {
          badge: 'bg-slate-100 text-slate-700 border-slate-200',
          dot: 'bg-slate-400',
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
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold font-heading bg-sky-50 text-sky-800 border border-sky-200">
            <Video className="w-3 h-3 text-sky-600" />
            <span>Google Meet</span>
          </span>
        );
      case 'in_person':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold font-heading bg-purple-50 text-purple-800 border border-purple-200">
            <Building2 className="w-3 h-3 text-purple-600" />
            <span>Tirupur Desk</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold font-heading bg-emerald-50 text-emerald-800 border border-emerald-200">
            <Phone className="w-3 h-3 text-emerald-600" />
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
            {/* Applicant & Contact */}
            <td className="py-4 px-5 min-w-[280px]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-slate-200 rounded w-36" />
                  <div className="flex items-center gap-2">
                    <div className="h-3.5 bg-slate-100 rounded w-24" />
                    <div className="h-3.5 bg-slate-100 rounded w-20" />
                  </div>
                </div>
              </div>
            </td>

            {/* Location */}
            <td className="py-4 px-5 min-w-[160px]">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded bg-slate-200 shrink-0" />
                <div className="h-3.5 bg-slate-200 rounded w-24" />
              </div>
            </td>

            {/* Facility Type */}
            <td className="py-4 px-5 min-w-[140px]">
              <div className="h-6 bg-slate-200/80 rounded-lg w-24" />
            </td>

            {/* Sanction Requested */}
            <td className="py-4 px-5 min-w-[150px]">
              <div className="space-y-1.5">
                <div className="h-4 bg-slate-200 rounded w-20" />
                <div className="h-2.5 bg-slate-100 rounded w-12" />
              </div>
            </td>

            {/* Consultation Slot */}
            <td className="py-4 px-5 min-w-[180px]">
              <div className="space-y-1.5">
                <div className="h-3.5 bg-slate-200 rounded w-24" />
                <div className="h-2.5 bg-slate-100 rounded w-20" />
                <div className="h-4 bg-slate-100 rounded w-16 mt-1" />
              </div>
            </td>

            {/* Pipeline Status */}
            <td className="py-4 px-5 min-w-[160px]">
              <div className="h-6 bg-slate-200/80 rounded-full w-24" />
            </td>

            {/* Actions */}
            <td className="py-4 px-5 text-right min-w-[110px]">
              <div className="h-7 bg-slate-200 rounded-xl w-20 ml-auto" />
            </td>
          </tr>
        ))}
      </>
    );
  };

  return (
    <div className="space-y-6">
      {/* Filter and Search Bar Container */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Applicant Name, Mobile, Reference (e.g. MOR-2026-...) or City..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-[#0c1a26] font-sans placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setPage(1);
                  fetchList();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedLoanType}
              onChange={(e) => {
                setSelectedLoanType(e.target.value);
                setPage(1);
              }}
              className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-heading font-semibold text-[#0c1a26] focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 cursor-pointer"
            >
              <option value="ALL">All Loan Facilities</option>
              <option value="Home Loan">Home Loan</option>
              <option value="Loan Against Property">Loan Against Property</option>
              <option value="Property-Backed Funding">Property-Backed Funding</option>
              <option value="Loan Consultation & Eligibility Review">Loan Consultation</option>
            </select>

            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-xl text-xs sm:text-sm font-bold font-heading shadow-xs transition-all active:scale-[0.98] cursor-pointer"
            >
              Filter
            </button>

            <a
              href={getExportEnquiriesCsvUrl()}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-[#0c1a26] border border-slate-200 rounded-xl text-xs sm:text-sm font-bold font-heading shadow-xs hover:border-teal-300 transition-all active:scale-[0.98]"
            >
              <Download className="w-4 h-4 text-teal-600" />
              <span>Export to CSV</span>
            </a>
          </div>
        </form>

        {/* Status Tab Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs pt-2 border-t border-slate-100">
          {ALL_STATUSES.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => {
                setSelectedStatus(status);
                setPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-xl font-heading font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedStatus === status
                  ? 'bg-slate-900 text-white shadow-sm ring-2 ring-teal-500/30'
                  : 'bg-slate-100/90 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
              }`}
            >
              {status === 'ALL' ? 'All Statuses' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/90 border-b border-slate-200/90 text-slate-600 font-bold uppercase tracking-wider text-[11px] font-heading">
                <th className="py-4 px-5 min-w-[280px]">Applicant &amp; Contact</th>
                <th className="py-4 px-5 min-w-[160px]">Location</th>
                <th className="py-4 px-5 min-w-[140px]">Facility Type</th>
                <th className="py-4 px-5 min-w-[150px]">Sanction Requested</th>
                <th className="py-4 px-5 min-w-[180px]">Consultation Slot</th>
                <th className="py-4 px-5 min-w-[160px]">Pipeline Status</th>
                <th className="py-4 px-5 text-right min-w-[110px]">Actions</th>
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

                  return (
                    <tr
                      key={enq.id}
                      onClick={() => handleOpenDetail(enq.id, 'overview')}
                      className="hover:bg-slate-50/90 transition-colors group cursor-pointer"
                    >
                      {/* Applicant & Contact with clean embedded Reference */}
                      <td className="py-4 px-5 min-w-[280px]">
                        <div className="flex items-center gap-3">
                          {enq.customer?.picture ? (
                            <div className="relative shrink-0">
                              <img
                                src={enq.customer.picture}
                                alt={enq.fullName}
                                className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-2xs"
                              />
                              <span
                                className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center text-[7px] text-white font-bold"
                                title="Google Authenticated"
                              >
                                ✓
                              </span>
                            </div>
                          ) : (
                            <div className="relative shrink-0">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-teal-600 to-teal-500 text-white font-extrabold text-xs flex items-center justify-center shadow-xs font-heading">
                                {initials}
                              </div>
                              {(enq.customer?.email || enq.customerId) && (
                                <span
                                  className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center text-[7px] text-white font-bold"
                                  title="Google Authenticated"
                                >
                                  ✓
                                </span>
                              )}
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-bold text-slate-900 font-heading text-sm group-hover:text-teal-700 transition-colors">
                                {enq.fullName}
                              </span>
                              {(enq.customer?.email || enq.customerId) && (
                                <span title="Google Verified Applicant" className="shrink-0 inline-flex items-center">
                                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500 font-sans mt-1">
                              <span
                                className="font-mono text-[10px] font-semibold text-slate-600 bg-slate-100/90 px-1.5 py-0.5 rounded border border-slate-200/90 tracking-tight whitespace-nowrap shadow-2xs"
                                title="Application Reference"
                              >
                                {enq.referenceNumber}
                              </span>
                              <span className="text-slate-300">•</span>
                              <a
                                href={`tel:${enq.mobileNumber}`}
                                onClick={(e) => e.stopPropagation()}
                                className="hover:text-teal-700 hover:underline font-medium text-slate-600 whitespace-nowrap"
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
                                  className="inline-flex items-center gap-0.5 text-[10px] text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-1.5 py-0.5 rounded font-bold border border-emerald-200 transition-colors shrink-0"
                                  title="Chat on WhatsApp"
                                >
                                  <span>WA</span>
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-4 px-5 text-slate-600 min-w-[160px] whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-xs font-medium">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{enq.cityState || 'Tamil Nadu'}</span>
                        </div>
                      </td>

                      {/* Facility Type */}
                      <td className="py-4 px-5 whitespace-nowrap min-w-[140px]">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold font-heading border shadow-2xs ${getFacilityBadge(
                            enq.loanType
                          )}`}
                        >
                          {enq.loanType}
                        </span>
                      </td>

                      {/* Sanction Requested Amount */}
                      <td className="py-4 px-5 whitespace-nowrap min-w-[150px]">
                        <div className="font-heading font-extrabold text-sm text-slate-900 tracking-tight tabular-nums">
                          {formatAmountINR(enq.loanAmount)}
                        </div>
                        <span className="text-[10px] text-slate-400 font-sans block mt-0.5">Requested Facility</span>
                      </td>

                      {/* Consultation Slot Column */}
                      <td className="py-4 px-5 text-xs whitespace-nowrap min-w-[180px]">
                        {appointment?.date || enq.preferredDate ? (
                          <div className="space-y-1">
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
                          <span className="text-slate-400 text-xs italic">Not requested</span>
                        )}
                      </td>

                      {/* Pipeline Status */}
                      <td className="py-4 px-5 whitespace-nowrap min-w-[160px]">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border font-heading shadow-2xs ${statusCfg.badge}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                          <span>{enq.status}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right whitespace-nowrap min-w-[110px]">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDetail(enq.id, 'overview');
                          }}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-50 hover:bg-slate-900 text-slate-700 hover:text-white rounded-xl text-xs font-bold font-heading transition-all border border-slate-200 hover:border-slate-900 cursor-pointer shadow-2xs hover:shadow-xs active:scale-95 group/btn"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-400 group-hover/btn:text-white transition-colors" />
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
        <div className="p-4 sm:px-6 border-t border-slate-200/90 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 font-sans">
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
      {selectedEnquiryId && (
        <div className="fixed inset-0 z-50 bg-[#0c1a26]/60 backdrop-blur-sm flex items-center justify-end animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
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

            {/* Modal Segmented Tabs */}
            <div className="flex items-center gap-1 px-5 pt-3 border-b border-slate-200 bg-white overflow-x-auto text-xs font-heading">
              <button
                type="button"
                onClick={() => setDetailTab('overview')}
                className={`pb-2.5 px-3 border-b-2 font-bold whitespace-nowrap transition-colors ${
                  detailTab === 'overview'
                    ? 'border-teal-600 text-teal-700'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                Overview &amp; Loan
              </button>
              <button
                type="button"
                onClick={() => setDetailTab('documents')}
                className={`pb-2.5 px-3 border-b-2 font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  detailTab === 'documents'
                    ? 'border-teal-600 text-teal-700'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <span>Documents</span>
                <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 text-[10px]">
                  {detailEnquiry?.documents?.length || 0}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setDetailTab('appointment')}
                className={`pb-2.5 px-3 border-b-2 font-bold whitespace-nowrap transition-colors ${
                  detailTab === 'appointment'
                    ? 'border-teal-600 text-teal-700'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                Appointment Slot
              </button>
              <button
                type="button"
                onClick={() => setDetailTab('notes')}
                className={`pb-2.5 px-3 border-b-2 font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  detailTab === 'notes'
                    ? 'border-teal-600 text-teal-700'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <span>Case Notes</span>
                <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 text-[10px]">
                  {detailEnquiry?.notes?.length || 0}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setDetailTab('history')}
                className={`pb-2.5 px-3 border-b-2 font-bold whitespace-nowrap transition-colors ${
                  detailTab === 'history'
                    ? 'border-teal-600 text-teal-700'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                Audit Trail
              </button>
            </div>

            {/* Modal Content Viewport */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs sm:text-sm bg-slate-50/30">
              {detailLoading || !detailEnquiry ? (
                <div className="py-24 text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-teal-600" />
                  <span className="text-xs text-slate-500 mt-2 block">Loading enquiry details...</span>
                </div>
              ) : (
                <>
                  {/* Status Bar & Quick Updater */}
                  <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#0c1a26] font-heading">Pipeline Status:</span>
                      <span className={`px-3 py-0.5 rounded-full text-xs font-bold border ${getStatusBadge(detailEnquiry.status)}`}>
                        {detailEnquiry.status}
                      </span>
                    </div>

                    <form onSubmit={handleStatusUpdate} className="pt-3 border-t border-slate-100 space-y-2">
                      <div className="flex gap-2">
                        <select
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value)}
                          className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#0c1a26] font-semibold focus:bg-white"
                        >
                          {ALL_STATUSES.filter((s) => s !== 'ALL').map((s) => (
                            <option key={s} value={s}>
                              Move to: {s}
                            </option>
                          ))}
                        </select>
                        <button
                          type="submit"
                          disabled={statusUpdating || newStatus === detailEnquiry.status}
                          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold font-heading shadow-xs transition-colors cursor-pointer"
                        >
                          {statusUpdating ? 'Updating...' : 'Update Status'}
                        </button>
                      </div>

                      <input
                        type="text"
                        placeholder="Add reason or remark for status change (recorded in audit trail)..."
                        value={statusNote}
                        onChange={(e) => setStatusNote(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#0c1a26] placeholder:text-slate-400 focus:bg-white"
                      />
                    </form>
                  </div>

                  {/* TAB 1: OVERVIEW */}
                  {detailTab === 'overview' && (
                    <div className="space-y-4">
                      {/* Applicant Details Card */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3.5 shadow-sm">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-heading">
                          Applicant Dossier
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-slate-400 block text-[11px]">Full Name</span>
                            <span className="font-bold text-[#0c1a26] text-sm font-heading">{detailEnquiry.fullName}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[11px]">Mobile Number</span>
                            <a
                              href={`tel:${detailEnquiry.mobileNumber}`}
                              className="font-bold text-teal-700 hover:underline text-sm font-mono"
                            >
                              {detailEnquiry.mobileNumber}
                            </a>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[11px]">Email</span>
                            <span className="font-medium text-[#0c1a26]">
                              {detailEnquiry.email || 'Not provided'}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[11px]">Preferred Contact Method</span>
                            <span className="font-semibold text-[#0c1a26] capitalize">
                              {detailEnquiry.preferredContactMethod}
                            </span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-slate-400 block text-[11px]">Applicant Location</span>
                            <span className="font-medium text-[#0c1a26]">{detailEnquiry.cityState}</span>
                          </div>
                        </div>
                      </div>

                      {/* Loan & Property Card */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3.5 shadow-sm">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-heading">
                          Loan &amp; Property Specifications
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-slate-400 block text-[11px]">Loan Facility</span>
                            <span className="font-bold text-[#0c1a26]">{detailEnquiry.loanType}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[11px]">Sanction Requested</span>
                            <span className="font-extrabold text-teal-700 font-mono text-base">
                              {formatAmountINR(detailEnquiry.loanAmount)}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[11px]">Property Type</span>
                            <span className="font-medium text-[#0c1a26] capitalize">
                              {detailEnquiry.propertyType}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[11px]">Ownership Status</span>
                            <span className="font-medium text-[#0c1a26] capitalize">
                              {detailEnquiry.propertyOwnershipStatus.replace('_', ' ')}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[11px]">Property Location</span>
                            <span className="font-medium text-[#0c1a26]">
                              {detailEnquiry.propertyLocation}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[11px]">Employment Type</span>
                            <span className="font-medium text-[#0c1a26] capitalize">
                              {detailEnquiry.employmentType.replace('_', ' ')}
                            </span>
                          </div>

                          {detailEnquiry.preferredBank && (
                            <div className="col-span-2 pt-2 border-t border-slate-100">
                              <span className="text-slate-400 block text-[11px]">Preferred Channel Partner / Bank</span>
                              <span className="inline-flex items-center gap-1.5 font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200/80 mt-1">
                                <Landmark className="w-3.5 h-3.5 text-teal-600" />
                                <span>{detailEnquiry.preferredBank}</span>
                              </span>
                            </div>
                          )}
                        </div>

                        {/* VEHICLE DETAILS (IF CAR LOAN) */}
                        {detailEnquiry.carLoanDetails && (
                          <div className="p-3.5 bg-teal-50/60 rounded-xl border border-teal-200 space-y-2 mt-2">
                            <div className="flex items-center gap-1.5 text-[#0c1a26] font-bold text-xs">
                              <Car className="w-4 h-4 text-teal-600" />
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

                        {detailEnquiry.additionalNotes && (
                          <div className="pt-3 border-t border-slate-100">
                            <span className="text-slate-400 block text-[11px] mb-1">Applicant Remarks:</span>
                            <p className="bg-slate-50 p-3 rounded-xl text-[#0c1a26] italic border border-slate-200/80">
                              "{detailEnquiry.additionalNotes}"
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* TAB 2: DOCUMENTS */}
                  {detailTab === 'documents' && (
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <FileCheck className="w-4 h-4 text-teal-600" />
                          <h4 className="text-xs font-bold uppercase tracking-wider text-[#0c1a26] font-heading">
                            Submitted Reference Documents
                          </h4>
                        </div>
                        <span className="text-xs font-extrabold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                          {detailEnquiry.documents?.length || 0} Files
                        </span>
                      </div>

                      {detailEnquiry.documents && detailEnquiry.documents.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                          {detailEnquiry.documents.map((doc) => (
                            <div
                              key={doc.id}
                              className="p-3 rounded-xl border border-slate-200 hover:border-teal-400 bg-slate-50/50 hover:bg-white transition-all flex items-start gap-3 group"
                            >
                              {doc.type.includes('image') ? (
                                <img
                                  src={doc.previewUrl}
                                  alt={doc.name}
                                  onClick={() => setAdminPreviewDoc(doc)}
                                  className="w-14 h-14 object-cover rounded-xl border border-slate-200 cursor-pointer hover:opacity-85 transition-opacity shrink-0 shadow-xs"
                                />
                              ) : (
                                <div className="w-14 h-14 rounded-xl bg-red-50 border border-red-200 flex flex-col items-center justify-center text-red-700 shrink-0 font-bold text-xs">
                                  <span>PDF</span>
                                </div>
                              )}

                              <div className="min-w-0 flex-1 space-y-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200/60">
                                  {doc.category || 'Reference'}
                                </span>
                                <h5 className="text-xs font-bold text-[#0c1a26] truncate block mt-1" title={doc.documentName}>
                                  {doc.documentName || doc.name}
                                </h5>
                                <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500">
                                  <span>{doc.size ? `${(doc.size / 1024).toFixed(0)} KB` : 'Verified'}</span>
                                  <div className="flex items-center gap-2">
                                    {doc.type.includes('image') && (
                                      <button
                                        type="button"
                                        onClick={() => setAdminPreviewDoc(doc)}
                                        className="text-teal-700 hover:underline font-bold flex items-center gap-0.5"
                                      >
                                        <Eye className="w-3 h-3" /> View
                                      </button>
                                    )}
                                    <a
                                      href={doc.previewUrl}
                                      download={doc.name}
                                      className="text-slate-600 hover:text-[#0c1a26] font-bold flex items-center gap-0.5"
                                    >
                                      <Download className="w-3 h-3" />
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-8 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-2 text-xs text-slate-500">
                          <ImageIcon className="w-8 h-8 text-slate-300 mx-auto" />
                          <p className="font-bold text-[#0c1a26]">No Document Files Uploaded Yet</p>
                          <p className="text-[11px] max-w-sm mx-auto">
                            Applicant has chosen to submit document physical copies during the consultation or send them via WhatsApp.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 3: BORROWER REQUESTED CONSULTATION */}
                  {detailTab === 'appointment' && (() => {
                    const doorstepAddress = detailEnquiry.additionalNotes?.includes('📍 Doorstep Meeting Address:')
                      ? detailEnquiry.additionalNotes.split('📍 Doorstep Meeting Address:')[1]?.split('\n')[0]?.trim()
                      : (detailEnquiry.meetingMode === 'in_person' ? (detailEnquiry.propertyLocation || detailEnquiry.cityState) : null);

                    return (
                      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-teal-600" />
                            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0c1a26] font-heading">
                              Borrower Consultation Request &amp; Allotment
                            </h4>
                          </div>

                          <Link
                            to={`/admin/appointments?allotEnquiryId=${detailEnquiry.id}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold font-heading shadow-xs transition-colors"
                          >
                            <CalendarCheck2 className="w-3.5 h-3.5" />
                            <span>Allot / Schedule Slot</span>
                          </Link>
                        </div>

                        {/* Mode-Specific Highlight Banner */}
                        {detailEnquiry.meetingMode === 'video' && (
                          <div className="p-3.5 bg-sky-50 border border-sky-200 rounded-xl text-xs flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5">
                              <Video className="w-4 h-4 text-sky-600 shrink-0" />
                              <div>
                                <span className="font-bold text-sky-950 font-heading block">Google Meet Video Consultation</span>
                                <span className="text-sky-800 font-sans text-[11px]">
                                  Borrower requested a video conference call. Generate an official Google Meet link during allotment.
                                </span>
                              </div>
                            </div>
                            <span className="text-[10px] font-bold text-sky-800 bg-white px-2 py-0.5 rounded border border-sky-200 shrink-0">
                              Google Meet
                            </span>
                          </div>
                        )}

                        {detailEnquiry.meetingMode === 'in_person' && (
                          <div className="p-3.5 bg-purple-50 border border-purple-200 rounded-xl text-xs space-y-2">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-2.5">
                                <Building2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                                <div>
                                  <span className="font-bold text-purple-950 font-heading block">
                                    Offline Doorstep Meeting (Advisor Visits Borrower Area)
                                  </span>
                                  <span className="text-purple-800 font-sans text-[11px]">
                                    Borrower requested an advisor to visit their area for in-person assessment and document pickup.
                                  </span>
                                </div>
                              </div>

                              {doorstepAddress && (
                                <a
                                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(doorstepAddress)}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-purple-100 text-purple-800 border border-purple-200 rounded-lg text-[10px] font-bold font-heading shrink-0 shadow-2xs"
                                >
                                  <MapPin className="w-3 h-3 text-purple-600" />
                                  <span>View on Google Maps</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </div>

                            {doorstepAddress && (
                              <div className="p-2.5 bg-white/90 rounded-xl border border-purple-200 text-xs font-semibold text-purple-950 font-sans">
                                📍 <strong>Customer Doorstep Location:</strong> {doorstepAddress}
                              </div>
                            )}
                          </div>
                        )}

                        {(!detailEnquiry.meetingMode || detailEnquiry.meetingMode === 'phone') && (
                          <div className="p-3.5 bg-teal-50 border border-teal-200 rounded-xl text-xs flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5">
                              <Phone className="w-4 h-4 text-teal-600 shrink-0" />
                              <div>
                                <span className="font-bold text-teal-950 font-heading block">Direct Telephonic Consultation</span>
                                <span className="text-teal-800 font-sans text-[11px]">
                                  Credit manager to call applicant directly at registered phone number: <strong>+91 {detailEnquiry.mobileNumber}</strong>.
                                </span>
                              </div>
                            </div>
                            <a
                              href={`tel:${detailEnquiry.mobileNumber}`}
                              className="text-[11px] font-bold text-teal-800 bg-white hover:bg-teal-100 px-2.5 py-1 rounded-lg border border-teal-200 shrink-0 shadow-2xs"
                            >
                              Call Applicant
                            </a>
                          </div>
                        )}

                        {/* Preferred Date & Slot Table */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50/70 rounded-xl border border-slate-200">
                          <div>
                            <span className="text-slate-400 block text-[11px] font-medium font-heading">Preferred Date &amp; Slot</span>
                            <span className="font-bold text-[#0c1a26] text-xs font-mono">
                              {detailEnquiry.preferredDate || 'Not Specified'} &bull; {detailEnquiry.preferredTimeSlot || 'Pending Allotment'}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[11px] font-medium font-heading">Consultation Mode</span>
                            <span className="font-semibold text-[#0c1a26] capitalize text-xs">
                              {detailEnquiry.meetingMode === 'in_person'
                                ? 'Doorstep Area Visit'
                                : detailEnquiry.meetingMode === 'video'
                                ? 'Google Meet Call'
                                : 'Direct Phone Call'}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[11px] font-medium font-heading">Queue Status</span>
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold mt-1 bg-amber-50 text-amber-800 border border-amber-200">
                              ● Pending Advisor Allotment
                            </span>
                          </div>
                        </div>

                        {/* WhatsApp Message Communication Box */}
                        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                          <div className="space-y-0.5">
                            <span className="font-bold text-emerald-900 font-heading block">
                              Send Consultation Details to Borrower
                            </span>
                            <p className="text-emerald-700 text-[11px] font-sans">
                              Confirm consultation slot, Google Meet link, or Doorstep Visit details directly to their WhatsApp.
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
                            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold font-heading shadow-xs transition-colors flex-shrink-0 cursor-pointer"
                          >
                            <span>Send WhatsApp Message</span>
                          </a>
                        </div>
                      </div>
                    );
                  })()}

                  {/* TAB 4: CASE NOTES */}
                  {detailTab === 'notes' && (
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-heading">
                          Internal Advisory Case Notes
                        </h4>
                        <span className="text-[11px] text-slate-500">
                          {detailEnquiry.notes?.length || 0} recorded
                        </span>
                      </div>

                      {/* Add note form */}
                      <form onSubmit={handleAddNote} className="space-y-2.5">
                        <textarea
                          rows={3}
                          placeholder="Record confidential notes on borrower CIBIL score, bank sanction eligibility, appraisal visits..."
                          value={newNoteContent}
                          onChange={(e) => setNewNoteContent(e.target.value)}
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#0c1a26] focus:bg-white resize-none"
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

                      {/* Notes timeline */}
                      <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1 pt-2">
                        {detailEnquiry.notes && detailEnquiry.notes.length > 0 ? (
                          detailEnquiry.notes.map((note) => (
                            <div key={note.id} className="p-3 bg-slate-50 rounded-xl text-xs space-y-1.5 border border-slate-100">
                              <div className="flex justify-between items-center text-[10px] text-slate-500">
                                <span className="font-bold text-[#0c1a26] font-heading">{note.authorName}</span>
                                <span>{new Date(note.createdAt).toLocaleString('en-IN')}</span>
                              </div>
                              <p className="text-[#0c1a26] leading-relaxed font-sans">{note.content}</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-slate-400 italic text-center py-4">
                            No internal case notes recorded yet.
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* TAB 5: AUDIT TRAIL */}
                  {detailTab === 'history' && (
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
                      <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-[#0c1a26]">
                        <History className="w-4 h-4 text-teal-600" />
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-heading">
                          Status Transition Audit History
                        </h4>
                      </div>

                      <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1 text-[11px]">
                        {detailEnquiry.statusHistory && detailEnquiry.statusHistory.length > 0 ? (
                          detailEnquiry.statusHistory.map((hist) => (
                            <div key={hist.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                              <div className="flex justify-between items-center text-slate-500">
                                <span className="font-bold text-[#0c1a26] font-heading">{hist.changedBy}</span>
                                <span className="text-[10px]">{new Date(hist.createdAt).toLocaleString('en-IN')}</span>
                              </div>
                              <div className="text-[#0c1a26]">
                                {hist.fromStatus} &rarr; <span className="font-bold text-teal-700">{hist.toStatus}</span>
                              </div>
                              {hist.note && <p className="text-slate-600 italic">"{hist.note}"</p>}
                            </div>
                          ))
                        ) : (
                          <p className="text-slate-400 italic py-4 text-center">No history logged.</p>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ADMIN DOCUMENT IMAGE LIGHTBOX MODAL */}
      {adminPreviewDoc && (
        <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <span className="text-[10px] uppercase font-bold text-teal-700 tracking-wider block">
                  Reference Document Verification
                </span>
                <h4 className="text-base font-bold text-[#0c1a26] flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-teal-600" />
                  <span>{adminPreviewDoc.documentName || adminPreviewDoc.name}</span>
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setAdminPreviewDoc(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-gray-950">
              <img
                src={adminPreviewDoc.previewUrl}
                alt={adminPreviewDoc.name}
                className="max-h-[74vh] object-contain rounded-lg"
              />
            </div>
            <div className="p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 bg-white">
              <span>{adminPreviewDoc.name} ({adminPreviewDoc.size ? `${(adminPreviewDoc.size / 1024).toFixed(0)} KB` : 'Verified'})</span>
              <a
                href={adminPreviewDoc.previewUrl}
                download={adminPreviewDoc.name}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Document</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEnquiriesPage;
