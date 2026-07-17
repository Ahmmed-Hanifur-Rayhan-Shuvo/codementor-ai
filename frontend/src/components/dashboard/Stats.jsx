import { motion } from 'framer-motion';
import { TrendingUp, Users, Code2, CheckCircle } from 'lucide-react';

const Stats = ({ darkMode = true }) => {
  const stats = [
    { icon: Code2, label: 'Total Analyses', value: '1,247', color: 'text-primary' },
    { icon: CheckCircle, label: 'Issues Fixed', value: '892', color: 'text-green-500' },
    { icon: Users, label: 'Active Users', value: '156', color: 'text-secondary' },
    { icon: TrendingUp, label: 'Avg Score', value: '78%', color: 'text-accent' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
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
  );
};

export default Stats;