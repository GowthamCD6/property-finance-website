import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { WhatsAppFloatingWidget } from '../components/common/WhatsAppFloatingWidget';
import { SiteContent, Service, Faq } from '../types';
import { getPublicSiteContent, getPublicServices, getPublicFaqs } from '../services/api';

export const PublicLayout: React.FC = () => {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    getPublicSiteContent()
      .then((data) => {
        setContent(data);
        if (data.businessName) {
          document.title = `${data.businessName} | Property Loan Assistance & Advisory`;
        }
      })
      .catch((err) => console.error('Notice: Loading default content', err));

    getPublicServices()
      .then(setServices)
      .catch((err) => console.error('Error fetching services:', err));

    getPublicFaqs()
      .then(setFaqs)
      .catch((err) => console.error('Error fetching FAQs:', err));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f8f4] w-full max-w-full overflow-x-hidden relative">
      <Header content={content} />
      <main className="flex-grow w-full max-w-full">
        <Outlet context={{ content, setContent, services, faqs }} />
      </main>
      <Footer content={content} />
      <WhatsAppFloatingWidget content={content} />
    </div>
  );
};
