import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Code2, Shield, Zap, Users, 
  Clock, CheckCircle, AlertCircle, BarChart3
} from 'lucide-react';
import { getLanguages, getModels } from '../api/client';

const Dashboard = ({ darkMode }) => {
  const [stats, setStats] = useState({
    totalAnalyses: 0,
    issuesFixed: 0,
    languages: 0,
    avgScore: 0
  });
  const [languages, setLanguages] = useState([]);
  const [models, setModels] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const langData = await getLanguages();
      const modelData = await getModels();
      setLanguages(Object.keys(langData.languages || {}));
      setModels(Object.keys(modelData.providers || {}));
      setStats({
        totalAnalyses: 1247,
        issuesFixed: 892,
        languages: Object.keys(langData.languages || {}).length,
        avgScore: 78
      });
    } catch (error) {
      console.error('Dashboard error:', error);
    }
  };

  const statCards = [
    { icon: Code2, label: 'Total Analyses', value: stats.totalAnalyses, color: 'text-primary' },
    { icon: CheckCircle, label: 'Issues Fixed', value: stats.issuesFixed, color: 'text-green-500' },
    { icon: Users, label: 'Languages', value: stats.languages, color: 'text-secondary' },
    { icon: TrendingUp, label: 'Avg Score', value: stats.avgScore + '%', color: 'text-accent' },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className={`text-3xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Dashboard
        </h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-2xl p-6 ${darkMode ? 'glass' : 'bg-white border border-gray-200'}`}
            >
              <div className="flex items-center gap-3">
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</p>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Language & Model Info */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className={`rounded-2xl p-6 ${darkMode ? 'glass' : 'bg-white border border-gray-200'}`}>
            <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              <Code2 className="w-5 h-5 text-primary" />
              Supported Languages
            </h3>
            <div className="flex flex-wrap gap-2">
              {languages.slice(0, 12).map((lang) => (
                <span key={lang} className={`px-3 py-1 rounded-full text-sm ${
                  darkMode ? 'bg-white/5 text-gray-300' : 'bg-gray-100 text-gray-700'
                }`}>
                  {lang}
                </span>
              ))}
              {languages.length > 12 && (
                <span className={`px-3 py-1 rounded-full text-sm ${
                  darkMode ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-500'
                }`}>
                  +{languages.length - 12} more
                </span>
              )}
            </div>
          </div>

          <div className={`rounded-2xl p-6 ${darkMode ? 'glass' : 'bg-white border border-gray-200'}`}>
            <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              <Shield className="w-5 h-5 text-secondary" />
              AI Models
            </h3>
            <div className="flex flex-wrap gap-2">
              {models.map((model) => (
                <span key={model} className={`px-3 py-1 rounded-full text-sm ${
                  darkMode ? 'bg-white/5 text-gray-300' : 'bg-gray-100 text-gray-700'
                }`}>
                  {model}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className={`rounded-2xl p-6 mt-6 ${darkMode ? 'glass' : 'bg-white border border-gray-200'}`}>
          <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            <Clock className="w-5 h-5 text-accent" />
            Recent Activity
          </h3>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((_, i) => (
              <div key={i} className={`flex items-center justify-between p-3 rounded-lg ${
                darkMode ? 'bg-white/5' : 'bg-gray-50'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${darkMode ? 'bg-primary/20' : 'bg-primary/10'}`}>
                    <Code2 className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      Python code analysis
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      2 minutes ago • 3 issues found
                    </p>
                  </div>
                </div>
                <span className="text-xs text-green-500">Fixed</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;