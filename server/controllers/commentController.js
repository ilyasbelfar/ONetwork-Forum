const Comment = require("../models/commentModel");
const Topic = require("../models/topicModel");

var repliesToDelete = [];
const nest = (comments, id) => {
  comments
    .filter((comment) => comment?.parentComment?.toString() === id?.toString())
    .map((comment) => {
      repliesToDelete?.push(comment._id);
      nest(comments, comment?._id.toString());
    });
};

module.exports = {
  getTopicComments: async (req, res) => {
    try {
      const { id: parentTopic } = req.params;
      const comments = await Comment.find({ parentTopic })
        .populate({ path: "author", select: { password: 0, __v: 0 } })
        .lean()
        .exec();
      return res.json({
        comments: comments,
        message: "Comments Retrieved!",
      });
    } catch (err) {
      console.log(err.message);
    }
  },
  addComment: async (req, res) => {
    let { id, comment, parentComment } = req.body;
    if (!id || !comment || comment?.trim()?.length === 0) {
      return res.status(400).json({
        message: "Comment field have not to be empty, Please fill it!",
      });
    }
    parentComment = parentComment || null;
    try {
      let createdComment = await Comment.create({
        owner: req.user.username,
        parentTopic: id,
        parentComment: parentComment,
        content: comment.trim(),
      });
      if (createdComment) {
        await Topic.findByIdAndUpdate(id, {
          $inc: { totalComments: 1 },
        });
      }
      createdComment = await createdComment.populate({
        path: "author",
        select: { password: 0, __v: 0 },
      });
      return res.status(201).json({
        comment: createdComment,
        message: "Comment Created Successfully!",
      });
    } catch (err) {
      console.log(err.message);
    }
  },
  deleteComment: async (req, res) => {
    let { id } = req.params;
    try {
      repliesToDelete = [];
      const rootComment = await Comment.findById(id);
      if (req.user.username !== rootComment.owner) {
        return res.status(403).json({
          message: "You are not allowed to delete this comment",
        });
      }
      const comments = await Comment.find();
      nest(comments, rootComment._id.toString());
      repliesToDelete.push(rootComment._id);
      await Comment.deleteMany({ _id: repliesToDelete });
      await Topic.findByIdAndUpdate(rootComment.parentTopic, {
        $inc: { totalComments: -repliesToDelete.length },
      });
      return res.status(200).json({
        deletedComments: repliesToDelete,
        message: "Comment Successfully Deleted!",
      });
    } catch (err) {
      console.log(err.message);
    }
  },
  toggleUpvoteComment: async (req, res) => {
    const { id } = req.params;
    try {
      const comment = await Comment.findById(id);
      if (!comment) {
        return res.status(404).json({
          message: "Comment not found!",
        });
      }
      if (comment.upvotes.includes(req.user.username)) {
        comment.upvotes.pull(req.user.username);
        await comment.save();
        return res.status(200).json({
          commentId: id,
          username: req.user.username,
          message: "Comment was upvoted successfully.",
        });
      } else {
        comment.upvotes.push(req.user.username);
        comment.downvotes.pull(req.user.username);
        await comment.save();
        return res.status(200).json({
          commentId: id,
          username: req.user.username,
          message: "Comment was upvoted successfully.",
        });
      }
    } catch (err) {
      return res.status(403).json({
        Error: err.message,
      });
    }
  },
  toggleDownvoteComment: async (req, res) => {
    const { id } = req.params;
    try {
      const comment = await Comment.findById(id);
      if (!comment) {
        return res.status(404).json({
          message: "Comment not found!",
        });
      }
      if (comment.downvotes.includes(req.user.username)) {
        comment.downvotes.pull(req.user.username);
        await comment.save();
        return res.status(200).json({
          commentId: id,
          username: req.user.username,
          message: "Comment was downvoted successfully.",
        });
      } else {
        comment.downvotes.push(req.user.username);
        comment.upvotes.pull(req.user.username);
        await comment.save();
        return res.status(200).json({
          commentId: id,
          username: req.user.username,
          message: "Comment was downvoted successfully.",
        });
      }
    } catch (err) {
      return res.status(403).json({
        Error: err.message,
      });
    }
  },
  getTopHelpers: async (req, res) => {
    try {
      let topHelpers = await Comment.aggregate([
        { $group: { _id: "$owner", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "username",
            as: "author",
            pipeline: [{ $project: { password: 0, __v: 0 } }],
          },
        },
        { $unwind: "$author" },
        { $limit: 3 },
      ]);
      return res.status(200).json(topHelpers);
    } catch (err) {
      console.log(err.message);
    }
  },
};
