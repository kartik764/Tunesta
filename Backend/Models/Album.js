import mongoose from "mongoose";
import songSchema from "./Song.js";

const albumSchema = new mongoose.Schema({
    folder: {
        type: String,
        required: true,
        
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    cover: {
        type: String,
        required: true,
        trim: true
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    songs: [songSchema]
})

albumSchema.index(
    { user: 1, folder: 1 },
    { unique: true }
);

const Album = mongoose.model("Album", albumSchema);

export default Album;