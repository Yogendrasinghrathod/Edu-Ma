const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
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
      required: true,
    },
    accountType: {
      type: String,
      enum: [ "Student", "Instructor"],
      required: true,
      default: "Student" 
    },
   
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
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
    },
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);