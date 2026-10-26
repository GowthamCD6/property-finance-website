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
} from 'lucide-react';
import { SiteContent } from '../../types';
import { WealthAnchorLogo } from './WealthAnchorLogo';

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

  // Scroll handler: always keep header visible, animate background & compact padding on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Check initial scroll position
    handleScroll();
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
          style={{
            maxWidth: '1580px',
            margin: '0 auto',
            padding: isScrolled ? '6px 36px' : '8px 48px',
            transition: 'padding 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            
            {/* ─── Logo (Moved little bit right) ─── */}
            <Link
              to="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                flexShrink: 0,
                marginLeft: '16px',
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

            {/* ─── CTA Button (Desktop - moved little bit left) ─── */}
            <div className="desktop-cta" style={{ marginRight: '16px' }}>
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

          {/* Mobile CTA */}
          <div style={{
            padding: '16px 20px',
            borderTop: '1px solid #f1f5f4',
          }}>
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
    </>
  );
};
