# Frontend Architecture & Design System Documentation

> **Application:** Prime Associates — Property Finance & Advisory Platform  
> **Framework:** React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons  
> **Brand Identity:** Warm-white & ivory editorial palette, deep navy typography, and muted banking teal accents.

---

## 1. Design System & Visual Tokens

The frontend follows strict visual identity guidelines designed to convey trust, financial authority, and modern digital banking elegance without generic gradients or placeholder imagery.

### Color Palette

| Token Name | Hex Code | HSL / CSS Variable | Usage & Purpose |
|---|---|---|---|
| `brand-navy` | `#0c1a26` / `#183247` | `hsl(208, 52%, 10%)` | Primary headings, executive cards, header bars, hero accents |
| `brand-teal` | `#187C78` | `hsl(177, 68%, 29%)` | Primary call-to-action buttons, active navigation indicators, key icons |
| `brand-teal-hover` | `#126763` | `hsl(177, 70%, 24%)` | Hover states on interactive teal buttons and clickable elements |
| `brand-teal-light` | `#e6f4f3` | `hsl(177, 45%, 93%)` | Badge backgrounds, accent highlights, active pill indicators |
| `brand-ivory` | `#f8f8f4` | `hsl(60, 20%, 97%)` | Editorial warm backgrounds, secondary section panels, card backdrops |
| `brand-slate` | `#4a5568` | `hsl(218, 17%, 35%)` | Secondary body text, descriptions, disclaimer paragraphs |
| `brand-border` | `#e2e8f0` | `hsl(214, 32%, 91%)` | Subtle editorial card borders and divider lines |
| `status-emerald` | `#059669` | `hsl(160, 84%, 39%)` | Verified badges, online indicators, successful GPS captures |

### Typography Hierarchy

- **Heading Font (`font-heading`):** *Plus Jakarta Sans* / *Outfit* / *Inter*  
  Weight: `700` (Bold) & `800` (ExtraBold) with tight letter spacing (`tracking-tight`) for high-impact financial headlines.
- **Body Font (`font-sans`):** *Inter* / *system-ui*  
  Weight: `400` (Regular) & `500` (Medium) with relaxed line heights (`leading-relaxed`) for clear financial legibility.
- **Monospace Font (`font-mono`):** *JetBrains Mono* / *Fira Code* / *ui-monospace*  
  Used exclusively for numerical rates, INR figures (`₹ 75,00,000`), reference IDs (`VPF-2026-100496`), phone numbers, and SHA-256 cryptographic hashes.

---

## 2. Component Architecture & Page Breakdown

```
client/src/
├── components/
│   ├── common/              # WealthAnchorLogo, PrivacyModal, Lightbox
│   ├── layout/              # Header (sticky blur), Footer, AdminLayout, PublicLayout
│   ├── calculators/         # EMI, Eligibility, Balance Transfer Calculators
│   ├── forms/               # EnquiryMultiStepForm, FileUploadDropzone
│   └── admin/               # StatusPills, AdminHeader, QuickMetricsCard
├── pages/
│   ├── public/
│   │   ├── Home/            # Hero, Rate Matrix, Why Choose Us, Testimonials
│   │   ├── Services/        # Detailed Loan Service Catalogues
│   │   ├── Calculators/     # Standalone Financial Calculators
│   │   ├── CustomerPortal/  # /track & /enquiries Real-time Status Tracker
│   │   ├── Contact/         # HQ Address, 4 Advisory Desks, Google Maps
│   │   └── Legal/           # Privacy Policy, Terms of Service, Disclaimer
│   └── admin/
│       ├── Dashboard/       # Pipeline KPIs, Conversion Charts, Recent Feed
│       ├── Enquiries/       # Kanban & Table Pipeline with CSV Export
│       ├── Content/         # Full CMS (11 Live Website Sections)
│       ├── Security/        # API Protection Gateway & SHA-256 Fingerprint
│       └── Appointments/   # Consultation Calendar & Slot Manager
```

### Key Page Features & Implementations

#### 1. Home Page (`HomePage.tsx`)
- **Dynamic Hero Section:** Seamless headline rotator cycling through high-intent phrases (*"Lowest Interest Rates"*, *"Zero Processing Bottlenecks"*, *"40+ Empanelled Banks"*).
- **Responsive Hero SrcSet:** Cloudinary responsive image pipeline with `fetchpriority="high"` for sub-second Largest Contentful Paint (LCP).
- **Live Rate Matrix:** Interactive comparison grid displaying current bank APRs, maximum LTVs (up to 90%), and processing turnarounds.

#### 2. Financial Calculators Suite
- **EMI Amortization Engine:** Computes monthly repayments, total interest payable, and principal-to-interest visual breakdown charts.
- **Eligibility Forecaster:** Evaluates gross salary, existing FOIR (Fixed Obligation to Income Ratio), and generates estimated loan affordability.
- **Balance Transfer & Takeover Calculator:** Calculates net interest savings in INR over the remaining tenure when transferring high-interest loans to nationalized banks.

#### 3. Customer Self-Service Tracker (`MyEnquiriesPage.tsx` / `/track`)
- **Dual-Factor Lookup:** Borrowers track their case using their Application Reference Number (`VPF-YYYY-XXXXXX`) and verified mobile number.
- **Live 6-Stage Timeline:** Real-time visual progress tracker from *Submission* &rarr; *Document Verification* &rarr; *Bank Underwriting* &rarr; *Legal & Valuation* &rarr; *Sanction Letter* &rarr; *Disbursal*.
- **Interactive Document Lightbox Modal:** Fullscreen zoom in/out (up to 300%), 90° clockwise rotation, and pan controls for reviewing uploaded legal deeds and payslips safely.
- **Anti-Scraping Protection:** Strict IP rate limiting (15 attempts per 15 minutes) and cryptographic request headers to prevent brute-force status scraping.

#### 4. Contact & Regional Office Directory (`ContactPage.tsx`)
- **Real-Time IST Working Hours:** Calculates current IST time and live office status (*"Open Now (Closes at 6:30 PM IST)"* vs *"Closed Now"*).
- **4 Specialized Advisory Desks:** Direct contacts for *Land & Home Loans*, *Mortgage (LAP)*, *Bank Takeover*, and *Commercial Funding*.
- **GPS-Synchronized Map Directions:** Automatically reads the admin's device GPS location and links directly to Google Maps navigation (`https://www.google.com/maps?q=lat,lng`).

#### 5. Admin Operations Portal (`AdminLayout.tsx`)
- **Role-Based Guards:** Protects all routes with JWT bearer tokens and Google OAuth admin verification.
- **Live CMS (`AdminContentPage.tsx`):** Instant editing of business credentials, hero headlines, rotating words, rate matrices, milestone timelines, branch offices, and checklist items.
- **Real-Time GPS Location Auto-Detect:** 1-click browser geolocation (`navigator.geolocation.getCurrentPosition({ enableHighAccuracy: true })`) coupled with OpenStreetMap Nominatim reverse geocoding to resolve exact street addresses and Google Maps coordinates automatically.
- **API Protection Deck (`AdminSecurityPage.tsx`):** Executive cyber-security command console featuring live ping verification, timing-safe SHA-256 fingerprint inspection, and key rotation controls.

---

## 3. Image Optimization & Cloudinary CDN Pipeline

All visual assets leverage Cloudinary CDN with automatic format delivery:
- **Responsive Widths:** Responsive `srcset` generated automatically for 640px, 960px, 1280px, and 1920px viewports (`f_auto,q_auto`).
- **WebP & AVIF Delivery:** Modern image codecs served automatically to supporting browsers.
- **Performance Attributes:** Critical hero images use `fetchpriority="high"`, while below-the-fold images use native `loading="lazy"`.

---

## 4. Build & Production Optimization

- **Vite Bundler:** Instant Hot Module Replacement (HMR) during development.
- **Code Splitting:** Dynamic imports for heavy admin modules and visual lightboxes.
- **Strict TypeScript:** Zero `any` leaks on core data models; strict compilation validation via `tsc --noEmit`.
