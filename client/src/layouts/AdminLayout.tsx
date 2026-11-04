import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileSpreadsheet,
  CalendarCheck2,
  Layers,
  FileEdit,
  HelpCircle,
  Clock,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Loader2,
  Globe,
  ShieldCheck,
  Users,
  ChevronRight,
  Lock,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserAvatar } from '../components/common/UserAvatar';
import { CDN_IMAGES } from '../constants/cloudinaryImages';

const logoImg = CDN_IMAGES.logo;
const logoDarkImg = CDN_IMAGES.logoDark;
import { getDashboardStatsApi } from '../services/api';

export const AdminLayout: React.FC = () => {
  const { admin, isAuthenticated, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [pendingCount, setPendingCount] = useState<number>(0);

  // Live IST Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch pending inquiries count for badge
  useEffect(() => {
    if (isAuthenticated) {
      getDashboardStatsApi()
        .then((data) => {
          if (data?.newEnquiries !== undefined) {
            setPendingCount(data.newEnquiries);
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated, location.pathname]);

  // Route guard
  useEffect(() => {
    const hasToken = Boolean(localStorage.getItem('vpf_admin_token'));
    if (!isLoading && (!isAuthenticated || !hasToken)) {
      navigate('/admin/login', { replace: true });
    }
  }, [isLoading, isAuthenticated, navigate]);

  const hasToken = Boolean(localStorage.getItem('vpf_admin_token'));
  if (!isAuthenticated && (!isLoading || !hasToken)) {
    return null;
  }

  // Grouped Navigation Structure
  const navigationGroups = [
    {
      group: 'Overview',
      items: [
        {
          name: 'Dashboard',
          path: '/admin/dashboard',
          icon: <LayoutDashboard className="w-[18px] h-[18px] flex-shrink-0" />,
          badge: null,
        },
      ],
    },
    {
      group: 'Borrower Operations',
      items: [
        {
          name: 'Loan Enquiries',
          path: '/admin/enquiries',
          icon: <FileSpreadsheet className="w-[18px] h-[18px] flex-shrink-0" />,
          badge: pendingCount > 0 ? `${pendingCount} New` : null,
          badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/35 font-bold',
        },
        {
          name: 'Enquired Customers',
          path: '/admin/customers',
          icon: <Users className="w-[18px] h-[18px] flex-shrink-0" />,
          badge: 'Google',
          badgeColor: 'bg-sky-500/15 text-sky-300 border border-sky-500/30',
        },
        {
          name: 'Appointments & Slots',
          path: '/admin/appointments',
          icon: <CalendarCheck2 className="w-[18px] h-[18px] flex-shrink-0" />,
          badge: null,
        },
      ],
    },
    {
      group: 'Website CMS & Catalog',
      items: [
        {
          name: 'Website Content',
          path: '/admin/content',
          icon: <FileEdit className="w-[18px] h-[18px] flex-shrink-0" />,
          badge: 'Live CMS',
          badgeColor: 'bg-teal-500/15 text-teal-300 border border-teal-500/30',
        },
        {
          name: 'Loan Services',
          path: '/admin/services',
          icon: <Layers className="w-[18px] h-[18px] flex-shrink-0" />,
          badge: null,
        },
        {
          name: 'Advisory FAQs',
          path: '/admin/faqs',
          icon: <HelpCircle className="w-[18px] h-[18px] flex-shrink-0" />,
          badge: null,
        },
      ],
    },
    {
      group: 'Administration & Access',
      items: [
        {
          name: 'Admin Team & Roles',
          path: '/admin/team',
          icon: <ShieldCheck className="w-[18px] h-[18px] flex-shrink-0" />,
          badge: 'Access',
          badgeColor: 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30',
        },
        {
          name: 'Working Hours & Slots',
          path: '/admin/settings',
          icon: <Clock className="w-[18px] h-[18px] flex-shrink-0" />,
          badge: null,
        },
        {
          name: 'API Security & Keys',
          path: '/admin/security',
          icon: <Lock className="w-[18px] h-[18px] flex-shrink-0" />,
          badge: 'SHA-256',
          badgeColor: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
        },
      ],
    },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login', { replace: true });
  };

  const getCurrentPageTitle = () => {
    for (const group of navigationGroups) {
      for (const item of group.items) {
        if (location.pathname === item.path) return item.name;
      }
    }
    return 'Dashboard';
  };

  return (
    <div className="admin-portal h-screen w-screen overflow-hidden bg-[#f4f6f8] flex font-sans antialiased text-slate-800">
      {/* ────────────────────────────────────────────────────────────
          1. FIXED DESKTOP SIDEBAR WITH SLEEK BRAND LOGO & NEAT FINTECH STYLING
          ──────────────────────────────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col bg-[#080e18] bg-gradient-to-b from-[#0b1424] via-[#080e18] to-[#050910] text-white h-screen w-[260px] xl:w-[280px] flex-shrink-0 select-none z-30 border-r border-slate-800/80 shadow-[4px_0_30px_rgba(0,0,0,0.35)] relative">
        {/* Brand Logo Header */}
        <div className="h-20 px-5 border-b border-slate-800/80 flex items-center justify-center bg-gradient-to-b from-[#0e192c]/70 to-transparent flex-shrink-0 text-center relative overflow-hidden">
          {/* Subtle Ambient Backlight */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-48 h-20 bg-gradient-to-b from-orange-500/15 via-teal-500/10 to-transparent blur-xl pointer-events-none" />

          <Link
            to="/admin/dashboard"
            className="w-full flex items-center justify-center text-center group relative z-10 transition-transform duration-200"
          >
            <img
              src={logoDarkImg}
              alt="Prime Associates Loans"
              className="h-11 w-auto max-w-[215px] object-contain mx-auto block transition-transform duration-300 group-hover:scale-[1.03] filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
              loading="eager"
            />
          </Link>
        </div>

        {/* Navigation Groups */}
        <nav className="p-3.5 space-y-4 flex-1 overflow-y-auto admin-sidebar-scroll">
          {navigationGroups.map((grp, gIdx) => (
            <div key={gIdx} className="space-y-1">
              <div className="px-3 pt-2.5 pb-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-slate-400 font-heading">
                {grp.group}
              </div>

              {grp.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `group relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[14px] transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-teal-500/20 via-teal-500/12 to-emerald-500/5 text-white font-bold border border-teal-500/35 shadow-[0_2px_12px_rgba(20,184,166,0.15)] before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:rounded-r-full before:bg-gradient-to-b before:from-teal-400 before:to-emerald-400'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/40 hover:border-slate-700/30 border border-transparent font-medium hover:translate-x-0.5'
                    }`
                  }
                >
                  <div className="flex items-center gap-3 min-w-0 pr-1">
                    <span className="transition-all duration-200 flex-shrink-0 text-slate-400 group-hover:text-teal-300 group-hover:scale-110">
                      {item.icon}
                    </span>
                    <span className="truncate font-heading tracking-tight text-[13.5px] sm:text-[14px] font-semibold">{item.name}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10.5px] font-bold tracking-wide flex-shrink-0 shadow-xs ${
                        item.badgeColor || 'bg-slate-800 text-slate-200 border border-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* Unified Executive User Profile & Log Out */}
        <div className="p-3 border-t border-slate-800/80 bg-gradient-to-t from-[#050910] to-[#080e18] flex-shrink-0">
          <div className="p-3 rounded-2xl bg-gradient-to-b from-[#0e1726] to-[#09101b] border border-slate-800/90 shadow-lg space-y-3 backdrop-blur-sm">
            {/* User Details */}
            <div className="flex items-center gap-2.5">
              <div className="relative flex-shrink-0">
                <UserAvatar
                  src={admin?.avatar}
                  name={admin?.name || 'Admin'}
                  size={38}
                  showGoogleBadge={true}
                />
              </div>

              <div className="overflow-hidden min-w-0 flex-1">
                <div className="text-sm font-bold text-white truncate font-heading leading-tight">
                  {admin?.name || 'Administrator'}
                </div>
                <div className="text-xs text-slate-400 truncate font-sans mt-0.5">
                  {admin?.email}
                </div>
              </div>
            </div>

            {/* Professional Integrated Log Out Action Button */}
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold font-heading text-slate-300 hover:text-white bg-slate-800/80 hover:bg-rose-500/20 border border-slate-700/60 hover:border-rose-500/40 rounded-xl transition-all duration-200 cursor-pointer shadow-xs active:scale-[0.98] group"
              title="Log Out"
            >
              <LogOut className="w-4 h-4 text-slate-400 group-hover:text-rose-400 transition-colors" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ────────────────────────────────────────────────────────────
          2. MOBILE & TABLET SIDEBAR DRAWER (OVERLAY)
          ──────────────────────────────────────────────────────────── */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-slate-950/75 backdrop-blur-xs flex">
          <div className="w-[280px] sm:w-[300px] bg-[#080e18] bg-gradient-to-b from-[#0b1424] via-[#080e18] to-[#050910] text-white h-full flex flex-col border-r border-slate-800/80 shadow-2xl animate-in slide-in-from-left duration-200">
            {/* Mobile Header with Centered Dark Logo & Close Button */}
            <div className="h-20 px-4 border-b border-slate-800/80 flex items-center justify-between flex-shrink-0 bg-gradient-to-b from-[#0e192c]/70 to-transparent relative">
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileSidebarOpen(false)}
                className="flex items-center justify-center mx-auto"
              >
                <img
                  src={logoDarkImg}
                  alt="Prime Associates Loans"
                  className="h-10 w-auto max-w-[190px] object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
                />
              </Link>
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer absolute right-3"
                aria-label="Close Sidebar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Nav Links */}
            <nav className="p-3.5 space-y-4 flex-1 overflow-y-auto admin-sidebar-scroll">
              {navigationGroups.map((grp, gIdx) => (
                <div key={gIdx} className="space-y-1">
                  <div className="px-3 pt-2.5 pb-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-slate-400 font-heading">
                    {grp.group}
                  </div>
                  {grp.items.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={({ isActive }) =>
                        `group relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[14px] transition-all duration-200 ${
                          isActive
                            ? 'bg-gradient-to-r from-teal-500/20 via-teal-500/12 to-emerald-500/5 text-white font-bold border border-teal-500/35 shadow-[0_2px_12px_rgba(20,184,166,0.15)] before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:rounded-r-full before:bg-gradient-to-b before:from-teal-400 before:to-emerald-400'
                            : 'text-slate-300 hover:text-white hover:bg-slate-800/40 hover:border-slate-700/30 border border-transparent font-medium'
                        }`
                      }
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-1">
                        <span className="text-slate-400 group-hover:text-teal-300">
                          {item.icon}
                        </span>
                        <span className="truncate font-heading tracking-tight text-[13.5px] sm:text-[14px] font-semibold">{item.name}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10.5px] font-bold tracking-wide flex-shrink-0 ${
                            item.badgeColor || 'bg-slate-800 text-slate-200 border border-slate-700'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  ))}
                </div>
              ))}
            </nav>

            {/* Mobile Bottom Profile & Log Out */}
            <div className="p-3 border-t border-slate-800/80 bg-gradient-to-t from-[#050910] to-[#080e18] flex-shrink-0">
              <div className="p-3 rounded-2xl bg-gradient-to-b from-[#0e1726] to-[#09101b] border border-slate-800/90 shadow-lg space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="relative flex-shrink-0">
                    <UserAvatar
                      src={admin?.avatar}
                      name={admin?.name || 'Admin'}
                      size={36}
                      showGoogleBadge={true}
                    />
                  </div>
                  <div className="overflow-hidden min-w-0 flex-1">
                    <div className="text-sm font-bold text-white truncate font-heading">
                      {admin?.name || 'Administrator'}
                    </div>
                    <div className="text-xs text-slate-400 truncate font-sans">{admin?.email}</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-rose-500/20 rounded-xl border border-slate-700/60 hover:border-rose-500/40 transition-all cursor-pointer shadow-xs active:scale-[0.98]"
                >
                  <LogOut className="w-4 h-4 text-slate-400" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileSidebarOpen(false)} />
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────
          3. MAIN CONTENT VIEWPORT
          ──────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-[#f4f6f8]">
        {/* Corporate Top Navbar */}
        <header className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between px-3 sm:px-6 lg:px-8 flex-shrink-0 z-20 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
              aria-label="Open Mobile Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Elegant Breadcrumb Hierarchy */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 sm:gap-2 font-heading min-w-0">
              <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100/90 text-slate-600 text-xs font-semibold border border-slate-200/70 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                Prime Associates
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 hidden md:inline shrink-0" />
              <span className="text-xs sm:text-sm lg:text-base font-bold text-slate-900 tracking-tight truncate max-w-[130px] xs:max-w-[180px] sm:max-w-[280px] md:max-w-none">
                {getCurrentPageTitle()}
              </span>
            </nav>
          </div>

          {/* Right Header Badges & Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Live IST Time Desk Clock */}
            {currentTime && (
              <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 shadow-2xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs font-semibold text-slate-700 font-mono tracking-tight tabular-nums">
                  {currentTime}
                </span>
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider bg-slate-200/70 px-1 py-0.5 rounded font-sans">
                  IST
                </span>
              </div>
            )}

            {/* Subtle Divider */}
            <div className="hidden sm:block h-5 w-px bg-slate-200" />

            {/* View Live Public Site Button */}
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold font-heading text-slate-700 hover:text-teal-700 bg-white hover:bg-teal-50/50 border border-slate-200 hover:border-teal-300 shadow-2xs hover:shadow-xs transition-all duration-200 group active:scale-95"
              title="Open Public User Website in New Tab"
            >
              <Globe className="w-3.5 h-3.5 text-teal-600 group-hover:rotate-12 transition-transform duration-300" />
              <span className="hidden sm:inline">View Website</span>
              <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            {/* Executive Admin Profile Chip with Google Avatar, Name & Role */}
            <Link
              to="/admin/settings"
              className="flex items-center gap-2 sm:gap-2.5 pl-1.5 sm:pl-2 py-1 pr-2 sm:pr-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-all duration-200 group shadow-2xs hover:shadow-xs cursor-pointer"
              title="Administrator Profile & Settings"
            >
              <UserAvatar
                src={admin?.avatar}
                name={admin?.name || 'Admin'}
                size={32}
                showGoogleBadge={true}
              />
              <div className="hidden md:flex flex-col text-left min-w-0">
                <span className="text-xs font-bold text-slate-800 font-heading leading-tight truncate max-w-[130px] group-hover:text-teal-700 transition-colors">
                  {admin?.name || 'Administrator'}
                </span>
                <span className="text-[10px] font-semibold text-teal-700 uppercase tracking-wider font-sans leading-none mt-0.5">
                  {admin?.role?.replace('_', ' ') || 'Admin'}
                </span>
              </div>
            </Link>
          </div>
        </header>

        {/* Page Content Viewport */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-3.5 sm:p-5 lg:p-6">
          {isLoading && !admin ? (
            <div className="space-y-6 animate-pulse">
              <div className="h-8 w-64 bg-slate-200 rounded-xl" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-28 bg-white rounded-2xl border border-slate-200 p-5" />
                ))}
              </div>
              <div className="h-72 bg-white rounded-2xl border border-slate-200 p-6" />
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
