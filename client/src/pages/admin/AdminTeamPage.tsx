import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  UserPlus,
  Search,
  Mail,
  Phone,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2,
  Edit2,
  X,
  Lock,
  User,
  Shield,
  KeyRound,
  ExternalLink,
  Info,
  Clock,
  Sparkles,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { AdminUser, CreateAdminPayload, UpdateAdminPayload } from '../../types';
import { useAuth } from '../../context/AuthContext';
import {
  getAdminTeamApi,
  createAdminMemberApi,
  updateAdminMemberApi,
  deleteAdminMemberApi,
} from '../../services/api';

export const AdminTeamPage: React.FC = () => {
  const { admin: currentAdmin } = useAuth();

  const [team, setTeam] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modal states
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState<boolean>(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const [deletingAdmin, setDeletingAdmin] = useState<AdminUser | null>(null);

  // Form submission states
  const [enrollForm, setEnrollForm] = useState<CreateAdminPayload>({
    name: '',
    email: '',
    phone: '',
    role: 'admin',
    password: '',
  });
  const [editForm, setEditForm] = useState<UpdateAdminPayload>({
    name: '',
    phone: '',
    role: 'admin',
    isActive: true,
    password: '',
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Load team on mount
  const fetchTeam = async () => {
    setLoading(true);
    try {
      const data = await getAdminTeamApi();
      setTeam(data);
    } catch (err: any) {
      console.error('Error fetching admin team:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  // Filtered team members
  const filteredTeam = team.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (member.phone && member.phone.includes(searchTerm));

    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'active' && member.isActive !== false) ||
      (statusFilter === 'inactive' && member.isActive === false);

    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const totalAdmins = team.length;
  const activeAdmins = team.filter((a) => a.isActive !== false).length;

  // Handle Enroll Submit
  const handleEnrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!enrollForm.name.trim() || !enrollForm.email.trim()) {
      setFormError('Please enter administrator full name and email address.');
      return;
    }

    if (!enrollForm.email.includes('@')) {
      setFormError('Please provide a valid Gmail or company email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const newAdmin = await createAdminMemberApi({
        name: enrollForm.name.trim(),
        email: enrollForm.email.trim().toLowerCase(),
        phone: enrollForm.phone?.trim() || null,
        role: enrollForm.role || 'admin',
        password: enrollForm.password?.trim() || null,
      });

      setFormSuccess(`Administrator ${newAdmin.name} (${newAdmin.email}) enrolled successfully!`);
      setEnrollForm({
        name: '',
        email: '',
        phone: '',
        role: 'admin',
        password: '',
      });
      await fetchTeam();
      setTimeout(() => {
        setIsEnrollModalOpen(false);
        setFormSuccess(null);
      }, 1500);
    } catch (err: any) {
      setFormError(err.message || 'Failed to enroll administrator.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Edit Modal
  const openEditModal = (admin: AdminUser) => {
    setEditingAdmin(admin);
    setEditForm({
      name: admin.name,
      phone: admin.phone || '',
      role: 'admin',
      isActive: admin.isActive !== false,
      password: '',
    });
    setFormError(null);
    setFormSuccess(null);
  };

  // Handle Edit Submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdmin) return;
    setFormError(null);
    setFormSuccess(null);

    setIsSubmitting(true);
    try {
      await updateAdminMemberApi(editingAdmin.id, {
        name: editForm.name?.trim(),
        phone: editForm.phone?.trim() || null,
        role: editForm.role,
        isActive: editForm.isActive,
        password: editForm.password?.trim() ? editForm.password.trim() : undefined,
      });

      setFormSuccess('Administrator account updated successfully.');
      await fetchTeam();
      setTimeout(() => {
        setEditingAdmin(null);
        setFormSuccess(null);
      }, 1200);
    } catch (err: any) {
      setFormError(err.message || 'Failed to update administrator.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick Toggle Active / Inactive
  const handleToggleActive = async (admin: AdminUser) => {
    if (admin.id === currentAdmin?.id) {
      alert('You cannot deactivate your own active session account.');
      return;
    }
    const newStatus = !(admin.isActive !== false);
    try {
      await updateAdminMemberApi(admin.id, { isActive: newStatus });
      await fetchTeam();
    } catch (err: any) {
      alert(err.message || 'Failed to toggle account status.');
    }
  };

  // Handle Delete Admin
  const handleDeleteConfirm = async () => {
    if (!deletingAdmin) return;
    setIsSubmitting(true);
    try {
      await deleteAdminMemberApi(deletingAdmin.id);
      setDeletingAdmin(null);
      await fetchTeam();
    } catch (err: any) {
      alert(err.message || 'Failed to delete administrator.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoleBadge = (_role?: string) => {
    return {
      bg: 'bg-teal-50 text-teal-800 border-teal-200/90',
      dot: 'bg-teal-500',
      label: 'Administrator',
    };
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return 'Never logged in';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0c1a26] tracking-tight font-heading">
              Admin Team & Access Control
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold font-heading bg-teal-50 text-teal-700 border border-teal-200">
              TiDB Secure Auth
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setFormError(null);
              setFormSuccess(null);
              setIsEnrollModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-xl text-xs sm:text-sm font-bold font-heading shadow-md shadow-teal-500/20 transition-all active:scale-[0.98] cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Enroll New Admin</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between"
            >
              <div className="space-y-2">
                <div className="h-3 w-28 bg-slate-200 rounded" />
                <div className="h-8 w-12 bg-slate-300 rounded-lg" />
                <div className="h-2.5 w-32 bg-slate-100 rounded" />
              </div>
              <div className="w-12 h-12 bg-slate-100 rounded-xl" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:border-slate-300 transition-all">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-heading">
                Total Enrolled Admins
              </p>
              <h3 className="text-2xl font-black text-[#0c1a26] mt-1 font-heading">{totalAdmins}</h3>
              <p className="text-[11px] text-slate-400 mt-0.5 font-sans">Persisted in TiDB Cloud</p>
            </div>
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-700">
              <User className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:border-emerald-200 transition-all">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-heading">
                Active Authorized
              </p>
              <h3 className="text-2xl font-black text-emerald-600 mt-1 font-heading">{activeAdmins}</h3>
              <p className="text-[11px] text-slate-400 mt-0.5 font-sans">Eligible for Google SSO</p>
            </div>
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:border-teal-200 transition-all">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-heading">
                Administrator Role
              </p>
              <h3 className="text-2xl font-black text-teal-700 mt-1 font-heading">{totalAdmins}</h3>
              <p className="text-[11px] text-slate-400 mt-0.5 font-sans">Full administrative control</p>
            </div>
            <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600">
              <Shield className="w-6 h-6" />
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Admin Name, Gmail / Email, or Phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-sans focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium font-heading text-[#0c1a26] focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 cursor-pointer"
            >
              <option value="ALL">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Deactivated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Admin Table Directory */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="overflow-x-auto animate-pulse">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider font-heading">
                  <th className="py-3.5 px-5">Administrator</th>
                  <th className="py-3.5 px-4">Authorized Gmail / Email</th>
                  <th className="py-3.5 px-4">Contact Phone</th>
                  <th className="py-3.5 px-4">System Role</th>
                  <th className="py-3.5 px-4">Account Status</th>
                  <th className="py-3.5 px-4">Last Activity</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[1, 2, 3, 4].map((i) => (
                  <tr key={i}>
                    {/* Administrator Avatar + Name */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0" />
                        <div className="space-y-1.5">
                          <div className="h-4 w-32 bg-slate-200 rounded" />
                          <div className="h-3 w-20 bg-slate-100 rounded" />
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-4 px-4">
                      <div className="space-y-1.5">
                        <div className="h-3.5 w-44 bg-slate-200 rounded" />
                        <div className="h-3 w-24 bg-slate-100 rounded" />
                      </div>
                    </td>

                    {/* Contact Phone */}
                    <td className="py-4 px-4">
                      <div className="h-3.5 w-28 bg-slate-100 rounded" />
                    </td>

                    {/* Role */}
                    <td className="py-4 px-4">
                      <div className="h-6 w-24 bg-slate-100 rounded-lg" />
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      <div className="h-6 w-20 bg-slate-100 rounded-full" />
                    </td>

                    {/* Last Activity */}
                    <td className="py-4 px-4">
                      <div className="h-3.5 w-24 bg-slate-100 rounded" />
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-7 h-7 bg-slate-100 rounded-lg" />
                        <div className="w-7 h-7 bg-slate-100 rounded-lg" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : filteredTeam.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <User className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-[#0c1a26] font-heading">No administrators found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto font-sans">
              No administrator records matched your search criteria. Try clearing filters or enroll a new admin.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider font-heading">
                  <th className="py-3.5 px-5">Administrator</th>
                  <th className="py-3.5 px-4">Authorized Gmail / Email</th>
                  <th className="py-3.5 px-4">Contact Phone</th>
                  <th className="py-3.5 px-4">System Role</th>
                  <th className="py-3.5 px-4">Account Status</th>
                  <th className="py-3.5 px-4">Last Activity</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm font-sans">
                {filteredTeam.map((member) => {
                  const roleConfig = getRoleBadge(member.role);
                  const isSelf = member.id === currentAdmin?.id;

                  return (
                    <tr
                      key={member.id}
                      className="hover:bg-slate-50/60 transition-colors group"
                    >
                      {/* Name & Avatar */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          {member.avatar ? (
                            <img
                              src={member.avatar}
                              alt={member.name}
                              className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-xs"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 text-white font-bold font-heading text-xs flex items-center justify-center border border-slate-700 shadow-xs">
                              {member.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .substring(0, 2)
                                .toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-[#0c1a26] font-heading group-hover:text-teal-700 transition-colors">
                                {member.name}
                              </span>
                              {isSelf && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                                  You
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400 font-sans block">
                              Enrolled {member.createdAt ? new Date(member.createdAt).toLocaleDateString('en-IN') : 'Primary'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Authorized Email */}
                      <td className="py-4 px-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                            <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                            <a
                              href={`mailto:${member.email}`}
                              className="hover:text-teal-700 hover:underline"
                            >
                              {member.email}
                            </a>
                          </div>
                          {member.email.toLowerCase().endsWith('@gmail.com') ? (
                            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-semibold font-heading">
                              <Sparkles className="w-2.5 h-2.5 text-emerald-500" />
                              <span>Google SSO Ready</span>
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-sans">
                              Domain Account
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Phone Number */}
                      <td className="py-4 px-4">
                        {member.phone ? (
                          <div className="flex items-center gap-2">
                            <span className="text-slate-700 font-medium">{member.phone}</span>
                            <a
                              href={`https://wa.me/91${member.phone.replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1 rounded-md text-emerald-600 hover:bg-emerald-50 transition-colors"
                              title="Chat on WhatsApp"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs italic">Not provided</span>
                        )}
                      </td>

                      {/* Role */}
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold font-heading border ${roleConfig.bg}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${roleConfig.dot}`} />
                          {roleConfig.label}
                        </span>
                      </td>

                      {/* Account Status & Toggle */}
                      <td className="py-4 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(member)}
                          disabled={isSelf}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold font-heading border transition-all ${
                            member.isActive !== false
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                          } ${isSelf ? 'cursor-default opacity-80' : 'cursor-pointer'}`}
                          title={isSelf ? 'Cannot deactivate self' : 'Click to toggle status'}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              member.isActive !== false ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}
                          />
                          <span>{member.isActive !== false ? 'Active' : 'Deactivated'}</span>
                        </button>
                      </td>

                      {/* Last Activity */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5 text-slate-500 text-xs font-sans">
                          <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <span>{formatDate(member.lastLoginAt)}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => openEditModal(member)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-teal-700 hover:bg-teal-50 transition-colors"
                            title="Edit Administrator"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {!isSelf && (
                            <button
                              type="button"
                              onClick={() => setDeletingAdmin(member)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                              title="Delete Administrator"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Table Footer */}
            <div className="px-5 py-3 bg-slate-50/70 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500 font-sans">
              <span>Showing {filteredTeam.length} of {team.length} administrators</span>
              <span className="text-[11px] text-slate-400 font-mono">Real-time DB Sync</span>
            </div>
          </div>
        )}
      </div>

      {/* ====================================================================== */}
      {/* MODAL: ENROLL NEW ADMINISTRATOR */}
      {/* ====================================================================== */}
      {isEnrollModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-[#0c1a26] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-teal-500 text-slate-950 rounded-xl shadow-xs">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-heading">Enroll Administrator</h3>
                  <p className="text-xs text-slate-300 font-sans">
                    Pre-authorize a team member's Gmail for Google Sign-In
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEnrollModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleEnrollSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-red-800 text-xs">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <span className="font-medium font-sans">{formError}</span>
                </div>
              )}

              {formSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2 text-emerald-800 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="font-medium font-sans">{formSuccess}</span>
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-[#0c1a26] mb-1.5 font-heading">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={enrollForm.name}
                    onChange={(e) => setEnrollForm({ ...enrollForm, name: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-sans focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Authorized Gmail / Email */}
              <div>
                <label className="block text-xs font-bold text-[#0c1a26] mb-1.5 font-heading">
                  Gmail / Work Email <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. ramesh.loans@gmail.com"
                    value={enrollForm.email}
                    onChange={(e) => setEnrollForm({ ...enrollForm, email: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-sans focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
                <p className="text-[11px] text-teal-700 mt-1 font-sans">
                  ✨ <strong>Important:</strong> The user will be authorized to log in via "Continue with Google" using this exact Gmail.
                </p>
              </div>

              {/* Contact Phone & Role in 2 Columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold text-[#0c1a26] mb-1.5 font-heading">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      placeholder="e.g. 9843012345"
                      value={enrollForm.phone || ''}
                      onChange={(e) => setEnrollForm({ ...enrollForm, phone: e.target.value })}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-sans focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                    />
                  </div>
                </div>

                {/* Role */}
                <div>
                  <label className="block text-xs font-bold text-[#0c1a26] mb-1.5 font-heading">
                    Administrative Role
                  </label>
                  <select
                    value={enrollForm.role}
                    onChange={(e) => setEnrollForm({ ...enrollForm, role: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium font-heading text-[#0c1a26] focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  >
                    <option value="admin">Administrator</option>
                  </select>
                </div>
              </div>

              {/* Optional Initial Password */}
              <div>
                <label className="block text-xs font-bold text-[#0c1a26] mb-1.5 font-heading">
                  Initial Password <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    placeholder="Leave blank for Google SSO only, or set password"
                    value={enrollForm.password || ''}
                    onChange={(e) => setEnrollForm({ ...enrollForm, password: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-sans focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1 font-sans">
                  If left blank, an encrypted credential is generated automatically and the admin can log in seamlessly with Google.
                </p>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEnrollModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold font-heading transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold font-heading shadow-md shadow-teal-500/20 transition-all active:scale-[0.98] disabled:opacity-60 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Enrolling in TiDB...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Complete Enrollment</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* MODAL: EDIT ADMINISTRATOR */}
      {/* ====================================================================== */}
      {editingAdmin && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-[#0c1a26] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-teal-500 text-slate-950 rounded-xl shadow-xs">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-heading">Edit Administrator Profile</h3>
                  <p className="text-xs text-slate-300 font-sans">{editingAdmin.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingAdmin(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-red-800 text-xs">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <span className="font-medium font-sans">{formError}</span>
                </div>
              )}

              {formSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2 text-emerald-800 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="font-medium font-sans">{formSuccess}</span>
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-[#0c1a26] mb-1.5 font-heading">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-sans focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              {/* Phone & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#0c1a26] mb-1.5 font-heading">
                    Mobile Phone
                  </label>
                  <input
                    type="tel"
                    value={editForm.phone || ''}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-sans focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0c1a26] mb-1.5 font-heading">
                    Administrative Role
                  </label>
                  <select
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium font-heading text-[#0c1a26] focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  >
                    <option value="admin">Administrator</option>
                  </select>
                </div>
              </div>

              {/* Reset Password */}
              <div>
                <label className="block text-xs font-bold text-[#0c1a26] mb-1.5 font-heading">
                  Reset Password <span className="text-slate-400 font-normal">(Leave blank to keep current)</span>
                </label>
                <input
                  type="password"
                  placeholder="Enter new password (min 6 characters)"
                  value={editForm.password || ''}
                  onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-sans focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              {/* Active Status */}
              <div className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editForm.isActive}
                    disabled={editingAdmin.id === currentAdmin?.id}
                    onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#0c1a26] font-heading block">
                      Account Active & Authorized
                    </span>
                    <span className="text-[11px] text-slate-400 font-sans">
                      When deactivated, this account cannot sign in via Google or password.
                    </span>
                  </div>
                </label>
              </div>

              {/* Actions */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingAdmin(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold font-heading transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold font-heading shadow-md shadow-teal-500/20 transition-all active:scale-[0.98] disabled:opacity-60 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Update Administrator</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* MODAL: DELETE CONFIRMATION */}
      {/* ====================================================================== */}
      {deletingAdmin && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0c1a26] font-heading">
                  Delete Administrator Account?
                </h3>
                <p className="text-xs text-slate-500 mt-1 font-sans">
                  Are you sure you want to delete <strong>{deletingAdmin.name}</strong> ({deletingAdmin.email})? They will immediately lose access to the Admin Console.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeletingAdmin(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold font-heading transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold font-heading shadow-md shadow-rose-500/20 transition-all active:scale-[0.98] disabled:opacity-60 flex items-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  <span>Confirm Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTeamPage;

