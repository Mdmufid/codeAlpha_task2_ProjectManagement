const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// GET all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    console.error('Error loading projects:', error);
    res.status(500).json({ error: 'Failed to load projects' });
  }
});

// POST new project
router.post('/', async (req, res) => {
  const { name, description } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ message: 'Project name is required' });
  }

  try {
    const newProject = new Project({ name, description });
    await newProject.save();
    res.status(201).json(newProject);
  } catch (error) {
    console.error('Error saving project:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
