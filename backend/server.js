// backend/server.js
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');
const cors = require('cors');
const path = require('path');

const jwt = require('jsonwebtoken');
require('dotenv').config();

// Am Anfang der server.js nach den imports
app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https' && process.env.NODE_ENV === 'production') {
      res.redirect(`https://${req.header('host')}${req.url}`);
  } else {
      next();
  }
});

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Datenbankverbindung
connectDB();

// DogCare Calendar Routes
const dogcareRoutes = require('./routes/dogcare-calendar');
app.use('/projects/dogcare-calendar', dogcareRoutes);

// StrondboBuam
const strondbodbuamRoutes = require('./routes/strondbodbuam');
app.use('/projects/strondbodbuam', strondbodbuamRoutes);

// Reaction Game
const reactionGameRoutes = require('./routes/reaction-game');
app.use('/projects/reaction-game', reactionGameRoutes);

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

