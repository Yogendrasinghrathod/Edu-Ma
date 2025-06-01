const express = require('express');
const { Router } = require('express');
const upload = require("../utils/multer");
const { uploadMedia } = require("../utils/cloudinary");
const router=express.Router();

router.post("/upload-video",upload.single("file"),async(req,res)=>{
    try{
        const  result=await uploadMedia(req.file.path);
        return res.status(200).json({
            success:true,
            data:result,
            message:"File uploaded Successfully"
        })

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            message:"Error uploading file "
        })
        
    }
})


module.exports = router;