import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Phone,
  Video,
  Building,
  User,
  X,
  RefreshCw,
} from 'lucide-react';
import { Appointment } from '../../types';
import { getAppointmentsApi, updateAppointmentApi, getPublicAvailability } from '../../services/api';

export const AdminAppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('');

  // Action Modals State
  const [activeModal, setActiveModal] = useState<{
    type: 'reschedule' | 'cancel';
    appointment: any;
  } | null>(null);

  // Reschedule form
  const [newDate, setNewDate] = useState('');
  const [newSlot, setNewSlot] = useState('');
  const [rescheduleReason, setRescheduleReason] = useState('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  // Cancel form
  const [cancellationReason, setCancellationReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchAppointments = () => {
    setLoading(true);
    getAppointmentsApi({
      status: statusFilter,
      date: dateFilter || undefined,
    })
      .then(setAppointments)
      .catch((err) => console.error('Error fetching appointments:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAppointments();
  }, [statusFilter, dateFilter]);

  // When opening reschedule modal, fetch slots
  useEffect(() => {
    if (activeModal?.type === 'reschedule' && newDate) {
      setSlotsLoading(true);
      getPublicAvailability(newDate)
        .then((data) => {
          setAvailableSlots(data.availableSlots || []);
          if (data.availableSlots && data.availableSlots.length > 0) {
            setNewSlot(data.availableSlots[0]);
          } else {
            setNewSlot('');
          }
        })
        .finally(() => setSlotsLoading(false));
    }
  }, [activeModal, newDate]);

  const handleConfirm = async (id: string) => {
    if (!window.confirm('Confirm this consultation appointment?')) return;
    try {
      await updateAppointmentApi(id, { status: 'Confirmed' });
      fetchAppointments();
    } catch (err: any) {
      alert(err.message || 'Failed to confirm appointment');
    }
  };

  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModal || !newDate || !newSlot) return;

    setActionLoading(true);
    try {
      await updateAppointmentApi(activeModal.appointment.id, {
        status: 'Rescheduled',
        date: newDate,
        timeSlot: newSlot,
        rescheduleReason: rescheduleReason.trim() || undefined,
      });
      setActiveModal(null);
      fetchAppointments();
    } catch (err: any) {
      alert(err.message || 'Failed to reschedule appointment');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModal) return;

    setActionLoading(true);
    try {
      await updateAppointmentApi(activeModal.appointment.id, {
        status: 'Cancelled',
        cancellationReason: cancellationReason.trim() || undefined,
      });
      setActiveModal(null);
      fetchAppointments();
    } catch (err: any) {
      alert(err.message || 'Failed to cancel appointment');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Requested':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Confirmed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Rescheduled':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Completed':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'video':
        return <Video className="w-3.5 h-3.5 text-blue-600" />;
      case 'in_person':
        return <Building className="w-3.5 h-3.5 text-purple-600" />;
      default:
        return <Phone className="w-3.5 h-3.5 text-emerald-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-navy tracking-tight">
            Consultation Appointments
          </h1>
          <p className="text-xs sm:text-sm text-brand-slate mt-0.5">
            Manage scheduled meetings, verify availability, confirm and reschedule slots
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-brand-border shadow-subtle flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {['ALL', 'Requested', 'Confirmed', 'Rescheduled', 'Cancelled', 'Completed'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                statusFilter === s
                  ? 'bg-brand-navy text-white shadow-xs'
                  : 'bg-brand-ivory text-brand-slate hover:bg-gray-200'
              }`}
            >
              {s === 'ALL' ? 'All Appointments' : s}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-1.5 bg-brand-ivory border border-brand-border rounded-lg text-xs text-brand-navy"
          />
          {dateFilter && (
            <button
              onClick={() => setDateFilter('')}
              className="text-xs text-brand-slate hover:text-brand-navy underline"
            >
              Clear Date
            </button>
          )}
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-xl border border-brand-border shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-brand-ivory/80 border-b border-brand-border text-brand-slate font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Date &amp; Slot</th>
                <th className="py-3.5 px-4">Applicant &amp; Reference</th>
                <th className="py-3.5 px-4">Loan Requirement</th>
                <th className="py-3.5 px-4">Mode</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-brand-slate">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-brand-teal mb-2" />
                    <span>Loading appointments...</span>
                  </td>
                </tr>
              ) : appointments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-brand-slate">
                    No appointments found matching current filters.
                  </td>
                </tr>
              ) : (
                appointments.map((appt) => (
                  <tr key={appt.id} className="hover:bg-brand-ivory/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-brand-navy text-xs">{appt.date}</div>
                      <div className="text-[11px] text-brand-slate flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-brand-teal" />
                        <span>{appt.timeSlot}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-brand-navy block">
                        {appt.enquiry?.fullName || 'N/A'}
                      </span>
                      <span className="font-mono text-[11px] text-brand-teal block">
                        {appt.enquiry?.referenceNumber}
                      </span>
                      <span className="text-[11px] text-brand-slate">
                        {appt.enquiry?.mobileNumber}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-brand-navy font-medium">
                      {appt.enquiry?.loanType || 'N/A'}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 capitalize font-medium text-brand-navy">
                        {getModeIcon(appt.meetingMode)}
                        <span>{appt.meetingMode.replace('_', ' ')}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusBadge(
                          appt.status
                        )}`}
                      >
                        {appt.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                      {appt.status === 'Requested' && (
                        <button
                          onClick={() => handleConfirm(appt.id)}
                          className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded font-semibold text-[11px] transition-colors"
                        >
                          Confirm
                        </button>
                      )}
                      {appt.status !== 'Cancelled' && appt.status !== 'Completed' && (
                        <>
                          <button
                            onClick={() => {
                              setActiveModal({ type: 'reschedule', appointment: appt });
                              setNewDate(appt.date);
                              setNewSlot(appt.timeSlot);
                              setRescheduleReason('');
                            }}
                            className="px-2.5 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 rounded font-semibold text-[11px] transition-colors"
                          >
                            Reschedule
                          </button>
                          <button
                            onClick={() => {
                              setActiveModal({ type: 'cancel', appointment: appt });
                              setCancellationReason('');
                            }}
                            className="px-2.5 py-1 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 rounded font-semibold text-[11px] transition-colors"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RESCHEDULE MODAL */}
      {activeModal?.type === 'reschedule' && (
        <div className="fixed inset-0 z-50 bg-brand-navy/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-modal border border-brand-border animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-brand-border">
              <h3 className="font-bold text-base text-brand-navy">Reschedule Consultation</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="text-brand-slate hover:text-brand-navy"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRescheduleSubmit} className="mt-4 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-semibold text-brand-navy mb-1">New Date</label>
                <input
                  type="date"
                  required
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full p-2 bg-brand-ivory border border-brand-border rounded-lg text-brand-navy"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-navy mb-1">Available Slot</label>
                {slotsLoading ? (
                  <div className="p-2 border border-brand-border rounded-lg text-xs text-brand-slate">
                    Checking slot availability...
                  </div>
                ) : availableSlots.length > 0 ? (
                  <select
                    value={newSlot}
                    onChange={(e) => setNewSlot(e.target.value)}
                    className="w-full p-2 bg-brand-ivory border border-brand-border rounded-lg text-brand-navy"
                  >
                    {availableSlots.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="p-2 text-xs text-amber-700 bg-amber-50 rounded border border-amber-200">
                    No available slots on this date
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-navy mb-1">Reason for Rescheduling</label>
                <input
                  type="text"
                  placeholder="e.g. Client requested evening slot / Consultant traveling..."
                  value={rescheduleReason}
                  onChange={(e) => setRescheduleReason(e.target.value)}
                  className="w-full p-2 bg-brand-ivory border border-brand-border rounded-lg text-brand-navy"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 border border-brand-border rounded-lg text-xs font-semibold text-brand-slate hover:bg-brand-ivory"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={actionLoading || !newSlot}
                  className="px-4 py-2 bg-brand-teal hover:bg-brand-teal-hover disabled:bg-gray-300 text-white rounded-lg text-xs font-semibold"
                >
                  {actionLoading ? 'Saving...' : 'Confirm Reschedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CANCEL MODAL */}
      {activeModal?.type === 'cancel' && (
        <div className="fixed inset-0 z-50 bg-brand-navy/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-modal border border-brand-border animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-brand-border">
              <h3 className="font-bold text-base text-brand-navy">Cancel Appointment</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="text-brand-slate hover:text-brand-navy"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCancelSubmit} className="mt-4 space-y-4 text-xs sm:text-sm">
              <p className="text-xs text-brand-slate">
                Are you sure you want to cancel the appointment for{' '}
                <span className="font-semibold text-brand-navy">{activeModal.appointment.enquiry?.fullName}</span>?
              </p>

              <div>
                <label className="block text-xs font-semibold text-brand-navy mb-1">Cancellation Reason</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Client unresponsive / Duplicate appointment requested..."
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  className="w-full p-2 bg-brand-ivory border border-brand-border rounded-lg text-brand-navy resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 border border-brand-border rounded-lg text-xs font-semibold text-brand-slate hover:bg-brand-ivory"
                >
                  Keep Appointment
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold"
                >
                  {actionLoading ? 'Cancelling...' : 'Confirm Cancellation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
