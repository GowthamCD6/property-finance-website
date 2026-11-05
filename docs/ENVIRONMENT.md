# Environment Configuration & PEM Certificate Guide

> **Scope:** Client environment variables (`client/.env`), Server environment variables (`server/.env`), and Database SSL/TLS Certificate (`.pem`) setup.

---

## 1. Client Environment Variables (`client/.env`)

The frontend application is bundled with **Vite**. All client-exposed variables must be prefixed with `VITE_`.

| Variable Name | Required | Default / Example Value | Description & Purpose |
|---|---|---|---|
| `VITE_API_URL` | Yes | `/api` | Base URL path for all backend API requests. In production with reverse proxies (Nginx / Cloudflare), `/api` delegates directly to the server. |
| `VITE_GOOGLE_CLIENT_ID` | Yes | `187538648042-...apps.googleusercontent.com` | Google Cloud OAuth 2.0 Web Client ID used for one-tap administrative login. Must match authorized JavaScript origins. |
| `VITE_ADMIN_API_KEY` | Yes | `vpf_sec_7a9f2b8c3d1e...` | 256-bit cryptographic API secret passed via the `x-admin-api-key` header to authenticate admin requests against the security gateway. |

### Client `.env.example` Template
```ini
# Vite Client Environment Configuration
VITE_API_URL=/api
VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com
VITE_ADMIN_API_KEY=your-256-bit-cryptographic-client-api-key
```

---

## 2. Server Environment Variables (`server/.env`)

The backend server relies on these environment parameters for database connectivity, security enforcement, and external cloud integrations:

| Variable Name | Required | Example Value | Description & Security Best Practices |
|---|---|---|---|
| `PORT` | Yes | `5000` | Local port on which the Express HTTP server listens. |
| `NODE_ENV` | Yes | `development` or `production` | Runtime mode. In `production`, secure cookies and strict error sanitization are enforced. |
| `CLIENT_URL` | Yes | `https://primeassociatesloans.in,http://localhost:5174` | Comma-separated list of allowed CORS origins for HTTP requests and credentials exchange. |
| `TIMEZONE` | No | `Asia/Kolkata` | Standard timezone for logging, appointment booking rules, and IST timestamps. |
| `ADMIN_EMAIL` | Yes | `primeassociates2008@gmail.com` | Primary Superadmin email address authorized for administrative privileges upon Google OAuth login. |
| `DATABASE_URL` | Yes | `mysql://user:pass@host:4000/db?sslaccept=strict&sslca=certs/isrgrootx1.pem` | Full Prisma database connection string with mandatory TLS/SSL certificate parameters. |
| `TIDB_HOST` | Yes | `gateway01.ap-northeast-1.prod.aws.tidbcloud.com` | Database cluster hostname. |
| `TIDB_PORT` | Yes | `4000` | Database cluster port (typically `4000` for TiDB Cloud, `3306` for MySQL). |
| `TIDB_USER` | Yes | `your-db-username` | Database user account. |
| `TIDB_PASSWORD` | Yes | `your-db-password` | Database user password. |
| `TIDB_DATABASE` | Yes | `prime_associates` | Database schema name. |
| `TIDB_SSL_CA` | Yes | `certs/isrgrootx1.pem` | Relative or absolute path to the SSL Root CA certificate file. |
| `JWT_SECRET` | Yes | `random-64-character-hex-secret` | High-entropy cryptographic secret used to sign and verify administrative session JWT tokens. |
| `ADMIN_API_KEY` | Yes | `vpf_sec_7a9f2b8c3d1e...` | Server-side master API key evaluated in constant-time memory buffers against incoming client keys. |
| `GOOGLE_CLIENT_ID` | Yes | `187538648042-...apps.googleusercontent.com` | Google OAuth Client ID verified on backend token verification via `google-auth-library`. |
| `GOOGLE_CLIENT_SECRET`| Yes | `GOCSPX-...` | Google OAuth Client Secret for secure token validation. |
| `CLOUDINARY_CLOUD_NAME`| Yes | `your-cloud-name` | Cloudinary account cloud identifier for encrypted loan document storage. |
| `CLOUDINARY_API_KEY` | Yes | `your-cloudinary-api-key` | Cloudinary REST API key. |
| `CLOUDINARY_API_SECRET`| Yes | `your-cloudinary-api-secret`| Cloudinary REST API secret for signing file uploads. |
| `CLOUDINARY_URL` | Yes | `cloudinary://api_key:secret@cloud_name` | Unified Cloudinary connection URI. |

### Server `.env.example` Template
```ini
# Application Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173,http://localhost:5174,https://primeassociatesloans.in
TIMEZONE=Asia/Kolkata
ADMIN_EMAIL=primeassociates2008@gmail.com

# Database Cluster & TLS Connection
TIDB_HOST=gateway01.ap-northeast-1.prod.aws.tidbcloud.com
TIDB_PORT=4000
TIDB_USER=your-database-user
TIDB_PASSWORD=your-database-password
TIDB_DATABASE=prime_associates
TIDB_SSL_CA=certs/isrgrootx1.pem

DATABASE_URL="mysql://your-user:your-password@gateway01.ap-northeast-1.prod.aws.tidbcloud.com:4000/prime_associates?sslaccept=strict&sslca=certs/isrgrootx1.pem"

# Cryptographic Tokens & Security
JWT_SECRET=replace-with-ultra-secure-random-64-character-string
ADMIN_API_KEY=vpf_sec_7a9f2b8c3d1e4f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a

# Google OAuth Authentication
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Cloudinary Document Storage
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLOUDINARY_URL=cloudinary://your-api-key:your-api-secret@your-cloud-name
```

---

## 3. SSL/TLS Certificates & `.pem` File Guide

### What are the `.pem` Files?

The server includes two verified Root Certificate Authority files under `server/certs/`:
1. **`isrgrootx1.pem`** (Let's Encrypt / ISRG Root X1): The standard digital certificate used by AWS, TiDB Cloud Serverless, and major cloud providers to verify server TLS identity.
2. **`Property-finance.pem`**: The dedicated cluster certificate chain provided by the managed database host.

```
server/
└── certs/
    ├── isrgrootx1.pem         # Official ISRG Root X1 CA Certificate
    └── Property-finance.pem   # Cluster-specific TLS verification certificate
```

### Why is the `.pem` File Mandatory?

Modern cloud databases (such as TiDB Cloud Serverless, AWS RDS, Neon, or PlanetScale) reject unencrypted plain-text connections. 

By specifying:
```
DATABASE_URL="mysql://.../?sslaccept=strict&sslca=certs/isrgrootx1.pem"
```
The application enforces **Strict TLS Handshake (`sslaccept=strict`)**:
1. All database queries, financial records, and applicant credentials transmitted between the Node.js application and the database are encrypted using AES-GCM / TLS 1.3 in transit.
2. The client validates that the database server's certificate is legitimately signed by the trusted Root CA (`isrgrootx1.pem`), preventing Man-in-the-Middle (MITM) eavesdropping.

---

## 4. Deploying `.pem` Certificates in Production

### Option A: Local / Virtual Machine / VPS Deployment (Linux / Ubuntu)

1. Ensure the `certs/` folder is placed adjacent to the server directory:
   ```bash
   mkdir -p /var/www/property-finance/server/certs
   cp certs/isrgrootx1.pem /var/www/property-finance/server/certs/
   ```
2. Restrict file permissions so only the application process owner can read the certificate:
   ```bash
   chmod 600 /var/www/property-finance/server/certs/*.pem
   chown -R www-data:www-data /var/www/property-finance/server/certs
   ```

### Option B: Docker Container Deployment

In your `Dockerfile`, ensure certificates are copied into the image:
```dockerfile
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
COPY certs ./certs/
RUN npm ci
COPY . .
RUN npx prisma generate
EXPOSE 5000
CMD ["npm", "start"]
```

### Option C: Cloud Platforms (Render, Railway, Heroku, AWS ECS)

When deploying to ephemeral serverless containers where files cannot be committed:
1. Encode the `.pem` file as a Base64 string locally:
   ```bash
   # On Linux/macOS
   base64 -w 0 server/certs/isrgrootx1.pem
   
   # On Windows PowerShell
   [Convert]::ToBase64String([IO.File]::ReadAllBytes("server/certs/isrgrootx1.pem"))
   ```
2. Add an environment variable named `DATABASE_SSL_CA_BASE64` in your cloud provider's dashboard.
3. In your server startup script (`src/config/index.ts`), write the certificate to disk before Prisma initializes:
   ```typescript
   import fs from 'fs';
   import path from 'path';

   if (process.env.DATABASE_SSL_CA_BASE64) {
     const certDir = path.resolve(__dirname, '../../certs');
     if (!fs.existsSync(certDir)) {
       fs.mkdirSync(certDir, { recursive: true });
     }
     const certContent = Buffer.from(process.env.DATABASE_SSL_CA_BASE64, 'base64').toString('utf-8');
     fs.writeFileSync(path.join(certDir, 'isrgrootx1.pem'), certContent);
   }
   ```

---

## 5. Security & Rotation Checklist

- [x] **Never commit raw credentials to Git:** Keep `.env` in `.gitignore`.
- [x] **Rotate Secrets on Schedule:** Use the Admin Security Page (`/admin/security`) to rotate the `ADMIN_API_KEY` whenever personnel changes occur.
- [x] **Verify HTTPS in Production:** Ensure `NODE_ENV=production` is set so secure cookie attributes (`SameSite=Strict`, `Secure=true`) are activated.
