const express = require("express");
const router = express.Router();

const User = require("../models/user.js");
const Video = require("../models/video.js");

const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

const authMiddleware = require("../middleware/auth");
const isAdminMiddleware = require("../middleware/isAdmin");

router.post("/", authMiddleware, async (request, response) => {
  try {
    const newVideo = new Video({
      user: request.user,
      title: request.body.title,
      description: request.body.description,
      video: request.body.video,
      thumbnail: request.body.thumbnail,
      views: request.body.views,
      likes: request.body.likes,
      unlikes: request.body.unlikes,
      status: request.body.status,
    });
    await newVideo.save();
    response.status(200).send(newVideo);
  } catch (error) {
    response.status(400).send({ message: error._message });
  }
});

router.get("/", async (request, response) => {
  try {
    const { keyword } = request.query;
    let filter = {};
    if (keyword) {
      filter.title = { $regex: keyword, $options: "i" };
    }
    response
      .status(200)
      .send(await Video.find(filter).populate("user").sort({ _id: -1 }));
  } catch (error) {
    response.status(400).send({ message: error._message });
  }
});

router.get("/studio", authMiddleware, async (request, response) => {
  try {
    let filter = {};
    if (request.user && request.user.role === "user") {
      filter.user = request.user._id;
    }
    response
      .status(200)
      .send(await Video.find(filter).populate("user").sort({ _id: -1 }));
  } catch (error) {
    response.status(400).send({ message: error._message });
  }
});

router.get("/:id", async (request, response) => {
  try {
    const data = await Video.findOne({ _id: request.params.id }).populate(
      "user"
    );
    response.status(200).send(data);
  } catch (error) {
    response.status(400).send({ message: error._message });
  }
});

router.put("/:id", authMiddleware, async (request, response) => {
  try {
    const videoID = await Video.findById(request.params.id).populate("user");
    if (request.user.id === videoID.user.id) {
      const updatedVideo = await Video.findByIdAndUpdate(
        videoID,
        request.body,
        {
          new: true,
        }
      );
      response.status(200).send(updatedVideo);
    }
  } catch (error) {
    response.status(400).send({ message: error._message });
  }
});

router.delete("/:id", authMiddleware, async (request, response) => {
  try {
    const videoID = request.params.id;

    const video = await Video.findById(videoID).populate("user");
    if (request.user.id === video.user._id.toString()) {
      await Video.findByIdAndDelete(videoID);
    }
    response.status(200).send(video);
  } catch (error) {
    response.status(400).send({ message: error._message });
  }
});

router.delete("/admin/:id", isAdminMiddleware, async (request, response) => {
  try {
    const videoID = request.params.id;
    const video = await Video.findById(videoID).populate("user");
    await Video.findByIdAndDelete(videoID);
    response.status(200).send(video);
  } catch (error) {
    response.status(400).send({ message: error._message });
  }
});

router.put("/view/:id", async (request, response) => {
  try {
    await Video.findByIdAndUpdate(request.params.id, {
      $inc: { views: 1 },
    });
    response.status(200).send("The view has been increased.");
  } catch (error) {
    response.status(400).send({ message: error._message });
  }
});

router.get("/channels", async (request, response) => {
  try {
    response
      .status(200)
      .send(await Video.find().populate("user").sort({ _id: -1 }));
  } catch (error) {
    response.status(400).send({ message: error._message });
  }
});

module.exports = router;
