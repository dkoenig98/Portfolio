# Dominic´s Portfolio

Dieses Projekt ist eine dynamische Portfolio-Webseite zur Präsentation verschiedener Webprojekte. Es nutzt Node.js mit Express im Backend, MongoDB als Datenbank und HTML, CSS und JavaScript im Frontend. Das Hosting erfolgt über Heroku.

## Inhaltsverzeichnis
1. [Projektstruktur](#projektstruktur)
2. [Setup und Installation](#setup-und-installation)
3. [Neue Projekte hinzufügen](#neue-projekte-hinzufügen)
4. [Datenbank-Management](#datenbank-management)
5. [Entwicklung und Debugging](#entwicklung-und-debugging)
6. [Deployment](#deployment)

## Projektstruktur

```
project-root/
│
├── backend/
│   ├── config/
│   │   └── database.js       # Datenbankverbindungskonfiguration
│   ├── models/
│   │   └── Project.js        # Mongoose-Modell für Projekte
│   ├── routes/
│   │   ├── projects.js       # Allgemeine Projekt-Routen
│   │   ├── rinnerhuette.js   # Spezifische Routen für Rinnerhuette
│   │   └── strondbodbuam.js  # Spezifische Routen für Strondbodbuam
│   ├── scripts/
│   │   └── initDb.js         # Skript zur Datenbankinitialisierung
│   └── server.js             # Hauptserver-Datei
│
├── frontend/
│   ├── css/
│   │   └── style.css
│   ├── images/
│   │   └── thatsme.webp
│   ├── js/
│   │   └── main.js
│   ├── old/                  # Alte Dateien (falls benötigt)
│   └── index.html
│
├── projects/                 # Individuelle Projektordner
│   ├── norwaycounter/
│   ├── rinnerhuette/
│   └── strondbodbuam/
│
├── .env                      # Umgebungsvariablen
├── .gitignore
├── package.json
├── README.md
└── Procfile                  # Heroku Deployment-Konfiguration
```

## Setup und Installation

1. Repository klonen:
   ```
   git clone [repository-url]
   ```

2. Abhängigkeiten installieren:
   ```
   npm install
   ```

3. `.env`-Datei im Hauptverzeichnis erstellen und folgende Variablen hinzufügen:
   ```
   MONGODB_URI=mongodb_verbindungs_url
   PORT=5000
   ```

4. Datenbank initialisieren (falls erforderlich):
   ```
   node backend/scripts/initDb.js
   ```

## Neue Projekte hinzufügen

Folge diesen Schritten, um ein neues Projekt hinzuzufügen:

1. Frontend-Komponenten erstellen:
   - Neuen Ordner unter `/projects` anlegen (z.B. `/projects/neues-projekt`)
   - `index.html`, `script.js` und `styles.css` im neuen Projektordner erstellen
   - Projektspezifische Assets (Bilder, Fonts etc.) hinzufügen
   - `/frontend/index.html` aktualisieren, um einen Link zum neuen Projekt hinzuzufügen

2. Backend-Route erstellen:
   - Neue Datei in `/backend/routes` anlegen (z.B. `neues-projekt.js`)
   - Grundlegende Route-Handler implementieren:

     ```javascript
     const express = require('express');
     const router = express.Router();
     const Project = require('../models/Project');

     router.get('/data', async (req, res) => {
         try {
             const project = await Project.findOne({ projectName: 'neues-projekt' });
             res.json(project ? project.data : {});
         } catch (error) {
             res.status(500).json({ message: 'Server error' });
         }
     });

     router.post('/data', async (req, res) => {
         try {
             const update = { $set: { 'data': req.body } };
             const options = { upsert: true, new: true };
             const project = await Project.findOneAndUpdate(
                 { projectName: 'neues-projekt' },
                 update,
                 options
             );
             res.json(project.data);
         } catch (error) {
             res.status(500).json({ message: 'Server error' });
         }
     });

     module.exports = router;
     ```

3. Route in `server.js` einbinden:
   ```javascript
   const neuesProjektRoutes = require('./routes/neues-projekt');
   app.use('/projects/neues-projekt', neuesProjektRoutes);
   ```

4. Datenbank-Eintrag für das neue Projekt erstellen:
   - In `backend/scripts/initDb.js` eine neue Funktion hinzufügen:

     ```javascript
     const initializeNeuesProjekt = async () => {
       try {
         const existingProject = await Project.findOne({ projectName: 'neues-projekt' });
         if (existingProject) {
           console.log('Neues Projekt existiert bereits');
           return;
         }

         const initialData = {
           projectName: 'neues-projekt',
           data: {
             // Hier projektspezifische Daten einfügen
           }
         };

         const newProject = new Project(initialData);
         await newProject.save();
         console.log('Neues Projekt erfolgreich initialisiert');
       } catch (error) {
         console.error('Fehler bei der Initialisierung des neuen Projekts:', error);
       }
     };

     // Diese Funktion im Hauptteil des Skripts aufrufen
     initializeNeuesProjekt();
     ```

5. Frontend-Logik implementieren:
   - In `projects/neues-projekt/script.js` die notwendigen API-Aufrufe zum Backend implementieren

6. Testen:
   - Alle neuen Routen und Funktionalitäten lokal testen

## Datenbank-Management

Das Projekt verwendet ein flexibles Datenbankschema, das es erlaubt, für jedes Projekt spezifische Daten zu speichern, ohne andere Projekte zu beeinflussen.

Hauptmodell (`backend/models/Project.js`):
```javascript
const ProjectSchema = new mongoose.Schema({
  projectName: { type: String, required: true, unique: true },
  data: { type: mongoose.Schema.Types.Mixed }
}, { strict: false });
```

Daten für ein spezifisches Projekt aktualisieren:
```javascript
const update = { $set: { 'data.spezifischesDatenfeld': neueDaten } };
const options = { upsert: true, new: true };
await Project.findOneAndUpdate(
  { projectName: 'projektname' },
  update,
  options
);
```

Diese Struktur erlaubt es, für jedes Projekt individuelle Daten zu speichern und zu aktualisieren, ohne die Daten anderer Projekte zu beeinflussen.

## Entwicklung und Debugging

1. Lokalen Entwicklungsserver starten:
   ```
   npm run dev
   ```

2. Logs überwachen:
   - `console.log()` für temporäre Debugging-Ausgaben verwenden

3. Datenbank-Debugging:
   - MongoDB Compass zur visuellen Inspektion der Datenbank verwenden

## Deployment

1. Änderungen zum GitHub-Repository pushen
2. Automatisches Deployment auf Heroku bei Push zum `main`-Branch
3. Heroku-Logs überprüfen:
   ```
   heroku logs --tail
   ```

