const mongoose = require("mongoose");

const AutoIncrement = require("mongoose-sequence")(mongoose);

const TopicSchema = new mongoose.Schema(
  {
    owner: String,
    title: String,
    content: String,
    slug: String,
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
    viewsCount: {
      type: Number,
      default: 0,
    },
    totalComments: {
      type: Number,
      default: 0,
    },
    tags: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Tag",
        default: [],
      },
    ],
  },
  { timestamps: true }
);

TopicSchema.plugin(AutoIncrement, { inc_field: "TopicID" });

TopicSchema.virtual("author", {
  ref: "User",
  localField: "owner",
  foreignField: "username",
  justOne: true,
});

TopicSchema.set("toObject", { virtuals: true });
TopicSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Topic", TopicSchema);
