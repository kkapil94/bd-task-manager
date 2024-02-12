const app = require("./app.js");
require("dotenv").config();
require("./db/mongoose.js");

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("app listening at: ", process.env.PORT);
});
