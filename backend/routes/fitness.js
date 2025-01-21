const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// Grunddaten laden
router.get('/data', async (req, res) => {
    try {
        const project = await Project.findOne({ projectName: 'fitness' });
        res.json(project ? project.data : {});
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Workout abschließen / Fortschritt speichern
router.post('/progress', async (req, res) => {
    try {
        const { date, workout, completed } = req.body;
        
        // Finde und update das Projekt mit den neuen Daten
        const result = await Project.findOneAndUpdate(
            { projectName: 'fitness' },
            {
                $push: {
                    'data.workoutHistory': {
                        date,
                        workout,
                        completed,
                        timestamp: new Date()
                    }
                }
            },
            { new: true }
        );

        // Update Muskelgruppen-Statistiken
        if (completed && completed.length > 0) {
            const updateOperations = {};
            completed.forEach(exercise => {
                if (exercise.completed && exercise.muscleGroups) {
                    exercise.muscleGroups.forEach(group => {
                        const key = `data.muscleGroupStats.${group}`;
                        updateOperations[key] = 1;
                    });
                }
            });

            if (Object.keys(updateOperations).length > 0) {
                await Project.findOneAndUpdate(
                    { projectName: 'fitness' },
                    { $inc: updateOperations }
                );
            }
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Error saving progress:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Workout-Historie abrufen
router.get('/progress/history', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const project = await Project.findOne({ projectName: 'fitness' });
        
        let history = project.data.workoutHistory || [];
        
        if (startDate && endDate) {
            history = history.filter(entry => {
                const entryDate = new Date(entry.date);
                return entryDate >= new Date(startDate) && entryDate <= new Date(endDate);
            });
        }
        
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: 'Error loading workout history' });
    }
});

// Deadhang Stats speichern
router.post('/deadhang', async (req, res) => {
    try {
        const { time, date } = req.body;
        
        const result = await Project.findOneAndUpdate(
            { projectName: 'fitness' },
            {
                $push: { 'data.deadhangStats': { time, date } },
                $max: { 'data.deadhangStats.bestTime': time }
            },
            { new: true }
        );

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: 'Error saving deadhang stats' });
    }
});

// Deadhang Stats abrufen
router.get('/deadhang', async (req, res) => {
    try {
        const project = await Project.findOne({ projectName: 'fitness' });
        res.json(project.data.deadhangStats || { times: [], bestTime: 0 });
    } catch (error) {
        res.status(500).json({ message: 'Error loading deadhang stats' });
    }
});

// Settings speichern
router.post('/settings', async (req, res) => {
    try {
        const settings = req.body;
        
        const result = await Project.findOneAndUpdate(
            { projectName: 'fitness' },
            { 'data.settings': settings },
            { new: true }
        );

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: 'Error saving settings' });
    }
});

// Settings abrufen
router.get('/settings', async (req, res) => {
    try {
        const project = await Project.findOne({ projectName: 'fitness' });
        res.json(project.data.settings || {});
    } catch (error) {
        res.status(500).json({ message: 'Error loading settings' });
    }
});

module.exports = router;