import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import Navbar from './components/common/Navbar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Home from './pages/Home';
import Analyze from './pages/Analyze';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';

// Loading Screen with 2030 Design
const LoadingScreen = () => (
  <div className="flex items-center justify-center min-h-screen bg-dark-900">
    <div className="text-center">
      <div className="relative w-20 h-20 mx-auto mb-6">
        <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-pulse"></div>
        <div className="absolute inset-0 rounded-full border-4 border-t-primary border-r-secondary border-b-accent border-l-transparent animate-spin"></div>
        <div className="absolute inset-2 rounded-full bg-gradient-to-r from-primary to-secondary animate-pulse-glow"></div>
      </div>
      <p className="text-gray-400 font-light tracking-wider">Loading Experience...</p>
      <div className="mt-2 h-1 w-32 mx-auto bg-gradient-to-r from-primary via-secondary to-accent rounded-full animate-shimmer"></div>
    </div>
  </div>
);

// ============================================================
// APP CONTENT
// ============================================================
const AppContent = () => {
  const { user, loading } = useAuth();
  const [darkMode, setDarkMode] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check system preference
    if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      setDarkMode(false);
    }
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('light');
  };

  if (loading || !mounted) {
    return <LoadingScreen />;
  }

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      darkMode ? 'bg-dark-900' : 'bg-gray-50'
    }`}>
      {/* Glow Background Effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute -top-1/2 -left-1/2 w-full h-full rounded-full blur-3xl opacity-20 transition-opacity duration-500 ${
          darkMode ? 'bg-gradient-to-r from-primary via-secondary to-accent' : 'bg-gradient-to-r from-blue-200 via-purple-200 to-cyan-200'
        }`} />
        <div className={`absolute -bottom-1/2 -right-1/2 w-full h-full rounded-full blur-3xl opacity-10 transition-opacity duration-500 ${
          darkMode ? 'bg-gradient-to-r from-accent via-primary to-secondary' : 'bg-gradient-to-r from-cyan-200 via-blue-200 to-purple-200'
        }`} />
      </div>

      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: darkMode ? '#1A1A2E' : '#FFFFFF',
            color: darkMode ? '#FFFFFF' : '#1E293B',
            borderRadius: '16px',
            border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
            backdropFilter: 'blur(20px)',
          }
        }}
      />
      
      {/* Navbar */}
      {user && <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />}
      
      <AnimatePresence mode="wait">
        <motion.main 
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className={user ? 'pt-20' : ''}
        >
          <Routes>
            <Route path="/login" element={
              user ? <Navigate to="/" replace /> : <Login darkMode={darkMode} />
            } />
            <Route path="/register" element={
              user ? <Navigate to="/" replace /> : <Register darkMode={darkMode} />
            } />
            <Route path="/" element={
              <ProtectedRoute><Home darkMode={darkMode} /></ProtectedRoute>
            } />
            <Route path="/analyze" element={
              <ProtectedRoute><Analyze darkMode={darkMode} /></ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute><Dashboard darkMode={darkMode} /></ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute><Settings darkMode={darkMode} /></ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </motion.main>
      </AnimatePresence>

      {/* Footer */}
      {user && (
        <footer className={`text-center py-6 border-t transition-colors duration-300 ${
          darkMode ? 'border-white/5 text-gray-500' : 'border-gray-200 text-gray-400'
        }`}>
          <p className="text-sm font-light tracking-wider">
            © 2026-2030 CodeMentor AI • Built for the Future
          </p>
        </footer>
      )}
    </div>
  );
};

// ============================================================
// MAIN APP
// ============================================================
const App = () => {
  const [firebaseReady, setFirebaseReady] = useState(false);

  useEffect(() => {
    import('./firebase/config').then(() => {
      setFirebaseReady(true);
    }).catch((err) => {
      console.error('Firebase import error:', err);
      setFirebaseReady(true);
    });
  }, []);

  if (!firebaseReady) {
    return <LoadingScreen />;
  }

  return (
    <HelmetProvider>
      <AuthProvider>
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}
        >
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </HelmetProvider>
  );
};

export default App;