// backend/scripts/initDb.js
const path = require('path');
const dotenv = require('dotenv');

// Laden der Umgebungsvariablen aus der .env-Datei im Hauptverzeichnis
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const mongoose = require('mongoose');
const Project = require('../models/Project');

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

const initializeStrondbodbuam = async () => {
  try {
    await connectDB();

    const existingProject = await Project.findOne({ projectName: 'strondbodbuam' });
    if (existingProject) {
      console.log('Strondbodbuam project already exists');
      return;
    }

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const monthsSince2023 = (currentYear - 2023) * 12 + currentMonth;

    const initialData = {
      projectName: 'strondbodbuam',
      data: {
        profiles: {
          dom: { counter: monthsSince2023, history: [] },
          lex: { counter: monthsSince2023, history: [] }
        },
        selectedYear: currentYear
      }
    };

    // Fügen Sie Einträge für jeden Monat seit 2023 hinzu
    const years = [2023, currentYear];
    years.forEach(year => {
      for (let i = 0; i < 12; i++) {
        if (year === currentYear && i > currentMonth) {
          break;
        }
        const date = new Date(year, i, 1);
        const entry = `${date.toLocaleDateString('de-DE')} am 12:00:00 - Do gehts oan glei besser!`;
        initialData.data.profiles.dom.history.push(entry);
        initialData.data.profiles.lex.history.push(entry);
      }
    });

    const newProject = new Project(initialData);
    await newProject.save();
    console.log('Strondbodbuam project initialized successfully');
  } catch (error) {
    console.error('Error initializing Strondbodbuam project:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB Verbindung geschlossen');
  }
};

initializeStrondbodbuam().then(() => process.exit());