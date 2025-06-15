const mongoose = require("mongoose")

// Define the Courses schema
const coursesSchema = new mongoose.Schema({
  courseTitle: { type: String,required:true },
  subTitle: { type: String},
  
  description: {
    type: String,
  },
  lectures: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lecture",
    },
  ],
  creator:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User"
    
  },
  
  price: {
    type: Number,
  },
  courseThumbnail: {
    type: String,
  },
  
  category: {
    type: String,
    required: true,
    ref: "Category",
  },
  enrolledStudents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
  ],
 
  courseLevel: {
    type: String,
    enum: ["Beginner", "Medium","Advanced"],
  },
  coursePrice:{
    type:Number
  },
  isPublished:{
    type:Boolean,
    default:false
  },
 
},{timestamps:true})

// Export the Courses model
module.exports = mongoose.model("Course", coursesSchema)
