const express = require("express");
const app = express();

const cookieParser = require("cookie-parser");
app.use(cookieParser());
const database = require("./config/database");

const fileUpload = require("express-fileupload");

app.use(fileUpload({
    useTempFiles: true, 
    tempFileDir: "/src/images/"
}));
app.use(express.urlencoded({ extended: true }));

const cors = require('cors');
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));





require("dotenv").config();

const PORT = process.env.PORT || 4000;


const authRoutes = require("./routes/User");
const profileRoute=require("./routes/Profile");
const courseRoute=require('./routes/Course');

app.use(express.json());

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1",profileRoute);
app.use("/api/v1",courseRoute);


//default request
app.get("/" , (req , res) => {
    return res.json({
        success : true,
        message : "Your server is up and running..."
    })
});

app.listen(PORT , () => {
    console.log(`The the App is running at ${PORT}`);
});