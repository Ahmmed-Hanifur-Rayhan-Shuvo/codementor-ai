import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

const QualityScore = ({ score, darkMode = true }) => {
  const getColor = (score) => {
    if (score >= 80) return 'from-green-500 to-green-400';
    if (score >= 60) return 'from-yellow-500 to-yellow-400';
    if (score >= 40) return 'from-orange-500 to-orange-400';
    return 'from-red-500 to-red-400';
  };

  const getLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Needs Improvement';
    return 'Critical';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`rounded-2xl p-6 ${darkMode ? 'glass' : 'bg-white border border-gray-200'}`}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className={`text-lg font-semibold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          <TrendingUp className="w-5 h-5 text-primary" />
          Quality Score
        </h3>
        <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>{getLabel(score)}</span>
      </div>
      
      <div className="flex items-center gap-6">
        <div className={`text-6xl font-bold bg-gradient-to-r ${getColor(score)} bg-clip-text text-transparent`}>
          {score}
        </div>
        <div className="flex-1">
          <div className={`h-3 rounded-full overflow-hidden ${darkMode ? 'bg-dark-800' : 'bg-gray-200'}`}>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${score}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-full bg-gradient-to-r ${getColor(score)} rounded-full`}
            />
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span className={darkMode ? 'text-gray-500' : 'text-gray-400'}>0</span>
            <span className={darkMode ? 'text-gray-500' : 'text-gray-400'}>50</span>
            <span className={darkMode ? 'text-gray-500' : 'text-gray-400'}>100</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default QualityScore;