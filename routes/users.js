const express = require("express");
const router = express.Router();
// const axios = require("axios");

const Video = require("../models/video.js");
const User = require("../models/user.js");
const PostContent = require("../models/post.js");

const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const authMiddleware = require("../middleware/auth");
const isAdminMiddleware = require("../middleware/isAdmin");

router.get("/:id", async (request, response) => {
  try {
    const user = await User.findById(request.params.id);
    response.status(200).send(user);
  } catch (error) {
    response.status(400).send({ message: error._message });
  }
});

router.get("/", async (request, response) => {
  try {
    response.status(200).send(await User.find().sort({ _id: -1 }));
  } catch (error) {
    response.status(400).send({ message: error._message });
  }
});

router.put("/subscribe/:id", authMiddleware, async (request, response) => {
  try {
    const currentUser = await User.findById(request.user.id);
    console.log(currentUser);
    const index = currentUser.subscribedUsers.indexOf(request.params.id);
    if (index === -1) {
      const subscribedUser = await User.findById(request.params.id);
      subscribedUser.subscribers += 1;
      subscribedUser.subscribedUsers.push(currentUser._id);
      await Promise.all([subscribedUser.save(), currentUser.save()]);
    }
    response.status(200).send("Subscription successful.");
  } catch (error) {
    response.status(400).send({ message: error._message });
  }
});

router.put("/unsubscribe/:id", authMiddleware, async (request, response) => {
  try {
    const currentUser = await User.findById(request.user.id);
    const unsubscribedUser = await User.findById(request.params.id);
    if (!currentUser || !unsubscribedUser) {
      return response.status(400).send({ message: "User not found" });
    }
    unsubscribedUser.subscribedUsers = unsubscribedUser.subscribedUsers.filter(
      (user) => user.toString() !== request.user.id
    );
    if (unsubscribedUser.subscribers > 0) {
      unsubscribedUser.subscribers -= 1;
    }
    await unsubscribedUser.save();
    response.status(200).send("Unsubscription successful.");
  } catch (error) {
    response.status(400).send({ message: error._message });
  }
});

router.put("/likeVideo/:videoId", authMiddleware, async (request, response) => {
  const user = request.user.id;
  const videoId = request.params.videoId;
  try {
    const video = await Video.findById(videoId);
    if (!video.likes.includes(user)) {
      video.likes.push(user);
      const index = video.unlikes.indexOf(user);
      if (index !== -1) {
        video.unlikes.splice(index, 1);
      }
      await video.save();
      response.status(200).send("Like");
    } else {
      response.status(200).send("Already Like");
    }
  } catch (error) {
    response.status(400).send({ message: error.message });
  }
});

router.put(
  "/unlikeVideo/:videoId",
  authMiddleware,
  async (request, response) => {
    const user = request.user.id;
    const videoId = request.params.videoId;
    try {
      const video = await Video.findById(videoId);

      if (!video.unlikes.includes(user)) {
        video.unlikes.push(user);
        const index = video.likes.indexOf(user);
        if (index !== -1) {
          video.likes.splice(index, 1);
        }
        await video.save();
        response.status(200).send("Unlike");
      } else {
        response.status(200).send("Already Unlike");
      }
    } catch (error) {
      response.status(400).send({ message: error.message });
    }
  }
);

router.put("/:id", authMiddleware, async (request, response) => {
  if (request.params.id === request.user.id) {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        request.params.id,
        {
          $set: request.body,
        },
        { new: true }
      );
      response.status(200).send(updatedUser);
    } catch (error) {
      response.status(400).send({ message: error.message });
    }
  }
});

module.exports = router;
