const express = require("express")
const router = express.Router()
const { auth , isInstructor} = require("../middlewares/middlewares")



const {
  deleteAccount,
  updateProfile,
  getAllUserDetails,
} = require("../controllers/profileController")
const upload = require("../utils/multer");



// router.delete("/deleteProfile", auth, deleteAccount)
router.put("/profile/update", auth, upload.single("profilePhoto"),updateProfile)
router.get("/profile", auth, getAllUserDetails)



module.exports = router;