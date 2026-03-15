import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import SectionTitle from '../components/SectionTitle';

export default function Join() {
    const sectionRef = useRef(null);
    const [formData, setFormData] = useState({
        name: '', email: '', year: '', branch: '', interests: '', reason: ''
    });
    const [submitted, setSubmitted] = useState(false);

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

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Future: POST to /api/v1/memberships
        console.log('Form submitted:', formData);
        setSubmitted(true);
    };

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
                    <SectionTitle title="Join" accent="CodAstra" subtitle="Become part of the community and start building the future" />

                    {!submitted ? (
                        <form className="join-form-grid reveal" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="name">Full Name</label>
                                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Your full name" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="year">Year of Study</label>
                                <select id="year" name="year" value={formData.year} onChange={handleChange} required>
                                    <option value="">Select year</option>
                                    <option value="1">1st Year</option>
                                    <option value="2">2nd Year</option>
                                    <option value="3">3rd Year</option>
                                    <option value="4">4th Year</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="branch">Branch / Department</label>
                                <input type="text" id="branch" name="branch" value={formData.branch} onChange={handleChange} placeholder="e.g. Computer Science" required />
                            </div>
                            <div className="form-group full-width">
                                <label htmlFor="interests">Areas of Interest</label>
                                <input type="text" id="interests" name="interests" value={formData.interests} onChange={handleChange} placeholder="e.g. Web Dev, AI/ML, Open Source, Competitive Programming" />
                            </div>
                            <div className="form-group full-width">
                                <label htmlFor="reason">Why do you want to join CodAstra?</label>
                                <textarea id="reason" name="reason" value={formData.reason} onChange={handleChange} placeholder="Tell us what motivates you..." rows="4"></textarea>
                            </div>
                            <div className="form-submit-wrapper">
                                <button type="submit" className="btn btn-primary" style={{ padding: '16px 48px', fontSize: '1rem' }}>
                                    <i className="fas fa-paper-plane"></i> Submit Application
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="reveal visible" style={{ textAlign: 'center', padding: '60px 0' }}>
                            <div style={{
                                fontSize: '4rem',
                                marginBottom: 20,
                                animation: 'float 3s ease-in-out infinite',
                            }}>🚀</div>
                            <h2 style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: '2rem',
                                color: 'var(--text-primary)',
                                marginBottom: 12,
                            }}>Application Submitted!</h2>
                            <p style={{
                                color: 'var(--text-secondary)',
                                fontSize: '1.05rem',
                                maxWidth: 500,
                                margin: '0 auto 30px',
                                lineHeight: 1.7,
                            }}>
                                Thank you for your interest in CodAstra! We'll review your application and get back to you via email soon.
                            </p>
                            <a href="https://discord.com" className="btn btn-cyan" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex' }}>
                                <i className="fab fa-discord"></i> Join our Discord meanwhile
                            </a>
                        </div>
                    )}
                </div>
            </section>

            {/* Join CTA Section */}
            <section id="join" style={{ paddingTop: 40 }}>
                <div className="container">
                    <div className="join-wrapper">
                        <h2 className="section-title reveal">Connect with <span className="accent">Us</span></h2>
                        <p className="section-subtitle reveal reveal-delay-1">
                            Follow us on social media and join the conversation
                        </p>
                        <div className="join-cta-btns reveal reveal-delay-2">
                            <a href="https://github.com" className="btn btn-outline" target="_blank" rel="noopener noreferrer">
                                <i className="fab fa-github"></i> GitHub
                            </a>
                            <a href="https://discord.com" className="btn btn-cyan" target="_blank" rel="noopener noreferrer">
                                <i className="fab fa-discord"></i> Discord
                            </a>
                            <a href="https://linkedin.com" className="btn btn-outline" target="_blank" rel="noopener noreferrer">
                                <i className="fab fa-linkedin"></i> LinkedIn
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </motion.div>
    );
}
