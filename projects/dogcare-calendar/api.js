class DogCareAPI {
    constructor(auth) {
        this.auth = auth;
        this.baseUrl = '/projects/dogcare-calendar';
    }

    async fetchAppointments() {
        try {
            const response = await fetch(`${this.baseUrl}/appointments`, {
                headers: {
                    'Authorization': `Bearer ${this.auth.getToken()}`
                }
            });

            if (!response.ok) throw new Error('Fehler beim Laden der Termine');
            
            const appointments = await response.json();
            return this.transformAppointments(appointments);
        } catch (error) {
            console.error('API Error:', error);
            return {};
        }
    }

    async saveAppointment(date, type, time) {
        try {
            console.log('Sending to server:', { date, type, time });
            
            const response = await fetch(`${this.baseUrl}/appointments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.auth.getToken()}`
                },
                body: JSON.stringify({
                    date: date,
                    type: type,
                    time: time
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server error:', errorText);
                throw new Error('Fehler beim Speichern');
            }
            
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            return null;
        }
    }

    async deleteAppointment(date) {
        try {
            const response = await fetch(`${this.baseUrl}/appointments/${date}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${this.auth.getToken()}`
                }
            });

            if (!response.ok) {
                throw new Error('Fehler beim Löschen');
            }
            
            return true;
        } catch (error) {
            console.error('API Error:', error);
            return false;
        }
    }

    transformAppointments(appointments) {
        const transformed = {};
        appointments.forEach(app => {
            transformed[app.date] = {
                type: app.type,
                time: app.time,
                parentDate: app.parentDate,
                _id: app._id // Wir speichern auch die ID
            };
        });
        return transformed;
    }
}