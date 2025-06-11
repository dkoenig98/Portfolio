// backend/routes/triathlon-tracker.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const TriathlonTraining = require('../models/TriathlonTraining');

// Multer für CSV Upload
const upload = multer({ dest: 'uploads/' });

// GET: Alle Trainings abrufen
router.get('/trainings', async (req, res) => {
  try {
    const trainings = await TriathlonTraining.find().sort({ date: 1 });
    res.json(trainings);
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Abrufen der Trainings', error: error.message });
  }
});

// GET: Training nach Datum
router.get('/trainings/date/:date', async (req, res) => {
  try {
    // Parse date and set to start of day in local timezone
    const dateStr = req.params.date;
    const [year, month, day] = dateStr.split('-').map(num => parseInt(num));
    const startDate = new Date(year, month - 1, day, 0, 0, 0);
    const endDate = new Date(year, month - 1, day, 23, 59, 59);
    
    const training = await TriathlonTraining.findOne({
      date: { $gte: startDate, $lte: endDate }
    });
    
    res.json(training || null);
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Abrufen des Trainings', error: error.message });
  }
});

// GET: Heutiges Training
router.get('/trainings/today', async (req, res) => {
  try {
    // Get today in local timezone
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    
    const training = await TriathlonTraining.findOne({
      date: { $gte: today, $lte: tomorrow }
    });
    
    res.json(training || null);
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Abrufen des heutigen Trainings', error: error.message });
  }
});

// GET: Trainings für eine Woche
router.get('/trainings/week/:weekNumber', async (req, res) => {
  try {
    const trainings = await TriathlonTraining.findByWeek(parseInt(req.params.weekNumber));
    res.json(trainings);
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Abrufen der Wochentrainings', error: error.message });
  }
});

// GET: Trainings in einem Datumsbereich
router.get('/trainings/range', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const trainings = await TriathlonTraining.findByDateRange(
      new Date(startDate),
      new Date(endDate)
    );
    res.json(trainings);
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Abrufen der Trainings', error: error.message });
  }
});

// POST: Neues Training erstellen
router.post('/trainings', async (req, res) => {
  try {
    const training = new TriathlonTraining(req.body);
    await training.save();
    res.status(201).json(training);
  } catch (error) {
    res.status(400).json({ message: 'Fehler beim Erstellen des Trainings', error: error.message });
  }
});

// PUT: Training aktualisieren
router.put('/trainings/:id', async (req, res) => {
  try {
    const training = await TriathlonTraining.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!training) {
      return res.status(404).json({ message: 'Training nicht gefunden' });
    }
    
    // Score neu berechnen
    await training.save();
    res.json(training);
  } catch (error) {
    res.status(400).json({ message: 'Fehler beim Aktualisieren des Trainings', error: error.message });
  }
});

// DELETE: Training löschen
router.delete('/trainings/:id', async (req, res) => {
  try {
    const training = await TriathlonTraining.findByIdAndDelete(req.params.id);
    
    if (!training) {
      return res.status(404).json({ message: 'Training nicht gefunden' });
    }
    
    res.json({ message: 'Training erfolgreich gelöscht' });
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Löschen des Trainings', error: error.message });
  }
});

// POST: CSV Import
router.post('/import-csv', upload.single('csv'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Keine CSV-Datei hochgeladen' });
  }
  
  const results = [];
  const errors = [];
  
  try {
    fs.createReadStream(req.file.path)
      .pipe(csv({ separator: ';' }))
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        // CSV-Datei löschen
        fs.unlinkSync(req.file.path);
        
        // Daten verarbeiten
        for (const row of results) {
          try {
            // Datum parsen (DD.MM.YYYY format) - mit lokaler Zeitzone
            const [day, month, year] = row['Datum'].split('.');
            const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), 12, 0, 0); // 12:00 to avoid timezone issues
            
            // Training-Objekt erstellen
            const trainingData = {
              week: parseInt(row['Woche']),
              date: date,
              weekday: row['Wochentag'],
              plannedUnit: row['Einheit (geplant)'] || '',
              completed: row['Einheit (gemacht)'] === 'x',
              rating: row['Rating'] ? parseInt(row['Rating']) : null,
              duration: row['Dauer (min)'] ? parseInt(row['Dauer (min)']) : null,
              zone1: row['Zone 1 (min)'] ? parseInt(row['Zone 1 (min)']) : 0,
              zone2: row['Zone 2 (min)'] ? parseInt(row['Zone 2 (min)']) : 0,
              zone3: row['Zone 3 (min)'] ? parseInt(row['Zone 3 (min)']) : 0,
              zone4: row['Zone 4 (min)'] ? parseInt(row['Zone 4 (min)']) : 0,
              zone5: row['Zone 5 (min)'] ? parseInt(row['Zone 5 (min)']) : 0,
              type: row['Typ'] || 'Ruhe'
            };
            
            // Prüfen ob Training bereits existiert
            const existing = await TriathlonTraining.findOne({ 
              date: { 
                $gte: date, 
                $lt: new Date(date.getTime() + 24 * 60 * 60 * 1000) 
              },
              plannedUnit: trainingData.plannedUnit
            });
            
            if (existing) {
              // Update existing
              Object.assign(existing, trainingData);
              await existing.save();
            } else {
              // Create new
              const training = new TriathlonTraining(trainingData);
              await training.save();
            }
          } catch (error) {
            errors.push({ row: row['Datum'], error: error.message });
          }
        }
        
        res.json({
          message: 'CSV Import abgeschlossen',
          imported: results.length - errors.length,
          errors: errors
        });
      });
  } catch (error) {
    // Cleanup bei Fehler
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Fehler beim CSV Import', error: error.message });
  }
});

// GET: Statistiken
router.get('/stats/weekly/:weekNumber', async (req, res) => {
  try {
    const stats = await TriathlonTraining.getWeeklyStats(parseInt(req.params.weekNumber));
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Abrufen der Statistiken', error: error.message });
  }
});

// GET: Zonenverteilung
router.get('/stats/zones', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const distribution = await TriathlonTraining.getZoneDistribution(
      new Date(startDate),
      new Date(endDate)
    );
    res.json(distribution);
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Abrufen der Zonenverteilung', error: error.message });
  }
});

// GET: Kommende Trainings
router.get('/trainings/upcoming', async (req, res) => {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    
    const trainings = await TriathlonTraining.find({
      date: { $gte: today },
      completed: false
    }).sort({ date: 1 }).limit(10);
    
    res.json(trainings);
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Abrufen der kommenden Trainings', error: error.message });
  }
});

module.exports = router;