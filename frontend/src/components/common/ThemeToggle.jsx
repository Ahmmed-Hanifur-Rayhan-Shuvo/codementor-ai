import { Sun, Moon } from 'lucide-react';

const ThemeToggle = ({ darkMode, toggleTheme }) => {
  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-lg transition-colors duration-300 ${
        darkMode ? 'hover:bg-white/5' : 'hover:bg-gray-100'
      }`}
      aria-label="Toggle theme"
    >
      {darkMode ? (
        <Sun className="w-5 h-5 text-gray-400" />
      ) : (
        <Moon className="w-5 h-5 text-gray-600" />
      )}
    </button>
  );
};

export default ThemeToggle;