# 🎵 Tunesta V2.0 - Cloud-Native Personal Music Streaming App

![Tunesta Demo](./demo/Tunesta-demo.gif)
> *A full-stack, responsive music streaming application allowing users to curate their own private cloud libraries.*

### 🚀 Live Demo
- **Frontend (Netlify):** [https://tunesta.netlify.app/](https://tunesta.netlify.app/)

---

## 📖 About The Project

**Tunesta V2.0** is a fully functional **SaaS (Software as a Service) prototype**. It solves the problem of media management by allowing users to securely upload, store, and stream their own music collection from the cloud.

Built with a **decoupled architecture**, it separates the frontend logic from a robust Node.js API, handling complex tasks like binary file streaming, secure authentication, and database indexing.

---

## ✨ Key Features (V2.0)

### 🔐 Advanced Authentication & Security
* **JWT Authorization:** Implemented stateless authentication using **JSON Web Tokens**.
* **Protected Routes:** Custom Express middleware ensures users can only access/modify their own data (Public Library vs. Private Diary model).
* **Security Best Practices:** Passwords hashed with **BCrypt.js**; sensitive keys managed via Environment Variables.

### ☁️ Cloud Media Engine
* **Sequential Multi-File Uploads:** Engineered a robust "Brute Force" upload pipeline using **Multer** and **Cloudinary**. It systematically processes the Audio file first, ensuring success, before conditionally processing the Cover Image in a secondary Promise.
* **Ephemeral File Handling:** Solved the "ephemeral disk" problem on cloud hosts (Render) by streaming file buffers directly to the CDN, ensuring no local storage dependency.
* **Optimistic UI Updates:** Implemented a callback architecture (`refreshAlbums`) to instantly update the UI upon upload without requiring a page reload.

### 🎨 Modern, Responsive UX
* **Glassmorphism Design:** A sleek, dark-themed UI featuring ambient background effects and interactive cursor glows.
* **Mobile-First Architecture:** Fully responsive Sidebar, Player, and Upload Modals that adapt seamlessly to mobile viewports using hidden input hacks for styling.
* **Persistent State:** Smart Playbar logic that resumes playback intelligently and handles track switching without blocking the UI thread.

---

## 🛠️ Tech Stack

| Domain | Technologies |
| :--- | :--- |
| **Frontend** | React.js (Vite), Context API (State Management), CSS3 (Glassmorphism), Fetch API |
| **Backend** | Node.js, Express.js, RESTful API Design |
| **Database** | MongoDB Atlas (NoSQL), Mongoose ODM |
| **Storage** | Cloudinary (Media CDN) |
| **Auth** | JWT (JSON Web Tokens), BCrypt.js |
| **Deployment** | Netlify (Frontend), Render (Backend) |
| **Version Control** | Git, GitHub (Feature Branch Workflow) |

---

## 🏗️ System Architecture

The application uses a **Decoupled Client-Server Architecture**:

1.  **Client (React):** Manages the view layer and sends HTTP requests with `Authorization: Bearer <token>` headers.
2.  **Server (Express):** Middleware intercepts requests to verify signatures.
3.  **Upload Pipeline:**
    * Client sends `FormData` (Text + Binary Files).
    * Server receives data via **Multer** (Memory Storage).
    * **Step 1:** Server wraps the Audio Buffer in a Promise and awaits the Cloudinary upload stream.
    * **Step 2:** Upon success, Server checks for a Cover Image and repeats the process with a second Promise.
    * **Step 3:** Server saves the returned URLs + Metadata to **MongoDB**.

---

## 🧠 Real Technical Challenges Solved

Building V2.0 required solving several critical engineering hurdles:

1.  **Legacy Database Indexes (`E11000 Error`):**
    * *Problem:* The application kept crashing during uploads with a "Duplicate Key Error," even for unique song titles.
    * *Solution:* Debugged MongoDB Atlas indexes and discovered a legacy unique index on the `folder` field from V1.0. Removed the index and refactored the Schema to allow dynamic folder creation.

2.  **The "Undefined" Token Crash:**
    * *Problem:* The backend was crashing with `jwt malformed` errors.
    * *Solution:* Discovered that `sessionStorage` key mismatches (`token` vs `tunesta_usertoken`) caused the frontend to send the literal string `"undefined"` instead of the token. Implemented strict null-checks in the auth middleware to block invalid strings before verification.

3.  **Handling Dual-Binary Streams:**
    * *Problem:* Moving from single-file uploads to simultaneous Audio + Cover Image uploads broke the original middleware.
    * *Solution:* Refactored `Multer` to use `upload.fields()`. Implemented a "Brute Force" sequential logic where the Song Promise must resolve successfully before the Image Promise is attempted, ensuring no partial records (ghost songs) are created if the audio fails.

4.  **State Synchronization ("The Silent Update"):**
    * *Problem:* After a successful upload, the dashboard would show stale data until the user manually refreshed the page (bad UX).
    * *Solution:* Implement "Lifting State Up" by passing the `fetchAlbums` function from the Parent (`Home.jsx`) to the Child (`FileModal`), triggering an automatic data re-fetch upon success.

5.  **Audio Player Logic Gap:**
    * *Problem:* The player would fail to resume a song if it was paused and then played again (because the source URL hadn't changed).
    * *Solution:* Overhauled the `useEffect` dependency logic to handle the "Resume" case separately from the "New Song" case.

6.  **Production Asset Routing:**
    * *Problem:* Images broke in production because the frontend was prepending `localhost` to absolute Cloudinary URLs.
    * *Solution:* Implemented a conditional check (`startsWith('http')`) to differentiate between legacy local assets and new cloud-hosted URLs.

7.  **SPA Routing on Static Hosts:**
    * *Problem:* Refreshing the page on `/login` or `/signup` resulted in a 404 error on Netlify.
    * *Solution:* Configured a `_redirects` file in the public directory to rewrite all requests to `index.html`, enabling proper client-side routing.

---

## 🔧 Getting Started Locally

To run this project locally, you will need your own Cloudinary and MongoDB credentials.

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/Chetanwadhwa03/Tunesta--Your-own-Music-Player-.git](https://github.com/Chetanwadhwa03/Tunesta--Your-own-Music-Player-.git)
    cd Tunesta--Your-own-Music-Player-
    ```

2.  **Setup Backend**
    ```bash
    cd Backend
    npm install
    ```
    *Create a `.env` file in the `Backend` folder with:*
    ```env
    PORT=3000
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_secret_key
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
    ```
    *Start the Server:*
    ```bash
    node server.js
    ```

3.  **Setup Frontend**
    ```bash
    cd "Tunesta- Your own Music player!(React)"
    npm install
    ```
    *Create a `.env` file in the frontend folder:*
    ```env
    VITE_API_URL=http://localhost:3000
    ```
    *Start React:*
    ```bash
    npm run dev
    ```

---

## 🔮 Future Roadmap (V3.0)

The next major version of Tunesta is planned to introduce real-time social features and enhanced interactivity:

* **Socket.io Integration:** Enabling "Listening Parties" where multiple users can stream the same song in perfect sync and chat in real-time.
* **Drag & Drop Uploads:** Upgrading the file submission experience with a modern drag-and-drop zone for smoother media management.
