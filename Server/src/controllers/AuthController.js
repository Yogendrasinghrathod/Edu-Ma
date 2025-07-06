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
    // console.error("Error in logout:", error);
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
   
    const {
      name,
      email,
      password,
      confirmPassword,
      accountType,
    } = req.body;

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
      }
    );
    // console.log(token)

    user.password = undefined;

    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: true, // Only secure in production
        sameSite: "strict",
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
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Login failed. Please try again.",
    });
  }
};

//change Password

const changePassword = (req, res) => {
  // Find user by ID
  User.findById(req.user.id)
    .then((userDetails) => {
      if (!userDetails) {
        throw new Error("User not found");
      }

      // Extract oldPassword and newPassword from req.body
      const { oldPassword, newPassword } = req.body;

      // Validate old password
      return bcrypt
        .compare(oldPassword, userDetails.password)

        .then((isPasswordMatch) => {
          if (!isPasswordMatch) {
            res.status(401).json({
              success: false,
              message: "The password is incorrect",
            });
            return Promise.reject("Password incorrect");
          }

          // Encrypt the new password
          return bcrypt.hash(newPassword, 10).then((encryptedPassword) => {
            return User.findByIdAndUpdate(
              req.user.id,
              { password: encryptedPassword },
              { new: true }
            );
          });
        });
    })
    .then((updatedUserDetails) => {
      if (!updatedUserDetails) {
        return; // Stop if previous response was sent
      }

      // Send notification email
      return mailSender(
        updatedUserDetails.email,
        "Password for your account has been updated",
        `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
      )
        .then((emailResponse) => {
          console.log("Email sent successfully:", emailResponse.response);
          res.status(200).json({
            success: true,
            message: "Password updated successfully",
          });
        })
        .catch((error) => {
          console.error("Error occurred while sending email:", error);
          res.status(500).json({
            success: false,
            message: "Error occurred while sending email",
            error: error.message,
          });
        });
    })
    .catch((error) => {
      // Only send error response if no response has been sent yet
      if (!res.headersSent) {
        console.error("Error occurred while updating password:", error);
        res.status(500).json({
          success: false,
          message: "Error occurred while updating the password",
          error: error.message,
        });
      }
    });
};

// Firebase signup function
const firebaseSignup = async (req, res) => {
  try {
    console.log("🔥 Firebase signup called");
    
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: "Firebase token is missing",
      });
    }

    const idToken = authHeader.split('Bearer ')[1];
    console.log("🔥 Firebase token received");

    // Verify the Firebase ID token
    const decodedToken = await firebaseAuth.verifyIdToken(idToken);
    console.log("✅ Firebase token verified for user:", decodedToken.email);

    // Check if user already exists
    const existingUser = await User.findOne({ email: decodedToken.email });
    if (existingUser) {
      // User exists, generate JWT token and return
      const token = jwt.sign(
        { id: existingUser._id },
        config.JWT_SECRET,
        { expiresIn: config.JWT_EXPIRE }
      );

      existingUser.password = undefined;

      return res
        .cookie("token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
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
      name: name || decodedToken.name || decodedToken.display_name || 'User',
      email: email || decodedToken.email,
      accountType: "Student",
      profilePhoto: decodedToken.picture || `https://api.dicebear.com/5.x/initials/svg?seed=${name || 'User'}`,
    });

    console.log("✅ New user created from Firebase:", newUser.email);

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser._id },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRE }
    );

    newUser.password = undefined;

    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
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
    console.error("❌ Firebase signup error:", error);
    return res.status(500).json({
      success: false,
      message: "Firebase authentication failed",
      error: error.message,
    });
  }
};

// Test Firebase configuration
const testFirebase = async (req, res) => {
  try {
    console.log("🧪 Testing Firebase configuration...");
    
    // Test if Firebase Admin SDK is properly initialized
    const { auth: firebaseAuth } = require("../config/firebase");
    
    // Try to list users (this will fail if not properly configured)
    try {
      await firebaseAuth.listUsers(1);
      console.log("✅ Firebase Admin SDK is working");
      res.status(200).json({
        success: true,
        message: "Firebase Admin SDK is properly configured",
      });
    } catch (error) {
      console.log("⚠️ Firebase Admin SDK test failed:", error.message);
      res.status(200).json({
        success: false,
        message: "Firebase Admin SDK is not properly configured",
        error: error.message,
        note: "Please ensure you have a valid firebaseServiceAccountKey.json file"
      });
    }
  } catch (error) {
    console.error("❌ Firebase test error:", error);
    res.status(500).json({
      success: false,
      message: "Firebase test failed",
      error: error.message,
    });
  }
};

module.exports = { 
  signup, 
  login, 
  changePassword, 
  logout, 
  firebaseSignup, 
  testFirebase 
};
