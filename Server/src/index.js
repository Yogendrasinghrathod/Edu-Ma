const express = require("express");
const path = require("path");
const app = express();
// import { courseProgressRoute } from "./routes/courseProgressRoute.js";

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const cors = require("cors");
const config = require("./config/config");
const allowedOrigins = [
  config.CLIENT_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow non-browser clients
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

const PORT = config.PORT;
const courseProgressRoute = require("./routes/courseProgressRoute.js");
const authRoutes = require("./routes/User");
const profileRoute = require("./routes/Profile");
const courseRoute = require("./routes/Course");
const mediaRoute = require("./routes/MediaRoute");
const purchaseRoute = require("./routes/purchaseRoute");

// Use JSON parsing for all routes, but capture raw body for webhook verification
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  }),
);

// Connect to database
const database = require("./config/database");

// Routes
app.use("/api/v1/purchase", purchaseRoute);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1", profileRoute);
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/media", mediaRoute);
app.use("/api/v1/progress", courseProgressRoute);
// quiz routes removed

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "../../client/dist")));

// Default API route
app.get("/api/v1", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running...",
  });
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../client/dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`The the App is running at ${PORT}`);
});
