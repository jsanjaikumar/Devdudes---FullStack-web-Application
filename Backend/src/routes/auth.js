const express = require("express")
const authRouter = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { signupDataValidate } = require("../utils/validator");
const bcrypt = require("bcrypt");
const { run: sendEmail } = require("../utils/sendEmail"); 
const { userAuth } = require("../middlewares/Auth");
const transporter = require("../config/mailer");
const generateOtp = require("../utils/otp");


//signUp API 
authRouter.post("/signup", async (req, res) => {
  try{
  //Validate the request first
  signupDataValidate(req)

  const { firstName, lastName, emailId, password } = req.body;

  //encrpting passwords and other datas
   
  const passwordHash = await bcrypt.hash(password, 10)
  // creating a new instance of the User modal
  const user = new User({
    firstName,
    lastName,
    emailId,
    password: passwordHash,
  });

  

    const savedUSer = await user.save();
    const token = await savedUSer.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });

    res.json({message: "user Signup successfully", data: savedUSer});
  } catch (err) {
    res.status(500).send("ERROR " + err.message);
  }
});

//login API
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Invaild Credentials");
    }
    const isPasswordValid = await user.validPassword(password);
    if (isPasswordValid) {
      //creating cookies
      const token = await user.getJWT();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send(user);
    } else {
      throw new Error("Invaild Credentials");
    }
  } catch (err) {
    res.status(500).send("Error " + err.message);
  }
});

//logout api
authRouter.post('/logout', async (req, res)=>{
    res.cookie("token", null, {
        expires :new Date(Date.now())
    })
    res.send("logout successful");
})


//Email Verification via OTP
authRouter.post('/send-otp', async (req, res) => {
  try {
    const { emailId } = req.body;
    if (!emailId) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findOne({ emailId });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);

    user.verifyOtp = hashedOtp;
    user.verifyOtpExpiryAt = Date.now() + 5 * 60 * 1000; // 5 min
    await user.save();

    await transporter.sendMail({
      from: `"DevDudes" <${process.env.SMTP_USER}>`,
      to: emailId,
      subject: 'Your DevDudes OTP Code',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Email Verification</h2>
          <p>Your OTP code is:</p>
          <h1 style="letter-spacing: 5px;">${otp}</h1>
          <p>This code will expire in 5 minutes.</p>
        </div>
      `
    });

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});



//verify OTP API

//VERIFY OTP
authRouter.post("/verify-otp", async (req, res) => {
  try {
    const { emailId, verifyOtp } = req.body; // match schema field name

    if (!emailId || !verifyOtp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check expiry
    if (Date.now() > user.verifyOtpExpiryAt) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // Compare OTP
    const isMatch = await bcrypt.compare(verifyOtp.toString(), user.verifyOtp);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Mark email as verified
    user.isEmailVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpiryAt = 0;
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    console.error("Verify OTP error:", err);
    res.status(500).json({ message: "OTP verification failed" });
  }
});


//forgot password API

// FORGOT PASSWORD - send OTP for password reset
authRouter.post('/forgot-password', async (req, res) => {
  try {
    const { emailId } = req.body;

    if (!emailId) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ emailId });
    if (!user) {
      // For security, don't reveal if user exists
      return res.status(200).json({ message: 'If account exists, OTP sent' });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);

    // Save OTP and expiry
    user.verifyOtp = hashedOtp;
    user.verifyOtpExpiryAt = Date.now() + 5 * 60 * 1000; // 5 minutes
    await user.save();

    // Send email
    await transporter.sendMail({
      from: `"DevDudes" <${process.env.SMTP_USER}>`,
      to: emailId,
      subject: 'Password Reset OTP',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Password Reset Request</h2>
          <p>Your OTP code is:</p>
          <h1 style="letter-spacing: 5px;">${otp}</h1>
          <p>This code will expire in 5 minutes.</p>
        </div>
      `
    });

    res.status(200).json({ message: 'If account exists, OTP sent' });
  } catch (err) {
    console.error('Forgot Password error:', err);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});


//reset password API

// POST /reset-password/:token
// RESET PASSWORD
authRouter.post('/reset-password', async (req, res) => {
  try {
    const { emailId, verifyOtp, newPassword } = req.body;

    if (!emailId || !verifyOtp || !newPassword) {
      return res.status(400).json({ message: 'Email, OTP, and new password are required' });
    }

    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check OTP expiry
    if (Date.now() > user.verifyOtpExpiryAt) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    // Compare OTP
    const isMatch = await bcrypt.compare(verifyOtp.toString(), user.verifyOtp);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user
    user.password = hashedPassword;
    user.passwordChangedAt = new Date();
    user.verifyOtp = '';
    user.verifyOtpExpiryAt = 0;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('Reset Password error:', err);
    res.status(500).json({ message: 'Password reset failed' });
  }
});



module.exports = authRouter
