const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const { JWT_SECRET } = require("../config");

router.post("/register", async (request, response) => {
  try {
    const name = request.body.name;
    const email = request.body.email;
    const password = bcrypt.hashSync(request.body.password, 10);
    const emailExists = await User.findOne({ email: email });
    if (emailExists) {
      return response.status(400).send({ message: "Email already exists" });
    }
    const user = new User({
      name: name,
      email: email,
      password: password,
    });
    const newUser = await user.save();
    const token = jwt.sign({ _id: newUser._id }, JWT_SECRET);
    response.status(200).send({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      token: token,
    });
  } catch (error) {
    response.status(400).send({ message: error._message });
  }
});

router.post("/login", async (request, response) => {
  try {
    const email = request.body.email;
    const password = request.body.password;
    const user = await User.findOne({ email: email });
    if (!user) {
      return response
        .status(400)
        .send({ message: "Invalid email or password" });
    }
    const isPasswordCorrect = bcrypt.compareSync(password, user.password);
    if (!isPasswordCorrect) {
      return response
        .status(400)
        .send({ message: "Invalid email or password" });
    }
    const token = jwt.sign({ _id: user._id }, JWT_SECRET);
    response.status(200).send({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.image,
      token: token,
    });
  } catch (error) {
    response.status(400).send({ message: error._message });
  }
});

module.exports = router;
