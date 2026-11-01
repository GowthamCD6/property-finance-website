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
    const { phone, email, identifier, password } = loginSchema.parse(req.body);

    const inputVal = (phone || identifier || email || '').trim();
    if (!inputVal) {
      res.status(400).json({
        success: false,
        message: 'Please provide your registered mobile phone number and password.',
      });
      return;
    }

    // Clean digits from phone input
    const digitsOnly = inputVal.replace(/\D/g, '');
    const phoneConditions: any[] = [{ phone: inputVal }];

    if (digitsOnly) {
      phoneConditions.push({ phone: digitsOnly });
      if (digitsOnly.length === 12 && digitsOnly.startsWith('91')) {
        phoneConditions.push({ phone: digitsOnly.slice(2) });
      }
      if (digitsOnly.length === 10) {
        phoneConditions.push({ phone: `+91${digitsOnly}` });
        phoneConditions.push({ phone: `91${digitsOnly}` });
        phoneConditions.push({ phone: { contains: digitsOnly } });
      }
    }

    // Always query the live database in real-time
    const admin = await prisma.adminUser.findFirst({
      where: {
        OR: [
          ...phoneConditions,
          { email: inputVal.toLowerCase() },
        ],
      },
    });

    if (!admin) {
      res.status(401).json({
        success: false,
        message: 'Invalid registered mobile number or password.',
      });
      return;
    }

    if (!admin.isActive) {
      res.status(403).json({
        success: false,
        message: 'Administrator account has been deactivated. Please contact your primary administrator.',
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid registered mobile number or password.',
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
    const googleEmail = payload.email.toLowerCase().trim();

    // CRITICAL SECURITY ENFORCEMENT:
    // Only allow authentication if this Gmail / email is ALREADY enrolled in the database (AdminUser table)
    const admin = await prisma.adminUser.findUnique({
      where: { email: googleEmail },
    });

    if (!admin) {
      res.status(403).json({
        success: false,
        message: `Access Denied: The Google account (${googleEmail}) is not registered in our database as an authorized administrator. Please ask your primary administrator to enroll your email address first.`,
      });
      return;
    }

    if (!admin.isActive) {
      res.status(403).json({
        success: false,
        message: `Access Denied: The administrator account (${googleEmail}) has been deactivated. Please contact your primary administrator.`,
      });
      return;
    }

    // Update lastLoginAt and avatar from Google
    const updatedAdmin = await prisma.adminUser.update({
      where: { id: admin.id },
      data: {
        lastLoginAt: new Date(),
        avatar: payload.picture || admin.avatar,
      },
    });

    const token = jwt.sign(
      {
        id: updatedAdmin.id,
        email: updatedAdmin.email,
        role: updatedAdmin.role,
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
          id: updatedAdmin.id,
          name: updatedAdmin.name,
          email: updatedAdmin.email,
          role: updatedAdmin.role,
          avatar: updatedAdmin.avatar,
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

/**
 * Submit or update a client review / feedback
 */
export async function submitCustomerReview(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.customer) {
      res.status(401).json({ success: false, message: 'Authentication required to submit feedback.' });
      return;
    }

    const { rating, review, loanType, amount, location } = req.body;

    const numRating = Math.max(1, Math.min(5, Math.round(Number(rating) || 5)));
    const cleanReview = typeof review === 'string' ? review.trim() : '';

    if (!cleanReview || cleanReview.length < 5) {
      res.status(400).json({ success: false, message: 'Please share at least a few words describing your experience (min 5 characters).' });
      return;
    }

    // Retrieve current testimonials
    const siteContent = await prisma.siteContent.findUnique({
      where: { id: 'default_content' },
    });

    let testimonialsList: any[] = [];
    if (siteContent?.testimonials) {
      try {
        testimonialsList = JSON.parse(siteContent.testimonials);
      } catch {
        testimonialsList = [];
      }
    }

    const customerId = req.customer.id;
    const customerEmail = req.customer.email.toLowerCase();

    const existingIndex = testimonialsList.findIndex(
      (t: any) => (t.customerId && t.customerId === customerId) || (t.email && t.email.toLowerCase() === customerEmail)
    );

    const reviewPayload = {
      id: existingIndex >= 0 ? testimonialsList[existingIndex].id : `rev_${Date.now()}`,
      name: req.customer.name,
      avatarUrl: req.customer.picture || '',
      email: req.customer.email,
      customerId: req.customer.id,
      location: (location && String(location).trim()) || 'Tirupur, Tamil Nadu',
      loanType: (loanType && String(loanType).trim()) || 'Property / Home Loan',
      amount: (amount && String(amount).trim()) || '₹50 Lakhs',
      rating: numRating,
      review: cleanReview,
      verified: true,
      createdAt: existingIndex >= 0 ? (testimonialsList[existingIndex].createdAt || new Date().toISOString()) : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      testimonialsList[existingIndex] = reviewPayload;
    } else {
      testimonialsList.unshift(reviewPayload);
    }

    await prisma.siteContent.upsert({
      where: { id: 'default_content' },
      update: { testimonials: JSON.stringify(testimonialsList) },
      create: { id: 'default_content', testimonials: JSON.stringify(testimonialsList) },
    });

    res.status(200).json({
      success: true,
      message: 'Thank you! Your client review has been submitted successfully and published.',
      data: reviewPayload,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Get current authenticated customer's review
 */
export async function getCustomerReview(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.customer) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const siteContent = await prisma.siteContent.findUnique({
      where: { id: 'default_content' },
    });

    let testimonialsList: any[] = [];
    if (siteContent?.testimonials) {
      try {
        testimonialsList = JSON.parse(siteContent.testimonials);
      } catch {
        testimonialsList = [];
      }
    }

    const customerId = req.customer.id;
    const customerEmail = req.customer.email.toLowerCase();

    const userReview = testimonialsList.find(
      (t: any) => (t.customerId && t.customerId === customerId) || (t.email && t.email.toLowerCase() === customerEmail)
    );

    res.json({
      success: true,
      data: userReview || null,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Delete current customer's review
 */
export async function deleteCustomerReview(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.customer) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const siteContent = await prisma.siteContent.findUnique({
      where: { id: 'default_content' },
    });

    if (siteContent?.testimonials) {
      try {
        const testimonialsList = JSON.parse(siteContent.testimonials);
        const customerId = req.customer.id;
        const customerEmail = req.customer.email.toLowerCase();

        const filtered = testimonialsList.filter(
          (t: any) => !(t.customerId === customerId || (t.email && t.email.toLowerCase() === customerEmail))
        );

        await prisma.siteContent.update({
          where: { id: 'default_content' },
          data: { testimonials: JSON.stringify(filtered) },
        });
      } catch {
        // Non-blocking
      }
    }

    res.json({
      success: true,
      message: 'Your review has been successfully removed.',
    });
  } catch (err) {
    next(err);
  }
}

