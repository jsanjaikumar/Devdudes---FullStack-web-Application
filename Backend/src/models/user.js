const mongoose = require('mongoose');
const validator = require("validator")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")


const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxLength: 50,
      minLength: 3,
    },
    lastName: {
      type: String,
      trim: true,
      maxLength: 50,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("you entered a Invaild email" + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a strong password: " + value);
        }
      },
    },
    passwordChangedAt: {
    type: Date,
    default: null,
    },
    verifyOtp: {
      type: String,
      default: " ",
    },
    verifyOtpExpiryAt: {
      type: Number,
      default: 0,
    },
    isEmailVerified: { type: Boolean, default: false },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("gender is Not valid");
        }
      },
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    membershipType: {
      type: String,
    },
    photoUrl: {
      type: String,
      default:
        "https://imgs.search.brave.com/EeNJW7iBuJN9coOhD8907Y69cMIOa-30Ciyg4g8oagU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS12ZWN0/b3IvaW5mbHVlbmNl/ci1pY29uLXZlY3Rv/ci1pbWFnZS1jYW4t/YmUtdXNlZC1kaWdp/dGFsLW5vbWFkXzEy/MDgxNi0yNjM0NDEu/anBnP3NlbXQ9YWlz/X2h5YnJpZCZ3PTc0/MCZxPTgw",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("You entered an invalid photo URL address: " + value);
        }
      },
    },

    about: {
      type: String,
      trim: true,
      default: "Hey there! I am using this app first time, let's connect.",
      MaxLength: 200,
    },
    skills: {
      type: [String],
      maxLength: 10,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = async function () {
  const user = this

  const token = await jwt.sign({ _id: user._id }, "Dev@Tinder", {expiresIn :"7d" }
  );
  
  return token;
};
// to find User.firstName : sanjai, User.lastName: kumar this compand index is below to make search faast when we have lot of datas
userSchema.index({firstName: 1, lastName: 1})

userSchema.methods.validPassword = async function (passwordInputByUser) {
  const user = this
  passwordHash = user.password;


  const isPasswordValid = await  bcrypt.compare(passwordInputByUser, passwordHash)

  return isPasswordValid;
}

module.exports = mongoose.model("User", userSchema);