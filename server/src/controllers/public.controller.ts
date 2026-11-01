import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import prisma from '../database/client';
import { createEnquirySchema } from '../validators/enquiry.validator';
import { generateEnquiryReference } from '../utils/reference';
import { notifyAdminNewEnquiry } from '../utils/notifications';

export async function getSiteContent(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const content = await prisma.siteContent.findUnique({
      where: { id: 'default_content' },
    });
    res.json({ success: true, data: content });
  } catch (err) {
    next(err);
  }
}

export async function getServices(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });
    res.json({ success: true, data: services });
  } catch (err) {
    next(err);
  }
}

export async function getFaqs(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const faqs = await prisma.faq.findMany({
      where: { isPublished: true },
      orderBy: { displayOrder: 'asc' },
    });
    res.json({ success: true, data: faqs });
  } catch (err) {
    next(err);
  }
}

export async function getAvailability(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const dateParam = req.query.date as string | undefined;

    // Get weekly availability config
    const weeklyConfig = await prisma.availabilityConfig.findMany();
    // Get blocked dates
    const blockedDates = await prisma.blockedDate.findMany();
    const blockedSet = new Set(blockedDates.map((b) => b.date));

    // Standard business slots
    const standardWeekdaySlots = [
      '10:00 AM - 11:00 AM',
      '11:30 AM - 12:30 PM',
      '02:00 PM - 03:00 PM',
      '03:30 PM - 04:30 PM',
      '05:00 PM - 06:00 PM',
    ];
    const saturdaySlots = [
      '10:00 AM - 11:00 AM',
      '11:30 AM - 12:30 PM',
      '01:00 PM - 02:00 PM',
    ];

    if (dateParam) {
      // Validate date format YYYY-MM-DD
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(dateParam)) {
        res.status(400).json({ success: false, message: 'Invalid date format. Expected YYYY-MM-DD.' });
        return;
      }

      if (blockedSet.has(dateParam)) {
        res.json({
          success: true,
          data: {
            date: dateParam,
            isAvailable: false,
            reason: 'Office holiday or date blocked',
            availableSlots: [],
          },
        });
        return;
      }

      const dateObj = new Date(dateParam);
      const dayOfWeek = dateObj.getDay(); // 0 is Sunday
      const dayConfig = weeklyConfig.find((c) => c.dayOfWeek === dayOfWeek);

      if (!dayConfig || !dayConfig.isAvailable) {
        res.json({
          success: true,
          data: {
            date: dateParam,
            isAvailable: false,
            reason: 'Consultations are not scheduled on this day',
            availableSlots: [],
          },
        });
        return;
      }

      const baseSlots = dayOfWeek === 6 ? saturdaySlots : standardWeekdaySlots;

      // Find any already confirmed appointments for that date
      const bookedAppointments = await prisma.appointment.findMany({
        where: {
          date: dateParam,
          status: 'Confirmed',
        },
        select: { timeSlot: true },
      });

      const bookedSlots = new Set(bookedAppointments.map((a) => a.timeSlot));
      const availableSlots = baseSlots.filter((slot) => !bookedSlots.has(slot));

      res.json({
        success: true,
        data: {
          date: dateParam,
          isAvailable: true,
          allSlots: baseSlots,
          availableSlots,
        },
      });
      return;
    }

    // If no specific date given, return general availability schedule & next 14 available dates
    const schedule: Array<{ date: string; dayName: string; isAvailable: boolean }> = [];
    const today = new Date();

    for (let i = 1; i <= 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dateString = d.toISOString().split('T')[0];
      const dayOfWeek = d.getDay();
      const dayConfig = weeklyConfig.find((c) => c.dayOfWeek === dayOfWeek);
      const isBlocked = blockedSet.has(dateString);
      const isAvailable = Boolean(dayConfig?.isAvailable && !isBlocked);

      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

      schedule.push({
        date: dateString,
        dayName: dayNames[dayOfWeek],
        isAvailable,
      });
    }

    res.json({
      success: true,
      data: {
        workingHours: 'Monday – Saturday: 10:00 AM – 6:00 PM (IST)',
        schedule,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function createEnquiry(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const validatedData = createEnquirySchema.parse(req.body);

    const isSpecificDate =
      validatedData.preferredDate &&
      validatedData.preferredDate !== 'Pending Advisor Allotment' &&
      /^\d{4}-\d{2}-\d{2}$/.test(validatedData.preferredDate);

    // If specific date requested, verify conflict & blackout
    if (isSpecificDate) {
      const conflictingConfirmed = await prisma.appointment.findFirst({
        where: {
          date: validatedData.preferredDate,
          timeSlot: validatedData.preferredTimeSlot,
          status: 'Confirmed',
        },
      });

      if (conflictingConfirmed) {
        res.status(409).json({
          success: false,
          message:
            'The requested appointment slot has just been confirmed for another applicant. Please choose a different time slot.',
        });
        return;
      }

      const isBlocked = await prisma.blockedDate.findUnique({
        where: { date: validatedData.preferredDate },
      });

      if (isBlocked) {
        res.status(400).json({
          success: false,
          message: `Consultations are unavailable on ${validatedData.preferredDate} (${isBlocked.reason}). Please select another date.`,
        });
        return;
      }
    }

    const referenceNumber = await generateEnquiryReference();

    // Auto-link or auto-provision CustomerUser account so borrower can immediately track in user panel
    let matchedCustomerId: string | null = null;
    let customerUser: any = null;

    // Check token from header or cookie first
    let customerToken: string | undefined;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      customerToken = authHeader.substring(7);
    } else if (req.cookies && req.cookies.customer_token) {
      customerToken = req.cookies.customer_token;
    }
    if (customerToken) {
      try {
        const decoded = jwt.verify(customerToken, config.jwtSecret) as any;
        if (decoded?.id) {
          matchedCustomerId = decoded.id;
          customerUser = await prisma.customerUser.findUnique({ where: { id: decoded.id } });
        }
      } catch {
        // Non-blocking
      }
    }

    // If not authenticated via token, auto-provision or match via email or phone
    if (!matchedCustomerId) {
      if (validatedData.email) {
        const existingBorrower = await prisma.customerUser.findUnique({
          where: { email: validatedData.email.toLowerCase() },
        });
        if (existingBorrower) {
          matchedCustomerId = existingBorrower.id;
          customerUser = existingBorrower;
        } else {
          customerUser = await prisma.customerUser.create({
            data: {
              email: validatedData.email.toLowerCase(),
              name: validatedData.fullName,
              phone: validatedData.mobileNumber,
              lastLoginAt: new Date(),
            },
          });
          matchedCustomerId = customerUser.id;
        }
      } else if (validatedData.mobileNumber) {
        const fallbackEmail = `${validatedData.mobileNumber}@client.primeassociates.in`;
        customerUser = await prisma.customerUser.findFirst({
          where: {
            OR: [
              { phone: validatedData.mobileNumber },
              { email: fallbackEmail },
            ],
          },
        });
        if (customerUser) {
          matchedCustomerId = customerUser.id;
        } else {
          customerUser = await prisma.customerUser.create({
            data: {
              email: fallbackEmail,
              name: validatedData.fullName,
              phone: validatedData.mobileNumber,
              lastLoginAt: new Date(),
            },
          });
          matchedCustomerId = customerUser.id;
        }
      }
    }

    // Format rich metadata into additionalNotes for comprehensive dossier persistence
    const metadataItems: string[] = [];
    if (validatedData.preferredBank) {
      metadataItems.push(`🏛️ Preferred Bank / Channel: ${validatedData.preferredBank}`);
    }
    if ((validatedData as any).carLoanDetails) {
      const car = (validatedData as any).carLoanDetails;
      metadataItems.push(
        `🚗 Vehicle Specifications: ${car.carType?.toUpperCase() || 'NEW'} | Showroom: ${car.showroomName || 'N/A'} | Area: ${car.area || 'N/A'} | On-Road: ₹${car.onRoadPrice || 'N/A'}`
      );
    }
    if (validatedData.additionalNotes) {
      metadataItems.push(validatedData.additionalNotes);
    }
    const rawDocs = (req.body as any).documents;
    let documentsMeta = '';
    if (Array.isArray(rawDocs) && rawDocs.length > 0) {
      metadataItems.push(`📁 Attached Reference Documents: ${rawDocs.length} file(s) submitted (${rawDocs.map((d: any) => d.documentName || d.name).join(', ')})`);
      documentsMeta = `\n<!--DOCUMENTS_JSON:${JSON.stringify(rawDocs)}-->`;
    }
    const finalNotes = (metadataItems.filter(Boolean).join('\n\n') + documentsMeta) || null;

    // Persist in transaction
    const result = await prisma.$transaction(async (tx) => {
      const enquiry = await tx.enquiry.create({
        data: {
          referenceNumber,
          customerId: matchedCustomerId,
          fullName: validatedData.fullName,
          mobileNumber: validatedData.mobileNumber,
          email: validatedData.email || null,
          preferredContactMethod: validatedData.preferredContactMethod,
          cityState: validatedData.cityState,
          loanType: validatedData.loanType,
          serviceId: validatedData.serviceId || null,
          loanAmount: validatedData.loanAmount,
          propertyType: validatedData.propertyType,
          propertyLocation: validatedData.propertyLocation,
          propertyOwnershipStatus: validatedData.propertyOwnershipStatus,
          employmentType: validatedData.employmentType,
          preferredDate: validatedData.preferredDate || 'Pending Advisor Allotment',
          preferredTimeSlot: validatedData.preferredTimeSlot || 'Pending Advisor Allotment',
          meetingMode: validatedData.meetingMode || 'phone',
          additionalNotes: finalNotes,
          status: 'Pending',
          consentGiven: true,
        },
      });

      // Create initial status history
      await tx.statusHistory.create({
        data: {
          enquiryId: enquiry.id,
          fromStatus: 'None',
          toStatus: 'Pending',
          changedBy: 'System',
          note: 'Customer enquiry registered through public website form. Awaiting advisor slot allotment.',
        },
      });

      // If specific date was picked, create requested appointment; otherwise leave unallotted for admin
      let appointment = null;
      if (isSpecificDate && validatedData.preferredTimeSlot && validatedData.preferredTimeSlot !== 'Pending Advisor Allotment') {
        appointment = await tx.appointment.create({
          data: {
            enquiryId: enquiry.id,
            date: validatedData.preferredDate,
            timeSlot: validatedData.preferredTimeSlot,
            timezone: 'Asia/Kolkata',
            meetingMode: validatedData.meetingMode,
            status: 'Requested',
          },
        });
      }

      return { enquiry, appointment };
    });

    // Generate Customer Perpetual Auth Token for seamless User Panel access
    let generatedCustomerToken: string | null = null;
    if (matchedCustomerId && customerUser) {
      generatedCustomerToken = jwt.sign(
        {
          id: customerUser.id,
          email: customerUser.email,
          type: 'customer',
        },
        config.jwtSecret
      );

      res.cookie('customer_token', generatedCustomerToken, {
        httpOnly: true,
        secure: config.nodeEnv === 'production',
        sameSite: 'lax',
        maxAge: 36500 * 24 * 60 * 60 * 1000,
      });
    }

    // Send admin notification
    notifyAdminNewEnquiry({
      referenceNumber: result.enquiry.referenceNumber,
      fullName: result.enquiry.fullName,
      mobileNumber: result.enquiry.mobileNumber,
      loanType: result.enquiry.loanType,
      loanAmount: result.enquiry.loanAmount,
      cityState: result.enquiry.cityState,
      preferredDate: result.enquiry.preferredDate,
      preferredTimeSlot: result.enquiry.preferredTimeSlot,
      meetingMode: result.enquiry.meetingMode,
    }).catch((err) => console.error('Notification dispatch notice:', err));

    res.status(201).json({
      success: true,
      message:
        'Your loan enquiry has been successfully registered. Our advisory desk will review your details and allocate your dedicated consultation meeting slot.',
      data: {
        referenceNumber: result.enquiry.referenceNumber,
        fullName: result.enquiry.fullName,
        loanType: result.enquiry.loanType,
        loanAmount: result.enquiry.loanAmount,
        meetingDate: result.appointment?.date || 'Pending Advisor Allotment',
        meetingSlot: result.appointment?.timeSlot || 'Pending Advisor Allotment',
        appointmentStatus: result.appointment?.status || 'Awaiting Advisor Slot Allotment',
        createdAt: result.enquiry.createdAt,
        token: generatedCustomerToken,
        customer: customerUser
          ? {
              id: customerUser.id,
              name: customerUser.name,
              email: customerUser.email,
              picture: customerUser.picture,
              phone: customerUser.phone,
            }
          : null,
      },
    });
  } catch (err) {
    next(err);
  }
}
