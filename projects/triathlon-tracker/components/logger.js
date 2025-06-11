// components/logger.js
import { API } from '../utils/api.js';
import { loadView } from './app.js';

let currentTraining = null;

export function initTrainingForm() {
    const modal = document.getElementById('trainingModal');
    const form = document.getElementById('trainingForm');
    const closeBtn = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const completedCheckbox = document.getElementById('completed');
    const completedFields = document.getElementById('completedFields');
    const ratingInput = document.getElementById('rating');
    const ratingValue = document.getElementById('ratingValue');
    
    // Close modal handlers
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    // Show/hide completed fields
    completedCheckbox.addEventListener('change', (e) => {
        completedFields.style.display = e.target.checked ? 'block' : 'none';
        updateZoneTotal();
    });
    
    // Update rating display
    ratingInput.addEventListener('input', (e) => {
        ratingValue.textContent = e.target.value;
    });
    
    // Update zone total
    const zoneInputs = ['zone1', 'zone2', 'zone3', 'zone4', 'zone5'];
    zoneInputs.forEach(id => {
        document.getElementById(id).addEventListener('input', updateZoneTotal);
    });
    
    // Form submission
    form.addEventListener('submit', handleSubmit);
}

export function openTrainingModal(training = null, defaultDate = null) {
    currentTraining = training;
    const modal = document.getElementById('trainingModal');
    const modalTitle = document.getElementById('modalTitle');
    const form = document.getElementById('trainingForm');
    
    // Reset form
    form.reset();
    
    if (training) {
        // Edit mode
        modalTitle.textContent = 'Training bearbeiten';
        document.getElementById('trainingId').value = training._id;
        document.getElementById('date').value = training.date.split('T')[0];
        document.getElementById('type').value = training.type;
        document.getElementById('plannedUnit').value = training.plannedUnit || '';
        document.getElementById('completed').checked = training.completed;
        
        if (training.completed) {
            document.getElementById('completedFields').style.display = 'block';
            document.getElementById('duration').value = training.duration || '';
            document.getElementById('rating').value = training.rating || 3;
            document.getElementById('ratingValue').textContent = training.rating || 3;
            document.getElementById('zone1').value = training.zone1 || 0;
            document.getElementById('zone2').value = training.zone2 || 0;
            document.getElementById('zone3').value = training.zone3 || 0;
            document.getElementById('zone4').value = training.zone4 || 0;
            document.getElementById('zone5').value = training.zone5 || 0;
            document.getElementById('sleepHours').value = training.sleepHours || '';
            document.getElementById('notes').value = training.notes || '';
            updateZoneTotal();
        }
    } else {
        // Create mode
        modalTitle.textContent = 'Neues Training';
        document.getElementById('trainingId').value = '';
        
        if (defaultDate) {
            document.getElementById('date').value = defaultDate.toISOString().split('T')[0];
        } else {
            document.getElementById('date').value = new Date().toISOString().split('T')[0];
        }
    }
    
    // Show modal
    modal.classList.add('show');
}

function closeModal() {
    const modal = document.getElementById('trainingModal');
    modal.classList.remove('show');
    currentTraining = null;
}

function updateZoneTotal() {
    const zones = ['zone1', 'zone2', 'zone3', 'zone4', 'zone5'];
    const total = zones.reduce((sum, id) => {
        const value = parseInt(document.getElementById(id).value) || 0;
        return sum + value;
    }, 0);
    
    document.getElementById('zoneTotal').textContent = total;
}

async function handleSubmit(e) {
    e.preventDefault();
    
    // Parse date correctly
    const dateValue = document.getElementById('date').value;
    const [year, month, day] = dateValue.split('-').map(num => parseInt(num));
    const localDate = new Date(year, month - 1, day, 12, 0, 0); // Noon to avoid timezone issues
    
    const formData = {
        date: localDate.toISOString(),
        type: document.getElementById('type').value,
        plannedUnit: document.getElementById('plannedUnit').value,
        completed: document.getElementById('completed').checked,
        week: currentTraining?.week || calculateWeekFromDate(dateValue)
    };
    
    if (formData.completed) {
        formData.duration = parseInt(document.getElementById('duration').value) || 0;
        formData.rating = parseInt(document.getElementById('rating').value);
        formData.zone1 = parseInt(document.getElementById('zone1').value) || 0;
        formData.zone2 = parseInt(document.getElementById('zone2').value) || 0;
        formData.zone3 = parseInt(document.getElementById('zone3').value) || 0;
        formData.zone4 = parseInt(document.getElementById('zone4').value) || 0;
        formData.zone5 = parseInt(document.getElementById('zone5').value) || 0;
        
        const sleepHours = document.getElementById('sleepHours').value;
        if (sleepHours) formData.sleepHours = parseFloat(sleepHours);
        
        const notes = document.getElementById('notes').value.trim();
        if (notes) formData.notes = notes;
    }
    
    try {
        const trainingId = document.getElementById('trainingId').value;
        
        if (trainingId) {
            // Update existing
            await API.updateTraining(trainingId, formData);
        } else {
            // Create new
            await API.createTraining(formData);
        }
        
        closeModal();
        // Reload current view
        const currentView = document.querySelector('.nav-item.active').dataset.view;
        loadView(currentView);
    } catch (error) {
        alert('Fehler beim Speichern: ' + error.message);
    }
}

function calculateWeekFromDate(dateStr) {
    const date = new Date(dateStr);
    const startDate = new Date('2025-06-02'); // Start of training plan
    const diff = date - startDate;
    const weeks = Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
    return Math.max(1, weeks + 1);
}