// DOM Elements
const body = document.body;
const usernameInput = document.getElementById('username');
const startGameButton = document.getElementById('start-game');
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
let username = '';
let highscores = [];
let timeLeft = 60;
let clickCount = 0;
let timerInterval;

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

// Reaction button click
reactionButton.addEventListener('click', handleClick);

function handleClick() {
    if (reactionButton.textContent === 'Start') {
        startRound();
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
    } else {
        reactionButton.classList.remove('active');
        reactionButton.classList.add('error');
        reactionButton.textContent = 'Zu frua!';
        result.textContent = 'Dei Finga san schnölla wie dei Kopf!';
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
    const isHighscore = saveScore(clickCount);
    if (isHighscore) {
        showHighscoreMessage(clickCount);
    }
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
    
    const isHighscore = highscores.length < 10 || score > highscores[highscores.length - 1].score;
    
    if (isHighscore) {
        highscores.push(newScore);
        highscores.sort((a, b) => b.score - a.score);
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
        li.textContent = `${score.username}: ${score.score} Klicks`;
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
        message = `Schnölla klickn dasst a moi wos erreichst jetzt bist nua Plotz ${rank}!`;
    }
    
    alert(message);
}

function loadHighscores() {
    fetch('/projects/reaction-game/data/timed')
        .then(response => response.json())
        .then(data => {
            highscores = data || [];
            updateHighscoresDisplay();
        })
        .catch(error => console.error('Error:', error));
}

function saveHighscoresToServer(score) {
    fetch('/projects/reaction-game/data/timed', {
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
