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
  Building,
  User,
  CheckCircle,
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
} from 'lucide-react';
import { Enquiry, UploadedDocument } from '../../types';
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

  // Data state
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // Detail Modal State
  const [selectedEnquiryId, setSelectedEnquiryId] = useState<string | null>(null);
  const [detailEnquiry, setDetailEnquiry] = useState<Enquiry | null>(null);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchList();
  };

  // Open Enquiry Detail
  const handleOpenDetail = (id: string) => {
    setSelectedEnquiryId(id);
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

      // Reload detail
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
      // Reload detail
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
      // Reload detail
      const refreshed = await getEnquiryByIdApi(detailEnquiry.id);
      setDetailEnquiry(refreshed);
    } catch (err: any) {
      alert(err.message || 'Failed to record note');
    } finally {
      setNoteSubmitting(false);
    }
  };

  const formatAmountINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Contacted':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Follow-up Required':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Appointment Requested':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Appointment Confirmed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'In Review':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Converted':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'Closed':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-navy tracking-tight">
            Loan Enquiry Pipeline
          </h1>
          <p className="text-xs sm:text-sm text-brand-slate mt-0.5">
            Total {totalCount} records registered across all property loan products
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={getExportEnquiriesCsvUrl()}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-brand-ivory text-brand-navy border border-brand-border rounded-corporate text-xs font-semibold shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-brand-teal" />
            <span>Export to CSV</span>
          </a>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-brand-border shadow-subtle space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-brand-slate" />
            <input
              type="text"
              placeholder="Search by Applicant Name, Phone, Reference Number or City..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 bg-brand-ivory/50 border border-brand-border rounded-lg text-xs sm:text-sm text-brand-navy focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedLoanType}
              onChange={(e) => {
                setSelectedLoanType(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 bg-brand-ivory/50 border border-brand-border rounded-lg text-xs sm:text-sm text-brand-navy focus:bg-white"
            >
              <option value="ALL">All Loan Types</option>
              <option value="Home Loan">Home Loan</option>
              <option value="Loan Against Property">Loan Against Property</option>
              <option value="Property-Backed Funding">Property-Backed Funding</option>
              <option value="Loan Consultation & Eligibility Review">Loan Consultation</option>
            </select>

            <button
              type="submit"
              className="px-4 py-2 bg-brand-teal hover:bg-brand-teal-hover text-white rounded-lg text-xs font-semibold transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        {/* Status Tab Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {ALL_STATUSES.map((status) => (
            <button
              key={status}
              onClick={() => {
                setSelectedStatus(status);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                selectedStatus === status
                  ? 'bg-brand-navy text-white shadow-xs'
                  : 'bg-brand-ivory text-brand-slate hover:bg-gray-200'
              }`}
            >
              {status === 'ALL' ? 'All Statuses' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-brand-border shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-brand-ivory/80 border-b border-brand-border text-brand-slate font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Ref Number</th>
                <th className="py-3.5 px-4">Applicant &amp; Phone</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Loan Type</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Meeting Slot</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-brand-slate">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-brand-teal mb-2" />
                    <span>Loading pipeline records...</span>
                  </td>
                </tr>
              ) : enquiries.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-brand-slate">
                    No enquiries match the current filters.
                  </td>
                </tr>
              ) : (
                enquiries.map((enq) => {
                  const appointment = enq.appointments && enq.appointments[0];

                  return (
                    <tr key={enq.id} className="hover:bg-brand-ivory/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-brand-navy">
                        {enq.referenceNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-brand-navy block">
                          {enq.fullName}
                        </span>
                        <span className="text-[11px] text-brand-slate">{enq.mobileNumber}</span>
                      </td>
                      <td className="py-3.5 px-4 text-brand-slate">
                        {enq.cityState}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-brand-navy">
                        {enq.loanType}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-brand-navy">
                        {formatAmountINR(enq.loanAmount)}
                      </td>
                      <td className="py-3.5 px-4 text-[11px] text-brand-navy">
                        {appointment ? (
                          <div>
                            <span className="font-semibold block">{appointment.date}</span>
                            <span className="text-brand-slate">{appointment.timeSlot}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">Not set</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusBadge(
                            enq.status
                          )}`}
                        >
                          {enq.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleOpenDetail(enq.id)}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-brand-teal-light text-brand-teal hover:bg-brand-teal hover:text-white rounded-md text-[11px] font-semibold transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Detail</span>
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
          <div className="p-4 border-t border-brand-border flex items-center justify-between text-xs text-brand-slate">
            <span>
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1.5 border border-brand-border rounded hover:bg-brand-ivory disabled:opacity-50"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 border border-brand-border rounded hover:bg-brand-ivory disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* DETAIL MODAL / SLIDE-OVER */}
      {selectedEnquiryId && (
        <div className="fixed inset-0 z-50 bg-brand-navy/60 backdrop-blur-xs flex items-center justify-end">
          <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-brand-border flex items-center justify-between bg-brand-ivory/50">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-brand-teal block">
                  Enquiry Reference
                </span>
                <h2 className="text-xl font-mono font-extrabold text-brand-navy">
                  {detailEnquiry?.referenceNumber || 'Loading...'}
                </h2>
              </div>
              <button
                onClick={() => setSelectedEnquiryId(null)}
                className="p-1.5 rounded-lg text-brand-slate hover:text-brand-navy hover:bg-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content Viewport */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs sm:text-sm">
              {detailLoading || !detailEnquiry ? (
                <div className="py-24 text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-brand-teal" />
                  <span className="text-xs text-brand-slate mt-2 block">Loading enquiry details...</span>
                </div>
              ) : (
                <>
                  {/* Status Bar & Quick Updater */}
                  <div className="p-4 bg-brand-ivory rounded-xl border border-brand-border space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-brand-navy">Current Status:</span>
                      <span
                        className={`px-3 py-0.5 rounded-full text-xs font-bold border ${getStatusBadge(
                          detailEnquiry.status
                        )}`}
                      >
                        {detailEnquiry.status}
                      </span>
                    </div>

                    <form onSubmit={handleStatusUpdate} className="pt-2 border-t border-brand-border/60 space-y-2">
                      <div className="flex gap-2">
                        <select
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value)}
                          className="flex-1 px-3 py-1.5 bg-white border border-brand-border rounded-lg text-xs text-brand-navy font-semibold"
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
                          className="px-3.5 py-1.5 bg-brand-teal hover:bg-brand-teal-hover disabled:bg-gray-300 text-white rounded-lg text-xs font-semibold transition-colors"
                        >
                          {statusUpdating ? 'Updating...' : 'Update Status'}
                        </button>
                      </div>

                      <input
                        type="text"
                        placeholder="Add reason or remark for status update (recorded in audit trail)..."
                        value={statusNote}
                        onChange={(e) => setStatusNote(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-brand-border rounded-lg text-xs text-brand-navy"
                      />
                    </form>
                  </div>

                  {/* Applicant Details Card */}
                  <div className="border border-brand-border rounded-xl p-4 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-brand-slate">
                      Applicant Information
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-brand-slate block text-[11px]">Full Name</span>
                        <span className="font-bold text-brand-navy text-sm">{detailEnquiry.fullName}</span>
                      </div>
                      <div>
                        <span className="text-brand-slate block text-[11px]">Mobile Number</span>
                        <a
                          href={`tel:${detailEnquiry.mobileNumber}`}
                          className="font-bold text-brand-teal hover:underline text-sm"
                        >
                          {detailEnquiry.mobileNumber}
                        </a>
                      </div>
                      <div>
                        <span className="text-brand-slate block text-[11px]">Email</span>
                        <span className="font-medium text-brand-navy">
                          {detailEnquiry.email || 'Not provided'}
                        </span>
                      </div>
                      <div>
                        <span className="text-brand-slate block text-[11px]">Preferred Contact Method</span>
                        <span className="font-semibold text-brand-navy capitalize">
                          {detailEnquiry.preferredContactMethod}
                        </span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-brand-slate block text-[11px]">Applicant Location</span>
                        <span className="font-medium text-brand-navy">{detailEnquiry.cityState}</span>
                      </div>
                    </div>
                  </div>

                  {/* Loan & Property Card */}
                  <div className="border border-brand-border rounded-xl p-4 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-brand-slate">
                      Loan &amp; Property Specifications
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-brand-slate block text-[11px]">Loan Type</span>
                        <span className="font-bold text-brand-navy">{detailEnquiry.loanType}</span>
                      </div>
                      <div>
                        <span className="text-brand-slate block text-[11px]">Approximate Amount</span>
                        <span className="font-bold text-brand-teal text-base">
                          {formatAmountINR(detailEnquiry.loanAmount)}
                        </span>
                      </div>
                      <div>
                        <span className="text-brand-slate block text-[11px]">Property Type</span>
                        <span className="font-medium text-brand-navy capitalize">
                          {detailEnquiry.propertyType}
                        </span>
                      </div>
                      <div>
                        <span className="text-brand-slate block text-[11px]">Ownership Status</span>
                        <span className="font-medium text-brand-navy capitalize">
                          {detailEnquiry.propertyOwnershipStatus.replace('_', ' ')}
                        </span>
                      </div>
                      <div>
                        <span className="text-brand-slate block text-[11px]">Property Location</span>
                        <span className="font-medium text-brand-navy">
                          {detailEnquiry.propertyLocation}
                        </span>
                      </div>
                      <div>
                        <span className="text-brand-slate block text-[11px]">Employment Type</span>
                        <span className="font-medium text-brand-navy capitalize">
                          {detailEnquiry.employmentType.replace('_', ' ')}
                        </span>
                      </div>

                      {detailEnquiry.preferredBank && (
                        <div className="col-span-2 pt-2 border-t border-brand-border/40">
                          <span className="text-brand-slate block text-[11px]">Preferred Channel Partner / Bank</span>
                          <span className="inline-flex items-center gap-1.5 font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200 mt-0.5">
                            <Landmark className="w-3.5 h-3.5 text-brand-teal" />
                            <span>{detailEnquiry.preferredBank}</span>
                          </span>
                        </div>
                      )}
                    </div>

                    {/* VEHICLE DETAILS (IF CAR LOAN - PAGE 4) */}
                    {detailEnquiry.carLoanDetails && (
                      <div className="p-3 bg-teal-50/60 rounded-lg border border-teal-200 space-y-2 mt-2">
                        <div className="flex items-center gap-1.5 text-brand-navy font-bold text-xs">
                          <Car className="w-3.5 h-3.5 text-brand-teal" />
                          <span>Vehicle Specifications ({detailEnquiry.carLoanDetails.carType?.toUpperCase()})</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {detailEnquiry.carLoanDetails.onRoadPrice && (
                            <div>
                              <span className="text-brand-slate block text-[10px]">On-Road Price</span>
                              <span className="font-bold text-brand-navy">{formatAmountINR(detailEnquiry.carLoanDetails.onRoadPrice)}</span>
                            </div>
                          )}
                          {detailEnquiry.carLoanDetails.showroomName && (
                            <div>
                              <span className="text-brand-slate block text-[10px]">Showroom / Financer</span>
                              <span className="font-semibold text-brand-navy">{detailEnquiry.carLoanDetails.showroomName}</span>
                            </div>
                          )}
                          {detailEnquiry.carLoanDetails.area && (
                            <div>
                              <span className="text-brand-slate block text-[10px]">Area</span>
                              <span className="font-semibold text-brand-navy">{detailEnquiry.carLoanDetails.area}</span>
                            </div>
                          )}
                          {detailEnquiry.carLoanDetails.modelYear && (
                            <div>
                              <span className="text-brand-slate block text-[10px]">Model &amp; Year</span>
                              <span className="font-semibold text-brand-navy">{detailEnquiry.carLoanDetails.modelYear}</span>
                            </div>
                          )}
                          {detailEnquiry.carLoanDetails.ownersCount && (
                            <div>
                              <span className="text-brand-slate block text-[10px]">Ownership</span>
                              <span className="font-semibold text-brand-navy">{detailEnquiry.carLoanDetails.ownersCount} Owner(s)</span>
                            </div>
                          )}
                          {detailEnquiry.carLoanDetails.purchaseValue && (
                            <div>
                              <span className="text-brand-slate block text-[10px]">Purchase / Valuation Value</span>
                              <span className="font-bold text-brand-navy">{formatAmountINR(detailEnquiry.carLoanDetails.purchaseValue)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {detailEnquiry.additionalNotes && (
                      <div className="pt-2 border-t border-brand-border/60">
                        <span className="text-brand-slate block text-[11px] mb-1">Applicant Remarks:</span>
                        <p className="bg-brand-ivory p-3 rounded-lg text-brand-navy italic">
                          "{detailEnquiry.additionalNotes}"
                        </p>
                      </div>
                    )}
                  </div>

                  {/* SUBMITTED REFERENCE DOCUMENTS (REAL-DOCUMENT INTAKE) */}
                  <div className="border border-brand-border rounded-xl p-4 space-y-3 bg-white">
                    <div className="flex items-center justify-between pb-2 border-b border-brand-border">
                      <div className="flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-brand-teal" />
                        <h4 className="text-xs font-bold uppercase tracking-wider text-brand-navy">
                          Submitted Reference Documents
                        </h4>
                      </div>
                      <span className="text-xs font-extrabold text-brand-teal bg-brand-teal-light px-2.5 py-0.5 rounded-full border border-brand-teal/20">
                        {detailEnquiry.documents?.length || 0} File(s)
                      </span>
                    </div>

                    {detailEnquiry.documents && detailEnquiry.documents.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        {detailEnquiry.documents.map((doc) => (
                          <div
                            key={doc.id}
                            className="p-2.5 rounded-xl border border-brand-border hover:border-brand-teal/50 bg-brand-ivory/40 transition-all flex items-start gap-3 group"
                          >
                            {doc.type.includes('image') ? (
                              <img
                                src={doc.previewUrl}
                                alt={doc.name}
                                onClick={() => setAdminPreviewDoc(doc)}
                                className="w-14 h-14 object-cover rounded-lg border border-brand-border cursor-pointer hover:opacity-80 transition-opacity shrink-0 shadow-2xs"
                              />
                            ) : (
                              <div className="w-14 h-14 rounded-lg bg-red-50 border border-red-200 flex flex-col items-center justify-center text-red-700 shrink-0 font-bold text-xs">
                                <span>PDF</span>
                              </div>
                            )}

                            <div className="min-w-0 flex-1 space-y-1">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-teal bg-white px-1.5 py-0.5 rounded border border-brand-teal/20">
                                {doc.category || 'Reference'}
                              </span>
                              <h5 className="text-xs font-bold text-brand-navy truncate block" title={doc.documentName}>
                                {doc.documentName || doc.name}
                              </h5>
                              <div className="flex items-center justify-between pt-1 text-[10px] text-brand-slate">
                                <span>{doc.size ? `${(doc.size / 1024).toFixed(0)} KB` : 'Verified'}</span>
                                <div className="flex items-center gap-2">
                                  {doc.type.includes('image') && (
                                    <button
                                      type="button"
                                      onClick={() => setAdminPreviewDoc(doc)}
                                      className="text-brand-teal hover:underline font-bold flex items-center gap-0.5"
                                    >
                                      <Eye className="w-3 h-3" /> View
                                    </button>
                                  )}
                                  <a
                                    href={doc.previewUrl}
                                    download={doc.name}
                                    className="text-slate-600 hover:text-brand-navy font-bold flex items-center gap-0.5"
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
                      <div className="p-4 rounded-lg bg-brand-ivory/60 border border-dashed border-brand-border text-center space-y-1 text-xs text-brand-slate">
                        <ImageIcon className="w-6 h-6 text-gray-400 mx-auto" />
                        <p className="font-semibold text-brand-navy">No Document Images Uploaded Yet</p>
                        <p className="text-[11px]">
                          Applicant has opted to provide document copies during their in-person consultation or via WhatsApp.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Consultation / Appointment Allotment Center */}
                  <div className="border border-brand-border rounded-2xl p-5 space-y-4 bg-slate-50/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-brand-teal" />
                        <h4 className="text-xs font-bold uppercase tracking-wider text-brand-navy font-heading">
                          Consultation Scheduling &amp; Allotment
                        </h4>
                      </div>
                      {!isAllotting && (
                        <button
                          type="button"
                          onClick={() => setIsAllotting(true)}
                          className="px-3 py-1.5 bg-brand-teal hover:bg-brand-teal-hover text-white rounded-lg text-xs font-bold font-heading shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{detailEnquiry.status === 'Appointment Confirmed' ? 'Change Allotted Slot' : 'Allot Time Slot'}</span>
                        </button>
                      )}
                    </div>

                    {allotSuccess && (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span className="font-semibold">{allotSuccess}</span>
                      </div>
                    )}

                    {!isAllotting ? (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-white rounded-xl border border-slate-200">
                        <div>
                          <span className="text-slate-400 block text-[11px] font-medium">Allotted Date &amp; Slot</span>
                          <span className="font-bold text-brand-navy text-xs font-mono">
                            {detailEnquiry.preferredDate || 'Not Set'} &bull; {detailEnquiry.preferredTimeSlot || 'Pending'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px] font-medium">Channel Mode</span>
                          <span className="font-semibold text-brand-navy capitalize text-xs">
                            {detailEnquiry.meetingMode?.replace('_', ' ') || 'Phone Call'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px] font-medium">Schedule Status</span>
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold mt-0.5 ${
                            detailEnquiry.status === 'Appointment Confirmed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {detailEnquiry.status === 'Appointment Confirmed' ? '● Confirmed Slot' : 'Awaiting Allotment'}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleAllotAppointmentSubmit} className="space-y-3.5 p-4 bg-white rounded-xl border border-teal-300 ring-2 ring-teal-500/10">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-brand-navy mb-1 font-heading">
                              Select Date
                            </label>
                            <input
                              type="date"
                              required
                              value={allotDate}
                              onChange={(e) => setAllotDate(e.target.value)}
                              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-brand-navy focus:bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-brand-navy mb-1 font-heading">
                              Allot Time Slot
                            </label>
                            <select
                              value={allotSlot}
                              onChange={(e) => setAllotSlot(e.target.value)}
                              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-brand-navy focus:bg-white"
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
                          <label className="block text-xs font-bold text-brand-navy mb-1 font-heading">
                            Consultation Channel
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            <button
                              type="button"
                              onClick={() => setAllotMode('phone')}
                              className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                                allotMode === 'phone'
                                  ? 'bg-emerald-50 text-emerald-900 border-emerald-400 font-bold'
                                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-white'
                              }`}
                            >
                              <Phone className="w-3.5 h-3.5 mx-auto mb-0.5 text-emerald-600" />
                              <span className="text-[10px] block">Direct Phone</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setAllotMode('video')}
                              className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                                allotMode === 'video'
                                  ? 'bg-sky-50 text-sky-900 border-sky-400 font-bold'
                                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-white'
                              }`}
                            >
                              <Video className="w-3.5 h-3.5 mx-auto mb-0.5 text-sky-600" />
                              <span className="text-[10px] block">Google Meet</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setAllotMode('in_person')}
                              className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                                allotMode === 'in_person'
                                  ? 'bg-purple-50 text-purple-900 border-purple-400 font-bold'
                                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-white'
                              }`}
                            >
                              <Building className="w-3.5 h-3.5 mx-auto mb-0.5 text-purple-600" />
                              <span className="text-[10px] block">Tirupur Office</span>
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-brand-navy mb-1 font-heading">
                            Administrative Note / Google Meet Link
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Google Meet: meet.google.com/xyz-abcd-efg or applicant to bring land patta..."
                            value={allotNotes}
                            onChange={(e) => setAllotNotes(e.target.value)}
                            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-brand-navy"
                          />
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setIsAllotting(false)}
                            className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-50"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={allotSubmitting}
                            className="px-4 py-1.5 bg-brand-teal hover:bg-brand-teal-hover text-white rounded-lg text-xs font-bold font-heading flex items-center gap-1.5"
                          >
                            {allotSubmitting ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Saving Slot...</span>
                              </>
                            ) : (
                              <>
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>Confirm &amp; Allot Slot</span>
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>

                  {/* Internal Consultant Notes */}
                  <div className="border border-brand-border rounded-xl p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-brand-slate">
                        Internal Case Notes
                      </h4>
                      <span className="text-[11px] text-brand-slate">
                        {detailEnquiry.notes?.length || 0} note(s)
                      </span>
                    </div>

                    {/* Add note input */}
                    <form onSubmit={handleAddNote} className="space-y-2">
                      <textarea
                        rows={2}
                        placeholder="Add internal notes on CIBIL, property valuation, lender submission..."
                        value={newNoteContent}
                        onChange={(e) => setNewNoteContent(e.target.value)}
                        className="w-full p-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-xs text-brand-navy focus:bg-white resize-none"
                      />
                      <button
                        type="submit"
                        disabled={noteSubmitting || !newNoteContent.trim()}
                        className="px-3.5 py-1.5 bg-brand-teal hover:bg-brand-teal-hover disabled:bg-gray-300 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
                      >
                        <Send className="w-3 h-3" />
                        <span>{noteSubmitting ? 'Recording...' : 'Add Note'}</span>
                      </button>
                    </form>

                    {/* Notes timeline */}
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {detailEnquiry.notes && detailEnquiry.notes.length > 0 ? (
                        detailEnquiry.notes.map((note) => (
                          <div key={note.id} className="p-3 bg-brand-ivory rounded-lg text-xs space-y-1">
                            <div className="flex justify-between items-center text-[10px] text-brand-slate">
                              <span className="font-semibold text-brand-navy">{note.authorName}</span>
                              <span>{new Date(note.createdAt).toLocaleString('en-IN')}</span>
                            </div>
                            <p className="text-brand-navy">{note.content}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-brand-slate italic text-center py-2">
                          No internal notes recorded yet.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Audit Trail / Status History */}
                  <div className="border border-brand-border rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-2 text-brand-navy">
                      <History className="w-4 h-4 text-brand-teal" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-brand-slate">
                        Status Transition Audit History
                      </h4>
                    </div>

                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1 text-[11px]">
                      {detailEnquiry.statusHistory && detailEnquiry.statusHistory.length > 0 ? (
                        detailEnquiry.statusHistory.map((hist) => (
                          <div key={hist.id} className="p-2.5 bg-gray-50 rounded border border-gray-100 space-y-0.5">
                            <div className="flex justify-between items-center text-brand-slate">
                              <span className="font-semibold text-brand-navy">{hist.changedBy}</span>
                              <span className="text-[10px]">{new Date(hist.createdAt).toLocaleString('en-IN')}</span>
                            </div>
                            <div className="text-brand-navy">
                              {hist.fromStatus} &rarr; <span className="font-semibold text-brand-teal">{hist.toStatus}</span>
                            </div>
                            {hist.note && <p className="text-gray-500 italic">"{hist.note}"</p>}
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-400 italic">No history logged.</p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ADMIN DOCUMENT IMAGE LIGHTBOX MODAL */}
      {adminPreviewDoc && (
        <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-brand-border flex items-center justify-between bg-brand-ivory">
              <div>
                <span className="text-[10px] uppercase font-bold text-brand-teal tracking-wider block">
                  Reference Document Verification
                </span>
                <h4 className="text-base font-bold text-brand-navy flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-brand-teal" />
                  <span>{adminPreviewDoc.documentName || adminPreviewDoc.name}</span>
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setAdminPreviewDoc(null)}
                className="p-1.5 rounded-lg text-brand-slate hover:text-brand-navy hover:bg-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-gray-950">
              <img
                src={adminPreviewDoc.previewUrl}
                alt={adminPreviewDoc.name}
                className="max-h-[76vh] object-contain rounded"
              />
            </div>
            <div className="p-3.5 border-t border-brand-border flex items-center justify-between text-xs text-brand-slate bg-white">
              <span>{adminPreviewDoc.name} ({adminPreviewDoc.size ? `${(adminPreviewDoc.size / 1024).toFixed(0)} KB` : 'Verified'})</span>
              <a
                href={adminPreviewDoc.previewUrl}
                download={adminPreviewDoc.name}
                className="px-4 py-1.5 bg-brand-teal hover:bg-brand-teal-hover text-white rounded font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
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
