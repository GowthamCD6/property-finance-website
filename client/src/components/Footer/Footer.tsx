import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Phone, Mail, MapPin, Clock, Lock, ArrowUp } from 'lucide-react';
import { SiteContent } from '../../types';
import { PrivacyModal } from '../common/PrivacyModal';
import { WealthAnchorLogo } from '../common/WealthAnchorLogo';

interface FooterProps {
  content?: SiteContent | null;
}

export const Footer: React.FC<FooterProps> = ({ content }) => {
  const [modalType, setModalType] = useState<'privacy' | 'terms' | null>(null);

  const businessName = content?.businessName || 'Prime Associates — Loans & Constructions';
  const businessPhone = content?.businessPhone || '+91 96555 66613, +91 95144 66600';
  const businessEmail = content?.businessEmail || 'primeassociates2008@gmail.com';
  const officeAddress = content?.officeAddress || 'No. 48, 49, P.R. Complex, Binny Compound Main Street, Kumaran Road, Tirupur - 641601';
  const businessHours = content?.businessHours || 'Monday – Saturday: 9:30 AM – 6:30 PM (IST)';
  const disclaimerText = content?.disclaimerText || 'Prime Associates (Prime Associates Loans) is an independent property finance consultancy firm. We do not disburse funds or grant loan approvals ourselves. Loan sanctions and terms are subject to lender underwriting criteria.';
  const privacyPolicy = content?.privacyPolicy || 'We respect your confidentiality. Personal and financial details shared are solely used for eligibility assessment and arranging consultations.';
  const termsConditions = content?.termsConditions || 'Information provided on this website is for advisory and consultation scheduling purposes only and does not constitute a formal financial commitment or binding loan offer.';
  const copyrightText = content?.copyrightText || 'Prime Associates — Loans & Constructions. All rights reserved.';

  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="bg-[#183247] text-white pt-12 sm:pt-16 pb-8 sm:pb-12 border-t border-brand-navy">
      <div className="w-[92%] sm:w-[88%] lg:w-[85%] max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 pb-8 sm:pb-12 border-b border-white/10">
          {/* 1. Brand & Mission */}
          <div className="space-y-3.5">
            <Link to="/" className="inline-block group">
              <WealthAnchorLogo size={52} variant="light" alt={businessName} />
            </Link>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-sm">
              {content?.tagline ||
                'Get your home loans and mortgage loans at lowest interest rates with government subsidy across government and private banks. Dedicated advisory for self-construction, purchase, and bank takeovers.'}
            </p>

            {/* Social & Location Channels */}
            {(() => {
              let social: { facebook?: string; instagram?: string; linkedin?: string; mapUrl?: string; twitter?: string; youtube?: string } = {};
              try {
                if (content?.socialLinks) {
                  social = typeof content.socialLinks === 'string' ? JSON.parse(content.socialLinks) : content.socialLinks;
                }
              } catch {
                social = {};
              }

              const hasLinks = social.facebook || social.instagram || social.linkedin || social.mapUrl;
              if (!hasLinks) return null;

              return (
                <div className="pt-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-brand-teal-light block mb-2">
                    Connect With Us
                  </span>
                  <div className="flex items-center gap-2">
                    {social.facebook && (
                      <a
                        href={social.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8.5 h-8.5 rounded-lg bg-white/10 hover:bg-brand-teal text-gray-300 hover:text-white flex items-center justify-center transition-colors shadow-xs"
                        aria-label="Facebook Page"
                      >
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      </a>
                    )}
                    {social.instagram && (
                      <a
                        href={social.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8.5 h-8.5 rounded-lg bg-white/10 hover:bg-brand-teal text-gray-300 hover:text-white flex items-center justify-center transition-colors shadow-xs"
                        aria-label="Instagram Profile"
                      >
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                      </a>
                    )}
                    {social.linkedin && (
                      <a
                        href={social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8.5 h-8.5 rounded-lg bg-white/10 hover:bg-brand-teal text-gray-300 hover:text-white flex items-center justify-center transition-colors shadow-xs"
                        aria-label="LinkedIn Profile"
                      >
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                      </a>
                    )}
                    {social.mapUrl && (
                      <a
                        href={social.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8.5 h-8.5 rounded-lg bg-white/10 hover:bg-brand-teal text-gray-300 hover:text-white flex items-center justify-center transition-colors shadow-xs"
                        aria-label="Google Maps Office Location"
                        title="View Office on Google Maps"
                      >
                        <MapPin className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* 2. Quick Navigation - 2 columns on mobile, 1 on desktop for compact height */}
          <div>
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-brand-teal-light mb-3 sm:mb-4">
              Loan Solutions & Tools
            </h4>
            <ul className="grid grid-cols-2 sm:grid-cols-1 gap-x-3 gap-y-2 text-xs sm:text-sm text-gray-300">
              <li>
                <Link to="/services/home-loans" className="hover:text-white hover:underline transition-colors block py-0.5">
                  Home Loans
                </Link>
              </li>
              <li>
                <Link to="/services/loan-against-property" className="hover:text-white hover:underline transition-colors block py-0.5">
                  Mortgage Loans (LAP)
                </Link>
              </li>
              <li>
                <Link to="/services/purchase-loans" className="hover:text-white hover:underline transition-colors block py-0.5">
                  Purchase Loans
                </Link>
              </li>
              <li>
                <Link to="/services/vehicle-loans" className="hover:text-white hover:underline transition-colors block py-0.5">
                  Vehicle Loans
                </Link>
              </li>
              <li>
                <Link to="/calculator" className="hover:text-white hover:underline transition-colors block py-0.5">
                  EMI Calculator
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-white hover:underline transition-colors block py-0.5">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white hover:underline transition-colors block py-0.5">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="hover:text-white hover:underline transition-colors block py-0.5">
                  Knowledge Base & FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. Advisory Office Contact */}
          <div>
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-brand-teal-light mb-3 sm:mb-4">
              Advisory Office
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-gray-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-teal mt-0.5 shrink-0" />
                <span className="leading-relaxed">{officeAddress}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-brand-teal mt-1 shrink-0" />
                <div className="flex flex-wrap gap-1.5">
                  {businessPhone.split(',').map((num, idx) => (
                    <a
                      key={idx}
                      href={`tel:${num.replace(/[^0-9+]/g, '')}`}
                      className="inline-flex items-center px-2 py-0.5 rounded bg-white/5 hover:bg-white/15 border border-white/10 text-slate-200 hover:text-white transition-colors"
                    >
                      {num.trim()}
                    </a>
                  ))}
                </div>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-teal shrink-0" />
                <a href={`mailto:${businessEmail}`} className="hover:text-white truncate">
                  {businessEmail}
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-[11px] sm:text-xs text-gray-400">
                <Clock className="w-3.5 h-3.5 text-brand-teal mt-0.5 shrink-0" />
                <span>{businessHours}</span>
              </li>
            </ul>
          </div>

          {/* 4. Compliance & Assessment CTA */}
          <div className="space-y-3">
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-brand-teal-light mb-3 sm:mb-4">
              Consultation Ethics
            </h4>
            <p className="text-[11px] sm:text-xs text-gray-300 leading-relaxed">
              {content?.registrationDetails ||
                'We uphold responsible lending guidelines. We do not guarantee loan approvals, charge unverified upfront sanction fees, or mislead applicants regarding terms.'}
            </p>
            <div className="pt-1">
              <Link
                to="/enquire"
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-brand-teal hover:bg-brand-teal-hover text-white text-xs font-bold rounded-lg text-center transition-colors shadow-sm"
              >
                <span>Schedule an Assessment</span>
                <ArrowUp className="w-3.5 h-3.5 rotate-45" />
              </Link>
            </div>
          </div>
        </div>

        {/* 5. Copyright, Policy Links, Admin Portal & Back to Top */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between text-[11px] sm:text-xs text-gray-400 gap-3 sm:gap-4 text-center md:text-left">
          <div>
            &copy; {currentYear} {copyrightText}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-6 gap-y-2">
            <Link
              to="/privacy-policy"
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <span className="text-gray-600 hidden xs:inline">•</span>
            <Link
              to="/terms-and-conditions"
              className="hover:text-white transition-colors"
            >
              Terms &amp; Disclaimers
            </Link>
            <span className="text-gray-600 hidden xs:inline">•</span>
            <a
              href="/admin/login"
              className="inline-flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
              title="Admin Portal Sign In"
            >
              <Lock className="w-3 h-3 text-brand-teal" />
              <span>Admin Access</span>
            </a>
            <span className="text-gray-600 hidden xs:inline">•</span>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-3 h-3" />
              <span>Top</span>
            </button>
          </div>
        </div>
      </div>

    {/* Modals for Privacy and Terms */}
      <PrivacyModal
        isOpen={modalType === 'privacy'}
        onClose={() => setModalType(null)}
        title="Privacy Notice & Data Handling"
        content={privacyPolicy}
        disclaimer={disclaimerText}
      />
      <PrivacyModal
        isOpen={modalType === 'terms'}
        onClose={() => setModalType(null)}
        title="Terms of Service & Advisory Scope"
        content={termsConditions}
        disclaimer={disclaimerText}
      />
    </footer>
  );
};