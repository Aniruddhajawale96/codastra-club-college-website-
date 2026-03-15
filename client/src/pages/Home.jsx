import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { animate, createTimeline, stagger } from 'animejs';
import SectionTitle from '../components/SectionTitle';
import useCountUp from '../hooks/useCountUp';

/* ---- Typewriter Hook ---- */
function useTypewriter(phrases) {
    const [text, setText] = useState('');
    const state = useRef({ pIdx: 0, cIdx: 0, deleting: false });

    useEffect(() => {
        let timeout;
        const tick = () => {
            const { pIdx, cIdx, deleting } = state.current;
            const phrase = phrases[pIdx];
            if (!deleting) {
                const next = cIdx + 1;
                setText(phrase.slice(0, next));
                state.current.cIdx = next;
                if (next === phrase.length) {
                    state.current.deleting = true;
                    timeout = setTimeout(tick, 2500);
                } else {
                    timeout = setTimeout(tick, 70);
                }
            } else {
                const next = cIdx - 1;
                setText(phrase.slice(0, next));
                state.current.cIdx = next;
                if (next === 0) {
                    state.current.deleting = false;
                    state.current.pIdx = (pIdx + 1) % phrases.length;
                    timeout = setTimeout(tick, 400);
                } else {
                    timeout = setTimeout(tick, 35);
                }
            }
        };
        timeout = setTimeout(tick, 1200);
        return () => clearTimeout(timeout);
    }, [phrases]);

    return text;
}

/* ---- Stat Card ---- */
function StatCard({ target, suffix, label }) {
    const { ref, display } = useCountUp(target, suffix);
    return (
        <div className="stat-card" ref={ref}>
            <span className="stat-number">{display}</span>
            <span className="stat-label">{label}</span>
        </div>
    );
}

/* ---- Anime.js Scroll Animation Hook ---- */
function useAnimeScroll(sectionRef) {
    useEffect(() => {
        const node = sectionRef.current;
        if (!node) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;

                    // Determine animation type from data attribute
                    const animType = el.dataset.anime || 'fadeUp';

                    switch (animType) {
                        case 'fadeUp':
                            animate(el, {
                                translateY: [60, 0],
                                opacity: [0, 1],
                                duration: 900,
                                ease: 'outExpo',
                            });
                            break;

                        case 'fadeLeft':
                            animate(el, {
                                translateX: [-80, 0],
                                opacity: [0, 1],
                                duration: 900,
                                ease: 'outExpo',
                            });
                            break;

                        case 'fadeRight':
                            animate(el, {
                                translateX: [80, 0],
                                opacity: [0, 1],
                                duration: 900,
                                ease: 'outExpo',
                            });
                            break;

                        case 'scaleIn':
                            animate(el, {
                                scale: [0.7, 1],
                                opacity: [0, 1],
                                duration: 800,
                                ease: 'outBack',
                            });
                            break;

                        case 'staggerCards':
                            animate(el.children, {
                                translateY: [50, 0],
                                opacity: [0, 1],
                                scale: [0.9, 1],
                                delay: stagger(120),
                                duration: 700,
                                ease: 'outExpo',
                            });
                            break;

                        case 'flipIn':
                            animate(el, {
                                rotateX: [90, 0],
                                opacity: [0, 1],
                                duration: 1000,
                                ease: 'outExpo',
                            });
                            break;

                        case 'slideReveal':
                            animate(el, {
                                clipPath: ['inset(0 100% 0 0)', 'inset(0 0% 0 0)'],
                                opacity: [0, 1],
                                duration: 1200,
                                ease: 'inOutQuart',
                            });
                            break;

                        case 'bounceIn':
                            animate(el, {
                                translateY: [80, 0],
                                opacity: [0, 1],
                                duration: 1200,
                                ease: 'outBounce',
                            });
                            break;

                        case 'rotateIn':
                            animate(el, {
                                rotate: [-15, 0],
                                translateY: [40, 0],
                                opacity: [0, 1],
                                duration: 1000,
                                ease: 'outExpo',
                            });
                            break;

                        default:
                            animate(el, {
                                translateY: [40, 0],
                                opacity: [0, 1],
                                duration: 800,
                                ease: 'outExpo',
                            });
                    }

                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

        // Observe all elements with data-anime attribute
        const animEls = node.querySelectorAll('[data-anime]');
        animEls.forEach(el => {
            // Set initial hidden state
            el.style.opacity = '0';
            observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);
}

/* ---- Home Page ---- */
export default function Home() {
    const sectionRef = useRef(null);
    const phrases = [
        'Code. Create. Conquer.',
        'Build. Launch. Impact.',
        'Hack. Deploy. Repeat.',
        'Learn. Collaborate. Grow.',
        'Dream. Build. Ship.'
    ];
    const typedText = useTypewriter(phrases);

    // Anime.js scroll animations
    useAnimeScroll(sectionRef);

    // Hero entrance animation
    useEffect(() => {
        const tl = createTimeline({
            defaults: { ease: 'outExpo' },
        });
        tl.add('.hero-badge', {
            translateY: [-30, 0],
            opacity: [0, 1],
            duration: 800,
        }, 300)
        .add('.hero-title', {
            translateY: [50, 0],
            opacity: [0, 1],
            duration: 1000,
        }, 500)
        .add('.hero-subtitle', {
            translateY: [30, 0],
            opacity: [0, 1],
            duration: 800,
        }, 600)
        .add('.hero-typing-wrapper', {
            translateX: [-40, 0],
            opacity: [0, 1],
            duration: 700,
        }, 700)
        .add('.category-tags span', {
            translateY: [20, 0],
            opacity: [0, 1],
            delay: stagger(80),
            duration: 600,
        }, 800)
        .add('.hero-cta .btn', {
            translateY: [30, 0],
            opacity: [0, 1],
            scale: [0.8, 1],
            delay: stagger(150),
            duration: 700,
        }, 900)
        .add('.hero-robot-col', {
            translateX: [100, 0],
            opacity: [0, 1],
            duration: 1200,
        }, 300)
        .add('.scroll-indicator', {
            translateY: [20, 0],
            opacity: [0, 1],
            duration: 600,
        }, 1200);
    }, []);

    // Magnetic button effect
    useEffect(() => {
        const btns = document.querySelectorAll('.btn');
        const handlers = [];
        btns.forEach(btn => {
            const onMove = (e) => {
                const r = btn.getBoundingClientRect();
                const x = e.clientX - r.left - r.width / 2;
                const y = e.clientY - r.top - r.height / 2;
                btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
            };
            const onLeave = () => { btn.style.transform = ''; };
            btn.addEventListener('mousemove', onMove);
            btn.addEventListener('mouseleave', onLeave);
            handlers.push({ btn, onMove, onLeave });
        });
        return () => handlers.forEach(h => {
            h.btn.removeEventListener('mousemove', h.onMove);
            h.btn.removeEventListener('mouseleave', h.onLeave);
        });
    }, []);

    // 3D tilt on cards
    useEffect(() => {
        const cards = document.querySelectorAll('.feature-card, .event-card, .project-card, .stat-card');
        const handlers = [];
        cards.forEach(card => {
            const onMove = (e) => {
                const rect = card.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                const dx = (e.clientX - cx) / (rect.width / 2);
                const dy = (e.clientY - cy) / (rect.height / 2);
                card.style.transform = `translateY(-6px) perspective(800px) rotateX(${-dy * 4}deg) rotateY(${dx * 4}deg)`;
            };
            const onLeave = () => { card.style.transform = ''; };
            card.addEventListener('mousemove', onMove);
            card.addEventListener('mouseleave', onLeave);
            handlers.push({ card, onMove, onLeave });
        });
        return () => handlers.forEach(h => {
            h.card.removeEventListener('mousemove', h.onMove);
            h.card.removeEventListener('mouseleave', h.onLeave);
        });
    }, []);

    const featuredProjects = [
        { icon: '⚡', name: 'CodeForge', stack: ['Node.js', 'Express', 'MongoDB'] },
        { icon: '🚀', name: 'AstroGym', stack: ['React', 'Tailwind'] },
        { icon: '🔮', name: 'QuantumQuest', stack: ['Next.js', 'Python'] },
        { icon: '📚', name: 'EduHub', stack: ['Web Dev', 'DSA', 'Roadmap'] },
    ];

    const upcomingEvents = [
        { date: 'April 18, 2026', icon: 'fas fa-laptop-code', title: 'Hackathon Quest', desc: '48-hour intensive hackathon. Build real products, win prizes.', tags: ['Hackathon', 'Node.js', 'Teams'] },
        { date: 'April 23, 2026', icon: 'fas fa-bolt', title: 'Code Battle', desc: 'Competitive programming showdown across multiple rounds.', tags: ['Python', 'C++', 'Java'] },
        { date: 'April 30, 2026', icon: 'fas fa-robot', title: 'AI Workshop', desc: 'Hands-on ML, neural networks, and real-world AI applications.', tags: ['AI/ML', 'TensorFlow', 'Open'] },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            ref={sectionRef}
        >
            {/* ===== HERO ===== */}
            <section id="hero">
                <div className="hero-content">
                    <div className="hero-text-col">
                        <div className="hero-badge" style={{ opacity: 0 }}>
                            <span className="pulse-dot"></span>
                            Programming Club — Open for All
                        </div>
                        <h1 className="hero-title" style={{ opacity: 0 }}>
                            We're Building<br />
                            <span className="gradient-text">Cool Experiences</span>
                        </h1>
                        <p className="hero-subtitle" style={{ opacity: 0 }}>
                            CodAstra is a passionate programming club empowering developers through code, collaboration, and innovation.
                        </p>
                        <div className="hero-typing-wrapper" style={{ opacity: 0 }}>
                            <span>{typedText}</span>
                            <span className="cursor-blink">|</span>
                        </div>
                        <div className="category-tags">
                            <span style={{ opacity: 0 }}>AI</span>
                            <span className="separator" style={{ opacity: 0 }}>\</span>
                            <span style={{ opacity: 0 }}>WEB DEV</span>
                            <span className="separator" style={{ opacity: 0 }}>\</span>
                            <span style={{ opacity: 0 }}>HACKATHONS</span>
                            <span className="separator" style={{ opacity: 0 }}>\</span>
                            <span style={{ opacity: 0 }}>OPEN SOURCE</span>
                            <span className="separator" style={{ opacity: 0 }}>\</span>
                            <span style={{ opacity: 0 }}>DSA</span>
                        </div>
                        <div className="hero-cta">
                            <Link to="/join" className="btn btn-primary" style={{ opacity: 0 }}>Get Started</Link>
                            <Link to="/projects" className="btn btn-outline" style={{ opacity: 0 }}>Explore Projects</Link>
                        </div>
                    </div>
                    <div className="hero-robot-col" style={{ opacity: 0 }}>
                        <iframe
                            src="https://my.spline.design/genkubgreetingrobot-ahkyCIoTXrKWGn32zWcf1dg0/"
                            frameBorder="0"
                            width="100%"
                            height="100%"
                            allowtransparency="true"
                            style={{ background: 'transparent' }}
                            title="CodAstra 3D Robot"
                        ></iframe>
                    </div>
                </div>
                <div className="scroll-indicator" style={{ opacity: 0 }}>
                    <span>Scroll</span>
                    <div className="scroll-line"></div>
                </div>
            </section>

            {/* ===== ABOUT TEASER ===== */}
            <section id="about" style={{ paddingTop: 160, paddingBottom: 140 }}>
                <div className="container">
                    <div data-anime="fadeUp">
                        <SectionTitle title="About" accent="CodAstra" subtitle="Empowering Future Developers Through Code & Innovation" />
                    </div>

                    <div className="about-content" style={{ gap: 80, marginTop: 30 }}>
                        <div data-anime="fadeLeft" className="about-text">
                            <p>CodAstra is a passionate programming club dedicated to empowering developers of all levels. We merge collaborative energy with cutting-edge technology to build the next generation of skilled coders and innovators.</p>
                            <p style={{ marginTop: 16 }}>Join us to learn, build, and innovate. Together, we forge a path of technological mastery through hackathons, workshops, and hands-on projects — where legendary developers are born.</p>
                        </div>
                        <div data-anime="staggerCards" className="stats-grid">
                            <StatCard target={250} suffix="+" label="Active Members" />
                            <StatCard target={50} suffix="+" label="Workshops" />
                            <StatCard target={100} suffix="+" label="Projects Built" />
                            <StatCard target={30} suffix="+" label="Hackathons" />
                        </div>
                    </div>

                    <div data-anime="bounceIn" style={{ marginTop: 120 }}>
                        <h2 className="section-title">What We <span className="accent">Offer</span></h2>
                        <p className="section-subtitle">Learn, build, and grow with our focused programs</p>
                        <div className="neon-divider"></div>
                    </div>

                    <div data-anime="staggerCards" className="offer-grid" style={{ marginTop: 40 }}>
                        <div className="feature-card">
                            <div className="feature-icon"><i className="fas fa-code"></i></div>
                            <h3>Skill Enhancement</h3>
                            <p>Master languages, frameworks, and architecture through hands-on learning and expert-led workshops.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon"><i className="fas fa-users"></i></div>
                            <h3>Collaborative Projects</h3>
                            <p>Build scalable solutions inside a team — from ideation and design to deployment and launch.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon"><i className="fas fa-trophy"></i></div>
                            <h3>Hackathons & Competitions</h3>
                            <p>Prove your skills in high-stakes environments against the sharpest minds in the game.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== EVENTS PREVIEW ===== */}
            <section id="events" style={{ paddingTop: 140, paddingBottom: 140 }}>
                <div className="container">
                    <div data-anime="scaleIn">
                        <SectionTitle title="Upcoming" accent="Events" subtitle="Don't miss what's coming next" />
                    </div>
                    <div data-anime="staggerCards" className="events-grid" style={{ marginTop: 40 }}>
                        {upcomingEvents.map((ev) => (
                            <div className="event-card" key={ev.title}>
                                <div className="event-date-badge">
                                    <i className="far fa-calendar"></i> {ev.date}
                                </div>
                                <div className="event-icon"><i className={ev.icon}></i></div>
                                <h3>{ev.title}</h3>
                                <p>{ev.desc}</p>
                                <div className="event-tags">
                                    {ev.tags.map(t => <span key={t}>{t}</span>)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== PROJECTS PREVIEW ===== */}
            <section id="projects-preview" style={{ paddingTop: 140, paddingBottom: 140 }}>
                <div className="container">
                    <div data-anime="rotateIn">
                        <SectionTitle title="Our" accent="Projects" subtitle="Explore the creations of CodAstra" />
                    </div>
                    <div data-anime="staggerCards" className="projects-grid" style={{ marginTop: 40 }}>
                        {featuredProjects.map((p) => (
                            <div className="project-card" key={p.name}>
                                <div className="project-icon">{p.icon}</div>
                                <h4>{p.name}</h4>
                                <div className="stack">
                                    {p.stack.map(s => <span key={s}>{s}</span>)}
                                </div>
                                <Link to="/projects" className="view-link">View Project <i className="fas fa-arrow-right"></i></Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== JOIN CTA ===== */}
            <section id="join" style={{ paddingTop: 100, paddingBottom: 140 }}>
                <div className="container">
                    <div data-anime="scaleIn" className="join-wrapper">
                        <h2 className="section-title">Ready to <span className="accent">Join?</span></h2>
                        <p className="section-subtitle">
                            Unlock your potential. Join the CodAstra community and start building the future today.
                        </p>
                        <div className="join-cta-btns">
                            <Link to="/join" className="btn btn-primary">Apply Now</Link>
                            <a href="https://discord.com" className="btn btn-cyan" target="_blank" rel="noopener noreferrer">
                                <i className="fab fa-discord"></i> Join Discord
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </motion.div>
    );
}
