# FileVault (My File Sharing App)

Hey! This is a file sharing application I built. It's basically like a personal Google Drive where you can store your files and share them with others securely. I built this to understand how full-stack development works, especially file handling and security.

## What it does
It's not just a simple upload/download app. I've added a bunch of features:
- **Upload stuff**: You can upload multiple files at once. I'm using AWS S3 so it can handle big files.
- **Secure Login**: You have to register and login to see your files. It uses JWT for security.
- **Sharing**: You can share files with other people using their email.
- **AI Summary**: This is the newest feature! You can click on a file and it will use AI to give you a short summary of what's inside. Useful if you have long documents.
- **Mobile Friendly**: Works good on phones too.

## Technology I Used
- **Frontend**: React with Vite (managed to make it look decent with Tailwind CSS).
- **Backend**: Node.js and Express.
- **Database**: MongoDB for storing user data and file info.
- **Storage**: AWS S3 for the actual files.

## How to run it locally

If you want to try this out on your machine, here is what you need to do.

### Prerequisites
You need Node.js installed and a MongoDB database (local or Atlas works). Also you need an AWS S3 bucket for file uploads.

### Steps

1. **Clone the repo**
   ```bash
   git clone https://github.com/trainblazer072/file-sharing-app.git
   cd file-sharing-app
   ```

2. **Setup Backend**
   Go to the server folder and install packages:
   ```bash
   cd server
   npm install
   ```
   
   You need to make a `.env` file in the `server` folder with your keys:
   ```env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/file-sharing-app
   JWT_SECRET=some_secret_key
   AWS_ACCESS_KEY_ID=your_aws_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret
   AWS_REGION=us-east-1
   AWS_BUCKET_NAME=your_bucket_name
   ```
   
   Then start it:
   ```bash
   npm run dev
   ```

3. **Setup Frontend**
   Open a new terminal, go to client folder:
   ```bash
   cd client
   npm install
   ```

   Make a `.env` file here too:
   ```env
   VITE_API_URL=http://localhost:3000
   ```

   Run it:
   ```bash
   npm run dev
   ```

   It should open on `http://localhost:5173`.

## Deployment
I deployed the backend and frontend on Vercel. If you want to deploy, just push the server and client folders to those services and set the environment variables there.

---
Let me know if you face any issues running it!