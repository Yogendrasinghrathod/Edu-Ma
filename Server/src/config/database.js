const mongoose = require("mongoose");
const config = require("./config");

const database = mongoose.connect(config.MONGODB_URL)
    .then(() => console.log("DB Connected Successfully"))
    .catch((error) => {
        console.log("DB Connection Failed");
        console.log(error);
        process.exit(1);
    })

module.exports = { database }
