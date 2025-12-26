'use client'

import { useState } from 'react';

interface ToggleSwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    description?: string;
    disabled?: boolean;
}

export default function ToggleSwitch({
    checked,
    onChange,
    label,
    description,
    disabled = false
}: ToggleSwitchProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <label
            style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.5 : 1,
                userSelect: 'none'
            }}
            onMouseEnter={() => !disabled && setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div
                onClick={() => !disabled && onChange(!checked)}
                style={{
                    width: '52px',
                    height: '28px',
                    borderRadius: '14px',
                    background: checked
                        ? 'var(--gradient-primary)'
                        : 'var(--color-bg-tertiary)',
                    border: checked ? 'none' : '2px solid var(--color-border-custom)',
                    position: 'relative',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    flexShrink: 0,
                    boxShadow: checked
                        ? isHovered ? '0 0 20px rgba(99, 102, 241, 0.4)' : '0 0 12px rgba(99, 102, 241, 0.25)'
                        : isHovered ? 'var(--shadow-sm)' : 'none',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    transform: isHovered && !disabled ? 'scale(1.02)' : 'scale(1)',
                }}
            >
                <div style={{
                    position: 'absolute',
                    top: checked ? '3px' : '2px',
                    left: checked ? 'calc(100% - 24px)' : '3px',
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    background: 'white',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {checked && (
                        <svg width="12" height="10" viewBox="0 0 12 10" fill="none" style={{ opacity: 0.7 }}>
                            <path d="M1 5L4.5 8.5L11 1.5" stroke="var(--color-accent-custom)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    )}
                </div>
            </div>
            {(label || description) && (
                <div style={{ flex: 1 }}>
                    {label && (
                        <div style={{
                            fontSize: '0.9375rem',
                            fontWeight: 600,
                            color: 'var(--color-text-primary)',
                            marginBottom: description ? '0.375rem' : 0,
                            letterSpacing: '-0.01em'
                        }}>
                            {label}
                        </div>
                    )}
                    {description && (
                        <div style={{
                            fontSize: '0.8125rem',
                            color: 'var(--color-text-muted)',
                            lineHeight: 1.5
                        }}>
                            {description}
                        </div>
                    )}
                </div>
            )}
        </label>
    );
}
