# Edu-Ma - Personal EdTech Platform

Edu-Ma is a feature-rich educational technology platform designed to enhance online learning experiences. It provides authentication, role-based access, course creation, and enrollment functionalities, making it suitable for students, instructors, and admins.

## Features

- **Authentication System**
  - Login & Signup
  - Google Signup
  - Forgot Password

- **User Roles**
  - **Admin**: Manages platform settings, users, and courses.
  - **Instructor**: Creates and manages courses.
  - **Student**: Enrolls in courses and accesses learning materials.

- **Course Management**
  - Course creation and editing
  - Course enrollment for students
  - Course Progress
  - Created Categories , Section , Subsection

## Tech Stack

- **Frontend**: React, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT, OAuth (Google Signup)
- **Hosting & Deployment**: remaining

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/edu-ma.git
   cd edu-ma
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up environment variables (`.env` file):
   ```sh
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   STRIPE_SECRET_KEY=your_stripe_key
   ```
4. Run the development server:
   ```sh
   npm run dev
   ```

## Contributing

Contributions are not allowed .This is my personal project

## Contact

For any queries, reach out to rathodyogi91221@gmail.com
