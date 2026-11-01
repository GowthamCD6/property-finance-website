// Real-World Lending Architecture & Document Matrix based on Prime Associates Master Plan

export interface DocumentItemDef {
  id: string;
  name: string;
  category: 'KYC' | 'Income' | 'Legal' | 'Technical' | 'Mortgage_LAP' | 'Vehicle';
  tag: 'Mandatory' | 'Optional' | 'If Available' | 'Recommended' | 'Conditional';
  desc: string;
  sampleHint?: string;
}

export interface ChannelPartnersGroup {
  category: string;
  banks: string[];
}

export const CHANNEL_PARTNERS: ChannelPartnersGroup[] = [
  {
    category: 'Public Sector Banks',
    banks: [
      'State Bank of India (SBI)',
      'Indian Bank',
      'Bank of Baroda',
      'Punjab National Bank',
      'Canara Bank',
      'Union Bank of India',
      'Bank of India',
      'Central Bank of India',
      'Indian Overseas Bank (IOB)',
      'UCO Bank',
      'Bank of Maharashtra',
      'Punjab & Sind Bank',
      'Karnataka Bank',
      'LIC',
    ],
  },
  {
    category: 'Private Sector Banks',
    banks: [
      'HDFC Bank',
      'ICICI Bank',
      'Axis Bank',
      'Kotak Mahindra Bank',
      'IndusInd Bank',
      'Yes Bank',
      'Federal Bank',
      'IDBI Bank',
      'Bandhan Bank',
      'RBL Bank',
      'South Indian Bank',
      'City Union Bank',
    ],
  },
  {
    category: 'NBFCs (Non-Banking Financial Companies)',
    banks: [
      'Aditya Birla Capital Limited',
      'Tata Capital Limited',
      'TruHome Finance Limited',
      'Sundaram Finance Limited',
      'Cholamandalam Investment and Finance Company',
    ],
  },
];

export const ALL_CHANNEL_PARTNERS_FLAT = CHANNEL_PARTNERS.flatMap((g) => g.banks);

// Generate document list based on Loan Plan & Employment Mode
export function getRequiredDocumentsForPlan(
  loanType: string,
  employmentType: 'salaried' | 'self_employed' | 'cash_salary' | 'business_owner' | 'other' = 'salaried',
  carType: 'new' | 'used' | 'refinance' = 'new'
): DocumentItemDef[] {
  const lowerLoan = loanType.toLowerCase();
  const isCarLoan = lowerLoan.includes('vehicle') || lowerLoan.includes('car');
  const isLAP = lowerLoan.includes('lap') || lowerLoan.includes('mortgage') || lowerLoan.includes('against property');
  const isHomeOrConstruction = lowerLoan.includes('home') || lowerLoan.includes('construction') || lowerLoan.includes('purchase');

  // 1. CAR LOAN WORKFLOW
  if (isCarLoan) {
    const carDocs: DocumentItemDef[] = [
      {
        id: 'car-kyc-pan',
        name: 'PAN Card (Applicant & Co-Applicant)',
        category: 'KYC',
        tag: 'Optional',
        desc: 'Optional at consultation enquiry stage. Can be presented later during sanction.',
      },
      {
        id: 'car-kyc-aadhaar',
        name: 'Aadhaar Card (Applicant & Co-Applicant)',
        category: 'KYC',
        tag: 'Optional',
        desc: 'Optional at initial stage. Identity verification completed prior to disbursement.',
      },
      {
        id: 'car-kyc-photo',
        name: 'Passport Size Photo',
        category: 'KYC',
        tag: 'Optional',
        desc: 'Optional at initial stage. Recent photograph for final loan kit.',
      },
    ];

    if (carType === 'new') {
      carDocs.push(
        {
          id: 'car-new-quotation',
          name: 'Showroom Proforma Invoice / Quotation',
          category: 'Vehicle',
          tag: 'Mandatory',
          desc: 'Official showroom quotation showing On-Road Price breakdown (Eligible for up to 90% on-road funding).',
          sampleHint: 'Showroom name, vehicle variant, and tax breakdown.',
        },
        {
          id: 'car-new-booking',
          name: 'Booking Receipt / Down Payment Voucher',
          category: 'Vehicle',
          tag: 'Mandatory',
          desc: 'Advance booking receipt issued by the automobile dealership.',
        }
      );
    } else if (carType === 'used') {
      carDocs.push(
        {
          id: 'car-used-rc',
          name: 'RC Book (Vehicle Registration Certificate)',
          category: 'Vehicle',
          tag: 'Mandatory',
          desc: 'Front & back scan of original Vehicle RC showing model year & owner details.',
          sampleHint: 'Vehicle registration number, engine & chassis number.',
        },
        {
          id: 'car-used-insurance',
          name: 'Comprehensive Insurance Policy Copy',
          category: 'Vehicle',
          tag: 'Mandatory',
          desc: 'Valid comprehensive vehicle insurance policy document.',
        },
        {
          id: 'car-used-purchase-agreement',
          name: 'Purchase Agreement / Sale Receipt',
          category: 'Vehicle',
          tag: 'Mandatory',
          desc: 'Sale receipt or letter from seller specifying agreed purchase value.',
        }
      );
    } else {
      // Re-Finance
      carDocs.push(
        {
          id: 'car-refinance-rc',
          name: 'RC Book (Registration Certificate)',
          category: 'Vehicle',
          tag: 'Mandatory',
          desc: 'Clear copy of RC showing ownership and current hypothecation (if any).',
        },
        {
          id: 'car-refinance-insurance',
          name: 'Vehicle Insurance Copy',
          category: 'Vehicle',
          tag: 'Mandatory',
          desc: 'Currently active comprehensive vehicle insurance policy.',
        },
        {
          id: 'car-refinance-soa',
          name: 'Existing Loan Statement / Foreclosure Letter',
          category: 'Vehicle',
          tag: 'Mandatory',
          desc: 'Current financer loan statement showing outstanding balance for refinance equity.',
        }
      );
    }

    // Vehicle banking
    carDocs.push({
      id: 'car-bank-stmt',
      name: 'Last 6 Months Bank Statement',
      category: 'Income',
      tag: 'Mandatory',
      desc: 'Active operative bank statement showing monthly cash flow/credits.',
    });

    return carDocs;
  }

  // 2. PROPERTY LOANS (HOME LOANS, SELF-CONSTRUCTION, LAP, PROPERTY FUNDING)
  const docs: DocumentItemDef[] = [];

  // A. KYC (APPLICANT & CO-APPLICANT) - OPTIONAL AT INITIAL INTAKE
  docs.push(
    {
      id: 'kyc-pan',
      name: 'PAN Card (Applicant & Co-Applicant)',
      category: 'KYC',
      tag: 'Optional',
      desc: 'Optional at initial consultation. Verified prior to formal bank submission.',
    },
    {
      id: 'kyc-aadhaar',
      name: 'Aadhaar Card (Applicant & Co-Applicant)',
      category: 'KYC',
      tag: 'Optional',
      desc: 'Optional at enquiry stage. Front and back photo of Aadhaar Card.',
    },
    {
      id: 'kyc-photo',
      name: 'Passport Size Photo',
      category: 'KYC',
      tag: 'Optional',
      desc: 'Optional at enquiry stage. Recent color photo for loan application.',
    }
  );

  // B. INCOME DOCUMENTS (TAILORED TO EMPLOYMENT) - MANDATORY
  if (employmentType === 'salaried') {
    docs.push(
      {
        id: 'inc-sal-bank',
        name: 'Last 6 Months Salary Bank Statement',
        category: 'Income',
        tag: 'Mandatory',
        desc: 'Primary salary account statement reflecting regular monthly employer credits.',
      },
      {
        id: 'inc-sal-slips',
        name: 'Pay Slips (Last 6 Months)',
        category: 'Income',
        tag: 'Mandatory',
        desc: 'Official company payslips with earnings, deductions, PF, and gross/net breakups.',
      },
      {
        id: 'inc-sal-form16',
        name: 'Form 16 / ITR (Last 3 Years)',
        category: 'Income',
        tag: 'Mandatory',
        desc: 'Part A & B issued by employer or annual income tax acknowledgments.',
      }
    );
  } else if (employmentType === 'cash_salary') {
    docs.push(
      {
        id: 'inc-cash-bank',
        name: 'Last 1 Year Bank Statement',
        category: 'Income',
        tag: 'Mandatory',
        desc: 'Operative bank account statement reflecting ongoing cash deposits/transactions.',
      },
      {
        id: 'inc-cash-cert',
        name: 'Salary Certificate (from Employer / Business)',
        category: 'Income',
        tag: 'Mandatory',
        desc: 'Written certificate on employer letterhead confirming monthly hand-salary compensation.',
      }
    );
  } else {
    // Self-Employed / Business Owner - MANDATORY
    docs.push(
      {
        id: 'inc-se-bank',
        name: 'Last 1 Year Operative Bank Statement',
        category: 'Income',
        tag: 'Mandatory',
        desc: 'Complete 12-month statements for business current account and personal savings account.',
      },
      {
        id: 'inc-se-itr',
        name: 'ITR - Last 3 Years / 2 Years / 1 Year',
        category: 'Income',
        tag: 'Mandatory',
        desc: 'Income Tax Return acknowledgments with computation of income and CA audit balance sheets.',
      },
      {
        id: 'inc-se-gst',
        name: 'GST Certificate / Udyam MSME Certificate',
        category: 'Income',
        tag: 'Mandatory',
        desc: 'Valid government business registration, GST certificate, or MSME Udyam registration.',
      }
    );
  }

  // C. LEGAL PROPERTY DOCUMENTS - MANDATORY
  docs.push(
    {
      id: 'leg-title-deed',
      name: 'Registered Title Deed / Sale Document',
      category: 'Legal',
      tag: 'Mandatory',
      desc: 'Primary registered Sale Deed / Gift Deed / Settlement Deed establishing ownership.',
    },
    {
      id: 'leg-mother-docs',
      name: 'All Mother Documents (Previous Chain Deeds)',
      category: 'Legal',
      tag: 'Mandatory',
      desc: 'Complete unbroken chain of predecessor title deeds establishing 13 to 30 years historical chain.',
      sampleHint: 'Prior sale deeds, partition deeds, patta transfer copies.',
    },
    {
      id: 'leg-ec',
      name: 'Encumbrance Certificate (EC)',
      category: 'Legal',
      tag: 'Mandatory',
      desc: 'EC Form 15 verifying nil encumbrances, registered mortgages, or court attachments.',
    },
    {
      id: 'leg-chitta',
      name: 'Chitta / Patta & Revenue Records',
      category: 'Legal',
      tag: 'Mandatory',
      desc: 'Government revenue land records, Patta passbook, Chitta extracts, and Town Survey Records.',
    },
    {
      id: 'leg-layout-sketch',
      name: 'Layout Sketch Copy / FMB Sketch',
      category: 'Legal',
      tag: 'Mandatory',
      desc: 'Field Measurement Book (FMB) or registered layout sketch showing demarcated boundaries and road access.',
    }
  );

  // D. TECHNICAL DOCUMENTS - MANDATORY
  docs.push(
    {
      id: 'tech-approved-plan',
      name: 'Approved Sanctioned Building Plan',
      category: 'Technical',
      tag: 'Mandatory',
      desc: 'Sanctioned blueprint approved by Municipal Corporation, DTCP, CMDA, or Local Planning Authority.',
    },
    {
      id: 'tech-actual-estimate',
      name: 'Actual Construction Plan & Detailed Estimate',
      category: 'Technical',
      tag: 'Mandatory',
      desc: 'Detailed civil construction plan and itemized cost estimate prepared by a licensed chartered engineer.',
    },
    {
      id: 'tech-layout-copy',
      name: 'Layout Copy / Site Map',
      category: 'Technical',
      tag: 'Mandatory',
      desc: 'Approved layout copy showing plot location, access roads, and public utility reservations.',
    }
  );

  // E. ADDITIONAL DOCUMENTS FOR MORTGAGE LOAN (LAP) - MANDATORY
  if (isLAP) {
    docs.push(
      {
        id: 'lap-prop-tax',
        name: 'Property Tax Paid Receipt',
        category: 'Mortgage_LAP',
        tag: 'Mandatory',
        desc: 'Latest municipal or corporation property tax assessment receipt.',
      },
      {
        id: 'lap-water-tax',
        name: 'Water Tax Receipt',
        category: 'Mortgage_LAP',
        tag: 'Mandatory',
        desc: 'Latest water & drainage tax payment receipt from local civic body.',
      },
      {
        id: 'lap-eb-bill',
        name: 'Electricity Bill (EB Bill)',
        category: 'Mortgage_LAP',
        tag: 'Mandatory',
        desc: 'Recent EB white meter reading card or online TNEB electricity bill showing active connection in owner’s name.',
      }
    );
  }

  return docs;
}

