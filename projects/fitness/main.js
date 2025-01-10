import { FitnessApp } from './modules/FitnessApp.js';

document.addEventListener('DOMContentLoaded', () => {
    const app = new FitnessApp();
    app.init().catch(error => console.error('Initialization error:', error));
});