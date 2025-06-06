const mongoose = require("mongoose");
require("dotenv").config();

const database=  mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log("DB Connected Successfully"))
    .catch((error) => {
        console.log("DB Connection Failed");
        console.log(error);
        process.exit(1);
    })

module.exports={database}
