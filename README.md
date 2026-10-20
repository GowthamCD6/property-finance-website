# Vardhan Property Finance Advisory — Production Website & Admin Portal

A full-stack, production-oriented property-backed loan assistance and advisory web application tailored for the Indian financial services landscape.

Built with strict visual identity guidelines (editorial corporate warm-white/ivory palette, muted teal accents, deep navy typography, and genuine licensed property photography), complete relational database persistence, full client and server validation, rate limiting, and a secure operations admin portal.

---

## 🌟 Key Highlights

### A. Public Customer Website (`/`)
- **Direct Access**: First-time visitors land directly on the public homepage without any registration or login barrier.
- **Editorial Design System**:
  - Warm White (`#FFFFFF`) & Ivory (`#F7F7F2`) backgrounds.
  - Deep Navy typography (`#183247`).
  - Muted Teal (`#187C78`) & Darker Teal (`#126763`) action buttons.
  - Slate Grey (`#667085`) secondary copy & subtle borders (`#E5E7EB`).
  - High-resolution authentic property photography with fallbacks.
  - Zero emojis as icons, zero dark-mode landing pages, zero purple gradients.
- **Dynamic Services Showcase**:
  - Home Loans (purchase, self-construction, balance transfers).
  - Loans Against Property (LAP for residential & commercial property).
  - Property-Backed Funding (collateralized funding structures).
  - Loan Consultation & Eligibility Reviews.
  - "Enquire Now" links that preselect the chosen service in the form.
- **Interactive Loan Enquiry & Consultation Scheduler**:
  - Live formatted INR amount preview (e.g., `₹ 75,00,000` / `75 Lakhs`).
  - Dynamic slot availability check against backend calendar rules.
  - Future date verification and double-booking prevention.
  - Explicit privacy consent checkbox (never preselected).
  - Generates unique reference numbers (e.g. `VPF-2026-100496`).
- **Dynamic FAQ Accordion**: Category tabs, expandable panels, and clear advisory statements.
- **Ethical Compliance & Disclaimers**: Clear disclosure that the business is an independent advisory firm and not a bank/NBFC; no false approval or interest rate promises.

### B. Admin Operations Portal (`/admin/*`)
- **Protected Dedicated Route**: `/admin/login` guarded by bcrypt password hashing and JWT authentication.
- **Calculated Dashboard KPIs**: Live metrics computed from real database records (total enquiries, new submissions, follow-ups needed, upcoming meetings, confirmed slots).
- **Comprehensive Pipeline Management**:
  - Search by applicant name, phone, reference number, or city.
  - Filter by status, loan type, and date range.
  - Detail drawer with full application specifications.
  - Status updates (`New` &rarr; `Contacted` &rarr; `Follow-up Required` &rarr; `Appointment Confirmed` &rarr; `In Review` &rarr; `Converted` &rarr; `Closed`).
  - Internal case notes timeline.
  - Complete status transition audit trail.
  - RFC 4180-compliant CSV Export.
- **Appointment Management**:
  - Confirm requested slots.
  - Reschedule slots with automated double-booking conflict checks.
  - Cancel with mandatory reason logging.
- **Live Website Content Management**:
  - Live editable business name, phone, email, address, working hours.
  - Hero headline, subtitle, primary/secondary CTA text, hero image URL.
  - About Us narrative, photography, and regulatory notices.
  - Changes persist directly to the database and reflect immediately on the public website.
- **Services & FAQs CRUD**: Add, edit, reorder, toggle visibility, and delete services and FAQs.
- **Availability & Blackout Calendar Settings**: Weekly hours configuration and holiday blackout dates.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS (custom brand tokens), Lucide React, React Router v6 |
| **Backend** | Node.js, Express, TypeScript, REST API, Zod Runtime Validation |
| **Database** | Prisma ORM, SQLite (local zero-dependency development), PostgreSQL ready |
| **Security** | bcryptjs (salt rounds 10), JSON Web Tokens, Helmet security headers, Express Rate Limit, Cookie-parser |
| **Testing** | Vitest, Supertest (16 comprehensive integration tests) |

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Initialize Database & Seed
```bash
cd server
npx prisma db push
npx tsx src/database/seed.ts
cd ..
```

### 3. Run Development Servers
```bash
npm run dev
```
- **Public Website**: `http://localhost:5174/` (or `5173`)
- **Admin Portal**: `http://localhost:5174/admin/login`
- **Backend API**: `http://localhost:5000/api/public`

---

## 🔐 Default Admin Credentials

| Key | Value |
|---|---|
| **Portal URL** | `http://localhost:5174/admin/login` |
| **Email** | `admin@vardhanfinance.in` |
| **Password** | `Admin@123456` |
| **Role** | Super Administrator |

---

## 🧪 Automated Test Suite

Run all 16 integration tests:
```bash
npm test
```

---

## 📁 Repository Structure

```
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/       # Header, Footer, PrivacyModal
│   │   │   └── public/       # Hero, ServicesSection, WhyWorkWithUs, HowItWorks, EnquiryForm, FaqSection
│   │   ├── context/          # AuthContext (JWT session management)
│   │   ├── layouts/          # PublicLayout, AdminLayout (sidebar + auth guards)
│   │   ├── pages/
│   │   │   ├── public/       # HomePage
│   │   │   └── admin/        # Dashboard, Enquiries, Appointments, Content, Services, FAQs, Settings
│   │   ├── services/         # Typed API client
│   │   ├── types/            # TypeScript data contracts
│   │   ├── index.css         # Brand design tokens & resets
│   │   └── App.tsx           # Route definitions
│   └── tailwind.config.js    # Strict brand palette colors
│
├── server/
│   ├── src/
│   │   ├── __tests__/        # Vitest & Supertest integration suite
│   │   ├── config/           # Typed environment configuration
│   │   ├── controllers/      # Public, Auth, and Admin controllers
│   │   ├── database/         # Prisma client & seed script
│   │   ├── middleware/       # Auth guard, rate limiters, error handler
│   │   ├── routes/           # Public, Auth, Admin routers
│   │   ├── utils/            # Reference generator, notifications
│   │   ├── validators/       # Zod schemas (enquiry, auth, content)
│   │   ├── app.ts            # Express application instance
│   │   └── index.ts          # Server listener entrypoint
│   └── prisma/
│       └── schema.prisma     # Relational schema (8 models)
│
└── docs/
    ├── SETUP.md              # Local setup guide
    ├── API.md                # Comprehensive REST API specifications
    └── DEPLOYMENT.md         # Production deployment guide (PostgreSQL, Nginx, PM2, SSL)
```

---

## 📄 License
Commercial proprietary license for Vardhan Property Finance Advisory.
