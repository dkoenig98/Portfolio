const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// Laden der Strondbodbuam-Daten
router.get('/data', async (req, res) => {
    try {
        const project = await Project.findOne({ projectName: 'strondbodbuam' });
        if (project) {
            console.log('Sending data:', JSON.stringify(project.data)); // Logging für Debugging
            res.json(project.data);
        } else {
            const defaultData = { 
                profiles: {
                    dom: { counter: 0, history: [] },
                    lex: { counter: 0, history: [] }
                }, 
                selectedYear: new Date().getFullYear() 
            };
            console.log('Sending default data:', JSON.stringify(defaultData)); // Logging für Debugging
            res.json(defaultData);
        }
    } catch (error) {
        console.error('Error loading strondbodbuam data:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.post('/data', async (req, res) => {
    try {
        console.log('Received data:', JSON.stringify(req.body)); // Logging für Debugging

        const update = { 
            $set: { 
                'data.profiles': req.body.profiles,
                'data.selectedYear': req.body.selectedYear
            } 
        };
        const options = { upsert: true, new: true, setDefaultsOnInsert: true };
        const project = await Project.findOneAndUpdate(
            { projectName: 'strondbodbuam' },
            update,
            options
        );

        console.log('Updated data:', JSON.stringify(project.data)); // Logging für Debugging
        res.json(project.data);
    } catch (error) {
        console.error('Error saving strondbodbuam data:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;