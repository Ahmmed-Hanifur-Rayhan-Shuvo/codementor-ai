import { useState } from 'react';
import { analyzeCode, fixCode } from '../api/client';

const useAnalysis = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const analyze = async (code, language, autoFix = false, provider = null) => {
    try {
      setLoading(true);
      setError(null);
      const data = await analyzeCode(code, language, autoFix, provider);
      setResult(data);
      return data;
    } catch (err) {
      setError(err.message || 'Analysis failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fix = async (code, language, issue) => {
    try {
      setLoading(true);
      const data = await fixCode(code, language, issue);
      return data;
    } catch (err) {
      setError(err.message || 'Fix failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setResult(null);
    setError(null);
  };

  return { loading, result, error, analyze, fix, clear };
};

export default useAnalysis;