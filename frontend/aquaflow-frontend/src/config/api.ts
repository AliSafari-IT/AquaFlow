// API Configuration for different environments
export const API_CONFIG = {
  // Development environment (local backend)
  development: {
    baseURL: 'https://localhost:7079', // Local backend URL
    endpoints: {
      hydrology: '/api/hydrology/calculate',
      hydrologyAdvanced: '/api/hydrology/calculate-advanced',
      hydrologyModels: '/api/hydrology/models'
    }
  },
  
  // Production environment (real backend with relative URLs)
  production: {
    baseURL: '', // Use relative URLs for production
    endpoints: {
      hydrology: '/api/hydrology/calculate',
      hydrologyAdvanced: '/api/hydrology/calculate-advanced',
      hydrologyModels: '/api/hydrology/models'
    }
  }
};

// Determine current environment
const getCurrentEnvironment = (): 'development' | 'production' => {
  // GitHub Pages deployment
  if (window.location.hostname.includes('github.io')) {
    return 'production';
  }
  
  // Local development
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'development';
  }
  
  // Default to production for other domains
  return 'production';
};

// Get current API configuration
export const getApiConfig = () => {
  const env = getCurrentEnvironment();
  return API_CONFIG[env];
};

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: keyof typeof API_CONFIG.development.endpoints): string => {
  const config = getApiConfig();
  return `${config.baseURL}${config.endpoints[endpoint]}`;
};

// Check if we're in demo mode (GitHub Pages only)
export const isDemoMode = (): boolean => {
  return window.location.hostname.includes('github.io');
};
