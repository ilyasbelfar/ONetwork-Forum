const jwt = require("jsonwebtoken");
const { TokenExpiredError } = jwt;

const validateAccessToken = async (req, res, next) => {
  const bearerToken = req?.headers?.authorization;

  if (!bearerToken || !bearerToken.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "You are not logged-in!",
    });
  }

  const accessToken = bearerToken.split(" ")[1];

  jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET_KEY,
    async (err, decoded) => {
      if (err) {
        if (err instanceof TokenExpiredError) {
          return res
            .status(401)
            .json({ message: "Unauthorized! Access Token was expired!" });
        }
      }
      if (!decoded) {
        return res.status(401).json({
          message: "Unauthorized!",
        });
      }
      const { username, email } = decoded;
      req.user = { username, email };
      next();
    }
  );
};

module.exports = validateAccessToken;
