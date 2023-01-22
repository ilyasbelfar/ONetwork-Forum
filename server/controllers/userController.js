const bcrypt = require("bcrypt");
const { cloudinary } = require("../utils/cloudinary");
const fs = require("fs-extra");
const User = require("../models/userModel");
const Comment = require("../models/commentModel");
const Topic = require("../models/topicModel");
const Tag = require("../models/tagModel");

module.exports = {
  getUserProfile: async (req, res) => {
    const { username } = req.params;
    try {
      const user = await User.findOne({ username }, { __v: 0, password: 0 });
      return res.status(200).json(user);
    } catch (err) {
      console.log(err.message);
    }
  },
  getUserComments: async (req, res) => {
    const { username } = req.params;
    try {
      const comments = await Comment.find({ owner: username })
        .populate({ path: "author", select: { password: 0, __v: 0 } })
        .populate("parentTopic")
        .lean()
        .exec();
      return res.status(200).json(comments);
    } catch (err) {
      console.log(err.message);
    }
  },
  getUserFollowing: async (req, res) => {
    const { username } = req.params;
    try {
      const user = await User.findOne({ username })
        .populate({ path: "user_following", select: { password: 0, __v: 0 } })
        .lean()
        .exec();
      return res.status(200).json(user.user_following);
    } catch (err) {
      console.log(err.message);
    }
  },
  getUserFollowers: async (req, res) => {
    const { username } = req.params;
    try {
      const user = await User.findOne({ username })
        .populate({ path: "user_followers", select: { password: 0, __v: 0 } })
        .lean()
        .exec();
      return res.status(200).json(user.user_followers);
    } catch (err) {
      console.log(err.message);
    }
  },
  toggleUserFollow: async (req, res) => {
    const { username: usernameToToggleFollow } = req.params;
    const { username: usernameLoggedIn } = req.user;
    if (usernameToToggleFollow === usernameLoggedIn) {
      return res.status(422).json({
        message: "You can't follow yourself!",
      });
    }
    try {
      const currentUser = await User.findOne({ username: usernameLoggedIn });
      const userToToggleFollow = await User.findOne({
        username: usernameToToggleFollow,
      });
      if (!currentUser || !userToToggleFollow) {
        return res.status(404).json({
          message: "User not found!",
        });
      }
      if (currentUser.following.includes(usernameToToggleFollow)) {
        currentUser.following.pull(usernameToToggleFollow);
        await currentUser.save();
        userToToggleFollow.followers.pull(usernameLoggedIn);
        await userToToggleFollow.save();
        return res.status(200).json(currentUser);
      } else {
        currentUser.following.push(usernameToToggleFollow);
        await currentUser.save();
        userToToggleFollow.followers.push(usernameLoggedIn);
        await userToToggleFollow.save();
        return res.status(200).json(currentUser);
      }
    } catch (err) {
      console.log(err.message);
    }
  },
  updateUserProfile: async (req, res) => {
    const { username } = req.params;
    if (username !== req.user.username) {
      return res.json({
        message: "Unauthorized!",
      });
    }
    try {
      var user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({
          message: "User not found!",
        });
      }
      if (req.body.userName.trim() !== "") {
        let existingUser = null;
        existingUser = await User.findOne({ username: req.body.userName });
        if (existingUser) {
          delete user;
          return res.status(422).json({
            message: "A user with this username already exist!",
          });
        }
      }
      if (req.body.email.trim() !== "") {
        let existingUser = null;
        existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
          delete user;
          return res.status(422).json({
            message: "A user with this email already exist!",
          });
        }
      }
      user.firstName =
        req.body.firstname.trim() === ""
          ? user.firstName
          : req.body.firstname.trim();

      user.lastName =
        req.body.lastname.trim() === ""
          ? user.lastName
          : req.body.lastname.trim();

      user.email =
        req.body.email.trim() === "" ? user.email : req.body.email.trim();

      var oldUsername = user.username;

      user.username =
        req.body.userName.trim() === ""
          ? user.username
          : req.body.userName.trim();

      user.bio = req.body.bio.trim() === "" ? user.bio : req.body.bio.trim();

      if (
        req.body.password.trim() !== "" &&
        req.body.newPassword.trim() !== "" &&
        req.body.confirmNewPassword.trim() !== "" &&
        req.body.newPassword.trim() === req.body.confirmNewPassword.trim()
      ) {
        const passwordValid = await bcrypt.compare(
          req.body.password.trim(),
          user.password
        );
        if (!passwordValid) {
          delete user;
          return res.status(400).json({
            message: "Current Password Invalid!",
          });
        }
        const hashedPassword = await bcrypt.hash(
          req.body.newPassword.trim(),
          10
        );
        user.password = hashedPassword;
      }

      if (req?.files && Object.keys(req?.files)?.length > 0) {
        if (req?.files?.avatar) {
          if (req?.files?.avatar?.size > 2 * 1024 * 1024) {
            await fs.unlink(req?.files?.avatar?.tempFilePath);
            return res?.status(400).json({
              message:
                "Avatar image size is too big, Avatar images can't be larger than 2MB in file size",
            });
          }
          if (
            req.files.avatar.mimetype !== "image/jpeg" &&
            req.files.avatar.mimetype !== "image/png"
          ) {
            await fs.unlink(req?.files?.avatar?.tempFilePath);
            return res.status(400).json({
              message:
                "Invalid avatar image format, only JPEG, JPG, PNG are accepted",
            });
          }
          const d = new Date();
          let fileName =
            user.username +
            "_" +
            "avatar" +
            "_" +
            d.toISOString().split("T")[0].replace(/-/g, "") +
            "_" +
            d.toTimeString().split(" ")[0].replace(/:/g, "");
          if (user?.avatar?.public_id) {
            await cloudinary.uploader.destroy(user.avatar.public_id);
          }
          const result = await cloudinary.uploader.upload(
            req.files.avatar.tempFilePath,
            {
              resource_type: "auto",
              public_id: fileName,
              folder: "avatars",
              width: 400,
              height: 400,
              crop: "fill",
            }
          );
          if (result) {
            await fs.unlink(req.files.avatar.tempFilePath);
            user.avatar.public_id = result.public_id;
            user.avatar.url = result.secure_url;
          }
        }
        if (req?.files?.cover) {
          if (req?.files?.cover?.size > 1024 * 1024 * 3) {
            await fs.unlink(req?.files?.cover?.tempFilePath);
            return res.status(400).json({
              message:
                "Cover image size is too big, Cover images can't be larger than 3MB in file size!",
            });
          }
          if (
            req.files.cover.mimetype !== "image/jpeg" &&
            req.files.cover.mimetype !== "image/png"
          ) {
            await fs.unlink(req?.files?.cover?.tempFilePath);
            return res.status(400).json({
              message:
                "Invalid cover image format, only JPEG, JPG, PNG are accepted",
            });
          }
          const d = new Date();
          let fileName =
            user.username +
            "_" +
            "cover" +
            "_" +
            d.toISOString().split("T")[0].replace(/-/g, "") +
            "_" +
            d.toTimeString().split(" ")[0].replace(/:/g, "");
          if (user.cover.public_id) {
            await cloudinary.uploader.destroy(user.cover.public_id);
          }
          const result = await cloudinary.uploader.upload(
            req.files.cover.tempFilePath,
            {
              resource_type: "auto",
              public_id: fileName,
              folder: "covers",
              width: 1920,
              height: 620,
              crop: "fill",
            }
          );
          if (result) {
            await fs.unlink(req.files.cover.tempFilePath);
            user.cover.public_id = result.public_id;
            user.cover.url = result.secure_url;
          }
        }
      }

      const savedUser = await user.save();
      if (req.body.userName.trim() !== "") {
        await Topic.updateMany(
          { owner: oldUsername },
          { $set: { owner: savedUser.username } }
        );
        await Comment.updateMany(
          { owner: oldUsername },
          { $set: { owner: savedUser.username } }
        );
      }
      delete oldUsername;
      delete user;
      return res.status(200).json({
        updatedUser: savedUser,
        message: "User profile has been updated successfully!",
      });
    } catch (err) {
      console.log(err.message);
    }
  },
};
