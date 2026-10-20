import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from './layouts/PublicLayout';
import { HomePage } from './pages/public/HomePage';
import { HomeLoansPage } from './pages/public/HomeLoansPage';
import { LoanAgainstPropertyPage } from './pages/public/LoanAgainstPropertyPage';
import { PropertyFundingPage } from './pages/public/PropertyFundingPage';
import { ConsultationPage } from './pages/public/ConsultationPage';
import { AboutPage } from './pages/public/AboutPage';
import { HowItWorksPage } from './pages/public/HowItWorksPage';
import { CalculatorPage } from './pages/public/CalculatorPage';
import { FaqsPage } from './pages/public/FaqsPage';
import { ContactPage } from './pages/public/ContactPage';
import { EnquiryPage } from './pages/public/EnquiryPage';

import { AdminLayout } from './layouts/AdminLayout';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminEnquiriesPage } from './pages/admin/AdminEnquiriesPage';
import { AdminAppointmentsPage } from './pages/admin/AdminAppointmentsPage';
import { AdminServicesPage } from './pages/admin/AdminServicesPage';
import { AdminContentPage } from './pages/admin/AdminContentPage';
import { AdminFaqsPage } from './pages/admin/AdminFaqsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

export const App: React.FC = () => {
  return (
    <Routes>
      {/* PUBLIC CUSTOMER EXPERIENCE (MULTI-PAGE CORPORATE ARCHITECTURE) */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        
        {/* Specialized Loan Pages */}
        <Route path="services/home-loans" element={<HomeLoansPage />} />
        <Route path="services/loan-against-property" element={<LoanAgainstPropertyPage />} />
        <Route path="services/property-backed-funding" element={<PropertyFundingPage />} />
        <Route path="services/loan-consultation" element={<ConsultationPage />} />
        
        {/* Company & Advisory Pages */}
        <Route path="about" element={<AboutPage />} />
        <Route path="how-it-works" element={<HowItWorksPage />} />
        <Route path="calculator" element={<CalculatorPage />} />
        <Route path="faqs" element={<FaqsPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="enquire" element={<EnquiryPage />} />
      </Route>

      {/* ADMIN LOGIN */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* PROTECTED ADMIN PORTAL */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="enquiries" element={<AdminEnquiriesPage />} />
        <Route path="appointments" element={<AdminAppointmentsPage />} />
        <Route path="services" element={<AdminServicesPage />} />
        <Route path="content" element={<AdminContentPage />} />
        <Route path="faqs" element={<AdminFaqsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>

      {/* 404 FALLBACK */}
      <Route
        path="*"
        element={
          <div className="min-h-screen bg-brand-ivory flex flex-col items-center justify-center p-4 text-center">
            <h1 className="text-4xl font-extrabold text-brand-navy mb-2">404</h1>
            <p className="text-sm text-brand-slate mb-6">The requested page does not exist.</p>
            <a
              href="/"
              className="px-5 py-2.5 bg-brand-teal text-white rounded-corporate text-xs font-semibold hover:bg-brand-teal-hover transition-colors"
            >
              Return to Homepage
            </a>
          </div>
        }
      />
    </Routes>
  );
};
