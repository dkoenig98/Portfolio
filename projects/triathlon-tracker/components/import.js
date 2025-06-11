// components/import.js
import { API } from '../utils/api.js';
import { openTrainingModal } from './logger.js';

export function renderSettings() {
    const template = document.getElementById('settingsTemplate');
    const content = template.content.cloneNode(true);
    
    const contentArea = document.getElementById('contentArea');
    contentArea.appendChild(content);
    
    // Initialize handlers
    initImportHandlers();
}

function initImportHandlers() {
    const csvInput = document.getElementById('csvInput');
    const importBtn = document.getElementById('importBtn');
    const addTrainingBtn = document.getElementById('addTrainingBtn');
    const importResult = document.getElementById('importResult');
    
    importBtn.addEventListener('click', async () => {
        const file = csvInput.files[0];
        if (!file) {
            showResult('Bitte wähle eine CSV-Datei aus', 'error');
            return;
        }
        
        // Check file type
        if (!file.name.endsWith('.csv')) {
            showResult('Bitte nur CSV-Dateien hochladen', 'error');
            return;
        }
        
        importBtn.disabled = true;
        importBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Importiere...';
        
        try {
            const result = await API.importCSV(file);
            showResult(
                `Import erfolgreich! ${result.imported} Trainings importiert.` +
                (result.errors.length > 0 ? ` ${result.errors.length} Fehler aufgetreten.` : ''),
                'success'
            );
            
            // Clear file input
            csvInput.value = '';
        } catch (error) {
            showResult('Fehler beim Import: ' + error.message, 'error');
        } finally {
            importBtn.disabled = false;
            importBtn.innerHTML = '<i class="fas fa-upload"></i> Importieren';
        }
    });
    
    addTrainingBtn.addEventListener('click', () => {
        openTrainingModal();
    });
}

function showResult(message, type) {
    const resultDiv = document.getElementById('importResult');
    resultDiv.textContent = message;
    resultDiv.className = `import-result ${type}`;
    
    // Hide after 5 seconds
    setTimeout(() => {
        resultDiv.className = 'import-result';
        resultDiv.textContent = '';
    }, 5000);
}