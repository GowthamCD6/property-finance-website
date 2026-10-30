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
  UserPlus,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/images/logo.png';
import { getDashboardStatsApi } from '../services/api';
import { RegisterBorrowerModal } from '../components/admin/RegisterBorrowerModal';

export const AdminLayout: React.FC = () => {
  const { admin, isAuthenticated, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
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
    if (!isLoading && !isAuthenticated) {
      navigate('/admin/login', { replace: true });
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="h-screen bg-[#0b1924] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
          <span className="text-xs font-semibold text-slate-300 font-sans tracking-wide">
            Loading Admin Panel...
          </span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
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
          icon: <LayoutDashboard className="w-4 h-4 flex-shrink-0" />,
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
          icon: <FileSpreadsheet className="w-4 h-4 flex-shrink-0" />,
          badge: pendingCount > 0 ? `${pendingCount} New` : null,
          badgeColor: 'bg-emerald-500 text-slate-950 font-bold',
        },
        {
          name: 'Appointments & Slots',
          path: '/admin/appointments',
          icon: <CalendarCheck2 className="w-4 h-4 flex-shrink-0" />,
          badge: null,
        },
      ],
    },
    {
      group: 'Website CMS & Catalog',
      items: [
        {
          name: 'Website Content CMS',
          path: '/admin/content',
          icon: <FileEdit className="w-4 h-4 flex-shrink-0" />,
          badge: 'Live CMS',
          badgeColor: 'bg-teal-500/20 text-teal-300 border border-teal-500/30',
        },
        {
          name: 'Loan Services',
          path: '/admin/services',
          icon: <Layers className="w-4 h-4 flex-shrink-0" />,
          badge: null,
        },
        {
          name: 'Advisory FAQs',
          path: '/admin/faqs',
          icon: <HelpCircle className="w-4 h-4 flex-shrink-0" />,
          badge: null,
        },
      ],
    },
    {
      group: 'System Configuration',
      items: [
        {
          name: 'Working Hours & Slots',
          path: '/admin/settings',
          icon: <Clock className="w-4 h-4 flex-shrink-0" />,
          badge: null,
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
    <div className="h-screen w-screen overflow-hidden bg-[#f4f6f8] flex font-sans antialiased text-slate-800">
      {/* ────────────────────────────────────────────────────────────
          1. FIXED DESKTOP SIDEBAR WITH CENTERED LOGO (NO COLLAPSE TOGGLE)
          ──────────────────────────────────────────────────────────── */}
      <aside className="hidden md:flex flex-col bg-[#0b1924] text-white h-screen w-64 flex-shrink-0 select-none z-30 border-r border-slate-800 shadow-xl">
        {/* Centered Brand Logo */}
        <div className="h-20 px-4 border-b border-slate-800/80 flex items-center justify-center bg-[#09151f] flex-shrink-0 text-center">
          <Link to="/admin/dashboard" className="w-full flex items-center justify-center text-center">
            <img
              src={logoImg}
              alt="Prime Associates"
              className="h-11 w-auto max-w-[190px] object-contain mx-auto block brightness-110"
            />
          </Link>
        </div>

        {/* Navigation Groups */}
        <nav className="p-3.5 space-y-5 flex-1 overflow-y-auto">
          {navigationGroups.map((grp, gIdx) => (
            <div key={gIdx} className="space-y-1">
              <div className="px-3 pt-1 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-heading">
                {grp.group}
              </div>

              {grp.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                      isActive
                        ? 'bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-sm font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="transition-transform group-hover:scale-105 duration-150 text-slate-300 group-hover:text-white">
                      {item.icon}
                    </span>
                    <span className="truncate font-heading">{item.name}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide flex-shrink-0 ${
                        item.badgeColor || 'bg-slate-700 text-slate-200'
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

        {/* User Profile Card & Sign Out */}
        <div className="p-3.5 border-t border-slate-800 bg-[#09151f] flex-shrink-0 space-y-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-xs shadow-sm flex-shrink-0">
              {admin?.name?.charAt(0) || 'A'}
            </div>

            <div className="overflow-hidden min-w-0 flex-1">
              <div className="text-xs font-bold text-white truncate font-heading">
                {admin?.name || 'Administrator'}
              </div>
              <div className="text-[10px] text-slate-400 truncate font-sans">
                {admin?.email}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold font-heading text-red-300 bg-red-950/30 hover:bg-red-950/60 border border-red-800/40 rounded-xl transition-all cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5 text-red-400" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ────────────────────────────────────────────────────────────
          2. MOBILE SIDEBAR DRAWER (OVERLAY)
          ──────────────────────────────────────────────────────────── */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-slate-950/70 backdrop-blur-xs flex">
          <div className="w-64 bg-[#0b1924] text-white h-full flex flex-col border-r border-slate-800 shadow-2xl animate-in slide-in-from-left duration-200">
            {/* Mobile Header with Centered Logo */}
            <div className="h-20 px-4 border-b border-slate-800 flex items-center justify-between flex-shrink-0 bg-[#09151f]">
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileSidebarOpen(false)}
                className="flex items-center justify-center mx-auto"
              >
                <img src={logoImg} alt="Prime Associates" className="h-9 w-auto brightness-110" />
              </Link>
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Nav Links */}
            <nav className="p-3.5 space-y-4 flex-1 overflow-y-auto">
              {navigationGroups.map((grp, gIdx) => (
                <div key={gIdx} className="space-y-1">
                  <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-heading">
                    {grp.group}
                  </div>
                  {grp.items.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold ${
                          isActive
                            ? 'bg-teal-600 text-white font-bold shadow-md'
                            : 'text-slate-300 hover:bg-slate-800/60'
                        }`
                      }
                    >
                      <div className="flex items-center gap-2.5">
                        {item.icon}
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                            item.badgeColor || 'bg-slate-700 text-slate-200'
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

            {/* Mobile Bottom Profile */}
            <div className="p-4 border-t border-slate-800 bg-[#09151f] space-y-3 flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
                  {admin?.name?.charAt(0) || 'A'}
                </div>
                <div className="overflow-hidden min-w-0">
                  <span className="text-xs font-bold text-white truncate block">
                    {admin?.name || 'Administrator'}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate block">{admin?.email}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold text-red-300 bg-red-950/40 hover:bg-red-900/50 rounded-xl border border-red-800/40 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-red-400" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileSidebarOpen(false)} />
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────
          3. MAIN CONTENT VIEWPORT
          ──────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-[#f4f6f8]">
        {/* Clean Corporate Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 flex-shrink-0 z-20 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 cursor-pointer"
              aria-label="Open Mobile Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 font-heading">
              <span className="hidden sm:inline text-slate-400">Prime Associates</span>
              <span className="text-slate-300 hidden sm:inline">/</span>
              <span className="text-xs sm:text-sm font-extrabold text-[#0c1a26]">
                {getCurrentPageTitle()}
              </span>
            </div>
          </div>

          {/* Right Header Badges & Actions */}
          <div className="flex items-center gap-3">
            {/* Live IST Time */}
            {currentTime && (
              <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 text-slate-600 text-xs font-mono font-medium border border-slate-200">
                <Clock className="w-3.5 h-3.5 text-teal-600" />
                <span>{currentTime} IST</span>
              </div>
            )}

            {/* Register Borrower Button */}
            <button
              type="button"
              onClick={() => setIsRegisterModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold font-heading text-white bg-teal-600 hover:bg-teal-700 transition-colors shadow-xs cursor-pointer active:scale-[0.98]"
              title="Register a New Borrower Dossier"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Register Borrower</span>
              <span className="sm:hidden">Register</span>
            </button>

            {/* View Live Public Site */}
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#0c1a26] bg-white hover:bg-slate-50 border border-slate-200 shadow-xs transition-colors"
              title="Open Public User Website in New Tab"
            >
              <Globe className="w-3.5 h-3.5 text-teal-600" />
              <span className="hidden sm:inline">View Website</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>
        </header>

        {/* Page Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>

        {/* Global Register Borrower Modal */}
        <RegisterBorrowerModal
          isOpen={isRegisterModalOpen}
          onClose={() => setIsRegisterModalOpen(false)}
          onSuccess={(newEnquiry) => {
            window.dispatchEvent(new CustomEvent('enquiry-registered', { detail: newEnquiry }));
          }}
        />
      </div>
    </div>
  );
};

export default AdminLayout;
