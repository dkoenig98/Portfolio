export class Settings {
    constructor() {
        this.defaultSettings = {
            trainingDays: 6,
            exerciseCount: 7,  // Standard: 7 Übungen
            intensity: 'medium',  // In development
            timeAvailable: 45,    // In development
            includeDeadhang: false
        };
        this.storageKey = 'workoutSettings';
    }

    load() {
        const saved = localStorage.getItem(this.storageKey);
        const settings = saved ? JSON.parse(saved) : this.defaultSettings;
        console.log('Loaded settings:', settings);
        return settings;
    }

    save(settings) {
        localStorage.setItem(this.storageKey, JSON.stringify(settings));
        // Auch in der Datenbank speichern
        this.saveToDatabase(settings);
    }

    async saveToDatabase(settings) {
        try {
            const response = await fetch('/projects/fitness/settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(settings)
            });
            if (!response.ok) {
                throw new Error('Failed to save settings to database');
            }
        } catch (error) {
            console.error('Error saving settings to database:', error);
        }
    }
}