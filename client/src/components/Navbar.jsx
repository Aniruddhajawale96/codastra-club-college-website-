import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileOpen(false);
    }, [location]);

    const navItems = [
        { to: '/', label: 'Home' },
        { to: '/about', label: 'About' },
        { to: '/events', label: 'Events' },
        { to: '/projects', label: 'Projects' },
        { to: '/team', label: 'Team' },
    ];

    return (
        <nav id="navbar" className={scrolled ? 'scrolled' : ''}>
            <Link to="/" className="nav-logo">
                <div className="logo-icon">C</div>
                CodAstra
            </Link>

            <ul className={`nav-links ${mobileOpen ? 'mobile-open' : ''}`}>
                {navItems.map(item => (
                    <li key={item.to}>
                        <Link
                            to={item.to}
                            className={location.pathname === item.to ? 'active' : ''}
                        >
                            {item.label}
                        </Link>
                    </li>
                ))}
            </ul>

            <div className="nav-cta">
                <Link to="/join" className="btn btn-primary">Join Us</Link>
            </div>

            <div
                className="nav-mobile-btn"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle navigation"
            >
                <span></span>
                <span></span>
                <span></span>
            </div>
        </nav>
    );
}
