export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface SEORouteConfig {
  title: string;
  description: string;
  canonical: string;
  robots?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  breadcrumbs?: BreadcrumbItem[];
  structuredData?: Record<string, any> | Array<Record<string, any>>;
}

export const BASE_URL = 'https://www.primeassociatesloans.in';

export const DEFAULT_OG_IMAGE =
  'https://res.cloudinary.com/wtwmxi1p/image/upload/f_auto,q_auto:good,w_1200,c_limit/v1793767227/prime-associates/assets/hero-property-finance.jpg';

export const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FinancialService',
  '@id': `${BASE_URL}/#organization`,
  name: 'Prime Associates — Loans & Constructions',
  alternateName: 'Prime Associates Loans',
  url: `${BASE_URL}/`,
  logo: `${BASE_URL}/logo.png`,
  image: DEFAULT_OG_IMAGE,
  description:
    'Prime Associates is a loan advisory and property finance facilitation consultancy founded in 2008 in Tirupur, Tamil Nadu. Specializing in home loans, mortgage loans (LAP), plot purchases, bank takeovers, and vehicle loans.',
  telephone: '+91-9655566613',
  email: 'primeassociates2008@gmail.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'No. 48, 49, P.R. Complex, Binny Compound Main Street, Kumaran Road',
    addressLocality: 'Tirupur',
    addressRegion: 'Tamil Nadu',
    postalCode: '641601',
    addressCountry: 'IN',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:30',
      closes: '18:30',
    },
  ],
  priceRange: '₹₹',
};

export const WEBSITE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${BASE_URL}/#website`,
  url: `${BASE_URL}/`,
  name: 'Prime Associates Loans',
  description: 'Loan Advisory & Financial Guidance in Tirupur, Tamil Nadu',
  publisher: {
    '@id': `${BASE_URL}/#organization`,
  },
  inLanguage: 'en-IN',
};

export const buildBreadcrumbSchema = (breadcrumbs: BreadcrumbItem[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: breadcrumbs.map((crumb, idx) => ({
    '@type': 'ListItem',
    position: idx + 1,
    name: crumb.name,
    item: crumb.url,
  })),
});

export const seoConfig: Record<string, SEORouteConfig> = {
  '/': {
    title: 'Prime Associates Loans – Loan Advisory & Financial Guidance',
    description:
      'Prime Associates provides trusted loan advisory and property financing guidance in Tirupur, Tamil Nadu. Explore home loans, LAP, and takeover solutions.',
    canonical: `${BASE_URL}/`,
    robots: 'index, follow',
    ogTitle: 'Prime Associates Loans – Loan Advisory & Financial Guidance',
    ogDescription:
      'Prime Associates provides trusted loan advisory and property financing guidance in Tirupur, Tamil Nadu. Explore home loans, LAP, and takeover solutions.',
    ogImage: DEFAULT_OG_IMAGE,
    twitterTitle: 'Prime Associates Loans – Loan Advisory & Financial Guidance',
    twitterDescription:
      'Prime Associates provides trusted loan advisory and property financing guidance in Tirupur, Tamil Nadu. Explore home loans, LAP, and takeover solutions.',
    twitterImage: DEFAULT_OG_IMAGE,
    structuredData: [ORGANIZATION_SCHEMA, WEBSITE_SCHEMA],
  },

  '/services/home-loans': {
    title: 'Home Loans in India – Prime Associates Loans',
    description:
      'Expert advisory for home loans, self-construction funding, plot purchases, and government housing subsidies across leading nationalized and private banks.',
    canonical: `${BASE_URL}/services/home-loans`,
    robots: 'index, follow',
    ogTitle: 'Home Loans in India – Prime Associates Loans',
    ogDescription:
      'Expert advisory for home loans, self-construction funding, plot purchases, and government housing subsidies across leading nationalized and private banks.',
    ogImage:
      'https://res.cloudinary.com/wtwmxi1p/image/upload/f_auto,q_auto:good,w_1200,c_limit/v1793767228/prime-associates/assets/home-loan.jpg',
    twitterTitle: 'Home Loans in India – Prime Associates Loans',
    twitterDescription:
      'Expert advisory for home loans, self-construction funding, plot purchases, and government housing subsidies across leading nationalized and private banks.',
    twitterImage:
      'https://res.cloudinary.com/wtwmxi1p/image/upload/f_auto,q_auto:good,w_1200,c_limit/v1793767228/prime-associates/assets/home-loan.jpg',
    breadcrumbs: [
      { name: 'Home', url: `${BASE_URL}/` },
      { name: 'Services', url: `${BASE_URL}/services/home-loans` },
      { name: 'Home Loans', url: `${BASE_URL}/services/home-loans` },
    ],
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Home Loans & Self Construction Advisory',
      serviceType: 'Mortgage and Home Financing Advisory',
      provider: { '@id': `${BASE_URL}/#organization` },
      areaServed: { '@type': 'AdministrativeArea', name: 'Tamil Nadu, India' },
      description:
        'Professional advisory for self-construction funding, plot purchase with construction, and residential property loans across premier banking partners.',
    },
  },

  '/services/loan-against-property': {
    title: 'Loan Against Property – Prime Associates Loans',
    description:
      'Unlock liquidity from registered residential, commercial, or vacant property. Professional loan against property advisory with structured repayments.',
    canonical: `${BASE_URL}/services/loan-against-property`,
    robots: 'index, follow',
    ogTitle: 'Loan Against Property – Prime Associates Loans',
    ogDescription:
      'Unlock liquidity from registered residential, commercial, or vacant property. Professional loan against property advisory with structured repayments.',
    ogImage:
      'https://res.cloudinary.com/wtwmxi1p/image/upload/f_auto,q_auto:good,w_1200,c_limit/v1793767230/prime-associates/assets/lap-loan.jpg',
    twitterTitle: 'Loan Against Property – Prime Associates Loans',
    twitterDescription:
      'Unlock liquidity from registered residential, commercial, or vacant property. Professional loan against property advisory with structured repayments.',
    twitterImage:
      'https://res.cloudinary.com/wtwmxi1p/image/upload/f_auto,q_auto:good,w_1200,c_limit/v1793767230/prime-associates/assets/lap-loan.jpg',
    breadcrumbs: [
      { name: 'Home', url: `${BASE_URL}/` },
      { name: 'Services', url: `${BASE_URL}/services/loan-against-property` },
      { name: 'Loan Against Property', url: `${BASE_URL}/services/loan-against-property` },
    ],
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Loan Against Property (LAP) Advisory',
      serviceType: 'Property Mortgage Financing Advisory',
      provider: { '@id': `${BASE_URL}/#organization` },
      areaServed: { '@type': 'AdministrativeArea', name: 'Tamil Nadu, India' },
      description:
        'Syndication and consultation for secured mortgage loans backed by registered concrete buildings, tiled houses, commercial properties, and empty plots.',
    },
  },

  '/services/purchase-loans': {
    title: 'Property Purchase Loans – Prime Associates Loans',
    description:
      'Guidance on property purchase loans and loan takeover from private lenders to nationalized banks for lower interest burdens and manageable monthly EMIs.',
    canonical: `${BASE_URL}/services/purchase-loans`,
    robots: 'index, follow',
    ogTitle: 'Property Purchase Loans – Prime Associates Loans',
    ogDescription:
      'Guidance on property purchase loans and loan takeover from private lenders to nationalized banks for lower interest burdens and manageable monthly EMIs.',
    ogImage:
      'https://res.cloudinary.com/wtwmxi1p/image/upload/f_auto,q_auto:good,w_1200,c_limit/v1793767254/prime-associates/assets/purchase-loan.jpg',
    twitterTitle: 'Property Purchase Loans – Prime Associates Loans',
    twitterDescription:
      'Guidance on property purchase loans and loan takeover from private lenders to nationalized banks for lower interest burdens and manageable monthly EMIs.',
    twitterImage:
      'https://res.cloudinary.com/wtwmxi1p/image/upload/f_auto,q_auto:good,w_1200,c_limit/v1793767254/prime-associates/assets/purchase-loan.jpg',
    breadcrumbs: [
      { name: 'Home', url: `${BASE_URL}/` },
      { name: 'Services', url: `${BASE_URL}/services/purchase-loans` },
      { name: 'Purchase Loans & Takeover', url: `${BASE_URL}/services/purchase-loans` },
    ],
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Property Purchase Loans & Bank Takeover Advisory',
      serviceType: 'Property Acquisition and Debt Syndication Advisory',
      provider: { '@id': `${BASE_URL}/#organization` },
      areaServed: { '@type': 'AdministrativeArea', name: 'Tamil Nadu, India' },
      description:
        'Consultancy for residential plot acquisition, commercial property purchase, and balance transfers from private NBFCs to nationalized banks.',
    },
  },

  '/services/vehicle-loans': {
    title: 'Vehicle Loans – Prime Associates Loans',
    description:
      'End-to-end auto financing advisory covering new cars, used cars, refinancing, and commercial fleet vehicle funding with transparent documentation.',
    canonical: `${BASE_URL}/services/vehicle-loans`,
    robots: 'index, follow',
    ogTitle: 'Vehicle Loans – Prime Associates Loans',
    ogDescription:
      'End-to-end auto financing advisory covering new cars, used cars, refinancing, and commercial fleet vehicle funding with transparent documentation.',
    ogImage:
      'https://res.cloudinary.com/wtwmxi1p/image/upload/f_auto,q_auto:good,w_1200,c_limit/v1793767257/prime-associates/assets/vehicle-loan.avif',
    twitterTitle: 'Vehicle Loans – Prime Associates Loans',
    twitterDescription:
      'End-to-end auto financing advisory covering new cars, used cars, refinancing, and commercial fleet vehicle funding with transparent documentation.',
    twitterImage:
      'https://res.cloudinary.com/wtwmxi1p/image/upload/f_auto,q_auto:good,w_1200,c_limit/v1793767257/prime-associates/assets/vehicle-loan.avif',
    breadcrumbs: [
      { name: 'Home', url: `${BASE_URL}/` },
      { name: 'Services', url: `${BASE_URL}/services/vehicle-loans` },
      { name: 'Vehicle Loans', url: `${BASE_URL}/services/vehicle-loans` },
    ],
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Vehicle Loans & Auto Refinancing Advisory',
      serviceType: 'Automotive Financing Advisory',
      provider: { '@id': `${BASE_URL}/#organization` },
      areaServed: { '@type': 'AdministrativeArea', name: 'Tamil Nadu, India' },
      description:
        'Structured automotive loan advisory for private passenger cars, pre-owned car refinancing, and commercial transport vehicles.',
    },
  },

  '/about': {
    title: 'About Us – Prime Associates Loans',
    description:
      'Learn about Prime Associates, founded in 2008 in Tirupur. Dedicated to ethical financial consultancy, transparent documentation, and personalized loan guidance.',
    canonical: `${BASE_URL}/about`,
    robots: 'index, follow',
    ogTitle: 'About Us – Prime Associates Loans',
    ogDescription:
      'Learn about Prime Associates, founded in 2008 in Tirupur. Dedicated to ethical financial consultancy, transparent documentation, and personalized loan guidance.',
    ogImage:
      'https://res.cloudinary.com/wtwmxi1p/image/upload/f_auto,q_auto:good,w_1200,c_limit/v1793767218/prime-associates/assets/about-hero-team.jpg',
    twitterTitle: 'About Us – Prime Associates Loans',
    twitterDescription:
      'Learn about Prime Associates, founded in 2008 in Tirupur. Dedicated to ethical financial consultancy, transparent documentation, and personalized loan guidance.',
    twitterImage:
      'https://res.cloudinary.com/wtwmxi1p/image/upload/f_auto,q_auto:good,w_1200,c_limit/v1793767218/prime-associates/assets/about-hero-team.jpg',
    breadcrumbs: [
      { name: 'Home', url: `${BASE_URL}/` },
      { name: 'About Us', url: `${BASE_URL}/about` },
    ],
  },

  '/how-it-works': {
    title: 'How It Works – Prime Associates Loans',
    description:
      'Understand our clear 4-step loan consultancy process: initial consultation, document verification, bank syndication, and doorstep loan disbursement.',
    canonical: `${BASE_URL}/how-it-works`,
    robots: 'index, follow',
    ogTitle: 'How It Works – Prime Associates Loans',
    ogDescription:
      'Understand our clear 4-step loan consultancy process: initial consultation, document verification, bank syndication, and doorstep loan disbursement.',
    ogImage:
      'https://res.cloudinary.com/wtwmxi1p/image/upload/f_auto,q_auto:good,w_1200,c_limit/v1793767229/prime-associates/assets/how-its-work.avif',
    twitterTitle: 'How It Works – Prime Associates Loans',
    twitterDescription:
      'Understand our clear 4-step loan consultancy process: initial consultation, document verification, bank syndication, and doorstep loan disbursement.',
    twitterImage:
      'https://res.cloudinary.com/wtwmxi1p/image/upload/f_auto,q_auto:good,w_1200,c_limit/v1793767229/prime-associates/assets/how-its-work.avif',
    breadcrumbs: [
      { name: 'Home', url: `${BASE_URL}/` },
      { name: 'How It Works', url: `${BASE_URL}/how-it-works` },
    ],
  },

  '/calculator': {
    title: 'Loan EMI Calculator – Prime Associates Loans',
    description:
      'Calculate your prospective monthly EMI, total interest payable, and loan amortization schedule instantly with our interactive financial calculator.',
    canonical: `${BASE_URL}/calculator`,
    robots: 'index, follow',
    ogTitle: 'Loan EMI Calculator – Prime Associates Loans',
    ogDescription:
      'Calculate your prospective monthly EMI, total interest payable, and loan amortization schedule instantly with our interactive financial calculator.',
    ogImage:
      'https://res.cloudinary.com/wtwmxi1p/image/upload/f_auto,q_auto:good,w_1200,c_limit/v1793767219/prime-associates/assets/emi.webp',
    twitterTitle: 'Loan EMI Calculator – Prime Associates Loans',
    twitterDescription:
      'Calculate your prospective monthly EMI, total interest payable, and loan amortization schedule instantly with our interactive financial calculator.',
    twitterImage:
      'https://res.cloudinary.com/wtwmxi1p/image/upload/f_auto,q_auto:good,w_1200,c_limit/v1793767219/prime-associates/assets/emi.webp',
    breadcrumbs: [
      { name: 'Home', url: `${BASE_URL}/` },
      { name: 'EMI Calculator', url: `${BASE_URL}/calculator` },
    ],
  },

  '/faqs': {
    title: 'Loan FAQs – Prime Associates Loans',
    description:
      'Find answers to common questions regarding home loans, mortgage eligibility, documentation requirements, processing timelines, and banking norms.',
    canonical: `${BASE_URL}/faqs`,
    robots: 'index, follow',
    ogTitle: 'Loan FAQs – Prime Associates Loans',
    ogDescription:
      'Find answers to common questions regarding home loans, mortgage eligibility, documentation requirements, processing timelines, and banking norms.',
    ogImage:
      'https://res.cloudinary.com/wtwmxi1p/image/upload/f_auto,q_auto:good,w_1200,c_limit/v1793767222/prime-associates/assets/faqs-hero.webp',
    twitterTitle: 'Loan FAQs – Prime Associates Loans',
    twitterDescription:
      'Find answers to common questions regarding home loans, mortgage eligibility, documentation requirements, processing timelines, and banking norms.',
    twitterImage:
      'https://res.cloudinary.com/wtwmxi1p/image/upload/f_auto,q_auto:good,w_1200,c_limit/v1793767222/prime-associates/assets/faqs-hero.webp',
    breadcrumbs: [
      { name: 'Home', url: `${BASE_URL}/` },
      { name: 'FAQs', url: `${BASE_URL}/faqs` },
    ],
  },

  '/contact': {
    title: 'Contact Prime Associates Loans',
    description:
      'Get in touch with Prime Associates in Tirupur, Tamil Nadu. Schedule a consultation or reach out to our loan advisory desk for expert financial guidance.',
    canonical: `${BASE_URL}/contact`,
    robots: 'index, follow',
    ogTitle: 'Contact Prime Associates Loans',
    ogDescription:
      'Get in touch with Prime Associates in Tirupur, Tamil Nadu. Schedule a consultation or reach out to our loan advisory desk for expert financial guidance.',
    ogImage:
      'https://res.cloudinary.com/wtwmxi1p/image/upload/f_auto,q_auto:good,w_1200,c_limit/v1793767219/prime-associates/assets/contact-hero.webp',
    twitterTitle: 'Contact Prime Associates Loans',
    twitterDescription:
      'Get in touch with Prime Associates in Tirupur, Tamil Nadu. Schedule a consultation or reach out to our loan advisory desk for expert financial guidance.',
    twitterImage:
      'https://res.cloudinary.com/wtwmxi1p/image/upload/f_auto,q_auto:good,w_1200,c_limit/v1793767219/prime-associates/assets/contact-hero.webp',
    breadcrumbs: [
      { name: 'Home', url: `${BASE_URL}/` },
      { name: 'Contact', url: `${BASE_URL}/contact` },
    ],
  },

  '/privacy-policy': {
    title: 'Privacy Policy – Prime Associates Loans',
    description:
      'Read how Prime Associates collects, uses, and safeguards your personal and financial information in strict accordance with data privacy standards.',
    canonical: `${BASE_URL}/privacy-policy`,
    robots: 'index, follow',
    ogTitle: 'Privacy Policy – Prime Associates Loans',
    ogDescription:
      'Read how Prime Associates collects, uses, and safeguards your personal and financial information in strict accordance with data privacy standards.',
    ogImage:
      'https://res.cloudinary.com/wtwmxi1p/image/upload/f_auto,q_auto:good,w_1200,c_limit/v1793767253/prime-associates/assets/privacy-hero-security.jpg',
    twitterTitle: 'Privacy Policy – Prime Associates Loans',
    twitterDescription:
      'Read how Prime Associates collects, uses, and safeguards your personal and financial information in strict accordance with data privacy standards.',
    twitterImage:
      'https://res.cloudinary.com/wtwmxi1p/image/upload/f_auto,q_auto:good,w_1200,c_limit/v1793767253/prime-associates/assets/privacy-hero-security.jpg',
    breadcrumbs: [
      { name: 'Home', url: `${BASE_URL}/` },
      { name: 'Privacy Policy', url: `${BASE_URL}/privacy-policy` },
    ],
  },

  '/terms-and-conditions': {
    title: 'Terms and Conditions – Prime Associates Loans',
    description:
      'Review terms of use, advisory service disclaimers, and website governance policies for Prime Associates Loans consultation and facilitation services.',
    canonical: `${BASE_URL}/terms-and-conditions`,
    robots: 'index, follow',
    ogTitle: 'Terms and Conditions – Prime Associates Loans',
    ogDescription:
      'Review terms of use, advisory service disclaimers, and website governance policies for Prime Associates Loans consultation and facilitation services.',
    ogImage:
      'https://res.cloudinary.com/wtwmxi1p/image/upload/f_auto,q_auto:good,w_1200,c_limit/v1793767256/prime-associates/assets/terms-hero-governance.jpg',
    twitterTitle: 'Terms and Conditions – Prime Associates Loans',
    twitterDescription:
      'Review terms of use, advisory service disclaimers, and website governance policies for Prime Associates Loans consultation and facilitation services.',
    twitterImage:
      'https://res.cloudinary.com/wtwmxi1p/image/upload/f_auto,q_auto:good,w_1200,c_limit/v1793767256/prime-associates/assets/terms-hero-governance.jpg',
    breadcrumbs: [
      { name: 'Home', url: `${BASE_URL}/` },
      { name: 'Terms and Conditions', url: `${BASE_URL}/terms-and-conditions` },
    ],
  },

  // Canonical Alias Fallbacks (pointing directly to their preferred canonical URL)
  '/services/mortgage-loans': {
    title: 'Loan Against Property – Prime Associates Loans',
    description:
      'Unlock liquidity from registered residential, commercial, or vacant property. Professional loan against property advisory with structured repayments.',
    canonical: `${BASE_URL}/services/loan-against-property`,
    robots: 'noindex, follow',
    ogImage: DEFAULT_OG_IMAGE,
  },
  '/services/property-backed-funding': {
    title: 'Property Purchase Loans – Prime Associates Loans',
    description:
      'Guidance on property purchase loans and loan takeover from private lenders to nationalized banks for lower interest burdens and manageable monthly EMIs.',
    canonical: `${BASE_URL}/services/purchase-loans`,
    robots: 'noindex, follow',
    ogImage: DEFAULT_OG_IMAGE,
  },
  '/services/loan-consultation': {
    title: 'Vehicle Loans – Prime Associates Loans',
    description:
      'End-to-end auto financing advisory covering new cars, used cars, refinancing, and commercial fleet vehicle funding with transparent documentation.',
    canonical: `${BASE_URL}/services/vehicle-loans`,
    robots: 'noindex, follow',
    ogImage: DEFAULT_OG_IMAGE,
  },
  '/privacy': {
    title: 'Privacy Policy – Prime Associates Loans',
    description:
      'Read how Prime Associates collects, uses, and safeguards your personal and financial information in strict accordance with data privacy standards.',
    canonical: `${BASE_URL}/privacy-policy`,
    robots: 'noindex, follow',
    ogImage: DEFAULT_OG_IMAGE,
  },
  '/terms': {
    title: 'Terms and Conditions – Prime Associates Loans',
    description:
      'Review terms of use, advisory service disclaimers, and website governance policies for Prime Associates Loans consultation and facilitation services.',
    canonical: `${BASE_URL}/terms-and-conditions`,
    robots: 'noindex, follow',
    ogImage: DEFAULT_OG_IMAGE,
  },
  '/enquire': {
    title: 'Loan Eligibility & Consultation Desk – Prime Associates Loans',
    description:
      'Submit your preliminary loan details for advisory evaluation, government subsidy checks, and multi-bank loan comparison in Tirupur, Tamil Nadu.',
    canonical: `${BASE_URL}/enquire`,
    robots: 'index, follow',
    ogImage: DEFAULT_OG_IMAGE,
    breadcrumbs: [
      { name: 'Home', url: `${BASE_URL}/` },
      { name: 'Enquire', url: `${BASE_URL}/enquire` },
    ],
  },
};
