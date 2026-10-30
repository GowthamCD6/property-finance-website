import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileSpreadsheet,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  Loader2,
  UserCheck,
  ShieldCheck,
  Plus,
  Phone,
  Video,
  Building,
  Sparkles,
  CalendarCheck2,
} from 'lucide-react';
import { DashboardStats } from '../../types';
import { getDashboardStatsApi, getAppointmentsApi } from '../../services/api';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [upcomingList, setUpcomingList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      getDashboardStatsApi(),
      getAppointmentsApi({ status: 'ALL' }),
    ])
      .then(([statsData, apptData]) => {
        setStats(statsData);
        // Filter upcoming appointments for today or next 7 days
        const today = new Date().toISOString().split('T')[0];
        const upcoming = (apptData || [])
          .filter((a: any) => a.date >= today && a.status !== 'Cancelled')
          .slice(0, 5);
        setUpcomingList(upcoming);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const formatAmountINR = (val: number) => {
    if (val >= 10000000) return `₹ ${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹ ${(val / 100000).toFixed(1)} Lakhs`;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Contacted':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Appointment Requested':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'Appointment Confirmed':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Converted':
        return 'bg-teal-50 text-teal-800 border-teal-200';
      case 'Closed':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-brand-teal" />
        <span className="text-xs text-brand-slate font-medium">Loading operations dashboard...</span>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-red-800 text-sm flex items-start gap-3">
        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-600" />
        <div>
          <span className="font-bold block">Failed to load operations dashboard</span>
          <span className="text-xs">{error}</span>
        </div>
      </div>
    );
  }

  const kpis = [
    {
      title: 'Total Enquiries',
      value: stats.totalEnquiries,
      sub: 'All registered borrower applications',
      icon: <FileSpreadsheet className="w-5 h-5 text-brand-teal" />,
      highlight: false,
    },
    {
      title: 'New Applications',
      value: stats.newEnquiries,
      sub: 'Awaiting consultation allotment',
      icon: <TrendingUp className="w-5 h-5 text-blue-600" />,
      highlight: stats.newEnquiries > 0,
    },
    {
      title: 'Follow-ups Required',
      value: stats.awaitingFollowUp,
      sub: 'Active file negotiations',
      icon: <Clock className="w-5 h-5 text-amber-600" />,
      highlight: false,
    },
    {
      title: 'Upcoming Consultations',
      value: stats.upcomingAppointments,
      sub: 'Allotted or requested',
      icon: <Calendar className="w-5 h-5 text-brand-teal" />,
      highlight: false,
    },
    {
      title: 'Confirmed Slots',
      value: stats.confirmedAppointments,
      sub: 'Ready for advisory calls',
      icon: <CheckCircle className="w-5 h-5 text-emerald-600" />,
      highlight: false,
    },
  ];

  // Enquiries awaiting appointment allotment
  const unallottedEnquiries = stats.recentEnquiries.filter(
    (e) => e.status === 'New' || e.status === 'Appointment Requested' || e.status === 'Contacted'
  );

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-teal/10 text-brand-teal text-[11px] font-bold font-heading uppercase tracking-wider mb-1.5">
            <span className="w-2 h-2 rounded-full bg-brand-teal animate-pulse" />
            <span>Executive Advisory Desk &bull; Operations Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight font-heading">
            Advisory Operations Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-brand-slate font-sans">
            Real-time pipeline metrics, borrower dossiers, and consultation slot allotments across partner banks
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Link
            to="/admin/appointments"
            className="px-4 py-2.5 bg-brand-teal hover:bg-brand-teal-hover active:scale-[0.99] text-white text-xs font-bold font-heading rounded-corporate shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Allot Appointment</span>
          </Link>

          <Link
            to="/admin/enquiries"
            className="px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-brand-navy text-xs font-semibold rounded-corporate shadow-xs transition-colors flex items-center gap-1.5"
          >
            <span>All Enquiries</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {kpis.map((k, idx) => (
          <div
            key={idx}
            className={`rounded-2xl p-4 sm:p-5 border transition-all ${
              k.highlight
                ? 'bg-blue-50/50 border-blue-200 shadow-xs'
                : 'bg-white border-brand-border/80 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-heading">
                {k.title}
              </span>
              <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100">{k.icon}</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-brand-navy font-mono">
                {k.value}
              </div>
              <p className="text-[11px] text-brand-slate mt-1 font-sans">{k.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* SECTION: ENQUIRIES AWAITING APPOINTMENT ALLOTMENT */}
      {unallottedEnquiries.length > 0 && (
        <div className="bg-gradient-to-r from-teal-500/10 via-brand-teal-light to-white p-5 sm:p-6 rounded-2xl border border-teal-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-brand-teal text-white shadow-xs">
                <CalendarCheck2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-brand-navy font-heading">
                  Action Required: Enquiries Awaiting Appointment Allotment ({unallottedEnquiries.length})
                </h3>
                <p className="text-xs text-brand-slate font-sans">
                  Borrowers have submitted their loan requirements and are awaiting administrative slot confirmation.
                </p>
              </div>
            </div>

            <Link
              to="/admin/appointments"
              className="text-xs font-bold text-brand-teal hover:text-brand-teal-hover flex items-center gap-1 font-heading self-start sm:self-auto"
            >
              <span>Schedule in Appointments Hub</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            {unallottedEnquiries.slice(0, 3).map((enq) => (
              <div
                key={enq.id}
                className="bg-white p-4 rounded-xl border border-brand-border/80 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono text-brand-teal font-bold">{enq.referenceNumber}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getStatusBadge(enq.status)}`}>
                      {enq.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-brand-navy text-sm font-heading mt-1">
                    {enq.fullName}
                  </h4>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {enq.loanType} &bull; <span className="font-bold text-brand-teal font-mono">{formatAmountINR(enq.loanAmount)}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-sans">
                    {enq.mobileNumber}
                  </span>
                  <Link
                    to={`/admin/enquiries?search=${encodeURIComponent(enq.referenceNumber)}`}
                    className="px-2.5 py-1 bg-brand-teal text-white hover:bg-brand-teal-hover text-[11px] font-bold font-heading rounded-lg transition-colors flex items-center gap-1"
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Recent Enquiries Table (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-brand-border shadow-xs overflow-hidden">
          <div className="p-5 border-b border-brand-border flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-brand-navy font-heading">
                Recent Loan Enquiries &amp; Pipeline
              </h3>
              <p className="text-[11px] text-brand-slate font-sans">
                Real-time loan requests logged via website and client portals
              </p>
            </div>
            <Link
              to="/admin/enquiries"
              className="text-xs font-bold text-brand-teal hover:text-brand-teal-hover flex items-center gap-1 font-heading"
            >
              <span>View All Enquiries</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-brand-border text-slate-500 font-bold uppercase tracking-wider text-[10px] font-heading">
                  <th className="py-3 px-4">Reference</th>
                  <th className="py-3 px-4">Applicant</th>
                  <th className="py-3 px-4">Facility</th>
                  <th className="py-3 px-4">Sanction Requested</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Dossier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats.recentEnquiries.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-brand-slate font-sans">
                      No customer loan applications registered yet.
                    </td>
                  </tr>
                ) : (
                  stats.recentEnquiries.map((enq) => (
                    <tr key={enq.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-brand-navy text-xs">
                        {enq.referenceNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-brand-navy block font-heading">
                          {enq.fullName}
                        </span>
                        <span className="text-[11px] text-brand-slate font-sans">{enq.mobileNumber}</span>
                      </td>
                      <td className="py-3.5 px-4 text-brand-navy font-medium">
                        {enq.loanType}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-brand-teal font-mono">
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
                          className="px-2.5 py-1 text-[11px] font-bold font-heading text-brand-teal hover:bg-brand-teal-light rounded-lg transition-colors"
                        >
                          Review &rarr;
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Upcoming Consultations & Activity Feed (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Upcoming Scheduled Consultations Card */}
          <div className="bg-white rounded-2xl border border-brand-border shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-brand-border">
              <div>
                <h3 className="text-sm font-extrabold text-brand-navy font-heading">
                  Upcoming Consultations
                </h3>
                <p className="text-[11px] text-brand-slate font-sans">Allotted consultation schedule</p>
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
                <p className="text-center text-slate-400 py-4 text-xs font-sans">
                  No upcoming appointments scheduled for this week.
                </p>
              ) : (
                upcomingList.map((a: any) => (
                  <div
                    key={a.id}
                    className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/80 transition-colors space-y-1"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-brand-navy font-heading truncate max-w-[150px]">
                        {a.enquiry?.fullName || 'Applicant'}
                      </span>
                      <span className="font-mono text-[11px] font-bold text-brand-teal">
                        {a.date}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-sans">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-brand-teal" />
                        <span>{a.timeSlot}</span>
                      </span>
                      <span className="capitalize font-semibold text-brand-navy text-[10px]">
                        {a.meetingMode?.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Activity Audit Trail */}
          <div className="bg-white rounded-2xl border border-brand-border shadow-xs p-5">
            <div className="pb-3 border-b border-brand-border mb-4">
              <h3 className="text-sm font-extrabold text-brand-navy font-heading">Consultant Action Audit</h3>
              <p className="text-[11px] text-brand-slate font-sans">Operational history logs</p>
            </div>

            <div className="space-y-3.5 max-h-[320px] overflow-y-auto pr-1 text-xs">
              {stats.recentActivities.length === 0 ? (
                <p className="text-center text-brand-slate py-6 font-sans">No recent administrative activities.</p>
              ) : (
                stats.recentActivities.map((act) => (
                  <div key={act.id} className="flex items-start gap-2.5 pb-3 border-b border-slate-100 last:border-0">
                    <div className="w-6 h-6 rounded-full bg-brand-teal-light text-brand-teal flex items-center justify-center flex-shrink-0 mt-0.5">
                      <UserCheck className="w-3 h-3" />
                    </div>
                    <div className="space-y-0.5 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap text-xs">
                        <span className="font-bold text-brand-navy font-heading">{act.changedBy}</span>
                        <span className="text-slate-400">updated</span>
                        <span className="font-mono font-bold text-brand-teal text-[11px]">
                          {act.enquiry.referenceNumber}
                        </span>
                      </div>
                      <div className="text-[11px] text-brand-slate font-sans">
                        Status &rarr; <span className="font-bold text-brand-navy">{act.toStatus}</span>
                      </div>
                      {act.note && (
                        <p className="text-[10px] text-slate-600 bg-slate-50 p-1.5 rounded border border-slate-200/60 font-sans italic">
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
    </div>
  );
};

export default AdminDashboardPage;
