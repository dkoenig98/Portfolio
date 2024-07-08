// Globale Variablen
let selectedProfile = null;
let selectedYear = new Date().getFullYear();

const currentYear = new Date().getFullYear();
let profiles = {
    dom: { counter: 6, history: [] },
    lex: { counter: 6, history: [] }
};

// DOM-Elemente
const domProfile = document.getElementById('dom-profile');
const lexProfile = document.getElementById('lex-profile');
const jumpButton = document.getElementById('jump-button');
const splashContainer = document.getElementById('splash-container');
const historyTabs = document.querySelectorAll('.history-tab');
const historyLists = document.querySelectorAll('.history-list');
const lakeContainer = document.querySelector('.lake-container');
const yearSelect = document.getElementById('year-select');

// Event Listeners
domProfile.addEventListener('click', () => selectProfile('dom'));
lexProfile.addEventListener('click', () => selectProfile('lex'));
jumpButton.addEventListener('click', takeABath);
historyTabs.forEach(tab => tab.addEventListener('click', switchHistoryTab));
yearSelect.addEventListener('change', handleYearChange);



async function loadProjectData() {
    try {
        const response = await fetch('/projects/strondbodbuam/data');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data && data.profiles) {
            profiles = data.profiles;
            selectedYear = data.selectedYear || new Date().getFullYear();
        } else {
            initializeDefaultData();
        }
        updateUI();
        showSelectProfilePrompt(); // Zeige die Aufforderung statt der Historien
    } catch (error) {
        console.error('Error loading project data:', error);
        initializeDefaultData();
        showSelectProfilePrompt();
    }
}

// Funktion zum Speichern der Projektdaten
async function saveProjectData() {
    try {
        const response = await fetch('/projects/strondbodbuam/data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                profiles: profiles,
                selectedYear: selectedYear
            }),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error saving project data:', error);
    }
}

function initializeDefaultData() {
    profiles = {
        dom: { counter: 6, history: [] },
        lex: { counter: 6, history: [] }
    };

    for (let i = 0; i < 6; i++) {
        const date = new Date(currentYear, i, 1);
        const entry = `${date.toLocaleDateString('de-DE')} am 12:00:00 - Do gehts oan glei besser!`;
        profiles.dom.history.push(entry);
        profiles.lex.history.push(entry);
    }
}

function handleYearChange() {
    if (!selectedProfile) {
        showMessage("Wähle zuerst Dom oder Lex aus, um die Historie für das ausgewählte Jahr zu sehen.");
        yearSelect.value = selectedYear; // Setze auf das vorherige Jahr zurück
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
    
    // Aktiviere die Jahresauswahl, nachdem ein Profil ausgewählt wurde
    yearSelect.disabled = false;
}

function showSelectProfilePrompt() {
    const historyContainers = document.querySelectorAll('.history-list');
    historyContainers.forEach(container => {
        container.innerHTML = '<p class="select-profile-prompt">Klick auf Dom oder Lex, dasst die jeweilige Historie siagst.</p>';
        container.style.display = 'block';
    });
    // Deaktiviere die Jahresauswahl, bis ein Profil ausgewählt wurde
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

let originalScrollPosition = 0;

async function takeABath() {
    if (!selectedProfile || hasJumpedThisMonth(selectedProfile)) {
        showMessage(`He ${selectedProfile}, du woast des monat scho drin!`);
        return;
    }

    originalScrollPosition = window.pageYOffset || document.documentElement.scrollTop;

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });

    const profileElement = document.getElementById(`${selectedProfile}-profile`);
    const profileImageContainer = profileElement.querySelector('.profile-image-container');
    
    const clonedImage = profileImageContainer.cloneNode(true);
    clonedImage.classList.add('bathing');
    lakeContainer.appendChild(clonedImage);

    createWaterDrops(clonedImage);
    await updateCounter();
    await updateHistory();
    updateCalendarView(selectedProfile);
    document.querySelectorAll('.history-list').forEach(list => list.style.display = 'none');
    const activeList = document.getElementById(`${selectedProfile}-history`);
    activeList.style.display = 'grid';
    
    document.querySelectorAll('.history-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelector(`.history-tab[data-profile="${selectedProfile}"]`).classList.add('active');
    
    showMessage(`Oke ${selectedProfile} des woa 2 cm koit!`);
    
    setTimeout(() => {
        lakeContainer.removeChild(clonedImage);
        
        window.scrollTo({
            top: originalScrollPosition,
            behavior: 'smooth'
        });
    }, 3000);
}

function createWaterDrops(element) {
    const lakeRect = lakeContainer.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    const centerX = elementRect.left + elementRect.width / 2 - lakeRect.left;
    const centerY = elementRect.top + elementRect.height / 2 - lakeRect.top;

    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const drop = document.createElement('div');
            drop.classList.add('water-drop');
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

async function updateHistory() {
    const currentDate = new Date();
    const bathDate = currentDate.toLocaleDateString('de-DE');
    const bathTime = currentDate.toLocaleTimeString('de-DE');
    const bathEntry = `${bathDate} am ${bathTime} - Do gehts oan glei besser!`;

    profiles[selectedProfile].history.unshift(bathEntry);

    profiles[selectedProfile].history = profiles[selectedProfile].history.filter((entry, index, self) =>
        index === self.findIndex((t) => {
            const entryDate = new Date(t.split(' ')[0].split('.').reverse().join('-'));
            const currentEntryDate = new Date(entry.split(' ')[0].split('.').reverse().join('-'));
            return entryDate.getMonth() === currentEntryDate.getMonth() && 
                   entryDate.getFullYear() === currentEntryDate.getFullYear();
        })
    );

    await saveProjectData();
    updateCalendarView(selectedProfile);
}

function hasJumpedThisMonth(profile) {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    return profiles[profile].history.some(entry => {
        const entryDate = new Date(entry.split(' ')[0].split('.').reverse().join('-'));
        return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear;
    });
}

function switchHistoryTab(event) {
    const profile = event.target.dataset.profile;
    
    historyTabs.forEach(tab => tab.classList.remove('active'));
    historyLists.forEach(list => {
        list.classList.remove('active');
        list.style.display = 'none';
    });
    
    event.target.classList.add('active');
    
    const activeList = document.getElementById(`${profile}-history`);
    activeList.classList.add('active');
    activeList.style.display = 'grid';
    
    updateCalendarView(profile);
}


// Nachricht anzeigen
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

async function resetData() {
    const currentYear = new Date().getFullYear();
    profiles = {
        dom: { counter: 6, history: [] },
        lex: { counter: 6, history: [] }
    };

    for (let i = 0; i < 6; i++) {
        const date = new Date(currentYear, i, 1);
        const entry = `${date.toLocaleDateString('de-DE')} am 12:00:00 - Do gehts oan glei besser!`;
        profiles.dom.history.push(entry);
        profiles.lex.history.push(entry);
    }

    await saveProjectData();
    updateUI();
    selectedProfile = null;
    document.querySelectorAll('.profile').forEach(profile => profile.classList.remove('selected'));
    jumpButton.disabled = true;
    jumpButton.querySelector('.button-text').textContent = 'Geht scho!';
    
    yearSelect.value = currentYear;
    selectedYear = currentYear;
    
    showSelectProfilePrompt();
    showMessage('Alle Daten wurden zurückgesetzt!');
}

document.getElementById('reset-button').addEventListener('click', resetData);

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

// Easter Egg
let secretCode = '';
document.addEventListener('keydown', (e) => {
    secretCode += e.key;
    if (secretCode.includes('strondbodbuam')) {
        showMessage('You found the secret Strondbodbuam code! 🎉');
        createWaterDrops(document.querySelector('.lake-container'));
        secretCode = '';
    }
});

// Initialisierung
initYearSelect();
loadProjectData();