# API Environment Setup

This document explains how to configure the API base URLs and Firebase using environment variables.

## Environment Variables

Create a `.env` file in the `client` directory with the following variables:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5001/api/v1

# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyC220cCAFaXZ9jgdxhP_kZjT0Nax5uYn1c
VITE_FIREBASE_AUTH_DOMAIN=eduma-4e8e7.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=eduma-4e8e7
VITE_FIREBASE_STORAGE_BUCKET=eduma-4e8e7.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=262228908128
VITE_FIREBASE_APP_ID=YOUR_APP_ID
VITE_FIREBASE_MEASUREMENT_ID=YOUR_MEASUREMENT_ID

# Development Environment
NODE_ENV=development
```

## Configuration Details

### API Configuration
- **VITE_API_BASE_URL**: The base URL for all API endpoints
  - Default: `http://localhost:5001/api/v1`
  - Change this to match your server URL

### Firebase Configuration
- **VITE_FIREBASE_API_KEY**: Your Firebase API key
- **VITE_FIREBASE_AUTH_DOMAIN**: Your Firebase auth domain
- **VITE_FIREBASE_PROJECT_ID**: Your Firebase project ID
- **VITE_FIREBASE_STORAGE_BUCKET**: Your Firebase storage bucket
- **VITE_FIREBASE_MESSAGING_SENDER_ID**: Your Firebase messaging sender ID
- **VITE_FIREBASE_APP_ID**: Your Firebase app ID (get from Firebase console)
- **VITE_FIREBASE_MEASUREMENT_ID**: Your Firebase measurement ID (optional, for analytics)

## API Endpoints

The following API endpoints are automatically configured based on the base URL:

- **Auth API**: `${VITE_API_BASE_URL}/auth`
- **Course API**: `${VITE_API_BASE_URL}/course`
- **Course Progress API**: `${VITE_API_BASE_URL}/progress`
- **Purchase API**: `${VITE_API_BASE_URL}/purchase`
- **Profile API**: `${VITE_API_BASE_URL}/profile`

## Important Notes

1. All environment variables in Vite must be prefixed with `VITE_` to be accessible in client-side code
2. The `.env` file should be added to `.gitignore` to keep sensitive information out of version control
3. Restart your development server after making changes to environment variables

## Usage

The API and Firebase configuration is centralized in `src/config/api.js` and imported by all API files:

```javascript
import { API_BASE_URL, COURSE_API, firebaseConfig } from '../config/api';
```

This ensures consistent configuration across all API calls and makes it easy to change the server URL and Firebase settings for different environments.

## Getting Firebase Configuration

1. Go to your [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings (gear icon)
4. Scroll down to "Your apps" section
5. Copy the configuration values to your `.env` file

**Note**: The `appId` and `measurementId` values can be found in the Firebase SDK configuration snippet.

## Troubleshooting

### Firebase "invalid-api-key" Error

If you see a Firebase "invalid-api-key" error:

1. **Check your `.env` file exists** in the `client` directory
2. **Verify all Firebase variables are set**:
   ```env
   VITE_FIREBASE_API_KEY=your_actual_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```
3. **Restart your development server** after creating/updating the `.env` file
4. **Check the browser console** for environment variable status logs
5. **Verify the API key** in your Firebase Console matches what's in your `.env` file

### Environment Variables Not Loading

- Ensure all variables start with `VITE_`
- Make sure there are no spaces around the `=` sign in your `.env` file
- Restart your development server after making changes
- Check that the `.env` file is in the correct location (`client/.env`) 