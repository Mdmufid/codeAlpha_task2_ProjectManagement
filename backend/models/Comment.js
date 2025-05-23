const mongoose = require('mongoose');
const CommentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model('Comment', CommentSchema);