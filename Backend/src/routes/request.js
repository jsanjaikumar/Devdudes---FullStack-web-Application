const express = require("express")
const requestRouter =  express.Router()
const { userAuth } = require("../middlewares/Auth");
const connectionRequestModel = require("../models/connectionRequest")
const User = require("../models/user");

const sendEmail = require("../utils/sendEmail");

//sendConnectionAPI
requestRouter.post(
  "/request/send/:status/:userId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.userId;
      const status = req.params.status;

      const AllowedStatus = ["interested", "ignored"];
      if (!AllowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "invaild status type " + status });
      }
      //to check the touser is equat to same  touserId
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).send("user not found");
      }
      //to  optimize the &or instance to make faster create a index schema in DB check in
      const connectionRequestExisting = await connectionRequestModel.findOne({
        $or: [
          { fromUserId: fromUserId, toUserId: toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (connectionRequestExisting) {
        return res
          .status(400)
          .json({ message: "connection request is Already exists" });
      }

      const connectionRequest = await connectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      // const emailRes = await sendEmail.run(
      //   "A new friend request from " + req.user.firstName,
      //   req.user.firstName + " is " + status + " in " + toUser.firstName
      // );

      // console.log(emailRes)

      res.json({
        message:
          req.user.firstName + " is " + status + " in " + toUser.firstName,
        data,
      });
    } catch (err) {
      res.status(500).send("Error: " + err.message);
    }
  }
)


// /request/review/:status/:requestId

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req,res)=>{
  
 try {
   const loggedInUser = req.user;
   const { status, requestId } = req.params;

   const AllowedStatus = ["accepted", "rejected"];
   if (!AllowedStatus.includes(status)) {
     return res.status(400).json({ message: "Invalid Status request" });
   }
   

   const connectionRequest = await connectionRequestModel.findOne({
    _id : requestId,
    toUserId :  loggedInUser._id,
    status: "interested"
   })
   if(!connectionRequest){
    return res.status(400).json({message: " cannot find the request "})
   }
   connectionRequest.status = status
   const data = await connectionRequest.save()

   res.json({message:  "your connection request was " + status , data})
 } catch (err) {
   res.status(500).send("Error: " + err.message);
 }

})

module.exports= requestRouter
