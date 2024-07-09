function debugLog(message) {
    console.log(`DEBUG: ${message}`);
  }

// Globale Variablen
let selectedProfile = null;
let selectedYear = new Date().getFullYear();

const currentYear = new Date().getFullYear();

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
      let data = await response.json();
      debugLog(`Loaded data: ${JSON.stringify(data)}`);
      
      if (!data.profiles || Object.keys(data.profiles).length === 0) {
        debugLog('Initializing default data');
        data = initializeDefaultData();
      } else {
        // Ensure both profiles have a history array
        if (!data.profiles.dom.history) data.profiles.dom.history = [];
        if (!data.profiles.lex.history) data.profiles.lex.history = [];
      }
      
      profiles = data.profiles;
      selectedYear = data.selectedYear || new Date().getFullYear();
      
      debugLog(`Profiles after load: ${JSON.stringify(profiles)}`);
      debugLog(`Selected year: ${selectedYear}`);
      
      await saveProjectData();
      updateUI();
      updateCalendarView(selectedProfile);
    } catch (error) {
      console.error('Error loading project data:', error);
      debugLog('Error loading project data. Initializing default data.');
      const data = initializeDefaultData();
      await saveProjectData();
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
      debugLog('Data saved successfully');
    } catch (error) {
      console.error('Error saving project data:', error);
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
    let promptShown = false; // Flagge, um zu überprüfen, ob die Meldung bereits angezeigt wurde

    historyContainers.forEach(container => {
        if (!promptShown) {
            container.innerHTML = '<p class="select-profile-prompt">Klick auf Dom oder Lex, dasst die jeweilige Historie siagst.</p>';
            container.style.display = 'block';
            promptShown = true; // Setze die Flagge, nachdem die Meldung angezeigt wurde
        } else {
            container.innerHTML = ''; // Leere den Container, wenn die Meldung bereits angezeigt wurde
            container.style.display = 'none'; // Optionale Zeile, um den Container auszublenden
        }
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
    if (!selectedProfile) {
        showMessage("Bitte wähle zuerst ein Profil aus.");
        return;
    }

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const alreadyJumped = await hasJumpedThisMonth(selectedProfile);

    if (alreadyJumped) {
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

    // Überprüfen Sie den neuen Counter-Wert
    const newCounterValue = profiles[selectedProfile].counter + 1;
    
    // Wählen Sie die Animation basierend auf dem Counter-Wert
    let animationType = 'normal';
    if (newCounterValue === 20) animationType = 'gold';
    else if (newCounterValue === 25) animationType = 'rainbow';
    else if (newCounterValue === 30) animationType = 'fireworks';
    
    createWaterDrops(clonedImage, animationType);
    await updateCounter();
    await updateHistory();
    updateCalendarView(selectedProfile);
    
    // Zeigen Sie eine spezielle Nachricht für Meilensteine
    let message = `Oke ${selectedProfile} des woa 2 cm koit!`;
    if (newCounterValue === 20) message = `Wahnsinn, ${selectedProfile}! 20 Monate - du bist a echta Strondbodbuam!`;
    else if (newCounterValue === 25) message = `25 Monate, ${selectedProfile}! Du bist scho fast mit'm See verwandt!`;
    else if (newCounterValue === 30) message = `30 Monate, ${selectedProfile}! Du bist jetzt offiziell a Wasserratte!`;
    
    showMessage(message);

    debugLog(`Bath taken successfully for ${selectedProfile}`);
    
    setTimeout(() => {
        if (clonedImage.parentNode === lakeContainer) {
            lakeContainer.removeChild(clonedImage);
        }
        
        window.scrollTo({
            top: originalScrollPosition,
            behavior: 'smooth'
        });
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
            
            // Setzen Sie verschiedene Stile basierend auf dem Animationstyp
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

async function updateHistory() {
    const currentDate = new Date();
    const bathDate = currentDate.toLocaleDateString('de-DE');
    const bathTime = currentDate.toLocaleTimeString('de-DE');
    const bathEntry = `${bathDate} am ${bathTime} - Do gehts oan glei besser!`;
  
    debugLog(`Updating history for ${selectedProfile} with entry: ${bathEntry}`);
  
    if (!profiles[selectedProfile].history) {
      profiles[selectedProfile].history = [];
    }
  
    profiles[selectedProfile].history.unshift(bathEntry);
  
    // Entfernen Sie doppelte Einträge für denselben Monat und Jahr
    profiles[selectedProfile].history = profiles[selectedProfile].history.filter((entry, index, self) =>
      index === self.findIndex((t) => {
        const entryDate = new Date(t.split(' ')[0].split('.').reverse().join('-'));
        const currentEntryDate = new Date(entry.split(' ')[0].split('.').reverse().join('-'));
        return entryDate.getMonth() === currentEntryDate.getMonth() && 
               entryDate.getFullYear() === currentEntryDate.getFullYear();
      })
    );
  
    debugLog(`Updated history: ${JSON.stringify(profiles[selectedProfile].history)}`);
  
    await saveProjectData();
    updateCalendarView(selectedProfile);
}

async function hasJumpedThisMonth(profile) {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
  
    debugLog(`Checking for ${profile} in month ${currentMonth + 1} and year ${currentYear}`);
    debugLog(`Profile history: ${JSON.stringify(profiles[profile].history)}`);
  
    const result = profiles[profile].history.some(entry => {
      const entryDate = new Date(entry.split(' ')[0].split('.').reverse().join('-'));
      debugLog(`Entry date: ${entryDate}, Month: ${entryDate.getMonth()}, Year: ${entryDate.getFullYear()}`);
      return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear;
    });
  
    debugLog(`Has jumped this month: ${result}`);
    return result;
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

// async function resetData() {
//     const currentYear = new Date().getFullYear();
//     profiles = {
//         dom: { counter: 6, history: [] },
//         lex: { counter: 6, history: [] }
//     };

//     for (let i = 0; i < 6; i++) {
//         const date = new Date(currentYear, i, 1);
//         const entry = `${date.toLocaleDateString('de-DE')} am 12:00:00 - Do gehts oan glei besser!`;
//         profiles.dom.history.push(entry);
//         profiles.lex.history.push(entry);
//     }

//     await saveProjectData();
//     updateUI();
//     selectedProfile = null;
//     document.querySelectorAll('.profile').forEach(profile => profile.classList.remove('selected'));
//     jumpButton.disabled = true;
//     jumpButton.querySelector('.button-text').textContent = 'Geht scho!';
    
//     yearSelect.value = currentYear;
//     selectedYear = currentYear;
    
//     showSelectProfilePrompt();
//     showMessage('Alle Daten wurden zurückgesetzt!');
// }

// document.getElementById('reset-button').addEventListener('click', resetData);

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

async function initializeApp() {
    await loadProjectData();
    updateUI();
    showSelectProfilePrompt();
  }
  
  window.addEventListener('load', initializeApp);

function addTouchSupport(element, handler) {
    element.addEventListener('click', handler);
    element.addEventListener('touchstart', function(e) {
      e.preventDefault();
      handler.call(this, e);
    });
  }
  
  addTouchSupport(domProfile, () => selectProfile('dom'));
  addTouchSupport(lexProfile, () => selectProfile('lex'));
  addTouchSupport(jumpButton, takeABath);

// Initialisierung
initYearSelect();
loadProjectData();