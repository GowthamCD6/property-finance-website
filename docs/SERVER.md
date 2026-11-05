# Backend Server & API Architecture Documentation

> **Server Environment:** Node.js (v18+), Express.js, TypeScript  
> **Database & ORM:** TiDB Cloud Serverless / MySQL / PostgreSQL with TLS/SSL CA verification, Prisma ORM  
> **Security Suite:** SHA-256 HMAC, Constant-Time Buffer Evaluation, Anti-Replay Drift Window, Rate Limiting

---

## 1. Architectural Overview

The backend is built following the **Controller-Service-Repository Pattern** using Express and TypeScript. It exposes RESTful APIs consumed by the public client, customer self-service tracker, and administrative command portal.

```
server/src/
├── config/                  # Environment variables, database connection, constants
├── controllers/             # Request handlers (Public, Auth, Admin, Content, Security)
├── database/                # Prisma client singleton, migration utilities, seed scripts
├── middleware/              # Security gateway, auth guards, rate limiters, error handling
├── routes/                  # Express route definitions (/api/public, /api/auth, /api/admin)
├── services/                # Business logic (Google Auth, Cloudinary, Notifications, Geocoding)
├── utils/                   # Reference generator, timing-safe validators, audit logger
├── validators/              # Zod validation schemas for all incoming HTTP payloads
├── app.ts                   # Express app configuration & middleware pipeline
└── index.ts                 # HTTP server initialization and port binding
```

---

## 2. Database Models & Prisma Schema

The application uses Prisma ORM with strict relational constraints:

### 1. `AdminUser`
Stores authorized administrator profiles:
- `id` (String / UUID): Primary key.
- `email` (String, Unique): Verified administrative email address.
- `name` (String): Full name from Google Profile.
- `picture` (String, Optional): Avatar image URL from OAuth.
- `role` (Enum): `SUPERADMIN` or `ADMIN`.
- `isActive` (Boolean): Access toggle.
- `createdAt` / `updatedAt` (DateTime).

### 2. `Enquiry`
Central pipeline entity storing loan dossiers:
- `id` (String / UUID): Primary key.
- `referenceNumber` (String, Unique): Public tracking ID (e.g., `VPF-2026-100496`).
- `fullName`, `phoneNumber`, `email`, `city`: Applicant contact information.
- `loanType`: Home Loan, Mortgage (LAP), Balance Transfer, Commercial Funding.
- `loanAmount`: Requested capital in INR.
- `employmentType`: Salaried, Self-Employed Professional, Business Owner.
- `monthlyIncome`: Net earnings for FOIR eligibility assessment.
- `existingEmi`: Current monthly financial obligations.
- `propertyIdentified` (Boolean): Whether collateral is already finalized.
- `propertyValue`: Market value of collateral asset.
- `documents` (JSON): Array of Cloudinary document objects (`{ name, url, publicId, type, size, uploadedAt }`).
- `status` (Enum): `NEW`, `IN_REVIEW`, `DOCUMENT_VERIFICATION`, `BANK_SUBMITTED`, `SANCTIONED`, `DISBURSED`, `REJECTED`.
- `adminNotes` (Text): Internal underwriter notes and audit observations.
- `createdAt` / `updatedAt` (DateTime).

### 3. `SiteContent`
Singleton record containing dynamic website settings:
- `businessName`, `businessPhone`, `businessEmail`, `officeAddress`, `businessHours`.
- `heroHeadline`, `heroRotatingWords`, `heroBadges`.
- `rateMatrix`: JSON array of bank interest rates, turnarounds, and LTVs.
- `branchOffices`: JSON array of regional offices with GPS Google Maps links.
- `contactAdvisoryDesks`: JSON array of departmental units and lead officers.
- `socialLinks`: JSON object with Facebook, LinkedIn, Instagram, and Google Maps URL.

### 4. `SecurityAuditLog`
Tracks administrative operations, authentication events, and key rotations:
- `id`, `adminEmail`, `action`, `ipAddress`, `userAgent`, `timestamp`.

---

## 3. Cryptographic API Protection & Security Gateway

All administrative endpoints under `/api/admin/*` are shielded by a dual-tier security gateway:

### 1. Constant-Time SHA-256 HMAC Verification
- Incoming HTTP requests must provide the cryptographic secret via the `x-admin-api-key` header.
- The server does **not** compare incoming strings directly using standard equality operators (`===`), which are vulnerable to nanosecond timing attacks.
- Instead, the server hashes the incoming key to SHA-256 and executes a byte-by-byte constant-time memory comparison via Node.js native:
  ```typescript
  const expectedHash = crypto.createHash('sha256').update(process.env.ADMIN_API_KEY).digest();
  const providedHash = crypto.createHash('sha256').update(providedKey).digest();
  const isValid = crypto.timingSafeEqual(expectedHash, providedHash);
  ```

### 2. Anti-Replay Millisecond Timestamp Validation
- Every protected transaction must pass an active timestamp via `x-request-timestamp`.
- The gateway verifies that the timestamp is within a **&plusmn;300-second** tolerance window:
  ```typescript
  const clientTime = parseInt(req.headers['x-request-timestamp'] as string, 10);
  const drift = Math.abs(Date.now() - clientTime);
  if (drift > 300 * 1000) {
    return res.status(403).json({ error: 'Request rejected: Timestamp drift exceeded 300s window' });
  }
  ```
- This ensures intercepted network traffic cannot be replayed by malicious third parties.

### 3. Tiered IP Rate Limiting Gateways
- **Public General APIs:** 300 requests per 15 minutes per IP.
- **Enquiry Tracking Portal (`/api/public/enquiries/track`):** Strict 15 lookups per 15 minutes per IP to prevent mobile number enumeration or data scraping.
- **Admin Login Routes:** 15 authentication attempts per 15 minutes per IP.
- **Protected Admin Operations:** 500 requests per 15 minutes per IP.

---

## 4. REST API Endpoint Specifications

### Public Endpoints (`/api/public`)
- `GET /content`: Returns live website content, matrices, and regional branches.
- `POST /enquiries`: Submits a new loan application dossier with Cloudinary documents.
- `POST /enquiries/track`: Secure lookup of loan application progress using reference and phone number.
- `GET /health`: Server health check and latency diagnostics.

### Authentication Endpoints (`/api/auth`)
- `POST /google/admin`: Validates Google OAuth ID token, checks admin email allowlist, and returns JWT session cookie/token.
- `GET /me`: Returns current authenticated admin profile.
- `POST /logout`: Invalidates session and clears cookies.

### Admin Operations Endpoints (`/api/admin`)
- `GET /enquiries`: List enquiries with multi-field search, pagination, and status filters.
- `GET /enquiries/:id`: Retrieve full application dossier with legal documents.
- `PATCH /enquiries/:id/status`: Update application status and log transition audit trail.
- `PATCH /enquiries/:id/notes`: Add internal underwriter case notes.
- `GET /enquiries/export`: Export filtered applications in RFC 4180-compliant CSV format.
- `PUT /content`: Update website content, matrices, and office locations.
- `GET /security/key-status`: Inspect SHA-256 fingerprint, timing health, and rate limiters.
- `POST /security/rotate-key`: Regenerates a new 256-bit cryptographic API secret in memory.

---

## 5. File Uploads & Cloudinary Integration

- Uploaded collateral documents (sale deeds, patta, income tax returns, bank statements) are validated for MIME type (`application/pdf`, `image/jpeg`, `image/png`, `image/webp`).
- Documents are streamed directly to Cloudinary's encrypted storage using signed credentials.
- Stored files are tagged with applicant reference IDs and returned as immutable secure HTTPS URLs.
