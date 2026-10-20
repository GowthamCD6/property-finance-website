import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Phone,
  Mail,
  Clock,
  MapPin,
  ChevronDown,
  Building2,
  Home,
  Building,
  Briefcase,
  FileCheck,
  Calculator,
  HelpCircle,
  Menu,
  X,
  ArrowRight,
  Shield,
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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click or route change
  useEffect(() => {
    setServicesDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setServicesDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const businessName = content?.businessName || 'WealthAnchor';
  const businessPhone = content?.businessPhone || '+91 98765 43210';
  const businessEmail = content?.businessEmail || 'contact@wealthanchor.in';
  const officeAddress = content?.cityState || 'Bengaluru, Karnataka, India';
  const businessHours = content?.businessHours || 'Mon – Sat: 9:30 AM – 6:30 PM (IST)';

  const serviceItems = [
    {
      title: 'Home Loans',
      desc: 'Purchase, resale, self-construction & balance transfer guidance',
      path: '/services/home-loans',
      icon: <Home className="w-4 h-4 text-brand-teal" />,
    },
    {
      title: 'Loans Against Property (LAP)',
      desc: 'Secured funding against residential or commercial real estate',
      path: '/services/loan-against-property',
      icon: <Building className="w-4 h-4 text-brand-teal" />,
    },
    {
      title: 'Property-Backed Funding',
      desc: 'Structured high-value capital & lease rental discounting (LRD)',
      path: '/services/property-backed-funding',
      icon: <Briefcase className="w-4 h-4 text-brand-teal" />,
    },
    {
      title: 'Loan Consultation & Advisory',
      desc: 'In-depth eligibility review, CIBIL analysis & document audit',
      path: '/services/loan-consultation',
      icon: <FileCheck className="w-4 h-4 text-brand-teal" />,
    },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 bg-white font-sans w-full max-w-full transition-all duration-200">
      {/* 1. TOP UTILITY BAR (Corporate Contact & Advisory Hours) */}
      <div className="bg-brand-navy text-gray-300 text-[11px] border-b border-white/10 hidden md:block select-none w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-2 flex items-center justify-between flex-nowrap whitespace-nowrap overflow-x-auto">
          <div className="flex items-center space-x-6 flex-nowrap shrink-0">
            <span className="flex items-center gap-1.5 shrink-0 whitespace-nowrap">
              <Clock className="w-3.5 h-3.5 text-brand-teal shrink-0" />
              <span>{businessHours}</span>
            </span>
          </div>

          <div className="flex items-center space-x-6 flex-nowrap shrink-0">
            <a
              href={`mailto:${businessEmail}`}
              className="flex items-center gap-1.5 hover:text-white transition-colors shrink-0 whitespace-nowrap"
            >
              <Mail className="w-3.5 h-3.5 text-brand-teal shrink-0" />
              <span>{businessEmail}</span>
            </a>
            <Link
              to="/admin/login"
              className="text-gray-400 hover:text-gray-200 text-[10px] uppercase tracking-wider transition-colors border-l border-white/15 pl-4 shrink-0 whitespace-nowrap"
            >
              Admin Access
            </Link>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVIGATION BAR */}
      <div
        className={`border-b transition-all duration-200 w-full ${
          isScrolled
            ? 'border-brand-border shadow-subtle py-2.5 bg-white/95 backdrop-blur-md'
            : 'border-brand-border/60 py-3.5 bg-white'
        }`}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex items-center justify-between flex-nowrap gap-4">
            {/* Brand Logo & Wordmark (Clean Logo + Only WealthAnchor) */}
            <Link to="/" className="flex items-center text-brand-navy flex-shrink-0 whitespace-nowrap group">
              <WealthAnchorLogo size={40} showWordmark={true} />
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-4 xl:gap-6 2xl:gap-7 text-xs xl:text-sm font-medium text-brand-navy flex-shrink-0 whitespace-nowrap">
              <Link
                to="/"
                className={`py-1.5 transition-colors whitespace-nowrap flex-shrink-0 ${
                  isActive('/') && location.pathname === '/'
                    ? 'text-brand-teal font-semibold border-b-2 border-brand-teal'
                    : 'hover:text-brand-teal'
                }`}
              >
                Home
              </Link>

              {/* Loan Solutions Dropdown */}
              <div className="relative flex-shrink-0 whitespace-nowrap" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                  onMouseEnter={() => setServicesDropdownOpen(true)}
                  className={`inline-flex items-center gap-1 py-1.5 transition-colors focus:outline-none whitespace-nowrap flex-shrink-0 ${
                    isActive('/services')
                      ? 'text-brand-teal font-semibold border-b-2 border-brand-teal'
                      : 'hover:text-brand-teal'
                  }`}
                >
                  <span className="whitespace-nowrap">Loan Solutions</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 flex-shrink-0 transition-transform duration-150 ${
                      servicesDropdownOpen ? 'rotate-180 text-brand-teal' : 'text-brand-slate'
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {servicesDropdownOpen && (
                  <div
                    onMouseLeave={() => setServicesDropdownOpen(false)}
                    className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-modal border border-brand-border p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                  >
                    <div className="p-2 border-b border-gray-100 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-slate block">
                        Our Specialized Loan Products
                      </span>
                    </div>

                    <div className="space-y-1">
                      {serviceItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-brand-teal-light/60 transition-colors group"
                        >
                          <div className="p-2 rounded-md bg-brand-ivory text-brand-teal group-hover:bg-brand-teal group-hover:text-white transition-colors flex-shrink-0 mt-0.5">
                            {item.icon}
                          </div>
                          <div>
                            <span className="font-semibold text-xs text-brand-navy group-hover:text-brand-teal block">
                              {item.title}
                            </span>
                            <span className="text-[11px] text-brand-slate leading-tight block mt-0.5">
                              {item.desc}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>

                    <div className="p-2 mt-1 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-brand-slate">
                      <span>Subject to lender criteria</span>
                      <Link
                        to="/services/home-loans"
                        className="text-brand-teal font-semibold hover:underline"
                      >
                        Explore all &rarr;
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <Link
                to="/about"
                className={`py-1.5 transition-colors whitespace-nowrap flex-shrink-0 ${
                  isActive('/about')
                    ? 'text-brand-teal font-semibold border-b-2 border-brand-teal'
                    : 'hover:text-brand-teal'
                }`}
              >
                About Us
              </Link>

              <Link
                to="/how-it-works"
                className={`py-1.5 transition-colors whitespace-nowrap flex-shrink-0 ${
                  isActive('/how-it-works')
                    ? 'text-brand-teal font-semibold border-b-2 border-brand-teal'
                    : 'hover:text-brand-teal'
                }`}
              >
                How It Works
              </Link>

              <Link
                to="/calculator"
                className={`py-1.5 transition-colors whitespace-nowrap flex-shrink-0 ${
                  isActive('/calculator')
                    ? 'text-brand-teal font-semibold border-b-2 border-brand-teal'
                    : 'hover:text-brand-teal'
                }`}
              >
                EMI Calculator
              </Link>

              <Link
                to="/faqs"
                className={`py-1.5 transition-colors whitespace-nowrap flex-shrink-0 ${
                  isActive('/faqs')
                    ? 'text-brand-teal font-semibold border-b-2 border-brand-teal'
                    : 'hover:text-brand-teal'
                }`}
              >
                FAQs
              </Link>

              <Link
                to="/contact"
                className={`py-1.5 transition-colors whitespace-nowrap flex-shrink-0 ${
                  isActive('/contact')
                    ? 'text-brand-teal font-semibold border-b-2 border-brand-teal'
                    : 'hover:text-brand-teal'
                }`}
              >
                Contact
              </Link>
            </nav>

            {/* Right Action CTA */}
            <div className="hidden lg:flex items-center gap-3 xl:gap-4 flex-shrink-0 whitespace-nowrap">
              <Link
                to="/enquire"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-brand-teal hover:bg-brand-teal-hover transition-all duration-150 rounded-corporate shadow-sm hover:shadow btn-primary-glow shimmer-effect whitespace-nowrap flex-shrink-0"
              >
                <span className="whitespace-nowrap">Apply Now</span>
                <ArrowRight className="w-4 h-4 flex-shrink-0" />
              </Link>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex lg:hidden items-center">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-brand-navy hover:bg-brand-teal-light focus:outline-none"
                aria-label="Toggle navigation drawer"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MOBILE NAVIGATION DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-brand-border bg-white px-4 pt-3 pb-6 space-y-4 shadow-xl animate-in slide-in-from-top-2 duration-150">
          <div className="flex flex-col space-y-2 text-sm font-semibold text-brand-navy">
            <Link
              to="/"
              className="py-2 px-3 rounded-lg hover:bg-brand-teal-light"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>

            <div className="py-2 px-3 border-y border-gray-100">
              <span className="text-xs uppercase tracking-wider text-brand-slate font-bold block mb-2">
                Loan Solutions
              </span>
              <div className="space-y-1.5 pl-2">
                <Link
                  to="/services/home-loans"
                  className="block py-1 text-xs text-brand-navy hover:text-brand-teal"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  &bull; Home Loans (Purchase &amp; Construction)
                </Link>
                <Link
                  to="/services/loan-against-property"
                  className="block py-1 text-xs text-brand-navy hover:text-brand-teal"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  &bull; Loan Against Property (LAP)
                </Link>
                <Link
                  to="/services/property-backed-funding"
                  className="block py-1 text-xs text-brand-navy hover:text-brand-teal"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  &bull; Property-Backed &amp; Commercial Funding
                </Link>
                <Link
                  to="/services/loan-consultation"
                  className="block py-1 text-xs text-brand-navy hover:text-brand-teal"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  &bull; Loan Consultation &amp; Eligibility Audit
                </Link>
              </div>
            </div>

            <Link
              to="/about"
              className="py-2 px-3 rounded-lg hover:bg-brand-teal-light"
              onClick={() => setMobileMenuOpen(false)}
            >
              About Us
            </Link>

            <Link
              to="/how-it-works"
              className="py-2 px-3 rounded-lg hover:bg-brand-teal-light"
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </Link>

            <Link
              to="/calculator"
              className="py-2 px-3 rounded-lg hover:bg-brand-teal-light"
              onClick={() => setMobileMenuOpen(false)}
            >
              EMI Calculator
            </Link>

            <Link
              to="/faqs"
              className="py-2 px-3 rounded-lg hover:bg-brand-teal-light"
              onClick={() => setMobileMenuOpen(false)}
            >
              Frequently Asked Questions
            </Link>

            <Link
              to="/contact"
              className="py-2 px-3 rounded-lg hover:bg-brand-teal-light"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact Us
            </Link>
          </div>

          <div className="pt-2 border-t border-gray-100 flex flex-col space-y-2">
            <Link
              to="/enquire"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-3 px-4 bg-brand-teal hover:bg-brand-teal-hover text-white font-bold text-sm rounded-corporate text-center btn-primary-glow shimmer-effect shadow-sm"
            >
              <span>Apply Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
