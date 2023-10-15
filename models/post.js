const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = require("./user");

const postSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
      required: true,
    },
    postimage: {
      type: String,
    },
    likes: {
      type: [String],
      default: [],
    },
    unlikes: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const PostContent = model("Post", postSchema);
module.exports = PostContent;
