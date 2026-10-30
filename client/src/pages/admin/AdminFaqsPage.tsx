import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Loader2,
  X,
  Search,
  Tag,
  ChevronDown,
  ChevronUp,
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
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);

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

  const categories = ['ALL', ...Array.from(new Set(faqs.map((f) => f.category)))];

  const filteredFaqs = faqs.filter((faq) => {
    if (selectedCategory !== 'ALL' && faq.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return faq.question.toLowerCase().includes(q) || faq.answer.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0c1a26] tracking-tight font-heading">
            Frequently Asked Questions Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-sans">
            Manage informative customer answers, regulatory questions, and categorised banking advice
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="group inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white text-xs sm:text-sm font-bold font-heading rounded-xl shadow-md shadow-teal-500/20 transition-all self-start sm:self-auto cursor-pointer active:scale-[0.98]"
        >
          <Plus className="w-4 h-4 transition-transform group-hover:rotate-90 duration-200" />
          <span>Add New FAQ</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3.5">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search FAQs by question title or answer text..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-[#0c1a26] placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
          />
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs pt-2 border-t border-slate-100">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-heading font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#0c1a26] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'ALL' ? 'All Categories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* FAQs List */}
      <div className="space-y-3.5">
        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center shadow-sm">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-teal-600 mb-2" />
            <span className="text-xs text-slate-500">Loading FAQs...</span>
          </div>
        ) : filteredFaqs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center shadow-sm space-y-3">
            <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-[#0c1a26] text-base font-heading">No FAQs Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No questions match your current search or category filter.
            </p>
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isExpanded = expandedFaqId === faq.id;

            return (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all p-5 space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <span className="font-mono text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md mt-0.5">
                      #{faq.displayOrder}
                    </span>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-md bg-teal-50 text-teal-800 text-[10px] font-bold font-heading border border-teal-200/60">
                          {faq.category}
                        </span>
                        {faq.isPublished ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Live</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
                            <XCircle className="w-3 h-3" />
                            <span>Draft</span>
                          </span>
                        )}
                      </div>

                      <h3
                        onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                        className="text-sm sm:text-base font-extrabold text-[#0c1a26] font-heading cursor-pointer hover:text-teal-700 transition-colors pt-1"
                      >
                        {faq.question}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => openEditModal(faq)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold font-heading text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-xl transition-colors border border-teal-200/60"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(faq.id, faq.question)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      title="Delete FAQ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="pl-10 text-xs sm:text-sm text-slate-600 font-sans leading-relaxed pt-1">
                  <p className={isExpanded ? '' : 'line-clamp-2'}>{faq.answer}</p>
                  {faq.answer.length > 140 && (
                    <button
                      type="button"
                      onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                      className="text-teal-700 hover:underline font-semibold text-xs mt-1 inline-flex items-center gap-0.5"
                    >
                      {isExpanded ? (
                        <>
                          <span>Show Less</span>
                          <ChevronUp className="w-3 h-3" />
                        </>
                      ) : (
                        <>
                          <span>Read Full Answer</span>
                          <ChevronDown className="w-3 h-3" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* CREATE / EDIT FAQ MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0c1a26]/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 my-6">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider block font-heading">
                  FAQ Knowledge Base
                </span>
                <h3 className="font-extrabold text-lg text-[#0c1a26] font-heading">
                  {editingFaq ? 'Edit FAQ Item' : 'Add New FAQ Item'}
                </h3>
              </div>
              <button onClick={() => setModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-700 rounded-xl">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-[#0c1a26] mb-1 font-heading">Question Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. What documents are required before a consultation?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#0c1a26] font-semibold focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0c1a26] mb-1 font-heading">Detailed Answer *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide comprehensive and helpful guidance..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#0c1a26] focus:bg-white resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#0c1a26] mb-1 font-heading">Category</label>
                  <input
                    type="text"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="General / Eligibility / Process"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[#0c1a26] focus:bg-white"
                  />
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
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                  />
                  <span>Publish to Public Website</span>
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

export default AdminFaqsPage;
