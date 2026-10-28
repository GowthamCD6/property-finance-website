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
  loanType?: 'home-loans' | 'loan-against-property' | 'property-backed-funding' | 'loan-consultation' | 'all';
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
          sectionBadge: 'Home Loan Checklist',
          sectionTitle: 'Required Documentation for Home Loans & Construction',
          sectionSubtitle:
            'Prepare the exact documents required for salaried or self-employed home loans, land purchase, and self-construction sanction at benchmark low interest rates with government subsidy.',
          profiles: [
            {
              id: 'salaried',
              label: 'Salaried Applicants',
              icon: <User className="w-4 h-4" />,
              title: 'Salaried Home Loan Documentation',
              subtitle: 'For employees of corporate MNCs, public limited firms, government, and private enterprises.',
              docs: [
                {
                  name: 'KYC & Identification Proofs',
                  desc: 'PAN Card (mandatory) + Aadhaar Card / Valid Passport / Voter ID.',
                  tag: 'Mandatory',
                },
                {
                  name: 'Last 3 to 6 Months Salary Slips',
                  desc: 'Official company payslips with breakdown of Basic, HRA, PF, and statutory deductions.',
                  tag: 'Income Proof',
                },
                {
                  name: 'Latest 6 Months Salary Account Statements',
                  desc: 'Bank statements with bank digital stamp / seal verifying salary credit credits.',
                  tag: 'Banking',
                },
                {
                  name: 'Latest 2 Years Form 16 (Part A & B) / ITR-V',
                  desc: 'Form 16 issued by employer verifying TDS deduction and gross annual income.',
                  tag: 'Tax Proof',
                },
                {
                  name: 'Employment Proof & Stability',
                  desc: 'Official company ID card + Appointment letter / recent increment letter indicating tenure.',
                  tag: 'Stability',
                },
              ],
            },
            {
              id: 'selfEmployed',
              label: 'Self-Employed / Business',
              icon: <Building className="w-4 h-4" />,
              title: 'Self-Employed & Business Home Loan Documentation',
              subtitle: 'For proprietors, partners, directors, doctors, CAs, traders, and business enterprises.',
              docs: [
                {
                  name: 'Business Entity Registration & KYC',
                  desc: 'GST Certificate, Udyam MSME, Partnership Deed / Certificate of Incorporation.',
                  tag: 'Mandatory',
                },
                {
                  name: 'Last 3 Years CA-Audited Financial Statements',
                  desc: 'Audited Balance Sheets and Profit & Loss accounts with all schedules and CA audit reports.',
                  tag: 'Financials',
                },
                {
                  name: 'Last 3 Years ITR with Computation of Income',
                  desc: 'Complete personal & firm/company ITR acknowledgments along with CA computation sheets.',
                  tag: 'Tax Proof',
                },
                {
                  name: 'Last 12 Months Operative Bank Statements',
                  desc: 'All business current accounts and promoters primary savings accounts showing healthy banking turnover.',
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
              label: 'Property & Construction Title',
              icon: <Landmark className="w-4 h-4" />,
              title: 'Home & Construction Title Deeds',
              subtitle: 'Essential property legal documents required for legal opinion and technical valuation.',
              docs: [
                {
                  name: 'Registered Title Deed / Sale Agreement',
                  desc: 'Registered Sale Deed / Agreement to Sell / Construction Agreement establishing legal title.',
                  tag: 'Title Primary',
                },
                {
                  name: 'Prior Chain of Title Deeds (Mother Deeds)',
                  desc: 'Complete unbroken link of predecessor transfer deeds for the past 13 to 30 years.',
                  tag: 'Chain Audit',
                },
                {
                  name: 'Approved Sanctioned Building Plan & Civil Estimate',
                  desc: 'Building plan approved by municipal authority / DTCP plus detailed construction cost estimate from a certified civil engineer.',
                  tag: 'Construction',
                },
                {
                  name: 'Encumbrance Certificate (EC Form 15 for 30 Years)',
                  desc: 'Official sub-registrar certificate reflecting all registered transactions/liens up to current date.',
                  tag: 'Lien Check',
                },
                {
                  name: 'Latest Property Tax Receipts & Khata / Patta Extract',
                  desc: 'Current financial year tax paid receipt + Khata Certificate / Extract (A-Khata, Patta, or municipal equivalent).',
                  tag: 'Municipal Record',
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
                  name: 'Sanctioned Layout / Building Plan & Completion Certificate',
                  desc: 'Approved building plan or DTCP/BDA approved site layout with sanctioned area details.',
                  tag: 'Sanction',
                },
                {
                  name: 'Current Property Tax Paid Challan & Khata / Patta',
                  desc: 'Latest tax paid receipt and official municipality Khata certificate / Patta extract.',
                  tag: 'Municipal Record',
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
              label: 'Vehicle Loans Checklist',
              icon: <Truck className="w-4 h-4" />,
              title: 'Commercial & Passenger Vehicle Loan Documents',
              subtitle: 'Documentation for cars, commercial transport vehicles, and fleet financing.',
              docs: [
                {
                  name: 'Authorized Dealer Proforma Invoice / Quotation',
                  desc: 'Official quotation from authorized automobile dealer showing ex-showroom, RTO, and insurance breakdown.',
                  tag: 'Vehicle Quotation',
                },
                {
                  name: 'Applicant KYC & Residence Proof',
                  desc: 'PAN Card, Aadhaar Card, Driving License, and utility bill confirming stable residence.',
                  tag: 'Mandatory',
                },
                {
                  name: 'Income Proof (Salaried / Business)',
                  desc: 'Last 3 months payslips + Form 16 OR 2 years ITR with computation sheets.',
                  tag: 'Income Proof',
                },
                {
                  name: 'Last 6 Months Bank Statement',
                  desc: 'Salary account or business current account statements showing down payment funds.',
                  tag: 'Banking',
                },
                {
                  name: 'Margin Money / Advance Booking Receipt',
                  desc: 'Official payment receipt from vehicle dealership confirming margin money deposit.',
                  tag: 'Advance Payment',
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
