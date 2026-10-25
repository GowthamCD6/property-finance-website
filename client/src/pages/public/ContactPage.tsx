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
  ArrowRight,
  ExternalLink,
  Navigation,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { SiteContent, Service } from '../../types';
import { EnquiryForm } from '../../components/public/EnquiryForm';
import { useOutletContext } from 'react-router-dom';

export const ContactPage: React.FC = () => {
  const context = useOutletContext<{ content?: SiteContent | null; services?: Service[] }>();
  const content = context?.content || null;
  const services = context?.services || [];

  const businessName = content?.businessName || 'WealthAnchor Property Finance Advisory';
  const businessPhone = content?.businessPhone || '+91 98765 43210';
  const businessEmail = content?.businessEmail || 'contact@wealthanchor.in';
  const officeAddress = content?.officeAddress || 'Suite 402, Prestige Meridian, M.G. Road, Bengaluru, Karnataka 560001';
  const businessHours = content?.businessHours || 'Monday – Saturday: 9:30 AM – 6:30 PM (IST)';

  const regionalDesks = [
    {
      region: 'Bengaluru Central & East',
      focus: 'Home Loans, Whitefield Tech Corridor, Sarjapur Villa Projects',
      desk: 'M.G. Road Headquarters',
      phone: businessPhone,
    },
    {
      region: 'Bengaluru North & Devanahalli',
      focus: 'Airport Plotted Land Layouts, BIAAPA Approvals & Commercial Parks',
      desk: 'North Bengaluru Advisory Desk',
      phone: businessPhone,
    },
    {
      region: 'Bengaluru South & Electronic City',
      focus: 'High-Value LAP, Industrial Warehousing & Resale Apartments',
      desk: 'South Corridor Cell',
      phone: businessPhone,
    },
    {
      region: 'NRI & International Borrowers Desk',
      focus: 'Power of Attorney (POA), NRE/NRO Mortgage & Video Consultations',
      desk: 'Cross-Border Advisory Desk',
      phone: businessPhone,
    },
  ];

  return (
    <div className="bg-white">
      {/* 1. Header Hero Banner */}
      <section className="relative bg-gradient-to-br from-brand-navy via-[#102434] to-[#0A1824] text-white pt-20 pb-20 lg:pt-24 lg:pb-24 border-b border-white/10 overflow-hidden">
        {/* Ambient Backdrops */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-teal/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-teal/20 border border-brand-teal/30 text-brand-teal-light text-xs font-bold uppercase tracking-wider mb-5">
              <MapPin className="w-4 h-4 text-brand-teal" />
              <span>Direct Advisory Desk &amp; Office Access</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight font-heading leading-tight sm:leading-tight">
              Contact Our Senior <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-teal via-emerald-400 to-brand-gold">
                Land &amp; Mortgage Advisors
              </span>
            </h1>

            <p className="mt-5 text-gray-300 text-base sm:text-lg lg:text-xl font-normal leading-relaxed max-w-3xl">
              We welcome private consultations via phone, video conference, or scheduled in-person meetings at our corporate office in Bengaluru. Speak directly with experienced credit underwriting professionals.
            </p>

            {/* Direct Connect Pills */}
            <div className="mt-8 flex flex-wrap gap-4 items-center">
              <a
                href={`tel:${businessPhone.replace(/\s+/g, '')}`}
                className="px-7 py-3.5 bg-brand-teal hover:bg-brand-teal-hover text-white text-sm font-bold rounded-corporate shadow-lg shadow-brand-teal/20 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>Call Advisory Desk: {businessPhone}</span>
              </a>
              <a
                href={`mailto:${businessEmail}`}
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-corporate text-sm font-semibold transition-all backdrop-blur-sm flex items-center gap-2"
              >
                <Mail className="w-4 h-4 text-brand-teal" />
                <span>Email Document Dossiers</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Primary Office & Contact Cards */}
      <section className="py-16 sm:py-20 bg-brand-ivory/60 border-b border-brand-border">
        <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Office Address */}
            <div className="p-7 bg-white rounded-3xl border border-brand-border shadow-subtle space-y-4 hover:border-brand-teal/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-brand-teal-light text-brand-teal flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-brand-navy font-heading">Corporate Office</h3>
                <span className="text-[11px] font-semibold text-brand-teal">Prestige Meridian, Bengaluru</span>
              </div>
              <p className="text-xs sm:text-sm text-brand-slate leading-relaxed">
                {officeAddress}
              </p>
              <div className="pt-2 text-xs text-brand-slate font-medium">
                <span>Landmark: Opposite Trinity Metro Station (M.G. Road)</span>
              </div>
            </div>

            {/* Card 2: Phone Hotline */}
            <div className="p-7 bg-white rounded-3xl border border-brand-border shadow-subtle space-y-4 hover:border-brand-teal/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-brand-teal-light text-brand-teal flex items-center justify-center">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-brand-navy font-heading">Direct Advisory Line</h3>
                <span className="text-[11px] font-semibold text-emerald-600">Mon–Sat • 9:30 AM to 6:30 PM</span>
              </div>
              <p className="text-xs text-brand-slate leading-relaxed">
                Direct telephonic review with senior credit managers:
              </p>
              <a
                href={`tel:${businessPhone.replace(/\s+/g, '')}`}
                className="text-base font-black text-brand-navy font-mono hover:text-brand-teal transition-colors block"
              >
                {businessPhone}
              </a>
              <span className="text-[11px] text-gray-400 block">Confidential &amp; soft-check verified</span>
            </div>

            {/* Card 3: Email Inquiries */}
            <div className="p-7 bg-white rounded-3xl border border-brand-border shadow-subtle space-y-4 hover:border-brand-teal/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-brand-teal-light text-brand-teal flex items-center justify-center">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-brand-navy font-heading">Document Review Email</h3>
                <span className="text-[11px] font-semibold text-brand-teal">Encrypted Mail Portal</span>
              </div>
              <p className="text-xs text-brand-slate leading-relaxed">
                Transmit title documents, draft sale deeds, or ITR copies for audit:
              </p>
              <a
                href={`mailto:${businessEmail}`}
                className="text-xs sm:text-sm font-bold text-brand-navy hover:text-brand-teal transition-colors block truncate font-mono"
              >
                {businessEmail}
              </a>
              <span className="text-[11px] text-gray-400 block">Avg. response time: 2 to 4 business hours</span>
            </div>

            {/* Card 4: Consultation Timings */}
            <div className="p-7 bg-white rounded-3xl border border-brand-border shadow-subtle space-y-4 hover:border-brand-teal/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-brand-teal-light text-brand-teal flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-brand-navy font-heading">Consultation Hours</h3>
                <span className="text-[11px] font-semibold text-brand-gold">In-Person &amp; Virtual</span>
              </div>
              <p className="text-xs sm:text-sm text-brand-slate leading-relaxed">
                {businessHours}
              </p>
              <div className="pt-2 text-xs font-semibold text-brand-teal">
                <span>Prior appointment advised for dedicated conference slots</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Regional Advisory Desks Matrix */}
      <section className="py-16 sm:py-20 bg-white border-b border-brand-border">
        <div className="max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-teal block mb-1">
              Geographic Specialization
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-navy font-heading tracking-tight">
              Specialized Regional Lending Desks
            </h2>
            <p className="mt-3 text-brand-slate text-sm sm:text-base leading-relaxed">
              Property regulations and layout approvals differ across micro-markets. Our advisors specialize by zone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {regionalDesks.map((desk, idx) => (
              <div
                key={idx}
                className="p-6 bg-brand-ivory/50 rounded-2xl border border-brand-border space-y-3 hover:border-brand-teal/40 transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-brand-navy text-white flex items-center justify-center font-bold text-xs">
                  0{idx + 1}
                </div>
                <h3 className="font-bold text-base text-brand-navy font-heading">{desk.region}</h3>
                <p className="text-xs text-brand-slate leading-relaxed">{desk.focus}</p>
                <div className="pt-3 border-t border-brand-border/60 text-xs font-semibold text-brand-teal">
                  <span>{desk.desk}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Ethics & Grievance Protocol */}
          <div className="mt-12 p-6 bg-brand-ivory rounded-2xl border border-brand-border flex items-start gap-3.5 text-xs text-brand-slate leading-relaxed">
            <ShieldCheck className="w-5 h-5 text-brand-teal flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-brand-navy block mb-0.5">Advisory Governance &amp; Ethics Commitment:</span>
              WealthAnchor never charges hidden upfront loan sanction fees, guarantees unverified sanctions, or retains original deeds without formal legal custody vouchers. For compliance or feedback inquiries, contact our advisory board directly at compliance@wealthanchor.in.
            </div>
          </div>
        </div>
      </section>

      {/* 4. Enquiry & Appointment Scheduling Form */}
      <div id="enquiry-form">
        <EnquiryForm
          services={services}
          selectedService={null}
          onClearSelectedService={() => {}}
        />
      </div>
    </div>
  );
};
