import React, { useState, useMemo } from 'react';
import { Star, MapPin, CheckCircle } from 'lucide-react';

interface Review {
  id: string;
  name: string;
  role: string;
  location: string;
  product: string;
  rating: number;
  content: string;
  amount: string;
  highlight: string;
  lenderTag: string;
}

const REVIEWS: Review[] = [
  {
    id: 'rev-1',
    name: 'Senthilkumar & Devika',
    role: 'Textile Business Proprietor',
    location: 'Tirupur, Tamil Nadu',
    product: 'Self Construction Loan + Subsidy',
    rating: 5,
    content:
      'Constructing our home on an owned site was delayed due to documentation queries. Prime Associates audited our building plan, applied for the central government subsidy, and sanctioned our loan at 7.25% in 8 days.',
    amount: '₹65 Lakhs Sanctioned',
    highlight: '7.25% interest rate + Government subsidy unlocked',
    lenderTag: 'SBI Home Loan',
  },
  {
    id: 'rev-2',
    name: 'Murugesan K.',
    role: 'Garment Export Unit Founder',
    location: 'Binny Compound, Tirupur',
    product: 'Loan Against Property (LAP)',
    rating: 5,
    content:
      'Availed a mortgage loan against our concrete commercial building to expand working capital. Prime Associates secured an 8.50% rate across government banks with zero hidden charges. Highly recommended!',
    amount: '₹1.80 Crore Sanctioned',
    highlight: '8.50% LAP on concrete building without advance fees',
    lenderTag: 'Bank of Baroda LAP',
  },
  {
    id: 'rev-3',
    name: 'Ramesh & Anitha Sundaram',
    role: 'Land Buyer & Builder',
    location: 'Kumaran Road, Tirupur',
    product: 'Plot Purchase + Construction Loan',
    rating: 5,
    content:
      'We wanted to buy an empty plot and construct a new house together. The team structured a single composite sanction letter with phased construction disbursements and full title scrutiny.',
    amount: '₹85 Lakhs Sanctioned',
    highlight: 'Integrated composite plot and construction funding',
    lenderTag: 'Punjab National Bank',
  },
  {
    id: 'rev-4',
    name: 'Suresh Kumar V.',
    role: 'Apparel Manufacturer',
    location: 'Coimbatore, Tamil Nadu',
    product: 'Private to Govt. Bank Takeover',
    rating: 5,
    content:
      'Our existing loan with a private NBFC was charging 10.80% interest. Prime Associates transferred the loan to a government bank at 7.25%, slashing our EMI and saving us over ₹22 Lakhs in interest!',
    amount: '₹1.10 Crore Takeover',
    highlight: 'Saved 355 bps by switching from private to PSU bank',
    lenderTag: 'State Bank of India',
  },
  {
    id: 'rev-5',
    name: 'Dr. Rajendran & Gomathi',
    role: 'Clinic Founder & Heritage Owner',
    location: 'Erode, Tamil Nadu',
    product: 'Tiled House Purchase & Renovation',
    rating: 5,
    content:
      'Traditional tiled houses often face valuation issues at standard banks. Prime Associates handled the legal clearances and arranged funding for both purchase and renovation at benchmark rates.',
    amount: '₹75 Lakhs Sanctioned',
    highlight: 'Smooth funding for ancestral tiled house property',
    lenderTag: 'Canara Bank',
  },
  {
    id: 'rev-6',
    name: 'Dhandapani P.',
    role: 'Logistics Fleet Operator',
    location: 'Tirupur, Tamil Nadu',
    product: 'Commercial Vehicle & Car Refinance',
    rating: 5,
    content:
      'Needed immediate liquidity against our transport vehicles and cars. Prime Associates arranged quick refinancing with minimal paperwork and transparent terms within 4 days.',
    amount: '₹42 Lakhs Sanctioned',
    highlight: 'Fast vehicle refinance and liquidity release',
    lenderTag: 'Vehicle Finance Desk',
  },
];

const ReviewCard: React.FC<{
  review: Review;
  ariaHidden?: boolean;
  onHoverChange: (hovered: boolean) => void;
}> = ({ review: r, ariaHidden, onHoverChange }) => {
  return (
    <div
      aria-hidden={ariaHidden}
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
      onTouchStart={() => onHoverChange(true)}
      onTouchEnd={() => onHoverChange(false)}
      className="bg-white rounded-2xl p-6 sm:p-7 border border-brand-border/80 shadow-subtle flex flex-col justify-between shrink-0 w-[330px] sm:w-[380px] lg:w-[410px] transition-all duration-300 hover:-translate-y-1 hover:shadow-card hover:border-brand-teal/40 cursor-pointer relative select-none"
    >
      <div>
        {/* Rating & Product Tag */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-1">
            {[...Array(r.rating)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded bg-brand-teal-light text-brand-teal border border-brand-teal/20 truncate max-w-[210px]">
            {r.product}
          </span>
        </div>

        {/* Highlight Quote Headline */}
        <h3 className="font-bold text-sm sm:text-base text-brand-navy tracking-tight mb-2.5 font-heading leading-snug">
          "{r.highlight}"
        </h3>

        {/* Review Narrative Content */}
        <p className="text-xs sm:text-sm text-brand-slate leading-relaxed mb-6">
          {r.content}
        </p>
      </div>

      {/* Author & Sanction Footer */}
      <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-xs sm:text-sm text-brand-navy truncate block">
              {r.name}
            </span>
            <span title="Verified Customer" className="inline-flex items-center">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            </span>
          </div>
          <span className="text-[11px] text-brand-slate flex items-center gap-1 mt-0.5 truncate">
            <MapPin className="w-3 h-3 text-brand-teal shrink-0" />
            <span className="truncate">{r.location}</span>
          </span>
        </div>

        <div className="text-right shrink-0">
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200/60 block whitespace-nowrap">
            {r.amount}
          </span>
          <span className="text-[10px] text-brand-slate block mt-0.5 font-medium">
            {r.lenderTag}
          </span>
        </div>
      </div>
    </div>
  );
};

export const TestimonialsSection: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  // Repeat reviews for seamless, infinite looping
  const repeatedReviews = useMemo(() => {
    return [...REVIEWS, ...REVIEWS];
  }, []);

  return (
    <section className="py-12 sm:py-16 bg-transparent overflow-hidden">
      <div className="w-[85%] max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-brand-teal-light text-brand-teal text-xs font-bold tracking-wider uppercase mb-3">
            <Star className="w-3.5 h-3.5 fill-brand-teal" />
            <span>Verified Customer Stories</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-navy tracking-tight font-heading">
            Trusted by 1,000+ Indian Homebuyers &amp; Entrepreneurs
          </h2>
          <p className="mt-2.5 text-sm sm:text-base text-brand-slate leading-relaxed">
            Real feedback from borrowers who secured prompt sanctions through our transparent multi-lender advisory.
          </p>
        </div>

        {/* Dynamic Left-to-Right Continuous Sliding Track */}
        <div className="relative w-screen left-1/2 -translate-x-1/2 overflow-hidden my-2">
          {/* Subtle Edge Gradient Fades for Seamless Panoramic Look */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-r from-[#F7F7F2] via-[#F7F7F2]/90 to-transparent z-20" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-l from-[#F7F7F2] via-[#F7F7F2]/90 to-transparent z-20" />

          {/* Sliding Track: Left to Right Continuous Hardware Acceleration */}
          <div
            className="animate-continuous-scroll-reverse flex items-stretch gap-5 sm:gap-6 py-4 px-6 sm:px-12 select-none"
            style={{
              animationPlayState: isHovered ? 'paused' : 'running',
            }}
          >
            {/* Set 1 */}
            {repeatedReviews.map((r, idx) => (
              <ReviewCard
                key={`r1-${r.id}-${idx}`}
                review={r}
                onHoverChange={setIsHovered}
              />
            ))}

            {/* Set 2 (Exact Duplicate for Infinite Loop) */}
            {repeatedReviews.map((r, idx) => (
              <ReviewCard
                key={`r2-${r.id}-${idx}`}
                review={r}
                ariaHidden
                onHoverChange={setIsHovered}
              />
            ))}
          </div>
        </div>

        {/* Clean Trust Proof Metrics Strip */}
        <div className="mt-10 bg-white rounded-2xl border border-brand-border p-6 sm:p-7 shadow-2xs">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center space-y-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-brand-navy font-heading">
                1,000+
              </span>
              <span className="text-xs text-brand-slate font-medium">
                Sanctions Assisted
              </span>
            </div>

            <div className="flex flex-col items-center space-y-1 border-l border-gray-100">
              <span className="text-2xl sm:text-3xl font-extrabold text-brand-teal font-heading flex items-center gap-1">
                4.9<Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              </span>
              <span className="text-xs text-brand-slate font-medium">
                Customer Rating
              </span>
            </div>

            <div className="flex flex-col items-center space-y-1 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0">
              <span className="text-2xl sm:text-3xl font-extrabold text-brand-navy font-heading">
                ₹350+ Cr
              </span>
              <span className="text-xs text-brand-slate font-medium">
                Loan Volume Advised
              </span>
            </div>

            <div className="flex flex-col items-center space-y-1 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-heading">
                100%
              </span>
              <span className="text-xs text-brand-slate font-medium">
                Direct Lender Login
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
