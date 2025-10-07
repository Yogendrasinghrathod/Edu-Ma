const express = require("express");
const { auth } = require("../middlewares/middlewares.js");
// import { getCourseProgress, markAsCompleted, markAsInCompleted, updateLectureProgress } from '../controllers/courseProgressController';
const {
  getCourseProgress,
  markAsCompleted,
  markAsInCompleted,
  updateLectureProgress,
  getLectureNote,
  upsertLectureNote,
} = require("../controllers/courseProgressController");
const router = express.Router();

router.get("/:courseId", auth, getCourseProgress);
router.post("/:courseId/lecture/:lectureId/view", auth, updateLectureProgress);
router.get("/:courseId/lecture/:lectureId/note", auth, getLectureNote);
router.post("/:courseId/lecture/:lectureId/note", auth, upsertLectureNote);

router.post("/:courseId/complete", auth, markAsCompleted);
router.post("/:courseId/incomplete", auth, markAsInCompleted);

module.exports = router;
