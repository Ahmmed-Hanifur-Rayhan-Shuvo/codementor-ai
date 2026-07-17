import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Code2, Sparkles, Sun, Moon, Github, Twitter, Linkedin, Globe, Terminal } from 'lucide-react';
import { checkHealth } from './api/client';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const Analyze = lazy(() => import('./pages/Analyze'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [health, setHealth] = useState('checking');

  useEffect(() => {
    checkHealthStatus();
  }, []);

  const checkHealthStatus = async () => {
    try {
      const status = await checkHealth();
      setHealth(status.status === 'healthy' ? 'online' : 'offline');
    } catch {
      setHealth('offline');
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-dark-900' : 'bg-gray-50'}`}>
      <BrowserRouter>
        <Toaster position="top-right" />
        
        {/* Navigation */}
        <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b transition-colors duration-300 ${
          darkMode ? 'bg-dark-900/80 border-white/5' : 'bg-white/80 border-gray-200'
        }`}>
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-3 group">
                <div className={`p-2 rounded-xl transition-all duration-300 ${darkMode ? 'bg-primary/20' : 'bg-primary/10'}`}>
                  <Code2 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h1 className={`text-xl font-bold transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    CodeMentor AI
                  </h1>
                  <p className={`text-xs transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    v4.0 • Enterprise Edition
                  </p>
                </div>
              </Link>

              <div className="flex items-center gap-4">
                <Link to="/" className={`hidden md:block text-sm transition-colors duration-300 ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}>Home</Link>
                <Link to="/analyze" className={`hidden md:block text-sm transition-colors duration-300 ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}>Analyze</Link>
                <Link to="/dashboard" className={`hidden md:block text-sm transition-colors duration-300 ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}>Dashboard</Link>
                <Link to="/settings" className={`hidden md:block text-sm transition-colors duration-300 ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}>Settings</Link>

                <button
                  onClick={toggleDarkMode}
                  className={`p-2 rounded-lg transition-colors duration-300 ${darkMode ? 'hover:bg-white/5' : 'hover:bg-gray-100'}`}
                >
                  {darkMode ? <Sun className="w-5 h-5 text-gray-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
                </button>

                <div className="flex items-center gap-2 text-xs">
                  <div className={`w-2 h-2 rounded-full animate-pulse ${health === 'online' ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                    {health === 'online' ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="pt-20">
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Loading...</p>
              </div>
            </div>
          }>
            <Routes>
              <Route path="/" element={<Home darkMode={darkMode} />} />
              <Route path="/analyze" element={<Analyze darkMode={darkMode} />} />
              <Route path="/dashboard" element={<Dashboard darkMode={darkMode} />} />
              <Route path="/settings" element={<Settings darkMode={darkMode} />} />
            </Routes>
          </Suspense>
        </main>

        {/* Footer */}
        <footer className={`border-t mt-16 py-8 transition-colors duration-300 ${darkMode ? 'border-white/5' : 'border-gray-200'}`}>
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className={`flex items-center gap-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <span>© 2026-2030 CodeMentor AI • Enterprise Edition</span>
              </div>
              <div className="flex items-center gap-6">
                <a href="#" className={`transition-colors duration-300 ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}>
                  <Github className="w-5 h-5" />
                </a>
                <a href="#" className={`transition-colors duration-300 ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}>
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className={`transition-colors duration-300 ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}>
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className={`transition-colors duration-300 ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}>
                  <Globe className="w-5 h-5" />
                </a>
              </div>
              <div className={`flex items-center gap-2 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                <Terminal className="w-4 h-4" />
                <span>20+ Languages Supported</span>
              </div>
            </div>
          </div>
        </footer>
      </BrowserRouter>
    </div>
  );
}

export default App;