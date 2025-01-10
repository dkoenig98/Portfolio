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
            // Wir behalten die lokale Speicherung auch bei Datenbankfehler
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
            const response = await fetch(`/projects/fitness/progress?startDate=${today}&endDate=${today}`);
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
        
        // Versuche vom Server zu laden
        try {
            const response = await fetch(
                `/projects/fitness/workout/history?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
            );
            
            if (!response.ok) {
                throw new Error('Serverfehler beim Laden der Workout-Historie');
            }

            return await response.json();
        } catch (error) {
            console.warn('Verwende lokale Workout-Historie:', error);
            
            // Fallback: Lade aus localStorage
            const weekProgress = [];
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
    }

    analyzeProgress() {
        return this.getWeeklyProgress().then(weekProgress => ({
            totalWorkouts: weekProgress.length,
            totalExercises: weekProgress.reduce((sum, day) => 
                sum + (day.workout?.exercises?.length || 0), 0),
            completedExercises: weekProgress.reduce((sum, day) => 
                sum + (day.completed?.filter(e => e.completed)?.length || 0), 0),
            muscleGroupFrequency: this.analyzeMuscleGroupFrequency(weekProgress)
        }));
    }

    analyzeMuscleGroupFrequency(weekProgress) {
        const frequency = {};
        weekProgress.forEach(day => {
            day.workout?.exercises?.forEach(exercise => {
                exercise.muscleGroups?.forEach(group => {
                    frequency[group] = (frequency[group] || 0) + 1;
                });
            });
        });
        return frequency;
    }

    // Neue Methode für detaillierte Statistiken
    async getDetailedStats() {
        const weekProgress = await this.getWeeklyProgress();
        const stats = {
            workoutCount: weekProgress.length,
            totalDuration: 0,
            muscleGroupWork: {},
            completionRate: 0,
            averageExercisesPerWorkout: 0
        };

        let totalExercises = 0;
        let completedExercises = 0;

        weekProgress.forEach(day => {
            if (day.workout?.exercises) {
                totalExercises += day.workout.exercises.length;
                completedExercises += day.completed?.filter(e => e.completed)?.length || 0;
                stats.totalDuration += day.workout.estimatedDuration || 0;

                day.workout.exercises.forEach(exercise => {
                    exercise.muscleGroups?.forEach(group => {
                        if (!stats.muscleGroupWork[group]) {
                            stats.muscleGroupWork[group] = {
                                totalSets: 0,
                                totalReps: 0,
                                exercises: new Set()
                            };
                        }
                        stats.muscleGroupWork[group].exercises.add(exercise.id);
                        stats.muscleGroupWork[group].totalSets += exercise.sets;
                        // Berücksichtige Bereiche wie "10-12" bei Wiederholungen
                        const reps = exercise.reps.toString().split('-');
                        const avgReps = (parseInt(reps[0]) + (parseInt(reps[1]) || parseInt(reps[0]))) / 2;
                        stats.muscleGroupWork[group].totalReps += exercise.sets * avgReps;
                    });
                });
            }
        });

        stats.completionRate = totalExercises ? (completedExercises / totalExercises) * 100 : 0;
        stats.averageExercisesPerWorkout = weekProgress.length ? totalExercises / weekProgress.length : 0;

        // Konvertiere Sets zu Array für einfachere Verarbeitung im Frontend
        Object.keys(stats.muscleGroupWork).forEach(group => {
            stats.muscleGroupWork[group].exercises = 
                Array.from(stats.muscleGroupWork[group].exercises);
        });

        return stats;
    }
}