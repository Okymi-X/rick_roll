// Set current year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Simuler un décompte pour l'offre limitée
if (document.querySelector('.countdown')) {
    const updateCountdown = () => {
        const countdownEl = document.querySelector('.countdown');
        const time = countdownEl.textContent.split(':');
        let hours = parseInt(time[0], 10);
        let minutes = parseInt(time[1], 10);
        let seconds = parseInt(time[2], 10);
        
        seconds--;
        if (seconds < 0) {
            seconds = 59;
            minutes--;
        }
        if (minutes < 0) {
            minutes = 59;
            hours--;
        }
        if (hours < 0) {
            hours = 11;
        }
        
        countdownEl.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };
    
    setInterval(updateCountdown, 1000);
}

// Simuler un compteur d'utilisateurs en ligne qui fluctue
if (document.getElementById('online-count')) {
    const updateOnlineUsers = () => {
        const countEl = document.getElementById('online-count');
        let count = parseInt(countEl.textContent.replace(/,/g, ''), 10);
        
        // Ajouter ou soustraire un nombre aléatoire
        const change = Math.random() > 0.5 ? 1 : -1;
        count += change * Math.floor(Math.random() * 5);
        
        // Garder le nombre dans une gamme raisonnable
        if (count < 1200) count = 1200 + Math.floor(Math.random() * 10);
        if (count > 1500) count = 1500 - Math.floor(Math.random() * 10);
        
        countEl.textContent = count.toLocaleString();
    };
    
    setInterval(updateOnlineUsers, 3000);
}

// Mise en place du cookie consent
const cookieConsent = document.getElementById('cookie-consent');
if (cookieConsent) {
    // Afficher après un court délai
    setTimeout(() => {
        cookieConsent.classList.add('show');
    }, 2000);
    
    // Les deux boutons mènent au Rick Roll
    const cookieButtons = cookieConsent.querySelectorAll('button');
    cookieButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            cookieConsent.classList.remove('show');
            setTimeout(activateRickRoll, 500);
        });
    });
}

// Système de gestion d'autoplay et de son pour les vidéos
document.addEventListener('DOMContentLoaded', function() {
    // Boutons pour activer le son
    const unmuteButton = document.getElementById('unmute-button');
    const unmuteBackupButton = document.getElementById('unmute-backup-button');
    const localVideo = document.getElementById('local-video');
    
    // Détecter si mobile et quel type
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    // Ajouter l'attribut playsinline uniquement pour iOS où il est nécessaire
    if (isIOS && localVideo) {
        localVideo.setAttribute('playsinline', '');
    }
    
    // Tenter de démarrer la vidéo avec son
    function attemptAutoplay() {
        // Pour YouTube
        const iframe = document.getElementById('main-video');
        if (iframe && iframe.contentWindow) {
            try {
                iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
                iframe.contentWindow.postMessage('{"event":"command","func":"unMute","args":""}', '*');
            } catch (e) {
                console.log('Error sending commands to YouTube:', e);
            }
        }
        
        // Pour la vidéo de secours
        if (localVideo) {
            try {
                localVideo.muted = false;
                localVideo.play().catch(e => {
                    console.log('Could not autoplay backup video:', e);
                });
            } catch (e) {
                console.log('Error with backup video:', e);
            }
        }
        
        // Masquer les boutons d'activation du son
        if (unmuteButton) unmuteButton.classList.add('hidden');
        if (unmuteBackupButton) unmuteBackupButton.classList.add('hidden');
    }
    
    // Essayer d'activer le son automatiquement
    attemptAutoplay();
    
    // Réessayer après une interaction utilisateur (contourne les restrictions)
    document.addEventListener('click', function() {
        attemptAutoplay();
    }, { once: true });
    
    document.addEventListener('touchstart', function() {
        attemptAutoplay();
    }, { once: true });
    
    document.addEventListener('keydown', function() {
        attemptAutoplay();
    }, { once: true });
    
    // Gestion de son pour YouTube
    if (unmuteButton) {
        unmuteButton.addEventListener('click', function() {
            // Message pour YouTube via postMessage API
            const iframe = document.getElementById('main-video');
            if (iframe && iframe.contentWindow) {
                iframe.contentWindow.postMessage('{"event":"command","func":"unMute","args":""}', '*');
                this.classList.add('hidden');
            }
        });
    }
    
    // Gestion de son pour la vidéo de secours
    if (unmuteBackupButton && localVideo) {
        unmuteBackupButton.addEventListener('click', function() {
            localVideo.muted = false;
            this.classList.add('hidden');
        });
        
        // Forcer la lecture sur mobile après interaction
        localVideo.addEventListener('click', function() {
            if (this.paused) {
                this.play();
            }
            this.muted = false;
            if (unmuteBackupButton) {
                unmuteBackupButton.classList.add('hidden');
            }
        });
    }
    
    // Sur les mobiles, on affiche les boutons de son car l'autoplay est souvent muet
    if (isMobile) {
        if (unmuteButton) unmuteButton.classList.remove('hidden');
        
        // Sur certains appareils iOS, on switch automatiquement à la vidéo de secours
        // car YouTube iframe peut être problématique
        if (isIOS) {
            setTimeout(() => {
                toggleVideoSource();
            }, 1000);
        }
    }
    
    // Bouton pour changer de source vidéo
    const switchVideoButton = document.getElementById('switch-video');
    const switchVideoAltButton = document.getElementById('switch-video-alt');
    
    if (switchVideoButton) {
        switchVideoButton.addEventListener('click', function() {
            toggleVideoSource();
        });
    }
    
    if (switchVideoAltButton) {
        switchVideoAltButton.addEventListener('click', function() {
            toggleVideoSource();
        });
    }
    
    // Vérifier si la vidéo YouTube fonctionne
    setTimeout(checkVideoStatus, 3000);
    
    // Auto-fix pour les navigateurs qui bloquent l'autoplay
    document.body.addEventListener('click', function() {
        const iframe = document.getElementById('main-video');
        const localVideo = document.getElementById('local-video');
        
        if (iframe && iframe.contentWindow) {
            try {
                iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
            } catch (e) {
                console.log('Error sending play command to YouTube:', e);
            }
        }
        
        if (localVideo && localVideo.paused) {
            try {
                localVideo.play();
            } catch (e) {
                console.log('Error playing backup video:', e);
            }
        }
    }, { once: true });
});

// Vérifier si la vidéo YouTube fonctionne correctement et basculer si nécessaire
function checkVideoStatus() {
    const iframe = document.getElementById('main-video');
    const youtubeContainer = document.getElementById('youtube-container');
    const backupVideo = document.getElementById('backup-video');
    
    if (iframe && youtubeContainer) {
        // Si l'iframe est vide ou a une erreur, basculer vers la vidéo de secours
        try {
            if (iframe.clientHeight === 0 || iframe.contentWindow === null) {
                console.log('YouTube video not loading, switching to backup');
                youtubeContainer.classList.add('hidden');
                backupVideo.classList.remove('hidden');
                
                // Essayer de forcer la lecture de la vidéo de secours
                const localVideo = document.getElementById('local-video');
                if (localVideo) {
                    localVideo.play().catch(e => {
                        console.log('Could not autoplay backup video:', e);
                    });
                }
            }
        } catch (e) {
            console.log('Error checking YouTube video, switching to backup:', e);
            youtubeContainer.classList.add('hidden');
            backupVideo.classList.remove('hidden');
            
            // Essayer de forcer la lecture de la vidéo de secours
            const localVideo = document.getElementById('local-video');
            if (localVideo) {
                localVideo.play().catch(e => {
                    console.log('Could not autoplay backup video after error:', e);
                });
            }
        }
    }
}

// Basculer entre les sources vidéo
function toggleVideoSource() {
    const youtubeContainer = document.getElementById('youtube-container');
    const backupVideo = document.getElementById('backup-video');
    const localVideo = document.getElementById('local-video');
    
    if (youtubeContainer.classList.contains('hidden')) {
        youtubeContainer.classList.remove('hidden');
        backupVideo.classList.add('hidden');
        
        // Essayer de forcer la lecture de YouTube avec son
        const iframe = document.getElementById('main-video');
        if (iframe && iframe.contentWindow) {
            try {
                iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
                iframe.contentWindow.postMessage('{"event":"command","func":"unMute","args":""}', '*');
            } catch (e) {
                console.log('Error sending play command to YouTube after toggle:', e);
            }
        }
    } else {
        youtubeContainer.classList.add('hidden');
        backupVideo.classList.remove('hidden');
        
        // Essayer de forcer la lecture de la vidéo de secours avec son
        if (localVideo) {
            localVideo.muted = false;
            localVideo.volume = 1.0;
            localVideo.play().catch(e => {
                console.log('Could not play backup video after toggle:', e);
            });
        }
    }
    
    playPopSound();
}

// Ensure YouTube video plays correctly
document.addEventListener('DOMContentLoaded', function() {
    // Add event listener for user interaction to help with autoplay
    const videoContainer = document.querySelector('.video-container');
    const handleUserInteraction = () => {
        // If iframe exists, we can try to force play via postMessage (won't always work due to security)
        const iframe = document.querySelector('iframe');
        if (iframe) {
            try {
                iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
            } catch (e) {
                console.log('Could not autoplay video after interaction:', e);
            }
        }
        
        // Remove user interaction listeners after first interaction
        document.removeEventListener('click', handleUserInteraction);
        document.removeEventListener('touchstart', handleUserInteraction);
    };
    
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);
    
    // Create backup button in case autoplay doesn't work
    const createPlayButton = () => {
        // Check if button already exists
        if (document.getElementById('play-video-btn')) return;
        
        setTimeout(() => {
            const playButton = document.createElement('button');
            playButton.id = 'play-video-btn';
            playButton.className = 'play-btn';
            playButton.innerHTML = '▶️ Cliquez pour lancer la vidéo';
            playButton.addEventListener('click', function() {
                // Reload iframe with autoplay param
                const iframe = document.querySelector('iframe');
                if (iframe) {
                    const src = iframe.src;
                    iframe.src = src.includes('autoplay=1') ? src : src + '&autoplay=1';
                    this.style.display = 'none';
                }
            });
            videoContainer.appendChild(playButton);
        }, 2000); // Wait 2 seconds to see if video autoplays first
    };
    
    // Check if video might be blocked
    setTimeout(() => {
        // If mobile device, add play button
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            createPlayButton();
        }
    }, 1000);
});

// Fonction pour simuler une interaction utilisateur (aide à contourner les restrictions d'autoplay)
function simulateUserInteraction() {
    // Créer un événement factice
    const clickEvent = new MouseEvent('click', {
        'view': window,
        'bubbles': true,
        'cancelable': true
    });
    
    // Déclencher l'événement sur le document
    document.dispatchEvent(clickEvent);
    
    // Pour les appareils mobiles, simuler également un touchstart
    const touchEvent = new TouchEvent('touchstart', {
        'view': window,
        'bubbles': true,
        'cancelable': true,
        'touches': [new Touch({
            identifier: Date.now(),
            target: document.body
        })]
    });
    
    try {
        document.dispatchEvent(touchEvent);
    } catch (e) {
        // Certains navigateurs peuvent ne pas supporter la création de TouchEvent
        console.log('Could not simulate touch event:', e);
    }
}

// Déclencher l'interaction simulée après un court délai
setTimeout(simulateUserInteraction, 1000);

// Pour Firefox spécifiquement qui peut être plus restrictif
if (navigator.userAgent.indexOf('Firefox') !== -1) {
    setTimeout(simulateUserInteraction, 2000);
}

// Share button functionality
document.getElementById('share-button').addEventListener('click', function() {
    if (navigator.share) {
        navigator.share({
            title: 'Vous devez voir ça!',
            text: 'J\'ai trouvé quelque chose d\'intéressant pour toi!',
            url: window.location.href
        })
        .then(() => console.log('Partage réussi!'))
        .catch((error) => console.log('Erreur de partage:', error));
    } else {
        // Fallback for browsers that don't support the Web Share API
        prompt("Partagez ce lien avec vos amis:", window.location.href);
    }
});

// Add confetti effect when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Create confetti elements
    for (let i = 0; i < 100; i++) {
        createConfetti();
    }
});

function createConfetti() {
    const colors = ['#ff4d4d', '#ffb3b3', '#ff8080', '#ff6666'];
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    
    // Random position, color, and size
    const left = Math.random() * 100;
    const width = Math.random() * 10 + 5;
    const height = width * 0.4;
    const bg = colors[Math.floor(Math.random() * colors.length)];
    
    // Apply styles
    confetti.style.cssText = `
        position: fixed;
        left: ${left}vw;
        top: -5vh;
        width: ${width}px;
        height: ${height}px;
        background-color: ${bg};
        transform: rotate(${Math.random() * 360}deg);
        opacity: ${Math.random() * 0.7 + 0.3};
        z-index: -1;
        animation: fall ${Math.random() * 3 + 2}s linear forwards;
    `;
    
    document.body.appendChild(confetti);
    
    // Remove confetti after animation completes
    setTimeout(() => {
        confetti.remove();
        createConfetti();
    }, (Math.random() * 3 + 2) * 1000);
}

// Add animation to fall
document.head.insertAdjacentHTML('beforeend', `
<style>
@keyframes fall {
    to {
        transform: translateY(105vh) rotate(${Math.random() * 360 + 180}deg);
    }
}

.play-btn {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 50px;
    cursor: pointer;
    font-size: 16px;
    z-index: 10;
}
</style>
`);

// Add some easter eggs and interactions
const title = document.querySelector('.title');
title.addEventListener('click', function() {
    this.textContent = "Never Gonna Give You Up!";
    setTimeout(() => {
        this.textContent = "Vous venez d'être Rick Rollé!";
    }, 2000);
});

// Random number generator helper
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate random counter for victims
document.addEventListener('DOMContentLoaded', function() {
    const victimCounter = document.getElementById('victim-counter');
    if (victimCounter) {
        const baseCount = 38271;
        const randomIncrement = getRandomInt(0, 1000);
        victimCounter.textContent = (baseCount + randomIncrement).toLocaleString();
    }
});

// ===== TROLL EFFECTS =====

// Sound effect utilities
const popSound = document.getElementById('pop-sound');
const clickSound = document.getElementById('click-sound');

function playPopSound() {
    if (popSound) {
        popSound.currentTime = 0;
        popSound.play().catch(e => console.log('Could not play sound', e));
    }
}

function playClickSound() {
    if (clickSound) {
        clickSound.currentTime = 0;
        clickSound.play().catch(e => console.log('Could not play sound', e));
    }
}

// Add troll listeners to all elements with data-troll attribute
document.addEventListener('DOMContentLoaded', function() {
    const trollElements = document.querySelectorAll('[data-troll="true"]');
    
    trollElements.forEach(element => {
        element.addEventListener('click', function(e) {
            e.preventDefault();
            playClickSound();
            activateRickRoll();
        });
        
        // Ajouter un effet de survol shake
        element.addEventListener('mouseenter', function() {
            this.classList.add('shake');
            setTimeout(() => this.classList.remove('shake'), 500);
        });
    });
    
    // Activate on background page click too
    document.getElementById('fake-page').addEventListener('click', function(e) {
        // Check if the click was directly on the fake-page (not on a child element)
        if (e.target === this) {
            activateRickRoll();
        }
    });
    
    // Ready the troll-again and share buttons
    const trollAgainBtn = document.getElementById('troll-again');
    if (trollAgainBtn) {
        trollAgainBtn.addEventListener('click', resetToFakePage);
    }
    
    // Créer les popups aléatoires après un délai
    setTimeout(createRandomPopups, 10000);
    
    // Ajouter les effets de confetti
    setTimeout(() => {
        for (let i = 0; i < 100; i++) {
            createConfetti();
        }
    }, 1000);
    
    // Mettre en place la confirmation de sortie
    setupExitConfirmation();
    
    // Mettre en place le curseur personnalisé
    document.body.addEventListener('mousemove', function(e) {
        if (document.getElementById('rickroll-page').classList.contains('hidden')) return;
        
        if (!customCursor) {
            createCustomCursor();
        }
        updateCustomCursor(e);
    });
});

// Main function to activate Rick Roll
function activateRickRoll() {
    // Vérifier si déjà activé
    if (!document.getElementById('rickroll-page').classList.contains('hidden')) {
        return;
    }
    
    // Masquer la page fake
    document.getElementById('fake-page').classList.add('hidden');
    
    // Afficher la page Rick Roll
    document.getElementById('rickroll-page').classList.remove('hidden');
    
    // Vérifier l'état de la vidéo
    checkVideoStatus();
    
    // Ajouter le curseur personnalisé
    createCustomCursor();
    
    // Ajouter des effets aléatoires
    setTimeout(createRandomPopups, 5000);
    
    // Générer un nombre aléatoire de victimes
    const victimCounter = document.getElementById('victim-counter');
    if (victimCounter) {
        const baseCount = 38271;
        const randomIncrement = getRandomInt(0, 1000);
        victimCounter.textContent = (baseCount + randomIncrement).toLocaleString();
    }
    
    // Ajouter le texte arc-en-ciel
    document.querySelector('.title').classList.add('rainbow-text');
    
    // Créer des confettis
    for (let i = 0; i < 100; i++) {
        createConfetti();
    }
    
    // Mettre en place la confirmation de sortie
    setupExitConfirmation();
    
    // Désactiver la navigation arrière
    history.pushState(null, null, document.URL);
    window.addEventListener('popstate', function(e) {
        history.pushState(null, null, document.URL);
    });
}

// Reset back to fake page for trolling others
function resetToFakePage() {
    // Cacher la page Rick Roll
    document.getElementById('rickroll-page').classList.add('hidden');
    
    // Afficher la page fake
    document.getElementById('fake-page').classList.remove('hidden');
    
    // Supprimer le curseur personnalisé
    removeCustomCursor();
    
    // Supprimer les popups
    clearAllPopups();
    
    // Supprimer la confirmation de sortie
    removeExitConfirmation();
}

// ===== CUSTOM CURSOR =====
let customCursor = null;

function createCustomCursor() {
    // Only proceed if on desktop
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return;
    }
    
    document.body.classList.add('no-cursor');
    
    customCursor = document.createElement('div');
    customCursor.className = 'custom-cursor';
    document.body.appendChild(customCursor);
    
    // Update cursor position
    document.addEventListener('mousemove', updateCustomCursor);
}

function updateCustomCursor(e) {
    if (customCursor) {
        customCursor.style.left = e.clientX + 'px';
        customCursor.style.top = e.clientY + 'px';
    }
}

function removeCustomCursor() {
    if (customCursor) {
        document.body.classList.remove('no-cursor');
        document.removeEventListener('mousemove', updateCustomCursor);
        customCursor.remove();
        customCursor = null;
    }
}

// ===== EXIT CONFIRMATION =====
function setupExitConfirmation() {
    window.addEventListener('beforeunload', showExitConfirmation);
    
    // Set up exit confirmation dialog
    document.getElementById('stay-button').addEventListener('click', function() {
        document.getElementById('no-escape-modal').classList.add('hidden');
    });
    
    // Setup moving button
    const leaveButton = document.getElementById('leave-button');
    leaveButton.addEventListener('mouseover', function() {
        moveButton(this);
    });
    
    leaveButton.addEventListener('click', function() {
        document.getElementById('no-escape-modal').classList.add('hidden');
    });
}

function showExitConfirmation(e) {
    // This only works on older browsers
    // Modern browsers don't allow custom messages for security reasons
    e.preventDefault();
    e.returnValue = '';
    
    // Show our custom modal
    document.getElementById('no-escape-modal').classList.remove('hidden');
    
    return '';
}

function removeExitConfirmation() {
    window.removeEventListener('beforeunload', showExitConfirmation);
}

// Function to move button away from cursor
function moveButton(button) {
    const maxX = window.innerWidth - button.offsetWidth - 100;
    const maxY = window.innerHeight - button.offsetHeight - 100;
    
    const randomX = getRandomInt(50, maxX);
    const randomY = getRandomInt(50, maxY);
    
    button.style.position = 'fixed';
    button.style.left = randomX + 'px';
    button.style.top = randomY + 'px';
}

// ===== RANDOM POPUPS =====
const popupMessages = [
    { title: "Félicitations!", content: "Vous avez été sélectionné pour gagner un iPhone 15 Pro!" },
    { title: "Alerte de Sécurité", content: "Votre ordinateur est infecté par 13 virus! Cliquez pour nettoyer maintenant!" },
    { title: "Sondage", content: "Comment avez-vous trouvé cette expérience de Rick Roll?" },
    { title: "Message Important", content: "Votre ordinateur va redémarrer dans 10 secondes pour installer des mises à jour." },
    { title: "Offre Spéciale", content: "Abonnez-vous à notre newsletter pour recevoir plus de Rick Astley!" }
];

function createRandomPopups() {
    if (!document.getElementById('rickroll-page').classList.contains('hidden')) {
        const popupsContainer = document.getElementById('troll-popups');
        
        // Create a random popup
        const popup = document.createElement('div');
        popup.className = 'troll-popup';
        
        // Random position
        const maxX = window.innerWidth - 300;
        const maxY = window.innerHeight - 150;
        const randomX = getRandomInt(10, maxX);
        const randomY = getRandomInt(10, maxY);
        
        popup.style.left = randomX + 'px';
        popup.style.top = randomY + 'px';
        
        // Random content
        const messageIndex = getRandomInt(0, popupMessages.length - 1);
        const message = popupMessages[messageIndex];
        
        popup.innerHTML = `
            <div class="troll-popup-header">
                <div class="troll-popup-title">${message.title}</div>
                <span class="close-popup">×</span>
            </div>
            <div class="troll-popup-content">
                <p>${message.content}</p>
                <button class="fake-button popup-btn" data-troll="true">OK</button>
            </div>
        `;
        
        popupsContainer.appendChild(popup);
        playPopSound();
        
        // Shake the window a bit
        document.body.classList.add('shake');
        setTimeout(() => {
            document.body.classList.remove('shake');
        }, 500);
        
        // Close button functionality
        popup.querySelector('.close-popup').addEventListener('click', function() {
            popup.remove();
        });
        
        // OK button functionality
        popup.querySelector('.popup-btn').addEventListener('click', function(e) {
            e.preventDefault();
            popup.remove();
            activateRickRoll(); // Make sure it's still running the Rick Roll
        });
        
        // Schedule next popup if user is still on rick roll page
        if (!document.getElementById('rickroll-page').classList.contains('hidden')) {
            const nextPopupTime = getRandomInt(10000, 20000);
            setTimeout(createRandomPopups, nextPopupTime);
        }
    }
}

function clearAllPopups() {
    const popupsContainer = document.getElementById('troll-popups');
    popupsContainer.innerHTML = '';
}

// ===== CONFETTI EFFECTS =====
// Confetti only shows after Rick Roll is activated
function createConfetti() {
    if (document.getElementById('rickroll-page').classList.contains('hidden')) return;
    
    const colors = ['#ff4d4d', '#ffb3b3', '#ff8080', '#ff6666'];
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    
    // Random position, color, and size
    const left = Math.random() * 100;
    const width = Math.random() * 10 + 5;
    const height = width * 0.4;
    const bg = colors[Math.floor(Math.random() * colors.length)];
    
    // Apply styles
    confetti.style.cssText = `
        position: fixed;
        left: ${left}vw;
        top: -5vh;
        width: ${width}px;
        height: ${height}px;
        background-color: ${bg};
        transform: rotate(${Math.random() * 360}deg);
        opacity: ${Math.random() * 0.7 + 0.3};
        z-index: -1;
        animation: fall ${Math.random() * 3 + 2}s linear forwards;
    `;
    
    document.body.appendChild(confetti);
    
    // Remove confetti after animation completes
    setTimeout(() => {
        confetti.remove();
        if (!document.getElementById('rickroll-page').classList.contains('hidden')) {
            createConfetti();
        }
    }, (Math.random() * 3 + 2) * 1000);
}

// Add animation to fall in head
document.head.insertAdjacentHTML('beforeend', `
<style>
@keyframes fall {
    to {
        transform: translateY(105vh) rotate(${Math.random() * 360 + 180}deg);
    }
}
</style>
`);

// Start confetti when Rick Roll is shown
document.addEventListener('DOMContentLoaded', function() {
    // Create initial confetti (won't show until rick roll is activated)
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            createConfetti();
        }, i * 100);
    }
});
