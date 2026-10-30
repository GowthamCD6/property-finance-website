-- =====================================================================
-- Prime Associates — Loans & Constructions
-- Database Schema & Seed Data for MySQL (Navicat Compatible)
-- Generated for: Navicat Premium / Navicat for MySQL
-- Database: prime_associates
-- =====================================================================

CREATE DATABASE IF NOT EXISTS `prime_associates` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `prime_associates`;

SET FOREIGN_KEY_CHECKS = 0;

-- ---------------------------------------------------------------------
-- 1. Table: AdminUser
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `AdminUser`;
CREATE TABLE `AdminUser` (
  `id` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `passwordHash` VARCHAR(255) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `role` VARCHAR(50) NOT NULL DEFAULT 'admin',
  `lastLoginAt` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `AdminUser_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 2. Table: Service
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `Service`;
CREATE TABLE `Service` (
  `id` VARCHAR(191) NOT NULL,
  `slug` VARCHAR(191) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `shortDescription` TEXT NOT NULL,
  `fullDescription` LONGTEXT NOT NULL,
  `iconName` VARCHAR(100) NOT NULL DEFAULT 'Home',
  `displayOrder` INT NOT NULL DEFAULT 0,
  `isActive` TINYINT(1) NOT NULL DEFAULT 1,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `Service_slug_key` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 3. Table: Faq
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `Faq`;
CREATE TABLE `Faq` (
  `id` VARCHAR(191) NOT NULL,
  `question` VARCHAR(500) NOT NULL,
  `answer` TEXT NOT NULL,
  `category` VARCHAR(100) NOT NULL DEFAULT 'General',
  `displayOrder` INT NOT NULL DEFAULT 0,
  `isPublished` TINYINT(1) NOT NULL DEFAULT 1,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 4. Table: SiteContent
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `SiteContent`;
CREATE TABLE `SiteContent` (
  `id` VARCHAR(191) NOT NULL DEFAULT 'default_content',
  `businessName` VARCHAR(255) NOT NULL DEFAULT 'Prime Associates — Loans & Constructions',
  `tagline` VARCHAR(255) NULL DEFAULT 'Your Trusted Property Finance & Loan Advisory Partner',
  `businessPhone` VARCHAR(100) NOT NULL DEFAULT '+91 96555 66613, +91 95144 66600',
  `businessEmail` VARCHAR(191) NOT NULL DEFAULT 'primeassociates2008@gmail.com',
  `officeAddress` TEXT NOT NULL,
  `cityState` VARCHAR(191) NOT NULL DEFAULT 'Tirupur, Tamil Nadu, India',
  `businessHours` VARCHAR(191) NOT NULL DEFAULT 'Monday – Saturday: 9:30 AM – 6:30 PM (IST)',
  
  `announcementText` VARCHAR(500) NULL,
  `announcementActive` TINYINT(1) NOT NULL DEFAULT 1,
  `announcementLink` VARCHAR(255) NULL,
  `whatsappNumber` VARCHAR(50) NULL DEFAULT '+919655566613',
  `whatsappMessage` TEXT NULL,
  `socialLinks` LONGTEXT NULL,
  `registrationDetails` TEXT NULL,
  
  `heroEyebrow` VARCHAR(255) NOT NULL DEFAULT 'PRIME ASSOCIATES • LOANS & CONSTRUCTIONS',
  `heroHeadline` VARCHAR(255) NOT NULL DEFAULT 'Get Your Home & Mortgage Loans at Lowest Rates with Government Subsidy.',
  `heroRotatingWords` TEXT NULL,
  `heroSubtitle` TEXT NOT NULL,
  `heroCtaText` VARCHAR(100) NOT NULL DEFAULT 'Discuss Your Loan',
  `heroSecondaryCtaText` VARCHAR(100) NOT NULL DEFAULT 'Explore Loan Options',
  `heroImageUrl` TEXT NOT NULL,
  `heroBadges` LONGTEXT NULL,
  
  `statsCapital` VARCHAR(50) NULL DEFAULT '120',
  `statsCapitalSuffix` VARCHAR(50) NULL DEFAULT 'Cr+',
  `statsCapitalLabel` VARCHAR(100) NULL DEFAULT 'Capital Facilitated',
  `statsLenders` VARCHAR(50) NULL DEFAULT '40',
  `statsLendersSuffix` VARCHAR(50) NULL DEFAULT '+',
  `statsLendersLabel` VARCHAR(100) NULL DEFAULT 'Partner Banks & NBFCs',
  `statsSanction` VARCHAR(50) NULL DEFAULT '98.4',
  `statsSanctionSuffix` VARCHAR(50) NULL DEFAULT '%',
  `statsSanctionLabel` VARCHAR(100) NULL DEFAULT 'Sanction Success Rate',
  `statsTurnaround` VARCHAR(50) NULL DEFAULT '24',
  `statsTurnaroundSuffix` VARCHAR(50) NULL DEFAULT 'Hours',
  `statsTurnaroundLabel` VARCHAR(100) NULL DEFAULT 'Turnaround Time',
  
  `rateMatrix` LONGTEXT NULL,
  `whyChooseUsTitle` VARCHAR(255) NULL,
  `whyChooseUsSubtitle` TEXT NULL,
  `whyChooseUsPillars` LONGTEXT NULL,
  `processTitle` VARCHAR(255) NULL,
  `processSubtitle` TEXT NULL,
  `processSteps` LONGTEXT NULL,
  
  `salariedDocs` LONGTEXT NULL,
  `selfEmployedDocs` LONGTEXT NULL,
  `propertyDocs` LONGTEXT NULL,
  `testimonials` LONGTEXT NULL,
  
  `aboutHeading` VARCHAR(255) NOT NULL,
  `aboutText` LONGTEXT NOT NULL,
  `aboutImageUrl` TEXT NOT NULL,
  `aboutMission` LONGTEXT NULL,
  `aboutVision` LONGTEXT NULL,
  `aboutMilestones` LONGTEXT NULL,
  `aboutTeam` LONGTEXT NULL,
  `aboutPillars` LONGTEXT NULL,
  
  `contactHeroTitle` VARCHAR(255) NULL,
  `contactHeroSubtitle` TEXT NULL,
  `contactHeroImageUrl` TEXT NULL,
  `branchOffices` LONGTEXT NULL,
  
  `calcDefaultHomeRate` DOUBLE NULL DEFAULT 7.25,
  `calcDefaultLapRate` DOUBLE NULL DEFAULT 8.50,
  `calcDefaultAmount` DOUBLE NULL DEFAULT 5000000,
  `calcDefaultTenure` INT NULL DEFAULT 20,
  
  `disclaimerText` LONGTEXT NOT NULL,
  `privacyPolicy` LONGTEXT NOT NULL,
  `termsConditions` LONGTEXT NOT NULL,
  `copyrightText` VARCHAR(255) NOT NULL,
  
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 5. Table: Enquiry
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `Enquiry`;
CREATE TABLE `Enquiry` (
  `id` VARCHAR(191) NOT NULL,
  `referenceNumber` VARCHAR(191) NOT NULL,
  `fullName` VARCHAR(191) NOT NULL,
  `mobileNumber` VARCHAR(50) NOT NULL,
  `email` VARCHAR(191) NULL,
  `preferredContactMethod` VARCHAR(50) NOT NULL DEFAULT 'phone',
  `cityState` VARCHAR(191) NOT NULL,
  `loanType` VARCHAR(191) NOT NULL,
  `serviceId` VARCHAR(191) NULL,
  `loanAmount` DOUBLE NOT NULL,
  `propertyType` VARCHAR(50) NOT NULL,
  `propertyLocation` VARCHAR(255) NOT NULL,
  `propertyOwnershipStatus` VARCHAR(50) NOT NULL,
  `employmentType` VARCHAR(50) NOT NULL,
  `preferredDate` VARCHAR(50) NOT NULL DEFAULT 'Pending Advisor Allotment',
  `preferredTimeSlot` VARCHAR(100) NOT NULL DEFAULT 'Pending Advisor Allotment',
  `meetingMode` VARCHAR(50) NOT NULL DEFAULT 'phone',
  `additionalNotes` TEXT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'New',
  `consentGiven` TINYINT(1) NOT NULL DEFAULT 0,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `Enquiry_referenceNumber_key` (`referenceNumber`),
  KEY `Enquiry_serviceId_fkey` (`serviceId`),
  CONSTRAINT `Enquiry_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Service` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 6. Table: Appointment
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `Appointment`;
CREATE TABLE `Appointment` (
  `id` VARCHAR(191) NOT NULL,
  `enquiryId` VARCHAR(191) NOT NULL,
  `date` VARCHAR(50) NOT NULL,
  `timeSlot` VARCHAR(100) NOT NULL,
  `timezone` VARCHAR(50) NOT NULL DEFAULT 'Asia/Kolkata',
  `meetingMode` VARCHAR(50) NOT NULL DEFAULT 'phone',
  `status` VARCHAR(50) NOT NULL DEFAULT 'Requested',
  `rescheduleReason` TEXT NULL,
  `cancellationReason` TEXT NULL,
  `adminNotes` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `Appointment_enquiryId_fkey` (`enquiryId`),
  KEY `Appointment_date_timeSlot_idx` (`date`, `timeSlot`),
  CONSTRAINT `Appointment_enquiryId_fkey` FOREIGN KEY (`enquiryId`) REFERENCES `Enquiry` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 7. Table: EnquiryNote
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `EnquiryNote`;
CREATE TABLE `EnquiryNote` (
  `id` VARCHAR(191) NOT NULL,
  `enquiryId` VARCHAR(191) NOT NULL,
  `authorName` VARCHAR(191) NOT NULL DEFAULT 'Consultant',
  `content` TEXT NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `EnquiryNote_enquiryId_fkey` (`enquiryId`),
  CONSTRAINT `EnquiryNote_enquiryId_fkey` FOREIGN KEY (`enquiryId`) REFERENCES `Enquiry` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 8. Table: StatusHistory
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `StatusHistory`;
CREATE TABLE `StatusHistory` (
  `id` VARCHAR(191) NOT NULL,
  `enquiryId` VARCHAR(191) NOT NULL,
  `fromStatus` VARCHAR(50) NOT NULL,
  `toStatus` VARCHAR(50) NOT NULL,
  `changedBy` VARCHAR(191) NOT NULL DEFAULT 'System',
  `note` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `StatusHistory_enquiryId_fkey` (`enquiryId`),
  CONSTRAINT `StatusHistory_enquiryId_fkey` FOREIGN KEY (`enquiryId`) REFERENCES `Enquiry` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 9. Table: AvailabilityConfig
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `AvailabilityConfig`;
CREATE TABLE `AvailabilityConfig` (
  `id` VARCHAR(191) NOT NULL,
  `dayOfWeek` INT NOT NULL,
  `dayName` VARCHAR(50) NOT NULL,
  `startTime` VARCHAR(20) NOT NULL DEFAULT '10:00',
  `endTime` VARCHAR(20) NOT NULL DEFAULT '18:00',
  `slotDurationMinutes` INT NOT NULL DEFAULT 60,
  `isAvailable` TINYINT(1) NOT NULL DEFAULT 1,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 10. Table: BlockedDate
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `BlockedDate`;
CREATE TABLE `BlockedDate` (
  `id` VARCHAR(191) NOT NULL,
  `date` VARCHAR(50) NOT NULL,
  `reason` VARCHAR(255) NOT NULL DEFAULT 'Holiday',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `BlockedDate_date_key` (`date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================================
-- PRE-POPULATED PRODUCTION SEED DATA
-- =====================================================================

-- 1. Default Admin User (Password: Admin@123456)
INSERT INTO `AdminUser` (`id`, `email`, `passwordHash`, `name`, `role`)
VALUES (
  'admin_primary_001',
  'admin@wealthanchor.in',
  '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.qH0vSg4p0/jGZ5cZqQvR0zFv61i0LSm',
  'Advisory Operations Manager',
  'superadmin'
) ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

INSERT INTO `AdminUser` (`id`, `email`, `passwordHash`, `name`, `role`)
VALUES (
  'admin_primary_002',
  'admin@primeassociateloans.in',
  '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.qH0vSg4p0/jGZ5cZqQvR0zFv61i0LSm',
  'Principal Loan Consultant',
  'admin'
) ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

-- 2. Availability Configurations (Monday to Saturday Open, Sunday Closed)
INSERT INTO `AvailabilityConfig` (`id`, `dayOfWeek`, `dayName`, `startTime`, `endTime`, `slotDurationMinutes`, `isAvailable`)
VALUES
  ('cfg_day_0', 0, 'Sunday', '10:00', '14:00', 60, 0),
  ('cfg_day_1', 1, 'Monday', '10:00', '18:00', 60, 1),
  ('cfg_day_2', 2, 'Tuesday', '10:00', '18:00', 60, 1),
  ('cfg_day_3', 3, 'Wednesday', '10:00', '18:00', 60, 1),
  ('cfg_day_4', 4, 'Thursday', '10:00', '18:00', 60, 1),
  ('cfg_day_5', 5, 'Friday', '10:00', '18:00', 60, 1),
  ('cfg_day_6', 6, 'Saturday', '10:00', '16:00', 60, 1)
ON DUPLICATE KEY UPDATE `isAvailable`=VALUES(`isAvailable`), `startTime`=VALUES(`startTime`), `endTime`=VALUES(`endTime`);

-- 3. Blocked Dates (Upcoming Holidays)
INSERT INTO `BlockedDate` (`id`, `date`, `reason`)
VALUES
  ('blk_2026_01', '2026-11-01', 'Regional Office Holiday [Regional Festival]'),
  ('blk_2026_02', '2026-12-25', 'Christmas Day [National Holiday]'),
  ('blk_2026_03', '2027-01-01', 'New Year Holiday [National Holiday]'),
  ('blk_2026_04', '2027-01-14', 'Pongal Festival [Regional Festival]')
ON DUPLICATE KEY UPDATE `reason`=VALUES(`reason`);

-- 4. Core Loan Services Catalog
INSERT INTO `Service` (`id`, `slug`, `title`, `shortDescription`, `fullDescription`, `iconName`, `displayOrder`, `isActive`)
VALUES
  (
    'srv_001',
    'home-loans',
    'Home Loans & Self Construction',
    'Self-construction, plot purchase with construction, new/old home purchase, and tiled house loans from 7.25% p.a. with government subsidy.',
    'Comprehensive guidance across Government and Private Banks for residential home financing. We specialize in self-construction on owned land, plot purchase with construction, new and old home purchases, and tiled house financing with government subsidy assistance.',
    'Home',
    1,
    1
  ),
  (
    'srv_002',
    'loan-against-property',
    'Mortgage Loans (LAP)',
    'Secured loans against concrete buildings, tiled houses, empty land/plots, and commercial buildings starting from 8.50% p.a.',
    'Evaluation and syndication of mortgage loans against registered concrete buildings, tiled houses, empty land/plots, and commercial buildings. We also take over existing high-interest loans from other banks to lock in the lowest interest rates.',
    'Building',
    2,
    1
  ),
  (
    'srv_003',
    'purchase-loans',
    'Purchase Loans & Bank Takeover',
    'Plot purchase, new/old homes, tiled houses, commercial buildings, and loan takeover from private banks to government banks at lowest rates.',
    'Bespoke financing for plot purchases, plot with construction, ready-to-move/old homes, tiled house purchases, and commercial building purchases. Plus our specialized loan takeover desk transferring loans from private banks to government banks at lowest interest rates.',
    'Building2',
    3,
    1
  ),
  (
    'srv_004',
    'vehicle-loans',
    'Vehicle Loans & Refinance',
    'Competitive loans for new cars, used cars, used car refinancing, and commercial vehicles with rapid processing.',
    'Complete automotive finance solutions covering new cars, used cars, used car refinance, and commercial vehicles across leading government and private banking partners with swift turnaround.',
    'Briefcase',
    4,
    1
  ),
  (
    'srv_005',
    'loan-consultation',
    'Loan Consultation & Eligibility Review',
    'One-on-one consultation regarding debt-to-income ratios, government subsidy eligibility, and bank selection.',
    'Personalised consultation with our loan specialists in Tirupur or virtually. We evaluate eligibility guidelines, calculate feasible loan-to-value (LTV) limits, examine parent deeds, and streamline the dossier for lowest rate approvals.',
    'FileCheck',
    5,
    1
  )
ON DUPLICATE KEY UPDATE `title`=VALUES(`title`), `shortDescription`=VALUES(`shortDescription`);

-- 5. Advisory FAQs
INSERT INTO `Faq` (`id`, `question`, `answer`, `category`, `displayOrder`, `isPublished`)
VALUES
  (
    'faq_001',
    'What is the difference between a Home Loan and a Loan Against Property (LAP)?',
    'A Home Loan is specifically taken to purchase or construct a residential property, offering lower interest rates (starting at 7.25% p.a.) and government subsidies. A Loan Against Property (LAP) is a mortgage loan where you pledge an existing property (concrete house, tiled house, commercial building, or vacant plot) to unlock funds for business expansion or personal needs, starting at 8.50% p.a.',
    'General',
    1,
    1
  ),
  (
    'faq_002',
    'Do you handle loans for tiled houses or unapproved layout plots?',
    'Yes, we specialize in challenging and non-standard property approvals in Tirupur, Coimbatore, and Erode districts, including tiled houses, agricultural-adjacent residential plots, parent deed continuity issues, and properties without formal municipal plan approvals.',
    'Eligibility',
    2,
    1
  ),
  (
    'faq_003',
    'How does your Private Bank to Government Bank loan takeover service work?',
    'If you are currently servicing a high-interest mortgage loan with a private financier or NBFC at 11%–14%, we structure an institutional balance transfer to nationalized PSU banks (SBI, Canara, Bank of Baroda, etc.) at 8.50%–9.25%, drastically reducing your monthly EMI and unlocking top-up capital.',
    'Takeovers',
    3,
    1
  ),
  (
    'faq_004',
    'What documents are needed to begin the initial loan assessment?',
    'For salaried applicants: KYC (Aadhaar & PAN), 6 months bank statement, 3 months payslips, and parent deed copy. For self-employed/business: 1–2 years ITR, GST returns, 1 year current account bank statements, and title documents.',
    'Documents',
    4,
    1
  ),
  (
    'faq_005',
    'Do you charge any upfront consultation or application fees?',
    'No. Prime Associates operates on complete transparency with zero advance advisory charges prior to bank in-principle sanction. We are your advocate across 40+ lending institutions.',
    'General',
    5,
    1
  )
ON DUPLICATE KEY UPDATE `answer`=VALUES(`answer`);

-- 6. Full SiteContent Record
INSERT INTO `SiteContent` (
  `id`,
  `businessName`,
  `tagline`,
  `businessPhone`,
  `businessEmail`,
  `officeAddress`,
  `cityState`,
  `businessHours`,
  `announcementText`,
  `announcementActive`,
  `announcementLink`,
  `whatsappNumber`,
  `whatsappMessage`,
  `socialLinks`,
  `registrationDetails`,
  `heroEyebrow`,
  `heroHeadline`,
  `heroRotatingWords`,
  `heroSubtitle`,
  `heroCtaText`,
  `heroSecondaryCtaText`,
  `heroImageUrl`,
  `heroBadges`,
  `statsCapital`,
  `statsCapitalSuffix`,
  `statsCapitalLabel`,
  `statsLenders`,
  `statsLendersSuffix`,
  `statsLendersLabel`,
  `statsSanction`,
  `statsSanctionSuffix`,
  `statsSanctionLabel`,
  `statsTurnaround`,
  `statsTurnaroundSuffix`,
  `statsTurnaroundLabel`,
  `rateMatrix`,
  `whyChooseUsTitle`,
  `whyChooseUsSubtitle`,
  `whyChooseUsPillars`,
  `processTitle`,
  `processSubtitle`,
  `processSteps`,
  `aboutHeading`,
  `aboutText`,
  `aboutImageUrl`,
  `aboutMission`,
  `aboutVision`,
  `aboutMilestones`,
  `aboutTeam`,
  `contactHeroTitle`,
  `contactHeroSubtitle`,
  `contactHeroImageUrl`,
  `branchOffices`,
  `calcDefaultHomeRate`,
  `calcDefaultLapRate`,
  `calcDefaultAmount`,
  `calcDefaultTenure`,
  `disclaimerText`,
  `privacyPolicy`,
  `termsConditions`,
  `copyrightText`
) VALUES (
  'default_content',
  'Prime Associates — Loans & Constructions',
  'Your Trusted Property Finance & Loan Advisory Partner',
  '+91 96555 66613, +91 95144 66600',
  'primeassociates2008@gmail.com',
  'No. 48, 49, P.R. Complex, Binny Compound Main Street, Kumaran Road, Tirupur - 641601',
  'Tirupur, Tamil Nadu, India',
  'Monday – Saturday: 9:30 AM – 6:30 PM (IST)',
  'Special Home Loan Rates starting from 7.25% p.a. • Government Subsidy Assistance Available',
  1,
  '/services/home-loans',
  '+919655566613',
  'Hello Prime Associates, I would like to enquire about a property loan.',
  '{"facebook":"https://facebook.com","instagram":"https://instagram.com","linkedin":"https://linkedin.com","twitter":"https://twitter.com","mapUrl":"https://maps.google.com/?q=Prime+Associates+Tirupur"}',
  'GSTIN: 33ABCDE1234F1Z5 • Authorized Property Loan Facilitator & Direct Syndication Partner',
  'PRIME ASSOCIATES • LOANS & CONSTRUCTIONS',
  'Get Your Home & Mortgage Loans at Lowest Rates with Government Subsidy.',
  'Lowest Rates.,Govt. Subsidy.,7.25% Home Loans.,8.50% LAP.,Bank Takeover.',
  'Unlock institutional funding for high-value residential, commercial, and industrial properties. We partner with 40+ leading PSU & private banks and NBFCs across India to secure lowest benchmark interest rates, maximized borrowing eligibility, and zero advance fees.',
  'Discuss Your Loan',
  'Explore Loan Options',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  '["Direct Bank Syndication","Zero Upfront Charges","Doorstep Documentation","Fast 24-48h In-Principle Sanction"]',
  '120',
  'Cr+',
  'Capital Facilitated',
  '40',
  '+',
  'Partner Banks & NBFCs',
  '98.4',
  '%',
  'Sanction Success Rate',
  '24',
  'Hours',
  'Turnaround Time',
  '[{"id":"r1","bankName":"State Bank of India (SBI)","homeLoanRate":"7.25% - 8.50%","lapRate":"8.50% - 9.75%","maxTenure":"30 Years","processingFee":"Zero to 0.35%","ltv":"Up to 85%","popularTag":"PSU Benchmark"},{"id":"r2","bankName":"HDFC Bank","homeLoanRate":"7.40% - 8.65%","lapRate":"8.75% - 10.25%","maxTenure":"30 Years","processingFee":"Up to 0.50%","ltv":"Up to 80%","popularTag":"Fast Approval"},{"id":"r3","bankName":"ICICI Bank","homeLoanRate":"7.45% - 8.75%","lapRate":"8.85% - 10.50%","maxTenure":"25 Years","processingFee":"Up to 0.50%","ltv":"Up to 80%","popularTag":"Digital Docket"},{"id":"r4","bankName":"Bank of Baroda","homeLoanRate":"7.30% - 8.55%","lapRate":"8.60% - 9.90%","maxTenure":"30 Years","processingFee":"0.25% Min","ltv":"Up to 85%","popularTag":"Low Spread"}]',
  'Why Property Owners & Investors Choose Prime Associates',
  'We combine decades of on-ground property experience with institutional banking relationships.',
  '[{"title":"Govt. Subsidy & Lowest Rate Arbitrage","description":"We cross-compare 40+ nationalized and private banks to secure rates starting at 7.25% and maximize eligible PMAY/State interest subsidies.","metric":"Save ₹3–8 Lakhs"},{"title":"Unconventional Property Clearances","description":"Specialized approval desks for tiled roofs, parent-deed issues, unapproved layout plots, and self-construction without plan approvals.","metric":"98.4% Approvals"},{"title":"Private to Govt. Bank Takeovers","description":"Cut your monthly EMI by migrating high-interest loans from NBFCs/private financiers to public sector banks with top-up capital.","metric":"Up to 3.5% Rate Drop"},{"title":"Zero Upfront Consultant Charges","description":"100% transparent assistance with zero hidden advisory fees before bank in-principle sanction. We are your advocate.","metric":"Zero Advance"}]',
  'End-to-End Loan Facilitation Process',
  'From eligibility review to final bank disbursement, our consultants manage each phase.',
  '[{"stepNumber":"01","title":"Property & Profile Evaluation","description":"Initial meeting at our Tirupur office or via phone to evaluate title documents, guideline values, and income profile.","turnaround":"Hour 1–4"},{"stepNumber":"02","title":"Multi-Lender Syndication","description":"We tailor your loan dossier and simultaneously syndicate it to 3–4 best-fit banks for competitive sanction.","turnaround":"Day 1–2"},{"stepNumber":"03","title":"Legal, Valuation & Sanction","description":"Liaison with bank panel lawyers and technical valuers to resolve title queries and obtain sanction.","turnaround":"Day 3–5"},{"stepNumber":"04","title":"Disbursement & Subsidy Filing","description":"Final agreement execution, mortgage registration, loan drawdown, and government subsidy submission.","turnaround":"Day 5–7"}]',
  'Prime Associates — Loans & Constructions',
  'Get your home loans and mortgage loans at the lowest interest rates with government subsidy across government and private banks. We provide complete advisory and syndication for self-construction, new/old home purchase, tiled houses, empty plots, commercial buildings, vehicle loans, and low-interest bank takeovers.',
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1000&q=80',
  'To empower property owners, homebuyers, and entrepreneurs with transparent, optimal debt financing by navigating complex banking criteria with integrity, speed, and institutional precision.',
  'To become Tamil Nadu\'s most trusted and technologically advanced property finance advisory, recognized for zero upfront commissions and exceptional client outcomes.',
  '[{"year":"2008","title":"Founded in Tirupur","description":"Established with a mission to assist self-employed entrepreneurs and families with transparent home loan syndication.","stat":"Inception"},{"year":"2015","title":"Mortgage LAP Specialization","description":"Expanded loan-against-property portfolio for MSMEs, garment manufacturers, and landowners across Kongu belt.","stat":"₹25 Cr+"},{"year":"2020","title":"Bank Takeover Desk","description":"Launched dedicated takeover division transferring high-cost loans to nationalized PSU banks at benchmark rates.","stat":"₹60 Cr+"},{"year":"2026","title":"₹120+ Cr Sanctions Facilitated","description":"Crossed ₹120 Crore cumulative property loan facilitation across 40+ PSU and private banking partners.","stat":"₹120 Cr+"}]',
  '[{"id":"t1","name":"Senior Advisory Desk","role":"Chief Loan Syndicate","experience":"18+ Years Banking Practice","bio":"Forensic documentation specialist across commercial & residential properties.","imageUrl":"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"}]',
  'Connect with Our Advisory Team',
  'Schedule a confidential one-on-one consultation at our Tirupur office or request an instant phone evaluation.',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
  '[{"name":"Tirupur Head Office","address":"No. 48, 49, P.R. Complex, Binny Compound Main Street, Kumaran Road, Tirupur - 641601","phone":"+91 96555 66613, +91 95144 66600","email":"primeassociates2008@gmail.com","timings":"Monday – Saturday: 9:30 AM – 6:30 PM","mapEmbedUrl":"https://maps.google.com/?q=Prime+Associates+Tirupur"}]',
  7.25,
  8.50,
  5000000,
  20,
  'Prime Associates (Prime Associate Loans) is an independent loan consultancy and loan facilitation service. We are not a bank, NBFC, or direct credit lender. Loan sanctions, interest rates, valuation, eligibility, and disbursements are strictly at the sole discretion of the partner banks and lending institutions following their regulatory underwriting criteria.',
  'We respect your confidentiality. The personal, financial, and property details shared in this enquiry are solely used for eligibility assessment and arranging consultation. We do not sell or distribute your data to unauthorized third parties.',
  'Information provided on this website is for informational and consultation scheduling purposes only and does not constitute a formal financial commitment or binding loan offer.',
  'Prime Associates — Loans & Constructions. All rights reserved.'
) ON DUPLICATE KEY UPDATE `businessName`=VALUES(`businessName`);

-- 7. Sample Initial Enquiry with Status History
INSERT INTO `Enquiry` (
  `id`,
  `referenceNumber`,
  `fullName`,
  `mobileNumber`,
  `email`,
  `preferredContactMethod`,
  `cityState`,
  `loanType`,
  `serviceId`,
  `loanAmount`,
  `propertyType`,
  `propertyLocation`,
  `propertyOwnershipStatus`,
  `employmentType`,
  `preferredDate`,
  `preferredTimeSlot`,
  `meetingMode`,
  `additionalNotes`,
  `status`,
  `consentGiven`
) VALUES (
  'enq_sample_001',
  'VPF-2026-100854',
  'Karthik Ramachandran',
  '9843212345',
  'karthik.ram@example.com',
  'phone',
  'Tirupur, Tamil Nadu',
  'Home Loans & Self Construction',
  'srv_001',
  4500000,
  'residential',
  'Kumaran Road, Tirupur',
  'owned',
  'salaried',
  'Pending Advisor Allotment',
  'Morning (10:00 AM – 01:00 PM)',
  'in_person',
  'Self-construction of duplex house on 1,800 sq.ft owned plot. Need PMAY interest subsidy guidance.',
  'New',
  1
) ON DUPLICATE KEY UPDATE `fullName`=VALUES(`fullName`);

INSERT INTO `StatusHistory` (`id`, `enquiryId`, `fromStatus`, `toStatus`, `changedBy`, `note`)
VALUES (
  'sh_sample_001',
  'enq_sample_001',
  'None',
  'New',
  'System',
  'Customer enquiry registered through public website form. Awaiting advisor slot allotment.'
);

-- =====================================================================
-- Verification Query
-- =====================================================================
SELECT 'Database prime_associates and all 10 tables initialized successfully!' AS `Status`;
SHOW TABLES;
