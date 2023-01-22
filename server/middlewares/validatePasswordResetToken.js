const jwt = require("jsonwebtoken");
const { TokenExpiredError } = jwt;

const validatePasswordResetToken = async (req, res, next) => {
  const { token } = req.body;
  if (!token) {
    return res.status(404).json({
      message: "Unable to find a password reset token!",
    });
  }
  console.log(token);
  jwt.verify(
    token,
    process.env.RESET_PASSWORD_TOKEN_SECRET_KEY,
    async (err, decoded) => {
      if (err) {
        if (err instanceof TokenExpiredError) {
          return res.status(400).json({
            message:
              "Password reset token is expired, Please request another one!",
          });
        }
      }
      if (!decoded) {
        return res.status(400).json({
          message:
            "Password reset token is invalid, Please request another one!",
        });
      }
      const { email } = decoded;
      req.user = { email };
      next();
    }
  );
};

module.exports = validatePasswordResetToken;
