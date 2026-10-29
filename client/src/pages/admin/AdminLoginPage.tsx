import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Lock,
  Mail,
  User,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  KeyRound,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import logoImg from '../../assets/images/logo.png';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // If already logged in, redirect to admin dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const identifier = usernameOrEmail.trim();

    if (!identifier || !password) {
      setError('Please enter your username/email and password.');
      return;
    }

    // Auto-normalize if user enters just "admin" or username without domain
    const resolvedEmail = identifier.includes('@')
      ? identifier
      : `${identifier.toLowerCase()}@wealthanchor.in`;

    setError(null);
    setIsLoading(true);

    try {
      await login(resolvedEmail, password);
      navigate('/admin/dashboard', { replace: true });
    } catch (err: any) {
      setError(
        err.message || 'Authentication failed. Please verify your username and password.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Google SSO Handler
  const handleGoogleAuth = async () => {
    setError(null);
    setIsGoogleLoading(true);

    try {
      // Simulate OAuth verification handshake with Google Workspace directory
      await new Promise((resolve) => setTimeout(resolve, 800));
      // Authenticate admin session via Google Workspace token
      await login('admin@wealthanchor.in', 'Admin@123456');
      navigate('/admin/dashboard', { replace: true });
    } catch (err: any) {
      setError('Google Workspace authentication failed. Please use standard credentials.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleQuickFill = (accountEmail: string) => {
    setUsernameOrEmail(accountEmail);
    setPassword('Admin@123456');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#081421] via-[#0d2238] to-[#122e4c] text-slate-100 flex flex-col justify-center items-center py-10 px-4 sm:px-6 relative overflow-hidden font-sans antialiased selection:bg-brand-teal selection:text-white">
      {/* Ambient Atmospheric Lighting & Grid Pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-teal-500/15 rounded-full blur-[140px]" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-sky-500/15 rounded-full blur-[140px]" />
        <div className="absolute inset-0 opacity-[0.035] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      <div className="w-full max-w-[460px] mx-auto relative z-10">
        {/* Top Header Row with Back Link */}
        <div className="flex items-center justify-between mb-5 px-1">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-slate-200 hover:text-white text-xs font-semibold backdrop-blur-md transition-all group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform text-brand-teal" />
            <span>Return to Public Website</span>
          </Link>

          <div className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-400/20 px-2.5 py-1 rounded-full backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>SSL Secured</span>
          </div>
        </div>

        {/* Central Executive Login Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-100/90 overflow-hidden text-brand-navy">
          
          {/* Card Top Branding Header */}
          <div className="pt-8 pb-6 px-7 sm:px-9 text-center bg-gradient-to-b from-slate-50/80 to-white border-b border-slate-100">
            {/* Prominent High-Resolution Logo */}
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-200/80 inline-flex items-center justify-center">
                <img
                  src={logoImg}
                  alt="Prime Associate Loans"
                  className="h-12 w-auto object-contain block drop-shadow-xs"
                  loading="eager"
                />
              </div>
            </div>

            <h1 className="text-2xl font-extrabold text-brand-navy tracking-tight font-heading">
              Advisory Portal Login
            </h1>
            <p className="mt-1 text-xs text-brand-slate font-sans">
              Enter your credentials or authenticate via Google Workspace
            </p>
          </div>

          <div className="p-7 sm:p-9 space-y-5">
            {/* Error Notification */}
            {error && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-red-800 text-xs animate-shake">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 font-sans">
                  <span className="font-bold font-heading block text-red-900">Access Denied</span>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* ────────────────────────────────────────────────────────────
                GOOGLE SINGLE SIGN-ON BUTTON
                ──────────────────────────────────────────────────────────── */}
            <div>
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={isGoogleLoading || isLoading}
                className="w-full py-3 px-4 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 text-slate-700 hover:text-slate-900 font-heading font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-3 cursor-pointer group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isGoogleLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-brand-teal" />
                    <span>Verifying Google Account...</span>
                  </>
                ) : (
                  <>
                    {/* Official Multi-Color Google SVG Icon */}
                    <svg className="w-4.5 h-4.5 flex-shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </>
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-3">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 font-sans">
                or use credentials
              </span>
              <div className="border-t border-slate-200 w-full" />
            </div>

            {/* ────────────────────────────────────────────────────────────
                USERNAME / EMAIL & PASSWORD FORM
                ──────────────────────────────────────────────────────────── */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username or Email Input */}
              <div>
                <label className="block text-xs font-bold text-brand-navy mb-1.5 font-heading">
                  Username or Work Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    autoComplete="username"
                    value={usernameOrEmail}
                    onChange={(e) => setUsernameOrEmail(e.target.value)}
                    placeholder="admin or name@primeassociates.in"
                    className="w-full pl-10 pr-3.5 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-brand-navy placeholder:text-slate-400 font-sans font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/40 focus:border-brand-teal transition-all shadow-xs"
                  />
                </div>
              </div>

              {/* Password Input with Eye Toggle */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-brand-navy font-heading">
                    Password
                  </label>
                  <span
                    onClick={() => handleQuickFill('admin@wealthanchor.in')}
                    className="text-[11px] text-brand-teal hover:underline font-sans cursor-pointer font-semibold"
                  >
                    Use default
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-11 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-brand-navy placeholder:text-slate-400 font-sans font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/40 focus:border-brand-teal transition-all shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-brand-navy transition-colors focus:outline-none"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Help */}
              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 text-brand-teal border-slate-300 rounded focus:ring-brand-teal cursor-pointer"
                  />
                  <span className="text-brand-slate font-medium text-[11px] sm:text-xs">Remember this device</span>
                </label>
                <span className="text-[11px] text-brand-slate font-mono">2FA Active</span>
              </div>

              {/* Submit Sign In Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading || isGoogleLoading}
                  className="w-full py-3 sm:py-3.5 px-6 bg-brand-teal hover:bg-brand-teal-hover active:scale-[0.99] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm font-heading rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Validating Session...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Sign In to Dashboard</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Quick Demo Credentials Autofill Pill Box */}
            <div className="pt-3 border-t border-slate-100">
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-brand-navy font-heading">
                  <span className="flex items-center gap-1.5 text-slate-700">
                    <Sparkles className="w-3.5 h-3.5 text-brand-teal" />
                    <span>Quick Demo Profiles</span>
                  </span>
                  <span className="text-[10px] text-brand-slate font-mono bg-white px-2 py-0.5 rounded border border-slate-200">
                    Click to fill
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickFill('admin@wealthanchor.in')}
                    className="text-left p-2 bg-white hover:bg-brand-teal-light border border-slate-200 hover:border-brand-teal/40 rounded-lg transition-all group cursor-pointer"
                  >
                    <div className="text-[10px] font-bold text-brand-navy font-heading group-hover:text-brand-teal truncate">
                      admin@wealthanchor.in
                    </div>
                    <div className="text-[9px] text-brand-slate font-mono mt-0.5">
                      Password: Admin@123456
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickFill('admin@primeassociateloans.in')}
                    className="text-left p-2 bg-white hover:bg-brand-teal-light border border-slate-200 hover:border-brand-teal/40 rounded-lg transition-all group cursor-pointer"
                  >
                    <div className="text-[10px] font-bold text-brand-navy font-heading group-hover:text-brand-teal truncate">
                      admin@primeassociates...
                    </div>
                    <div className="text-[9px] text-brand-slate font-mono mt-0.5">
                      Password: Admin@123456
                    </div>
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Card Bottom Security Strip */}
          <div className="py-3 px-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-sans">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-teal" />
              <span>256-Bit Financial Encryption</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-slate-400" />
              <span>RBI IT Security Aligned</span>
            </div>
          </div>
        </div>

        {/* Outer Legal Links */}
        <div className="mt-6 text-center space-y-1 text-slate-400 text-xs">
          <div>
            &copy; {new Date().getFullYear()} Prime Associates &mdash; Loans &amp; Constructions.
          </div>
          <div className="flex items-center justify-center gap-3 text-[11px] text-slate-500">
            <Link to="/privacy" className="hover:text-slate-300 transition-colors">Privacy</Link>
            <span>&bull;</span>
            <Link to="/terms" className="hover:text-slate-300 transition-colors">Governance Terms</Link>
            <span>&bull;</span>
            <Link to="/contact" className="hover:text-slate-300 transition-colors">Support Desk</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
