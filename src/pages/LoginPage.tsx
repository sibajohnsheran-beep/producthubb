import React, { useState } from 'react';
import { Boxes, Eye, EyeOff, Lock, Mail, ArrowRight, Check } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('sheran@producthub.io');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess();
    }, 400);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#f8f9fa]">
      {/* Left Column: Brand Hero */}
      <div className="lg:w-1/2 bg-[#3e32d3] p-8 sm:p-16 flex flex-col justify-between text-white relative overflow-hidden">
        {/* Subtle geometric background shapes */}
        <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none" />

        {/* Brand */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
            <Boxes className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-space font-bold text-2xl tracking-tight text-white">ProductHub</h2>
            <p className="text-xs text-white/70 font-semibold tracking-wider uppercase">IT Catalog System</p>
          </div>
        </div>

        {/* Hero Copy */}
        <div className="my-12 lg:my-0 relative z-10 max-w-lg">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white/90 border border-white/15 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" /> Enterprise Product Management
          </span>
          <h1 className="font-space font-bold text-3xl sm:text-5xl leading-tight text-white tracking-tight mb-4">
            Manage your product catalog with clarity and precision.
          </h1>
          <p className="text-white/80 text-sm sm:text-base leading-relaxed">
            Real-time inventory tracking, multi-category taxonomy, granular pricing models, and fast catalog updates.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10">
              <div className="text-2xl font-bold font-space">99.9%</div>
              <div className="text-xs text-white/75 mt-0.5">Uptime & Sync Reliability</div>
            </div>
            <div className="p-4 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10">
              <div className="text-2xl font-bold font-space">&lt; 150ms</div>
              <div className="text-xs text-white/75 mt-0.5">Sub-second API Responses</div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-xs text-white/60 relative z-10">
          © 2026 ProductHub Inc. All rights reserved.
        </div>
      </div>

      {/* Right Column: Sign In Form */}
      <div className="lg:w-1/2 p-8 sm:p-16 flex items-center justify-center bg-white">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="font-space font-bold text-2xl sm:text-3xl text-[#191c1d] tracking-tight">
              Welcome back
            </h2>
            <p className="text-sm text-[#464555] mt-2">
              Enter your credentials to access the product administration console.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[#191c1d] mb-1.5" htmlFor="login-email">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#777587] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#f8f9fa] text-sm text-[#191c1d] rounded-lg border border-[#c7c4d8] focus:bg-white focus:outline-none focus:border-[#3e32d3] focus:ring-2 focus:ring-[#3e32d3]/15 transition-all"
                  placeholder="admin@producthub.io"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-[#191c1d]" htmlFor="login-password">
                  Password
                </label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Password reset link sent to demo email.'); }} className="text-xs font-semibold text-[#3e32d3] hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#777587] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-[#f8f9fa] text-sm text-[#191c1d] rounded-lg border border-[#c7c4d8] focus:bg-white focus:outline-none focus:border-[#3e32d3] focus:ring-2 focus:ring-[#3e32d3]/15 transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#777587] hover:text-[#191c1d]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[#464555]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-[#3e32d3] focus:ring-[#3e32d3] border-[#c7c4d8]"
                />
                <span>Remember this device for 30 days</span>
              </label>
            </div>

            <button
              type="submit"
              id="login-submit-btn"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-[#3e32d3] hover:bg-[#342ab3] text-white text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-75"
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In to ProductHub</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick bypass note */}
          <div className="pt-4 border-t border-[#c7c4d8]/40 text-center">
            <p className="text-xs text-[#777587]">
              Demo environment initialized. Click <strong className="text-[#3e32d3] cursor-pointer" onClick={onLoginSuccess}>Sign In</strong> to explore the full dashboard directly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
