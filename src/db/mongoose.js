const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Mongodb connected successfully");
  })
  .catch((err) => {
    console.log(err);
  });
