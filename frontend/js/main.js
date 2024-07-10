document.addEventListener('DOMContentLoaded', () => {

    const profileImage = document.querySelector('.profile-image');
    let currentImageIndex = 1;
    const totalImages = 3;
    // Projekte-Daten
    const projects = [
        {
            title: 'Strondbodbuam',
            description: 'Ein innovativer Counter für Hallstättersee-Sprünge mit kreativen CSS-Animationen.',
            image: '/projects/strondbodbuam/see.webp',
            link: '/projects/strondbodbuam/index.html',
            passwordProtected: true
        },
        {
            title: 'Rinnerhütte',
            description: 'Eine moderne Website für die Rinnerhütte im Toten Gebirge.',
            image: '/projects/rinnerhuette/images/huette.webp',
            link: '/projects/rinnerhuette/index.html',
            passwordProtected: true
        },
        {
            title: 'Norway Counter',
            description: 'Ein Countdown für eine Reise nach Norwegen mit JavaScript.',
            image: '/projects/norwaycounter/lf.webp',
            link: '/projects/norwaycounter/index.html',
            passwordProtected: false
        }
    ];

    // Setze das initiale Bild
    profileImage.src = `/images/thatsme${currentImageIndex}.webp`;

    profileImage.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex % totalImages) + 1;
        profileImage.src = `/images/thatsme${currentImageIndex}.webp`;
        profileImage.classList.add('image-change');
        setTimeout(() => profileImage.classList.remove('image-change'), 500);
    });

    // Funktion zum Laden der Projekte
    const loadProjects = () => {
        const projectContainer = document.getElementById('project-container');
        projects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            projectCard.innerHTML = `
                <img src="${project.image}" alt="${project.title}" class="project-image">
                <div class="project-info">
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    <a href="#" class="project-link" data-link="${project.link}" data-protected="${project.passwordProtected}">
                        ${project.passwordProtected ? 'Passwort eingeben' : 'Zum Projekt'}
                    </a>
                </div>
            `;
            projectContainer.appendChild(projectCard);
        });
    };

    const promptPassword = (link) => {
        const password = prompt("Bitte geben Sie das Passwort ein:");
        if (password) {
            // Hier würden Sie normalerweise eine Serveranfrage machen, um das Passwort zu überprüfen
            // Für dieses Beispiel verwenden wir ein hartcodiertes Passwort
            if (password === "dev") {
                window.location.href = link;
            } else {
                alert("Falsches Passwort. Zugriff verweigert.");
            }
        }
    };

    // Projekte laden
    loadProjects();

        document.getElementById('project-container').addEventListener('click', (e) => {
        if (e.target.classList.contains('project-link')) {
            e.preventDefault();
            const link = e.target.dataset.link;
            const isProtected = e.target.dataset.protected === 'true';
            
            if (isProtected) {
                promptPassword(link);
            } else {
                window.location.href = link;
            }
        }
    });

    // Typed.js Initialisierung
    const typed = new Typed('#typed-text', {
        strings: ['Webentwickler', 'Naturliebhaber', 'IT-Enthusiast'],
        typeSpeed: 50,
        backSpeed: 50,
        backDelay: 2000,
        loop: true
    });

    // Particles.js Initialisierung
    particlesJS('particles-js', {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: "#ffffff" },
            shape: { type: "circle" },
            opacity: { value: 0.5, random: false },
            size: { value: 3, random: true },
            line_linked: {
                enable: true,
                distance: 150,
                color: "#ffffff",
                opacity: 0.4,
                width: 1
            },
            move: {
                enable: true,
                speed: 2,
                direction: "none",
                random: false,
                straight: false,
                out_mode: "out",
                bounce: false,
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: { enable: true, mode: "repulse" },
                onclick: { enable: true, mode: "push" },
                resize: true
            },
            modes: {
                repulse: { distance: 100, duration: 0.4 },
                push: { particles_nb: 4 }
            }
        },
        retina_detect: true
    });

    // Smooth Scroll für Navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            const navbarHeight = document.querySelector('header').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });

    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('nav');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        nav.classList.toggle('active');
    });

    // Schließe das mobile Menü, wenn ein Link geklickt wird
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            nav.classList.remove('active');
        });
    });

    // Schließe das mobile Menü, wenn außerhalb geklickt wird
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !navToggle.contains(e.target)) {
            navToggle.classList.remove('active');
            nav.classList.remove('active');
        }
    });

        // Ripple-Effekt für Projekt-Links
    document.querySelectorAll('.project-link').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            this.appendChild(ripple);

            const x = e.clientX - e.target.offsetLeft;
            const y = e.clientY - e.target.offsetTop;
            
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;

            const link = this.getAttribute('href');
            
            setTimeout(() => {
                ripple.remove();
                window.location.href = link;
            }, 600); // Entspricht der Dauer der Ripple-Animation
        });
    });
});

