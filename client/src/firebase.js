import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";


// Firebase Config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyC220cCAFaXZ9jgdxhP_kZjT0Nax5uYn1c",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "eduma-4e8e7.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "eduma-4e8e7",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "eduma-4e8e7.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "262228908128",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:262228908128:web:YOUR_APP_ID",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Configure Google Auth Provider to prevent COOP warnings
provider.setCustomParameters({
  prompt: 'select_account'
});

export const signInWithGoogle = async () => {
  try {
    console.log("🔥 Starting Google sign-in process...");
    const result = await signInWithPopup(auth, provider);
    const idToken = await result.user.getIdToken(); // Get Firebase ID token

    console.log("✅ Google sign-in successful, calling backend...");
    console.log("User info:", {
      name: result.user.displayName,
      email: result.user.email,
      photoURL: result.user.photoURL
    });

    const response = await fetch(import.meta.env.VITE_FIREBASE_Res, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        name: result.user.displayName,
        email: result.user.email,
      }),
      credentials: 'include', // Include cookies
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Backend error:", errorData);
      throw new Error(errorData.message || 'Backend authentication failed');
    }

    const data = await response.json();
    console.log("✅ Server Response:", data);

    // Store the JWT token in localStorage for client-side use
    if (data.token) {
      localStorage.setItem('token', data.token);
      console.log("✅ JWT token stored in localStorage");
    }

    return data; // Return server response for further use
  } catch (error) {
    console.error("❌ Error signing in:", error);
    throw error; // Ensure errors can be caught when calling this function
  }
};

export { auth };
