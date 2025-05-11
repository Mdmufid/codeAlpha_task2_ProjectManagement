const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const commentRoutes = require('./routes/commentRoutes');

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/projectdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/comments', commentRoutes);

app.listen(5000, () => console.log('Server running on port 5000'));
