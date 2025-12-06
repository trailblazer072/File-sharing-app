# FileVault - Secure File Sharing App

A modern, secure file sharing application built with the MERN stack (MongoDB, Express, React, Node.js).

## Features
- **Secure Authentication**: User registration and login with JWT.
- **File Management**: Upload, download, and delete files.
- **Sharing**: Share files with specific users via email or secure links.
- **Restricted Access**: Links are protected and only accessible by permitted users.
- **Responsive UI**: Built with React, Tailwind CSS, and Framer Motion.

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (Running locally or Atlas URI)
- AWS S3 Bucket (for file storage)

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/file-sharing-app.git
cd file-sharing-app
```

### 2. Backend Setup
Navigate to the server directory and install dependencies:
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory with the following variables:
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/file-sharing-app
JWT_SECRET=your_jwt_secret_key_here
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_BUCKET_NAME=your_s3_bucket_name
```

Start the backend server:
```bash
npm start
# OR for development with auto-restart
npm run dev
```

### 3. Frontend Setup
Open a new terminal, navigate to the client directory and install dependencies:
```bash
cd client
npm install
```

Create a `.env` file in the `client` directory:
```env
VITE_API_URL=http://localhost:3000
```

Start the frontend development server:
```bash
npm run dev
```

The app should now be running at `http://localhost:5173`.

## Deployment

### Backend (Render/Railway)
Deploy the `server` directory. Ensure you set all the Environment Variables in your hosting dashboard.

### Frontend (Vercel)
Deploy the `client` directory. Set the `VITE_API_URL` environment variable to your deployed backend URL.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Framer Motion, Axios.
- **Backend**: Node.js, Express, Mongoose, Multer (S3).
- **Database**: MongoDB.