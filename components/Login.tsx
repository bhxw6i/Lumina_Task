import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { storageService } from '../services/storageService';
import { api } from '../services/api';
import { ICONS } from '../constants';

interface LoginProps {
  onLogin: (user: User) => void;
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const Login: React.FC<LoginProps> = ({ onLogin, toggleTheme, isDarkMode }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [backendHealth, setBackendHealth] = useState<{ checked: boolean; isHealthy: boolean; dbConnected: boolean; isWakingUp?: boolean }>({
    checked: false,
    isHealthy: false,
    dbConnected: false,
  });
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState(() => api.getBaseUrl().replace(/\/api$/, ''));
  const [isTestingUrl, setIsTestingUrl] = useState(false);
  const [configSuccessMsg, setConfigSuccessMsg] = useState('');

  const checkConnection = async () => {
    const res = await api.checkHealth();
    setBackendHealth({
      checked: true,
      isHealthy: res.isHealthy,
      dbConnected: res.databaseConnected,
      isWakingUp: res.isWakingUp,
    });
    return res;
  };

  useEffect(() => {
    let isMounted = true;
    checkConnection().then((res) => {
      if (isMounted) {
        setBackendHealth({
          checked: true,
          isHealthy: res.isHealthy,
          dbConnected: res.databaseConnected,
          isWakingUp: res.isWakingUp,
        });
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSaveBackendUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTestingUrl(true);
    setConfigSuccessMsg('');
    try {
      const clean = customUrlInput.trim();
      api.setBackendUrl(clean || null);
      const res = await api.checkHealth();
      setBackendHealth({
        checked: true,
        isHealthy: res.isHealthy,
        dbConnected: res.databaseConnected,
        isWakingUp: res.isWakingUp,
      });
      if (res.isHealthy) {
        setConfigSuccessMsg('Connected successfully to backend!');
      } else if (res.isWakingUp) {
        setConfigSuccessMsg('Render backend is waking up from sleep. Please wait ~40 seconds.');
      } else {
        setConfigSuccessMsg('Saved URL. Server not reachable yet (check if deployed).');
      }
    } catch (err: any) {
      setConfigSuccessMsg(`Error: ${err.message}`);
    } finally {
      setIsTestingUrl(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isRegistering) {
      if (!name.trim() || !email.trim() || !password) {
        return setError('All fields are required');
      }
      if (password.length < 6) {
        return setError('Password must be at least 6 characters long');
      }
      setIsLoading(true);
      try {
        const newUser = await storageService.registerUser(email.trim(), password, name.trim());
        onLogin(newUser);
      } catch (err: any) {
        setError(err.message || 'Failed to create account');
      } finally {
        setIsLoading(false);
      }
    } else {
      if (!email.trim() || !password) {
        return setError('Please enter both email and password');
      }
      setIsLoading(true);
      try {
        const user = await storageService.loginUser(email.trim(), password);
        onLogin(user);
      } catch (err: any) {
        setError(err.message || 'Invalid credentials');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDemoLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      const demoEmail = 'alex@lumina.design';
      const demoPass = 'lumina123';
      try {
        const user = await storageService.loginUser(demoEmail, demoPass);
        onLogin(user);
      } catch {
        const user = await storageService.registerUser(demoEmail, demoPass, 'Alex Rivera');
        onLogin(user);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to initialize demo account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-lumina-50 dark:bg-lumina-500 p-4 transition-colors duration-300 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-lumina-200/20 dark:bg-lumina-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-lumina-100/30 dark:bg-lumina-400/40 rounded-full blur-3xl pointer-events-none" />

      {/* Theme Toggle Button */}
      <button 
        onClick={toggleTheme}
        aria-label="Toggle theme"
        className="fixed top-6 right-6 p-3 rounded-2xl bg-white dark:bg-lumina-400 shadow-lg text-lumina-300 dark:text-lumina-50 hover:scale-110 active:scale-95 transition-all z-10 border border-lumina-100/50 dark:border-lumina-300/30"
      >
        {isDarkMode ? <ICONS.Sun size={22} /> : <ICONS.Moon size={22} />}
      </button>

      <div className="max-w-md w-full bg-white/95 dark:bg-lumina-400/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 sm:p-10 border border-lumina-100/60 dark:border-lumina-300/30 transform transition-all duration-300 z-10">
        
        {/* Backend Connectivity Status Indicator */}
        <div className="flex flex-col items-center justify-center gap-1.5 mb-6">
          <button
            type="button"
            onClick={() => setShowConfigModal(true)}
            title="Click to configure backend URL or check status"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border bg-lumina-50/80 hover:bg-lumina-100/50 dark:bg-lumina-500/50 dark:hover:bg-lumina-300/30 border-lumina-100 dark:border-lumina-300/30 text-lumina-200 dark:text-lumina-100 transition-all cursor-pointer group"
          >
            {backendHealth.checked ? (
              backendHealth.isHealthy ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Cloud API Online {backendHealth.dbConnected ? '(MongoDB Connected)' : ''}</span>
                </>
              ) : backendHealth.isWakingUp ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span>Backend Waking Up (~45s)...</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Local Mode • Click to Config API</span>
                </>
              )
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-ping" />
                <span>Checking server status...</span>
              </>
            )}
            <span className="text-[10px] text-lumina-200/60 dark:text-lumina-100/50 group-hover:text-lumina-300">⚙️</span>
          </button>
        </div>

        {/* Backend Configuration Modal */}
        {showConfigModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-lumina-400 w-full max-w-md rounded-3xl p-6 sm:p-7 shadow-2xl border border-lumina-100 dark:border-lumina-300/30 fade-in text-left">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🔌</span>
                  <h3 className="text-lg font-serif font-bold text-lumina-300 dark:text-lumina-50">
                    Backend Connection
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => { setShowConfigModal(false); setConfigSuccessMsg(''); }}
                  className="p-1 rounded-full text-lumina-200 hover:text-lumina-300 dark:text-lumina-100"
                >
                  <ICONS.Plus size={20} className="rotate-45" />
                </button>
              </div>

              <div className="text-xs text-lumina-200 dark:text-lumina-100/80 mb-4 space-y-1 bg-lumina-50/70 dark:bg-lumina-500/40 p-3 rounded-2xl border border-lumina-100/60 dark:border-lumina-300/20">
                <div className="flex justify-between">
                  <span className="font-semibold">Active API URL:</span>
                  <span className="font-mono text-[11px] truncate max-w-[200px]" title={api.getBaseUrl()}>
                    {api.getBaseUrl()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Status:</span>
                  <span>{backendHealth.isHealthy ? '✅ Online' : backendHealth.isWakingUp ? '⏳ Waking Up' : '⚠️ Offline / Local'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Database:</span>
                  <span>{backendHealth.dbConnected ? '✅ Connected' : '❌ Disconnected'}</span>
                </div>
              </div>

              <form onSubmit={handleSaveBackendUrl} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-lumina-300 dark:text-lumina-100 uppercase tracking-wider mb-1">
                    Render / Backend API URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://lumina-task-backend.onrender.com"
                    value={customUrlInput}
                    onChange={(e) => setCustomUrlInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-lumina-100 dark:border-lumina-300 bg-white/70 dark:bg-lumina-500/50 text-lumina-500 dark:text-white text-xs focus:ring-2 focus:ring-lumina-200 outline-none font-mono"
                  />
                  <p className="text-[10px] text-lumina-200/70 dark:text-lumina-100/60 mt-1">
                    Paste your free Render URL (e.g. <span className="font-mono">https://service.onrender.com</span>). Netlify will connect to it directly!
                  </p>
                </div>

                {configSuccessMsg && (
                  <div className={`p-2.5 rounded-xl text-xs text-center font-medium ${
                    configSuccessMsg.includes('success') ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200'
                  }`}>
                    {configSuccessMsg}
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCustomUrlInput('');
                      api.setBackendUrl(null);
                      checkConnection();
                      setConfigSuccessMsg('Reset to default URL');
                    }}
                    className="px-3 py-2 rounded-xl border border-lumina-100 hover:bg-lumina-50 dark:border-lumina-300 text-xs font-medium text-lumina-200 dark:text-lumina-100 transition-all"
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    disabled={isTestingUrl}
                    className="flex-1 px-4 py-2 rounded-xl bg-lumina-300 hover:bg-lumina-400 text-white text-xs font-semibold shadow-md flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {isTestingUrl ? (
                      <>
                        <ICONS.Loader2 size={14} className="animate-spin" />
                        <span>Connecting (~10-40s)...</span>
                      </>
                    ) : (
                      <span>Save & Test Connection</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-tr from-lumina-300 to-lumina-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-lumina-300/30">
            <ICONS.Sparkles className="text-white" size={32} />
          </div>
          <h2 className="text-3xl font-serif font-bold text-lumina-300 dark:text-lumina-50 tracking-tight">
            {isRegistering ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-lumina-200 dark:text-lumina-100/80 mt-2 text-sm">
            Organize your life with elegance and ease.
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 p-3.5 rounded-2xl mb-5 text-sm text-center border border-rose-200/60 dark:border-rose-900/40 flex items-center justify-center gap-2 slide-down">
            <ICONS.AlertCircle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <div>
              <label className="block text-xs font-semibold text-lumina-300 dark:text-lumina-100 mb-1.5 uppercase tracking-wider">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-lumina-100 dark:border-lumina-300 bg-white/70 dark:bg-lumina-500/50 text-lumina-500 dark:text-white focus:ring-2 focus:ring-lumina-200 dark:focus:ring-lumina-100 outline-none transition-all placeholder:text-lumina-100/60 text-sm"
                placeholder="Jane Doe"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-lumina-300 dark:text-lumina-100 mb-1.5 uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-lumina-100 dark:border-lumina-300 bg-white/70 dark:bg-lumina-500/50 text-lumina-500 dark:text-white focus:ring-2 focus:ring-lumina-200 dark:focus:ring-lumina-100 outline-none transition-all placeholder:text-lumina-100/60 text-sm"
              placeholder="jane@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-lumina-300 dark:text-lumina-100 mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-11 rounded-xl border border-lumina-100 dark:border-lumina-300 bg-white/70 dark:bg-lumina-500/50 text-lumina-500 dark:text-white focus:ring-2 focus:ring-lumina-200 dark:focus:ring-lumina-100 outline-none transition-all placeholder:text-lumina-100/60 text-sm"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-lumina-200 dark:text-lumina-100/60 hover:text-lumina-300 dark:hover:text-white transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <ICONS.EyeOff size={18} /> : <ICONS.Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-lumina-300 hover:bg-lumina-400 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-lumina-300/25 transform transition active:scale-[0.98] duration-200 mt-5 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <ICONS.Loader2 size={18} className="animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>{isRegistering ? 'Sign Up' : 'Sign In'}</span>
            )}
          </button>
        </form>

        {/* Quick Demo Access Button */}
        <div className="mt-4 pt-4 border-t border-lumina-100/60 dark:border-lumina-300/30">
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl border border-lumina-200/40 dark:border-lumina-300/40 text-xs font-medium text-lumina-200 dark:text-lumina-100 hover:bg-lumina-50 dark:hover:bg-lumina-300/20 transition-all flex items-center justify-center gap-2"
          >
            <ICONS.Sparkles size={14} className="text-lumina-300 dark:text-lumina-100" />
            <span>Try 1-Click Demo Account (Alex Rivera)</span>
          </button>
        </div>

        <div className="mt-6 text-center text-sm">
          <button
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError('');
            }}
            className="text-lumina-200 dark:text-lumina-100 hover:text-lumina-300 underline underline-offset-4 transition-colors text-xs font-medium"
          >
            {isRegistering
              ? 'Already have an account? Sign In'
              : "New here? Create an account"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
