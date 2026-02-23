document.addEventListener('DOMContentLoaded', () => {

        // Profilbild-Logik
        const profileImage = document.querySelector('.profile-image');
        let currentImageIndex = 1;
        const totalImages = 3;
    
        // Setze das initiale Bild
        profileImage.src = `/images/thatsme${currentImageIndex}.webp`;
    
        // Lade-Handler für das Bild
        profileImage.addEventListener('load', () => {
            profileImage.classList.add('loaded');
        });
    
        // Fallback, falls das Bild bereits im Cache ist
        if (profileImage.complete) {
            profileImage.classList.add('loaded');
        }
    
        // Click-Event für Bildwechsel
        profileImage.addEventListener('click', () => {
            currentImageIndex = (currentImageIndex % totalImages) + 1;
            profileImage.classList.remove('loaded');
            profileImage.src = `/images/thatsme${currentImageIndex}.webp`;
            profileImage.classList.add('image-change');
            setTimeout(() => profileImage.classList.remove('image-change'), 500);
        });

    // Projekte-Daten
    const projects = [
        {
            title: 'Shanty Kindergarten',
            description: 'Ein Kalendar der unsere Arbeit wesentlich erleichtert.',
            image: '/projects/dogcare-calendar/shanti.jpg',
            link: '/projects/dogcare-calendar/index.html',
            passwordProtected: false
        },
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
        },
        {   title: 'Fotografie Portfolio',
            description: 'Eine Website für einen unglaublich talentierten Fotografen mit dynamischem Bildladen.',
            image: '/projects/luki-portfolio/images/profile.webp',
            link: '/projects/luki-portfolio/index.html',
            passwordProtected: true
        },
        {   title: 'Soizkommaguad Events',
            description: 'Projekt in Arbeit....',
            image: '/projects/salzi-events/images/logo.png',
            link: '/projects/salzi-events/index.html',
            passwordProtected: false
        },
        {
            title: 'SCORM Converter',
            description: 'Projekt in Arbeit....',
            image: '/projects/pdf-converter//logo_new.png',
            link: '/projects/pdf-converter/index.html',
            passwordProtected: false
        },
            /*
        {
            title: 'Awareness Dashboard',
            description: 'Ein Awarness Dashboard für Mitarbeiter.',
            image: '/projects/muki/logo.jpeg',
            link: '/projects/muki/index.html',
            passwordProtected: true
        },
            */
        // {
        //     title: 'Fitness Tracker',
        //     description: 'Ein Fitness Tracker für alle Fitnessbegeisterten.',
        //     image: '/projects/fitness/images/logo.jpg',
        //     link: '/projects/fitness/index.html',
        //     passwordProtected: true
        // },
    ];

    // Setze das initiale Bild
    profileImage.src = `/images/thatsme${currentImageIndex}.webp`;

    document.querySelectorAll('.skills-list li').forEach(skill => {
        skill.addEventListener('mousemove', (e) => {
            const rect = skill.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            // Update der CSS-Variablen für den Glanz-Effekt
            skill.style.setProperty('--mouse-x', `${x}%`);
            skill.style.setProperty('--mouse-y', `${y}%`);
            
            // 3D-Rotation basierend auf der Mausposition
            const rotateY = ((x - 50) / 50) * 10;
            const rotateX = ((y - 50) / 50) * -10;
            
            skill.style.transform = `
                perspective(1000px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg)
                translateZ(20px)
            `;
        });
        
        skill.addEventListener('mouseleave', () => {
            skill.style.transform = `
                perspective(1000px)
                rotateX(0deg)
                rotateY(0deg)
                translateZ(0px)
            `;
        });
    });

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

    const promptPassword = async (link) => {
        const password = prompt("Bitte geben Sie das Passwort ein:");
        if (password) {
            try {
                const response = await fetch('/api/verify-password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ password })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    window.location.href = link;
                } else {
                    alert("Falsches Passwort. Zugriff verweigert.");
                }
            } catch (error) {
                console.error('Fehler bei der Passwortüberprüfung:', error);
                alert("Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.");
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

    // Hover-Effekt für Projekt-Karten
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.querySelector('.project-link')?.classList.add('pulse');
        });
        
        card.addEventListener('mouseleave', function() {
            this.querySelector('.project-link')?.classList.remove('pulse');
        });
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

