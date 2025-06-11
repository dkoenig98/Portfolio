// Importiere erforderliche Module
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');
const cors = require('cors');
const path = require('path');
const fs = require('fs'); // Füge fs hinzu

// Initialisiere Express App
const app = express();

// Aktiviere Vertrauen in Proxy (wichtig für Heroku)
app.enable('trust proxy');

// HTTPS Redirect Middleware für Produktion
app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https' && process.env.NODE_ENV === 'production') {
        res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
        next();
    }
});

// Port Konfiguration
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Datenbankverbindung
connectDB();

// Routes

const triathlonRoutes = require('./routes/triathlon-tracker');

// ... andere Imports und Middleware ...

// Add Triathlon Tracker routes (füge diese Zeile nach den anderen Routen hinzu)
app.use('/projects/triathlon-tracker', triathlonRoutes);


// Fitness Routes
const fitnessRoutes = require('./routes/fitness');
app.use('/projects/fitness', fitnessRoutes);

// DogCare Calendar Routes
const dogcareRoutes = require('./routes/dogcare-calendar');
app.use('/projects/dogcare-calendar', dogcareRoutes);

// StrondboBuam Routes
const strondbodbuamRoutes = require('./routes/strondbodbuam');
app.use('/projects/strondbodbuam', strondbodbuamRoutes);

// Reaction Game Routes
const reactionGameRoutes = require('./routes/reaction-game');
app.use('/projects/reaction-game', reactionGameRoutes);

// API Routes für Projekte
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

// Statische Dateien
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/projects', express.static(path.join(__dirname, '../projects')));

app.use('/projects/triathlon-tracker', express.static(path.join(__dirname, '../projects/triathlon-tracker')));

app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    next();
});

// Für HTML-Dateien speziell
app.use('/projects/triathlon-tracker', (req, res, next) => {
    if (req.path.endsWith('.html') || req.path === '/') {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
    }
    next();
});

// Download Route - HIER EINGEFÜGT
app.get('/api/download/:filename', (req, res) => {
    const file = path.join(__dirname, '../frontend/downloads', req.params.filename);
    console.log('Attempting to download:', file); // Debugging
    
    if (!fs.existsSync(file)) {
        console.log('File not found:', file); // Debugging
        return res.status(404).send('Datei nicht gefunden');
    }
    
    res.download(file);
});

app.post('/api/verify-password', (req, res) => {
  const { password } = req.body;
  // Passwort in Umgebungsvariable speichern
  const correctPassword = process.env.PROJECT_PASSWORD;
  
  if (password === correctPassword) {
      res.json({ success: true });
  } else {
      res.status(401).json({ success: false, message: 'Falsches Passwort' });
  }
});

// Catch-all Route NACH der Download Route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});


// Server starten
app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));