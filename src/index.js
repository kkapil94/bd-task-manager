const express = require("express");
const userRouter = require("../src/routers/userRouter.js");
const taskRouter = require("../src/routers/taskRouter.js");
require("dotenv").config();
require("./db/mongoose.js");

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(PORT, () => {
  console.log("app listening at: ", process.env.PORT);
});
