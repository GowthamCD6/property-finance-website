import React, { useState, useEffect } from 'react';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Loader2,
  X,
  Home,
  Building2,
  Briefcase,
  FileCheck,
  Landmark,
  ArrowRight,
  Eye,
  Sliders,
} from 'lucide-react';
import { Service } from '../../types';
import {
  getAdminServicesApi,
  createServiceApi,
  updateServiceApi,
  deleteServiceApi,
} from '../../services/api';

const ICON_MAP: Record<string, React.ReactNode> = {
  Home: <Home className="w-5 h-5" />,
  Building: <Building2 className="w-5 h-5" />,
  Briefcase: <Briefcase className="w-5 h-5" />,
  FileCheck: <FileCheck className="w-5 h-5" />,
  Landmark: <Landmark className="w-5 h-5" />,
};

export const AdminServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Form State
  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [iconName, setIconName] = useState('Home');
  const [displayOrder, setDisplayOrder] = useState(1);
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchServices = () => {
    setLoading(true);
    getAdminServicesApi()
      .then(setServices)
      .catch((err) => console.error('Error fetching services:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openAddModal = () => {
    setEditingService(null);
    setSlug('');
    setTitle('');
    setShortDescription('');
    setFullDescription('');
    setIconName('Home');
    setDisplayOrder(services.length + 1);
    setIsActive(true);
    setModalOpen(true);
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
    setSlug(service.slug);
    setTitle(service.title);
    setShortDescription(service.shortDescription);
    setFullDescription(service.fullDescription);
    setIconName(service.iconName);
    setDisplayOrder(service.displayOrder);
    setIsActive(service.isActive);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        slug: slug.trim().toLowerCase(),
        title: title.trim(),
        shortDescription: shortDescription.trim(),
        fullDescription: fullDescription.trim(),
        iconName,
        displayOrder: Number(displayOrder),
        isActive,
      };

      if (editingService) {
        await updateServiceApi(editingService.id, payload);
      } else {
        await createServiceApi(payload);
      }
      setModalOpen(false);
      fetchServices();
    } catch (err: any) {
      alert(err.message || 'Failed to save service');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete the service "${title}"?`)) return;
    try {
      await deleteServiceApi(id);
      fetchServices();
    } catch (err: any) {
      alert(err.message || 'Failed to delete service');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0c1a26] tracking-tight font-heading">
            Configured Loan Services
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-sans">
            Manage offered loan facilities, descriptions, features, and their live display order on public pages
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="group inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white text-xs sm:text-sm font-bold font-heading rounded-xl shadow-md shadow-teal-500/20 transition-all self-start sm:self-auto cursor-pointer active:scale-[0.98]"
        >
          <Plus className="w-4 h-4 transition-transform group-hover:rotate-90 duration-200" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Services Grid & Table */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center shadow-sm">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-teal-600 mb-2" />
          <span className="text-xs text-slate-500">Loading loan catalog...</span>
        </div>
      ) : services.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center shadow-sm space-y-3">
          <Layers className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-[#0c1a26] text-base font-heading">No Loan Services Configured</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Click "Add New Service" to create your first property loan product offering.
          </p>
          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold font-heading hover:bg-teal-700"
          >
            Create Service
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 p-5 flex flex-col justify-between space-y-4 relative overflow-hidden group hover:-translate-y-0.5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 border border-teal-200/80 flex items-center justify-center transition-transform group-hover:scale-105 duration-200">
                    {ICON_MAP[s.iconName] || <Home className="w-5 h-5" />}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                      #{s.displayOrder}
                    </span>
                    {s.isActive ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Live</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
                        <XCircle className="w-3 h-3" />
                        <span>Hidden</span>
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-[#0c1a26] font-heading group-hover:text-teal-700 transition-colors">
                    {s.title}
                  </h3>
                  <span className="text-[11px] font-mono text-teal-700 block mt-0.5">
                    /{s.slug}
                  </span>
                </div>

                <p className="text-xs text-slate-600 font-sans line-clamp-2 leading-relaxed">
                  {s.shortDescription}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono">
                  Icon: {s.iconName}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(s)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold font-heading text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-xl transition-colors border border-teal-200/60"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(s.id, s.title)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    title="Delete service"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0c1a26]/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 my-6">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider block font-heading">
                  Loan Catalog Configuration
                </span>
                <h3 className="font-extrabold text-lg text-[#0c1a26] font-heading">
                  {editingService ? 'Edit Loan Facility' : 'Create New Loan Facility'}
                </h3>
              </div>
              <button onClick={() => setModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-700 rounded-xl">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-[#0c1a26] mb-1 font-heading">Service Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Home Loans"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (!editingService) {
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                    }
                  }}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#0c1a26] font-semibold focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0c1a26] mb-1 font-heading">URL Identifier (Slug) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. home-loans"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#0c1a26] font-mono text-xs focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0c1a26] mb-1 font-heading">Short Summary (Homepage card) *</label>
                <textarea
                  rows={2}
                  required
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#0c1a26] resize-none focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0c1a26] mb-1 font-heading">Full Product Description *</label>
                <textarea
                  rows={3}
                  required
                  value={fullDescription}
                  onChange={(e) => setFullDescription(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#0c1a26] resize-none focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#0c1a26] mb-1 font-heading">Visual Icon</label>
                  <select
                    value={iconName}
                    onChange={(e) => setIconName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#0c1a26] font-semibold focus:bg-white"
                  >
                    <option value="Home">Home (Housing)</option>
                    <option value="Building">Building (Commercial)</option>
                    <option value="Briefcase">Briefcase (Funding)</option>
                    <option value="FileCheck">FileCheck (Consultation)</option>
                    <option value="Landmark">Landmark (Banking)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0c1a26] mb-1 font-heading">Display Order</label>
                  <input
                    type="number"
                    min="1"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(parseInt(e.target.value, 10))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#0c1a26] font-mono focus:bg-white"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-[#0c1a26]">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                  />
                  <span>Active &amp; Visible on Public Website</span>
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold font-heading shadow-sm"
                >
                  {saving ? 'Saving...' : 'Save Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminServicesPage;
