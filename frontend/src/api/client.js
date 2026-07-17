import axios from 'axios';

// Vercel-এ ডিপ্লয় করার সময় API URL স্বয়ংক্রিয়ভাবে সেট হবে
const API_BASE = import.meta.env.VITE_API_URL || '/api/v1';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json'
  }
});

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

export default api;