const jwt = require("jsonwebtoken");
const { auth: firebaseAuth } = require("../config/firebase");
const config = require("../config/config");
const User = require("../models/UserSchema");
// const Lecture = require("../models/lectureSchema");

// This function is used as middleware to authenticate user requests
exports.auth = async (req, res, next) => {
  try {
    // console.log("🔐 Auth middleware called for:", req.path);
    // console.log("Cookies:", req.cookies);
    
    // Extract token from different possible locations
    const token = req.cookies.token;

    // Check if token exists
    if (!token) {
      console.log("❌ No token found in cookies");
      return res.status(401).json({
        success: false,
        message: "Token is missing",
      });
    }

    // console.log("✅ Token found:", token.substring(0, 20) + "...");

    // Verify token
    const decoded = jwt.verify(token, config.JWT_SECRET);
    // console.log("✅ Token decoded successfully, user ID:", decoded.id);

    if (!decoded) {
      console.log("❌ Token verification failed");
      return res.status(401).json({
        message: "Invalid Token ",
        success: false,
      });
    }

    // Set user info in request
    req.id = decoded.id;
    // console.log("👤 User ID set in request:", req.id);

    // Move to next middleware
    next();

  } catch (error) {
    console.error("❌ Auth middleware error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Token is invalid",
    });
  }
};

// Firebase authentication middleware
exports.firebaseAuth = async (req, res, next) => {
  try {
    // console.log("🔥 Firebase auth middleware called");
    
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: "Firebase token is missing",
      });
    }

    const idToken = authHeader.split('Bearer ')[1];
    // console.log("🔥 Firebase token received");

    // Verify the Firebase ID token
    const decodedToken = await firebaseAuth.verifyIdToken(idToken);
    // console.log("✅ Firebase token verified for user:", decodedToken.email);

    // Find or create user in database
    let user = await User.findOne({ email: decodedToken.email });
    
    if (!user) {
      // Create new user if doesn't exist
      user = await User.create({
        name: decodedToken.name || decodedToken.display_name || 'User',
        email: decodedToken.email,
        accountType: "Student", // Default account type
        profilePhoto: decodedToken.picture || `${config.DICEBEAR_API_URL}?seed=${decodedToken.name || 'User'}`,
      });
      // console.log("✅ New user created from Firebase:", user.email);
    }

    // Set user info in request
    req.id = user._id;
    req.user = user;
    // console.log("👤 Firebase user ID set in request:", req.id);

    next();
  } catch (error) {
    console.error("❌ Firebase auth middleware error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Invalid Firebase token",
    });
  }
};



