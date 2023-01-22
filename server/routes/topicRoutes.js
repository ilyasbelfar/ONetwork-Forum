const express = require("express");
const topicController = require("../controllers/topicController");
const validateAccessToken = require("../middlewares/validateAccessToken");

const router = express.Router();

router.get("/", topicController.getAllTopics);
router.get("/spaces", topicController.getSpaces);
router.get("/contributors", topicController.getTopContributors);
router.get("/:id/:slug", topicController.getTopic);
router.post("/", validateAccessToken, topicController.addTopic);
router.post(
  "/:id/upvote",
  validateAccessToken,
  topicController.toggleUpvoteTopic
);
router.post(
  "/:id/downvote",
  validateAccessToken,
  topicController.toggleDownvoteTopic
);
router.delete("/:id", validateAccessToken, topicController.deleteTopic);

module.exports = router;
