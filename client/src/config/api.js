// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Individual API endpoints
export const AUTH_API = `${API_BASE_URL}/auth`;
export const COURSE_API = `${API_BASE_URL}/course`;
export const COURSE_PROGRESS_API = `${API_BASE_URL}/progress`;
export const PURCHASE_API = `${API_BASE_URL}/purchase`;
export const PROFILE_API = `${API_BASE_URL}/profile`;

// Firebase Configuration
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ,
  appId: import.meta.env.VITE_FIREBASE_APP_ID ,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "",
};

// Validate Firebase configuration
const validateFirebaseConfig = () => {
  const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
  const missingFields = requiredFields.filter(field => !firebaseConfig[field]);
  
  if (missingFields.length > 0) {
    console.warn('⚠️ Missing Firebase environment variables:', missingFields);
    console.warn('Please check your .env file and ensure all VITE_FIREBASE_* variables are set.');
  }
  
  return missingFields.length === 0;
};

// Log configuration status - disabled for now
// if (import.meta.env.DEV) {
//   console.log('🔥 Firebase Config Status:', {
//     apiKey: firebaseConfig.apiKey ? '✅ Set' : '❌ Missing',
//     authDomain: firebaseConfig.authDomain ? '✅ Set' : '❌ Missing',
//     projectId: firebaseConfig.projectId ? '✅ Set' : '❌ Missing',
//     storageBucket: firebaseConfig.storageBucket ? '✅ Set' : '❌ Missing',
//     messagingSenderId: firebaseConfig.messagingSenderId ? '✅ Set' : '❌ Missing',
//     appId: firebaseConfig.appId ? '✅ Set' : '❌ Missing',
//   });
//   
//   validateFirebaseConfig();
// } 