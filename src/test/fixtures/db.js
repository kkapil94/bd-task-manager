const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../../models/userModel.js");
const Task = require("../../models/taskModel.js");

const userId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userId,
  name: "Kapil",
  email: "test@gamil.com",
  password: "123456789",
  tokens: [{ token: jwt.sign({ _id: userId }, process.env.JWT_SECRET) }],
};

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
  _id: userTwoId,
  name: "new",
  email: "123@gamil.com",
  password: "123456789",
  tokens: [{ token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET) }],
};

const taskOne = {
  _id: new mongoose.Types.ObjectId(),
  description: "nothing",
  owner: userId,
};
const taskTwo = {
  _id: new mongoose.Types.ObjectId(),
  description: "something",
  owner: userId,
};
const taskThree = {
  _id: new mongoose.Types.ObjectId(),
  description: "anything",
  owner: userTwoId,
};

const setUpDatabase = async () => {
  await User.deleteMany();
  await Task.deleteMany();
  await new User(userOne).save();
  await new User(userTwo).save();
  await new Task(taskOne).save();
  await new Task(taskTwo).save();
  await new Task(taskThree).save();
};

module.exports = {
  userId,
  userOne,
  userTwo,
  userTwoId,
  taskOne,
  taskThree,
  taskTwo,
  setUpDatabase,
};
