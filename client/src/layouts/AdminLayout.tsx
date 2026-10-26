import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
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
  Building2,
  Shield,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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
      <div className="min-h-screen bg-brand-ivory flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-brand-teal" />
          <span className="text-sm font-medium text-brand-slate">Validating admin session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const navLinks = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: 'Enquiries', path: '/admin/enquiries', icon: <FileSpreadsheet className="w-4 h-4" /> },
    { name: 'Appointments', path: '/admin/appointments', icon: <Calendar className="w-4 h-4" /> },
    { name: 'Services', path: '/admin/services', icon: <Layers className="w-4 h-4" /> },
    { name: 'Website Content', path: '/admin/content', icon: <FileEdit className="w-4 h-4" /> },
    { name: 'FAQs', path: '/admin/faqs', icon: <HelpCircle className="w-4 h-4" /> },
    { name: 'Availability & Hours', path: '/admin/settings', icon: <Clock className="w-4 h-4" /> },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-brand-ivory flex">
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-brand-border flex-shrink-0">
        <div className="p-4 border-b border-brand-border flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Prime Associate Loans"
            className="h-9 w-auto object-contain flex-shrink-0"
          />
          <div className="overflow-hidden">
            <span className="font-bold text-xs text-brand-navy truncate block">
              Prime Associate Loans
            </span>
            <span className="text-[10px] uppercase tracking-wider text-brand-slate font-medium block">
              Management Portal
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
          {navLinks.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-brand-teal text-white shadow-xs'
                    : 'text-brand-navy hover:bg-brand-teal-light hover:text-brand-teal'
                }`
              }
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Authenticated user profile box & logout */}
        <div className="p-4 border-t border-brand-border bg-brand-ivory/60 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-brand-teal/10 text-brand-teal flex items-center justify-center font-bold text-xs flex-shrink-0">
              {admin?.name?.charAt(0) || 'A'}
            </div>
            <div className="overflow-hidden">
              <span className="text-xs font-bold text-brand-navy truncate block">
                {admin?.name || 'Administrator'}
              </span>
              <span className="text-[10px] text-brand-slate truncate block">
                {admin?.email}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MOBILE SIDEBAR MODAL */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-brand-navy/60 backdrop-blur-xs flex">
          <div className="w-72 bg-white h-full flex flex-col p-5 border-r border-brand-border shadow-xl animate-in slide-in-from-left duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-brand-border">
              <div className="flex items-center gap-2.5">
                <img
                  src="/logo.png"
                  alt="Prime Associate Loans"
                  className="h-8 w-auto object-contain flex-shrink-0"
                />
                <span className="font-bold text-xs text-brand-navy">Prime Associate Loans</span>
              </div>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1 text-brand-slate hover:text-brand-navy"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="mt-4 space-y-1 flex-1 overflow-y-auto">
              {navLinks.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-brand-teal text-white'
                        : 'text-brand-navy hover:bg-brand-teal-light hover:text-brand-teal'
                    }`
                  }
                >
                  {item.icon}
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </nav>

            <div className="pt-4 border-t border-brand-border">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-red-700 bg-red-50 rounded-lg"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileSidebarOpen(false)}></div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-white border-b border-brand-border h-16 flex items-center justify-between px-4 sm:px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg text-brand-navy hover:bg-brand-teal-light"
              aria-label="Open Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-brand-teal" />
              <span className="text-xs font-semibold text-brand-slate uppercase tracking-wider hidden sm:inline">
                Admin Console
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-brand-navy bg-brand-ivory hover:bg-gray-100 border border-brand-border transition-colors"
            >
              <span>View Live Website</span>
              <ExternalLink className="w-3.5 h-3.5 text-brand-teal" />
            </a>
          </div>
        </header>

        {/* Page Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
