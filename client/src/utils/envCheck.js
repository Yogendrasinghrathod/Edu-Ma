// Environment Variables Check Utility
export const checkEnvironmentVariables = () => {
  console.log('🔍 Checking Environment Variables...');
  
  const envVars = {
    'VITE_API_BASE_URL': import.meta.env.VITE_API_BASE_URL,
    'VITE_FIREBASE_API_KEY': import.meta.env.VITE_FIREBASE_API_KEY,
    'VITE_FIREBASE_AUTH_DOMAIN': import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    'VITE_FIREBASE_PROJECT_ID': import.meta.env.VITE_FIREBASE_PROJECT_ID,
    'VITE_FIREBASE_STORAGE_BUCKET': import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    'VITE_FIREBASE_MESSAGING_SENDER_ID': import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    'VITE_FIREBASE_APP_ID': import.meta.env.VITE_FIREBASE_APP_ID,
    'VITE_FIREBASE_MEASUREMENT_ID': import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  };

  console.table(envVars);
  
  const missingVars = Object.entries(envVars)
    .filter(([key, value]) => !value)
    .map(([key]) => key);
  
  if (missingVars.length > 0) {
    console.warn('⚠️ Missing environment variables:', missingVars);
    console.warn('Please create a .env file in the client directory with these variables.');
  } else {
    console.log('✅ All environment variables are set!');
  }
  
  return missingVars.length === 0;
};

// Auto-run in development
if (import.meta.env.DEV) {
  checkEnvironmentVariables();
} 