import dotenv from 'dotenv';
import crypto from 'crypto';
dotenv.config();

const rawAdminApiKey = process.env.ADMIN_API_KEY || 'vpf_sec_7a9f2b8c3d1e4f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a';
const hashedAdminApiKey = crypto.createHash('sha256').update(rawAdminApiKey).digest('hex');

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'fallback-super-secret-key-change-in-production',
  jwtExpiresIn: 8 * 60 * 60, // 8 hours in seconds for Administrator
  adminJwtExpiresIn: 8 * 60 * 60, // 8 hours in seconds
  adminApiKey: rawAdminApiKey,
  adminApiKeyHash: hashedAdminApiKey,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  adminEmail: process.env.ADMIN_EMAIL || 'primeassociates2008@gmail.com',
  timezone: process.env.TIMEZONE || 'Asia/Kolkata',
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
};
