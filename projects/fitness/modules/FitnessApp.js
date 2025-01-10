import { Settings } from './Settings.js';
import { ProgressTracker } from './ProgressTracker.js';
import { WorkoutGenerator } from './WorkoutGenerator.js';

export class FitnessApp {
    constructor() {
        this.settings = new Settings();
        this.progressTracker = new ProgressTracker();
        this.workoutGenerator = null;
        this.exercises = [];
        this.currentWorkout = null;
        
        this.workoutDays = {
            'monday': ['back', 'biceps'],
            'tuesday': ['chest', 'triceps'],
            'wednesday': ['shoulders', 'core'],
            'thursday': ['back', 'core'],
            'friday': ['chest', 'arms'],
            'saturday': ['shoulders', 'core'],
            'sunday': 'rest'
        };
    }

    async init() {
        console.log('Starting initialization...');
        try {
            console.log('Loading exercises...');
            await this.loadExercises();
            console.log('Exercises loaded, creating WorkoutGenerator');
            this.workoutGenerator = new WorkoutGenerator(this.exercises);
            console.log('Setting up event listeners');
            this.setupEventListeners();
            console.log('Loading today\'s workout');
            await this.loadTodayWorkout();
            console.log('Rendering initial view');
            this.renderInitialView();
        } catch (error) {
            console.error('Initialization failed:', error);
            this.showError('Initialisierung fehlgeschlagen', error.message);
        }
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.currentTarget.dataset.view;
                this.switchView(view);
            });
        });

        // Exercise Count Select
        const exerciseCountSelect = document.getElementById('exercise-count');
        if (exerciseCountSelect) {
            const settings = this.settings.load();
            exerciseCountSelect.value = (settings.exerciseCount || 7).toString();
            exerciseCountSelect.addEventListener('change', (e) => {
                this.updateSettings({ exerciseCount: parseInt(e.target.value) });
                this.updateExerciseCountHint();
                this.regenerateWorkout();
            });
        }

        // Training Days Select
        document.getElementById('training-days')?.addEventListener('change', (e) => {
            this.updateSettings({ trainingDays: parseInt(e.target.value) });
        });

        // Deadhang Checkbox
        const deadhangCheckbox = document.getElementById('include-deadhang');
        if (deadhangCheckbox) {
            const settings = this.settings.load();
            deadhangCheckbox.checked = settings.includeDeadhang || false;
            deadhangCheckbox.addEventListener('change', (e) => {
                this.updateSettings({ includeDeadhang: e.target.checked });
                this.updateExerciseCountHint();
                this.regenerateWorkout();
            });
        }

        // Initial hint update
        this.updateExerciseCountHint();
    }

    updateExerciseCountHint() {
        const settings = this.settings.load();
        const hintElement = document.querySelector('.setting-hint');
        if (hintElement) {
            const baseCount = settings.exerciseCount || 7;
            const coreCount = '1-2';
            const deadhang = settings.includeDeadhang ? '1' : '0';
            const minTotal = baseCount + 1 + (settings.includeDeadhang ? 1 : 0);
            const maxTotal = baseCount + 2 + (settings.includeDeadhang ? 1 : 0);

            hintElement.textContent = `Gesamt: ${minTotal}-${maxTotal} Übungen (${baseCount} Basis + ${coreCount} Core${settings.includeDeadhang ? ' + Deadhang' : ''})`;
        }
    }

    async regenerateWorkout() {
        const today = new Date().toISOString().split('T')[0];
        localStorage.removeItem(`${this.progressTracker.storageKey}_${today}`);
        await this.loadTodayWorkout();
    }

    async loadExercises() {
        try {
            const response = await fetch('/projects/fitness/data');
            const data = await response.json();
            if (!data || !data.exercises) {
                throw new Error('Keine Übungen gefunden');
            }
            this.exercises = data.exercises;
            console.log(`${this.exercises.length} Übungen geladen`);
            return this.exercises;
        } catch (error) {
            console.error('Fehler beim Laden der Übungen:', error);
            throw error;
        }
    }

    getCurrentDay() {
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        return days[new Date().getDay()];
    }

    getCurrentDayMuscleGroups() {
        const today = this.getCurrentDay();
        return this.workoutDays[today] === 'rest' ? [] : this.workoutDays[today];
    }

    async loadTodayWorkout() {
        try {
            if (!this.workoutGenerator || !this.exercises.length) {
                throw new Error('WorkoutGenerator nicht initialisiert oder keine Übungen geladen');
            }

            const settings = this.settings.load();
            const existingWorkout = await this.progressTracker.getTodayWorkout();
            
            if (existingWorkout && existingWorkout.workout) {
                this.currentWorkout = {
                    ...existingWorkout.workout,
                    completed: existingWorkout.completed
                };
                this.renderWorkout(this.currentWorkout);
                return;
            }

            const today = this.getCurrentDay();
            const todaysFocus = this.workoutDays[today];
            
            if (todaysFocus === 'rest') {
                this.currentWorkout = {
                    focus: 'Ruhetag',
                    exercises: [],
                    date: new Date().toISOString()
                };
                this.renderWorkout(this.currentWorkout);
                return;
            }

            const workout = await this.workoutGenerator.generateWorkout({
                pastWorkouts: [],
                targetMuscleGroups: todaysFocus,
                exerciseCount: settings.exerciseCount || 7,
                includeDeadhang: settings.includeDeadhang || false
            });

            this.currentWorkout = {
                ...workout,
                date: new Date().toISOString(),
                focus: Array.isArray(todaysFocus) ? todaysFocus.join(' & ').toUpperCase() : todaysFocus
            };

            await this.progressTracker.saveWorkout({
                date: new Date().toISOString(),
                workout: this.currentWorkout,
                completed: []
            });

            this.renderWorkout(this.currentWorkout);
        } catch (error) {
            console.error('Error loading workout:', error);
            this.showError('Fehler beim Laden', error.message);
        }
    }

    renderWorkout(workout) {
        try {
            const muscleFocusEl = document.querySelector('.muscle-focus');
            const dateEl = document.querySelector('.date');
            const exerciseList = document.querySelector('.exercise-list');

            if (!muscleFocusEl || !dateEl || !exerciseList) {
                throw new Error('Required DOM elements not found');
            }

            // Set header information
            const muscleGroups = this.getCurrentDayMuscleGroups();
            muscleFocusEl.textContent = Array.isArray(muscleGroups) ? 
                muscleGroups.join(' & ').toUpperCase() : muscleGroups;

            dateEl.textContent = new Date().toLocaleDateString('de-DE', {
                day: '2-digit',
                month: 'long'
            });

            if (!workout || !Array.isArray(workout.exercises)) {
                throw new Error('Invalid workout data');
            }

            // Render exercise list
            exerciseList.innerHTML = workout.exercises.map(exercise => {
                if (!exercise) return '';

                if (exercise.isDeadhang) {
                    return this.renderDeadhangExercise(exercise);
                }

                return this.renderRegularExercise(exercise);
            }).join('');

            if (workout.completed && Array.isArray(workout.completed)) {
                workout.completed.forEach(item => {
                    const exerciseCard = document.querySelector(`.exercise-card[data-id="${item.id}"]`);
                    if (exerciseCard && item.completed) {
                        exerciseCard.querySelector('.exercise-check').classList.add('completed');
                    }
                });
                this.reorderExercises();
            }

            this.setupExerciseListeners();
            this.setupDeadhangListeners();
            this.updateProgress();
        } catch (error) {
            console.error('Error in renderWorkout:', error);
            this.showError('Fehler beim Anzeigen', error.message);
        }
    }

    renderDeadhangExercise(exercise) {
        return `
            <div class="exercise-card deadhang-exercise" data-id="${exercise.id}">
                <div class="exercise-main">
                    <div class="exercise-check">
                        <i class="fas fa-check"></i>
                    </div>
                    <div class="exercise-info">
                        <h3>${exercise.name}</h3>
                        <div class="exercise-meta">
                            <span class="sets">${exercise.sets} × Max Zeit</span>
                            <span class="equipment">${exercise.equipment.join(', ')}</span>
                        </div>
                    </div>
                    <button class="expand-btn">
                        <i class="fas fa-chevron-down"></i>
                    </button>
                </div>
                <div class="exercise-details hidden">
                    <p class="description">
                        Stärkt den Griff und verbessert die Haltezeit an der Klimmzugstange. 
                    </p>
                    <div class="muscle-tags">
                        <span class="tag">Unterarme</span>
                        <span class="tag">Griffkraft</span>
                        <span class="tag">Rücken</span>
                    </div>
                    <div class="deadhang-form">
                        <div class="deadhang-input">
                            <label>Zeit (Sekunden):</label>
                            <input type="number" class="deadhang-time" min="0" max="300" step="1">
                            <button class="save-deadhang">Speichern</button>
                        </div>
                        <div class="deadhang-stats">
                            <p>Letzte Zeit: <span class="last-time">-</span> Sekunden</p>
                            <p>Bestzeit: <span class="best-time">-</span> Sekunden</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderRegularExercise(exercise) {
        return `
            <div class="exercise-card" data-id="${exercise.id}">
                <div class="exercise-main">
                    <div class="exercise-check">
                        <i class="fas fa-check"></i>
                    </div>
                    <div class="exercise-info">
                        <h3>${exercise.name}</h3>
                        <div class="exercise-meta">
                            <span class="sets">${exercise.sets} × ${exercise.reps}</span>
                            <span class="equipment">${Array.isArray(exercise.equipment) ? exercise.equipment.join(', ') : ''}</span>
                        </div>
                    </div>
                    <button class="expand-btn">
                        <i class="fas fa-chevron-down"></i>
                    </button>
                </div>
                <div class="exercise-details hidden">
                    <p class="description">${exercise.description || 'Keine Beschreibung verfügbar'}</p>
                    <div class="muscle-tags">
                        ${Array.isArray(exercise.muscleGroups) ? 
                            exercise.muscleGroups.map(muscle => 
                                `<span class="tag">${muscle}</span>`
                            ).join('') : ''}
                    </div>
                </div>
            </div>
        `;
    }

    showError(title, message) {
        const exerciseList = document.querySelector('.exercise-list');
        if (exerciseList) {
            exerciseList.innerHTML = `
                <div class="error-message">
                    <h3>${title}</h3>
                    <p>${message}</p>
                </div>
            `;
        }
    }

    setupExerciseListeners() {
        document.querySelectorAll('.exercise-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('.expand-btn')) {
                    this.toggleDetails(card);
                } else if (!e.target.closest('.exercise-details')) {
                    this.toggleExercise(card);
                }
            });
        });
    }

    toggleExercise(card) {
        card.querySelector('.exercise-check').classList.toggle('completed');
        this.updateProgress();
        this.saveProgress();
    }

    toggleDetails(card) {
        const details = card.querySelector('.exercise-details');
        const button = card.querySelector('.expand-btn i');
        details.classList.toggle('hidden');
        button.classList.toggle('fa-chevron-down');
        button.classList.toggle('fa-chevron-up');
    }

    updateProgress() {
        const total = document.querySelectorAll('.exercise-card').length;
        const completed = document.querySelectorAll('.exercise-check.completed').length;
        const progress = (completed / total) * 100;
        
        document.querySelector('.progress-fill').style.width = `${progress}%`;
        document.querySelector('.progress-text').textContent = 
            `${completed} von ${total} Übungen`;
    }

    async saveProgress() {
        try {
            const progress = {
                date: new Date().toISOString(),
                workout: this.currentWorkout,
                completed: Array.from(document.querySelectorAll('.exercise-card')).map(card => ({
                    id: card.dataset.id,
                    completed: card.querySelector('.exercise-check').classList.contains('completed')
                }))
            };
    
            await this.progressTracker.saveWorkout(progress);
            this.reorderExercises();
        } catch (error) {
            console.error('Error saving progress:', error);
        }
    }

    reorderExercises() {
        const exerciseList = document.querySelector('.exercise-list');
        const exercises = Array.from(exerciseList.children);
        exercises.sort((a, b) => {
            const aCompleted = a.querySelector('.exercise-check').classList.contains('completed');
            const bCompleted = b.querySelector('.exercise-check').classList.contains('completed');
            return aCompleted - bCompleted;
        });
        exercises.forEach(exercise => exerciseList.appendChild(exercise));
    }

    async updateSettings(newSettings) {
        try {
            console.log('Updating settings with:', newSettings);
            const currentSettings = this.settings.load();
            const updatedSettings = { ...currentSettings, ...newSettings };
            await this.settings.save(updatedSettings);
        } catch (error) {
            console.error('Error updating settings:', error);
        }
    }

    switchView(view) {
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        document.querySelector(`#${view}-view`).classList.add('active');
        
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });

        if (view === 'stats') {
            this.updateStatsView();
        }
    }

    async updateStatsView() {
        try {
            const stats = await this.progressTracker.analyzeProgress();
            const weeklyData = await this.progressTracker.getWeeklyProgress();
            const deadhangStats = this.loadDeadhangStats();
    
            // Update Stat Cards
            document.querySelector('.workouts-done').textContent = stats.totalWorkouts;
            document.querySelector('.exercises-done').textContent = stats.completedExercises;
            document.querySelector('.completion-rate').textContent = 
                `${Math.round((stats.completedExercises / stats.totalExercises) * 100)}%`;
            document.querySelector('.deadhang-best').textContent = 
                `${deadhangStats.bestTime || 0}s`;
    
            // Render Weekly Progress Chart
            this.renderWeeklyProgressChart(weeklyData);
    
            // Render Muscle Groups Grid
            this.renderMuscleGroupsProgress(stats.muscleGroupFrequency);
    
            // Render Deadhang Progress
            this.renderDeadhangProgressChart(deadhangStats.times);
        } catch (error) {
            console.error('Error updating stats:', error);
        }
    }

    renderWeeklyProgressChart(weeklyData) {
        const ctx = document.getElementById('weeklyProgressChart');
        if (!ctx) return;
    
        // Verwende Chart.js für den Graphen
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],
                datasets: [{
                    label: 'Abgeschlossene Übungen',
                    data: weeklyData.map(day => day.completed?.length || 0),
                    backgroundColor: this.getCssVariable('--primary'),
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: this.getCssVariable('--gray-800')
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }
    
    renderMuscleGroupsProgress(frequency) {
        const container = document.querySelector('.muscle-groups-grid');
        if (!container) return;
    
        const muscleGroups = Object.keys(this.workoutGenerator.muscleGroupTargets);
        const html = muscleGroups.map(group => {
            const current = frequency[group] || 0;
            const target = this.workoutGenerator.muscleGroupTargets[group].weekly;
            const percentage = Math.min(Math.round((current / target) * 100), 100);
    
            return `
                <div class="muscle-group-card">
                    <div class="muscle-group-name">${group}</div>
                    <div class="completion-percentage">${percentage}%</div>
                    <div class="muscle-group-progress">
                        <div class="muscle-group-fill" style="width: ${percentage}%"></div>
                    </div>
                    <div class="muscle-group-stats">
                        ${current}/${target} Übungen
                    </div>
                </div>
            `;
        }).join('');
    
        container.innerHTML = html;
    }
    
    renderDeadhangProgressChart(times) {
        const ctx = document.getElementById('deadhangProgressChart');
        if (!ctx) return;
    
        const data = times.map(entry => ({
            x: new Date(entry.date),
            y: entry.time
        })).slice(-10); // Zeige nur die letzten 10 Einträge
    
        new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: 'Deadhang Zeit (Sekunden)',
                    data: data,
                    borderColor: this.getCssVariable('--primary'),
                    tension: 0.4,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: this.getCssVariable('--gray-800')
                        }
                    },
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day'
                        },
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }
    
    getCssVariable(name) {
        return getComputedStyle(document.documentElement).getPropertyValue(name);
    }

    renderInitialView() {
        this.switchView('today');
    }

    setupDeadhangListeners() {
        const deadhangCard = document.querySelector('.deadhang-exercise');
        if (!deadhangCard) return;

        const saveButton = deadhangCard.querySelector('.save-deadhang');
        const timeInput = deadhangCard.querySelector('.deadhang-time');

        // Lade und zeige gespeicherte Zeiten
        this.loadDeadhangStats(deadhangCard);

        saveButton?.addEventListener('click', () => {
            const time = parseInt(timeInput.value);
            if (!time || time < 0 || time > 300) {
                alert('Bitte gib eine gültige Zeit zwischen 0 und 300 Sekunden ein.');
                return;
            }

            this.saveDeadhangTime(time);
            this.loadDeadhangStats(deadhangCard);
            
            // Markiere Übung als abgeschlossen
            deadhangCard.querySelector('.exercise-check').classList.add('completed');
            this.updateProgress();
            this.saveProgress();
        });
    }

    saveDeadhangTime(time) {
        const stats = this.loadDeadhangStats() || {
            times: [],
            bestTime: 0
        };

        stats.times.push({
            time,
            date: new Date().toISOString()
        });

        if (time > stats.bestTime) {
            stats.bestTime = time;
        }

        localStorage.setItem('deadhangStats', JSON.stringify(stats));
    }

    loadDeadhangStats(card = null) {
        const stats = JSON.parse(localStorage.getItem('deadhangStats')) || {
            times: [],
            bestTime: 0
        };

        if (card) {
            const lastTime = stats.times[stats.times.length - 1]?.time || '-';
            const statsDiv = card.querySelector('.deadhang-stats');
            statsDiv.classList.remove('hidden');
            statsDiv.querySelector('.last-time').textContent = lastTime;
            statsDiv.querySelector('.best-time').textContent = stats.bestTime || '-';
        }

        return stats;
    }
}