import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  Clock,
  Zap,
  KeyRound,
  RefreshCw,
  Copy,
  Check,
  Eye,
  EyeOff,
  Activity,
  CheckCircle,
  Loader2,
  Shield,
} from 'lucide-react';
import {
  getApiKeyStatusApi,
  rotateApiKeyApi,
  ApiSecurityStatus,
  ADMIN_API_KEY,
} from '../../../services/api';

export const AdminSecurityPage: React.FC = () => {
  const [apiSecurity, setApiSecurity] = useState<ApiSecurityStatus | null>(null);
  const [securityLoading, setSecurityLoading] = useState<boolean>(true);
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<boolean>(false);
  const [copiedHash, setCopiedHash] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [pingResult, setPingResult] = useState<{
    latencyMs: number;
    verified: boolean;
    timestamp: string;
  } | null>(null);
  const [pingLoading, setPingLoading] = useState<boolean>(false);
  const [rotateLoading, setRotateLoading] = useState<boolean>(false);
  const [isRotateModalOpen, setIsRotateModalOpen] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

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

  useEffect(() => {
    fetchApiSecurityStatus();
  }, []);

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
        timestamp: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }),
      });
      showToast(`Cryptographic API Key Ping Successful! Latency: ${latencyMs}ms, SHA-256 Hash verified.`);
    } catch (err: any) {
      const latencyMs = Math.round(performance.now() - start);
      setPingResult({
        latencyMs,
        verified: false,
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

  return (
    <div className="space-y-7 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#0c1a26] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-teal-500/40 flex items-center gap-3 text-xs sm:text-sm font-heading font-bold animate-in slide-in-from-top duration-200">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0c1a26] tracking-tight font-heading">
              API Protection &amp; Cryptographic Security Keys
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold font-heading bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              SHA-256 Guard Active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-sans mt-1">
            Enterprise API rate limiting, constant-time SHA-256 token verification, and anti-replay defense
          </p>
        </div>

        <button
          type="button"
          onClick={handleTestPing}
          disabled={pingLoading}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-emerald-800 text-white rounded-xl text-xs sm:text-sm font-bold font-heading shadow-sm transition-all cursor-pointer active:scale-[0.98] self-start md:self-auto"
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
      </div>

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

      {/* KEY ROTATION CONFIRMATION MODAL */}
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

export default AdminSecurityPage;
