// DOM Elements
const body = document.body;
const gameArea = document.getElementById('game-area');
const reactionButton = document.getElementById('reaction-button');
const result = document.getElementById('result');
const highscoresList = document.getElementById('highscores');
const targetColorSpan = document.getElementById('color-name');

// Game variables
let startTime, endTime;
let timeoutId;
let isWaiting = false;
let highscores = [];
let targetColor = '';
let colorChangeInterval;
let currentButtonColor = '';

const colors = [
    { name: 'Rot', value: '#FF3B30' },
    { name: 'Blau', value: '#007AFF' },
    { name: 'Grün', value: '#34C759' },
    { name: 'Gelb', value: '#FFCC00' },
    { name: 'Lila', value: '#AF52DE' },
    { name: 'Orange', value: '#FF9500' }
];

let username = localStorage.getItem('username');
if (!username) {
    username = 'Anonymous';
    console.warn('Username not set, using "Anonymous"');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const savedMode = localStorage.getItem('colorMode') || '1';
    body.classList.add(`color-mode-${savedMode}`);
    
    username = localStorage.getItem('username');
    if (!username) {
        alert('Bitte setze zuerst deinen Usernamen im Hauptmenü!');
        window.location.href = 'index.html';
        return;
    }

    gameArea.classList.remove('hidden');
    loadHighscores();
});

// Funktion für haptisches Feedback
function vibrate(pattern) {
    if ("vibrate" in navigator) {
        navigator.vibrate(pattern);
    }
}

// Reaction button click
reactionButton.addEventListener('click', handleClick);

function handleClick() {
    if (reactionButton.textContent === 'Start') {
        startGame();
    } else if (isWaiting) {
        endGame(false);
    } else {
        endGame(currentButtonColor === targetColor);
    }
}

function startGame() {
    reactionButton.style.backgroundColor = '';
    reactionButton.textContent = 'Woat...';
    isWaiting = true;
    currentButtonColor = '';

    const delay = Math.floor(Math.random() * 2000) + 1000; // Random delay between 1-3 seconds
    timeoutId = setTimeout(() => {
        const targetColorObj = colors[Math.floor(Math.random() * colors.length)];
        targetColor = targetColorObj.value;
        targetColorSpan.textContent = targetColorObj.name;
        targetColorSpan.style.color = targetColor;
        startColorChange();
        isWaiting = false;
        vibrate(200); // Kurze Vibration, wenn das Spiel startet
    }, delay);
}

function startColorChange() {
    changeButtonColor();
    colorChangeInterval = setInterval(changeButtonColor, 1000); // Change color every second
}

function changeButtonColor() {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    currentButtonColor = randomColor.value;
    reactionButton.style.backgroundColor = currentButtonColor;
    reactionButton.style.color = getContrastColor(currentButtonColor);
    reactionButton.textContent = 'Klick!';
    if (currentButtonColor === targetColor) {
        startTime = new Date().getTime(); // Start timing when the correct color appears
    }
}

function getContrastColor(hexcolor) {
    var r = parseInt(hexcolor.substr(1,2),16);
    var g = parseInt(hexcolor.substr(3,2),16);
    var b = parseInt(hexcolor.substr(5,2),16);
    var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? 'black' : 'white';
}

function endGame(success) {
    clearInterval(colorChangeInterval);
    if (success) {
        endTime = new Date().getTime();
        const reactionTime = endTime - startTime;
        reactionButton.textContent = `${reactionTime} ms`;
        result.textContent = `Dei Reaktionszeit: ${reactionTime} ms`;
        const isHighscore = saveScore(reactionTime);
        if (isHighscore) {
            showHighscoreMessage(reactionTime);
            vibrate([100, 50, 100]); // Doppelte Vibration für Highscore
        } else {
            vibrate(100); // Einfache Vibration für erfolgreichen Klick
        }
    } else {
        reactionButton.style.backgroundColor = '#FF3B30'; // Error color
        reactionButton.style.color = 'white';
        reactionButton.textContent = 'Schod';
        result.textContent = 'Foische Farb oda zu frua!';
        vibrate([50, 50, 50]); // Dreifache kurze Vibration für Fehler
    }
    clearTimeout(timeoutId);
    
    setTimeout(() => {
        reactionButton.style.backgroundColor = '';
        reactionButton.style.color = '';
        reactionButton.textContent = 'Start';
        targetColorSpan.textContent = '';
        targetColorSpan.style.color = '';
        currentButtonColor = '';
    }, 2000);
}

function saveScore(score) {
    const newScore = {
        username: username,
        score: score
    };
    
    const isHighscore = !highscores.length || score < highscores[highscores.length - 1].score;
    
    if (isHighscore) {
        saveHighscoresToServer(newScore);
    }
    
    return isHighscore;
}

function saveHighscoresToServer(scoreData) {
    fetch('/projects/reaction-game/data/color', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(scoreData),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        highscores = Array.isArray(data) ? data : [];
        updateHighscoresDisplay();
    })
    .catch((error) => console.error('Error saving highscore:', error));
}

function updateHighscoresDisplay() {
    highscoresList.innerHTML = '';
    if (Array.isArray(highscores)) {
        highscores.forEach((score, index) => {
            const li = document.createElement('li');
            li.textContent = `${score.username}: ${score.score} ms`;
            if (index < 3) {
                li.classList.add('top-three');
            }
            highscoresList.appendChild(li);
        });
    } else {
        console.error('Highscores is not an array:', highscores);
    }
}

function showHighscoreMessage(score) {
    const rank = highscores.findIndex(hs => hs.username === username && hs.score === score) + 1;
    let message;
    
    if (rank === 1) {
        message = `Aha.. Ned schlecht heast - Plotz ${rank}!`;
    } else if (rank <= 3) {
        message = `Fian erstn hods zwoa ned greicht owa immerhin Top 3 - Plotz ${rank}!`;
    } else {
        message = `Bissi schneller dasst a moi wos erreichst jetzt bist nua Plotz ${rank}!`;
    }
    
    alert(message);
}

function loadHighscores() {
    fetch('/projects/reaction-game/data/color')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            highscores = Array.isArray(data) ? data : [];
            updateHighscoresDisplay();
        })
        .catch(error => {
            console.error('Error:', error);
            highscores = []; // Ensure highscores is always an array
            updateHighscoresDisplay();
        });
}