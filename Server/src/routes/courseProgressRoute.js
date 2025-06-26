const express = require("express");
const { auth } = require("../middlewares/middlewares.js");
// import { getCourseProgress, markAsCompleted, markAsInCompleted, updateLectureProgress } from '../controllers/courseProgressController';
const {
  getCourseProgress,
  markAsCompleted,
  markAsInCompleted,
  updateLectureProgress,
} = require("../controllers/courseProgressController");
const router = express.Router();

router.get("/:courseId", auth, getCourseProgress);
router.post("/:courseId/lecture/:lectureId/view", auth, updateLectureProgress);

router.post("/:courseId/complete", auth, markAsCompleted);
router.post("/:courseId/incomplete", auth, markAsInCompleted);

module.exports = router;
