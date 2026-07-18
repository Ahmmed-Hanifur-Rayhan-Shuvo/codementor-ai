import axios from 'axios';

// ============================================================
// API CONFIGURATION
// ============================================================

const API_BASE = '/api/v1';

// ============================================================
// AXIOS INSTANCE
// ============================================================

const api = axios.create({
  baseURL: API_BASE,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request Interceptor - Logging
api.interceptors.request.use(
  (config) => {
    console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor - Logging
api.interceptors.response.use(
  (response) => {
    console.log(`📥 Response:`, response.status, response.data);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// ============================================================
// HEALTH CHECK
// ============================================================

export const checkHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    return { status: 'offline' };
  }
};

// ============================================================
// CODE ANALYSIS
// ============================================================

export const analyzeCode = async (code, language, autoFix = false, provider = null) => {
  try {
    console.log('🔍 Analyzing code...', { language, autoFix });
    
    const response = await api.post('/analyze', {
      code,
      language,
      auto_fix: autoFix,
      provider
    });
    
    console.log('✅ Analysis complete:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Analysis error:', error.response?.data || error.message);
    throw error;
  }
};

// ============================================================
// STATIC ANALYSIS ONLY
// ============================================================

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

// ============================================================
// BATCH ANALYSIS
// ============================================================

export const analyzeBatch = async (snippets, language, autoFix = false) => {
  try {
    const response = await api.post('/analyze/batch', {
      snippets,
      language,
      auto_fix: autoFix
    });
    return response.data;
  } catch (error) {
    console.error('Batch analysis error:', error);
    throw error;
  }
};

// ============================================================
// FIX CODE
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
    console.error('Fix error:', error);
    throw error;
  }
};

// ============================================================
// LANGUAGES
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

// ============================================================
// LANGUAGE DETECTION
// ============================================================

export const detectLanguage = async (code) => {
  try {
    const response = await api.post('/detect-language', { code });
    return response.data;
  } catch (error) {
    console.error('Language detection error:', error);
    return { language: 'unknown' };
  }
};

// ============================================================
// AI MODELS
// ============================================================

export const getModels = async () => {
  try {
    const response = await api.get('/models');
    return response.data;
  } catch (error) {
    console.error('Models error:', error);
    return { providers: {} };
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

// ============================================================
// SECURITY PATTERNS
// ============================================================

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
// METRICS
// ============================================================

export const getMetrics = async () => {
  try {
    const response = await api.get('/metrics');
    return response.data;
  } catch (error) {
    console.error('Metrics error:', error);
    return { metrics: {} };
  }
};

// ============================================================
// FILE UPLOAD
// ============================================================

export const uploadFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

// ============================================================
// AUTHENTICATION
// ============================================================

export const registerUser = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const verifyToken = async (token) => {
  try {
    const response = await api.get('/auth/verify', {
      params: { token }
    });
    return response.data;
  } catch (error) {
    console.error('Token verification error:', error);
    throw error;
  }
};

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default {
  checkHealth,
  analyzeCode,
  analyzeStatic,
  analyzeBatch,
  fixCode,
  getLanguages,
  detectLanguage,
  getModels,
  switchModel,
  getSecurityPatterns,
  getMetrics,
  uploadFile,
  registerUser,
  loginUser,
  verifyToken
};