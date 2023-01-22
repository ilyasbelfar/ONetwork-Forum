const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middlewares/generateTokens");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/nodemailer");
const verifyEmailTemplate = require("../utils/Emails_Templates/verifyEmailTemplate");
const forgotPasswordTemplate = require("../utils/Emails_Templates/forgotPasswordTemplate");
const generateEmailVerifyToken = require("../middlewares/generateEmailVerifyToken");
const generatePasswordResetToken = require("../middlewares/generatePasswordResetToken");

module.exports = {
  register: async (req, res) => {
    const { username, email, password, firstName, lastName } = req.body;
    if (!username || !email || !password || !firstName || !lastName) {
      return res.status(422).json({
        message: "Required filed(s) are missing!",
      });
    }
    try {
      let existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          message: "An account already exists with this email!",
        });
      }
      existingUser = null;
      existingUser = await User.findOne({ username }, { __v: 0, password: 0 });
      if (existingUser) {
        return res.status(400).json({
          message: "An account already exists with this username!",
        });
      }
      delete existingUser;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        firstName: firstName,
        lastName: lastName,
        email: email,
        username: username,
        password: hashedPassword,
      });
      
      const token = generateEmailVerifyToken(email);

      let options = {
        email: email,
        subject: "Verify your email address",
        html: verifyEmailTemplate(user, token),
      };

      await sendEmail(options);

      return res.status(201).json({
        message: `Email has been sent to ${email}. Follow the instructions to activate your account.`,
      });
    } catch (err) {
      return res.status(400).json({
        message: err.message,
      });
    }
  },
  login: async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Email or password are missing!",
      });
    }
    try {
      const userExisted = await User.findOne({ email });
      if (!userExisted) {
        return res.status(400).json({
          message: "No such user with this email!",
        });
      }
      const passwordValid = await bcrypt.compare(
        password,
        userExisted.password
      );
      if (!passwordValid) {
        return res.status(400).json({
          message: "Invalid password!",
        });
      }
      if (!userExisted.isVerified) {
        return res.status(400).json({
          message: "You must activate your account before you can login!",
        });
      }
      const accessToken = generateAccessToken(userExisted);
      const refreshToken = generateRefreshToken(
        userExisted,
        process.env.REFRESH_TOKEN_EXPIRATION
      );

      res.cookie("refreshToken", refreshToken, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        sameSite: "Strict",
        path: "/refresh_token",
      });

      delete userExisted.password;
      delete userExisted.__v;

      return res.status(200).json({
        message: "User logged-in successfully!",
        token: accessToken,
        user: userExisted,
        isLoggedIn: true,
      });
    } catch (err) {
      return res.json({
        message: err.message,
      });
    }
  },
  refresh_token: async (req, res) => {
    let { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(403).json({
        message: "Unauthorized, You must login!",
      });
    }
    try {
      const payload = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET_KEY
      );
      const user = await User.findOne(
        { email: payload.email },
        { __v: 0, password: 0 }
      );
      if (!user) {
        return res.json({
          message: "Unauthorized, You must login!",
        });
      }

      const expiration = payload.exp - Math.floor(Date.now() / 1000);
      const newAccessToken = generateAccessToken(user);
      const newRefreshToken = generateRefreshToken(user, expiration);

      res.cookie("refreshToken", newRefreshToken, {
        maxAge: expiration * 1000,
        httpOnly: true,
        sameSite: "Strict",
        path: "/refresh_token",
      });

      return res.json({
        user: user,
        token: newAccessToken,
      });
    } catch (err) {
      console.log(err);
    }
  },
  logout: async (req, res) => {
    try {
      const { username } = req.user;
      if (!username) {
        return res.status(400).json({
          message: "You're not logged-in!",
        });
      }
      res.cookie("refreshToken", "Onetwork Forum", {
        maxAge: -1,
        httpOnly: true,
        sameSite: "Strict",
        path: "/refresh_token",
      });
      return res.json({
        message: "User successfully logged out!",
      });
    } catch (err) {
      return res.json(err.message);
    }
  },
  emailVerify: async (req, res) => {
    try {
      const { email } = req.user;
      if (!email) {
        return res.status(404).json({
          message: "No Email Verification Token!",
        });
      }
      const user = await User.findOne({ email }, { __v: 0, password: 0 });
      if (!user) {
        return res.status(404).json({
          message: "No such user with this email!",
        });
      }
      if (user.isVerified) {
        return res.status(400).json({
          message: "Your e-mail is already verified!",
        });
      }
      if (!user.isVerified) {
        await User.findOneAndUpdate(
          { email },
          {
            isVerified: true,
          }
        );
        return res.status(200).json({
          message: "Your e-mail has been successfully verified!",
        });
      }
    } catch (err) {
      console.log(err.message);
    }
  },
  sendEmailVerification: async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({
          message: "No email was provided, Please enter an email!",
        });
      }
      const user = await User.findOne({ email }, { __v: 0, password: 0 });
      if (!user) {
        return res.status(404).json({
          message: "No such user with this email!",
        });
      }
      if (user.isVerified) {
        return res.status(400).json({
          message: "Your e-mail is already verified!",
        });
      }
      if (!user.isVerified) {
        const token = generateEmailVerifyToken(email);
        let options = {
          email: email,
          subject: "Verify your email address",
          html: verifyEmailTemplate(user, token),
        };

        await sendEmail(options);
        return res.status(200).json({
          message: `An account activation link has been sent to ${email}`,
        });
      }
    } catch (err) {
      console.log(err.message);
    }
  },
  resetPassword: async (req, res) => {
    try {
      const { email } = req.user;
      const { newPassword, confirmNewPassword } = req.body;
      if (!email) {
        return res.status(404).json({
          message: "No Password Reset Token!",
        });
      }
      if (!newPassword?.trim() || !confirmNewPassword?.trim()) {
        return res.status(404).json({
          message: "You have to enter both the two passwords!",
        });
      }
      if (newPassword?.trim() !== confirmNewPassword?.trim()) {
        return res.status(404).json({
          message:
            "The two passwords that you enter have to be the same, Try again!",
        });
      }
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          message: "No such user with this email!",
        });
      }
      const hashedPassword = await bcrypt.hash(newPassword?.trim(), 10);
      user.password = hashedPassword;
      await user.save();
      return res.status(200).json({
        message: "Your password has been reset successfully",
      });
    } catch (err) {
      console.log(err.message);
    }
  },
  sendForgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({
          message: "No email was provided, Please enter an email!",
        });
      }
      const user = await User.findOne({ email }, { __v: 0, password: 0 });
      if (!user) {
        return res.status(404).json({
          message: "No such user with this email!",
        });
      }
      const token = generatePasswordResetToken(email);
      let options = {
        email: email,
        subject: "Reset your password",
        html: forgotPasswordTemplate(user, token),
      };

      await sendEmail(options);
      return res.status(200).json({
        message: `Reset password email has been sent to ${email}`,
      });
    } catch (err) {
      console.log(err.message);
    }
  },
};
