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
    name: 'Shyamsundar Chaure',
    role: 'Self-Employed Professional',
    location: 'Bengaluru, Karnataka',
    product: 'Home Construction Loan',
    rating: 5,
    content:
      'Constructing a home on our family plot was delayed over 5 years due to bank layout queries. Prime Associate Loans audited our document chain, aligned with the right lender, and expedited tranche sanction in 10 days.',
    amount: '₹65 Lakhs Sanctioned',
    highlight: 'Turned dream into reality without hassle',
    lenderTag: 'SBI Home Loan',
  },
  {
    id: 'rev-2',
    name: 'Naresh Ganesh Shelar',
    role: 'MSME Manufacturing Owner',
    location: 'Whitefield, Bengaluru',
    product: 'Loan Against Property (LAP)',
    rating: 5,
    content:
      'Availed a loan against our industrial shed to expand production. The entire process was structured, digital, and transparent with no hidden fees or broker cuts. Outstanding advisory.',
    amount: '₹1.80 Crore Sanctioned',
    highlight: 'Smooth, fast & transparent working capital',
    lenderTag: 'ICICI Bank LAP',
  },
  {
    id: 'rev-3',
    name: 'Priyanka & Rajesh Menon',
    role: 'Senior IT Consultants',
    location: 'Sarjapur Road, Bengaluru',
    product: 'Resale Home Loan + Top-Up',
    rating: 5,
    content:
      'Our apartment purchase involved seller balance transfer and tripartite escrow. The advisory team guided us step-by-step through title clearance and secured an 8.45% repo-linked rate.',
    amount: '₹95 Lakhs Sanctioned',
    highlight: 'Complex legal title scrutiny resolved',
    lenderTag: 'HDFC Bank',
  },
  {
    id: 'rev-4',
    name: 'Anand & Meera Kulkarni',
    role: 'NRI Tech Lead & Dubai Resident',
    location: 'Indiranagar / Dubai UAE',
    product: 'NRI Home Loan',
    rating: 5,
    content:
      'Securing property finance in India while residing in Dubai was seamless. From drafting the specific POA to handling local banker verification, sanction arrived smoothly in 12 days.',
    amount: '₹2.40 Crore Sanctioned',
    highlight: 'Seamless NRI power of attorney & digital KYC',
    lenderTag: 'Kotak Mahindra Bank',
  },
  {
    id: 'rev-5',
    name: 'Karthik V. Raman',
    role: 'Product Architect',
    location: 'HSR Layout, Bengaluru',
    product: 'Balance Transfer + Top-Up',
    rating: 5,
    content:
      'Our existing private bank loan was stuck at 9.60%. Prime Associate Loans audited our schedule, executed a clean balance transfer to BOB at 8.45%, and secured a ₹15 Lakh home renovation top-up.',
    amount: '₹82 Lakhs Sanctioned',
    highlight: 'Slashed rate by 115 bps & saved ₹18 Lakhs',
    lenderTag: 'Bank of Baroda',
  },
  {
    id: 'rev-6',
    name: 'Dr. Arvind & Sneha Swaminathan',
    role: 'Surgeon & Clinic Founder',
    location: 'Koramangala, Bengaluru',
    product: 'Commercial Property Purchase',
    rating: 5,
    content:
      'Commercial premise loans demand strict valuation and cash-flow assessment. The team structured our audited financials seamlessly, securing prompt approval without collateral haircut.',
    amount: '₹3.25 Crore Sanctioned',
    highlight: 'Quick sanction for clinic premises',
    lenderTag: 'Axis Bank Commercial',
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
    <section className="py-12 sm:py-16 bg-brand-ivory/60 border-b border-brand-border/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
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
