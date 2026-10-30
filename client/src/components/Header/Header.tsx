import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ChevronDown,
  Home,
  Building,
  Briefcase,
  FileCheck,
  Menu,
  X,
  ArrowRight,
  Building2,
  Workflow,
  Calculator,
  HelpCircle,
  Phone,
  User,
  LogOut,
  FileText,
  Loader2,
} from 'lucide-react';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { GoogleIcon } from '../common/GoogleIcon';
import { triggerGoogleOAuth } from '../../utils/googleAuth';
import { SiteContent } from '../../types';
import { WealthAnchorLogo } from '../common/WealthAnchorLogo';

interface HeaderProps {
  content?: SiteContent | null;
}

export const Header: React.FC<HeaderProps> = ({ content }) => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Customer Auth
  const { customer, isAuthenticated, loginWithGoogle, logout } = useCustomerAuth();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isGoogleSigningIn, setIsGoogleSigningIn] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  const triggerHeaderGoogleLogin = async () => {
    setIsGoogleSigningIn(true);
    try {
      const accessToken = await triggerGoogleOAuth();
      await loginWithGoogle(accessToken);
    } catch (e) {
      console.error('Customer login failed:', e);
    } finally {
      setIsGoogleSigningIn(false);
    }
  };

  // Close user dropdown on click outside
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const [scrollProgress, setScrollProgress] = useState(0);

  // Scroll handler: track scroll progress with requestAnimationFrame for smooth rolling
  useEffect(() => {
    let ticking = false;

    const updateScroll = () => {
      const winScroll = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      setScrollProgress(Math.min(100, Math.max(0, scrolled)));
      setIsScrolled(winScroll > 15);
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown and mobile menu on route change
  useEffect(() => {
    setServicesDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setServicesDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const handleDropdownEnter = useCallback(() => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setServicesDropdownOpen(true);
  }, []);

  const handleDropdownLeave = useCallback(() => {
    dropdownTimeout.current = setTimeout(() => {
      setServicesDropdownOpen(false);
    }, 200);
  }, []);

  const serviceItems = [
    {
      title: 'Home Loans & Construction',
      desc: 'Self construction, plot + building, new/old homes & tiled house',
      path: '/services/home-loans',
      icon: <Home className="w-4 h-4" />,
    },
    {
      title: 'Mortgage Loans (LAP)',
      desc: 'Concrete building, tiled house, empty land plots & commercial',
      path: '/services/loan-against-property',
      icon: <Building className="w-4 h-4" />,
    },
    {
      title: 'Purchase Loans & Takeover',
      desc: 'Plot/building purchase & private to govt bank loan takeover',
      path: '/services/property-backed-funding',
      icon: <Building2 className="w-4 h-4" />,
    },
    {
      title: 'Vehicle Loans & Refinance',
      desc: 'New/used cars, used car refinance & commercial vehicles',
      path: '/services/loan-consultation',
      icon: <Briefcase className="w-4 h-4" />,
    },
  ];

  const navLinks = [
    {
      label: 'Home',
      path: '/',
      exact: true,
      defaultIcon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
          <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
        </svg>
      ),
      hoverIcon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" d="M15.75 1.5a6.75 6.75 0 00-6.651 7.906c-.067.39-.099.79-.099 1.194 0 .804.129 1.578.368 2.302l-7.79 7.791a2.25 2.25 0 00-.659 1.591v1.966a.75.75 0 00.75.75h2.25a.75.75 0 00.75-.75v-1.5h1.5a.75.75 0 00.75-.75v-1.5h1.5a.75.75 0 00.75-.75v-1.5h1.5a.75.75 0 00.75-.75l1.09-1.09a6.744 6.744 0 003.141.786 6.75 6.75 0 100-13.5zm3.75 5.25a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      label: 'About Us',
      path: '/about',
      defaultIcon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" d="M4.5 2.25a.75.75 0 000 1.5v16.5h-.75a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5h-.75V3.75a.75.75 0 000-1.5h-15zM9 6a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5H9zm-.75 5.25a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75zm.75 3.75a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5H9zm4.5-9a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zm-.75 5.25a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zm.75 3.75a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5h-1.5z" clipRule="evenodd" />
        </svg>
      ),
      hoverIcon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.728-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      label: 'How It Works',
      path: '/how-it-works',
      defaultIcon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" d="M3 6a3 3 0 013-3h2.25a3 3 0 013 3v2.25a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm9.75 0a3 3 0 013-3H18a3 3 0 013 3v2.25a3 3 0 01-3 3h-2.25a3 3 0 01-3-3V6zM3 15.75a3 3 0 013-3h2.25a3 3 0 013 3V18a3 3 0 01-3 3H6a3 3 0 01-3-3v-2.25zm9.75 0a3 3 0 013-3H18a3 3 0 013 3V18a3 3 0 01-3 3h-2.25a3 3 0 01-3-3v-2.25z" clipRule="evenodd" />
        </svg>
      ),
      hoverIcon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      label: 'EMI Calculator',
      path: '/calculator',
      defaultIcon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" d="M6 2.25A2.25 2.25 0 003.75 4.5v15A2.25 2.25 0 006 21.75h12A2.25 2.25 0 0020.25 19.5V4.5A2.25 2.25 0 0018 2.25H6zm1.5 3a.75.75 0 01.75-.75h7.5a.75.75 0 01.75.75v2.25a.75.75 0 01-.75.75h-7.5a.75.75 0 01-.75-.75V5.25zm.75 6a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5h-1.5zm3.75 0a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5h-1.5zm3.75 0a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5h-1.5zm-7.5 3.75a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5h-1.5zm3.75 0a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5h-1.5zm3.75 0a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5h-1.5z" clipRule="evenodd" />
        </svg>
      ),
      hoverIcon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.375 2.25c.621 0 1.125.504 1.125 1.125v16.5c0 .621-.504 1.125-1.125 1.125h-2.25c-.621 0-1.125-.504-1.125-1.125V3.375c0-.621.504-1.125 1.125-1.125h2.25zM12 7.875c.621 0 1.125.504 1.125 1.125v10.875c0 .621-.504 1.125-1.125 1.125H9.75c-.621 0-1.125-.504-1.125-1.125V9c0-.621.504-1.125 1.125-1.125H12zM5.625 13.5c.621 0 1.125.504 1.125 1.125v5.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125v-5.25c0-.621.504-1.125 1.125-1.125h2.25z" />
        </svg>
      ),
    },
    {
      label: 'FAQs',
      path: '/faqs',
      defaultIcon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm0 13.5a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25zm1.19-4.88c-.347.288-.69.58-.69 1.13a.75.75 0 01-1.5 0c0-1.353.94-2.148 1.488-2.604.428-.356.762-.633.762-1.146 0-.828-.672-1.5-1.5-1.5s-1.5.672-1.5 1.5a.75.75 0 01-1.5 0 3 3 0 116 0c0 1.107-.68 1.673-1.06 1.99z" clipRule="evenodd" />
        </svg>
      ),
      hoverIcon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 1.5a7.5 7.5 0 00-4.996 13.093c.48.423.824.975.992 1.583l.254.924h7.5l.254-.924a3.748 3.748 0 01.992-1.583A7.5 7.5 0 0012 1.5zM9 19.5v.75A2.25 2.25 0 0011.25 22.5h1.5A2.25 2.25 0 0015 20.25v-.75H9z" />
        </svg>
      ),
    },
    {
      label: 'Contact',
      path: '/contact',
      defaultIcon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.251.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
        </svg>
      ),
      hoverIcon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.385 0 9.75-3.97 9.75-8.875S17.385 3.25 12 3.25 2.25 7.22 2.25 12.125c0 2.052.709 3.945 1.91 5.466l-1.01 3.535a.75.75 0 00.93.93l2.724-.412z" clipRule="evenodd" />
        </svg>
      ),
    },
  ];

  const isHomePage = location.pathname === '/';

  const isActive = (path: string, exact?: boolean) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header
        className="header-root"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          transition: 'background-color 0.35s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.35s ease, backdrop-filter 0.35s ease, border-color 0.35s ease',
          backgroundColor: isScrolled
            ? 'rgba(255, 255, 255, 0.98)'
            : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(16px) saturate(180%)',
          WebkitBackdropFilter: 'blur(16px) saturate(180%)',
          boxShadow: isScrolled
            ? '0 4px 20px -2px rgba(24, 50, 71, 0.08), 0 1px 3px rgba(0,0,0,0.04)'
            : '0 1px 3px rgba(0, 0, 0, 0.04)',
          borderBottom: '1px solid rgba(229, 231, 235, 0.85)',
        }}
      >
        <div
          className="w-[92%] sm:w-[88%] lg:w-[85%] max-w-7xl mx-auto"
          style={{
            padding: isScrolled ? '6px 0' : '8px 0',
            transition: 'padding 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            
            {/* ─── Logo ─── */}
            <Link
              to="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                flexShrink: 0,
              }}
              className="group"
            >
              <WealthAnchorLogo size={isScrolled ? 48 : 56} showWordmark={true} variant="dark" />
            </Link>

            {/* ─── Desktop Navigation ─── */}
            <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`nav-link group ${isActive(link.path, link.exact) ? 'nav-link--active' : ''}`}
                >
                  <span className="nav-icon-morph">
                    <span className="nav-icon-default">
                      {link.defaultIcon}
                    </span>
                    <span className="nav-icon-hover">
                      {link.hoverIcon}
                    </span>
                  </span>
                  <span>{link.label}</span>
                </Link>
              ))}

              {/* Loan Solutions Dropdown */}
              <div
                ref={dropdownRef}
                className="nav-dropdown-wrapper"
                onMouseEnter={handleDropdownEnter}
                onMouseLeave={handleDropdownLeave}
              >
                <button
                  type="button"
                  onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                  className={`nav-link nav-link--dropdown group ${isActive('/services') ? 'nav-link--active' : ''}`}
                >
                  <span className="nav-icon-morph">
                    <span className="nav-icon-default">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path fillRule="evenodd" d="M7.5 3.75A1.5 1.5 0 006 5.25v1.5H3.75A2.25 2.25 0 001.5 9v10.5A2.25 2.25 0 003.75 21.75h16.5A2.25 2.25 0 0022.5 19.5V9a2.25 2.25 0 00-2.25-2.25H18v-1.5a1.5 1.5 0 00-1.5-1.5h-9zm9 3V5.25h-9v1.5h9z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="nav-icon-hover">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path fillRule="evenodd" d="M12 2.25a.75.75 0 01.75.75v1.168l7.854 3.142A1.5 1.5 0 0121.5 8.65v.6a.75.75 0 01-.75.75H3.25a.75.75 0 01-.75-.75v-.6c0-.62.38-1.18.966-1.39L11.25 4.168V3a.75.75 0 01.75-.75zM4.5 12a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v6a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75v-6zm5.25 0a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v6a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75v-6zm5.25 0a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v6a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75v-6zm-12.75 8.25a.75.75 0 000 1.5h19.5a.75.75 0 000-1.5H2.25z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </span>
                  <span>Loan Solutions</span>
                  <ChevronDown
                    className="nav-chevron"
                    style={{
                      width: '14px',
                      height: '14px',
                      transition: 'transform 0.25s ease',
                      transform: servicesDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  />
                </button>

                {/* Dropdown Panel */}
                <div
                  className="nav-dropdown-panel"
                  style={{
                    opacity: servicesDropdownOpen ? 1 : 0,
                    visibility: servicesDropdownOpen ? 'visible' : 'hidden',
                    transform: servicesDropdownOpen ? 'translateY(0)' : 'translateY(-8px)',
                    transition: 'opacity 0.2s ease, transform 0.2s ease, visibility 0.2s ease',
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    marginLeft: '-180px',
                    marginTop: '8px',
                    width: '360px',
                    backgroundColor: '#ffffff',
                    borderRadius: '14px',
                    boxShadow: '0 20px 60px -15px rgba(24,50,71,0.15), 0 4px 12px -2px rgba(24,50,71,0.08)',
                    border: '1px solid rgba(229,231,235,0.8)',
                    padding: '8px',
                    zIndex: 100,
                  }}
                >
                  <div style={{ padding: '8px 10px 6px', borderBottom: '1px solid #f1f5f4', marginBottom: '4px' }}>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      color: '#667085',
                    }}>
                      Specialized Loan Products
                    </span>
                  </div>

                  {serviceItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="dropdown-item"
                    >
                      <div className="dropdown-item-icon">
                        {item.icon}
                      </div>
                      <div>
                        <span className="dropdown-item-title">{item.title}</span>
                        <span className="dropdown-item-desc">{item.desc}</span>
                      </div>
                    </Link>
                  ))}

                  <div style={{
                    padding: '8px 10px 6px',
                    marginTop: '4px',
                    borderTop: '1px solid #f1f5f4',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '11px',
                    color: '#667085',
                  }}>
                    <span>Subject to lender criteria</span>
                    <Link
                      to="/services/home-loans"
                      style={{ color: '#187C78', fontWeight: 600, textDecoration: 'none' }}
                      className="dropdown-explore-link"
                    >
                      Explore all →
                    </Link>
                  </div>
                </div>
              </div>
            </nav>

            {/* ─── Professional Avatar & CTA Button (Desktop) ─── */}
            <div className="desktop-cta" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              
              {/* Avatar Trigger & Dropdown Menu */}
              <div className="relative" ref={userDropdownRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="group relative flex items-center justify-center w-10 h-10 rounded-full border border-slate-200/90 hover:border-brand-teal/50 bg-white hover:bg-slate-50 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
                  aria-label="User Account Menu"
                  title={isAuthenticated && customer ? `${customer.name} (${customer.email})` : 'Client Account & Application Tracking'}
                >
                  {isAuthenticated && customer ? (
                    customer.picture ? (
                      <img
                        src={customer.picture}
                        alt={customer.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-gradient-to-tr from-brand-teal to-[#114b48] text-white text-xs font-bold flex items-center justify-center">
                        {customer.name.charAt(0).toUpperCase()}
                      </div>
                    )
                  ) : (
                    <div className="w-full h-full rounded-full flex items-center justify-center text-slate-500 group-hover:text-brand-teal bg-slate-50 transition-colors">
                      <User className="w-4 h-4" />
                    </div>
                  )}

                  {/* Online dot indicator for active customer */}
                  {isAuthenticated && customer && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                  )}
                </button>

                {/* Dropdown Popover */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2.5 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    {isAuthenticated && customer ? (
                      <>
                        <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
                          {customer.picture ? (
                            <img
                              src={customer.picture}
                              alt={customer.name}
                              className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-brand-teal text-white font-bold text-sm flex items-center justify-center shrink-0">
                              {customer.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-brand-navy truncate">{customer.name}</p>
                            <p className="text-[11px] text-slate-500 truncate">{customer.email}</p>
                            <span className="inline-block mt-0.5 text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                              ● Google Verified
                            </span>
                          </div>
                        </div>

                        <div className="py-1">
                          <Link
                            to="/my-enquiries"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-brand-teal font-medium transition-colors"
                          >
                            <FileText className="w-4 h-4 text-brand-teal" />
                            <span>My Enquiries &amp; Allotted Slots</span>
                          </Link>
                          <Link
                            to="/enquire"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-brand-teal font-medium transition-colors"
                          >
                            <ArrowRight className="w-4 h-4 text-brand-teal" />
                            <span>Submit New Loan Enquiry</span>
                          </Link>
                        </div>

                        <div className="pt-1 mt-1 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() => {
                              setUserDropdownOpen(false);
                              logout();
                            }}
                            className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs text-red-600 hover:bg-red-50 font-medium cursor-pointer transition-colors"
                          >
                            <LogOut className="w-4 h-4 text-red-500" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="p-4 space-y-3">
                        <div className="flex items-center gap-3 pb-2.5 border-b border-slate-100">
                          <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                            <User className="w-4 h-4 text-slate-600" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-brand-navy">Borrower Portal</p>
                            <p className="text-[11px] text-slate-500">Track loans &amp; scheduled slots</p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setUserDropdownOpen(false);
                            triggerHeaderGoogleLogin();
                          }}
                          disabled={isGoogleSigningIn}
                          className="w-full py-2.5 px-3 bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-300 hover:border-slate-400 text-slate-700 font-semibold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2.5 transition-all cursor-pointer"
                        >
                          {isGoogleSigningIn ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-teal" />
                              <span>Connecting to Google...</span>
                            </>
                          ) : (
                            <>
                              <GoogleIcon size={16} />
                              <span>Sign in with Google</span>
                            </>
                          )}
                        </button>

                        <div className="pt-1 border-t border-slate-100">
                          <Link
                            to="/my-enquiries"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center justify-between text-[11px] text-brand-slate hover:text-brand-teal font-medium py-1 transition-colors"
                          >
                            <span>Already submitted an enquiry?</span>
                            <span className="font-bold text-brand-teal">Track &rarr;</span>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Apply Now Primary CTA */}
              <Link
                to="/enquire"
                className="cta-button"
              >
                <span>Apply Now</span>
                <ArrowRight style={{ width: '15px', height: '15px' }} />
              </Link>
            </div>

            {/* ─── Mobile Menu Toggle ─── */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-toggle"
              aria-label="Toggle navigation"
              style={{
                color: '#183247',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                marginRight: '8px',
              }}
            >
              {mobileMenuOpen ? <X style={{ width: '24px', height: '24px' }} /> : <Menu style={{ width: '24px', height: '24px' }} />}
            </button>
          </div>
        </div>

        {/* Clean Smooth Single-Color Scroll Progress Bar below header */}
        <div
          className="header-scroll-progress-container"
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '2.5px',
            backgroundColor: isScrolled ? 'rgba(24, 124, 120, 0.08)' : 'transparent',
            pointerEvents: 'none',
          }}
        >
          <div
            className="header-scroll-progress-bar"
            style={{
              height: '100%',
              width: `${scrollProgress}%`,
              backgroundColor: '#187C78',
              transition: 'width 0.1s linear',
              willChange: 'width',
            }}
          />
        </div>
      </header>

      {/* Header spacer to prevent content jump under fixed header */}
      <div style={{ height: isScrolled ? '66px' : '74px', backgroundColor: '#ffffff' }} />

      {/* ─── Mobile Navigation Overlay ─── */}
      <div
        className="mobile-overlay"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 999,
          opacity: mobileMenuOpen ? 1 : 0,
          visibility: mobileMenuOpen ? 'visible' : 'hidden',
          transition: 'opacity 0.3s ease, visibility 0.3s ease',
          pointerEvents: mobileMenuOpen ? 'auto' : 'none',
        }}
      >
        {/* Backdrop */}
        <div
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(24, 50, 71, 0.4)',
            backdropFilter: 'blur(4px)',
          }}
        />

        {/* Slide-in Panel */}
        <div
          className="mobile-panel"
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '100%',
            maxWidth: '380px',
            height: '100%',
            backgroundColor: '#ffffff',
            boxShadow: '-8px 0 30px rgba(0,0,0,0.1)',
            transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(100%)',
            transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Mobile Panel Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: '1px solid #f1f5f4',
          }}>
            <WealthAnchorLogo size={48} showWordmark={true} />
            <button
              onClick={() => setMobileMenuOpen(false)}
              style={{
                padding: '8px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#f7f7f2',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#183247',
              }}
              aria-label="Close menu"
            >
              <X style={{ width: '18px', height: '18px' }} />
            </button>
          </div>

          {/* Mobile Navigation Links */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="mobile-nav-link"
                  style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    fontSize: '15px',
                    fontWeight: 600,
                    color: isActive(link.path, link.exact) ? '#187C78' : '#183247',
                    backgroundColor: isActive(link.path, link.exact) ? '#f1f5f4' : 'transparent',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <span style={{ color: isActive(link.path, link.exact) ? '#187C78' : '#667085' }} className="flex items-center shrink-0">
                    {link.defaultIcon}
                  </span>
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>

            {/* Mobile Services Section */}
            <div style={{
              marginTop: '12px',
              padding: '14px',
              borderRadius: '12px',
              backgroundColor: '#f7f7f2',
              border: '1px solid #E5E7EB',
            }}>
              <span style={{
                fontSize: '10px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#667085',
                display: 'block',
                marginBottom: '10px',
              }}>
                Loan Solutions
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {serviceItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="mobile-service-link"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      transition: 'background-color 0.2s ease',
                    }}
                  >
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      backgroundColor: '#ffffff',
                      color: '#187C78',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      border: '1px solid #E5E7EB',
                    }}>
                      {item.icon}
                    </div>
                    <div>
                      <span style={{
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#183247',
                        display: 'block',
                        lineHeight: 1.3,
                      }}>
                        {item.title}
                      </span>
                      <span style={{
                        fontSize: '11px',
                        color: '#667085',
                        display: 'block',
                        lineHeight: 1.3,
                        marginTop: '1px',
                      }}>
                        {item.desc}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Customer Auth & CTA */}
          <div style={{
            padding: '16px 20px',
            borderTop: '1px solid #f1f5f4',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}>
            {!isAuthenticated || !customer ? (
              <div className="p-3 bg-slate-50 border border-slate-200/90 rounded-2xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 shadow-xs">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-brand-navy block">Client Portal</span>
                    <span className="text-[10px] text-slate-500 block">Sign in to track your loan</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    triggerHeaderGoogleLogin();
                  }}
                  disabled={isGoogleSigningIn}
                  className="py-1.5 px-3 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-semibold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <GoogleIcon size={14} />
                  <span>Sign In</span>
                </button>
              </div>
            ) : (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2.5">
                  {customer.picture ? (
                    <img src={customer.picture} alt={customer.name} className="w-8 h-8 rounded-full object-cover border border-slate-300" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-brand-teal text-white font-bold text-xs flex items-center justify-center">
                      {customer.name.charAt(0)}
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-brand-navy truncate">{customer.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{customer.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <Link
                    to="/my-enquiries"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 py-1.5 px-2.5 bg-brand-teal text-white text-center font-semibold text-[11px] rounded-lg"
                  >
                    My Enquiries
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="py-1.5 px-2.5 bg-slate-200 text-slate-700 font-semibold text-[11px] rounded-lg"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}

            <Link
              to="/enquire"
              onClick={() => setMobileMenuOpen(false)}
              className="cta-button"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <span>Apply Now</span>
              <ArrowRight style={{ width: '15px', height: '15px' }} />
            </Link>
          </div>
        </div>
      </div>
      <style>{`
        /* Desktop nav: hide on small screens */
        .desktop-nav {
          display: none !important;
        }
        .desktop-cta {
          display: none !important;
        }
        .mobile-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px;
          border-radius: 10px;
          border: 1px solid #E5E7EB;
          background-color: transparent;
          color: #183247;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .mobile-toggle:hover {
          background-color: #f1f5f4;
        }

        @media (min-width: 1024px) {
          .desktop-nav {
            display: flex !important;
          }
          .desktop-cta {
            display: flex !important;
          }
          .mobile-toggle {
            display: none !important;
          }
        }

        /* Nav Links */
        .nav-link {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 8px 15px;
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 14.5px;
          font-weight: 600;
          color: #112536;
          text-decoration: none;
          border-radius: 9999px;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          white-space: nowrap;
          cursor: pointer;
          border: 1px solid transparent;
          background: transparent;
          letter-spacing: -0.015em;
        }

        .nav-link:hover {
          color: #187C78;
          background-color: rgba(24, 124, 120, 0.08);
          border-color: transparent;
        }

        .nav-link--active {
          color: #187C78;
          font-weight: 650;
          background-color: rgba(24, 124, 120, 0.09);
          border-color: rgba(24, 124, 120, 0.16);
        }

        .nav-link--dropdown {
          font-size: 14.5px;
        }

        /* Creative Nav Icon Morph Animation */
        .nav-icon-morph {
          position: relative;
          width: 17px;
          height: 17px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .nav-icon-default,
        .nav-icon-hover {
          position: absolute;
          inset: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #187C78;
          transition: all 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .nav-icon-default {
          opacity: 1;
          transform: scale(1) rotate(0deg);
        }

        .nav-icon-hover {
          opacity: 0;
          transform: scale(0.3) rotate(-45deg);
          pointer-events: none;
        }

        .nav-link:hover .nav-icon-default {
          opacity: 0;
          transform: scale(0.2) rotate(45deg);
        }

        .nav-link:hover .nav-icon-hover {
          opacity: 1;
          transform: scale(1.15) rotate(0deg);
        }

        .nav-chevron {
          color: #667085;
          flex-shrink: 0;
          transition: transform 0.2s ease, color 0.2s ease;
        }

        .nav-link:hover .nav-chevron,
        .nav-link--active .nav-chevron {
          color: #187C78;
        }

        /* Dropdown */
        .nav-dropdown-wrapper {
          position: relative;
        }

        .dropdown-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 10px;
          text-decoration: none;
          transition: background-color 0.15s ease;
          cursor: pointer;
        }

        .dropdown-item:hover {
          background-color: #f1f5f4;
        }

        .dropdown-item-icon {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background-color: #f1f5f4;
          color: #187C78;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
          transition: all 0.2s ease;
        }

        .dropdown-item:hover .dropdown-item-icon {
          background-color: #187C78;
          color: #ffffff;
          transform: scale(1.05);
        }

        .dropdown-item-title {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #183247;
          line-height: 1.3;
          transition: color 0.15s ease;
        }

        .dropdown-item:hover .dropdown-item-title {
          color: #187C78;
        }

        .dropdown-item-desc {
          display: block;
          font-size: 11px;
          color: #667085;
          line-height: 1.4;
          margin-top: 2px;
        }

        .dropdown-explore-link:hover {
          text-decoration: underline;
        }

        /* CTA Button */
        .cta-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 24px;
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 14.5px;
          font-weight: 600;
          color: #ffffff;
          background: linear-gradient(135deg, #187C78 0%, #105955 100%);
          border: 1px solid rgba(255, 255, 255, 0.22);
          border-radius: 9999px;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 18px rgba(24, 124, 120, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.2);
          position: relative;
          overflow: hidden;
        }

        .cta-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s ease;
        }

        .cta-button:hover::before {
          left: 100%;
        }

        .cta-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(24, 124, 120, 0.6), 0 0 16px rgba(45, 212, 191, 0.35);
          background: linear-gradient(135deg, #1aa39d 0%, #187C78 100%);
          border-color: rgba(255, 255, 255, 0.35);
        }

        .cta-button:active {
          transform: translateY(0);
          box-shadow: 0 2px 8px rgba(24, 124, 120, 0.2);
        }

        /* Mobile Nav Link Hover */
        .mobile-nav-link:hover {
          background-color: #f1f5f4 !important;
        }

        .mobile-service-link:hover {
          background-color: rgba(255,255,255,0.8);
        }
      `}</style>
    </>
  );
};
