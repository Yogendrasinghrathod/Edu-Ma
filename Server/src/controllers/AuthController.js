const User = require("../models/UserSchema");

// const Profile = require("../models/ProfileSchema");
const bcrypt = require("bcryptjs");

const mailSender = require("../utils/mailSender");
const jwt = require("jsonwebtoken");
const { auth: firebaseAuth } = require("../config/firebase");
const config = require("../config/config");

const logout = async (req, res) => {
  try {
    // res.clearCookie();
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      msg: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Logout failed. Please try again.",
      error: error.message,
    });
  }
};

// Signup
const signup = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, accountType } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and Confirm Password do not match",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User is already registered. Please login to continue",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      accountType,
      profilePhoto: `${config.DICEBEAR_API_URL}?seed=${name}`,
    });

    user.password = undefined;

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User registration failed. Please try again.",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both email and password",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "The user account does not exist. Please signup.",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!config.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error: JWT Secret not found",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      config.JWT_SECRET,
      {
        expiresIn: config.JWT_EXPIRE,
      },
    );

    user.password = undefined;

    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000, // 3 days
      })
      .status(200)
      .json({
        success: true,
        token,
        user,
        message: "User logged in successfully",
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Login failed. Please try again.",
    });
  }
};

// Firebase signup function
const firebaseSignup = async (req, res) => {
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

    // Check if user already exists
    const existingUser = await User.findOne({ email: decodedToken.email });
    if (existingUser) {
      // User exists, generate JWT token and return
      const token = jwt.sign({ id: existingUser._id }, config.JWT_SECRET, {
        expiresIn: config.JWT_EXPIRE,
      });

      existingUser.password = undefined;

      return res
        .cookie("token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: 24 * 60 * 60 * 1000,
        })
        .status(200)
        .json({
          success: true,
          message: "User logged in successfully",
          user: existingUser,
          token,
        });
    }

    // Create new user
    const { name, email } = req.body;

    const newUser = await User.create({
      name: name || decodedToken.name || decodedToken.display_name || "User",
      email: email || decodedToken.email,
      accountType: "Student",
      profilePhoto:
        decodedToken.picture ||
        `https://api.dicebear.com/5.x/initials/svg?seed=${name || "User"}`,
    });

    // Generate JWT token
    const token = jwt.sign({ id: newUser._id }, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRE,
    });

    newUser.password = undefined;

    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(201)
      .json({
        success: true,
        message: "User registered successfully",
        user: newUser,
        token,
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Firebase authentication failed",
      error: error.message,
    });
  }
};

module.exports = {
  signup,
  login,
  logout,
  firebaseSignup,
};
