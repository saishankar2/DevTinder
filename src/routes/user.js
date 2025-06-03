const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');
const userRouter = express.Router();

const USER_SAFE_DATA = ["firstName", "lastName", "photoUrl", "age", "gender", "skills", "about"]

userRouter.get("/user/requests/received", userAuth, async (req, res)=>{
  try{
     const loggedInUser = req.user;
     const connectionRequests = await ConnectionRequest.find({
        toUserId: loggedInUser._id,
        status: "interested"
     }).populate("fromUserId", USER_SAFE_DATA ) //Just specify what you want to send else entire user object will be sent
       //.populate("fromUserId", "firstName lastName") //Can write as space separated string
     res.json({
        message: "Data Fetched",
        connectionRequests
     })
  }
  catch(err){
    res.status(400).send(err.message);
  }
});

userRouter.get("/user/connections", userAuth, async(req,res)=>{
    try{
       const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
        $or: [                               //Mongo schema to apply or condition
           {fromUserId: loggedInUser._id},
           {toUserId: loggedInUser._id}
        ],
        status: "accepted"
     }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA)

     const data = connectionRequests.map(row=> {
        if(row.fromUserId._id.equals(loggedInUser._id)){
            return row.toUserId;
        }
        return row.fromUserId
     })
     res.json({
        message: "Data Fetched",
        data
     })
    }
    catch(err){
    res.status(400).send(err.message);
   }
});

userRouter.get("/feed", userAuth, async (req, res)=>{
  try{
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page-1)*limit;
    const connectionRequests = await ConnectionRequest.find({
       $or: [                               //Mongo schema to apply or condition
           {fromUserId: loggedInUser._id},
           {toUserId: loggedInUser._id}
        ]
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach(req=>{
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    })
    const users = await User.find({
      $and: [{_id: {$nin: Array.from(hideUsersFromFeed)}},
            {_id: {$ne: loggedInUser._id}},
       ],
    }).select(USER_SAFE_DATA).skip(skip).limit(limit);  //Just sends the data we want to
    res.send(users);
  }
  catch(err){
    res.status(400).send(err.message);
   }
})


module.exports = userRouter;