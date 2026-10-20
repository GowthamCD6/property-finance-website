# Production Deployment Guide

This guide covers deploying the Property Loan Consultancy website in a production environment with PostgreSQL, Node.js, and Nginx.

---

## 1. Database Architecture (Switching to PostgreSQL)

While local development runs zero-config SQLite, switching to PostgreSQL in production is straightforward with Prisma:

1. In `server/prisma/schema.prisma`, update the datasource:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. In production `.env`, supply your PostgreSQL connection string:
```env
DATABASE_URL="postgresql://vpf_user:StrongPassword123@localhost:5432/vpf_database?schema=public"
```

3. Run migrations and seed:
```bash
npx prisma migrate deploy
npx tsx src/database/seed.ts
```

---

## 2. Environment Variables Checklist

Ensure the following variables are configured in production:

| Variable | Description | Example |
|---|---|---|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Node server port | `5000` |
| `DATABASE_URL` | Database connection string | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET` | 64+ char random cryptographic secret | `b8e8f80456c...` |
| `CLIENT_URL` | Domain where frontend is hosted | `https://www.vardhanfinance.in` |
| `ADMIN_EMAIL` | Default administrator email | `operations@vardhanfinance.in` |
| `ADMIN_DEFAULT_PASSWORD` | Strong seed password | `ChangeMe@2026!` |
| `TIMEZONE` | Business operations timezone | `Asia/Kolkata` |

---

## 3. Production Build & Process Management (PM2)

### Build the project:
```bash
npm run build
```

### Start the Server with PM2:
Create an `ecosystem.config.js` or start directly:
```bash
pm2 start server/dist/index.js --name "vpf-backend" -i max
pm2 save
pm2 startup
```

---

## 4. Reverse Proxy Configuration (Nginx)

Example Nginx server block:

```nginx
server {
    listen 80;
    server_name vardhanfinance.in www.vardhanfinance.in;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name vardhanfinance.in www.vardhanfinance.in;

    ssl_certificate /etc/letsencrypt/live/vardhanfinance.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/vardhanfinance.in/privkey.pem;

    # Frontend Single Page App
    root /var/www/property-finance-website/client/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # API Reverse Proxy
    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 5. Security Hardening Checklist
- [x] HTTPS enforced with HTTP/2 and modern TLS ciphers
- [x] Helmet security headers active (`X-Frame-Options`, `Content-Security-Policy`, etc.)
- [x] CORS origin restricted to configured domain
- [x] Rate limiting active on login (`/api/auth/login`) and enquiry form (`/api/public/enquiries`)
- [x] Passwords securely hashed with bcrypt (salt factor 10)
- [x] HTTP-only cookies with `secure: true` in production
- [x] Input sanitization and strict Zod runtime schema validation on all inputs
- [x] No sensitive credentials, customer financial records, or PAN/Aadhaar stored or logged.
