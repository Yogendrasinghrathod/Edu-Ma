const User = require("../models/UserSchema");

const Profile = require("../models/ProfileSchema");
const bcrypt = require("bcrypt");
const mailSender = require("../utils/mailSender");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

// const auth = getAuth();
// const provider = new GoogleAuthProvider();

// export const signInWithGoogle = async () => {
//   try {
//     const result = await signInWithPopup(auth, provider);
//     const idToken = await result.user.getIdToken(); // Firebase ID Token

//     const [firstName, lastName] = result.user.displayName.split(" ");

//     await fetch("http://localhost:5000/api/signup", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${idToken}`, // Send token for verification
//       },
//       body: JSON.stringify({
//         firstName,
//         lastName,
//         email: result.user.email,
//         image: result.user.photoURL,
//         accountType: "Student", // Change based on user selection
//       }),
//     });

//     console.log("User authenticated & sent to backend");
//   } catch (error) {
//     console.error("Error signing in:", error);
//   }
// };

const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      msg: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error in logout:", error);
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
    // Step 1 - Fetch data from request body
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
    } = req.body;

    // console.log(req.body);

    // Step 2 - Validate required fields
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });
    }

    // Step 3 - Match passwords
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and Confirm Password do not match",
      });
    }

    // Step 4 - Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // console.log("User exist");

      return res.status(400).json({
        success: false,
        message: "User is already registered. Please login to continue",
      });
    }

    // Step 5 - Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // console.log(hashedPassword);

    // Step 6 - Create a profile
    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: `temp_${Date.now()}`,
    });
    // console.log(profileDetails);

    // console.log(accountType)

    // console.log("Received Data:", req.body);

    // Step 7 - Create the user
    // console.log("Creating user...");

    const user = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: hashedPassword,
      accountType,
      approved: accountType === "Instructor" ? false : true,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    // Remove password from response
    user.password = undefined;

    // Step 8 - Return success response
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    // console.error("Error in signup:", error);
    return res.status(500).json({
      success: false,
      message: "User registration failed. Please try again.",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    // Step 1 - Fetch the data
    const { email, password } = req.body;

    // Step 2 - Validate the data
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both email and password",
      });
    }

    // Step 3 - Check if the user exists
    const user = await User.findOne({ email }).populate("additionalDetails");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "The user account does not exist. Please signup.",
      });
    }

    // Step 4 - Verify the password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Step 5 - Generate the JWT token
    const payload = {
      email: user.email,
      id: user._id,
      role: user.accountType,
    };

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error: JWT Secret not found",
      });
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Step 6 - Remove the password from the response
    user.password = undefined;

    // Step 7 - Return the response
    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Only secure in production
        sameSite: "Strict",
        maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
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

module.exports = { login };

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

module.exports = { signup, login, changePassword, logout };
