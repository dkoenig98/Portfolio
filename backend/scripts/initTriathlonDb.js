// backend/scripts/initTriathlonDb.js
const mongoose = require('mongoose');
require('dotenv').config({ path: '../../.env' });

// Import the model
const TriathlonTraining = require('../models/TriathlonTraining');

async function initializeTriathlonDb() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        console.log('Connected to MongoDB');
        
        // Check if we already have data
        const count = await TriathlonTraining.countDocuments();
        if (count > 0) {
            console.log(`Database already contains ${count} training entries`);
            
            // Ask for confirmation to reset
            const readline = require('readline').createInterface({
                input: process.stdin,
                output: process.stdout
            });
            
            const answer = await new Promise(resolve => {
                readline.question('Do you want to reset the database? (yes/no): ', resolve);
            });
            
            readline.close();
            
            if (answer.toLowerCase() !== 'yes') {
                console.log('Initialization cancelled');
                process.exit(0);
            }
            
            // Clear existing data
            await TriathlonTraining.deleteMany({});
            console.log('Existing data cleared');
        }
        
        // Create indexes
        await TriathlonTraining.createIndexes();
        console.log('Indexes created');
        
        // Add sample data (optional)
        const sampleTrainings = [
            {
                week: 1,
                date: new Date('2025-06-02'),
                weekday: 'Monday',
                plannedUnit: 'Zwift: FTP Builder Week 1 Day 3 - Foundation (48min, GA1)',
                completed: false,
                type: 'R'
            },
            {
                week: 1,
                date: new Date('2025-06-03'),
                weekday: 'Tuesday',
                plannedUnit: 'Laufen 45min ruhig GA1',
                completed: false,
                type: 'L'
            },
            {
                week: 1,
                date: new Date('2025-06-04'),
                weekday: 'Wednesday',
                plannedUnit: 'Schwimmen Technik (z.B. 4x200m locker)',
                completed: false,
                type: 'S'
            }
        ];
        
        // Insert sample data
        await TriathlonTraining.insertMany(sampleTrainings);
        console.log('Sample trainings inserted');
        
        console.log('Triathlon database initialization complete!');
        
    } catch (error) {
        console.error('Error initializing database:', error);
    } finally {
        // Close connection
        await mongoose.connection.close();
        process.exit(0);
    }
}

// Run initialization
initializeTriathlonDb();