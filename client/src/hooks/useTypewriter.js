import { useState, useEffect, useCallback } from 'react';

export default function useTypewriter(phrases, typeSpeed = 70, deleteSpeed = 35, pauseTime = 2500) {
    const [text, setText] = useState('');
    const [phraseIndex, setPhraseIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    const tick = useCallback(() => {
        const current = phrases[phraseIndex];
        if (!isDeleting) {
            setText(current.slice(0, charIndex + 1));
            setCharIndex(prev => prev + 1);
            if (charIndex + 1 === current.length) {
                setIsDeleting(true);
                return pauseTime;
            }
            return typeSpeed;
        } else {
            setText(current.slice(0, charIndex - 1));
            setCharIndex(prev => prev - 1);
            if (charIndex - 1 === 0) {
                setIsDeleting(false);
                setPhraseIndex(prev => (prev + 1) % phrases.length);
                return 400;
            }
            return deleteSpeed;
        }
    }, [phrases, phraseIndex, charIndex, isDeleting, typeSpeed, deleteSpeed, pauseTime]);

    useEffect(() => {
        const delay = tick();
        const timer = setTimeout(() => {
            tick();
        }, delay);
        // We need to re-schedule on each state change
        return () => clearTimeout(timer);
    }, [text, isDeleting, charIndex, phraseIndex]);

    // Initial delay
    useEffect(() => {
        const timer = setTimeout(() => {
            setCharIndex(0);
        }, 1200);
        return () => clearTimeout(timer);
    }, []);

    return text;
}
