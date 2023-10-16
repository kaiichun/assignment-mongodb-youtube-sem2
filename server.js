const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const { MONGODB_URL } = require("./config.js");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const port = 1205;

const corsHandler = cors({
  origin: "*",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
  preflightContinue: true,
});

app.use(corsHandler);

mongoose
  .connect(MONGODB_URL + "youtubeDB")
  .then(() => console.log("Youtube MongoDB is Connected... "))
  .catch((error) => console.log(error));

const authRouter = require("./routes/auth.js");
const userRouter = require("./routes/users.js");
const videoRouter = require("./routes/videos.js");
const commentRouter = require("./routes/comments.js");
const postRouter = require("./routes/post.js");

const uploadVideoRouter = require("./routes/video.js");
const uploadThumbnailRouter = require("./routes/thumbnail.js");
const uploadImageRouter = require("./routes/image.js");
const uploadPostImageRouter = require("./routes/postimage.js");

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);
app.use("/comments", commentRouter);
app.use("/posts", postRouter);
app.use("/uploadvideo", uploadVideoRouter);
app.use("/uploadthumbnail", uploadThumbnailRouter);
app.use("/uploadimage", uploadImageRouter);
app.use("/uploadpostimage", uploadPostImageRouter);
app.use("/video", express.static("video"));
app.use("/thumbnails", express.static("thumbnails"));
app.use("/image", express.static("image"));
app.use("/postimage", express.static("postimage"));

app.get("/", (request, response) => {
  response.send("Home");
});

app.listen(port, () => console.log(`Youtube Server started on port ${port}`));
