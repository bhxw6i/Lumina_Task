import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { storageService } from './services/storageService';
import { api } from './services/api';
import { AuthState, User } from './types';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import LoadingScreen from './components/LoadingScreen';

const App: React.FC = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true,
  });
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    const user = storageService.getCurrentUser();
    if (user?.token) {
      api.setToken(user.token);
    }

    // Smooth initial load
    const timer = setTimeout(() => {
      setAuthState({
        user,
        isAuthenticated: !!user,
        loading: false,
      });
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const handleLogin = (user: User) => {
    storageService.setCurrentUser(user);
    if (user.token) {
      api.setToken(user.token);
    }
    setAuthState({ user, isAuthenticated: true, loading: false });
  };

  const handleLogout = () => {
    storageService.setCurrentUser(null);
    api.setToken(null);
    setAuthState({ user: null, isAuthenticated: false, loading: false });
  };

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  if (authState.loading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={
            !authState.isAuthenticated ? (
              <Login 
                onLogin={handleLogin} 
                toggleTheme={toggleTheme} 
                isDarkMode={isDarkMode} 
              />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        <Route 
          path="/*" 
          element={
            authState.isAuthenticated ? (
              <Dashboard 
                user={authState.user!} 
                onLogout={handleLogout} 
                toggleTheme={toggleTheme}
                isDarkMode={isDarkMode}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
      </Routes>
    </Router>
  );
};

export default App;
