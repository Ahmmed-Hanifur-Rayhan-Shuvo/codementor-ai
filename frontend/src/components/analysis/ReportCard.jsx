// frontend/src/components/analysis/ReportCard.jsx

import { useState } from 'react';
import { AlertCircle, AlertTriangle, Info, Bug, Shield, Code, Copy, Check, Wand2, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';

const severityConfig = {
  critical: {
    bg: 'bg-red-50 dark:bg-red-900/30',
    border: 'border-red-500',
    text: 'text-red-700 dark:text-red-400',
    icon: AlertCircle,
    label: 'Critical'
  },
  high: {
    bg: 'bg-orange-50 dark:bg-orange-900/30',
    border: 'border-orange-500',
    text: 'text-orange-700 dark:text-orange-400',
    icon: Bug,
    label: 'High'
  },
  medium: {
    bg: 'bg-yellow-50 dark:bg-yellow-900/30',
    border: 'border-yellow-500',
    text: 'text-yellow-700 dark:text-yellow-400',
    icon: AlertTriangle,
    label: 'Medium'
  },
  low: {
    bg: 'bg-blue-50 dark:bg-blue-900/30',
    border: 'border-blue-400',
    text: 'text-blue-700 dark:text-blue-400',
    icon: Info,
    label: 'Low'
  }
};

const ReportCard = ({ issue, onApplyFix, isDark = false }) => {
  const [showFix, setShowFix] = useState(false);
  const [copied, setCopied] = useState(false);
  const [applied, setApplied] = useState(false);
  
  const config = severityConfig[issue.severity] || severityConfig.low;
  const Icon = config.icon;
  
  // চেক করুন ফিক্স আছে কিনা
  const hasFix = issue.fixed_code && issue.fixed_code.trim() !== '';

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('📋 Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  const handleApplyFix = () => {
    if (hasFix && onApplyFix) {
      onApplyFix(issue.fixed_code);
      setApplied(true);
      toast.success('✅ Fix applied successfully!');
      setTimeout(() => setApplied(false), 3000);
    }
  };

  return (
    <div className={`border-l-4 ${config.border} ${config.bg} p-4 rounded-r-xl transition hover:shadow-md`}>
      <div className="flex items-start gap-3">
        <div className={`p-1 rounded-full ${config.bg} flex-shrink-0`}>
          <Icon className={`w-5 h-5 ${config.text}`} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h4 className={`font-semibold ${config.text}`}>
              {issue.message}
            </h4>
            <span className={`text-xs px-2 py-0.5 rounded-full ${config.bg} ${config.text} font-medium`}>
              {config.label}
            </span>
            {hasFix && (
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Wand2 className="w-3 h-3" />
                Fix Available
              </span>
            )}
          </div>
          
          {/* Suggestion */}
          {issue.suggestion && (
            <div className="mt-2 flex items-start gap-2">
              <Shield className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                <span className="font-medium">💡 Solution:</span> {issue.suggestion}
              </p>
            </div>
          )}
          
          {/* Line number */}
          {issue.line > 0 && (
            <div className={`mt-2 flex items-center gap-2 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              <Code className="w-3 h-3" />
              <span>Line {issue.line}</span>
            </div>
          )}

          {/* ============================================================
              FIX CODE SECTION - আলাদাভাবে দেখাবে
              ============================================================ */}
          
          {hasFix && (
            <div className="mt-3">
              {/* Toggle Button */}
              <button
                onClick={() => setShowFix(!showFix)}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium flex items-center gap-1 transition"
              >
                {showFix ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                {showFix ? 'Hide Fix' : 'Show Fix'}
              </button>
              
              {/* Fix Code Display */}
              {showFix && (
                <div className="mt-2 bg-gray-900 rounded-lg p-3 relative">
                  {/* Fix Code Label */}
                  <div className="flex items-center gap-2 mb-2">
                    <Wand2 className="w-4 h-4 text-green-400" />
                    <span className="text-xs text-gray-400 font-medium">🔧 Fixed Code</span>
                  </div>
                  
                  {/* Fixed Code - এখানে আসল ফিক্স কোড দেখাবে */}
                  <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap overflow-x-auto max-h-40">
                    {issue.fixed_code}
                  </pre>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleCopy(issue.fixed_code)}
                      className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded flex items-center gap-1 transition"
                    >
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                    <button
                      onClick={handleApplyFix}
                      disabled={applied}
                      className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded flex items-center gap-1 transition disabled:opacity-50"
                    >
                      <Wand2 className="w-3 h-3" />
                      {applied ? 'Applied!' : 'Apply Fix'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportCard;