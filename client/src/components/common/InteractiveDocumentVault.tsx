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
  Printer,
  Share2,
  CheckSquare,
  Square,
  Sparkles,
  PhoneCall,
  Download,
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Official WhatsApp Vector Icon
const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

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
              label: 'A. KYC Documents (Optional)',
              icon: <User className="w-4 h-4" />,
              title: 'KYC Documents (Applicant & Co-Applicant)',
              subtitle: 'Optional during consultation enquiry intake. Identity proof can be provided later during sanction.',
              docs: [
                {
                  name: 'PAN Card (Applicant & Co-Applicant)',
                  desc: 'Permanent Account Number card for tax validation and credit evaluation.',
                  tag: 'Optional',
                },
                {
                  name: 'Aadhaar Card (Applicant & Co-Applicant)',
                  desc: 'Government Aadhaar identity proof with linked active mobile number for biometric e-KYC.',
                  tag: 'Optional',
                },
                {
                  name: 'Passport-Size Photographs',
                  desc: 'Recent passport-size colored photographs of both applicant and co-applicant.',
                  tag: 'Optional',
                },
                {
                  name: 'Applicant and Co-Applicant Details',
                  desc: 'Complete residential address proof, relationship declaration, contact details, and family profile particulars.',
                  tag: 'Optional',
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
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});

  // If loanType changes, fallback to first profile
  const current = config.profiles.find((p) => p.id === selectedId) || config.profiles[0];

  const totalDocsCount = current.docs.length;
  const readyDocsCount = current.docs.filter((d) => checkedDocs[d.name]).length;
  const progressPercent = Math.round((readyDocsCount / totalDocsCount) * 100);

  const toggleDocChecked = (name: string) => {
    setCheckedDocs((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handleSelectAll = () => {
    const allChecked = current.docs.every((d) => checkedDocs[d.name]);
    const updated: Record<string, boolean> = { ...checkedDocs };
    current.docs.forEach((d) => {
      updated[d.name] = !allChecked;
    });
    setCheckedDocs(updated);
  };

  const handleCopyChecklist = () => {
    const textToCopy =
      `📋 ${config.sectionTitle} - ${current.title}\n\n` +
      current.docs
        .map((d, i) => `${checkedDocs[d.name] ? '✅' : '⬜'} ${i + 1}. ${d.name} [${d.tag}]\n   ${d.desc}`)
        .join('\n\n') +
      `\n\n📌 Prepared for Prime Associates — Loans & Constructions Consultation.\n📞 Helpline: +91 96555 66613 | 🌐 www.primeassociates.in`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppChecklist = () => {
    const readyList = current.docs
      .map((d, i) => `${checkedDocs[d.name] ? '✅' : '⬜'} ${i + 1}. *${d.name}* (${d.tag})`)
      .join('\n');
    const message = encodeURIComponent(
      `*📋 ${config.sectionTitle}*\n_Category: ${current.title}_\n_Status: ${readyDocsCount} of ${totalDocsCount} documents ready (${progressPercent}%)_\n\n*Required Documents:*\n${readyList}\n\n*Consultation Desk:* Prime Associates Loans & Constructions\n📞 Contact: +91 96555 66613\n📍 Tirupur, Tamil Nadu`
    );
    window.open(`https://wa.me/919655566613?text=${message}`, '_blank');
  };

  const handlePrintChecklist = () => {
    window.print();
  };

  const getTagBadgeClass = (tag: string) => {
    const t = tag.toLowerCase();
    if (t.includes('mandatory')) return 'bg-rose-50 text-rose-700 border-rose-200/80 font-bold';
    if (t.includes('primary') || t.includes('legal') || t.includes('deed')) return 'bg-emerald-50 text-emerald-800 border-emerald-200/80 font-bold';
    if (t.includes('income') || t.includes('salaried') || t.includes('turnover') || t.includes('self-employed')) return 'bg-amber-50 text-amber-800 border-amber-200/80 font-bold';
    if (t.includes('civil') || t.includes('estimate') || t.includes('plan')) return 'bg-indigo-50 text-indigo-800 border-indigo-200/80 font-bold';
    return 'bg-slate-100 text-slate-700 border-slate-200 font-medium';
  };

  const contentBody = (
    <div className={embedded ? 'w-full' : 'w-[92%] sm:w-[88%] lg:w-[85%] max-w-7xl mx-auto'}>
      {/* Header */}
      <div className={`text-center max-w-3xl mx-auto ${embedded ? 'mb-6 space-y-2' : 'mb-10 sm:mb-12 space-y-3'}`}>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200/60 text-xs font-bold tracking-wider uppercase font-heading shadow-2xs">
          <FileCheck className="w-4 h-4 text-teal-600" />
          <span>{config.sectionBadge}</span>
        </div>
        <h2 className={embedded ? 'text-xl sm:text-2xl font-extrabold text-[#0c1a26] tracking-tight font-heading' : 'text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0c1a26] tracking-tight font-heading'}>
          {config.sectionTitle}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
          {config.sectionSubtitle}
        </p>
      </div>

      {/* Profile Switcher Tabs */}
      <div className={`flex flex-wrap items-center justify-center gap-2 ${embedded ? 'mb-6' : 'mb-8 gap-2.5'}`}>
        {config.profiles.map((p) => {
          const isSelected = p.id === current.id;
          return (
            <button
              key={p.id}
              onClick={() => setSelectedId(p.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-heading font-bold transition-all duration-200 cursor-pointer shadow-2xs ${
                isSelected
                  ? 'bg-[#0c1a26] text-white border-[#0c1a26] shadow-md ring-2 ring-teal-500/30'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              {p.icon}
              <span>{p.label}</span>
            </button>
          );
        })}
      </div>

      {/* Checklist Container */}
      <div className={`bg-white rounded-3xl border border-slate-200/90 ${embedded ? 'p-5 sm:p-7' : 'p-6 sm:p-9'} shadow-md max-w-4xl mx-auto`}>
        {/* Top Header & Actions Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-5 border-b border-slate-100 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse"></span>
              <h3 className="text-base sm:text-lg font-extrabold text-[#0c1a26] tracking-tight font-heading">
                {current.title}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed font-sans">
              {current.subtitle}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto shrink-0">
            <button
              type="button"
              onClick={handleSelectAll}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all cursor-pointer"
              title="Toggle all checkboxes"
            >
              {current.docs.every((d) => checkedDocs[d.name]) ? (
                <>
                  <Square className="w-3.5 h-3.5 text-slate-500" />
                  <span>Clear All</span>
                </>
              ) : (
                <>
                  <CheckSquare className="w-3.5 h-3.5 text-teal-600" />
                  <span>Check All</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleCopyChecklist}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
              title="Copy checklist to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copy</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleWhatsAppChecklist}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-2xs"
              title="Send checklist to WhatsApp"
            >
              <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp List</span>
            </button>

            <button
              type="button"
              onClick={handlePrintChecklist}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer hidden md:inline-flex"
              title="Print official checklist"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* Readiness Progress Strip */}
        <div className="mb-5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
          <div className="flex items-center justify-between text-xs mb-1.5 font-sans">
            <span className="font-bold text-[#0c1a26]">
              Your Dossier Readiness:
            </span>
            <span className="font-mono font-bold text-teal-700">
              {readyDocsCount} of {totalDocsCount} Collected ({progressPercent}%)
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-teal-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.max(progressPercent, 4)}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-1.5 font-sans">
            Click on any document card below to check off papers you already have ready for consultation.
          </p>
        </div>

        {/* Interactive Documents List */}
        <div className="space-y-2.5">
          {current.docs.map((item, idx) => {
            const isChecked = !!checkedDocs[item.name];
            return (
              <div
                key={idx}
                onClick={() => toggleDocChecked(item.name)}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all duration-150 cursor-pointer flex items-start gap-3.5 ${
                  isChecked
                    ? 'bg-emerald-50/50 border-emerald-300 ring-1 ring-emerald-300/40 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-teal-400/60 hover:bg-slate-50/50 shadow-2xs'
                }`}
              >
                {/* Checkbox Trigger */}
                <div className="mt-0.5 shrink-0">
                  {isChecked ? (
                    <div className="w-5 h-5 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-lg border-2 border-slate-300 hover:border-teal-500 bg-white transition-colors" />
                  )}
                </div>

                <div className="flex-grow">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4
                      className={`text-xs sm:text-sm font-bold font-heading transition-colors ${
                        isChecked ? 'text-emerald-950 line-through opacity-85' : 'text-[#0c1a26]'
                      }`}
                    >
                      {item.name}
                    </h4>
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${getTagBadgeClass(
                        item.tag
                      )}`}
                    >
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed font-sans">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Advisory Assistance Box */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-teal-50/60 p-4 sm:p-5 rounded-2xl border border-teal-200/80">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h5 className="text-xs sm:text-sm font-bold text-[#0c1a26] font-heading">
                Missing Mother Deeds, Chitta, or Patta Records?
              </h5>
              <p className="text-xs text-slate-600 font-sans mt-0.5 leading-relaxed">
                Don't worry if you cannot find older parent deeds or revenue mutation extracts. Prime Associates conducts direct Sub-Registrar 30-year EC searches, patta transfers, and bank legal vetting on your behalf.
              </p>
            </div>
          </div>
          {!embedded && (
            <a
              href="#enquiry-form"
              className="px-5 py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white text-xs font-bold font-heading rounded-xl shadow-sm whitespace-nowrap transition-all shrink-0 cursor-pointer"
            >
              Get Free Legal Vetting
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
    <section id="documents-checklist" className="pt-12 sm:pt-16 pb-0 bg-[#f7f7f3]">
      {contentBody}
    </section>
  );
};
