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
    return (
        <label style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.5 : 1
        }}>
            <div
                onClick={() => !disabled && onChange(!checked)}
                style={{
                    width: '44px',
                    height: '24px',
                    borderRadius: 'var(--radius-full)',
                    background: checked ? 'var(--gradient-primary)' : 'var(--color-bg-tertiary)',
                    border: checked ? 'none' : '1px solid var(--color-border)',
                    position: 'relative',
                    transition: 'all var(--transition-fast)',
                    flexShrink: 0,
                    boxShadow: checked ? 'var(--shadow-glow)' : 'none',
                    cursor: disabled ? 'not-allowed' : 'pointer'
                }}
            >
                <div style={{
                    position: 'absolute',
                    top: '2px',
                    left: checked ? '22px' : '2px',
                    width: '20px',
                    height: '20px',
                    borderRadius: 'var(--radius-full)',
                    background: 'white',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'all var(--transition-fast)'
                }} />
            </div>
            {(label || description) && (
                <div style={{ flex: 1 }}>
                    {label && (
                        <div style={{
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            color: 'var(--color-text-primary)',
                            marginBottom: description ? '0.25rem' : 0
                        }}>
                            {label}
                        </div>
                    )}
                    {description && (
                        <div style={{
                            fontSize: '0.75rem',
                            color: 'var(--color-text-muted)',
                            lineHeight: 1.4
                        }}>
                            {description}
                        </div>
                    )}
                </div>
            )}
        </label>
    );
}
