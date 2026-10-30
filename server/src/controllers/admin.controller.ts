import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import prisma from '../database/client';
import { generateEnquiryReference } from '../utils/reference';
import {
  updateSiteContentSchema,
  serviceSchema,
  faqSchema,
  updateEnquiryStatusSchema,
  addEnquiryNoteSchema,
  updateAppointmentSchema,
  createAppointmentSchema,
} from '../validators/content.validator';

// 1. Dashboard Metrics & Stats
export async function getDashboardStats(_req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const today = new Date().toISOString().split('T')[0];

    const [
      totalEnquiries,
      newEnquiries,
      awaitingFollowUp,
      upcomingAppointments,
      confirmedAppointments,
      recentEnquiries,
      recentActivities,
    ] = await Promise.all([
      prisma.enquiry.count(),
      prisma.enquiry.count({ where: { status: 'New' } }),
      prisma.enquiry.count({
        where: { status: { in: ['Contacted', 'Follow-up Required'] } },
      }),
      prisma.appointment.count({
        where: {
          date: { gte: today },
          status: { in: ['Requested', 'Confirmed'] },
        },
      }),
      prisma.appointment.count({
        where: { status: 'Confirmed' },
      }),
      prisma.enquiry.findMany({
        take: 6,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          referenceNumber: true,
          fullName: true,
          mobileNumber: true,
          loanType: true,
          loanAmount: true,
          status: true,
          createdAt: true,
        },
      }),
      prisma.statusHistory.findMany({
        take: 8,
        orderBy: { createdAt: 'desc' },
        include: {
          enquiry: {
            select: { referenceNumber: true, fullName: true },
          },
        },
      }),
    ]);

    res.json({
      success: true,
      data: {
        totalEnquiries,
        newEnquiries,
        awaitingFollowUp,
        upcomingAppointments,
        confirmedAppointments,
        recentEnquiries,
        recentActivities,
      },
    });
  } catch (err) {
    next(err);
  }
}

// 2. Enquiry Management (Search, Filter, Paginate, Detail, Status, Notes, Export)
export async function getEnquiries(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = Math.max(1, parseInt(req.query.page as string || '1', 10));
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit as string || '15', 10)));
    const skip = (page - 1) * limit;

    const search = (req.query.search as string || '').trim();
    const status = req.query.status as string | undefined;
    const loanType = req.query.loanType as string | undefined;
    const startDate = req.query.startDate as string | undefined;
    const endDate = req.query.endDate as string | undefined;

    const where: any = {};

    if (search) {
      where.OR = [
        { referenceNumber: { contains: search } },
        { fullName: { contains: search } },
        { mobileNumber: { contains: search } },
        { cityState: { contains: search } },
      ];
    }

    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (loanType && loanType !== 'ALL') {
      where.loanType = loanType;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        where.createdAt.lte = end;
      }
    }

    const [total, enquiries] = await Promise.all([
      prisma.enquiry.count({ where }),
      prisma.enquiry.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: {
            select: {
              id: true,
              email: true,
              name: true,
              picture: true,
              phone: true,
            },
          },
          appointments: {
            take: 1,
            orderBy: { createdAt: 'desc' },
          },
          _count: {
            select: { notes: true },
          },
        },
      }),
    ]);

    res.json({
      success: true,
      data: {
        enquiries,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getEnquiryById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const enquiry = await prisma.enquiry.findUnique({
      where: { id },
      include: {
        customer: true,
        service: true,
        appointments: {
          orderBy: { createdAt: 'desc' },
        },
        notes: {
          orderBy: { createdAt: 'desc' },
        },
        statusHistory: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!enquiry) {
      res.status(404).json({ success: false, message: 'Enquiry not found' });
      return;
    }

    res.json({ success: true, data: enquiry });
  } catch (err) {
    next(err);
  }
}

// 2b. Admin Direct Enquiry / Borrower Registration
export async function createAdminEnquiry(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const {
      fullName,
      mobileNumber,
      email,
      preferredContactMethod = 'phone',
      cityState = 'Tirupur, Tamil Nadu',
      loanType = 'Home Loan',
      loanAmount = 2500000,
      propertyType = 'residential',
      propertyLocation = 'Tirupur',
      propertyOwnershipStatus = 'owned',
      employmentType = 'salaried',
      preferredBank,
      preferredDate,
      preferredTimeSlot,
      meetingMode = 'phone',
      status = 'New',
      additionalNotes,
    } = req.body;

    if (!fullName || !mobileNumber) {
      res.status(400).json({ success: false, message: 'Applicant full name and mobile number are required.' });
      return;
    }

    const referenceNumber = await generateEnquiryReference();
    const adminName = req.admin?.name || 'Senior Advisor';

    const result = await prisma.$transaction(async (tx) => {
      const enquiry = await tx.enquiry.create({
        data: {
          referenceNumber,
          fullName: fullName.trim(),
          mobileNumber: mobileNumber.trim(),
          email: email?.trim() || null,
          preferredContactMethod,
          cityState: cityState.trim(),
          loanType,
          loanAmount: Number(loanAmount),
          propertyType,
          propertyLocation: propertyLocation.trim(),
          propertyOwnershipStatus,
          employmentType,
          preferredDate: preferredDate || null,
          preferredTimeSlot: preferredTimeSlot || null,
          meetingMode,
          status,
          additionalNotes: preferredBank
            ? `[Preferred Bank: ${preferredBank.trim()}] ${additionalNotes?.trim() || ''}`.trim()
            : additionalNotes?.trim() || null,
          consentGiven: true,
        },
      });

      // Status history entry
      await tx.statusHistory.create({
        data: {
          enquiryId: enquiry.id,
          fromStatus: 'None',
          toStatus: status,
          changedBy: adminName,
          note: `Borrower case dossier registered manually by ${adminName} via Admin Console`,
        },
      });

      // If appointment date & slot were provided, create appointment immediately
      let appointment = null;
      if (preferredDate && preferredTimeSlot) {
        appointment = await tx.appointment.create({
          data: {
            enquiryId: enquiry.id,
            date: preferredDate,
            timeSlot: preferredTimeSlot,
            timezone: 'Asia/Kolkata',
            meetingMode,
            status: status === 'Appointment Confirmed' ? 'Confirmed' : 'Requested',
            adminNotes: `Scheduled during registration by ${adminName}`,
          },
        });
      }

      return { enquiry, appointment };
    });

    res.status(201).json({
      success: true,
      message: `Borrower dossier registered successfully with Reference ${referenceNumber}.`,
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

export async function updateEnquiryStatus(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const { status, note } = updateEnquiryStatusSchema.parse(req.body);

    const existing = await prisma.enquiry.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, message: 'Enquiry not found' });
      return;
    }

    const adminName = req.admin?.name || 'Administrator';

    const updated = await prisma.$transaction(async (tx) => {
      const updatedEnquiry = await tx.enquiry.update({
        where: { id },
        data: { status },
      });

      await tx.statusHistory.create({
        data: {
          enquiryId: id,
          fromStatus: existing.status,
          toStatus: status,
          changedBy: adminName,
          note: note || `Status updated from ${existing.status} to ${status}`,
        },
      });

      // If status set to 'Appointment Confirmed', auto-confirm any requested appointment
      if (status === 'Appointment Confirmed') {
        await tx.appointment.updateMany({
          where: { enquiryId: id, status: 'Requested' },
          data: { status: 'Confirmed' },
        });
      }

      return updatedEnquiry;
    });

    res.json({
      success: true,
      message: `Enquiry status updated to ${status}.`,
      data: updated,
    });
  } catch (err) {
    next(err);
  }
}

export async function addEnquiryNote(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const { content } = addEnquiryNoteSchema.parse(req.body);

    const enquiry = await prisma.enquiry.findUnique({ where: { id } });
    if (!enquiry) {
      res.status(404).json({ success: false, message: 'Enquiry not found' });
      return;
    }

    const note = await prisma.enquiryNote.create({
      data: {
        enquiryId: id,
        authorName: req.admin?.name || 'Operations Advisor',
        content,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Internal note recorded.',
      data: note,
    });
  } catch (err) {
    next(err);
  }
}

export async function exportEnquiriesCsv(_req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const enquiries = await prisma.enquiry.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        appointments: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    const headers = [
      'Reference Number',
      'Created Date',
      'Full Name',
      'Mobile Number',
      'Email',
      'Location',
      'Loan Type',
      'Loan Amount (INR)',
      'Property Type',
      'Ownership Status',
      'Employment Type',
      'Meeting Date',
      'Meeting Time Slot',
      'Meeting Mode',
      'Current Status',
    ];

    const escapeCsv = (str: any) => {
      if (str === null || str === undefined) return '""';
      const s = String(str).replace(/"/g, '""');
      return `"${s}"`;
    };

    const rows = enquiries.map((e) => [
      escapeCsv(e.referenceNumber),
      escapeCsv(e.createdAt.toISOString().split('T')[0]),
      escapeCsv(e.fullName),
      escapeCsv(e.mobileNumber),
      escapeCsv(e.email || 'N/A'),
      escapeCsv(e.cityState),
      escapeCsv(e.loanType),
      escapeCsv(e.loanAmount),
      escapeCsv(e.propertyType),
      escapeCsv(e.propertyOwnershipStatus),
      escapeCsv(e.employmentType),
      escapeCsv(e.preferredDate),
      escapeCsv(e.preferredTimeSlot),
      escapeCsv(e.meetingMode),
      escapeCsv(e.status),
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="enquiries-export-${new Date().toISOString().split('T')[0]}.csv"`);
    res.status(200).send(csvContent);
  } catch (err) {
    next(err);
  }
}

// 3. Appointment Management & Allotment Queue
export async function getPendingAllotmentEnquiries(_req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const enquiries = await prisma.enquiry.findMany({
      where: {
        OR: [
          { status: { in: ['New', 'Contacted', 'Appointment Requested'] } },
          { preferredDate: 'Pending Advisor Allotment' },
        ],
      },
      include: {
        customer: {
          select: { id: true, email: true, name: true, picture: true, phone: true },
        },
        appointments: {
          orderBy: { createdAt: 'desc' },
        },
        service: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: enquiries });
  } catch (err) {
    next(err);
  }
}

export async function getAppointments(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const status = req.query.status as string | undefined;
    const date = req.query.date as string | undefined;

    const where: any = {};
    if (status && status !== 'ALL') {
      where.status = status;
    }
    if (date) {
      where.date = date;
    }

    const appointments = await prisma.appointment.findMany({
      where,
      orderBy: [{ date: 'asc' }, { timeSlot: 'asc' }],
      include: {
        enquiry: {
          select: {
            id: true,
            referenceNumber: true,
            fullName: true,
            mobileNumber: true,
            email: true,
            loanType: true,
            loanAmount: true,
            cityState: true,
            preferredContactMethod: true,
            preferredTimeSlot: true,
            meetingMode: true,
            customerId: true,
            customer: {
              select: {
                id: true,
                email: true,
                name: true,
                picture: true,
                phone: true,
              },
            },
          },
        },
      },
    });

    res.json({ success: true, data: appointments });
  } catch (err) {
    next(err);
  }
}

export async function updateAppointment(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const parsed = updateAppointmentSchema.parse(req.body);

    const existing = await prisma.appointment.findUnique({
      where: { id },
      include: { enquiry: true },
    });

    if (!existing) {
      res.status(404).json({ success: false, message: 'Appointment not found' });
      return;
    }

    const targetDate = parsed.date || existing.date;
    const targetSlot = parsed.timeSlot || existing.timeSlot;

    // If changing to Confirmed or rescheduling, check conflict
    if (parsed.status === 'Confirmed' || (parsed.date && parsed.date !== existing.date)) {
      const conflict = await prisma.appointment.findFirst({
        where: {
          id: { not: id },
          date: targetDate,
          timeSlot: targetSlot,
          status: 'Confirmed',
        },
      });

      if (conflict) {
        res.status(409).json({
          success: false,
          message: `Slot ${targetSlot} on ${targetDate} is already confirmed for another appointment. Please choose another time.`,
        });
        return;
      }
    }

    const updated = await prisma.$transaction(async (tx) => {
      const appt = await tx.appointment.update({
        where: { id },
        data: {
          status: parsed.status,
          date: targetDate,
          timeSlot: targetSlot,
          rescheduleReason: parsed.rescheduleReason || existing.rescheduleReason,
          cancellationReason: parsed.cancellationReason || existing.cancellationReason,
          adminNotes: parsed.adminNotes || existing.adminNotes,
        },
      });

      // Synchronize enquiry status if appropriate
      if (parsed.status === 'Confirmed') {
        await tx.enquiry.update({
          where: { id: existing.enquiryId },
          data: { status: 'Appointment Confirmed' },
        });
        await tx.statusHistory.create({
          data: {
            enquiryId: existing.enquiryId,
            fromStatus: existing.enquiry.status,
            toStatus: 'Appointment Confirmed',
            changedBy: req.admin?.name || 'Administrator',
            note: `Appointment confirmed for ${targetDate} at ${targetSlot}`,
          },
        });
      } else if (parsed.status === 'Cancelled') {
        await tx.statusHistory.create({
          data: {
            enquiryId: existing.enquiryId,
            fromStatus: existing.enquiry.status,
            toStatus: existing.enquiry.status,
            changedBy: req.admin?.name || 'Administrator',
            note: `Appointment cancelled: ${parsed.cancellationReason || 'No reason provided'}`,
          },
        });
      }

      return appt;
    });

    res.json({
      success: true,
      message: `Appointment updated to ${parsed.status}.`,
      data: updated,
    });
  } catch (err) {
    next(err);
  }
}

export async function createAppointment(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = createAppointmentSchema.parse(req.body);

    const enquiry = await prisma.enquiry.findUnique({
      where: { id: parsed.enquiryId },
    });

    if (!enquiry) {
      res.status(404).json({ success: false, message: 'Enquiry not found' });
      return;
    }

    // Check conflict if Confirmed
    if (parsed.status === 'Confirmed') {
      const conflict = await prisma.appointment.findFirst({
        where: {
          date: parsed.date,
          timeSlot: parsed.timeSlot,
          status: 'Confirmed',
        },
      });

      if (conflict && conflict.enquiryId !== parsed.enquiryId) {
        res.status(409).json({
          success: false,
          message: `Slot ${parsed.timeSlot} on ${parsed.date} is already confirmed for another applicant. Please choose another time slot.`,
        });
        return;
      }
    }

    const appointment = await prisma.$transaction(async (tx) => {
      // Find existing appointment for this enquiry
      const existingAppt = await tx.appointment.findFirst({
        where: { enquiryId: parsed.enquiryId },
        orderBy: { createdAt: 'desc' },
      });

      let appt;
      if (existingAppt) {
        appt = await tx.appointment.update({
          where: { id: existingAppt.id },
          data: {
            date: parsed.date,
            timeSlot: parsed.timeSlot,
            meetingMode: parsed.meetingMode,
            status: parsed.status,
            adminNotes: parsed.adminNotes || existingAppt.adminNotes,
          },
        });
      } else {
        appt = await tx.appointment.create({
          data: {
            enquiryId: parsed.enquiryId,
            date: parsed.date,
            timeSlot: parsed.timeSlot,
            meetingMode: parsed.meetingMode,
            status: parsed.status,
            adminNotes: parsed.adminNotes,
          },
        });
      }

      // Update enquiry status
      await tx.enquiry.update({
        where: { id: parsed.enquiryId },
        data: {
          status: 'Appointment Confirmed',
          preferredDate: parsed.date,
          preferredTimeSlot: parsed.timeSlot,
          meetingMode: parsed.meetingMode,
        },
      });

      // Record in status history
      await tx.statusHistory.create({
        data: {
          enquiryId: parsed.enquiryId,
          fromStatus: enquiry.status,
          toStatus: 'Appointment Confirmed',
          changedBy: req.admin?.name || 'Administrator',
          note: `Appointment allotted for ${parsed.date} at ${parsed.timeSlot} (${parsed.meetingMode.toUpperCase()}). ${parsed.adminNotes ? 'Notes: ' + parsed.adminNotes : ''}`,
        },
      });

      return appt;
    });

    res.status(201).json({
      success: true,
      message: 'Consultation appointment allotted and confirmed.',
      data: appointment,
    });
  } catch (err) {
    next(err);
  }
}

// 4. Content Management (Site Content, Services CRUD, FAQs CRUD, Availability)
export async function updateSiteContent(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = updateSiteContentSchema.parse(req.body);

    const updated = await prisma.siteContent.upsert({
      where: { id: 'default_content' },
      update: data,
      create: { id: 'default_content', ...data },
    });

    res.json({
      success: true,
      message: 'Website content updated and published successfully.',
      data: updated,
    });
  } catch (err) {
    next(err);
  }
}

// Services CRUD
export async function getAdminServices(_req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const services = await prisma.service.findMany({
      orderBy: { displayOrder: 'asc' },
    });
    res.json({ success: true, data: services });
  } catch (err) {
    next(err);
  }
}

export async function createService(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = serviceSchema.parse(req.body);
    const service = await prisma.service.create({ data });
    res.status(201).json({ success: true, message: 'Service added successfully.', data: service });
  } catch (err) {
    next(err);
  }
}

export async function updateService(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const data = serviceSchema.parse(req.body);
    const service = await prisma.service.update({ where: { id }, data });
    res.json({ success: true, message: 'Service updated successfully.', data: service });
  } catch (err) {
    next(err);
  }
}

export async function deleteService(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    await prisma.service.delete({ where: { id } });
    res.json({ success: true, message: 'Service deleted successfully.' });
  } catch (err) {
    next(err);
  }
}

// FAQs CRUD
export async function getAdminFaqs(_req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const faqs = await prisma.faq.findMany({
      orderBy: { displayOrder: 'asc' },
    });
    res.json({ success: true, data: faqs });
  } catch (err) {
    next(err);
  }
}

export async function createFaq(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = faqSchema.parse(req.body);
    const faq = await prisma.faq.create({ data });
    res.status(201).json({ success: true, message: 'FAQ added successfully.', data: faq });
  } catch (err) {
    next(err);
  }
}

export async function updateFaq(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const data = faqSchema.parse(req.body);
    const faq = await prisma.faq.update({ where: { id }, data });
    res.json({ success: true, message: 'FAQ updated successfully.', data: faq });
  } catch (err) {
    next(err);
  }
}

export async function deleteFaq(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    await prisma.faq.delete({ where: { id } });
    res.json({ success: true, message: 'FAQ deleted successfully.' });
  } catch (err) {
    next(err);
  }
}

// Availability Settings
export async function getAvailabilitySettings(_req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const [configs, blockedDates] = await Promise.all([
      prisma.availabilityConfig.findMany({ orderBy: { dayOfWeek: 'asc' } }),
      prisma.blockedDate.findMany({ orderBy: { date: 'asc' } }),
    ]);
    res.json({ success: true, data: { weeklyConfigs: configs, blockedDates } });
  } catch (err) {
    next(err);
  }
}

export async function updateWeeklyConfig(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const { isAvailable, startTime, endTime, slotDurationMinutes } = req.body;

    const updated = await prisma.availabilityConfig.update({
      where: { id },
      data: {
        isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : undefined,
        startTime: startTime || undefined,
        endTime: endTime || undefined,
        slotDurationMinutes: slotDurationMinutes ? Number(slotDurationMinutes) : undefined,
      },
    });

    res.json({ success: true, message: 'Schedule updated successfully.', data: updated });
  } catch (err) {
    next(err);
  }
}

export async function bulkUpdateWeeklySchedule(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { configs } = req.body; // array of { id, isAvailable, startTime, endTime, slotDurationMinutes }
    if (!Array.isArray(configs)) {
      res.status(400).json({ success: false, message: 'Configs array required.' });
      return;
    }

    const updates = await Promise.all(
      configs.map((c: any) =>
        prisma.availabilityConfig.update({
          where: { id: c.id },
          data: {
            isAvailable: c.isAvailable !== undefined ? Boolean(c.isAvailable) : undefined,
            startTime: c.startTime || undefined,
            endTime: c.endTime || undefined,
            slotDurationMinutes: c.slotDurationMinutes ? Number(c.slotDurationMinutes) : undefined,
          },
        })
      )
    );

    res.json({ success: true, message: 'All weekly schedules updated successfully.', data: updates });
  } catch (err) {
    next(err);
  }
}

export async function blockDate(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { date, reason } = req.body;
    if (!date) {
      res.status(400).json({ success: false, message: 'Date is required' });
      return;
    }

    const blocked = await prisma.blockedDate.upsert({
      where: { date },
      update: { reason: reason || 'Office Holiday' },
      create: { date, reason: reason || 'Office Holiday' },
    });

    res.status(201).json({ success: true, message: 'Date blocked.', data: blocked });
  } catch (err) {
    next(err);
  }
}

export async function unblockDate(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { date } = req.params;
    await prisma.blockedDate.deleteMany({ where: { date } });
    res.json({ success: true, message: 'Date unblocked.' });
  } catch (err) {
    next(err);
  }
}
