import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  UserPlus,
} from 'lucide-react';
import { Enquiry, UploadedDocument } from '../../types';
import { RegisterBorrowerModal } from '../../components/admin/RegisterBorrowerModal';
import {
  getEnquiriesApi,
  getEnquiryByIdApi,
  updateEnquiryStatusApi,
  addEnquiryNoteApi,
  createAppointmentApi,
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
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

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

  // Appointment Allotment State
  const [isAllotting, setIsAllotting] = useState<boolean>(false);
  const [allotDate, setAllotDate] = useState<string>('');
  const [allotSlot, setAllotSlot] = useState<string>('11:30 AM - 12:30 PM');
  const [allotMode, setAllotMode] = useState<'phone' | 'video' | 'in_person'>('phone');
  const [allotNotes, setAllotNotes] = useState<string>('');
  const [allotSubmitting, setAllotSubmitting] = useState<boolean>(false);
  const [allotSuccess, setAllotSuccess] = useState<string | null>(null);

  const STANDARD_SLOTS = [
    '10:00 AM - 11:00 AM',
    '11:30 AM - 12:30 PM',
    '02:00 PM - 03:00 PM',
    '03:30 PM - 04:30 PM',
    '05:00 PM - 06:00 PM',
  ];

  const fetchList = () => {
    setLoading(true);
    getEnquiriesApi({
      page,
      limit: 15,
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
  }, [page, selectedStatus, selectedLoanType]);

  useEffect(() => {
    const handleNewEnquiry = () => fetchList();
    window.addEventListener('enquiry-registered', handleNewEnquiry);
    return () => window.removeEventListener('enquiry-registered', handleNewEnquiry);
  }, []);

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
    setIsAllotting(false);
    setAllotSuccess(null);
    getEnquiryByIdApi(id)
      .then((enq) => {
        setDetailEnquiry(enq);
        setNewStatus(enq.status);
        setStatusNote('');
        setAllotDate(enq.preferredDate || new Date().toISOString().split('T')[0]);
        setAllotSlot(enq.preferredTimeSlot || '11:30 AM - 12:30 PM');
        setAllotMode(enq.meetingMode || 'phone');
        setAllotNotes('');
      })
      .catch((err) => console.error('Error loading enquiry detail:', err))
      .finally(() => setDetailLoading(false));
  };

  const handleAllotAppointmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!detailEnquiry || !allotDate || !allotSlot) return;

    setAllotSubmitting(true);
    setAllotSuccess(null);
    try {
      await createAppointmentApi({
        enquiryId: detailEnquiry.id,
        date: allotDate,
        timeSlot: allotSlot,
        meetingMode: allotMode,
        adminNotes: allotNotes.trim() || undefined,
      });

      const refreshed = await getEnquiryByIdApi(detailEnquiry.id);
      setDetailEnquiry(refreshed);
      setNewStatus('Appointment Confirmed');
      setIsAllotting(false);
      setAllotSuccess('Consultation appointment confirmed & allotted successfully!');
      fetchList();
    } catch (err: any) {
      alert(err.message || 'Failed to allot appointment');
    } finally {
      setAllotSubmitting(false);
    }
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0c1a26] tracking-tight font-heading">
            Loan Enquiry Pipeline
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-sans">
            Total {totalCount} borrower applications registered across home loan, LAP, and business funding
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsRegisterModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-xl text-xs sm:text-sm font-bold font-heading shadow-md shadow-teal-500/20 transition-all active:scale-[0.98] cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Register Borrower</span>
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
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
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

          <div className="flex items-center gap-2">
            <select
              value={selectedLoanType}
              onChange={(e) => {
                setSelectedLoanType(e.target.value);
                setPage(1);
              }}
              className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-heading font-semibold text-[#0c1a26] focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
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
                  ? 'bg-[#0c1a26] text-white shadow-sm ring-2 ring-teal-500/30'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status === 'ALL' ? 'All Statuses' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/90 text-slate-500 font-extrabold uppercase tracking-wider text-[10px] font-heading">
                <th className="py-3.5 px-4">Applicant &amp; Contact</th>
                <th className="py-3.5 px-4">Reference</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Facility Type</th>
                <th className="py-3.5 px-4">Sanction Requested</th>
                <th className="py-3.5 px-4">Allotted Slot</th>
                <th className="py-3.5 px-4">Pipeline Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-slate-500 font-sans">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-teal-600 mb-2" />
                    <span className="text-xs">Loading pipeline records...</span>
                  </td>
                </tr>
              ) : enquiries.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-slate-500 font-sans">
                    <FileSpreadsheet className="w-9 h-9 mx-auto text-slate-300 mb-2" />
                    <span className="text-xs font-semibold">No enquiries match the current filters.</span>
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
                    <tr key={enq.id} className="hover:bg-slate-50/80 transition-colors group">
                      {/* Applicant & Contact */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          {enq.customer?.picture ? (
                            <div className="relative shrink-0">
                              <img
                                src={enq.customer.picture}
                                alt={enq.fullName}
                                className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-2xs"
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
                              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-teal-600 to-teal-500 text-white font-extrabold text-xs flex items-center justify-center shadow-xs font-heading">
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
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-extrabold text-[#0c1a26] block font-heading text-xs sm:text-[13px] group-hover:text-teal-700 transition-colors truncate">
                                {enq.fullName}
                              </span>
                              {(enq.customer?.email || enq.customerId) && (
                                <span title="Google Verified Applicant" className="shrink-0">
                                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-slate-500 font-sans mt-0.5">
                              <a
                                href={`tel:${enq.mobileNumber}`}
                                className="hover:text-teal-700 hover:underline font-semibold text-slate-600"
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
                                  className="inline-flex items-center gap-0.5 text-[10px] text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-1.5 py-0.5 rounded-md font-extrabold border border-emerald-200 transition-colors"
                                  title="Chat on WhatsApp"
                                >
                                  <span>WA</span>
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Reference Badge */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold font-heading text-slate-700 bg-slate-100/90 hover:bg-slate-200 border border-slate-200/90 transition-colors tracking-wide">
                          {enq.referenceNumber}
                        </span>
                      </td>

                      {/* Location */}
                      <td className="py-4 px-4 text-slate-600">
                        <div className="flex items-center gap-1.5 text-xs font-medium">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[120px]">{enq.cityState || 'Tamil Nadu'}</span>
                        </div>
                      </td>

                      {/* Facility Type */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-lg text-[11px] font-bold font-heading border ${getFacilityBadge(
                            enq.loanType
                          )}`}
                        >
                          {enq.loanType}
                        </span>
                      </td>

                      {/* Sanction Requested Amount */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="font-heading font-extrabold text-[13px] sm:text-sm text-[#0c1a26] tracking-tight tabular-nums">
                          {formatAmountINR(enq.loanAmount)}
                        </div>
                        <span className="text-[10px] text-slate-400 font-sans block">Requested</span>
                      </td>

                      {/* Allotted Slot Column */}
                      <td className="py-4 px-4 text-xs whitespace-nowrap">
                        {appointment || enq.status === 'Appointment Confirmed' ? (
                          <div className="space-y-1">
                            <div className="font-heading font-extrabold text-[#0c1a26] text-xs flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                              <span>{formatDate(appointment?.date || enq.preferredDate)}</span>
                            </div>
                            <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                              <span>{appointment?.timeSlot || enq.preferredTimeSlot}</span>
                            </div>
                            <div className="pt-0.5">
                              {getModeBadge(appointment?.meetingMode || enq.meetingMode)}
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-1.5 items-start">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold font-heading bg-amber-50 text-amber-800 border border-amber-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                              <span>Awaiting Slot</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => handleOpenDetail(enq.id, 'appointment')}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-lg text-[10px] font-extrabold font-heading shadow-xs hover:shadow-sm transition-all cursor-pointer active:scale-95"
                              title="Allot consultation date and slot"
                            >
                              <Calendar className="w-3 h-3" />
                              <span>+ Allot Slot</span>
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Pipeline Status */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold border font-heading ${statusCfg.badge}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                          <span>{enq.status}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleOpenDetail(enq.id, 'overview')}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#0c1a26] text-slate-700 hover:text-white rounded-xl text-xs font-extrabold font-heading transition-all border border-slate-200/90 cursor-pointer shadow-2xs hover:shadow-sm active:scale-95 group"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
                          <span>Review Dossier</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 bg-slate-50/50">
            <span>
              Showing Page <span className="font-bold text-[#0c1a26]">{page}</span> of <span className="font-bold text-[#0c1a26]">{totalPages}</span> ({totalCount} total)
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="inline-flex items-center gap-1 px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-50 font-heading font-semibold text-xs"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="inline-flex items-center gap-1 px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-50 font-heading font-semibold text-xs"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
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

                  {/* TAB 3: APPOINTMENT ALLOTMENT */}
                  {detailTab === 'appointment' && (
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-teal-600" />
                          <h4 className="text-xs font-bold uppercase tracking-wider text-[#0c1a26] font-heading">
                            Consultation Scheduling &amp; Allotment
                          </h4>
                        </div>
                        {!isAllotting && (
                          <button
                            type="button"
                            onClick={() => setIsAllotting(true)}
                            className="px-3.5 py-1.5 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-xl text-xs font-bold font-heading shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{detailEnquiry.status === 'Appointment Confirmed' ? 'Change Allotted Slot' : 'Allot Time Slot'}</span>
                          </button>
                        )}
                      </div>

                      {allotSuccess && (
                        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          <span className="font-semibold">{allotSuccess}</span>
                        </div>
                      )}

                      {/* Applicant Requested Preference Banner */}
                      <div className="p-3.5 bg-amber-50/80 rounded-xl border border-amber-200 text-xs flex items-center gap-2.5">
                        <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                        <div>
                          <span className="font-bold text-amber-900 font-heading">Borrower Preference: </span>
                          <span className="text-amber-800 font-sans">
                            Requested <strong>{detailEnquiry.preferredTimeSlot || detailEnquiry.preferredContactMethod || 'Any Time'}</strong> window via <strong className="capitalize">{detailEnquiry.meetingMode?.replace('_', ' ') || 'phone'}</strong>
                          </span>
                        </div>
                      </div>

                      {!isAllotting ? (
                        <>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50/70 rounded-xl border border-slate-200">
                            <div>
                              <span className="text-slate-400 block text-[11px] font-medium">Allotted Date &amp; Slot</span>
                              <span className="font-bold text-[#0c1a26] text-xs font-mono">
                                {detailEnquiry.preferredDate || 'Not Set'} &bull; {detailEnquiry.preferredTimeSlot || 'Pending'}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[11px] font-medium">Channel Mode</span>
                              <span className="font-semibold text-[#0c1a26] capitalize text-xs">
                                {detailEnquiry.meetingMode?.replace('_', ' ') || 'Phone Call'}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[11px] font-medium">Schedule Status</span>
                              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold mt-1 ${
                                detailEnquiry.status === 'Appointment Confirmed'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                  : 'bg-amber-100 text-amber-800 border border-amber-200'
                              }`}>
                                {detailEnquiry.status === 'Appointment Confirmed' ? '● Confirmed Slot' : 'Awaiting Allotment'}
                              </span>
                            </div>
                          </div>

                          {detailEnquiry.status === 'Appointment Confirmed' && (
                            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                              <div className="space-y-0.5">
                                <span className="font-bold text-emerald-900 font-heading block">
                                  Meeting Slot Confirmed: {detailEnquiry.preferredDate} ({detailEnquiry.preferredTimeSlot})
                                </span>
                                <p className="text-emerald-700 text-[11px] font-sans">
                                  Send the confirmed consultation time, mode, and Tirupur office venue details directly to the borrower.
                                </p>
                              </div>
                              <a
                                href={`https://wa.me/91${detailEnquiry.mobileNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
                                  `Dear ${detailEnquiry.fullName}, greetings from Prime Associates.\n\nYour loan consultation meeting for ${detailEnquiry.loanType} (Ref: ${detailEnquiry.referenceNumber}) has been confirmed:\n📅 Date: ${detailEnquiry.preferredDate}\n⏰ Time: ${detailEnquiry.preferredTimeSlot}\n📍 Mode: ${detailEnquiry.meetingMode === 'in_person' ? 'In-Person at No. 48, 49, P.R. Complex, Kumaran Road, Tirupur' : detailEnquiry.meetingMode === 'video' ? 'Google Meet Video Call' : 'Direct Phone Call'}\n\nPlease keep your reference KYC & bank statements ready. For questions, call +91 96555 66613.`
                                )}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold font-heading shadow-xs transition-colors flex-shrink-0 cursor-pointer"
                              >
                                <span>Send WhatsApp Confirmation</span>
                              </a>
                            </div>
                          )}
                        </>
                      ) : (
                        <form onSubmit={handleAllotAppointmentSubmit} className="space-y-4 p-4 bg-white rounded-xl border border-teal-300 ring-2 ring-teal-500/10">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-bold text-[#0c1a26] mb-1 font-heading">
                                Consultation Date
                              </label>
                              <input
                                type="date"
                                required
                                value={allotDate}
                                onChange={(e) => setAllotDate(e.target.value)}
                                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-[#0c1a26] focus:bg-white"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-[#0c1a26] mb-1 font-heading">
                                Allot Time Slot
                              </label>
                              <select
                                value={allotSlot}
                                onChange={(e) => setAllotSlot(e.target.value)}
                                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-[#0c1a26] focus:bg-white"
                              >
                                {STANDARD_SLOTS.map((slot) => (
                                  <option key={slot} value={slot}>
                                    {slot}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-[#0c1a26] mb-1.5 font-heading">
                              Consultation Channel
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                              <button
                                type="button"
                                onClick={() => setAllotMode('phone')}
                                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                                  allotMode === 'phone'
                                    ? 'bg-emerald-50 text-emerald-900 border-emerald-400 font-bold ring-1 ring-emerald-400'
                                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-white'
                                }`}
                              >
                                <Phone className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
                                <span className="text-[11px] block">Direct Phone</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setAllotMode('video')}
                                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                                  allotMode === 'video'
                                    ? 'bg-sky-50 text-sky-900 border-sky-400 font-bold ring-1 ring-sky-400'
                                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-white'
                                }`}
                              >
                                <Video className="w-4 h-4 mx-auto mb-1 text-sky-600" />
                                <span className="text-[11px] block">Google Meet</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setAllotMode('in_person')}
                                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                                  allotMode === 'in_person'
                                    ? 'bg-purple-50 text-purple-900 border-purple-400 font-bold ring-1 ring-purple-400'
                                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-white'
                                }`}
                              >
                                <Building2 className="w-4 h-4 mx-auto mb-1 text-purple-600" />
                                <span className="text-[11px] block">Tirupur Office</span>
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-[#0c1a26] mb-1 font-heading">
                              Administrative Note / Google Meet Link
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Google Meet: meet.google.com/xyz or bring original land patta document..."
                              value={allotNotes}
                              onChange={(e) => setAllotNotes(e.target.value)}
                              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#0c1a26]"
                            />
                          </div>

                          <div className="flex items-center justify-end gap-2 pt-2">
                            <button
                              type="button"
                              onClick={() => setIsAllotting(false)}
                              className="px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              disabled={allotSubmitting}
                              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold font-heading flex items-center gap-1.5 shadow-sm"
                            >
                              {allotSubmitting ? (
                                <>
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  <span>Saving Slot...</span>
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Confirm &amp; Allot Slot</span>
                                </>
                              )}
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  )}

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

      {/* Admin Register Borrower Modal */}
      <RegisterBorrowerModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSuccess={() => {
          fetchList();
        }}
      />
    </div>
  );
};

export default AdminEnquiriesPage;
