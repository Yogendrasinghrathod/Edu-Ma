import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyATjNkZ-Rcxv7j-w9z89WFW0vUi0o2M2eo",
  authDomain: "trial-7eabe.firebaseapp.com",
  projectId: "trial-7eabe",
  storageBucket: "trial-7eabe.firebasestorage.app",
  messagingSenderId: "1094605496558",
  appId: "1:1094605496558:web:aad5fec26d5d1db756d3ff",
  measurementId: "G-7L4719T5VD",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const idToken = await result.user.getIdToken(); // Get Firebase ID token

    const response = await fetch("http://localhost:5001/api/v1/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        name: result.user.displayName,
        email: result.user.email,
      }),
    });

    const data = await response.json();
    console.log("Server Response:", data);

    return data; // Return server response for further use
  } catch (error) {
    console.error("Error signing in:", error);
    throw error; // Ensure errors can be caught when calling this function
  }
};

export { auth };
