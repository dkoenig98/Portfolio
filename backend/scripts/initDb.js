// backend/scripts/initDb.js
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Project = require('../models/Project');

// Laden der Umgebungsvariablen aus der .env-Datei im Hauptverzeichnis
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI ist nicht definiert. Bitte überprüfen Sie Ihre .env-Datei.');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000 // 5 Sekunden Timeout
    });
    console.log('MongoDB verbunden');
  } catch (err) {
    console.error('MongoDB Verbindungsfehler:', err);
    process.exit(1);
  }
};

const initializeProjects = async () => {
  try {
    await connectDB();

    const projects = ['strondbodbuam', 'rinnerhuette', 'norwaycounter'];

    for (const projectName of projects) {
      const existingProject = await Project.findOne({ projectName });
      if (existingProject) {
        console.log(`${projectName} Projekt existiert bereits`);
        continue;
      }

      const initialData = {
        projectName,
        data: {}
      };

      if (projectName === 'strondbodbuam') {
        initialData.data = {
          profiles: {
            dom: { counter: 0, history: [] },
            lex: { counter: 0, history: [] }
          },
          selectedYear: new Date().getFullYear()
        };
      }

      const newProject = new Project(initialData);
      await newProject.save();
      console.log(`${projectName} Projekt erfolgreich initialisiert`);
    }

  } catch (error) {
    console.error('Fehler bei der Initialisierung der Projekte:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB Verbindung geschlossen');
  }
};

initializeProjects().then(() => process.exit());