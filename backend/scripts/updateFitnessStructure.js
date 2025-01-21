const Project = require('../models/Project');
const mongoose = require('mongoose');
require('dotenv').config();

const updateFitnessStructure = async () => {
    try {
        // MongoDB-Verbindung herstellen
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Mit Datenbank verbunden');

        // Finde das Fitness-Projekt
        const project = await Project.findOne({ projectName: 'fitness' });
        if (!project) {
            console.error('Fitness Projekt nicht gefunden');
            return;
        }

        console.log('Aktuelles Projekt gefunden:', project.projectName);

        // Sicherstellen, dass data existiert
        if (!project.data) {
            project.data = {};
        }

        // Bestehende Übungen sichern
        const existingExercises = project.data.exercises || [];

        // Neue Struktur erstellen
        project.data = {
            exercises: existingExercises,
            workoutPlans: [],           // Für zukünftige Trainingspläne
            workoutHistory: [],         // Verlauf der durchgeführten Workouts
            muscleGroupStats: {         // Statistiken pro Muskelgruppe
                chest: 0,
                back: 0,
                shoulders: 0,
                biceps: 0,
                triceps: 0,
                core: 0,
                forearms: 0
            },
            settings: {                 // Benutzereinstellungen
                trainingDays: 6,
                exerciseCount: 7,
                includeDeadhang: false
            },
            deadhangStats: []           // Deadhang-Zeiten
        };

        // Speichern der aktualisierten Struktur
        await project.save();
        console.log('Datenbankstruktur erfolgreich aktualisiert');

        // Ausgabe der neuen Struktur
        console.log('Neue Datenbankstruktur:', JSON.stringify(project.data, null, 2));

    } catch (error) {
        console.error('Fehler beim Aktualisieren der Datenbankstruktur:', error);
    } finally {
        // Verbindung schließen
        await mongoose.connection.close();
        console.log('Datenbankverbindung geschlossen');
    }
};

// Skript ausführen
updateFitnessStructure()
    .then(() => console.log('Skript abgeschlossen'))
    .catch(error => console.error('Skript-Fehler:', error));