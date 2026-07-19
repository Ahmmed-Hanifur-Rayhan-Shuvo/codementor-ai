// frontend/src/App.jsx

import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/common/Navbar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Home from './pages/Home';
import Analyze from './pages/Analyze';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';

// Loading Screen
const LoadingScreen = () => (
  <div className="flex items-center justify-center min-h-screen bg-dark-900">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="text-gray-400">Loading...</p>
    </div>
  </div>
);

// ============================================================
// PRIVATE ROUTE - লগইন প্রয়োজন
// ============================================================

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// ============================================================
// APP CONTENT
// ============================================================

const AppContent = () => {
  const { user, loading } = useAuth();
  const [darkMode, setDarkMode] = useState(true);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-dark-900' : 'bg-gray-50'}`}>
      <Toaster position="top-right" />
      
      {/* Navbar - সব পেজে দেখাবে, এমনকি Login/Register এও */}
      <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />
      
      <div className="pt-20">
        <Routes>
          {/* Public Routes - সবাই দেখতে পারে */}
          <Route path="/" element={<Home darkMode={darkMode} />} />
          <Route path="/login" element={<Login darkMode={darkMode} />} />
          <Route path="/register" element={<Register darkMode={darkMode} />} />
          
          {/* Private Routes - লগইন করতে হবে */}
          <Route 
            path="/analyze" 
            element={
              <PrivateRoute>
                <Analyze darkMode={darkMode} />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard darkMode={darkMode} />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <PrivateRoute>
                <Settings darkMode={darkMode} />
              </PrivateRoute>
            } 
          />
          
          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
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
    }).catch(() => {
      setFirebaseReady(true);
    });
  }, []);

  if (!firebaseReady) {
    return <LoadingScreen />;
  }

  return (
    <AuthProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;