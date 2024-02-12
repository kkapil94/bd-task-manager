const express = require("express");
const User = require("../src/models/userModel.js");
const Task = require("../src/models/taskModel.js");
const userRouter = require("../src/routers/userRouter.js");
const taskRouter = require("../src/routers/taskRouter.js");
const auth = require("./middlewares/auth.js");
require("./db/mongoose.js");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(PORT, () => {
  console.log("app listening at: ", 3000);
});
