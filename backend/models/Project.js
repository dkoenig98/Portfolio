const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    projectName: { type: String, required: true, unique: true },
    data: {
        classicHighscores: [{ username: String, score: Number }],
        timedHighscores: [{ username: String, score: Number }],
        colorHighscores: [{ username: String, score: Number }]
    }
}, { strict: false });

module.exports = mongoose.model('Project', ProjectSchema);