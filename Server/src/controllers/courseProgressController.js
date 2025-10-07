const CourseProgress = require("../models/CourseProgress");
const Course = require("../models/CourseSchema.js");
const LectureNote = require("../models/LectureNote");

exports.getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;
    console.log("UserId:", userId, "CourseId:", courseId);
    console.log(
      "UserId type:",
      typeof userId,
      "CourseId type:",
      typeof courseId
    );

    //step1 fetch the userCourse progress
    let courseProgress = await CourseProgress.findOne({
      courseId: String(courseId),
      userId: String(userId),
    }).populate("courseId");

    // console.log("Course progrees :" , courseProgress)
    const courseDetails = await Course.findById(courseId).populate("lectures");
    // console.log(courseDetails);
    

    if (!courseDetails) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    // step2 no progress found return courseDetails with an empty progress
    if (!courseProgress) {
      // console.log("course Progress i snot her ");
      return res.status(200).json({
        data: {
          courseDetails,
          progress: [],
          completed: false,
        },
      });
    }

    // step3 return user courseProgress along with courseDetails

    return res.status(200).json({
      data: {
        courseDetails,
        progress: courseProgress.lectureProgress,
        completed: courseProgress.completed,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

exports.updateLectureProgress = async (req, res) => {
  try {
    const { courseId, lectureId } = req.params;
    const userId = req.id;

    // console.log(courseId ,"Course id")

    //fetch or create courseProgress
    let courseProgress = await CourseProgress.findOne({
      courseId: String(courseId),
      userId: String(userId),
    });

    if (!courseProgress) {
      //if no progress exists ,create a new record
      courseProgress = new CourseProgress({
        userId: String(userId),
        courseId: String(courseId),
        completed: false,
        lectureProgress: [],
      });
    }
    // find the lecture Progress in courseProgress
    const lectureIndex = courseProgress.lectureProgress.findIndex(
      (lecture) => String(lecture.lectureId) === String(lectureId)
    );
    if (lectureIndex !== -1) {
      //if lecture already exist
      courseProgress.lectureProgress[lectureIndex].viewed = true;
    } else {
      //add new lecture Progress
      courseProgress.lectureProgress.push({
        lectureId: String(lectureId),
        viewed: true,
      });
    }

    // if all lecture is completed   then courseProgress-> true
    const lectureProgressLength = courseProgress.lectureProgress.filter(
      (lectureProg) => lectureProg.viewed
    ).length;
    const course = await Course.findById(courseId);
    if (course.lectures.length === lectureProgressLength)
      courseProgress.completed = true;

    await courseProgress.save();

    return res.status(200).json({
      message: "Lecture progress successfully updated",
    });
  } catch (error) {
    console.log(error);
  }
};

exports.markAsCompleted = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    // Always use String for IDs
    let courseProgress = await CourseProgress.findOne({
      courseId: String(courseId),
      userId: String(userId),
    });
    if (!courseProgress) {
      // Create a new progress document if it doesn't exist
      courseProgress = new CourseProgress({
        userId: String(userId),
        courseId: String(courseId),
        completed: true,
        lectureProgress: [],
      });
    }
    courseProgress.lectureProgress.map(
      (lectureProgress) => (lectureProgress.viewed = true)
    );
    courseProgress.completed = true;
    await courseProgress.save();
    return res.status(200).json({message:"Course marked as completed. "})
  } catch (error) {
    console.log(error);
  }
};

exports.markAsInCompleted = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    // Always use String for IDs
    let courseProgress = await CourseProgress.findOne({
      courseId: String(courseId),
      userId: String(userId),
    });
    if (!courseProgress) {
      // Create a new progress document if it doesn't exist
      courseProgress = new CourseProgress({
        userId: String(userId),
        courseId: String(courseId),
        completed: false,
        lectureProgress: [],
      });
    }
    courseProgress.lectureProgress.map(
      (lectureProgress) => (lectureProgress.viewed = false)
    );
    courseProgress.completed = false;
    await courseProgress.save();
    return res.status(200).json({message:"Course marked as incompleted  . "})
  } catch (error) {
    console.log(error);
  }
};

// Get note for a specific lecture
exports.getLectureNote = async (req, res) => {
  try {
    const { courseId, lectureId } = req.params;
    const userId = req.id;
    const note = await LectureNote.findOne({ userId: String(userId), courseId: String(courseId), lectureId: String(lectureId) });
    return res.status(200).json({ success: true, note: note?.content || "" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch note" });
  }
};

// Upsert note for a specific lecture
exports.upsertLectureNote = async (req, res) => {
  try {
    const { courseId, lectureId } = req.params;
    const userId = req.id;
    const { content = "" } = req.body || {};

    const note = await LectureNote.findOneAndUpdate(
      { userId: String(userId), courseId: String(courseId), lectureId: String(lectureId) },
      { content },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    return res.status(200).json({ success: true, message: "Note saved", note: note.content });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to save note" });
  }
};
