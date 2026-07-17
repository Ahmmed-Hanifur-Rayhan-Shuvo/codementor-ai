import { useState } from 'react';
import { analyzeCode, getLanguages, getModels } from '../../api/client';
import { Code2, Loader2, Play, Wand2, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const CodeAnalyzer = ({ onAnalysisComplete, initialCode = '', darkMode = true }) => {
  const [code, setCode] = useState(initialCode);
  const [language, setLanguage] = useState('python');
  const [loading, setLoading] = useState(false);
  const [autoFix, setAutoFix] = useState(false);
  const [provider, setProvider] = useState('deepseek');

  const sampleCode = {
    python: `import sqlite3

def get_user_data(user_id):
    # SQL Injection vulnerability
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    query = f"SELECT * FROM users WHERE id = {user_id}"
    cursor.execute(query)
    return cursor.fetchall()

# Hardcoded password
PASSWORD = "admin123"

# Empty function
def unused_function():
    pass`,

    javascript: `import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [data, setData] = useState([]);
  
  // Missing dependency array
  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(setData);
  });
  
  // console.log in production
  console.log('Dashboard rendered');
  
  // Hardcoded API key
  const API_KEY = "sk_test_123456789";
  
  return <div>Dashboard</div>;
};

export default Dashboard;`
  };

  const loadSample = () => {
    setCode(sampleCode[language] || '');
    toast.success('✨ Sample code loaded!');
  };

  const handleAnalyze = async () => {
    if (!code.trim()) {
      toast.error('Please paste some code to analyze');
      return;
    }

    setLoading(true);
    try {
      const result = await analyzeCode(code, language, autoFix, provider);
      onAnalysisComplete(result);
      
      const count = result.issues?.length || 0;
      if (count === 0) {
        toast.success('✨ Perfect code! No issues found!');
      } else {
        toast.success(`🔍 Found ${count} issue(s)`);
        if (result.fixed_code && autoFix) {
          toast.success('🔧 Auto-fix applied!');
        }
      }
    } catch (error) {
      toast.error('Analysis failed. Please check backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`rounded-2xl p-6 ${darkMode ? 'glass' : 'bg-white border border-gray-200'}`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${darkMode ? 'bg-primary/20' : 'bg-primary/10'}`}>
            <Code2 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Code Analyzer
            </h2>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
              AI-powered code review with auto-fix
            </p>
          </div>
        </div>
        <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <div className="flex-1 min-w-[150px]">
          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Language
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className={`w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-primary transition ${
              darkMode ? 'bg-dark-800 border border-white/10 text-white' : 'bg-white border border-gray-300 text-gray-800'
            }`}
          >
            <option value="python">🐍 Python</option>
            <option value="javascript">⚡ JavaScript</option>
            <option value="typescript">📘 TypeScript</option>
            <option value="java">☕ Java</option>
            <option value="cpp">⚙️ C++</option>
            <option value="csharp">🔷 C#</option>
            <option value="ruby">💎 Ruby</option>
            <option value="go">🐹 Go</option>
            <option value="rust">🦀 Rust</option>
            <option value="php">🐘 PHP</option>
            <option value="swift">🦅 Swift</option>
            <option value="kotlin">📱 Kotlin</option>
          </select>
        </div>

        <div className="flex-1 min-w-[150px]">
          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            AI Model
          </label>
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            className={`w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-primary transition ${
              darkMode ? 'bg-dark-800 border border-white/10 text-white' : 'bg-white border border-gray-300 text-gray-800'
            }`}
          >
            <option value="deepseek">DeepSeek</option>
            <option value="openai">OpenAI</option>
            <option value="claude">Claude</option>
            <option value="gemini">Gemini</option>
          </select>
        </div>
        
        <div className="flex items-end">
          <button
            onClick={loadSample}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition ${
              darkMode ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            <Play className="w-4 h-4" />
            Sample
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <input
          type="checkbox"
          id="autoFix"
          checked={autoFix}
          onChange={(e) => setAutoFix(e.target.checked)}
          className="w-4 h-4 text-primary rounded focus:ring-primary bg-dark-800 border-white/10"
        />
        <label htmlFor="autoFix" className={`text-sm flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          <Wand2 className="w-4 h-4 text-purple-400" />
          Auto-fix issues
        </label>
      </div>

      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder={`// Paste your ${language} code here...`}
        className={`w-full h-80 p-4 rounded-xl font-mono text-sm focus:ring-2 focus:ring-primary resize-none transition ${
          darkMode ? 'bg-dark-900 border border-white/10 text-gray-200 placeholder-gray-500' : 'bg-gray-50 border border-gray-300 text-gray-800'
        }`}
        spellCheck={false}
      />

      <button
        onClick={handleAnalyze}
        disabled={loading || !code.trim()}
        className="mt-4 w-full px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-primary/25 transition disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <Code2 className="w-5 h-5" />
            {autoFix ? '🚀 Analyze & Fix' : '🔍 Analyze Code'}
          </>
        )}
      </button>

      <p className={`text-xs mt-3 text-center ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
        {autoFix ? '🔧 Auto-fix will generate corrected code' : '🔍 Static + AI analysis for comprehensive review'}
      </p>
    </motion.div>
  );
};

export default CodeAnalyzer;