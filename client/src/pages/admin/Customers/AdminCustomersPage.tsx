import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Search,
  Mail,
  Phone,
  PhoneCall,
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
import { EnquiredCustomer, Enquiry } from '../../../types';
import { getEnquiredCustomersApi } from '../../../services/api';

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
      })
      .catch((err) => console.error('Error fetching enquired customers:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const isSearchMounted = useRef(false);
  useEffect(() => {
    if (!isSearchMounted.current) {
      isSearchMounted.current = true;
      return;
    }
    const timer = setTimeout(() => {
      setPage(1);
      fetchCustomers();
    }, 350);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
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

  const formatStatusLabel = (status?: string | null): string => {
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

  const getStatusBadge = (status: string) => {
    const s = formatStatusLabel(status);
    switch (s) {
      case 'Pending':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Slot Booked':
        return 'bg-sky-50 text-sky-800 border-sky-200';
      case 'Process Started':
        return 'bg-teal-50 text-teal-800 border-teal-200';
      case 'Closed':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-amber-50 text-amber-800 border-amber-200';
    }
  };

  return (
    <div className="space-y-5 font-sans">
      {/* Search & Actions Toolbar - Clean Single Row */}
      <div className="bg-white p-2.5 sm:p-3 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Real-time Search Box */}
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Customer Name, Email, Phone, or City..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-[#0c1a26] font-sans placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setPage(1);
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Action Controls & Total Count */}
        <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto">
          <div className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-heading font-bold text-slate-700 flex items-center gap-1.5 shadow-2xs">
            <Users className="w-3.5 h-3.5 text-teal-600" />
            <span>{totalCount} {totalCount === 1 ? 'Customer' : 'Customers'}</span>
          </div>

          <button
            type="button"
            onClick={fetchCustomers}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-heading font-bold shadow-2xs hover:shadow-xs transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
            title="Refresh customer database"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-teal-600' : 'text-slate-500'}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Customer Directory Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/90 border-b border-slate-200/90 text-slate-600 font-bold uppercase tracking-wider text-[11px] font-heading">
                <th className="py-3.5 px-4 min-w-[210px]">Customer &amp; Google Account</th>
                <th className="py-3.5 px-3 min-w-[130px]">Contact Phone</th>
                <th className="py-3.5 px-3 min-w-[120px]">Location</th>
                <th className="py-3.5 px-3 min-w-[110px]">Applications</th>
                <th className="py-3.5 px-3 min-w-[105px]">Registered On</th>
                <th className="py-3.5 px-3 min-w-[115px]">Last Active</th>
                <th className="py-3.5 px-4 text-right min-w-[100px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {loading ? (
                <>
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <tr key={idx} className="animate-pulse border-b border-slate-100">
                      <td className="py-3.5 px-4 min-w-[210px]">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0" />
                          <div className="space-y-1.5 flex-1">
                            <div className="h-4 bg-slate-200 rounded w-28" />
                            <div className="h-3 bg-slate-100 rounded w-36" />
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 min-w-[130px]">
                        <div className="h-3.5 bg-slate-200 rounded w-24" />
                      </td>
                      <td className="py-3.5 px-3 min-w-[120px]">
                        <div className="h-3.5 bg-slate-200 rounded w-20" />
                      </td>
                      <td className="py-3.5 px-3 min-w-[110px]">
                        <div className="h-5 bg-slate-200 rounded-md w-20" />
                      </td>
                      <td className="py-3.5 px-3 min-w-[105px]">
                        <div className="h-3.5 bg-slate-200 rounded w-18" />
                      </td>
                      <td className="py-3.5 px-3 min-w-[115px]">
                        <div className="h-3.5 bg-slate-200 rounded w-20" />
                      </td>
                      <td className="py-3.5 px-4 text-right min-w-[100px]">
                        <div className="h-7 bg-slate-200 rounded-xl w-24 ml-auto" />
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
                      No customers found
                    </h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto font-sans">
                      {searchTerm ? 'No registered customers match your search criteria.' : 'Users who sign in via Google and submit an application will appear here.'}
                    </p>
                  </td>
                </tr>
              ) : (
                displayedCustomers.map((c) => {
                  return (
                    <tr key={c.id} className="hover:bg-slate-50/70 transition-colors group">
                      {/* Customer Profile & Google Email */}
                      <td className="py-3.5 px-4">
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
                                className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-sky-50 text-sky-700 border border-sky-200 shrink-0"
                                title="Google Verified Account"
                              >
                                <Sparkles className="w-2.5 h-2.5 text-sky-500" />
                                <span>Google</span>
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 truncate">
                              <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                              <a
                                href={`mailto:${c.email}`}
                                className="hover:text-teal-700 hover:underline truncate"
                                title={`Send email to ${c.email}`}
                              >
                                {c.email}
                              </a>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Contact Phone */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        {c.phone ? (
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-800 font-heading text-xs">{c.phone}</span>
                            <div className="flex items-center gap-1">
                              <a
                                href={`https://wa.me/91${c.phone.replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1 rounded-md text-emerald-600 hover:bg-emerald-50 transition-colors"
                                title="Chat on WhatsApp"
                              >
                                <Phone className="w-3.5 h-3.5" />
                              </a>
                              <a
                                href={`tel:${c.phone}`}
                                className="p-1 rounded-md text-teal-600 hover:bg-teal-50 transition-colors"
                                title="Direct Call"
                              >
                                <PhoneCall className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-xs">Not provided</span>
                        )}
                      </td>

                      {/* City / State Location */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-1.5 text-xs text-slate-700">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <span className="truncate">{c.latestEnquiry?.cityState || 'Tamil Nadu'}</span>
                        </div>
                      </td>

                      {/* Total Applications Submitted */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold font-heading bg-slate-100 text-slate-800 border border-slate-200">
                          <FileSpreadsheet className="w-3 h-3 text-teal-600" />
                          <span>{c.totalEnquiries} {c.totalEnquiries === 1 ? 'Application' : 'Applications'}</span>
                        </span>
                      </td>

                      {/* Registration Date */}
                      <td className="py-3.5 px-3 whitespace-nowrap text-xs text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                      </td>

                      {/* Last Active */}
                      <td className="py-3.5 px-3 whitespace-nowrap text-xs text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{formatDate(c.lastLoginAt || c.createdAt)}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setSelectedCustomer(c)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#0c1a26] text-slate-700 hover:text-white rounded-xl text-xs font-extrabold font-heading transition-all border border-slate-200 cursor-pointer shadow-2xs hover:shadow-xs active:scale-95 group"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
                          <span>View Profile</span>
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
                            {formatStatusLabel(enq.status)}
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

