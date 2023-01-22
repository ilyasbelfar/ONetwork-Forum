const mongoose = require("mongoose");

const TagSchema = new mongoose.Schema(
  {
    name: String,
    createdBy: String,
  },
  { timestamps: true }
);

TagSchema.virtual("author", {
  ref: "User",
  localField: "createdBy",
  foreignField: "username",
  justOne: true,
});

module.exports = mongoose.model("Tag", TagSchema);
