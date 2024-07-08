const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// Get project data
router.get('/:projectName', async (req, res) => {
    try {
        const project = await Project.findOne({ projectName: req.params.projectName });
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json(project.data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update project data
router.post('/:projectName', async (req, res) => {
    try {
        const project = await Project.findOneAndUpdate(
            { projectName: req.params.projectName },
            { $set: { data: req.body } },
            { new: true, upsert: true }
        );
        res.json(project.data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;