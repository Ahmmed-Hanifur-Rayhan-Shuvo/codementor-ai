// frontend/src/components/common/Navbar.jsx

import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { logoutUser } from '../../firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code2, Menu, X, Sun, Moon, User, LogOut, 
  LayoutDashboard, Settings, Home, Terminal, 
  Sparkles, LogIn, UserPlus
} from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar = ({ darkMode, toggleTheme }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    const { error } = await logoutUser();
    if (error) {
      toast.error('Logout failed: ' + error);
    } else {
      toast.success('See you soon! 👋');
      navigate('/');
    }
  };

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/analyze', label: 'Analyze', icon: Terminal },
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled 
        ? darkMode 
          ? 'bg-dark-900/90 backdrop-blur-2xl border-b border-white/5 shadow-2xl' 
          : 'bg-white/90 backdrop-blur-2xl border-b border-gray-200 shadow-xl'
        : darkMode
          ? 'bg-transparent'
          : 'bg-transparent'
    }`}>
      <div className="container-fluid py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.95 }}
              className={`p-2.5 rounded-2xl transition-all duration-300 ${
                darkMode ? 'glass' : 'glass-light'
              }`}
            >
              <Code2 className="w-6 h-6 text-primary" />
            </motion.div>
            <div>
              <h1 className={`text-xl font-bold transition-colors duration-300 ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}>
                CodeMentor
                <span className="text-primary"> AI</span>
              </h1>
              <p className={`text-[10px] tracking-widest uppercase font-light transition-colors duration-300 ${
                darkMode ? 'text-gray-400' : 'text-gray-400'
              }`}>
                <Sparkles className="w-3 h-3 inline mr-1 text-primary" />
                2030 Enterprise Edition
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                {/* লগইন থাকলে Nav Links দেখাবে */}
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                      isActive(link.path)
                        ? darkMode
                          ? 'glass text-white'
                          : 'glass-light text-gray-800'
                        : darkMode
                          ? 'text-gray-400 hover:text-white hover:bg-white/5'
                          : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                    }`}
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                    {isActive(link.path) && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute inset-0 rounded-xl -z-10"
                        style={{
                          background: darkMode 
                            ? 'rgba(79, 70, 229, 0.15)' 
                            : 'rgba(79, 70, 229, 0.08)',
                          border: `1px solid ${darkMode ? 'rgba(79, 70, 229, 0.3)' : 'rgba(79, 70, 229, 0.2)'}`
                        }}
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>
                ))}

                {/* Theme Toggle */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleTheme}
                  className={`p-2.5 rounded-xl transition-all duration-300 ${
                    darkMode ? 'glass hover:bg-white/10' : 'glass-light hover:bg-gray-200'
                  }`}
                >
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: darkMode ? 0 : 180 }}
                    transition={{ duration: 0.4 }}
                  >
                    {darkMode ? (
                      <Sun className="w-5 h-5 text-yellow-400" />
                    ) : (
                      <Moon className="w-5 h-5 text-indigo-600" />
                    )}
                  </motion.div>
                </motion.button>

                {/* User Profile */}
                <div className="flex items-center gap-3 ml-2">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className={`flex items-center gap-3 px-3 py-1.5 rounded-xl transition-all duration-300 ${
                      darkMode ? 'glass' : 'glass-light'
                    }`}
                  >
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || 'User'}
                        className="w-8 h-8 rounded-full border-2 border-primary"
                      />
                    ) : (
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        darkMode ? 'bg-primary/20 text-primary' : 'bg-primary/10 text-primary'
                      }`}>
                        <User className="w-4 h-4" />
                      </div>
                    )}
                    <span className={`text-sm font-medium hidden lg:block ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {user.displayName || user.email?.split('@')[0] || 'User'}
                    </span>
                  </motion.div>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleLogout}
                    className={`p-2.5 rounded-xl transition-all duration-300 ${
                      darkMode ? 'glass hover:bg-red-500/10' : 'glass-light hover:bg-red-50'
                    }`}
                    title="Logout"
                  >
                    <LogOut className={`w-4 h-4 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
                  </motion.button>
                </div>
              </>
            ) : (
              <>
                {/* লগইন না থাকলে Login/Sign Up Button দেখাবে */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/login')}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                    darkMode ? 'glass text-white hover:bg-white/10' : 'glass-light text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/register')}
                  className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg hover:shadow-primary/25"
                >
                  <UserPlus className="w-4 h-4" />
                  Sign Up
                </motion.button>

                {/* Theme Toggle */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleTheme}
                  className={`p-2.5 rounded-xl transition-all duration-300 ${
                    darkMode ? 'glass hover:bg-white/10' : 'glass-light hover:bg-gray-200'
                  }`}
                >
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: darkMode ? 0 : 180 }}
                    transition={{ duration: 0.4 }}
                  >
                    {darkMode ? (
                      <Sun className="w-5 h-5 text-yellow-400" />
                    ) : (
                      <Moon className="w-5 h-5 text-indigo-600" />
                    )}
                  </motion.div>
                </motion.button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl glass transition-all duration-300"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="md:hidden mt-4 pt-4 border-t border-white/5 overflow-hidden"
            >
              {user ? (
                <>
                  {/* লগইন থাকলে Mobile Nav Links */}
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                        isActive(link.path)
                          ? darkMode
                            ? 'glass text-white'
                            : 'glass-light text-gray-800'
                          : darkMode
                            ? 'text-gray-400 hover:text-white hover:bg-white/5'
                            : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                      }`}
                    >
                      <link.icon className="w-5 h-5" />
                      <span className="font-medium">{link.label}</span>
                      {isActive(link.path) && (
                        <span className="ml-auto text-xs text-primary">●</span>
                      )}
                    </Link>
                  ))}
                  
                  <div className="flex items-center justify-between px-4 py-3 mt-2 border-t border-white/5">
                    <div className="flex items-center gap-3">
                      {user?.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt={user.displayName || 'User'}
                          className="w-10 h-10 rounded-full border-2 border-primary"
                        />
                      ) : (
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          darkMode ? 'bg-primary/20 text-primary' : 'bg-primary/10 text-primary'
                        }`}>
                          <User className="w-5 h-5" />
                        </div>
                      )}
                      <div>
                        <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          {user?.displayName || 'User'}
                        </p>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {user?.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={toggleTheme}
                        className={`p-2.5 rounded-xl transition-all duration-300 ${
                          darkMode ? 'glass hover:bg-white/10' : 'glass-light hover:bg-gray-100'
                        }`}
                      >
                        {darkMode ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
                      </button>
                      <button
                        onClick={handleLogout}
                        className={`p-2.5 rounded-xl transition-all duration-300 ${
                          darkMode ? 'glass hover:bg-red-500/10' : 'glass-light hover:bg-red-50'
                        }`}
                      >
                        <LogOut className={`w-4 h-4 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* লগইন না থাকলে Mobile Login/Sign Up */}
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate('/login');
                    }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 w-full ${
                      darkMode ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    <LogIn className="w-5 h-5" />
                    <span className="font-medium">Login</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate('/register');
                    }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 w-full ${
                      darkMode ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    <UserPlus className="w-5 h-5" />
                    <span className="font-medium">Sign Up</span>
                  </button>
                  
                  <div className="flex items-center justify-between px-4 py-3 mt-2 border-t border-white/5">
                    <button
                      onClick={toggleTheme}
                      className={`p-2.5 rounded-xl transition-all duration-300 ${
                        darkMode ? 'glass hover:bg-white/10' : 'glass-light hover:bg-gray-100'
                      }`}
                    >
                      {darkMode ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;