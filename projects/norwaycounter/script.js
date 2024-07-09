const countdownDate = new Date("2024-07-19T18:00:00").getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const distance = countdownDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("days").innerText = days.toString().padStart(2, '0');
    document.getElementById("hours").innerText = hours.toString().padStart(2, '0');
    document.getElementById("minutes").innerText = minutes.toString().padStart(2, '0');
    document.getElementById("seconds").innerText = seconds.toString().padStart(2, '0');

    if (distance < 0) {
        clearInterval(countdownTimer);
        document.getElementById("countdown").innerHTML = "Die Reise hat begonnen!";
    }
}

const countdownTimer = setInterval(updateCountdown, 1000);

updateCountdown();

// Automatischer Bildwechsel
const landscapes = document.querySelectorAll('.landscape');
let currentIndex = 0;

function changeBackground() {
    landscapes[currentIndex].style.opacity = '0';
    currentIndex = (currentIndex + 1) % landscapes.length;
    landscapes[currentIndex].style.opacity = '1';
}

// Funktion zum Überprüfen und Setzen der Bildgröße
function setLandscapeSize() {
    const isMobile = window.innerWidth <= 768;
    landscapes.forEach(landscape => {
        landscape.style.height = isMobile ? '50vh' : '100%';
    });
}

// Event Listener für Fenstergrößenänderungen
window.addEventListener('resize', setLandscapeSize);

// Initialisierung
window.addEventListener('load', () => {
    setLandscapeSize();
    landscapes[0].style.opacity = '1';
    setInterval(changeBackground, 5000);
});