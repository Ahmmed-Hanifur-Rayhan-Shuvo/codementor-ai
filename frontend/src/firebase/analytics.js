import { analytics, logEvent, setUserId, setCurrentScreen } from './config';

// Track page views
export const trackPageView = (page, title) => {
  if (analytics) {
    setCurrentScreen(analytics, page);
    logEvent(analytics, 'page_view', {
      page_title: title,
      page_location: window.location.href,
      page_path: page
    });
  }
};

// Track code analysis events
export const trackAnalysis = (language, issuesCount, autoFix = false, timeMs = 0) => {
  if (!analytics) return;
  
  logEvent(analytics, 'code_analysis', {
    language,
    issues_count: issuesCount,
    auto_fix_enabled: autoFix,
    processing_time_ms: timeMs,
    timestamp: new Date().toISOString()
  });
};

// Track issue fix
export const trackFix = (issueType, severity, autoFix = false) => {
  if (!analytics) return;
  
  logEvent(analytics, 'issue_fix', {
    issue_type: issueType,
    severity,
    auto_fix: autoFix
  });
};

// Track user engagement
export const trackEngagement = (action, label, value = null) => {
  if (!analytics) return;
  
  logEvent(analytics, 'engagement', {
    action,
    label,
    value
  });
};

// Track errors
export const trackError = (error, context = '') => {
  if (!analytics) return;
  
  logEvent(analytics, 'error', {
    error_message: error.message || error,
    error_context: context,
    url: window.location.href
  });
};

// Track performance
export const trackPerformance = (metric, value, unit = 'ms') => {
  if (!analytics) return;
  
  logEvent(analytics, 'performance', {
    metric,
    value,
    unit
  });
};

// Track feature usage
export const trackFeature = (feature, action, metadata = {}) => {
  if (!analytics) return;
  
  logEvent(analytics, 'feature_usage', {
    feature,
    action,
    ...metadata
  });
};