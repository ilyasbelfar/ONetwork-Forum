const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateEmailVerifyToken = (email) => {
  try {
    const emailVerifyToken = jwt.sign(
      { email },
      process.env.EMAIL_VERIFY_TOKEN_SECRET_KEY,
      {
        expiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRATION,
      }
    );
    return emailVerifyToken;
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
};

module.exports = generateEmailVerifyToken;
