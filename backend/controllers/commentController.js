const Comment = require('../models/Comment');
exports.addComment = async (req, res) => {
  try {
    const { content, task, user } = req.body;
    const comment = new Comment({ content, task, user });
    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ task: req.params.taskId }).populate('user');
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

