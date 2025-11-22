# KernelChat Frontend

The client-side application for **KernelChat**, a modern, real-time messaging platform. Built with **React** and **Vite**, it features a responsive UI, real-time state management, and seamless integration with the backend via Socket.io.

## 🛠 Tech Stack

* **Framework:** React (Vite)
* **Styling:** Tailwind CSS
* **State Management:** Zustand
* **Data Fetching:** TanStack Query (React Query)
* **Routing:** React Router DOM
* **Real-time:** Socket.io Client
* **Icons:** Lucide React, React Icons
* **Notifications:** React Hot Toast
* **HTTP Client:** Axios

---

## 🚀 Getting Started

### 1. Prerequisites

* Node.js (v18 or higher)
* The Backend API running (usually on port 3000)

### 2. Installation

Navigate to the frontend directory and install dependencies:

```bash
cd frontend
npm install
```

### 3. Environment Variables

Create a `.env` file in the root of the `frontend` folder. You need to point the frontend to your backend server URL.

```bash
# URL of your running backend server
VITE_BACKEND_URL="http://localhost:3000"
```

### 4. Running the App

**Development Mode:**

```bash
npm run dev
```

The app will usually start on `http://localhost:5173`.

**Production Build:**

```bash
npm run build
```

---

## 📂 Project Structure

The `src` directory is organized to keep logic, UI, and state separate.

```bash
src/
├── assets/             # Static assets (images, audio files for key-press sounds)
├── components/         # Reusable UI components
├── hooks/              # Custom React hooks (e.g., useKeyboardSound)
├── layouts/            # Page layouts (AuthLayout, MainLayout)
├── pages/              # Full page views (Login, Signup, Landing, Chat)
├── services/           # API service functions (axios instances, endpoints)
├── store/              # Zustand stores (useAuthStore, useChatStore)
├── App.jsx             # Main App component with Routes
└── main.jsx            # Entry point (Providers setup)
```

---

## ✨ Key Features

* **Real-time Messaging:** Instant message delivery using Socket.io.
* **Global State:** User session and active chats managed via Zustand.
* **Optimistic Updates:** Instant UI feedback when sending messages or updating contacts.
* **Responsive Design:** Fully optimized for Desktop and Mobile views using Tailwind.
* **Media Support:** Image upload and preview functionality.
* **Security:** Protected routes and persistent authentication checks.

---

## 🎨 Theme

The application uses a custom Dark Mode theme built with **Tailwind CSS**.

* **Backgrounds:** `bg-slate-900`, `bg-slate-800`
* **Accents:** `text-cyan-400`, `bg-cyan-600`