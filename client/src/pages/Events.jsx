import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import SectionTitle from '../components/SectionTitle';

const allEvents = [
    {
        date: 'April 18, 2026', icon: 'fas fa-laptop-code', title: 'Hackathon Quest',
        desc: '48-hour intensive hackathon. Build real products, win prizes, and connect with industry mentors.',
        tags: ['Hackathon', 'Node.js', 'Teams'], type: 'upcoming'
    },
    {
        date: 'April 23, 2026', icon: 'fas fa-bolt', title: 'Code Battle',
        desc: 'Competitive programming showdown. Test your DSA skills across multiple rounds and difficulty levels.',
        tags: ['Python', 'C++', 'Java'], type: 'upcoming'
    },
    {
        date: 'April 30, 2026', icon: 'fas fa-robot', title: 'AI Workshop',
        desc: 'Hands-on workshop exploring machine learning, neural networks, and real-world AI applications.',
        tags: ['AI/ML', 'TensorFlow', 'Open'], type: 'upcoming'
    },
    {
        date: 'May 10, 2026', icon: 'fas fa-shield-alt', title: 'CyberSec Sprint',
        desc: 'Capture-the-flag competition with real vulnerability challenges. All skill levels welcome.',
        tags: ['Security', 'CTF', 'Networking'], type: 'upcoming'
    },
    {
        date: 'Feb 20, 2026', icon: 'fas fa-code-branch', title: 'Git Workshop',
        desc: 'Mastered version control, branching strategies, and collaborative workflows with Git and GitHub.',
        tags: ['Git', 'GitHub', 'Workshop'], type: 'past'
    },
    {
        date: 'Jan 15, 2026', icon: 'fas fa-database', title: 'Database Design Bootcamp',
        desc: 'Deep dive into SQL and NoSQL databases, schema design, and performance optimization.',
        tags: ['MongoDB', 'PostgreSQL', 'Design'], type: 'past'
    },
    {
        date: 'Dec 5, 2025', icon: 'fas fa-paint-brush', title: 'UI/UX Design Challenge',
        desc: 'Designed mobile-first interfaces for real client projects with industry feedback.',
        tags: ['Figma', 'UI/UX', 'Mobile'], type: 'past'
    },
    {
        date: 'Nov 18, 2025', icon: 'fas fa-microchip', title: 'IoT Hackathon',
        desc: 'Built hardware prototypes with Arduino and Raspberry Pi connected to cloud dashboards.',
        tags: ['IoT', 'Arduino', 'Cloud'], type: 'past'
    },
];

export default function Events() {
    const sectionRef = useRef(null);
    const [filter, setFilter] = useState('all');

    const filtered = filter === 'all' ? allEvents : allEvents.filter(e => e.type === filter);

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
    }, [filter]);

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
                    <SectionTitle title="Club" accent="Events" subtitle="Hackathons, workshops, and competitions" />

                    {/* Filters */}
                    <div className="projects-filter reveal">
                        <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All Events</button>
                        <button className={filter === 'upcoming' ? 'active' : ''} onClick={() => setFilter('upcoming')}>Upcoming</button>
                        <button className={filter === 'past' ? 'active' : ''} onClick={() => setFilter('past')}>Past Events</button>
                    </div>

                    <div className="events-grid">
                        {filtered.map((ev, i) => (
                            <div className={`event-card reveal ${i > 0 ? `reveal-delay-${Math.min(i, 3)}` : ''}`} key={ev.title}>
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

                    {filtered.length === 0 && (
                        <p style={{ textAlign: 'center', color: 'var(--text-dim)', marginTop: 40, fontSize: '1rem' }}>
                            No events found for this filter.
                        </p>
                    )}
                </div>
            </section>
        </motion.div>
    );
}
