const mongoose = require("mongoose");

const SpaceSchema = new mongoose.Schema(
  {
    name: String,
    avatar: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Space", SpaceSchema);
