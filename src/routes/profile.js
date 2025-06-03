const express = require("express");
const { userAuth } = require("../middlewares/auth");
const profileRouter = express.Router();
const {validateEditProfile} = require("../utils/validation")
const User = require("../models/user");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const { firstName } = req.user;
    res.send(req.user);
  } catch (err) {
    res.send("Please Login!!");
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res)=>{
  const data = req.body;
  const userId = req.params?.userId;
  try {
    const isUpdateAllowed = validateEditProfile(req);
    if (!isUpdateAllowed) {
      throw new Error("Update Not Allowed");
    }
    if (data?.skills?.length > 10) {
      throw new Error("No more than 10 skills allowed");
    }
    const loggedUser = req.user
    Object.keys(req.body).forEach(key => (loggedUser[key] = req.body[key]));
    console.log("ERROR HERE");
    await loggedUser.save();
    // const user = await User.findByIdAndUpdate(loggedUser._id, loggedUser, {
    //   returnDocument: "before", //If you try and update a field that is not present, it will get ignored
    //   runValidators: true,
    // }); //Validation will only run on update with this or else validation is skipped

    const { password, ...userWithoutPassword } = loggedUser.toObject(); //used toObject as it is a mongoose object and may contain other fields
    res.json({
      message: `${loggedUser.firstName}, your profile was created successfully`,
      data: userWithoutPassword
    });
  } catch (err) {
    res.status(400).send("Something went wrong " + err);
  }
})

module.exports = profileRouter;
