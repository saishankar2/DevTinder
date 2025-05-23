const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "invalid status type",
        });
      }
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [                               //Mongo schema to apply or condition
           {fromUserId, toUserId},
           {fromUserId: toUserId, toUserId: fromUserId}
        ]
      });
      if(existingConnectionRequest){
        return res.status(400).send("Connection request already exists");
      }
      const toUser = await User.findById(toUserId);
      if(!toUser){
        return res.status(404).json({message: "User not found"});
      }
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();
      res.json({
        message: req.user.firstName+" is "+ status+ " in " + toUser.firstName,
        data,
      });
    } catch (err) {
      res.status(400).send(err.message);
    }
  }
);

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res)=>{
  try{
    const loggedInUser = req.user;
    const {status, requestId} = req.params;
    const allowedStatus = ["accepted","rejected"];
    if(!allowedStatus.includes(status)){
      return res.status(400).json({message: "Not Allowed"});
    }
    console.log(loggedInUser);
    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: "interested"
    })
    if(!connectionRequest){
      return res.status(404).json({message: "Not found"});
    }
    connectionRequest.status = status;
    const data = await connectionRequest.save();
    res.json({message: "Connection request "+ status, data});
  }
  catch(err){
    res.status(400).send(err.message);
  }
})

module.exports = requestRouter;
