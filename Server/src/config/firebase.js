const admin = require("firebase-admin");

let auth;
let firebaseInitialized = false;

try {
  const serviceAccount = require("../firebaseServiceAccountKey.json");

  if (serviceAccount && serviceAccount.project_id) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    auth = admin.auth();
    firebaseInitialized = true;
    console.log("✅ Firebase Admin SDK initialized successfully.");
  } else {
    // This will be caught by the catch block below
    throw new Error("The service account key is missing required fields (e.g., project_id).");
  }
} catch (error) {
  console.error("❌ CRITICAL: Could not initialize Firebase Admin SDK.");
  console.error("👉 Reason:", error.message);
  console.error("👉 ACTION: Please ensure a valid 'firebaseServiceAccountKey.json' file exists in the 'Server/src/' directory.");

  // Create a dummy auth object that will throw a clear error if used
  auth = {
    verifyIdToken: () => Promise.reject(new Error("Firebase not initialized. Check server logs for setup instructions.")),
    listUsers: () => Promise.reject(new Error("Firebase not initialized. Check server logs for setup instructions.")),
  };
}

module.exports = { auth, firebaseInitialized };
