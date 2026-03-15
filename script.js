// ===== Scroll Animations =====
const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.fade-up').forEach((el) => observer.observe(el));

// ===== Animated Counters =====
const counterObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('[data-target]');
                counters.forEach((counter) => {
                    const target = parseInt(counter.getAttribute('data-target'), 10);
                    const duration = 1500;
                    const start = performance.now();

                    function update(now) {
                        const elapsed = now - start;
                        const progress = Math.min(elapsed / duration, 1);
                        // Ease out cubic
                        const eased = 1 - Math.pow(1 - progress, 3);
                        counter.textContent = Math.round(eased * target);
                        if (progress < 1) {
                            requestAnimationFrame(update);
                        }
                    }

                    requestAnimationFrame(update);
                });
                counterObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.3 }
);

document.querySelectorAll('.reg-counter').forEach((el) => counterObserver.observe(el));

// ===== App Demo Screen Switching =====
(function () {
    const screens = ['upload', 'scan', 'findings', 'dashboard'];
    let currentIndex = 0;
    let autoPlayTimer = null;
    const AUTO_PLAY_INTERVAL = 4000;

    function showScreen(name) {
        // Update screens
        document.querySelectorAll('.demo-screen').forEach((s) => s.classList.remove('active'));
        const target = document.getElementById('screen-' + name);
        if (target) target.classList.add('active');

        // Update sidebar nav
        document.querySelectorAll('.demo-nav-item').forEach((n) => n.classList.remove('active'));
        const navItem = document.querySelector('.demo-nav-item[data-screen="' + name + '"]');
        if (navItem) navItem.classList.add('active');

        // Update step indicators
        document.querySelectorAll('.demo-step').forEach((s) => s.classList.remove('active'));
        const stepBtn = document.querySelector('.demo-step[data-target="' + name + '"]');
        if (stepBtn) stepBtn.classList.add('active');

        // Reset scan animation if showing scan screen
        if (name === 'scan') {
            const fill = document.querySelector('.demo-scan-fill');
            if (fill) {
                fill.style.animation = 'none';
                fill.offsetHeight; // trigger reflow
                fill.style.animation = 'scan-progress 3s ease forwards';
            }
        }

        currentIndex = screens.indexOf(name);
    }

    function nextScreen() {
        currentIndex = (currentIndex + 1) % screens.length;
        showScreen(screens[currentIndex]);
    }

    function startAutoPlay() {
        stopAutoPlay();
        autoPlayTimer = setInterval(nextScreen, AUTO_PLAY_INTERVAL);
    }

    function stopAutoPlay() {
        if (autoPlayTimer) {
            clearInterval(autoPlayTimer);
            autoPlayTimer = null;
        }
    }

    // Click handlers for step indicators
    document.querySelectorAll('.demo-step').forEach((btn) => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-target');
            showScreen(target);
            stopAutoPlay();
            // Restart autoplay after 10s of inactivity
            setTimeout(startAutoPlay, 10000);
        });
    });

    // Click handlers for sidebar nav
    document.querySelectorAll('.demo-nav-item').forEach((item) => {
        item.addEventListener('click', () => {
            const target = item.getAttribute('data-screen');
            showScreen(target);
            stopAutoPlay();
            setTimeout(startAutoPlay, 10000);
        });
    });

    // Initialize: show first screen
    showScreen(screens[0]);

    // Start autoplay when demo becomes visible
    const demoObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    startAutoPlay();
                } else {
                    stopAutoPlay();
                }
            });
        },
        { threshold: 0.3 }
    );

    const demoEl = document.querySelector('.hero-demo');
    if (demoEl) demoObserver.observe(demoEl);
})();

// ===== Sticky Nav =====
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
});

// ===== Mobile Nav Toggle =====
const mobileToggle = document.getElementById('mobile-toggle');
const navLinks = document.getElementById('nav-links');

mobileToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileToggle.classList.toggle('open');

    const spans = mobileToggle.querySelectorAll('span');
    if (mobileToggle.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
    }
});

// Close mobile nav on link click
navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileToggle.classList.remove('open');
        const spans = mobileToggle.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
    });
});

// ===== Smooth scroll for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            e.preventDefault();
            const offset = 80;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});
