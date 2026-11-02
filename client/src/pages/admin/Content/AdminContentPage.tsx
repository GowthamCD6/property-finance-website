import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  FileText,
  Save,
  CheckCircle,
  AlertCircle,
  Loader2,
  Building,
  Image,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Clock,
  BarChart3,
  Landmark,
  Star,
  Users,
  Compass,
  Calculator,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  X,
  Eye,
  Megaphone,
  Check,
  ChevronRight,
  TrendingUp,
  Award,
  Layers,
  Home,
  ArrowLeft,
  Search,
  Grid,
  ChevronLeft,
  Sparkles,
  CheckCheck,
  Globe,
  SlidersHorizontal,
  FileCheck,
  User,
  RotateCcw,
} from 'lucide-react';
import {
  SiteContent,
  RateMatrixItem,
  WhyChooseUsPillar,
  ProcessStep,
  Testimonial,
  AboutMilestone,
  AboutTeamMember,
  AboutPillar,
  BranchOffice,
  SocialLinks,
} from '../../../types';
import { getPublicSiteContent, updateSiteContentApi } from '../../../services/api';

type TabType =
  | 'identity'
  | 'hero'
  | 'stats'
  | 'rates'
  | 'process'
  | 'about'
  | 'testimonials'
  | 'branches'
  | 'loan-docs'
  | 'calculator'
  | 'legal'
  | 'footer';

export const AdminContentPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSection = (searchParams.get('section') as TabType) || null;
  const [activeTab, setActiveTab] = useState<TabType | null>(initialSection);
  const [catalogFilter, setCatalogFilter] = useState<string>('ALL');
  const [catalogSearch, setCatalogSearch] = useState<string>('');

  const [content, setContent] = useState<Partial<SiteContent>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Sub-tab for Loan Services Document Checklists
  const [loanDocTab, setLoanDocTab] = useState<'salaried' | 'selfEmployed' | 'property'>('salaried');

  // Parsed structured states
  const [rotatingWordsList, setRotatingWordsList] = useState<string[]>([]);
  const [newRotatingWord, setNewRotatingWord] = useState<string>('');

  const [heroBadgesList, setHeroBadgesList] = useState<string[]>([]);
  const [newHeroBadge, setNewHeroBadge] = useState<string>('');

  const [rateMatrixItems, setRateMatrixItems] = useState<RateMatrixItem[]>([]);
  const [rateModalOpen, setRateModalOpen] = useState<boolean>(false);
  const [editingRate, setEditingRate] = useState<RateMatrixItem | null>(null);

  const [testimonialsList, setTestimonialsList] = useState<Testimonial[]>([]);
  const [testimonialModalOpen, setTestimonialModalOpen] = useState<boolean>(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

  const [teamMembers, setTeamMembers] = useState<AboutTeamMember[]>([]);
  const [teamModalOpen, setTeamModalOpen] = useState<boolean>(false);
  const [editingMember, setEditingMember] = useState<AboutTeamMember | null>(null);

  const [milestonesList, setMilestonesList] = useState<AboutMilestone[]>([]);
  const [milestoneModalOpen, setMilestoneModalOpen] = useState<boolean>(false);
  const [editingMilestone, setEditingMilestone] = useState<AboutMilestone | null>(null);

  const [branchOfficesList, setBranchOfficesList] = useState<BranchOffice[]>([]);
  const [branchModalOpen, setBranchModalOpen] = useState<boolean>(false);
  const [editingBranch, setEditingBranch] = useState<BranchOffice | null>(null);

  const [whyChooseUsPillars, setWhyChooseUsPillars] = useState<WhyChooseUsPillar[]>([]);
  const [processStepsList, setProcessStepsList] = useState<ProcessStep[]>([]);
  const [socialLinksState, setSocialLinksState] = useState<SocialLinks>({});

  const [salariedDocsList, setSalariedDocsList] = useState<string[]>([]);
  const [newSalariedDoc, setNewSalariedDoc] = useState<string>('');

  const [selfEmployedDocsList, setSelfEmployedDocsList] = useState<string[]>([]);
  const [newSelfEmployedDoc, setNewSelfEmployedDoc] = useState<string>('');

  const [propertyDocsList, setPropertyDocsList] = useState<string[]>([]);
  const [newPropertyDoc, setNewPropertyDoc] = useState<string>('');

  const parseSafeJson = <T,>(raw: any, fallback: T): T => {
    if (!raw) return fallback;
    try {
      return typeof raw === 'string' ? JSON.parse(raw) : raw;
    } catch {
      return fallback;
    }
  };

  const loadData = () => {
    setLoading(true);
    getPublicSiteContent()
      .then((data) => {
        setContent(data);

        // Parse rotating words
        if (data.heroRotatingWords) {
          setRotatingWordsList(
            data.heroRotatingWords.split(',').map((w) => w.trim()).filter(Boolean)
          );
        } else {
          setRotatingWordsList([
            'Lowest Rates.',
            'Govt. Subsidy.',
            '7.25% Home Loans.',
            '8.50% LAP.',
            'Bank Takeover.',
          ]);
        }

        // Parse hero badges
        setHeroBadgesList(
          parseSafeJson<string[]>(data.heroBadges, [
            'Direct Bank Syndication',
            'Zero Upfront Charges',
            'Doorstep Documentation',
            'Fast 24-48h In-Principle Sanction',
          ])
        );

        // Parse Rate Matrix
        setRateMatrixItems(
          parseSafeJson<RateMatrixItem[]>(data.rateMatrix, [
            {
              id: '1',
              bankName: 'State Bank of India (SBI)',
              homeLoanRate: '8.40% - 9.15%',
              lapRate: '9.60% - 10.50%',
              maxTenure: '30 Years',
              processingFee: '0.35% + GST',
              ltv: 'Up to 85%',
              popularTag: 'Most Popular PSU',
            },
            {
              id: '2',
              bankName: 'HDFC Bank',
              homeLoanRate: '8.50% - 9.40%',
              lapRate: '9.75% - 11.00%',
              maxTenure: '30 Years',
              processingFee: '0.50% + GST',
              ltv: 'Up to 80%',
              popularTag: 'Fastest Processing',
            },
          ])
        );

        // Parse Testimonials
        setTestimonialsList(
          parseSafeJson<Testimonial[]>(data.testimonials, [
            {
              id: '1',
              name: 'K. Rangarajan',
              location: 'Tirupur',
              loanType: 'Home Construction Loan',
              amount: '₹65 Lakhs',
              rating: 5,
              review:
                'Prime Associates helped us get our home construction loan approved through SBI when other brokers refused due to land classification. Got 8.40% interest with complete subsidy guidance!',
              avatarUrl:
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
            },
          ])
        );

        // Parse Team Members
        setTeamMembers(
          parseSafeJson<AboutTeamMember[]>(data.aboutTeam, [
            {
              id: '1',
              name: 'P. Shanmugasundaram',
              role: 'Managing Director & Principal Consultant',
              experience: '18+ Years Banking & Property Finance',
              bio: 'Specialist in high-value mortgage syndication, commercial property funding, and bank takeover negotiations.',
              imageUrl:
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
              linkedinUrl: 'https://linkedin.com',
            },
          ])
        );

        // Parse Milestones
        setMilestonesList(
          parseSafeJson<AboutMilestone[]>(data.aboutMilestones, [
            {
              year: '2008',
              title: 'Foundation in Tirupur',
              description:
                'Established as an independent loan consultancy catering to textile and manufacturing entrepreneurs.',
              stat: 'Inception',
            },
          ])
        );

        // Parse Branch Offices
        setBranchOfficesList(
          parseSafeJson<BranchOffice[]>(data.branchOffices, [
            {
              id: '1',
              name: 'Tirupur Main Office (HQ)',
              address:
                'No. 48, 49, P.R. Complex, Binny Compound Main Street, Kumaran Road, Tirupur - 641601',
              phone: '+91 96555 66613, +91 95144 66600',
              email: 'primeassociates2008@gmail.com',
              timings: 'Monday – Saturday: 9:30 AM – 6:30 PM',
              mapEmbedUrl: 'https://maps.google.com/?q=Prime+Associates+Tirupur',
            },
          ])
        );

        // Parse Pillars and Steps
        setWhyChooseUsPillars(
          parseSafeJson<WhyChooseUsPillar[]>(data.whyChooseUsPillars, [
            {
              title: 'Govt. Subsidy & Lowest Rate Arbitrage',
              description:
                'We cross-compare 40+ nationalized and private banks to secure rates starting at 7.25% and maximize eligible PMAY/State interest subsidies.',
              metric: 'Save ₹3–8 Lakhs',
            },
            {
              title: 'Unconventional Property Clearances',
              description:
                'Specialized approval desks for tiled roofs, parent-deed issues, unapproved layout plots, and self-construction without plan approvals.',
              metric: '98.4% Approvals',
            },
            {
              title: 'Private to Govt. Bank Takeovers',
              description:
                'Cut your monthly EMI by migrating high-interest loans from NBFCs/private financiers to public sector banks with top-up capital.',
              metric: 'Up to 3.5% Rate Drop',
            },
            {
              title: 'Zero Upfront Consultant Charges',
              description:
                '100% transparent assistance with zero hidden advisory fees before bank in-principle sanction. We are your advocate.',
              metric: 'Zero Advance',
            },
          ])
        );

        setProcessStepsList(
          parseSafeJson<ProcessStep[]>(data.processSteps, [
            {
              stepNumber: '01',
              title: 'Property & Profile Evaluation',
              description:
                'Initial meeting at our Tirupur office or via phone to evaluate title documents, guideline values, and income profile.',
              turnaround: 'Hour 1–4',
            },
            {
              stepNumber: '02',
              title: 'Multi-Lender Syndication',
              description:
                'We tailor your loan dossier and simultaneously syndicate it to 3–4 best-fit banks for competitive sanction.',
              turnaround: 'Day 1–2',
            },
            {
              stepNumber: '03',
              title: 'Legal, Valuation & Sanction',
              description:
                'Liaison with bank panel lawyers and technical valuers to resolve title queries and obtain sanction.',
              turnaround: 'Day 3–5',
            },
            {
              stepNumber: '04',
              title: 'Documentation & Disbursal',
              description:
                'Signing of bank agreements, MODT registration at Sub-Registrar office, and direct fund disbursement.',
              turnaround: 'Final Step',
            },
          ])
        );

        // Parse Social Links
        setSocialLinksState(
          parseSafeJson<SocialLinks>(data.socialLinks, {
            facebook: 'https://facebook.com',
            instagram: 'https://instagram.com',
            linkedin: 'https://linkedin.com',
            twitter: 'https://twitter.com',
            youtube: 'https://youtube.com',
            mapUrl: 'https://maps.google.com/?q=Prime+Associates+Tirupur',
          })
        );

        // Parse Document Checklists
        setSalariedDocsList(
          parseSafeJson<string[]>(data.salariedDocs, [
            'PAN Card & Aadhaar Card (Applicant & Co-applicant)',
            'Last 3 Months Salary Slips (with seal & signature)',
            'Form 16 / ITR for last 2 assessment years',
            'Last 6 Months Bank Statement (Salary Account)',
            'Proof of Employment / Official ID Card',
          ])
        );

        setSelfEmployedDocsList(
          parseSafeJson<string[]>(data.selfEmployedDocs, [
            'PAN, Aadhaar & Business KYC Proof',
            'ITR with Computation & Financials (last 3 years)',
            'Last 12 Months Current Account Bank Statements',
            'GST Registration Certificate & 3B Returns',
            'Business Continuity Proof & Ownership Agreement',
          ])
        );

        setPropertyDocsList(
          parseSafeJson<string[]>(data.propertyDocs, [
            'Parent Title Deeds & Registered Sale Deed (Chronological chain)',
            'Patta, Chitta, Adangal & FMB Sketch',
            'Approved Building Plan / Town & Country Planning Approval',
            'Latest Property Tax Receipt & Encumbrance Certificate (EC) for 30 years',
            'Construction Cost Estimate (from chartered engineer)',
          ])
        );
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const sectionParam = searchParams.get('section') as TabType | null;
    if (sectionParam !== activeTab) {
      setActiveTab(sectionParam);
    }
  }, [searchParams]);

  const selectModule = (tab: TabType | null) => {
    setActiveTab(tab);
    if (tab) {
      setSearchParams({ section: tab });
    } else {
      setSearchParams({});
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setContent((prev) => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setContent((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setContent((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveAll = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    const payload: Partial<SiteContent> = {
      ...content,
      heroRotatingWords: rotatingWordsList.join(','),
      heroBadges: JSON.stringify(heroBadgesList),
      rateMatrix: JSON.stringify(rateMatrixItems),
      testimonials: JSON.stringify(testimonialsList),
      aboutTeam: JSON.stringify(teamMembers),
      aboutMilestones: JSON.stringify(milestonesList),
      branchOffices: JSON.stringify(branchOfficesList),
      whyChooseUsPillars: JSON.stringify(whyChooseUsPillars),
      processSteps: JSON.stringify(processStepsList),
      socialLinks: JSON.stringify(socialLinksState),
      salariedDocs: JSON.stringify(salariedDocsList),
      selfEmployedDocs: JSON.stringify(selfEmployedDocsList),
      propertyDocs: JSON.stringify(propertyDocsList),
    };

    try {
      const updated = await updateSiteContentApi(payload);
      setContent(updated);
      setSuccessMessage('All website content and live parameters updated successfully!');
      setTimeout(() => setSuccessMessage(null), 4500);
    } catch (err: any) {
      setError(err.message || 'Failed to update website content');
    } finally {
      setSaving(false);
    }
  };

  // Helper managers for items
  const addRotatingWord = () => {
    if (!newRotatingWord.trim()) return;
    setRotatingWordsList([...rotatingWordsList, newRotatingWord.trim()]);
    setNewRotatingWord('');
  };

  const removeRotatingWord = (index: number) => {
    setRotatingWordsList(rotatingWordsList.filter((_, i) => i !== index));
  };

  const addHeroBadge = () => {
    if (!newHeroBadge.trim()) return;
    setHeroBadgesList([...heroBadgesList, newHeroBadge.trim()]);
    setNewHeroBadge('');
  };

  const removeHeroBadge = (index: number) => {
    setHeroBadgesList(heroBadgesList.filter((_, i) => i !== index));
  };

  // Rate Matrix handlers
  const saveRateItem = (item: RateMatrixItem) => {
    if (editingRate && editingRate.id) {
      setRateMatrixItems(rateMatrixItems.map((r) => (r.id === item.id ? item : r)));
    } else {
      setRateMatrixItems([...rateMatrixItems, { ...item, id: Date.now().toString() }]);
    }
    setRateModalOpen(false);
    setEditingRate(null);
  };

  const deleteRateItem = (id: string) => {
    setRateMatrixItems(rateMatrixItems.filter((r) => r.id !== id));
  };

  // Testimonial handlers
  const saveTestimonialItem = (item: Testimonial) => {
    if (editingTestimonial && editingTestimonial.id) {
      setTestimonialsList(testimonialsList.map((t) => (t.id === item.id ? item : t)));
    } else {
      setTestimonialsList([...testimonialsList, { ...item, id: Date.now().toString() }]);
    }
    setTestimonialModalOpen(false);
    setEditingTestimonial(null);
  };

  const deleteTestimonialItem = (id: string) => {
    setTestimonialsList(testimonialsList.filter((t) => t.id !== id));
  };

  // Team Member handlers
  const saveTeamMember = (member: AboutTeamMember) => {
    if (editingMember && editingMember.id) {
      setTeamMembers(teamMembers.map((m) => (m.id === member.id ? member : m)));
    } else {
      setTeamMembers([...teamMembers, { ...member, id: Date.now().toString() }]);
    }
    setTeamModalOpen(false);
    setEditingMember(null);
  };

  const deleteTeamMember = (id: string) => {
    setTeamMembers(teamMembers.filter((m) => m.id !== id));
  };

  // Milestone handlers
  const saveMilestone = (m: AboutMilestone) => {
    if (editingMilestone) {
      setMilestonesList(
        milestonesList.map((item) => (item.year === editingMilestone.year ? m : item))
      );
    } else {
      setMilestonesList([...milestonesList, m]);
    }
    setMilestoneModalOpen(false);
    setEditingMilestone(null);
  };

  const deleteMilestone = (year: string) => {
    setMilestonesList(milestonesList.filter((m) => m.year !== year));
  };

  // Branch handlers
  const saveBranch = (branch: BranchOffice) => {
    if (editingBranch && editingBranch.id) {
      setBranchOfficesList(branchOfficesList.map((b) => (b.id === branch.id ? branch : b)));
    } else {
      setBranchOfficesList([...branchOfficesList, { ...branch, id: Date.now().toString() }]);
    }
    setBranchModalOpen(false);
    setEditingBranch(null);
  };

  const deleteBranch = (id: string) => {
    setBranchOfficesList(branchOfficesList.filter((b) => b.id !== id));
  };

  // Loan Document Checklist Handlers
  const addSalariedDoc = () => {
    if (!newSalariedDoc.trim()) return;
    setSalariedDocsList([...salariedDocsList, newSalariedDoc.trim()]);
    setNewSalariedDoc('');
  };

  const removeSalariedDoc = (index: number) => {
    setSalariedDocsList(salariedDocsList.filter((_, i) => i !== index));
  };

  const addSelfEmployedDoc = () => {
    if (!newSelfEmployedDoc.trim()) return;
    setSelfEmployedDocsList([...selfEmployedDocsList, newSelfEmployedDoc.trim()]);
    setNewSelfEmployedDoc('');
  };

  const removeSelfEmployedDoc = (index: number) => {
    setSelfEmployedDocsList(selfEmployedDocsList.filter((_, i) => i !== index));
  };

  const addPropertyDoc = () => {
    if (!newPropertyDoc.trim()) return;
    setPropertyDocsList([...propertyDocsList, newPropertyDoc.trim()]);
    setNewPropertyDoc('');
  };

  const removePropertyDoc = (index: number) => {
    setPropertyDocsList(propertyDocsList.filter((_, i) => i !== index));
  };

  const resetSalariedDocsToDefault = () => {
    setSalariedDocsList([
      'PAN Card & Aadhaar Card (Applicant & Co-applicant)',
      'Last 3 Months Salary Slips (with official seal & HR signature)',
      'Form 16 / ITR with Computation for last 2 assessment years',
      'Last 6 Months Bank Statement (Salary Credited Account)',
      'Proof of Employment / Official ID Card / Appointment Letter',
    ]);
  };

  const resetSelfEmployedDocsToDefault = () => {
    setSelfEmployedDocsList([
      'PAN Card, Aadhaar Card & Business Entity Proof (GST / Udyam / Registration)',
      'ITR with Computation, Balance Sheet & P&L Statement (Last 3 Years attested by CA)',
      'Last 12 Months Current Account Bank Statements',
      'GST Registration Certificate & 3B Monthly Tax Returns',
      'Business Continuity Proof (Shop Act / MSME / Partnership Deed / MOA)',
    ]);
  };

  const resetPropertyDocsToDefault = () => {
    setPropertyDocsList([
      'Parent Title Deeds & Registered Sale Deed (Chronological link documents for 30 years)',
      'Patta, Chitta, Adangal & FMB Sketch / Land Revenue Records',
      'Approved Building Plan & Town & Country Planning (DTCP / CMDA) Approval',
      'Latest Property Tax Receipt & Encumbrance Certificate (EC) for 30 years',
      'Detailed Construction Cost Estimate & Stage Specification (from Chartered Civil Engineer)',
    ]);
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-7xl pb-1 font-sans animate-pulse">
        {/* Detail Editor Skeleton (when a specific section is targeted) */}
        {activeTab ? (
          <div className="space-y-6">
            {/* Header skeleton */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-slate-200/80">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-28 bg-slate-200 rounded" />
                  <div className="h-3 w-3 bg-slate-200 rounded-full" />
                  <div className="h-4 w-20 bg-slate-200 rounded" />
                  <div className="h-5 w-10 bg-slate-100 rounded-md" />
                </div>
                <div className="h-8 w-80 sm:w-96 bg-slate-300 rounded-xl" />
                <div className="h-4 w-72 sm:w-80 bg-slate-200 rounded-lg" />
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <div className="h-10 w-48 sm:w-64 bg-slate-200 rounded-xl" />
                <div className="h-10 w-24 bg-slate-100 rounded-xl" />
                <div className="h-10 w-32 bg-teal-100 rounded-xl" />
              </div>
            </div>

            {/* Canvas Editor Skeleton Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-200" />
                  <div className="space-y-1.5">
                    <div className="h-5 w-48 bg-slate-300 rounded-lg" />
                    <div className="h-3.5 w-64 bg-slate-100 rounded" />
                  </div>
                </div>
                <div className="h-9 w-36 bg-slate-200 rounded-xl self-start sm:self-auto" />
              </div>

              {/* Grid cards shimmer (for testimonials, pillars, rates, etc.) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200/80 flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <div key={s} className="w-3.5 h-3.5 bg-slate-200 rounded-full" />
                          ))}
                        </div>
                        <div className="h-4 w-16 bg-slate-200 rounded" />
                      </div>
                      <div className="space-y-1.5">
                        <div className="h-3.5 w-full bg-slate-200 rounded" />
                        <div className="h-3.5 w-5/6 bg-slate-200 rounded" />
                        <div className="h-3.5 w-3/4 bg-slate-100 rounded" />
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-200" />
                        <div className="space-y-1">
                          <div className="h-3.5 w-24 bg-slate-200 rounded" />
                          <div className="h-3 w-16 bg-slate-100 rounded" />
                        </div>
                      </div>
                      <div className="flex gap-1.5">
                        <div className="h-6 w-12 bg-slate-200 rounded" />
                        <div className="h-6 w-12 bg-slate-100 rounded" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Form Input Skeletons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                <div className="space-y-2">
                  <div className="h-3.5 w-32 bg-slate-200 rounded" />
                  <div className="h-11 w-full bg-slate-100 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <div className="h-3.5 w-36 bg-slate-200 rounded" />
                  <div className="h-11 w-full bg-slate-100 rounded-xl" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Catalog Grid Skeleton (when viewing all website modules) */
          <div className="space-y-6">
            {/* Catalog Top Header */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-4 w-28 bg-slate-200 rounded" />
                <div className="h-3 w-3 bg-slate-200 rounded-full" />
                <div className="h-4 w-32 bg-slate-200 rounded" />
              </div>
              <div className="h-8 w-80 sm:w-96 bg-slate-300 rounded-xl" />
              <div className="h-4 w-72 sm:w-96 bg-slate-200 rounded-lg" />
            </div>

            {/* Filter & Search Bar Skeleton */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-2 overflow-x-auto">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-8 w-24 bg-slate-200 rounded-xl shrink-0" />
                  ))}
                </div>
                <div className="h-9 w-full md:w-64 bg-slate-100 rounded-xl" />
              </div>
            </div>

            {/* 6-Card Module Skeleton Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3.5">
                    <div className="flex items-start justify-between">
                      <div className="w-12 h-12 rounded-xl bg-slate-200" />
                      <div className="flex items-center gap-1.5">
                        <div className="w-16 h-5 bg-slate-100 rounded-md" />
                        <div className="w-8 h-5 bg-slate-200 rounded-md" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="h-5 w-48 bg-slate-300 rounded-lg" />
                      <div className="h-3.5 w-full bg-slate-100 rounded" />
                      <div className="h-3.5 w-4/5 bg-slate-100 rounded" />
                    </div>

                    <div className="h-7 w-full bg-slate-50 rounded-xl border border-slate-100" />
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="h-4 w-24 bg-slate-100 rounded" />
                    <div className="h-8 w-28 bg-slate-200 rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  const CONTENT_MODULES = [
    {
      id: 'hero' as TabType,
      number: '01',
      title: 'Homepage Hero & Value Proposition',
      category: 'Home Page',
      publicRoute: '/',
      previewUrl: '/',
      icon: Home,
      colorScheme: {
        bg: 'bg-teal-50',
        text: 'text-teal-700',
        border: 'border-teal-200',
      },
      shortDesc: 'Primary public welcoming banner, headline, rotating subsidy phrases, trust badges, and direct call-to-action button.',
      keyFeatures: ['Hero Headline & Subtitle', 'Rotating Words', 'Trust Badges', 'Primary CTA Button'],
      summary: `${rotatingWordsList.length} rotating phrases • ${heroBadgesList.length} badges`,
    },
    {
      id: 'stats' as TabType,
      number: '02',
      title: 'Key Statistics & Milestone Strip',
      category: 'Home Page',
      publicRoute: '/#stats',
      previewUrl: '/#stats',
      icon: BarChart3,
      colorScheme: {
        bg: 'bg-indigo-50',
        text: 'text-indigo-700',
        border: 'border-indigo-200',
      },
      shortDesc: 'Four live milestone metrics highlighting total loan sanction volume, approval success percentage, bank network, and experience.',
      keyFeatures: ['₹450+ Cr Disbursed', '99.2% Sanction Rate', '18+ Partner Banks', '16+ Years Experience'],
      summary: '4 Key Track Record Metrics',
    },
    {
      id: 'rates' as TabType,
      number: '03',
      title: 'Multi-Lender Interest Rate Matrix',
      category: 'Home Page',
      publicRoute: '/#rates',
      previewUrl: '/#rates',
      icon: Landmark,
      colorScheme: {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
      },
      shortDesc: 'Interactive bank rate comparison table comparing SBI, HDFC, ICICI, and Axis Bank with processing fees and subsidy badges.',
      keyFeatures: ['Multi-Bank Rates Table', 'Processing Fees', 'LTV Ratios', 'Govt Subsidy Tags'],
      summary: `${rateMatrixItems.length} active lender benchmarks configured`,
    },
    {
      id: 'process' as TabType,
      number: '04',
      title: 'Why Choose Us Pillars & 4-Step Process',
      category: 'Home Page',
      publicRoute: '/#process',
      previewUrl: '/#process',
      icon: Layers,
      colorScheme: {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
      },
      shortDesc: 'Core advisory advantages (doorstep service, unapproved layout desk, takeover savings) and the 4-stage loan syndication workflow.',
      keyFeatures: ['4 Strategic Advantages', 'Step 1 to 4 Timeline', 'Sanction Workflow', 'Turnaround Guarantees'],
      summary: `${whyChooseUsPillars.length || 4} Pillars • ${processStepsList.length || 4} Process Steps`,
    },
    {
      id: 'testimonials' as TabType,
      number: '05',
      title: 'Borrower Reviews & Ratings',
      category: 'Home Page',
      publicRoute: '/#reviews',
      previewUrl: '/#reviews',
      icon: Star,
      colorScheme: {
        bg: 'bg-yellow-50',
        text: 'text-yellow-700',
        border: 'border-yellow-200',
      },
      shortDesc: 'Verified borrower customer feedback, 5-star ratings, quotes, loan product type, loan amount, and applicant city.',
      keyFeatures: ['Verified Client Feedback', '5-Star Ratings', 'Borrower City & Facility', 'Customer Avatars'],
      summary: `${testimonialsList.length} verified borrower reviews live`,
    },
    {
      id: 'about' as TabType,
      number: '06',
      title: 'About Us, Leadership & History',
      category: 'About Us',
      publicRoute: '/about',
      previewUrl: '/about',
      icon: Users,
      colorScheme: {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
      },
      shortDesc: 'Company history, Managing Director / Founder vision, advisory leadership profiles, and corporate milestone timeline.',
      keyFeatures: ['Company Founding Story', 'Founder & MD Message', 'Leadership Profiles', 'Milestone Timeline'],
      summary: `${teamMembers.length} team profiles • ${milestonesList.length} milestones`,
    },
    {
      id: 'identity' as TabType,
      number: '07',
      title: 'Corporate Brand & Contact Identity',
      category: 'Contact & Branches',
      publicRoute: 'Header, Footer & All Pages',
      previewUrl: '/contact',
      icon: Building,
      colorScheme: {
        bg: 'bg-teal-50',
        text: 'text-teal-700',
        border: 'border-teal-200',
      },
      shortDesc: 'Official business name, brand tagline, customer service phone lines, email addresses, GSTIN credentials, and social media links.',
      keyFeatures: ['Official Business Name', 'Helpline & WhatsApp', 'Official Email & GSTIN', 'Social Channel Links'],
      summary: 'Global brand identity across header, footer & official forms',
    },
    {
      id: 'branches' as TabType,
      number: '08',
      title: 'Office Branches & Advisory Desks',
      category: 'Contact & Branches',
      publicRoute: '/contact',
      previewUrl: '/contact',
      icon: MapPin,
      colorScheme: {
        bg: 'bg-rose-50',
        text: 'text-rose-700',
        border: 'border-rose-200',
      },
      shortDesc: 'Physical advisory office locations (Tirupur HQ, Coimbatore, Erode), full postal addresses, direct desks, timings, and map navigation.',
      keyFeatures: ['Physical Branch Directory', 'Direct Desk Phones', 'Consultation Hours', 'Google Maps Links'],
      summary: `${branchOfficesList.length} physical office branches listed`,
    },
    {
      id: 'loan-docs' as TabType,
      number: '09',
      title: 'Loan Services & Required Document Checklists',
      category: 'Loan Services & Checklists',
      publicRoute: '/services/home-loans#documents',
      previewUrl: '/services/home-loans',
      icon: FileCheck,
      colorScheme: {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
      },
      shortDesc: 'Manage borrower loan file requirements and required document checklists for Home Loans, Mortgage (LAP), Property Funding, and Vehicle Loans for Salaried & Self-Employed.',
      keyFeatures: [
        'Salaried Income Proofs',
        'Self-Employed ITR & Bank Statements',
        'Property Title Deeds (Patta, EC, Chitta)',
        'Building Plan & Technical Approvals',
      ],
      summary: `${salariedDocsList.length + selfEmployedDocsList.length + propertyDocsList.length} required documents configured across 3 loan streams`,
    },
    {
      id: 'calculator' as TabType,
      number: '10',
      title: 'EMI Calculator Benchmarks & Parameters',
      category: 'Tools & Compliance',
      publicRoute: '/calculator',
      previewUrl: '/calculator',
      icon: Calculator,
      colorScheme: {
        bg: 'bg-purple-50',
        text: 'text-purple-700',
        border: 'border-purple-200',
      },
      shortDesc: 'Default starting interest rates for Home Loans and LAP, loan amount presets, and max repayment tenure limits for the public EMI calculator.',
      keyFeatures: ['Default Calculator Rates', 'Tenure Limit Settings', 'Loan Amount Presets', 'Auto-Amortization Defaults'],
      summary: 'Configures default values for the online EMI and FOIR tools',
    },
    {
      id: 'legal' as TabType,
      number: '11',
      title: 'Compliance, Disclaimers & Legal Notice',
      category: 'Tools & Compliance',
      publicRoute: '/terms',
      previewUrl: '/terms',
      icon: ShieldCheck,
      colorScheme: {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
      },
      shortDesc: 'RERA registration numbers, direct lending disclaimer, RBI compliance notice, copyright statements, and data privacy safeguards.',
      keyFeatures: ['RERA Registration No.', 'Direct Lending Disclaimer', 'RBI Regulatory Notice', 'Official Copyright Policy'],
      summary: 'Compliance disclosure and regulatory safeguarding',
    },
    {
      id: 'footer' as TabType,
      number: '12',
      title: 'Global Footer & Advisory Hub',
      category: 'Footer & Legal',
      publicRoute: 'Site-wide Footer',
      previewUrl: '/#contact',
      icon: Globe,
      colorScheme: {
        bg: 'bg-cyan-50',
        text: 'text-cyan-700',
        border: 'border-cyan-200',
      },
      shortDesc: 'Manage brand mission narrative, central office address, multiple helpline numbers, working hours, consultation ethics disclosure, social channels, and copyright baseline.',
      keyFeatures: ['Brand Mission & Tagline', 'Central Office Postal Address', 'Multi-Phone Helplines', 'Consultation Ethics Statement', 'Social Media & Maps'],
      summary: 'Live across all desktop & mobile page footers',
    },
  ];

  const categories = ['ALL', 'Home Page', 'Loan Services & Checklists', 'About Us', 'Contact & Branches', 'Tools & Compliance', 'Footer & Legal'];

  const filteredModules = CONTENT_MODULES.filter((mod) => {
    const matchesCat = catalogFilter === 'ALL' || mod.category === catalogFilter;
    const matchesSearch =
      catalogSearch.trim() === '' ||
      mod.title.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      mod.shortDesc.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      mod.publicRoute.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      mod.category.toLowerCase().includes(catalogSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const currentModule = CONTENT_MODULES.find((m) => m.id === activeTab);
  const currentIndex = CONTENT_MODULES.findIndex((m) => m.id === activeTab);
  const prevModule = currentIndex > 0 ? CONTENT_MODULES[currentIndex - 1] : null;
  const nextModule = currentIndex < CONTENT_MODULES.length - 1 ? CONTENT_MODULES[currentIndex + 1] : null;

  return (
    <div className="space-y-6 max-w-7xl pb-1 font-sans">
      {/* ─── ALERTS ─── */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs sm:text-sm flex items-center justify-between gap-2.5 animate-in fade-in shadow-2xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-600" />
            <span className="font-semibold">{successMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-800 text-xs sm:text-sm flex items-center justify-between gap-2.5 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
            <span className="font-semibold">{error}</span>
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-red-700 hover:text-red-900 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ─── WHEN NO MODULE IS SELECTED: RENDER WEBSITE CONTENT CATALOG ─── */}
      {!activeTab ? (
        <div className="space-y-5 animate-in fade-in duration-150">
          {/* Filter & Search Bar */}
          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3 font-sans">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {categories.map((cat) => {
                  const count =
                    cat === 'ALL'
                      ? CONTENT_MODULES.length
                      : CONTENT_MODULES.filter((m) => m.category === cat).length;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCatalogFilter(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold font-heading whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                        catalogFilter === cat
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/80'
                      }`}
                    >
                      <span>{cat === 'ALL' ? 'All Sections' : cat}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                          catalogFilter === cat
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Search Toolbar */}
              <div className="relative min-w-[260px] sm:min-w-[300px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={catalogSearch}
                  onChange={(e) => setCatalogSearch(e.target.value)}
                  placeholder="Search section name, page, or topic..."
                  className="w-full pl-9 pr-8 py-2 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl text-xs font-sans text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                />
                {catalogSearch && (
                  <button
                    type="button"
                    onClick={() => setCatalogSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredModules.map((mod) => {
              const IconComp = mod.icon;
              return (
                <div
                  key={mod.id}
                  onClick={() => selectModule(mod.id)}
                  className="group bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 shadow-2xs hover:shadow-md transition-all duration-150 p-5 sm:p-6 flex flex-col justify-between cursor-pointer"
                >

                  <div>
                    {/* Header badge & number */}
                    <div className="flex items-center justify-between gap-2 mb-3.5">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${mod.colorScheme.bg} ${mod.colorScheme.border} border shadow-2xs`}
                        >
                          <IconComp className={`w-5 h-5 ${mod.colorScheme.text}`} />
                        </div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 font-heading bg-slate-100 px-2 py-0.5 rounded-md">
                          {mod.category}
                        </span>
                      </div>
                      <span className="text-xs font-black text-slate-300 group-hover:text-teal-600 font-heading transition-colors">
                        #{mod.number}
                      </span>
                    </div>

                    {/* Title & Short Description */}
                    <h3 className="text-base font-extrabold text-[#0c1a26] group-hover:text-teal-700 transition-colors font-heading leading-snug">
                      {mod.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2 font-sans">
                      {mod.shortDesc}
                    </p>

                    {/* Feature tags */}
                    <div className="flex flex-wrap gap-1.5 mt-3.5">
                      {mod.keyFeatures.map((feat, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-50 text-slate-600 border border-slate-200/80 rounded-md text-[10px] font-medium font-sans"
                        >
                          <span className="w-1 h-1 rounded-full bg-teal-500" />
                          {feat}
                        </span>
                      ))}
                    </div>

                    {/* Configuration Summary & Route */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-sans">
                      <span className="text-slate-500 font-medium truncate max-w-[190px]">
                        {mod.summary}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 font-mono shrink-0">
                        {mod.publicRoute}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        selectModule(mod.id);
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 group-hover:bg-teal-600 text-white rounded-xl text-xs font-bold font-heading shadow-2xs transition-colors cursor-pointer"
                    >
                      <span>Edit Page Content</span>
                      <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    </button>

                    <a
                      href={mod.previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg text-xs font-semibold font-heading transition-colors"
                      title="View live section on public website"
                    >
                      <span>Live Site</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredModules.length === 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 space-y-2">
              <Search className="w-8 h-8 text-slate-300 mx-auto" />
              <div className="font-bold text-slate-800 text-sm font-heading">No Content Modules Found</div>
              <p className="text-xs text-slate-400 max-w-sm mx-auto font-sans">
                No website modules match your search filter "{catalogSearch}". Clear the search to view all sections.
              </p>
              <button
                type="button"
                onClick={() => {
                  setCatalogSearch('');
                  setCatalogFilter('ALL');
                }}
                className="mt-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold font-heading cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      ) : (
        /* ─── WHEN A MODULE IS OPENED: RENDER DEDICATED SECTION EDITOR PAGE ─── */
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Dedicated Section Top Header Bar - Clean Native Layout */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 font-sans pb-1">
            <div>
              {/* Breadcrumb Navigation Trail */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-1">
                <button
                  type="button"
                  onClick={() => selectModule(null)}
                  className="inline-flex items-center gap-1.5 font-bold font-heading text-slate-700 hover:text-teal-700 hover:underline cursor-pointer transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Website Content</span>
                </button>
                <span className="text-slate-300">•</span>
                <span className="font-semibold text-slate-600 font-heading">{currentModule?.category}</span>
                <span className="text-slate-300">•</span>
                <span className="px-2 py-0.5 rounded-md bg-teal-50 border border-teal-200 text-teal-800 text-[10px] font-bold font-mono">
                  {currentModule?.publicRoute}
                </span>
              </div>

              {/* Title & Description */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0c1a26] tracking-tight font-heading">
                {currentModule?.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-sans">
                {currentModule?.shortDesc}
              </p>
            </div>

            {/* Quick Actions Strip */}
            <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
              {/* Quick Jump Dropdown */}
              <select
                value={activeTab}
                onChange={(e) => selectModule(e.target.value as TabType)}
                className="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold font-heading text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 cursor-pointer shadow-2xs transition-all"
                title="Jump to another section"
              >
                {CONTENT_MODULES.map((m) => (
                  <option key={m.id} value={m.id}>
                    #{m.number} {m.title}
                  </option>
                ))}
              </select>

              {currentModule?.previewUrl && (
                <a
                  href={currentModule.previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold font-heading rounded-xl border border-slate-200 flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                  title="Preview on Live Website"
                >
                  <Eye className="w-3.5 h-3.5 text-teal-600" />
                  <span className="hidden sm:inline">Preview</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              )}

              <button
                type="button"
                onClick={() => handleSaveAll()}
                disabled={saving}
                className="px-4 py-2 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 disabled:opacity-50 text-white font-extrabold text-xs font-heading rounded-xl shadow-xs flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ─── TAB CONTENT PANELS ─── */}
          <div className="space-y-6">
        {/* 1. BRAND & IDENTITY */}
        {activeTab === 'identity' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl p-6 border border-brand-border shadow-subtle space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-brand-border text-brand-navy">
                <Building className="w-5 h-5 text-brand-teal" />
                <div>
                  <h3 className="text-base font-bold">1. Corporate Identity &amp; Contact Info</h3>
                  <p className="text-xs text-brand-slate">
                    Displayed in the header, footer, floating widgets, and official enquiry confirmations.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1.5">
                    Official Business / Brand Name
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    value={content.businessName || ''}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-brand-navy font-semibold focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1.5">
                    Brand Tagline / Slogan
                  </label>
                  <input
                    type="text"
                    name="tagline"
                    value={content.tagline || ''}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-brand-navy focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1.5">
                    Official Advisory Phone(s) (Comma separated)
                  </label>
                  <input
                    type="text"
                    name="businessPhone"
                    value={content.businessPhone || ''}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-brand-navy focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1.5">
                    Official Email Address
                  </label>
                  <input
                    type="email"
                    name="businessEmail"
                    value={content.businessEmail || ''}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-brand-navy focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1.5">
                    Headquarters City &amp; State
                  </label>
                  <input
                    type="text"
                    name="cityState"
                    value={content.cityState || ''}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-brand-navy focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1.5">
                    Consultation &amp; Working Hours
                  </label>
                  <input
                    type="text"
                    name="businessHours"
                    value={content.businessHours || ''}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-brand-navy focus:bg-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-brand-navy mb-1.5">
                    Primary Headquarters Physical Address
                  </label>
                  <input
                    type="text"
                    name="officeAddress"
                    value={content.officeAddress || ''}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-brand-navy focus:bg-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-brand-navy mb-1.5">
                    Registration &amp; Licensing Credentials (GSTIN / RERA / DSA Code)
                  </label>
                  <input
                    type="text"
                    name="registrationDetails"
                    value={content.registrationDetails || ''}
                    onChange={handleChange}
                    placeholder="e.g. GSTIN: 33ABCDE1234F1Z5 • Authorized Direct Selling Associate"
                    className="w-full p-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-brand-navy focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Announcement Bar & Floating Widget */}
            <div className="bg-white rounded-2xl p-6 border border-brand-border shadow-subtle space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-brand-border text-brand-navy">
                <Megaphone className="w-5 h-5 text-brand-teal" />
                <div>
                  <h3 className="text-base font-bold">Top Announcement Bar &amp; WhatsApp Floating Widget</h3>
                  <p className="text-xs text-brand-slate">
                    Engage users instantly with a high-visibility header ribbon and 1-click WhatsApp advisory.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="md:col-span-2 flex items-center gap-3 p-3 bg-brand-ivory/60 rounded-xl border border-brand-border">
                  <input
                    type="checkbox"
                    id="announcementActive"
                    name="announcementActive"
                    checked={content.announcementActive ?? true}
                    onChange={(e) =>
                      setContent((prev) => ({ ...prev, announcementActive: e.target.checked }))
                    }
                    className="w-4 h-4 text-brand-teal rounded border-gray-300 focus:ring-brand-teal"
                  />
                  <label
                    htmlFor="announcementActive"
                    className="text-xs font-bold text-brand-navy cursor-pointer"
                  >
                    Enable Top Header Announcement Banner on all public pages
                  </label>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-brand-navy mb-1.5">
                    Announcement Banner Text
                  </label>
                  <input
                    type="text"
                    name="announcementText"
                    value={content.announcementText || ''}
                    onChange={handleChange}
                    placeholder="e.g. Special Home Loan Rates starting from 7.25% p.a. • Government Subsidy Assistance Available"
                    className="w-full p-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-brand-navy focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1.5">
                    Announcement Click Link (Optional)
                  </label>
                  <input
                    type="text"
                    name="announcementLink"
                    value={content.announcementLink || ''}
                    onChange={handleChange}
                    placeholder="/services/home-loans"
                    className="w-full p-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-brand-navy focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1.5">
                    WhatsApp Floating Button Number (Include Country Code)
                  </label>
                  <input
                    type="text"
                    name="whatsappNumber"
                    value={content.whatsappNumber || ''}
                    onChange={handleChange}
                    placeholder="+919655566613"
                    className="w-full p-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-brand-navy focus:bg-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-brand-navy mb-1.5">
                    Default Pre-Filled WhatsApp Inquiry Message
                  </label>
                  <textarea
                    rows={2}
                    name="whatsappMessage"
                    value={content.whatsappMessage || ''}
                    onChange={handleChange}
                    placeholder="Hello Prime Associates, I would like to consult with an advisor regarding a loan..."
                    className="w-full p-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-brand-navy focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-2xl p-6 border border-brand-border shadow-subtle space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-brand-border text-brand-navy">
                <Compass className="w-5 h-5 text-brand-teal" />
                <h3 className="text-base font-bold">Social Media Profiles &amp; Google Maps</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1.5">
                    Facebook Page URL
                  </label>
                  <input
                    type="url"
                    value={socialLinksState.facebook || ''}
                    onChange={(e) =>
                      setSocialLinksState({ ...socialLinksState, facebook: e.target.value })
                    }
                    className="w-full p-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-brand-navy focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1.5">
                    Instagram Profile URL
                  </label>
                  <input
                    type="url"
                    value={socialLinksState.instagram || ''}
                    onChange={(e) =>
                      setSocialLinksState({ ...socialLinksState, instagram: e.target.value })
                    }
                    className="w-full p-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-brand-navy focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1.5">
                    LinkedIn Company Page
                  </label>
                  <input
                    type="url"
                    value={socialLinksState.linkedin || ''}
                    onChange={(e) =>
                      setSocialLinksState({ ...socialLinksState, linkedin: e.target.value })
                    }
                    className="w-full p-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-brand-navy focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1.5">
                    Google Maps Office Pin URL
                  </label>
                  <input
                    type="url"
                    value={socialLinksState.mapUrl || ''}
                    onChange={(e) =>
                      setSocialLinksState({ ...socialLinksState, mapUrl: e.target.value })
                    }
                    className="w-full p-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-brand-navy focus:bg-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. HOMEPAGE HERO */}
        {activeTab === 'hero' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl p-6 border border-brand-border shadow-subtle space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-brand-border text-brand-navy">
                <Home className="w-5 h-5 text-brand-teal" />
                <div>
                  <h3 className="text-base font-bold">Homepage Hero Section &amp; Headlines</h3>
                  <p className="text-xs text-brand-slate">
                    First thing users see: dynamic headlines, rotating animated words, and primary calls-to-action.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-brand-navy mb-1.5">
                    Hero Eyebrow Pill / Badge
                  </label>
                  <input
                    type="text"
                    name="heroEyebrow"
                    value={content.heroEyebrow || ''}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-brand-navy font-semibold focus:bg-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-brand-navy mb-1.5">
                    Hero Main Headline (Static Prefix)
                  </label>
                  <input
                    type="text"
                    name="heroHeadline"
                    value={content.heroHeadline || ''}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-brand-navy font-extrabold text-base focus:bg-white"
                  />
                </div>

                {/* Rotating Words Tag Manager */}
                <div className="md:col-span-2 p-4 bg-brand-ivory/50 rounded-xl border border-brand-border space-y-3">
                  <label className="block text-xs font-bold text-brand-navy">
                    Rotating Animated Suffix Words (Smooth transitions every 2.4s)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {rotatingWordsList.map((word, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-brand-border text-brand-navy text-xs font-semibold rounded-lg shadow-xs"
                      >
                        <span>{word}</span>
                        <button
                          type="button"
                          onClick={() => removeRotatingWord(idx)}
                          className="text-red-500 hover:text-red-700 p-0.5 rounded"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="text"
                      value={newRotatingWord}
                      onChange={(e) => setNewRotatingWord(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addRotatingWord();
                        }
                      }}
                      placeholder="Type a phrase and hit add (e.g. 7.25% Home Loans.)"
                      className="flex-1 p-2 bg-white border border-brand-border rounded-lg text-xs"
                    />
                    <button
                      type="button"
                      onClick={addRotatingWord}
                      className="px-4 py-2 bg-brand-navy hover:bg-brand-navy/90 text-white text-xs font-bold rounded-lg flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Word</span>
                    </button>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-brand-navy mb-1.5">
                    Hero Descriptive Subtitle / Copy
                  </label>
                  <textarea
                    rows={3}
                    name="heroSubtitle"
                    value={content.heroSubtitle || ''}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-brand-navy focus:bg-white resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1.5">
                    Primary CTA Button Label
                  </label>
                  <input
                    type="text"
                    name="heroCtaText"
                    value={content.heroCtaText || ''}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-brand-navy font-semibold focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1.5">
                    Secondary CTA Button Label
                  </label>
                  <input
                    type="text"
                    name="heroSecondaryCtaText"
                    value={content.heroSecondaryCtaText || ''}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-brand-navy font-semibold focus:bg-white"
                  />
                </div>



                {/* Hero Badges */}
                <div className="md:col-span-2 p-4 bg-brand-ivory/50 rounded-xl border border-brand-border space-y-3">
                  <label className="block text-xs font-bold text-brand-navy">
                    Hero Trust Badges (Shown below the headline)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {heroBadgesList.map((badge, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-brand-border text-brand-navy text-xs font-semibold rounded-lg shadow-xs"
                      >
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>{badge}</span>
                        <button
                          type="button"
                          onClick={() => removeHeroBadge(idx)}
                          className="text-red-500 hover:text-red-700 p-0.5 rounded"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="text"
                      value={newHeroBadge}
                      onChange={(e) => setNewHeroBadge(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addHeroBadge();
                        }
                      }}
                      placeholder="Add highlight badge (e.g. Zero Hidden Brokerage)"
                      className="flex-1 p-2 bg-white border border-brand-border rounded-lg text-xs"
                    />
                    <button
                      type="button"
                      onClick={addHeroBadge}
                      className="px-4 py-2 bg-brand-teal hover:bg-brand-teal-hover text-white text-xs font-bold rounded-lg flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Badge</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. KEY STATISTICS COUNTER */}
        {activeTab === 'stats' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl p-6 border border-brand-border shadow-subtle space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-brand-border text-brand-navy">
                <BarChart3 className="w-5 h-5 text-brand-teal" />
                <div>
                  <h3 className="text-base font-bold">Key Performance Indicators &amp; Counters</h3>
                  <p className="text-xs text-brand-slate">
                    Live counters rendered on Homepage and About Us hero sections with animated 60fps easing.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs sm:text-sm">
                {/* Stat 1: Capital */}
                <div className="p-4 bg-brand-ivory/50 rounded-xl border border-brand-border space-y-3">
                  <div className="flex items-center gap-2 text-brand-teal font-bold text-xs uppercase">
                    <TrendingUp className="w-4 h-4" />
                    <span>Metric 1: Capital</span>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-brand-navy mb-1">
                      Counter Value (Numeric)
                    </label>
                    <input
                      type="text"
                      name="statsCapital"
                      value={content.statsCapital || ''}
                      onChange={handleChange}
                      placeholder="120"
                      className="w-full p-2 bg-white border border-brand-border rounded-lg font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-brand-navy mb-1">Suffix</label>
                    <input
                      type="text"
                      name="statsCapitalSuffix"
                      value={content.statsCapitalSuffix || ''}
                      onChange={handleChange}
                      placeholder="Cr+"
                      className="w-full p-2 bg-white border border-brand-border rounded-lg font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-brand-navy mb-1">Label</label>
                    <input
                      type="text"
                      name="statsCapitalLabel"
                      value={content.statsCapitalLabel || ''}
                      onChange={handleChange}
                      placeholder="Capital Facilitated"
                      className="w-full p-2 bg-white border border-brand-border rounded-lg"
                    />
                  </div>
                  <div className="pt-2 border-t border-brand-border/60 text-center">
                    <span className="text-xl font-black text-brand-navy">
                      ₹{content.statsCapital || '120'} {content.statsCapitalSuffix || 'Cr+'}
                    </span>
                  </div>
                </div>

                {/* Stat 2: Lenders */}
                <div className="p-4 bg-brand-ivory/50 rounded-xl border border-brand-border space-y-3">
                  <div className="flex items-center gap-2 text-brand-teal font-bold text-xs uppercase">
                    <Landmark className="w-4 h-4" />
                    <span>Metric 2: Lenders</span>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-brand-navy mb-1">
                      Counter Value
                    </label>
                    <input
                      type="text"
                      name="statsLenders"
                      value={content.statsLenders || ''}
                      onChange={handleChange}
                      placeholder="40"
                      className="w-full p-2 bg-white border border-brand-border rounded-lg font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-brand-navy mb-1">Suffix</label>
                    <input
                      type="text"
                      name="statsLendersSuffix"
                      value={content.statsLendersSuffix || ''}
                      onChange={handleChange}
                      placeholder="+"
                      className="w-full p-2 bg-white border border-brand-border rounded-lg font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-brand-navy mb-1">Label</label>
                    <input
                      type="text"
                      name="statsLendersLabel"
                      value={content.statsLendersLabel || ''}
                      onChange={handleChange}
                      placeholder="Partner Banks & NBFCs"
                      className="w-full p-2 bg-white border border-brand-border rounded-lg"
                    />
                  </div>
                  <div className="pt-2 border-t border-brand-border/60 text-center">
                    <span className="text-xl font-black text-brand-navy">
                      {content.statsLenders || '40'}
                      {content.statsLendersSuffix || '+'}
                    </span>
                  </div>
                </div>

                {/* Stat 3: Sanctions */}
                <div className="p-4 bg-brand-ivory/50 rounded-xl border border-brand-border space-y-3">
                  <div className="flex items-center gap-2 text-brand-teal font-bold text-xs uppercase">
                    <Award className="w-4 h-4" />
                    <span>Metric 3: Success</span>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-brand-navy mb-1">
                      Counter Value
                    </label>
                    <input
                      type="text"
                      name="statsSanction"
                      value={content.statsSanction || ''}
                      onChange={handleChange}
                      placeholder="98.4"
                      className="w-full p-2 bg-white border border-brand-border rounded-lg font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-brand-navy mb-1">Suffix</label>
                    <input
                      type="text"
                      name="statsSanctionSuffix"
                      value={content.statsSanctionSuffix || ''}
                      onChange={handleChange}
                      placeholder="%"
                      className="w-full p-2 bg-white border border-brand-border rounded-lg font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-brand-navy mb-1">Label</label>
                    <input
                      type="text"
                      name="statsSanctionLabel"
                      value={content.statsSanctionLabel || ''}
                      onChange={handleChange}
                      placeholder="Sanction Success Rate"
                      className="w-full p-2 bg-white border border-brand-border rounded-lg"
                    />
                  </div>
                  <div className="pt-2 border-t border-brand-border/60 text-center">
                    <span className="text-xl font-black text-brand-navy">
                      {content.statsSanction || '98.4'}
                      {content.statsSanctionSuffix || '%'}
                    </span>
                  </div>
                </div>

                {/* Stat 4: Turnaround */}
                <div className="p-4 bg-brand-ivory/50 rounded-xl border border-brand-border space-y-3">
                  <div className="flex items-center gap-2 text-brand-teal font-bold text-xs uppercase">
                    <Clock className="w-4 h-4" />
                    <span>Metric 4: Speed</span>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-brand-navy mb-1">
                      Counter Value
                    </label>
                    <input
                      type="text"
                      name="statsTurnaround"
                      value={content.statsTurnaround || ''}
                      onChange={handleChange}
                      placeholder="24"
                      className="w-full p-2 bg-white border border-brand-border rounded-lg font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-brand-navy mb-1">Suffix</label>
                    <input
                      type="text"
                      name="statsTurnaroundSuffix"
                      value={content.statsTurnaroundSuffix || ''}
                      onChange={handleChange}
                      placeholder="Hours"
                      className="w-full p-2 bg-white border border-brand-border rounded-lg font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-brand-navy mb-1">Label</label>
                    <input
                      type="text"
                      name="statsTurnaroundLabel"
                      value={content.statsTurnaroundLabel || ''}
                      onChange={handleChange}
                      placeholder="Turnaround Time"
                      className="w-full p-2 bg-white border border-brand-border rounded-lg"
                    />
                  </div>
                  <div className="pt-2 border-t border-brand-border/60 text-center">
                    <span className="text-xl font-black text-brand-navy">
                      {content.statsTurnaround || '24'} {content.statsTurnaroundSuffix || 'Hours'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. MULTI-LENDER RATE MATRIX */}
        {activeTab === 'rates' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl p-6 border border-brand-border shadow-subtle space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-brand-border">
                <div className="flex items-center gap-2 text-brand-navy">
                  <Landmark className="w-5 h-5 text-brand-teal" />
                  <div>
                    <h3 className="text-base font-bold">
                      Multi-Lender Rate Comparison Matrix ({rateMatrixItems.length} Banks)
                    </h3>
                    <p className="text-xs text-brand-slate">
                      Displayed live on the homepage rate comparison table for Home Loans and LAP.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setEditingRate({
                      id: '',
                      bankName: '',
                      homeLoanRate: '8.40% - 9.15%',
                      lapRate: '9.60% - 10.50%',
                      maxTenure: '30 Years',
                      processingFee: '0.35% + GST',
                      ltv: 'Up to 85%',
                      popularTag: '',
                    });
                    setRateModalOpen(true);
                  }}
                  className="px-3.5 py-2 bg-brand-teal hover:bg-brand-teal-hover text-white text-xs font-bold rounded-lg flex items-center gap-1.5 self-start"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Bank Rate Row</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-brand-ivory text-brand-navy border-b border-brand-border font-bold">
                      <th className="p-3">Bank / Lending Partner</th>
                      <th className="p-3">Home Loan Rate</th>
                      <th className="p-3">Mortgage (LAP) Rate</th>
                      <th className="p-3">Max Tenure</th>
                      <th className="p-3">Processing Fee</th>
                      <th className="p-3">Max LTV</th>
                      <th className="p-3">Tag / Highlight</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-border/60">
                    {rateMatrixItems.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 font-bold text-brand-navy">{item.bankName}</td>
                        <td className="p-3 text-emerald-700 font-semibold">{item.homeLoanRate}</td>
                        <td className="p-3 text-brand-navy">{item.lapRate}</td>
                        <td className="p-3 text-brand-slate">{item.maxTenure}</td>
                        <td className="p-3 text-brand-slate">{item.processingFee}</td>
                        <td className="p-3 text-brand-slate">{item.ltv}</td>
                        <td className="p-3">
                          {item.popularTag ? (
                            <span className="px-2 py-0.5 rounded bg-brand-teal-light text-brand-teal font-bold text-[10px]">
                              {item.popularTag}
                            </span>
                          ) : (
                            <span className="text-gray-300">-</span>
                          )}
                        </td>
                        <td className="p-3 text-right space-x-1">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingRate(item);
                              setRateModalOpen(true);
                            }}
                            className="p-1.5 hover:bg-brand-ivory text-brand-navy rounded"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteRateItem(item.id)}
                            className="p-1.5 hover:bg-red-50 text-red-600 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 5. PILLARS & PROCESS */}
        {activeTab === 'process' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Why Choose Us Pillars */}
            <div className="bg-white rounded-2xl p-6 border border-brand-border shadow-subtle space-y-5">
              <div className="pb-3 border-b border-brand-border text-brand-navy">
                <h3 className="text-base font-bold">Why Property Owners Choose Us (4 Pillars)</h3>
                <p className="text-xs text-brand-slate">
                  Featured on the Homepage highlighting advisory expertise and zero upfront fee policy.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1.5">
                    Section Main Title
                  </label>
                  <input
                    type="text"
                    name="whyChooseUsTitle"
                    value={content.whyChooseUsTitle || ''}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-brand-navy font-semibold focus:bg-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1.5">
                    Section Subtitle
                  </label>
                  <input
                    type="text"
                    name="whyChooseUsSubtitle"
                    value={content.whyChooseUsSubtitle || ''}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-brand-navy focus:bg-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {whyChooseUsPillars.map((pillar, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-brand-ivory/40 rounded-xl border border-brand-border space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-brand-teal uppercase tracking-wider text-[11px]">
                        Pillar #{idx + 1}
                      </span>
                      <input
                        type="text"
                        value={pillar.metric || ''}
                        onChange={(e) => {
                          const updated = [...whyChooseUsPillars];
                          updated[idx].metric = e.target.value;
                          setWhyChooseUsPillars(updated);
                        }}
                        placeholder="Metric tag (e.g. Save ₹3-8 Lakhs)"
                        className="px-2 py-1 bg-white border border-brand-border rounded text-[11px] font-bold text-emerald-700"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-brand-navy mb-1">
                        Pillar Title
                      </label>
                      <input
                        type="text"
                        value={pillar.title || ''}
                        onChange={(e) => {
                          const updated = [...whyChooseUsPillars];
                          updated[idx].title = e.target.value;
                          setWhyChooseUsPillars(updated);
                        }}
                        className="w-full p-2 bg-white border border-brand-border rounded font-bold text-brand-navy"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-brand-navy mb-1">
                        Description
                      </label>
                      <textarea
                        rows={2}
                        value={pillar.description || ''}
                        onChange={(e) => {
                          const updated = [...whyChooseUsPillars];
                          updated[idx].description = e.target.value;
                          setWhyChooseUsPillars(updated);
                        }}
                        className="w-full p-2 bg-white border border-brand-border rounded resize-none text-brand-slate"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Loan Process Steps */}
            <div className="bg-white rounded-2xl p-6 border border-brand-border shadow-subtle space-y-5">
              <div className="pb-3 border-b border-brand-border text-brand-navy">
                <h3 className="text-base font-bold">End-to-End Loan Facilitation Process (4 Steps)</h3>
                <p className="text-xs text-brand-slate">
                  Detailed roadmap explaining how a loan file is screened, syndicated, evaluated, and disbursed.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1.5">
                    Process Section Title
                  </label>
                  <input
                    type="text"
                    name="processTitle"
                    value={content.processTitle || ''}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-brand-navy font-semibold focus:bg-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1.5">
                    Process Subtitle
                  </label>
                  <input
                    type="text"
                    name="processSubtitle"
                    value={content.processSubtitle || ''}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-brand-navy focus:bg-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {processStepsList.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-brand-ivory/40 rounded-xl border border-brand-border space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-brand-navy text-sm">
                        Step {step.stepNumber}
                      </span>
                      <input
                        type="text"
                        value={step.turnaround || ''}
                        onChange={(e) => {
                          const updated = [...processStepsList];
                          updated[idx].turnaround = e.target.value;
                          setProcessStepsList(updated);
                        }}
                        placeholder="Timeline (e.g. Day 1–2)"
                        className="px-2 py-1 bg-white border border-brand-border rounded text-[11px] font-bold text-brand-teal"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-brand-navy mb-1">
                        Step Title
                      </label>
                      <input
                        type="text"
                        value={step.title || ''}
                        onChange={(e) => {
                          const updated = [...processStepsList];
                          updated[idx].title = e.target.value;
                          setProcessStepsList(updated);
                        }}
                        className="w-full p-2 bg-white border border-brand-border rounded font-bold text-brand-navy"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-brand-navy mb-1">
                        Step Description
                      </label>
                      <textarea
                        rows={2}
                        value={step.description || ''}
                        onChange={(e) => {
                          const updated = [...processStepsList];
                          updated[idx].description = e.target.value;
                          setProcessStepsList(updated);
                        }}
                        className="w-full p-2 bg-white border border-brand-border rounded resize-none text-brand-slate"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Document Checklist Manager */}
            <div className="bg-white rounded-2xl p-6 border border-brand-border shadow-subtle space-y-5">
              <div className="pb-3 border-b border-brand-border text-brand-navy">
                <h3 className="text-base font-bold">Document Checklist Guidelines</h3>
                <p className="text-xs text-brand-slate">
                  Items listed under the Salaried, Self-Employed, and Property document tabs.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                {/* Salaried */}
                <div className="p-4 bg-brand-ivory/50 rounded-xl border border-brand-border space-y-3">
                  <h4 className="font-bold text-brand-navy text-sm">Salaried Applicant Docs</h4>
                  <ul className="space-y-1.5 max-h-48 overflow-y-auto">
                    {salariedDocsList.map((doc, i) => (
                      <li
                        key={i}
                        className="flex items-center justify-between p-1.5 bg-white rounded border border-brand-border/60 text-[11px]"
                      >
                        <span className="truncate pr-2">{doc}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setSalariedDocsList(salariedDocsList.filter((_, idx) => idx !== i))
                          }
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-1.5 pt-2">
                    <input
                      type="text"
                      value={newSalariedDoc}
                      onChange={(e) => setNewSalariedDoc(e.target.value)}
                      placeholder="Add document item..."
                      className="flex-1 p-1.5 bg-white border border-brand-border rounded text-[11px]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newSalariedDoc.trim()) {
                          setSalariedDocsList([...salariedDocsList, newSalariedDoc.trim()]);
                          setNewSalariedDoc('');
                        }
                      }}
                      className="px-2 py-1 bg-brand-navy text-white rounded text-[11px] font-bold"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Self-Employed */}
                <div className="p-4 bg-brand-ivory/50 rounded-xl border border-brand-border space-y-3">
                  <h4 className="font-bold text-brand-navy text-sm">Self-Employed Docs</h4>
                  <ul className="space-y-1.5 max-h-48 overflow-y-auto">
                    {selfEmployedDocsList.map((doc, i) => (
                      <li
                        key={i}
                        className="flex items-center justify-between p-1.5 bg-white rounded border border-brand-border/60 text-[11px]"
                      >
                        <span className="truncate pr-2">{doc}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setSelfEmployedDocsList(
                              selfEmployedDocsList.filter((_, idx) => idx !== i)
                            )
                          }
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-1.5 pt-2">
                    <input
                      type="text"
                      value={newSelfEmployedDoc}
                      onChange={(e) => setNewSelfEmployedDoc(e.target.value)}
                      placeholder="Add document item..."
                      className="flex-1 p-1.5 bg-white border border-brand-border rounded text-[11px]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newSelfEmployedDoc.trim()) {
                          setSelfEmployedDocsList([
                            ...selfEmployedDocsList,
                            newSelfEmployedDoc.trim(),
                          ]);
                          setNewSelfEmployedDoc('');
                        }
                      }}
                      className="px-2 py-1 bg-brand-navy text-white rounded text-[11px] font-bold"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Property Docs */}
                <div className="p-4 bg-brand-ivory/50 rounded-xl border border-brand-border space-y-3">
                  <h4 className="font-bold text-brand-navy text-sm">Property Technical Docs</h4>
                  <ul className="space-y-1.5 max-h-48 overflow-y-auto">
                    {propertyDocsList.map((doc, i) => (
                      <li
                        key={i}
                        className="flex items-center justify-between p-1.5 bg-white rounded border border-brand-border/60 text-[11px]"
                      >
                        <span className="truncate pr-2">{doc}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setPropertyDocsList(propertyDocsList.filter((_, idx) => idx !== i))
                          }
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-1.5 pt-2">
                    <input
                      type="text"
                      value={newPropertyDoc}
                      onChange={(e) => setNewPropertyDoc(e.target.value)}
                      placeholder="Add document item..."
                      className="flex-1 p-1.5 bg-white border border-brand-border rounded text-[11px]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newPropertyDoc.trim()) {
                          setPropertyDocsList([...propertyDocsList, newPropertyDoc.trim()]);
                          setNewPropertyDoc('');
                        }
                      }}
                      className="px-2 py-1 bg-brand-navy text-white rounded text-[11px] font-bold"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 6. ABOUT US & LEADERSHIP TEAM */}
        {activeTab === 'about' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Story & Vision */}
            <div className="bg-white rounded-2xl p-6 border border-brand-border shadow-subtle space-y-5">
              <div className="pb-3 border-b border-brand-border text-brand-navy">
                <h3 className="text-base font-bold">About Us Story, Mission &amp; Vision</h3>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1.5">
                    About Page Main Heading
                  </label>
                  <input
                    type="text"
                    name="aboutHeading"
                    value={content.aboutHeading || ''}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-brand-navy font-bold focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1.5">
                    Full Advisory Description / Story
                  </label>
                  <textarea
                    rows={4}
                    name="aboutText"
                    value={content.aboutText || ''}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-brand-navy focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-brand-navy mb-1.5">
                      Mission Statement
                    </label>
                    <textarea
                      rows={3}
                      name="aboutMission"
                      value={content.aboutMission || ''}
                      onChange={handleChange}
                      className="w-full p-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-brand-navy focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-navy mb-1.5">
                      Vision Statement
                    </label>
                    <textarea
                      rows={3}
                      name="aboutVision"
                      value={content.aboutVision || ''}
                      onChange={handleChange}
                      className="w-full p-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-brand-navy focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1.5">
                    About Section Hero Image URL
                  </label>
                  <div className="flex gap-3 items-center">
                    <input
                      type="url"
                      name="aboutImageUrl"
                      value={content.aboutImageUrl || ''}
                      onChange={handleChange}
                      className="flex-1 p-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-brand-navy focus:bg-white text-xs"
                    />
                    {content.aboutImageUrl && (
                      <div className="w-16 h-10 rounded-lg overflow-hidden border border-brand-border flex-shrink-0 bg-slate-100">
                        <img
                          src={content.aboutImageUrl}
                          alt="About preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Leadership Team */}
            <div className="bg-white rounded-2xl p-6 border border-brand-border shadow-subtle space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-brand-border">
                <div>
                  <h3 className="text-base font-bold text-brand-navy">
                    Advisory Leadership &amp; Key Officers ({teamMembers.length} Members)
                  </h3>
                  <p className="text-xs text-brand-slate">
                    Displayed with photo, credentials, bio, and LinkedIn links on the About page.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setEditingMember({
                      id: '',
                      name: '',
                      role: '',
                      experience: '',
                      bio: '',
                      imageUrl:
                        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
                      linkedinUrl: 'https://linkedin.com',
                    });
                    setTeamModalOpen(true);
                  }}
                  className="px-3.5 py-2 bg-brand-teal hover:bg-brand-teal-hover text-white text-xs font-bold rounded-lg flex items-center gap-1.5 self-start"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Team Member</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="p-4 bg-brand-ivory/50 rounded-xl border border-brand-border flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            member.imageUrl ||
                            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
                          }
                          alt={member.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-brand-teal/40"
                        />
                        <div>
                          <h4 className="font-bold text-brand-navy text-sm">{member.name}</h4>
                          <span className="text-[11px] text-brand-teal font-semibold block">
                            {member.role}
                          </span>
                          <span className="text-[10px] text-brand-slate block">
                            {member.experience}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-brand-slate line-clamp-3 leading-relaxed">
                        {member.bio}
                      </p>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-brand-border/60">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingMember(member);
                          setTeamModalOpen(true);
                        }}
                        className="px-2.5 py-1 text-xs font-semibold text-brand-navy bg-white border border-brand-border rounded hover:bg-slate-50 flex items-center gap-1"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteTeamMember(member.id)}
                        className="px-2.5 py-1 text-xs font-semibold text-red-600 bg-white border border-red-200 rounded hover:bg-red-50 flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Milestones */}
            <div className="bg-white rounded-2xl p-6 border border-brand-border shadow-subtle space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-brand-border">
                <div>
                  <h3 className="text-base font-bold text-brand-navy">
                    Company Journey Milestones ({milestonesList.length})
                  </h3>
                  <p className="text-xs text-brand-slate">
                    Interactive timeline shown on the About page.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setEditingMilestone({
                      year: new Date().getFullYear().toString(),
                      title: '',
                      description: '',
                      stat: '',
                    });
                    setMilestoneModalOpen(true);
                  }}
                  className="px-3.5 py-2 bg-brand-navy hover:bg-brand-navy/90 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 self-start"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Milestone</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {milestonesList.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-brand-ivory/50 rounded-xl border border-brand-border space-y-2 text-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-black text-brand-teal">{m.year}</span>
                        {m.stat && (
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                            {m.stat}
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-brand-navy text-sm mt-1">{m.title}</h4>
                      <p className="text-brand-slate mt-1 line-clamp-3 leading-relaxed">
                        {m.description}
                      </p>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-brand-border/60">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingMilestone(m);
                          setMilestoneModalOpen(true);
                        }}
                        className="p-1 text-brand-navy hover:bg-slate-200 rounded"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteMilestone(m.year)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 7. CLIENT TESTIMONIALS */}
        {activeTab === 'testimonials' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl p-6 border border-brand-border shadow-subtle space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-brand-border">
                <div className="flex items-center gap-2 text-brand-navy">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                  <div>
                    <h3 className="text-base font-bold">
                      Client Reviews &amp; Success Stories ({testimonialsList.length})
                    </h3>
                    <p className="text-xs text-brand-slate">
                      Infinite marquee testimonials carousel on the homepage.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setEditingTestimonial({
                      id: '',
                      name: '',
                      location: 'Tirupur',
                      loanType: 'Home Loan',
                      amount: '₹50 Lakhs',
                      rating: 5,
                      review: '',
                      avatarUrl:
                        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
                    });
                    setTestimonialModalOpen(true);
                  }}
                  className="px-3.5 py-2 bg-brand-teal hover:bg-brand-teal-hover text-white text-xs font-bold rounded-lg flex items-center gap-1.5 self-start"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Client Review</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {testimonialsList.map((testi) => (
                  <div
                    key={testi.id}
                    className="p-4 bg-brand-ivory/50 rounded-xl border border-brand-border flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-amber-500">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < (testi.rating || 5)
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[11px] font-bold text-brand-teal bg-brand-teal-light px-2 py-0.5 rounded">
                          {testi.amount}
                        </span>
                      </div>

                      <p className="text-xs text-brand-navy/90 italic leading-relaxed line-clamp-4">
                        "{testi.review}"
                      </p>

                      <div className="flex items-center gap-2.5 pt-2 border-t border-brand-border/60">
                        {testi.avatarUrl ? (
                          <img
                            src={testi.avatarUrl}
                            alt={testi.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-brand-teal text-white flex items-center justify-center font-bold text-xs">
                            {testi.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-bold text-xs text-brand-navy">{testi.name}</h4>
                            {testi.verified && (
                              <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded-full border border-emerald-200">
                                Verified Client
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-brand-slate">
                            {testi.location} • {testi.loanType}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-brand-border/60">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingTestimonial(testi);
                          setTestimonialModalOpen(true);
                        }}
                        className="px-2.5 py-1 text-xs font-semibold text-brand-navy bg-white border border-brand-border rounded hover:bg-slate-50 flex items-center gap-1"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteTestimonialItem(testi.id)}
                        className="px-2.5 py-1 text-xs font-semibold text-red-600 bg-white border border-red-200 rounded hover:bg-red-50 flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 8. CONTACT & BRANCH OFFICES */}
        {activeTab === 'branches' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Contact Hero */}
            <div className="bg-white rounded-2xl p-6 border border-brand-border shadow-subtle space-y-4">
              <div className="pb-3 border-b border-brand-border text-brand-navy">
                <h3 className="text-base font-bold">Contact Page Hero &amp; Photography</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1.5">
                    Contact Hero Headline
                  </label>
                  <input
                    type="text"
                    name="contactHeroTitle"
                    value={content.contactHeroTitle || ''}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-brand-navy font-semibold focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1.5">
                    Contact Hero Subtitle
                  </label>
                  <input
                    type="text"
                    name="contactHeroSubtitle"
                    value={content.contactHeroSubtitle || ''}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-brand-navy focus:bg-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-brand-navy mb-1.5">
                    Contact Hero Image URL
                  </label>
                  <input
                    type="url"
                    name="contactHeroImageUrl"
                    value={content.contactHeroImageUrl || ''}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-brand-navy focus:bg-white text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Branch Offices */}
            <div className="bg-white rounded-2xl p-6 border border-brand-border shadow-subtle space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-brand-border">
                <div className="flex items-center gap-2 text-brand-navy">
                  <MapPin className="w-5 h-5 text-brand-teal" />
                  <div>
                    <h3 className="text-base font-bold">
                      Physical Branch &amp; Regional Offices ({branchOfficesList.length})
                    </h3>
                    <p className="text-xs text-brand-slate">
                      Users can view addresses, book in-person visits, or tap for directions.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setEditingBranch({
                      id: '',
                      name: '',
                      address: '',
                      phone: '+91 96555 66613',
                      email: 'primeassociates2008@gmail.com',
                      timings: 'Monday – Saturday: 9:30 AM – 6:30 PM',
                      mapEmbedUrl: 'https://maps.google.com/?q=Prime+Associates+Tirupur',
                    });
                    setBranchModalOpen(true);
                  }}
                  className="px-3.5 py-2 bg-brand-teal hover:bg-brand-teal-hover text-white text-xs font-bold rounded-lg flex items-center gap-1.5 self-start"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Branch Office</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {branchOfficesList.map((branch) => (
                  <div
                    key={branch.id}
                    className="p-5 bg-brand-ivory/50 rounded-xl border border-brand-border flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-brand-navy text-sm">{branch.name}</h4>
                        <span className="text-[10px] font-bold text-brand-teal bg-brand-teal-light px-2 py-0.5 rounded">
                          Active Branch
                        </span>
                      </div>
                      <p className="text-xs text-brand-slate flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-brand-teal mt-0.5 flex-shrink-0" />
                        <span>{branch.address}</span>
                      </p>
                      <p className="text-xs text-brand-slate flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-brand-teal flex-shrink-0" />
                        <span>{branch.phone}</span>
                      </p>
                      <p className="text-xs text-brand-slate flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-brand-teal flex-shrink-0" />
                        <span>{branch.email}</span>
                      </p>
                      {branch.timings && (
                        <p className="text-xs text-brand-slate flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-brand-teal flex-shrink-0" />
                          <span>{branch.timings}</span>
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-brand-border/60">
                      {branch.mapEmbedUrl ? (
                        <a
                          href={branch.mapEmbedUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-brand-teal hover:underline flex items-center gap-1 font-semibold"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>View on Map</span>
                        </a>
                      ) : (
                        <span />
                      )}
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingBranch(branch);
                            setBranchModalOpen(true);
                          }}
                          className="p-1.5 text-brand-navy hover:bg-slate-200 rounded"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteBranch(branch.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 09. LOAN SERVICES & REQUIRED DOCUMENT CHECKLISTS */}
        {activeTab === 'loan-docs' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header Card */}
            <div className="bg-white rounded-2xl p-6 border border-brand-border shadow-subtle space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200 shrink-0">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[#0c1a26] font-heading">
                      Loan Services &amp; Required Document Checklists
                    </h3>
                    <p className="text-xs text-brand-slate font-sans mt-0.5">
                      Configure the official document requirements and loan files displayed across Home Loans, Mortgage (LAP), Property Funding, and Consultation pages.
                    </p>
                  </div>
                </div>

                <a
                  href="/services/home-loans#documents"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl transition-colors shrink-0 self-start sm:self-auto font-heading"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview on Loan Service Page</span>
                  <ExternalLink className="w-3 h-3 text-teal-500" />
                </a>
              </div>

              {/* Sub-Tab Switcher */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {[
                  {
                    id: 'salaried',
                    label: 'Salaried Applicants',
                    icon: <User className="w-4 h-4" />,
                    count: salariedDocsList.length,
                    badge: 'Form 16 & Salary Slips',
                  },
                  {
                    id: 'selfEmployed',
                    label: 'Self-Employed / Business',
                    icon: <Building className="w-4 h-4" />,
                    count: selfEmployedDocsList.length,
                    badge: 'ITR, Balance Sheet & GST',
                  },
                  {
                    id: 'property',
                    label: 'Property Title Deeds & Approvals',
                    icon: <Landmark className="w-4 h-4" />,
                    count: propertyDocsList.length,
                    badge: 'Patta, EC & Blueprint Plans',
                  },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setLoanDocTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold font-heading transition-all cursor-pointer ${
                      loanDocTab === tab.id
                        ? 'bg-[#0c1a26] text-white border-[#0c1a26] shadow-sm ring-2 ring-teal-500/20'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                        loanDocTab === tab.id ? 'bg-teal-500 text-white' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* ─── TAB 1: SALARIED APPLICANTS CHECKLIST ─── */}
              {loanDocTab === 'salaried' && (
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 font-heading">
                        Salaried Borrower Loan File Checklist
                      </h4>
                      <p className="text-xs text-slate-500">
                        Required income, taxation, and KYC papers for corporate, IT, and government employees.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={resetSalariedDocsToDefault}
                      className="text-xs font-bold text-slate-500 hover:text-teal-700 hover:underline flex items-center gap-1 cursor-pointer"
                      title="Reset to institutional banking standard checklist"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Standard List</span>
                    </button>
                  </div>

                  {/* Add New Document Input Bar */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newSalariedDoc}
                      onChange={(e) => setNewSalariedDoc(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addSalariedDoc();
                        }
                      }}
                      placeholder="Add new required document for salaried borrowers (e.g. Form 16, Offer Letter)..."
                      className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-[#0c1a26] focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-sans"
                    />
                    <button
                      type="button"
                      onClick={addSalariedDoc}
                      className="px-4 py-2.5 bg-[#0c1a26] hover:bg-teal-700 text-white rounded-xl text-xs font-bold font-heading inline-flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add File</span>
                    </button>
                  </div>

                  {/* List of Documents */}
                  <div className="space-y-2 pt-1">
                    {salariedDocsList.map((doc, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/90 flex items-center justify-between gap-3 hover:bg-white hover:border-teal-300 transition-all group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="w-6 h-6 rounded-lg bg-teal-50 text-teal-800 text-[11px] font-mono font-bold flex items-center justify-center shrink-0 border border-teal-200/70">
                            {idx + 1}
                          </span>
                          <span className="text-xs sm:text-sm font-semibold text-slate-800 font-sans truncate">
                            {doc}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-md font-heading">
                            Salaried File
                          </span>
                          <button
                            type="button"
                            onClick={() => removeSalariedDoc(idx)}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                            title="Remove document requirement"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ─── TAB 2: SELF-EMPLOYED APPLICANTS CHECKLIST ─── */}
              {loanDocTab === 'selfEmployed' && (
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 font-heading">
                        Self-Employed &amp; Business Loan File Checklist
                      </h4>
                      <p className="text-xs text-slate-500">
                        Required GST, audited financial statements, and business continuity records for business proprietors &amp; MSMEs.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={resetSelfEmployedDocsToDefault}
                      className="text-xs font-bold text-slate-500 hover:text-teal-700 hover:underline flex items-center gap-1 cursor-pointer"
                      title="Reset to institutional banking standard checklist"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Standard List</span>
                    </button>
                  </div>

                  {/* Add New Document Input Bar */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newSelfEmployedDoc}
                      onChange={(e) => setNewSelfEmployedDoc(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addSelfEmployedDoc();
                        }
                      }}
                      placeholder="Add new required document for business owners (e.g. Audit Report, GST 3B, Udyam)..."
                      className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-[#0c1a26] focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-sans"
                    />
                    <button
                      type="button"
                      onClick={addSelfEmployedDoc}
                      className="px-4 py-2.5 bg-[#0c1a26] hover:bg-teal-700 text-white rounded-xl text-xs font-bold font-heading inline-flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add File</span>
                    </button>
                  </div>

                  {/* List of Documents */}
                  <div className="space-y-2 pt-1">
                    {selfEmployedDocsList.map((doc, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/90 flex items-center justify-between gap-3 hover:bg-white hover:border-teal-300 transition-all group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="w-6 h-6 rounded-lg bg-teal-50 text-teal-800 text-[11px] font-mono font-bold flex items-center justify-center shrink-0 border border-teal-200/70">
                            {idx + 1}
                          </span>
                          <span className="text-xs sm:text-sm font-semibold text-slate-800 font-sans truncate">
                            {doc}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md font-heading">
                            Business / ITR
                          </span>
                          <button
                            type="button"
                            onClick={() => removeSelfEmployedDoc(idx)}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                            title="Remove document requirement"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ─── TAB 3: PROPERTY TITLE DEEDS CHECKLIST ─── */}
              {loanDocTab === 'property' && (
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 font-heading">
                        Property Title Deeds &amp; Technical Approvals Checklist
                      </h4>
                      <p className="text-xs text-slate-500">
                        Essential land ownership, parent deeds, revenue records, and building approvals required by bank legal panels.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={resetPropertyDocsToDefault}
                      className="text-xs font-bold text-slate-500 hover:text-teal-700 hover:underline flex items-center gap-1 cursor-pointer"
                      title="Reset to institutional banking standard checklist"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Standard List</span>
                    </button>
                  </div>

                  {/* Add New Document Input Bar */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newPropertyDoc}
                      onChange={(e) => setNewPropertyDoc(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addPropertyDoc();
                        }
                      }}
                      placeholder="Add new title deed or technical approval (e.g. EC 30 Years, Patta, DTCP Plan)..."
                      className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-[#0c1a26] focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-sans"
                    />
                    <button
                      type="button"
                      onClick={addPropertyDoc}
                      className="px-4 py-2.5 bg-[#0c1a26] hover:bg-teal-700 text-white rounded-xl text-xs font-bold font-heading inline-flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add File</span>
                    </button>
                  </div>

                  {/* List of Documents */}
                  <div className="space-y-2 pt-1">
                    {propertyDocsList.map((doc, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/90 flex items-center justify-between gap-3 hover:bg-white hover:border-teal-300 transition-all group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="w-6 h-6 rounded-lg bg-teal-50 text-teal-800 text-[11px] font-mono font-bold flex items-center justify-center shrink-0 border border-teal-200/70">
                            {idx + 1}
                          </span>
                          <span className="text-xs sm:text-sm font-semibold text-slate-800 font-sans truncate">
                            {doc}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md font-heading">
                            Legal Deed
                          </span>
                          <button
                            type="button"
                            onClick={() => removePropertyDoc(idx)}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                            title="Remove document requirement"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Informational Guidance Callout */}
              <div className="p-3.5 bg-gradient-to-r from-teal-50/70 to-slate-50 rounded-xl border border-teal-100 flex items-start gap-2.5 text-xs text-slate-600">
                <Sparkles className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Live Synchronization:</strong> Changes saved here appear directly on public loan service pages (Home Loans, Loan Against Property, Property Funding, Vehicle Loans), the EMI Calculator page, and inside borrower consultation confirmation emails.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 10. CALCULATOR BENCHMARKS */}
        {activeTab === 'calculator' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl p-6 border border-brand-border shadow-subtle space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-brand-border text-brand-navy">
                <Calculator className="w-5 h-5 text-brand-teal" />
                <div>
                  <h3 className="text-base font-bold">EMI &amp; FOIR Calculator Defaults</h3>
                  <p className="text-xs text-brand-slate">
                    Set default starting interest rates and tenures when users open the calculator.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1.5">
                    Default Home Loan Interest Rate (% p.a.)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    name="calcDefaultHomeRate"
                    value={content.calcDefaultHomeRate ?? 7.25}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-brand-navy font-bold focus:bg-white"
                  />
                  <span className="text-[11px] text-brand-slate mt-1 block">
                    Public default: 7.25% p.a.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1.5">
                    Default LAP (Mortgage) Interest Rate (% p.a.)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    name="calcDefaultLapRate"
                    value={content.calcDefaultLapRate ?? 8.5}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-brand-navy font-bold focus:bg-white"
                  />
                  <span className="text-[11px] text-brand-slate mt-1 block">
                    Public default: 8.50% p.a.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1.5">
                    Default Loan Amount (₹ INR)
                  </label>
                  <input
                    type="number"
                    step="100000"
                    name="calcDefaultAmount"
                    value={content.calcDefaultAmount ?? 5000000}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-brand-navy font-bold focus:bg-white"
                  />
                  <span className="text-[11px] text-brand-slate mt-1 block">
                    Default preset: ₹50,00,000 (50 Lakhs)
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1.5">
                    Default Repayment Tenure (Years)
                  </label>
                  <input
                    type="number"
                    name="calcDefaultTenure"
                    value={content.calcDefaultTenure ?? 20}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-brand-navy font-bold focus:bg-white"
                  />
                  <span className="text-[11px] text-brand-slate mt-1 block">
                    Default preset: 20 Years
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 10. LEGAL & COMPLIANCE */}
        {activeTab === 'legal' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl p-6 border border-brand-border shadow-subtle space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-brand-border text-brand-navy">
                <ShieldCheck className="w-5 h-5 text-brand-teal" />
                <div>
                  <h3 className="text-base font-bold">Compliance, Privacy &amp; Legal Disclaimers</h3>
                  <p className="text-xs text-brand-slate">
                    Mandatory regulatory language displayed across footers, consent checkboxes, and dedicated policy pages.
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1.5">
                    Official Regulatory Disclaimer (Prominently displayed in footer &amp; forms)
                  </label>
                  <textarea
                    rows={4}
                    name="disclaimerText"
                    value={content.disclaimerText || ''}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-brand-navy focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1.5">
                    Privacy Policy Statement (Data confidentiality &amp; KYC handling)
                  </label>
                  <textarea
                    rows={4}
                    name="privacyPolicy"
                    value={content.privacyPolicy || ''}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-brand-navy focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1.5">
                    Terms &amp; Conditions of Service (Advisory scope &amp; bank discretion)
                  </label>
                  <textarea
                    rows={4}
                    name="termsConditions"
                    value={content.termsConditions || ''}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-brand-navy focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1.5">
                    Copyright Notice (Footer baseline)
                  </label>
                  <input
                    type="text"
                    name="copyrightText"
                    value={content.copyrightText || ''}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-brand-navy focus:bg-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 11. GLOBAL FOOTER MANAGEMENT */}
        {activeTab === 'footer' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Main Footer Content Editor */}
            <div className="bg-white rounded-2xl p-6 border border-brand-border shadow-subtle space-y-6">
              <div className="flex items-center gap-2 pb-3 border-b border-brand-border text-brand-navy">
                <Globe className="w-5 h-5 text-brand-teal" />
                <div>
                  <h3 className="text-base font-bold">Site-wide Footer &amp; Corporate Advisory Hub</h3>
                  <p className="text-xs text-brand-slate">
                    Manage the global footer content displayed across every public page (Home, Loans, Calculator, FAQs, About, Contact).
                  </p>
                </div>
              </div>

              <div className="space-y-5 text-xs sm:text-sm">
                {/* Brand Mission */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-brand-navy">
                      Brand Mission Statement / Tagline (Under Logo)
                    </label>
                    <span className="text-[11px] text-slate-400 font-medium">Column 1 summary paragraph</span>
                  </div>
                  <textarea
                    rows={3}
                    name="tagline"
                    value={content.tagline || ''}
                    onChange={handleChange}
                    placeholder="Get your home loans and mortgage loans at lowest interest rates with government subsidy across government and private banks..."
                    className="w-full p-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-brand-navy focus:bg-white leading-relaxed"
                  />
                </div>

                {/* Consultation Ethics */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-brand-navy">
                      Consultation Ethics &amp; Lending Disclosure (Column 4)
                    </label>
                    <span className="text-[11px] text-slate-400 font-medium">Compliance assurance note</span>
                  </div>
                  <textarea
                    rows={3}
                    name="registrationDetails"
                    value={content.registrationDetails || ''}
                    onChange={handleChange}
                    placeholder="We uphold responsible lending guidelines. We do not guarantee loan approvals, charge unverified upfront sanction fees, or mislead applicants regarding terms."
                    className="w-full p-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-brand-navy focus:bg-white leading-relaxed"
                  />
                </div>

                {/* Office Contact Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-brand-navy mb-1.5">
                      Main Advisory Office Postal Address
                    </label>
                    <input
                      type="text"
                      name="officeAddress"
                      value={content.officeAddress || ''}
                      onChange={handleChange}
                      placeholder="No. 48, 49, P.R. Complex, Binny Compound Main Street, Kumaran Road, Tirupur - 641601"
                      className="w-full p-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-brand-navy focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-navy mb-1.5">
                      Customer Helpline Phone Numbers (Comma-separated for multiple)
                    </label>
                    <input
                      type="text"
                      name="businessPhone"
                      value={content.businessPhone || ''}
                      onChange={handleChange}
                      placeholder="+91 96555 66613, +91 95144 66600"
                      className="w-full p-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-brand-navy focus:bg-white"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">Each phone number becomes clickable to dial directly.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-navy mb-1.5">
                      Official Customer Support Email
                    </label>
                    <input
                      type="email"
                      name="businessEmail"
                      value={content.businessEmail || ''}
                      onChange={handleChange}
                      placeholder="primeassociates2008@gmail.com"
                      className="w-full p-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-brand-navy focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-navy mb-1.5">
                      Working &amp; Consultation Hours
                    </label>
                    <input
                      type="text"
                      name="businessHours"
                      value={content.businessHours || ''}
                      onChange={handleChange}
                      placeholder="Monday – Saturday: 9:30 AM – 6:30 PM (IST)"
                      className="w-full p-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-brand-navy focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-navy mb-1.5">
                      Copyright Notice (Bottom Baseline)
                    </label>
                    <input
                      type="text"
                      name="copyrightText"
                      value={content.copyrightText || ''}
                      onChange={handleChange}
                      placeholder="Prime Associates — Loans & Constructions. All rights reserved."
                      className="w-full p-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-brand-navy focus:bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Social Channels Configurator */}
            <div className="bg-white rounded-2xl p-6 border border-brand-border shadow-subtle space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-brand-border text-brand-navy">
                <Compass className="w-5 h-5 text-brand-teal" />
                <div>
                  <h3 className="text-base font-bold">Footer Social Links &amp; Map Coordinates</h3>
                  <p className="text-xs text-brand-slate">
                    Social icons appear automatically in Column 1 when URLs are filled in.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1.5">
                    Facebook Page URL
                  </label>
                  <input
                    type="url"
                    value={socialLinksState.facebook || ''}
                    onChange={(e) =>
                      setSocialLinksState({ ...socialLinksState, facebook: e.target.value })
                    }
                    placeholder="https://facebook.com/primeassociates"
                    className="w-full p-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-brand-navy focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1.5">
                    Instagram Profile URL
                  </label>
                  <input
                    type="url"
                    value={socialLinksState.instagram || ''}
                    onChange={(e) =>
                      setSocialLinksState({ ...socialLinksState, instagram: e.target.value })
                    }
                    placeholder="https://instagram.com/primeassociates"
                    className="w-full p-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-brand-navy focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1.5">
                    LinkedIn Company Page
                  </label>
                  <input
                    type="url"
                    value={socialLinksState.linkedin || ''}
                    onChange={(e) =>
                      setSocialLinksState({ ...socialLinksState, linkedin: e.target.value })
                    }
                    placeholder="https://linkedin.com/company/primeassociates"
                    className="w-full p-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-brand-navy focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-navy mb-1.5">
                    Google Maps Pin Location URL
                  </label>
                  <input
                    type="url"
                    value={socialLinksState.mapUrl || ''}
                    onChange={(e) =>
                      setSocialLinksState({ ...socialLinksState, mapUrl: e.target.value })
                    }
                    placeholder="https://maps.google.com/?q=..."
                    className="w-full p-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-brand-navy focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Live Interactive Footer Preview Box */}
            <div className="bg-[#183247] text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-white/10 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-brand-teal" />
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-teal-light font-heading">
                    Live Footer Preview
                  </span>
                </div>
                <span className="text-[11px] text-gray-400 bg-white/5 px-2.5 py-1 rounded-md">
                  Renders in real-time as you type
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs text-gray-300">
                {/* Column 1 */}
                <div className="space-y-3">
                  <div className="font-heading font-black text-white text-base tracking-tight">
                    {content.businessName || 'Prime Associates — Loans & Constructions'}
                  </div>
                  <p className="leading-relaxed line-clamp-4">
                    {content.tagline ||
                      'Get your home loans and mortgage loans at lowest interest rates with government subsidy across government and private banks.'}
                  </p>
                  <div className="flex items-center gap-2 pt-1 text-brand-teal-light">
                    {socialLinksState.facebook && <span className="bg-white/10 px-2 py-0.5 rounded">Facebook</span>}
                    {socialLinksState.instagram && <span className="bg-white/10 px-2 py-0.5 rounded">Instagram</span>}
                    {socialLinksState.linkedin && <span className="bg-white/10 px-2 py-0.5 rounded">LinkedIn</span>}
                    {socialLinksState.mapUrl && <span className="bg-white/10 px-2 py-0.5 rounded">Maps Pin</span>}
                  </div>
                </div>

                {/* Column 2 */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-brand-teal-light mb-3">
                    Loan Solutions
                  </h4>
                  <ul className="space-y-1.5 text-gray-300">
                    <li>• Home Loans &amp; Construction</li>
                    <li>• Mortgage Loans (LAP)</li>
                    <li>• Purchase Loans &amp; Commercial</li>
                    <li>• Vehicle Loans &amp; Takeover</li>
                    <li>• Knowledge Base &amp; FAQs</li>
                  </ul>
                </div>

                {/* Column 3 */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-brand-teal-light mb-3">
                    Advisory Office
                  </h4>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-brand-teal mt-0.5 shrink-0" />
                      <span className="line-clamp-2">{content.officeAddress || 'No. 48, 49, P.R. Complex, Binny Compound...'}</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-brand-teal mt-0.5 shrink-0" />
                      <span>{content.businessPhone || '+91 96555 66613'}</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-brand-teal mt-0.5 shrink-0" />
                      <span>{content.businessEmail || 'primeassociates2008@gmail.com'}</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-brand-teal mt-0.5 shrink-0" />
                      <span>{content.businessHours || 'Mon – Sat: 9:30 AM – 6:30 PM'}</span>
                    </li>
                  </ul>
                </div>

                {/* Column 4 */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-brand-teal-light mb-3">
                    Consultation Ethics
                  </h4>
                  <p className="text-[11px] leading-relaxed text-gray-300 mb-3 line-clamp-4">
                    {content.registrationDetails ||
                      'We uphold responsible lending guidelines. We do not guarantee loan approvals, charge unverified upfront sanction fees, or mislead applicants regarding terms.'}
                  </p>
                  <div className="py-1.5 px-3 bg-brand-teal text-white text-[11px] font-bold rounded text-center">
                    Schedule an Assessment
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-400 gap-2">
                <div>&copy; {new Date().getFullYear()} {content.copyrightText || 'Prime Associates — Loans & Constructions. All rights reserved.'}</div>
                <div className="flex gap-4">
                  <span>Privacy Policy</span>
                  <span>Terms &amp; Disclaimers</span>
                  <span>Admin Access</span>
                </div>
              </div>
            </div>
          </div>
        )}
          </div>

          {/* ─── BOTTOM SAVE BAR FOR DEDICATED SECTION ─── */}
          <div className="sticky bottom-1 z-20 bg-white/95 backdrop-blur-md py-2.5 px-3.5 sm:px-4 rounded-xl border border-slate-200 shadow-md flex flex-col sm:flex-row items-center justify-between gap-3 font-sans mt-3">
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => selectModule(null)}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold font-heading inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>All Modules</span>
              </button>
              {prevModule && (
                <button
                  type="button"
                  onClick={() => selectModule(prevModule.id)}
                  className="px-2.5 sm:px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold font-heading inline-flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Prev: {prevModule.title.split(' ')[0]}</span>
                </button>
              )}
              {nextModule && (
                <button
                  type="button"
                  onClick={() => selectModule(nextModule.id)}
                  className="px-2.5 sm:px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold font-heading inline-flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span className="hidden sm:inline">Next: {nextModule.title.split(' ')[0]}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
              <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-500">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Unsaved edits remain in draft until published.</span>
              </div>

              <button
                type="button"
                onClick={() => handleSaveAll()}
                disabled={saving}
                className="w-full sm:w-auto justify-center px-5 py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 disabled:opacity-50 text-white font-extrabold text-xs font-heading rounded-xl shadow-xs flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save &amp; Publish Website Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: RATE MATRIX ROW ─── */}
      {rateModalOpen && editingRate && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-brand-border shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-brand-border">
              <h3 className="font-bold text-brand-navy text-sm sm:text-base">
                {editingRate.id ? 'Edit Bank Rate Row' : 'Add New Bank Rate Row'}
              </h3>
              <button
                onClick={() => setRateModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-brand-navy mb-1">Bank / Institution Name</label>
                <input
                  type="text"
                  value={editingRate.bankName}
                  onChange={(e) => setEditingRate({ ...editingRate, bankName: e.target.value })}
                  placeholder="e.g. State Bank of India (SBI)"
                  className="w-full p-2 border border-brand-border rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-brand-navy mb-1">Home Loan Rate</label>
                  <input
                    type="text"
                    value={editingRate.homeLoanRate}
                    onChange={(e) =>
                      setEditingRate({ ...editingRate, homeLoanRate: e.target.value })
                    }
                    placeholder="8.40% - 9.15%"
                    className="w-full p-2 border border-brand-border rounded"
                  />
                </div>
                <div>
                  <label className="block font-bold text-brand-navy mb-1">Mortgage (LAP) Rate</label>
                  <input
                    type="text"
                    value={editingRate.lapRate}
                    onChange={(e) => setEditingRate({ ...editingRate, lapRate: e.target.value })}
                    placeholder="9.60% - 10.50%"
                    className="w-full p-2 border border-brand-border rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-brand-navy mb-1">Max Tenure</label>
                  <input
                    type="text"
                    value={editingRate.maxTenure}
                    onChange={(e) => setEditingRate({ ...editingRate, maxTenure: e.target.value })}
                    placeholder="30 Years"
                    className="w-full p-2 border border-brand-border rounded"
                  />
                </div>
                <div>
                  <label className="block font-bold text-brand-navy mb-1">Max Funding LTV</label>
                  <input
                    type="text"
                    value={editingRate.ltv}
                    onChange={(e) => setEditingRate({ ...editingRate, ltv: e.target.value })}
                    placeholder="Up to 85%"
                    className="w-full p-2 border border-brand-border rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-brand-navy mb-1">Processing Fee</label>
                  <input
                    type="text"
                    value={editingRate.processingFee}
                    onChange={(e) =>
                      setEditingRate({ ...editingRate, processingFee: e.target.value })
                    }
                    placeholder="0.35% + GST"
                    className="w-full p-2 border border-brand-border rounded"
                  />
                </div>
                <div>
                  <label className="block font-bold text-brand-navy mb-1">Popular Tag (Badge)</label>
                  <input
                    type="text"
                    value={editingRate.popularTag || ''}
                    onChange={(e) =>
                      setEditingRate({ ...editingRate, popularTag: e.target.value })
                    }
                    placeholder="e.g. Most Popular PSU"
                    className="w-full p-2 border border-brand-border rounded"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-brand-border">
              <button
                type="button"
                onClick={() => setRateModalOpen(false)}
                className="px-4 py-2 border border-brand-border rounded text-xs font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => saveRateItem(editingRate)}
                className="px-4 py-2 bg-brand-teal text-white rounded text-xs font-bold hover:bg-brand-teal-hover"
              >
                Save Bank Row
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: TESTIMONIAL ─── */}
      {testimonialModalOpen && editingTestimonial && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-brand-border shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-brand-border">
              <h3 className="font-bold text-brand-navy text-sm sm:text-base">
                {editingTestimonial.id ? 'Edit Client Review' : 'Add Client Review'}
              </h3>
              <button
                onClick={() => setTestimonialModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-brand-navy mb-1">Client Full Name</label>
                  <input
                    type="text"
                    value={editingTestimonial.name}
                    onChange={(e) =>
                      setEditingTestimonial({ ...editingTestimonial, name: e.target.value })
                    }
                    placeholder="e.g. K. Rangarajan"
                    className="w-full p-2 border border-brand-border rounded"
                  />
                </div>
                <div>
                  <label className="block font-bold text-brand-navy mb-1">Location / City</label>
                  <input
                    type="text"
                    value={editingTestimonial.location}
                    onChange={(e) =>
                      setEditingTestimonial({ ...editingTestimonial, location: e.target.value })
                    }
                    placeholder="Tirupur"
                    className="w-full p-2 border border-brand-border rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-brand-navy mb-1">Loan Type</label>
                  <input
                    type="text"
                    value={editingTestimonial.loanType}
                    onChange={(e) =>
                      setEditingTestimonial({ ...editingTestimonial, loanType: e.target.value })
                    }
                    placeholder="Home Loan"
                    className="w-full p-2 border border-brand-border rounded"
                  />
                </div>
                <div>
                  <label className="block font-bold text-brand-navy mb-1">Sanctioned Amount</label>
                  <input
                    type="text"
                    value={editingTestimonial.amount}
                    onChange={(e) =>
                      setEditingTestimonial({ ...editingTestimonial, amount: e.target.value })
                    }
                    placeholder="₹65 Lakhs"
                    className="w-full p-2 border border-brand-border rounded"
                  />
                </div>
                <div>
                  <label className="block font-bold text-brand-navy mb-1">Star Rating (1-5)</label>
                  <select
                    value={editingTestimonial.rating}
                    onChange={(e) =>
                      setEditingTestimonial({
                        ...editingTestimonial,
                        rating: parseInt(e.target.value) || 5,
                      })
                    }
                    className="w-full p-2 border border-brand-border rounded"
                  >
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-brand-navy mb-1">Client Review / Story</label>
                <textarea
                  rows={4}
                  value={editingTestimonial.review}
                  onChange={(e) =>
                    setEditingTestimonial({ ...editingTestimonial, review: e.target.value })
                  }
                  placeholder="Share the customer's experience and how Prime Associates assisted them..."
                  className="w-full p-2 border border-brand-border rounded"
                />
              </div>

              <div>
                <label className="block font-bold text-brand-navy mb-1">Avatar / Photo URL</label>
                <input
                  type="url"
                  value={editingTestimonial.avatarUrl || ''}
                  onChange={(e) =>
                    setEditingTestimonial({ ...editingTestimonial, avatarUrl: e.target.value })
                  }
                  className="w-full p-2 border border-brand-border rounded"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-brand-border">
              <button
                type="button"
                onClick={() => setTestimonialModalOpen(false)}
                className="px-4 py-2 border border-brand-border rounded text-xs font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => saveTestimonialItem(editingTestimonial)}
                className="px-4 py-2 bg-brand-teal text-white rounded text-xs font-bold hover:bg-brand-teal-hover"
              >
                Save Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: TEAM MEMBER ─── */}
      {teamModalOpen && editingMember && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-brand-border shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-brand-border">
              <h3 className="font-bold text-brand-navy text-sm sm:text-base">
                {editingMember.id ? 'Edit Team Member' : 'Add Team Member'}
              </h3>
              <button
                onClick={() => setTeamModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-brand-navy mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editingMember.name}
                    onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                    className="w-full p-2 border border-brand-border rounded"
                  />
                </div>
                <div>
                  <label className="block font-bold text-brand-navy mb-1">
                    Designation / Title
                  </label>
                  <input
                    type="text"
                    value={editingMember.role}
                    onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                    className="w-full p-2 border border-brand-border rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-brand-navy mb-1">
                  Years of Experience &amp; Credentials
                </label>
                <input
                  type="text"
                  value={editingMember.experience}
                  onChange={(e) =>
                    setEditingMember({ ...editingMember, experience: e.target.value })
                  }
                  placeholder="e.g. 18+ Years Banking Practice"
                  className="w-full p-2 border border-brand-border rounded"
                />
              </div>

              <div>
                <label className="block font-bold text-brand-navy mb-1">
                  Professional Biography
                </label>
                <textarea
                  rows={3}
                  value={editingMember.bio}
                  onChange={(e) => setEditingMember({ ...editingMember, bio: e.target.value })}
                  className="w-full p-2 border border-brand-border rounded"
                />
              </div>

              <div>
                <label className="block font-bold text-brand-navy mb-1">Profile Photo URL</label>
                <input
                  type="url"
                  value={editingMember.imageUrl || ''}
                  onChange={(e) =>
                    setEditingMember({ ...editingMember, imageUrl: e.target.value })
                  }
                  className="w-full p-2 border border-brand-border rounded"
                />
              </div>

              <div>
                <label className="block font-bold text-brand-navy mb-1">LinkedIn URL</label>
                <input
                  type="url"
                  value={editingMember.linkedinUrl || ''}
                  onChange={(e) =>
                    setEditingMember({ ...editingMember, linkedinUrl: e.target.value })
                  }
                  className="w-full p-2 border border-brand-border rounded"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-brand-border">
              <button
                type="button"
                onClick={() => setTeamModalOpen(false)}
                className="px-4 py-2 border border-brand-border rounded text-xs font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => saveTeamMember(editingMember)}
                className="px-4 py-2 bg-brand-teal text-white rounded text-xs font-bold hover:bg-brand-teal-hover"
              >
                Save Member
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: MILESTONE ─── */}
      {milestoneModalOpen && editingMilestone && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-brand-border shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-brand-border">
              <h3 className="font-bold text-brand-navy text-sm sm:text-base">
                Milestone &amp; Landmark
              </h3>
              <button
                onClick={() => setMilestoneModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-brand-navy mb-1">Year</label>
                  <input
                    type="text"
                    value={editingMilestone.year}
                    onChange={(e) =>
                      setEditingMilestone({ ...editingMilestone, year: e.target.value })
                    }
                    placeholder="2026"
                    className="w-full p-2 border border-brand-border rounded font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-brand-navy mb-1">Stat Badge</label>
                  <input
                    type="text"
                    value={editingMilestone.stat || ''}
                    onChange={(e) =>
                      setEditingMilestone({ ...editingMilestone, stat: e.target.value })
                    }
                    placeholder="₹100 Cr+"
                    className="w-full p-2 border border-brand-border rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-brand-navy mb-1">Milestone Title</label>
                <input
                  type="text"
                  value={editingMilestone.title}
                  onChange={(e) =>
                    setEditingMilestone({ ...editingMilestone, title: e.target.value })
                  }
                  placeholder="e.g. Foundation in Tirupur"
                  className="w-full p-2 border border-brand-border rounded"
                />
              </div>

              <div>
                <label className="block font-bold text-brand-navy mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingMilestone.description}
                  onChange={(e) =>
                    setEditingMilestone({ ...editingMilestone, description: e.target.value })
                  }
                  className="w-full p-2 border border-brand-border rounded"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-brand-border">
              <button
                type="button"
                onClick={() => setMilestoneModalOpen(false)}
                className="px-4 py-2 border border-brand-border rounded text-xs font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => saveMilestone(editingMilestone)}
                className="px-4 py-2 bg-brand-navy text-white rounded text-xs font-bold hover:bg-brand-navy/90"
              >
                Save Milestone
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: BRANCH OFFICE ─── */}
      {branchModalOpen && editingBranch && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-brand-border shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-brand-border">
              <h3 className="font-bold text-brand-navy text-sm sm:text-base">
                {editingBranch.id ? 'Edit Branch Office' : 'Add Branch Office'}
              </h3>
              <button
                onClick={() => setBranchModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-brand-navy mb-1">Branch / Office Name</label>
                <input
                  type="text"
                  value={editingBranch.name}
                  onChange={(e) => setEditingBranch({ ...editingBranch, name: e.target.value })}
                  placeholder="e.g. Coimbatore Branch"
                  className="w-full p-2 border border-brand-border rounded font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-brand-navy mb-1">Physical Address</label>
                <textarea
                  rows={2}
                  value={editingBranch.address}
                  onChange={(e) => setEditingBranch({ ...editingBranch, address: e.target.value })}
                  className="w-full p-2 border border-brand-border rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-brand-navy mb-1">Phone Number(s)</label>
                  <input
                    type="text"
                    value={editingBranch.phone}
                    onChange={(e) => setEditingBranch({ ...editingBranch, phone: e.target.value })}
                    className="w-full p-2 border border-brand-border rounded"
                  />
                </div>
                <div>
                  <label className="block font-bold text-brand-navy mb-1">Email Address</label>
                  <input
                    type="email"
                    value={editingBranch.email}
                    onChange={(e) => setEditingBranch({ ...editingBranch, email: e.target.value })}
                    className="w-full p-2 border border-brand-border rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-brand-navy mb-1">Working Timings</label>
                <input
                  type="text"
                  value={editingBranch.timings || ''}
                  onChange={(e) => setEditingBranch({ ...editingBranch, timings: e.target.value })}
                  placeholder="Mon – Sat: 9:30 AM – 6:30 PM"
                  className="w-full p-2 border border-brand-border rounded"
                />
              </div>

              <div>
                <label className="block font-bold text-brand-navy mb-1">
                  Google Maps Link or Coordinates URL
                </label>
                <input
                  type="url"
                  value={editingBranch.mapEmbedUrl || ''}
                  onChange={(e) =>
                    setEditingBranch({ ...editingBranch, mapEmbedUrl: e.target.value })
                  }
                  className="w-full p-2 border border-brand-border rounded"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-brand-border">
              <button
                type="button"
                onClick={() => setBranchModalOpen(false)}
                className="px-4 py-2 border border-brand-border rounded text-xs font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => saveBranch(editingBranch)}
                className="px-4 py-2 bg-brand-teal text-white rounded text-xs font-bold hover:bg-brand-teal-hover"
              >
                Save Branch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
