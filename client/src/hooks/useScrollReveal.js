import { useEffect, useRef } from 'react';

export default function useScrollReveal(options = {}) {
    const ref = useRef(null);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px', ...options }
        );

        // Observe the container and all .reveal children
        const revealEls = node.querySelectorAll('.reveal');
        revealEls.forEach(el => observer.observe(el));

        // Also observe the node itself if it has .reveal
        if (node.classList.contains('reveal')) {
            observer.observe(node);
        }

        return () => {
            revealEls.forEach(el => observer.unobserve(el));
            if (node.classList.contains('reveal')) {
                observer.unobserve(node);
            }
        };
    }, []);

    return ref;
}
