const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    projectName: { type: String, required: true, unique: true },
    data: mongoose.Schema.Types.Mixed
}, { strict: false });

module.exports = mongoose.model('Project', ProjectSchema);