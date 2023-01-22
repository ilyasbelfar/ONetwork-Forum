const express = require("express");
const authController = require("../controllers/authController");
const validateAccessToken = require("../middlewares/validateAccessToken");
const validateEmailVerifyToken = require("../middlewares/validateEmailVerifyToken");
const validatePasswordResetToken = require("../middlewares/validatePasswordResetToken");

const router = express.Router();

router.get("/refresh_token", authController.refresh_token);
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", validateAccessToken, authController.logout);
router.post("/send-email-verification", authController.sendEmailVerification);
router.post(
  "/verify-email",
  validateEmailVerifyToken,
  authController.emailVerify
);
router.post("/forgot-password", authController.sendForgotPassword);
router.post(
  "/reset-password",
  validatePasswordResetToken,
  authController.resetPassword
);

module.exports = router;
