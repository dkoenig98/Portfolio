// backend/models/TriathlonTraining.js
const mongoose = require('mongoose');

const TriathlonTrainingSchema = new mongoose.Schema({
  // Identifikation
  week: { type: Number, required: true },
  date: { type: Date, required: true },
  weekday: { type: String, required: true },
  
  // Training Details
  plannedUnit: { type: String, default: '' },
  completed: { type: Boolean, default: false },
  rating: { type: Number, min: 1, max: 5 },
  duration: { type: Number }, // in Minuten
  
  // Herzfrequenzzonen (in Minuten)
  zone1: { type: Number, default: 0 },
  zone2: { type: Number, default: 0 },
  zone3: { type: Number, default: 0 },
  zone4: { type: Number, default: 0 },
  zone5: { type: Number, default: 0 },
  
  // Berechnete Werte
  score: { type: Number, default: 0 },
  
  // Typ: R (Rad), L (Laufen), S (Schwimmen), K (Kraft), RL (Rad+Lauf), Ruhe, Wettkampf
  type: { type: String, required: true, enum: ['R', 'L', 'S', 'K', 'RL', 'Ruhe', 'Wettkampf'] },
  
  // Zusätzliche Daten
  notes: { type: String },
  sleepHours: { type: Number },
  
  // Metadaten
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Virtuelle Properties
TriathlonTrainingSchema.virtual('totalZoneTime').get(function() {
  return this.zone1 + this.zone2 + this.zone3 + this.zone4 + this.zone5;
});

// Score automatisch berechnen vor dem Speichern
TriathlonTrainingSchema.pre('save', function(next) {
  this.score = this.zone1 * 1 + this.zone2 * 2 + this.zone3 * 3 + this.zone4 * 4 + this.zone5 * 5;
  this.updatedAt = Date.now();
  next();
});

// Statische Methoden
TriathlonTrainingSchema.statics.findByDateRange = function(startDate, endDate) {
  return this.find({
    date: {
      $gte: startDate,
      $lte: endDate
    }
  }).sort({ date: 1 });
};

TriathlonTrainingSchema.statics.findByWeek = function(weekNumber) {
  return this.find({ week: weekNumber }).sort({ date: 1 });
};

TriathlonTrainingSchema.statics.getTodaysTraining = function() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
  
  return this.findOne({
    date: {
      $gte: today,
      $lte: tomorrow
    }
  });
};

// Aggregations für Statistiken
TriathlonTrainingSchema.statics.getWeeklyStats = async function(weekNumber) {
  const result = await this.aggregate([
    { $match: { week: weekNumber } },
    {
      $group: {
        _id: '$type',
        totalDuration: { $sum: '$duration' },
        totalScore: { $sum: '$score' },
        count: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);
  
  return result;
};

TriathlonTrainingSchema.statics.getZoneDistribution = async function(startDate, endDate) {
  const trainings = await this.findByDateRange(startDate, endDate);
  
  const distribution = {
    zone1: 0,
    zone2: 0,
    zone3: 0,
    zone4: 0,
    zone5: 0
  };
  
  trainings.forEach(training => {
    distribution.zone1 += training.zone1 || 0;
    distribution.zone2 += training.zone2 || 0;
    distribution.zone3 += training.zone3 || 0;
    distribution.zone4 += training.zone4 || 0;
    distribution.zone5 += training.zone5 || 0;
  });
  
  return distribution;
};

module.exports = mongoose.model('TriathlonTraining', TriathlonTrainingSchema);