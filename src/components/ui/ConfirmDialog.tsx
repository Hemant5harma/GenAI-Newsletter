'use client';

import { useEffect, useRef } from 'react';

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'default';
    isLoading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmDialog({
    isOpen,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'default',
    isLoading = false,
    onConfirm,
    onCancel
}: ConfirmDialogProps) {
    const dialogRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen && !isLoading) {
                onCancel();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
        };
    }, [isOpen, isLoading, onCancel]);

    if (!isOpen) return null;

    const variantStyles = {
        danger: {
            icon: '⚠️',
            iconBg: 'var(--color-error-glow)',
            buttonClass: 'btn-danger'
        },
        warning: {
            icon: '⚡',
            iconBg: 'var(--color-warning-glow)',
            buttonClass: 'btn-primary'
        },
        default: {
            icon: '💡',
            iconBg: 'var(--color-accent-glow)',
            buttonClass: 'btn-primary'
        }
    };

    const style = variantStyles[variant];

    return (
        <div
            className="modal-overlay"
            onClick={(e) => {
                if (e.target === e.currentTarget && !isLoading) onCancel();
            }}
        >
            <div
                ref={dialogRef}
                className="modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="dialog-title"
            >
                <div className="modal-body" style={{ textAlign: 'center' }}>
                    {/* Icon */}
                    <div style={{
                        width: '64px',
                        height: '64px',
                        margin: '0 auto 1.5rem',
                        background: style.iconBg,
                        borderRadius: 'var(--radius-xl)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem'
                    }}>
                        {style.icon}
                    </div>

                    {/* Title */}
                    <h3
                        id="dialog-title"
                        style={{
                            fontSize: '1.25rem',
                            fontWeight: 700,
                            marginBottom: '0.75rem',
                            color: 'var(--color-text-primary)'
                        }}
                    >
                        {title}
                    </h3>

                    {/* Message */}
                    <p style={{
                        color: 'var(--color-text-secondary)',
                        lineHeight: 1.6,
                        marginBottom: '1.5rem'
                    }}>
                        {message}
                    </p>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                        <button
                            onClick={onCancel}
                            className="btn btn-secondary"
                            disabled={isLoading}
                            style={{ minWidth: '100px' }}
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`btn ${style.buttonClass}`}
                            disabled={isLoading}
                            style={{ minWidth: '100px' }}
                        >
                            {isLoading ? (
                                <span style={{
                                    display: 'inline-block',
                                    width: '16px',
                                    height: '16px',
                                    border: '2px solid rgba(255,255,255,0.3)',
                                    borderTopColor: 'white',
                                    borderRadius: '50%',
                                    animation: 'spin 0.8s linear infinite'
                                }} />
                            ) : confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
