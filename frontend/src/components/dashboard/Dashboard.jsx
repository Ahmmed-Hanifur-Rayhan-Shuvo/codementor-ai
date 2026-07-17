import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Code2, Shield, Zap, Users, 
  Clock, CheckCircle, AlertCircle, BarChart3,
  Activity, Award, Target, Calendar
} from 'lucide-react';
import { getLanguages, getModels } from '../../api/client';

const Dashboard = ({ darkMode = true }) => {
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
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { icon: Code2, label: 'Total Analyses', value: stats.totalAnalyses, color: 'text-primary' },
    { icon: CheckCircle, label: 'Issues Fixed', value: stats.issuesFixed, color: 'text-green-500' },
    { icon: Users, label: 'Languages', value: stats.languages, color: 'text-secondary' },
    { icon: TrendingUp, label: 'Avg Score', value: stats.avgScore + '%', color: 'text-accent' },
  ];

  const recentActivities = [
    { language: 'Python', issues: 3, status: 'Fixed', time: '2 min ago' },
    { language: 'JavaScript', issues: 5, status: 'Pending', time: '15 min ago' },
    { language: 'Java', issues: 2, status: 'Fixed', time: '1 hour ago' },
    { language: 'TypeScript', issues: 4, status: 'Fixed', time: '2 hours ago' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Dashboard
            </h1>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
              Overview of your code analysis activity
            </p>
          </div>
          <button
            onClick={fetchData}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
              darkMode ? 'bg-white/5 hover:bg-white/10 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            <Activity className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-2xl p-6 ${
                darkMode ? 'glass' : 'bg-white border border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</p>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Languages */}
          <div className={`rounded-2xl p-6 ${darkMode ? 'glass' : 'bg-white border border-gray-200'}`}>
            <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              <Code2 className="w-5 h-5 text-primary" />
              Supported Languages
            </h3>
            <div className="flex flex-wrap gap-2">
              {languages.slice(0, 15).map((lang) => (
                <span key={lang} className={`px-3 py-1 rounded-full text-sm ${
                  darkMode ? 'bg-white/5 text-gray-300' : 'bg-gray-100 text-gray-700'
                }`}>
                  {lang}
                </span>
              ))}
              {languages.length > 15 && (
                <span className={`px-3 py-1 rounded-full text-sm ${
                  darkMode ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-500'
                }`}>
                  +{languages.length - 15} more
                </span>
              )}
            </div>
          </div>

          {/* AI Models */}
          <div className={`rounded-2xl p-6 ${darkMode ? 'glass' : 'bg-white border border-gray-200'}`}>
            <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              <Shield className="w-5 h-5 text-secondary" />
              AI Models Available
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
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-semibold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              <Clock className="w-5 h-5 text-accent" />
              Recent Activity
            </h3>
            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Last 24 hours</span>
          </div>
          <div className="space-y-3">
            {recentActivities.map((activity, i) => (
              <div key={i} className={`flex items-center justify-between p-3 rounded-lg ${
                darkMode ? 'bg-white/5' : 'bg-gray-50'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${darkMode ? 'bg-primary/20' : 'bg-primary/10'}`}>
                    <Code2 className="w-4 h-4 text-primary" />
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
                <span className={`text-xs px-2 py-1 rounded-full ${
                  activity.status === 'Fixed' 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {activity.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mt-6">
          {[
            { icon: Award, label: 'Streak', value: '12 days' },
            { icon: Target, label: 'Goal', value: '85%' },
            { icon: Calendar, label: 'Active', value: 'Today' },
          ].map((item, i) => (
            <div key={i} className={`col-span-1 rounded-xl p-4 text-center ${
              darkMode ? 'glass' : 'bg-white border border-gray-200'
            }`}>
              <item.icon className={`w-5 h-5 mx-auto mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{item.value}</p>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;