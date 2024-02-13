const { Router } = require("express");
const Task = require("../models/taskModel.js");
const auth = require("../middlewares/auth.js");

const router = Router();

router.post("/tasks", auth, async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      owner: req.user._id,
    });
    await task.save();
    res.status(201).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, data: [] });
  }
});

router.get("/tasks", auth, async (req, res) => {
  const match = {};
  const sort = {};
  const { completed, limit, skip, sortBy } = req.query;
  if (completed) {
    match.completed = req.query.completed === "true";
  }

  if (sortBy) {
    const parts = sortBy.split(":");
    sort[parts[0]] = parts[1] === desc ? -1 : 1;
  }
  try {
    const tasks = await Task.find(
      { owner: req.user._id, ...match },
      {},
      {
        limit: parseInt(limit),
        skip: parseInt(skip),
        sort: {
          createdAt: -1,
        },
      }
    );
    if (!tasks) {
      return res.status(404).json({ success: false, data: [] });
    }
    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, data: [] });
  }
});

router.get("/tasks/:id", auth, async (req, res) => {
  try {
    const taskID = req.params.id;
    const task = await Task.findOne({ taskID, owner: req.user._id });
    if (!task) {
      return res.status(404).json({ success: false, data: [] });
    }
    res.status(200).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, data: [] });
  }
});

router.patch("/tasks/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowed = ["description", "completed"];
  const isValidOperation = updates.every((update) => allowed.includes(update));
  if (!isValidOperation) {
    return res.status(400).json({ error: "Invalid updates!" });
  }
  try {
    const taskID = req.params.id;
    const task = await Task.findOne({ _id: taskID, owner: req.user._id });
    if (!task) {
      return res.status(404).json({ success: false, data: [] });
    }
    updates.forEach((update) => (task[update] = req.body[update]));
    await task.save();
    res.status(200).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, data: [] });
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).json({ success: false, task: null });
    }
    const task = await Task.findOneAndDelete({ _id: id, owner: req.user._id });
    if (!task) {
      return res.status(404).json({ success: false, task: null });
    }
    res.status(200).json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, task: null });
  }
});
module.exports = router;
