import React from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Building2,
  Calendar,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';
import { SiteContent, Service } from '../../types';
import { EnquiryForm } from '../../components/public/EnquiryForm';
import { useOutletContext } from 'react-router-dom';

export const ContactPage: React.FC = () => {
  const context = useOutletContext<{ content?: SiteContent | null; services?: Service[] }>();
  const content = context?.content || null;
  const services = context?.services || [];
  const businessName = content?.businessName || 'Vardhan Property Finance Advisory';
  const businessPhone = content?.businessPhone || '+91 98765 43210';
  const businessEmail = content?.businessEmail || 'contact@vardhanfinance.in';
  const officeAddress = content?.officeAddress || 'Suite 402, Prestige Meridian, M.G. Road, Bengaluru, Karnataka 560001';
  const businessHours = content?.businessHours || 'Monday – Saturday: 9:30 AM – 6:30 PM (IST)';
  const disclaimerText = content?.disclaimerText || '';

  return (
    <div className="bg-white">
      {/* 1. Header Banner */}
      <section className="bg-brand-ivory border-b border-brand-border py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-brand-teal-light text-brand-teal text-xs font-bold uppercase tracking-wider mb-4">
              <MapPin className="w-4 h-4" />
              <span>Advisory Office &amp; Connect</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-navy tracking-tight leading-tight">
              Contact Our Advisory Team
            </h1>
            <p className="mt-4 text-brand-slate text-base sm:text-lg leading-relaxed">
              We welcome consultations via scheduled phone calls, video conferences, or by prior appointment at our office in Bengaluru.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Office Information Cards */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className="p-6 bg-brand-ivory/50 rounded-xl border border-brand-border space-y-3">
              <div className="w-10 h-10 rounded-lg bg-brand-teal-light text-brand-teal flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-brand-navy">Office Address</h3>
              <p className="text-xs text-brand-slate leading-relaxed">{officeAddress}</p>
            </div>

            <div className="p-6 bg-brand-ivory/50 rounded-xl border border-brand-border space-y-3">
              <div className="w-10 h-10 rounded-lg bg-brand-teal-light text-brand-teal flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-brand-navy">Direct Advisory Line</h3>
              <p className="text-xs text-brand-slate">Direct line for consultation inquiries:</p>
              <a
                href={`tel:${businessPhone.replace(/\s+/g, '')}`}
                className="font-bold text-sm text-brand-teal hover:underline block"
              >
                {businessPhone}
              </a>
            </div>

            <div className="p-6 bg-brand-ivory/50 rounded-xl border border-brand-border space-y-3">
              <div className="w-10 h-10 rounded-lg bg-brand-teal-light text-brand-teal flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-brand-navy">Email Inquiries</h3>
              <p className="text-xs text-brand-slate">Send requirements or document queries:</p>
              <a
                href={`mailto:${businessEmail}`}
                className="font-bold text-xs text-brand-teal hover:underline block truncate"
              >
                {businessEmail}
              </a>
            </div>

            <div className="p-6 bg-brand-ivory/50 rounded-xl border border-brand-border space-y-3">
              <div className="w-10 h-10 rounded-lg bg-brand-teal-light text-brand-teal flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-brand-navy">Consultation Hours</h3>
              <p className="text-xs text-brand-slate leading-relaxed">{businessHours}</p>
              <span className="text-[11px] text-brand-teal font-semibold block">Prior appointment advised</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Enquiry & Appointment Scheduling Form */}
      <EnquiryForm
        services={services}
        selectedService={null}
        onClearSelectedService={() => {}}
      />
    </div>
  );
};
