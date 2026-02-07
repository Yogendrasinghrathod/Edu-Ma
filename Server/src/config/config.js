require("dotenv").config();

const config = {
  // Server Configuration
  PORT: process.env.PORT || 5001,
  NODE_ENV: process.env.NODE_ENV || "development",

  // Database Configuration
  MONGODB_URL: process.env.MONGODB_URL,

  // CORS Configuration
  CLIENT_URL: process.env.CLIENT_URL || "https://edu-ma.netlify.app",

  // Firebase Configuration
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,

  // Email Configuration
  SMTP_HOST: process.env.SMTP_HOST || "smtp.gmail.com",
  SMTP_PORT: process.env.SMTP_PORT || 587,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,

  // Cloudinary Configuration
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRE: process.env.JWT_EXPIRE || "7d",

  // Razorpay Configuration
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET:
    process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_SECRET,
  RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET,

  // Stripe Configuration
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,

  // Application URLs
  // FRONTEND_URL: process.env.FRONTEND_URL || 'https://studynotion-edtech-project.vercel.app',
  API_BASE_URL: process.env.API_BASE_URL || "https://edu-ma.netlify.app/api/v1",

  // External Services
  DICEBEAR_API_URL:
    process.env.DICEBEAR_API_URL || "https://api.dicebear.com/5.x/initials/svg",
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
};

module.exports = config;
