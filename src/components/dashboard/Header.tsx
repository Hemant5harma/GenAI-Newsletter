'use client';

import { useTheme } from "@/lib/theme-context";

export default function Header() {
    const { theme, toggleTheme } = useTheme();

    return (
        <header style={{
            height: '80px',
            borderBottom: '1px solid var(--color-border)',
            background: 'var(--color-bg-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 2rem',
            position: 'sticky',
            top: 0,
            zIndex: 10
        }}>
            {/* Left side (Breadcrumbs - Placeholder) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>Dashboard</span>
            </div>

            {/* Right side (Controls) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button
                    onClick={toggleTheme}
                    className="btn btn-ghost"
                    title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
                    style={{ fontSize: '1.25rem', width: '40px', height: '40px', padding: 0, borderRadius: '50%' }}
                >
                    {theme === 'light' ? '🌙' : '☀️'}
                </button>

                {/* User Avatar Placeholder */}
                <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'linear-gradient(45deg, var(--color-accent), #ec4899)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '0.875rem'
                }}>
                    U
                </div>
            </div>
        </header>
    );
}
