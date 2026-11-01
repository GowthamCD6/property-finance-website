import React, { useState } from 'react';
import {
  FileCheck,
  CheckCircle2,
  User,
  Building,
  Landmark,
  Copy,
  Check,
  Info,
  RefreshCw,
  Truck,
  FileSpreadsheet,
  Layers,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export interface InteractiveDocumentVaultProps {
  loanType?: 'home-loans' | 'loan-against-property' | 'property-backed-funding' | 'loan-consultation' | 'vehicle-loans' | 'all';
  embedded?: boolean;
}

interface DocItem {
  name: string;
  desc: string;
  tag: string;
}

interface ProfileGroup {
  id: string;
  label: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  docs: DocItem[];
}

export const InteractiveDocumentVault: React.FC<InteractiveDocumentVaultProps> = ({
  loanType = 'all',
  embedded = false,
}) => {
  const [copied, setCopied] = useState(false);

  // Define tailored document configurations per loan type
  const getProfilesForLoanType = (): {
    sectionBadge: string;
    sectionTitle: string;
    sectionSubtitle: string;
    profiles: ProfileGroup[];
  } => {
    switch (loanType) {
      case 'home-loans':
        return {
          sectionBadge: 'Home Loan & Construction Checklist',
          sectionTitle: 'Required Documentation for Home Loans (Self-Construction & Purchase)',
          sectionSubtitle:
            'Comprehensive checklist covering KYC, Income Proofs (Self-Employed, Salaried, Cash Salary), Legal Deeds (Mother documents, Chitta, EC), and Technical Building Plans.',
          profiles: [
            {
              id: 'kyc',
              label: 'A. KYC Documents',
              icon: <User className="w-4 h-4" />,
              title: 'KYC Documents (Applicant & Co-Applicant)',
              subtitle: 'Mandatory identification and address verification required from both applicant and co-applicant.',
              docs: [
                {
                  name: 'PAN Card (Applicant & Co-Applicant)',
                  desc: 'Permanent Account Number card mandatory for tax validation and credit evaluation.',
                  tag: 'Mandatory',
                },
                {
                  name: 'Aadhaar Card (Applicant & Co-Applicant)',
                  desc: 'Government Aadhaar identity proof with linked active mobile number for biometric e-KYC.',
                  tag: 'Mandatory',
                },
                {
                  name: 'Passport-Size Photographs',
                  desc: 'Recent passport-size colored photographs of both applicant and co-applicant.',
                  tag: 'Photo ID',
                },
                {
                  name: 'Applicant and Co-Applicant Details',
                  desc: 'Complete residential address proof, relationship declaration, contact details, and family profile particulars.',
                  tag: 'Profile Details',
                },
              ],
            },
            {
              id: 'income',
              label: 'B. Income Documents',
              icon: <Building className="w-4 h-4" />,
              title: 'Income Documents by Employment Stream',
              subtitle: 'Tailored requirements for Self-Employed Individuals, Salaried Employees, and Cash Salary (Hand Salary) recipients.',
              docs: [
                {
                  name: 'Self-Employed: Last 1 Year’s Bank Statement',
                  desc: '12-month complete operative current and savings bank accounts demonstrating routine turnover and cash flow.',
                  tag: 'Self-Employed',
                },
                {
                  name: 'Self-Employed: Income Tax Returns (ITR)',
                  desc: 'ITR acknowledgments with computation sheets for Last 3 years / 2 years / 1 year, if available.',
                  tag: 'ITR (If Available)',
                },
                {
                  name: 'Self-Employed: GST / Udyam Registration',
                  desc: 'GST Registration Certificate or Udyam MSME Certificate, if available.',
                  tag: 'Business Proof',
                },
                {
                  name: 'Salaried: Last 6 Months’ Bank Statements',
                  desc: 'Official bank statement of the designated salary credit account showing regular monthly salary debits/credits.',
                  tag: 'Salaried',
                },
                {
                  name: 'Salaried: Last 6 Months’ Salary Slips',
                  desc: 'Official company payslips detailing Basic, HRA, allowances, and statutory deductions, if available.',
                  tag: 'Payslips (If Available)',
                },
                {
                  name: 'Salaried: Form 16 (Last 3 Years)',
                  desc: 'Employer-issued Form 16 Part A & Part B for the last 3 years, if available.',
                  tag: 'Form 16 (If Available)',
                },
                {
                  name: 'Cash Salary (Hand Salary): Last 1 Year’s Bank Statement',
                  desc: '1 year savings account statement reflecting cash savings, household deposits, or family banking track.',
                  tag: 'Cash Salary',
                },
                {
                  name: 'Cash Salary (Hand Salary): Salary Certificate',
                  desc: 'Formal signed salary certificate from employer confirming monthly remuneration, designation, and tenure, if available.',
                  tag: 'Certificate (If Available)',
                },
              ],
            },
            {
              id: 'legal',
              label: 'C. Legal Documents',
              icon: <Landmark className="w-4 h-4" />,
              title: 'Legal Documents (Property & Title Deeds)',
              subtitle: 'Essential property documents, chain of mother deeds, encumbrance verification, and revenue records.',
              docs: [
                {
                  name: 'Primary Property Documents',
                  desc: 'Registered Sale Deed, Title Deed, Settlement Deed, or Partition Deed establishing current ownership.',
                  tag: 'Primary Title',
                },
                {
                  name: 'All Mother Documents (Previous Property Documents)',
                  desc: 'Complete unbroken chain of parent title deeds tracing legitimate property ownership history for 13 to 30 years.',
                  tag: 'Mother Deeds Chain',
                },
                {
                  name: 'Encumbrance Certificate (EC)',
                  desc: 'Official Sub-Registrar Office Encumbrance Certificate (EC Form 15) reflecting clear, unencumbered title for up to 30 years.',
                  tag: 'EC Form 15',
                },
                {
                  name: 'Chitta Extract',
                  desc: 'Official Chitta / Patta revenue land ownership record proving mutation and classification in government registers.',
                  tag: 'Revenue Chitta',
                },
                {
                  name: 'Layout Sketch Copy',
                  desc: 'Certified layout sketch copy reflecting surveyed plot boundaries, dimensions, and road frontage access.',
                  tag: 'Layout Sketch',
                },
              ],
            },
            {
              id: 'technical',
              label: 'D. Technical Documents',
              icon: <Layers className="w-4 h-4" />,
              title: 'Technical Documents (Self-Construction & Engineering)',
              subtitle: 'Municipal plans, civil engineer estimates, and site layout copies for self-construction sanction.',
              docs: [
                {
                  name: 'Approved Building Plan (If Available)',
                  desc: 'Sanctioned residential building plan approved by Municipal Corporation, Town Panchayat, or DTCP authorities, if available.',
                  tag: 'Sanction (If Available)',
                },
                {
                  name: 'Actual Building Plan & Estimate',
                  desc: 'Architectural structural plan drawings and stage-wise construction cost estimate certified by a registered civil engineer.',
                  tag: 'Civil Estimate',
                },
                {
                  name: 'Layout Copy',
                  desc: 'Approved layout copy showing site plan, demarcated plot number, and sanctioned area layout.',
                  tag: 'Layout Plan',
                },
              ],
            },
          ],
        };

      case 'loan-against-property':
        return {
          sectionBadge: 'LAP Document Checklist',
          sectionTitle: 'Required Documentation for Mortgage Loans (LAP)',
          sectionSubtitle:
            'Complete dossier of financial stability papers and property title deeds required to unlock maximum liquidity against concrete buildings, tiled houses, or vacant plots.',
          profiles: [
            {
              id: 'salaried',
              label: 'Salaried Applicants',
              icon: <User className="w-4 h-4" />,
              title: 'Salaried Borrower LAP Checklist',
              subtitle: 'For salaried executives leveraging self-owned property for high-ticket funding.',
              docs: [
                {
                  name: 'KYC & Residence Proofs',
                  desc: 'PAN Card (mandatory), Aadhaar Card, Passport, or Voter ID for all applicants & co-owners.',
                  tag: 'Mandatory',
                },
                {
                  name: 'Last 6 Months Salary Slips',
                  desc: 'Detailed monthly salary payslips showing gross compensation and deductions.',
                  tag: 'Income Proof',
                },
                {
                  name: 'Last 6 Months Salary Account Statements',
                  desc: 'Bank statement verifying regular salary credits and minimal bounce records.',
                  tag: 'Banking',
                },
                {
                  name: 'Latest 2 Years Form 16 / ITR-V',
                  desc: 'Form 16 Part A & B demonstrating steady taxable compensation.',
                  tag: 'Tax Proof',
                },
                {
                  name: 'Active Loan Repayment Schedules (If Any)',
                  desc: 'Sanction letters and latest statements of accounts for existing personal/auto loans.',
                  tag: 'FOIR Check',
                },
              ],
            },
            {
              id: 'selfEmployed',
              label: 'Business Owners & MSMEs',
              icon: <Building className="w-4 h-4" />,
              title: 'Self-Employed & Corporate LAP Checklist',
              subtitle: 'For business owners, manufacturers, proprietors, and directors utilizing real estate equity.',
              docs: [
                {
                  name: 'Business Entity Registration & KYC',
                  desc: 'GST Certificate, Udyam MSME, Partnership Deed / Certificate of Incorporation & MOA.',
                  tag: 'Mandatory',
                },
                {
                  name: 'Last 3 Years Audited Financial Statements',
                  desc: 'CA-audited Balance Sheets, Profit & Loss accounts with all schedules and audit reports.',
                  tag: 'Financials',
                },
                {
                  name: 'Last 3 Years ITR with Computation Sheets',
                  desc: 'ITR acknowledgments along with computation of business and personal taxable income.',
                  tag: 'Tax Proof',
                },
                {
                  name: 'Last 12 Months Operative Bank Statements',
                  desc: 'Current accounts, CC/OD statements, and primary savings accounts showing healthy cash flow.',
                  tag: 'Banking',
                },
                {
                  name: 'Active Debt Profile & Sanction Letters',
                  desc: 'Existing business loan / working capital sanction letters and track record.',
                  tag: 'Liabilities',
                },
              ],
            },
            {
              id: 'collateral',
              label: 'Mortgaged Property Documents',
              icon: <Landmark className="w-4 h-4" />,
              title: 'Collateral Property Title & Legal Papers',
              subtitle: 'Required for legal search report, title clearance, and bank panel technical valuation.',
              docs: [
                {
                  name: 'Original Registered Title Deed',
                  desc: 'Sale Deed, Partition Deed, Gift Deed, or Settlement Deed establishing clear ownership.',
                  tag: 'Title Primary',
                },
                {
                  name: '30-Year Prior Title Deeds (Mother Deeds)',
                  desc: 'Complete unbroken sequence of preceding title documents for 30 years.',
                  tag: 'Mother Deeds',
                },
                {
                  name: 'Sub-Registrar Encumbrance Certificate (Form 15)',
                  desc: 'Nil encumbrance certificate covering 15 to 30 years confirming property is free of undisclosed liens.',
                  tag: 'Lien Check',
                },
                {
                  name: 'Sanctioned Layout / Building Plan & Civil Estimate',
                  desc: 'Approved building plan or DTCP/BDA approved site layout with sanctioned area details and engineer estimate.',
                  tag: 'Sanction',
                },
                {
                  name: 'Latest Property Tax Paid Receipt',
                  desc: 'Current municipal / panchayat property tax paid receipt with assessment number.',
                  tag: 'Mandatory LAP',
                },
                {
                  name: 'Water Tax Paid Receipt',
                  desc: 'Recent water tax and local civic drainage charges payment challan.',
                  tag: 'Mandatory LAP',
                },
                {
                  name: 'Electricity Bill (EB Bill & White Meter Card)',
                  desc: 'Recent electricity consumption bill / white meter card showing active service in property owner name.',
                  tag: 'Mandatory LAP',
                },
              ],
            },
          ],
        };

      case 'property-backed-funding':
        return {
          sectionBadge: 'Purchase & Takeover Checklist',
          sectionTitle: 'Required Documentation for Property Funding & Bank Takeovers',
          sectionSubtitle:
            'Specific document blueprints for loan balance transfers (private bank to government bank), commercial property purchases, and large-scale funding.',
          profiles: [
            {
              id: 'takeover',
              label: 'Loan Takeover (BT) Papers',
              icon: <RefreshCw className="w-4 h-4" />,
              title: 'Loan Takeover & Balance Transfer Dossier',
              subtitle: 'Required to transfer high-interest loans from private banks/NBFCs to low-interest Government (PSU) banks.',
              docs: [
                {
                  name: 'Foreclosure Letter & Provisional Closure Quote',
                  desc: 'Official letter from current lender stating exact outstanding principal and foreclosure charges.',
                  tag: 'Foreclosure',
                },
                {
                  name: 'List of Documents (LOD)',
                  desc: 'Detailed certificate issued by existing bank confirming all original property title deeds in their custody.',
                  tag: 'LOD Certificate',
                },
                {
                  name: 'Last 12 Months Statement of Account (SOA)',
                  desc: 'Complete loan repayment track record demonstrating prompt EMI debits without default.',
                  tag: 'Repayment Track',
                },
                {
                  name: 'Original Sanction Letter of Existing Facility',
                  desc: 'Initial sanction letter issued by the current private bank / NBFC detailing sanction terms.',
                  tag: 'Sanction Record',
                },
                {
                  name: 'Property Tax & Latest Utility Receipts',
                  desc: 'Current financial year municipal tax receipt and electricity bills substantiating possession.',
                  tag: 'Possession',
                },
              ],
            },
            {
              id: 'business',
              label: 'Borrower Financials & KYC',
              icon: <Building className="w-4 h-4" />,
              title: 'Corporate & Personal Financial Dossier',
              subtitle: 'For businesses and individuals seeking takeover or commercial purchase funding.',
              docs: [
                {
                  name: 'Promoter & Entity KYC',
                  desc: 'PAN & Aadhaar of all promoters, GST Registration, Partnership Deed / Certificate of Incorporation.',
                  tag: 'Mandatory',
                },
                {
                  name: 'Last 3 Years Audited Financial Statements',
                  desc: 'Audited Balance Sheets, Profit & Loss accounts with all schedules and CA audit reports.',
                  tag: 'Financials',
                },
                {
                  name: 'Last 3 Years ITR with Computation Sheets',
                  desc: 'Personal & company ITR acknowledgments along with detailed income computation sheets.',
                  tag: 'Tax Proof',
                },
                {
                  name: 'Last 12 Months All Bank Statements',
                  desc: 'Operative current accounts, cash credit (CC) accounts, and promoter savings statements.',
                  tag: 'Banking',
                },
                {
                  name: 'Last 12 Months GST Returns (GSTR-3B)',
                  desc: 'Filed GST summaries matching annual turnover figures reported in bank statements.',
                  tag: 'Turnover',
                },
              ],
            },
            {
              id: 'commercial',
              label: 'Purchase & Commercial Title',
              icon: <Landmark className="w-4 h-4" />,
              title: 'Commercial / Plot Purchase Title Documents',
              subtitle: 'For funding commercial buildings, industrial properties, and high-value plot transactions.',
              docs: [
                {
                  name: 'Registered Agreement to Sell / Purchase MoU',
                  desc: 'Stamped agreement between buyer and seller with advance payment transaction receipts.',
                  tag: 'Agreement',
                },
                {
                  name: 'Approved Commercial Plan & Layout Sanction',
                  desc: 'Town planning / municipal approved commercial building sanction and zoning conversion order.',
                  tag: 'Sanction',
                },
                {
                  name: '30-Year Encumbrance Certificate (EC Form 15)',
                  desc: 'Sub-registrar encumbrance extract confirming clear and marketable title.',
                  tag: 'Lien Check',
                },
                {
                  name: 'Parent Chain Deeds (Past 30 Years)',
                  desc: 'Complete unbroken chain of previous transfer deeds establishing origin of title.',
                  tag: 'Title Audit',
                },
                {
                  name: 'Tax Assessment & Khata Certificate',
                  desc: 'Latest municipal property tax receipt and commercial Khata extract.',
                  tag: 'Municipal Record',
                },
              ],
            },
          ],
        };

      case 'loan-consultation':
        return {
          sectionBadge: 'Consultation & Advisory Checklist',
          sectionTitle: 'Documentation for Loan Advisory & Advisory Review',
          sectionSubtitle:
            'What you need for your confidential consultation, vehicle loan sanction, FOIR calculation, and debt restructuring roadmap.',
          profiles: [
            {
              id: 'consultation',
              label: 'Advisory Review Papers',
              icon: <User className="w-4 h-4" />,
              title: 'Eligibility & Advisory Consultation Papers',
              subtitle: 'Initial records needed for our advisory specialists to evaluate true borrowing capacity without hard bureau inquiries.',
              docs: [
                {
                  name: 'Applicant & Co-Applicant KYC',
                  desc: 'PAN Card (mandatory) + Aadhaar Card / Passport / Voter ID.',
                  tag: 'Mandatory',
                },
                {
                  name: 'Latest 3 Months Salary Slips or 2 Years ITR',
                  desc: 'Income documents to calculate net disposable monthly income and debt servicing ratios.',
                  tag: 'Income Proof',
                },
                {
                  name: 'Latest 6 Months Bank Statement',
                  desc: 'Primary account statement showing routine cash flow, salary, or business turnover.',
                  tag: 'Banking',
                },
                {
                  name: 'List of Existing Loans & Active EMIs',
                  desc: 'Repayment track records, sanction letters, and current EMI amounts across all banks.',
                  tag: 'Liabilities',
                },
                {
                  name: 'Property Document Photocopies (If Applicable)',
                  desc: 'Copy of title deed or layout plan if evaluating collateral suitability for future borrowing.',
                  tag: 'Collateral',
                },
              ],
            },
            {
              id: 'vehicle',
              label: 'Car Loans (New / Used / Refinance)',
              icon: <Truck className="w-4 h-4" />,
              title: 'Car & Vehicle Loan Documentation (Page 4 Master Plan)',
              subtitle: 'Documentation for New Cars (up to 90% on-road funding), Used Car purchases, and Car Re-Finance.',
              docs: [
                {
                  name: 'New Car: Showroom Quotation & On-Road Price Breakdown',
                  desc: 'Proforma invoice from authorized dealer specifying On-Road Price, showroom name, and local area (Eligible up to 90% funding).',
                  tag: 'New Car (90%)',
                },
                {
                  name: 'Used Car: RC Book (Registration Certificate)',
                  desc: 'Original RC copy verifying vehicle model year, engine & chassis numbers, and number of preceding owners.',
                  tag: 'Used Car',
                },
                {
                  name: 'Used Car & Refinance: Comprehensive Insurance Copy',
                  desc: 'Currently active comprehensive vehicle insurance policy with valid coverage period.',
                  tag: 'Used / Refinance',
                },
                {
                  name: 'Car Re-Finance: Existing Financer Foreclosure / SOA',
                  desc: 'Current financier statement of account or clear RC copy for unlocking equity through refinancing.',
                  tag: 'Re-Finance',
                },
                {
                  name: 'Applicant KYC (PAN & Aadhaar) + 6 Months Banking',
                  desc: 'Identity verification for applicant & co-applicant along with 6 months operative bank statements.',
                  tag: 'Mandatory',
                },
              ],
            },
            {
              id: 'restructuring',
              label: 'Debt Restructuring & Takeover',
              icon: <RefreshCw className="w-4 h-4" />,
              title: 'Debt Consolidation & Restructuring Papers',
              subtitle: 'Required to replace high-cost unsecured personal loans and credit cards with low-rate secured debt.',
              docs: [
                {
                  name: 'Full Inventory of Existing Credit Facilities',
                  desc: 'Latest credit card statements, personal loan sanction letters, and gold loan slips.',
                  tag: 'Debt Audit',
                },
                {
                  name: '12 Months Repayment Track Records (SOA)',
                  desc: 'Detailed loan account statements confirming on-time EMI repayments without default.',
                  tag: 'Repayment Track',
                },
                {
                  name: 'Latest CIBIL / Credit Bureau Report',
                  desc: 'Self-pulled bureau report (if available) to analyze score factors and clean negative flags.',
                  tag: 'Credit Score',
                },
                {
                  name: 'Secured Asset Documents (House / Plot / Building)',
                  desc: 'Photocopies of property title deeds to structure collateralized debt consolidation.',
                  tag: 'Collateral Backing',
                },
                {
                  name: 'Fresh Income & Banking Statements',
                  desc: 'Latest 6 months bank statements verifying adequate debt servicing capability.',
                  tag: 'Repayment Capacity',
                },
              ],
            },
          ],
        };

      case 'vehicle-loans':
        return {
          sectionBadge: 'Car Loan Checklist',
          sectionTitle: 'New Car, Used Car & Refinance Documentation',
          sectionSubtitle:
            'Comprehensive checklist for new vehicle funding up to 90%, pre-owned car purchases, and used car refinance equity liquidity across top partner banks.',
          profiles: [
            {
              id: 'new-car',
              label: 'New Car Loan (Up to 90%)',
              icon: <Truck className="w-4 h-4" />,
              title: 'New Car Loan – Financing Up to 90%',
              subtitle: 'Up to 90% funding on on-road quotation with swift processing and minimum dealer turnaround.',
              docs: [
                {
                  name: 'On-Road Price Breakdown & Proforma Invoice',
                  desc: 'Official showroom proforma quotation showing ex-showroom, road tax, registration, and comprehensive insurance.',
                  tag: 'Quotation',
                },
                {
                  name: 'Authorized Showroom & Dealer Details',
                  desc: 'Official dealership name, GST credentials, bank disbursement details, and vehicle allocation slip.',
                  tag: 'Dealer Details',
                },
                {
                  name: 'Showroom Area & Delivery Location',
                  desc: 'Exact dealership address, RTO jurisdiction zone, and delivery location confirmation.',
                  tag: 'Location',
                },
                {
                  name: 'Applicant & Co-Applicant KYC Credentials',
                  desc: 'Mandatory PAN Card, Aadhaar Card, Passport photo, and applicant/co-applicant details.',
                  tag: 'KYC',
                },
                {
                  name: 'Banking Statements (Last 6 Months)',
                  desc: 'Operative bank statements reflecting monthly cashflow and income consistency.',
                  tag: 'Banking',
                },
              ],
            },
            {
              id: 'used-car',
              label: 'Used Car Loan',
              icon: <FileSpreadsheet className="w-4 h-4" />,
              title: 'Used Car Loan – Pre-Owned Vehicle Purchase',
              subtitle: 'Rigorous valuation, ownership vetting, and fast financing for pre-owned automobiles.',
              docs: [
                {
                  name: 'RC (Registration Certificate) Book Copy',
                  desc: 'Clear copy of valid Registration Certificate (Smart Card / Paper RC) verifying ownership history.',
                  tag: 'Mandatory RC',
                },
                {
                  name: 'Comprehensive Vehicle Insurance Details',
                  desc: 'Active motor insurance policy copy with third-party liability and own-damage coverage verification.',
                  tag: 'Active Insurance',
                },
                {
                  name: 'Vehicle Model & Manufacturing Year Details',
                  desc: 'Make, model variant, fuel type, engine/chassis number verification, and manufacture vintage.',
                  tag: 'Specs & Vintage',
                },
                {
                  name: 'Number of Previous Owners Verification',
                  desc: 'Confirmed record of individual/commercial transfer history on vehicle registry records.',
                  tag: 'Ownership Track',
                },
                {
                  name: 'Agreed Purchase Value & Valuation Assessment',
                  desc: 'Agreed sale consideration agreement and certified bank-empanelled inspection valuation.',
                  tag: 'Valuation & Price',
                },
              ],
            },
            {
              id: 'car-refinance',
              label: 'Used Car Refinance',
              icon: <RefreshCw className="w-4 h-4" />,
              title: 'Used Car Refinance – Unlock Instant Capital',
              subtitle: 'Unlock cash equity against your debt-free or ongoing vehicle ownership at attractive rates.',
              docs: [
                {
                  name: 'RC (Registration Certificate) with Hypothecation Status',
                  desc: 'Current Registration Certificate; NOC from existing financier if previous loan was cleared.',
                  tag: 'RC Book / NOC',
                },
                {
                  name: 'Comprehensive Vehicle Insurance Details',
                  desc: 'Valid comprehensive insurance certificate ensuring full insurable asset value.',
                  tag: 'Insurance',
                },
                {
                  name: 'Vehicle Model & Variant Verification',
                  desc: 'Detailed specification, year of manufacturing, odometer reading, and physical fitness check.',
                  tag: 'Asset Profile',
                },
                {
                  name: 'Number of Previous Owners Details',
                  desc: 'Clean ownership title documentation confirming permissible transfer count.',
                  tag: 'Ownership Count',
                },
                {
                  name: 'Repayment Banking Statements (Last 6–12 Months)',
                  desc: 'Salary or business operative bank statements demonstrating reliable debt servicing.',
                  tag: 'Repayment Capability',
                },
              ],
            },
          ],
        };

      default:
        return {
          sectionBadge: 'Document Checklist',
          sectionTitle: 'Pre-Application Documentation Checklist',
          sectionSubtitle:
            'Review the exact documents required for your profile to ensure prompt credit and legal clearance across government and private banks.',
          profiles: [
            {
              id: 'salaried',
              label: 'Salaried Profile',
              icon: <User className="w-4 h-4" />,
              title: 'Salaried Professionals Documentation',
              subtitle: 'For employees of corporate MNCs, public limited firms, government, and private enterprises.',
              docs: [
                {
                  name: 'KYC & Identification Proofs',
                  desc: 'PAN Card (mandatory) + Aadhaar Card / Valid Passport / Voter ID.',
                  tag: 'Mandatory',
                },
                {
                  name: 'Last 3 to 6 Months Salary Slips',
                  desc: 'Official company payslips with breakdown of Basic, HRA, PF, and professional tax deductions.',
                  tag: 'Income Proof',
                },
                {
                  name: 'Latest 6 Months Salary Account Statements',
                  desc: 'Original bank statements or e-statements with digital bank stamp verifying salary credits.',
                  tag: 'Banking',
                },
                {
                  name: 'Latest 2 Years Form 16 / ITR V',
                  desc: 'Form 16 Part A & B issued by employer verifying TDS deduction and gross annual income.',
                  tag: 'Tax Proof',
                },
                {
                  name: 'Current Employment Proof',
                  desc: 'Official company ID card + Appointment letter / increment letter indicating tenure.',
                  tag: 'Stability',
                },
              ],
            },
            {
              id: 'selfEmployed',
              label: 'Self-Employed / MSME',
              icon: <Building className="w-4 h-4" />,
              title: 'Self-Employed & MSME Business Owners',
              subtitle: 'For proprietors, partners, directors, doctors, CAs, and business enterprises.',
              docs: [
                {
                  name: 'Business Entity KYC & Registration',
                  desc: 'GST Certificate, Certificate of Incorporation / Partnership Deed, Udyam MSME certificate.',
                  tag: 'Mandatory',
                },
                {
                  name: 'Last 3 Years Audited Financial Statements',
                  desc: 'Balance Sheets, Profit & Loss accounts audited by CA with all schedules and audit reports.',
                  tag: 'Financials',
                },
                {
                  name: 'Last 3 Years ITR with Computation of Income',
                  desc: 'Complete personal & company ITR acknowledgments along with CA computation sheets.',
                  tag: 'Tax Proof',
                },
                {
                  name: 'Last 12 Months Current & Savings Bank Statements',
                  desc: 'All operative business current accounts and promoters savings accounts showing turnover.',
                  tag: 'Banking',
                },
                {
                  name: 'Last 12 Months GST Returns (GSTR-3B & GSTR-1)',
                  desc: 'Filed GST return summaries to substantiate banking sales turnover matching P&L entries.',
                  tag: 'Turnover',
                },
              ],
            },
            {
              id: 'property',
              label: 'Property & Title Deeds',
              icon: <Landmark className="w-4 h-4" />,
              title: 'Property Legal & Title Collateral Documents',
              subtitle: 'Applicable for both Home Loans (purchase) and Loans Against Property (LAP).',
              docs: [
                {
                  name: 'Registered Title Deed (Sale Deed / Gift Deed / Conveyance)',
                  desc: 'Original registered deed establishing clear legal ownership of the current seller or mortgagor.',
                  tag: 'Title Primary',
                },
                {
                  name: 'Prior Chain of Title Deeds (Parent Documents)',
                  desc: 'Complete unbroken link of predecessor transfer deeds for past 13 to 30 years.',
                  tag: 'Chain Audit',
                },
                {
                  name: 'Encumbrance Certificate (Form 15 & 16)',
                  desc: 'Official sub-registrar certificate reflecting all registered transactions/liens for 15–30 years.',
                  tag: 'Lien Check',
                },
                {
                  name: 'Approved Sanctioned Building Plan & Layout',
                  desc: 'Plan approved by municipal corporation / BDA / BBMP / DTCP with sanctioned construction area.',
                  tag: 'Sanction',
                },
                {
                  name: 'Latest Property Tax Receipts & Khata Certificate',
                  desc: 'Current financial year tax paid receipt + Khata Certificate / Extract (A-Khata or municipal equivalent).',
                  tag: 'Municipal Record',
                },
              ],
            },
          ],
        };
    }
  };

  const config = getProfilesForLoanType();
  const [selectedId, setSelectedId] = useState<string>(config.profiles[0].id);

  // If loanType changes, fallback to first profile
  const current = config.profiles.find((p) => p.id === selectedId) || config.profiles[0];

  const handleCopyChecklist = () => {
    const textToCopy =
      `${config.sectionTitle} - ${current.title}\n\n` +
      current.docs
        .map((d, i) => `${i + 1}. ${d.name} [${d.tag}]\n   ${d.desc}`)
        .join('\n\n') +
      `\n\nAdvisory assistance provided by Prime Associates — Loans & Constructions. Contact: +91 96555 66613`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const contentBody = (
    <div className={embedded ? 'w-full' : 'w-[92%] sm:w-[88%] lg:w-[85%] max-w-7xl mx-auto'}>
      {/* Header */}
      <div className={`text-center max-w-3xl mx-auto ${embedded ? 'mb-6 space-y-2' : 'mb-10 sm:mb-12 space-y-3'}`}>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-teal-light text-brand-teal text-xs font-bold tracking-wider uppercase">
          <FileCheck className="w-3.5 h-3.5" />
          <span>{config.sectionBadge}</span>
        </div>
        <h2 className={embedded ? 'text-xl sm:text-2xl font-extrabold text-brand-navy tracking-tight font-heading' : 'text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-navy tracking-tight font-heading'}>
          {config.sectionTitle}
        </h2>
        <p className="text-xs sm:text-sm text-brand-slate leading-relaxed">
          {config.sectionSubtitle}
        </p>
      </div>

      {/* Profile Switcher Tabs */}
      <div className={`flex flex-wrap items-center justify-center gap-2 ${embedded ? 'mb-6' : 'mb-10 gap-2.5'}`}>
        {config.profiles.map((p) => {
          const isSelected = p.id === current.id;
          return (
            <button
              key={p.id}
              onClick={() => setSelectedId(p.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all duration-200 ${
                isSelected
                  ? 'bg-brand-navy text-white border-brand-navy shadow-sm'
                  : 'bg-brand-ivory text-brand-navy border-brand-border hover:border-brand-teal hover:bg-white'
              }`}
            >
              {p.icon}
              <span>{p.label}</span>
            </button>
          );
        })}
      </div>

      {/* Checklist Container */}
      <div className={`bg-brand-ivory/60 rounded-3xl border border-brand-border ${embedded ? 'p-5 sm:p-7' : 'p-6 sm:p-10'} shadow-sm max-w-4xl mx-auto`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-5 border-b border-brand-border gap-4">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-brand-navy tracking-tight font-heading">
              {current.title}
            </h3>
            <p className="text-xs text-brand-slate mt-0.5 leading-relaxed">
              {current.subtitle}
            </p>
          </div>

          <button
            onClick={handleCopyChecklist}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-gray-50 border border-brand-border text-brand-navy text-xs font-bold rounded-corporate shadow-2xs transition-colors self-start sm:self-auto shrink-0"
            title="Copy checklist to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Checklist Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-brand-slate" />
                <span>Copy Checklist</span>
              </>
            )}
          </button>
        </div>

        <div className="space-y-3">
          {current.docs.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-3.5 sm:p-4 rounded-2xl border border-brand-border hover:border-brand-teal/40 transition-all shadow-subtle flex items-start gap-3"
            >
              <div className="w-5 h-5 rounded-full bg-brand-teal-light text-brand-teal flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div className="flex-grow">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-xs sm:text-sm font-bold text-brand-navy">
                    {item.name}
                  </h4>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-brand-ivory text-brand-teal border border-brand-teal/20">
                    {item.tag}
                  </span>
                </div>
                <p className="text-xs text-brand-slate mt-1 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Advisory Assistance Box */}
        <div className="mt-6 pt-5 border-t border-brand-border flex flex-col sm:flex-row items-center justify-between gap-4 bg-brand-teal-light/40 p-4 rounded-2xl border border-brand-teal/20">
          <div className="flex items-center gap-2.5">
            <Info className="w-4 h-4 text-brand-teal shrink-0" />
            <p className="text-xs text-brand-navy font-medium leading-relaxed">
              Missing a specific parent title deed or having non-standard income records? Our advisory team conducts surrogate banking programs and pre-submission title verification.
            </p>
          </div>
          {!embedded && (
            <a
              href="#enquiry-form"
              className="px-5 py-2.5 bg-brand-teal hover:bg-brand-teal-hover text-white text-xs font-bold rounded-corporate shadow-sm whitespace-nowrap transition-colors shrink-0"
            >
              Get Pre-Verification
            </a>
          )}
        </div>
      </div>
    </div>
  );

  if (embedded) {
    return <div className="w-full mt-6">{contentBody}</div>;
  }

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-brand-border">
      {contentBody}
    </section>
  );
};
