import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { SiteContent } from '../../types';
import { getPublicSiteContent, updateSiteContentApi } from '../../services/api';

export const AdminContentPage: React.FC = () => {
  const [content, setContent] = useState<Partial<SiteContent>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPublicSiteContent()
      .then((data) => setContent(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const updated = await updateSiteContentApi(content);
      setContent(updated);
      setSuccessMessage('Website content updated and published live successfully!');
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to update website content');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-brand-teal" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-navy tracking-tight">
            Website Content &amp; Brand Settings
          </h1>
          <p className="text-xs sm:text-sm text-brand-slate mt-0.5">
            Update published headlines, contact details, photography, and regulatory text in real-time
          </p>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs sm:text-sm flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs sm:text-sm flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 1. BUSINESS CONTACT & IDENTITY */}
        <div className="bg-white rounded-xl p-6 border border-brand-border shadow-subtle space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-brand-border text-brand-navy">
            <Building className="w-5 h-5 text-brand-teal" />
            <h3 className="text-base font-bold">1. Corporate Identity &amp; Contact Information</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div>
              <label className="block text-xs font-semibold text-brand-navy mb-1.5">Business Name</label>
              <input
                type="text"
                name="businessName"
                value={content.businessName || ''}
                onChange={handleChange}
                className="w-full p-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-brand-navy focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-navy mb-1.5">Official Phone</label>
              <input
                type="text"
                name="businessPhone"
                value={content.businessPhone || ''}
                onChange={handleChange}
                className="w-full p-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-brand-navy focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-navy mb-1.5">Official Email</label>
              <input
                type="email"
                name="businessEmail"
                value={content.businessEmail || ''}
                onChange={handleChange}
                className="w-full p-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-brand-navy focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-navy mb-1.5">Office City &amp; State</label>
              <input
                type="text"
                name="cityState"
                value={content.cityState || ''}
                onChange={handleChange}
                className="w-full p-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-brand-navy focus:bg-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-brand-navy mb-1.5">Physical Office Address</label>
              <input
                type="text"
                name="officeAddress"
                value={content.officeAddress || ''}
                onChange={handleChange}
                className="w-full p-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-brand-navy focus:bg-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-brand-navy mb-1.5">Consultation &amp; Working Hours</label>
              <input
                type="text"
                name="businessHours"
                value={content.businessHours || ''}
                onChange={handleChange}
                className="w-full p-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-brand-navy focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* 2. HERO SECTION */}
        <div className="bg-white rounded-xl p-6 border border-brand-border shadow-subtle space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-brand-border text-brand-navy">
            <FileText className="w-5 h-5 text-brand-teal" />
            <h3 className="text-base font-bold">2. Homepage Hero Section</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-brand-navy mb-1.5">Hero Eyebrow Badge</label>
              <input
                type="text"
                name="heroEyebrow"
                value={content.heroEyebrow || ''}
                onChange={handleChange}
                className="w-full p-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-brand-navy focus:bg-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-brand-navy mb-1.5">Hero Headline</label>
              <input
                type="text"
                name="heroHeadline"
                value={content.heroHeadline || ''}
                onChange={handleChange}
                className="w-full p-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-brand-navy focus:bg-white font-bold"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-brand-navy mb-1.5">Hero Subtitle / Copy</label>
              <textarea
                rows={3}
                name="heroSubtitle"
                value={content.heroSubtitle || ''}
                onChange={handleChange}
                className="w-full p-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-brand-navy focus:bg-white resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-navy mb-1.5">Primary CTA Button Text</label>
              <input
                type="text"
                name="heroCtaText"
                value={content.heroCtaText || ''}
                onChange={handleChange}
                className="w-full p-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-brand-navy focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-navy mb-1.5">Secondary CTA Button Text</label>
              <input
                type="text"
                name="heroSecondaryCtaText"
                value={content.heroSecondaryCtaText || ''}
                onChange={handleChange}
                className="w-full p-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-brand-navy focus:bg-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                Hero Property Image URL (High-res residential property)
              </label>
              <input
                type="url"
                name="heroImageUrl"
                value={content.heroImageUrl || ''}
                onChange={handleChange}
                className="w-full p-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-brand-navy focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* 3. ABOUT & WHY US SECTION */}
        <div className="bg-white rounded-xl p-6 border border-brand-border shadow-subtle space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-brand-border text-brand-navy">
            <Building className="w-5 h-5 text-brand-teal" />
            <h3 className="text-base font-bold">3. About Us &amp; Advisory Scope</h3>
          </div>

          <div className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block text-xs font-semibold text-brand-navy mb-1.5">Section Heading</label>
              <input
                type="text"
                name="aboutHeading"
                value={content.aboutHeading || ''}
                onChange={handleChange}
                className="w-full p-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-brand-navy focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-navy mb-1.5">Advisory Description</label>
              <textarea
                rows={4}
                name="aboutText"
                value={content.aboutText || ''}
                onChange={handleChange}
                className="w-full p-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-brand-navy focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-navy mb-1.5">Section Image URL</label>
              <input
                type="url"
                name="aboutImageUrl"
                value={content.aboutImageUrl || ''}
                onChange={handleChange}
                className="w-full p-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-brand-navy focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* 4. LEGAL & REGULATORY DISCLAIMERS */}
        <div className="bg-white rounded-xl p-6 border border-brand-border shadow-subtle space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-brand-border text-brand-navy">
            <ShieldCheck className="w-5 h-5 text-brand-teal" />
            <h3 className="text-base font-bold">4. Compliance, Privacy &amp; Disclaimers</h3>
          </div>

          <div className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                Regulatory Disclaimer (Displayed prominently in footer &amp; forms)
              </label>
              <textarea
                rows={3}
                name="disclaimerText"
                value={content.disclaimerText || ''}
                onChange={handleChange}
                className="w-full p-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-brand-navy focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-navy mb-1.5">Privacy Policy Notice</label>
              <textarea
                rows={3}
                name="privacyPolicy"
                value={content.privacyPolicy || ''}
                onChange={handleChange}
                className="w-full p-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-brand-navy focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-navy mb-1.5">Terms of Service</label>
              <textarea
                rows={3}
                name="termsConditions"
                value={content.termsConditions || ''}
                onChange={handleChange}
                className="w-full p-2.5 bg-brand-ivory/50 border border-brand-border rounded-lg text-brand-navy focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-navy mb-1.5">Copyright Statement</label>
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

        {/* SAVE BUTTON */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-brand-teal hover:bg-brand-teal-hover disabled:bg-gray-300 text-white font-semibold text-sm rounded-corporate shadow-sm flex items-center gap-2 transition-colors"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Publishing Updates...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save &amp; Publish Website Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
