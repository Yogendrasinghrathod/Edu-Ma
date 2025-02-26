const Course = require("../models/CourseSchema")
const Category = require("../models/CategorySchema")
const Section = require("../models/SectionSchema")
const SubSection = require("../models/SubSectionSchema")
const User = require("../models/UserSchema")
const mongoose=require('mongoose') 
const CourseProgress = require("../models/CourseProgressSchema")
const { uploadImageToCloudinary } = require("../utils/imageUploader")
const { upload } = require("../utils/imageUploader"); 
mailSender = require("../utils/mailSender") 
const{courseEnrollmentEmail}=require("../mail/courseEnrollmentEmail")

// const CourseProgress = require("../models/CourseProgress")
// const { convertSecondsToDuration } = require("../utils/secToDuration")

// Function to create a new course
exports.createCourse = async (req, res) => {
  try {
    // Get user ID from request object
    const userId = req.user.id
    // console.log(req.file); // Log the file details
    


    // Get all required fields from request body
    let {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      tag: _tag,
      category,
      status,
      instructions: _instructions,
    } = req.body
    // Get thumbnail image from request files
    // console.log("Uploaded files:", req.files);

    const thumbnail = req.files.thumbnailImage

    // Convert the tag and instructions from stringified Array to Array
    const tag = JSON.parse(_tag)
    const instructions = JSON.parse(_instructions)

    // console.log("tag", tag)
    // console.log("instructions", instructions)

    // Check if any of the required fields are missing
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag.length ||
      !thumbnail ||
      !category ||
      !instructions.length
    ) {
      return res.status(400).json({
        success: false,
        message: "All Fields are Mandatory",
      })
    }
    if (!status || status === undefined) {
      status = "Draft"
    }
    // Check if the user is an instructor
    const instructorDetails = await User.findById(userId, {
      accountType: "Instructor",
    })

    if (!instructorDetails) {
      return res.status(404).json({
        success: false,
        message: "Instructor Details Not Found",
      })
    }

    // Check if the tag given is valid
    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ success: false, message: "Invalid Category ID" });
    }
    
    const categoryDetails = await Category.findById(category)
    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Category Details Not Found",
      })
    }
    else{
      console.log("success")
    }
    console.log(categoryDetails)



    //issue is there is sone problem while uploading the image on the site from postman 
    // Upload the Thumbnail to Cloudinary
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    )


    // console.log(thumbnailImage)
    // Create a new course with the given details



    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn: whatYouWillLearn,
      price,
      tag,
      category: categoryDetails._id,
      thumbnail: thumbnailImage.secure_url,
      status: status,
      instructions,
    })



    // Add the new course to the User Schema of the Instructor
    await User.findByIdAndUpdate(
      {
        _id: instructorDetails._id,
      },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    )
    // Add the new course to the Categories
    const categoryDetails2 = await Category.findByIdAndUpdate(
      { _id: category },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    )
    // console.log("HEREEEEEEEE", categoryDetails2)
    // Return the new course and a success message
    res.status(200).json({
      success: true,
      data: newCourse,
      message: "Course Created Successfully",
    })
  } catch (error) {
    // Handle any errors that occur during the creation of the course
    // console.error(error)
    res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: error.message,
    })
  } 
}

// Edit Course Details
exports.editCourse = async (req, res) => {
  try {
    const { courseId, updates } = req.body;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Handle Thumbnail Image Update
    if (req.files) {
      const thumbnail = req.files.thumbnailImage;
      const thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
      );
      course.thumbnail = thumbnailImage.secure_url;
    }

    // Validate updates object before looping
    if (typeof updates === 'object' && updates !== null && !Array.isArray(updates)) {
      for (const key in updates) {
        if (Object.prototype.hasOwnProperty.call(updates, key)) {
          if (key === "tag" || key === "instructions") {
            course[key] = Array.isArray(updates[key])
              ? updates[key] // Directly assign if it's already an array
              : JSON.parse(updates[key]); // Parse if it's a JSON string
          } else {
            course[key] = updates[key];
          }
        }
      }
    } else {
      return res.status(400).json({ success: false, message: "Invalid updates format" });
    }

    await course.save();

    const updatedCourse = await Course.findById(courseId)
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    res.json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


// Get Course List
exports.getAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find(
      { status: "Published" },
      {
        courseName: 1,
        price: 1,
        thumbnail: 1,
        instructor: 1,
        ratingAndReviews: 1,
        studentsEnrolled: 1,
      }
    )
    .populate("instructor")
    .exec();

    return res.status(200).json({
      success: true,
      data: allCourses,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      success: false,
      message: `Can't Fetch Course Data`,
      error: error.message,
    });
  }
};


// Get One Single Course Details
  exports.getCourseDetails = async (req, res) => {
    try {
      const { courseId } = req.body

      const courseObjectId = new mongoose.Types.ObjectId(courseId);

      if (!mongoose.Types.ObjectId.isValid(courseObjectId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid course ID format',
        });
      }
      const courseDetails = await Course.findOne({
        _id: courseObjectId,
      })
        .populate({
          path: "instructor",
          populate: {
            path: "additionalDetails",
          },
        })
        .populate("category")
        .populate("ratingAndReviews")
        .populate({
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        })
        .exec()

      console.log(courseDetails)
    
      if (!courseDetails ) {
        return res.status(400).json({
          success: false,
          message: `Could not find course with id: ${courseId}`,
        })
      }

      if (courseDetails.status === "Draft") {
        return res.status(403).json({
          success: false,
          message: `Accessing a draft course is forbidden`,
        })
      }

      return res.status(200).json({
        success: true,
        data: courseDetails,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }


  //The extra feature that differntiae course details and full course details  is that i am gonna access Course progress by claculate for each second incresse he count 
exports.getFullCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body
    const userId = req.user.id
    const courseDetails = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()

    let courseProgressCount = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    })

    // console.log("courseProgressCount : ", courseProgressCount)

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      })
    }

    if (courseDetails.status === "Draft") {
      return res.status(403).json({
        success: false,
        message: `Accessing a draft course is forbidden`,
      });
    }

    let totalDurationInSeconds = 0
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration)
        totalDurationInSeconds += timeDurationInSeconds
      })
    })

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
        completedVideos: courseProgressCount?.completedVideos
          ? courseProgressCount?.completedVideos
          : [],
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// Get a list of Course for a given Instructor
exports.getInstructorCourses = async (req, res) => {
  try {
    // Get the instructor ID from the authenticated user or request body
    const instructorId = req.user.id

    // Find all courses belonging to the instructor
    const instructorCourses = await Course.find({
      instructor: instructorId,
    }).sort({ createdAt: -1 })

    // Return the instructor's courses
    res.status(200).json({
      success: true,
      data: instructorCourses,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Failed to retrieve instructor courses",
      error: error.message,
    })
  }
}
// Delete the Course
exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body

    // Find the course
    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    // Unenroll students from the course
    const studentsEnrolled = course.studentsEnroled
    for (const studentId of studentsEnrolled) {
      await User.findByIdAndUpdate(studentId, {
        $pull: { courses: courseId },
      })
    }

    // Delete sections and sub-sections
    const courseSections = course.courseContent
    for (const sectionId of courseSections) {
      // Delete sub-sections of the section
      const section = await Section.findById(sectionId)
      if (section) {
        const subSections = section.subSection
        for (const subSectionId of subSections) {
          await SubSection.findByIdAndDelete(subSectionId)
        }
      }

      // Delete the section
      await Section.findByIdAndDelete(sectionId)
    }

    // Delete the course
    await Course.findByIdAndDelete(courseId)

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

exports.enrollStudents = async (req ,res) => {
  const{courses}=req.body
  const userId=req.user.id
  console.log(courses)
  if (!courses || !userId) {
    console.log('Missing courses or userId');
    return res.status(400).json({ success: false, message: 'Please Provide Course ID and User ID' });
  }

  try {
    for (const courseId of courses) {
      console.log('Enrolling user in course:', courseId);
      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        { $push: { studentsEnrolled: userId } },
        { new: true }
      );

      if (!enrolledCourse) {
        console.log('Course not found:', courseId);
        return res.status(404).json({ success: false, error: 'Course not found' });
      }

      // console.log('Creating course progress for user:', userId);
      const courseProgress = await CourseProgress.create({
        courseID: courseId,
        userId: userId,
        completedVideos: [],
      });

      console.log('Updating user with enrolled course and progress:', userId);
      const enrolledStudent = await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            courses: courseId,
            courseProgress: courseProgress._id,
          },
        },
        { new: true }
      );

      console.log(enrolledStudent);
      await mailSender(
        enrolledStudent.email,
        `Successfully Enrolled into ${enrolledCourse.courseName}`,
        courseEnrollmentEmail(
          enrolledCourse.courseName,
          `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
        )
      );

      console.log('Enrolled student:', enrolledStudent);
    }
    console.log('Students enrolled successfully');
    res.json({ success: true, message: 'Students enrolled successfully' });
  } catch (error) {
    console.error('Error in enrollStudents:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// console.log("CourseProgress:", CourseProgressSchema);
