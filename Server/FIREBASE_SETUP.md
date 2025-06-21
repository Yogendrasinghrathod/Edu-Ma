# Firebase Authentication Setup Guide

## Prerequisites
1. A Firebase project with Google Authentication enabled
2. Firebase Admin SDK service account key

## Setup Steps

### 1. Enable Google Authentication in Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Authentication > Sign-in method
4. Enable Google as a sign-in provider
5. Configure the OAuth consent screen if needed

### 2. Get Firebase Admin SDK Service Account Key
1. In Firebase Console, go to Project Settings
2. Go to Service Accounts tab
3. Click "Generate new private key"
4. Download the JSON file
5. Rename it to `firebaseServiceAccountKey.json`
6. Place it in `Server/src/` directory

### 3. Update Environment Variables
Add these to your `.env` file:
```
JWT_SECRET=your_jwt_secret_here
```

### 4. Test Firebase Configuration
1. Start your server
2. Visit: `http://localhost:5001/api/v1/auth/test-firebase`
3. You should see a success message if configured correctly

### 5. Test Firebase Authentication
1. Start both client and server
2. Try signing in with Google on the client
3. Check server logs for authentication flow

## Troubleshooting

### Common Issues:
1. **"Firebase Admin SDK is not properly configured"**
   - Ensure `firebaseServiceAccountKey.json` exists and is valid
   - Check that the file contains `project_id` and `private_key`

2. **"Invalid Firebase token"**
   - Verify Google Authentication is enabled in Firebase Console
   - Check that the client Firebase config matches your project

3. **CORS errors**
   - Ensure your server CORS configuration allows your client domain

### Debug Endpoints:
- `GET /api/v1/auth/test-firebase` - Test Firebase Admin SDK configuration
- Check server logs for detailed authentication flow information

## Security Notes
- Never commit `firebaseServiceAccountKey.json` to version control
- Add it to `.gitignore`
- Use environment variables for sensitive configuration
- Regularly rotate your service account keys 