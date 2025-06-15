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
  togglePublishCourse,
  getPublishedCourse,
  
} = require("../controllers/CourseController")







// Importing Middlewares
const { auth } = require("../middlewares/middlewares")
const upload = require("../utils/multer")


//                                      Course routes


router.post("/create", auth, createCourse)

router.get("/publishedCourses",auth,getPublishedCourse)

router.get("/",auth, getCreatorCourse)  

router.put("/:courseId",auth,upload.single("courseThumbnail"), updatedCourse)  

router.get("/:courseId",auth, getCourseById)  

router.post("/:courseId/lecture",auth,createLecture)

router.get("/:courseId/lecture",auth,getCourseLecture)



router.post("/:courseId/lecture/:lectureId", auth, editLecture);
router.delete("/lecture/:lectureId",auth,removeLecture)
router.get("/lecture/:lectureId",auth,getLectureById)


router.patch("/:courseId",auth,togglePublishCourse)







module.exports = router;