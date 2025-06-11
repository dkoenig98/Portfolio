// components/dashboard.js
import { API } from '../utils/api.js';
import { formatDate, formatDuration, getTrainingIcon, getTrainingTypeName, getCurrentTrainingWeek, calculateWeeklyTotals, truncateText } from '../utils/helpers.js';
import { openTrainingModal } from './logger.js';

export async function renderDashboard() {
    const template = document.getElementById('dashboardTemplate');
    const content = template.content.cloneNode(true);
    
    const contentArea = document.getElementById('contentArea');
    contentArea.appendChild(content);
    
    // Load data
    await loadWeeklyStats();
    await loadUpcomingTrainings();
}

async function loadWeeklyStats() {
    const currentWeek = getCurrentTrainingWeek();
    const trainings = await API.getWeekTrainings(currentWeek);
    
    const totals = calculateWeeklyTotals(trainings);
    
    // Update stats
    document.getElementById('bikeDuration').textContent = formatDuration(totals.byType.R.duration);
    document.getElementById('runDuration').textContent = formatDuration(totals.byType.L.duration);
    document.getElementById('swimDuration').textContent = formatDuration(totals.byType.S.duration);
    document.getElementById('totalScore').textContent = totals.score;
}

async function loadUpcomingTrainings() {
    const trainings = await API.getUpcomingTrainings();
    const upcomingList = document.getElementById('upcomingList');
    
    if (trainings.length === 0) {
        upcomingList.innerHTML = `
            <div class="no-training">
                <i class="fas fa-check-circle"></i>
                <p>Keine anstehenden Trainings</p>
            </div>
        `;
        return;
    }
    
    upcomingList.innerHTML = trainings.map(training => `
        <div class="training-item" data-id="${training._id}">
            <div class="training-type-icon ${training.type}">
                <i class="fas ${getTrainingIcon(training.type)}"></i>
            </div>
            <div class="training-info">
                <div class="training-date">${formatDate(training.date)}</div>
                <div class="training-title">${truncateText(training.plannedUnit || getTrainingTypeName(training.type), 60)}</div>
                <div class="training-meta">
                    ${training.duration ? `<span><i class="fas fa-clock"></i> ${formatDuration(training.duration)}</span>` : ''}
                    ${training.type !== 'Ruhe' ? `<span>${getTrainingTypeName(training.type)}</span>` : ''}
                </div>
            </div>
        </div>
    `).join('');
    
    // Add click handlers
    upcomingList.querySelectorAll('.training-item').forEach(item => {
        item.addEventListener('click', () => {
            const id = item.dataset.id;
            const training = trainings.find(t => t._id === id);
            if (training) {
                openTrainingModal(training);
            }
        });
    });
}