import { useState } from 'react';
import CodeAnalyzer from '../components/analysis/CodeAnalyzer';
import ReportCard from '../components/analysis/ReportCard';
import QualityScore from '../components/analysis/QualityScore';
import { motion } from 'framer-motion';
import { Code2, AlertCircle, CheckCircle, Wand2, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const Analyze = ({ darkMode }) => {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [currentCode, setCurrentCode] = useState('');

  const handleApplyFix = (fixedCode) => {
    setCurrentCode(fixedCode);
    toast.success('✅ Fix applied to editor!');
  };

  const stats = analysisResult?.issues ? {
    total: analysisResult.issues.length,
    critical: analysisResult.issues.filter(i => i.severity === 'critical').length,
    high: analysisResult.issues.filter(i => i.severity === 'high').length,
    medium: analysisResult.issues.filter(i => i.severity === 'medium').length,
    low: analysisResult.issues.filter(i => i.severity === 'low').length,
    hasFixes: analysisResult.issues.some(i => i.fixed_code && i.fixed_code.trim() !== ''),
  } : null;

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid lg:grid-cols-5 gap-8"
      >
        {/* Left - Code Analyzer */}
        <div className="lg:col-span-3">
          <CodeAnalyzer 
            onAnalysisComplete={setAnalysisResult}
            initialCode={currentCode}
            darkMode={darkMode}
          />
        </div>
        
        {/* Right - Results */}
        <div className="lg:col-span-2 space-y-6">
          {analysisResult ? (
            <>
              {/* Quality Score */}
              <QualityScore score={analysisResult.quality_score} darkMode={darkMode} />

              {/* Stats */}
              {stats && stats.total > 0 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`rounded-2xl p-6 ${darkMode ? 'glass' : 'bg-white border border-gray-200'}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Issue Breakdown</h4>
                    {stats.hasFixes && (
                      <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full flex items-center gap-1">
                        <Wand2 className="w-3 h-3" />
                        Auto-Fix Ready
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {stats.critical > 0 && (
                      <div className="text-center p-2 bg-red-500/10 rounded-lg">
                        <div className="text-2xl font-bold text-red-400">{stats.critical}</div>
                        <div className="text-xs text-red-400">Critical</div>
                      </div>
                    )}
                    {stats.high > 0 && (
                      <div className="text-center p-2 bg-orange-500/10 rounded-lg">
                        <div className="text-2xl font-bold text-orange-400">{stats.high}</div>
                        <div className="text-xs text-orange-400">High</div>
                      </div>
                    )}
                    {stats.medium > 0 && (
                      <div className="text-center p-2 bg-yellow-500/10 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-400">{stats.medium}</div>
                        <div className="text-xs text-yellow-400">Medium</div>
                      </div>
                    )}
                    {stats.low > 0 && (
                      <div className="text-center p-2 bg-blue-500/10 rounded-lg">
                        <div className="text-2xl font-bold text-blue-400">{stats.low}</div>
                        <div className="text-xs text-blue-400">Low</div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Summary */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`rounded-2xl p-6 ${darkMode ? 'glass' : 'bg-white border border-gray-200'}`}
              >
                <h3 className={`text-lg font-semibold mb-2 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                  Summary
                </h3>
                <p className={darkMode ? 'text-gray-300 leading-relaxed' : 'text-gray-600 leading-relaxed'}>
                  {analysisResult.summary}
                </p>
              </motion.div>

              {/* Issues */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`rounded-2xl p-6 ${darkMode ? 'glass' : 'bg-white border border-gray-200'}`}
              >
                <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  Issues ({analysisResult.issues?.length || 0})
                  {analysisResult.fixed_code && (
                    <span className="ml-2 text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Fixed Code Ready
                    </span>
                  )}
                </h3>
                
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                  {analysisResult.issues?.map((issue, index) => (
                    <ReportCard 
                      key={index} 
                      issue={issue}
                      onApplyFix={handleApplyFix}
                      darkMode={darkMode}
                    />
                  ))}
                  
                  {(!analysisResult.issues || analysisResult.issues.length === 0) && (
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/10 rounded-full mb-4">
                        <CheckCircle className="w-12 h-12 text-green-400" />
                      </div>
                      <h4 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Perfect Code! 🎉</h4>
                      <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>No issues found. Great work!</p>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Fixed Code */}
              {analysisResult.fixed_code && analysisResult.issues?.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-2xl p-6 border ${darkMode ? 'glass border-green-500/20' : 'bg-white border-green-200'}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className={`text-lg font-semibold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      <Wand2 className="w-5 h-5 text-green-400" />
                      Complete Fixed Code
                    </h3>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(analysisResult.fixed_code);
                        toast.success('📋 Fixed code copied!');
                      }}
                      className="text-sm text-primary hover:text-primary-dark transition"
                    >
                      📋 Copy
                    </button>
                  </div>
                  <div className={`rounded-lg p-4 overflow-x-auto max-h-60 ${darkMode ? 'bg-dark-900' : 'bg-gray-900'}`}>
                    <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">
                      {analysisResult.fixed_code}
                    </pre>
                  </div>
                  <button
                    onClick={() => {
                      setCurrentCode(analysisResult.fixed_code);
                      toast.success('✅ Fixed code applied to editor!');
                    }}
                    className="mt-3 w-full text-sm bg-green-500/20 hover:bg-green-500/30 text-green-400 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition"
                  >
                    <Wand2 className="w-4 h-4" />
                    Apply All Fixes
                  </button>
                </motion.div>
              )}
            </>
          ) : (
            // Empty State
            <div className={`rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[400px] ${
              darkMode ? 'glass' : 'bg-white border border-gray-200'
            }`}>
              <div className={`p-4 rounded-full mb-4 ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                <Code2 className={`w-16 h-16 ${darkMode ? 'text-gray-400' : 'text-gray-300'}`} />
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Ready to Analyze
              </h3>
              <p className={darkMode ? 'text-gray-400 max-w-sm' : 'text-gray-500 max-w-sm'}>
                Paste your code and get AI-powered insights with <strong className="text-primary">auto-fix</strong> solutions.
              </p>
              <div className="mt-6 flex gap-2 text-xs flex-wrap justify-center">
                <span className={`px-3 py-1 rounded-full ${darkMode ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>🔒 Security</span>
                <span className={`px-3 py-1 rounded-full ${darkMode ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>⚡ Performance</span>
                <span className={`px-3 py-1 rounded-full ${darkMode ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>📐 Best Practices</span>
                <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400">🔧 Auto-Fix</span>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Analyze;