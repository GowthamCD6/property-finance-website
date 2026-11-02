import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Phone,
  PhoneCall,
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
  ChevronLeft,
  Filter,
  FileText,
  CalendarCheck2,
  ShieldCheck,
  Check,
  Share2,
  ArrowRight,
  CheckCheck,
  UserPlus,
  Sparkles,
  Inbox,
  Send,
  MapPin,
} from 'lucide-react';
import { Appointment, Enquiry } from '../../../types';
import {
  getAppointmentsApi,
  getPendingAllotmentsApi,
  updateAppointmentApi,
  createAppointmentApi,
  getEnquiriesApi,
  getEnquiryByIdApi,
  getPublicAvailability,
} from '../../../services/api';

export const AdminAppointmentsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  // Main Navigation Tab: 'pending' (Awaiting Allotment) vs 'scheduled' (Confirmed & Active)
  const [activeTab, setActiveTab] = useState<'pending' | 'scheduled'>('pending');

  // Appointments & Pending Queue State
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [pendingQueue, setPendingQueue] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingLoading, setPendingLoading] = useState(true);

  // Filters for Scheduled Consultations
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [modeFilter, setModeFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Filters for Pending Queue
  const [pendingSearch, setPendingSearch] = useState('');
  const [pendingModeFilter, setPendingModeFilter] = useState('ALL');

  // Pagination for Pending Queue
  const [pendingPage, setPendingPage] = useState<number>(1);
  const [pendingLimit, setPendingLimit] = useState<number>(10);

  // Pagination for Scheduled Appointments
  const [scheduledPage, setScheduledPage] = useState<number>(1);
  const [scheduledLimit, setScheduledLimit] = useState<number>(10);

  // Register Borrower Modal
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // Allot / Create Appointment Modal State
  const [isAllotModalOpen, setIsAllotModalOpen] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
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

  // Allotment Success Notification Modal State
  const [confirmedAllotment, setConfirmedAllotment] = useState<{
    enquiry: Enquiry;
    date: string;
    slot: string;
    mode: string;
    notes?: string;
  } | null>(null);

  // Action Modals State (Reschedule, Cancel, View Dossier)
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

  const fetchPendingQueue = () => {
    setPendingLoading(true);
    getPendingAllotmentsApi()
      .then((data) => {
        setPendingQueue(data || []);
      })
      .catch((err) => console.error('Error fetching pending queue:', err))
      .finally(() => setPendingLoading(false));
  };

  useEffect(() => {
    fetchAppointments();
  }, [statusFilter, dateFilter]);

  useEffect(() => {
    fetchPendingQueue();
  }, []);

  useEffect(() => {
    const handleNewData = () => {
      fetchAppointments();
      fetchPendingQueue();
    };
    window.addEventListener('enquiry-registered', handleNewData);
    return () => window.removeEventListener('enquiry-registered', handleNewData);
  }, []);

  // Handle direct allot route from enquiries page
  useEffect(() => {
    const allotEnquiryId = searchParams.get('allotEnquiryId');
    if (allotEnquiryId) {
      getEnquiryByIdApi(allotEnquiryId)
        .then((enq) => {
          if (enq) {
            handleAllotForApplicant(enq);
          }
        })
        .catch((err) => console.error('Error auto-allotting enquiry:', err));
    }
  }, [searchParams]);

  // Open Allot Modal with a specific applicant pre-selected
  const handleAllotForApplicant = (enquiry: Enquiry) => {
    setSelectedEnquiry(enquiry);
    setSelectedEnquiryId(enquiry.id);
    if (enquiry.meetingMode) {
      setAllotMode(enquiry.meetingMode as 'phone' | 'video' | 'in_person');
    } else {
      setAllotMode('phone');
    }
    setAllotError(null);
    setAllotNotes('');
    setIsAllotModalOpen(true);
  };

  // Open generic Allot Modal (allows choosing any applicant from list)
  const openGenericAllotModal = () => {
    setSelectedEnquiry(null);
    setIsAllotModalOpen(true);
    setEnquiriesLoading(true);
    setAllotError(null);
    getEnquiriesApi({ limit: 100 })
      .then((data) => {
        const list = data.enquiries || [];
        setEligibleEnquiries(list);
        if (list.length > 0) {
          setSelectedEnquiryId(list[0].id);
          setSelectedEnquiry(list[0]);
          if (list[0].meetingMode) {
            setAllotMode(list[0].meetingMode as 'phone' | 'video' | 'in_person');
          }
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

      // Find the allotted enquiry object for the success modal
      const enq =
        selectedEnquiry ||
        eligibleEnquiries.find((x) => x.id === selectedEnquiryId) ||
        pendingQueue.find((x) => x.id === selectedEnquiryId);

      setIsAllotModalOpen(false);
      setAllotNotes('');
      fetchAppointments();
      fetchPendingQueue();

      if (enq) {
        setConfirmedAllotment({
          enquiry: enq,
          date: allotDate,
          slot: allotSlot,
          mode: allotMode,
          notes: allotNotes.trim() || undefined,
        });
      }
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
      fetchPendingQueue();
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
      fetchPendingQueue();
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
      fetchPendingQueue();
    } catch (err: any) {
      alert(err.message || 'Failed to cancel appointment');
    } finally {
      setActionLoading(false);
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

  // Filtered pending queue
  const filteredPendingQueue = pendingQueue.filter((enq) => {
    if (pendingModeFilter !== 'ALL' && enq.meetingMode !== pendingModeFilter) return false;
    if (pendingSearch.trim()) {
      const q = pendingSearch.toLowerCase();
      const name = enq.fullName?.toLowerCase() || '';
      const ref = enq.referenceNumber?.toLowerCase() || '';
      const phone = enq.mobileNumber || '';
      const loan = enq.loanType?.toLowerCase() || '';
      return name.includes(q) || ref.includes(q) || phone.includes(q) || loan.includes(q);
    }
    return true;
  });

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

  useEffect(() => {
    setPendingPage(1);
  }, [pendingSearch, pendingModeFilter]);

  useEffect(() => {
    setScheduledPage(1);
  }, [searchQuery, modeFilter, dateFilter, statusFilter]);

  const pendingTotalPages = Math.max(1, Math.ceil(filteredPendingQueue.length / pendingLimit));
  const displayedPendingQueue = filteredPendingQueue.slice(
    (pendingPage - 1) * pendingLimit,
    pendingPage * pendingLimit
  );

  const scheduledTotalPages = Math.max(1, Math.ceil(filteredAppointments.length / scheduledLimit));
  const displayedAppointments = filteredAppointments.slice(
    (scheduledPage - 1) * scheduledLimit,
    scheduledPage * scheduledLimit
  );

  // Calculate statistics
  const totalCount = appointments.length;
  const confirmedCount = appointments.filter((a) => a.status === 'Confirmed').length;
  const requestedCount = appointments.filter((a) => a.status === 'Requested').length;
  const pendingQueueCount = pendingQueue.length;
  const todayCount = appointments.filter((a) => a.date === todayStr && a.status !== 'Cancelled').length;
  const completedCount = appointments.filter((a) => a.status === 'Completed').length;

  return (
    <div className="space-y-5 font-sans">
      {/* Top Header & Direct Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0c1a26] tracking-tight font-heading">
            Consultation Scheduling Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-sans">
            Review applicant meeting preferences, allot advisor consultation slots, and coordinate banking reviews
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => {
              fetchAppointments();
              fetchPendingQueue();
            }}
            className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Refresh All Lists"
          >
            <RefreshCw className={`w-4 h-4 ${loading || pendingLoading ? 'animate-spin text-teal-600' : ''}`} />
            <span className="hidden sm:inline font-heading font-bold text-xs">Refresh</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Counter Strip - Modern Refined */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        <div
          onClick={() => setActiveTab('pending')}
          className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer ${
            activeTab === 'pending'
              ? 'bg-amber-50/60 border-amber-300 shadow-sm ring-2 ring-amber-400/20'
              : 'bg-white border-slate-200/90 shadow-2xs hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block font-heading">
              Awaiting Allotment
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-[#0c1a26] mt-1 font-heading">{pendingQueueCount}</div>
          <span className="text-[11px] text-amber-700 font-sans font-medium">Requires advisor slot</span>
        </div>

        <div
          onClick={() => setActiveTab('scheduled')}
          className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer ${
            activeTab === 'scheduled'
              ? 'bg-teal-50/60 border-teal-300 shadow-sm ring-2 ring-teal-500/20'
              : 'bg-white border-slate-200/90 shadow-2xs hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block font-heading">
              Total Scheduled
            </span>
            <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
              <CalendarCheck2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-[#0c1a26] mt-1 font-heading">{totalCount}</div>
          <span className="text-[11px] text-slate-400 font-sans">All booked sessions</span>
        </div>

        <div className="p-3.5 sm:p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block font-heading">
              Confirmed Slots
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-emerald-700 mt-1 font-heading">{confirmedCount}</div>
          <span className="text-[11px] text-emerald-600 font-sans">Ready for review</span>
        </div>

        <div className="p-3.5 sm:p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block font-heading">
              Today's Schedule
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <CalendarIcon className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-blue-700 mt-1 font-heading">{todayCount}</div>
          <span className="text-[11px] text-blue-600 font-sans">{todayStr}</span>
        </div>

        <div className="p-3.5 sm:p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block font-heading">
              Completed
            </span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-teal-700 mt-1 font-heading">{completedCount}</div>
          <span className="text-[11px] text-teal-600 font-sans">Finished reviews</span>
        </div>
      </div>

      {/* Primary Workflow Tabs - Corporate Styled */}
      <div className="flex items-center gap-2 border-b border-slate-200/90 pb-2">
        <button
          type="button"
          onClick={() => {
            setActiveTab('pending');
            setPendingPage(1);
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-heading font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'pending'
              ? 'bg-slate-900 text-white shadow-sm ring-2 ring-teal-500/30'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <Clock className="w-4 h-4 text-amber-400" />
          <span>Borrowers Awaiting Allotment</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-bold ${
              activeTab === 'pending' ? 'bg-amber-500 text-slate-950' : 'bg-amber-100 text-amber-800'
            }`}
          >
            {pendingQueueCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('scheduled');
            setScheduledPage(1);
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-heading font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === 'scheduled'
              ? 'bg-slate-900 text-white shadow-sm ring-2 ring-teal-500/30'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <CalendarCheck2 className="w-4 h-4 text-teal-400" />
          <span>Scheduled Consultations</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-bold ${
              activeTab === 'scheduled' ? 'bg-teal-500 text-slate-950' : 'bg-slate-100 text-slate-700'
            }`}
          >
            {totalCount}
          </span>
        </button>
      </div>

      {/* ════════════════════════════════════════════════════════════
          VIEW 1: BORROWERS AWAITING ALLOTMENT QUEUE - PROFESSIONAL TABLE
          ════════════════════════════════════════════════════════════ */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          {/* Single Row Toolbar for Pending Queue */}
          <div className="bg-white p-2.5 sm:p-3 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Real-time Search Box */}
            <div className="relative flex-1 min-w-[260px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search applicant name, phone, loan facility, or reference number..."
                value={pendingSearch}
                onChange={(e) => setPendingSearch(e.target.value)}
                className="w-full pl-10 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-[#0c1a26] placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
              />
              {pendingSearch && (
                <button
                  type="button"
                  onClick={() => setPendingSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
              <select
                value={pendingModeFilter}
                onChange={(e) => setPendingModeFilter(e.target.value)}
                className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-heading font-semibold text-[#0c1a26] focus:bg-white cursor-pointer"
              >
                <option value="ALL">All Requested Modes</option>
                <option value="phone">Direct Phone Call</option>
                <option value="video">Google Meet / Video</option>
                <option value="in_person">Branch Visit (Tirupur)</option>
              </select>

              <button
                type="button"
                onClick={() => {
                  fetchAppointments();
                  fetchPendingQueue();
                }}
                className="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-heading font-bold shadow-2xs hover:shadow-xs transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                title="Refresh queue"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${pendingLoading ? 'animate-spin text-teal-600' : 'text-slate-500'}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Awaiting Allotment Table */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/90 border-b border-slate-200/90 text-slate-600 font-bold uppercase tracking-wider text-[11px] font-heading">
                    <th className="py-3.5 px-4 min-w-[220px]">Applicant &amp; Dossier</th>
                    <th className="py-3.5 px-3 min-w-[140px]">Contact Phone</th>
                    <th className="py-3.5 px-3 min-w-[150px]">Facility Requested</th>
                    <th className="py-3.5 px-3 min-w-[130px]">Location</th>
                    <th className="py-3.5 px-3 min-w-[180px]">Requested Preference</th>
                    <th className="py-3.5 px-3 min-w-[110px]">Submitted</th>
                    <th className="py-3.5 px-4 text-right min-w-[160px]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {pendingLoading ? (
                    <>
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <tr key={idx} className="animate-pulse border-b border-slate-100">
                          <td className="py-3.5 px-4 min-w-[220px]">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-slate-200 shrink-0" />
                              <div className="space-y-1.5 flex-1">
                                <div className="h-4 bg-slate-200 rounded w-28" />
                                <div className="h-3 bg-slate-100 rounded w-36" />
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-3 min-w-[140px]">
                            <div className="h-3.5 bg-slate-200 rounded w-24" />
                          </td>
                          <td className="py-3.5 px-3 min-w-[150px]">
                            <div className="space-y-1">
                              <div className="h-3.5 bg-slate-200 rounded w-24" />
                              <div className="h-3 bg-slate-100 rounded w-16" />
                            </div>
                          </td>
                          <td className="py-3.5 px-3 min-w-[130px]">
                            <div className="h-3.5 bg-slate-200 rounded w-20" />
                          </td>
                          <td className="py-3.5 px-3 min-w-[180px]">
                            <div className="space-y-1">
                              <div className="h-5 bg-slate-200 rounded-md w-24" />
                              <div className="h-3 bg-slate-100 rounded w-28" />
                            </div>
                          </td>
                          <td className="py-3.5 px-3 min-w-[110px]">
                            <div className="h-3.5 bg-slate-200 rounded w-20" />
                          </td>
                          <td className="py-3.5 px-4 text-right min-w-[160px]">
                            <div className="h-8 bg-slate-200 rounded-xl w-32 ml-auto" />
                          </td>
                        </tr>
                      ))}
                    </>
                  ) : filteredPendingQueue.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-16 text-center space-y-3">
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                          <Inbox className="w-6 h-6" />
                        </div>
                        <h4 className="text-sm font-bold text-[#0c1a26] font-heading">
                          All Borrower Enquiries Have Been Allotted Slots
                        </h4>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto font-sans">
                          {pendingSearch || pendingModeFilter !== 'ALL'
                            ? 'No borrower enquiries match your search filters.'
                            : 'There are currently no new borrower enquiries awaiting consultation schedule allotment.'}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    displayedPendingQueue.map((enq) => {
                      const cleanPhone = (enq.mobileNumber || '').replace(/[^0-9]/g, '');
                      const initials = (enq.fullName || 'AP')
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase();

                      const requestedWindow = enq.preferredTimeSlot || enq.preferredContactMethod || 'Standard Window';
                      const isGoogleUser = !!(enq.customer?.email || enq.customerId);

                      return (
                        <tr key={enq.id} className="hover:bg-slate-50/70 transition-colors group">
                          {/* Applicant & Dossier */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              {enq.customer?.picture ? (
                                <img
                                  src={enq.customer.picture}
                                  alt={enq.fullName}
                                  className="w-9 h-9 rounded-xl object-cover border border-slate-200 shadow-2xs shrink-0"
                                />
                              ) : (
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-600 to-teal-500 text-white font-extrabold text-xs flex items-center justify-center shadow-xs font-heading shrink-0">
                                  {initials}
                                </div>
                              )}
                              <div className="space-y-0.5 min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-bold text-[#0c1a26] font-heading text-xs group-hover:text-teal-700 transition-colors truncate">
                                    {enq.fullName}
                                  </span>
                                  {isGoogleUser && (
                                    <span
                                      className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-sky-50 text-sky-700 border border-sky-200 shrink-0"
                                      title="Google Verified Account"
                                    >
                                      <Sparkles className="w-2.5 h-2.5 text-sky-500" />
                                      <span>Google</span>
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-1 text-[11px] text-slate-500 truncate">
                                  <span className="font-mono text-teal-700 font-bold text-[10px]">
                                    {enq.referenceNumber}
                                  </span>
                                  {enq.email && (
                                    <>
                                      <span>&bull;</span>
                                      <span className="truncate">{enq.email}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Contact Phone */}
                          <td className="py-3.5 px-3 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-800 font-heading text-xs">{enq.mobileNumber}</span>
                              <div className="flex items-center gap-1">
                                <a
                                  href={`https://wa.me/91${cleanPhone}?text=Hello%20${encodeURIComponent(
                                    enq.fullName
                                  )},%20this%20is%20Prime%20Associates%20Loans%20regarding%20your%20loan%20enquiry%20Ref:%20${enq.referenceNumber}.%20We%20are%20allotting%20your%20consultation%20slot.`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-1 rounded-md text-emerald-600 hover:bg-emerald-50 transition-colors"
                                  title="Chat on WhatsApp"
                                >
                                  <Phone className="w-3.5 h-3.5" />
                                </a>
                                <a
                                  href={`tel:${cleanPhone}`}
                                  className="p-1 rounded-md text-teal-600 hover:bg-teal-50 transition-colors"
                                  title="Direct Call"
                                >
                                  <PhoneCall className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            </div>
                          </td>

                          {/* Facility Requested */}
                          <td className="py-3.5 px-3 whitespace-nowrap">
                            <span className="font-bold text-[#0c1a26] text-xs block font-heading">
                              {enq.loanType}
                            </span>
                            <span className="text-xs font-extrabold text-teal-700 font-heading tabular-nums">
                              {formatAmountINR(enq.loanAmount)}
                            </span>
                          </td>

                          {/* Location */}
                          <td className="py-3.5 px-3">
                            <div className="flex items-center gap-1 text-xs text-slate-700">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate">{enq.cityState || 'Tamil Nadu'}</span>
                            </div>
                          </td>

                          {/* Requested Preference */}
                          <td className="py-3.5 px-3">
                            <div className="space-y-1">
                              <div>{getModeBadge(enq.meetingMode)}</div>
                              <div className="flex items-center gap-1 text-[11px] text-slate-600">
                                <Clock className="w-3 h-3 text-amber-600 shrink-0" />
                                <span className="truncate">{requestedWindow}</span>
                              </div>
                            </div>
                          </td>

                          {/* Submitted Date */}
                          <td className="py-3.5 px-3 whitespace-nowrap text-xs text-slate-600">
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>{new Date(enq.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1.5">
                            <button
                              type="button"
                              onClick={() => handleAllotForApplicant(enq)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-xl text-xs font-extrabold font-heading shadow-xs hover:shadow-sm active:scale-95 transition-all cursor-pointer"
                            >
                              <CalendarCheck2 className="w-3.5 h-3.5" />
                              <span>Allot Slot</span>
                            </button>

                            <a
                              href={`/admin/enquiries?search=${enq.referenceNumber}`}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition-colors"
                              title="View Full Loan Application Dossier"
                            >
                              <span>Dossier</span>
                              <ChevronRight className="w-3 h-3 text-slate-400" />
                            </a>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls for Pending Queue */}
            <div className="p-4 sm:px-6 border-t border-slate-200/90 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 font-sans">
              <div className="flex flex-wrap items-center gap-3">
                <span>
                  Showing{' '}
                  <span className="font-bold text-slate-900 font-heading tabular-nums">
                    {filteredPendingQueue.length === 0 ? 0 : (pendingPage - 1) * pendingLimit + 1}–{Math.min(pendingPage * pendingLimit, filteredPendingQueue.length)}
                  </span>{' '}
                  of <span className="font-bold text-slate-900 font-heading tabular-nums">{filteredPendingQueue.length}</span> borrowers
                </span>
                <span className="text-slate-300 hidden sm:inline">•</span>
                <span className="hidden sm:inline text-slate-500">
                  Page <span className="font-bold text-slate-900 font-heading">{pendingPage}</span> of{' '}
                  <span className="font-bold text-slate-900 font-heading">{pendingTotalPages}</span>
                </span>
                <span className="text-slate-300 hidden sm:inline">•</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 font-medium text-[11px]">Rows:</span>
                  <select
                    value={pendingLimit}
                    onChange={(e) => {
                      setPendingLimit(Number(e.target.value));
                      setPendingPage(1);
                    }}
                    className="px-2 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-xs font-heading font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 cursor-pointer shadow-2xs transition-all"
                  >
                    <option value={5}>5 / page</option>
                    <option value={10}>10 / page</option>
                    <option value={15}>15 / page</option>
                    <option value={25}>25 / page</option>
                    <option value={50}>50 / page</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  disabled={pendingPage <= 1 || pendingLoading}
                  onClick={() => setPendingPage((p) => Math.max(p - 1, 1))}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-heading font-bold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs hover:shadow-xs transition-all active:scale-95 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                {pendingTotalPages > 1 && (
                  <div className="hidden sm:flex items-center gap-1">
                    {Array.from({ length: pendingTotalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPendingPage(p)}
                        className={`w-7 h-7 rounded-lg text-xs font-heading font-bold transition-all cursor-pointer ${
                          p === pendingPage
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
                  disabled={pendingPage >= pendingTotalPages || pendingLoading}
                  onClick={() => setPendingPage((p) => Math.min(p + 1, pendingTotalPages))}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-heading font-bold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs hover:shadow-xs transition-all active:scale-95 cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════
          VIEW 2: SCHEDULED CONSULTATIONS MASTER TABLE
          ════════════════════════════════════════════════════════════ */}
      {activeTab === 'scheduled' && (
        <div className="space-y-4">
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
                  {s === 'ALL' ? 'All Records' : s}
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
                    <>
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <tr key={idx} className="animate-pulse border-b border-slate-100">
                          <td className="py-4 px-4 min-w-[160px]">
                            <div className="space-y-1.5">
                              <div className="h-4 bg-slate-200 rounded w-28" />
                              <div className="h-3 bg-slate-100 rounded w-20" />
                            </div>
                          </td>
                          <td className="py-4 px-4 min-w-[240px]">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0" />
                              <div className="space-y-1.5 flex-1">
                                <div className="h-4 bg-slate-200 rounded w-32" />
                                <div className="h-3 bg-slate-100 rounded w-24" />
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 min-w-[160px]">
                            <div className="space-y-1.5">
                              <div className="h-4 bg-slate-200 rounded w-24" />
                              <div className="h-3 bg-slate-100 rounded w-16" />
                            </div>
                          </td>
                          <td className="py-4 px-4 min-w-[140px]">
                            <div className="h-6 bg-slate-200 rounded-full w-24" />
                          </td>
                          <td className="py-4 px-4 min-w-[120px]">
                            <div className="h-6 bg-slate-200 rounded-full w-20" />
                          </td>
                          <td className="py-4 px-4 text-right min-w-[140px]">
                            <div className="h-8 bg-slate-200 rounded-xl w-24 ml-auto" />
                          </td>
                        </tr>
                      ))}
                    </>
                  ) : filteredAppointments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-16 text-center text-slate-500 space-y-2">
                        <CalendarCheck2 className="w-9 h-9 text-slate-300 mx-auto" />
                        <div className="font-bold text-[#0c1a26] text-sm font-heading">No Consultations Found</div>
                        <p className="text-xs text-slate-400 max-w-sm mx-auto font-sans">
                          No consultations match your selected filters. Click "Allot Consultation Slot" to allocate a slot.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    displayedAppointments.map((appt) => {
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
                              <span className="font-extrabold text-[#0c1a26] text-xs font-heading">
                                {formatDate(appt.date)}
                              </span>
                              {isToday && (
                                <span className="px-2 py-0.5 rounded-full bg-teal-600 text-white text-[9px] font-bold font-heading uppercase tracking-wide">
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
                              {appt.enquiry?.customer?.picture ? (
                                <img
                                  src={appt.enquiry.customer.picture}
                                  alt={appt.enquiry.fullName}
                                  className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-600 to-teal-400 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-xs">
                                  {initials}
                                </div>
                              )}
                              <div>
                                <div className="font-bold text-[#0c1a26] text-xs sm:text-sm font-heading flex items-center gap-1.5">
                                  <span>{appt.enquiry?.fullName || 'N/A'}</span>
                                  {appt.enquiry?.customer?.email && (
                                    <span title="Google Verified">
                                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                    </span>
                                  )}
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
                                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>{appt.enquiry?.mobileNumber}</span>
                                  </a>
                                  {cleanPhone && (
                                    <a
                                      href={`https://wa.me/91${cleanPhone}?text=Hello%20${encodeURIComponent(
                                        appt.enquiry?.fullName || ''
                                      )},%20this%20is%20Prime%20Associates%20Loans%20regarding%20your%20consultation%20appointment%20scheduled%20on%20${appt.date}%20at%20${appt.timeSlot}.`}
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
                          <td className="py-4 px-4 whitespace-nowrap">
                            <span className="font-bold text-[#0c1a26] text-xs block font-heading">
                              {appt.enquiry?.loanType || 'Loan Facility'}
                            </span>
                            <span className="text-xs font-extrabold text-teal-700 font-heading tabular-nums">
                              {formatAmountINR(appt.enquiry?.loanAmount)}
                            </span>
                          </td>

                          {/* Mode Column */}
                          <td className="py-4 px-4 whitespace-nowrap">{getModeBadge(appt.meetingMode)}</td>

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

            {/* Pagination Controls for Scheduled Consultations */}
            <div className="p-4 sm:px-6 border-t border-slate-200/90 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 font-sans">
              <div className="flex flex-wrap items-center gap-3">
                <span>
                  Showing{' '}
                  <span className="font-bold text-slate-900 font-heading tabular-nums">
                    {filteredAppointments.length === 0 ? 0 : (scheduledPage - 1) * scheduledLimit + 1}–{Math.min(scheduledPage * scheduledLimit, filteredAppointments.length)}
                  </span>{' '}
                  of <span className="font-bold text-slate-900 font-heading tabular-nums">{filteredAppointments.length}</span> scheduled sessions
                </span>
                <span className="text-slate-300 hidden sm:inline">•</span>
                <span className="hidden sm:inline text-slate-500">
                  Page <span className="font-bold text-slate-900 font-heading">{scheduledPage}</span> of{' '}
                  <span className="font-bold text-slate-900 font-heading">{scheduledTotalPages}</span>
                </span>
                <span className="text-slate-300 hidden sm:inline">•</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 font-medium text-[11px]">Rows:</span>
                  <select
                    value={scheduledLimit}
                    onChange={(e) => {
                      setScheduledLimit(Number(e.target.value));
                      setScheduledPage(1);
                    }}
                    className="px-2 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-xs font-heading font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 cursor-pointer shadow-2xs transition-all"
                  >
                    <option value={5}>5 / page</option>
                    <option value={10}>10 / page</option>
                    <option value={15}>15 / page</option>
                    <option value={25}>25 / page</option>
                    <option value={50}>50 / page</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  disabled={scheduledPage <= 1 || loading}
                  onClick={() => setScheduledPage((p) => Math.max(p - 1, 1))}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-heading font-bold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs hover:shadow-xs transition-all active:scale-95 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                {scheduledTotalPages > 1 && (
                  <div className="hidden sm:flex items-center gap-1">
                    {Array.from({ length: scheduledTotalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setScheduledPage(p)}
                        className={`w-7 h-7 rounded-lg text-xs font-heading font-bold transition-all cursor-pointer ${
                          p === scheduledPage
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
                  disabled={scheduledPage >= scheduledTotalPages || loading}
                  onClick={() => setScheduledPage((p) => Math.min(p + 1, scheduledTotalPages))}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-heading font-bold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs hover:shadow-xs transition-all active:scale-95 cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────
          MODAL 1: ALLOT CONSULTATION APPOINTMENT MODAL
          ──────────────────────────────────────────────────────────── */}
      {isAllotModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0c1a26]/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 font-heading block">
                  Advisor Consultation Allotment
                </span>
                <h3 className="font-extrabold text-lg sm:text-xl text-[#0c1a26] font-heading">
                  Allot Time Slot to Applicant
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
              {/* If specific applicant was preselected, show card; otherwise dropdown */}
              {selectedEnquiry ? (
                <div className="p-4 bg-teal-50/50 rounded-2xl border border-teal-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 font-heading">
                      Selected Applicant Dossier
                    </span>
                    <span className="font-mono text-teal-800 font-bold text-xs bg-white px-2 py-0.5 rounded border border-teal-200">
                      {selectedEnquiry.referenceNumber}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-teal-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                      {selectedEnquiry.fullName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-[#0c1a26] text-sm font-heading">
                        {selectedEnquiry.fullName}
                      </h4>
                      <p className="text-xs text-slate-600">
                        {selectedEnquiry.loanType} &bull; <strong className="text-teal-700 font-mono">{formatAmountINR(selectedEnquiry.loanAmount)}</strong> &bull; {selectedEnquiry.mobileNumber}
                      </p>
                    </div>
                  </div>

                  {/* Applicant's Preferred Window Notice */}
                  <div className="mt-2 pt-2 border-t border-teal-100 flex items-center gap-2 text-[11px] text-teal-900">
                    <Clock className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>
                      Borrower requested window:{' '}
                      <strong>{selectedEnquiry.preferredTimeSlot || selectedEnquiry.preferredContactMethod || 'Any Time'}</strong> via{' '}
                      <strong className="capitalize">{selectedEnquiry.meetingMode?.replace('_', ' ') || 'phone'}</strong>
                    </span>
                  </div>
                </div>
              ) : (
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
                      onChange={(e) => {
                        const id = e.target.value;
                        setSelectedEnquiryId(id);
                        const enq = eligibleEnquiries.find((x) => x.id === id);
                        if (enq) {
                          setSelectedEnquiry(enq);
                          if (enq.meetingMode) {
                            setAllotMode(enq.meetingMode as 'phone' | 'video' | 'in_person');
                          }
                        }
                      }}
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
                    The appointment will be confirmed and updated directly in the applicant's portal.
                  </span>
                </div>
              )}

              {/* Date and Time Slot Allocation */}
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
                  Consultation Mode
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAllotMode('phone');
                      if (allotNotes.includes('meet.google.com')) setAllotNotes('');
                    }}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      allotMode === 'phone'
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-400 ring-2 ring-emerald-400/30 font-bold'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Phone className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
                    <span className="text-[11px] block font-heading">Direct Phone</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAllotMode('video');
                      if (!allotNotes || !allotNotes.includes('meet.google.com')) {
                        const randomCode = `${Math.random().toString(36).substring(2, 5)}-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 5)}`;
                        setAllotNotes(`https://meet.google.com/vpf-${randomCode}`);
                      }
                    }}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      allotMode === 'video'
                        ? 'bg-sky-50 text-sky-900 border-sky-400 ring-2 ring-sky-400/30 font-bold'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Video className="w-4 h-4 mx-auto mb-1 text-sky-600" />
                    <span className="text-[11px] block font-heading">Google Meet</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAllotMode('in_person');
                      if (allotNotes.includes('meet.google.com')) setAllotNotes('');
                    }}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      allotMode === 'in_person'
                        ? 'bg-purple-50 text-purple-900 border-purple-400 ring-2 ring-purple-400/30 font-bold'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Building2 className="w-4 h-4 mx-auto mb-1 text-purple-600" />
                    <span className="text-[11px] block font-heading">Doorstep Visit</span>
                  </button>
                </div>
              </div>

              {/* Mode-Specific Allotment Details */}
              {allotMode === 'video' && (
                <div className="p-3.5 bg-sky-50/70 border border-sky-200/90 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-sky-950 font-heading">
                      Google Meet Conference Link (Sent to Customer) <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const randomCode = `${Math.random().toString(36).substring(2, 5)}-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 5)}`;
                        setAllotNotes(`https://meet.google.com/vpf-${randomCode}`);
                      }}
                      className="text-[11px] text-sky-700 hover:text-sky-900 font-bold font-heading hover:underline cursor-pointer"
                    >
                      + Generate Instant Link
                    </button>
                  </div>
                  <input
                    type="url"
                    required
                    placeholder="e.g. https://meet.google.com/abc-defg-hij"
                    value={allotNotes}
                    onChange={(e) => setAllotNotes(e.target.value)}
                    className="w-full p-2.5 bg-white border border-sky-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  />
                  <p className="text-[11px] text-slate-500 font-sans">
                    This link will be delivered directly to the borrower's portal with a 1-click "Join Google Meet" button.
                  </p>
                </div>
              )}

              {allotMode === 'in_person' && (
                <div className="p-3.5 bg-purple-50/70 border border-purple-200/90 rounded-2xl space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold text-purple-950 font-heading block">
                        Customer Doorstep Meeting Location
                      </span>
                      <p className="text-xs text-purple-900 font-sans mt-0.5 font-medium">
                        {selectedEnquiry?.additionalNotes?.includes('📍 Doorstep Meeting Address:')
                          ? selectedEnquiry.additionalNotes.split('📍 Doorstep Meeting Address:')[1]?.split('\n')[0]?.trim()
                          : selectedEnquiry?.propertyLocation || selectedEnquiry?.cityState || 'Customer Area / Residence'}
                      </p>
                    </div>
                    {selectedEnquiry && (
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          selectedEnquiry.additionalNotes?.includes('📍 Doorstep Meeting Address:')
                            ? selectedEnquiry.additionalNotes.split('📍 Doorstep Meeting Address:')[1]?.split('\n')[0]?.trim() || selectedEnquiry.propertyLocation
                            : selectedEnquiry.propertyLocation || selectedEnquiry.cityState
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-purple-100 text-purple-800 border border-purple-200 rounded-lg text-[10px] font-bold font-heading shrink-0 shadow-2xs"
                      >
                        <MapPin className="w-3 h-3 text-purple-600" />
                        <span>View on Maps</span>
                      </a>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1 font-heading">
                      Assigned Field Officer &amp; Doorstep Visit Instructions
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Senior Advisor Mr. Karthik R will visit your location with physical bank loan application dossiers..."
                      value={allotNotes}
                      onChange={(e) => setAllotNotes(e.target.value)}
                      className="w-full p-2.5 bg-white border border-purple-200 rounded-xl text-xs text-[#0c1a26] focus:bg-white resize-none"
                    />
                  </div>
                </div>
              )}

              {allotMode === 'phone' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-[#0c1a26] font-heading">
                      Direct Phone Consultation Notes
                    </label>
                    {selectedEnquiry?.mobileNumber && (
                      <span className="text-[11px] text-emerald-700 font-bold font-mono">
                        Calling: +91 {selectedEnquiry.mobileNumber}
                      </span>
                    )}
                  </div>
                  <textarea
                    rows={2}
                    placeholder="e.g. Credit Manager to review CIBIL score & call applicant on mobile with preliminary sanction figures..."
                    value={allotNotes}
                    onChange={(e) => setAllotNotes(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-[#0c1a26] placeholder:text-slate-400 focus:bg-white resize-none"
                  />
                </div>
              )}

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
          MODAL 1B: ALLOTMENT SUCCESS & WHATSAPP NOTIFICATION
          ──────────────────────────────────────────────────────────── */}
      {confirmedAllotment && (
        <div className="fixed inset-0 z-50 bg-[#0c1a26]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider font-heading block">
                Appointment Allotted Successfully
              </span>
              <h3 className="text-lg font-extrabold text-[#0c1a26] font-heading mt-1">
                {confirmedAllotment.enquiry.fullName}
              </h3>
              <p className="text-xs text-slate-500 font-sans mt-0.5">
                Ref: <strong className="font-mono text-teal-800">{confirmedAllotment.enquiry.referenceNumber}</strong>
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Date &amp; Slot:</span>
                <span className="font-bold text-[#0c1a26] font-mono">
                  {confirmedAllotment.date} &bull; {confirmedAllotment.slot}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Mode:</span>
                <span className="font-semibold text-[#0c1a26] capitalize">
                  {confirmedAllotment.mode.replace('_', ' ')}
                </span>
              </div>
              {confirmedAllotment.notes && (
                <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-600">
                  <strong>Notes:</strong> {confirmedAllotment.notes}
                </div>
              )}
            </div>

            <p className="text-xs text-slate-600 font-sans leading-relaxed">
              The applicant can now see this allotted slot in their portal. Send them a direct WhatsApp confirmation:
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmedAllotment(null)}
                className="px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>

              <a
                href={`https://wa.me/91${confirmedAllotment.enquiry.mobileNumber.replace(
                  /[^0-9]/g,
                  ''
                )}?text=Hello%20${encodeURIComponent(
                  confirmedAllotment.enquiry.fullName
                )},%20your%20loan%20consultation%20appointment%20with%20Prime%20Associates%20has%20been%20confirmed!%0A%0A%F0%9F%93%85%20Date:%20${
                  confirmedAllotment.date
                }%0A%E2%8F%B0%20Time:%20${encodeURIComponent(
                  confirmedAllotment.slot
                )}%0A%F0%9F%93%8D%20Mode:%20${encodeURIComponent(
                  confirmedAllotment.mode === 'in_person'
                    ? 'Doorstep Meeting (Advisor Visiting Your Area Address)'
                    : confirmedAllotment.mode === 'video'
                    ? 'Google Meet Video Call'
                    : 'Direct Phone Call'
                )}${
                  confirmedAllotment.notes
                    ? `%0A%F0%9F%93%9D%20Instructions:%20${encodeURIComponent(confirmedAllotment.notes)}`
                    : ''
                }%0A%0ALooking%20forward%20to%20discussing%20your%20${encodeURIComponent(
                  confirmedAllotment.enquiry.loanType
                )}%20application.`}
                target="_blank"
                rel="noreferrer"
                onClick={() => setConfirmedAllotment(null)}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold font-heading inline-flex items-center gap-2 shadow-sm shadow-emerald-600/30 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Send via WhatsApp</span>
              </a>
            </div>
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
    </div>
  );
};

export default AdminAppointmentsPage;
