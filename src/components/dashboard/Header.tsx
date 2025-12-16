'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTheme } from "@/lib/theme-context";

export default function Header() {
    const { theme, toggleTheme } = useTheme();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    return (
        <header className="glass-strong" style={{
            height: '80px',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 2rem',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            background: 'var(--glass-bg)'
        }}>
            {/* Left side - Breadcrumbs & Title */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: 'var(--color-text-muted)',
                    fontSize: '0.875rem'
                }}>
                    <span style={{
                        fontWeight: 600,
                        color: 'var(--color-text-primary)',
                        fontSize: '1.125rem'
                    }}>
                        Dashboard
                    </span>
                </div>
            </div>

            {/* Center - Search Bar */}
            <div style={{
                flex: 1,
                maxWidth: '400px',
                margin: '0 2rem',
                display: 'none'  // Hidden for now, can enable later
            }}>
                <div style={{
                    position: 'relative',
                    width: '100%'
                }}>
                    <span style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--color-text-muted)',
                        fontSize: '0.875rem'
                    }}>
                        🔍
                    </span>
                    <input
                        type="text"
                        placeholder="Search newsletters..."
                        className="input"
                        style={{
                            paddingLeft: '2.5rem',
                            height: '40px',
                            fontSize: '0.875rem',
                            background: 'var(--color-bg-tertiary)'
                        }}
                    />
                </div>
            </div>

            {/* Right side - Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {/* Quick Action - New Brand */}
                <Link
                    href="/brands/new"
                    className="btn btn-ghost"
                    title="Create New Brand"
                    style={{
                        width: '40px',
                        height: '40px',
                        padding: 0,
                        borderRadius: 'var(--radius-md)',
                        fontSize: '1.125rem'
                    }}
                >
                    ➕
                </Link>

                {/* Notifications */}
                <button
                    className="btn btn-ghost"
                    title="Notifications"
                    style={{
                        width: '40px',
                        height: '40px',
                        padding: 0,
                        borderRadius: 'var(--radius-md)',
                        fontSize: '1.125rem',
                        position: 'relative'
                    }}
                >
                    🔔
                    {/* Notification dot */}
                    <span style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        width: '8px',
                        height: '8px',
                        background: 'var(--color-error)',
                        borderRadius: '50%',
                        border: '2px solid var(--color-bg-primary)'
                    }} />
                </button>

                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="btn btn-ghost"
                    title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
                    style={{
                        width: '40px',
                        height: '40px',
                        padding: 0,
                        borderRadius: 'var(--radius-md)',
                        fontSize: '1.25rem',
                        transition: 'all var(--transition-normal)'
                    }}
                >
                    <span style={{
                        display: 'inline-block',
                        transition: 'transform var(--transition-normal)'
                    }}>
                        {theme === 'light' ? '🌙' : '☀️'}
                    </span>
                </button>

                {/* Divider */}
                <div style={{
                    width: '1px',
                    height: '24px',
                    background: 'var(--color-border)',
                    margin: '0 0.5rem'
                }} />

                {/* User Avatar with Dropdown */}
                <div style={{ position: 'relative' }}>
                    <button
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: 'var(--radius-full)',
                            background: 'var(--gradient-accent)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 700,
                            fontSize: '0.875rem',
                            border: '2px solid transparent',
                            cursor: 'pointer',
                            transition: 'all var(--transition-fast)',
                            boxShadow: isUserMenuOpen ? 'var(--shadow-glow)' : 'none'
                        }}
                    >
                        U
                    </button>

                    {/* Dropdown Menu */}
                    {isUserMenuOpen && (
                        <>
                            <div
                                style={{
                                    position: 'fixed',
                                    inset: 0,
                                    zIndex: 50
                                }}
                                onClick={() => setIsUserMenuOpen(false)}
                            />
                            <div
                                className="animate-fade"
                                style={{
                                    position: 'absolute',
                                    top: 'calc(100% + 8px)',
                                    right: 0,
                                    width: '200px',
                                    background: 'var(--color-bg-secondary)',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: 'var(--radius-lg)',
                                    boxShadow: 'var(--shadow-lg)',
                                    overflow: 'hidden',
                                    zIndex: 100
                                }}
                            >
                                {/* User Info */}
                                <div style={{
                                    padding: '1rem',
                                    borderBottom: '1px solid var(--color-border)'
                                }}>
                                    <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>User</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                                        demo@example.com
                                    </div>
                                </div>

                                {/* Menu Items */}
                                <div style={{ padding: '0.5rem' }}>
                                    <button
                                        className="dropdown-item"
                                        style={{
                                            width: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            padding: '0.625rem 0.75rem',
                                            fontSize: '0.875rem',
                                            color: 'var(--color-text-secondary)',
                                            background: 'transparent',
                                            border: 'none',
                                            borderRadius: 'var(--radius-md)',
                                            cursor: 'pointer',
                                            textAlign: 'left',
                                            transition: 'all var(--transition-fast)'
                                        }}
                                    >
                                        <span>⚙️</span>
                                        Settings
                                    </button>
                                    <button
                                        className="dropdown-item"
                                        style={{
                                            width: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            padding: '0.625rem 0.75rem',
                                            fontSize: '0.875rem',
                                            color: 'var(--color-text-secondary)',
                                            background: 'transparent',
                                            border: 'none',
                                            borderRadius: 'var(--radius-md)',
                                            cursor: 'pointer',
                                            textAlign: 'left',
                                            transition: 'all var(--transition-fast)'
                                        }}
                                    >
                                        <span>📖</span>
                                        Documentation
                                    </button>
                                    <div style={{
                                        height: '1px',
                                        background: 'var(--color-border)',
                                        margin: '0.5rem 0'
                                    }} />
                                    <button
                                        className="dropdown-item"
                                        style={{
                                            width: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            padding: '0.625rem 0.75rem',
                                            fontSize: '0.875rem',
                                            color: 'var(--color-error)',
                                            background: 'transparent',
                                            border: 'none',
                                            borderRadius: 'var(--radius-md)',
                                            cursor: 'pointer',
                                            textAlign: 'left',
                                            transition: 'all var(--transition-fast)'
                                        }}
                                    >
                                        <span>🚪</span>
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <style>{`
                .dropdown-item:hover {
                    background: var(--color-bg-tertiary) !important;
                    color: var(--color-text-primary) !important;
                }
            `}</style>
        </header>
    );
}
