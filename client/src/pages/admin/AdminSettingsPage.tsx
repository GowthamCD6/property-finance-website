import React, { useState, useEffect } from 'react';
import {
  Clock,
  Calendar,
  AlertCircle,
  CheckCircle,
  Plus,
  Trash2,
  Loader2,
  Shield,
  Globe,
} from 'lucide-react';
import { WeeklyConfig, BlockedDate } from '../../types';
import {
  getAvailabilitySettingsApi,
  updateWeeklyScheduleApi,
  blockDateApi,
  unblockDateApi,
} from '../../services/api';

export const AdminSettingsPage: React.FC = () => {
  const [weeklyConfigs, setWeeklyConfigs] = useState<WeeklyConfig[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [loading, setLoading] = useState(true);

  // New blocked date form
  const [newBlockedDate, setNewBlockedDate] = useState('');
  const [newBlockedReason, setNewBlockedReason] = useState('');
  const [blocking, setBlocking] = useState(false);

  const fetchSettings = () => {
    setLoading(true);
    getAvailabilitySettingsApi()
      .then((data) => {
        setWeeklyConfigs(data.weeklyConfigs);
        setBlockedDates(data.blockedDates);
      })
      .catch((err) => console.error('Error fetching settings:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleToggleDay = async (id: string, currentVal: boolean) => {
    try {
      await updateWeeklyScheduleApi(id, { isAvailable: !currentVal });
      fetchSettings();
    } catch (err: any) {
      alert(err.message || 'Failed to update schedule');
    }
  };

  const handleBlockDateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlockedDate) return;

    setBlocking(true);
    try {
      await blockDateApi(newBlockedDate, newBlockedReason.trim() || 'Office Holiday');
      setNewBlockedDate('');
      setNewBlockedReason('');
      fetchSettings();
    } catch (err: any) {
      alert(err.message || 'Failed to block date');
    } finally {
      setBlocking(false);
    }
  };

  const handleUnblockDate = async (date: string) => {
    try {
      await unblockDateApi(date);
      fetchSettings();
    } catch (err: any) {
      alert(err.message || 'Failed to unblock date');
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
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-brand-navy tracking-tight">
          Consultation Availability &amp; Calendar Settings
        </h1>
        <p className="text-xs sm:text-sm text-brand-slate mt-0.5">
          Configure weekly operational days, business hours, and holiday blackout dates
        </p>
      </div>

      {/* Timezone & Rules Badge */}
      <div className="p-4 bg-brand-teal-light rounded-xl border border-brand-teal/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-brand-navy">
        <div className="flex items-center gap-2 font-semibold">
          <Globe className="w-4 h-4 text-brand-teal" />
          <span>Configured Consultation Timezone: Asia/Kolkata (IST, UTC+5:30)</span>
        </div>
        <span className="text-brand-slate">
          Automated double-booking prevention is active across all channels
        </span>
      </div>

      {/* WEEKLY SCHEDULE */}
      <div className="bg-white rounded-xl p-6 border border-brand-border shadow-subtle space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-brand-border text-brand-navy">
          <Clock className="w-5 h-5 text-brand-teal" />
          <h3 className="text-base font-bold">Weekly Consultation Schedule</h3>
        </div>

        <div className="space-y-3">
          {weeklyConfigs.map((cfg) => (
            <div
              key={cfg.id}
              className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm transition-colors ${
                cfg.isAvailable
                  ? 'bg-white border-brand-border'
                  : 'bg-gray-50 border-gray-200 text-gray-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleToggleDay(cfg.id, cfg.isAvailable)}
                  className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${
                    cfg.isAvailable ? 'bg-brand-teal' : 'bg-gray-300'
                  }`}
                  aria-label="Toggle availability"
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      cfg.isAvailable ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
                <span className="font-bold text-brand-navy w-24">{cfg.dayName}</span>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded ${
                    cfg.isAvailable ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {cfg.isAvailable ? 'Consultations Active' : 'Closed'}
                </span>
              </div>

              {cfg.isAvailable ? (
                <div className="flex items-center gap-2 text-xs font-medium text-brand-slate">
                  <span>Hours: {cfg.startTime} – {cfg.endTime}</span>
                  <span className="text-gray-300">•</span>
                  <span>Slots: {cfg.slotDurationMinutes} mins</span>
                </div>
              ) : (
                <span className="text-xs text-brand-slate italic">No bookings accepted</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* HOLIDAY BLACKOUT DATES */}
      <div className="bg-white rounded-xl p-6 border border-brand-border shadow-subtle space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-brand-border text-brand-navy">
          <Calendar className="w-5 h-5 text-brand-teal" />
          <h3 className="text-base font-bold">Blocked Dates &amp; Public Holidays</h3>
        </div>

        {/* Add Block Date Form */}
        <form onSubmit={handleBlockDateSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="date"
            required
            value={newBlockedDate}
            onChange={(e) => setNewBlockedDate(e.target.value)}
            className="p-2.5 bg-brand-ivory border border-brand-border rounded-lg text-xs sm:text-sm text-brand-navy"
          />
          <input
            type="text"
            required
            placeholder="Reason (e.g. Diwali / Republic Day / Annual Audit)"
            value={newBlockedReason}
            onChange={(e) => setNewBlockedReason(e.target.value)}
            className="flex-1 p-2.5 bg-brand-ivory border border-brand-border rounded-lg text-xs sm:text-sm text-brand-navy"
          />
          <button
            type="submit"
            disabled={blocking || !newBlockedDate}
            className="px-4 py-2.5 bg-brand-teal hover:bg-brand-teal-hover disabled:bg-gray-300 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Block Date</span>
          </button>
        </form>

        {/* Blocked Dates List */}
        <div className="space-y-2 pt-2">
          {blockedDates.length === 0 ? (
            <p className="text-xs text-brand-slate py-3 text-center italic">
              No holiday dates are currently blocked.
            </p>
          ) : (
            blockedDates.map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between p-3 bg-brand-ivory rounded-lg border border-brand-border text-xs text-brand-navy"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold">{b.date}</span>
                  <span className="text-brand-slate font-medium">{b.reason}</span>
                </div>
                <button
                  onClick={() => handleUnblockDate(b.date)}
                  className="text-red-600 hover:text-red-800 p-1 rounded"
                  title="Unblock date"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
