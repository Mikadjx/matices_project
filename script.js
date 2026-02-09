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
    
    // Music Player functionality
    const playPauseBtn = document.getElementById('play-pause');
    const prevBtn = document.getElementById('prev-track');
    const nextBtn = document.getElementById('next-track');
    const progressBar = document.querySelector('.progress');
    const trackTitle = document.getElementById('track-title');
    const albumName = document.getElementById('album-name');
    const currentTimeDisplay = document.getElementById('current-time');
    const totalTimeDisplay = document.getElementById('total-time');
    const playlistItems = document.querySelectorAll('.playlist-item');
    
    // Mock audio handling (in a real scenario, you would use the Audio API)
    let isPlaying = false;
    let currentTrack = 0;
    
    // Simulate play/pause
    playPauseBtn.addEventListener('click', function() {
        isPlaying = !isPlaying;
        
        if (isPlaying) {
            this.innerHTML = '<i class="fas fa-pause"></i>';
            // Audio would start playing here
        } else {
            this.innerHTML = '<i class="fas fa-play"></i>';
            // Audio would pause here
        }
    });
    
    // Track selection from playlist
    playlistItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            currentTrack = index;
            updatePlayerInfo(index);
            
            // Update active class
            document.querySelector('.playlist-item.active').classList.remove('active');
            this.classList.add('active');
            
            // Set to playing state
            isPlaying = true;
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        });
    });
    
    // Previous & Next buttons
    prevBtn.addEventListener('click', function() {
        currentTrack = (currentTrack - 1 + playlistItems.length) % playlistItems.length;
        updatePlayerInfo(currentTrack);
    });
    
    nextBtn.addEventListener('click', function() {
        currentTrack = (currentTrack + 1) % playlistItems.length;
        updatePlayerInfo(currentTrack);
    });
    
    // Update player information
    function updatePlayerInfo(trackIndex) {
        const tracks = [
            { title: 'Rock Remix', album: 'Live Sessions', duration: '3:45' },
            { title: 'Soul Vibe', album: 'Live Sessions', duration: '4:20' },
            { title: 'Funk Groove', album: 'Live Sessions', duration: '3:15' },
            { title: 'Reggae Sunshine', album: 'Live Sessions', duration: '5:10' }
        ];
        
        trackTitle.textContent = tracks[trackIndex].title;
        albumName.textContent = tracks[trackIndex].album;
        totalTimeDisplay.textContent = tracks[trackIndex].duration;
        
        // Update active class
        document.querySelector('.playlist-item.active').classList.remove('active');
        playlistItems[trackIndex].classList.add('active');
    }
    
    // Simulate progress bar
    let progressInterval;
    function simulateProgress() {
        let progress = 0;
        clearInterval(progressInterval);
        
        if (isPlaying) {
            progressInterval = setInterval(() => {
                progress += 1;
                if (progress > 100) {
                    clearInterval(progressInterval);
                    nextBtn.click();
                } else {
                    progressBar.style.width = `${progress}%`;
                    // This would be replaced with actual time calculation
                    let minutes = Math.floor(progress * 0.01 * 3.75);
                    let seconds = Math.floor((progress * 0.01 * 3.75 - minutes) * 60);
                    currentTimeDisplay.textContent = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
                }
            }, 100);
        }
    }
    
    playPauseBtn.addEventListener('click', simulateProgress);
    playlistItems.forEach(item => {
        item.addEventListener('click', simulateProgress);
    });
    
    // Video Modal Handling
    const videoModal = document.getElementById('video-modal');
    const videoIframe = document.getElementById('video-iframe');
    const closeModal = document.querySelector('.close-modal');
    const watchButtons = document.querySelectorAll('.watch-btn');
    
    watchButtons.forEach(button => {
        button.addEventListener('click', function() {
            // In a real scenario, this would contain the actual video URL
            const videoId = "dQw4w9WgXcQ"; // Placeholder YouTube ID
            videoIframe.src = `https://www.youtube.com/embed/${videoId}`;
            videoModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });
    
    closeModal.addEventListener('click', function() {
        videoModal.style.display = 'none';
        videoIframe.src = '';
        document.body.style.overflow = 'auto';
    });
    
    window.addEventListener('click', function(event) {
        if (event.target === videoModal) {
            videoModal.style.display = 'none';
            videoIframe.src = '';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Contact Form Handling
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Form validation and submission logic would go here
            // For now, let's just show an alert
            alert('Votre message a été envoyé !');
            contactForm.reset();
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
