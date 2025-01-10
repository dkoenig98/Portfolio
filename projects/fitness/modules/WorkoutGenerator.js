export class WorkoutGenerator {
    constructor(exercises) {
        this.exercises = exercises;
        this.muscleGroupTargets = {
            chest: { weekly: 12, perSession: 3 },
            back: { weekly: 12, perSession: 3 },
            shoulders: { weekly: 9, perSession: 3 },
            biceps: { weekly: 6, perSession: 2 },
            triceps: { weekly: 6, perSession: 2 },
            core: { weekly: 9, perSession: 2 }
        };

        // Deadhang-Definition
        this.deadhangExercise = {
            id: 'deadhang',
            name: 'Deadhang',
            description: 'Hänge mit gestreckten Armen an der Klimmzugstange. Tracking der Zeit nach Beendigung.',
            sets: 1,
            reps: 'Max Zeit',
            muscleGroups: ['grip', 'forearms', 'back'],
            equipment: ['pull_up_bar'],
            isDeadhang: true
        };

        // Mapping für zusammengesetzte Muskelgruppen
        this.muscleGroupMapping = {
            'arms': ['biceps', 'triceps']
        };
    }

    async generateWorkout(params) {
        console.log('Starting generateWorkout with params:', params);
        const {
            pastWorkouts = [],
            targetMuscleGroups,
            exerciseCount = 7,
            includeDeadhang = false
        } = params;

        try {
            // 1. Expandiere zusammengesetzte Muskelgruppen
            const expandedGroups = this.expandMuscleGroups(targetMuscleGroups);
            console.log('Expanded muscle groups:', expandedGroups);

            // 2. Wähle Hauptübungen aus
            const mainExercises = await this.selectExercises(
                expandedGroups,
                exerciseCount,
                pastWorkouts
            );
            console.log('Selected main exercises:', mainExercises.length);

            // 3. Stelle sicher, dass Core-Übungen dabei sind
            const withCore = await this.ensureCoreExercises(mainExercises);
            console.log('Exercises with core:', withCore.length);

            // 4. Füge optional Deadhang hinzu
            let finalExercises = withCore;
            if (includeDeadhang) {
                finalExercises = [...withCore, this.deadhangExercise];
                console.log('Added deadhang exercise');
            }

            return {
                exercises: finalExercises,
                muscleGroupsHit: this.analyzeMuscleGroupCoverage(finalExercises)
            };
        } catch (error) {
            console.error('Error in generateWorkout:', error);
            throw error;
        }
    }

    expandMuscleGroups(groups) {
        return groups.reduce((expanded, group) => {
            if (this.muscleGroupMapping[group]) {
                return [...expanded, ...this.muscleGroupMapping[group]];
            }
            return [...expanded, group];
        }, []);
    }

    async selectExercises(targetGroups, count, pastWorkouts) {
        const selected = [];
        const muscleGroupCount = {};
        const usedExercises = new Set(
            pastWorkouts.flatMap(w => w.exercises?.map(e => e.id) || [])
        );

        const maxExercisesPerMuscle = 3;
        let availableExercises = [...this.exercises];

        while (selected.length < count && availableExercises.length > 0) {
            // Filter für aktuelle Muskelgruppen und Limits
            const validExercises = availableExercises.filter(exercise => 
                exercise.muscleGroups.some(group => targetGroups.includes(group)) &&
                !usedExercises.has(exercise.id) &&
                exercise.muscleGroups.every(group => 
                    (muscleGroupCount[group] || 0) < maxExercisesPerMuscle
                )
            );

            if (validExercises.length === 0) break;

            // Wähle zufällige Übung
            const randomIndex = Math.floor(Math.random() * validExercises.length);
            const exercise = validExercises[randomIndex];

            // Aktualisiere Zähler
            exercise.muscleGroups.forEach(group => {
                muscleGroupCount[group] = (muscleGroupCount[group] || 0) + 1;
            });

            selected.push(exercise);
            usedExercises.add(exercise.id);
            availableExercises = availableExercises.filter(e => e.id !== exercise.id);
        }

        return selected;
    }

    async ensureCoreExercises(exercises) {
        // Zähle vorhandene Core-Übungen
        const coreExercises = exercises.filter(ex => 
            ex.muscleGroups.includes('core')
        );

        // Wenn weniger als 1 Core-Übung, füge welche hinzu
        if (coreExercises.length < 1) {
            const availableCoreExercises = this.exercises.filter(ex => 
                ex.muscleGroups.includes('core') &&
                !exercises.find(selected => selected.id === ex.id)
            ).slice(0, 2); // Maximal 2 Core-Übungen

            // Ersetze die letzten Übungen durch Core-Übungen
            const nonCoreExercises = exercises.slice(0, -availableCoreExercises.length);
            return [...nonCoreExercises, ...availableCoreExercises];
        }

        // Wenn mehr als 2 Core-Übungen, reduziere auf 2
        if (coreExercises.length > 2) {
            const selectedCore = coreExercises.slice(0, 2);
            const nonCoreExercises = exercises.filter(ex => 
                !ex.muscleGroups.includes('core')
            );
            return [...nonCoreExercises, ...selectedCore];
        }

        return exercises;
    }

    analyzeMuscleGroupCoverage(exercises) {
        const coverage = {};
        exercises.forEach(exercise => {
            exercise.muscleGroups.forEach(group => {
                coverage[group] = (coverage[group] || 0) + 1;
            });
        });
        return coverage;
    }

    getDefaultSetsAndReps() {
        return {
            sets: 3,
            reps: '10-12'
        };
    }
}