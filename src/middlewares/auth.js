const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, "thisismynewcourse");
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });
    if (!user) throw new Error("User not found");
    req.user = user;
    req.token = token;
    next();
  } catch (e) {
    res.status(401).json({ success: false, data: "Please authenticate!" });
  }
};

module.exports = auth;