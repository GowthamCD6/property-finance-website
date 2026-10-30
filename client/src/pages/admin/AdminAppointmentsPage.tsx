import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Phone,
  Video,
  Building2,
  User,
  X,
  RefreshCw,
  Plus,
  Search,
  MessageSquare,
  ExternalLink,
  ChevronRight,
  Filter,
  FileText,
  CalendarCheck2,
  ShieldCheck,
  Check,
  Share2,
  ArrowRight,
  CheckCheck,
  UserPlus,
} from 'lucide-react';
import { Appointment, Enquiry } from '../../types';
import { RegisterBorrowerModal } from '../../components/admin/RegisterBorrowerModal';
import {
  getAppointmentsApi,
  updateAppointmentApi,
  createAppointmentApi,
  getEnquiriesApi,
  getPublicAvailability,
} from '../../services/api';

export const AdminAppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [modeFilter, setModeFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // Allot / Create Appointment Modal State
  const [isAllotModalOpen, setIsAllotModalOpen] = useState(false);
  const [eligibleEnquiries, setEligibleEnquiries] = useState<Enquiry[]>([]);
  const [enquiriesLoading, setEnquiriesLoading] = useState(false);
  const [selectedEnquiryId, setSelectedEnquiryId] = useState('');
  const [allotDate, setAllotDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [allotSlot, setAllotSlot] = useState('11:30 AM - 12:30 PM');
  const [allotMode, setAllotMode] = useState<'phone' | 'video' | 'in_person'>('phone');
  const [allotNotes, setAllotNotes] = useState('');
  const [allotLoading, setAllotLoading] = useState(false);
  const [allotError, setAllotError] = useState<string | null>(null);

  // Action Modals State
  const [activeModal, setActiveModal] = useState<{
    type: 'reschedule' | 'cancel' | 'viewEnquiry';
    appointment: any;
  } | null>(null);

  // Reschedule form
  const [newDate, setNewDate] = useState('');
  const [newSlot, setNewSlot] = useState('');
  const [rescheduleReason, setRescheduleReason] = useState('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  // Cancel form
  const [cancellationReason, setCancellationReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const STANDARD_SLOTS = [
    '10:00 AM - 11:00 AM',
    '11:30 AM - 12:30 PM',
    '02:00 PM - 03:00 PM',
    '03:30 PM - 04:30 PM',
    '05:00 PM - 06:00 PM',
  ];

  const fetchAppointments = () => {
    setLoading(true);
    getAppointmentsApi({
      status: statusFilter !== 'ALL' ? statusFilter : undefined,
      date: dateFilter || undefined,
    })
      .then(setAppointments)
      .catch((err) => console.error('Error fetching appointments:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAppointments();
  }, [statusFilter, dateFilter]);

  useEffect(() => {
    const handleNewAppt = () => fetchAppointments();
    window.addEventListener('enquiry-registered', handleNewAppt);
    return () => window.removeEventListener('enquiry-registered', handleNewAppt);
  }, []);

  // Load enquiries eligible for appointment allotment when allotment modal opens
  const openAllotModal = () => {
    setIsAllotModalOpen(true);
    setEnquiriesLoading(true);
    setAllotError(null);
    getEnquiriesApi({ limit: 100 })
      .then((data) => {
        const list = data.enquiries || [];
        setEligibleEnquiries(list);
        if (list.length > 0) {
          setSelectedEnquiryId(list[0].id);
        }
      })
      .catch((err) => setAllotError(err.message || 'Failed to load applicant enquiries'))
      .finally(() => setEnquiriesLoading(false));
  };

  // Handle Allot Submission
  const handleAllotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnquiryId || !allotDate || !allotSlot) {
      setAllotError('Please select an applicant, date and time slot.');
      return;
    }

    setAllotLoading(true);
    setAllotError(null);

    try {
      await createAppointmentApi({
        enquiryId: selectedEnquiryId,
        date: allotDate,
        timeSlot: allotSlot,
        meetingMode: allotMode,
        adminNotes: allotNotes.trim() || undefined,
      });

      setIsAllotModalOpen(false);
      setAllotNotes('');
      fetchAppointments();
    } catch (err: any) {
      setAllotError(err.message || 'Failed to allot consultation slot');
    } finally {
      setAllotLoading(false);
    }
  };

  // Fetch slots for rescheduling
  useEffect(() => {
    if (activeModal?.type === 'reschedule' && newDate) {
      setSlotsLoading(true);
      getPublicAvailability(newDate)
        .then((res) => {
          if (res.isBlocked) {
            setAvailableSlots([]);
          } else {
            const slots = res.availableSlots && res.availableSlots.length > 0 ? res.availableSlots : STANDARD_SLOTS;
            setAvailableSlots(slots);
            if (!slots.includes(newSlot)) {
              setNewSlot(slots[0] || '');
            }
          }
        })
        .catch(() => setAvailableSlots(STANDARD_SLOTS))
        .finally(() => setSlotsLoading(false));
    }
  }, [activeModal, newDate]);

  // Handle Quick Confirm
  const handleConfirm = async (id: string) => {
    try {
      await updateAppointmentApi(id, { status: 'Confirmed' });
      fetchAppointments();
    } catch (err: any) {
      alert(err.message || 'Failed to confirm appointment');
    }
  };

  // Handle Mark Completed
  const handleMarkCompleted = async (id: string) => {
    try {
      await updateAppointmentApi(id, { status: 'Completed' });
      fetchAppointments();
    } catch (err: any) {
      alert(err.message || 'Failed to mark appointment completed');
    }
  };

  // Handle Reschedule
  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModal || !newDate || !newSlot) return;

    setActionLoading(true);
    try {
      await updateAppointmentApi(activeModal.appointment.id, {
        status: 'Rescheduled',
        date: newDate,
        timeSlot: newSlot,
        rescheduleReason: rescheduleReason.trim() || undefined,
      });
      setActiveModal(null);
      fetchAppointments();
    } catch (err: any) {
      alert(err.message || 'Failed to reschedule appointment');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Cancel
  const handleCancelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModal) return;

    setActionLoading(true);
    try {
      await updateAppointmentApi(activeModal.appointment.id, {
        status: 'Cancelled',
        cancellationReason: cancellationReason.trim() || undefined,
      });
      setActiveModal(null);
      fetchAppointments();
    } catch (err: any) {
      alert(err.message || 'Failed to cancel appointment');
    } finally {
      setActionLoading(false);
    }
  };

  const formatAmountINR = (val?: number) => {
    if (!val) return '₹ 0';
    if (val >= 10000000) return `₹ ${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹ ${(val / 100000).toFixed(1)} Lakhs`;
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Requested':
        return 'bg-amber-50 text-amber-800 border-amber-300 ring-1 ring-amber-400/20';
      case 'Confirmed':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-1 ring-emerald-400/20';
      case 'Rescheduled':
        return 'bg-blue-50 text-blue-800 border-blue-300 ring-1 ring-blue-400/20';
      case 'Cancelled':
        return 'bg-red-50 text-red-700 border-red-200 ring-1 ring-red-400/20';
      case 'Completed':
        return 'bg-slate-100 text-slate-700 border-slate-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getModeBadge = (mode: string) => {
    switch (mode) {
      case 'video':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-800 border border-sky-200 shadow-2xs">
            <Video className="w-3.5 h-3.5 text-sky-600" />
            <span>Google Meet / Video</span>
          </span>
        );
      case 'in_person':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-800 border border-purple-200 shadow-2xs">
            <Building2 className="w-3.5 h-3.5 text-purple-600" />
            <span>Tirupur Desk Visit</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
            <Phone className="w-3.5 h-3.5 text-emerald-600" />
            <span>Direct Phone Call</span>
          </span>
        );
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  // Filtered appointments
  const filteredAppointments = appointments.filter((appt) => {
    if (modeFilter !== 'ALL' && appt.meetingMode !== modeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const name = appt.enquiry?.fullName?.toLowerCase() || '';
      const ref = appt.enquiry?.referenceNumber?.toLowerCase() || '';
      const phone = appt.enquiry?.mobileNumber || '';
      const loan = appt.enquiry?.loanType?.toLowerCase() || '';
      return name.includes(q) || ref.includes(q) || phone.includes(q) || loan.includes(q);
    }
    return true;
  });

  // Calculate statistics
  const totalCount = appointments.length;
  const confirmedCount = appointments.filter((a) => a.status === 'Confirmed').length;
  const requestedCount = appointments.filter((a) => a.status === 'Requested').length;
  const todayCount = appointments.filter((a) => a.date === todayStr && a.status !== 'Cancelled').length;
  const completedCount = appointments.filter((a) => a.status === 'Completed').length;

  return (
    <div className="space-y-6">
      {/* Top Header & Direct Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0c1a26] tracking-tight font-heading">
            Consultation Scheduling Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-sans">
            Coordinate applicant meetings, allocate advisory slots, and manage banking review calls
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={fetchAppointments}
            className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Refresh List"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-teal-600' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() => setIsRegisterModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-[#0c1a26] rounded-xl text-xs sm:text-sm font-bold font-heading shadow-xs hover:border-teal-300 transition-all cursor-pointer active:scale-[0.98]"
          >
            <UserPlus className="w-4 h-4 text-teal-600" />
            <span>+ Register Borrower</span>
          </button>

          <button
            type="button"
            onClick={openAllotModal}
            className="group px-4 py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-xl text-xs sm:text-sm font-bold font-heading shadow-md shadow-teal-500/20 transition-all flex items-center gap-2 cursor-pointer active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 transition-transform group-hover:rotate-90 duration-200" />
            <span>Allot Consultation Slot</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Counter Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-slate-400">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block font-heading">
            Total Bookings
          </span>
          <div className="text-2xl font-extrabold text-[#0c1a26] mt-1 font-mono">{totalCount}</div>
          <span className="text-[10px] text-slate-400 font-sans">All scheduled records</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-emerald-500">
          <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block font-heading">
            Confirmed Slots
          </span>
          <div className="text-2xl font-extrabold text-emerald-700 mt-1 font-mono">{confirmedCount}</div>
          <span className="text-[10px] text-emerald-600 font-sans">Ready for discussion</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-amber-500">
          <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block font-heading">
            Awaiting Allotment
          </span>
          <div className="text-2xl font-extrabold text-amber-700 mt-1 font-mono">{requestedCount}</div>
          <span className="text-[10px] text-amber-600 font-sans">Requires admin time</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-blue-500">
          <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block font-heading">
            Today's Schedule
          </span>
          <div className="text-2xl font-extrabold text-blue-700 mt-1 font-mono">{todayCount}</div>
          <span className="text-[10px] text-blue-600 font-sans">{todayStr}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-teal-600 col-span-2 sm:col-span-1">
          <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider block font-heading">
            Completed
          </span>
          <div className="text-2xl font-extrabold text-teal-800 mt-1 font-mono">{completedCount}</div>
          <span className="text-[10px] text-teal-600 font-sans">Conducted sessions</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3.5">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search applicant name, phone number, reference ID, or loan type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-[#0c1a26] placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Mode Selector & Date Filter */}
          <div className="flex items-center gap-2">
            <select
              value={modeFilter}
              onChange={(e) => setModeFilter(e.target.value)}
              className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-[#0c1a26] focus:bg-white"
            >
              <option value="ALL">All Meeting Modes</option>
              <option value="phone">Direct Phone</option>
              <option value="video">Google Meet / Video</option>
              <option value="in_person">Branch Visit</option>
            </select>

            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-[#0c1a26] focus:bg-white"
            />
            {dateFilter && (
              <button
                type="button"
                onClick={() => setDateFilter('')}
                className="text-xs text-teal-700 hover:underline font-semibold"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 text-xs">
          {['ALL', 'Confirmed', 'Requested', 'Rescheduled', 'Completed', 'Cancelled'].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-xl font-heading font-bold text-xs transition-all cursor-pointer ${
                statusFilter === s
                  ? 'bg-[#0c1a26] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s === 'ALL' ? 'All Records' : s === 'Requested' ? 'Requested (Awaiting Allotment)' : s}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments Master Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/90 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px] font-heading">
                <th className="py-3.5 px-4">Scheduled Slot</th>
                <th className="py-3.5 px-4">Applicant &amp; Reference</th>
                <th className="py-3.5 px-4">Loan Details</th>
                <th className="py-3.5 px-4">Meeting Mode</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Consultation Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-500">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-teal-600 mb-2" />
                    <span className="font-sans text-xs">Loading appointments &amp; schedules...</span>
                  </td>
                </tr>
              ) : filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-500 space-y-2">
                    <CalendarCheck2 className="w-9 h-9 text-slate-300 mx-auto" />
                    <div className="font-bold text-[#0c1a26] text-sm font-heading">No Consultations Found</div>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto font-sans">
                      No consultations match your selected filters. Click "Allot Consultation Slot" to allocate a slot.
                    </p>
                    <button
                      type="button"
                      onClick={openAllotModal}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold font-heading hover:bg-teal-700 transition-colors cursor-pointer mt-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Allot Slot Now</span>
                    </button>
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((appt) => {
                  const isToday = appt.date === todayStr;
                  const cleanPhone = (appt.enquiry?.mobileNumber || '').replace(/[^0-9]/g, '');
                  const initials = (appt.enquiry?.fullName || 'AP')
                    .split(' ')
                    .map((n: string) => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase();

                  return (
                    <tr
                      key={appt.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isToday ? 'bg-teal-50/30' : ''
                      }`}
                    >
                      {/* Slot Column */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#0c1a26] text-xs font-mono">{appt.date}</span>
                          {isToday && (
                            <span className="px-2 py-0.5 rounded-full bg-teal-600 text-white text-[9px] font-bold font-heading uppercase">
                              Today
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-600 flex items-center gap-1.5 mt-1 font-sans">
                          <Clock className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
                          <span className="font-semibold">{appt.timeSlot}</span>
                        </div>
                        {appt.adminNotes && (
                          <div
                            className="text-[10px] text-slate-500 max-w-[200px] truncate mt-1 italic"
                            title={appt.adminNotes}
                          >
                            Note: {appt.adminNotes}
                          </div>
                        )}
                      </td>

                      {/* Applicant Column */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-600 to-teal-400 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-xs">
                            {initials}
                          </div>
                          <div>
                            <div className="font-bold text-[#0c1a26] text-xs sm:text-sm font-heading">
                              {appt.enquiry?.fullName || 'N/A'}
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                              <span className="font-mono text-teal-700 font-bold">
                                {appt.enquiry?.referenceNumber}
                              </span>
                              <span>&bull;</span>
                              <span>{appt.enquiry?.cityState || 'Tamil Nadu'}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <a
                                href={`tel:${cleanPhone}`}
                                className="text-[11px] text-[#0c1a26] font-semibold hover:text-teal-700 inline-flex items-center gap-1 font-mono"
                              >
                                <Phone className="w-3 h-3 text-emerald-600" />
                                <span>{appt.enquiry?.mobileNumber}</span>
                              </a>
                              {cleanPhone && (
                                <a
                                  href={`https://wa.me/91${cleanPhone}?text=Hello%20${encodeURIComponent(
                                    appt.enquiry?.fullName || ''
                                  )},%20this%20is%20Prime%20Associates%20Loans%20regarding%20your%20consultation%20appointment.`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 hover:bg-emerald-100 font-semibold"
                                >
                                  WhatsApp
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Loan Column */}
                      <td className="py-4 px-4">
                        <span className="font-bold text-[#0c1a26] text-xs block">
                          {appt.enquiry?.loanType || 'Loan Facility'}
                        </span>
                        <span className="font-mono text-xs font-extrabold text-teal-700">
                          {formatAmountINR(appt.enquiry?.loanAmount)}
                        </span>
                      </td>

                      {/* Mode Column */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {getModeBadge(appt.meetingMode)}
                      </td>

                      {/* Status Column */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border font-heading ${getStatusBadge(
                            appt.status
                          )}`}
                        >
                          {appt.status}
                        </span>
                      </td>

                      {/* Controls Column */}
                      <td className="py-4 px-4 text-right space-x-1.5 whitespace-nowrap">
                        {/* Quick Confirm Button */}
                        {appt.status === 'Requested' && (
                          <button
                            type="button"
                            onClick={() => handleConfirm(appt.id)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-[11px] font-heading shadow-xs transition-colors cursor-pointer"
                          >
                            Confirm Slot
                          </button>
                        )}

                        {/* Mark Completed Button */}
                        {appt.status === 'Confirmed' && (
                          <button
                            type="button"
                            onClick={() => handleMarkCompleted(appt.id)}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-300 hover:border-emerald-300 rounded-xl font-bold text-[11px] font-heading transition-colors inline-flex items-center gap-1 cursor-pointer"
                            title="Mark Consultation Completed"
                          >
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Done</span>
                          </button>
                        )}

                        {/* Reschedule Button */}
                        {appt.status !== 'Cancelled' && appt.status !== 'Completed' && (
                          <button
                            type="button"
                            onClick={() => {
                              setActiveModal({ type: 'reschedule', appointment: appt });
                              setNewDate(appt.date);
                              setNewSlot(appt.timeSlot);
                              setRescheduleReason('');
                            }}
                            className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl font-bold text-[11px] font-heading transition-colors cursor-pointer"
                          >
                            Reschedule
                          </button>
                        )}

                        {/* Cancel Button */}
                        {appt.status !== 'Cancelled' && appt.status !== 'Completed' && (
                          <button
                            type="button"
                            onClick={() => {
                              setActiveModal({ type: 'cancel', appointment: appt });
                              setCancellationReason('');
                            }}
                            className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl font-bold text-[11px] font-heading transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}

                        {/* View Dossier */}
                        <button
                          type="button"
                          onClick={() => setActiveModal({ type: 'viewEnquiry', appointment: appt })}
                          className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-xl text-[11px] font-semibold transition-colors cursor-pointer"
                          title="View Full Loan Application"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────
          MODAL 1: ALLOT CONSULTATION APPOINTMENT
          ──────────────────────────────────────────────────────────── */}
      {isAllotModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0c1a26]/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 font-heading block">
                  Executive Allotment Center
                </span>
                <h3 className="font-extrabold text-lg sm:text-xl text-[#0c1a26] font-heading">
                  Allot Consultation Slot to Applicant
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAllotModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {allotError && (
              <div className="mt-4 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <span>{allotError}</span>
              </div>
            )}

            <form onSubmit={handleAllotSubmit} className="mt-5 space-y-4 text-xs sm:text-sm">
              {/* Select Enquiry */}
              <div>
                <label className="block text-xs font-bold text-[#0c1a26] mb-1.5 font-heading">
                  Select Loan Applicant Dossier
                </label>
                {enquiriesLoading ? (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
                    <span>Loading customer enquiries...</span>
                  </div>
                ) : (
                  <select
                    required
                    value={selectedEnquiryId}
                    onChange={(e) => setSelectedEnquiryId(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-[#0c1a26] focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  >
                    {eligibleEnquiries.map((enq) => (
                      <option key={enq.id} value={enq.id}>
                        {enq.fullName} &bull; {enq.loanType} ({formatAmountINR(enq.loanAmount)}) &bull; [{enq.status}] &bull; Ref: {enq.referenceNumber}
                      </option>
                    ))}
                  </select>
                )}
                <span className="text-[11px] text-slate-400 mt-1 block font-sans">
                  The appointment will be confirmed and linked directly to this applicant's case file.
                </span>
              </div>

              {/* Date and Time Slot Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#0c1a26] mb-1.5 font-heading">
                    Consultation Date
                  </label>
                  <input
                    type="date"
                    required
                    value={allotDate}
                    onChange={(e) => setAllotDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-[#0c1a26] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0c1a26] mb-1.5 font-heading">
                    Time Slot Allocation
                  </label>
                  <select
                    value={allotSlot}
                    onChange={(e) => setAllotSlot(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-[#0c1a26] focus:bg-white"
                  >
                    {STANDARD_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Consultation Meeting Mode */}
              <div>
                <label className="block text-xs font-bold text-[#0c1a26] mb-1.5 font-heading">
                  Meeting Mode
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setAllotMode('phone')}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      allotMode === 'phone'
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-400 ring-2 ring-emerald-400/30 font-bold'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Phone className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
                    <span className="text-[11px] block">Direct Phone</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAllotMode('video')}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      allotMode === 'video'
                        ? 'bg-sky-50 text-sky-900 border-sky-400 ring-2 ring-sky-400/30 font-bold'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Video className="w-4 h-4 mx-auto mb-1 text-sky-600" />
                    <span className="text-[11px] block">Google Meet</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAllotMode('in_person')}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      allotMode === 'in_person'
                        ? 'bg-purple-50 text-purple-900 border-purple-400 ring-2 ring-purple-400/30 font-bold'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Building2 className="w-4 h-4 mx-auto mb-1 text-purple-600" />
                    <span className="text-[11px] block">Tirupur Office</span>
                  </button>
                </div>
              </div>

              {/* Meeting Notes / Google Meet Link */}
              <div>
                <label className="block text-xs font-bold text-[#0c1a26] mb-1.5 font-heading">
                  Administrative Instructions / Google Meet Link
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Google Meet: meet.google.com/abc-defg-hij or Applicant to bring original Sale Agreement..."
                  value={allotNotes}
                  onChange={(e) => setAllotNotes(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-[#0c1a26] placeholder:text-slate-400 focus:bg-white resize-none"
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAllotModalOpen(false)}
                  className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={allotLoading || !selectedEnquiryId}
                  className="px-5 py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold font-heading shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-[0.98]"
                >
                  {allotLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Confirming Allotment...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm &amp; Allot Slot</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────
          MODAL 2: RESCHEDULE MODAL
          ──────────────────────────────────────────────────────────── */}
      {activeModal?.type === 'reschedule' && (
        <div className="fixed inset-0 z-50 bg-[#0c1a26]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-[#0c1a26] font-heading">
                Reschedule Consultation Slot
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRescheduleSubmit} className="mt-4 space-y-4 text-xs sm:text-sm">
              <p className="text-xs text-slate-500 font-sans">
                Rescheduling for{' '}
                <span className="font-bold text-[#0c1a26]">{activeModal.appointment.enquiry?.fullName}</span>{' '}
                ({activeModal.appointment.enquiry?.loanType})
              </p>

              <div>
                <label className="block text-xs font-bold text-[#0c1a26] mb-1.5 font-heading">New Date</label>
                <input
                  type="date"
                  required
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#0c1a26] font-semibold text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0c1a26] mb-1.5 font-heading">Available Slot</label>
                {slotsLoading ? (
                  <div className="p-2.5 border border-slate-200 rounded-xl text-xs text-slate-500 flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-600" />
                    <span>Verifying calendar availability...</span>
                  </div>
                ) : (
                  <select
                    value={newSlot}
                    onChange={(e) => setNewSlot(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#0c1a26] font-semibold text-xs sm:text-sm"
                  >
                    {availableSlots.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0c1a26] mb-1.5 font-heading">
                  Reason for Rescheduling
                </label>
                <input
                  type="text"
                  placeholder="e.g. Borrower requested alternate evening slot..."
                  value={rescheduleReason}
                  onChange={(e) => setRescheduleReason(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#0c1a26] text-xs sm:text-sm"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading || !newSlot}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold font-heading"
                >
                  {actionLoading ? 'Saving...' : 'Confirm Reschedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────
          MODAL 3: CANCEL MODAL
          ──────────────────────────────────────────────────────────── */}
      {activeModal?.type === 'cancel' && (
        <div className="fixed inset-0 z-50 bg-[#0c1a26]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-red-700 font-heading">
                Cancel Consultation
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCancelSubmit} className="mt-4 space-y-4 text-xs sm:text-sm">
              <p className="text-xs text-slate-600 font-sans leading-relaxed">
                Confirm cancellation of appointment for{' '}
                <span className="font-bold text-[#0c1a26]">{activeModal.appointment.enquiry?.fullName}</span>?
              </p>

              <div>
                <label className="block text-xs font-bold text-[#0c1a26] mb-1.5 font-heading">
                  Reason for Cancellation
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Borrower already obtained sanction / Unable to connect..."
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#0c1a26] text-xs sm:text-sm resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Keep Slot
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold font-heading"
                >
                  {actionLoading ? 'Cancelling...' : 'Confirm Cancellation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────
          MODAL 4: ENQUIRY DOSSIER VIEWER (Instant Details)
          ──────────────────────────────────────────────────────────── */}
      {activeModal?.type === 'viewEnquiry' && (
        <div className="fixed inset-0 z-50 bg-[#0c1a26]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-teal-700 uppercase font-heading block">
                  Loan Application Dossier
                </span>
                <h3 className="font-extrabold text-base text-[#0c1a26] font-heading">
                  {activeModal.appointment.enquiry?.fullName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px]">Reference Number</span>
                  <span className="font-mono font-bold text-[#0c1a26] text-xs">
                    {activeModal.appointment.enquiry?.referenceNumber}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Loan Facility</span>
                  <span className="font-bold text-[#0c1a26] text-xs">
                    {activeModal.appointment.enquiry?.loanType}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Requested Sanction</span>
                  <span className="font-bold text-teal-700 text-xs font-mono">
                    {formatAmountINR(activeModal.appointment.enquiry?.loanAmount)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Location</span>
                  <span className="font-bold text-[#0c1a26] text-xs">
                    {activeModal.appointment.enquiry?.cityState || 'Tamil Nadu'}
                  </span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="font-bold text-[#0c1a26] text-[11px] font-heading block">
                  Scheduled Consultation Information
                </span>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Date &amp; Time:</span>
                  <span className="font-bold text-[#0c1a26] font-mono">
                    {activeModal.appointment.date} ({activeModal.appointment.timeSlot})
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Channel Mode:</span>
                  <span className="font-semibold capitalize text-[#0c1a26]">
                    {activeModal.appointment.meetingMode?.replace('_', ' ')}
                  </span>
                </div>
                {activeModal.appointment.adminNotes && (
                  <div className="pt-2 border-t border-slate-200 text-slate-600 text-[11px]">
                    <span className="font-bold text-[#0c1a26]">Instructions: </span>
                    {activeModal.appointment.adminNotes}
                  </div>
                )}
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <a
                  href={`/admin/enquiries?search=${activeModal.appointment.enquiry?.referenceNumber}`}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold font-heading inline-flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <span>Open in Full Enquiries Hub</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Register Borrower Modal */}
      <RegisterBorrowerModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSuccess={() => {
          fetchAppointments();
        }}
      />
    </div>
  );
};

export default AdminAppointmentsPage;
