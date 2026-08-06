// Core
import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";

// Database
import mongoose from "mongoose";

// Authentication
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Socket
import { Server } from "socket.io";

// Models
import Album from "./Models/Album.js";
import User from "./Models/User.js";

// Middleware
import authenticatetoken from "./middleware/auth.js";
import upload from "./multer.js";

// Services
import cloudinary from "./cloudinary.js";

// Socket Handler
import socketHandler from "./socket/socket.js";
import { error } from "console";

// =========================
// CONFIG
// =========================
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);

// =========================
// DATABASE
// =========================
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connection to mongoDB is successful");
  } catch {
    console.log("Failed to connect to MOngoDB:", error.message);
    process.exit(1);
  }
};

connectDB();

// =========================
// MIDDLEWARE
// =========================
app.use(cors());
app.use(express.json());
app.use("/songs", express.static("songs"));

app.get("/", (req, res) => {
  res.send("Tunesta Backend Running!");
});

app.post("/auth/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide both email and password.",
      });
    }

    const newUser = await User.create({ email, password });

    return res.status(201).json({
      status: "Success",
      message: "User created successfully",
      userID: newUser._id,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Email already in use",
      });
    }

    console.error("Registration Error:", error.message);

    res.status(500).json({
      message: "Server Error during registration",
    });
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide Email and the password",
      });
    }

    const userDetails = await User.findOne({ email });

    if (!userDetails) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const hashedPassword = userDetails.password;
    const isMatch = await bcrypt.compare(password, hashedPassword);

    if (!isMatch) {
      return res.status(401).json({
        message: "password does not match",
      });
    }

    const token = jwt.sign(
      {
        userid: userDetails._id,
        email: userDetails.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    return res.status(200).json({
      message: "Login successfully",
      token,
      user: {
        id: userDetails._id,
        email: userDetails.email,
      },
    });
  } catch (error) {
    console.log("Login Error:", error.message);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

app.get("/albums", authenticatetoken, async (req, res) => {
  try {
    const albums = await Album.find();

    return res.json(albums);
  } catch (error) {
    console.log("Album Fetch Error: ", error.message);
    return res.status(500).json({ message: "Failed to fetch albums" });
  }
});

app.post(
  "/upload-song",
  authenticatetoken,
  upload.fields([
    { name: "song", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      if (!req.files || !req.files["song"]) {
        return res.status(200).json({
          message: "Please upload a song file.",
        });
      }

      const songUpload = req.files["song"][0];
      const coverUpload = req.files["cover"]?.[0] || null;

      const songUploadPromise = new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: "auto",
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

        uploadStream.end(songUpload.buffer);
      });

      const songUploadResult = await songUploadPromise;

      let coverUrl =
        "https://res.cloudinary.com/dqkknf9vy/image/upload/v1765177467/default_cover_ppixnk.jpg";

      if (coverUpload) {
        const coverUploadPromise = new Promise((resolve, reject) => {
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

          imageuploadstream.end(coverUpload.buffer);
        });

        const coverUploadResult = await coverUploadPromise;
        coverUrl = coverUploadResult.secure_url;
      }

      const songData = {
        name: req.body.albumname || songUpload.originalname,
        path: songUploadResult.secure_url,
      };

      let albumTitle = req.body.albumTitle || "Untitled Album";

      let existingAlbum = await Album.findOne({
        title: albumTitle,
        user: req.user.userid,
      });

      if (existingAlbum) {
        existingAlbum.songs.push(songData);
        await existingAlbum.save();

        return res
          .status(200)
          .json({
            message: "Song added to the exisiting album",
            album: existingAlbum,
          });
      } else {
        const newAlbum = await Album.create({
          user: req.user.userid,
          folder: albumTitle,
          title: req.body.albumTitle || songData.name,
          description: req.body.description || "Recently Created by the User",
          cover: coverUrl,
          songs: [songData],
        });

        return res
          .status(201)
          .json({ message: "Song uploaded and album created Successfully" });
      }
    } catch (error) {
      console.error("Upload Song Error:", error.message);
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  },
);

// =========================
// SOCKET
// =========================
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://tunesta.vercel.app"],
    methods: ["GET", "POST"],
  },
});

socketHandler(io);

// =========================
// SERVER
// =========================

server.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${port}`);
});