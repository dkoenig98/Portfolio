const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['regular', 'full', 'late', 'extended', 'custom', 'vacation'], 
        required: true
    },
    time: {
        type: String,
        required: true
    },
    startDate: { 
        type: String,
        default: null
    },
    endDate: { 
        type: String,
        default: null
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    parentDate: {
        type: String,
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', AppointmentSchema);