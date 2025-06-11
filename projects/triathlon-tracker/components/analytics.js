// components/analytics.js
import { API } from '../utils/api.js';
import { getTrainingTypeColor, getTrainingTypeName } from '../utils/helpers.js';

let charts = {
    zone: null,
    type: null,
    progress: null
};

export async function renderAnalytics() {
    const template = document.getElementById('analyticsTemplate');
    const content = template.content.cloneNode(true);
    
    const contentArea = document.getElementById('contentArea');
    contentArea.appendChild(content);
    
    // Load analytics data
    await loadAnalyticsData();
}

async function loadAnalyticsData() {
    // Get date range (last 4 weeks)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 28);
    
    // Fetch data
    const [trainings, zoneDistribution] = await Promise.all([
        API.getTrainingsByRange(startDate.toISOString(), endDate.toISOString()),
        API.getZoneDistribution(startDate.toISOString(), endDate.toISOString())
    ]);
    
    // Create charts
    createZoneChart(zoneDistribution);
    createTypeChart(trainings);
    createProgressChart(trainings);
}

function createZoneChart(distribution) {
    const ctx = document.getElementById('zoneChart').getContext('2d');
    
    // Destroy existing chart
    if (charts.zone) {
        charts.zone.destroy();
    }
    
    charts.zone = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Zone 1', 'Zone 2', 'Zone 3', 'Zone 4', 'Zone 5'],
            datasets: [{
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
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return `${context.label}: ${context.parsed} min (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

function createTypeChart(trainings) {
    const ctx = document.getElementById('typeChart').getContext('2d');
    
    // Calculate totals by type
    const typeTotals = {
        R: 0,
        L: 0,
        S: 0,
        K: 0,
        RL: 0
    };
    
    trainings.forEach(training => {
        if (training.completed && training.type !== 'Ruhe' && training.type !== 'Wettkampf') {
            if (typeTotals.hasOwnProperty(training.type)) {
                typeTotals[training.type] += training.duration || 0;
            }
        }
    });
    
    // Destroy existing chart
    if (charts.type) {
        charts.type.destroy();
    }
    
    charts.type = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Radfahren', 'Laufen', 'Schwimmen', 'Kraft', 'Koppel'],
            datasets: [{
                label: 'Trainingszeit (Minuten)',
                data: [typeTotals.R, typeTotals.L, typeTotals.S, typeTotals.K, typeTotals.RL],
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
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function createProgressChart(trainings) {
    const ctx = document.getElementById('progressChart').getContext('2d');
    
    // Group by week and calculate weekly scores
    const weeklyData = {};
    trainings.forEach(training => {
        if (training.completed) {
            const week = training.week;
            if (!weeklyData[week]) {
                weeklyData[week] = {
                    score: 0,
                    duration: 0,
                    count: 0
                };
            }
            weeklyData[week].score += training.score || 0;
            weeklyData[week].duration += training.duration || 0;
            weeklyData[week].count += 1;
        }
    });
    
    // Sort weeks and prepare data
    const weeks = Object.keys(weeklyData).sort((a, b) => a - b);
    const scores = weeks.map(week => weeklyData[week].score);
    const durations = weeks.map(week => weeklyData[week].duration);
    
    // Destroy existing chart
    if (charts.progress) {
        charts.progress.destroy();
    }
    
    charts.progress = new Chart(ctx, {
        type: 'line',
        data: {
            labels: weeks.map(w => `Woche ${w}`),
            datasets: [
                {
                    label: 'Wochenscore',
                    data: scores,
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    yAxisID: 'y',
                    tension: 0.1
                },
                {
                    label: 'Trainingszeit (min)',
                    data: durations,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    yAxisID: 'y1',
                    tension: 0.1
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
                        text: 'Minuten'
                    },
                    grid: {
                        drawOnChartArea: false,
                    },
                }
            }
        }
    });
}