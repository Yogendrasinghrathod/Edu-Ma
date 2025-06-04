const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/UserSchema");

// This function is used as middleware to authenticate user requests
exports.auth = async (req, res, next) => {
  try {
    console.log()
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
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("Decoded user:", req.user);

    if (!decoded) {
      return res.status(401).json({
        message: "Invalid Token ",
        success: false,
      });
    }

    // Set user info in request
    req.id = decoded.id;

    // console.log(req.id);

    // Move to next middleware
    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token is invalid",
    });
  }
};



