import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { 
  TrendingUp, Code2, Shield, Zap, Users, 
  Clock, CheckCircle, AlertCircle, BarChart3,
  User, Mail, Calendar, Award, Target, Activity,
  Sparkles, Wand2, Globe, Cpu
} from 'lucide-react';
import { getLanguages, getModels } from '../api/client';

const Dashboard = ({ darkMode = true }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalAnalyses: 0,
    issuesFixed: 0,
    languages: 0,
    avgScore: 0
  });
  const [languages, setLanguages] = useState([]);
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const langData = await getLanguages();
      const modelData = await getModels();
      
      const langList = langData.languages || langData || [];
      const modelList = modelData.providers ? Object.keys(modelData.providers) : [];
      
      setLanguages(Array.isArray(langList) ? langList : []);
      setModels(modelList);
      setStats({
        totalAnalyses: 1247,
        issuesFixed: 892,
        languages: Array.isArray(langList) ? langList.length : 0,
        avgScore: 78
      });
    } catch (error) {
      console.error('Dashboard error:', error);
      setLanguages(['Python', 'JavaScript', 'TypeScript', 'Java', 'C++']);
      setModels(['deepseek', 'openai', 'claude', 'gemini']);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { icon: Code2, label: 'Total Analyses', value: stats.totalAnalyses, color: 'from-blue-500 to-cyan-500' },
    { icon: CheckCircle, label: 'Issues Fixed', value: stats.issuesFixed, color: 'from-green-500 to-emerald-500' },
    { icon: Globe, label: 'Languages', value: stats.languages, color: 'from-purple-500 to-pink-500' },
    { icon: TrendingUp, label: 'Avg Score', value: stats.avgScore + '%', color: 'from-yellow-500 to-orange-500' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-pulse"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-primary border-r-secondary border-b-accent border-l-transparent animate-spin"></div>
          </div>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* User Profile Header - Glass Card */}
        <div className={`glass-card mb-8 ${darkMode ? 'glass' : 'glass-light'}`}>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex-shrink-0"
            >
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="w-24 h-24 rounded-full border-4 border-primary shadow-xl"
                />
              ) : (
                <div className={`w-24 h-24 rounded-full flex items-center justify-center border-4 border-primary shadow-xl ${
                  darkMode ? 'bg-primary/20 text-primary' : 'bg-primary/10 text-primary'
                }`}>
                  <User className="w-12 h-12" />
                </div>
              )}
            </motion.div>
            <div className="flex-1 text-center md:text-left">
              <h2 className={`text-2xl md:text-3xl font-bold flex items-center gap-2 justify-center md:justify-start ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}>
                {user?.displayName || 'User'}
                <Sparkles className="w-5 h-5 text-yellow-400" />
              </h2>
              <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                <Mail className="w-4 h-4 inline mr-1" />
                {user?.email}
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-2 justify-center md:justify-start">
                <span className={`text-sm flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <Calendar className="w-4 h-4" />
                  Member since 2026
                </span>
                <span className={`text-sm flex items-center gap-1 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                  <Activity className="w-4 h-4" />
                  Active now
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600'
              }`}>
                🟢 Online
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className={`glass-card ${darkMode ? 'glass' : 'glass-light'} text-center`}
            >
              <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-r ${stat.color} bg-opacity-10 mb-3`}>
                <stat.icon className={`w-8 h-8 text-white`} />
              </div>
              <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{stat.value}</p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Languages & Models */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <motion.div 
            whileHover={{ y: -5 }}
            className={`glass-card ${darkMode ? 'glass' : 'glass-light'}`}
          >
            <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              <Code2 className="w-5 h-5 text-primary" />
              Supported Languages
              <span className={`ml-auto text-xs px-3 py-1 rounded-full ${
                darkMode ? 'bg-primary/20 text-primary' : 'bg-primary/10 text-primary'
              }`}>
                {languages.length}+
              </span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {languages.slice(0, 15).map((lang, i) => (
                <motion.span
                  key={lang}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 ${
                    darkMode ? 'glass text-gray-300' : 'glass-light text-gray-700'
                  }`}
                >
                  {typeof lang === 'string' ? lang : lang.name || lang.value || 'Unknown'}
                </motion.span>
              ))}
              {languages.length > 15 && (
                <span className={`px-3 py-1.5 rounded-full text-sm ${
                  darkMode ? 'glass text-gray-400' : 'glass-light text-gray-500'
                }`}>
                  +{languages.length - 15} more
                </span>
              )}
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className={`glass-card ${darkMode ? 'glass' : 'glass-light'}`}
          >
            <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              <Cpu className="w-5 h-5 text-secondary" />
              AI Models Available
            </h3>
            <div className="flex flex-wrap gap-2">
              {models.map((model, i) => (
                <motion.span
                  key={model}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 ${
                    darkMode ? 'glass text-gray-300' : 'glass-light text-gray-700'
                  }`}
                >
                  {model}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div 
          whileHover={{ y: -5 }}
          className={`glass-card ${darkMode ? 'glass' : 'glass-light'}`}
        >
          <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            <Clock className="w-5 h-5 text-accent" />
            Recent Activity
          </h3>
          <div className="space-y-3">
            {[
              { language: 'Python', issues: 3, status: 'Fixed', time: '2 min ago', icon: '🐍' },
              { language: 'JavaScript', issues: 5, status: 'Pending', time: '15 min ago', icon: '⚡' },
              { language: 'Java', issues: 2, status: 'Fixed', time: '1 hour ago', icon: '☕' },
            ].map((activity, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 hover:scale-[1.02] ${
                  darkMode ? 'glass' : 'glass-light'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${
                    darkMode ? 'glass' : 'glass-light'
                  }`}>
                    <span className="text-2xl">{activity.icon}</span>
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {activity.language} code analysis
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {activity.time} • {activity.issues} issues found
                    </p>
                  </div>
                </div>
                <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${
                  activity.status === 'Fixed' 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {activity.status === 'Fixed' ? '✅ Fixed' : '⏳ Pending'}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;