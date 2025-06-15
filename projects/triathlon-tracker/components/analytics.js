// components/analytics.js
import { API } from '../utils/api.js';
import { getTrainingTypeColor, getTrainingTypeName, formatDuration, calculateWeeklyTotals } from '../utils/helpers.js';

let charts = {
    zone: null,
    type: null,
    progress: null,
    intensity: null,
    weekly: null
};

let currentPeriod = 'week'; // week, month, all

export async function renderAnalytics() {
    const contentArea = document.getElementById('contentArea');
    
    contentArea.innerHTML = `
        <div class="analytics-view">
            <h2>Trainingsanalyse</h2>
            
            <!-- Period Selector -->
            <div class="period-selector">
                <button class="period-btn active" data-period="week">Woche</button>
                <button class="period-btn" data-period="month">Monat</button>
                <button class="period-btn" data-period="all">Gesamt</button>
            </div>
            
            <!-- Stats Overview -->
            <div class="analytics-stats" id="analyticsStats">
                <!-- Wird dynamisch gefüllt -->
            </div>
            
            <!-- Tabs Navigation -->
            <div class="analytics-tabs">
                <button class="tab-btn active" data-tab="overview">Übersicht</button>
                <button class="tab-btn" data-tab="intensity">Intensität</button>
                <button class="tab-btn" data-tab="progress">Fortschritt</button>
                <button class="tab-btn" data-tab="patterns">Muster</button>
            </div>
            
            <!-- Tab Contents -->
            <div class="tab-content active" id="overview-tab">
                <div class="chart-grid">
                    <div class="chart-container">
                        <h3>Trainingsverteilung</h3>
                        <canvas id="typeChart"></canvas>
                    </div>
                    <div class="chart-container">
                        <h3>Herzfrequenzzonen</h3>
                        <canvas id="zoneChart"></canvas>
                    </div>
                </div>
            </div>
            
            <div class="tab-content" id="intensity-tab">
                <div class="chart-container">
                    <h3>Intensitätsverteilung</h3>
                    <canvas id="intensityChart"></canvas>
                </div>
                <div class="intensity-insights" id="intensityInsights">
                    <!-- Insights werden dynamisch gefüllt -->
                </div>
            </div>
            
            <div class="tab-content" id="progress-tab">
                <div class="chart-container">
                    <h3>Trainingsfortschritt</h3>
                    <canvas id="progressChart"></canvas>
                </div>
                <div class="weekly-breakdown" id="weeklyBreakdown">
                    <!-- Wöchentliche Details -->
                </div>
            </div>
            
            <div class="tab-content" id="patterns-tab">
                <div class="patterns-grid" id="patternsContent">
                    <!-- Muster und Insights -->
                </div>
            </div>
        </div>
    `;
    
    // Initialize tabs
    initializeTabs();
    
    // Initialize period selector
    initializePeriodSelector();
    
    // Load initial data
    await loadAnalyticsData(currentPeriod);
}

function initializeTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active states
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(`${btn.dataset.tab}-tab`).classList.add('active');
        });
    });
}

function initializePeriodSelector() {
    const periodBtns = document.querySelectorAll('.period-btn');
    
    periodBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            periodBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentPeriod = btn.dataset.period;
            await loadAnalyticsData(currentPeriod);
        });
    });
}

async function loadAnalyticsData(period) {
    // Calculate date range based on period
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999); // Ende des heutigen Tages
    
    const startDate = new Date();
    
    switch(period) {
        case 'week':
            // Letzte 7 Tage (nicht aktuelle Woche!)
            startDate.setDate(endDate.getDate() - 6); // -6 damit wir 7 Tage haben
            startDate.setHours(0, 0, 0, 0);
            break;
        case 'month':
            // Letzte 30 Tage
            startDate.setDate(endDate.getDate() - 29); // -29 damit wir 30 Tage haben
            startDate.setHours(0, 0, 0, 0);
            break;
        case 'all':
            startDate.setFullYear(2025, 5, 2); // 2. Juni 2025
            startDate.setHours(0, 0, 0, 0);
            break;
    }
    
    console.log('Analytics Period:', period);
    console.log('Start Date:', startDate.toLocaleDateString('de-DE'));
    console.log('End Date:', endDate.toLocaleDateString('de-DE'));
    
    // Fetch data
    const [trainings, zoneDistribution] = await Promise.all([
        API.getTrainingsByRange(startDate.toISOString(), endDate.toISOString()),
        API.getZoneDistribution(startDate.toISOString(), endDate.toISOString())
    ]);
    
    console.log('Trainings found:', trainings.length);
    
    // Update stats overview
    updateStatsOverview(trainings, zoneDistribution);
    
    // Create charts
    createTypeChart(trainings);
    createZoneChart(zoneDistribution);
    createIntensityChart(trainings);
    createProgressChart(trainings);
    
    // Load patterns
    loadPatterns(trainings);
}

function updateStatsOverview(trainings, zoneDistribution) {
    const completedTrainings = trainings.filter(t => t.completed && t.type !== 'Ruhe');
    const totalDuration = completedTrainings.reduce((sum, t) => sum + (t.duration || 0), 0);
    const totalScore = completedTrainings.reduce((sum, t) => sum + (t.score || 0), 0);
    const avgRating = completedTrainings.length > 0 
        ? (completedTrainings.reduce((sum, t) => sum + (t.rating || 0), 0) / completedTrainings.length).toFixed(1)
        : 0;
    
    // Calculate intensity distribution
    const totalZoneTime = Object.values(zoneDistribution).reduce((sum, time) => sum + time, 0);
    const z1z2Percentage = totalZoneTime > 0 
        ? Math.round(((zoneDistribution.zone1 + zoneDistribution.zone2) / totalZoneTime) * 100)
        : 0;
    
    // Period label
    const periodLabel = currentPeriod === 'week' ? 'Letzte 7 Tage' : 
                       currentPeriod === 'month' ? 'Letzte 30 Tage' : 
                       'Gesamt';
    
    const statsHTML = `
        <div class="stat-box">
            <div class="stat-icon"><i class="fas fa-dumbbell"></i></div>
            <div class="stat-info">
                <div class="stat-value">${completedTrainings.length}</div>
                <div class="stat-label">Trainings</div>
            </div>
        </div>
        <div class="stat-box">
            <div class="stat-icon"><i class="fas fa-clock"></i></div>
            <div class="stat-info">
                <div class="stat-value">${formatDuration(totalDuration)}</div>
                <div class="stat-label">Gesamtzeit</div>
            </div>
        </div>
        <div class="stat-box">
            <div class="stat-icon"><i class="fas fa-fire"></i></div>
            <div class="stat-info">
                <div class="stat-value">${totalScore}</div>
                <div class="stat-label">Score</div>
            </div>
        </div>
        <div class="stat-box">
            <div class="stat-icon"><i class="fas fa-star"></i></div>
            <div class="stat-info">
                <div class="stat-value">${avgRating}</div>
                <div class="stat-label">⌀ Bewertung</div>
            </div>
        </div>
        <div class="stat-box">
            <div class="stat-icon"><i class="fas fa-heart"></i></div>
            <div class="stat-info">
                <div class="stat-value">${z1z2Percentage}%</div>
                <div class="stat-label">GA1/GA2</div>
            </div>
        </div>
    `;
    
    document.getElementById('analyticsStats').innerHTML = statsHTML;
}

function createTypeChart(trainings) {
    const ctx = document.getElementById('typeChart').getContext('2d');
    
    // Calculate totals by type
    const typeTotals = {
        R: { duration: 0, count: 0 },
        L: { duration: 0, count: 0 },
        S: { duration: 0, count: 0 },
        K: { duration: 0, count: 0 },
        RL: { duration: 0, count: 0 }
    };
    
    trainings.forEach(training => {
        if (training.completed && training.type !== 'Ruhe' && training.type !== 'Wettkampf') {
            if (typeTotals[training.type]) {
                typeTotals[training.type].duration += training.duration || 0;
                typeTotals[training.type].count += 1;
            }
        }
    });
    
    // Destroy existing chart
    if (charts.type) {
        charts.type.destroy();
    }
    
    charts.type = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Radfahren', 'Laufen', 'Schwimmen', 'Kraft', 'Koppel'],
            datasets: [{
                data: [
                    typeTotals.R.duration,
                    typeTotals.L.duration,
                    typeTotals.S.duration,
                    typeTotals.K.duration,
                    typeTotals.RL.duration
                ],
                backgroundColor: [
                    getTrainingTypeColor('R'),
                    getTrainingTypeColor('L'),
                    getTrainingTypeColor('S'),
                    getTrainingTypeColor('K'),
                    getTrainingTypeColor('RL')
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const type = ['R', 'L', 'S', 'K', 'RL'][context.dataIndex];
                            const minutes = context.parsed;
                            const count = typeTotals[type].count;
                            return `${context.label}: ${formatDuration(minutes)} (${count} Einheiten)`;
                        }
                    }
                }
            }
        }
    });
}

function createZoneChart(distribution) {
    const ctx = document.getElementById('zoneChart').getContext('2d');
    
    // Destroy existing chart
    if (charts.zone) {
        charts.zone.destroy();
    }
    
    const totalTime = Object.values(distribution).reduce((sum, time) => sum + time, 0);
    
    charts.zone = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Zone 1', 'Zone 2', 'Zone 3', 'Zone 4', 'Zone 5'],
            datasets: [{
                label: 'Minuten',
                data: [
                    distribution.zone1,
                    distribution.zone2,
                    distribution.zone3,
                    distribution.zone4,
                    distribution.zone5
                ],
                backgroundColor: [
                    '#10b981',
                    '#3b82f6',
                    '#f59e0b',
                    '#ef4444',
                    '#7c3aed'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Minuten'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        afterLabel: function(context) {
                            if (totalTime > 0) {
                                const percentage = ((context.parsed.y / totalTime) * 100).toFixed(1);
                                return `${percentage}% der Gesamtzeit`;
                            }
                            return '';
                        }
                    }
                }
            }
        }
    });
}

function createIntensityChart(trainings) {
    const ctx = document.getElementById('intensityChart');
    if (!ctx) return;
    
    // Group by week and calculate intensity
    const weeklyIntensity = {};
    
    trainings.forEach(training => {
        if (training.completed) {
            const week = training.week;
            if (!weeklyIntensity[week]) {
                weeklyIntensity[week] = {
                    lowIntensity: 0, // Zone 1-2
                    moderate: 0, // Zone 3
                    highIntensity: 0, // Zone 4-5
                    totalScore: 0,
                    count: 0
                };
            }
            
            weeklyIntensity[week].lowIntensity += (training.zone1 || 0) + (training.zone2 || 0);
            weeklyIntensity[week].moderate += training.zone3 || 0;
            weeklyIntensity[week].highIntensity += (training.zone4 || 0) + (training.zone5 || 0);
            weeklyIntensity[week].totalScore += training.score || 0;
            weeklyIntensity[week].count += 1;
        }
    });
    
    const weeks = Object.keys(weeklyIntensity).sort((a, b) => a - b);
    
    if (charts.intensity) {
        charts.intensity.destroy();
    }
    
    charts.intensity = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: weeks.map(w => `Woche ${w}`),
            datasets: [
                {
                    label: 'Niedrig (Z1-2)',
                    data: weeks.map(w => weeklyIntensity[w].lowIntensity),
                    backgroundColor: '#10b981'
                },
                {
                    label: 'Mittel (Z3)',
                    data: weeks.map(w => weeklyIntensity[w].moderate),
                    backgroundColor: '#f59e0b'
                },
                {
                    label: 'Hoch (Z4-5)',
                    data: weeks.map(w => weeklyIntensity[w].highIntensity),
                    backgroundColor: '#ef4444'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true,
                    title: {
                        display: true,
                        text: 'Minuten'
                    }
                }
            }
        }
    });
    
    // Add insights
    const insights = analyzeIntensity(weeklyIntensity);
    document.getElementById('intensityInsights').innerHTML = insights;
}

function analyzeIntensity(weeklyData) {
    const weeks = Object.keys(weeklyData);
    if (weeks.length === 0) return '<p>Noch keine Daten vorhanden</p>';
    
    // Calculate averages
    let totalLow = 0, totalMod = 0, totalHigh = 0;
    weeks.forEach(week => {
        totalLow += weeklyData[week].lowIntensity;
        totalMod += weeklyData[week].moderate;
        totalHigh += weeklyData[week].highIntensity;
    });
    
    const total = totalLow + totalMod + totalHigh;
    const lowPercent = total > 0 ? Math.round((totalLow / total) * 100) : 0;
    const modPercent = total > 0 ? Math.round((totalMod / total) * 100) : 0;
    const highPercent = total > 0 ? Math.round((totalHigh / total) * 100) : 0;
    
    // Polarized training check (80/20 rule)
    const isPolarized = lowPercent >= 75 && highPercent <= 25;
    
    return `
        <div class="insight-card">
            <h4>Intensitätsverteilung</h4>
            <div class="intensity-breakdown">
                <div class="intensity-bar">
                    <div class="bar-segment low" style="width: ${lowPercent}%">${lowPercent}%</div>
                    <div class="bar-segment mod" style="width: ${modPercent}%">${modPercent}%</div>
                    <div class="bar-segment high" style="width: ${highPercent}%">${highPercent}%</div>
                </div>
            </div>
            <p class="insight-text">
                ${isPolarized 
                    ? '✅ Gute polarisierte Trainingsverteilung!' 
                    : '⚠️ Überprüfe deine Intensitätsverteilung - Ziel: 80% niedrig, 20% hoch'}
            </p>
        </div>
    `;
}

function createProgressChart(trainings) {
    const ctx = document.getElementById('progressChart');
    if (!ctx) return;
    
    // Group by week
    const weeklyData = {};
    trainings.forEach(training => {
        if (training.completed) {
            const week = training.week;
            if (!weeklyData[week]) {
                weeklyData[week] = {
                    duration: 0,
                    score: 0,
                    count: 0,
                    avgRating: 0,
                    ratings: []
                };
            }
            weeklyData[week].duration += training.duration || 0;
            weeklyData[week].score += training.score || 0;
            weeklyData[week].count += 1;
            if (training.rating) weeklyData[week].ratings.push(training.rating);
        }
    });
    
    // Calculate averages
    Object.keys(weeklyData).forEach(week => {
        const ratings = weeklyData[week].ratings;
        weeklyData[week].avgRating = ratings.length > 0 
            ? ratings.reduce((a, b) => a + b) / ratings.length 
            : 0;
    });
    
    const weeks = Object.keys(weeklyData).sort((a, b) => a - b);
    
    if (charts.progress) {
        charts.progress.destroy();
    }
    
    charts.progress = new Chart(ctx, {
        type: 'line',
        data: {
            labels: weeks.map(w => `W${w}`),
            datasets: [
                {
                    label: 'Wochenscore',
                    data: weeks.map(w => weeklyData[w].score),
                    borderColor: '#0969da',
                    backgroundColor: 'rgba(9, 105, 218, 0.1)',
                    yAxisID: 'y',
                    tension: 0.3
                },
                {
                    label: 'Trainingszeit (h)',
                    data: weeks.map(w => Math.round(weeklyData[w].duration / 60 * 10) / 10),
                    borderColor: '#1a7f37',
                    backgroundColor: 'rgba(26, 127, 55, 0.1)',
                    yAxisID: 'y1',
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Score'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Stunden'
                    },
                    grid: {
                        drawOnChartArea: false,
                    },
                }
            }
        }
    });
    
    // Add weekly breakdown
    const breakdownHTML = weeks.map(week => {
        const data = weeklyData[week];
        return `
            <div class="week-card">
                <h4>Woche ${week}</h4>
                <div class="week-stats">
                    <span>${data.count} Trainings</span>
                    <span>${formatDuration(data.duration)}</span>
                    <span>⌀ ${data.avgRating.toFixed(1)} ⭐</span>
                </div>
            </div>
        `;
    }).join('');
    
    document.getElementById('weeklyBreakdown').innerHTML = breakdownHTML;
}

function loadPatterns(trainings) {
    // Analyze training patterns
    const patterns = analyzePatterns(trainings);
    
    const patternsHTML = `
        <div class="pattern-card">
            <h4><i class="fas fa-calendar-day"></i> Beste Trainingstage</h4>
            <p>${patterns.bestDays.join(', ') || 'Noch keine Muster erkennbar'}</p>
        </div>
        
        <div class="pattern-card">
            <h4><i class="fas fa-clock"></i> Durchschnittliche Trainingsdauer</h4>
            <p>${formatDuration(patterns.avgDuration)} pro Einheit</p>
        </div>
        
        <div class="pattern-card">
            <h4><i class="fas fa-fire-alt"></i> Höchster Wochenscore</h4>
            <p>${patterns.maxWeekScore} in Woche ${patterns.maxWeekNumber}</p>
        </div>
        
        <div class="pattern-card">
            <h4><i class="fas fa-trophy"></i> Längste Serie</h4>
            <p>${patterns.longestStreak} Tage am Stück</p>
        </div>
        
        <div class="pattern-card">
            <h4><i class="fas fa-heart"></i> Lieblingssportart</h4>
            <p>${patterns.favoriteSport} (${patterns.favoriteSportCount} Einheiten)</p>
        </div>
        
        <div class="pattern-card">
            <h4><i class="fas fa-bed"></i> Erholungsmuster</h4>
            <p>${patterns.avgRestDays} Ruhetage pro Woche</p>
        </div>
    `;
    
    document.getElementById('patternsContent').innerHTML = patternsHTML;
}

function analyzePatterns(trainings) {
    const patterns = {
        bestDays: [],
        avgDuration: 0,
        maxWeekScore: 0,
        maxWeekNumber: 0,
        longestStreak: 0,
        favoriteSport: '',
        favoriteSportCount: 0,
        avgRestDays: 0
    };
    
    if (trainings.length === 0) return patterns;
    
    // Analyze day patterns
    const dayStats = {};
    const weekStats = {};
    const sportCounts = {};
    let currentStreak = 0;
    let lastDate = null;
    
    trainings.sort((a, b) => new Date(a.date) - new Date(b.date)).forEach(training => {
        const date = new Date(training.date);
        const dayName = date.toLocaleDateString('de-DE', { weekday: 'long' });
        const week = training.week;
        
        // Day analysis
        if (!dayStats[dayName]) dayStats[dayName] = { count: 0, totalRating: 0 };
        if (training.completed) {
            dayStats[dayName].count++;
            dayStats[dayName].totalRating += training.rating || 0;
        }
        
        // Week analysis
        if (!weekStats[week]) weekStats[week] = { score: 0, restDays: 0 };
        if (training.completed) {
            weekStats[week].score += training.score || 0;
        } else if (training.type === 'Ruhe') {
            weekStats[week].restDays++;
        }
        
        // Sport counts
        if (training.completed && training.type !== 'Ruhe') {
            sportCounts[training.type] = (sportCounts[training.type] || 0) + 1;
        }
        
        // Streak calculation
        if (training.completed) {
            if (lastDate) {
                const dayDiff = (date - lastDate) / (1000 * 60 * 60 * 24);
                if (dayDiff <= 1) {
                    currentStreak++;
                } else {
                    patterns.longestStreak = Math.max(patterns.longestStreak, currentStreak);
                    currentStreak = 1;
                }
            } else {
                currentStreak = 1;
            }
            lastDate = date;
        }
    });
    
    patterns.longestStreak = Math.max(patterns.longestStreak, currentStreak);
    
    // Find best training days
    const sortedDays = Object.entries(dayStats)
        .filter(([_, stats]) => stats.count > 0)
        .sort((a, b) => {
            const avgA = a[1].totalRating / a[1].count;
            const avgB = b[1].totalRating / b[1].count;
            return avgB - avgA;
        });
    patterns.bestDays = sortedDays.slice(0, 2).map(([day]) => day);
    
    // Calculate average duration
    const completedTrainings = trainings.filter(t => t.completed);
    if (completedTrainings.length > 0) {
        const totalDuration = completedTrainings.reduce((sum, t) => sum + (t.duration || 0), 0);
        patterns.avgDuration = Math.round(totalDuration / completedTrainings.length);
    }
    
    // Find max week score
    Object.entries(weekStats).forEach(([week, stats]) => {
        if (stats.score > patterns.maxWeekScore) {
            patterns.maxWeekScore = stats.score;
            patterns.maxWeekNumber = week;
        }
    });
    
    // Find favorite sport
    const favSport = Object.entries(sportCounts).sort((a, b) => b[1] - a[1])[0];
    if (favSport) {
        patterns.favoriteSport = getTrainingTypeName(favSport[0]);
        patterns.favoriteSportCount = favSport[1];
    }
    
    // Calculate average rest days
    const totalRestDays = Object.values(weekStats).reduce((sum, w) => sum + w.restDays, 0);
    patterns.avgRestDays = (totalRestDays / Object.keys(weekStats).length).toFixed(1);
    
    return patterns;
}