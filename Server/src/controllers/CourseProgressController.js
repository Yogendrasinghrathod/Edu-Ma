const mongoose = require("mongoose")
const Section = require("../models/SectionSchema")
const SubSection = require("../models/SubSectionSchema")
const CourseProgress = require("../models/CourseProgressSchema")
const Course = require("../models/CourseSchema")

exports.updateCourseProgress = async (req, res) => {
  const { courseId, subsectionId } = req.body
  const userId = req.user.id

  try {
    // Check if the subsection is valid
    const subsection = await SubSection.findById(subsectionId)
    if (!subsection) {
      return res.status(404).json({ error: "Invalid subsection" })
    }

    // Find the course progress document for the user and course
    let courseProgress = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    })

    if (!courseProgress) {
      // If course progress doesn't exist, create a new one
      return res.status(404).json({
        success: false,
        message: "Course progress Does Not Exist",
      })
    } else {
      // If course progress exists, check if the subsection is already completed
      if (courseProgress.completedVideos.includes(subsectionId)) {
        return res.status(400).json({ error: "Subsection already completed" })
      }

      // Push the subsection into the completedVideos array
      courseProgress.completedVideos.push(subsectionId)
    }

    // Save the updated course progress
    await courseProgress.save()

    return res.status(200).json({ message: "Course progress updated" })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: "Internal server error" })
  }
}

exports.getProgressPercentage = async (req, res) => {
    const { courseId } = req.body
    const userId = req.user.id
    
    try {
        // Find the course progress document for the user and course
        const courseProgress = await CourseProgress.findOne({
        courseID: courseId,
        userId: userId,
        })
    
        if (!courseProgress) {
        return res.status(404).json({
            success: false,
            message: "Course progress Does Not Exist",
        })
        }
    
        // Get the total number of subsections in the course
        const course = await Course.findById(courseId).populate("section")
        let totalSubsections = 0
        course.section.forEach((section) => {
        totalSubsections += section.subSection.length
        })
    
        // Calculate the percentage of completed subsections
        const percentage = (courseProgress.completedVideos.length / totalSubsections) * 100
    
        return res.status(200).json({ percentage: percentage })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: "Internal server error" })
    }
}