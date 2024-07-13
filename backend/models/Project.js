const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    projectName: { type: String, required: true, unique: true },
    data: mongoose.Schema.Types.Mixed
}, { strict: false });

// Fügen Sie eine Methode hinzu, um die Reaktionsspiel-Daten zu verwalten
ProjectSchema.methods.getReactionGameData = function() {
    if (this.projectName === 'reaction-game') {
        return {
            classicHighscores: this.data.classicHighscores || [],
            timedHighscores: this.data.timedHighscores || [],
            colorHighscores: this.data.colorHighscores || []
        };
    }
    return null;
};

module.exports = mongoose.model('Project', ProjectSchema);