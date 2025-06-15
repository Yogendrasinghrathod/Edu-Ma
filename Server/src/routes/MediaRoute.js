const express = require('express');
const { Router } = require('express');
const upload = require("../utils/multer");
const { uploadMedia } = require("../utils/cloudinary");
const router=express.Router();

router.post("/upload-video",upload.single("file"),async(req,res)=>{
    try{
        console.log("File received:", req.file);
        console.log("Cloudinary config:", {
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY ? "Set" : "Not Set",
            api_secret: process.env.CLOUDINARY_API_SECRET ? "Set" : "Not Set"
        });
        
        const result = await uploadMedia(req.file.path);
        console.log("Upload result:", result);
        
        return res.status(200).json({
            success: true,
            data: result,
            message: "File uploaded Successfully"
        });
    }
    catch(error){
        console.error("Detailed upload error:", error);
        return res.status(500).json({
            message: "Error uploading file",
            error: error.message
        });
    }
});


module.exports = router;