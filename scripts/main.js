/* ============================================================
   CodAstra – JavaScript
   Particles, Counters, Scroll Effects, Dark Mode
   ============================================================ */

// ── Particle Canvas ──────────────────────────────────────────
class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.codeChars = ['<>', '/>', '{', '}', '()', '=>', '0x', '01', '10', '&&', '||', '++', '--', '&&', 'fn', '::'];
    this.resize();
    this.init();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width  = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  init() {
    const count = Math.floor((window.innerWidth * window.innerHeight) / 20000);
    this.particles = Array.from({ length: Math.max(count, 25) }, () => this.createParticle());
  }

  createParticle() {
    return {
      x:      Math.random() * this.canvas.width,
      y:      Math.random() * this.canvas.height,
      vx:     (Math.random() - 0.5) * 0.4,
      vy:     (Math.random() - 0.5) * 0.4 - 0.2,
      alpha:  Math.random() * 0.5 + 0.1,
      size:   Math.random() * 11 + 9,
      char:   this.codeChars[Math.floor(Math.random() * this.codeChars.length)],
      color:  Math.random() > 0.5 ? '#8b5cf6' : '#3b82f6',
      life:   Math.random() * 200 + 100,
      maxLife:300,
    };
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.particles.forEach((p, i) => {
      p.x    += p.vx;
      p.y    += p.vy;
      p.life -= 1;
      const lifeRatio = p.life / p.maxLife;
      this.ctx.save();
      this.ctx.globalAlpha = p.alpha * lifeRatio;
      this.ctx.fillStyle   = p.color;
      this.ctx.font        = `${p.size}px 'JetBrains Mono', monospace`;
      this.ctx.fillText(p.char, p.x, p.y);
      this.ctx.restore();

      if (p.life <= 0 || p.y < -50 || p.x < -50 || p.x > this.canvas.width + 50) {
        this.particles[i] = this.createParticle();
        this.particles[i].y = this.canvas.height + 20;
      }
    });
    requestAnimationFrame(() => this.draw());
  }
}

// ── Counter Animation ─────────────────────────────────────────
function animateCounter(el, target, duration = 2000) {
  const start    = performance.now();
  const suffix   = el.dataset.suffix || '';
  const prefix   = el.dataset.prefix || '';
  const startVal = 0;

  function update(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    const current  = Math.round(startVal + (target - startVal) * eased);
    el.textContent = prefix + current.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

// ── Intersection Observer for Reveal ─────────────────────────
function setupRevealObserver() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}

// ── Counter Observer ──────────────────────────────────────────
function setupCounterObserver() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting && !e.target.dataset.counted) {
        e.target.dataset.counted = 'true';
        const target = parseInt(e.target.dataset.target, 10);
        animateCounter(e.target, target);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-number[data-target]').forEach(el => io.observe(el));
}

// ── Navbar Scroll Effect ──────────────────────────────────────
function setupNavbar() {
  const navbar = document.querySelector('.navbar');
  const links  = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link highlight
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
    });
    links.forEach(a => {
      a.classList.remove('active');
      if (a.getAttribute('href') === '#' + current) a.classList.add('active');
    });
  });
}

// ── Back to Top ───────────────────────────────────────────────
function setupBackToTop() {
  const btn = document.querySelector('.back-to-top');
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ── Dark / Light Mode Toggle ──────────────────────────────────
function setupThemeToggle() {
  const toggle = document.getElementById('theme-toggle');
  const body   = document.body;
  const icon   = document.getElementById('theme-icon');

  const saved = localStorage.getItem('codAstra-theme');
  if (saved === 'light') {
    body.classList.add('light-mode');
    icon.textContent = '🌙';
  }

  toggle.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    const isLight = body.classList.contains('light-mode');
    icon.textContent = isLight ? '🌙' : '☀️';
    localStorage.setItem('codAstra-theme', isLight ? 'light' : 'dark');
  });
}

// ── Mobile Nav ────────────────────────────────────────────────
function setupMobileNav() {
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  const closeBtn  = document.querySelector('.mobile-nav-close');
  const links     = document.querySelectorAll('.mobile-nav a');

  const toggle = () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('active');
    document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
  };

  hamburger.addEventListener('click', toggle);
  closeBtn.addEventListener('click', toggle);
  links.forEach(a => a.addEventListener('click', toggle));
}

// ── Typing Effect ─────────────────────────────────────────────
function setupTypingEffect() {
  const el    = document.querySelector('.typing-cursor');
  if (!el) return;
  const words = ['Developers', 'Engineers', 'Innovators', 'Builders', 'Problem Solvers'];
  let wIdx = 0, cIdx = 0, deleting = false;

  function type() {
    const word = words[wIdx];
    if (!deleting) {
      el.textContent = word.slice(0, ++cIdx);
      if (cIdx === word.length) {
        deleting = true;
        setTimeout(type, 1500);
        return;
      }
    } else {
      el.textContent = word.slice(0, --cIdx);
      if (cIdx === 0) {
        deleting = false;
        wIdx = (wIdx + 1) % words.length;
      }
    }
    setTimeout(type, deleting ? 60 : 100);
  }
  type();
}

// ── Smooth Scroll ─────────────────────────────────────────────
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ── Code Window Typewriter ────────────────────────────────────
function setupCodeTypewriter() {
  const lines = document.querySelectorAll('.code-line');
  lines.forEach((line, i) => {
    line.style.opacity = '0';
    line.style.transform = 'translateX(-10px)';
    line.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    setTimeout(() => {
      line.style.opacity = '1';
      line.style.transform = 'translateX(0)';
    }, 800 + i * 150);
  });
}

// ── Tilt Effect on Cards ──────────────────────────────────────
function setupCardTilt() {
  document.querySelectorAll('.domain-card, .project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `perspective(600px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// ── Main Init ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Particle system
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ps = new ParticleSystem(canvas);
    ps.draw();
  }

  setupNavbar();
  setupRevealObserver();
  setupCounterObserver();
  setupBackToTop();
  setupThemeToggle();
  setupMobileNav();
  setupTypingEffect();
  setupSmoothScroll();
  setupCodeTypewriter();
  setupCardTilt();

  // Animate hero title words
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    heroTitle.style.opacity = '1';
  }
});
