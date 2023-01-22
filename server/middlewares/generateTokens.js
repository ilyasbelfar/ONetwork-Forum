const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const generateAccessToken = (user) => {
  email = user.email;
  username = user.username;

  try {
    const accessToken = jwt.sign(
      { email, username },
      process.env.ACCESS_TOKEN_SECRET_KEY,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
      }
    );

    return accessToken;
  } catch (err) {
    console.log(err);
  }
};

const generateRefreshToken = (user, expiration) => {
  email = user.email;
  username = user.username;

  try {
    const refreshToken = jwt.sign(
      { email, username },
      process.env.REFRESH_TOKEN_SECRET_KEY,
      {
        expiresIn: expiration,
      }
    );

    return refreshToken;
  } catch (err) {
    console.log(err);
  }
};

module.exports = { generateAccessToken, generateRefreshToken };
