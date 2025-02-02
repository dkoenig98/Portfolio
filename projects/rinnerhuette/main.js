document.addEventListener('DOMContentLoaded', function() {
    
    initMap();
});

// Navigation
const navSlide = () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    burger.addEventListener('click', () => {
        toggleNav();
    });

    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('nav-active')) {
                toggleNav();
            }
        });
    });

    // Close nav when clicking outside
    document.addEventListener('click', (event) => {
        if (nav.classList.contains('nav-active') && !nav.contains(event.target) && !burger.contains(event.target)) {
            toggleNav();
        }
    });
}

function resetNavbarOnLoad() {
    const navbar = document.getElementById('navbar');
    navbar.classList.remove('scrolled');
}

function toggleNav() {
    const nav = document.querySelector('.nav-links');
    const burger = document.querySelector('.burger');
    nav.classList.toggle('nav-active');
    burger.classList.toggle('toggle');
    document.querySelectorAll('.nav-links li').forEach((link, index) => {
        if (link.style.animation) {
            link.style.animation = '';
        } else {
            link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
        }
    });
}

window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    const isHomePage = document.body.classList.contains('home-page');
    const isBookingPage = document.body.classList.contains('booking-page');
    const isWanderungenPage = document.body.classList.contains('wanderungen-page');

    if ((isHomePage || isBookingPage || isWanderungenPage) && window.scrollY > 70) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    document.querySelectorAll('.fade-in').forEach(element => {
        if (isElementInViewport(element)) {
            element.classList.add('visible');
        }
    });

    updateLocationIndicator();
});

function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight)
    );
}

function updateLocationIndicator() {
    const scrollPosition = window.scrollY + window.innerHeight / 2;
    const sections = document.querySelectorAll('section');
    const locationDots = document.querySelectorAll('.location-dot');

    sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            locationDots.forEach(dot => dot.classList.remove('active'));
            if (locationDots[index]) {
                locationDots[index].classList.add('active');
            }
        }
    });

    // Wenn wir am Ende der Seite sind, aktivieren wir den letzten Punkt
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        locationDots.forEach(dot => dot.classList.remove('active'));
        locationDots[locationDots.length - 1].classList.add('active');
    }
}

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Initialize
navSlide();
updateLocationIndicator();
window.addEventListener('load', updateLocationIndicator);

function initMap() {
    var mapElement = document.getElementById('map');
    if (mapElement) {
        // Verzögerung hinzufügen, um sicherzustellen, dass das DOM vollständig geladen ist
        setTimeout(function() {
            var map = L.map(mapElement).setView([47.72526, 13.848444], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            L.marker([47.72526, 13.848444]).addTo(map)
                .bindPopup('Riennerhütte')
                .openPopup();
        }, 100);
    }
}

resetNavbarOnLoad();

// Fügen Sie diese Funktion am Ende der Datei hinzu:
function checkMapVisibility() {
    var mapElement = document.getElementById('map');
    if (mapElement && isElementInViewport(mapElement) && !mapElement.hasAttribute('data-map-initialized')) {
        initMap();
        mapElement.setAttribute('data-map-initialized', 'true');
    }
}

// Style Switcher
document.addEventListener('DOMContentLoaded', function() {
    // Style-Definitionen
    const styles = {
        default: {
            primaryColor: '#415468',
            secondaryColor: '#6e8898',
            accentColor: '#ff6b6b',
            bgColor: '#f7f7f7',
            textColor: '#333'
        },
        rustic: {
            primaryColor: '#8B4513',
            secondaryColor: '#A0522D',
            accentColor: '#D2691E',
            bgColor: '#FDF5E6',
            textColor: '#3E2723'
        },
        modern: {
            primaryColor: '#2C3E50',
            secondaryColor: '#34495E',
            accentColor: '#3498DB',
            bgColor: '#FFFFFF',
            textColor: '#2C3E50'
        },
        nature: {
            primaryColor: '#2E7D32',
            secondaryColor: '#388E3C',
            accentColor: '#FFA000',
            bgColor: '#F1F8E9',
            textColor: '#1B5E20'
        },
        alpine: {
            primaryColor: '#1A237E',
            secondaryColor: '#303F9F',
            accentColor: '#C2185B',
            bgColor: '#F5F5F5',
            textColor: '#0D47A1'
        }
    };

    // Funktion zum Anwenden eines Stils
    function applyStyle(styleName) {
        const style = styles[styleName];
        const root = document.documentElement;
        
        // CSS-Variablen aktualisieren
        root.style.setProperty('--primary-color', style.primaryColor);
        root.style.setProperty('--secondary-color', style.secondaryColor);
        root.style.setProperty('--accent-color', style.accentColor);
        root.style.setProperty('--bg-color', style.bgColor);
        root.style.setProperty('--text-color', style.textColor);

        // Active-Klasse der Buttons aktualisieren
        document.querySelectorAll('.style-button').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.style === styleName) {
                btn.classList.add('active');
            }
        });

        // Stil in localStorage speichern
        localStorage.setItem('selectedStyle', styleName);
    }

    // Event-Listener für die Buttons
    document.querySelectorAll('.style-button').forEach(button => {
        button.addEventListener('click', () => {
            const styleName = button.dataset.style;
            applyStyle(styleName);
        });
    });

    // Gespeicherten Stil beim Laden wiederherstellen
    const savedStyle = localStorage.getItem('selectedStyle');
    if (savedStyle) {
        applyStyle(savedStyle);
    }
});

// Fügen Sie diese Event-Listener am Ende der Datei hinzu:
window.addEventListener('scroll', checkMapVisibility);
window.addEventListener('resize', checkMapVisibility);
document.addEventListener('DOMContentLoaded', checkMapVisibility);


