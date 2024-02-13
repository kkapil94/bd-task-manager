const mongoose = require("mongoose");

//connect to database
mongoose
  .connect(process.env.TEST_MONGO_URL)
  .then(() => {
    console.log("Mongodb connected successfully");
  })
  .catch((err) => {
    console.log(err);
  });
