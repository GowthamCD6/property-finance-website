import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import prisma from '../database/client';
import { loginSchema } from '../validators/auth.validator';
import { config } from '../config';
import { AuthenticatedRequest } from '../middleware/auth';

const googleClient = new OAuth2Client(config.googleClientId, config.googleClientSecret);

/**
 * Helper to verify Google ID token or fallback to Google tokeninfo
 */
async function verifyGoogleToken(token: string) {
  // 1. First attempt: standard verifyIdToken with Google Client ID
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: config.googleClientId,
    });
    const payload = ticket.getPayload();
    if (payload && payload.email) {
      return {
        email: payload.email.toLowerCase(),
        name: payload.name || payload.email.split('@')[0],
        picture: payload.picture,
        sub: payload.sub,
        emailVerified: payload.email_verified ?? true,
      };
    }
  } catch (err) {
    // If idToken verification failed (e.g. clock skew, or client sent an access token / tokeninfo)
    console.warn('verifyIdToken failed, attempting fallback verification:', (err as Error).message);
  }

  // 2. Fallback: Query Google tokeninfo endpoint
  try {
    const res = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(token)}`);
    if (res.ok) {
      const data: any = await res.json();
      if (data.email) {
        return {
          email: data.email.toLowerCase(),
          name: data.name || data.email.split('@')[0],
          picture: data.picture,
          sub: data.sub || data.user_id,
          emailVerified: data.email_verified === 'true' || data.email_verified === true,
        };
      }
    }
  } catch {
    // Ignore and try userinfo
  }

  // 3. Fallback: Query Google userinfo with access token if token was access_token
  try {
    const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data: any = await res.json();
      if (data.email) {
        return {
          email: data.email.toLowerCase(),
          name: data.name || data.email.split('@')[0],
          picture: data.picture,
          sub: data.sub,
          emailVerified: data.email_verified ?? true,
        };
      }
    }
  } catch {
    // Handled below
  }

  throw new Error('Unable to verify Google authentication token.');
}

// ============================================================================
// ADMIN AUTHENTICATION
// ============================================================================

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const admin = await prisma.adminUser.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!admin) {
      res.status(401).json({
        success: false,
        message: 'Invalid email address or password.',
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid email address or password.',
      });
      return;
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        role: admin.role,
      },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    // Update lastLoginAt
    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { lastLoginAt: new Date() },
    });

    // Set secure cookie
    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: 'Authentication successful.',
      data: {
        token,
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          avatar: admin.avatar,
        },
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Google Sign-In for Admin Console
 */
export async function googleAdminLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { credential, token: incomingToken } = req.body;
    const googleToken = credential || incomingToken;

    if (!googleToken) {
      res.status(400).json({
        success: false,
        message: 'Google authentication credential is required.',
      });
      return;
    }

    const payload = await verifyGoogleToken(googleToken);
    const googleEmail = payload.email.toLowerCase();

    // Check if an AdminUser exists with this email
    let admin = await prisma.adminUser.findUnique({
      where: { email: googleEmail },
    });

    // Authorized emails or patterns
    const isConfiguredAdmin =
      googleEmail === config.adminEmail.toLowerCase() ||
      googleEmail === 'admin@wealthanchor.in' ||
      googleEmail === 'admin@primeassociateloans.in' ||
      googleEmail.endsWith('@wealthanchor.in');

    if (!admin && !isConfiguredAdmin) {
      // Check if any admin exists at all in system (bootstrap mode)
      const count = await prisma.adminUser.count();
      if (count > 0) {
        res.status(403).json({
          success: false,
          message: `Access Denied: The Google account (${googleEmail}) is not authorized for the Administrator Console. Please sign in with an authorized advisor account.`,
        });
        return;
      }
    }

    // Auto-provision or update admin record
    if (!admin) {
      const randomPassword = await bcrypt.hash(Math.random().toString(36), 10);
      admin = await prisma.adminUser.create({
        data: {
          email: googleEmail,
          passwordHash: randomPassword,
          name: payload.name || 'Advisory Administrator',
          role: 'admin',
          avatar: payload.picture,
          lastLoginAt: new Date(),
        },
      });
    } else {
      admin = await prisma.adminUser.update({
        where: { id: admin.id },
        data: {
          lastLoginAt: new Date(),
          avatar: payload.picture || admin.avatar,
        },
      });
    }

    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        role: admin.role,
      },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: 'Google administrator authentication successful.',
      data: {
        token,
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          avatar: admin.avatar,
        },
      },
    });
  } catch (err: any) {
    res.status(401).json({
      success: false,
      message: err.message || 'Google administrator authentication failed.',
    });
  }
}

export async function logout(_req: Request, res: Response): Promise<void> {
  res.clearCookie('admin_token');
  res.clearCookie('customer_token');
  res.json({
    success: true,
    message: 'Logged out successfully.',
  });
}

export async function getMe(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.admin) {
    res.status(401).json({ success: false, message: 'Not authenticated.' });
    return;
  }

  res.json({
    success: true,
    data: req.admin,
  });
}

// ============================================================================
// CUSTOMER / BORROWER AUTHENTICATION (GOOGLE SSO)
// ============================================================================

/**
 * Public User Google Login & Registration
 */
export async function googleUserLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { credential, token: incomingToken } = req.body;
    const googleToken = credential || incomingToken;

    if (!googleToken) {
      res.status(400).json({
        success: false,
        message: 'Google authentication credential is required.',
      });
      return;
    }

    const payload = await verifyGoogleToken(googleToken);
    const email = payload.email.toLowerCase();

    // Find or create customer
    let customer = await prisma.customerUser.findUnique({
      where: { email },
    });

    if (!customer) {
      customer = await prisma.customerUser.create({
        data: {
          email,
          googleId: payload.sub,
          name: payload.name || 'Valued Client',
          picture: payload.picture,
          lastLoginAt: new Date(),
        },
      });
    } else {
      customer = await prisma.customerUser.update({
        where: { id: customer.id },
        data: {
          name: payload.name || customer.name,
          picture: payload.picture || customer.picture,
          googleId: payload.sub || customer.googleId,
          lastLoginAt: new Date(),
        },
      });
    }

    // Automatically link any orphan enquiries submitted with this email
    try {
      await prisma.enquiry.updateMany({
        where: {
          email: { equals: email },
          customerId: null,
        },
        data: {
          customerId: customer.id,
        },
      });
    } catch {
      // Non-blocking
    }

    // Generate Customer JWT (30-day session)
    const token = jwt.sign(
      {
        id: customer.id,
        email: customer.email,
        type: 'customer',
      },
      config.jwtSecret,
      { expiresIn: 30 * 24 * 60 * 60 }
    );

    res.cookie('customer_token', token, {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: 'Welcome! You have signed in successfully with Google.',
      data: {
        token,
        customer: {
          id: customer.id,
          name: customer.name,
          email: customer.email,
          picture: customer.picture,
          phone: customer.phone,
        },
      },
    });
  } catch (err: any) {
    res.status(401).json({
      success: false,
      message: err.message || 'Google user authentication failed.',
    });
  }
}

/**
 * Get current customer profile
 */
export async function getCustomerMe(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.customer) {
    res.status(401).json({ success: false, message: 'Not authenticated.' });
    return;
  }

  res.json({
    success: true,
    data: req.customer,
  });
}

/**
 * Get all enquiries for the authenticated customer
 */
export async function getCustomerEnquiries(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.customer) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const enquiries = await prisma.enquiry.findMany({
      where: {
        OR: [
          { customerId: req.customer.id },
          { email: { equals: req.customer.email } },
        ],
      },
      include: {
        service: true,
        appointments: {
          orderBy: { createdAt: 'desc' },
        },
        statusHistory: {
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: enquiries,
    });
  } catch (err) {
    next(err);
  }
}
