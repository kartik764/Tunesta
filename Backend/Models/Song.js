import mongoose, { mongo } from "mongoose";

const songSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    path:{
        type:String,
        required:true,
        trim:true
    }
})

export default songSchema;