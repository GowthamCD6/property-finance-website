import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileSpreadsheet,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  Loader2,
  UserCheck,
  ShieldCheck,
  Plus,
  Phone,
  Video,
  Building2,
  CalendarCheck2,
  Activity,
  ArrowUpRight,
  Landmark,
  Briefcase,
  DollarSign,
  ChevronRight,
  Users,
  UserPlus,
} from 'lucide-react';
import { DashboardStats } from '../../types';
import { getDashboardStatsApi, getAppointmentsApi } from '../../services/api';
import { RegisterBorrowerModal } from '../../components/admin/RegisterBorrowerModal';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [upcomingList, setUpcomingList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const fetchDashboardData = () => {
    Promise.all([
      getDashboardStatsApi(),
      getAppointmentsApi({ status: 'ALL' }),
    ])
      .then(([statsData, apptData]) => {
        setStats(statsData);
        const today = new Date().toISOString().split('T')[0];
        const upcoming = (apptData || [])
          .filter((a: any) => a.date >= today && a.status !== 'Cancelled')
          .slice(0, 5);
        setUpcomingList(upcoming);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDashboardData();

    const handleNewReg = () => fetchDashboardData();
    window.addEventListener('enquiry-registered', handleNewReg);
    return () => window.removeEventListener('enquiry-registered', handleNewReg);
  }, []);

  const formatAmountINR = (val: number) => {
    if (!val) return '₹0';
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)} Lakhs`;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return 'Good Morning';
    if (hr < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-blue-50 text-blue-700 border-blue-200/80 ring-1 ring-blue-500/10';
      case 'Contacted':
        return 'bg-amber-50 text-amber-700 border-amber-200/80 ring-1 ring-amber-500/10';
      case 'Appointment Requested':
        return 'bg-purple-50 text-purple-700 border-purple-200/80 ring-1 ring-purple-500/10';
      case 'Appointment Confirmed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/80 ring-1 ring-emerald-500/10';
      case 'Converted':
        return 'bg-teal-50 text-teal-800 border-teal-200/80 ring-1 ring-teal-500/10';
      case 'Closed':
        return 'bg-slate-100 text-slate-700 border-slate-200/80 ring-1 ring-slate-500/10';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200/80 ring-1 ring-slate-500/10';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-28 space-y-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/10 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-brand-teal" />
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-sm font-bold text-brand-navy font-heading">Loading Operations Console...</h3>
          <p className="text-xs text-brand-slate font-sans mt-0.5">Retrieving real-time loan pipeline & appointment schedules</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-6 bg-red-50/80 border border-red-200 rounded-2xl text-red-800 text-sm flex items-start gap-3.5 shadow-sm">
        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-600" />
        <div>
          <span className="font-bold font-heading text-base block">Failed to load operations dashboard</span>
          <span className="text-xs text-red-700 font-sans mt-0.5 block">{error}</span>
        </div>
      </div>
    );
  }

  const kpis = [
    {
      title: 'Total Enquiries',
      value: stats.totalEnquiries,
      sub: 'All registered borrower dossiers',
      icon: <FileSpreadsheet className="w-5 h-5 text-teal-600" />,
      bgIcon: 'bg-teal-50 text-teal-600 border-teal-100',
      borderAccent: 'border-l-4 border-l-teal-600',
      badge: 'All Time',
    },
    {
      title: 'New Applications',
      value: stats.newEnquiries,
      sub: 'Action required & unassigned',
      icon: <TrendingUp className="w-5 h-5 text-blue-600" />,
      bgIcon: 'bg-blue-50 text-blue-600 border-blue-100',
      borderAccent: 'border-l-4 border-l-blue-600',
      badge: stats.newEnquiries > 0 ? `${stats.newEnquiries} Pending` : 'Up to date',
      badgeClass: stats.newEnquiries > 0 ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600',
    },
    {
      title: 'Follow-ups Required',
      value: stats.awaitingFollowUp,
      sub: 'Active borrower negotiations',
      icon: <Clock className="w-5 h-5 text-amber-600" />,
      bgIcon: 'bg-amber-50 text-amber-600 border-amber-100',
      borderAccent: 'border-l-4 border-l-amber-600',
      badge: 'In Progress',
      badgeClass: 'bg-amber-100 text-amber-800',
    },
    {
      title: 'Upcoming Sessions',
      value: stats.upcomingAppointments,
      sub: 'Allotted or requested',
      icon: <Calendar className="w-5 h-5 text-purple-600" />,
      bgIcon: 'bg-purple-50 text-purple-600 border-purple-100',
      borderAccent: 'border-l-4 border-l-purple-600',
      badge: 'This Week',
      badgeClass: 'bg-purple-100 text-purple-800',
    },
    {
      title: 'Confirmed Slots',
      value: stats.confirmedAppointments,
      sub: 'Ready for advisory calls',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
      bgIcon: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      borderAccent: 'border-l-4 border-l-emerald-600',
      badge: 'Verified',
      badgeClass: 'bg-emerald-100 text-emerald-800',
    },
  ];

  // Enquiries awaiting appointment allotment
  const unallottedEnquiries = stats.recentEnquiries.filter(
    (e) => e.status === 'New' || e.status === 'Appointment Requested' || e.status === 'Contacted'
  );

  return (
    <div className="space-y-7">
      {/* Executive Welcome Hero Banner */}
      <div className="rounded-2xl bg-[#0b1924] p-6 sm:p-7 text-white shadow-md border border-slate-800 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-teal-500/20 text-teal-300 text-xs font-semibold font-mono">
            <span>Prime Associates</span>
            <span>&bull;</span>
            <span>{new Date().toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-heading text-white">
            Operations &amp; Sanctions Dashboard
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
            Manage customer loan applications, confirm advisory consultations, and monitor sanction throughput across partner banks.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setIsRegisterModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-bold font-heading shadow-sm transition-all cursor-pointer active:scale-[0.98]"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Register Borrower</span>
          </button>

          <Link
            to="/admin/appointments"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 text-xs sm:text-sm font-semibold font-heading transition-colors"
          >
            <Plus className="w-4 h-4 text-teal-300" />
            <span>Allot Appointment</span>
          </Link>

          <Link
            to="/admin/enquiries"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 text-xs sm:text-sm font-semibold font-heading transition-colors"
          >
            <Users className="w-4 h-4 text-teal-300" />
            <span>View All Pipeline</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {kpis.map((k, idx) => (
          <div
            key={idx}
            className={`group bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200 ${k.borderAccent} hover:-translate-y-0.5`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-xl border ${k.bgIcon} transition-transform group-hover:scale-110 duration-200`}>
                {k.icon}
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md font-mono ${k.badgeClass || 'bg-slate-100 text-slate-600'}`}>
                {k.badge}
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#0c1a26] font-mono tracking-tight">
                {k.value}
              </div>
              <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider font-heading">
                {k.title}
              </div>
              <p className="text-[10px] text-slate-400 font-sans line-clamp-1">{k.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* SECTION: ENQUIRIES AWAITING APPOINTMENT ALLOTMENT */}
      {unallottedEnquiries.length > 0 && (
        <div className="rounded-2xl bg-gradient-to-r from-amber-500/10 via-teal-500/5 to-white p-5 sm:p-6 border border-amber-300/70 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
                <CalendarCheck2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-extrabold text-[#0c1a26] font-heading">
                    Action Required: Enquiries Awaiting Slot Allotment
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold font-mono">
                    {unallottedEnquiries.length} New
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-sans">
                  Prospective borrowers awaiting administrative slot allotment & verification call
                </p>
              </div>
            </div>

            <Link
              to="/admin/appointments"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-teal hover:text-teal-700 font-heading bg-white px-3.5 py-1.5 rounded-xl border border-teal-200/80 shadow-xs hover:border-teal-300 transition-colors self-start sm:self-auto"
            >
              <span>Open Schedule Hub</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
            {unallottedEnquiries.slice(0, 3).map((enq) => (
              <div
                key={enq.id}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-teal-400/80 transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1.5">
                    <span className="font-mono text-teal-700 font-extrabold tracking-tight bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200/60">
                      {enq.referenceNumber}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(enq.status)}`}>
                      {enq.status}
                    </span>
                  </div>

                  <h4 className="font-bold text-[#0c1a26] text-sm font-heading line-clamp-1">
                    {enq.fullName}
                  </h4>

                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <span className="truncate">{enq.loanType}</span>
                    <span>&bull;</span>
                    <span className="font-bold text-teal-700 font-mono flex-shrink-0">
                      {formatAmountINR(enq.loanAmount)}
                    </span>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-mono font-medium">
                    {enq.mobileNumber}
                  </span>
                  <Link
                    to={`/admin/enquiries?search=${encodeURIComponent(enq.referenceNumber)}`}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white text-[11px] font-bold font-heading rounded-lg shadow-xs transition-all active:scale-[0.98]"
                  >
                    <span>Allot Slot</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Two Column Layout: Latest Enquiries & Activity Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        {/* Left Column: Recent Enquiries Table (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-[#0c1a26] font-heading">
                  Recent Loan Enquiries &amp; Active Dossiers
                </h3>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <p className="text-xs text-slate-500 font-sans mt-0.5">
                Real-time loan applications logged through borrower website & eligibility portal
              </p>
            </div>
            <Link
              to="/admin/enquiries"
              className="inline-flex items-center gap-1 text-xs font-bold text-brand-teal hover:text-teal-700 font-heading bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs hover:border-teal-300 transition-colors"
            >
              <span>View All ({stats.totalEnquiries})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[10px] font-heading">
                  <th className="py-3 px-4">Applicant &amp; Contact</th>
                  <th className="py-3 px-4">Ref Number</th>
                  <th className="py-3 px-4">Facility Type</th>
                  <th className="py-3 px-4">Sanction Requested</th>
                  <th className="py-3 px-4">Pipeline Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats.recentEnquiries.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400 font-sans">
                      <FileSpreadsheet className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                      No customer loan applications registered yet.
                    </td>
                  </tr>
                ) : (
                  stats.recentEnquiries.map((enq) => {
                    const initials = enq.fullName
                      .split(' ')
                      .map((n: string) => n[0])
                      .slice(0, 2)
                      .join('')
                      .toUpperCase() || 'AP';

                    return (
                      <tr key={enq.id} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-600 to-teal-400 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-xs">
                              {initials}
                            </div>
                            <div>
                              <span className="font-bold text-[#0c1a26] block font-heading text-xs group-hover:text-teal-700 transition-colors">
                                {enq.fullName}
                              </span>
                              <span className="text-[11px] text-slate-500 font-mono">{enq.mobileNumber}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-bold font-heading text-slate-700 text-xs">
                          <span className="bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg border border-slate-200/90 tracking-wide">
                            {enq.referenceNumber}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-block px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 text-[11px] font-bold font-heading border border-teal-200/80">
                            {enq.loanType}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-extrabold text-[#0c1a26] font-heading text-xs tabular-nums">
                          {formatAmountINR(enq.loanAmount)}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border font-heading ${getStatusBadge(
                              enq.status
                            )}`}
                          >
                            {enq.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <Link
                            to={`/admin/enquiries?search=${encodeURIComponent(enq.referenceNumber)}`}
                            className="inline-flex items-center gap-1 px-3 py-1 text-[11px] font-bold font-heading text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors border border-teal-200/60"
                          >
                            <span>Dossier</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Upcoming Consultations & Activity Feed (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Upcoming Scheduled Consultations Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-100">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#0c1a26] font-heading">
                    Upcoming Consultations
                  </h3>
                  <p className="text-[11px] text-slate-500 font-sans">Active slots scheduled</p>
                </div>
              </div>
              <Link
                to="/admin/appointments"
                className="text-xs font-bold text-brand-teal hover:underline font-heading"
              >
                Calendar
              </Link>
            </div>

            <div className="space-y-3">
              {upcomingList.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs font-sans">
                  <CalendarCheck2 className="w-7 h-7 mx-auto text-slate-300 mb-1.5" />
                  No upcoming appointments scheduled for this week.
                </div>
              ) : (
                upcomingList.map((a: any) => (
                  <div
                    key={a.id}
                    className="p-3 bg-slate-50/70 hover:bg-slate-100/80 rounded-xl border border-slate-200/80 transition-all space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#0c1a26] font-heading truncate max-w-[150px]">
                        {a.enquiry?.fullName || 'Applicant'}
                      </span>
                      <span className="font-mono text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200/60">
                        {a.date}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-sans">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-teal-600" />
                        <span>{a.timeSlot}</span>
                      </span>
                      <span className="capitalize font-semibold text-slate-700 text-[10px] bg-white px-2 py-0.5 rounded border border-slate-200">
                        {a.meetingMode?.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Activity Audit Trail */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 mb-4">
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-100">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-[#0c1a26] font-heading">Recent Case Updates</h3>
                <p className="text-[11px] text-slate-500 font-sans">Borrower dossier status and notes log</p>
              </div>
            </div>

            <div className="space-y-3.5 max-h-[340px] overflow-y-auto pr-1 text-xs">
              {stats.recentActivities.length === 0 ? (
                <p className="text-center text-slate-400 py-6 font-sans">No recent administrative activities.</p>
              ) : (
                stats.recentActivities.map((act) => (
                  <div key={act.id} className="flex items-start gap-2.5 pb-3 border-b border-slate-100 last:border-0">
                    <div className="w-7 h-7 rounded-full bg-teal-50 border border-teal-200/70 text-teal-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                      <UserCheck className="w-3.5 h-3.5" />
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap text-xs">
                        <span className="font-bold text-[#0c1a26] font-heading">{act.changedBy}</span>
                        <span className="text-slate-400">updated</span>
                        <span className="font-mono font-bold text-teal-700 text-[11px] bg-teal-50 px-1.5 py-0.2 rounded">
                          {act.enquiry.referenceNumber}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-600 font-sans">
                        Status &rarr; <span className="font-bold text-[#0c1a26]">{act.toStatus}</span>
                      </div>
                      {act.note && (
                        <p className="text-[10px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200/60 font-sans italic">
                          "{act.note}"
                        </p>
                      )}
                      <div className="text-[10px] text-slate-400 font-mono">
                        {new Date(act.createdAt).toLocaleString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <RegisterBorrowerModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSuccess={() => {
          fetchDashboardData();
        }}
      />
    </div>
  );
};

export default AdminDashboardPage;
