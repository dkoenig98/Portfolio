// DOM Elements
const body = document.body;
const colorModeToggle = document.getElementById('color-mode-toggle');
const usernameInput = document.getElementById('username');
const setUsernameButton = document.getElementById('set-username');
const modeSelection = document.getElementById('mode-selection');
const welcomeMessage = document.getElementById('welcome-message');
const chooseModeButton = document.getElementById('choose-mode');
const mainMenu = document.getElementById('main-menu');

// Function to set color mode
function setColorMode(mode) {
    body.classList.remove('color-mode-1', 'color-mode-2');
    body.classList.add(`color-mode-${mode}`);
    localStorage.setItem('colorMode', mode);
}

// Color mode toggle
colorModeToggle.addEventListener('change', () => {
    const newMode = body.classList.contains('color-mode-1') ? '2' : '1';
    setColorMode(newMode);
});

// Set username
setUsernameButton.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    if (username) {
        localStorage.setItem('username', username);
        document.getElementById('username-input').classList.add('hidden');
        showModeSelection(username);
    } else {
        alert('Wie soin ma die den nenna?');
    }
});

// Show mode selection
function showModeSelection(username) {
    welcomeMessage.textContent = `Servus, ${username}! Bist bereit zum Spielen?`;
    modeSelection.classList.remove('hidden');
}

// Choose mode button
chooseModeButton.addEventListener('click', () => {
    modeSelection.classList.add('hidden');
    mainMenu.classList.remove('hidden');
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const savedMode = localStorage.getItem('colorMode') || '1';
    setColorMode(savedMode);
    colorModeToggle.checked = savedMode === '2';

    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
        usernameInput.value = savedUsername;
        document.getElementById('username-input').classList.add('hidden');
        showModeSelection(savedUsername);
    }
});