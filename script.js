// SPICE BERG - Interactive Parallax Experience
document.addEventListener('DOMContentLoaded', () => {
    
    // ========== THEME CONFIGURATION ==========
    const themes = {
        truffle: {
            name: 'Midnight Truffle',
            primaryBg: '#0a0a0a',
            secondaryBg: '#1a1a1a',
            accent: '#d4af37',
            textPrimary: '#ffffff',
            textSecondary: '#b0b0b0',
            glow: 'rgba(212, 175, 55, 0.3)',
            particle: '#d4af37'
        },
        saffron: {
            name: 'Sunset Saffron',
            primaryBg: '#1a0f0a',
            secondaryBg: '#2d1f14',
            accent: '#ff6b35',
            textPrimary: '#fff8f0',
            textSecondary: '#ffb088',
            glow: 'rgba(255, 107, 53, 0.4)',
            particle: '#ff6b35'
        },
        ocean: {
            name: 'Ocean Pearl',
            primaryBg: '#001a33',
            secondaryBg: '#003366',
            accent: '#00d9ff',
            textPrimary: '#e6f7ff',
            textSecondary: '#80d4ff',
            glow: 'rgba(0, 217, 255, 0.4)',
            particle: '#00d9ff'
        },
        ember: {
            name: 'Ember & Smoke',
            primaryBg: '#1a0505',
            secondaryBg: '#330a0a',
            accent: '#ff4500',
            textPrimary: '#fff0f0',
            textSecondary: '#ff9980',
            glow: 'rgba(255, 69, 0, 0.4)',
            particle: '#ff4500'
        }
    };

    let currentTheme = 'truffle';
    let currentIndex = 0;

    // ========== DOM ELEMENTS ==========
    const root = document.documentElement;
    const dishTrack = document.getElementById('dishTrack');
    const dishCards = document.querySelectorAll('.dish-card');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const progressFill = document.getElementById('progressFill');
    const themeIndicator = document.getElementById('themeIndicator');
    const ambientBg = document.getElementById('ambientBg');
    const particleField = document.getElementById('particles');

    // ========== PARALLAX SCROLLING ==========
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax-layer, .menu-parallax');
        
        parallaxElements.forEach(el => {
            const speed = el.dataset.parallaxSpeed || 0.5;
            const yPos = -(scrolled * speed);
            el.style.transform = `translateY(${yPos}px)`;
        });

        // Hero text fade out on scroll
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            const heroHeight = window.innerHeight;
            const opacity = 1 - (scrolled / heroHeight);
            heroContent.style.opacity = opacity > 0 ? opacity : 0;
            heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
        }

        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });

    // ========== THEME SWITCHING SYSTEM ==========
    function applyTheme(themeName) {
        const theme = themes[themeName];
        if (!theme) return;

        // Update CSS Variables
        root.style.setProperty('--primary-bg', theme.primaryBg);
        root.style.setProperty('--secondary-bg', theme.secondaryBg);
        root.style.setProperty('--accent-color', theme.accent);
        root.style.setProperty('--text-primary', theme.textPrimary);
        root.style.setProperty('--text-secondary', theme.textSecondary);
        root.style.setProperty('--glow-color', theme.glow);
        root.style.setProperty('--particle-color', theme.particle);

        // Update indicator
        themeIndicator.textContent = theme.name;
        themeIndicator.style.borderColor = theme.accent;
        themeIndicator.style.color = theme.accent;

        // Flash effect
        document.body.classList.add('theme-transition');
        setTimeout(() => document.body.classList.remove('theme-transition'), 500);

        // Update particles
        updateParticles(theme.particle);

        currentTheme = themeName;
    }

    function updateParticles(color) {
        const particles = document.querySelectorAll('.particle');
        particles.forEach(p => {
            p.style.background = color;
            p.style.boxShadow = `0 0 10px ${color}`;
        });
    }

    // ========== DISH CAROUSEL ==========
    function goToSlide(index) {
        if (index < 0) index = dishCards.length - 1;
        if (index >= dishCards.length) index = 0;
        
        currentIndex = index;
        const offset = -currentIndex * (350 + 48); // card width + gap
        dishTrack.style.transform = `translateX(${offset}px)`;
        
        // Update progress
        const progress = ((currentIndex + 1) / dishCards.length) * 100;
        progressFill.style.width = `${progress}%`;
        
        // Apply theme based on active dish
        const activeCard = dishCards[currentIndex];
        const newTheme = activeCard.dataset.theme;
        if (newTheme && newTheme !== currentTheme) {
            applyTheme(newTheme);
        }

        // Highlight active card
        dishCards.forEach((card, i) => {
            if (i === currentIndex) {
                card.style.transform = 'scale(1.05)';
                card.style.opacity = '1';
            } else {
                card.style.transform = 'scale(0.95)';
                card.style.opacity = '0.6';
            }
        });
    }

    // Event Listeners
    prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

    // Touch/Swipe Support
    let touchStartX = 0;
    let touchEndX = 0;

    dishTrack.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, {passive: true});

    dishTrack.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, {passive: true});

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                goToSlide(currentIndex + 1); // Swipe left, go next
            } else {
                goToSlide(currentIndex - 1); // Swipe right, go prev
            }
        }
    }

    // Mouse drag support
    let isDragging = false;
    let startX;
    let scrollLeft;

    dishTrack.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.pageX - dishTrack.offsetLeft;
        scrollLeft = dishTrack.scrollLeft;
        dishTrack.style.cursor = 'grabbing';
    });

    dishTrack.addEventListener('mouseleave', () => {
        isDragging = false;
        dishTrack.style.cursor = 'grab';
    });

    dishTrack.addEventListener('mouseup', (e) => {
        isDragging = false;
        dishTrack.style.cursor = 'grab';
        const x = e.pageX - dishTrack.offsetLeft;
        const walk = (x - startX) * 2;
        if (walk > 50) goToSlide(currentIndex - 1);
        if (walk < -50) goToSlide(currentIndex + 1);
    });

    // ========== PARTICLE SYSTEM ==========
    function createParticles() {
        const particleCount = 30;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
            particle.style.animationDelay = Math.random() * 5 + 's';
            particleField.appendChild(particle);
        }
    }

    // ========== INTERSECTION OBSERVER ==========
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements
    document.querySelectorAll('.menu-item, .reservation-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });

    // ========== SMOOTH SCROLL FOR NAV LINKS ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ========== INITIALIZATION ==========
    createParticles();
    goToSlide(0); // Initialize first slide and theme

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') goToSlide(currentIndex - 1);
        if (e.key === 'ArrowRight') goToSlide(currentIndex + 1);
    });

    // Mouse parallax effect on dish cards
    dishCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });
        
        card.addEventListener('mouseleave', () => {
            if (dishCards[currentIndex] === card) {
                card.style.transform = 'scale(1.05)';
            } else {
                card.style.transform = 'scale(0.95)';
            }
        });
    });

    console.log('🌶️ SPICE BERG initialized - Swipe to taste the atmosphere!');
});
