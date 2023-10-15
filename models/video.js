const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = require("./user");

const videoSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    video: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: [String],
      default: [],
    },
    unlikes: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["Draft", "Publish"],
      default: "Draft",
    },
  },
  { timestamps: true }
);

const Video = model("Video", videoSchema);
module.exports = Video;
