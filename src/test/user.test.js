const request = require("supertest");
const app = require("../../src/app.js");
const User = require("../models/userModel.js");

beforeEach(async () => {
  await User.deleteMany();
});

test("should signup a user", async () => {
  await request(app)
    .post("/users")
    .send({
      name: "KApil",
      email: "test@gamil.com",
      password: "123456789",
    })
    .expect(201);
});
