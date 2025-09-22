const express = require("express")
const profileRouter = express.Router();
const User = require("../models/user");
const {userAuth} = require("../middlewares/Auth")
const {vaildateEditProfileData,vaildateEditPassword,} = require("../utils/validator");
const bcrypt = require("bcrypt");

//profile API
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(500).send("Error " + err.message);
  }
});

//profile edit API
profileRouter.patch("/profile/edit", userAuth, async (req, res)=>{
    try {
        if(!vaildateEditProfileData(req)) {
            throw new Error("Invaild Edit request ")
        }
         const loggedInUser = req.user;
        

         Object.keys(req.body).forEach((key)=>(loggedInUser[key] = req.body[key]));

        await loggedInUser.save()


        res.json({message: `${loggedInUser.firstName} profile updated successfully`, data: loggedInUser});
    } catch (err) {
      res.status(500).send("Error " + err.message);
    }

})

//profile password

profileRouter.patch("/profile/password", userAuth, async (req,res)=>{
try {
  if (!vaildateEditPassword(req)) {
    throw new Error("Invalid Request");
  }
  const loggedInUser = req.user;
  const passwordHash = await bcrypt.hash(loggedInUser, 10);

  const loggedInPass = new User({password: passwordHash})
  
  // Object.keys(req.body).forEach((key) => (passwordHash[key] = req.body[key]));

  await loggedInUser.save()

  res.send({message : `${loggedInUser.firstName} password is changed successfully`, })
} catch (err) {
  res.status(500).send("Error " + err.message);
}
})



module.exports = profileRouter
