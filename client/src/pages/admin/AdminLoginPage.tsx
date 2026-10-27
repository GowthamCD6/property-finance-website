import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, AlertCircle, Loader2, Building2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import logoImg from '../../assets/images/logo.png';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const [email, setEmail] = useState('admin@primeassociateloans.in');
  const [password, setPassword] = useState('Admin@123456');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in, redirect
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/admin/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-ivory flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <a href="/" className="inline-flex items-center gap-2 mb-4 text-brand-navy hover:text-brand-teal transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-xs font-semibold">Back to Public Website</span>
        </a>

        <div className="flex justify-center mb-4">
          <img
            src={logoImg}
            alt="Prime Associate Loans"
            className="h-14 w-auto object-contain drop-shadow-xs"
          />
        </div>
        <h2 className="text-2xl font-extrabold text-brand-navy tracking-tight">
          Advisory Portal Login
        </h2>
        <p className="mt-1.5 text-xs text-brand-slate">
          Prime Associate Loans &mdash; Operations and consultancy management access
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-card rounded-2xl border border-brand-border">
          {error && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2.5 text-red-800 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                Administrator Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-slate">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@primeassociateloans.in"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-brand-ivory/40 border border-brand-border rounded-lg text-sm text-brand-navy focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-navy mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-slate">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-brand-ivory/40 border border-brand-border rounded-lg text-sm text-brand-navy focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-brand-teal hover:bg-brand-teal-hover disabled:bg-gray-300 text-white font-semibold text-sm rounded-corporate shadow-sm transition-all duration-150 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Session...</span>
                  </>
                ) : (
                  <span>Authenticate &amp; Access Dashboard</span>
                )}
              </button>
            </div>
          </form>

          {/* Seed hint box */}
          <div className="mt-6 pt-5 border-t border-brand-border/60 text-[11px] text-brand-slate bg-brand-teal-light/50 p-3 rounded-lg border border-brand-teal/20">
            <span className="font-semibold text-brand-navy block mb-0.5">Seeded Admin Account:</span>
            <div>Email: <code className="font-mono text-brand-teal">admin@primeassociateloans.in</code> (or <code className="font-mono text-brand-teal">admin@wealthanchor.in</code>)</div>
            <div>Password: <code className="font-mono text-brand-teal">Admin@123456</code></div>
          </div>
        </div>
      </div>
    </div>
  );
};