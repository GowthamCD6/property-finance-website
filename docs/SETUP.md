# Local Setup & Development Guide

## Prerequisites
- **Node.js**: v18+ (tested on Node v20/v24)
- **npm**: v9+
- **Git**

---

## 1. Quickstart (Under 2 Minutes)

### Step 1: Install Dependencies
Run from the project root:
```bash
npm install
```
This automatically installs all workspace dependencies for both `client` and `server`.

---

### Step 2: Environment Configuration
The backend comes pre-configured with a `.env` file in `server/`.
If you need to customize settings, copy from `.env.example`:

```bash
cd server
cp .env.example .env
```

Default local environment values:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="file:./dev.db"
JWT_SECRET=super-secure-production-jwt-secret-key-replace-in-production-12345
ADMIN_EMAIL=admin@vardhanfinance.in
ADMIN_DEFAULT_PASSWORD=Admin@123456
CLIENT_URL=http://localhost:5173
TIMEZONE=Asia/Kolkata
```

---

### Step 3: Database Migration & Seeding
Initialize the SQLite database schema and seed default data (admin user, site content, services, FAQs, availability slots, and sample test enquiries):

```bash
cd server
npx prisma db push
npx tsx src/database/seed.ts
```

Output:
```
🌱 Starting database seed...
✅ Admin user created: admin@vardhanfinance.in (password: Admin@123456)
✅ Default site content created
✅ 4 Services seeded
✅ 7 FAQs seeded
✅ Weekly availability configurations seeded
✅ Sample initial enquiries & appointments seeded
🎉 Database seeding completed successfully!
```

---

### Step 4: Run the Development Servers
From the root directory:
```bash
npm run dev
```

Or run individually:
- **Backend**: `npm run dev:server` (Starts Express API at `http://localhost:5000`)
- **Frontend**: `npm run dev:client` (Starts Vite Dev Server at `http://localhost:5173` or `5174`)

---

## 2. Seed Administrator Credentials

| Detail | Value |
|---|---|
| **Portal URL** | `http://localhost:5173/admin/login` |
| **Email** | `admin@vardhanfinance.in` |
| **Password** | `Admin@123456` |
| **Role** | Super Administrator |

---

## 3. Running Automated Tests

Run backend integration tests (validates enquiry validation, slot checks, auth guards, CSV export, and persistent content updates):

```bash
npm test
```
Or:
```bash
cd server
npx vitest run
```

---

## 4. Building for Production

Compile both the TypeScript server and Vite frontend bundle:
```bash
npm run build
```
- Server builds to: `server/dist/`
- Client builds to: `client/dist/`
