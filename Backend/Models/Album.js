import mongoose, { mongo } from "mongoose";
import songSchema from "./Song.js";
import User from "./User.js";

const albumSchema = mongoose.Schema({
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

    //This user field is not ordinary like the other fields storing the data for the album itself, it is establishing a relation between the album and the user. 
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    songs: [songSchema]
})

const Album = mongoose.model('Album', albumSchema);

// This means: " The combination of UserID AND FolderName must be unique "
albumSchema.index({ user: 1, folder: 1 }, { unique: true });
export default Album;

// Just for learning: In this line, the populate keyword is used to search a particular id in the document other than it's own. and basically used for the related documents like in our case the album and song and this line will help us find the album for that particular user. since the user will be replaced by the id of the user.

// Album.find().populate('user')