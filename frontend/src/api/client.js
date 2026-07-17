import axios from 'axios';

// API Base URL - Vercel-এ স্বয়ংক্রিয়ভাবে সেট হবে
const API_BASE = import.meta.env.VITE_API_URL || '/api/v1';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// ============================================================
// CORE API FUNCTIONS
// ============================================================

export const analyzeCode = async (code, language, autoFix = false, provider = null) => {
  try {
    const response = await api.post('/analyze', {
      code,
      language,
      auto_fix: autoFix,
      provider
    });
    return response.data;
  } catch (error) {
    console.error('Analysis error:', error.response?.data || error.message);
    throw error;
  }
};

export const checkHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch {
    return { status: 'offline' };
  }
};

// ============================================================
// DASHBOARD API FUNCTIONS
// ============================================================

export const getLanguages = async () => {
  try {
    const response = await api.get('/languages');
    return response.data;
  } catch (error) {
    console.error('Languages error:', error);
    return { languages: [] };
  }
};

export const getModels = async () => {
  try {
    const response = await api.get('/models');
    return response.data;
  } catch (error) {
    console.error('Models error:', error);
    return { providers: {} };
  }
};

// ============================================================
// ADDITIONAL API FUNCTIONS
// ============================================================

export const fixCode = async (code, language, issue) => {
  try {
    const response = await api.post('/fix', {
      code,
      language,
      issue
    });
    return response.data;
  } catch (error) {
    console.error('Fix error:', error.response?.data || error.message);
    throw error;
  }
};

export const switchModel = async (provider) => {
  try {
    const response = await api.post('/models/switch', null, {
      params: { provider }
    });
    return response.data;
  } catch (error) {
    console.error('Switch model error:', error);
    throw error;
  }
};

export const detectLanguage = async (code) => {
  try {
    const response = await api.get('/detect-language', {
      params: { code }
    });
    return response.data;
  } catch (error) {
    console.error('Detect language error:', error);
    return { language: 'unknown' };
  }
};

export const analyzeStatic = async (code, language) => {
  try {
    const response = await api.post('/analyze/static', {
      code,
      language
    });
    return response.data;
  } catch (error) {
    console.error('Static analysis error:', error);
    throw error;
  }
};

export const getSecurityPatterns = async () => {
  try {
    const response = await api.get('/security-patterns');
    return response.data;
  } catch (error) {
    console.error('Security patterns error:', error);
    return { patterns: [] };
  }
};

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default api;