const jwt = require("jsonwebtoken");
const { auth: firebaseAuth } = require("../config/firebase");
const config = require("../config/config");
const User = require("../models/UserSchema");
// const Lecture = require("../models/lectureSchema");

// This function is used as middleware to authenticate user requests
exports.auth = async (req, res, next) => {
  try {
   

    // Extract token from different possible locations
    const token = req.cookies.token;

    // Check if token exists
    if (!token) {
      
      return res.status(401).json({
        success: false,
        message: "Token is missing",
      });
    }



    // Verify token
    const decoded = jwt.verify(token, config.JWT_SECRET);
   

    if (!decoded) {
     
      return res.status(401).json({
        message: "Invalid Token ",
        success: false,
      });
    }

    // Set user info in request
    req.id = decoded.id;
 

    // Move to next middleware
    next();
  } catch (error) {
    
    return res.status(401).json({
      success: false,
      message: "Token is invalid",
    });
  }
};

// Firebase authentication middleware
exports.firebaseAuth = async (req, res, next) => {
  try {
   

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Firebase token is missing",
      });
    }

    const idToken = authHeader.split("Bearer ")[1];
  
    // Verify the Firebase ID token
    const decodedToken = await firebaseAuth.verifyIdToken(idToken);


    // Find or create user in database
    let user = await User.findOne({ email: decodedToken.email });

    if (!user) {
      // Create new user if doesn't exist
      user = await User.create({
        name: decodedToken.name || decodedToken.display_name || "User",
        email: decodedToken.email,
        accountType: "Student", // Default account type
        profilePhoto:
          decodedToken.picture ||
          `${config.DICEBEAR_API_URL}?seed=${decodedToken.name || "User"}`,
      });
     
    }

    // Set user info in request
    req.id = user._id;
    req.user = user;


    next();
  } catch (error) {
   
    return res.status(401).json({
      success: false,
      message: "Invalid Firebase token",
    });
  }
};
