const add = require("./math.js");

test("async test", async () => {
  const sum = await add(3, 5);
  expect(sum).toBe(8);
});
