import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.resolve(__dirname, '../dist');
const TEMPLATE_PATH = path.join(DIST_DIR, 'index.html');

const BASE_URL = 'https://www.primeassociatesloans.in';
const DEFAULT_OG_IMAGE =
  'https://res.cloudinary.com/wtwmxi1p/image/upload/f_auto,q_auto:good,w_1200,c_limit/v1793767227/prime-associates/assets/hero-property-finance.jpg';

const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FinancialService',
  '@id': `${BASE_URL}/#organization`,
  name: 'Prime Associates — Loans & Constructions',
  alternateName: 'Prime Associates Loans',
  url: `${BASE_URL}/`,
  logo: `${BASE_URL}/logo.png`,
  image: DEFAULT_OG_IMAGE,
  description:
    'Prime Associates is a loan advisory and property financing facilitation consultancy in Tirupur, Tamil Nadu. Established in 2008, the firm assists clients with loan eligibility evaluation, documentation guidance, and syndication across partner banks for home loans, mortgage loans (LAP), plot purchases, bank takeovers, and vehicle loans.',
  telephone: '+91-9655566613',
  email: 'primeassociates2008@gmail.com',
  foundingDate: '2008',
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
};

const WEBSITE_SCHEMA = {
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

const buildBreadcrumbs = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, idx) => ({
    '@type': 'ListItem',
    position: idx + 1,
    name: item.name,
    item: item.url,
  })),
});

const routes = [
  {
    path: '/',
    title: 'Prime Associates Loans – Loan Advisory & Financial Guidance',
    description:
      'Prime Associates provides trusted loan advisory and property financing guidance in Tirupur, Tamil Nadu. Explore home loans, LAP, and takeover solutions.',
    canonical: `${BASE_URL}/`,
    ogImage: DEFAULT_OG_IMAGE,
    structuredData: [ORGANIZATION_SCHEMA, WEBSITE_SCHEMA],
  },
  {
    path: '/services/home-loans',
    title: 'Home Loans in India – Prime Associates Loans',
    description:
      'Expert advisory for home loans, self-construction funding, plot purchases, and government housing subsidies across leading nationalized and private banks.',
    canonical: `${BASE_URL}/services/home-loans`,
    ogImage:
      'https://res.cloudinary.com/wtwmxi1p/image/upload/f_auto,q_auto:good,w_1200,c_limit/v1793767228/prime-associates/assets/home-loan.jpg',
    breadcrumbs: [
      { name: 'Home', url: `${BASE_URL}/` },
      { name: 'Home Loans', url: `${BASE_URL}/services/home-loans` },
    ],
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Home Loans & Self-Construction Advisory',
      serviceType: 'Home Financing & Subsidy Guidance',
      provider: { '@id': `${BASE_URL}/#organization` },
      areaServed: { '@type': 'AdministrativeArea', name: 'Tamil Nadu, India' },
      description:
        'Advisory and documentation guidance for residential self-construction, plot purchase with construction, and home loans, including assistance with government housing subsidy schemes where eligible.',
    },
  },
  {
    path: '/services/loan-against-property',
    title: 'Loan Against Property – Prime Associates Loans',
    description:
      'Unlock liquidity from registered residential, commercial, or vacant property. Professional loan against property advisory with structured repayments.',
    canonical: `${BASE_URL}/services/loan-against-property`,
    ogImage:
      'https://res.cloudinary.com/wtwmxi1p/image/upload/f_auto,q_auto:good,w_1200,c_limit/v1793767230/prime-associates/assets/lap-loan.jpg',
    breadcrumbs: [
      { name: 'Home', url: `${BASE_URL}/` },
      { name: 'Loan Against Property', url: `${BASE_URL}/services/loan-against-property` },
    ],
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Loan Against Property (LAP) Advisory',
      serviceType: 'Mortgage Financing Advisory',
      provider: { '@id': `${BASE_URL}/#organization` },
      areaServed: { '@type': 'AdministrativeArea', name: 'Tamil Nadu, India' },
      description:
        'Consultation and file syndication guidance for secured mortgage loans against registered residential, commercial, or plot property collateral.',
    },
  },
  {
    path: '/services/purchase-loans',
    title: 'Property Purchase Loans – Prime Associates Loans',
    description:
      'Guidance on property purchase loans and loan takeover from private lenders to nationalized banks for lower interest burdens and manageable monthly EMIs.',
    canonical: `${BASE_URL}/services/purchase-loans`,
    ogImage:
      'https://res.cloudinary.com/wtwmxi1p/image/upload/f_auto,q_auto:good,w_1200,c_limit/v1793767254/prime-associates/assets/purchase-loan.jpg',
    breadcrumbs: [
      { name: 'Home', url: `${BASE_URL}/` },
      { name: 'Property Purchase Loans', url: `${BASE_URL}/services/purchase-loans` },
    ],
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Property Purchase Loans & Bank Takeover Advisory',
      serviceType: 'Property Purchase & Takeover Advisory',
      provider: { '@id': `${BASE_URL}/#organization` },
      areaServed: { '@type': 'AdministrativeArea', name: 'Tamil Nadu, India' },
      description:
        'Advisory for plot or property acquisition and consultation for transferring existing loans from private lenders to nationalized banks.',
    },
  },
  {
    path: '/services/vehicle-loans',
    title: 'Vehicle Loans – Prime Associates Loans',
    description:
      'End-to-end auto financing advisory covering new cars, used cars, refinancing, and commercial fleet vehicle funding with transparent documentation.',
    canonical: `${BASE_URL}/services/vehicle-loans`,
    ogImage:
      'https://res.cloudinary.com/wtwmxi1p/image/upload/f_auto,q_auto:good,w_1200,c_limit/v1793767257/prime-associates/assets/vehicle-loan.avif',
    breadcrumbs: [
      { name: 'Home', url: `${BASE_URL}/` },
      { name: 'Vehicle Loans', url: `${BASE_URL}/services/vehicle-loans` },
    ],
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Vehicle Loans & Auto Refinancing Advisory',
      serviceType: 'Vehicle Finance Advisory',
      provider: { '@id': `${BASE_URL}/#organization` },
      areaServed: { '@type': 'AdministrativeArea', name: 'Tamil Nadu, India' },
      description:
        'Guidance and documentation facilitation for new car loans, used car purchase loans, refinancing, and commercial vehicle finance.',
    },
  },
  {
    path: '/about',
    title: 'About Us – Prime Associates Loans',
    description:
      'Learn about Prime Associates, founded in 2008 in Tirupur. Dedicated to ethical financial consultancy, transparent documentation, and personalized loan guidance.',
    canonical: `${BASE_URL}/about`,
    ogImage:
      'https://res.cloudinary.com/wtwmxi1p/image/upload/f_auto,q_auto:good,w_1200,c_limit/v1793767218/prime-associates/assets/about-hero-team.jpg',
    breadcrumbs: [
      { name: 'Home', url: `${BASE_URL}/` },
      { name: 'About Us', url: `${BASE_URL}/about` },
    ],
  },
  {
    path: '/how-it-works',
    title: 'How It Works – Prime Associates Loans',
    description:
      'Understand our clear 4-step loan consultancy process: initial consultation, document verification, bank syndication, and doorstep loan disbursement.',
    canonical: `${BASE_URL}/how-it-works`,
    ogImage:
      'https://res.cloudinary.com/wtwmxi1p/image/upload/f_auto,q_auto:good,w_1200,c_limit/v1793767229/prime-associates/assets/how-its-work.avif',
    breadcrumbs: [
      { name: 'Home', url: `${BASE_URL}/` },
      { name: 'How It Works', url: `${BASE_URL}/how-it-works` },
    ],
  },
  {
    path: '/calculator',
    title: 'Loan EMI Calculator – Prime Associates Loans',
    description:
      'Calculate your prospective monthly EMI, total interest payable, and loan amortization schedule instantly with our interactive financial calculator.',
    canonical: `${BASE_URL}/calculator`,
    ogImage:
      'https://res.cloudinary.com/wtwmxi1p/image/upload/f_auto,q_auto:good,w_1200,c_limit/v1793767219/prime-associates/assets/emi.webp',
    breadcrumbs: [
      { name: 'Home', url: `${BASE_URL}/` },
      { name: 'Loan EMI Calculator', url: `${BASE_URL}/calculator` },
    ],
  },
  {
    path: '/faqs',
    title: 'Loan FAQs – Prime Associates Loans',
    description:
      'Find answers to common questions regarding home loans, mortgage eligibility, documentation requirements, processing timelines, and banking norms.',
    canonical: `${BASE_URL}/faqs`,
    ogImage:
      'https://res.cloudinary.com/wtwmxi1p/image/upload/f_auto,q_auto:good,w_1200,c_limit/v1793767222/prime-associates/assets/faqs-hero.webp',
    breadcrumbs: [
      { name: 'Home', url: `${BASE_URL}/` },
      { name: 'Loan FAQs', url: `${BASE_URL}/faqs` },
    ],
  },
  {
    path: '/contact',
    title: 'Contact Prime Associates Loans',
    description:
      'Get in touch with Prime Associates in Tirupur, Tamil Nadu. Schedule a consultation or reach out to our loan advisory desk for expert financial guidance.',
    canonical: `${BASE_URL}/contact`,
    ogImage:
      'https://res.cloudinary.com/wtwmxi1p/image/upload/f_auto,q_auto:good,w_1200,c_limit/v1793767219/prime-associates/assets/contact-hero.webp',
    breadcrumbs: [
      { name: 'Home', url: `${BASE_URL}/` },
      { name: 'Contact Us', url: `${BASE_URL}/contact` },
    ],
  },
  {
    path: '/privacy-policy',
    title: 'Privacy Policy – Prime Associates Loans',
    description:
      'Read how Prime Associates collects, uses, and safeguards your personal and financial information in strict accordance with data privacy standards.',
    canonical: `${BASE_URL}/privacy-policy`,
    ogImage:
      'https://res.cloudinary.com/wtwmxi1p/image/upload/f_auto,q_auto:good,w_1200,c_limit/v1793767253/prime-associates/assets/privacy-hero-security.jpg',
    breadcrumbs: [
      { name: 'Home', url: `${BASE_URL}/` },
      { name: 'Privacy Policy', url: `${BASE_URL}/privacy-policy` },
    ],
  },
  {
    path: '/terms-and-conditions',
    title: 'Terms and Conditions – Prime Associates Loans',
    description:
      'Review terms of use, advisory service disclaimers, and website governance policies for Prime Associates Loans consultation and facilitation services.',
    canonical: `${BASE_URL}/terms-and-conditions`,
    ogImage:
      'https://res.cloudinary.com/wtwmxi1p/image/upload/f_auto,q_auto:good,w_1200,c_limit/v1793767256/prime-associates/assets/terms-hero-governance.jpg',
    breadcrumbs: [
      { name: 'Home', url: `${BASE_URL}/` },
      { name: 'Terms and Conditions', url: `${BASE_URL}/terms-and-conditions` },
    ],
  },
];

const prerender = () => {
  if (!fs.existsSync(TEMPLATE_PATH)) {
    console.error(`[prerender] Error: Template file not found at ${TEMPLATE_PATH}`);
    process.exit(1);
  }

  const templateHtml = fs.readFileSync(TEMPLATE_PATH, 'utf8');

  console.log(`[prerender] Starting static HTML generation for ${routes.length} canonical routes...`);

  routes.forEach((route) => {
    let html = templateHtml;

    // 1. Replace Title
    html = html.replace(/<title>.*?<\/title>/i, `<title>${route.title}</title>`);

    // 2. Replace Canonical URL
    if (html.includes('rel="canonical"')) {
      html = html.replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i, `<link rel="canonical" href="${route.canonical}" />`);
    } else {
      html = html.replace('</head>', `  <link rel="canonical" href="${route.canonical}" />\n</head>`);
    }

    // 3. Replace Meta Description
    if (html.includes('name="description"')) {
      html = html.replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i, `<meta name="description" content="${route.description}" />`);
    } else {
      html = html.replace('</head>', `  <meta name="description" content="${route.description}" />\n</head>`);
    }

    // 4. Ensure Robots Meta
    if (html.includes('name="robots"')) {
      html = html.replace(/<meta\s+name="robots"\s+content="[^"]*"\s*\/?>/i, '<meta name="robots" content="index, follow" />');
    } else {
      html = html.replace('</head>', '  <meta name="robots" content="index, follow" />\n</head>');
    }

    // 5. Open Graph Tags
    const ogTags = [
      { prop: 'og:type', val: 'website' },
      { prop: 'og:site_name', val: 'Prime Associates Loans' },
      { prop: 'og:locale', val: 'en_IN' },
      { prop: 'og:title', val: route.title },
      { prop: 'og:description', val: route.description },
      { prop: 'og:url', val: route.canonical },
      { prop: 'og:image', val: route.ogImage || DEFAULT_OG_IMAGE },
    ];

    ogTags.forEach(({ prop, val }) => {
      const regex = new RegExp(`<meta\\s+property="${prop}"\\s+content="[^"]*"\\s*\\/?>`, 'i');
      if (regex.test(html)) {
        html = html.replace(regex, `<meta property="${prop}" content="${val}" />`);
      } else {
        html = html.replace('</head>', `  <meta property="${prop}" content="${val}" />\n</head>`);
      }
    });

    // 6. Twitter Card Tags
    const twitterTags = [
      { name: 'twitter:card', val: 'summary_large_image' },
      { name: 'twitter:title', val: route.title },
      { name: 'twitter:description', val: route.description },
      { name: 'twitter:image', val: route.ogImage || DEFAULT_OG_IMAGE },
    ];

    twitterTags.forEach(({ name, val }) => {
      const regex = new RegExp(`<meta\\s+name="${name}"\\s+content="[^"]*"\\s*\\/?>`, 'i');
      if (regex.test(html)) {
        html = html.replace(regex, `<meta name="${name}" content="${val}" />`);
      } else {
        html = html.replace('</head>', `  <meta name="${name}" content="${val}" />\n</head>`);
      }
    });

    // 7. Inject Route-Specific JSON-LD
    let jsonLdScripts = '';
    if (route.structuredData) {
      jsonLdScripts += `\n  <script type="application/ld+json" id="jsonld-route">\n${JSON.stringify(route.structuredData, null, 2)}\n  </script>`;
    }
    if (route.breadcrumbs && route.breadcrumbs.length > 0) {
      jsonLdScripts += `\n  <script type="application/ld+json" id="jsonld-breadcrumbs">\n${JSON.stringify(buildBreadcrumbs(route.breadcrumbs), null, 2)}\n  </script>`;
    }

    if (jsonLdScripts) {
      // Remove any existing baseline JSON-LD script from index template to prevent duplicate structured data
      html = html.replace(/<script\s+type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/gi, '');
      html = html.replace('</head>', `${jsonLdScripts}\n</head>`);
    }

    // 8. Output Destination
    if (route.path === '/') {
      fs.writeFileSync(TEMPLATE_PATH, html, 'utf8');
      console.log(`[prerender]  ✓ / -> dist/index.html`);
    } else {
      const cleanPath = route.path.replace(/^\//, '');
      const targetDir = path.join(DIST_DIR, cleanPath);
      fs.mkdirSync(targetDir, { recursive: true });

      const targetIndexPath = path.join(targetDir, 'index.html');
      fs.writeFileSync(targetIndexPath, html, 'utf8');

      // Also create clean HTML file (e.g. dist/services/home-loans.html) for Vercel cleanUrls support
      const targetHtmlFile = path.join(DIST_DIR, `${cleanPath}.html`);
      fs.mkdirSync(path.dirname(targetHtmlFile), { recursive: true });
      fs.writeFileSync(targetHtmlFile, html, 'utf8');

      console.log(`[prerender]  ✓ ${route.path} -> dist/${cleanPath}/index.html & dist/${cleanPath}.html`);
    }
  });

  console.log('[prerender] Successfully prerendered all 12 canonical routes with complete raw HTML metadata & JSON-LD!');
};

prerender();
