# 🎵 Tunesta — Real-Time Collaborative Music Streaming Platform

![React](https://img.shields.io/badge/Frontend-React-blue?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-darkgreen?style=for-the-badge&logo=mongodb)
![Socket.IO](https://img.shields.io/badge/Realtime-Socket.IO-black?style=for-the-badge&logo=socket.io)
![Vercel](https://img.shields.io/badge/Frontend-Vercel-black?style=for-the-badge&logo=vercel)
![Render](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render)

> A full-stack real-time collaborative music streaming platform where users can create rooms, invite friends, and listen to music together in sync.

---

## 🚀 Live Demo

### 🌐 Frontend

**https://tunesta.vercel.app**

### ⚙️ Backend

**https://tunesta-backend.onrender.com**

---

## 📖 About The Project

Tunesta is a full-stack collaborative music streaming platform designed to allow multiple users to listen to music together inside shared rooms.

A host can control playback while other users connected to the room receive real-time updates through Socket.IO.

The project focuses on building a real-time application where traditional REST APIs are combined with persistent Socket.IO connections to synchronize room state, playback, users, and queues.

### What Tunesta allows users to do

- Create music rooms
- Join existing rooms
- Browse albums and songs
- Play music together
- Synchronize playback between users
- Manage a shared queue
- See users currently connected to a room
- Control playback as the room host

---

# ✨ Features

## 🔐 Authentication

- User registration
- User login
- JWT-based authentication
- Password hashing using bcryptjs
- Protected API routes
- Persistent authenticated session on the frontend

---

## 🎵 Music Streaming

- Browse albums
- Browse songs within albums
- Play songs from albums
- Host-controlled playback
- Play / pause synchronization
- Volume control
- Automatic song progression
- Shared music queue
- Add songs to queue
- Remove songs from queue
- Prevent duplicate/current-song queue conflicts

---

## 👥 Real-Time Music Rooms

- Create a room
- Join a room using a Room ID
- Live connected-user updates
- Host and listener roles
- Host-controlled playback
- Real-time playback events
- Real-time queue updates
- Host management
- Host transfer when required
- Multiple users listening simultaneously

---

## ⚡ Real-Time Communication

Tunesta uses **Socket.IO** for communication between connected users.

Real-time events are used for:

- Joining rooms
- Tracking connected users
- Playback control
- Queue updates
- Volume changes
- Playing the next song
- Removing songs from queues
- Disconnect handling
- Host management

---

## ☁️ Cloud Media Storage

Tunesta integrates with **Cloudinary** for cloud-based media storage.

This allows uploaded media to be handled independently from the application server.

---

# 🏗️ System Architecture

Tunesta follows a decoupled full-stack architecture.

```text
                         ┌──────────────────────┐
                         │     React + Vite     │
                         │      Frontend        │
                         └──────────┬───────────┘
                                    │
                         ┌──────────┴───────────┐
                         │                      │
                      REST API              Socket.IO
                         │                      │
                         ▼                      ▼
                ┌──────────────────────────────────┐
                │       Node.js + Express           │
                │                                  │
                │  Authentication                  │
                │  Room Management                  │
                │  Music Management                 │
                │  Queue Management                 │
                │  Socket.IO Server                 │
                └──────────────┬───────────┬───────┘
                               │           │
                               ▼           ▼
                       ┌────────────┐  ┌────────────┐
                       │  MongoDB   │  │ Cloudinary │
                       │   Atlas    │  │            │
                       └────────────┘  └────────────┘