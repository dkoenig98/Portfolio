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

router.post('/appointments', authenticateToken, async (req, res) => {
    try {
        console.log('Received appointment data:', req.body);
        const { date, type, time } = req.body;
        const appointment = new Appointment({
            date,
            type,
            time,
            createdBy: req.user.id
        });

        await appointment.save();

        // E-Mail-Benachrichtigung korrigiert
        if (req.user.role === 'sitter') {
            try {
                emailService.addChange(appointment, 'new');
                console.log('Email change added successfully');
            } catch (emailError) {
                console.error('Email service error:', emailError);
                // Wir werfen den Fehler nicht weiter, damit die Appointment-Erstellung trotzdem funktioniert
            }
        }

        // Wenn es ein Nacht- oder 24h-Dienst ist, erstelle auch den Folgetermin
        if (type === 'night' || type === 'full') {
            const [year, month, day] = date.split('-');
            const nextDate = new Date(year, month - 1, parseInt(day) + 1);
            const nextDateStr = `${nextDate.getFullYear()}-${nextDate.getMonth() + 1}-${nextDate.getDate()}`;
            
            const continuation = new Appointment({
                date: nextDateStr,
                type,
                time: 'Fortsetzung vom Vortag',
                createdBy: req.user.id,
                parentDate: date
            });
            await continuation.save();
        }
        
        res.status(201).json(appointment);
    } catch (error) {
        console.error('Appointment creation error:', error);
        res.status(400).json({ message: 'Fehler beim Erstellen', error: error.message });
    }
});

router.delete('/appointments/:date', authenticateToken, async (req, res) => {
    try {
        const { date } = req.params;
        
        // Lösche alle Termine an diesem Datum
        const appointments = await Appointment.find({ date });
        
        for (const appointment of appointments) {
            await Appointment.findByIdAndDelete(appointment._id);
            
            // Wenn es ein 24h-Dienst ist, lösche auch den Folgetermin
            if (appointment.type === 'full') {
                const [year, month, day] = date.split('-');
                const nextDate = new Date(year, month - 1, parseInt(day) + 1);
                const nextDateStr = `${nextDate.getFullYear()}-${nextDate.getMonth() + 1}-${nextDate.getDate()}`;
                
                await Appointment.deleteOne({ 
                    date: nextDateStr,
                    parentDate: date 
                });
            }
        }

        res.json({ message: 'Termine gelöscht', count: appointments.length });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ message: 'Server Fehler', error: error.message });
    }
});

module.exports = router;