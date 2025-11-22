# KernelChat Backend

The backend API for **KernelChat**, a real-time messaging application. Built with Node.js, Express, and Socket.io, it handles authentication, message encryption, real-time socket connections, and media management.

## 🛠 Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB (Mongoose ODM)
* **Real-time:** Socket.io
* **Security:** Arcjet (Bot protection), Mongoose Field Encryption (At-rest message encryption)
* **Authentication:** JWT (JSON Web Tokens) & Passport.js (Google OAuth)
* **File Storage:** Cloudinary
* **Email:** Nodemailer

---

## 🚀 Getting Started

### 1. Prerequisites

Ensure you have the following installed:
* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* [MongoDB](https://www.mongodb.com/) (Local instance or Atlas URI)

### 2. Installation

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```
### 3. Environment Variables

Create a `.env` file in the root of the `backend` folder. Copy the following variables and fill in your specific credentials:

```bash
# Server Configuration
PORT=3000
FRONTEND_URL="http://localhost:5173"
NODE_ENV="development"

# Database
MONGO_URL="mongodb+srv://<username>:<password>@cluster.mongodb.net/kernelchat"

# Authentication Secrets
JWT_SECRET="your_super_secret_main_key"
# Note: These additional secrets were added for secure flows
JWT_OTP_SECRET="different_secret_for_otps"
JWT_RESET_SECRET="different_secret_for_password_resets"

# Message Encryption (32-byte string)
MSG_ENCRYPTION_KEY="your_32_character_long_encryption_key"

# Email Configuration (Nodemailer)
EMAIL_SERVICE="gmail"
EMAIL_USER="your_email@gmail.com"
EMAIL_PASS="your_app_specific_password"

# Cloudinary (File Uploads)
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRETE="your_api_secret"

# Security (Arcjet)
ARCJET_KEY="aj_..."
ARCJET_ENV="development"

# Google OAuth
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
```
### 4. Running the Server

Development Mode (with Nodemon):

```bash
npm run dev
```
Production Mode:

```bash
npm start
```

The server will start on `http://localhost:3000`.

---

## 📂 Project Structure

The backend is organized to separate concerns and ensure scalability.

```bash
backend/src
├── assets/
│   ├──emailTemplates.js
├── controllers/        # Request handlers (Logic for Auth, Messages, Users)
│   ├── auth.controller.js
│   ├── message.controller.js
│   └── user.controller.js
├── lib/                # Third-party service configurations
│   ├── arjet.js
│   ├── cloudinary.js
│   ├── config.js
│   ├── db.js
│   ├── passport.js   
│   └── socket.js       
├── middlewares/       
│   ├── auth.middleware.js     
│   ├── arcjet.middleware.js
│   ├── contact.middleware.js
│   ├── isLogin.js
│   ├── socket.auth.middleware.js   
│   └── upload.js               
├── models/             # Mongoose Database Schemas
│   ├── user.model.js
│   ├── message.model.js       
│   ├── conversation.model.js
│   └── contact.model.js
├── routes/          
│   ├── auth.route.js
│   ├── message.route.js
│   └── user.route.js
├── utils/              
│   ├── createError.js    
│   ├── generateToken.js
│   ├── handleFormError.js        
│   └── sendEmail.js                     
└── server.js           
```

---

## 🔒 Security Features

### Message Encryption
We use **At-Rest Encryption** for messages.
* The `text` field in the `Message` model is encrypted before saving to MongoDB using `mongoose-field-encryption`.
* It is automatically decrypted when queried via Mongoose methods (`find`, `findOne`).
* **Note:** For Aggregation pipelines (like the Chat List), manual decryption is handled in the controller.

### Rate Limiting
**Arcjet** is integrated as middleware to protect auth routes and sensitive endpoints from brute-force attacks and bot traffic.

---

## 📡 Socket.io Events

The server listens for and emits the following real-time events:

* **Connection:** Handles user presence (`getOnlineUsers`).
* **`newMessage`:** Emitted to the specific receiver when a message is sent.
* **`messageDeleted`:** Notifies the receiver to remove a message from their view.
* **`messageUpdated`:** Notifies the receiver to update message text (edits).