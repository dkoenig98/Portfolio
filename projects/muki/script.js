// ================ Daten & Konfiguration ================
const monthlyPoints = [
    { month: 'Jan', points: 30 },
    { month: 'Feb', points: 25 },
    { month: 'Mar', points: 20 },
    { month: 'Apr', points: 25 },
    { month: 'Mai', points: 30 },
    { month: 'Jun', points: 35 }
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

const comparisonData = {
    '6': [
        { month: 'Jun', avgPoints: 25 },
        { month: 'Jul', avgPoints: 35 },
        { month: 'Aug', avgPoints: 32 },
        { month: 'Sep', avgPoints: 45 },
        { month: 'Okt', avgPoints: 42 },
        { month: 'Nov', avgPoints: 48 }
    ],
    '3': [
        { month: 'Sep', avgPoints: 45 },
        { month: 'Okt', avgPoints: 42 },
        { month: 'Nov', avgPoints: 48 }
    ],
    '1': [
        { month: 'Woche 1', avgPoints: 12 },
        { month: 'Woche 2', avgPoints: 18 },
        { month: 'Woche 3', avgPoints: 22 },
        { month: 'Woche 4', avgPoints: 16 }
    ]
};

const chartConfig = {
    data: {
        '6': [
            {
                month: 'Jun',
                points: 30,
                activities: [
                    { type: 'phishing', text: 'Phishing Mail erkannt', points: 15 },
                    { type: 'training', text: 'Security Basic Training', points: 10 },
                    { type: 'quiz', text: 'Monatliches Quiz', points: 5 }
                ]
            },
            {
                month: 'Jul',
                points: 45,
                activities: [
                    { type: 'phishing', text: '2 Phishing Mails erkannt', points: 20 },
                    { type: 'training', text: 'Advanced Security Training', points: 15 },
                    { type: 'quiz', text: 'Security Champion Quiz', points: 10 }
                ]
            },
            {
                month: 'Aug',
                points: 40,
                activities: [
                    { type: 'phishing', text: 'Phishing Kampagne gestoppt', points: 25 },
                    { type: 'training', text: 'Password Security Training', points: 10 },
                    { type: 'quiz', text: 'Monatliches Quiz', points: 5 }
                ]
            },
            {
                month: 'Sep',
                points: 55,
                activities: [
                    { type: 'phishing', text: '3 Phishing Mails erkannt', points: 30 },
                    { type: 'training', text: 'Mobile Security Training', points: 15 },
                    { type: 'quiz', text: 'Advanced Security Quiz', points: 10 }
                ]
            },
            {
                month: 'Okt',
                points: 50,
                activities: [
                    { type: 'phishing', text: '2 Phishing Mails erkannt', points: 20 },
                    { type: 'training', text: 'Data Protection Training', points: 20 },
                    { type: 'quiz', text: 'Monthly Security Quiz', points: 10 }
                ]
            },
            {
                month: 'Nov',
                points: 65,
                activities: [
                    { type: 'phishing', text: 'Kritische Phishing Kampagne erkannt', points: 35 },
                    { type: 'training', text: 'Advanced Security Workshop', points: 20 },
                    { type: 'quiz', text: 'Security Expert Quiz', points: 10 }
                ]
            }
        ],
        '3': [
            {
                month: 'Sep',
                points: 55,
                activities: [
                    { type: 'phishing', text: '3 Phishing Mails erkannt', points: 30 },
                    { type: 'training', text: 'Mobile Security Training', points: 15 },
                    { type: 'quiz', text: 'Advanced Security Quiz', points: 10 }
                ]
            },
            {
                month: 'Okt',
                points: 50,
                activities: [
                    { type: 'phishing', text: '2 Phishing Mails erkannt', points: 20 },
                    { type: 'training', text: 'Data Protection Training', points: 20 },
                    { type: 'quiz', text: 'Monthly Security Quiz', points: 10 }
                ]
            },
            {
                month: 'Nov',
                points: 65,
                activities: [
                    { type: 'phishing', text: 'Kritische Phishing Kampagne erkannt', points: 35 },
                    { type: 'training', text: 'Advanced Security Workshop', points: 20 },
                    { type: 'quiz', text: 'Security Expert Quiz', points: 10 }
                ]
            }
        ],
        '1': [
            {
                month: 'Woche 1',
                points: 15,
                activities: [
                    { type: 'phishing', text: 'Phishing Mail erkannt', points: 15 }
                ]
            },
            {
                month: 'Woche 2',
                points: 20,
                activities: [
                    { type: 'quiz', text: 'Security Quiz', points: 20 }
                ]
            },
            {
                month: 'Woche 3',
                points: 25,
                activities: [
                    { type: 'training', text: 'Mini-Training', points: 25 }
                ]
            },
            {
                month: 'Woche 4',
                points: 15,
                activities: [
                    { type: 'phishing', text: 'Phishing Mail erkannt', points: 15 }
                ]
            }
        ]
    }
};

// ================ Chart Funktionen ================
let currentChart = null;

function calculateStats(data) {
    const points = data.map(d => d.points);
    const average = points.reduce((a, b) => a + b, 0) / points.length;
    const lastTwo = points.slice(-2);
    const trend = ((lastTwo[1] - lastTwo[0]) / lastTwo[0]) * 100;
    
    return {
        average: average,
        trend: trend,
        comparisonToAvg: ((points[points.length - 1] - comparisonData['6'][comparisonData['6'].length - 1].avgPoints) / 
                          comparisonData['6'][comparisonData['6'].length - 1].avgPoints) * 100
    };
}


function createGradient(ctx) {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(37, 99, 235, 1)');    // Dunkelblau oben
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0.5)'); // Hellblau unten
    return gradient;
}

function updateChart(period) {
    const ctx = document.getElementById('monthlyChart').getContext('2d');
    const data = chartConfig.data[period];
    const avgData = comparisonData[period];
    const stats = calculateStats(data);
	
	const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const gridColor = isDark ? '#374151' : '#e5e7eb';
    const textColor = isDark ? '#9ca3af' : '#6b7280';
    
    // Prüfen ob mobiles Gerät
    const isMobile = window.innerWidth < 768;
    
    if (currentChart) {
        currentChart.destroy();
    }

    const barGradient = createGradient(ctx);
    const avgGradient = ctx.createLinearGradient(0, 0, 0, 400);
    avgGradient.addColorStop(0, 'rgba(196, 181, 253, 0.8)');
    avgGradient.addColorStop(1, 'rgba(196, 181, 253, 0.2)');

    currentChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(item => isMobile ? item.month.substring(0, 3) : item.month), // Kürzere Labels auf Mobile
            datasets: [
                {
                    label: 'Deine Punkte',
                    data: data.map(item => item.points),
                    backgroundColor: barGradient,
                    borderRadius: 8,
                    borderSkipped: false,
                    barThickness: isMobile ? 20 : 40, // Dünnere Balken auf Mobile
                    order: 1
                },
                {
                    label: 'Durchschnitt muki',
                    data: avgData.map(item => item.avgPoints),
                    backgroundColor: avgGradient,
                    borderRadius: 8,
                    borderSkipped: false,
                    barThickness: isMobile ? 20 : 40, // Dünnere Balken auf Mobile
                    order: 2
                },
                {
                    label: 'Dein Durchschnitt',
                    data: Array(data.length).fill(stats.average),
                    type: 'line',
                    borderColor: '#6b7280',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    pointRadius: 0,
                    fill: false,
                    order: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            animation: {
                duration: 750,
                easing: 'easeInOutQuart'
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'white',
                    titleColor: '#1a1a1a',
                    bodyColor: '#6b7280',
                    borderColor: '#e5e7eb',
                    borderWidth: 1,
                    padding: isMobile ? 12 : {
                        top: 12,
                        right: 16,
                        bottom: 12,
                        left: 16
                    },
                    displayColors: false,
                    titleFont: {
                        size: isMobile ? 12 : 14,
                        weight: '600',
                        family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif'
                    },
                    bodyFont: {
                        size: isMobile ? 11 : 13,
                        family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif'
                    },
                    cornerRadius: 6,
                    callbacks: {
                        title: function(tooltipItems) {
                            return tooltipItems[0].label;
                        },
                        label: function(context) {
                            if (context.dataset.type === 'line') {
                                return `Dein Ø: ${context.raw} P`;  // Kürzerer Text auf Mobile
                            }
                            
                            if (context.datasetIndex === 0) {
                                return `Punkte: ${context.raw} P`;  // Kürzerer Text auf Mobile
                            }
                            
                            return `Muki Ø: ${context.raw} P`;  // Kürzerer Text auf Mobile
                        },
                        labelTextColor: function(context) {
                            if (context.dataset.type === 'line') {
                                return '#6b7280';
                            }
                            if (context.datasetIndex === 0) {
                                return '#2563eb';
                            }
                            return 'rgba(196, 181, 253, 1)';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: gridColor,
                        drawBorder: false
                    },
                    ticks: {
                        font: { 
                            size: isMobile ? 10 : 12,
                            family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif'
                        },
                        padding: isMobile ? 4 : 10,
                        callback: value => isMobile ? value : value + ' P',
                        maxTicksLimit: isMobile ? 6 : undefined // Weniger Ticks auf Mobile
                    }
                },
                x: {
                    grid: {
						color: gridColor,
                        display: false
                    },
                    ticks: {
						color: gridColor,
                        font: {
                            size: isMobile ? 10 : 12,
                            weight: '500',
                            family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif'
                        },
                        padding: isMobile ? 4 : 8,
                        maxRotation: isMobile ? 45 : 0, // Schräge Labels auf Mobile
                        minRotation: isMobile ? 45 : 0
                    }
                }
            }
        }
    });

    updateStats(stats);
}

// ================ UI Updates ================
function updateStats(stats) {
    const averageElement = document.querySelector('.stat-pill .value');
    const trendElement = document.querySelector('.stat-pill.trend .value');
    const trendPill = document.querySelector('.stat-pill.trend');

    
    if (averageElement) {
        averageElement.textContent = `${stats.average.toFixed(1)} Punkte`;
    }
    if (trendElement) {
        const trendValue = stats.trend.toFixed(1);
        trendElement.textContent = `${trendValue > 0 ? '+' : ''}${trendValue}%`;
        
        // Farbe basierend auf Trend setzen
        if (trendValue > 0) {
            trendPill.classList.add('positive');
            trendPill.classList.remove('negative');
        } else {
            trendPill.classList.add('negative');
            trendPill.classList.remove('positive');
        }
    }
    
    // Team Vergleich aktualisieren
    const comparisonElement = document.querySelector('.stat-pill.comparison .value');
    if (comparisonElement) {
        const comparisonValue = stats.comparisonToAvg.toFixed(1);
        comparisonElement.textContent = `${comparisonValue > 0 ? '+' : ''}${comparisonValue}% ${comparisonValue > 0 ? 'über' : 'unter'} Ø`;
    }
}

function renderLeaderboards() {
    // User Leaderboard
    const userLeaderboardEl = document.getElementById('userLeaderboard');
    if (userLeaderboardEl) {
        userLeaderboardEl.innerHTML = '';
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
    }

    // Department Leaderboard
    const departmentLeaderboardEl = document.getElementById('departmentLeaderboard');
    if (departmentLeaderboardEl) {
        departmentLeaderboardEl.innerHTML = '';
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
}

function updateLevelProgress() {
    const progressBar = document.querySelector('.progress-fill');
    if (progressBar) {
        const currentExp = 275;
        const nextLevel = 300;
        const percentage = (currentExp / nextLevel) * 100;
        progressBar.style.width = `${percentage}%`;
    }
}

function initializeQuiz() {
    const quizForm = document.querySelector('.quiz-content');
    if (quizForm) {
        quizForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Quiz erfolgreich eingereicht! +25 Punkte');
        });
    }
}

function initializeFeedback() {
    const feedbackForm = document.querySelector('.feedback-form');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Feedback erfolgreich gesendet! +25 Punkte');
        });
    }
}

function initializeStatCards() {
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-4px)';
            card.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.1)';
            card.style.transition = 'all 0.3s ease';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
        });
    });
}

function initializeChartCard() {
    const chartCard = document.querySelector('.chart-card');
    if (chartCard) {
        chartCard.addEventListener('mouseenter', () => {
            chartCard.style.transform = 'translateY(-4px)';
            chartCard.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.1)';
            chartCard.style.transition = 'all 0.3s ease';
        });
        
        chartCard.addEventListener('mouseleave', () => {
            chartCard.style.transform = 'translateY(0)';
            chartCard.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
        });
    }
}

// ================ Animation Funktionen ================
function initializeAnimations() {
    document.querySelectorAll('.stat-value').forEach(el => {
        el.style.opacity = '0';
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transition = 'opacity 0.5s ease';
        }, 100);
    });
}

// ================ Event Listener ================
document.addEventListener('DOMContentLoaded', function() {
    // Chart Initialisierung
    const chartButtons = document.querySelectorAll('.chart-button');
    updateChart('6');
    
    chartButtons.forEach(button => {
        button.addEventListener('click', function() {
            chartButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            updateChart(this.dataset.period);
        });
    });

    // Komponenten initialisieren
    initializeChartCard();
    renderLeaderboards();
    initializeQuiz();
    initializeFeedback();
    updateLevelProgress();
    initializeStatCards();
    initializeAnimations();
});

// ================ Responsive Verhalten ================
window.addEventListener('resize', () => {
    const activeButton = document.querySelector('.chart-button.active');
    if (activeButton) {
        updateChart(activeButton.dataset.period);
    }
});

// Back to Top Button Funktionalität
function initializeBackToTop() {
    const backToTopButton = document.getElementById('backToTop');
    
    // Button anzeigen/verstecken basierend auf Scroll-Position
    function toggleBackToTopButton() {
        if (window.pageYOffset > 300) {  // Button nach 300px Scroll anzeigen
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    }

    // Smooth Scroll nach oben
    function scrollToTop(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Event Listener
    window.addEventListener('scroll', toggleBackToTopButton);
    backToTopButton.addEventListener('click', scrollToTop);

    // Initial Check
    toggleBackToTopButton();
}

// Füge dies zur DOMContentLoaded Event Listener hinzu
document.addEventListener('DOMContentLoaded', function() {
    // Bestehende Initialisierungen...
    initializeBackToTop();
});

// Theme Management
function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
	const logo = document.getElementById('companyLogo');
    
    // Theme aus localStorage laden oder System-Präferenz nutzen
    function getInitialTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme;
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    // Theme setzen
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Logo mit Fade-Effekt wechseln
        if (logo) {
            logo.classList.add('switching');
            setTimeout(() => {
                logo.src = theme === 'dark' ? 'logo-dark.png' : 'logo.png';
                logo.classList.remove('switching');
            }, 150);
        }
        
        // Chart Farben aktualisieren
        if (currentChart) {
            const isDark = theme === 'dark';
            currentChart.options.scales.y.grid.color = isDark ? '#374151' : '#e5e7eb';
            currentChart.options.scales.y.ticks.color = isDark ? '#9ca3af' : '#6b7280';
            currentChart.options.scales.x.ticks.color = isDark ? '#9ca3af' : '#6b7280';
            currentChart.update();
        }
    }

    // Theme Toggle Handler
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    }

    // Initial Theme setzen
    setTheme(getInitialTheme());

    // Event Listener
    themeToggle.addEventListener('click', toggleTheme);
    
    // System Theme Changes überwachen
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });
}

// Füge dies zur bestehenden DOMContentLoaded hinzu
document.addEventListener('DOMContentLoaded', function() {
    // Bestehende Initialisierungen...
    initializeTheme();
});

