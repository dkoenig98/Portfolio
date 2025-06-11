// components/calendar.js
import { API } from '../utils/api.js';
import { formatDate, formatDuration, getTrainingIcon, getTrainingTypeName, getRatingEmoji, truncateText } from '../utils/helpers.js';
import { openTrainingModal } from './logger.js';

let currentWeek = 1;

export async function renderCalendar() {
    const template = document.getElementById('calendarTemplate');
    const content = template.content.cloneNode(true);
    
    const contentArea = document.getElementById('contentArea');
    contentArea.appendChild(content);
    
    // Initialize week navigation
    document.getElementById('prevWeek').addEventListener('click', () => changeWeek(-1));
    document.getElementById('nextWeek').addEventListener('click', () => changeWeek(1));
    
    // Set current week
    currentWeek = getCurrentWeekNumber();
    
    // Load week trainings
    await loadWeekTrainings();
}

function getCurrentWeekNumber() {
    const startDate = new Date('2025-06-02');
    const now = new Date();
    const diff = now - startDate;
    const weeks = Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
    return Math.max(1, weeks + 1);
}

async function changeWeek(direction) {
    currentWeek += direction;
    if (currentWeek < 1) currentWeek = 1;
    await loadWeekTrainings();
}

async function loadWeekTrainings() {
    document.getElementById('weekDisplay').textContent = `Woche ${currentWeek}`;
    
    const trainings = await API.getWeekTrainings(currentWeek);
    const container = document.getElementById('weekTrainings');
    
    if (trainings.length === 0) {
        container.innerHTML = `
            <div class="no-training">
                <i class="fas fa-calendar-times"></i>
                <p>Keine Trainings für diese Woche</p>
            </div>
        `;
        return;
    }
    
    // Group trainings by date
    const trainingsByDate = {};
    trainings.forEach(training => {
        const dateKey = training.date.split('T')[0];
        if (!trainingsByDate[dateKey]) {
            trainingsByDate[dateKey] = [];
        }
        trainingsByDate[dateKey].push(training);
    });
    
    // Render trainings
    container.innerHTML = Object.entries(trainingsByDate)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, dayTrainings]) => {
            const dateObj = new Date(date + 'T00:00:00');
            const weekday = dateObj.toLocaleDateString('de-DE', { weekday: 'long' });
            
            return `
                <div class="day-card">
                    <div class="day-header">
                        <div>
                            <div class="day-date">${formatDate(date)}</div>
                            <div class="day-name">${weekday}</div>
                        </div>
                    </div>
                    <div class="day-trainings">
                        ${dayTrainings.map(training => `
                            <div class="training-item" data-id="${training._id}">
                                <div class="training-type-icon ${training.type}">
                                    <i class="fas ${getTrainingIcon(training.type)}"></i>
                                </div>
                                <div class="training-info">
                                    <div class="training-title">
                                        ${truncateText(training.plannedUnit || getTrainingTypeName(training.type), 50)}
                                        ${training.completed ? '<i class="fas fa-check completed-icon"></i>' : ''}
                                    </div>
                                    ${training.completed ? `
                                        <div class="training-meta">
                                            <span><i class="fas fa-clock"></i> ${formatDuration(training.duration)}</span>
                                            <span><i class="fas fa-star"></i> ${training.rating}/5 ${getRatingEmoji(training.rating)}</span>
                                            <span><i class="fas fa-fire"></i> ${training.score}</span>
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }).join('');
    
    // Add click handlers
    container.querySelectorAll('.training-item').forEach(item => {
        item.addEventListener('click', () => {
            const id = item.dataset.id;
            const training = trainings.find(t => t._id === id);
            if (training) {
                openTrainingModal(training);
            }
        });
    });
}