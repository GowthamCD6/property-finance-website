import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Search,
  Mail,
  Phone,
  Calendar,
  Clock,
  Eye,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  ExternalLink,
  Building2,
  Video,
  FileSpreadsheet,
  X,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  MapPin,
  Briefcase,
  Home,
  Check,
  ChevronLeft,
  ChevronRight,
  CalendarCheck2,
} from 'lucide-react';
import { EnquiredCustomer, Enquiry } from '../../types';
import { getEnquiredCustomersApi } from '../../services/api';

export const AdminCustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<EnquiredCustomer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(15);

  // Detail Modal State
  const [selectedCustomer, setSelectedCustomer] = useState<EnquiredCustomer | null>(null);

  const fetchCustomers = () => {
    setLoading(true);
    getEnquiredCustomersApi(searchTerm.trim() || undefined)
      .then((res) => {
        setCustomers(res.data);
        setTotalCount(res.totalCount);
        setPage(1);
      })
      .catch((err) => console.error('Error fetching enquired customers:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCustomers();
  };

  const totalPages = Math.max(1, Math.ceil(customers.length / limit));
  const displayedCustomers = customers.slice((page - 1) * limit, page * limit);

  // Format currency in INR (Cr / Lakhs)
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

  // Format date helper
  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  // Channel mode badge helper
  const getModeBadge = (mode?: string | null) => {
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
            <span>Doorstep Visit</span>
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-sky-50 text-sky-800 border-sky-200';
      case 'Contacted':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Appointment Confirmed':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Converted':
        return 'bg-teal-50 text-teal-800 border-teal-200';
      case 'Closed':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  // Compute aggregate statistics
  const totalEnquiriesAcrossCustomers = customers.reduce((acc, c) => acc + c.totalEnquiries, 0);
  const totalCapitalRequested = customers.reduce((acc, c) => acc + c.totalLoanAmount, 0);

  return (
    <div className="space-y-6 font-sans">
      {/* Top Verification Explanation Banner */}
      <div className="p-4 bg-gradient-to-r from-teal-50/80 via-white to-slate-50 border border-teal-200/90 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-teal-600 text-white rounded-xl flex-shrink-0 mt-0.5 shadow-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-[#0c1a26] font-heading">
              Enquired Customers Database (Google Verified)
            </h3>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Displays client accounts authenticated via Google One-Click SSO who have submitted active loan enquiry dossiers.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={fetchCustomers}
            className="p-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Refresh Customers"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-teal-600' : ''}`} />
            <span className="hidden sm:inline font-heading font-bold text-xs">Refresh</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-heading">
              Enquired Borrowers
            </p>
            <h3 className="text-2xl font-black text-[#0c1a26] mt-1 font-heading">{totalCount}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5 font-sans">Google authenticated profiles</p>
          </div>
          <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center text-teal-700">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-heading">
              Total Applications
            </p>
            <h3 className="text-2xl font-black text-indigo-600 mt-1 font-heading">
              {totalEnquiriesAcrossCustomers}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5 font-sans">Submitted dossiers</p>
          </div>
          <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-heading">
              Total Loan Demand
            </p>
            <h3 className="text-2xl font-black text-emerald-600 mt-1 font-heading">
              {formatAmountINR(totalCapitalRequested)}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5 font-sans">Combined loan valuation</p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar Container */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Customer Name, Google Email, Mobile Number, or Reference..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-[#0c1a26] font-sans placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  getEnquiredCustomersApi().then((r) => {
                    setCustomers(r.data);
                    setTotalCount(r.totalCount);
                  });
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-xl text-xs sm:text-sm font-bold font-heading shadow-xs transition-all active:scale-[0.98] cursor-pointer"
          >
            Search
          </button>
        </form>
      </div>

      {/* Customer Directory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/90 border-b border-slate-200/90 text-slate-600 font-bold uppercase tracking-wider text-[11px] font-heading">
                <th className="py-4 px-5 min-w-[260px]">Verified Borrower</th>
                <th className="py-4 px-4 min-w-[140px]">Contact Phone</th>
                <th className="py-4 px-4 min-w-[140px]">Loan Inquiries</th>
                <th className="py-4 px-4 min-w-[170px]">Latest Application</th>
                <th className="py-4 px-4 min-w-[160px]">Preferred Slot</th>
                <th className="py-4 px-4 min-w-[140px]">Last Active</th>
                <th className="py-4 px-5 text-right min-w-[110px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {loading ? (
                <>
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <tr key={idx} className="animate-pulse border-b border-slate-100">
                      <td className="py-4 px-5 min-w-[260px]">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0" />
                          <div className="space-y-1.5 flex-1">
                            <div className="h-4 bg-slate-200 rounded w-32" />
                            <div className="h-3 bg-slate-100 rounded w-40" />
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 min-w-[140px]">
                        <div className="h-3.5 bg-slate-200 rounded w-24" />
                      </td>
                      <td className="py-4 px-4 min-w-[140px]">
                        <div className="space-y-1">
                          <div className="h-3.5 bg-slate-200 rounded w-16" />
                          <div className="h-2.5 bg-slate-100 rounded w-20" />
                        </div>
                      </td>
                      <td className="py-4 px-4 min-w-[170px]">
                        <div className="space-y-1">
                          <div className="h-3.5 bg-slate-200 rounded w-24" />
                          <div className="h-2.5 bg-slate-100 rounded w-16" />
                        </div>
                      </td>
                      <td className="py-4 px-4 min-w-[160px]">
                        <div className="h-5 bg-slate-200 rounded-md w-24" />
                      </td>
                      <td className="py-4 px-4 min-w-[140px]">
                        <div className="h-3.5 bg-slate-200 rounded w-20" />
                      </td>
                      <td className="py-4 px-5 text-right min-w-[110px]">
                        <div className="h-7 bg-slate-200 rounded-xl w-20 ml-auto" />
                      </td>
                    </tr>
                  ))}
                </>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-16 text-center space-y-3">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                      <Users className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-bold text-[#0c1a26] font-heading">
                      No enquired customers found
                    </h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto font-sans">
                      Only users who have signed in with their Google account and submitted at least one loan application will be listed here.
                    </p>
                  </td>
                </tr>
              ) : (
                displayedCustomers.map((c) => {
                  const latest = c.latestEnquiry;

                  return (
                    <tr key={c.id} className="hover:bg-slate-50/60 transition-colors group">
                      {/* Customer Profile & Google ID */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          {c.picture ? (
                            <img
                              src={c.picture}
                              alt={c.name}
                              className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-xs flex-shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 text-white font-bold font-heading text-xs flex items-center justify-center border border-slate-700 shadow-xs flex-shrink-0">
                              {c.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .substring(0, 2)
                                .toUpperCase()}
                            </div>
                          )}

                          <div className="space-y-0.5 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-[#0c1a26] font-heading text-xs group-hover:text-teal-700 transition-colors truncate">
                                {c.name}
                              </span>
                              <span
                                className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-200"
                                title="Verified Google OAuth Profile"
                              >
                                <Sparkles className="w-2.5 h-2.5 text-blue-500" />
                                <span>Google User</span>
                              </span>
                            </div>

                            <div className="flex items-center gap-1 text-[11px] text-slate-500 truncate">
                              <Mail className="w-3 h-3 text-slate-400 flex-shrink-0" />
                              <a
                                href={`mailto:${c.email}`}
                                className="hover:text-teal-700 hover:underline truncate"
                              >
                                {c.email}
                              </a>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Phone Number */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {c.phone ? (
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-700">{c.phone}</span>
                            <a
                              href={`https://wa.me/91${c.phone.replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1 rounded-md text-emerald-600 hover:bg-emerald-50 transition-colors"
                              title="Message on WhatsApp"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Not provided</span>
                        )}
                      </td>

                      {/* Enquiry Count & Value */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="space-y-0.5">
                          <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-bold font-heading bg-slate-100 text-[#0c1a26] border border-slate-200">
                            {c.totalEnquiries} {c.totalEnquiries === 1 ? 'Enquiry' : 'Enquiries'}
                          </span>
                          <div className="text-[11px] font-extrabold text-emerald-700 font-heading">
                            {formatAmountINR(c.totalLoanAmount)}
                          </div>
                        </div>
                      </td>

                      {/* Latest Application Details */}
                      <td className="py-4 px-4">
                        {latest ? (
                          <div className="space-y-1 min-w-[140px]">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-[#0c1a26] text-xs font-heading">
                                {latest.loanType}
                              </span>
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                                {latest.referenceNumber}
                              </span>
                            </div>
                            <div>
                              <span
                                className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold border font-heading ${getStatusBadge(
                                  latest.status
                                )}`}
                              >
                                {latest.status}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">None</span>
                        )}
                      </td>

                      {/* Preferred Meeting Slot */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {latest?.preferredDate ? (
                          <div className="space-y-1">
                            <div className="font-heading font-extrabold text-[#0c1a26] text-xs flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                              <span>{formatDate(latest.preferredDate).split(',')[0]}</span>
                            </div>
                            <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                              <span>{latest.preferredTimeSlot || 'Standard Slot'}</span>
                            </div>
                            <div className="pt-0.5">{getModeBadge(latest.meetingMode)}</div>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Not set</span>
                        )}
                      </td>

                      {/* Last Active */}
                      <td className="py-4 px-4 whitespace-nowrap text-slate-500 text-[11px]">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{formatDate(c.lastLoginAt || c.createdAt)}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setSelectedCustomer(c)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#0c1a26] text-slate-700 hover:text-white rounded-xl text-xs font-extrabold font-heading transition-all border border-slate-200 cursor-pointer shadow-2xs hover:shadow-sm active:scale-95 group"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
                          <span>Customer Dossier</span>
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
              of <span className="font-bold text-slate-900 font-heading tabular-nums">{totalCount}</span> verified borrowers
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

      {/* ====================================================================== */}
      {/* MODAL: CUSTOMER DOSSIER & COMPLETE ENQUIRY HISTORY */}
      {/* ====================================================================== */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-[#0c1a26] text-white flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                {selectedCustomer.picture ? (
                  <img
                    src={selectedCustomer.picture}
                    alt={selectedCustomer.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-teal-400 shadow-md flex-shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-teal-500 text-slate-950 font-bold font-heading text-sm flex items-center justify-center flex-shrink-0">
                    {selectedCustomer.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .substring(0, 2)
                      .toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold font-heading">{selectedCustomer.name}</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-400/20 text-teal-300 border border-teal-400/30">
                      Verified Client
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-sans mt-0.5">
                    {selectedCustomer.email} &bull; Member since{' '}
                    {new Date(selectedCustomer.createdAt).toLocaleDateString('en-IN')}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Client Quick Contact Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 block font-heading">
                      Mobile Number
                    </span>
                    <span className="text-xs font-bold text-[#0c1a26]">
                      {selectedCustomer.phone || 'Not provided'}
                    </span>
                  </div>
                  {selectedCustomer.phone && (
                    <a
                      href={`https://wa.me/91${selectedCustomer.phone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold font-heading shadow-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-3 h-3" />
                      <span>WhatsApp</span>
                    </a>
                  )}
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 block font-heading">
                      Google Account
                    </span>
                    <span className="text-xs font-bold text-[#0c1a26] truncate max-w-[160px] block">
                      {selectedCustomer.email}
                    </span>
                  </div>
                  <a
                    href={`mailto:${selectedCustomer.email}`}
                    className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-[11px] font-bold font-heading shadow-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Mail className="w-3 h-3" />
                    <span>Send Email</span>
                  </a>
                </div>
              </div>

              {/* Loan Applications Submitted Header */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#0c1a26] font-heading flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-teal-600" />
                    <span>Submitted Loan Inquiries ({selectedCustomer.enquiries.length})</span>
                  </h4>
                  <span className="text-xs font-black text-emerald-700 font-heading">
                    Total: {formatAmountINR(selectedCustomer.totalLoanAmount)}
                  </span>
                </div>

                {/* Applications List */}
                <div className="space-y-3">
                  {selectedCustomer.enquiries.map((enq) => (
                    <div
                      key={enq.id}
                      className="p-4 bg-slate-50/70 hover:bg-slate-50 rounded-xl border border-slate-200 transition-colors space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-2.5">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-[#0c1a26] font-heading text-xs">
                              {enq.loanType}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white text-slate-700 border border-slate-200 shadow-2xs">
                              {enq.referenceNumber}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 mt-0.5 block">
                            Submitted on {new Date(enq.createdAt).toLocaleDateString('en-IN')}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 self-start sm:self-auto">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border font-heading ${getStatusBadge(
                              enq.status
                            )}`}
                          >
                            {enq.status}
                          </span>
                          <span className="text-xs font-black text-emerald-700 font-heading">
                            {formatAmountINR(enq.loanAmount)}
                          </span>
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Property Type</span>
                          <span className="font-semibold text-[#0c1a26] capitalize text-[11px]">
                            {enq.propertyType}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Location</span>
                          <span className="font-semibold text-[#0c1a26] text-[11px] truncate block">
                            {enq.propertyLocation || enq.cityState}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Employment</span>
                          <span className="font-semibold text-[#0c1a26] capitalize text-[11px]">
                            {enq.employmentType?.replace('_', ' ')}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Ownership</span>
                          <span className="font-semibold text-[#0c1a26] capitalize text-[11px]">
                            {enq.propertyOwnershipStatus?.replace('_', ' ')}
                          </span>
                        </div>
                      </div>

                      {/* Doorstep Location & Consultation Slot */}
                      {(() => {
                        const doorstepAddress = enq.additionalNotes?.includes('📍 Doorstep Meeting Address:')
                          ? enq.additionalNotes.split('📍 Doorstep Meeting Address:')[1]?.split('\n')[0]?.trim()
                          : (enq.meetingMode === 'in_person' ? (enq.propertyLocation || enq.cityState) : null);

                        return (
                          <div className="space-y-2 pt-1 border-t border-slate-200/60">
                            {doorstepAddress && enq.meetingMode === 'in_person' && (
                              <div className="p-2.5 bg-purple-50/70 rounded-xl border border-purple-200 flex items-center justify-between text-xs">
                                <div className="space-y-0.5 min-w-0 pr-2">
                                  <span className="text-[10px] font-bold text-purple-900 font-heading block">
                                    📍 Doorstep Area Visit Address
                                  </span>
                                  <span className="text-purple-950 font-medium text-[11px] truncate block">
                                    {doorstepAddress}
                                  </span>
                                </div>
                                <a
                                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(doorstepAddress)}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 px-2 py-1 bg-white hover:bg-purple-100 text-purple-800 border border-purple-200 rounded-lg text-[10px] font-bold font-heading shrink-0 shadow-2xs"
                                >
                                  <MapPin className="w-3 h-3 text-purple-600" />
                                  <span>Maps</span>
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              </div>
                            )}

                            <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                              <div className="flex items-center gap-2 text-slate-700">
                                <Calendar className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                                <span className="font-semibold text-[11px] text-[#0c1a26]">
                                  {enq.preferredDate || 'Date Not Set'} &bull; {enq.preferredTimeSlot || 'Pending'}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                {getModeBadge(enq.meetingMode)}
                                <Link
                                  to={`/admin/appointments?allotEnquiryId=${enq.id}`}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-[10px] font-bold font-heading transition-colors shadow-2xs"
                                >
                                  <CalendarCheck2 className="w-3 h-3" />
                                  <span>Allot Slot</span>
                                </Link>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span>Google ID: {selectedCustomer.googleId || 'Verified Profile'}</span>
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold font-heading text-xs transition-colors"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomersPage;

