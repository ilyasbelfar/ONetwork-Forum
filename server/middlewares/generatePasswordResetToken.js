const jwt = require("jsonwebtoken");
require("dotenv").config();

const generatePasswordResetToken = (email) => {
  try {
    const resetPasswordToken = jwt.sign(
      { email },
      process.env.RESET_PASSWORD_TOKEN_SECRET_KEY,
      {
        expiresIn: process.env.RESET_PASSWORD_TOKEN_EXPIRATION,
      }
    );
    return resetPasswordToken;
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
};

module.exports = generatePasswordResetToken;
