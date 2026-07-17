import { useState } from 'react';
import { AlertCircle, AlertTriangle, Info, Bug, Shield, Code, Copy, Check, Wand2, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const severityConfig = {
  critical: { bg: 'bg-red-500/10', border: 'border-red-500', text: 'text-red-400', icon: AlertCircle, label: 'Critical' },
  high: { bg: 'bg-orange-500/10', border: 'border-orange-500', text: 'text-orange-400', icon: Bug, label: 'High' },
  medium: { bg: 'bg-yellow-500/10', border: 'border-yellow-500', text: 'text-yellow-400', icon: AlertTriangle, label: 'Medium' },
  low: { bg: 'bg-blue-500/10', border: 'border-blue-500', text: 'text-blue-400', icon: Info, label: 'Low' }
};

const ReportCard = ({ issue, onApplyFix, darkMode = true }) => {
  const [showFix, setShowFix] = useState(false);
  const [copied, setCopied] = useState(false);
  const [applied, setApplied] = useState(false);
  
  const config = severityConfig[issue.severity] || severityConfig.low;
  const Icon = config.icon;
  const hasFix = issue.fixed_code && issue.fixed_code.trim() !== '';

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('📋 Copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  const handleApplyFix = () => {
    if (hasFix && onApplyFix) {
      onApplyFix(issue.fixed_code);
      setApplied(true);
      toast.success('✅ Fix applied!');
      setTimeout(() => setApplied(false), 3000);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`border-l-4 ${config.border} ${config.bg} p-4 rounded-r-xl`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-1 rounded-full ${config.bg} flex-shrink-0`}>
          <Icon className={`w-5 h-5 ${config.text}`} />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h4 className={`font-semibold ${config.text}`}>{issue.message}</h4>
            <span className={`text-xs px-2 py-0.5 rounded-full ${config.bg} ${config.text} font-medium`}>
              {config.label}
            </span>
            {hasFix && (
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Wand2 className="w-3 h-3" />
                Fix
              </span>
            )}
          </div>
          
          {issue.suggestion && (
            <div className="mt-2 flex items-start gap-2">
              <Shield className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
              <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>💡 {issue.suggestion}</p>
            </div>
          )}
          
          {issue.line > 0 && (
            <div className={`mt-2 flex items-center gap-2 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              <Code className="w-3 h-3" />
              <span>Line {issue.line}</span>
            </div>
          )}

          {hasFix && (
            <div className="mt-3">
              <button
                onClick={() => setShowFix(!showFix)}
                className="text-sm text-primary hover:text-primary-dark font-medium flex items-center gap-1 transition"
              >
                {showFix ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                {showFix ? 'Hide Fix' : 'Show Fix'}
              </button>
              
              {showFix && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-2 bg-dark-900 rounded-lg p-3"
                >
                  <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap overflow-x-auto max-h-40">
                    {issue.fixed_code}
                  </pre>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleCopy(issue.fixed_code)}
                      className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded flex items-center gap-1 transition"
                    >
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                    <button
                      onClick={handleApplyFix}
                      disabled={applied}
                      className="text-xs bg-primary hover:bg-primary-dark text-white px-3 py-1 rounded flex items-center gap-1 transition disabled:opacity-50"
                    >
                      <Wand2 className="w-3 h-3" />
                      {applied ? 'Applied!' : 'Apply Fix'}
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ReportCard;