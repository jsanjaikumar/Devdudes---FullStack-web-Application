const  jwt = require("jsonwebtoken")
const User = require("../models/user")


const userAuth = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;
    if (!token) {
      return res.status(401).send("Please Login!!")
    }
    const decodeData = await jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = decodeData;

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("user not found");
    }
    req.user = user
    next()
  } catch (err) {
    res.status(400).send("Error at Auth " + err.message);
  }

};

module.exports = {
  userAuth
};