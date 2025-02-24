const cloudinary = require("cloudinary").v2;
// const cloudinaryConnect=require("../config/cloudinary")
require('dotenv').config()


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

exports.uploadImageToCloudinary = async (file, folder, height, quality) => {
    console.log("File received in uploadImageToCloudinary:", folder);

    try {
        if (!file || (!file.tempFilePath && !file.path)) {
            throw new Error("Invalid file provided for upload.");
        }

        const options = {
            folder,
            resource_type: "auto",
            ...(height && { height }),
            ...(quality && { quality })
        };

        const filePath = file.tempFilePath || file.path;
        console.log("filepath->"+filePath)

        const result = await cloudinary.uploader.upload(filePath, options);
        console.log("passed uploadImageToCloudinary")
        return result;
    } catch (error) {
        console.error("Cloudinary upload error:", error.message);
        throw new Error("Failed to upload image to Cloudinary");
    }
};
