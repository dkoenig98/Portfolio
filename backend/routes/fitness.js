const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// Lade Übungen und Grunddaten
router.get('/data', async (req, res) => {
    try {
        const project = await Project.findOne({ projectName: 'fitness' });
        res.json(project ? project.data : {});
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Speichere ein abgeschlossenes Workout
router.post('/workout/complete', async (req, res) => {
    try {
        const { date, workout, completed } = req.body;
        const project = await Project.findOne({ projectName: 'fitness' });
        
        if (!project.data.workoutHistory) {
            project.data.workoutHistory = [];
        }
        
        project.data.workoutHistory.push({
            date,
            workout,
            completed,
            timestamp: new Date()
        });
        
        await project.save();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: 'Error saving workout progress' });
    }
});

// Hole Workout-Historie für die Woche
router.get('/workout/history', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const project = await Project.findOne({ projectName: 'fitness' });
        
        const history = project.data.workoutHistory || [];
        const filteredHistory = history.filter(entry => {
            const entryDate = new Date(entry.date);
            return entryDate >= new Date(startDate) && entryDate <= new Date(endDate);
        });
        
        res.json(filteredHistory);
    } catch (error) {
        res.status(500).json({ message: 'Error loading workout history' });
    }
});

// Settings speichern
router.post('/settings', async (req, res) => {
    try {
        const settings = req.body;
        const project = await Project.findOne({ projectName: 'fitness' });
        
        project.data.settings = settings;
        await project.save();
        
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

// Workout-Fortschritt speichern
router.post('/progress', async (req, res) => {
    try {
        const { date, workout, completed } = req.body;
        const project = await Project.findOne({ projectName: 'fitness' });
        
        if (!project.data.workoutHistory) {
            project.data.workoutHistory = [];
        }
        
        project.data.workoutHistory.push({
            date,
            workout,
            completed,
            timestamp: new Date()
        });
        
        await project.save();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: 'Error saving progress' });
    }
});

// Workout-Historie abrufen
router.get('/progress', async (req, res) => {
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
        res.status(500).json({ message: 'Error loading progress' });
    }
});


module.exports = router;