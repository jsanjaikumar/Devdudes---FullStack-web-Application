const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/Auth");
const connectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user")


const USER_SAFE_DATA = "firstName lastName photoUrl about skills age gender";
// user/request/received
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await connectionRequestModel
      .find({
        toUserId: loggedInUser._id,
        status: "interested",
      })
      .populate("fromUserId", USER_SAFE_DATA);

    res.json({
      message: "Request List Data Fetched Successfully",
      data: connectionRequests,
    });
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
});
//connection api
userRouter.get("/user/connection", userAuth, async (req, res)=>{
   try {
        const loggedInUser = req.user;

        const connectionRequests = await connectionRequestModel
          .find({
            $or: [
              { toUserId: loggedInUser._id, status: ["accepted"] },
              { fromUserId: loggedInUser._id, status: ["accepted"] },
            ],
          })
          .populate("fromUserId", USER_SAFE_DATA)
          .populate("toUserId", USER_SAFE_DATA);
          
          const data = connectionRequests.map((row) => {
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId
            }else{
                return row.fromUserId
            }
            
          })

            res.json({data})

   } catch (err) {
     res.status(500).send("Error: " + err.message);
   }
})

//Feed API
userRouter.get("/feed", userAuth , async(req,res)=>{
  try {
     let limit = parseInt(req.query.limit) || 10;
     limit = limit > 50 ? 50 : limit;
    const page  = parseInt(req.query.page) || 1
    const skip = (page-1)* limit
  

    const loggedInUser = req.user;

    const connectionRequests = await connectionRequestModel
      .find({
        $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
      }).select("fromUserId toUserId");

      const hideUserFromFeed = new Set();
      connectionRequests
        .forEach((req) => {
          hideUserFromFeed.add(req.fromUserId.toString());
          hideUserFromFeed.add(req.toUserId.toString());
        })
        

      const users = await User.find({
        $and: [
          { _id: { $nin: Array.from(hideUserFromFeed) } },
          { _id: { $ne: loggedInUser._id } },
        ],
      }).select(USER_SAFE_DATA).skip(skip).limit(limit)

      res.json({ users})
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
  

})

module.exports = userRouter