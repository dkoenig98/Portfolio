const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

router.get('/data/:mode', async (req, res) => {
    try {
        const project = await Project.findOne({ projectName: 'reaction-game' });
        if (project) {
            const gameData = project.getReactionGameData();
            const mode = req.params.mode;
            res.json(gameData[`${mode}Highscores`] || []);
        } else {
            res.json([]);
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/data/:mode', async (req, res) => {
    try {
        const mode = req.params.mode;
        const project = await Project.findOne({ projectName: 'reaction-game' });
        
        if (!project) {
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

        await project.save();
        
        res.json(project.data[`${mode}Highscores`]);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;