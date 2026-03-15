import { useEffect, useRef, useState } from 'react';

export default function useCountUp(target, suffix = '', duration = 2000) {
    const [count, setCount] = useState(0);
    const [hasAnimated, setHasAnimated] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !hasAnimated) {
                        setHasAnimated(true);
                        observer.unobserve(entry.target);

                        const start = performance.now();
                        const animate = (now) => {
                            const elapsed = now - start;
                            const progress = Math.min(elapsed / duration, 1);
                            const ease = 1 - Math.pow(1 - progress, 3);
                            setCount(Math.floor(ease * target));
                            if (progress < 1) {
                                requestAnimationFrame(animate);
                            } else {
                                setCount(target);
                            }
                        };
                        requestAnimationFrame(animate);
                    }
                });
            },
            { threshold: 0.5 }
        );

        observer.observe(node);
        return () => observer.unobserve(node);
    }, [target, duration, hasAnimated]);

    return { ref, display: `${count}${suffix}` };
}
