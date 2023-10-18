const express = require("express");
const router = express.Router();
const multer = require("multer");

// setup storage
const storage = multer.diskStorage({
  destination: function (request, file, cb) {
    cb(null, "video/");
  },
  filename: function (request, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/", upload.single("video"), async (request, response) => {
  try {
    const video_url = request.file.path;
    response.status(200).send({ video_url: video_url });
  } catch (error) {
    response.status(400).send({ message: error._message });
  }
});

module.exports = router;
