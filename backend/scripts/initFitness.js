const Project = require('../models/Project');
const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();

const initializeFitnessProject = async () => {
    try {
        // MongoDB-Verbindung herstellen
        await mongoose.connect(process.env.MONGODB_URI);

        // JSON-Datei lesen
        const filePath = 'C:/tmp/Portfolio/projects/fitness/data/exercises.json';
        const rawData = fs.readFileSync(filePath, 'utf-8');
        const jsonData = JSON.parse(rawData);

        // Projekt aktualisieren oder erstellen
        await Project.findOneAndUpdate(
            { projectName: 'fitness' }, // Filter
            {
                projectName: 'fitness',
                data: {
                    exercises: jsonData.exercises,
                    workoutPlans: []
                }
            }, // Neue Daten
            { upsert: true, new: true } // Optionen: upsert erstellt ein neues Dokument, falls es nicht existiert
        );

        console.log('Fitness Projekt erfolgreich aktualisiert oder erstellt');
    } catch (error) {
        console.error('Fehler:', error);
    } finally {
        // Verbindung schließen
        await mongoose.connection.close();
    }
};

initializeFitnessProject();
