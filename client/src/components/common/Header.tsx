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
      title: 'Home Loans',
      desc: 'Purchase, resale, self-construction & balance transfer',
      path: '/services/home-loans',
      icon: <Home className="w-4 h-4" />,
    },
    {
      title: 'Loan Against Property',
      desc: 'Secured funding against residential or commercial assets',
      path: '/services/loan-against-property',
      icon: <Building className="w-4 h-4" />,
    },
    {
      title: 'Property-Backed Funding',
      desc: 'Structured capital & lease rental discounting',
      path: '/services/property-backed-funding',
      icon: <Briefcase className="w-4 h-4" />,
    },
    {
      title: 'Loan Consultation',
      desc: 'Eligibility review, CIBIL analysis & document audit',
      path: '/services/loan-consultation',
      icon: <FileCheck className="w-4 h-4" />,
    },
  ];

  const navLinks = [
    { label: 'Home', path: '/', exact: true },
    { label: 'About Us', path: '/about' },
    { label: 'How It Works', path: '/how-it-works' },
    { label: 'EMI Calculator', path: '/calculator' },
    { label: 'FAQs', path: '/faqs' },
    { label: 'Contact', path: '/contact' },
  ];

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
          transition: 'background-color 0.35s ease, box-shadow 0.35s ease, backdrop-filter 0.35s ease, border-color 0.35s ease',
          backgroundColor: isScrolled ? 'rgba(20, 42, 60, 0.96)' : '#183247',
          backdropFilter: 'blur(16px) saturate(180%)',
          WebkitBackdropFilter: 'blur(16px) saturate(180%)',
          boxShadow: isScrolled
            ? '0 10px 30px -4px rgba(0, 0, 0, 0.5), 0 2px 8px rgba(0,0,0,0.3)'
            : '0 4px 20px -2px rgba(0, 0, 0, 0.35)',
          borderBottom: '1px solid rgba(45, 212, 191, 0.22)',
        }}
      >
        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: isScrolled ? '14px 28px' : '22px 28px',
            transition: 'padding 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            
            {/* ─── Logo ─── */}
            <Link
              to="/"
              style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}
              className="group"
            >
              <WealthAnchorLogo size={isScrolled ? 38 : 44} showWordmark={true} variant="light" />
            </Link>

            {/* ─── Desktop Navigation ─── */}
            <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`nav-link ${isActive(link.path, link.exact) ? 'nav-link--active' : ''}`}
                >
                  {link.label}
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
                  className={`nav-link nav-link--dropdown ${isActive('/services') ? 'nav-link--active' : ''}`}
                >
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

            {/* ─── CTA Button (Desktop) ─── */}
            <div className="desktop-cta">
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
              style={{ color: '#ffffff', background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}
            >
              {mobileMenuOpen ? <X style={{ width: '24px', height: '24px' }} /> : <Menu style={{ width: '24px', height: '24px' }} />}
            </button>
          </div>
        </div>
      </header>

      {/* Header spacer to prevent content jump under fixed header */}
      <div style={{ height: '88px', backgroundColor: '#183247' }} />

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
            <WealthAnchorLogo size={32} showWordmark={true} />
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
                    display: 'block',
                  }}
                >
                  {link.label}
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
