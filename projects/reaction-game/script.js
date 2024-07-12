// DOM Elements
const body = document.body;
const colorModeToggle = document.getElementById('color-mode-toggle');
const usernameInput = document.getElementById('username');
const startGameButton = document.getElementById('start-game');
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

// Color mode toggle
colorModeToggle.addEventListener('change', () => {
    body.classList.toggle('color-mode-1');
    body.classList.toggle('color-mode-2');
    updateHighscoresDisplay(); // Refresh highscores to update top-three styling
});

// Start game button click
startGameButton.addEventListener('click', () => {
    username = usernameInput.value.trim();
    if (username) {
        document.getElementById('username-input').classList.add('hidden');
        gameArea.classList.remove('hidden');
        loadHighscores();
    } else {
        alert('Wie soin ma die den nenna?');
    }
});

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
        reactionButton.textContent = 'Geht scho klick!';
        startTime = new Date().getTime();
        isWaiting = false;
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
        }
    } else {
        reactionButton.classList.remove('active');
        reactionButton.classList.add('error');
        reactionButton.textContent = 'Schod';
        result.textContent = 'Deine Finger san schnölla wie dei Kopf.';
        clearTimeout(timeoutId);
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
    fetch('/projects/reaction-game/data')
        .then(response => response.json())
        .then(data => {
            highscores = data.highscores || [];
            updateHighscoresDisplay();
        })
        .catch(error => console.error('Error:', error));
}

function saveHighscoresToServer() {
    fetch('/projects/reaction-game/data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ highscores: highscores }),
    })
    .then(response => response.json())
    .then(data => console.log('Success:', data))
    .catch((error) => console.error('Error:', error));
}

// Initialize color mode
body.classList.add('color-mode-1');

// Load highscores on page load
loadHighscores();