import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '../components/Header/Header';
import { Footer } from '../components/Footer/Footer';
import { WhatsAppFloatingWidget } from '../components/common/WhatsAppFloatingWidget';
import { SiteContent, Service, Faq } from '../types';
import { getPublicSiteContent, getPublicServices, getPublicFaqs } from '../services/api';

export const PublicLayout: React.FC = () => {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const location = useLocation();

  // Instant scroll to top (Hero section) before paint on every route change
  useLayoutEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [location.pathname, location.search]);

  useEffect(() => {
    getPublicSiteContent()
      .then((data) => {
        setContent(data);
        if (data.businessName) {
          document.title = `${data.businessName} — Your Loan Advisory Partner`;
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
    <div className="min-h-screen flex flex-col bg-[#f8f8f4] w-full max-w-full overflow-x-clip relative">
      <Header content={content} />
      <main className="flex-grow w-full max-w-full">
        <Outlet context={{ content, setContent, services, faqs }} />
      </main>
      <Footer content={content} />
      <WhatsAppFloatingWidget content={content} />
    </div>
  );
};
