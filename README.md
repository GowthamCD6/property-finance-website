# Prime Associates — Property Finance & Banking Syndication Platform

An enterprise-grade, full-stack digital property finance advisory and loan syndication platform engineered for the Indian financial services landscape.

Tailored for **Prime Associates — Loans & Constructions (Tirupur, Tamil Nadu)**, this platform automates the entire borrower intake lifecycle: from public rate comparisons and financial eligibility calculations to multi-bank underwriting pipelines, secure legal document previews, real-time GPS location discovery, and constant-time cryptographic API protection.

---

## 🌟 Executive Capabilities & Features

### 1. Public Customer Portal (`/`)
- **Editorial Banking Aesthetic:** Built on an editorial warm-white (`#ffffff`) and ivory (`#f8f8f4`) palette, deep navy headings (`#0c1a26`), and banking teal accents (`#187C78`).
- **Dynamic Services Showcase:** Dedicated underwriting tracks for *Home Loans*, *Loans Against Property (LAP)*, *Bank Takeover / Balance Transfers*, and *Commercial Property Syndication*.
- **Comprehensive Financial Calculators:**
  - **EMI Amortization Engine:** Interactive principal vs. interest breakdown charts.
  - **Loan Eligibility Forecaster:** Instant affordability calculations factoring in monthly income and FOIR.
  - **Balance Transfer Savings Calculator:** Compares existing high-interest loans against nationalized bank rates with net rupee savings.
- **Office Location & Direct Advisory Desks:**
  - Real-time IST office status indicator (*Open Now* vs *Closed Now*).
  - 4 Specialized Advisory Desks with direct underwriter telephone lines and 1-click WhatsApp document submission.
  - Interactive Google Maps navigation synchronized dynamically with admin device GPS coordinates.

### 2. Customer Application Tracker (`/track`)
- **Self-Service Status Inquiry:** Borrowers track their loan dossier using their Application Reference Number (`VPF-YYYY-XXXXXX`) and verified mobile number.
- **6-Stage Visual Timeline:** Live progression tracking (*Submission* &rarr; *Document Verification* &rarr; *Bank Underwriting* &rarr; *Legal & Valuation* &rarr; *Sanction Letter* &rarr; *Disbursal*).
- **Document Lightbox Previewer:** Fullscreen zoom in/out (up to 300%), 90-degree rotation, and panning controls for inspecting uploaded property sale deeds and income statements.
- **Anti-Scraping Protection:** Strict IP rate limiting (15 lookups per 15 mins) and cryptographic signatures to prevent phone and reference scraping.

### 3. Administrative Operations Command Portal (`/admin/*`)
- **Dual-Tier Authentication:** Google OAuth 2.0 verification paired with an administrative email allowlist and signed JWT bearer sessions.
- **Full Website Content Management (CMS):** Real-time editing of business hours, contact numbers, hero headlines, rotating keywords, bank rate matrices, and regional branch offices.
- **1-Click GPS Office Location Capture:** Admin captures high-precision device GPS location via browser Geolocation (`navigator.geolocation`) with automatic OpenStreetMap Nominatim reverse geocoding to resolve street addresses and Google Maps directions links.
- **Loan Pipeline & Kanban Desk:** Search, filter, inspect applicant dossiers, update underwriting statuses, log internal case notes, and export RFC 4180-compliant CSV reports.
- **API Protection & Cryptographic Security Keys:** Executive cyber command deck featuring timing-safe SHA-256 memory comparisons (`crypto.timingSafeEqual`), anti-replay millisecond drift windows, live latency verification pings, and 1-click secret key rotation.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Lucide React, React Router v6 |
| **Backend** | Node.js, Express.js, TypeScript, REST API, Zod Runtime Validation |
| **Database & ORM** | TiDB Cloud Serverless / MySQL / PostgreSQL with TLS CA Verification, Prisma ORM |
| **Storage & Media** | Cloudinary CDN with automatic WebP/AVIF formatting & signed document uploads |
| **Security Suite** | SHA-256 HMAC, Constant-Time Buffer Comparison, Anti-Replay Drift Window, Rate Limiting |
| **Authentication** | Google OAuth 2.0 Web Client, Signed JWT Bearer Tokens, Email Allowlist |

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- **Node.js:** v18.0.0 or higher
- **npm:** v9.0.0 or higher
- **Database:** TiDB Cloud Serverless, MySQL 8+, or PostgreSQL cluster with TLS SSL enabled

### 2. Installation
Clone the repository and install root and package dependencies:
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client && npm install

# Install server dependencies
cd ../server && npm install
cd ..
```

### 3. Environment & Database Setup
Configure environment variables using the provided templates:
- `client/.env`: Set `VITE_API_URL`, `VITE_GOOGLE_CLIENT_ID`, and `VITE_ADMIN_API_KEY`.
- `server/.env`: Set `DATABASE_URL`, `JWT_SECRET`, `ADMIN_API_KEY`, and Cloudinary credentials.
*(See detailed guide in [docs/ENVIRONMENT.md](docs/ENVIRONMENT.md))*

Push Prisma schema to the database:
```bash
cd server
npx prisma db push
cd ..
```

### 4. Running the Development Environment
Run both client and server concurrently from the project root:
```bash
# Terminal 1: Start Backend Server (Port 5000)
cd server && npm run dev

# Terminal 2: Start Vite Frontend (Port 5174 or 5173)
cd client && npm run dev
```

- **Public Website:** `http://localhost:5174/`
- **Application Tracker:** `http://localhost:5174/track`
- **Admin Command Portal:** `http://localhost:5174/admin/login`
- **Backend Health Check:** `http://localhost:5000/api/public/health`

---

## 📚 Complete Project Documentation

For in-depth architectural and deployment guides, refer to the documentation suite in `docs/`:

- 🎨 **[Frontend Architecture & Styling Guide](docs/FRONTEND.md)** — Design tokens, color palette, typography hierarchy, component breakdown, calculators, and responsive image pipeline.
- ⚙️ **[Backend Server & API Specifications](docs/SERVER.md)** — Express architecture, Prisma schema, REST endpoints, timing-safe SHA-256 HMAC, anti-replay protection, and Cloudinary storage.
- 🔐 **[Environment & PEM Certificate Guide](docs/ENVIRONMENT.md)** — Exhaustive client/server `.env` variables, TLS Root CA (`isrgrootx1.pem`), and container deployment instructions.

---

## 📄 License & Proprietary Rights
Commercial proprietary application developed for **Prime Associates — Loans & Constructions**. All rights reserved.