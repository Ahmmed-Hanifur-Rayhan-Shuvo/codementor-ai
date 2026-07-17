import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Code2, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';

const History = ({ darkMode = true }) => {
  const [history] = useState([
    { id: 1, language: 'Python', issues: 3, status: 'Fixed', date: '2026-07-17 14:30' },
    { id: 2, language: 'JavaScript', issues: 5, status: 'Pending', date: '2026-07-17 14:15' },
    { id: 3, language: 'Java', issues: 2, status: 'Fixed', date: '2026-07-17 13:00' },
    { id: 4, language: 'TypeScript', issues: 4, status: 'Fixed', date: '2026-07-17 12:30' },
    { id: 5, language: 'Python', issues: 1, status: 'Fixed', date: '2026-07-17 11:00' },
  ]);

  return (
    <div className={`rounded-2xl p-6 ${darkMode ? 'glass' : 'bg-white border border-gray-200'}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          <Clock className="w-5 h-5 text-accent" />
          Analysis History
        </h3>
        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Last 24 hours
        </span>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
        {history.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`flex items-center justify-between p-3 rounded-lg ${
              darkMode ? 'bg-white/5' : 'bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${darkMode ? 'bg-primary/20' : 'bg-primary/10'}`}>
                <Code2 className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {item.language}
                </p>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {item.date} • {item.issues} issues
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs px-2 py-1 rounded-full ${
                item.status === 'Fixed' 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-yellow-500/20 text-yellow-400'
              }`}>
                {item.status === 'Fixed' ? (
                  <CheckCircle className="w-3 h-3 inline mr-1" />
                ) : (
                  <AlertCircle className="w-3 h-3 inline mr-1" />
                )}
                {item.status}
              </span>
              <button className={`p-1 rounded ${darkMode ? 'hover:bg-white/5' : 'hover:bg-gray-200'}`}>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default History;