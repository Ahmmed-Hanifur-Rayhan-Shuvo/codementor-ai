import { Github, Twitter, Linkedin, Globe, Terminal, Shield } from 'lucide-react';

const Footer = ({ darkMode = true }) => {
  return (
    <footer className={`border-t mt-16 py-8 transition-colors duration-300 ${
      darkMode ? 'border-white/5' : 'border-gray-200'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className={`flex items-center gap-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <Shield className="w-4 h-4" />
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
  );
};

export default Footer;