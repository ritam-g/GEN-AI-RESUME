import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './Loader.scss';

const Loader = ({ message = 'Analyzing...' }) => {
    const textRef = useRef(null);
    const circleRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.to('.loader-circle', {
                rotation: 360,
                duration: 2,
                repeat: -1,
                ease: 'linear',
                transformOrigin: "center center"
            });
            gsap.to('.loader-pulse', {
                scale: 1.5,
                opacity: 0,
                duration: 1.5,
                repeat: -1,
                ease: 'power2.out',
            });
            gsap.fromTo('.loader-text span', 
                { opacity: 0.2, y: 5 },
                { opacity: 1, y: -5, duration: 0.5, stagger: 0.1, repeat: -1, yoyo: true, ease: 'power1.inOut' }
            );
        }, containerRef);
        return () => ctx.revert();
    }, []);

    const letters = message.split('').map((char, index) => (
        <span key={index} style={{ display: 'inline-block' }}>{char === ' ' ? '\u00A0' : char}</span>
    ));

    return (
        <div ref={containerRef} className="loading-overlay">
            <div className="loader-container">
                <div className="loader-graphics">
                    <div className="loader-pulse"></div>
                    <svg className="loader-circle" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill="none" strokeWidth="4" />
                    </svg>
                    <svg className="loader-icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="2" x2="12" y2="6"></line>
                        <line x1="12" y1="18" x2="12" y2="22"></line>
                        <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                        <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                        <line x1="2" y1="12" x2="6" y2="12"></line>
                        <line x1="18" y1="12" x2="22" y2="12"></line>
                        <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                        <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                    </svg>
                </div>
                <div ref={textRef} className="loader-text">
                    {letters}
                </div>
                <p className="loader-subtext">Please wait while our AI processes your request...</p>
            </div>
        </div>
    );
};

export default Loader;
