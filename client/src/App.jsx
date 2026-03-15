import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import CubeCanvas from './components/CubeCanvas';

// Lazy-loaded pages
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Events = lazy(() => import('./pages/Events'));
const Projects = lazy(() => import('./pages/Projects'));
const Team = lazy(() => import('./pages/Team'));
const Join = lazy(() => import('./pages/Join'));

function Loading() {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            fontFamily: 'var(--font-display)',
            color: 'var(--cyan)',
            fontSize: '1.2rem',
            letterSpacing: '0.1em',
        }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{
                    width: 40,
                    height: 40,
                    border: '3px solid rgba(0, 245, 255, 0.2)',
                    borderTop: '3px solid var(--cyan)',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto 16px',
                }}></div>
                Loading...
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}

function AnimatedRoutes() {
    const location = useLocation();
    return (
        <AnimatePresence mode="wait">
            <Suspense fallback={<Loading />}>
                <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/events" element={<Events />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/team" element={<Team />} />
                    <Route path="/join" element={<Join />} />
                </Routes>
            </Suspense>
        </AnimatePresence>
    );
}

function ScrollToTop() {
    const { pathname } = useLocation();
    if (typeof window !== 'undefined') {
        window.scrollTo(0, 0);
    }
    return null;
}

export default function App() {
    return (
        <Router>
            {/* Background layers */}
            <div className="grid-overlay"></div>
            <CubeCanvas />
            <CustomCursor />

            {/* Navigation */}
            <Navbar />

            {/* Main content */}
            <main>
                <ScrollToTop />
                <AnimatedRoutes />
            </main>

            {/* Footer */}
            <Footer />
        </Router>
    );
}
