// Import the required modules
const express = require("express");
const router = express.Router(); // Single router
// const {resetPassword,resetPasswordToken}=require('../controllers/resetPassword')

// Import the required controllers and middleware functions
const {
  login,
  signup,
  logout,
  firebaseSignup,
} = require("../controllers/AuthController");
const {
  auth,
  isAdmin,
  isInstructor,
  isStudent,
} = require("../middlewares/middlewares");

// Define routes
router.post("/login", login); // Route for login
router.post("/signup", signup); // Route for signup
router.post("/firebase-signup", firebaseSignup); // Route for Firebase signup
// router.post("/changePassword",auth, changePassword)   //route to change password
router.post("/logout", logout); //route for logout

// router.post("/reset-password-token", resetPasswordToken) //route for restPasswordToken
// router.post("/reset-password", resetPassword)  //Route for reset password

// Export the router
module.exports = router;
