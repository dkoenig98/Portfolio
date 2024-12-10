// Appointment.js
const AppointmentSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['regular', 'full', 'custom'],  // 'night' zu 'custom' geändert
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
    customTime: {                   // Neu für benutzerdefinierte Zeiten
        start: String,
        end: String
    }
}, { timestamps: true });