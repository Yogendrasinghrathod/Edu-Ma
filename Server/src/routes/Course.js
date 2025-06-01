// Import the required modules
const express = require("express")
const router = express.Router()



const {
  createCourse,
  getCreatorCourse,
  updatedCourse,
  getCourseById,
  createLecture,
  getCourseLecture,
  editLecture,
  removeLecture,
  getLectureById,
  
} = require("../controllers/CourseController")







// Importing Middlewares
const { auth } = require("../middlewares/middlewares")
const upload = require("../utils/multer")


//                                      Course routes


router.post("/course/create", auth, createCourse)

router.get("/course",auth, getCreatorCourse)  

router.put("/course/:courseId",auth,upload.single("courseThumbnail"), updatedCourse)  

router.get("/course/:courseId",auth, getCourseById)  

router.post("/course/:courseId/lecture",auth,createLecture)

router.get("/course/:courseId/lecture",auth,getCourseLecture)


// Change from POST to PATCH for semantic correctness
router.post("/course/:courseId/lecture/:lectureId", auth, editLecture);
router.delete("/course/lecture/:lectureId",auth,removeLecture)
router.get("/course/lecture/:lectureId",auth,getLectureById)







module.exports = router;