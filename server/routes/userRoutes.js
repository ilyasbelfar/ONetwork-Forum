const express = require("express");
const userController = require("../controllers/userController");
const validateAccessToken = require("../middlewares/validateAccessToken");

const router = express.Router();

router.get("/:username", userController.getUserProfile);
router.get("/:username/comments", userController.getUserComments);
router.get("/:username/following", userController.getUserFollowing);
router.get("/:username/followers", userController.getUserFollowers);
router.put(
  "/:username/follow",
  validateAccessToken,
  userController.toggleUserFollow
);
router.put("/:username", validateAccessToken, userController.updateUserProfile);

module.exports = router;
