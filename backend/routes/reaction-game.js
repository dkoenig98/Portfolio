const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

router.post('/data/:mode', async (req, res) => {
    try {
        console.log('Received POST request for mode:', req.params.mode);
        console.log('Request body:', req.body);

        const mode = req.params.mode;
        let project = await Project.findOne({ projectName: 'reaction-game' });
        
        if (!project) {
            console.log('Project not found, creating new one');
            project = new Project({
                projectName: 'reaction-game',
                data: {
                    classicHighscores: [],
                    timedHighscores: [],
                    colorHighscores: []
                }
            });
        }

        const highscores = project.data[`${mode}Highscores`] || [];
        highscores.push(req.body);
        highscores.sort((a, b) => a.score - b.score);
        project.data[`${mode}Highscores`] = highscores.slice(0, 10); // Keep top 10

        console.log('Updated highscores:', project.data[`${mode}Highscores`]);

        await project.save();
        console.log('Project saved successfully');
        
        res.json(project.data[`${mode}Highscores`]);
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.get('/data/:mode', async (req, res) => {
    try {
        console.log('Received GET request for mode:', req.params.mode);
        const mode = req.params.mode;
        const project = await Project.findOne({ projectName: 'reaction-game' });
        
        if (!project || !project.data || !project.data[`${mode}Highscores`]) {
            console.log('No data found, returning empty array');
            return res.json([]);
        }
        
        console.log('Sending highscores:', project.data[`${mode}Highscores`]);
        res.json(project.data[`${mode}Highscores`]);
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;