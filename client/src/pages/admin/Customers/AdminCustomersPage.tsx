import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { UserAvatar } from '../../../components/common/UserAvatar';
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

// Globally Recognized Official WhatsApp SVG Icon
const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

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

  // Handle Escape key to close customer dossier modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedCustomer) {
        setSelectedCustomer(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCustomer]);

  // Lock background body scroll when modal is active
  useEffect(() => {
    if (selectedCustomer) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedCustomer]);

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
      <div className="bg-white p-2.5 sm:p-3 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Real-time Search Box */}
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by customer name, email, phone, or location..."
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
          <div className="px-3.5 py-2 bg-slate-50 border border-slate-200/90 rounded-xl text-xs font-heading font-bold text-slate-700 flex items-center gap-2 shadow-2xs">
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 text-teal-600 animate-spin" />
            ) : (
              <Users className="w-3.5 h-3.5 text-teal-600" />
            )}
            <span>{totalCount} {totalCount === 1 ? 'Customer' : 'Customers'}</span>
          </div>
        </div>
      </div>

      {/* Customer Directory Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/90 border-b border-slate-200/90 text-slate-600 font-bold uppercase tracking-wider text-[11px] font-heading">
                <th className="py-3.5 px-4 min-w-[220px]">Customer &amp; Google Account</th>
                <th className="py-3.5 px-3 min-w-[150px]">Contact Phone</th>
                <th className="py-3.5 px-3 min-w-[120px]">Location</th>
                <th className="py-3.5 px-3 min-w-[110px]">Applications</th>
                <th className="py-3.5 px-3 min-w-[105px]">Registered On</th>
                <th className="py-3.5 px-3 min-w-[115px]">Last Active</th>
                <th className="py-3.5 px-4 text-right min-w-[110px]">Actions</th>
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
                          <UserAvatar
                            src={c.picture}
                            name={c.name}
                            size={40}
                            showGoogleBadge={true}
                          />

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
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono font-bold text-slate-800 text-xs tracking-tight">
                              {c.phone}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <a
                                href={`https://wa.me/91${c.phone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(
                                  c.name
                                )},%20this%20is%20Prime%20Associates%20Loans.`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#25D366] hover:text-[#20BD5A] border border-emerald-200/70 transition-all shadow-2xs hover:shadow-xs active:scale-95"
                                title={`Chat with ${c.name} on WhatsApp`}
                              >
                                <WhatsAppIcon className="w-3.5 h-3.5" />
                              </a>
                              <a
                                href={`tel:${c.phone}`}
                                className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 hover:text-teal-800 border border-teal-200/70 transition-all shadow-2xs hover:shadow-xs active:scale-95"
                                title={`Direct call to ${c.phone}`}
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
      {selectedCustomer && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 top-0 left-0 right-0 bottom-0 z-[100] bg-[#0c1a26]/75 backdrop-blur-md flex items-center justify-center p-2.5 sm:p-4 md:p-6 animate-in fade-in duration-200"
          style={{ zIndex: 100 }}
          onClick={() => setSelectedCustomer(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 w-full max-w-2xl max-h-[92vh] sm:max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-4 py-4 sm:px-6 sm:py-5 bg-gradient-to-r from-[#0c1a26] via-[#112338] to-[#0c1a26] text-white flex items-center justify-between gap-3 flex-shrink-0 border-b border-slate-800/80">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative shrink-0">
                  <UserAvatar
                    src={selectedCustomer.picture}
                    name={selectedCustomer.name}
                    size={46}
                    showGoogleBadge={true}
                    className="border-2 border-teal-400/90 shadow-md"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm sm:text-base font-extrabold font-heading text-white truncate max-w-[200px] sm:max-w-xs">
                      {selectedCustomer.name}
                    </h3>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold font-heading bg-teal-400/20 text-teal-300 border border-teal-400/30 shrink-0">
                      <Sparkles className="w-2.5 h-2.5 text-teal-300" />
                      <span>Verified Client</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-sans mt-0.5 truncate max-w-[260px] sm:max-w-md">
                    {selectedCustomer.email} &bull; Member since{' '}
                    <span className="text-slate-200 font-medium">
                      {new Date(selectedCustomer.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="w-8 h-8 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/15 flex items-center justify-center transition-all cursor-pointer shrink-0"
                title="Close Dossier (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 admin-sidebar-scroll">
              {/* Client Quick Contact Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Mobile Contact Tile */}
                <div className="p-4 bg-slate-50/90 rounded-2xl border border-slate-200/90 flex flex-col justify-between gap-3 shadow-2xs hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 font-heading tracking-wider flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>Direct Mobile</span>
                    </span>
                    {selectedCustomer.phone && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 font-heading">
                        Available
                      </span>
                    )}
                  </div>

                  <div className="font-mono font-bold text-sm sm:text-base text-[#0c1a26] tracking-tight">
                    {selectedCustomer.phone || (
                      <span className="text-slate-400 italic font-sans font-normal text-xs">
                        No phone number recorded
                      </span>
                    )}
                  </div>

                  {selectedCustomer.phone && (
                    <div className="flex items-center gap-2 pt-1">
                      <a
                        href={`https://wa.me/91${selectedCustomer.phone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(
                          selectedCustomer.name
                        )},%20this%20is%20Prime%20Associates%20Loans.`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-xl text-xs font-bold font-heading shadow-xs hover:shadow transition-all active:scale-95"
                        title="Chat on WhatsApp"
                      >
                        <WhatsAppIcon className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                      <a
                        href={`tel:${selectedCustomer.phone}`}
                        className="inline-flex items-center justify-center w-9 h-9 bg-white hover:bg-teal-50 text-teal-700 hover:text-teal-800 border border-slate-200 rounded-xl transition-all shadow-2xs hover:shadow-xs active:scale-95"
                        title="Direct Call"
                      >
                        <PhoneCall className="w-4 h-4" />
                      </a>
                    </div>
                  )}
                </div>

                {/* Google Account Tile */}
                <div className="p-4 bg-slate-50/90 rounded-2xl border border-slate-200/90 flex flex-col justify-between gap-3 shadow-2xs hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 font-heading tracking-wider flex items-center gap-1.5">
                      <Mail className="w-3 h-3 text-slate-400" />
                      <span>Google Account</span>
                    </span>
                    <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200/60 font-heading">
                      Verified
                    </span>
                  </div>

                  <div
                    className="font-sans font-semibold text-xs sm:text-sm text-[#0c1a26] break-all select-all leading-snug"
                    title={selectedCustomer.email}
                  >
                    {selectedCustomer.email}
                  </div>

                  <div className="pt-1">
                    <a
                      href={`mailto:${selectedCustomer.email}`}
                      className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-[#0c1a26] hover:bg-teal-700 text-white rounded-xl text-xs font-bold font-heading shadow-xs hover:shadow transition-all active:scale-95"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Send Corporate Email</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Loan Applications Submitted Header */}
              <div className="space-y-3 pt-2">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-1 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-teal-50 flex items-center justify-center text-teal-700 border border-teal-200/60">
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                    </div>
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#0c1a26] font-heading">
                      Submitted Loan Inquiries ({selectedCustomer.enquiries.length})
                    </h4>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-black font-heading shadow-2xs">
                    <span>Aggregate:</span>
                    <span className="tabular-nums">{formatAmountINR(selectedCustomer.totalLoanAmount)}</span>
                  </span>
                </div>

                {/* Applications List */}
                <div className="space-y-3">
                  {selectedCustomer.enquiries.map((enq) => {
                    const doorstepAddress = enq.additionalNotes?.includes('📍 Doorstep Meeting Address:')
                      ? enq.additionalNotes.split('📍 Doorstep Meeting Address:')[1]?.split('\n')[0]?.trim()
                      : (enq.meetingMode === 'in_person' ? (enq.propertyLocation || enq.cityState) : null);

                    return (
                      <div
                        key={enq.id}
                        className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 shadow-2xs transition-all space-y-3.5"
                      >
                        {/* Top Facility & Financial Row */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-extrabold text-[#0c1a26] font-heading text-sm sm:text-base">
                                {enq.loanType}
                              </span>
                              <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs">
                                {enq.referenceNumber}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-500 font-sans mt-0.5 block">
                              Submitted on{' '}
                              <span className="font-semibold text-slate-700">
                                {new Date(enq.createdAt).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </span>
                            </span>
                          </div>

                          <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border font-heading ${getStatusBadge(
                                enq.status
                              )}`}
                            >
                              {formatStatusLabel(enq.status)}
                            </span>
                            <span className="text-sm sm:text-base font-black text-emerald-700 font-heading tabular-nums">
                              {formatAmountINR(enq.loanAmount)}
                            </span>
                          </div>
                        </div>

                        {/* Details Mini Grid - Responsive 2 to 4 cols */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                          <div className="p-2.5 bg-slate-50/80 rounded-xl border border-slate-200/70">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block font-heading tracking-wider">
                              Property Type
                            </span>
                            <span className="font-bold text-[#0c1a26] capitalize text-xs mt-0.5 block truncate">
                              {enq.propertyType}
                            </span>
                          </div>
                          <div className="p-2.5 bg-slate-50/80 rounded-xl border border-slate-200/70">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block font-heading tracking-wider">
                              Location
                            </span>
                            <span
                              className="font-bold text-[#0c1a26] text-xs mt-0.5 block truncate"
                              title={enq.propertyLocation || enq.cityState}
                            >
                              {enq.propertyLocation || enq.cityState}
                            </span>
                          </div>
                          <div className="p-2.5 bg-slate-50/80 rounded-xl border border-slate-200/70">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block font-heading tracking-wider">
                              Employment
                            </span>
                            <span className="font-bold text-[#0c1a26] capitalize text-xs mt-0.5 block truncate">
                              {enq.employmentType?.replace('_', ' ')}
                            </span>
                          </div>
                          <div className="p-2.5 bg-slate-50/80 rounded-xl border border-slate-200/70">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block font-heading tracking-wider">
                              Ownership
                            </span>
                            <span className="font-bold text-[#0c1a26] capitalize text-xs mt-0.5 block truncate">
                              {enq.propertyOwnershipStatus?.replace('_', ' ')}
                            </span>
                          </div>
                        </div>

                        {/* Doorstep Visit Address Card (If applicable) */}
                        {doorstepAddress && enq.meetingMode === 'in_person' && (
                          <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
                            <div className="space-y-1 min-w-0 flex-1">
                              <span className="text-[10px] font-bold text-purple-900 uppercase font-heading tracking-wider flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                                <span>Doorstep Meeting Address</span>
                              </span>
                              <p className="text-purple-950 font-medium text-xs leading-relaxed break-words">
                                {doorstepAddress}
                              </p>
                            </div>
                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                doorstepAddress
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white hover:bg-purple-100 text-purple-800 border border-purple-200 rounded-xl text-xs font-bold font-heading shrink-0 shadow-2xs transition-colors self-start sm:self-center"
                            >
                              <span>View on Maps</span>
                              <ExternalLink className="w-3 h-3 text-purple-600" />
                            </a>
                          </div>
                        )}

                        {/* Consultation Slot & Mode Card */}
                        <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
                          <div className="flex items-center gap-2.5 text-slate-700 min-w-0">
                            <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200/70 flex items-center justify-center shrink-0">
                              <Calendar className="w-4 h-4 text-teal-700" />
                            </div>
                            <div className="min-w-0">
                              <span className="text-[10px] uppercase font-bold text-slate-400 block font-heading tracking-wider">
                                Consultation Slot
                              </span>
                              <span className="font-bold text-xs text-[#0c1a26] truncate block">
                                {(() => {
                                  if (!enq.preferredDate) return 'Date Not Set';
                                  try {
                                    const parts = enq.preferredDate.split('-');
                                    if (parts.length === 3) {
                                      const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
                                      if (!isNaN(d.getTime())) {
                                        return d.toLocaleDateString('en-IN', {
                                          day: 'numeric',
                                          month: 'short',
                                          year: 'numeric',
                                        });
                                      }
                                    }
                                  } catch {}
                                  return enq.preferredDate;
                                })()}{' '}
                                &bull; {enq.preferredTimeSlot || 'Pending'}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 self-start sm:self-center shrink-0">
                            {getModeBadge(enq.meetingMode)}
                            <Link
                              to={`/admin/appointments?allotEnquiryId=${enq.id}`}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold font-heading transition-all shadow-2xs hover:shadow-xs active:scale-95"
                            >
                              <CalendarCheck2 className="w-3.5 h-3.5" />
                              <span>Allot Slot</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-4 bg-slate-50/95 border-t border-slate-200/90 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
              <span className="flex items-center gap-2 font-bold text-slate-700 font-heading">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Google Authenticated Borrower Profile</span>
              </span>
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="w-full sm:w-auto px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200/90 rounded-xl font-bold font-heading text-xs transition-all shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer text-center"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default AdminCustomersPage;

