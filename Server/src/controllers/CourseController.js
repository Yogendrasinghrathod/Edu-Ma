const mongoose = require("mongoose");
const Course = require("../models/CourseSchema");

const {
  uploadImageToCloudinary,
  deleteMediaFromCloudinary,
  uploadMedia,
  deleteVideoFromCloudinary,
} = require("../utils/cloudinary");

mailSender = require("../utils/mailSender");
// const { courseEnrollmentEmail } = require("../mail/courseEnrollmentEmail");
const { Lecture } = require("../models/lectureSchema");

exports.createCourse = async (req, res) => {
  try {
    let { courseTitle, category } = req.body;

    if ((!courseTitle, !category)) {
      return res.status(400).json({
        success: false,
        message: "All Fields are Mandatory",
      });
    }

    const course = await Course.create({
      courseTitle,
      category,
      creator: req.id,
    });

    // console.log(course);

    res.status(200).json({
      course,
      message: "Course Created Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: error.message,
    });
  }
};

// Get Course List
exports.getCreatorCourse = async (req, res) => {
  try {
    const userId = req.id;
    const courses = await Course.find({ creator: userId });
    if (!courses) {
      return res.status(404).json({
        course: [],
        message: "Course not found",
      });
    }
    return res.status(200).json({
      courses,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: `Can't Fetch Course Data`,
      error: error.message,
    });
  }
};

exports.updatedCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    // console.log(courseId);

    const {
      courseTitle,
      subTitle,
      description,
      category,
      courseLevel,
      coursePrice,
    } = req.body;
    const thumbnail = req.file;

    let course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        message: "Nhi mila course",
      });
    }

    let courseThumbnail;
    if (thumbnail) {
      if (course.courseThumbnail) {
        const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
        await deleteMediaFromCloudinary(publicId);
      }
      courseThumbnail = await uploadMedia(thumbnail.path);
      // console.log(courseThumbnail);
    }
    //upload thumbnail on cloudinary

    const updateData = {
      courseTitle,
      subTitle,
      description,
      category,
      courseLevel,
      coursePrice,
      courseThumbnail: courseThumbnail?.secure_url,
    };

    course = await Course.findByIdAndUpdate(courseId, updateData, {
      new: true,
    });

    return res.status(200).json({
      message: "Course Updated Successfully",
      course,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: `Not able to update`,
      error: error.message,
    });
  }
};

// Get One Single Course Details
exports.getCourseById = async (req, res) => {
  try {
    const courseId = req.params.courseId;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found!",
      });
    }

    return res.status(200).json({
      course,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to get course by id",
    });
  }
};

exports.createLecture = async (req, res) => {
  try {
    const { lectureTitle } = req.body;
    const { courseId } = req.params;

    console.log(
      "Received - lectureTitle:",
      lectureTitle,
      "courseId:",
      courseId
    );
    if (!lectureTitle || !courseId) {
      return res.status(404).json({
        message: "courseId and lectureTitle is Needed",
      });
    }

    const lecture = await Lecture.create({ lectureTitle });
    console.log(lecture);

    //     console.log("courseId:", courseId);
    // console.log("typeof courseId:", typeof courseId);
    const course = await Course.findById(courseId);
    // console.log("Course found:", course);
    // console.log("course.lectures:", course.lectures);
    // console.log("Type of lectures:", typeof course.lectures);

    if (course) {
      course.lectures.push(lecture._id);
      await course.save();
    }
    return res.status(200).json({
      lecture,
      message: "Lecture Created Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create lecture",
    });
  }
};

exports.getCourseLecture = async (req, res) => {
  try {
    const { courseId } = req.params;
    // console.log(courseId)
    const course = await Course.findById(courseId).populate("lectures");
    // console.log(course)
    if (!course) {
      return res.status(404).json({
        message: "Course Not Found",
      });
    }
    return res.status(200).json({
      lectures: course.lectures,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to get lecture",
      // error:error.message
    });
  }
};

exports.editLecture = async (req, res) => {
  try {
    const { lectureTitle, videoInfo, isPreviewFree } = req.body;

    // console.log(req.body);
    const { courseId, lectureId } = req.params;
    // console.log(courseId,lectureId);

    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(400).json({
        message: "lecture not Found",
      });
    }
    // console.log(videoInfo);
    

    //update lecture
    if (lectureTitle) lecture.lectureTitle = lectureTitle;
    if (videoInfo) lecture.videoUrl = videoInfo.videoUrl;
    if (videoInfo) lecture.publicId = videoInfo.publicId;
    lecture.isPreviewFree = isPreviewFree;

    await lecture.save();

    // console.log(lecture);

    //ensuring course still has lecture id if its not already added
    const course = await Course.findById(courseId);
    // console.log(course);

    if (course && !course.lectures.includes(lecture._id)) {
      course.lectures.push(lectureId);
      await course.save();
    }
    return res.status(200).json({
      message: "lecture Updated Successfully",
      lecture,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to Edit lecture",
      // error:error.message
    });
  }
};

exports.removeLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const lecture = await Lecture.findByIdAndDelete(lectureId);
    if (!lecture) {
      return res.status(404).json({
        message: "lecture not Found",
      });
    }

    //delete lecture from cloudinary
    if (lecture.publicId) {
      await deleteVideoFromCloudinary(lecture.publicId);
    }

    //remove lecture reference from that particular course
    await Course.updateOne(
      {
        lectures: lectureId, //finding course that contain lecture
      },
      { $pull: { lectures: lectureId } }
    );

    return res.status(200).json({
      message: "Lecture Removed Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to Remove lecture",
      // error:error.message
    });
  }
};

exports.getLectureById = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      res.status(404).json({
        message: "lecture not Found",
      });
    }

    res.status(200).json({
      lecture,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get lecture",
      // error:error.message
    });
  }
};

// /publish and unpublish logic

exports.togglePublishCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { publish } = req.query; //true or false value
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        message: "Course Not Found!",
      });
    }

    //publishing the status based on query parameters
    course.isPublished = publish === "true";
    await course.save();
    const statusMessage = course.isPublished ? "Published" : "Unpublished";
    return res.status(200).json({
      message: `Course  ${statusMessage}`,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update status",
      // error:error.message
    });
  }
};

exports.searchCourse=async(req,res)=>{
  try {
    const {query="" ,categories=[],sortByPrice=""}=req.query;
    //create search query
    const searchCriteria={
      isPublished:true,
      $or:[
        {courseTitle:{$regex:query , $option:"i"}},
        {subTitle:{$regex:query , $option:"i"}},
        {category:{$regex:query , $option:"i"}},
      ]
    }
    //if categories are selected 
    if(categories.length>0){
      searchCriteria.category={$in:categories};
    }
    
    //sorting order
    const sortOptions={};
    if(sortByPrice==="low"){
      sortOptions.coursePrice = 1; // ascending order
    }
    else if(sortByPrice==="low"){
      sortOptions.coursePrice=-1;   //descending order
    }

    let courses =await  Course.find(searchCriteria).populate({path:"creator",select:"name photoUrl"}).sort(sortOptions);

    return res.status(200).json({
      success:true,
      courses:courses || [],
      
    })



  } catch (error) {
    console.log(error);
    
  }

}

exports.getPublishedCourse = async (_, res) => {
  try {
    const courses = await Course.find({ isPublished: true }).populate({
      path: "creator",
      select: "name profilePhoto",
    });
    if (!courses) {
      return res.status(404).json({
        message: "Courses not found",
      });
    }
    return res.status(200).json({
      courses,
    });
  } catch (error) {
    console.error("🔥 Error in getPublishedCourse:", error); // 🔍 PRINT FULL ERROR
    res.status(500).json({
      message: "Failed to get Published course",
      error: error.message, // ← Very helpful!
    });
  }
};
