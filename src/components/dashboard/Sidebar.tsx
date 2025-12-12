'use client';

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

interface Brand {
    id: string;
    name: string;
    category: string | null;
}

export default function Sidebar({ brands }: { brands: Brand[] }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const pathname = usePathname();

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);

    return (
        <aside style={{
            width: isCollapsed ? '80px' : '280px',
            borderRight: '1px solid var(--color-border)',
            background: 'var(--color-bg-secondary)',
            display: 'flex',
            flexDirection: 'column',
            transition: 'width 0.3s ease',
            overflow: 'hidden',
            position: 'relative'
        }}>
            {/* Logo */}
            <div style={{
                padding: '1.5rem',
                borderBottom: '1px solid var(--color-border)',
                height: '80px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: isCollapsed ? 'center' : 'flex-start'
            }}>
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                        width: '36px',
                        height: '36px',
                        background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.25rem',
                        flexShrink: 0
                    }}>
                        ✨
                    </div>
                    {!isCollapsed && (
                        <span style={{ fontWeight: 700, fontSize: '1.125rem', whiteSpace: 'nowrap' }}>AutoNews AI</span>
                    )}
                </Link>
            </div>

            {/* Navigation */}
            <nav style={{ flex: 1, padding: '1rem', overflowY: 'auto', overflowX: 'hidden' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                    {!isCollapsed && (
                        <div style={{
                            fontSize: '0.6875rem',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            color: 'var(--color-text-muted)',
                            padding: '0.5rem 0.75rem',
                            marginBottom: '0.5rem',
                            whiteSpace: 'nowrap'
                        }}>
                            Workspaces
                        </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        {brands.length === 0 ? (
                            !isCollapsed && (
                                <div style={{
                                    padding: '1rem',
                                    textAlign: 'center',
                                    color: 'var(--color-text-muted)',
                                    fontSize: '0.875rem'
                                }}>
                                    No brands
                                </div>
                            )
                        ) : (
                            brands.map((brand) => {
                                const isActive = pathname.includes(`/dashboard/brands/${brand.id}`);
                                return (
                                    <Link
                                        key={brand.id}
                                        href={`/dashboard/brands/${brand.id}`}
                                        title={isCollapsed ? brand.name : undefined}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            padding: '0.625rem 0.75rem',
                                            borderRadius: '8px',
                                            fontSize: '0.875rem',
                                            fontWeight: 500,
                                            color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                                            background: isActive ? 'var(--color-bg-tertiary)' : 'transparent',
                                            transition: 'all 0.15s',
                                            justifyContent: isCollapsed ? 'center' : 'flex-start'
                                        }}
                                        className="sidebar-link"
                                    >
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            background: isActive ? 'var(--color-bg-elevated)' : 'var(--color-bg-tertiary)',
                                            borderRadius: '8px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '0.875rem',
                                            flexShrink: 0
                                        }}>
                                            {brand.name.charAt(0).toUpperCase()}
                                        </div>
                                        {!isCollapsed && (
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                }}>
                                                    {brand.name}
                                                </div>
                                                {brand.category && (
                                                    <div style={{
                                                        fontSize: '0.75rem',
                                                        color: 'var(--color-text-muted)',
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis'
                                                    }}>
                                                        {brand.category}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </Link>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Add New */}
                <Link
                    href="/brands/new"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: isCollapsed ? 'center' : 'center',
                        gap: '0.5rem',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        border: '1px dashed var(--color-border)',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        color: 'var(--color-text-muted)',
                        transition: 'all 0.15s',
                        height: '48px'
                    }}
                    className="add-brand-link"
                    title={isCollapsed ? "Add New Brand" : undefined}
                >
                    <span style={{ fontSize: '1.25rem' }}>+</span>
                    {!isCollapsed && <span>New Brand</span>}
                </Link>
            </nav>

            {/* Collapse Button (Footer Area) */}
            <div style={{
                padding: '1rem',
                borderTop: '1px solid var(--color-border)',
                display: 'flex',
                justifyContent: isCollapsed ? 'center' : 'flex-end'
            }}>
                <button
                    onClick={toggleSidebar}
                    className="btn btn-ghost"
                    style={{ padding: '0.5rem' }}
                    title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                >
                    {isCollapsed ? '→' : '←'}
                </button>
            </div>
        </aside>
    );
}
