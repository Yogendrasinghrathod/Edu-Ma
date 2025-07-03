
const Course = require("../models/CourseSchema")
const User = require("../models/UserSchema")

const { uploadMedia, deleteMediaFromCloudinary } = require("../utils/cloudinary")
const mongoose = require("mongoose")

require('dotenv').config()

// Method for updating a profile
exports.updateProfile = async (req, res) => {
  try {
    
    const userId = req.id;
    const{name}=req.body;
    const profilePhoto=req.file;
    // console.log(profilePhoto)
    // Find the user and verify they exist
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    //if already an image uploaded then first destroy it 
    if(user.profilePhoto){
      const publicId=user.profilePhoto.split("/").pop().split(".")[0];
      deleteMediaFromCloudinary(publicId);
    }


    //upload new profile image
    const cloudResponse=await uploadMedia(profilePhoto.path);
    const photoUrl=cloudResponse.secure_url;

    const updatedData={name,profilePhoto:photoUrl}

    // Find the profile and verify it exists
    const updatedUser=await User.findByIdAndUpdate(userId,updatedData,{new:true}).select("-password");

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user:updatedUser
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error updating profile",
      error: error.message,
    });
  }
};
//Now lets write down the delete account handler 
exports.deleteAccount = async (req, res) => {
  try {
      const id = req.user.id;
      // console.log(id);

      const user = await User.findById({ _id: id });
      if (!user) {
          return res.status(404).json({
              success: false,
              message: "User not found",
          });
      }

      // Delete associated profile with the user
     

      for (const courseId of user.courses) {
          await Course.findByIdAndUpdate(
              courseId,
              { $pull: { studentsEnrolled: id } },
              { new: true }
          );
      }

      // Delete user
      await User.findByIdAndDelete({ _id: id });
      
      // Delete course progress
      // await CourseProgress.deleteMany({ userId: id }); 

      res.status(200).json({
          success: true,
          message: "User deleted successfully",
      });
  } catch (error) {
      console.log(error);
      // Ensure this only sends a response if no other response has been sent
      if (!res.headersSent) {
          res.status(500).json({ 
              success: false, 
              message: "User cannot be deleted successfully" 
          });
      }
  }
};

//Writing the get handler function for accessing all the details of the user
exports.getAllUserDetails = async (req, res) => {
    try {
      const userId = req.id
      const user = await User.findById(userId).select("-password").populate("enrolledCourses")
       
      // console.log(user)

      if(!user){
        return res.status(401).json({
          message:"Profile not found",
          success:"false"
        })
      }
      // console.log("not issue in getting user")
      return res.status(200).json({
        success: true,
        message: "User Data fetched successfully",
        user,
        
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
}



  



