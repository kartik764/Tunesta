import express from "express";
import cors from "cors";
import http from "http";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import Album from "./Models/Album.js";
import User from "./Models/User.js";
import cloudinary from "./cloudinary.js";
import upload from "./multer.js";
import authenticatetoken from "./middleware/auth.js";
import socketHandler from "./socket/socket.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);

const connectDB = async () => {
  try {
    mongoose.connect(process.env.MONGODB_URI);
    console.log("Connection to mongoDB is successful");
  } catch {
    console.log("Connection failed to MongoDB");
    process.exit(1);
  }
};

connectDB();
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

    const newuser = await User.create({ email, password });

    res.status(201).json({
      status: "Success",
      message: "User created successfully",
      userID: newuser._id,
    });
  } catch (error) {
    if (error.code == 11000) {
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

    const userdetails = await User.findOne({ email: email });

    if (userdetails == null) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const hashedpassword = userdetails.password;
    const isMatch = await bcrypt.compare(password, hashedpassword);

    if (!isMatch) {
      return res.status(401).json({
        message: "password does not match",
      });
    }

    const token = jwt.sign(
      {
        userid: userdetails._id,
        email: userdetails.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }, 
    );

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

app.get("/albums", authenticatetoken, async (req, res) => {
  try {
    const albums = await Album.find();

    res.json(albums);
  } catch (error) {
    console.log("Error Fetching Albums: ", error.message);
    res.status(500).json({ message: "Failed to Fetch albums" });
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

      const cloudinaryUpload = new Promise((resolve, reject) => {
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

      const cloudinaryResult = await cloudinaryUpload;

      let coverurl =
        "https://res.cloudinary.com/dqkknf9vy/image/upload/v1765177467/default_cover_ppixnk.jpg";

      if (coverUpload) {
        const imagecloudinaryupload = new Promise((resolve, reject) => {
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

        const imagecloudinaryresult = await imagecloudinaryupload;
        coverurl = imagecloudinaryresult.secure_url;
      }

      const songData = {
        name: req.body.albumname || songUpload.originalname,
        path: cloudinaryResult.secure_url,
      };

      let albumTitle = req.body.albumTitle || "Untitled Album";

      let album1 = await Album.findOne({
        title: albumTitle,
        user: req.user.userid,
      });

      if (album1) {
        console.log("Founded exisiting album.... uploading the song to it");
        album1.songs.push(songData);
        await album1.save();

        res
          .status(200)
          .json({ message: "Song added to the exisiting album", album1 });
      } else {
        console.log("Album not found... Creating new one.");
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
    origin: ["http://localhost:5173", "https://tunesta.vercel.app"],
    methods: ["GET", "POST"],
  },
});

socketHandler(io);

server.listen(5000, "0.0.0.0", () => {
  console.log("🚀 Server running on port 5000");
});
