const mongoose=require('mongoose')
const lectureSchema = new mongoose.Schema({
  lectureTitle: {
    type: String,
    required: true,
  },
  videoUrl: {
    type: String,
  },
  publicId:{
    type:String
  },
  isPreviewFree:{type:Boolean}
},{timestamps:true});



exports.Lecture =mongoose.model("lecture",lectureSchema);