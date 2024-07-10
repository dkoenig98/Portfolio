// backend/config/database.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB verbunden');
    } catch (err) {
        console.error('MongoDB Verbindungsfehler:', err);
        process.exit(1);
    }
};

module.exports = connectDB;