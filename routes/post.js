const express = require("express");
const router = express.Router();

const PostContent = require("../models/post.js");

const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config.js");

const authMiddleware = require("../middleware/auth.js");
const isAdminMiddleware = require("../middleware/isAdmin.js");

router.post("/", authMiddleware, async (request, response) => {
  try {
    const newPost = new PostContent({
      user: request.user,
      content: request.body.content,
      postimage: request.body.postimage,
      likes: request.body.likes,
      unlikes: request.body.unlikes,
    });
    await newPost.save();
    response.status(200).send(newPost);
  } catch (error) {
    response.status(400).send({ message: error._message });
  }
});

router.get("/", async (request, response) => {
  try {
    response
      .status(200)
      .send(await PostContent.find().populate("user").sort({ _id: -1 }));
  } catch (error) {
    response.status(400).send({ message: error._message });
  }
});

router.get("/:id", async (request, response) => {
  try {
    console.log(request.params.id);
    const data = await PostContent.findOne({ _id: request.params.id }).populate(
      "user"
    );
    response.status(200).send(data);
  } catch (error) {
    response.status(400).send({ message: error._message });
  }
});

router.put("/:id", authMiddleware, async (request, response) => {
  try {
    const contentID = await PostContent.findById(request.params.id).populate(
      "user"
    );
    if (request.user.id === contentID.user.id) {
      const updatedContent = await PostContent.findByIdAndUpdate(
        contentID,
        request.body,
        {
          new: true,
        }
      );
      response.status(200).send(updatedContent);
    }
  } catch (error) {
    response.status(400).send({ message: error._message });
  }
});

router.delete("/:id", authMiddleware, async (request, response) => {
  try {
    const content = await PostContent.findById(request.params.id);
    if (request.user.id === content.user.toString()) {
      await PostContent.findByIdAndDelete(request.params.id);
      response.status(200).send("The post has been deleted.");
    }
  } catch (error) {
    response.status(400).send({ message: error._message });
  }
});

router.delete("/admin/:id", isAdminMiddleware, async (request, response) => {
  try {
    await PostContent.findById(request.params.id);
    await PostContent.findByIdAndDelete(request.params.id);
    response.status(200).send("The post has been deleted.");
  } catch (error) {
    response.status(400).send({ message: error._message });
  }
});

module.exports = router;
