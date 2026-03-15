import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-brand">
                        CodAstra
                        <span>&copy; {new Date().getFullYear()} All Rights Reserved.</span>
                    </div>
                    <div className="footer-links">
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-github"></i> GitHub
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-linkedin"></i> LinkedIn
                        </a>
                        <a href="https://discord.com" target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-discord"></i> Discord
                        </a>
                        <Link to="/join">
                            <i className="fas fa-envelope"></i> Contact
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
