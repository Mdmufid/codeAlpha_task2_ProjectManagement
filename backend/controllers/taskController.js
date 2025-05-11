const Task = require('../models/Task');
exports.createTask = async (req, res) => {
  try {
    const { title, description, project, assignedTo, status, dueDate } = req.body;
    const task = new Task({ title, description, project, assignedTo, status, dueDate });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate('project').populate('assignedTo');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

