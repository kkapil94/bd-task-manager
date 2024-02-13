const request = require("supertest");
const app = require("../../src/app.js");
const User = require("../models/userModel.js");
const { setUpDatabase, userId, userOne } = require("./fixtures/db.js");

beforeEach(setUpDatabase);

test("should signup a user", async () => {
  const response = await request(app)
    .post("/users")
    .send({
      name: "done",
      email: "done@gmail.com",
      password: "123456789",
    })
    .expect(201);
  const user = await User.findById(response._body.data._id);
  expect(user).not.toBeNull();
  expect(response._body).toMatchObject({
    data: {
      name: "done",
      email: "done@gmail.com",
    },
    token: user.tokens[0].token,
  });
});

test("should login a user", async () => {
  const response = await request(app)
    .post("/users/login")
    .send({
      email: "test@gamil.com",
      password: "123456789",
    })
    .expect(200);
  const user = await User.findById(userOne._id);
  expect(response._body.token).toBe(user.tokens[1].token);
});

test("should not login a non-existing user", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: "test@gamil.com",
      password: "1234567890",
    })
    .expect(400);
});

test("should pass the auth", async () => {
  await request(app)
    .post("/users/logout")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("should not pass the un-auth", async () => {
  await request(app).post("/users/logout").send().expect(401);
});

test("should delete the user", async () => {
  const response = await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
  const user = await User.findById(response._body.data._id);
  expect(user).toBeNull();
});

test("should upload the avatar", async () => {
  const response = await request(app)
    .post("/users/me/avatar")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .attach("avatar", "/fixtures/sign.jpg")
    .expect(200);
});
