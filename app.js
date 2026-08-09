// Antigravity Portfolyo JS - Web Audio API & Interactions

// 1. Web Audio API Sound Synthesizer
let audioCtx = null;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

// Synthesize a clean, modern UI hover sound (soft sine wave sweep)
function playHoverSound() {
    try {
        initAudio();
        if (!audioCtx) return;

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        // Low volume for subtle effect
        gain.gain.setValueAtTime(0, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.015, audioCtx.currentTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.12);

        // Short pitch sweep
        osc.frequency.setValueAtTime(450, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.06);

        osc.type = 'sine';
        osc.start(audioCtx.currentTime);
        osc.stop(audioCtx.currentTime + 0.13);
    } catch (e) {
        console.warn("Audio failed to play", e);
    }
}

// Synthesize a crisp UI click sound (modern tap click)
function playClickSound() {
    try {
        initAudio();
        if (!audioCtx) return;

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        gain.gain.setValueAtTime(0, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.05, audioCtx.currentTime + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.07);

        osc.frequency.setValueAtTime(550, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.04);

        osc.type = 'triangle';
        osc.start(audioCtx.currentTime);
        osc.stop(audioCtx.currentTime + 0.08);
    } catch (e) {
        console.warn("Audio failed to play", e);
    }
}

// Synthesize a custom pitched click sound (for theme palette switches)
function playPitchedClick(freq) {
    try {
        initAudio();
        if (!audioCtx) return;

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        gain.gain.setValueAtTime(0, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.06, audioCtx.currentTime + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.12);

        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq / 2, audioCtx.currentTime + 0.08);

        osc.type = 'triangle';
        osc.start(audioCtx.currentTime);
        osc.stop(audioCtx.currentTime + 0.14);
    } catch (e) {
        console.warn("Audio failed to play", e);
    }
}

// 2. DOM Interactive Bindings
document.addEventListener("DOMContentLoaded", () => {
    // Initialize AudioContext on first click/hover
    const userEvents = ['click', 'touchstart', 'mouseenter'];
    userEvents.forEach(evt => {
        document.body.addEventListener(evt, initAudio, { once: true });
    });

    // Load and Apply Persisted Theme Palette
    const savedColor = localStorage.getItem('theme-color');
    const savedGlow = localStorage.getItem('theme-glow');
    const savedIndex = localStorage.getItem('theme-index');
    const swatchesList = document.querySelectorAll('.swatch');

    if (savedColor && savedGlow && swatchesList.length > 0) {
        document.documentElement.style.setProperty('--color-accent', savedColor);
        document.documentElement.style.setProperty('--color-border-hover', savedColor + '59'); // ~35% opacity
        document.documentElement.style.setProperty('--color-glow', savedGlow);
        
        swatchesList.forEach(s => s.classList.remove('active'));
        if (swatchesList[savedIndex]) {
            swatchesList[savedIndex].classList.add('active');
        }
    }

    // Sound effect bindings helper
    function bindSound(elements) {
        elements.forEach(el => {
            el.addEventListener('mouseenter', playHoverSound);
            el.addEventListener('click', playClickSound);
        });
    }

    // Bind initially
    bindSound(document.querySelectorAll('a, .card, .tab-btn, header figure img'));

    // 3. Career Tab Switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const targetPanel = document.getElementById(targetTab);
            targetPanel.classList.add('active');
        });
    });

    // 4. Scroll Progress Indicator
    const progressIndicator = document.createElement('div');
    progressIndicator.className = 'scroll-progress';
    document.body.appendChild(progressIndicator);

    // 5. Back to Top Button
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '↑';
    backToTop.title = 'Yukarı Git';
    document.body.appendChild(backToTop);

    window.addEventListener('scroll', () => {
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressIndicator.style.width = scrolled + "%";

        // Parallax scroll effect on background orbs and registration marks
        const orb1 = document.querySelector('.orb-1');
        const orb2 = document.querySelector('.orb-2');
        const mark1 = document.querySelector('.mark-1');
        const mark2 = document.querySelector('.mark-2');
        
        if (orb1) orb1.style.transform = `translate(${winScroll * 0.04}px, ${winScroll * 0.06}px)`;
        if (orb2) orb2.style.transform = `translate(${-winScroll * 0.03}px, ${-winScroll * 0.05}px)`;
        if (mark1) mark1.style.transform = `translateY(${winScroll * 0.12}px) rotate(${winScroll * 0.1}deg)`;
        if (mark2) mark2.style.transform = `translateY(${-winScroll * 0.08}px) rotate(${-winScroll * 0.05}deg)`;

        if (window.scrollY > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 6. Scroll Fade-in-up Animations (Intersection Observer)
    const fadeElems = document.querySelectorAll('section, hr, .card');
    
    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.05,
        rootMargin: '0px 0px -40px 0px'
    });

    fadeElems.forEach(el => {
        el.classList.add('fade-in-hidden');
        fadeObserver.observe(el);
    });

    // 7. Mouse Spotlight & 3D Tilt Effect on Cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Spotlight Coordinates
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);

            // 3D Tilt calculations
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const tiltX = ((y - centerY) / centerY) * 8; // max 8 degrees
            const tiltY = ((centerX - x) / centerX) * 8;
            
            card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
        });
    });

    // 8. Custom Cursor Follower
    const cursor = document.querySelector('.custom-cursor');
    const cursorDot = document.querySelector('.custom-cursor-dot');

    if (cursor && cursorDot) {
        let mouseX = -100;
        let mouseY = -100;
        let cursorX = -100;
        let cursorY = -100;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        });

        // Smooth follower animation loop (using LERP)
        function animateCursor() {
            const lerpFactor = 0.15;
            cursorX += (mouseX - cursorX) * lerpFactor;
            cursorY += (mouseY - cursorY) * lerpFactor;

            cursor.style.left = `${cursorX}px`;
            cursor.style.top = `${cursorY}px`;

            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Hover scale effects on elements -> turn cursor into a vector bounding box!
        const hoverables = document.querySelectorAll('a, button, .card, .tab-btn, .project-tab-btn, .swatch, header figure img');
        hoverables.forEach(item => {
            item.addEventListener('mouseenter', () => {
                if (cursor) cursor.classList.add('hover-vector');
            });
            item.addEventListener('mouseleave', () => {
                if (cursor) cursor.classList.remove('hover-vector');
            });
        });
    }

    // 9. Project Filtering Tabs (Category Filter)
    const projTabBtns = document.querySelectorAll('.project-tab-btn');
    const projCards = document.querySelectorAll('.project-card');

    projTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');

            // Toggle active state
            projTabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Animate and filter project cards
            projCards.forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.92) translateY(16px)';
                
                setTimeout(() => {
                    if (filter === 'all' || card.classList.contains(`category-${filter}`)) {
                        card.style.display = 'flex';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1) translateY(0)';
                        }, 50);
                    } else {
                        card.style.display = 'none';
                    }
                }, 300);
            });
        });
    });

    // Bind hover sounds for newly added tab buttons dynamically
    const allTabBtns = document.querySelectorAll('.project-tab-btn');
    allTabBtns.forEach(btn => {
        btn.addEventListener('mouseenter', playHoverSound);
        btn.addEventListener('click', playClickSound);
    });

    // 10. Theme Palette Swatches Click Logic
    const themeSwatches = document.querySelectorAll('.swatch');
    themeSwatches.forEach((swatch, index) => {
        // C5, D5, E5, G5, A5 pentatonic scale pitches for musical clicks!
        const pitches = [523.25, 587.33, 659.25, 783.99, 880.00];
        
        swatch.addEventListener('click', () => {
            themeSwatches.forEach(s => s.classList.remove('active'));
            swatch.classList.add('active');
            
            const primaryColor = swatch.getAttribute('data-color');
            const glowColor = swatch.getAttribute('data-glow');
            
            // Set root CSS variables
            document.documentElement.style.setProperty('--color-accent', primaryColor);
            document.documentElement.style.setProperty('--color-border-hover', primaryColor + '59'); // ~35% opacity
            document.documentElement.style.setProperty('--color-glow', glowColor);

            // Persist theme choice across page loads
            localStorage.setItem('theme-color', primaryColor);
            localStorage.setItem('theme-glow', glowColor);
            localStorage.setItem('theme-index', index);
            
            playPitchedClick(pitches[index]);
        });
    });

    // 11. Smooth Page Transition Logic
    const overlay = document.querySelector('.page-transition-overlay');
    if (overlay) {
        // Slide up on load
        setTimeout(() => {
            overlay.classList.add('fade-out');
        }, 100);

        // Intercept local page navigation to slide down overlay
        const pageLinks = document.querySelectorAll('a[href$=".html"], a[href^="index.html#"], a[href^="hakkimda.html#"]');
        pageLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const targetHref = link.getAttribute('href');
                if (targetHref && targetHref.includes('.html')) {
                    e.preventDefault();
                    overlay.classList.remove('fade-out');
                    overlay.classList.add('fade-in');
                    
                    playClickSound();
                    setTimeout(() => {
                        window.location.href = targetHref;
                    }, 600);
                }
            });
        });
    }

    // 12. Make Entire Project Card Clickable
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Ignore click if user explicitly clicked an internal link (e.g. PDF/Video download)
            if (e.target.tagName === 'A' || e.target.closest('a')) {
                return;
            }
            
            const detailLink = card.querySelector('.proj-link-btn');
            if (detailLink) {
                const targetHref = detailLink.getAttribute('href');
                if (targetHref) {
                    const overlay = document.querySelector('.page-transition-overlay');
                    if (overlay) {
                        overlay.classList.remove('fade-out');
                        overlay.classList.add('fade-in');
                    }
                    playClickSound();
                    setTimeout(() => {
                        window.location.href = targetHref;
                    }, 600);
                }
            }
        });
    });

    // 13. Lightbox Image Gallery Zoom Logic
    const galleryImages = document.querySelectorAll('.project-story figure img, .section-project-detail .card-figure img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');

    if (lightbox && galleryImages.length > 0) {
        galleryImages.forEach(img => {
            img.addEventListener('click', () => {
                // If it is the video cover image or has a link container, do not trigger lightbox
                if (img.closest('.video-cover-link')) {
                    return;
                }
                
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                
                const figcaption = img.nextElementSibling;
                if (figcaption && figcaption.tagName === 'FIGCAPTION') {
                    lightboxCaption.textContent = figcaption.textContent;
                    lightboxCaption.style.display = 'block';
                } else {
                    lightboxCaption.style.display = 'none';
                }
                
                lightbox.classList.add('active');
            });
        });

        // Close lightbox on close button click
        lightboxClose.addEventListener('click', () => {
            lightbox.classList.remove('active');
        });

        // Close lightbox on clicking outside content
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
            }
        });
        
        // Close lightbox on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                lightbox.classList.remove('active');
            }
        });
    }

    // 14. Gallery Slider / Carousel Logic
    const sliders = document.querySelectorAll('.gallery-slider-container');
    sliders.forEach(slider => {
        const slides = slider.querySelectorAll('.slider-slide');
        const prevBtn = slider.querySelector('.slider-arrow.prev');
        const nextBtn = slider.querySelector('.slider-arrow.next');
        const dotsContainer = slider.querySelector('.slider-dots');
        
        let currentIndex = 0;
        const totalSlides = slides.length;
        
        if (totalSlides <= 1) return;

        // Initialize first slide as active
        slides[0].classList.add('active');
        
        // Generate dot controls dynamically
        if (dotsContainer) {
            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('button');
                dot.classList.add('slider-dot');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => goToSlide(i));
                dotsContainer.appendChild(dot);
            }
        }
        
        const dots = slider.querySelectorAll('.slider-dot');
        
        function updateSlider() {
            slides.forEach((slide, idx) => {
                if (idx === currentIndex) {
                    slide.classList.add('active');
                } else {
                    slide.classList.remove('active');
                }
            });
            // Update dots
            if (dots.length > 0) {
                dots.forEach((dot, idx) => {
                    if (idx === currentIndex) {
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active');
                    }
                });
            }
        }
        
        function goToSlide(index) {
            currentIndex = index;
            updateSlider();
        }
        
        function nextSlide() {
            currentIndex = (currentIndex + 1) % totalSlides;
            updateSlider();
        }
        
        function prevSlide() {
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            updateSlider();
        }
        
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    });

    // 15. Children's Book Page Flip Simulator
    const flipbook = document.getElementById('flipbook');
    if (flipbook) {
        const spreads = flipbook.querySelectorAll('.book-spread');
        const prevBtn = document.getElementById('book-prev');
        const nextBtn = document.getElementById('book-next');
        const indicator = document.getElementById('book-page-indicator');
        const restartBtn = document.getElementById('restart-book-btn');
        
        let currentSpread = 0;
        const totalSpreads = spreads.length;
        
        function updateBook() {
            spreads.forEach((spread, idx) => {
                if (idx === currentSpread) {
                    spread.classList.add('active');
                } else {
                    spread.classList.remove('active');
                }
            });
            
            // Update indicator
            if (currentSpread === 0) {
                indicator.textContent = 'Kapak';
            } else if (currentSpread === totalSpreads - 1) {
                indicator.textContent = 'Arka Kapak';
            } else {
                indicator.textContent = `${(currentSpread * 2) - 1} - ${currentSpread * 2}`;
            }
            
            // Enable/disable navigation buttons
            if (prevBtn) prevBtn.style.opacity = currentSpread === 0 ? '0.4' : '1';
            if (nextBtn) nextBtn.style.opacity = currentSpread === totalSpreads - 1 ? '0.4' : '1';
        }
        
        function nextSpread() {
            if (currentSpread < totalSpreads - 1) {
                currentSpread++;
                updateBook();
            }
        }
        
        function prevSpread() {
            if (currentSpread > 0) {
                currentSpread--;
                updateBook();
            }
        }
        
        if (nextBtn) nextBtn.addEventListener('click', nextSpread);
        if (prevBtn) prevBtn.addEventListener('click', prevSpread);
        
        // Clicking on cover or left/right sides of pages to turn page
        spreads.forEach((spread, idx) => {
            spread.addEventListener('click', (e) => {
                // If button is clicked, don't trigger cover turn
                if (e.target.closest('button')) return;
                
                const rect = spread.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                if (clickX > rect.width / 2) {
                    nextSpread();
                } else {
                    prevSpread();
                }
            });
        });
        
        if (restartBtn) {
            restartBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // prevent immediate cover trigger
                currentSpread = 0;
                updateBook();
            });
        }
        
        // Initialize
        updateBook();
    }
});
