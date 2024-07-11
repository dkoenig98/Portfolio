document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling für Navigation Links
    const smoothScroll = (target) => {
        const element = document.querySelector(target);
        window.scrollTo({
            top: element.offsetTop,
            behavior: 'smooth'
        });
    };

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            smoothScroll(this.getAttribute('href'));
        });
    });

    // Parallax Effekt für Header
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        const scrollPosition = window.pageYOffset;
        header.style.backgroundPositionY = scrollPosition * 0.5 + 'px';
    });

    // Fade-In Effekt für Portfolio Items
    const fadeInElements = document.querySelectorAll('.photo-item, .discover-item');
    const fadeInOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px"
    };

    const fadeInObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, fadeInOptions);

    fadeInElements.forEach(element => {
        fadeInObserver.observe(element);
    });

    // Interaktive Hover-Effekte für Portfolio Items
    const portfolioItems = document.querySelectorAll('.photo-item');
    portfolioItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'scale(1.05)';
            item.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
        });
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'scale(1)';
            item.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        });
    });

    // Dynamisches Laden von mehr Portfolio-Bildern
    const loadMoreBtn = document.createElement('button');
    loadMoreBtn.textContent = 'Ich will mehr sehen!';
    loadMoreBtn.classList.add('cta-button', 'load-more-button');
    document.querySelector('#portfolio').appendChild(loadMoreBtn);

    let currentImageCount = document.querySelectorAll('.photo-item').length;
    const totalImages = 12; // Angenommen, es gibt insgesamt 20 Bilder

    loadMoreBtn.addEventListener('click', () => {
        for (let i = currentImageCount + 1; i <= currentImageCount + 4; i++) {
            if (i > totalImages) break;
            const newItem = document.createElement('div');
            newItem.classList.add('photo-item');
            newItem.innerHTML = `
                <img src="images/image${i}.webp" alt="Fotografie ${i}">
                <div class="photo-info">
                    <h3>TITEL ${i}</h3>
                    <p>Beschreibung ${i}</p>
                </div>
            `;
            document.querySelector('.photo-grid').appendChild(newItem);
        }
        currentImageCount = Math.min(currentImageCount + 4, totalImages);
        if (currentImageCount >= totalImages) {
            loadMoreBtn.style.display = 'none';
        }
    });

    // Cursor-Effekt
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    document.querySelectorAll('a, button, .photo-item').forEach(item => {
        item.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
        item.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
    });
});