const User = require('../models/User');
const mongoose = require('mongoose');
require('dotenv').config();

const initializeDogcareUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        // Erstelle Sitter (dich)
        const sitterExists = await User.findOne({ username: 'dom' });
        if (!sitterExists) {
            await User.create({
                username: 'koedom',
                password: 'koedom', // Ändere dies!
                role: 'sitter'
            });
            console.log('Sitter Account erstellt');
        }

        // Erstelle Owner
        const ownerExists = await User.findOne({ username: 'shanti_owner' });
        if (!ownerExists) {
            await User.create({
                username: 'shanti',
                password: 'shanti', // Ändere dies!
                role: 'owner'
            });
            console.log('Owner Account erstellt');
        }

    } catch (error) {
        console.error('Fehler:', error);
    } finally {
        await mongoose.connection.close();
    }
};

initializeDogcareUsers();