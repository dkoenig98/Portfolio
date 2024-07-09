//Für jedes neue Projekt muss ich:
// - Eine neue Routendatei im routes-Ordner erstellen.
// - Die neue Routendatei in server.js einbinden.
// - Das Frontend-Skript des Projekts anpassen, um die entsprechenden Routen zu verwenden.

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000
}).then(() => console.log('MongoDB verbunden'))
  .catch(err => {
    console.error('MongoDB Verbindungsfehler:', err);
    process.exit(1);
  });

  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });


// Projektspezifische Routen einbinden
const strondbodbuamRoutes = require('./routes/strondbodbuam');
app.use('/projects/strondbodbuam', strondbodbuamRoutes);

// Allgemeine Projekt-Routen
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find({}, 'projectName');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/projects', async (req, res) => {
  const project = new Project(req.body);
  try {
    const newProject = await project.save();
    res.status(201).json(newProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Statische Dateien servieren
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/projects', express.static(path.join(__dirname, '../projects')));

// Catch-all Route für SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));