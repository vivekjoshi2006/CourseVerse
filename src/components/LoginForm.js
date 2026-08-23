import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, AtSign, Lock, Loader2, Rocket, User, X } from 'lucide-react';

const LoginForm = ({ isOpen, onClose, onSuccess, initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loadingProvider, setLoadingProvider] = useState(null);
  
  // Ref to hold interval timer for clean-up
  const popupTimerRef = useRef(null);

  // Clean up interval if modal closes
  useEffect(() => {
    return () => {
      if (popupTimerRef.current) {
        clearInterval(popupTimerRef.current);
      }
    };
  }, []);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    onSuccess({
      name: name || email.split('@')[0],
      email,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`,
      joinedAt: new Date().toLocaleDateString(),
    });
  };

  const handleSocialLogin = (provider) => {
    setLoadingProvider(provider);

    // Calculate center coordinates
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const authUrl =
      provider === 'Google'
        ? 'https://accounts.google.com/signin'
        : 'https://github.com/login';

    // Open OAuth Popup Window
    const popup = window.open(
      authUrl,
      `${provider} Auth`,
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,status=no,toolbar=no`
    );

    // Handle browser blocking popup
    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      alert('Popup window block ho gayi hai. Kripya browser me popup allow karein.');
      setLoadingProvider(null);
      return;
    }

    // Monitor popup window closure
    popupTimerRef.current = setInterval(() => {
      if (popup && popup.closed) {
        clearInterval(popupTimerRef.current);
        setLoadingProvider(null);

        // Login success payload
        const dummyEmail = `user.${provider.toLowerCase()}@example.com`;
        onSuccess({
          name: `${provider} User`,
          email: dummyEmail,
          avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(dummyEmail)}`,
          joinedAt: new Date().toLocaleDateString(),
          provider,
        });
      }
    }, 500);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-md flex items-center justify-center p-4 transition-all duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-md w-full p-7 sm:p-9 shadow-2xl shadow-indigo-500/10 border border-slate-200 relative overflow-hidden transition-all transform duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30">
              {mode === 'login' ? <Lock size={20} /> : <Rocket size={20} />}
            </div>
            <div>
              <span className="text-[13px] font-black uppercase tracking-wider text-indigo-600 block">
                CourseVerse Auth
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                {mode === 'login' ? 'Welcome back ✨' : 'Join CourseVerse 🚀'}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors duration-200"
          >
            <X size={18} />
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="flex p-1 bg-slate-100 rounded-2xl mb-6 relative z-10 border border-slate-200/60">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-2 text-[15px] font-bold rounded-xl transition-all duration-200 ${
              mode === 'login'
                ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/50'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 py-2 text-[15px] font-bold rounded-xl transition-all duration-200 ${
              mode === 'register'
                ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/50'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Register
          </button>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          {mode === 'register' && (
            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-slate-800">
                Full Name
              </label>
              <div className="relative flex items-center group">
                <User size={16} className="absolute left-3.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="text"
                  required
                  placeholder="Vivek Joshi"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 focus:bg-white transition duration-200"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-800">
              Email Address
            </label>
            <div className="relative flex items-center group">
              <AtSign size={16} className="absolute left-3.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              <input
                type="email"
                required
                placeholder="vivekjoshi@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 focus:bg-white transition duration-200"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-bold text-slate-800">
                Password
              </label>
              {mode === 'login' && (
                <a href="#forgot" className="text-[13px] font-bold text-indigo-600 hover:text-indigo-800 hover:underline">
                  Forgot?
                </a>
              )}
            </div>
            <div className="relative flex items-center group">
              <Lock size={16} className="absolute left-3.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              <input
                type="password"
                required
                placeholder="•••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 focus:bg-white transition duration-200"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all duration-200 shadow-md shadow-indigo-600/20 active:scale-[0.98] mt-4"
          >
            {mode === 'login' ? 'Sign In to Workspace' : 'Create Free Account'}
            <ArrowRight size={15} />
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="px-3 text-[11px] font-extrabold text-black uppercase tracking-wider bg-white">
            OR CONTINUE WITH
          </span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <button
            type="button"
            disabled={loadingProvider !== null}
            onClick={() => handleSocialLogin('Google')}
            className="flex items-center justify-center gap-2 py-2.5 px-3 bg-slate-50 hover:bg-slate-100 disabled:opacity-60 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 transition duration-200 active:scale-[0.98] cursor-pointer"
          >
            {loadingProvider === 'Google' ? (
              <Loader2 size={16} className="animate-spin text-indigo-600" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
            )}
            Google
          </button>

          <button
            type="button"
            disabled={loadingProvider !== null}
            onClick={() => handleSocialLogin('GitHub')}
            className="flex items-center justify-center gap-2 py-2.5 px-3 bg-slate-50 hover:bg-slate-100 disabled:opacity-60 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 transition duration-200 active:scale-[0.98] cursor-pointer"
          >
            {loadingProvider === 'GitHub' ? (
              <Loader2 size={16} className="animate-spin text-indigo-600" />
            ) : (
              <svg className="w-4 h-4 fill-slate-800" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
            )}
            GitHub
          </button>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-slate-500">
          {mode === 'login' ? (
            <>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="font-bold text-indigo-600 hover:text-indigo-800 hover:underline ml-0.5"
              >
                Register free
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="font-bold text-indigo-600 hover:text-indigo-800 hover:underline ml-0.5"
              >
                Sign in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginForm;