// frontend/js/downloads.js
document.addEventListener('DOMContentLoaded', () => {
    // Downloads-Daten
    const downloads = [
/*         {
            title: 'Spamassassin',
            description: 'Ein fortschrittliches Tool zur Spam-Erkennung und -Filterung. Entwickelt mit Python und Machine Learning, bietet es eine hohe Erkennungsrate und einfache Integration in bestehende Mail-Server.',
            size: '849 KB',
            date: '21.01.2025',
            category: 'Security',
            link: 'https://www.domkoenig.com/api/download/spamassassin.zip',
            techStack: ['Python', 'ML', 'JSON']
        },
        {
            title: 'Log Parser',
            description: 'Ein effizientes Werkzeug zur Analyse von Server-Logs. Erkennt Muster, erstellt übersichtliche Berichte und hilft bei der Fehlersuche.',
            size: '245 KB',
            date: '15.01.2025',
            category: 'DevOps',
            link: 'https://www.domkoenig.com/api/download/logparser.zip',
            techStack: ['Python', 'RegEx']
        } */
        // Weitere Downloads hier hinzufügen
    ];

    const loadDownloads = () => {
        const downloadContainer = document.getElementById('downloads-container');
        
        if (downloads.length === 0) {
            const noDownloadsCard = document.createElement('div');
            noDownloadsCard.className = 'download-card no-downloads';
            noDownloadsCard.innerHTML = `
                <div class="empty-downloads">
                    <i class="fas fa-cloud-download-alt"></i>
                    <h3>Keine Downloads verfügbar</h3>
                    <p>Derzeit sind keine Downloads verfügbar. Schau einfach später wieder vorbei!</p>
                </div>
            `;
            downloadContainer.appendChild(noDownloadsCard);
            return;
        }

        // Downloads laden
        downloads.forEach(download => {
            const downloadCard = document.createElement('div');
            downloadCard.className = 'download-card';
            downloadCard.innerHTML = `
                <div class="download-header">
                    <div class="download-category">
                        <i class="fas fa-folder"></i>
                        ${download.category}
                    </div>
                    <div class="download-meta">
                        <span class="download-size">
                            <i class="fas fa-file"></i>
                            ${download.size}
                        </span>
                        <span class="download-date">
                            <i class="fas fa-calendar"></i>
                            ${download.date}
                        </span>
                    </div>
                </div>
                <div class="download-content">
                    <h3 class="download-title">${download.title}</h3>
                    <p class="download-description">${download.description}</p>
                    <div class="tech-stack">
                        ${download.techStack.map(tech => `
                            <span class="tech-badge">${tech}</span>
                        `).join('')}
                    </div>
                </div>
                <div class="download-footer">
                    <a href="${download.link}" class="download-button">
                        <i class="fas fa-download"></i>
                        Download
                    </a>
                </div>
            `;
            downloadContainer.appendChild(downloadCard);
        });
    };

    // Downloads laden
    loadDownloads();

    // Hover-Effekt für Download-Karten
    document.querySelectorAll('.download-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.querySelector('.download-button')?.classList.add('pulse');
        });
        
        card.addEventListener('mouseleave', function() {
            this.querySelector('.download-button')?.classList.remove('pulse');
        });
    });
});