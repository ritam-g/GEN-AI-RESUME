import React, { useEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';
import { useGSAP } from '@gsap/react';
import '../../style/auth.scss';

const AuthLayout = ({ children, title, subtitle }) => {
    const containerRef = useRef();
    const leftRef = useRef();
    const rightRef = useRef();

    useGSAP(() => {
        const tl = gsap.timeline();
        
        tl.fromTo('.auth__left > *', 
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: 'power3.out' }
        )
        .fromTo('.auth__card', 
            { scale: 0.95, opacity: 0 },
            { scale: 1, opacity: 1, duration: 1, ease: 'power4.out' }, 
            '-=0.6'
        );
    }, { scope: containerRef });

    return (
        <div className="auth" ref={containerRef}>
            <div className="auth__glow auth__glow--purple"></div>
            <div className="auth__glow auth__glow--blue"></div>
            
            <div className="auth__left" ref={leftRef}>
                <div className="auth__brand">GEN-AI RESUME</div>
                
                <div className="auth__content">
                    <h1 className="auth__title">
                        Prepare <span>Smarter</span> with AI
                    </h1>
                    <p className="auth__subtitle">
                        Elevate your career prospects with our next-generation resume builder. 
                        Tailored optimization, instant keyword analysis, and professional templates 
                        driven by cutting-edge intelligence.
                    </p>
                    
                    <div className="auth__social-proof">
                        <div className="avatars">
                            <img src="https://i.pravatar.cc/150?u=1" alt="User" />
                            <img src="https://i.pravatar.cc/150?u=2" alt="User" />
                            <img src="https://i.pravatar.cc/150?u=3" alt="User" />
                        </div>
                        <span>Join 10k+ professionals today</span>
                    </div>
                </div>
            </div>

            <div className="auth__right" ref={rightRef}>
                <div className="auth__card">
                    <div className="auth__header">
                        <h2>{title}</h2>
                        <p>{subtitle}</p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
