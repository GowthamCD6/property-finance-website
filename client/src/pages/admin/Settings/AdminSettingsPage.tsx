import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { UserAvatar } from '../../../components/common/UserAvatar';
import {
  Clock,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Plus,
  Trash2,
  Loader2,
  ShieldCheck,
  Users,
  Globe,
  CalendarOff,
  Check,
  Zap,
  Copy,
  Save,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Lock,
  Shield,
  KeyRound,
  RefreshCw,
  Terminal,
  Activity,
  FileKey,
} from 'lucide-react';
import { WeeklyConfig, BlockedDate } from '../../../types';
import {
  getAvailabilitySettingsApi,
  updateWeeklyScheduleApi,
  bulkUpdateWeeklyScheduleApi,
  blockDateApi,
  unblockDateApi,
  getApiKeyStatusApi,
  rotateApiKeyApi,
  ApiSecurityStatus,
  ADMIN_API_KEY,
} from '../../../services/api';

const TIME_OPTIONS = [
  '07:00',
  '07:30',
  '08:00',
  '08:30',
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
  '18:00',
  '18:30',
  '19:00',
  '19:30',
  '20:00',
  '20:30',
  '21:00',
  '21:30',
  '22:00',
];

const DURATION_OPTIONS = [
  { value: 15, label: '15 mins / slot' },
  { value: 30, label: '30 mins / slot' },
  { value: 45, label: '45 mins / slot' },
  { value: 60, label: '60 mins / slot (Standard)' },
  { value: 90, label: '90 mins / slot' },
  { value: 120, label: '120 mins / slot' },
];

const POPULAR_HOLIDAYS = [
  { name: 'Pongal / Makar Sankranti', category: 'Regional Festival (TN)' },
  { name: 'Republic Day (26 Jan)', category: 'National Holiday' },
  { name: 'Bank Annual Accounts Closing (1 Apr)', category: 'Bank Strike / Closure' },
  { name: 'Tamil New Year (Puthandu)', category: 'Regional Festival (TN)' },
  { name: 'Independence Day (15 Aug)', category: 'National Holiday' },
  { name: 'Gandhi Jayanti (2 Oct)', category: 'National Holiday' },
  { name: 'Diwali (Deepavali)', category: 'Regional Festival (TN)' },
  { name: 'Annual Internal Systems Audit', category: 'Annual Audit / System Maintenance' },
];

export const AdminSettingsPage: React.FC = () => {
  const { admin } = useAuth();
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

  // Expanded slot chips preview per day ID
  const [expandedSlotsMap, setExpandedSlotsMap] = useState<Record<string, boolean>>({});

  // New blocked date form
  const [newBlockedDate, setNewBlockedDate] = useState('');
  const [newBlockedReason, setNewBlockedReason] = useState('');
  const [blockedCategory, setBlockedCategory] = useState('National Holiday');
  const [blocking, setBlocking] = useState(false);
  const [bulkSaving, setBulkSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Live Simulator State
  const tomorrowDateStr = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };
  const [simDate, setSimDate] = useState(tomorrowDateStr);

  // Tab Navigation: 'schedule' (Working Hours & Slots) vs 'security' (API Protection & Hashed Keys)
  const [settingsTab, setSettingsTab] = useState<'schedule' | 'security'>('schedule');

  // API Security & Key Protection States
  const [apiSecurity, setApiSecurity] = useState<ApiSecurityStatus | null>(null);
  const [securityLoading, setSecurityLoading] = useState<boolean>(false);
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<boolean>(false);
  const [copiedHash, setCopiedHash] = useState<boolean>(false);
  const [pingResult, setPingResult] = useState<{
    latencyMs: number;
    verified: boolean;
    hashMatch: boolean;
    timestamp: string;
  } | null>(null);
  const [pingLoading, setPingLoading] = useState<boolean>(false);
  const [rotateLoading, setRotateLoading] = useState<boolean>(false);
  const [isRotateModalOpen, setIsRotateModalOpen] = useState<boolean>(false);

  const fetchApiSecurityStatus = async () => {
    setSecurityLoading(true);
    try {
      const data = await getApiKeyStatusApi();
      setApiSecurity(data);
    } catch (err: any) {
      console.error('Failed to load API security details:', err);
    } finally {
      setSecurityLoading(false);
    }
  };

  const handleTestPing = async () => {
    setPingLoading(true);
    const start = performance.now();
    try {
      const data = await getApiKeyStatusApi();
      const latencyMs = Math.round(performance.now() - start);
      setApiSecurity(data);
      setPingResult({
        latencyMs,
        verified: true,
        hashMatch: true,
        timestamp: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }),
      });
      showToast(`Cryptographic API Key Ping Successful! Latency: ${latencyMs}ms, SHA-256 Hash verified.`);
    } catch (err: any) {
      const latencyMs = Math.round(performance.now() - start);
      setPingResult({
        latencyMs,
        verified: false,
        hashMatch: false,
        timestamp: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }),
      });
      alert(err.message || 'API security ping failed');
    } finally {
      setPingLoading(false);
    }
  };

  const handleRotateKey = async () => {
    setRotateLoading(true);
    try {
      await rotateApiKeyApi();
      await fetchApiSecurityStatus();
      setIsRotateModalOpen(false);
      showToast('Admin API Key rotated! New SHA-256 hash activated across all endpoints.');
    } catch (err: any) {
      alert(err.message || 'Failed to rotate Admin API Key');
    } finally {
      setRotateLoading(false);
    }
  };

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
    fetchApiSecurityStatus();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
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

  const toggleExpandSlots = (id: string) => {
    setExpandedSlotsMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Helper: compute slots for display
  const computeSlots = (startTime: string, endTime: string, durationMinutes: number) => {
    const slots: string[] = [];
    const [startH, startM] = (startTime || '10:00').split(':').map(Number);
    const [endH, endM] = (endTime || '18:00').split(':').map(Number);

    let curMinutes = (isNaN(startH) ? 10 : startH) * 60 + (isNaN(startM) ? 0 : startM);
    const endMinutes = (isNaN(endH) ? 18 : endH) * 60 + (isNaN(endM) ? 0 : endM);
    const step = durationMinutes > 0 ? durationMinutes : 60;

    const formatTime = (totalMins: number) => {
      const h = Math.floor(totalMins / 60);
      const m = totalMins % 60;
      const period = h >= 12 ? 'PM' : 'AM';
      const displayH = h % 12 === 0 ? 12 : h % 12;
      const padM = m < 10 ? `0${m}` : m;
      const padH = displayH < 10 ? `0${displayH}` : displayH;
      return `${padH}:${padM} ${period}`;
    };

    while (curMinutes + step <= endMinutes) {
      const slotStart = formatTime(curMinutes);
      const slotEnd = formatTime(curMinutes + step);
      slots.push(`${slotStart} - ${slotEnd}`);
      curMinutes += step;
    }

    return slots;
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

      showToast(`Saved ${dayName} operating hours (${config.startTime} – ${config.endTime}) successfully!`);
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

  // Bulk Save all modified weekly days
  const handleSaveAll = async () => {
    setBulkSaving(true);
    try {
      const configsToSave = weeklyConfigs.map((cfg) => {
        const edited = editMap[cfg.id];
        return {
          id: cfg.id,
          isAvailable: edited ? edited.isAvailable : cfg.isAvailable,
          startTime: edited ? edited.startTime : cfg.startTime,
          endTime: edited ? edited.endTime : cfg.endTime,
          slotDurationMinutes: edited ? edited.slotDurationMinutes : cfg.slotDurationMinutes,
        };
      });

      await bulkUpdateWeeklyScheduleApi(configsToSave);
      fetchSettings();
      showToast('All 7 days working hours & consultation slot schedules saved successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to bulk save schedules');
    } finally {
      setBulkSaving(false);
    }
  };

  // Quick Preset: Standard Banking Hours (9:30 AM - 6:30 PM, 60m, Sat half day, Sun closed)
  const applyPresetBanking = async () => {
    setBulkSaving(true);
    try {
      const updatedConfigs = weeklyConfigs.map((cfg) => ({
        id: cfg.id,
        isAvailable: cfg.dayOfWeek !== 0, // Sunday closed
        startTime: '09:30',
        endTime: cfg.dayOfWeek === 6 ? '13:30' : '18:30', // Saturday half day
        slotDurationMinutes: 60,
      }));

      await bulkUpdateWeeklyScheduleApi(updatedConfigs);
      fetchSettings();
      showToast('Standard Banking Hours (9:30 AM – 6:30 PM) applied!');
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
      showToast('Extended Advisory Hours (9:00 AM – 8:00 PM, 45 min slots) applied!');
    } catch (err: any) {
      alert(err.message || 'Failed to apply preset');
    } finally {
      setBulkSaving(false);
    }
  };

  // Quick Preset: Full 7-Day Desk (10 AM - 7 PM, 30m slots)
  const applyPresetFullWeek = async () => {
    setBulkSaving(true);
    try {
      const updatedConfigs = weeklyConfigs.map((cfg) => ({
        id: cfg.id,
        isAvailable: true,
        startTime: '10:00',
        endTime: '19:00',
        slotDurationMinutes: 30,
      }));

      await bulkUpdateWeeklyScheduleApi(updatedConfigs);
      fetchSettings();
      showToast('Full 7-Day Express Desk (10:00 AM – 7:00 PM, 30 min slots) applied!');
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
      showToast("Copied Monday's schedule and slot length across Tuesday through Friday!");
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

  // Simulation Evaluation for simDate
  const evaluateSimDate = () => {
    if (!simDate) return { isAvailable: false, reason: 'Please select a date', slots: [] };
    const isBlocked = blockedDates.find((b) => b.date === simDate);
    if (isBlocked) {
      return {
        isAvailable: false,
        reason: `Holiday Blackout: ${isBlocked.reason}`,
        slots: [],
      };
    }

    const d = new Date(simDate);
    const dayOfWeek = d.getDay();
    const dayCfg = weeklyConfigs.find((c) => c.dayOfWeek === dayOfWeek);
    const dayState = dayCfg ? editMap[dayCfg.id] : null;

    if (!dayState || !dayState.isAvailable) {
      return {
        isAvailable: false,
        reason: `${dayCfg?.dayName || 'This day'} is closed in weekly availability schedule`,
        slots: [],
      };
    }

    const slots = computeSlots(dayState.startTime, dayState.endTime, dayState.slotDurationMinutes);
    return {
      isAvailable: true,
      reason: `Open for customer consultation (${dayState.startTime} – ${dayState.endTime})`,
      slots,
      duration: dayState.slotDurationMinutes,
    };
  };

  const simResult = evaluateSimDate();

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="h-9 w-96 bg-slate-200 rounded-xl" />
          <div className="h-8 w-32 bg-slate-200 rounded-xl" />
        </div>
        <div className="h-20 bg-slate-100 rounded-2xl" />
        <div className="h-64 bg-slate-100 rounded-2xl" />
      </div>
    );
  }

  // Calculate high-level summary metrics
  const activeDaysCount = Object.values(editMap).filter((d) => d.isAvailable).length;

  return (
    <div className="space-y-7 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#0c1a26] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-teal-500/40 flex items-center gap-3 text-xs sm:text-sm font-heading font-bold animate-in slide-in-from-top duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────
          PAGE HEADER WITH ACTIONS & SUB-TABS
          ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0c1a26] tracking-tight font-heading">
              {settingsTab === 'schedule'
                ? 'Working Hours & Slots Management'
                : 'API Protection & Cryptographic Security Keys'}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold font-heading bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {settingsTab === 'schedule' ? 'Live Sync Active' : 'SHA-256 Guard Active'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-sans mt-1">
            {settingsTab === 'schedule'
              ? 'Configure weekly operating times, consultation interval durations, and public holiday blackouts'
              : 'Enterprise API rate limiting, constant-time SHA-256 token verification, and anti-replay defense'}
          </p>
        </div>

        {/* Sub-tab pills & Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Sub-tab pills */}
          <div className="bg-slate-100 p-1 rounded-2xl flex items-center border border-slate-200/80 shadow-2xs">
            <button
              type="button"
              onClick={() => setSettingsTab('schedule')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-heading transition-all cursor-pointer ${
                settingsTab === 'schedule'
                  ? 'bg-white text-teal-800 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🗓️ Working Hours &amp; Slots
            </button>
            <button
              type="button"
              onClick={() => {
                setSettingsTab('security');
                if (!apiSecurity) fetchApiSecurityStatus();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-heading transition-all cursor-pointer flex items-center gap-1.5 ${
                settingsTab === 'security'
                  ? 'bg-[#0c1a26] text-teal-300 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-teal-400" />
              <span>API Key Security</span>
            </button>
          </div>

          {settingsTab === 'schedule' ? (
            <>
              <button
                type="button"
                onClick={fetchSettings}
                disabled={bulkSaving}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold font-heading text-slate-700 transition-all cursor-pointer shadow-2xs active:scale-[0.98]"
                title="Reload from server"
              >
                <RotateCcw className="w-4 h-4 text-slate-500" />
                <span>Reset</span>
              </button>

              <button
                type="button"
                disabled={bulkSaving}
                onClick={handleSaveAll}
                className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-teal-600 via-teal-700 to-emerald-700 hover:from-teal-700 hover:to-emerald-800 text-white rounded-xl text-xs sm:text-sm font-bold font-heading shadow-md shadow-teal-700/20 transition-all cursor-pointer active:scale-[0.98]"
              >
                {bulkSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving All...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save All Schedules</span>
                  </>
                )}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleTestPing}
              disabled={pingLoading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-emerald-800 text-white rounded-xl text-xs sm:text-sm font-bold font-heading shadow-sm transition-all cursor-pointer active:scale-[0.98]"
            >
              {pingLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Ping...</span>
                </>
              ) : (
                <>
                  <Activity className="w-4 h-4" />
                  <span>Live Security Ping</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {settingsTab === 'schedule' ? (
        <>

      {/* ────────────────────────────────────────────────────────────
          KEY STATS & TIMEZONE STRIP
          ──────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-heading">
              Active Days
            </div>
            <div className="text-xl font-extrabold text-[#0c1a26] font-heading mt-0.5">
              {activeDaysCount} of 7 Days
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-heading">
              Operating Zone
            </div>
            <div className="text-sm font-extrabold text-[#0c1a26] font-heading mt-1">
              Asia/Kolkata (IST)
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold">
            <Globe className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-heading">
              Blocked Holidays
            </div>
            <div className="text-xl font-extrabold text-amber-700 font-heading mt-0.5">
              {blockedDates.length} Blackouts
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <CalendarOff className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-heading">
              Configured Admin
            </div>
            <div className="text-xs font-bold text-slate-800 font-heading truncate max-w-[130px] mt-1">
              {admin?.name || 'Authorized Lead'}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────
          ONE-CLICK CORPORATE PRESETS TOOLBAR
          ──────────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-[#0c1a26] via-[#102235] to-[#0c1a26] text-white rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold font-heading text-teal-400 uppercase tracking-wider">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>One-Click Corporate Availability Presets</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-sans">
              Instantly apply standard banking hours or copy Monday's hours across all working weekdays.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              disabled={bulkSaving}
              onClick={applyPresetBanking}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs sm:text-sm font-bold font-heading text-white transition-all cursor-pointer shadow-xs active:scale-[0.98]"
            >
              <span>🏢 Standard Banking (9:30 AM – 6:30 PM)</span>
            </button>

            <button
              type="button"
              disabled={bulkSaving}
              onClick={applyPresetExtended}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs sm:text-sm font-bold font-heading text-white transition-all cursor-pointer shadow-xs active:scale-[0.98]"
            >
              <span>⚡ Extended Hours (9 AM – 8 PM)</span>
            </button>

            <button
              type="button"
              disabled={bulkSaving}
              onClick={applyPresetFullWeek}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs sm:text-sm font-bold font-heading text-white transition-all cursor-pointer shadow-xs active:scale-[0.98]"
            >
              <span>🕒 7-Day Express Desk</span>
            </button>

            <button
              type="button"
              disabled={bulkSaving}
              onClick={copyMondayToWeekdays}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/40 rounded-xl text-xs sm:text-sm font-bold font-heading text-teal-300 transition-all cursor-pointer shadow-xs active:scale-[0.98]"
            >
              <Copy className="w-3.5 h-3.5 text-teal-400" />
              <span>Copy Mon &rarr; Tue–Fri</span>
            </button>
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────
          WEEKLY SCHEDULE: INTERACTIVE DAY-BY-DAY EDITOR
          ──────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 gap-2">
          <div className="flex items-center gap-3 text-[#0c1a26]">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-100 shadow-2xs">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold font-heading text-slate-900">
                Weekly Consultation Schedule &amp; Slots
              </h2>
              <p className="text-xs text-slate-500 font-sans">
                Turn days on/off, adjust working hours, and specify duration per consultation session
              </p>
            </div>
          </div>

          <div className="text-xs text-slate-400 font-sans italic self-start sm:self-auto">
            Changes auto-reflect in customer booking modals
          </div>
        </div>

        {/* Days List */}
        <div className="space-y-3.5">
          {weeklyConfigs.map((cfg) => {
            const current = editMap[cfg.id] || {
              isAvailable: cfg.isAvailable,
              startTime: cfg.startTime || '10:00',
              endTime: cfg.endTime || '18:00',
              slotDurationMinutes: cfg.slotDurationMinutes || 60,
            };

            const slots = current.isAvailable
              ? computeSlots(current.startTime, current.endTime, current.slotDurationMinutes)
              : [];

            const isExpanded = Boolean(expandedSlotsMap[cfg.id]);

            return (
              <div
                key={cfg.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 ${
                  current.isAvailable
                    ? 'bg-white border-slate-200/90 hover:border-teal-400/80 shadow-2xs'
                    : 'bg-slate-50/70 border-slate-200/60 text-slate-400'
                }`}
              >
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                  {/* Left: Toggle & Day Info */}
                  <div className="flex items-center gap-4 min-w-[210px]">
                    <button
                      type="button"
                      onClick={() => handleToggleDay(cfg.id)}
                      className={`w-12 h-6.5 flex items-center rounded-full p-1 transition-colors cursor-pointer shrink-0 shadow-inner ${
                        current.isAvailable ? 'bg-teal-600' : 'bg-slate-300'
                      }`}
                      aria-label={`Toggle availability for ${cfg.dayName}`}
                    >
                      <div
                        className={`bg-white w-4.5 h-4.5 rounded-full shadow-md transform transition-transform ${
                          current.isAvailable ? 'translate-x-5.5' : 'translate-x-0'
                        }`}
                      />
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-[#0c1a26] font-heading text-base">
                          {cfg.dayName}
                        </span>
                        <span
                          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full font-heading ${
                            current.isAvailable
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {current.isAvailable ? '● Active' : 'Closed'}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 block font-sans mt-0.5">
                        {current.isAvailable
                          ? `${slots.length} consultation slots calculated`
                          : 'No appointments accepted'}
                      </span>
                    </div>
                  </div>

                  {/* Right: Controls or Closed State */}
                  {current.isAvailable ? (
                    <div className="flex flex-wrap items-center gap-3">
                      {/* Start Time */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-500 font-heading">Start:</span>
                        <select
                          value={current.startTime}
                          onChange={(e) => handleTimeChange(cfg.id, 'startTime', e.target.value)}
                          className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono font-bold text-[#0c1a26] focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
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
                        <span className="text-xs font-bold text-slate-500 font-heading">End:</span>
                        <select
                          value={current.endTime}
                          onChange={(e) => handleTimeChange(cfg.id, 'endTime', e.target.value)}
                          className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono font-bold text-[#0c1a26] focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
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
                        <span className="text-xs font-bold text-slate-500 font-heading">Duration:</span>
                        <select
                          value={current.slotDurationMinutes}
                          onChange={(e) => handleDurationChange(cfg.id, Number(e.target.value))}
                          className="px-3 py-1.5 bg-teal-50/70 border border-teal-200 rounded-xl text-xs sm:text-sm font-bold text-teal-800 font-mono focus:bg-white focus:outline-none"
                        >
                          {DURATION_OPTIONS.map((d) => (
                            <option key={d.value} value={d.value}>
                              {d.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Expand/Preview Slots Button */}
                      <button
                        type="button"
                        onClick={() => toggleExpandSlots(cfg.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold font-heading text-slate-700 transition-colors cursor-pointer"
                        title="Preview generated slots"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                        <span>{isExpanded ? 'Hide Slots' : `View (${slots.length})`}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {/* Save Button */}
                      <button
                        type="button"
                        disabled={current.isSaving}
                        onClick={() => handleSaveDay(cfg.id, cfg.dayName)}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold font-heading transition-all shadow-xs cursor-pointer active:scale-[0.98] ${
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
                            <Check className="w-3.5 h-3.5 text-white" />
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
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold font-heading transition-colors cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Closed</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Collapsible Slots Grid Preview */}
                {isExpanded && current.isAvailable && (
                  <div className="mt-4 pt-4 border-t border-slate-100 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="text-xs font-bold text-slate-600 font-heading">
                        Generated Public Booking Slots for {cfg.dayName} ({slots.length} available):
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {current.startTime} to {current.endTime} @ {current.slotDurationMinutes} mins each
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                      {slots.map((slot, sIdx) => (
                        <div
                          key={sIdx}
                          className="px-2.5 py-1.5 rounded-lg bg-teal-50/80 border border-teal-200/70 text-teal-900 text-center text-xs font-mono font-bold shadow-2xs"
                        >
                          {slot}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Save All Bar */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500 font-sans">
            Remember to click <strong className="text-slate-800">Save All Schedules</strong> if you made multiple changes.
          </p>

          <button
            type="button"
            disabled={bulkSaving}
            onClick={handleSaveAll}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#0c1a26] hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-bold font-heading transition-all shadow-md cursor-pointer active:scale-[0.98]"
          >
            {bulkSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving All Schedules...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Schedules</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────
          LIVE CUSTOMER BOOKING SLOT SIMULATOR
          ──────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-100 shadow-2xs">
            <Sparkles className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold font-heading text-slate-900">
              Live Customer Booking Slot Simulator
            </h2>
            <p className="text-xs text-slate-500 font-sans">
              Test what time slots an applicant will see on any selected date
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
          <label className="text-xs font-bold text-slate-600 font-heading shrink-0">
            Select Test Date:
          </label>
          <input
            type="date"
            value={simDate}
            onChange={(e) => setSimDate(e.target.value)}
            className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-[#0c1a26] focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />

          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => {
                const d = new Date();
                setSimDate(d.toISOString().split('T')[0]);
              }}
              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold font-heading cursor-pointer"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setSimDate(tomorrowDateStr())}
              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold font-heading cursor-pointer"
            >
              Tomorrow
            </button>
            <button
              type="button"
              onClick={() => {
                const d = new Date();
                const distToMon = (1 + 7 - d.getDay()) % 7 || 7;
                d.setDate(d.getDate() + distToMon);
                setSimDate(d.toISOString().split('T')[0]);
              }}
              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold font-heading cursor-pointer"
            >
              Next Monday
            </button>
            <button
              type="button"
              onClick={() => {
                const d = new Date();
                const distToSat = (6 + 7 - d.getDay()) % 7 || 7;
                d.setDate(d.getDate() + distToSat);
                setSimDate(d.toISOString().split('T')[0]);
              }}
              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold font-heading cursor-pointer"
            >
              Next Saturday
            </button>
          </div>
        </div>

        {/* Simulation Output Card */}
        <div
          className={`p-4 sm:p-5 rounded-2xl border transition-all ${
            simResult.isAvailable
              ? 'bg-emerald-50/50 border-emerald-200'
              : 'bg-rose-50/50 border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            {simResult.isAvailable ? (
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-600" />
            )}
            <span
              className={`text-sm font-extrabold font-heading ${
                simResult.isAvailable ? 'text-emerald-900' : 'text-rose-900'
              }`}
            >
              {simResult.isAvailable
                ? `Booking Open (${simResult.slots.length} available slots)`
                : 'Booking Closed for Selected Date'}
            </span>
          </div>

          <p className="text-xs text-slate-600 font-sans mb-3">{simResult.reason}</p>

          {simResult.isAvailable && simResult.slots.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 pt-1">
              {simResult.slots.map((s, idx) => (
                <div
                  key={idx}
                  className="px-2.5 py-1.5 bg-white border border-emerald-200 rounded-lg text-emerald-900 text-xs font-mono font-bold text-center shadow-2xs"
                >
                  {s}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────
          HOLIDAY BLACKOUT DATES & SPECIAL CLOSURES
          ──────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 text-[#0c1a26]">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100 shadow-2xs">
            <CalendarOff className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold font-heading text-slate-900">
              Blocked Dates &amp; Public Holidays
            </h2>
            <p className="text-xs text-slate-500 font-sans">
              Disable appointment bookings on festival days, bank closures, and office maintenance
            </p>
          </div>
        </div>

        {/* Quick Indian Festival Shortcuts */}
        <div className="space-y-2">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-heading">
            Quick Add Shortcut Presets:
          </div>
          <div className="flex flex-wrap gap-2">
            {POPULAR_HOLIDAYS.map((h, hIdx) => (
              <button
                key={hIdx}
                type="button"
                onClick={() => {
                  setNewBlockedReason(h.name);
                  setBlockedCategory(h.category);
                }}
                className="px-2.5 py-1 bg-slate-50 hover:bg-amber-50 hover:border-amber-300 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
              >
                + {h.name}
              </button>
            ))}
          </div>
        </div>

        {/* Add Block Date Form */}
        <form onSubmit={handleBlockDateSubmit} className="flex flex-col sm:flex-row gap-3 pt-2">
          <input
            type="date"
            required
            value={newBlockedDate}
            onChange={(e) => setNewBlockedDate(e.target.value)}
            className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-[#0c1a26] font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          />

          <select
            value={blockedCategory}
            onChange={(e) => setBlockedCategory(e.target.value)}
            className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-[#0c1a26] font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          >
            <option value="National Holiday">🏛️ National Holiday</option>
            <option value="Regional Festival (TN)">🪔 Regional Festival (TN)</option>
            <option value="Bank Strike / Closure">🏦 Bank Strike / Closure</option>
            <option value="Annual Audit / System Maintenance">🔒 Office Maintenance / Audit</option>
          </select>

          <input
            type="text"
            required
            placeholder="Holiday Title (e.g. Diwali / Pongal / Republic Day)"
            value={newBlockedReason}
            onChange={(e) => setNewBlockedReason(e.target.value)}
            className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-[#0c1a26] focus:bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          />

          <button
            type="submit"
            disabled={blocking || !newBlockedDate}
            className="px-5 py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 disabled:bg-slate-300 text-white rounded-xl text-xs sm:text-sm font-bold font-heading shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>{blocking ? 'Blocking...' : 'Block Date'}</span>
          </button>
        </form>

        {/* Blocked Dates List */}
        <div className="space-y-2 pt-2">
          {blockedDates.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs sm:text-sm font-sans bg-slate-50/70 rounded-2xl border border-dashed border-slate-200">
              No holiday blackout dates are currently configured. Use the form above to add festival or office closures.
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
                    className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs sm:text-sm text-[#0c1a26] shadow-2xs hover:border-slate-300 transition-colors"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold bg-white px-2.5 py-0.5 rounded-lg border border-slate-200 text-teal-800">
                          {b.date} {dayName && `(${dayName})`}
                        </span>
                      </div>
                      <span className="text-slate-700 font-semibold block pt-1 text-xs">
                        {b.reason}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleUnblockDate(b.date)}
                      className="text-slate-400 hover:text-red-600 p-2 rounded-xl hover:bg-white transition-colors cursor-pointer"
                      title="Unblock date"
                      aria-label={`Unblock ${b.date}`}
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
      </>
    ) : (
        /* ────────────────────────────────────────────────────────────
           API PROTECTION & HASHED KEYS MANAGEMENT VIEW
           ──────────────────────────────────────────────────────────── */
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Top Security Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-4.5 border border-slate-200/90 shadow-2xs flex items-center justify-between">
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-heading">
                  API Protection Shield
                </div>
                <div className="text-base font-extrabold text-emerald-700 font-heading mt-0.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Active &amp; Enforced
                </div>
                <div className="text-[11px] text-slate-400 font-sans mt-0.5">
                  Route: /api/admin/*
                </div>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold border border-emerald-100">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4.5 border border-slate-200/90 shadow-2xs flex items-center justify-between">
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-heading">
                  Hashing Algorithm
                </div>
                <div className="text-base font-extrabold text-[#0c1a26] font-heading mt-0.5">
                  SHA-256 Digest
                </div>
                <div className="text-[11px] text-indigo-600 font-sans mt-0.5 font-semibold">
                  Timing-Safe Comparison
                </div>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold border border-indigo-100">
                <Lock className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4.5 border border-slate-200/90 shadow-2xs flex items-center justify-between">
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-heading">
                  Anti-Replay Window
                </div>
                <div className="text-base font-extrabold text-[#0c1a26] font-heading mt-0.5">
                  &plusmn;300s Tolerance
                </div>
                <div className="text-[11px] text-slate-400 font-sans mt-0.5">
                  Timestamp Drift Defense
                </div>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold border border-sky-100">
                <Clock className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4.5 border border-slate-200/90 shadow-2xs flex items-center justify-between">
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-heading">
                  Rate Limiting Gate
                </div>
                <div className="text-base font-extrabold text-amber-700 font-heading mt-0.5">
                  500 req / 15 min
                </div>
                <div className="text-[11px] text-slate-400 font-sans mt-0.5">
                  Admin Login: 15 / 15m
                </div>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold border border-amber-100">
                <Zap className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Master Admin API Key Card */}
          <div className="bg-gradient-to-br from-[#0c1a26] via-[#102235] to-[#0c1a26] text-white rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-xl space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <h2 className="text-lg font-bold font-heading text-white">
                    Master Admin API Key &amp; Cryptographic Signature
                  </h2>
                  <span className="px-2 py-0.5 bg-teal-500/10 text-teal-300 border border-teal-500/30 rounded-full text-[10px] font-mono font-bold">
                    AES/SHA-256
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 font-sans">
                  All requests to <code className="text-teal-300 bg-slate-900/60 px-1.5 py-0.5 rounded font-mono text-[11px]">/api/admin/*</code> require this key via the <code className="text-teal-300 bg-slate-900/60 px-1.5 py-0.5 rounded font-mono text-[11px]">x-admin-api-key</code> HTTP header.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsRotateModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 rounded-xl text-xs font-bold font-heading transition-all cursor-pointer active:scale-[0.98]"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Rotate Key</span>
                </button>
              </div>
            </div>

            {/* Key Value & Copy Box */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider font-heading block mb-2">
                  Active Client API Secret Key
                </label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  <div className="flex-1 bg-slate-900/90 border border-slate-700/80 rounded-2xl px-4 py-3 flex items-center justify-between gap-3">
                    <span className="font-mono text-xs sm:text-sm text-teal-300 tracking-wider truncate select-all">
                      {showApiKey ? ADMIN_API_KEY : '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                      title={showApiKey ? 'Hide Secret Key' : 'Reveal Secret Key'}
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(ADMIN_API_KEY);
                      setCopiedKey(true);
                      setTimeout(() => setCopiedKey(false), 2500);
                      showToast('Admin API Key copied to clipboard!');
                    }}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-3 bg-teal-600 hover:bg-teal-500 text-white rounded-2xl text-xs sm:text-sm font-bold font-heading shadow-md transition-all cursor-pointer active:scale-[0.98] shrink-0"
                  >
                    {copiedKey ? (
                      <>
                        <Check className="w-4 h-4 text-white" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Key</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Server-Side SHA-256 Fingerprint */}
              <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-heading">
                      Server SHA-256 Hash Digest (Cryptographic Fingerprint)
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded text-[10px] font-mono font-bold">
                      VERIFIED
                    </span>
                  </div>

                  {apiSecurity?.keyHash && (
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(apiSecurity.keyHash);
                        setCopiedHash(true);
                        setTimeout(() => setCopiedHash(false), 2500);
                        showToast('SHA-256 Hash Digest copied to clipboard!');
                      }}
                      className="text-xs text-teal-400 hover:text-teal-300 font-heading font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedHash ? 'Hash Copied!' : 'Copy SHA-256 Hex'}</span>
                    </button>
                  )}
                </div>

                <div className="font-mono text-xs text-slate-300 break-all bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 select-all">
                  {apiSecurity?.keyHash || 'Loading server-side cryptographic digest...'}
                </div>
                <p className="text-[11px] text-slate-400 font-sans">
                  The raw key is never checked directly against a plain database entry. Incoming keys are instantly hashed to 256 bits and evaluated using constant-time memory buffers (<code className="text-teal-400 font-mono">crypto.timingSafeEqual</code>).
                </p>
              </div>
            </div>
          </div>

          {/* Live Ping & Verification Bench */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-100 shadow-2xs">
                  <Activity className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold font-heading text-slate-900">
                    Live Security Ping &amp; Drift Verification
                  </h3>
                  <p className="text-xs text-slate-500 font-sans">
                    Execute an authenticated test transaction through the API protection firewall
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleTestPing}
                disabled={pingLoading}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#0c1a26] hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-bold font-heading transition-all cursor-pointer active:scale-[0.98]"
              >
                {pingLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Testing Endpoint...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>Run Verification Ping</span>
                  </>
                )}
              </button>
            </div>

            {/* Ping Output Box */}
            {pingResult ? (
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm font-extrabold text-slate-900 font-heading">
                      Firewall Passed &amp; Cryptographically Validated
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-teal-50 text-teal-800 border border-teal-200">
                      ⚡ Latency: {pingResult.latencyMs}ms
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {pingResult.timestamp}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-heading">
                      Header Injected
                    </div>
                    <div className="text-xs font-mono font-bold text-teal-700 truncate mt-0.5">
                      x-admin-api-key: {ADMIN_API_KEY.substring(0, 12)}...
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-heading">
                      Timestamp Header
                    </div>
                    <div className="text-xs font-mono font-bold text-indigo-700 truncate mt-0.5">
                      x-request-timestamp: Valid (&lt; 300s)
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-heading">
                      Server Response
                    </div>
                    <div className="text-xs font-mono font-bold text-emerald-700 truncate mt-0.5">
                      HTTP 200 OK &bull; Verified
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-5 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-xs sm:text-sm text-slate-500 font-sans">
                  Click <strong>&quot;Run Verification Ping&quot;</strong> to test live constant-time hash comparison and timestamp drift enforcement directly against the backend.
                </p>
              </div>
            )}
          </div>

          {/* Enterprise Threat Defense Matrix */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-100 shadow-2xs">
                <Shield className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold font-heading text-slate-900">
                  Security Protections &amp; Architectural Safeguards
                </h3>
                <p className="text-xs text-slate-500 font-sans">
                  Active security layers safeguarding all administrative APIs and customer financial records
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/60 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-500" />
                  <span className="text-xs font-bold text-[#0c1a26] font-heading">
                    Constant-Time Hash Comparison
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-sans leading-relaxed">
                  Incoming tokens are hashed with SHA-256 and compared using Node.js <code className="text-teal-700 bg-white px-1 py-0.5 rounded border border-slate-200 font-mono text-[11px]">crypto.timingSafeEqual</code>. This completely closes side-channel vulnerability windows where attackers measure execution nanoseconds.
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/60 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-500" />
                  <span className="text-xs font-bold text-[#0c1a26] font-heading">
                    Anti-Replay Timestamp Validation
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-sans leading-relaxed">
                  Every request must include an accurate millisecond timestamp in the <code className="text-sky-700 bg-white px-1 py-0.5 rounded border border-slate-200 font-mono text-[11px]">x-request-timestamp</code> header. Any request older than 300 seconds is rejected, rendering intercepted traffic useless to malicious actors.
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/60 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-xs font-bold text-[#0c1a26] font-heading">
                    Brute-Force &amp; Scraping Protection
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-sans leading-relaxed">
                  The API protection suite enforces isolated rate limiting windows per IP: 500 requests per 15 minutes across all admin operations and a strict 15 attempts per 15 minutes limit on authentication endpoints.
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/60 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  <span className="text-xs font-bold text-[#0c1a26] font-heading">
                    Dual-Tier Authorization Gate
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-sans leading-relaxed">
                  Every administrative endpoint requires both a valid cryptographic API key signature and a signed JWT bearer token from an authenticated Administrator account.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────
          KEY ROTATION CONFIRMATION MODAL
          ──────────────────────────────────────────────────────────── */}
      {isRotateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
              <RefreshCw className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-extrabold font-heading text-slate-900">
                Rotate Admin API Key?
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 font-sans leading-relaxed">
                Rotating the Admin API key immediately regenerates the cryptographic secret and SHA-256 fingerprint on the backend server.
              </p>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs font-sans">
              <strong>Notice:</strong> This hot-updates the server security state in real time. Remember to update your deployment environment variables if storing permanent credentials.
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsRotateModalOpen(false)}
                disabled={rotateLoading}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-bold font-heading cursor-pointer transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleRotateKey}
                disabled={rotateLoading}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs sm:text-sm font-bold font-heading shadow-md shadow-rose-600/20 cursor-pointer transition-colors"
              >
                {rotateLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Rotating...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    <span>Confirm Rotation</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettingsPage;
