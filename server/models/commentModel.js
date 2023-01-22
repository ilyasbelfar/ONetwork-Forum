const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    owner: String,
    content: String,
    parentTopic: {
      type: mongoose.Types.ObjectId,
      ref: "Topic",
    },
    parentComment: {
      type: mongoose.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    upvotes: [
      {
        type: String,
        ref: "User",
        default: [],
      },
    ],
    downvotes: [
      {
        type: String,
        ref: "User",
        default: [],
      },
    ],
  },
  { timestamps: true }
);

CommentSchema.virtual("author", {
  ref: "User",
  localField: "owner",
  foreignField: "username",
  justOne: true,
});

CommentSchema.set("toObject", { virtuals: true });
CommentSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Comment", CommentSchema);
