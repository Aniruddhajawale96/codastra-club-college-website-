/* ========================================
   CodAstra — Main JS
   Interactions, Cursor, Scroll, Counters
   Neo-Cyber Theme
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ---- Custom Cursor ----
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');
    const gridOverlay = document.querySelector('.grid-overlay');
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    if (cursorDot && cursorRing) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.left = mouseX - 4 + 'px';
            cursorDot.style.top = mouseY - 4 + 'px';

            // Update grid overlay radial gradient
            if (gridOverlay) {
                const px = (mouseX / window.innerWidth * 100);
                const py = (mouseY / window.innerHeight * 100);
                gridOverlay.style.setProperty('--mouse-x', px + '%');
                gridOverlay.style.setProperty('--mouse-y', py + '%');
            }
        });

        function animateRing() {
            ringX += (mouseX - ringX) * 0.12;
            ringY += (mouseY - ringY) * 0.12;
            cursorRing.style.left = ringX - 17.5 + 'px';
            cursorRing.style.top = ringY - 17.5 + 'px';
            requestAnimationFrame(animateRing);
        }
        animateRing();

        // Hover effect on interactive elements
        const hoverTargets = document.querySelectorAll('a, button, .feature-card, .event-card, .project-card, .team-card, .stat-card');
        hoverTargets.forEach(el => {
            el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
        });
    }

    // ---- Navbar scroll effect ----
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-links a[data-section]');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        updateActiveNav();
    });

    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        let current = 'hero';
        sections.forEach(s => {
            const top = s.getBoundingClientRect().top;
            if (top <= 100) current = s.id;
        });
        navLinks.forEach(a => {
            a.classList.toggle('active', a.dataset.section === current);
        });
    }

    // ---- Smooth scroll ----
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const target = document.querySelector(a.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offset = 70;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ---- Reveal on scroll (IntersectionObserver) ----
    const reveals = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    reveals.forEach(el => revealObserver.observe(el));

    // ---- Counter Animation ----
    function animateCounter(el, target, suffix = '') {
        const duration = 2000;
        const start = performance.now();
        const update = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(ease * target);
            el.textContent = current + suffix;
            if (progress < 1) requestAnimationFrame(update);
            else el.textContent = target + suffix;
        };
        requestAnimationFrame(update);
    }

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.target);
                const suffix = el.dataset.suffix || '';
                animateCounter(el, target, suffix);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-number[data-target]').forEach(el => {
        counterObserver.observe(el);
    });

    // ---- Hero Typing Effect ----
    const typingEl = document.getElementById('hero-typing');
    if (typingEl) {
        const phrases = [
            'Code. Create. Conquer.',
            'Build. Launch. Impact.',
            'Hack. Deploy. Repeat.',
            'Learn. Collaborate. Grow.',
            'Dream. Build. Ship.'
        ];
        let pIdx = 0, cIdx = 0, deleting = false;
        const typeSpeed = 70, deleteSpeed = 35, pauseTime = 2500;

        function type() {
            const phrase = phrases[pIdx];
            if (!deleting) {
                typingEl.textContent = phrase.slice(0, cIdx + 1);
                cIdx++;
                if (cIdx === phrase.length) {
                    deleting = true;
                    setTimeout(type, pauseTime);
                    return;
                }
                setTimeout(type, typeSpeed);
            } else {
                typingEl.textContent = phrase.slice(0, cIdx - 1);
                cIdx--;
                if (cIdx === 0) {
                    deleting = false;
                    pIdx = (pIdx + 1) % phrases.length;
                    setTimeout(type, 400);
                    return;
                }
                setTimeout(type, deleteSpeed);
            }
        }
        setTimeout(type, 1200);
    }

    // ---- 3D Card Tilt Effect ----
    function addTilt(selector, intensity = 10) {
        document.querySelectorAll(selector).forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                const dx = (e.clientX - cx) / (rect.width / 2);
                const dy = (e.clientY - cy) / (rect.height / 2);
                card.style.transform = `
                    translateY(-6px)
                    perspective(800px)
                    rotateX(${-dy * intensity * 0.5}deg)
                    rotateY(${dx * intensity * 0.5}deg)
                `;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    addTilt('.feature-card', 8);
    addTilt('.event-card', 6);
    addTilt('.project-card', 6);
    addTilt('.team-card', 5);
    addTilt('.stat-card', 5);

    // ---- Magnetic Button Effect ----
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });

    // ---- Project Filter Buttons ----
    const filterBtns = document.querySelectorAll('.projects-filter button:not(.github-btn)');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // ---- Footer year ----
    const yearEl = document.getElementById('footer-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // ---- Console branding ----
    console.log('%c⚡ CodAstra — Building Cool Experiences', 'color: #00e6ff; font-size: 16px; font-weight: bold; background: #000; padding: 8px 12px; border-radius: 4px;');
    console.log('%c🚀 Neo-Cyber Theme Active', 'color: #8c72f2; font-size: 12px;');
});
