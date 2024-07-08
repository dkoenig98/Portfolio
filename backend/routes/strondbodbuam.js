const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// Laden der Strondbodbuam-Daten
router.get('/data', async (req, res) => {
    try {
        const project = await Project.findOne({ projectName: 'strondbodbuam' });
        if (project) {
            res.json(project.data);
        } else {
            res.json({ profiles: {}, selectedYear: new Date().getFullYear() });
        }
    } catch (error) {
        console.error('Error loading strondbodbuam data:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Speichern der Strondbodbuam-Daten
router.post('/data', async (req, res) => {
    try {
        const update = { data: req.body };
        const options = { upsert: true, new: true, setDefaultsOnInsert: true };
        const project = await Project.findOneAndUpdate(
            { projectName: 'strondbodbuam' },
            update,
            options
        );
        res.json(project.data);
    } catch (error) {
        console.error('Error saving strondbodbuam data:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;