import { useEffect, useRef } from 'react';

export default function CustomCursor() {
    const dotRef = useRef(null);
    const ringRef = useRef(null);
    const mouse = useRef({ x: 0, y: 0 });
    const ring = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const dot = dotRef.current;
        const ringEl = ringRef.current;
        if (!dot || !ringEl) return;

        const onMouseMove = (e) => {
            mouse.current.x = e.clientX;
            mouse.current.y = e.clientY;
            dot.style.left = (e.clientX - 4) + 'px';
            dot.style.top = (e.clientY - 4) + 'px';

            // Update grid overlay
            const gridOverlay = document.querySelector('.grid-overlay');
            if (gridOverlay) {
                const px = (e.clientX / window.innerWidth * 100);
                const py = (e.clientY / window.innerHeight * 100);
                gridOverlay.style.setProperty('--mouse-x', px + '%');
                gridOverlay.style.setProperty('--mouse-y', py + '%');
            }
        };

        const animateRing = () => {
            ring.current.x += (mouse.current.x - ring.current.x) * 0.12;
            ring.current.y += (mouse.current.y - ring.current.y) * 0.12;
            ringEl.style.left = (ring.current.x - 17.5) + 'px';
            ringEl.style.top = (ring.current.y - 17.5) + 'px';
            requestAnimationFrame(animateRing);
        };

        document.addEventListener('mousemove', onMouseMove);
        const animId = requestAnimationFrame(animateRing);

        // Hover effect on interactive elements
        const addHover = () => {
            const targets = document.querySelectorAll('a, button, .feature-card, .event-card, .project-card, .team-card, .stat-card');
            targets.forEach(el => {
                el.addEventListener('mouseenter', () => ringEl.classList.add('hover'));
                el.addEventListener('mouseleave', () => ringEl.classList.remove('hover'));
            });
        };
        // Re-bind on route changes
        const observer = new MutationObserver(addHover);
        observer.observe(document.body, { childList: true, subtree: true });
        addHover();

        return () => {
            document.removeEventListener('mousemove', onMouseMove);
            cancelAnimationFrame(animId);
            observer.disconnect();
        };
    }, []);

    return (
        <>
            <div className="cursor-dot" ref={dotRef}></div>
            <div className="cursor-ring" ref={ringRef}></div>
        </>
    );
}
