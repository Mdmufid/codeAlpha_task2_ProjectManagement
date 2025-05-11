const mongoose = require('mongoose');
const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model('Project', ProjectSchema);
