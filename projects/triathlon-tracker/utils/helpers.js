// utils/helpers.js

// Format date to German format
export function formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Format date with weekday
export function formatDateWithWeekday(date) {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('de-DE', {
        weekday: 'long',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Get week number
export function getWeekNumber(date) {
    const d = new Date(date);
    const startOfYear = new Date(d.getFullYear(), 0, 1);
    const days = Math.floor((d - startOfYear) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + startOfYear.getDay() + 1) / 7);
}

// Calculate race countdown
export function calculateRaceCountdown(raceDate) {
    const now = new Date();
    const diff = raceDate - now;
    
    if (diff < 0) {
        return 'Wettkampf vorbei!';
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(days / 7);
    const remainingDays = days % 7;
    
    if (weeks > 0) {
        return `${weeks} Wochen, ${remainingDays} Tage`;
    } else {
        return `${days} Tage`;
    }
}

// Format duration
export function formatDuration(minutes) {
    if (!minutes) return '0 min';
    if (minutes < 60) return `${minutes} min`;
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
}

// Get training type icon
export function getTrainingIcon(type) {
    switch(type) {
        case 'R': return 'fa-biking';
        case 'L': return 'fa-running';
        case 'S': return 'fa-swimmer';
        case 'K': return 'fa-dumbbell';
        case 'RL': return 'fa-exchange-alt';
        case 'Ruhe': return 'fa-bed';
        case 'Wettkampf': return 'fa-trophy';
        default: return 'fa-dumbbell';
    }
}

// Get training type name
export function getTrainingTypeName(type) {
    switch(type) {
        case 'R': return 'Radfahren';
        case 'L': return 'Laufen';
        case 'S': return 'Schwimmen';
        case 'K': return 'Krafttraining';
        case 'RL': return 'Koppeltraining';
        case 'Ruhe': return 'Ruhetag';
        case 'Wettkampf': return 'Wettkampf';
        default: return 'Training';
    }
}

// Get training type color
export function getTrainingTypeColor(type) {
    switch(type) {
        case 'R': return '#2563eb'; // Blue
        case 'L': return '#10b981'; // Green
        case 'S': return '#f59e0b'; // Yellow
        case 'K': return '#ef4444'; // Red
        case 'RL': return '#8b5cf6'; // Purple
        case 'Ruhe': return '#6b7280'; // Gray
        case 'Wettkampf': return '#f97316'; // Orange
        default: return '#6b7280';
    }
}

// Truncate text for display
export function truncateText(text, maxLength = 50) {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Calculate total zone time
export function calculateTotalZoneTime(training) {
    return (training.zone1 || 0) + 
           (training.zone2 || 0) + 
           (training.zone3 || 0) + 
           (training.zone4 || 0) + 
           (training.zone5 || 0);
}

// Get current week number (for training plan)
export function getCurrentTrainingWeek() {
    const startDate = new Date('2025-06-02'); // Start of training plan
    const now = new Date();
    const diff = now - startDate;
    const weeks = Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
    return Math.max(1, weeks + 1);
}

// Parse date from German format (DD.MM.YYYY)
export function parseGermanDate(dateStr) {
    const parts = dateStr.split('.');
    if (parts.length !== 3) return null;
    
    const day = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1; // Month is 0-indexed
    const year = parseInt(parts[2]);
    
    return new Date(year, month, day);
}

// Group trainings by week
export function groupTrainingsByWeek(trainings) {
    const grouped = {};
    
    trainings.forEach(training => {
        const week = training.week || getWeekNumber(training.date);
        if (!grouped[week]) {
            grouped[week] = [];
        }
        grouped[week].push(training);
    });
    
    return grouped;
}

// Calculate weekly totals
export function calculateWeeklyTotals(trainings) {
    const totals = {
        duration: 0,
        score: 0,
        byType: {
            R: { duration: 0, count: 0 },
            L: { duration: 0, count: 0 },
            S: { duration: 0, count: 0 }
        }
    };
    
    trainings.forEach(training => {
        if (training.completed) {
            totals.duration += training.duration || 0;
            totals.score += training.score || 0;
            
            if (training.type !== 'Ruhe' && totals.byType[training.type]) {
                totals.byType[training.type].duration += training.duration || 0;
                totals.byType[training.type].count += 1;
            }
        }
    });
    
    return totals;
}

// Get rating emoji
export function getRatingEmoji(rating) {
    if (!rating) return '';
    const emojis = ['😐', '😀', '💪', '⚡', '💥'];
    return emojis[rating - 1] || '';
}

// Sort trainings by date
export function sortTrainingsByDate(trainings) {
    return trainings.sort((a, b) => new Date(a.date) - new Date(b.date));
}