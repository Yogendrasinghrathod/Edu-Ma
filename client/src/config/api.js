export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const AUTH_API = `${API_BASE_URL}/auth`;
export const COURSE_API = `${API_BASE_URL}/course`;
export const COURSE_PROGRESS_API = `${API_BASE_URL}/progress`;
export const PURCHASE_API = `${API_BASE_URL}/purchase`;
export const PROFILE_API = `${API_BASE_URL}/profile`;

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ,
  appId: import.meta.env.VITE_FIREBASE_APP_ID ,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "",
};