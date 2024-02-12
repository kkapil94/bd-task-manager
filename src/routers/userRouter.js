const { Router } = require("express");
const User = require("../models/userModel.js");
const auth = require("../middlewares/auth.js");
const multer = require("../middlewares/multer.js");
const sharp = require("sharp");
const router = new Router();

router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).json({ success: true, data: user, token });
  } catch (error) {
    res.status(404).json({ success: false, data: [] });
  }
});

router.get("/users", auth, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, data: [] });
  }
});

router.get("/users/me", auth, async (req, res) => {
  try {
    res.status(200).json({ success: true, data: req.user });
  } catch (error) {
    res.status(500).json({ success: false, data: [] });
  }
});

router.get("/users/:id", auth, async (req, res) => {
  try {
    const userID = req.params.id;
    const user = await User.findById(userID);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, data: [] });
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    res.status(200).json({ success: true, user, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, data: [] });
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowed = ["name", "email", "password", "age"];
  const isValidOperation = updates.every((update) => allowed.includes(update));
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }
  try {
    const user = req.user;
    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, data: [] });
  }
});

router.post(
  "/users/me/avatar",
  auth,
  multer,
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send("good");
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.delete(
  "/users/me/avatar",
  auth,
  async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send("good");
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) {
      throw new Error("User avatr is not ther");
    }
    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (error) {
    res.status(400).send();
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.deleteOne();
    res.status(200).json({ success: true, data: req.user });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});

module.exports = router;
