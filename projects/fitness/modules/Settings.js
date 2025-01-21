export class Settings {
    constructor() {
        this.defaultSettings = {
            trainingDays: 6,
            exerciseCount: 7,
            includeDeadhang: false
        };
        this.storageKey = 'workoutSettings';
    }

    async load() {
        try {
            // Versuche vom Server zu laden
            const response = await fetch('/projects/fitness/settings');
            if (response.ok) {
                const serverSettings = await response.json();
                if (Object.keys(serverSettings).length > 0) {
                    // Speichere Server-Settings auch lokal
                    localStorage.setItem(this.storageKey, JSON.stringify(serverSettings));
                    return serverSettings;
                }
            }
        } catch (error) {
            console.warn('Could not load settings from server:', error);
        }

        // Fallback: Lokale Settings oder Defaults
        const localSettings = localStorage.getItem(this.storageKey);
        const settings = localSettings ? JSON.parse(localSettings) : this.defaultSettings;
        console.log('Loaded settings:', settings);
        return settings;
    }

    async save(settings) {
        // Speichere lokal
        localStorage.setItem(this.storageKey, JSON.stringify(settings));

        // Speichere in Datenbank
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
            console.log('Settings saved to database successfully');
        } catch (error) {
            console.error('Error saving settings to database:', error);
        }
    }
}