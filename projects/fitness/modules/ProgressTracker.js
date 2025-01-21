export class ProgressTracker {
    constructor() {
        this.storageKey = 'workoutProgress';
    }

    async saveWorkout(progress) {
        const today = progress.date.split('T')[0];
        
        // Lokal speichern
        localStorage.setItem(
            `${this.storageKey}_${today}`,
            JSON.stringify(progress)
        );

        // In Datenbank speichern
        try {
            const response = await fetch('/projects/fitness/progress', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(progress)
            });

            if (!response.ok) {
                throw new Error('Failed to save progress to database');
            }
        } catch (error) {
            console.error('Error saving to database:', error);
        }
    }

    async getTodayWorkout() {
        const today = new Date().toISOString().split('T')[0];
        
        try {
            // Versuche zuerst lokal zu laden
            const localWorkout = localStorage.getItem(`${this.storageKey}_${today}`);
            if (localWorkout) {
                return JSON.parse(localWorkout);
            }

            // Wenn nicht lokal vorhanden, von der Datenbank laden
            const response = await fetch(`/projects/fitness/progress/history?startDate=${today}&endDate=${today}`);
            if (!response.ok) {
                throw new Error('Failed to load workout from database');
            }

            const data = await response.json();
            return data[0] || null;
        } catch (error) {
            console.error('Error loading workout:', error);
            return null;
        }
    }

    async getWeeklyProgress() {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 6); // 7 Tage zurück
        const endDate = new Date();
        
        try {
            const response = await fetch(
                `/projects/fitness/progress/history?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
            );
            
            if (!response.ok) {
                throw new Error('Serverfehler beim Laden der Workout-Historie');
            }

            return await response.json();
        } catch (error) {
            console.warn('Verwende lokale Workout-Historie:', error);
            return this.getLocalWeeklyProgress();
        }
    }

    getLocalWeeklyProgress() {
        const weekProgress = [];
        const endDate = new Date();
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(endDate);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            
            const saved = localStorage.getItem(`${this.storageKey}_${dateStr}`);
            if (saved) {
                weekProgress.push(JSON.parse(saved));
            }
        }
        return weekProgress;
    }

    async analyzeProgress() {
        try {
            const weekProgress = await this.getWeeklyProgress();
            let totalExercises = 0;
            let completedExercises = 0;
        
            weekProgress.forEach(day => {
                if (day.workout?.exercises) {
                    totalExercises += day.workout.exercises.length;
                    completedExercises += day.completed?.filter(e => e.completed)?.length || 0;
                }
            });
        
            return {
                totalWorkouts: weekProgress.length,
                totalExercises,
                completedExercises,
                completionRate: totalExercises ? Math.round((completedExercises / totalExercises) * 100) : 0,
                muscleGroupFrequency: this.analyzeMuscleGroupFrequency(weekProgress)
            };
        } catch (error) {
            console.error('Error analyzing progress:', error);
            return {
                totalWorkouts: 0,
                totalExercises: 0,
                completedExercises: 0,
                completionRate: 0,
                muscleGroupFrequency: {}
            };
        }
    }

    analyzeMuscleGroupFrequency(weekProgress) {
        const frequency = {};
        weekProgress.forEach(day => {
            if (day.completed) {
                day.completed.forEach(exercise => {
                    if (exercise.completed && exercise.muscleGroups) {
                        exercise.muscleGroups.forEach(group => {
                            frequency[group] = (frequency[group] || 0) + 1;
                        });
                    }
                });
            }
        });
        return frequency;
    }
}