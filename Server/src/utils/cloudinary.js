const cloudinary = require("cloudinary").v2;
// const cloudinaryConnect=require("../config/cloudinary")
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.uploadMedia = async (file) => {
  // console.log("File received in uploadImageToCloudinary:", folder);

  try {
    console.log("Cloudinary name:", process.env.CLOUDINARY_CLOUD_NAME);

    const uploadResponse = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
    });
    return uploadResponse;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload  to Cloudinary");
  }
};

exports.deleteMediaFromCloudinary = async (publicId) => {
  try {
    
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.log(error);
  }
};

exports.deleteVideoFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
  } catch (error) {
    console.log(error);
  }
};
