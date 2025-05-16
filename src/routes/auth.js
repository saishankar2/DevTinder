const express = require("express");
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  //Creating an instance of the model
  try {
    const { firstName, lastName, emailId, password } = req.body;
    //Validating the data
    validateSignUpData(req);
    //Encryption
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.send("User Added");
  } catch (err) {
    res.status(404).send(err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Creadentials");
    }
    const isPasswordValid = await user.validatePassword(password);
    console.log(isPasswordValid);
    if (isPasswordValid) {
      const token = await user.getJWT(); //Creates the token
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 36000000),
      }); //Sends the cookie and we can also expire the cookie (Check docs)
      res.send("Login successful");
    } else {
      throw new Error("Invalid Creadentials");
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

authRouter.post("/logout", async (req, res)=>{
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  }).send("Logged Out");   //Can chain like this
})

module.exports = authRouter;
