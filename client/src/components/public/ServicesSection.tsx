import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Building, Briefcase, FileCheck, ArrowRight, Landmark } from 'lucide-react';
import { Service } from '../../types';

interface ServicesSectionProps {
  services: Service[];
  onSelectService: (service: Service) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  Home: <Home className="w-6 h-6" />,
  Building: <Building className="w-6 h-6" />,
  Briefcase: <Briefcase className="w-6 h-6" />,
  FileCheck: <FileCheck className="w-6 h-6" />,
  Landmark: <Landmark className="w-6 h-6" />,
};

export const ServicesSection: React.FC<ServicesSectionProps> = ({ services, onSelectService }) => {
  return (
    <section id="services" className="py-20 bg-brand-ivory border-t border-b border-brand-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-block px-3 py-1 rounded bg-brand-teal-light text-brand-teal text-xs font-bold uppercase tracking-wider mb-3">
            Core Service Offerings
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-navy tracking-tight">
            Tailored Property Loan Assistance
          </h2>
          <p className="mt-4 text-brand-slate text-base sm:text-lg leading-relaxed">
            We guide you through the property financing landscape with objective evaluation of institutional lender criteria and structured eligibility support.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => {
            const icon = iconMap[service.iconName] || <Home className="w-6 h-6" />;
            const highlights =
              service.slug === 'home-loans'
                ? ['Up to 30 Yrs Tenure', 'LTV up to 80%–90%', 'Purchase & Resale']
                : service.slug === 'loan-against-property'
                ? ['Residential & Commercial', 'LTV up to 65%–75%', 'Working Capital']
                : service.slug === 'property-backed-funding'
                ? ['High Ticket ₹1 Cr – ₹50 Cr', 'Lease Rental Discounting', 'Structured Debt']
                : ['Pre-Submission Audit', 'CIBIL Dispute Advisory', 'Zero Advance Fee'];

            return (
              <div
                key={service.id}
                className="bg-white rounded-2xl p-6 border border-brand-border shadow-subtle card-hover hover:border-brand-teal/50 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-brand-teal-light text-brand-teal group-hover:bg-brand-teal group-hover:text-white transition-colors flex items-center justify-center mb-5">
                    {icon}
                  </div>
                  <h3 className="text-lg font-bold text-brand-navy tracking-tight mb-2 group-hover:text-brand-teal transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-brand-slate leading-relaxed mb-4">
                    {service.shortDescription}
                  </p>

                  {/* Highlights pills */}
                  <div className="space-y-1.5 mb-5 pb-4 border-b border-gray-100">
                    {highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[11px] text-brand-navy font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-teal"></span>
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <Link
                    to={`/services/${service.slug}`}
                    className="w-full py-2.5 px-3 bg-brand-ivory hover:bg-brand-teal hover:text-white text-brand-navy border border-brand-border text-xs font-semibold rounded-corporate flex items-center justify-center gap-1.5 transition-all text-center"
                  >
                    <span>View Product Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    onClick={() => onSelectService(service)}
                    className="w-full text-center text-[11px] text-brand-teal hover:underline font-semibold py-1 block"
                  >
                    Schedule Assessment for this Loan &darr;
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Disclaimer Note */}
        <div className="mt-12 text-center text-xs text-brand-slate max-w-2xl mx-auto">
          <p>
            * Note: All loan applications are subject to property valuation, legal verification, applicant credit bureau evaluation, and institutional underwriting norms.
          </p>
        </div>
      </div>
    </section>
  );
};
