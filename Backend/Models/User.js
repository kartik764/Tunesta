import mongoose from "mongoose";

// This library helps us in hashing the passwords successfully.
import bcrypt from "bcryptjs";

const userSchema= new mongoose.Schema({
    email:{
        type:String,
        required: [true, 'Please provide an email'],
        unique:true,
        lowercase:true,
        trim:true
    },

    password:{
        type:String,
        required: [true, 'Please provide a password'],
        minlength:6
    }
});

// This is my Middle Ware function that will work between the 2 events that is incoming of the user information and outgoing of that user information which will mean the password of the user as the plain text we would be having it for very less time.
// We will hash the password of the user using the pre-save hook
userSchema.pre('save', async function (next){
    if(!this.isModified('password')) return next();

    // if the password is modified or new entry we have to hash it.
    const salt = await bcrypt.genSalt(12);
    this.password=await bcrypt.hash(this.password,salt);
    next();
})

const User= mongoose.model('User',userSchema);

export default User;    








