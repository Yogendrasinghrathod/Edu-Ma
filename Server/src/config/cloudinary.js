const cloudinary = require("cloudinary").v2;
require("dotenv").config();
//Cloudinary is being required

const cloudinaryConnect = () => {
    try{
        cloudinary.config({ 
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
          });
    }catch(error){
        console.log(error);
    }
}
module.exports={cloudinaryConnect}