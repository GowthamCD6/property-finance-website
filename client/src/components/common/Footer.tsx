import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Phone, Mail, MapPin, Clock, Lock, ArrowUp } from 'lucide-react';
import { SiteContent } from '../../types';
import { PrivacyModal } from './PrivacyModal';

interface FooterProps {
  content?: SiteContent | null;
}

export const Footer: React.FC<FooterProps> = ({ content }) => {
  const [modalType, setModalType] = useState<'privacy' | 'terms' | null>(null);

  const businessName = content?.businessName || 'Vardhan Property Finance Advisory';
  const businessPhone = content?.businessPhone || '+91 98765 43210';
  const businessEmail = content?.businessEmail || 'contact@vardhanfinance.in';
  const officeAddress = content?.officeAddress || 'Suite 402, Prestige Meridian, M.G. Road, Bengaluru, Karnataka 560001';
  const businessHours = content?.businessHours || 'Monday – Saturday: 9:30 AM – 6:30 PM (IST)';
  const disclaimerText = content?.disclaimerText || 'Vardhan Property Finance Advisory is an independent financial consultancy firm. We do not disburse funds or grant loan approvals ourselves. Loan sanctions and terms are subject to lender underwriting criteria.';
  const privacyPolicy = content?.privacyPolicy || 'We respect your confidentiality. Personal and financial details shared are solely used for eligibility assessment and arranging consultations.';
  const termsConditions = content?.termsConditions || 'Information provided on this website is for advisory and consultation scheduling purposes only and does not constitute a formal financial commitment or binding loan offer.';
  const copyrightText = content?.copyrightText || 'Vardhan Property Finance Advisory. All rights reserved.';

  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="bg-[#183247] text-white pt-16 pb-12 border-t border-brand-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-teal flex items-center justify-center text-white">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-lg tracking-tight block text-white leading-tight">
                  {businessName}
                </span>
                <span className="text-xs uppercase tracking-wider text-gray-300 block">
                  Property Loan Advisory
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              Assisting property owners, homebuyers, and business professionals with transparent eligibility analysis and structured lender consultation.
            </p>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-brand-teal-light mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-300">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/services/home-loans" className="hover:text-white transition-colors">Home Loans</Link>
              </li>
              <li>
                <Link to="/services/loan-against-property" className="hover:text-white transition-colors">Loan Against Property</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-white transition-colors">How It Works</Link>
              </li>
              <li>
                <Link to="/calculator" className="hover:text-white transition-colors">EMI Calculator</Link>
              </li>
              <li>
                <Link to="/faqs" className="hover:text-white transition-colors">FAQs</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link>
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
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-brand-teal flex-shrink-0" />
                <a href={`tel:${businessPhone.replace(/\s+/g, '')}`} className="hover:text-white">
                  {businessPhone}
                </a>
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

        {/* Regulatory Disclaimer Box */}
        <div className="py-6 border-b border-white/10 text-xs text-gray-400 leading-relaxed">
          <p className="mb-2">
            <span className="font-semibold text-gray-200">Legal &amp; Regulatory Notice: </span>
            {disclaimerText}
          </p>
        </div>

        {/* Copyright, Policy Links, Admin Portal Access & Back to Top */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <div className="text-center sm:text-left">
            &copy; {currentYear} {copyrightText}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <button
              onClick={() => setModalType('privacy')}
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setModalType('terms')}
              className="hover:text-white transition-colors"
            >
              Terms &amp; Disclaimers
            </button>
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
