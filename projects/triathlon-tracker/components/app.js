// components/app.js
import { API } from '../utils/api.js';
import { formatDate, calculateRaceCountdown } from '../utils/helpers.js';
import { renderDashboard } from './dashboard.js';
import { renderToday } from './today.js';
import { renderCalendar } from './calendar.js';
import { renderAnalytics } from './analytics.js';
import { renderSettings } from './import.js';
import { initTrainingForm } from './logger.js';

let currentView = 'dashboard';
const contentArea = document.getElementById('contentArea');

export function initApp() {
    // Initialize navigation
    initNavigation();
    
    // Initialize race countdown
    updateRaceCountdown();
    setInterval(updateRaceCountdown, 60000); // Update every minute
    
    // Initialize training form
    initTrainingForm();
    
    // Load initial view
    loadView('dashboard');
}

function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const view = item.dataset.view;
            
            // Update active state
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            // Load view
            loadView(view);
        });
    });
}

function loadView(view) {
    currentView = view;
    
    // Clear content
    contentArea.innerHTML = '';
    
    // Load appropriate view
    switch(view) {
        case 'dashboard':
            renderDashboard();
            break;
        case 'today':
            renderToday();
            break;
        case 'calendar':
            renderCalendar();
            break;
        case 'analytics':
            renderAnalytics();
            break;
        case 'settings':
            renderSettings();
            break;
    }
}

function updateRaceCountdown() {
    const raceDate = new Date('2025-09-07');
    const countdown = calculateRaceCountdown(raceDate);
    
    const countdownText = document.getElementById('countdownText');
    if (countdownText) {
        countdownText.textContent = `Wettkampf: ${countdown}`;
    }
}

// Export functions for other modules
export { currentView, loadView };