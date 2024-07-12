const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

router.get('/data', async (req, res) => {
    try {
        const project = await Project.findOne({ projectName: 'reaction-game' });
        res.json(project ? project.data : {});
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/data', async (req, res) => {
    try {
        const update = { $set: { 'data': req.body } };
        const options = { upsert: true, new: true };
        const project = await Project.findOneAndUpdate(
            { projectName: 'reaction-game' },
            update,
            options
        );
        res.json(project.data);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;