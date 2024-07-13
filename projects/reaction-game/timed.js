// DOM Elements
const body = document.body;
const gameArea = document.getElementById('game-area');
const reactionButton = document.getElementById('reaction-button');
const result = document.getElementById('result');
const highscoresList = document.getElementById('highscores');
const timerDisplay = document.getElementById('timer');
const clickCountDisplay = document.getElementById('click-count');

// Game variables
let startTime, endTime;
let timeoutId;
let isWaiting = false;
let highscores = [];
let timeLeft = 60;
let clickCount = 0;
let timerInterval;

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
        endRound(false);
    } else {
        endRound(true);
    }
}

function startGame() {
    timeLeft = 60;
    clickCount = 0;
    updateTimerDisplay();
    updateClickCountDisplay();
    startRound();
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function startRound() {
    reactionButton.classList.remove('active', 'error');
    reactionButton.textContent = 'Woat...';
    isWaiting = true;

    const delay = Math.floor(Math.random() * 2000) + 1000; // Random delay between 1-3 seconds
    timeoutId = setTimeout(() => {
        reactionButton.classList.add('active');
        reactionButton.textContent = 'Klick!';
        startTime = new Date().getTime();
        isWaiting = false;
        vibrate(200); // Kurze Vibration, wenn der Button aktiv wird
    }, delay);
}

function endRound(success) {
    if (success) {
        endTime = new Date().getTime();
        const reactionTime = endTime - startTime;
        reactionButton.textContent = `${reactionTime} ms`;
        result.textContent = `Dei Reaktionszeit: ${reactionTime} ms`;
        clickCount++;
        updateClickCountDisplay();
        vibrate(100); // Einfache Vibration für erfolgreichen Klick
    } else {
        reactionButton.classList.remove('active');
        reactionButton.classList.add('error');
        reactionButton.textContent = 'Zu frua!';
        result.textContent = 'Dei Finga san schnölla wie dei Kopf!';
        vibrate([50, 50, 50]); // Dreifache kurze Vibration für Fehler
    }
    
    setTimeout(() => {
        if (timeLeft > 0) {
            startRound();
        } else {
            endGame();
        }
    }, 1000);
}

function endGame() {
    clearInterval(timerInterval);
    clearTimeout(timeoutId);
    reactionButton.classList.add('game-over');
    reactionButton.textContent = 'Zeit um!';
    result.textContent = `Gesamtklicks: ${clickCount}`;
    saveScore(clickCount);
    vibrate([100, 50, 100]); // Vibration am Ende des Spiels
}

function updateTimerDisplay() {
    timerDisplay.textContent = `Zeit: ${timeLeft}s`;
}

function updateClickCountDisplay() {
    clickCountDisplay.textContent = `Klicks: ${clickCount}`;
}

function saveScore(score) {
    const newScore = {
        username: username,
        score: score
    };
    
    const isHighscore = !highscores.length || score > highscores[highscores.length - 1].score;
    
    if (isHighscore) {
        saveHighscoresToServer(newScore);
    } else {
        updateHighscoresDisplay(); // Aktualisiere die Anzeige auch wenn kein neuer Highscore
    }
}

function saveHighscoresToServer(scoreData) {
    fetch('/projects/reaction-game/data/timed', {
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
        showHighscoreMessage(scoreData.score);
    })
    .catch((error) => console.error('Error saving highscore:', error));
}

function updateHighscoresDisplay() {
    highscoresList.innerHTML = '';
    if (Array.isArray(highscores)) {
        highscores.forEach((score, index) => {
            const li = document.createElement('li');
            li.textContent = `${score.username}: ${score.score} klicks`;
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
        message = `Schnölla klickn dasst a moi wos erreichst jetzt bist nua Plotz ${rank}!`;
    }
    
    alert(message);
}

function loadHighscores() {
    fetch('/projects/reaction-game/data/timed')
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