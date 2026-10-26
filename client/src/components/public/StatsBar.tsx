import React from 'react';
import { Clock, ShieldCheck, Award, TrendingUp } from 'lucide-react';

export const StatsBar: React.FC = () => {
  const stats = [
    {
      value: 'From 7.25%*',
      label: 'Home Loans & Subsidy',
      sub: 'Self-construction, plots & tiled houses',
      icon: <TrendingUp className="w-5 h-5 text-brand-teal" />,
    },
    {
      value: 'From 8.50%*',
      label: 'Mortgage Loans (LAP)',
      sub: 'Concrete, tiled house, empty land & commercial',
      icon: <Award className="w-5 h-5 text-brand-teal" />,
    },
    {
      value: 'Govt. & Private',
      label: 'Banking Network',
      sub: 'Leading PSU & commercial private banks',
      icon: <Clock className="w-5 h-5 text-brand-teal" />,
    },
    {
      value: 'Low ROI Switch',
      label: 'Bank Takeover Desk',
      sub: 'Private to Govt. bank lowest rate transfer',
      icon: <ShieldCheck className="w-5 h-5 text-brand-teal" />,
    },
  ];

  return (
    <section className="relative z-20 -mt-8 sm:-mt-10 lg:-mt-14 px-4 pb-0">
      <div className="w-[85%] max-w-7xl mx-auto p-6 sm:p-8 rounded-2xl bg-white border border-brand-border/80 shadow-xl shadow-brand-navy/10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((s, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 p-4 rounded-xl bg-brand-ivory/40 border border-brand-border/60 hover:bg-white hover:border-brand-teal/40 hover:shadow-subtle transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-lg bg-brand-teal-light text-brand-teal flex items-center justify-center shrink-0 mt-0.5">
                {s.icon}
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-brand-navy block font-heading">
                  {s.value}
                </span>
                <span className="text-xs sm:text-sm font-bold text-brand-navy block mt-0.5">
                  {s.label}
                </span>
                <span className="text-[11px] text-brand-slate block mt-0.5 leading-snug">
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

