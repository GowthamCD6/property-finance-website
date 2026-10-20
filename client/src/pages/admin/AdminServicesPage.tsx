import React, { useState, useEffect } from 'react';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Loader2,
  X,
  Home,
  Building,
  Briefcase,
  FileCheck,
  Landmark,
} from 'lucide-react';
import { Service } from '../../types';
import {
  getAdminServicesApi,
  createServiceApi,
  updateServiceApi,
  deleteServiceApi,
} from '../../services/api';

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-navy tracking-tight">
            Configured Loan Services
          </h1>
          <p className="text-xs sm:text-sm text-brand-slate mt-0.5">
            Manage offered loan products, descriptions, and their visibility on the public website
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-teal hover:bg-brand-teal-hover text-white text-xs font-semibold rounded-corporate shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Services List Table */}
      <div className="bg-white rounded-xl border border-brand-border shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-brand-ivory/80 border-b border-brand-border text-brand-slate font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Order</th>
                <th className="py-3.5 px-4">Service Title</th>
                <th className="py-3.5 px-4">Slug</th>
                <th className="py-3.5 px-4">Short Description</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-brand-slate">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-brand-teal mb-2" />
                    <span>Loading services...</span>
                  </td>
                </tr>
              ) : services.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-brand-slate">
                    No services configured.
                  </td>
                </tr>
              ) : (
                services.map((s) => (
                  <tr key={s.id} className="hover:bg-brand-ivory/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-brand-navy">
                      #{s.displayOrder}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-brand-navy text-sm">
                      {s.title}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-brand-slate">
                      {s.slug}
                    </td>
                    <td className="py-3.5 px-4 text-brand-slate max-w-xs truncate">
                      {s.shortDescription}
                    </td>
                    <td className="py-3.5 px-4">
                      {s.isActive ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                          <CheckCircle className="w-3 h-3" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-700">
                          <XCircle className="w-3 h-3" />
                          <span>Hidden</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => openEditModal(s)}
                        className="px-2.5 py-1 text-[11px] font-semibold text-brand-teal hover:bg-brand-teal-light rounded transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(s.id, s.title)}
                        className="px-2.5 py-1 text-[11px] font-semibold text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-brand-navy/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-modal border border-brand-border animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-brand-border">
              <h3 className="font-bold text-base text-brand-navy">
                {editingService ? 'Edit Service' : 'Add New Service'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-brand-slate hover:text-brand-navy">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-semibold text-brand-navy mb-1">Service Title *</label>
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
                  className="w-full p-2.5 bg-brand-ivory border border-brand-border rounded-lg text-brand-navy"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-navy mb-1">URL Identifier (Slug) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. home-loans"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full p-2.5 bg-brand-ivory border border-brand-border rounded-lg text-brand-navy font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-navy mb-1">Short Summary (Homepage card) *</label>
                <textarea
                  rows={2}
                  required
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className="w-full p-2.5 bg-brand-ivory border border-brand-border rounded-lg text-brand-navy resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-navy mb-1">Full Description *</label>
                <textarea
                  rows={3}
                  required
                  value={fullDescription}
                  onChange={(e) => setFullDescription(e.target.value)}
                  className="w-full p-2.5 bg-brand-ivory border border-brand-border rounded-lg text-brand-navy resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-brand-navy mb-1">Line Icon</label>
                  <select
                    value={iconName}
                    onChange={(e) => setIconName(e.target.value)}
                    className="w-full p-2.5 bg-brand-ivory border border-brand-border rounded-lg text-brand-navy"
                  >
                    <option value="Home">Home</option>
                    <option value="Building">Building (Commercial)</option>
                    <option value="Briefcase">Briefcase (Funding)</option>
                    <option value="FileCheck">FileCheck (Consultation)</option>
                    <option value="Landmark">Landmark (Banking)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-navy mb-1">Display Order</label>
                  <input
                    type="number"
                    min="1"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(parseInt(e.target.value, 10))}
                    className="w-full p-2.5 bg-brand-ivory border border-brand-border rounded-lg text-brand-navy"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-brand-navy">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-teal"
                  />
                  <span>Active &amp; Visible on Public Website</span>
                </label>
              </div>

              <div className="pt-3 border-t border-brand-border flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-brand-border rounded-lg text-xs font-semibold text-brand-slate hover:bg-brand-ivory"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-brand-teal hover:bg-brand-teal-hover disabled:bg-gray-300 text-white rounded-lg text-xs font-semibold"
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
