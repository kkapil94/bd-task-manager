const Task = require("../models/taskModel.js");
const app = require("../../src/app.js");
const request = require("supertest");
const { setUpDatabase, userId, userOne } = require("./fixtures/db.js");
const {
  userTwo,
  userTwoId,
  taskOne,
  taskTwo,
  taskThree,
} = require("./fixtures/db.js");

beforeEach(setUpDatabase);

test("should create a new task", async () => {
  const response = await request(app)
    .post("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({ description: "Watering" })
    .expect(201);
  const task = await Task.findById(response._body.data._id);
  expect(task).not.toBeNull();
});

test("task of a single user", async () => {
  const response = await request(app)
    .get("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .expect(200);
  expect(response._body.data.length).toEqual(2);
});

test("should not delete others task", async () => {
  await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .expect(404);
  const task = await Task.findById(taskOne._id);
  expect(task).not.toBeNull();
});
