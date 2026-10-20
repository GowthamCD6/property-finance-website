import React from 'react';
import { Clock, ShieldCheck, Award, Users, TrendingUp } from 'lucide-react';

export const StatsBar: React.FC = () => {
  const stats = [
    {
      value: '₹500+ Cr',
      label: 'Loan Inquiries Guided',
      sub: 'Across residential & commercial properties',
      icon: <TrendingUp className="w-5 h-5 text-brand-teal" />,
    },
    {
      value: '24–48 Hrs',
      label: 'Fast-Track Underwriting',
      sub: 'Accelerated preliminary lender sanctions',
      icon: <Clock className="w-5 h-5 text-brand-teal" />,
    },
    {
      value: '40+ Lenders',
      label: 'Partner Banking Network',
      sub: 'Top PSU banks, private banks & HFCs',
      icon: <Award className="w-5 h-5 text-brand-teal" />,
    },
    {
      value: '98.8%',
      label: 'Clean File Approval Rate',
      sub: 'Thorough pre-login legal & title audit',
      icon: <ShieldCheck className="w-5 h-5 text-brand-teal" />,
    },
  ];

  return (
    <section className="bg-brand-navy text-white py-10 sm:py-12 border-y border-white/10 relative z-10">
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((s, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-brand-teal/20 flex items-center justify-center shrink-0 mt-0.5">
                {s.icon}
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white block font-mono">
                  {s.value}
                </span>
                <span className="text-xs sm:text-sm font-bold text-gray-200 block mt-0.5">
                  {s.label}
                </span>
                <span className="text-[11px] text-gray-400 block mt-0.5">
                  {s.sub}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
