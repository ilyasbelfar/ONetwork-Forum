const express = require("express");
const commentController = require("../controllers/commentController");
const validateAccessToken = require("../middlewares/validateAccessToken");

const router = express.Router();

router.post("/", validateAccessToken, commentController.addComment);
router.get("/helpers", commentController.getTopHelpers);
router.get("/:id", commentController.getTopicComments);
router.post(
  "/:id/upvote",
  validateAccessToken,
  commentController.toggleUpvoteComment
);
router.post(
  "/:id/downvote",
  validateAccessToken,
  commentController.toggleDownvoteComment
);
router.delete("/:id", validateAccessToken, commentController.deleteComment);

module.exports = router;
