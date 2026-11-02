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
  Search,
  RefreshCw,
  Filter,
  Sparkles,
  PieChart,
  BarChart3,
  Layers,
  Check,
  ExternalLink,
  Shield,
  FileText,
  Sliders,
} from 'lucide-react';
import { DashboardStats } from '../../../types';
import { getDashboardStatsApi, getAppointmentsApi } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';

export const AdminDashboardPage: React.FC = () => {
  const { admin } = useAuth();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [upcomingList, setUpcomingList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Filter & Search states for the Recent Enquiries table
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchDashboardData = (manual = false) => {
    if (manual) setIsRefreshing(true);
    else setLoading(true);

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
      .finally(() => {
        setLoading(false);
        setIsRefreshing(false);
      });
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
    if (hr < 12) return 'Good morning';
    if (hr < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
      case 'New':
      case 'Contacted':
      case 'Appointment Requested':
        return 'bg-amber-50 text-amber-700 border-amber-200/90 ring-1 ring-amber-500/10';
      case 'Slot Booked':
      case 'Appointment Confirmed':
        return 'bg-sky-50 text-sky-700 border-sky-200/90 ring-1 ring-sky-500/10';
      case 'Process Started':
      case 'In Review':
        return 'bg-teal-50 text-teal-800 border-teal-200/90 ring-1 ring-teal-500/10';
      case 'Closed':
      case 'Converted':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200/90 ring-1 ring-emerald-500/10';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200/90 ring-1 ring-slate-500/10';
    }
  };

  // Skeleton Loader for initial page render
  if (loading) {
    return (
      <div className="space-y-7 animate-pulse">
        {/* Hero Banner Skeleton */}
        <div className="rounded-2xl bg-[#0b1924] p-6 sm:p-7 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
          <div className="space-y-2.5">
            <div className="h-4 w-36 bg-slate-800 rounded-md" />
            <div className="h-7 w-64 bg-slate-700 rounded-xl" />
          </div>
          <div className="flex gap-2.5">
            <div className="h-9 w-32 bg-slate-800 border border-slate-700 rounded-xl" />
            <div className="h-9 w-36 bg-slate-800 border border-slate-700 rounded-xl" />
          </div>
        </div>

        {/* 5 KPI Cards Skeleton (Without left line color) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-slate-200" />
                <div className="w-14 h-4 rounded bg-slate-100" />
              </div>
              <div className="space-y-2">
                <div className="h-7 w-12 bg-slate-300 rounded-lg" />
                <div className="h-3.5 w-24 bg-slate-200 rounded" />
                <div className="h-2.5 w-32 bg-slate-100 rounded" />
              </div>
            </div>
          ))}
        </div>

        {/* Graph Bar Skeleton */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div className="h-5 w-56 bg-slate-200 rounded-lg" />
          <div className="h-44 bg-slate-100 rounded-xl" />
        </div>

        {/* Operational Queues & Tables Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
          <div className="lg:col-span-8 bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="h-5 w-48 bg-slate-200 rounded" />
              <div className="h-4 w-24 bg-slate-100 rounded" />
            </div>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((j) => (
                <div key={j} className="h-16 bg-slate-50 rounded-xl border border-slate-100 p-3" />
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-4">
              <div className="h-5 w-44 bg-slate-200 rounded" />
              <div className="space-y-3">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="h-14 bg-slate-50 rounded-xl border border-slate-100" />
                ))}
              </div>
            </div>
          </div>
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
          <button
            onClick={() => fetchDashboardData(true)}
            className="mt-3 px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold font-heading hover:bg-red-700 transition-colors cursor-pointer"
          >
            Retry Fetch
          </button>
        </div>
      </div>
    );
  }

  // Calculate total sanction pipeline volume
  const totalPipelineAmount = (stats.recentEnquiries || []).reduce(
    (sum, e) => sum + (Number(e.loanAmount) || 0),
    0
  );

  // Filtered recent enquiries
  const filteredEnquiries = (stats.recentEnquiries || []).filter((enq) => {
    // Status filter
    if (filterStatus === 'NEW') {
      if (enq.status !== 'New' && enq.status !== 'Appointment Requested') return false;
    } else if (filterStatus === 'IN_PROCESS') {
      if (enq.status !== 'Contacted' && enq.status !== 'Slot Booked' && enq.status !== 'Process Started') return false;
    } else if (filterStatus === 'CLOSED') {
      if (enq.status !== 'Closed' && enq.status !== 'Converted') return false;
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const name = (enq.fullName || '').toLowerCase();
      const phone = (enq.mobileNumber || '').toLowerCase();
      const ref = (enq.referenceNumber || '').toLowerCase();
      const loan = (enq.loanType || '').toLowerCase();
      return name.includes(q) || phone.includes(q) || ref.includes(q) || loan.includes(q);
    }

    return true;
  });

  // Calculate Loan Type Portfolio Share for the Graph Bar
  const allRecent = stats.recentEnquiries || [];
  const totalCount = allRecent.length || 1;

  const typeConfig: Record<string, { label: string; color: string; barGradient: string }> = {
    'Home Loan': {
      label: 'Home Loan',
      color: 'text-teal-700 bg-teal-50 border-teal-200',
      barGradient: 'from-teal-500 to-emerald-500',
    },
    'Loan Against Property': {
      label: 'Mortgage / LAP',
      color: 'text-blue-700 bg-blue-50 border-blue-200',
      barGradient: 'from-blue-500 to-indigo-500',
    },
    'Property Funding': {
      label: 'Property Funding',
      color: 'text-indigo-700 bg-indigo-50 border-indigo-200',
      barGradient: 'from-indigo-500 to-purple-500',
    },
    'Vehicle Loan': {
      label: 'Vehicle Loan',
      color: 'text-amber-700 bg-amber-50 border-amber-200',
      barGradient: 'from-amber-500 to-orange-500',
    },
  };

  const loanStatsMap = allRecent.reduce(
    (acc: Record<string, { count: number; totalAmt: number }>, item) => {
      const key = item.loanType || 'Home Loan';
      if (!acc[key]) acc[key] = { count: 0, totalAmt: 0 };
      acc[key].count += 1;
      acc[key].totalAmt += Number(item.loanAmount) || 0;
      return acc;
    },
    {}
  );

  // Stage funnel statistics for the vertical bar chart
  const funnelStages = [
    {
      label: 'New Submitted',
      count: allRecent.filter((e) => e.status === 'New' || e.status === 'Appointment Requested').length,
      gradient: 'from-amber-400 to-amber-500',
      bgPill: 'bg-amber-50 text-amber-800 border-amber-200',
    },
    {
      label: 'Contacted / Queue',
      count: allRecent.filter((e) => e.status === 'Contacted').length,
      gradient: 'from-sky-400 to-sky-500',
      bgPill: 'bg-sky-50 text-sky-800 border-sky-200',
    },
    {
      label: 'Slot Booked',
      count: allRecent.filter((e) => e.status === 'Slot Booked' || e.status === 'Appointment Confirmed').length,
      gradient: 'from-blue-500 to-indigo-500',
      bgPill: 'bg-blue-50 text-blue-800 border-blue-200',
    },
    {
      label: 'In Underwriting',
      count: allRecent.filter((e) => e.status === 'Process Started' || e.status === 'In Review').length,
      gradient: 'from-teal-500 to-teal-600',
      bgPill: 'bg-teal-50 text-teal-800 border-teal-200',
    },
    {
      label: 'Sanction Converted',
      count: allRecent.filter((e) => e.status === 'Closed' || e.status === 'Converted').length,
      gradient: 'from-emerald-500 to-emerald-600',
      bgPill: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
  ];

  const maxStageCount = Math.max(...funnelStages.map((s) => s.count), 1);

  // Clean KPI Cards: NO line color on left
  const kpis = [
    {
      title: 'Total Enquiries',
      value: stats.totalEnquiries,
      sub: 'All registered borrower dossiers',
      icon: <FileSpreadsheet className="w-5 h-5 text-teal-600" />,
      bgIcon: 'bg-teal-50 text-teal-600 border-teal-100',
      badge: 'All Time',
    },
    {
      title: 'New Applications',
      value: stats.newEnquiries,
      sub: 'Action required & unassigned',
      icon: <TrendingUp className="w-5 h-5 text-blue-600" />,
      bgIcon: 'bg-blue-50 text-blue-600 border-blue-100',
      badge: stats.newEnquiries > 0 ? `${stats.newEnquiries} Pending` : 'Up to date',
      badgeClass: stats.newEnquiries > 0 ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600',
    },
    {
      title: 'Active Pipeline Requested',
      value: formatAmountINR(totalPipelineAmount),
      sub: 'Recent dossier sanction capital',
      icon: <Landmark className="w-5 h-5 text-emerald-600" />,
      bgIcon: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      badge: 'Sanction Cap',
      badgeClass: 'bg-emerald-100 text-emerald-800',
    },
    {
      title: 'Follow-ups Required',
      value: stats.awaitingFollowUp,
      sub: 'Active borrower negotiations',
      icon: <Clock className="w-5 h-5 text-amber-600" />,
      bgIcon: 'bg-amber-50 text-amber-600 border-amber-100',
      badge: 'In Progress',
      badgeClass: 'bg-amber-100 text-amber-800',
    },
    {
      title: 'Confirmed Consultations',
      value: stats.confirmedAppointments,
      sub: 'Ready for advisory calls',
      icon: <CheckCircle2 className="w-5 h-5 text-indigo-600" />,
      bgIcon: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      badge: 'Verified',
      badgeClass: 'bg-indigo-100 text-indigo-800',
    },
  ];

  // Enquiries awaiting appointment allotment
  const unallottedEnquiries = stats.recentEnquiries.filter(
    (e) => e.status === 'New' || e.status === 'Appointment Requested' || e.status === 'Contacted'
  );

  return (
    <div className="space-y-7">
      {/* ────────────────────────────────────────────────────────────
          1. EXECUTIVE COMMAND HERO BANNER (SUBTITLE REMOVED)
          ──────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl bg-[#0b1924] p-5 sm:p-6 text-white shadow-md border border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-teal-500/20 text-teal-300 text-[11px] font-semibold font-mono border border-teal-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>TiDB Cloud Synced</span>
            </span>
            <span className="text-slate-500">&bull;</span>
            <span className="text-[11px] text-slate-300 font-mono font-medium">
              {new Date().toLocaleDateString('en-IN', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-heading text-white">
            {admin?.name ? `Welcome, ${admin.name}` : `${getGreeting()}, Administrator`}
          </h1>
        </div>

        {/* Quick Action Tools */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => fetchDashboardData(true)}
            className="p-2.5 bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white rounded-xl border border-white/20 transition-all cursor-pointer shadow-xs active:scale-95"
            title="Refresh Operations Metrics"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-teal-400' : ''}`} />
          </button>

          <Link
            to="/admin/customers"
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 text-xs sm:text-sm font-semibold font-heading transition-colors"
          >
            <Users className="w-4 h-4 text-teal-300" />
            <span>Borrower Accounts</span>
          </Link>

          <Link
            to="/admin/appointments"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white text-xs sm:text-sm font-bold font-heading shadow-md shadow-teal-500/20 transition-all cursor-pointer active:scale-[0.98]"
          >
            <CalendarCheck2 className="w-4 h-4" />
            <span>Appointments Hub</span>
          </Link>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────
          2. FIVE KEY PERFORMANCE INDICATOR CARDS (CLEAN - NO LINE COLOR)
          ──────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {kpis.map((k, idx) => (
          <div
            key={idx}
            className="group bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-xl border ${k.bgIcon} transition-transform group-hover:scale-105 duration-200`}>
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

      {/* ────────────────────────────────────────────────────────────
          3. PROPER GRAPH BAR SECTION: LOAN VELOCITY & PORTFOLIO MIX
          ──────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-100">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#0c1a26] font-heading">
                Loan Pipeline Velocity &amp; Category Distribution
              </h3>
              <p className="text-xs text-slate-500 font-sans">
                Real-time application stages and loan facility portfolio breakdown
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-slate-600">
            <span className="font-bold text-[#0c1a26]">Active Portfolio:</span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
              {formatAmountINR(totalPipelineAmount)}
            </span>
          </div>
        </div>

        {/* Graph Bar Layout: Stage Funnel Bars (Left) + Portfolio Mix Horizontal Bars (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          {/* Left: Vertical Pipeline Velocity Bars (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 font-heading uppercase tracking-wider">
                Pipeline Stages (Dossier Volume)
              </span>
              <span className="text-[11px] text-slate-400 font-sans">Higher bar = greater throughput</span>
            </div>

            <div className="h-48 pt-4 pb-2 px-3 bg-slate-50/70 rounded-2xl border border-slate-200/80 flex items-end justify-between gap-3 sm:gap-4">
              {funnelStages.map((stage, i) => {
                const heightPercent = Math.max(Math.round((stage.count / maxStageCount) * 100), 12);

                return (
                  <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group">
                    {/* Count label pill */}
                    <span className="text-[11px] font-mono font-bold text-slate-700 mb-1.5 transition-transform group-hover:-translate-y-0.5">
                      {stage.count}
                    </span>

                    {/* The Visual Bar */}
                    <div className="w-full max-w-[48px] bg-slate-200/70 rounded-t-xl overflow-hidden flex items-end h-full">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-t-xl bg-gradient-to-t ${stage.gradient} transition-all duration-500 shadow-sm group-hover:brightness-105`}
                      />
                    </div>

                    {/* Stage Title Below */}
                    <span className="text-[10px] sm:text-[11px] font-heading font-semibold text-slate-600 mt-2 text-center line-clamp-1 w-full" title={stage.label}>
                      {stage.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Portfolio Category Mix Horizontal Graph Bars (5 cols) */}
          <div className="lg:col-span-5 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 font-heading uppercase tracking-wider">
                Facility Portfolio Share
              </span>
              <span className="text-[11px] text-slate-400 font-mono">By dossier volume</span>
            </div>

            <div className="space-y-3 pt-1">
              {Object.keys(typeConfig).map((typeKey) => {
                const cfg = typeConfig[typeKey];
                const data = loanStatsMap[typeKey] || { count: 0, totalAmt: 0 };
                const pct = Math.round((data.count / totalCount) * 100) || 0;

                return (
                  <div key={typeKey} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#0c1a26] font-heading">{cfg.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-bold text-slate-700">{pct}% ({data.count})</span>
                        <span className="font-mono text-[10px] text-slate-400">{formatAmountINR(data.totalAmt)}</span>
                      </div>
                    </div>

                    {/* Progress Graph Bar */}
                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${Math.max(pct, data.count > 0 ? 5 : 0)}%` }}
                        className={`h-full rounded-full bg-gradient-to-r ${cfg.barGradient} transition-all duration-500`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────
          4. ACTION REQUIRED: UNALLOTTED ENQUIRIES QUEUE
          ──────────────────────────────────────────────────────────── */}
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
                  Prospective borrowers awaiting administrative slot allotment &amp; verification call
                </p>
              </div>
            </div>

            <Link
              to="/admin/appointments"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-900 font-heading bg-white px-3.5 py-1.5 rounded-xl border border-teal-200/80 shadow-xs hover:border-teal-300 transition-colors self-start sm:self-auto cursor-pointer"
            >
              <span>Open Schedule Hub</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
            {unallottedEnquiries.slice(0, 3).map((enq) => (
              <div
                key={enq.id}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-teal-400/80 transition-all flex flex-col justify-between space-y-3 group"
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

                  <h4 className="font-bold text-[#0c1a26] text-sm font-heading line-clamp-1 group-hover:text-teal-700 transition-colors">
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

      {/* ────────────────────────────────────────────────────────────
          5. MAIN TWO-COLUMN LAYOUT: RECENT DOSSIERS & ACTIVITY FEED
          ──────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        {/* Left Column: Recent Enquiries Table (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden space-y-0">
          {/* Header Toolbar with Tabs & Search */}
          <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50 space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-[#0c1a26] font-heading">
                    Recent Loan Applications &amp; Dossiers
                  </h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <p className="text-xs text-slate-500 font-sans mt-0.5">
                  Real-time loan applications logged through borrower website &amp; eligibility portal
                </p>
              </div>

              <Link
                to="/admin/enquiries"
                className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-900 font-heading bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs hover:border-teal-300 transition-colors self-start sm:self-auto cursor-pointer"
              >
                <span>View Full Pipeline ({stats.totalEnquiries})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Quick Status Filter Tabs & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-1">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {[
                  { id: 'ALL', label: 'All Dossiers' },
                  { id: 'NEW', label: 'New / Pending' },
                  { id: 'IN_PROCESS', label: 'In Review' },
                  { id: 'CLOSED', label: 'Sanctioned / Closed' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setFilterStatus(tab.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold font-heading transition-all cursor-pointer whitespace-nowrap ${
                      filterStatus === tab.id
                        ? 'bg-[#0c1a26] text-white shadow-2xs'
                        : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/80'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="relative min-w-[200px]">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Quick filter table..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-sans text-[#0c1a26] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Enquiries Table */}
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
              <tbody className="divide-y divide-slate-100 font-sans">
                {filteredEnquiries.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400 font-sans">
                      <FileSpreadsheet className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                      No loan applications matched your filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredEnquiries.map((enq) => {
                    const initials =
                      enq.fullName
                        .split(' ')
                        .map((n: string) => n[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase() || 'AP';

                    return (
                      <tr key={enq.id} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-800 to-slate-900 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-xs border border-slate-700">
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
                          <span className="bg-slate-100 group-hover:bg-teal-50 group-hover:text-teal-800 px-2 py-0.5 rounded-md border border-slate-200/90 tracking-wide font-mono transition-colors">
                            {enq.referenceNumber}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-block px-2.5 py-0.5 rounded-md bg-teal-50 text-teal-800 text-[11px] font-bold font-heading border border-teal-200/80">
                            {enq.loanType}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-extrabold text-[#0c1a26] font-mono text-xs tabular-nums">
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
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold font-heading text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors border border-teal-200/60"
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

          {/* Table Footer */}
          <div className="px-5 py-3 bg-slate-50/70 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500 font-sans">
            <span>Showing {filteredEnquiries.length} of {stats.recentEnquiries.length} active dossiers</span>
            <span className="text-[11px] text-slate-400 font-mono">Live Sync</span>
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
                className="text-xs font-bold text-teal-700 hover:underline font-heading"
              >
                Calendar
              </Link>
            </div>

            <div className="space-y-2.5">
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
                        <span className="font-mono font-medium">{a.timeSlot}</span>
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
                          {act.enquiry?.referenceNumber || 'Dossier'}
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

      {/* ────────────────────────────────────────────────────────────
          6. SYSTEM QUICK SHORTCUTS DOCK
          ──────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-2">
        <Link
          to="/admin/services"
          className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-sm hover:border-teal-300 transition-all flex items-center gap-3 group"
        >
          <div className="p-2.5 rounded-xl bg-teal-50 text-teal-700 border border-teal-200/70 group-hover:scale-105 transition-transform">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#0c1a26] font-heading group-hover:text-teal-700 transition-colors">
              Loan Services
            </h4>
            <p className="text-[10px] text-slate-400 font-sans">Catalog &amp; Facilities</p>
          </div>
        </Link>

        <Link
          to="/admin/settings"
          className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-sm hover:border-amber-300 transition-all flex items-center gap-3 group"
        >
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200/70 group-hover:scale-105 transition-transform">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#0c1a26] font-heading group-hover:text-amber-700 transition-colors">
              Calendar Settings
            </h4>
            <p className="text-[10px] text-slate-400 font-sans">Hours &amp; Blackout Dates</p>
          </div>
        </Link>

        <Link
          to="/admin/content"
          className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-sm hover:border-blue-300 transition-all flex items-center gap-3 group"
        >
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200/70 group-hover:scale-105 transition-transform">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#0c1a26] font-heading group-hover:text-blue-700 transition-colors">
              Website CMS
            </h4>
            <p className="text-[10px] text-slate-400 font-sans">Live Content Editor</p>
          </div>
        </Link>

        <Link
          to="/admin/team"
          className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-sm hover:border-indigo-300 transition-all flex items-center gap-3 group"
        >
          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200/70 group-hover:scale-105 transition-transform">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#0c1a26] font-heading group-hover:text-indigo-700 transition-colors">
              Admin Team
            </h4>
            <p className="text-[10px] text-slate-400 font-sans">Access &amp; Permissions</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
