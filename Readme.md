# 🎵 Tunesta — Real-Time Collaborative Music Streaming Platform

![React](https://img.shields.io/badge/Frontend-React-blue?style=for-the-badge\&logo=react)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green?style=for-the-badge\&logo=node.js)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-darkgreen?style=for-the-badge\&logo=mongodb)
![Socket.IO](https://img.shields.io/badge/Realtime-Socket.IO-black?style=for-the-badge\&logo=socket.io)

> A full-stack real-time collaborative music streaming platform where users can create rooms, join friends, and listen to music together in sync.

---

# 🚀 Live Demo

### 🌐 Frontend

https://tunesta.vercel.app

### ⚙️ Backend

(Your Railway Backend URL)

---

# 📖 About The Project

Tunesta is a real-time collaborative music player inspired by modern social streaming platforms.

The platform allows users to:

* create rooms
* invite listeners
* synchronize music playback
* manage song queues
* experience real-time music streaming together

The application was built using a decoupled full-stack architecture with Socket.IO powering real-time synchronization between host and listeners.

---

# ✨ Core Features

## 🔐 Authentication System

* User Signup & Login
* JWT-based authentication
* Secure password hashing using bcryptjs
* Protected routes

---

## 🎵 Music Streaming Features

* Browse albums & songs
* Real-time synchronized playback
* Host-controlled playback system
* Play / Pause synchronization
* Queue-based music management
* Volume control

---

## 👥 Real-Time Room System

* Create room
* Join room using Room ID
* Live room user updates
* Host & listener architecture
* Real-time playback synchronization
* Multi-user room support

---

## ⚡ Socket.IO Real-Time Engine

* Real-time music synchronization
* Queue updates across clients
* Instant playback events
* Real-time room communication
* Automatic reconnection support

---

# 🛠️ Tech Stack

| Domain          | Technologies         |
| :-------------- | :------------------- |
| Frontend        | React.js, Vite, CSS3 |
| Backend         | Node.js, Express.js  |
| Database        | MongoDB Atlas        |
| Real-Time       | Socket.IO            |
| Authentication  | JWT, bcryptjs        |
| Deployment      | Vercel, Railway      |
| Version Control | Git, GitHub          |

---

# 🏗️ System Architecture

The application uses a full-stack client-server architecture:

## Frontend (React)

* Handles UI rendering
* Sends API requests
* Maintains room state
* Synchronizes playback using Socket.IO

## Backend (Express + Socket.IO)

* Handles authentication
* Manages rooms
* Synchronizes music playback
* Maintains queue state
* Broadcasts real-time events

## Database (MongoDB)

* Stores users
* Stores albums
* Stores songs metadata

---

# 🧠 Major Engineering Challenges Solved

## 1️⃣ Real-Time Music Synchronization

### Problem

Different users experienced playback delay and desynchronization.

### Solution

Implemented Socket.IO-based event broadcasting with timestamp compensation logic to synchronize playback across clients.

---

## 2️⃣ Room User Duplication Bug

### Problem

Refreshing caused duplicate users inside rooms.

### Solution

Added existing-user detection and socket ID replacement logic instead of pushing duplicate users.

---

## 3️⃣ Queue Synchronization Logic

### Problem

Queue updates were inconsistent across listeners.

### Solution

Implemented centralized queue state management on backend with live `queue_updated` socket events.

---

## 4️⃣ Production Deployment Debugging

### Problem

Application failed during Railway deployment due to missing dependencies and environment variables.

### Solution

Resolved:

* bcryptjs missing dependency
* jsonwebtoken dependency issue
* MongoDB URI configuration
* JWT_SECRET configuration
* Railway monorepo root directory setup

---

## 5️⃣ Frontend Production Configuration

### Problem

Frontend still used localhost URLs after deployment.

### Solution

Implemented environment-variable-based API architecture using:

```env
VITE_API_URL
```

---

# 📂 Project Structure

```bash
Tunesta/
│
├── Backend/
│   ├── middleware/
│   ├── models/
│   ├── songs/
│   ├── server.js
│   └── package.json
│
├── Frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
└── README.md
```

---

# ⚙️ Environment Variables

## Frontend (.env)

```env
VITE_API_URL=YOUR_BACKEND_URL
```

---

## Backend (.env)

```env
MONGODB_URI=YOUR_MONGODB_URI
JWT_SECRET=YOUR_SECRET_KEY
PORT=5000
```

---

# 🚀 Local Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/kartik764/Tunesta.git
```

---

## 2️⃣ Setup Backend

```bash
cd Backend
npm install
npm start
```

---

## 3️⃣ Setup Frontend

```bash
cd Frontend
npm install
npm run dev
```

---

# 🌐 Deployment

| Service  | Platform      |
| :------- | :------------ |
| Frontend | Vercel        |
| Backend  | Railway       |
| Database | MongoDB Atlas |

---

# 📸 Screenshots

Add screenshots here:

* Login Page
* Home Page
* Room Interface
* Queue System
* Multi-user Sync

---

# 🔮 Future Improvements

* Real-time chat feature
* Persistent rooms
* Mobile responsiveness
* Playlist support
* Better queue system
* Music seek synchronization
* Spotify-inspired UI
* Cloud music uploads

---

# 👨‍💻 Author

## Kartik Jain

### GitHub

https://github.com/kartik764

---

# ⭐ Support

If you liked this project, consider giving it a star ⭐ on GitHub.
