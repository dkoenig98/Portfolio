const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['regular', 'full', 'custom'],
        required: true
    },
    time: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    parentDate: {
        type: String,
        default: null
    },
    customTime: {
        start: String,
        end: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', AppointmentSchema);