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
  ShieldAlert,
} from 'lucide-react';
import { DashboardStats } from '../../types';
import { getDashboardStatsApi } from '../../services/api';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDashboardStatsApi()
      .then(setStats)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

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
      case 'Appointment Requested':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Appointment Confirmed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Converted':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'Closed':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-brand-teal" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm flex items-start gap-3">
        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <span>Failed to load operational statistics: {error}</span>
      </div>
    );
  }

  const kpis = [
    {
      title: 'Total Enquiries',
      value: stats.totalEnquiries,
      sub: 'All recorded property enquiries',
      icon: <FileSpreadsheet className="w-5 h-5 text-brand-teal" />,
      bg: 'bg-white',
    },
    {
      title: 'New Enquiries',
      value: stats.newEnquiries,
      sub: 'Awaiting first contact',
      icon: <TrendingUp className="w-5 h-5 text-blue-600" />,
      bg: 'bg-white',
    },
    {
      title: 'Follow-ups Required',
      value: stats.awaitingFollowUp,
      sub: 'Ongoing client discussions',
      icon: <Clock className="w-5 h-5 text-amber-600" />,
      bg: 'bg-white',
    },
    {
      title: 'Upcoming Consultations',
      value: stats.upcomingAppointments,
      sub: 'Requested or confirmed meetings',
      icon: <Calendar className="w-5 h-5 text-brand-teal" />,
      bg: 'bg-white',
    },
    {
      title: 'Confirmed Appointments',
      value: stats.confirmedAppointments,
      sub: 'Locked in calendar',
      icon: <CheckCircle className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-white',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-navy tracking-tight">
            Advisory Operations Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-brand-slate mt-0.5">
            Real-time pipeline metrics and client consultation activity
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/enquiries"
            className="px-4 py-2 bg-brand-teal hover:bg-brand-teal-hover text-white text-xs font-semibold rounded-corporate shadow-xs transition-colors flex items-center gap-1.5"
          >
            <span>Manage Enquiries</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((k, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl p-5 border border-brand-border shadow-subtle flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-brand-slate">{k.title}</span>
              <div className="p-2 rounded-lg bg-brand-teal-light">{k.icon}</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-brand-navy">
                {k.value}
              </div>
              <p className="text-[11px] text-brand-slate mt-1">{k.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Layout: Recent Enquiries & Audit Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent Enquiries Table (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-brand-border shadow-subtle overflow-hidden">
          <div className="p-5 border-b border-brand-border flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-brand-navy">Latest Enquiries</h3>
              <p className="text-[11px] text-brand-slate">Recently received property loan applications</p>
            </div>
            <Link
              to="/admin/enquiries"
              className="text-xs font-semibold text-brand-teal hover:text-brand-teal-hover flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-brand-ivory/60 border-b border-brand-border text-brand-slate font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Reference</th>
                  <th className="py-3 px-4">Applicant</th>
                  <th className="py-3 px-4">Loan Type</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {stats.recentEnquiries.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-brand-slate">
                      No enquiries registered yet.
                    </td>
                  </tr>
                ) : (
                  stats.recentEnquiries.map((enq) => (
                    <tr key={enq.id} className="hover:bg-brand-ivory/30 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-brand-navy">
                        {enq.referenceNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-brand-navy block">
                          {enq.fullName}
                        </span>
                        <span className="text-[11px] text-brand-slate">{enq.mobileNumber}</span>
                      </td>
                      <td className="py-3.5 px-4 text-brand-navy font-medium">
                        {enq.loanType}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-brand-navy">
                        {formatAmountINR(enq.loanAmount)}
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
                        <Link
                          to={`/admin/enquiries?search=${encodeURIComponent(enq.referenceNumber)}`}
                          className="px-2.5 py-1 text-[11px] font-semibold text-brand-teal hover:bg-brand-teal-light rounded transition-colors"
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Activity History Feed (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-brand-border shadow-subtle p-5">
          <div className="pb-4 border-b border-brand-border mb-4">
            <h3 className="text-sm font-bold text-brand-navy">Consultant Activity Trail</h3>
            <p className="text-[11px] text-brand-slate">Recent status updates &amp; actions</p>
          </div>

          <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1 text-xs">
            {stats.recentActivities.length === 0 ? (
              <p className="text-center text-brand-slate py-6">No recent administrative activities.</p>
            ) : (
              stats.recentActivities.map((act) => (
                <div key={act.id} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                  <div className="w-7 h-7 rounded-full bg-brand-teal-light text-brand-teal flex items-center justify-center flex-shrink-0 mt-0.5">
                    <UserCheck className="w-3.5 h-3.5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-semibold text-brand-navy">{act.changedBy}</span>
                      <span className="text-brand-slate">updated</span>
                      <span className="font-mono font-semibold text-brand-teal">
                        {act.enquiry.referenceNumber}
                      </span>
                    </div>
                    <div className="text-[11px] text-brand-slate">
                      Status: <span className="font-semibold text-brand-navy">{act.toStatus}</span>
                    </div>
                    {act.note && (
                      <p className="text-[11px] text-brand-slate italic bg-brand-ivory p-2 rounded border border-brand-border/60">
                        "{act.note}"
                      </p>
                    )}
                    <div className="text-[10px] text-gray-400">
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
  );
};
