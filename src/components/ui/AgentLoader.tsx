'use client';

import { useEffect, useState } from 'react';

const thinkingMessages = [
    { emoji: '🔍', text: 'Reading the entire internet...' },
    { emoji: '🧠', text: 'Brewing brilliant ideas...' },
    { emoji: '✨', text: 'Sprinkling AI magic dust...' },
    { emoji: '📚', text: 'Consulting the wisdom scrolls...' },
    { emoji: '🎨', text: 'Painting with pixels...' },
    { emoji: '🚀', text: 'Launching creativity engines...' },
    { emoji: '🔮', text: 'Asking the AI oracle...' },
    { emoji: '💫', text: 'Gathering cosmic insights...' },
    { emoji: '🎯', text: 'Aiming for perfection...' },
    { emoji: '⚡', text: 'Channeling inspiration...' },
    { emoji: '🌟', text: 'Crafting something special...' },
    { emoji: '🎪', text: 'Performing content acrobatics...' },
];

interface AgentLoaderProps {
    isVisible: boolean;
}

export default function AgentLoader({ isVisible }: AgentLoaderProps) {
    const [messageIndex, setMessageIndex] = useState(0);
    const [dots, setDots] = useState('');

    useEffect(() => {
        if (!isVisible) return;

        // Rotate messages every 3 seconds
        const messageInterval = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % thinkingMessages.length);
        }, 3000);

        // Animate dots
        const dotsInterval = setInterval(() => {
            setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
        }, 400);

        return () => {
            clearInterval(messageInterval);
            clearInterval(dotsInterval);
        };
    }, [isVisible]);

    useEffect(() => {
        if (isVisible) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isVisible]);

    if (!isVisible) return null;

    const currentMessage = thinkingMessages[messageIndex];

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            animation: 'fadeIn 0.3s ease'
        }}>
            {/* Floating background elements */}
            <div style={{
                position: 'absolute',
                width: '400px',
                height: '400px',
                background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(60px)',
                animation: 'float 6s ease-in-out infinite',
                top: '20%',
                left: '20%'
            }} />
            <div style={{
                position: 'absolute',
                width: '300px',
                height: '300px',
                background: 'radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(50px)',
                animation: 'float 5s ease-in-out infinite reverse',
                bottom: '20%',
                right: '20%'
            }} />

            <div style={{
                textAlign: 'center',
                position: 'relative',
                zIndex: 1
            }}>
                {/* Cute AI Character */}
                <div style={{
                    width: '120px',
                    height: '120px',
                    margin: '0 auto 2rem',
                    position: 'relative'
                }}>
                    {/* Body */}
                    <div style={{
                        width: '100px',
                        height: '100px',
                        margin: '0 auto',
                        background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                        borderRadius: '30px',
                        position: 'relative',
                        animation: 'bounce 1.5s ease-in-out infinite',
                        boxShadow: '0 20px 60px rgba(99, 102, 241, 0.5)'
                    }}>
                        {/* Eyes */}
                        <div style={{
                            position: 'absolute',
                            top: '35%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            display: 'flex',
                            gap: '12px'
                        }}>
                            <div style={{
                                width: '12px',
                                height: '12px',
                                background: 'white',
                                borderRadius: '50%',
                                animation: 'blink 3s ease-in-out infinite'
                            }} />
                            <div style={{
                                width: '12px',
                                height: '12px',
                                background: 'white',
                                borderRadius: '50%',
                                animation: 'blink 3s ease-in-out infinite',
                                animationDelay: '0.1s'
                            }} />
                        </div>

                        {/* Mouth - happy arc */}
                        <div style={{
                            position: 'absolute',
                            bottom: '25%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '20px',
                            height: '10px',
                            borderBottom: '3px solid white',
                            borderRadius: '0 0 20px 20px'
                        }} />

                        {/* Antenna */}
                        <div style={{
                            position: 'absolute',
                            top: '-15px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '4px',
                            height: '15px',
                            background: '#a855f7',
                            borderRadius: '2px'
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: '-8px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '12px',
                                height: '12px',
                                background: '#ec4899',
                                borderRadius: '50%',
                                animation: 'pulse 1.5s ease-in-out infinite'
                            }} />
                        </div>
                    </div>

                    {/* Sparkles around character */}
                    {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                        <div
                            key={i}
                            style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                width: '8px',
                                height: '8px',
                                background: i % 2 === 0 ? '#fbbf24' : '#f472b6',
                                borderRadius: '50%',
                                transform: `rotate(${deg}deg) translateX(70px) translateY(-50%)`,
                                animation: `pulse ${1 + i * 0.1}s ease-in-out infinite`,
                                animationDelay: `${i * 0.15}s`,
                                opacity: 0.8
                            }}
                        />
                    ))}
                </div>

                {/* Message */}
                <div
                    key={messageIndex}
                    style={{
                        animation: 'fadeInUp 0.3s ease',
                        marginBottom: '1rem'
                    }}
                >
                    <span style={{
                        fontSize: '2rem',
                        display: 'inline-block',
                        marginBottom: '0.5rem'
                    }}>
                        {currentMessage.emoji}
                    </span>
                    <p style={{
                        fontSize: '1.125rem',
                        fontWeight: 600,
                        color: 'white',
                        marginBottom: '0.5rem'
                    }}>
                        {currentMessage.text}
                    </p>
                </div>

                {/* Progress indicator */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    color: 'rgba(255, 255, 255, 0.6)'
                }}>
                    <p style={{ fontSize: '0.875rem' }}>
                        Our AI agents are working{dots}
                    </p>
                </div>

                {/* Animated progress bar */}
                <div style={{
                    width: '200px',
                    height: '4px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '2px',
                    margin: '1.5rem auto 0',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        width: '40%',
                        height: '100%',
                        background: 'linear-gradient(90deg, #6366f1, #a855f7, #ec4899)',
                        borderRadius: '2px',
                        animation: 'shimmer 1.5s ease-in-out infinite',
                        backgroundSize: '200% 100%'
                    }} />
                </div>
            </div>
        </div>
    );
}
