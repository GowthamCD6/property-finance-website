import path from 'path';
import fs from 'fs';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { config } from './config';
import publicRoutes from './routes/public.routes';
import authRoutes from './routes/auth.routes';
import adminRoutes from './routes/admin.routes';
import documentRoutes from './routes/document.routes';
import { errorHandler } from './middleware/errorHandler';
import prisma from './database/client';

const app = express();

// Trust reverse proxy (Essential for Render, AWS ALB, Cloudflare, Vercel)
app.set('trust proxy', 1);

// Parse configured origins (supports comma-separated origins, trailing slash removal)
const configuredOrigins = config.clientUrl
  ? config.clientUrl.split(',').map((u) => u.trim().replace(/\/+$/, ''))
  : [];

const defaultDevOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174',
  'http://localhost:3000',
  'http://localhost:4173',
];

const defaultProdOrigins = [
  'https://primeassoicatesloans.in',
  'https://www.primeassoicatesloans.in',
  'https://api.primeassoicatesloans.in',
  'https://primeassociatesloans.in',
  'https://www.primeassociatesloans.in',
  'https://api.primeassociatesloans.in',
];

const allowedOrigins = Array.from(
  new Set([...configuredOrigins, ...defaultDevOrigins, ...defaultProdOrigins])
).filter(Boolean);

// Security HTTP headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, Postman, health checks)
      if (!origin) return callback(null, true);

      const cleanOrigin = origin.replace(/\/+$/, '');

      // Allow if explicit match or wildcard is set or standard cloud deploy previews
      if (
        allowedOrigins.includes(cleanOrigin) ||
        allowedOrigins.includes('*') ||
        cleanOrigin.endsWith('.vercel.app') ||
        cleanOrigin.endsWith('.onrender.com') ||
        cleanOrigin.endsWith('.netlify.app') ||
        cleanOrigin.includes('primeassoicatesloans.in') ||
        cleanOrigin.includes('primeassociatesloans.in')
      ) {
        return callback(null, true);
      }

      // In non-production, allow all
      if (config.nodeEnv !== 'production') {
        return callback(null, true);
      }

      // Fallback: allow to prevent unexpected preflight blockage
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'x-admin-api-key',
      'x-client-api-key',
      'x-client-signature',
      'x-api-key',
      'x-request-timestamp',
      'x-request-signature',
      'x-session-hash',
    ],
    exposedHeaders: [
      'x-session-verified',
      'x-request-timestamp',
    ],
  })
);

// Body parsers
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(cookieParser());

// Health Check & Uptime Endpoints (for Render, UptimeRobot, cron jobs, etc.)
const healthCheckHandler = async (req: express.Request, res: express.Response) => {
  // Prevent any caching by reverse proxies or CDNs
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  // Handle HEAD requests immediately for bandwidth-saving uptime pingers
  if (req.method === 'HEAD') {
    return res.status(200).end();
  }

  let dbStatus = 'skipped';
  // If db query requested or default, run a quick lightweight query with a 2s timeout
  if (req.query.db !== 'false') {
    try {
      const dbPingPromise = prisma.$queryRaw`SELECT 1`;
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Database ping timeout')), 2000)
      );
      await Promise.race([dbPingPromise, timeoutPromise]);
      dbStatus = 'connected';
    } catch {
      dbStatus = 'disconnected';
    }
  }

  return res.status(200).json({
    status: 'ok',
    service: 'Prime Associates Loans API',
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
    database: dbStatus,
  });
};

app.all(['/health', '/api/health', '/ping', '/api/ping'], healthCheckHandler);

// Mount Routes
app.use('/api/public', publicRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/documents', documentRoutes);

// Optional Static Client Serving (for unified full-stack single-service deployment)
const clientDistPath = path.resolve(__dirname, '../../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// 404 Route Handler for unmatched API endpoints
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
  });
});

// Centralized Error Handling
app.use(errorHandler);

export default app;
