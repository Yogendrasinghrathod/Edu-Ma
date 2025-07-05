# Environment Variables Setup

This document explains how to set up environment variables for the Edu-Ma server.

## Quick Setup

1. Create a `.env` file in the `Server/` directory
2. Copy the variables from the example below
3. Fill in your actual values

## Environment Variables

### Required Variables

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# Database Configuration
MONGODB_URL=mongodb://localhost:27017/your_database_name

# CORS Configuration
CLIENT_URL=http://localhost:5173

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d

# Firebase Configuration (if using Firebase auth)
FIREBASE_PROJECT_ID=your_firebase_project_id

# Email Configuration (if using email features)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_password

# Cloudinary Configuration (if using file uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Razorpay Configuration (if using Razorpay payments)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Stripe Configuration (if using Stripe payments)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Application URLs
FRONTEND_URL=https://studynotion-edtech-project.vercel.app
API_BASE_URL=http://localhost:5001/api/v1

# External Services
DICEBEAR_API_URL=https://api.dicebear.com/5.x/initials/svg
```

## Variable Descriptions

### Server Configuration
- `PORT`: The port on which the server will run (default: 5001)
- `NODE_ENV`: Environment mode (development/production)

### Database Configuration
- `MONGODB_URL`: MongoDB connection string

### CORS Configuration
- `CLIENT_URL`: Frontend URL for CORS configuration

### JWT Configuration
- `JWT_SECRET`: Secret key for JWT token signing
- `JWT_EXPIRE`: JWT token expiration time

### Firebase Configuration
- `FIREBASE_PROJECT_ID`: Firebase project ID for authentication

### Email Configuration
- `SMTP_HOST`: SMTP server host
- `SMTP_PORT`: SMTP server port
- `SMTP_USER`: Email username
- `SMTP_PASS`: Email password

### Cloudinary Configuration
- `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Cloudinary API key
- `CLOUDINARY_API_SECRET`: Cloudinary API secret

### Payment Configuration
- `RAZORPAY_KEY_ID`: Razorpay key ID
- `RAZORPAY_KEY_SECRET`: Razorpay key secret
- `STRIPE_SECRET_KEY`: Stripe secret key
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook secret

### Application URLs
- `FRONTEND_URL`: Frontend application URL
- `API_BASE_URL`: Backend API base URL

### External Services
- `DICEBEAR_API_URL`: Dicebear API URL for avatar generation

## Security Notes

1. **Never commit your `.env` file to version control**
2. **Use strong, unique secrets for JWT_SECRET**
3. **Keep your API keys secure**
4. **Use different values for development and production**

## Configuration Usage

The server now uses a centralized configuration file (`src/config/config.js`) that loads all environment variables. This provides:

- Type safety and validation
- Default values for optional variables
- Centralized configuration management
- Better error handling

## Example Usage in Code

```javascript
const config = require('../config/config');

// Use configuration values
const port = config.PORT;
const mongoUrl = config.MONGODB_URL;
const jwtSecret = config.JWT_SECRET;
```

## Troubleshooting

If you encounter issues:

1. Make sure your `.env` file is in the correct location (`Server/.env`)
2. Verify all required variables are set
3. Check that the values are correct (no extra spaces, quotes, etc.)
4. Restart the server after making changes to `.env` 