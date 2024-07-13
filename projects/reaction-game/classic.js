// DOM Elements
const body = document.body;
const gameArea = document.getElementById('game-area');
const reactionButton = document.getElementById('reaction-button');
const result = document.getElementById('result');
const highscoresList = document.getElementById('highscores');

// Game variables
let startTime, endTime;
let timeoutId;
let isWaiting = false;
let username = '';
let highscores = [];

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
        endGame(true);
    }
}

function startGame() {
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

function endGame(success) {
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
        reactionButton.classList.remove('active');
        reactionButton.classList.add('error');
        reactionButton.textContent = 'Schod';
        result.textContent = 'Deine Finger san schnölla wie dei Kopf.';
        clearTimeout(timeoutId);
        vibrate([50, 50, 50]); // Dreifache kurze Vibration für Fehler
    }
    
    setTimeout(() => {
        reactionButton.classList.remove('active', 'error');
        reactionButton.textContent = 'Start';
    }, 2000);
}

function saveScore(score) {
    const newScore = {
        username: username,
        score: score
    };
    
    const isHighscore = highscores.length < 10 || score < highscores[highscores.length - 1].score;
    
    if (isHighscore) {
        highscores.push(newScore);
        highscores.sort((a, b) => a.score - b.score);
        highscores = highscores.slice(0, 10); // Keep only top 10 scores
        updateHighscoresDisplay();
        saveHighscoresToServer();
    }
    
    return isHighscore;
}

function updateHighscoresDisplay() {
    highscoresList.innerHTML = '';
    highscores.forEach((score, index) => {
        const li = document.createElement('li');
        li.textContent = `${score.username}: ${score.score} ms`;
        if (index < 3) {
            li.classList.add('top-three');
        }
        highscoresList.appendChild(li);
    });
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
    fetch('/projects/reaction-game/data/classic')
        .then(response => response.json())
        .then(data => {
            highscores = data || [];
            updateHighscoresDisplay();
        })
        .catch(error => console.error('Error:', error));
}

function saveHighscoresToServer(score) {
    fetch('/projects/reaction-game/data/classic', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username, score: score }),
    })
    .then(response => response.json())
    .then(data => {
        highscores = data;
        updateHighscoresDisplay();
    })
    .catch((error) => console.error('Error:', error));
}
