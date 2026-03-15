import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import SectionTitle from '../components/SectionTitle';

const coreTeam = [
    { name: 'Hitesh Patil', role: 'Club Head', icon: 'fas fa-user-astronaut' },
    { name: 'Vipul Ahirrao', role: 'Vice Head', icon: 'fas fa-user-astronaut' },
    { name: 'Aniruddha Jawale', role: 'Production Head', icon: 'fas fa-user-astronaut' },
];

const domainLeads = [
    { name: 'Yash Wankede', role: 'Management Head', icon: 'fas fa-user-ninja' },
    { name: 'Tanmay Bhavasar', role: 'Management Head', icon: 'fas fa-user-ninja' },
];

const mentors = [
    { name: 'Dr. Neha Patil', role: 'Faculty Advisor', icon: 'fas fa-user-tie' },
    { name: 'Arjun Deshmukh', role: 'Industry Mentor', icon: 'fas fa-user-tie' },
];

function TeamCard({ member, delay = 0 }) {
    return (
        <div className={`team-card reveal ${delay > 0 ? `reveal-delay-${delay}` : ''}`}>
            <div className="team-avatar">
                <i className={member.icon}></i>
            </div>
            <h3>{member.name}</h3>
            <div className="team-role">{member.role}</div>
            <div className="team-socials">
                <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
                <a href="#" aria-label="GitHub"><i className="fab fa-github"></i></a>
            </div>
        </div>
    );
}

export default function Team() {
    const sectionRef = useRef(null);

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
    }, []);

    // 3D tilt
    useEffect(() => {
        const cards = document.querySelectorAll('.team-card');
        const handlers = [];
        cards.forEach(card => {
            const onMove = (e) => {
                const rect = card.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                const dx = (e.clientX - cx) / (rect.width / 2);
                const dy = (e.clientY - cy) / (rect.height / 2);
                card.style.transform = `translateY(-5px) perspective(800px) rotateX(${-dy * 3}deg) rotateY(${dx * 3}deg)`;
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
                    <SectionTitle title="Our" accent="Team" subtitle="Meet the people behind CodAstra" />

                    <h3 className="team-section-label reveal">Core Team</h3>
                    <div className="team-grid">
                        {coreTeam.map((m, i) => <TeamCard key={m.name} member={m} delay={i} />)}
                    </div>

                    <h3 className="team-section-label reveal">Domain Leads</h3>
                    <div className="team-grid">
                        {domainLeads.map((m, i) => <TeamCard key={m.name} member={m} delay={i} />)}
                    </div>

                    <h3 className="team-section-label reveal">Faculty & Mentors</h3>
                    <div className="team-grid" style={{ maxWidth: 600, margin: '30px auto 0' }}>
                        {mentors.map((m, i) => <TeamCard key={m.name} member={m} delay={i} />)}
                    </div>
                </div>
            </section>
        </motion.div>
    );
}
