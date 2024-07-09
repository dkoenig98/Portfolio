document.addEventListener('DOMContentLoaded', () => {
    // Projekte-Daten
    const projects = [
        {
            title: 'Strondbodbuam',
            description: 'Ein innovativer Counter für Hallstättersee-Sprünge mit kreativen CSS-Animationen.',
            image: '/projects/strondbodbuam/see.webp',
            link: '/projects/strondbodbuam/index.html'
        },
        {
            title: 'Rinnerhütte',
            description: 'Eine moderne Website für die Rinnerhütte im Toten Gebirge.',
            image: '/projects/rinnerhuette/images/huette.webp',
            link: '/projects/rinnerhuette/index.html'
        }
        // Fügen Sie hier weitere Projekte hinzu
    ];

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
                    <a href="${project.link}" class="project-link">Zum Projekt</a>
                </div>
            `;
            projectContainer.appendChild(projectCard);
        });
    };

    // Projekte laden
    loadProjects();

    const scrollToSection = (e) => {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        const navHeight = document.querySelector('header').offsetHeight;
        const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - navHeight;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    };

    // Event Listener für Navigations-Links
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', scrollToSection);
    });
    

    // Intersection Observer für Scroll-Animationen
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    document.querySelectorAll('section, .project-card').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // Aktiven Navigationslink hervorheben
    const navLinks = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop - sectionHeight / 3) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // Einfache Typ-Animation für die Hauptüberschrift
    const typeWriter = (element, text, speed = 150) => {
        let i = 0;
        const timer = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
            }
        }, speed);
    };

    const h1Element = document.querySelector('h1');
    if (h1Element) {
        const originalText = h1Element.textContent;
        h1Element.textContent = '';
        typeWriter(h1Element, originalText);
    }


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
});