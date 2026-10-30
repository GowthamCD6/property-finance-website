import React, { useState, useEffect } from 'react';
import {
  Clock,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Plus,
  Trash2,
  Loader2,
  Shield,
  Globe,
  CalendarOff,
  Check,
  Zap,
  Copy,
  Save,
  RotateCcw,
  Sliders,
} from 'lucide-react';
import { WeeklyConfig, BlockedDate } from '../../types';
import {
  getAvailabilitySettingsApi,
  updateWeeklyScheduleApi,
  bulkUpdateWeeklyScheduleApi,
  blockDateApi,
  unblockDateApi,
} from '../../services/api';

const TIME_OPTIONS = [
  '08:00',
  '08:30',
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '18:30',
  '19:00',
  '19:30',
  '20:00',
  '21:00',
];

const DURATION_OPTIONS = [
  { value: 30, label: '30 mins / slot' },
  { value: 45, label: '45 mins / slot' },
  { value: 60, label: '60 mins / slot' },
  { value: 90, label: '90 mins / slot' },
];

export const AdminSettingsPage: React.FC = () => {
  const [weeklyConfigs, setWeeklyConfigs] = useState<WeeklyConfig[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [loading, setLoading] = useState(true);

  // Editable day state map: id -> { isAvailable, startTime, endTime, slotDurationMinutes, isSaving, savedSuccess }
  const [editMap, setEditMap] = useState<
    Record<
      string,
      {
        isAvailable: boolean;
        startTime: string;
        endTime: string;
        slotDurationMinutes: number;
        isSaving?: boolean;
        savedSuccess?: boolean;
      }
    >
  >({});

  // New blocked date form
  const [newBlockedDate, setNewBlockedDate] = useState('');
  const [newBlockedReason, setNewBlockedReason] = useState('');
  const [blockedCategory, setBlockedCategory] = useState('National Holiday');
  const [blocking, setBlocking] = useState(false);
  const [bulkSaving, setBulkSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchSettings = () => {
    setLoading(true);
    getAvailabilitySettingsApi()
      .then((data) => {
        setWeeklyConfigs(data.weeklyConfigs);
        setBlockedDates(data.blockedDates);

        // Initialize edit map
        const initialMap: typeof editMap = {};
        data.weeklyConfigs.forEach((c) => {
          initialMap[c.id] = {
            isAvailable: c.isAvailable,
            startTime: c.startTime || '10:00',
            endTime: c.endTime || '18:00',
            slotDurationMinutes: c.slotDurationMinutes || 60,
          };
        });
        setEditMap(initialMap);
      })
      .catch((err) => console.error('Error fetching settings:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleToggleDay = (id: string) => {
    setEditMap((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        isAvailable: !prev[id]?.isAvailable,
      },
    }));
  };

  const handleTimeChange = (id: string, field: 'startTime' | 'endTime', val: string) => {
    setEditMap((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: val,
      },
    }));
  };

  const handleDurationChange = (id: string, val: number) => {
    setEditMap((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        slotDurationMinutes: val,
      },
    }));
  };

  // Save specific day configuration
  const handleSaveDay = async (id: string, dayName: string) => {
    const config = editMap[id];
    if (!config) return;

    setEditMap((prev) => ({
      ...prev,
      [id]: { ...prev[id], isSaving: true, savedSuccess: false },
    }));

    try {
      await updateWeeklyScheduleApi(id, {
        isAvailable: config.isAvailable,
        startTime: config.startTime,
        endTime: config.endTime,
        slotDurationMinutes: config.slotDurationMinutes,
      });

      setEditMap((prev) => ({
        ...prev,
        [id]: { ...prev[id], isSaving: false, savedSuccess: true },
      }));

      showToast(`Updated schedule for ${dayName} successfully!`);
      setTimeout(() => {
        setEditMap((prev) => ({
          ...prev,
          [id]: { ...prev[id], savedSuccess: false },
        }));
      }, 2500);
    } catch (err: any) {
      alert(err.message || `Failed to update schedule for ${dayName}`);
      setEditMap((prev) => ({
        ...prev,
        [id]: { ...prev[id], isSaving: false },
      }));
    }
  };

  // Quick Preset: Corporate Standard (10 AM - 6 PM, 60m)
  const applyPresetCorporate = async () => {
    setBulkSaving(true);
    try {
      const updatedConfigs = weeklyConfigs.map((cfg) => ({
        id: cfg.id,
        isAvailable: cfg.dayOfWeek !== 0, // Sunday closed
        startTime: '10:00',
        endTime: cfg.dayOfWeek === 6 ? '14:00' : '18:00', // Saturday half day
        slotDurationMinutes: 60,
      }));

      await bulkUpdateWeeklyScheduleApi(updatedConfigs);
      fetchSettings();
      showToast('Corporate standard hours (10 AM – 6 PM) applied to all weekdays!');
    } catch (err: any) {
      alert(err.message || 'Failed to apply preset');
    } finally {
      setBulkSaving(false);
    }
  };

  // Quick Preset: Extended Advisory (9 AM - 8 PM, 45m)
  const applyPresetExtended = async () => {
    setBulkSaving(true);
    try {
      const updatedConfigs = weeklyConfigs.map((cfg) => ({
        id: cfg.id,
        isAvailable: cfg.dayOfWeek !== 0,
        startTime: '09:00',
        endTime: '20:00',
        slotDurationMinutes: 45,
      }));

      await bulkUpdateWeeklyScheduleApi(updatedConfigs);
      fetchSettings();
      showToast('Extended advisory hours (9 AM – 8 PM) applied!');
    } catch (err: any) {
      alert(err.message || 'Failed to apply preset');
    } finally {
      setBulkSaving(false);
    }
  };

  // Quick Action: Copy Monday's Schedule to All Weekdays (Mon - Fri)
  const copyMondayToWeekdays = async () => {
    const mondayConfig = weeklyConfigs.find((c) => c.dayOfWeek === 1);
    if (!mondayConfig) return;
    const monState = editMap[mondayConfig.id];
    if (!monState) return;

    setBulkSaving(true);
    try {
      const updatedConfigs = weeklyConfigs
        .filter((c) => c.dayOfWeek >= 1 && c.dayOfWeek <= 5)
        .map((c) => ({
          id: c.id,
          isAvailable: monState.isAvailable,
          startTime: monState.startTime,
          endTime: monState.endTime,
          slotDurationMinutes: monState.slotDurationMinutes,
        }));

      await bulkUpdateWeeklyScheduleApi(updatedConfigs);
      fetchSettings();
      showToast("Copied Monday's hours and slot duration across Tuesday to Friday!");
    } catch (err: any) {
      alert(err.message || 'Failed to copy schedule');
    } finally {
      setBulkSaving(false);
    }
  };

  const handleBlockDateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlockedDate) return;

    setBlocking(true);
    try {
      const fullReason = `${newBlockedReason.trim() || 'Office Holiday'} [${blockedCategory}]`;
      await blockDateApi(newBlockedDate, fullReason);
      setNewBlockedDate('');
      setNewBlockedReason('');
      fetchSettings();
      showToast(`Date ${newBlockedDate} added to holiday blackout schedule!`);
    } catch (err: any) {
      alert(err.message || 'Failed to block date');
    } finally {
      setBlocking(false);
    }
  };

  const handleUnblockDate = async (date: string) => {
    if (!window.confirm(`Unblock date ${date} to allow customer bookings?`)) return;
    try {
      await unblockDateApi(date);
      fetchSettings();
      showToast(`Date ${date} has been unblocked.`);
    } catch (err: any) {
      alert(err.message || 'Failed to unblock date');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-28 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
        <span className="text-xs text-slate-500 font-sans">Loading calendar availability settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#0c1a26] text-white px-4 py-3 rounded-2xl shadow-xl border border-teal-500/30 flex items-center gap-2.5 text-xs font-heading font-bold animate-in slide-in-from-top duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0c1a26] tracking-tight font-heading">
          Consultation Availability &amp; Calendar Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-sans">
          Configure weekly operational days, business hours, and holiday blackout dates for applicant appointments
        </p>
      </div>

      {/* Timezone Card */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2.5 font-semibold text-[#0c1a26]">
          <Globe className="w-4 h-4 text-teal-600" />
          <span>Configured Timezone: Asia/Kolkata (IST, UTC+5:30)</span>
        </div>
        <span className="text-slate-500 font-sans">
          Automated slot validation prevents duplicate consultations across all channels
        </span>
      </div>

      {/* QUICK PRESETS TOOLBAR */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold font-heading text-slate-500 uppercase tracking-wider">
          <Zap className="w-4 h-4 text-amber-500" />
          <span>One-Click Corporate Availability Presets</span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            disabled={bulkSaving}
            onClick={applyPresetCorporate}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 hover:bg-teal-50 hover:border-teal-300 border border-slate-200 rounded-xl text-xs font-bold font-heading text-[#0c1a26] transition-all cursor-pointer shadow-2xs active:scale-[0.98]"
          >
            <span>🏢 Standard Corporate (10 AM – 6 PM)</span>
          </button>

          <button
            type="button"
            disabled={bulkSaving}
            onClick={applyPresetExtended}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 hover:bg-teal-50 hover:border-teal-300 border border-slate-200 rounded-xl text-xs font-bold font-heading text-[#0c1a26] transition-all cursor-pointer shadow-2xs active:scale-[0.98]"
          >
            <span>⚡ Extended Hours (9 AM – 8 PM)</span>
          </button>

          <button
            type="button"
            disabled={bulkSaving}
            onClick={copyMondayToWeekdays}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl text-xs font-bold font-heading text-teal-800 transition-all cursor-pointer shadow-2xs active:scale-[0.98]"
          >
            <Copy className="w-3.5 h-3.5 text-teal-600" />
            <span>Apply Monday's Hours to All Weekdays</span>
          </button>
        </div>
      </div>

      {/* WEEKLY SCHEDULE: INTERACTIVE DAY-BY-DAY EDITOR */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3.5 border-b border-slate-100 gap-2">
          <div className="flex items-center gap-2.5 text-[#0c1a26]">
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-100">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold font-heading">Weekly Consultation Schedule &amp; Slots</h3>
              <p className="text-xs text-slate-500 font-sans">Specify active status, start &amp; end hours, and consultation duration per day</p>
            </div>
          </div>
        </div>

        <div className="space-y-3.5">
          {weeklyConfigs.map((cfg) => {
            const current = editMap[cfg.id] || {
              isAvailable: cfg.isAvailable,
              startTime: cfg.startTime || '10:00',
              endTime: cfg.endTime || '18:00',
              slotDurationMinutes: cfg.slotDurationMinutes || 60,
            };

            return (
              <div
                key={cfg.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  current.isAvailable
                    ? 'bg-white border-slate-200 hover:border-teal-300 shadow-2xs'
                    : 'bg-slate-50/70 border-slate-200/80 text-slate-400'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Day & Toggle */}
                  <div className="flex items-center gap-3.5">
                    <button
                      type="button"
                      onClick={() => handleToggleDay(cfg.id)}
                      className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                        current.isAvailable ? 'bg-teal-600' : 'bg-slate-300'
                      }`}
                      aria-label="Toggle availability"
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          current.isAvailable ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-[#0c1a26] font-heading text-sm">
                          {cfg.dayName}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-heading ${
                            current.isAvailable
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {current.isAvailable ? '● Active' : 'Closed'}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 block font-sans mt-0.5">
                        {current.isAvailable ? 'Accepting customer bookings' : 'No appointments accepted'}
                      </span>
                    </div>
                  </div>

                  {/* Right: Interactive Specific Controls */}
                  {current.isAvailable ? (
                    <div className="flex flex-wrap items-center gap-3 pt-2 lg:pt-0">
                      {/* Start Time */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-bold text-slate-500 font-heading">Start:</span>
                        <select
                          value={current.startTime}
                          onChange={(e) => handleTimeChange(cfg.id, 'startTime', e.target.value)}
                          className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-[#0c1a26] focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                        >
                          {TIME_OPTIONS.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </div>

                      <span className="text-slate-300 font-bold">&rarr;</span>

                      {/* End Time */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-bold text-slate-500 font-heading">End:</span>
                        <select
                          value={current.endTime}
                          onChange={(e) => handleTimeChange(cfg.id, 'endTime', e.target.value)}
                          className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-[#0c1a26] focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                        >
                          {TIME_OPTIONS.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Slot Duration */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-bold text-slate-500 font-heading">Slot:</span>
                        <select
                          value={current.slotDurationMinutes}
                          onChange={(e) => handleDurationChange(cfg.id, Number(e.target.value))}
                          className="px-2.5 py-1.5 bg-teal-50/70 border border-teal-200 rounded-xl text-xs font-bold text-teal-800 font-mono focus:bg-white focus:outline-none"
                        >
                          {DURATION_OPTIONS.map((d) => (
                            <option key={d.value} value={d.value}>
                              {d.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Save Button */}
                      <button
                        type="button"
                        disabled={current.isSaving}
                        onClick={() => handleSaveDay(cfg.id, cfg.dayName)}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold font-heading transition-all shadow-xs cursor-pointer active:scale-[0.98] ${
                          current.savedSuccess
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#0c1a26] hover:bg-slate-800 text-white'
                        }`}
                      >
                        {current.isSaving ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Saving...</span>
                          </>
                        ) : current.savedSuccess ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Saved!</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-3.5 h-3.5" />
                            <span>Save</span>
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400 italic font-sans">
                        Consultations closed on {cfg.dayName}s
                      </span>
                      <button
                        type="button"
                        onClick={() => handleSaveDay(cfg.id, cfg.dayName)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold font-heading transition-colors"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Closed</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* HOLIDAY BLACKOUT DATES */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center gap-2.5 pb-3.5 border-b border-slate-100 text-[#0c1a26]">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100">
            <CalendarOff className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-extrabold font-heading">Blocked Dates &amp; Public Holidays</h3>
            <p className="text-xs text-slate-500 font-sans">Disable appointment bookings on festival days, bank holidays, and office closures</p>
          </div>
        </div>

        {/* Add Block Date Form */}
        <form onSubmit={handleBlockDateSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="date"
            required
            value={newBlockedDate}
            onChange={(e) => setNewBlockedDate(e.target.value)}
            className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-[#0c1a26] font-semibold focus:bg-white"
          />

          <select
            value={blockedCategory}
            onChange={(e) => setBlockedCategory(e.target.value)}
            className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-[#0c1a26] font-semibold focus:bg-white"
          >
            <option value="National Holiday">🏛️ National Holiday</option>
            <option value="Regional Festival">🪔 Regional Festival (TN)</option>
            <option value="Bank Strike / Closure">🏦 Bank Strike / Closure</option>
            <option value="Annual Audit / System Maintenance">🔒 Office Maintenance / Audit</option>
          </select>

          <input
            type="text"
            required
            placeholder="Holiday Title (e.g. Diwali / Pongal / Republic Day)"
            value={newBlockedReason}
            onChange={(e) => setNewBlockedReason(e.target.value)}
            className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-[#0c1a26] focus:bg-white placeholder:text-slate-400"
          />

          <button
            type="submit"
            disabled={blocking || !newBlockedDate}
            className="px-5 py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold font-heading shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>{blocking ? 'Blocking...' : 'Block Date'}</span>
          </button>
        </form>

        {/* Blocked Dates List */}
        <div className="space-y-2 pt-2">
          {blockedDates.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs font-sans">
              No holiday blackout dates are currently configured.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {blockedDates.map((b) => {
                const dateObj = new Date(b.date);
                const dayName = isNaN(dateObj.getTime())
                  ? ''
                  : dateObj.toLocaleDateString('en-IN', { weekday: 'short' });

                return (
                  <div
                    key={b.id}
                    className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-[#0c1a26] shadow-2xs hover:border-slate-300 transition-colors"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-teal-800">
                          {b.date} {dayName && `(${dayName})`}
                        </span>
                      </div>
                      <span className="text-slate-700 font-semibold block pt-0.5">{b.reason}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleUnblockDate(b.date)}
                      className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-white transition-colors cursor-pointer"
                      title="Unblock date"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
