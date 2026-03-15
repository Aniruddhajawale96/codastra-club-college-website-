import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import SectionTitle from '../components/SectionTitle';
import useCountUp from '../hooks/useCountUp';

function StatCard({ target, suffix, label }) {
    const { ref, display } = useCountUp(target, suffix);
    return (
        <div className="stat-card" ref={ref}>
            <span className="stat-number">{display}</span>
            <span className="stat-label">{label}</span>
        </div>
    );
}

export default function About() {
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

    const timeline = [
        { year: '2022', title: 'Club Founded', desc: 'CodAstra was born from a small group of passionate coders in the computer science department.' },
        { year: '2023', title: 'First Hackathon', desc: 'Organized our inaugural 24-hour hackathon with 80+ participants and industry sponsors.' },
        { year: '2024', title: 'Open Source Launch', desc: 'Started contributing to open-source projects and launched our own GitHub organization.' },
        { year: '2025', title: 'National Recognition', desc: 'Won "Best College Tech Club" at the National Student Developer Awards.' },
        { year: '2026', title: 'Going Global', desc: '250+ members strong, expanding to inter-college collaborations and international hackathons.' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            ref={sectionRef}
        >
            {/* Mission */}
            <section style={{ paddingTop: 140 }}>
                <div className="container">
                    <SectionTitle title="About" accent="CodAstra" subtitle="Empowering Future Developers Through Code & Innovation" />
                    <div className="about-content">
                        <div className="about-text reveal reveal-delay-2">
                            <p>CodAstra is a student-run developer and coding club based in Maharashtra, India. We believe
                                that great developers are forged through collaboration, curiosity, and relentless building.</p>
                            <p>Our mission is to create a thriving community where students learn, experiment, and ship real
                                projects — from their first "Hello World" to production-grade applications and open-source contributions.</p>
                            <p>We don't just write code. We build things that matter — tools, platforms, and experiences that
                                push boundaries and defy convention.</p>
                        </div>
                        <div className="stats-grid reveal reveal-delay-3">
                            <StatCard target={250} suffix="+" label="Active Members" />
                            <StatCard target={50} suffix="+" label="Workshops" />
                            <StatCard target={100} suffix="+" label="Projects Built" />
                            <StatCard target={30} suffix="+" label="Hackathons" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section>
                <div className="container">
                    <SectionTitle title="Our" accent="Journey" subtitle="From a small group to a movement" />
                    <div style={{
                        position: 'relative',
                        maxWidth: 700,
                        margin: '0 auto',
                        paddingLeft: 40,
                    }}>
                        {/* Vertical line */}
                        <div style={{
                            position: 'absolute',
                            left: 16,
                            top: 0,
                            bottom: 0,
                            width: 2,
                            background: 'linear-gradient(to bottom, var(--purple), var(--cyan), transparent)',
                        }}></div>

                        {timeline.map((item, i) => (
                            <div
                                key={item.year}
                                className={`reveal reveal-delay-${Math.min(i, 4)}`}
                                style={{
                                    position: 'relative',
                                    marginBottom: 40,
                                    paddingLeft: 30,
                                }}
                            >
                                {/* Dot */}
                                <div style={{
                                    position: 'absolute',
                                    left: -30,
                                    top: 6,
                                    width: 12,
                                    height: 12,
                                    borderRadius: '50%',
                                    background: 'var(--cyan)',
                                    border: '2px solid var(--bg-primary)',
                                    boxShadow: 'var(--glow-cyan-sm)',
                                }}></div>
                                <div style={{
                                    fontFamily: 'var(--font-display)',
                                    fontSize: '0.85rem',
                                    color: 'var(--cyan)',
                                    fontWeight: 600,
                                    letterSpacing: '0.05em',
                                    marginBottom: 4,
                                }}>{item.year}</div>
                                <h3 style={{
                                    fontFamily: 'var(--font-display)',
                                    fontSize: '1.15rem',
                                    color: 'var(--text-primary)',
                                    fontWeight: 600,
                                    marginBottom: 6,
                                }}>{item.title}</h3>
                                <p style={{
                                    fontSize: '0.9rem',
                                    color: 'var(--text-secondary)',
                                    lineHeight: 1.6,
                                }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* What We Offer */}
            <section>
                <div className="container">
                    <SectionTitle title="What We" accent="Offer" subtitle="Learn, build, and grow with our focused programs" />
                    <div className="offer-grid">
                        <div className="feature-card reveal">
                            <div className="feature-icon"><i className="fas fa-code"></i></div>
                            <h3>Skill Enhancement</h3>
                            <p>Master languages, frameworks, and architecture through hands-on learning and expert-led workshops.</p>
                        </div>
                        <div className="feature-card reveal reveal-delay-1">
                            <div className="feature-icon"><i className="fas fa-users"></i></div>
                            <h3>Collaborative Projects</h3>
                            <p>Build scalable solutions inside a team — from ideation and design to deployment and launch.</p>
                        </div>
                        <div className="feature-card reveal reveal-delay-2">
                            <div className="feature-icon"><i className="fas fa-trophy"></i></div>
                            <h3>Hackathons & Competitions</h3>
                            <p>Prove your skills in high-stakes environments against the sharpest minds in the game.</p>
                        </div>
                        <div className="feature-card reveal reveal-delay-3">
                            <div className="feature-icon"><i className="fas fa-graduation-cap"></i></div>
                            <h3>Mentorship</h3>
                            <p>Get paired with senior developers and alumni who guide your growth with real industry insights.</p>
                        </div>
                        <div className="feature-card reveal reveal-delay-4">
                            <div className="feature-icon"><i className="fas fa-globe"></i></div>
                            <h3>Open Source</h3>
                            <p>Contribute to real-world open-source projects and build a strong developer portfolio.</p>
                        </div>
                        <div className="feature-card reveal">
                            <div className="feature-icon"><i className="fas fa-network-wired"></i></div>
                            <h3>Networking</h3>
                            <p>Connect with industry professionals, recruiters, and fellow developers at our events.</p>
                        </div>
                    </div>
                </div>
            </section>
        </motion.div>
    );
}
