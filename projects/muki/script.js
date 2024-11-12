// Daten für Charts und Leaderboards
const monthlyPoints = [
    { month: 'Jan', points: 220 },
    { month: 'Feb', points: 240 },
    { month: 'Mar', points: 210 },
    { month: 'Apr', points: 275 },
    { month: 'Mai', points: 290 },
    { month: 'Jun', points: 275 }
];

const userLeaderboard = [
    { name: 'Sarah Meyer', points: 2900, department: 'IT', rank: 1 },
    { name: 'Thomas Schmidt', points: 2850, department: 'Marketing', rank: 2 },
    { name: 'Lisa Weber', points: 2800, department: 'HR', rank: 3 }
];

const departmentLeaderboard = [
    { name: 'IT-Abteilung', points: 8500, members: 12, rank: 1 },
    { name: 'Marketing', points: 8200, members: 8, rank: 2 },
    { name: 'Personal', points: 7900, members: 10, rank: 3 }
];

// Punkteverlauf Chart initialisieren
// Daten für verschiedene Zeiträume
const chartData = {
    '6': [
        { month: 'Jun', points: 220 },
        { month: 'Jul', points: 240 },
        { month: 'Aug', points: 210 },
        { month: 'Sep', points: 275 },
        { month: 'Okt', points: 290 },
        { month: 'Nov', points: 275 }
    ],
    '3': [
        { month: 'Sep', points: 275 },
        { month: 'Okt', points: 290 },
        { month: 'Nov', points: 275 }
    ],
    '1': [
        { month: 'Woche 1', points: 65 },
        { month: 'Woche 2', points: 70 },
        { month: 'Woche 3', points: 85 },
        { month: 'Woche 4', points: 55 }
    ]
};

let currentChart = null;

// Funktion zum Erstellen/Aktualisieren des Charts
function updateChart(period) {
    const ctx = document.getElementById('monthlyChart').getContext('2d');
    
    // Wenn es bereits ein Chart gibt, zerstöre es
    if (currentChart) {
        currentChart.destroy();
    }

    const data = chartData[period];
    
    currentChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(item => item.month),
            datasets: [{
                label: 'Punkte',
                data: data.map(item => item.points),
                backgroundColor: '#3b82f6',
                borderRadius: 6,
                maxBarThickness: 40,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'white',
                    titleColor: '#1a1a1a',
                    bodyColor: '#1a1a1a',
                    borderColor: '#e5e7eb',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return `${context.parsed.y} Punkte`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        drawBorder: false,
                        color: '#e5e7eb'
                    },
                    ticks: {
                        font: {
                            size: 12
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 12
                        }
                    }
                }
            }
        }
    });
}

// Event Listener für die Buttons
document.addEventListener('DOMContentLoaded', function() {
    const timeButtons = document.querySelectorAll('.time-button');
    
    // Initial Chart mit 6 Monaten
    updateChart('6');

    timeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Aktiven Button-Status aktualisieren
            timeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Chart aktualisieren
            const period = this.dataset.period;
            updateChart(period);
        });
    });
});

// Responsiveness
window.addEventListener('resize', () => {
    const activePeriod = document.querySelector('.time-button.active').dataset.period;
    updateChart(activePeriod);
});

// Leaderboards rendern
function renderLeaderboards() {
    // User Leaderboard
    const userLeaderboardEl = document.getElementById('userLeaderboard');
    userLeaderboard.forEach((user, index) => {
        const medalColor = index === 0 ? 'text-yellow-600 bg-yellow-100' : 
                          index === 1 ? 'text-gray-600 bg-gray-100' : 
                          'text-orange-600 bg-orange-100';
        
        userLeaderboardEl.innerHTML += `
            <div class="leaderboard-item">
                <div class="rank-icon ${medalColor}">
                    <i class="fas fa-crown"></i>
                </div>
                <div class="user-info">
                    <div class="name-department">
                        <span class="name">${user.name}</span>
                        <span class="department">${user.department}</span>
                    </div>
                    <div class="points">${user.points} Punkte</div>
                </div>
                <div class="rank">#${user.rank}</div>
            </div>
        `;
    });

    // Department Leaderboard
    const departmentLeaderboardEl = document.getElementById('departmentLeaderboard');
    departmentLeaderboard.forEach((dept, index) => {
        const medalColor = index === 0 ? 'text-yellow-600 bg-yellow-100' : 
                          index === 1 ? 'text-gray-600 bg-gray-100' : 
                          'text-orange-600 bg-orange-100';
        
        departmentLeaderboardEl.innerHTML += `
            <div class="leaderboard-item">
                <div class="rank-icon ${medalColor}">
                    <i class="fas fa-users"></i>
                </div>
                <div class="department-info">
                    <div class="name">${dept.name}</div>
                    <div class="details">${dept.members} Mitarbeiter • ${dept.points} Punkte</div>
                </div>
                <div class="rank">#${dept.rank}</div>
            </div>
        `;
    });
}

// Quiz Funktionalität
function initializeQuiz() {
    const quizForm = document.querySelector('.quiz-content');
    quizForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Hier können Sie die Quiz-Auswertung implementieren
        alert('Quiz erfolgreich eingereicht! +100 Punkte');
    });
}

// Feedback Funktionalität
function initializeFeedback() {
    const feedbackForm = document.querySelector('.feedback-form');
    feedbackForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Hier können Sie die Feedback-Verarbeitung implementieren
        alert('Feedback erfolgreich gesendet! +50 Punkte');
    });
}

// Level Progress Animation
function updateLevelProgress() {
    const progressBar = document.querySelector('.progress-fill');
    const currentExp = 175;
    const nextLevel = 200;
    const percentage = (currentExp / nextLevel) * 100;
    progressBar.style.width = `${percentage}%`;
}

// Hover Effekte für Stat Cards
function initializeStatCards() {
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-2px)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
}

// Initialisierung aller Komponenten
document.addEventListener('DOMContentLoaded', () => {
    initializeChart();
    renderLeaderboards();
    initializeQuiz();
    initializeFeedback();
    updateLevelProgress();
    initializeStatCards();

    // Zusätzliche Animationen für ein smootheres Erlebnis
    document.querySelectorAll('.stat-value').forEach(el => {
        el.style.opacity = '0';
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transition = 'opacity 0.5s ease';
        }, 100);
    });
});

// Responsives Verhalten
window.addEventListener('resize', () => {
    // Chart neu zeichnen bei Größenänderung
    initializeChart();
});