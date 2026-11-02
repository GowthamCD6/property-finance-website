import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Lock,
  Phone,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  ShieldCheck,
  KeyRound,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { triggerGoogleOAuth } from '../../utils/googleAuth';
import logoImg from '../../assets/images/logo.png';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle, isAuthenticated } = useAuth();

  const [phone, setPhone] = useState('');
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
    const cleanPhone = phone.trim();

    if (!cleanPhone || !password) {
      setError('Please enter your registered mobile number and password.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      await login(cleanPhone, password);
      navigate('/admin/dashboard', { replace: true });
    } catch (err: any) {
      setError(
        err.message || 'Invalid credentials. Please verify your mobile number and password.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Real Google SSO Handler via Google Identity Services
  const triggerGoogleAdminLogin = async () => {
    setError(null);
    setIsGoogleLoading(true);
    try {
      const accessToken = await triggerGoogleOAuth();
      await loginWithGoogle(accessToken);
      navigate('/admin/dashboard', { replace: true });
    } catch (err: any) {
      console.warn('Google Sign-In error:', err);
      setError(err.message || 'Google Administrator authentication failed.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="admin-portal min-h-screen bg-[#F7F9FB] flex flex-col justify-center items-center py-10 px-4 sm:px-6 font-sans antialiased selection:bg-brand-teal selection:text-white">
      {/* Main Executive Login Card */}
      <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-[0_4px_24px_-2px_rgba(24,50,71,0.08)] border border-slate-200/90 p-7 sm:p-9 space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <img
              src={logoImg}
              alt="Prime Associates Loans"
              className="h-12 w-auto object-contain"
              loading="eager"
            />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-brand-navy tracking-tight font-heading">
              Advisory Portal Login
            </h1>
            <p className="text-xs text-brand-slate font-sans mt-1">
              Sign in to manage loans, audits, and customer files
            </p>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200/80 rounded-xl flex items-start gap-2.5 text-red-800 text-xs">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <span className="font-medium font-sans leading-tight">{error}</span>
          </div>
        )}

        {/* Google SSO Button */}
        <div>
          <button
            type="button"
            onClick={() => triggerGoogleAdminLogin()}
            disabled={isGoogleLoading || isLoading}
            className="w-full h-11 px-4 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 text-slate-700 font-medium text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isGoogleLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-brand-teal" />
                <span>Connecting to Google...</span>
              </>
            ) : (
              <>
                {/* Fixed-size Google SVG icon */}
                <svg
                  width={20}
                  height={20}
                  viewBox="0 0 24 24"
                  className="flex-shrink-0"
                  style={{ width: '20px', height: '20px', minWidth: '20px', minHeight: '20px' }}
                >
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

        {/* Clean Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-white px-3 text-[11px] font-medium uppercase tracking-wider text-slate-400 font-sans">
            or with credentials
          </span>
          <div className="border-t border-slate-200 w-full" />
        </div>

        {/* Phone & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Registered Mobile Phone Number */}
          <div>
            <label className="block text-xs font-semibold text-brand-navy mb-1.5 font-heading">
              Registered Mobile Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                required
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter 10-digit mobile number (e.g. 9655566613)"
                className="w-full h-11 pl-10 pr-3.5 bg-slate-50/70 border border-slate-300 rounded-xl text-xs sm:text-sm text-brand-navy placeholder:text-slate-400 font-sans focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-brand-navy mb-1.5 font-heading">
              Password
            </label>
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
                className="w-full h-11 pl-10 pr-11 bg-slate-50/70 border border-slate-300 rounded-xl text-xs sm:text-sm text-brand-navy placeholder:text-slate-400 font-sans focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all"
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

          {/* Remember Me */}
          <div className="flex items-center justify-between pt-0.5">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-3.5 h-3.5 text-brand-teal border-slate-300 rounded focus:ring-brand-teal cursor-pointer"
              />
              <span className="text-slate-600 font-medium text-xs">Remember this device</span>
            </label>
            <span className="text-[11px] text-slate-400">Protected session</span>
          </div>

          {/* Submit Sign In Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="w-full h-11 px-4 bg-brand-teal hover:bg-brand-teal-hover active:scale-[0.99] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold text-xs sm:text-sm font-heading rounded-xl shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Security Assurance */}
        <div className="pt-1 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-sans text-center">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-teal" />
          <span>Restricted to authorized advisory personnel</span>
        </div>
      </div>

      {/* Footer Info */}
      <div className="w-full max-w-[420px] text-center text-slate-400 text-xs mt-4 space-y-1">
        <div>
          &copy; {new Date().getFullYear()} Prime Associates &mdash; Loans &amp; Constructions
        </div>
        <div className="flex items-center justify-center gap-3 text-[11px] text-slate-400">
          <Link to="/privacy" className="hover:text-slate-600 transition-colors">Privacy</Link>
          <span>&bull;</span>
          <Link to="/terms" className="hover:text-slate-600 transition-colors">Terms</Link>
          <span>&bull;</span>
          <Link to="/contact" className="hover:text-slate-600 transition-colors">Support</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
