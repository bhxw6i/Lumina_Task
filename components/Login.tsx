
import React, { useState } from 'react';
import { User } from '../types';
import { storageService } from '../services/storageService';
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
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isRegistering) {
      if (!name || !email || !password) return setError('All fields are required');
      const newUser = storageService.registerUser(email, password, name);
      onLogin(newUser);
    } else {
      const user = storageService.loginUser(email, password);
      if (user) {
        onLogin(user);
      } else {
        setError('Invalid credentials');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-lumina-50 dark:bg-lumina-500 p-4 transition-colors duration-300">
      {/* Theme Toggle Button */}
      <button 
        onClick={toggleTheme}
        className="fixed top-6 right-6 p-3 rounded-2xl bg-white dark:bg-lumina-400 shadow-lg text-lumina-300 dark:text-lumina-50 hover:scale-110 transition-all z-10"
      >
        {isDarkMode ? <ICONS.Sun size={24} /> : <ICONS.Moon size={24} />}
      </button>

      <div className="max-w-md w-full bg-white dark:bg-lumina-400 rounded-3xl shadow-2xl p-8 transform transition-all duration-300">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-lumina-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ICONS.Sparkles className="text-white" size={32} />
          </div>
          <h2 className="text-3xl font-serif font-bold text-lumina-300 dark:text-lumina-50">
            {isRegistering ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-lumina-200 dark:text-lumina-100 mt-2">
            Organize your life with elegance.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 p-3 rounded-xl mb-4 text-sm text-center border border-red-100 dark:border-red-900/30">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <div>
              <label className="block text-sm font-medium text-lumina-300 dark:text-lumina-100 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-lumina-100 dark:border-lumina-300 bg-transparent text-lumina-500 dark:text-white focus:ring-2 focus:ring-lumina-200 outline-none transition-all placeholder:text-lumina-100/50"
                placeholder="Jane Doe"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-lumina-300 dark:text-lumina-100 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-lumina-100 dark:border-lumina-300 bg-transparent text-lumina-500 dark:text-white focus:ring-2 focus:ring-lumina-200 outline-none transition-all placeholder:text-lumina-100/50"
              placeholder="jane@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-lumina-300 dark:text-lumina-100 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-lumina-100 dark:border-lumina-300 bg-transparent text-lumina-500 dark:text-white focus:ring-2 focus:ring-lumina-200 outline-none transition-all placeholder:text-lumina-100/50"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-lumina-300 hover:bg-lumina-400 text-white font-bold py-3 px-4 rounded-xl shadow-lg transform transition active:scale-95 duration-200 mt-4"
          >
            {isRegistering ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-lumina-200 dark:text-lumina-100 hover:text-lumina-300 underline underline-offset-4"
          >
            {isRegistering ? 'Already have an account? Sign In' : "New here? Create an account"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
