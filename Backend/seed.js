// This is a separate script just to seed our database with our albums data.
// This is a one time run program that is just used to seed the database, it will connect -> seed -> Disconnect.

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Album from './Models/Album.js'; 
import User from './Models/User.js';
import albumsdata from './data.js';

// This command is written to use the env variable inside the seed.js
dotenv.config();

const seedDatabase = async()=> {
    try{
        // 1. Connecting to the MONGODB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("The database has been connected successfully...");

        // 2. Clear the exisiting data.
        console.log("Deleting exisiting data ...");
        await Album.deleteMany({});
        await User.deleteMany({});
        console.log("Existing data deleted...");

        // 3. Create Dummy User
        const user = await User.create({
            email: "test@tunesta.com",
            password : "123456"
        })

        console.log("Dummy User created");

        // 4. Attach user to all albums
        const albumsWithUser = albumsdata.map(album => ({
            folder: album.folder,
            title: album.title,
            description: album.description,
            cover: album.cover,
            songs: album.songs,
            user: user._id
        }));

        console.log("Sample album:", albumsWithUser[0]);

        // 5. Inserting (Seeding) the new data.
        console.log("Seeding new data...");
        await Album.insertMany(albumsWithUser);

        console.log("New data seeded successfully...");
    }
    catch(error){
        console.error("Seeding failed:", error.message);;
    }
    finally{
        await mongoose.connection.close();
        console.log("MongoDB Disconnected...");
        process.exit(0);
    }
};

seedDatabase();
