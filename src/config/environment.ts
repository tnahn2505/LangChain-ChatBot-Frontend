// Environment configuration
export const config = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000',
  APP_NAME: import.meta.env.VITE_APP_NAME || 'ChatGPT',
  ENVIRONMENT: import.meta.env.MODE || 'development',
  IS_DEVELOPMENT: import.meta.env.MODE === 'development',
  IS_PRODUCTION: import.meta.env.MODE === 'production',
  API_TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),
  API_RETRY_ATTEMPTS: parseInt(import.meta.env.VITE_API_RETRY_ATTEMPTS || '3'),
  ENABLE_OFFLINE_MODE: import.meta.env.VITE_ENABLE_OFFLINE_MODE === 'true'
};

// Validate required environment variables
if (!config.API_BASE_URL) {
  console.warn('VITE_API_BASE_URL is not set, using default localhost URL');
}

// Log configuration in development
if (config.IS_DEVELOPMENT) {
  console.log('App Configuration:', {
    API_BASE_URL: config.API_BASE_URL,
    APP_NAME: config.APP_NAME,
    ENVIRONMENT: config.ENVIRONMENT,
    API_TIMEOUT: config.API_TIMEOUT,
    API_RETRY_ATTEMPTS: config.API_RETRY_ATTEMPTS,
    ENABLE_OFFLINE_MODE: config.ENABLE_OFFLINE_MODE
  });
}
