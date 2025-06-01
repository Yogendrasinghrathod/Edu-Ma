const User = require("../models/UserSchema");

// const Profile = require("../models/ProfileSchema");
const bcrypt = require("bcryptjs");

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

//     const [name] = result.user.displayName;

//     await fetch("http://localhost:5000/api/signup", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${idToken}`, // Send token for verification
//       },
//       body: JSON.stringify({
//         name,
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
      profilePhoto: `https://api.dicebear.com/5.x/initials/svg?seed=${name}`,
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


    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error: JWT Secret not found",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    console.log(token)

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
