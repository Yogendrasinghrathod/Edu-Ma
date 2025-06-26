const express = require("express");
const app = express();
// import { courseProgressRoute } from "./routes/courseProgressRoute.js";

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const cors = require('cors');
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

require("dotenv").config();

const PORT = process.env.PORT || 4000;
const courseProgressRoute=require("./routes/courseProgressRoute.js")
const authRoutes = require("./routes/User");
const profileRoute=require("./routes/Profile");
const courseRoute=require('./routes/Course');
const mediaRoute=require('./routes/MediaRoute')
const purchaseRoute=require("./routes/purchaseRoute")

// Use JSON parsing for all routes except webhook
app.use(express.json());

// Connect to database
const database = require("./config/database");

// Routes
app.use("/api/v1/purchase",purchaseRoute)
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1",profileRoute);
app.use("/api/v1/course",courseRoute);
app.use("/api/v1/media",mediaRoute)
app.use("/api/v1/progress",courseProgressRoute);


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