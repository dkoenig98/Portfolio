// components/today.js
import { API } from '../utils/api.js';
import { formatDateWithWeekday, formatDuration, getTrainingIcon, getTrainingTypeName, getRatingEmoji } from '../utils/helpers.js';
import { openTrainingModal } from './logger.js';

export async function renderToday() {
    const template = document.getElementById('todayTemplate');
    const content = template.content.cloneNode(true);
    
    const contentArea = document.getElementById('contentArea');
    contentArea.appendChild(content);
    
    // Set today's date
    const todayDate = document.getElementById('todayDate');
    todayDate.textContent = formatDateWithWeekday(new Date());
    
    // Load today's training
    await loadTodayTraining();
}

async function loadTodayTraining() {
    const training = await API.getTodayTraining();
    const container = document.getElementById('todayTraining');
    
    if (!training || training.type === 'Ruhe') {
        container.innerHTML = `
            <div class="no-training">
                <i class="fas ${training ? 'fa-bed' : 'fa-calendar-times'}"></i>
                <h3>${training ? 'Ruhetag' : 'Kein Training geplant'}</h3>
                <p>${training ? 'Heute ist Erholung angesagt!' : 'Für heute ist kein Training eingetragen.'}</p>
                <button class="btn btn-primary" id="addTodayTraining">
                    <i class="fas fa-plus"></i> Training hinzufügen
                </button>
            </div>
        `;
        
        document.getElementById('addTodayTraining').addEventListener('click', () => {
            openTrainingModal(null, new Date());
        });
        return;
    }
    
    container.innerHTML = `
        <div class="training-detail">
            <div class="training-header">
                <div class="training-type-badge ${training.type}">
                    <i class="fas ${getTrainingIcon(training.type)}"></i>
                    ${getTrainingTypeName(training.type)}
                </div>
                ${training.completed ? '<span class="completed-badge"><i class="fas fa-check"></i> Erledigt</span>' : ''}
            </div>
            
            <h3 class="training-planned">${training.plannedUnit || 'Training'}</h3>
            
            ${training.completed ? `
                <div class="training-stats">
                    <div class="stat">
                        <i class="fas fa-clock"></i>
                        <span>${formatDuration(training.duration)}</span>
                    </div>
                    <div class="stat">
                        <i class="fas fa-star"></i>
                        <span>Bewertung: ${training.rating}/5 ${getRatingEmoji(training.rating)}</span>
                    </div>
                    <div class="stat">
                        <i class="fas fa-fire"></i>
                        <span>Score: ${training.score}</span>
                    </div>
                </div>
                
                ${training.zone1 || training.zone2 || training.zone3 || training.zone4 || training.zone5 ? `
                    <div class="zone-breakdown">
                        <h4>Herzfrequenzzonen</h4>
                        <div class="zone-bars">
                            ${renderZoneBar(1, training.zone1)}
                            ${renderZoneBar(2, training.zone2)}
                            ${renderZoneBar(3, training.zone3)}
                            ${renderZoneBar(4, training.zone4)}
                            ${renderZoneBar(5, training.zone5)}
                        </div>
                    </div>
                ` : ''}
                
                ${training.notes ? `
                    <div class="training-notes">
                        <h4>Notizen</h4>
                        <p>${training.notes}</p>
                    </div>
                ` : ''}
            ` : ''}
            
            <div class="training-actions">
                <button class="btn btn-primary" id="editTraining">
                    <i class="fas ${training.completed ? 'fa-edit' : 'fa-check'}"></i>
                    ${training.completed ? 'Bearbeiten' : 'Als erledigt markieren'}
                </button>
            </div>
        </div>
    `;
    
    // Add event listener
    document.getElementById('editTraining').addEventListener('click', () => {
        openTrainingModal(training);
    });
}

function renderZoneBar(zone, minutes) {
    if (!minutes) return '';
    
    const zoneColors = {
        1: '#10b981',
        2: '#3b82f6',
        3: '#f59e0b',
        4: '#ef4444',
        5: '#7c3aed'
    };
    
    return `
        <div class="zone-bar">
            <span class="zone-label">Zone ${zone}</span>
            <div class="zone-value" style="background-color: ${zoneColors[zone]}; width: ${Math.min(minutes * 2, 100)}%">
                ${minutes} min
            </div>
        </div>
    `;
}