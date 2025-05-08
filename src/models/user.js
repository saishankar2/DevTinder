const mongoose = require('mongoose');
const validator = require("validator");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        maxLength: 50,
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email")
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a stronger Password")
            }
        }
    },
    age:{
        type: Number,
        min: 18,
        max: 99
    },
    gender:{
        type: String,
        lowercase: true,
        validate(value){
            if(!["male","female","other"].includes(value)){
                throw new Error("Invalid Gender");
            }
        }
    },
    photoUrl:{
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSH4dcYWVFHFsz8M3Rsjpy2Hg6gQAmgbCIwWA&s",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid URL")
            }
        }
    },
    about:{
        type: String,
        default: "This is a default about of the user!!"
    },
    skills:{
        type: [String]
    },
    
},
{
    timestamps: true, //Create and updated date
}
);

const User = mongoose.model("User", userSchema);
module.exports = User;