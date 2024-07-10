// Globale Variablen
let selectedProfile = null;
let selectedYear = new Date().getFullYear();
let profiles = {};

const currentYear = new Date().getFullYear();

// DOM-Elemente
const domProfile = document.getElementById('dom-profile');
const lexProfile = document.getElementById('lex-profile');
const jumpButton = document.getElementById('jump-button');
const splashContainer = document.getElementById('splash-container');
const historyLists = document.querySelectorAll('.history-list');
const lakeContainer = document.querySelector('.lake-container');
const yearSelect = document.getElementById('year-select');

// Event Listeners
domProfile.addEventListener('click', () => selectProfile('dom'));
lexProfile.addEventListener('click', () => selectProfile('lex'));
jumpButton.addEventListener('click', takeABath);
yearSelect.addEventListener('change', handleYearChange);

async function loadProjectData() {
    try {
        const response = await fetch('/projects/strondbodbuam/data');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        profiles = data.profiles || {};
        selectedYear = data.selectedYear || new Date().getFullYear();
        
        console.log('Loaded data:', JSON.stringify(data)); // Logging für Debugging
        
        updateUI();
        updateCalendarView(selectedProfile);
    } catch (error) {
        console.error('Error loading project data:', error);
        showMessage('Fehler beim Laden der Daten. Bitte versuche es später erneut.');
    }
}

async function saveProjectData() {
    try {
        const dataToSave = {
            profiles: profiles,
            selectedYear: selectedYear
        };
        console.log('Saving data:', JSON.stringify(dataToSave)); // Logging für Debugging
        
        const response = await fetch('/projects/strondbodbuam/data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSave),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Lade die Daten nach dem Speichern neu, um Konsistenz zu gewährleisten
        await loadProjectData();
    } catch (error) {
        console.error('Error saving project data:', error);
        showMessage('Fehler beim Speichern der Daten. Bitte versuche es später erneut.');
    }
}

function initializeDefaultData() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const monthsSince2023 = (currentYear - 2023) * 12 + currentMonth;

    const profiles = {
        dom: { counter: monthsSince2023, history: [] },
        lex: { counter: monthsSince2023, history: [] }
    };

    const years = [2023, currentYear];

    years.forEach(year => {
        for (let i = 0; i < 12; i++) {
            if (year === currentYear && i > currentMonth) {
                break;
            }
            const date = new Date(year, i, 1);
            const entry = `${date.toLocaleDateString('de-DE')} am 12:00:00 - Do gehts oan glei besser!`;
            profiles.dom.history.push(entry);
            profiles.lex.history.push(entry);
        }
    });

    return { profiles, selectedYear: currentYear };
}

function handleYearChange() {
    if (!selectedProfile) {
        showMessage("Wähle zuerst Dom oder Lex aus, um die Historie für das ausgewählte Jahr zu sehen.");
        yearSelect.value = selectedYear;
        return;
    }
    selectedYear = parseInt(yearSelect.value);
    updateCalendarView(selectedProfile);
}

function selectProfile(profile) {
    if (selectedProfile) {
        document.getElementById(`${selectedProfile}-profile`).classList.remove('selected');
    }
    selectedProfile = profile;
    document.getElementById(`${profile}-profile`).classList.add('selected');
    jumpButton.disabled = false;
    jumpButton.querySelector('.button-text').textContent = `${profile.toUpperCase()} hupf in See!`;
    
    document.querySelectorAll('.history-list').forEach(list => list.style.display = 'none');
    const activeList = document.getElementById(`${profile}-history`);
    activeList.style.display = 'grid';
    
    updateCalendarView(profile);
    yearSelect.disabled = false;
}

function showSelectProfilePrompt() {
    const historyContainers = document.querySelectorAll('.history-list');
    let promptShown = false;

    historyContainers.forEach(container => {
        if (!promptShown) {
            container.innerHTML = '<p class="select-profile-prompt">Klick auf Dom oder Lex, dasst die jeweilige Historie siagst.</p>';
            container.style.display = 'block';
            promptShown = true;
        } else {
            container.innerHTML = '';
            container.style.display = 'none';
        }
    });

    yearSelect.disabled = true;
}

function updateCalendarView(profile) {
    if (!profile) {
        showSelectProfilePrompt();
        return;
    }

    const historyList = document.getElementById(`${profile}-history`);
    historyList.innerHTML = '';

    const months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];

    months.forEach((month, index) => {
        const monthEntry = profiles[profile].history.find(entry => {
            const entryDate = new Date(entry.split(' ')[0].split('.').reverse().join('-'));
            return entryDate.getMonth() === index && entryDate.getFullYear() === selectedYear;
        });

        const monthElement = document.createElement('div');
        monthElement.classList.add('month-entry');
        
        if (monthEntry) {
            monthElement.classList.add('active');
            const entryDate = new Date(monthEntry.split(' ')[0].split('.').reverse().join('-'));
            monthElement.innerHTML = `
                <h3>${month}</h3>
                <p>${entryDate.getDate()}. ${month}</p>
            `;
        } else {
            monthElement.innerHTML = `<h3>${month}</h3>`;
        }

        historyList.appendChild(monthElement);
    });
}

async function takeABath() {
    if (!selectedProfile) {
        showMessage("Bitte wähle zuerst ein Profil aus.");
        return;
    }

    await loadProjectData(); // Lade aktuelle Daten vor der Aktualisierung

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const todayString = currentDate.toISOString().split('T')[0]; // Format: "YYYY-MM-DD"

    if (!profiles[selectedProfile].history) {
        profiles[selectedProfile].history = [];
    }

    const alreadyJumped = profiles[selectedProfile].history.includes(todayString);

    if (alreadyJumped) {
        showMessage(`He ${selectedProfile}, du woast des monat scho drin!`);
        return;
    }

    const profileElement = document.getElementById(`${selectedProfile}-profile`);
    const profileImageContainer = profileElement.querySelector('.profile-image-container');
    
    const clonedImage = profileImageContainer.cloneNode(true);
    clonedImage.classList.add('bathing');
    lakeContainer.appendChild(clonedImage);

    const newCounterValue = profiles[selectedProfile].counter + 1;
    
    let animationType = 'normal';
    if (newCounterValue === 20) animationType = 'gold';
    else if (newCounterValue === 25) animationType = 'rainbow';
    else if (newCounterValue === 30) animationType = 'fireworks';
    
    createWaterDrops(clonedImage, animationType);
    await updateCounter();
    await updateHistory();
    updateCalendarView(selectedProfile);
    
    let message = `Oke ${selectedProfile} des woa 2 cm koit!`;
    if (newCounterValue === 20) message = `Wahnsinn, ${selectedProfile}! 20 Monate - du bist a echta Strondbodbuam!`;
    else if (newCounterValue === 25) message = `25 Monate, ${selectedProfile}! Du bist scho fast mit'm See verwandt!`;
    else if (newCounterValue === 30) message = `30 Monate, ${selectedProfile}! Du bist jetzt offiziell a Wasserratte!`;
    
    showMessage(message);
    
    setTimeout(() => {
        if (clonedImage.parentNode === lakeContainer) {
            lakeContainer.removeChild(clonedImage);
        }
    }, 3000);
}

function createWaterDrops(element, animationType = 'normal') {
    const lakeRect = lakeContainer.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    const centerX = elementRect.left + elementRect.width / 2 - lakeRect.left;
    const centerY = elementRect.top + elementRect.height / 2 - lakeRect.top;

    const dropCount = animationType === 'fireworks' ? 50 : 30;

    for (let i = 0; i < dropCount; i++) {
        setTimeout(() => {
            const drop = document.createElement('div');
            drop.classList.add('water-drop');
            
            if (animationType === 'gold') {
                drop.style.backgroundColor = '#FFD700';
                drop.style.boxShadow = '0 0 5px #FFD700';
            } else if (animationType === 'rainbow') {
                const hue = (i / dropCount) * 360;
                drop.style.backgroundColor = `hsl(${hue}, 100%, 50%)`;
                drop.style.boxShadow = `0 0 5px hsl(${hue}, 100%, 50%)`;
            } else if (animationType === 'fireworks') {
                const angle = (i / dropCount) * Math.PI * 2;
                const distance = Math.random() * 150 + 100;
                drop.style.setProperty('--tx', `${Math.cos(angle) * distance}px`);
                drop.style.setProperty('--ty', `${Math.sin(angle) * distance - 200}px`);
            }

            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 100 + 50;
            drop.style.left = `${centerX + Math.cos(angle) * distance}px`;
            drop.style.top = `${centerY + Math.sin(angle) * distance}px`;
            drop.style.width = `${Math.random() * 10 + 5}px`;
            drop.style.height = drop.style.width;
            splashContainer.appendChild(drop);
            setTimeout(() => drop.remove(), 1000);
        }, i * 50);
    }
}

async function updateCounter() {
    profiles[selectedProfile].counter++;
    const counterElement = document.querySelector(`#${selectedProfile}-profile .counter`);
    counterElement.textContent = `${profiles[selectedProfile].counter} Monat${profiles[selectedProfile].counter !== 1 ? 'e' : ''}`;
    await saveProjectData();
}

async function updateHistory(dateString) {
    if (!profiles[selectedProfile].history) {
        profiles[selectedProfile].history = [];
    }

    profiles[selectedProfile].history.push(dateString);

    // Entferne Duplikate und sortiere die History
    profiles[selectedProfile].history = [...new Set(profiles[selectedProfile].history)].sort().reverse();

    await saveProjectData();
    updateCalendarView(selectedProfile);
}

function showMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.classList.add('message');
    document.body.appendChild(messageElement);

    setTimeout(() => {
        messageElement.classList.add('show');
        setTimeout(() => {
            messageElement.classList.remove('show');
            setTimeout(() => messageElement.remove(), 500);
        }, 3000);
    }, 10);
}

function updateUI() {
    ['dom', 'lex'].forEach(profile => {
        const counterElement = document.querySelector(`#${profile}-profile .counter`);
        counterElement.textContent = `${profiles[profile].counter} Monat${profiles[profile].counter !== 1 ? 'e' : ''}`;
    });
}

function initYearSelect() {
    const startYear = currentYear - 2;
    const endYear = currentYear + 2;
    for (let year = startYear; year <= endYear; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }
    yearSelect.value = currentYear;
}

let secretCode = '';
document.addEventListener('keydown', (e) => {
    secretCode += e.key;
    if (secretCode.includes('strondbodbuam')) {
        showMessage('You found the secret Strondbodbuam code! 🎉');
        createWaterDrops(document.querySelector('.lake-container'));
        secretCode = '';
    }
});

async function initializeApp() {
    await loadProjectData();
    updateUI();
    showSelectProfilePrompt();
}

window.addEventListener('load', initializeApp);

// Initialisierung
initYearSelect();
window.addEventListener('load', loadProjectData);