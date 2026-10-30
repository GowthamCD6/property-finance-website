import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  FileSpreadsheet,
  Calendar,
  Layers,
  FileEdit,
  HelpCircle,
  Clock,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Shield,
  Loader2,
  CalendarCheck2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/images/logo.png';

export const AdminLayout: React.FC = () => {
  const { admin, isAuthenticated, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Route guard
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/admin/login', { replace: true });
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="h-screen bg-brand-ivory flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-brand-teal" />
          <span className="text-xs font-semibold text-brand-slate font-sans">Validating administrative session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const navLinks = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard className="w-4 h-4 flex-shrink-0" /> },
    { name: 'Loan Enquiries', path: '/admin/enquiries', icon: <FileSpreadsheet className="w-4 h-4 flex-shrink-0" /> },
    { name: 'Appointments & Slots', path: '/admin/appointments', icon: <CalendarCheck2 className="w-4 h-4 flex-shrink-0" /> },
    { name: 'Loan Services', path: '/admin/services', icon: <Layers className="w-4 h-4 flex-shrink-0" /> },
    { name: 'Website Content', path: '/admin/content', icon: <FileEdit className="w-4 h-4 flex-shrink-0" /> },
    { name: 'Advisory FAQs', path: '/admin/faqs', icon: <HelpCircle className="w-4 h-4 flex-shrink-0" /> },
    { name: 'Availability & Hours', path: '/admin/settings', icon: <Clock className="w-4 h-4 flex-shrink-0" /> },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-brand-ivory flex font-sans antialiased selection:bg-brand-teal selection:text-white">
      {/* ────────────────────────────────────────────────────────────
          1. DESKTOP SIDEBAR: FIXED h-screen (DOES NOT SCROLL WITH PAGE)
          ──────────────────────────────────────────────────────────── */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-brand-border h-screen flex-shrink-0 select-none z-30">
        
        {/* Exact h-16 Header matching top navbar baseline border line */}
        <div className="h-16 px-5 border-b border-brand-border flex items-center flex-shrink-0">
          <Link to="/admin/dashboard" className="flex items-center py-1">
            <img
              src={logoImg}
              alt="Prime Associate Loans"
              className="h-11 max-h-[46px] w-auto max-w-[210px] object-contain flex-shrink-0 transition-transform hover:scale-[1.02]"
            />
          </Link>
        </div>

        {/* Navigation Area: Scrollable internally ONLY if screen height is tiny */}
        <nav className="p-3.5 space-y-1.5 flex-1 overflow-y-auto">
          <div className="px-3 pt-1 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-heading">
            Operations Menu
          </div>
          {navLinks.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-heading font-bold transition-all ${
                  isActive
                    ? 'bg-brand-teal text-white shadow-xs'
                    : 'text-slate-600 hover:text-brand-navy hover:bg-slate-100/80'
                }`
              }
            >
              {item.icon}
              <span className="truncate">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Authenticated user profile box & logout (Fixed at bottom of screen) */}
        <div className="p-3.5 border-t border-brand-border bg-slate-50/70 space-y-3 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-brand-teal/15 text-brand-teal flex items-center justify-center font-extrabold text-xs font-heading flex-shrink-0">
              {admin?.name?.charAt(0) || 'A'}
            </div>
            <div className="overflow-hidden min-w-0">
              <span className="text-xs font-bold text-brand-navy truncate block font-heading">
                {admin?.name || 'Administrator'}
              </span>
              <span className="text-[10px] text-brand-slate truncate block font-sans">
                {admin?.email}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold font-heading text-red-700 bg-red-50 hover:bg-red-100 border border-red-200/70 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ────────────────────────────────────────────────────────────
          2. MOBILE SIDEBAR DRAWER
          ──────────────────────────────────────────────────────────── */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-brand-navy/60 backdrop-blur-xs flex">
          <div className="w-72 bg-white h-full flex flex-col border-r border-brand-border shadow-xl animate-in slide-in-from-left duration-150">
            {/* Header */}
            <div className="h-16 px-4 border-b border-brand-border flex items-center justify-between flex-shrink-0">
              <Link to="/admin/dashboard" className="flex items-center" onClick={() => setMobileSidebarOpen(false)}>
                <img
                  src={logoImg}
                  alt="Prime Associate Loans"
                  className="h-10 w-auto object-contain flex-shrink-0"
                />
              </Link>
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1.5 text-brand-slate hover:text-brand-navy hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Nav */}
            <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto">
              {navLinks.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-heading font-bold transition-all ${
                      isActive
                        ? 'bg-brand-teal text-white shadow-xs'
                        : 'text-slate-600 hover:text-brand-navy hover:bg-slate-100/80'
                    }`
                  }
                >
                  {item.icon}
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </nav>

            {/* Mobile Bottom Profile */}
            <div className="p-4 border-t border-brand-border bg-slate-50 space-y-3 flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-brand-teal/15 text-brand-teal flex items-center justify-center font-bold text-xs font-heading">
                  {admin?.name?.charAt(0) || 'A'}
                </div>
                <div className="overflow-hidden min-w-0">
                  <span className="text-xs font-bold text-brand-navy truncate block font-heading">
                    {admin?.name || 'Administrator'}
                  </span>
                  <span className="text-[10px] text-brand-slate truncate block font-sans">
                    {admin?.email}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold font-heading text-red-700 bg-red-50 hover:bg-red-100 rounded-xl"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileSidebarOpen(false)} />
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────
          3. MAIN CONTENT AREA (PAGES ROLL / SCROLL INDEPENDENTLY)
          ──────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Top Navbar: Exact h-16 matching sidebar header baseline border line */}
        <header className="h-16 bg-white border-b border-brand-border flex items-center justify-between px-4 sm:px-6 flex-shrink-0 z-20">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg text-brand-navy hover:bg-slate-100 cursor-pointer"
              aria-label="Open Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-brand-teal flex-shrink-0" />
              <span className="text-xs font-extrabold text-brand-slate uppercase tracking-wider font-heading hidden sm:inline">
                Admin Console
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/appointments"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold font-heading text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Allotment Desk Active</span>
            </Link>

            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold font-heading text-brand-navy bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors shadow-xs"
            >
              <span>View Live Website</span>
              <ExternalLink className="w-3.5 h-3.5 text-brand-teal" />
            </a>
          </div>
        </header>

        {/* Page Content Viewport: THIS ALONE ROLLS / SCROLLS */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
