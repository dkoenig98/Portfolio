const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const emailService = require('../services/emailService');

// Middleware für Auth
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Token erforderlich' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Ungültiger Token' });
        req.user = user;
        next();
    });
};

// Login Route
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Ungültige Anmeldedaten' });
        }

        const token = jwt.sign(
            { id: user._id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({ token, role: user.role });
    } catch (error) {
        res.status(500).json({ message: 'Server Fehler', error: error.message });
    }
});

// Appointments Routes
router.get('/appointments', authenticateToken, async (req, res) => {
    try {
        const appointments = await Appointment.find()
            .sort({ date: 1 })
            .populate('createdBy', 'username');
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Server Fehler', error: error.message });
    }
});

// POST-Route zum Erstellen von Urlaubseinträgen
router.post('/appointments', authenticateToken, async (req, res) => {
    try {
        console.log('Received appointment data:', req.body);
        const { date, type, time, startDate, endDate } = req.body;
        
        // Für Urlaub: Mehrere Einträge erstellen
        if (type === 'vacation') {
            const vacationAppointments = [];
            const currentDate = new Date(startDate);
            const endDateObj = new Date(endDate);

            while (currentDate <= endDateObj) {
                const dateString = currentDate.toISOString().split('T')[0];
                
                const vacationAppointment = new Appointment({
                    date: dateString,
                    type: 'vacation',
                    time: 'Urlaub',
                    startDate,
                    endDate,
                    createdBy: req.user.id
                });

                await vacationAppointment.save();
                vacationAppointments.push(vacationAppointment);

                // Nächster Tag
                currentDate.setDate(currentDate.getDate() + 1);
            }

            res.status(201).json(vacationAppointments);
        } else {
            // Bestehende Logik für andere Termintypen
            const appointment = new Appointment({
                date,
                type,
                time,
                createdBy: req.user.id
            });

            await appointment.save();
            res.status(201).json(appointment);
        }
    } catch (error) {
        console.error('Appointment creation error:', error);
        res.status(400).json({ message: 'Fehler beim Erstellen', error: error.message });
    }
});

// DELETE-Route zum Löschen von Urlaubseinträgen
router.delete('/appointments/:date', authenticateToken, async (req, res) => {
    try {
        const { date } = req.params;
        
        const appointments = await Appointment.find({ date });
        
        for (const appointment of appointments) {
            // Wenn es ein Urlaubstermin ist, lösche alle verbundenen Urlaubstermine
            if (appointment.type === 'vacation') {
                const deletedCount = await Appointment.deleteMany({ 
                    type: 'vacation', 
                    startDate: appointment.startDate, 
                    endDate: appointment.endDate 
                });
                
                // Logging für Debugging
                console.log(`Deleted ${deletedCount.deletedCount} vacation appointments`);
                
                break; // Nur einmal löschen
            } else {
                // Bestehende Lösch-Logik für andere Termintypen
                await Appointment.findByIdAndDelete(appointment._id);
            }
        }

        res.json({ message: 'Termine gelöscht' });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ message: 'Server Fehler', error: error.message });
    }
});

module.exports = router;