import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import SectionTitle from '../components/SectionTitle';

const allProjects = [
    { icon: '⚡', name: 'CodeForge', stack: ['Node.js', 'Express', 'MongoDB'], category: 'web', desc: 'Online coding judge and submission platform for competitive programming practice.' },
    { icon: '🚀', name: 'AstroGym', stack: ['React', 'Tailwind'], category: 'web', desc: 'Modern fitness tracking app with workout plans and progress visualization.' },
    { icon: '🔮', name: 'QuantumQuest', stack: ['Next.js', 'Python'], category: 'ai', desc: 'AI-powered quiz generator that creates personalized learning paths.' },
    { icon: '📚', name: 'EduHub', stack: ['Web Dev', 'DSA', 'Roadmap'], category: 'web', desc: 'Community-curated developer roadmaps and learning resource hub.' },
    { icon: '🏆', name: 'Hackathon Hub', stack: ['Node.js', 'React'], category: 'web', desc: 'End-to-end hackathon management platform with team matching and judging.' },
    { icon: '🤖', name: 'AI Insight', stack: ['TensorFlow', 'Python'], category: 'ai', desc: 'Sentiment analysis dashboard for social media brand monitoring.' },
    { icon: '🌐', name: 'ContribHub', stack: ['Next.js', 'Open Source'], category: 'opensource', desc: 'Discover beginner-friendly open source issues and track contributions.' },
    { icon: '🎯', name: 'EventSphere', stack: ['Event Mgmt', 'Node.js'], category: 'web', desc: 'Event RSVP and attendance management system for college clubs.' },
    { icon: '🎮', name: 'RetroArcade', stack: ['React', 'Canvas API'], category: 'web', desc: 'Browser-based collection of retro arcade games built with HTML5 Canvas.' },
    { icon: '📊', name: 'DataViz Pro', stack: ['D3.js', 'Python', 'Flask'], category: 'ai', desc: 'Interactive data visualization platform for exploring public datasets.' },
    { icon: '🔐', name: 'VaultPass', stack: ['React', 'Node.js', 'AES-256'], category: 'opensource', desc: 'Zero-knowledge password manager with end-to-end encryption.' },
    { icon: '📝', name: 'DevBlog', stack: ['Next.js', 'MDX', 'Vercel'], category: 'opensource', desc: 'Open-source developer blogging platform with syntax highlighting and comments.' },
];

const filters = [
    { key: 'all', label: 'All' },
    { key: 'web', label: 'Web Dev' },
    { key: 'ai', label: 'AI/ML' },
    { key: 'opensource', label: 'Open Source' },
];

export default function Projects() {
    const sectionRef = useRef(null);
    const [activeFilter, setActiveFilter] = useState('all');

    const filtered = activeFilter === 'all'
        ? allProjects
        : allProjects.filter(p => p.category === activeFilter);

    useEffect(() => {
        const node = sectionRef.current;
        if (!node) return;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                    observer.unobserve(e.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        node.querySelectorAll('.reveal').forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, [activeFilter]);

    // 3D tilt
    useEffect(() => {
        const cards = document.querySelectorAll('.project-card');
        const handlers = [];
        cards.forEach(card => {
            const onMove = (e) => {
                const rect = card.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                const dx = (e.clientX - cx) / (rect.width / 2);
                const dy = (e.clientY - cy) / (rect.height / 2);
                card.style.transform = `translateY(-6px) perspective(800px) rotateX(${-dy * 3}deg) rotateY(${dx * 3}deg)`;
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
    }, [filtered]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            ref={sectionRef}
        >
            <section style={{ paddingTop: 140 }}>
                <div className="container">
                    <SectionTitle title="Our" accent="Projects" subtitle="Explore the creations of CodAstra" />

                    <div className="projects-filter reveal">
                        {filters.map(f => (
                            <button
                                key={f.key}
                                className={activeFilter === f.key ? 'active' : ''}
                                onClick={() => setActiveFilter(f.key)}
                            >{f.label}</button>
                        ))}
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="btn" style={{
                            padding: '8px 20px',
                            fontSize: '0.82rem',
                            borderColor: 'var(--cyan)',
                            color: 'var(--cyan)',
                            border: '1px solid var(--cyan)',
                        }}>
                            <i className="fab fa-github"></i> View GitHub
                        </a>
                    </div>

                    <div className="projects-grid">
                        {filtered.map((p, i) => (
                            <div className={`project-card reveal ${i > 0 ? `reveal-delay-${Math.min(i % 4, 3)}` : ''}`} key={p.name}>
                                <div className="project-icon">{p.icon}</div>
                                <h4>{p.name}</h4>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 12 }}>
                                    {p.desc}
                                </p>
                                <div className="stack">
                                    {p.stack.map(s => <span key={s}>{s}</span>)}
                                </div>
                                <a href="#" className="view-link">View Project <i className="fas fa-arrow-right"></i></a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </motion.div>
    );
}
