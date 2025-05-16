const express = require("express");
const { userAuth } = require("../middlewares/auth");

const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  console.log(req.user.firstName + " sent a request");
  res.send("Sent");
});

module.exports = requestRouter;
