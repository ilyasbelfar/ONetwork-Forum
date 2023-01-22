const jwt = require("jsonwebtoken");
const { TokenExpiredError } = jwt;

const validateEmailVerifyToken = async (req, res, next) => {
  const { token } = req.body;
  if (!token) {
    return res.status(404).json({
      message: "Unable to find an email verification token!",
    });
  }
  jwt.verify(
    token,
    process.env.EMAIL_VERIFY_TOKEN_SECRET_KEY,
    async (err, decoded) => {
      if (err) {
        if (err instanceof TokenExpiredError) {
          return res.status(400).json({
            message:
              "Email verification token is expired, Please request another activation link!",
          });
        }
      }
      if (!decoded) {
        return res.status(400).json({
          message:
            "Email verification token is invalid, Please request another activation link!",
        });
      }
      const { email } = decoded;
      req.user = { email };
      next();
    }
  );
};

module.exports = validateEmailVerifyToken;
