import prisma from './client';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Seed Admin User
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@wealthanchor.in';
  const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'Admin@123456';
  const passwordHash = await bcrypt.hash(defaultPassword, 10);

  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    await prisma.adminUser.create({
      data: {
        email: adminEmail,
        passwordHash,
        name: 'Advisory Operations Manager',
        role: 'superadmin',
      },
    });
    console.log(`✅ Admin user created: ${adminEmail} (password: ${defaultPassword})`);
  } else {
    console.log(`ℹ️ Admin user already exists: ${adminEmail}`);
  }

  // 2. Seed SiteContent
  const existingContent = await prisma.siteContent.findUnique({
    where: { id: 'default_content' },
  });

  const updatedContentData = {
    businessName: 'Prime Associates — Loans & Constructions',
    businessPhone: '+91 96555 66613, +91 95144 66600',
    businessEmail: 'primeassociates2008@gmail.com',
    officeAddress: 'No. 48, 49, P.R. Complex, Binny Compound Main Street, Kumaran Road, Tirupur - 641601',
    cityState: 'Tirupur, Tamil Nadu, India',
    businessHours: 'Monday – Saturday: 9:30 AM – 6:30 PM (IST)',
    heroEyebrow: 'PRIME ASSOCIATES • LOANS & CONSTRUCTIONS',
    heroHeadline: 'Get Your Home & Mortgage Loans at Lowest Rates with Government Subsidy.',
    heroSubtitle: 'Expert loan facilitation across Government and Private Banks. Home Loans from 7.25% p.a., Mortgage Loans (LAP) from 8.50% p.a., Purchase Loans, Vehicle Loans, and Private-to-Government Bank Takeovers.',
    heroCtaText: 'Discuss Your Loan',
    heroSecondaryCtaText: 'Explore Loan Options',
    heroImageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    aboutHeading: 'Prime Associates — Loans & Constructions',
    aboutText: 'Get your home loans and mortgage loans at the lowest interest rates with government subsidy across government and private banks. We provide complete advisory and syndication for self-construction, new/old home purchase, tiled houses, empty plots, commercial buildings, vehicle loans, and low-interest bank takeovers.',
    aboutImageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1000&q=80',
    disclaimerText: 'Prime Associates (Prime Associate Loans) is an independent loan consultancy and loan facilitation service. We are not a bank, NBFC, or direct credit lender. Loan sanctions, interest rates, valuation, eligibility, and disbursements are strictly at the sole discretion of the partner banks and lending institutions following their regulatory underwriting criteria.',
    privacyPolicy: 'We respect your confidentiality. The personal, financial, and property details shared in this enquiry are solely used for eligibility assessment and arranging consultation. We do not sell or distribute your data to unauthorized third parties.',
    termsConditions: 'Information provided on this website is for informational and consultation scheduling purposes only and does not constitute a formal financial commitment or binding loan offer.',
    copyrightText: 'Prime Associates — Loans & Constructions. All rights reserved.',
  };

  if (!existingContent) {
    await prisma.siteContent.create({
      data: {
        id: 'default_content',
        ...updatedContentData,
      },
    });
    console.log('✅ Default site content created');
  } else {
    await prisma.siteContent.update({
      where: { id: 'default_content' },
      data: updatedContentData,
    });
    console.log('✅ Default site content updated with real Prime Associates details');
  }

  // 3. Seed Services
  const servicesData = [
    {
      slug: 'home-loans',
      title: 'Home Loans & Self Construction',
      shortDescription: 'Self-construction, plot purchase with construction, new/old home purchase, and tiled house loans from 7.25% p.a. with government subsidy.',
      fullDescription: 'Comprehensive guidance across Government and Private Banks for residential home financing. We specialize in self-construction on owned land, plot purchase with construction, new and old home purchases, and tiled house financing with government subsidy assistance.',
      iconName: 'Home',
      displayOrder: 1,
      isActive: true,
    },
    {
      slug: 'loan-against-property',
      title: 'Mortgage Loans (LAP)',
      shortDescription: 'Secured loans against concrete buildings, tiled houses, empty land/plots, and commercial buildings starting from 8.50% p.a.',
      fullDescription: 'Evaluation and syndication of mortgage loans against registered concrete buildings, tiled houses, empty land/plots, and commercial buildings. We also take over existing high-interest loans from other banks to lock in the lowest interest rates.',
      iconName: 'Building',
      displayOrder: 2,
      isActive: true,
    },
    {
      slug: 'purchase-loans',
      title: 'Purchase Loans & Bank Takeover',
      shortDescription: 'Plot purchase, new/old homes, tiled houses, commercial buildings, and loan takeover from private banks to government banks at lowest rates.',
      fullDescription: 'Bespoke financing for plot purchases, plot with construction, ready-to-move/old homes, tiled house purchases, and commercial building purchases. Plus our specialized loan takeover desk transferring loans from private banks to government banks at lowest interest rates.',
      iconName: 'Building2',
      displayOrder: 3,
      isActive: true,
    },
    {
      slug: 'vehicle-loans',
      title: 'Vehicle Loans & Refinance',
      shortDescription: 'Competitive loans for new cars, used cars, used car refinancing, and commercial vehicles with rapid processing.',
      fullDescription: 'Complete automotive finance solutions covering new cars, used cars, used car refinance, and commercial vehicles across leading government and private banking partners with swift turnaround.',
      iconName: 'Briefcase',
      displayOrder: 4,
      isActive: true,
    },
    {
      slug: 'loan-consultation',
      title: 'Loan Consultation & Eligibility Review',
      shortDescription: 'One-on-one consultation regarding debt-to-income ratios, government subsidy eligibility, and bank selection.',
      fullDescription: 'Personalised consultation with our loan specialists in Tirupur or virtually. We evaluate eligibility guidelines, calculate feasible loan-to-value (LTV) limits, examine parent deeds, and streamline the dossier for lowest rate approvals.',
      iconName: 'FileCheck',
      displayOrder: 5,
      isActive: true,
    },
  ];

  for (const s of servicesData) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: s,
      create: s,
    });
  }
  console.log(`✅ ${servicesData.length} Services seeded`);

  // 4. Seed FAQs
  const faqsData = [
    {
      question: 'What is a Home Loan versus a Loan Against Property (LAP)?',
      answer: 'A Home Loan is specifically taken to acquire, construct, or renovate a residential property. A Loan Against Property (LAP) is a secured mortgage loan where you pledge an already owned, unencumbered property as collateral to fund business operations, education, debt consolidation, or other liquidity needs.',
      category: 'General',
      displayOrder: 1,
      isPublished: true,
    },
    {
      question: 'Are you a direct lender, bank, or NBFC?',
      answer: 'No. Prime Associate Loans is an independent financial consultancy firm. We do not disburse funds or grant loan approvals ourselves. We guide applicants, assess preliminary eligibility, streamline documentation, and facilitate discussions with regulated commercial banks and NBFCs.',
      category: 'About Us',
      displayOrder: 2,
      isPublished: true,
    },
    {
      question: 'Does submitting a loan enquiry guarantee approval or a specific interest rate?',
      answer: 'No. Submitting an enquiry allows our advisory team to review your scenario and discuss potential avenues. All final loan sanctions, interest rates, processing fees, and disbursement timelines are determined solely by the chosen lending institutions based on their internal credit policies, property valuation, and bureau verification.',
      category: 'Eligibility',
      displayOrder: 3,
      isPublished: true,
    },
    {
      question: 'What documents should I prepare before an advisory consultation?',
      answer: 'Having basic details ready is helpful: recent salary slips or ITR filings (last 2–3 years), last 6 months bank statements, proof of identity/address, and initial property documents (e.g. sale deed, allotment letter, or property tax receipts). You do not need to share sensitive documents in the initial enquiry form.',
      category: 'Process',
      displayOrder: 4,
      isPublished: true,
    },
    {
      question: 'Who is eligible for a property-backed loan?',
      answer: 'Salaried professionals, self-employed individuals, professionals (doctors, CAs), and business entities with stable demonstrated income, clear title ownership or purchase agreement, and a satisfactory credit repayment track record generally qualify for property loan evaluation.',
      category: 'Eligibility',
      displayOrder: 5,
      isPublished: true,
    },
    {
      question: 'How do I schedule a consultation and what modes are available?',
      answer: 'You can select your preferred meeting date, time slot, and mode (Phone Call, Video Meeting, or In-Person at our Tirupur office) directly through our website enquiry form. Our team will verify slot availability and confirm your appointment.',
      category: 'Appointments',
      displayOrder: 6,
      isPublished: true,
    },
    {
      question: 'How is my personal and financial information handled?',
      answer: 'We strictly uphold client confidentiality. Your information is held securely and only utilized for eligibility advisory and appointment scheduling. We do not engage in unauthorized marketing or unsolicited data sharing with third parties.',
      category: 'Security',
      displayOrder: 7,
      isPublished: true,
    },
  ];

  const existingFaqs = await prisma.faq.count();
  if (existingFaqs === 0) {
    for (const faq of faqsData) {
      await prisma.faq.create({ data: faq });
    }
    console.log(`✅ ${faqsData.length} FAQs seeded`);
  }

  // 5. Seed Availability Configuration (Monday to Saturday)
  const existingConfig = await prisma.availabilityConfig.count();
  if (existingConfig === 0) {
    const days = [
      { dayOfWeek: 1, dayName: 'Monday', startTime: '10:00', endTime: '18:00', isAvailable: true },
      { dayOfWeek: 2, dayName: 'Tuesday', startTime: '10:00', endTime: '18:00', isAvailable: true },
      { dayOfWeek: 3, dayName: 'Wednesday', startTime: '10:00', endTime: '18:00', isAvailable: true },
      { dayOfWeek: 4, dayName: 'Thursday', startTime: '10:00', endTime: '18:00', isAvailable: true },
      { dayOfWeek: 5, dayName: 'Friday', startTime: '10:00', endTime: '18:00', isAvailable: true },
      { dayOfWeek: 6, dayName: 'Saturday', startTime: '10:00', endTime: '15:00', isAvailable: true },
      { dayOfWeek: 0, dayName: 'Sunday', startTime: '10:00', endTime: '13:00', isAvailable: false },
    ];

    for (const day of days) {
      await prisma.availabilityConfig.create({
        data: {
          dayOfWeek: day.dayOfWeek,
          dayName: day.dayName,
          startTime: day.startTime,
          endTime: day.endTime,
          slotDurationMinutes: 60,
          isAvailable: day.isAvailable,
        },
      });
    }
    console.log('✅ Weekly availability configurations seeded');
  }

  // 6. Seed Sample Initial Enquiries with Realistic Indian Profiles
  const existingEnquiries = await prisma.enquiry.count();
  if (existingEnquiries === 0) {
    const homeLoanService = await prisma.service.findFirst({ where: { slug: 'home-loans' } });
    const lapService = await prisma.service.findFirst({ where: { slug: 'loan-against-property' } });

    const sample1 = await prisma.enquiry.create({
      data: {
        referenceNumber: 'VPF-2026-1001',
        fullName: 'Rajesh Subramanian',
        mobileNumber: '+91 98450 12345',
        email: 'rajesh.subramanian@gmail.com',
        preferredContactMethod: 'phone',
        cityState: 'Bengaluru, Karnataka',
        loanType: 'Home Loan',
        serviceId: homeLoanService?.id,
        loanAmount: 6500000,
        propertyType: 'residential',
        propertyLocation: 'Whitefield, Bengaluru',
        propertyOwnershipStatus: 'purchasing',
        employmentType: 'salaried',
        preferredDate: '2026-10-25',
        preferredTimeSlot: '11:00 AM - 12:00 PM',
        meetingMode: 'phone',
        additionalNotes: 'Looking to purchase 3 BHK apartment under construction. Need guidance on LTV and interest rates.',
        status: 'New',
        consentGiven: true,
      },
    });

    await prisma.statusHistory.create({
      data: {
        enquiryId: sample1.id,
        fromStatus: 'None',
        toStatus: 'New',
        changedBy: 'System',
        note: 'Customer submitted loan enquiry via website form',
      },
    });

    await prisma.appointment.create({
      data: {
        enquiryId: sample1.id,
        date: '2026-10-25',
        timeSlot: '11:00 AM - 12:00 PM',
        timezone: 'Asia/Kolkata',
        meetingMode: 'phone',
        status: 'Requested',
      },
    });

    const sample2 = await prisma.enquiry.create({
      data: {
        referenceNumber: 'VPF-2026-1002',
        fullName: 'Meera Deshmukh',
        mobileNumber: '+91 99201 67890',
        email: 'meera.deshmukh@enterprises.in',
        preferredContactMethod: 'whatsapp',
        cityState: 'Pune, Maharashtra',
        loanType: 'Loan Against Property',
        serviceId: lapService?.id,
        loanAmount: 12000000,
        propertyType: 'commercial',
        propertyLocation: 'Shivaji Nagar, Pune',
        propertyOwnershipStatus: 'owned',
        employmentType: 'business_owner',
        preferredDate: '2026-10-26',
        preferredTimeSlot: '02:00 PM - 03:00 PM',
        meetingMode: 'video',
        additionalNotes: 'Self-owned commercial showroom. Seeking liquidity for working capital expansion.',
        status: 'Contacted',
        consentGiven: true,
      },
    });

    await prisma.statusHistory.createMany({
      data: [
        {
          enquiryId: sample2.id,
          fromStatus: 'None',
          toStatus: 'New',
          changedBy: 'System',
          note: 'Customer enquiry registered',
        },
        {
          enquiryId: sample2.id,
          fromStatus: 'New',
          toStatus: 'Contacted',
          changedBy: 'Advisory Operations Manager',
          note: 'Spoke with applicant via phone. Confirmed commercial property documents are in order.',
        },
      ],
    });

    await prisma.enquiryNote.create({
      data: {
        enquiryId: sample2.id,
        authorName: 'Advisory Operations Manager',
        content: 'Property valuation expected at approx ₹2.2 Cr. Verified GST filings for last 2 years. Video meeting requested for detailed document review.',
      },
    });

    await prisma.appointment.create({
      data: {
        enquiryId: sample2.id,
        date: '2026-10-26',
        timeSlot: '02:00 PM - 03:00 PM',
        timezone: 'Asia/Kolkata',
        meetingMode: 'video',
        status: 'Confirmed',
        adminNotes: 'Google Meet link to be shared 1 hour before scheduled discussion.',
      },
    });

    console.log('✅ Sample initial enquiries & appointments seeded');
  }

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during database seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
