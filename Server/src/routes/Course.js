// Import the required modules
const express = require("express")
const router = express.Router()
const { upload } = require("../utils/imageUploader");

// Import the Controllers

// Course Controllers Import
const {
  createCourse,
  getAllCourses,
  getCourseDetails,
  getFullCourseDetails,
  editCourse,
  getInstructorCourses,
  deleteCourse,
  enrollStudents 
} = require("../controllers/CourseController")


// Categories Controllers Import
const {
  showAllCategories,
  createCategory,
  categoryPageDetails,
} = require("../controllers/CategoryController")

// Sections Controllers Import
const {
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/Section")

// Sub-Sections Controllers Import
const {
    createSubSection,
    updateSubSection,
    deleteSubSection,
  } = require("../controllers/SubSection")

// Rating Controllers Import
const {
  createRating,
  getAverageRating,
  getAllRatingReview,
} = require("../controllers/RatingAndReviewController")

const {
  updateCourseProgress,
  getProgressPercentage,
 } = require("../controllers/CourseProgressController")

// Importing Middlewares
const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/middlewares")


//                                      Course routes


// Courses can Only be Created by Instructors
router.post("/createCourse", auth, isInstructor , createCourse)
// Edit Course routes
router.post("/editCourse", auth, isInstructor, editCourse)
// Add a Section to a Course
router.post("/addSection", auth, isInstructor, createSection)
// Update a Section
router.post("/updateSection", auth, isInstructor, updateSection)
// Delete a Section
router.post("/deleteSection", auth, isInstructor, deleteSection)
// Edit Sub Section
router.post("/updateSubSection", auth, isInstructor, updateSubSection)
// Delete Sub Section
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection)
// Add a Sub Section to a Section
router.post("/addSubSection", auth, isInstructor, createSubSection)
// Get all Courses Under a Specific Instructor
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses)
// Get all Registered Courses
router.get("/getAllCourses", getAllCourses)
// Get Details for a Specific Courses
router.post("/getCourseDetails", getCourseDetails)
// Get Details for a Specific Courses
router.post("/getFullCourseDetails", auth, getFullCourseDetails)
// To Update Course Progress
router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress)
// // To get Course Progress
router.post("/getProgressPercentage", auth, isStudent, getProgressPercentage)
// Delete a Course
router.delete("/deleteCourse", deleteCourse)

// Enroll Students
router.post("/enrollStudents",auth,isStudent, enrollStudents)


//                                      Category routes (Only by Admin)

// Category can Only be Created by Admin

router.post("/createCategory", auth, isAdmin,  createCategory)
router.get("/showAllCategories", showAllCategories)
router.post("/getCategoryPageDetails", categoryPageDetails)


//                                      Rating and Review
router.post("/createRating", auth, isStudent, createRating)
router.get("/getAverageRating", getAverageRating)
router.get("/getReviews", getAllRatingReview)

module.exports = router;