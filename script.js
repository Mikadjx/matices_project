document.addEventListener('DOMContentLoaded', function() {
    // Navigation menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    
    menuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });
    
    // Close menu when a link is clicked
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navLinks.classList.remove('active');
        });
    });
    
    // Sticky Header
    window.addEventListener('scroll', function() {
        const header = document.getElementById('header');
        if (window.scrollY > 100) {
            header.style.backgroundColor = 'rgba(8, 32, 50, 0.95)';
        } else {
            header.style.backgroundColor = 'transparent';
        }
    });
    
    // Active navigation based on scroll position
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section');
        const scrollPosition = window.scrollY;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelector('.nav-links a.active').classList.remove('active');
                document.querySelector(`.nav-links a[href*="${sectionId}"]`).classList.add('active');
            }
        });
    });
    
    // Gallery Filter
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            document.querySelector('.filter-btn.active').classList.remove('active');
            this.classList.add('active');
            
            // Filter items
            const filter = this.getAttribute('data-filter');
            
            galleryItems.forEach(item => {
                if (filter === 'all' || item.classList.contains(filter)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
    
    // =============================================
    // MUSIC PLAYER - Lecture audio réelle
    // =============================================

    const audioPlayer = document.getElementById('audio-player');
    const playPauseBtn = document.getElementById('play-pause');
    const prevBtn = document.getElementById('prev-track');
    const nextBtn = document.getElementById('next-track');
    const progressBar = document.getElementById('progress');
    const progressContainer = document.getElementById('progress-bar');
    const trackTitle = document.getElementById('track-title');
    const albumName = document.getElementById('album-name');
    const currentTimeDisplay = document.getElementById('current-time');
    const totalTimeDisplay = document.getElementById('total-time');
    const playlistItems = document.querySelectorAll('.playlist-item');
    const volumeSlider = document.getElementById('volume-slider');
    const volumeIcon = document.getElementById('volume-icon');

    let currentTrack = 0;
    let isPlaying = false;

    // Initialiser le volume
    if (audioPlayer && volumeSlider) {
        audioPlayer.volume = volumeSlider.value / 100;
    }

    // Fonction pour formater le temps (secondes -> mm:ss)
    function formatTime(seconds) {
        if (isNaN(seconds) || seconds === Infinity) return '--:--';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // Fonction pour charger et jouer une piste
    function loadTrack(index) {
        const items = document.querySelectorAll('.playlist-item');
        if (index < 0 || index >= items.length) return;

        currentTrack = index;
        const item = items[index];
        const src = item.getAttribute('data-src');
        const title = item.querySelector('.track-title').textContent;

        // Mettre à jour l'affichage
        trackTitle.textContent = title;
        albumName.textContent = 'MATICES Live';

        // Mettre à jour la classe active
        items.forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        // Mettre à jour l'icône du bouton play dans la playlist
        items.forEach(i => {
            const btn = i.querySelector('.play-track i');
            btn.className = 'fas fa-play';
        });

        // Charger l'audio
        audioPlayer.src = src;
        audioPlayer.load();
    }

    // Fonction pour jouer/pauser
    function togglePlay() {
        if (!audioPlayer.src || audioPlayer.src === window.location.href) {
            // Aucune piste chargée, charger la première
            loadTrack(0);
        }

        if (isPlaying) {
            audioPlayer.pause();
        } else {
            audioPlayer.play().catch(e => {
                console.log('Erreur de lecture:', e);
            });
        }
    }

    // Jouer la piste suivante
    function playNext() {
        const nextIndex = (currentTrack + 1) % playlistItems.length;
        loadTrack(nextIndex);
        audioPlayer.play().catch(e => console.log('Erreur:', e));
    }

    // Jouer la piste précédente
    function playPrev() {
        // Si on est au-delà de 3 secondes, revenir au début de la piste
        if (audioPlayer.currentTime > 3) {
            audioPlayer.currentTime = 0;
        } else {
            const prevIndex = (currentTrack - 1 + playlistItems.length) % playlistItems.length;
            loadTrack(prevIndex);
            audioPlayer.play().catch(e => console.log('Erreur:', e));
        }
    }

    // Event listeners pour les contrôles
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', togglePlay);
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', playNext);
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', playPrev);
    }

    // Clic sur une piste de la playlist
    playlistItems.forEach((item, index) => {
        item.addEventListener('click', function(e) {
            // Éviter le double-clic si on clique sur le bouton play
            if (e.target.closest('.play-track')) {
                e.stopPropagation();
            }
            loadTrack(index);
            audioPlayer.play().catch(e => console.log('Erreur:', e));
        });

        // Bouton play individuel de chaque piste
        const playBtn = item.querySelector('.play-track');
        if (playBtn) {
            playBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                if (currentTrack === index && isPlaying) {
                    audioPlayer.pause();
                } else {
                    loadTrack(index);
                    audioPlayer.play().catch(e => console.log('Erreur:', e));
                }
            });
        }
    });

    // Mise à jour de l'interface quand l'audio joue
    if (audioPlayer) {
        // Quand la lecture commence
        audioPlayer.addEventListener('play', function() {
            isPlaying = true;
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';

            // Mettre à jour l'icône de la piste active
            const activeItem = document.querySelector('.playlist-item.active .play-track i');
            if (activeItem) activeItem.className = 'fas fa-pause';
        });

        // Quand la lecture est en pause
        audioPlayer.addEventListener('pause', function() {
            isPlaying = false;
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';

            // Mettre à jour l'icône de la piste active
            const activeItem = document.querySelector('.playlist-item.active .play-track i');
            if (activeItem) activeItem.className = 'fas fa-play';
        });

        // Mise à jour de la barre de progression
        audioPlayer.addEventListener('timeupdate', function() {
            if (audioPlayer.duration) {
                const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
                progressBar.style.width = `${percent}%`;
                currentTimeDisplay.textContent = formatTime(audioPlayer.currentTime);
            }
        });

        // Quand les métadonnées sont chargées (durée disponible)
        audioPlayer.addEventListener('loadedmetadata', function() {
            totalTimeDisplay.textContent = formatTime(audioPlayer.duration);

            // Mettre à jour la durée dans la playlist
            const activeItem = document.querySelector('.playlist-item.active .track-duration');
            if (activeItem) {
                activeItem.textContent = formatTime(audioPlayer.duration);
            }
        });

        // Quand la piste se termine
        audioPlayer.addEventListener('ended', function() {
            playNext();
        });

        // Gestion des erreurs
        audioPlayer.addEventListener('error', function() {
            console.log('Erreur de chargement du fichier audio');
            totalTimeDisplay.textContent = 'Erreur';
        });
    }

    // Clic sur la barre de progression pour changer de position
    if (progressContainer) {
        progressContainer.addEventListener('click', function(e) {
            if (audioPlayer.duration) {
                const rect = this.getBoundingClientRect();
                const percent = (e.clientX - rect.left) / rect.width;
                audioPlayer.currentTime = percent * audioPlayer.duration;
            }
        });
    }

    // Contrôle du volume
    if (volumeSlider) {
        volumeSlider.addEventListener('input', function() {
            audioPlayer.volume = this.value / 100;
            updateVolumeIcon(this.value);
        });
    }

    // Clic sur l'icône volume pour mute/unmute
    if (volumeIcon) {
        volumeIcon.addEventListener('click', function() {
            if (audioPlayer.volume > 0) {
                audioPlayer.dataset.prevVolume = audioPlayer.volume;
                audioPlayer.volume = 0;
                volumeSlider.value = 0;
                updateVolumeIcon(0);
            } else {
                const prevVol = audioPlayer.dataset.prevVolume || 0.8;
                audioPlayer.volume = prevVol;
                volumeSlider.value = prevVol * 100;
                updateVolumeIcon(prevVol * 100);
            }
        });
    }

    // Mettre à jour l'icône du volume
    function updateVolumeIcon(value) {
        if (value == 0) {
            volumeIcon.className = 'fas fa-volume-mute';
        } else if (value < 50) {
            volumeIcon.className = 'fas fa-volume-down';
        } else {
            volumeIcon.className = 'fas fa-volume-up';
        }
    }

    // Charger les durées de toutes les pistes au chargement de la page
    function loadAllTrackDurations() {
        playlistItems.forEach((item, index) => {
            const src = item.getAttribute('data-src');
            const tempAudio = new Audio();
            tempAudio.src = src;
            tempAudio.addEventListener('loadedmetadata', function() {
                const durationSpan = item.querySelector('.track-duration');
                if (durationSpan) {
                    durationSpan.textContent = formatTime(tempAudio.duration);
                }
            });
        });
    }

    // Charger les durées au démarrage
    loadAllTrackDurations();
    
    // Video Modal Handling
    const videoModal = document.getElementById('video-modal');
    const videoIframe = document.getElementById('video-iframe');
    const closeModal = document.querySelector('.close-modal');
    const watchButtons = document.querySelectorAll('.watch-btn');
    const videoThumbnails = document.querySelectorAll('.video-thumbnail');

    // Fonction pour ouvrir le modal avec une vidéo YouTube
    function openVideoModal(videoId) {
        if (videoId) {
            videoIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
            videoModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    // Fonction pour fermer le modal
    function closeVideoModal() {
        videoModal.style.display = 'none';
        videoIframe.src = '';
        document.body.style.overflow = 'auto';
    }

    // Clic sur les boutons "Regarder"
    watchButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const videoId = this.getAttribute('data-video-id');
            openVideoModal(videoId);
        });
    });

    // Clic sur les thumbnails vidéo
    videoThumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            const videoId = this.getAttribute('data-video-id');
            openVideoModal(videoId);
        });
    });

    // Fermer le modal
    if (closeModal) {
        closeModal.addEventListener('click', closeVideoModal);
    }

    // Fermer en cliquant en dehors
    window.addEventListener('click', function(event) {
        if (event.target === videoModal) {
            closeVideoModal();
        }
    });

    // Fermer avec la touche Escape
    window.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && videoModal.style.display === 'block') {
            closeVideoModal();
        }
    });
    
    // Contact Form Handling
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(event) {
            event.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn ? submitBtn.textContent : '';

            // Disable button and show loading state
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Envoi en cours...';
            }

            try {
                const formData = new FormData(contactForm);

                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    alert('Votre message a été envoyé avec succès ! Nous vous répondrons bientôt.');
                    contactForm.reset();
                } else {
                    const data = await response.json();
                    if (data.errors) {
                        alert('Erreur: ' + data.errors.map(e => e.message).join(', '));
                    } else {
                        alert('Une erreur est survenue lors de l\'envoi. Veuillez réessayer.');
                    }
                }
            } catch (error) {
                console.error('Erreur d\'envoi:', error);
                alert('Une erreur de connexion est survenue. Veuillez vérifier votre connexion internet et réessayer.');
            } finally {
                // Re-enable button
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                }
            }
        });
    }
    
    // Login Form Handling
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // In a real application, this would connect to your Symfony backend
            // For now, let's just show an alert
            alert('Cette fonctionnalité sera connectée à votre backend Symfony.');
        });
    }
    
    // Newsletter Form
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            alert('Merci de vous être inscrit à notre newsletter !');
            newsletterForm.reset();
        });
    }
    
    // Lazy load images (if needed)
    const lazyImages = document.querySelectorAll('.lazy-image');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy-image');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers without IntersectionObserver support
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
        });
    }
});
