import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Code2, Menu, X, Sun, Moon, Github, Twitter, Linkedin } from 'lucide-react';

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
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

          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className={`text-sm transition-colors duration-300 ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}>Home</Link>
            <Link to="/analyze" className={`text-sm transition-colors duration-300 ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}>Analyze</Link>
            <Link to="/dashboard" className={`text-sm transition-colors duration-300 ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}>Dashboard</Link>
            <Link to="/settings" className={`text-sm transition-colors duration-300 ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}>Settings</Link>
            
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-colors duration-300 ${darkMode ? 'hover:bg-white/5' : 'hover:bg-gray-100'}`}
            >
              {darkMode ? <Sun className="w-5 h-5 text-gray-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
            </button>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/5 transition"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-white/5">
            <div className="flex flex-col gap-3">
              <Link to="/" className={`text-sm transition-colors duration-300 ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}>Home</Link>
              <Link to="/analyze" className={`text-sm transition-colors duration-300 ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}>Analyze</Link>
              <Link to="/dashboard" className={`text-sm transition-colors duration-300 ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}>Dashboard</Link>
              <Link to="/settings" className={`text-sm transition-colors duration-300 ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}>Settings</Link>
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-colors duration-300 ${darkMode ? 'hover:bg-white/5' : 'hover:bg-gray-100'}`}
              >
                {darkMode ? <Sun className="w-5 h-5 text-gray-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;