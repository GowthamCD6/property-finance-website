import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Loader2,
  X,
} from 'lucide-react';
import { Faq } from '../../types';
import {
  getAdminFaqsApi,
  createFaqApi,
  updateFaqApi,
  deleteFaqApi,
} from '../../services/api';

export const AdminFaqsPage: React.FC = () => {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<Faq | null>(null);

  // Form State
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('General');
  const [displayOrder, setDisplayOrder] = useState(1);
  const [isPublished, setIsPublished] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchFaqs = () => {
    setLoading(true);
    getAdminFaqsApi()
      .then(setFaqs)
      .catch((err) => console.error('Error fetching FAQs:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const openAddModal = () => {
    setEditingFaq(null);
    setQuestion('');
    setAnswer('');
    setCategory('General');
    setDisplayOrder(faqs.length + 1);
    setIsPublished(true);
    setModalOpen(true);
  };

  const openEditModal = (faq: Faq) => {
    setEditingFaq(faq);
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setCategory(faq.category);
    setDisplayOrder(faq.displayOrder);
    setIsPublished(faq.isPublished);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        question: question.trim(),
        answer: answer.trim(),
        category: category.trim(),
        displayOrder: Number(displayOrder),
        isPublished,
      };

      if (editingFaq) {
        await updateFaqApi(editingFaq.id, payload);
      } else {
        await createFaqApi(payload);
      }
      setModalOpen(false);
      fetchFaqs();
    } catch (err: any) {
      alert(err.message || 'Failed to save FAQ');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, q: string) => {
    if (!window.confirm(`Delete question: "${q}"?`)) return;
    try {
      await deleteFaqApi(id);
      fetchFaqs();
    } catch (err: any) {
      alert(err.message || 'Failed to delete FAQ');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-navy tracking-tight">
            Frequently Asked Questions Management
          </h1>
          <p className="text-xs sm:text-sm text-brand-slate mt-0.5">
            Manage informative customer answers, regulatory questions, and categories
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-teal hover:bg-brand-teal-hover text-white text-xs font-semibold rounded-corporate shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New FAQ</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-brand-border shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-brand-ivory/80 border-b border-brand-border text-brand-slate font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Order</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Question &amp; Answer</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-brand-slate">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-brand-teal mb-2" />
                    <span>Loading FAQs...</span>
                  </td>
                </tr>
              ) : faqs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-brand-slate">
                    No FAQs created yet.
                  </td>
                </tr>
              ) : (
                faqs.map((faq) => (
                  <tr key={faq.id} className="hover:bg-brand-ivory/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-brand-navy">
                      #{faq.displayOrder}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 bg-brand-ivory border border-brand-border rounded font-semibold text-brand-slate text-[11px]">
                        {faq.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 max-w-md">
                      <span className="font-bold text-brand-navy block mb-1 text-xs sm:text-sm">
                        {faq.question}
                      </span>
                      <p className="text-brand-slate text-[11px] line-clamp-2">
                        {faq.answer}
                      </p>
                    </td>
                    <td className="py-3.5 px-4">
                      {faq.isPublished ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                          <CheckCircle className="w-3 h-3" />
                          <span>Published</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-700">
                          <XCircle className="w-3 h-3" />
                          <span>Draft</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => openEditModal(faq)}
                        className="px-2.5 py-1 text-[11px] font-semibold text-brand-teal hover:bg-brand-teal-light rounded transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(faq.id, faq.question)}
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

      {/* CREATE / EDIT FAQ MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-brand-navy/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-modal border border-brand-border animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-brand-border">
              <h3 className="font-bold text-base text-brand-navy">
                {editingFaq ? 'Edit FAQ' : 'Add New FAQ'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-brand-slate hover:text-brand-navy">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-semibold text-brand-navy mb-1">Question *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. What documents are required before a consultation?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full p-2.5 bg-brand-ivory border border-brand-border rounded-lg text-brand-navy"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-navy mb-1">Answer *</label>
                <textarea
                  rows={4}
                  required
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="w-full p-2.5 bg-brand-ivory border border-brand-border rounded-lg text-brand-navy"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-brand-navy mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="General / Eligibility / Process"
                    className="w-full p-2.5 bg-brand-ivory border border-brand-border rounded-lg text-brand-navy"
                  />
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
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-teal"
                  />
                  <span>Publish to Public Website</span>
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
                  {saving ? 'Saving...' : 'Save FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
