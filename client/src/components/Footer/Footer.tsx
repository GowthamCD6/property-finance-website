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
  const disclaimerText = content?.disclaimerText || 'Prime Associates (Prime Associate Loans) is an independent property finance consultancy firm. We do not disburse funds or grant loan approvals ourselves. Loan sanctions and terms are subject to lender underwriting criteria.';
  const privacyPolicy = content?.privacyPolicy || 'We respect your confidentiality. Personal and financial details shared are solely used for eligibility assessment and arranging consultations.';
  const termsConditions = content?.termsConditions || 'Information provided on this website is for advisory and consultation scheduling purposes only and does not constitute a formal financial commitment or binding loan offer.';
  const copyrightText = content?.copyrightText || 'Prime Associates — Loans & Constructions. All rights reserved.';

  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="bg-[#183247] text-white pt-16 pb-12 border-t border-brand-navy">
      <div className="w-[92%] sm:w-[88%] lg:w-[85%] max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Brand & Mission */}
          <div className="space-y-4">
            <Link to="/" className="inline-block group">
              <WealthAnchorLogo size={56} variant="light" alt={businessName} />
            </Link>
            <p className="text-sm text-gray-300 leading-relaxed">
              Get your home loans and mortgage loans at lowest interest rates with government subsidy across government and private banks. Dedicated advisory for self-construction, purchase, and bank takeovers.
            </p>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-brand-teal-light mb-4">
              Loan Solutions
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-300">
              <li>
                <Link to="/services/home-loans" className="hover:text-white transition-colors">Home Loans &amp; Construction</Link>
              </li>
              <li>
                <Link to="/services/loan-against-property" className="hover:text-white transition-colors">Mortgage Loans (LAP)</Link>
              </li>
              <li>
                <Link to="/services/property-backed-funding" className="hover:text-white transition-colors">Purchase Loans &amp; Commercial</Link>
              </li>
              <li>
                <Link to="/services/loan-consultation" className="hover:text-white transition-colors">Vehicle Loans &amp; Bank Takeover</Link>
              </li>
              <li>
                <Link to="/calculator" className="hover:text-white transition-colors">EMI &amp; ROI Calculator</Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-white transition-colors">How It Works</Link>
              </li>
              <li>
                <Link to="/faqs" className="hover:text-white transition-colors">Knowledge Base &amp; FAQs</Link>
              </li>
            </ul>
          </div>


        {/* Contact Details */}
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-brand-teal-light mb-4">
            Advisory Office
          </h4>
          <ul className="space-y-3 text-sm text-gray-300">
            <li className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-brand-teal mt-0.5 flex-shrink-0" />
              <span>{officeAddress}</span>
            </li>
            <li className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-brand-teal mt-0.5 flex-shrink-0" />
              <div className="flex flex-col gap-0.5">
                {businessPhone.split(',').map((num, idx) => (
                  <a
                    key={idx}
                    href={`tel:${num.replace(/[^0-9+]/g, '')}`}
                    className="hover:text-white transition-colors"
                  >
                    {num.trim()}
                  </a>
                ))}
              </div>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-brand-teal flex-shrink-0" />
              <a href={`mailto:${businessEmail}`} className="hover:text-white">
                {businessEmail}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-brand-teal mt-0.5 flex-shrink-0" />
              <span>{businessHours}</span>
            </li>
          </ul>
        </div>

        {/* Compliance & Consultation Note */}
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-brand-teal-light mb-4">
            Consultation Ethics
          </h4>
          <p className="text-xs text-gray-300 leading-relaxed mb-4">
            We uphold responsible lending guidelines. We do not guarantee loan approvals, charge unverified upfront sanction fees, or mislead applicants regarding terms.
          </p>
          <div className="pt-2">
            <Link
              to="/enquire"
              className="inline-block w-full py-2.5 px-4 bg-brand-teal hover:bg-brand-teal-hover text-white text-xs font-semibold rounded-corporate text-center transition-colors shadow-sm"
            >
              Schedule an Assessment
            </Link>
          </div>
        </div>
      </div>


      {/* Copyright, Policy Links, Admin Portal Access & Back to Top */}
      <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
        <div className="text-center sm:text-left">
          &copy; {currentYear} {copyrightText}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6">
          <Link
            to="/privacy-policy"
            className="hover:text-white transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            to="/terms-and-conditions"
            className="hover:text-white transition-colors"
          >
            Terms &amp; Disclaimers
          </Link>
          <a
            href="/admin/login"
            className="inline-flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors"
            title="Admin Portal Sign In"
          >
            <Lock className="w-3.5 h-3.5 text-brand-teal" />
            <span>Admin Access</span>
          </a>
          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1 text-gray-300 hover:text-white transition-colors"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-3.5 h-3.5" />
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