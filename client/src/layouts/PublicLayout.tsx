import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { Outlet, useLocation, useOutletContext } from 'react-router-dom';
import { Header } from '../components/Header/Header';
import { Footer } from '../components/Footer/Footer';
import { WhatsAppFloatingWidget } from '../components/common/WhatsAppFloatingWidget';
import { SiteContent, Service, Faq } from '../types';
import { getPublicBootstrapData } from '../services/api';

export interface PublicOutletContext {
  content: SiteContent | null;
  setContent: React.Dispatch<React.SetStateAction<SiteContent | null>>;
  services: Service[];
  setServices: React.Dispatch<React.SetStateAction<Service[]>>;
  faqs: Faq[];
  setFaqs: React.Dispatch<React.SetStateAction<Faq[]>>;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const usePublicDataContext = () => useOutletContext<PublicOutletContext>();

export const PublicLayout: React.FC = () => {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
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

  /**
   * Unified Single API Call:
   * Requests all public site data (content, loan services, FAQs) concurrently in a single HTTP request
   * and distributes the received data across all public layout pages and components.
   */
  const loadBootstrapData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getPublicBootstrapData();
      
      if (data.content) {
        setContent(data.content);
      }
      if (Array.isArray(data.services)) {
        setServices(data.services);
      }
      if (Array.isArray(data.faqs)) {
        setFaqs(data.faqs);
      }
    } catch (err: any) {
      console.error('Failed to load initial site data:', err);
      setError(err?.message || 'Failed to initialize site data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBootstrapData();
  }, [loadBootstrapData]);

  const contextValue: PublicOutletContext = {
    content,
    setContent,
    services,
    setServices,
    faqs,
    setFaqs,
    isLoading,
    error,
    refetch: loadBootstrapData,
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f7f3] w-full max-w-full overflow-x-clip relative">
      <Header content={content} />
      <main className="flex-grow w-full max-w-full">
        <Outlet context={contextValue} />
      </main>
      <Footer content={content} />
      <WhatsAppFloatingWidget content={content} />
    </div>
  );
};
