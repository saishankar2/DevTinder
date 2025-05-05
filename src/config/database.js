const mongoose = require('mongoose');

const connectDB = async () =>{
  await mongoose.connect("mongodb+srv://shankarpatibandla22:oSjRCTJiNHi7QDi1@namastenode.jo56oe9.mongodb.net/devTinder");
}

module.exports = {connectDB};

