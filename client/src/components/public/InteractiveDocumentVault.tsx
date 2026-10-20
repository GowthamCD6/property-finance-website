import React, { useState } from 'react';
import { FileCheck, CheckCircle2, User, Building, Landmark, Copy, Check, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

export const InteractiveDocumentVault: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'salaried' | 'selfEmployed' | 'property'>('salaried');
  const [copied, setCopied] = useState(false);

  const documentProfiles = {
    salaried: {
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
    selfEmployed: {
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
    property: {
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
  };

  const current = documentProfiles[selectedCategory];

  const handleCopyChecklist = () => {
    const textToCopy = `${current.title}\n\n` +
      current.docs.map((d, i) => `${i + 1}. ${d.name} (${d.tag})\n   ${d.desc}`).join('\n\n') +
      `\n\nAdvisory assistance provided by WealthAnchor Property Finance Advisory.`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-brand-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-brand-teal-light text-brand-teal text-xs font-bold tracking-wider uppercase mb-3">
            <FileCheck className="w-3.5 h-3.5" />
            <span>Pre-Application Transparency</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-navy tracking-tight">
            Comprehensive Document Audit Checklist
          </h2>
          <p className="mt-3 text-sm sm:text-base text-brand-slate leading-relaxed">
            Incomplete documentation is the primary reason for bank loan rejection. Select your profile below to review the precise document dossier required for seamless legal and credit clearance.
          </p>
        </div>

        {/* Profile Switcher Tabs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mb-10">
          <button
            onClick={() => setSelectedCategory('salaried')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all w-full sm:w-auto justify-center ${
              selectedCategory === 'salaried'
                ? 'bg-brand-navy text-white border-brand-navy shadow-sm'
                : 'bg-brand-ivory text-brand-navy border-brand-border hover:border-brand-teal'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Salaried Profile</span>
          </button>

          <button
            onClick={() => setSelectedCategory('selfEmployed')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all w-full sm:w-auto justify-center ${
              selectedCategory === 'selfEmployed'
                ? 'bg-brand-navy text-white border-brand-navy shadow-sm'
                : 'bg-brand-ivory text-brand-navy border-brand-border hover:border-brand-teal'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Self-Employed / MSME</span>
          </button>

          <button
            onClick={() => setSelectedCategory('property')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all w-full sm:w-auto justify-center ${
              selectedCategory === 'property'
                ? 'bg-brand-navy text-white border-brand-navy shadow-sm'
                : 'bg-brand-ivory text-brand-navy border-brand-border hover:border-brand-teal'
            }`}
          >
            <Landmark className="w-4 h-4" />
            <span>Property &amp; Title Deeds</span>
          </button>
        </div>

        {/* Checklist Container */}
        <div className="bg-brand-ivory/60 rounded-2xl border border-brand-border p-6 sm:p-10 shadow-sm max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-brand-border gap-4">
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-brand-navy tracking-tight">
                {current.title}
              </h3>
              <p className="text-xs sm:text-sm text-brand-slate mt-1">
                {current.subtitle}
              </p>
            </div>

            <button
              onClick={handleCopyChecklist}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-gray-50 border border-brand-border text-brand-navy text-xs font-semibold rounded-corporate shadow-2xs transition-colors self-start sm:self-auto shrink-0"
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

          <div className="space-y-4">
            {current.docs.map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-4 sm:p-5 rounded-xl border border-brand-border hover:border-brand-teal/40 card-hover flex items-start gap-3.5"
              >
                <div className="w-6 h-6 rounded-full bg-brand-teal-light text-brand-teal flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="flex-grow">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="text-sm sm:text-base font-bold text-brand-navy">
                      {item.name}
                    </h4>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-brand-ivory text-brand-teal border border-brand-teal/20">
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-brand-slate mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Advisory Box */}
          <div className="mt-8 pt-6 border-t border-brand-border flex flex-col sm:flex-row items-center justify-between gap-4 bg-brand-teal-light/40 p-5 rounded-xl border border-brand-teal/20">
            <div className="flex items-center gap-3">
              <Info className="w-5 h-5 text-brand-teal shrink-0" />
              <p className="text-xs text-brand-navy font-medium leading-relaxed">
                Missing a specific parent deed or have non-standard income records? Our specialists evaluate surrogate banking programs and title search reports before submission.
              </p>
            </div>
            <Link
              to="/enquire"
              className="px-4 py-2.5 bg-brand-teal hover:bg-brand-teal-hover text-white text-xs font-semibold rounded-corporate shadow-sm whitespace-nowrap transition-colors shrink-0"
            >
              Request Document Pre-Check
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
