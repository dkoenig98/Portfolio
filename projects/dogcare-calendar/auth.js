class Auth {
    constructor() {
        this.token = localStorage.getItem('dogcare_token');
        this.role = localStorage.getItem('dogcare_role');
        this.baseUrl = '/projects/dogcare-calendar';
    }

    async login(username, password) {
        try {
            const response = await fetch(`${this.baseUrl}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                throw new Error('Login fehlgeschlagen');
            }

            const data = await response.json();
            this.token = data.token;
            this.role = data.role;
            
            localStorage.setItem('dogcare_token', data.token);
            localStorage.setItem('dogcare_role', data.role);
            
            return true;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    }
// test
    logout() {
        this.token = null;
        this.role = null;
        localStorage.removeItem('dogcare_token');
        localStorage.removeItem('dogcare_role');
    }

    isLoggedIn() {
        return !!this.token;
    }

    // Geändert: Jetzt prüft es auf 'owner' statt 'sitter'
    canModifyAppointments() {
        return this.role === 'owner';
    }

    getToken() {
        return this.token;
    }
}