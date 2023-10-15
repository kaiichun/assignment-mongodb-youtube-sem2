const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = require("./user");
const videoSchema = require("./video");

const commentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    videoId: {
      type: Schema.Types.ObjectId,
      ref: "Video",
    },
    comments: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Comment = model("Comment", commentSchema);
module.exports = Comment;
