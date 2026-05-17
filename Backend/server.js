import express from "express";
import cors from "cors";
import http from "http";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import Album from "./Models/Album.js"; // Fixed: Capitalized Model Name
import User from "./Models/User.js";
import cloudinary from "./cloudinary.js";
import upload from "./multer.js";
import authenticatetoken from "./middleware/auth.js";

// This command is written to use the env variable inside the server.js
dotenv.config();

const app = express();
//Render assigns a port using an environment variable. When deployed, the backend uses that port; otherwise, it runs on port 3000 locally.
const port = process.env.PORT || 3000;
const server = http.createServer(app);

// The function used to connect to the Database ( in our case it is  MongoDB Atlas).
// As server.js is our main server that would return the responses corresponding to the API requests, the database should always be connected to it whenever the server is running. Not like seed.js.
const connectDB = async () => {
  try {
    mongoose.connect(process.env.MONGODB_URI); //gets the connection string from environment variables
    console.log("Connection to mongoDB is successful");
  } catch {
    console.log("Connection failed to MongoDB");
    // If not exit, it will run on the broken server.
    process.exit(1); //if db fails, server stops
  }
};
connectDB();

// Middleware.
app.use(cors()); //Used to remove the cors error
app.use(express.json()); //used to read the json input
app.use("/songs", express.static("songs")); //serve static files here

// *********************{Router Handles}******************************

//1. Testing Route
app.get("/", (req, res) => {
  res.send("Tunesta Backend Running!");
});

//2. API for register/signup for new user
app.post("/auth/register", async (req, res) => {
  try {
    // Extract email and password from request body from express.json middleware
    const { email, password } = req.body;

    // Validate input: both email and password are required
    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide both email and password.",
      });
    }

    // Create a new user in the database
    const newuser = await User.create({ email, password });

    // Send success response with created user ID
    res.status(201).json({
      status: "Success",
      message: "User created successfully",
      userID: newuser._id,
    });
  } catch (error) {
    // Handle duplicate email error (MongoDB error code 11000)
    if (error.code == 11000) {
      return res.status(409).json({
        message: "Email already in use",
      });
    }

    // Log and handle unexpected server errors
    console.error("Registration Error:", error.message);
    res.status(500).json({
      message: "Server Error during registration",
    });
  }
});

//3. API for the login of existing user
app.post("/auth/login", async (req, res) => {
  try {
    // Extract email and password from request body
    const { email, password } = req.body;

    // Validate Input
    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide Email and the password",
      });
    }

    // Find user by email
    const userdetails = await User.findOne({ email: email });

    // If user does not exist
    if (userdetails == null) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Compare entered password with hashed password in database
    const hashedpassword = userdetails.password;
    const isMatch = await bcrypt.compare(password, hashedpassword);

    if (!isMatch) {
      return res.status(401).json({
        message: "password does not match",
      });
    }

    // Generate JWT token for authenticated user
    const token = jwt.sign(
      // payload: Data we want to insert into the token.
      {
        userid: userdetails._id,
        email: userdetails.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }, //Token expires in 1 day(after that automatically logout)
    );

    // Successful login response
    return res.status(200).json({
      message: "Login successfully",
      token: token,
      user: {
        id: userdetails._id,
        email: userdetails.email,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

//4. API for fetching the albums created by user
app.get("/albums", authenticatetoken, async (req, res) => {
  try {
    // Fetch all albums that belong to the authenticated user
    // req.user.userid comes from the decoded JWT (set in middleware)
    const albums = await Album.find();

    // Send the user's albums as a response
    res.json(albums);
  } catch (error) {
    console.log("Error Fetching Albums: ", error.message);
    res.status(500).json({ message: "Failed to Fetch albums" });
  }
});

// This API endpoint receives a song file from the client,
// uploads it to Cloudinary, retrieves the file URL from the Cloudinary,
// and then stores that URL in MongoDB.

//MiddleWare:
// We use upload.fields() to handle multiple file uploads
// (e.g., both the song file and its image).
// The files are temporarily stored in memory (RAM) using Multer
// before being uploaded to Cloudinary.

// --------------------------
// Request Flow Summary
// --------------------------

// 1. Request Arrives:
// The user sends a request containing:
// - Song file (MP3)
// - Image file (optional)
// - JWT token in the Authorization header

// 2. Authentication middleware (authenticatetoken):
// - Verifies the JWT token
// - Decodes user information
// - Attaches it to req.user
// - Calls next() to proceed

// 3. Upload route (/upload-song):
// - Receives req (which now includes req.user)
// - Uploads files to Cloudinary
// - Gets file URLs from Cloudinary

// 4. Database operation:
// Needs to save to DB. Who is the owner?
// Looks at Clipboard: req.user.userId. (Ah! It's Chetan!).
// Saves Album with user: req.user.userId.

// 5. Response:
// - Sends success response back to the client

console.log("hello world");

//5. API to upload a song (and optional cover image),
// store files in Cloudinary, and save metadata in MongoDB.

app.post(
  "/upload-song",
  authenticatetoken,
  upload.fields([
    { name: "song", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      // Validate: song file is required (cover is optional)
      if (!req.files || !req.files["song"]) {
        return res.status(200).json({
          message: "Please upload a song file.",
        });
      }

      // defining the song and cover images separately
      const songUpload = req.files["song"][0];
      const coverUpload = req.files["cover"]?.[0] || null;

      // if the file is uploaded then we have to make sure to send it to the cloudinary and get the link.

      // the uploadStream: is like making a pipe between the bucket of water end to the swimming pool end

      // wrapping it in a promise has a reason that till the time the water is not completely filled at pool or we get any signal from the swimming pool guard that will be our response, we will be keep going.
      const cloudinaryUpload = new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: "auto",
            // folder is optional, we have done to store the songs in a specific foldder.
            folder: "tunesta-songs",
          },

          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          },
        );

        // This means adding the water to the pipe through the bucket of water.
        // here since we have used the memorystorage in the multer, therefore the file is stored in the buffer.
        uploadStream.end(songUpload.buffer);
      });

      // we wrapped the uploadStream function in to a promise just because to use the await here, because uploading to cloudinary follows a traditional JS approach in which the callback hell is the major problem, so to make sure that does not happen, we have wrapped it in to a promise.
      const cloudinaryResult = await cloudinaryUpload;

      // Since coverimage uploading is optional so we have to give a default cover url also.
      let coverurl =
        "https://res.cloudinary.com/dqkknf9vy/image/upload/v1765177467/default_cover_ppixnk.jpg";

      if (coverUpload) {
        // Here we have to upload the image to cloudinary also, so BRUTE FORCE: writting the promise for image.

        const imagecloudinaryupload = new Promise((resolve, reject) => {
          // 1. We setted up the bridge.
          const imageuploadstream = cloudinary.uploader.upload_stream(
            {
              resource_type: "auto",
              folder: "tunesta_coverimages",
            },

            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            },
          );

          // here in the req.file.buffer cannot just give both the things the song and image with it's own mind so we have to define them separately, that i will do few lines above.
          imageuploadstream.end(coverUpload.buffer);
        });

        const imagecloudinaryresult = await imagecloudinaryupload;
        coverurl = imagecloudinaryresult.secure_url;
      }

      // here cloudinary result will be containing the result of the promise like the filetype, URL etc.
      // therfore either we will make the separate song model or will use the exisiting album model to
      // enter the song cloudinary URL in mongoDB

      // We are using the exisiting album model in which the song schema is already wrapped.

      const songData = {
        name: req.body.albumname || songUpload.originalname,
        path: cloudinaryResult.secure_url,
      };

      // The user will provide the albumTitle if he wants to upload in to the exisiting album
      let albumTitle = req.body.albumTitle || "Untitled Album";

      // finding that albumtitle to the corresponding user in the mongodb database.
      // Fixed: Added await and used Capitalized Album model and corrected userid spelling
      let album1 = await Album.findOne({
        title: albumTitle,
        user: req.user.userid,
      });

      // checking if album1 already exists, if yes then song will be added to it, otherwise new album will be created.
      if (album1) {
        console.log("Founded exisiting album.... uploading the song to it");
        album1.songs.push(songData);
        await album1.save();

        res
          .status(200)
          .json({ message: "Song added to the exisiting album", album1 });
      } else {
        console.log("Album not found... Creating new one.");
        // Fixed: Used Capitalized Album model and corrected userid spelling
        const newAlbum = await Album.create({
          user: req.user.userid,
          folder: albumTitle,
          title: req.body.albumTitle || songData.name,
          description: req.body.description || "Recently Created by the User",
          cover: coverurl,
          songs: [songData],
        });

        return res
          .status(201)
          .json({ message: "Song uploaded and Album Created Successfully" });
      }
    } catch (e) {
      console.log("Error while uploading song and creating album:", e.message);
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  },
);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// 🔥 Store room data
const rooms = {};
// roomId -> { users: [], host, song, time, isPlaying }

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  // =========================
  // 🔹 JOIN
  // =========================
  socket.on("join_room", ({ roomId, username }) => {
    socket.join(roomId);

    //Craete room if not exist
    if (!rooms[roomId]) {
      rooms[roomId] = {
        users: [],
        host: socket.id,
        song: null,
        time: 0,
        startedAt: null,
        isPlaying: false,
        volume: 1,
        queue: [],
      };
    }

    // Add user
    const existingUser = rooms[roomId].users.find(
      (u) => u.username === username,
    );

    rooms[roomId].users = rooms[roomId].users.filter(
      (u) => u.username !== username,
    );

    rooms[roomId].users.push({
      socketId: socket.id,
      username,
    });

    // 🔥 If host is null → assign one
    if (!rooms[roomId].host) {
      rooms[roomId].host = socket.id;
    }

    //Send updated users list
    io.to(roomId).emit("room_users", rooms[roomId].users);

    // Send host info
    io.to(roomId).emit("host_info", rooms[roomId].host);

    console.log("JOIN:", {
      roomId,
      host: rooms[roomId].host,
      users: rooms[roomId].users,
    });

    // Send sync state
    let currentTime = rooms[roomId].time;

    if (rooms[roomId].isPlaying && rooms[roomId].startedAt) {
      const elapsed = (Date.now() - rooms[roomId].startedAt) / 1000;

      currentTime += elapsed;
    }

    socket.emit("sync_state", {
      song: rooms[roomId].song,
      time: currentTime,
      isPlaying: rooms[roomId].isPlaying,
      volume: rooms[roomId].volume,
    });
  });

  // =========================
  // 🔹 PLAY
  // =========================
  socket.on("play", ({ roomId, song, time }) => {
    if (!rooms[roomId]) return;

    //only host allowed
    if (rooms[roomId].host !== socket.id) return;

    //save state
    rooms[roomId].song = song;
    rooms[roomId].time = time;
    rooms[roomId].startedAt = Date.now();

    rooms[roomId].isPlaying = true;

    //send to evryone
    io.to(roomId).emit("play", {
      song,
      time,
      sentAt: Date.now(),
    });
  });

  // =========================
  // 🔹 PLAY NEXT
  // =========================
  socket.on("play_next", (roomId) => {
    console.log("🔥 play_next received");
    if (!rooms[roomId]) return;

    // only host
    if (rooms[roomId].host !== socket.id) return;

    const nextSong = rooms[roomId].queue[0];

    if (!nextSong) return;

    // remove from queue
    rooms[roomId].queue.shift();

    // save room playback state
    rooms[roomId].song = nextSong;

    rooms[roomId].time = 0;

    rooms[roomId].startedAt = Date.now();

    rooms[roomId].isPlaying = true;

    // update queue for everyone
    io.to(roomId).emit("queue_updated", rooms[roomId].queue);

    // play next song
    io.to(roomId).emit("play", {
      song: nextSong,
      time: 0,
      sentAt: Date.now(),
    });
  });

  // =========================
  // 🔹 PAUSE
  // =========================
  socket.on("pause", ({ roomId, time }) => {
    if (!rooms[roomId]) return;

    //only host allowed
    if (rooms[roomId].host !== socket.id) return;

    rooms[roomId].time = time;
    rooms[roomId].isPlaying = false;

    io.to(roomId).emit("pause", time);
  });

  // =========================
  // 🔹 SEEK
  // =========================
  socket.on("seek", ({ roomId, time }) => {
    if (!rooms[roomId]) return;

    //only host allowed
    if (rooms[roomId].host !== socket.id) return;

    rooms[roomId].time = time;
    rooms[roomId].startedAt = Date.now();

    io.to(roomId).emit("seek", {
      time,
      sentAt: Date.now(),
    });
  });

  // =========================
  // 🔹 VOLUME
  // =========================
  socket.on("volume_change", ({ roomId, volume }) => {
    if (!rooms[roomId]) return;

    //only host allowed
    if (rooms[roomId].host !== socket.id) return;

    rooms[roomId].volume = volume;

    io.to(roomId).emit("volume_change", volume);
  });

  // =========================
  // 🔹 DISCONNECT
  // =========================
  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);

    for (let roomId in rooms) {
      const room = rooms[roomId];

      // Remove user
      const leavingUser = room.users.find((u) => u.socketId === socket.id);

      if (!leavingUser) continue;

      setTimeout(() => {
        const userStillPresent = room.users.find(
          (u) => u.username === leavingUser.username,
        );

        if (userStillPresent && userStillPresent.socketId !== socket.id) {
          return;
        }

        // remove user
        room.users = room.users.filter(
          (u) => u.username !== leavingUser.username,
        );

        // delete room if empty
        if (room.users.length === 0) {
          delete rooms[roomId];
          return;
        }

        // reassign host
        if (room.host === socket.id) {
          room.host = room.users[0]?.socketId || null;
        }

        io.to(roomId).emit("room_users", room.users);
        io.to(roomId).emit("host_info", room.host);

        console.log("UPDATED ROOM:", roomId, room.host);
      }, 3000);
    }
  });

  // =========================
  // 🔹 LEAVE ROOM
  // =========================
  socket.on("leave_room", (roomId) => {
    if (!rooms[roomId]) return;

    const leavingUser = rooms[roomId].users.find(
      (u) => u.socketId === socket.id,
    );

    if (leavingUser) {
      socket.to(roomId).emit("user_left", leavingUser.username);
    }

    socket.leave(roomId);

    rooms[roomId].users = rooms[roomId].users.filter(
      (u) => u.socketId !== socket.id,
    );

    io.to(roomId).emit("room_users", rooms[roomId].users);

    if (rooms[roomId].host === socket.id) {
      const newHost = rooms[roomId].users[0]?.socketId || null;

      rooms[roomId].host = newHost;

      io.to(roomId).emit("host_info", newHost);
    }
  });

  socket.on("add_to_queue", ({ roomId, song }) => {
    if (!rooms[roomId]) return;

    rooms[roomId].queue.push(song);

    io.to(roomId).emit("queue_updated", rooms[roomId].queue);
  });

  socket.on("remove_from_queue", ({ roomId, index }) => {
    if (!rooms[roomId]) return;

    // only host can remove
    if (rooms[roomId].host !== socket.id) return;

    rooms[roomId].queue.splice(index, 1);

    io.to(roomId).emit("queue_updated", rooms[roomId].queue);
  });
});

server.listen(5000, "0.0.0.0", () => {
  console.log("🚀 Server running on port 5000");
});
