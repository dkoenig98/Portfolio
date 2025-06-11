// utils/api.js
const BASE_URL = '/projects/triathlon-tracker';

export const API = {
    // Get all trainings
    async getAllTrainings() {
        try {
            const response = await fetch(`${BASE_URL}/trainings`);
            if (!response.ok) throw new Error('Failed to fetch trainings');
            return await response.json();
        } catch (error) {
            console.error('Error fetching trainings:', error);
            return [];
        }
    },

    // Get training by date
    async getTrainingByDate(date) {
        try {
            // Format date as YYYY-MM-DD for API
            const dateStr = date instanceof Date ? 
                `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` : 
                date;
            
            const response = await fetch(`${BASE_URL}/trainings/date/${dateStr}`);
            if (!response.ok) throw new Error('Failed to fetch training');
            return await response.json();
        } catch (error) {
            console.error('Error fetching training:', error);
            return null;
        }
    },

    // Get today's training
    async getTodayTraining() {
        try {
            const response = await fetch(`${BASE_URL}/trainings/today`);
            if (!response.ok) throw new Error('Failed to fetch today training');
            return await response.json();
        } catch (error) {
            console.error('Error fetching today training:', error);
            return null;
        }
    },

    // Get trainings for a week
    async getWeekTrainings(weekNumber) {
        try {
            const response = await fetch(`${BASE_URL}/trainings/week/${weekNumber}`);
            if (!response.ok) throw new Error('Failed to fetch week trainings');
            return await response.json();
        } catch (error) {
            console.error('Error fetching week trainings:', error);
            return [];
        }
    },

    // Get trainings in date range
    async getTrainingsByRange(startDate, endDate) {
        try {
            const response = await fetch(`${BASE_URL}/trainings/range?startDate=${startDate}&endDate=${endDate}`);
            if (!response.ok) throw new Error('Failed to fetch trainings');
            return await response.json();
        } catch (error) {
            console.error('Error fetching trainings:', error);
            return [];
        }
    },

    // Get upcoming trainings
    async getUpcomingTrainings() {
        try {
            const response = await fetch(`${BASE_URL}/trainings/upcoming`);
            if (!response.ok) throw new Error('Failed to fetch upcoming trainings');
            return await response.json();
        } catch (error) {
            console.error('Error fetching upcoming trainings:', error);
            return [];
        }
    },

    // Create new training
    async createTraining(training) {
        try {
            const response = await fetch(`${BASE_URL}/trainings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(training)
            });
            if (!response.ok) throw new Error('Failed to create training');
            return await response.json();
        } catch (error) {
            console.error('Error creating training:', error);
            throw error;
        }
    },

    // Update training
    async updateTraining(id, training) {
        try {
            const response = await fetch(`${BASE_URL}/trainings/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(training)
            });
            if (!response.ok) throw new Error('Failed to update training');
            return await response.json();
        } catch (error) {
            console.error('Error updating training:', error);
            throw error;
        }
    },

    // Delete training
    async deleteTraining(id) {
        try {
            const response = await fetch(`${BASE_URL}/trainings/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete training');
            return await response.json();
        } catch (error) {
            console.error('Error deleting training:', error);
            throw error;
        }
    },

    // Import CSV
    async importCSV(file) {
        try {
            const formData = new FormData();
            formData.append('csv', file);
            
            const response = await fetch(`${BASE_URL}/import-csv`, {
                method: 'POST',
                body: formData
            });
            if (!response.ok) throw new Error('Failed to import CSV');
            return await response.json();
        } catch (error) {
            console.error('Error importing CSV:', error);
            throw error;
        }
    },

    // Get weekly stats
    async getWeeklyStats(weekNumber) {
        try {
            const response = await fetch(`${BASE_URL}/stats/weekly/${weekNumber}`);
            if (!response.ok) throw new Error('Failed to fetch stats');
            return await response.json();
        } catch (error) {
            console.error('Error fetching stats:', error);
            return [];
        }
    },

    // Get zone distribution
    async getZoneDistribution(startDate, endDate) {
        try {
            const response = await fetch(`${BASE_URL}/stats/zones?startDate=${startDate}&endDate=${endDate}`);
            if (!response.ok) throw new Error('Failed to fetch zone distribution');
            return await response.json();
        } catch (error) {
            console.error('Error fetching zone distribution:', error);
            return { zone1: 0, zone2: 0, zone3: 0, zone4: 0, zone5: 0 };
        }
    }
};