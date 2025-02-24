const Profile = require("../models/ProfileSchema")
const Course = require("../models/CourseSchema")
const User = require("../models/UserSchema")
// const CourseProgress = require("../models/CourseProgress")
const { uploadImageToCloudinary } = require("../utils/imageUploader")
const mongoose = require("mongoose")
// const { convertSecondsToDuration } = require("../utils/secToDuration")
require('dotenv').config()

// Method for updating a profile
exports.updateProfile = async (req, res) => {
  try {
    const {
      dateOfBirth = "",
      about = "",
      contactNumber = "",
      gender = "",
    } = req.body;
    const id = req.user.id;
    

    // Find the user and verify they exist
    const userDetails = await User.findById(id);
    
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Find the profile and verify it exists
    const profile = await Profile.findById(userDetails.additionalDetails);
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found"
      });
    }

    // Update profile with validated data
    if (dateOfBirth) profile.dateOfBirth = dateOfBirth;
    if (about) profile.about = about;
    if (contactNumber) profile.contactNumber = contactNumber;
    if (gender) {
      // Validate gender against enum values
      if (!["male", "female", "Prefer Not Say"].includes(gender)) {
        return res.status(400).json({
          success: false,
          message: "Invalid gender value"
        });
      }
      profile.gender = gender;
    }

    // Save the profile
    await profile.save();

    // Get updated user details
    const updatedUserDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec();

    return res.json({
      success: true,
      message: "Profile updated successfully",
      updatedUserDetails,
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
      console.log(id);

      const user = await User.findById({ _id: id });
      if (!user) {
          return res.status(404).json({
              success: false,
              message: "User not found",
          });
      }

      // Delete associated profile with the user
      await Profile.findByIdAndDelete({
          _id: new mongoose.Types.ObjectId(user.additionalDetails),
      });

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
      const id = req.user.id
      const userDetails = await User.findById(id)
        .populate("additionalDetails")
        .exec()
      console.log(userDetails)
      res.status(200).json({
        success: true,
        message: "User Data fetched successfully",
        data: userDetails,
        isLoading:false
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
}

exports.updateDisplayPicture = async (req, res) => {
  console.log("Received files:", req.files);

    try {
      const displayPicture = req.files.displayPicture
      // console.log(req.files.displayPicture);
      const userId = req.user.id
      // console.log(userId)
      const image = await uploadImageToCloudinary(
        displayPicture,
        process.env.FOLDER_NAME,
        1000,
        1000
      )
      console.log(image)
      const updatedProfile = await User.findByIdAndUpdate(
        { _id: userId },
        { image: image.secure_url },
        { new: true }
      )
    
      // console.log(updatedProfile)
      res.send({
        success: true,
        message: `Image Updated successfully`,
        data: updatedProfile,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        "hi":"fix this ypgo ",
        message: error.message,
      })
    }
}

exports.getEnrolledCourses = async (req, res) => {
	try {
	  const userId = req.user.id
	  let userDetails = await User.findOne({
		_id: userId,
	  })
		.populate({
		  path: "courses",
		  populate: {
			path: "courseContent",
			populate: {
			  path: "subSection",
			},
		  },
		})
		.exec()

	  userDetails = userDetails.toObject()
	  var SubsectionLength = 0
	  for (var i = 0; i < userDetails.courses.length; i++) {
		let totalDurationInSeconds = 0
		SubsectionLength = 0
		for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
		  totalDurationInSeconds += userDetails.courses[i].courseContent[
			j
		  ].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
		  userDetails.courses[i].totalDuration = convertSecondsToDuration(
			totalDurationInSeconds
		  )
		  SubsectionLength +=
			userDetails.courses[i].courseContent[j].subSection.length
		}
		let courseProgressCount = await CourseProgress.findOne({
		  courseID: userDetails.courses[i]._id,
		  userId: userId,
		})
		courseProgressCount = courseProgressCount?.completedVideos.length
		if (SubsectionLength === 0) {
		  userDetails.courses[i].progressPercentage = 100
		} else {
		  // To make it up to 2 decimal point
		  const multiplier = Math.pow(10, 2)
		  userDetails.courses[i].progressPercentage =
			Math.round(
			  (courseProgressCount / SubsectionLength) * 100 * multiplier
			) / multiplier
		}
	  }
  
	  if (!userDetails) {
		return res.status(400).json({
		  success: false,
		  message: `Could not find user with id: ${userDetails}`,
		})
	  }
	  return res.status(200).json({
		success: true,
		data: userDetails.courses,
	  })
	} catch (error) {
	  return res.status(500).json({
		success: false,
		message: error.message,
	  })
	}
  }

  
exports.instructorDashboard = async(req, res) => {
	try{
		const courseDetails = await Course.find({instructor:req.user.id});

		const courseData  = courseDetails.map((course)=> {
			const totalStudentsEnrolled = course.studentsEnrolled.length
			const totalAmountGenerated = totalStudentsEnrolled * course.price

			//create an new object with the additional fields
			const courseDataWithStats = {
				_id: course._id,
				courseName: course.courseName,
				courseDescription: course.courseDescription,
				totalStudentsEnrolled,
				totalAmountGenerated,
			}
			return courseDataWithStats
		})

		res.status(200).json({courses:courseData});

	}
	catch(error) {
		console.error(error);
		res.status(500).json({message:"Internal Server Error"});
	}
}

/*
GetcourseDetails
GetSectionDetails
GetSubSectionDetails
*/
