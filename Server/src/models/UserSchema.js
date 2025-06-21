const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  
  email: {
    type: String,
    required: true,
    trim: true,
    unique:true
  },
  password: {
    type: String,
    // Password is not required for Firebase/OAuth users
    required: false, 
  },
  accountType: {
    type: String,
    enum: ["Student", "Instructor", "Admin"],
    default: "Student",
  },
 
  courses: [
    {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
  enrolledCourses: [
    {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
  token: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
  profilePhoto: {
    type: String,
    // required: true,
  },
  
}, { timestamps: true });

module.exports = model("User", UserSchema);