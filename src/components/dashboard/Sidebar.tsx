'use client';

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import DeleteBrandButton from "../DeleteBrandButton";
import { deleteBrandAction } from "@/app/actions";

interface Brand {
    id: string;
    name: string;
    category: string | null;
}

// Generate consistent color based on string
function getColorForString(str: string): string {
    const colors = [
        'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
        'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
        'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
        'linear-gradient(135deg, #14b8a6 0%, #2dd4bf 100%)',
        'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
        'linear-gradient(135deg, #ef4444 0%, #f87171 100%)',
        'linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%)',
        'linear-gradient(135deg, #84cc16 0%, #a3e635 100%)',
    ];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
}

export default function Sidebar({ brands }: { brands: Brand[] }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const pathname = usePathname();

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);

    return (
        <aside style={{
            width: isCollapsed ? '80px' : '280px',
            background: 'var(--color-bg-secondary)',
            borderRight: '1px solid var(--color-border)',
            display: 'flex',
            flexDirection: 'column',
            transition: 'width var(--transition-normal)',
            overflow: 'hidden',
            position: 'relative',
            flexShrink: 0
        }}>
            {/* Subtle gradient overlay */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'var(--gradient-surface)',
                pointerEvents: 'none'
            }} />

            {/* Logo */}
            <div style={{
                padding: '1.5rem',
                borderBottom: '1px solid var(--color-border)',
                height: '80px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                position: 'relative',
                zIndex: 1
            }}>
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        background: 'var(--gradient-primary)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.25rem',
                        flexShrink: 0,
                        boxShadow: 'var(--shadow-glow)'
                    }}>
                        ✨
                    </div>
                    {!isCollapsed && (
                        <span style={{
                            fontWeight: 700,
                            fontSize: '1.125rem',
                            whiteSpace: 'nowrap',
                            background: 'var(--gradient-primary)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}>
                            AutoNews AI
                        </span>
                    )}
                </Link>
            </div>

            {/* Navigation */}
            <nav style={{
                flex: 1,
                padding: '1rem',
                overflowY: 'auto',
                overflowX: 'hidden',
                position: 'relative',
                zIndex: 1
            }}>
                {/* Section Header */}
                <div style={{ marginBottom: '1rem' }}>
                    {!isCollapsed && (
                        <div style={{
                            fontSize: '0.6875rem',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            color: 'var(--color-text-muted)',
                            padding: '0.5rem 0.75rem',
                            marginBottom: '0.5rem',
                            whiteSpace: 'nowrap',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            <span style={{ fontSize: '0.75rem' }}>📂</span>
                            Workspaces
                        </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                        {brands.length === 0 ? (
                            !isCollapsed && (
                                <div style={{
                                    padding: '2rem 1rem',
                                    textAlign: 'center',
                                    color: 'var(--color-text-muted)',
                                    fontSize: '0.875rem'
                                }}>
                                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem', opacity: 0.5 }}>📭</div>
                                    No brands yet
                                </div>
                            )
                        ) : (
                            brands.map((brand) => {
                                const isActive = pathname.includes(`/dashboard/brands/${brand.id}`);
                                return (
                                    <div
                                        key={brand.id}
                                        className="brand-item"
                                        style={{
                                            position: 'relative',
                                            borderRadius: 'var(--radius-md)',
                                            transition: 'all var(--transition-fast)'
                                        }}
                                    >
                                        <Link
                                            href={`/dashboard/brands/${brand.id}`}
                                            title={isCollapsed ? brand.name : undefined}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.75rem',
                                                padding: '0.625rem 0.75rem',
                                                borderRadius: 'var(--radius-md)',
                                                fontSize: '0.875rem',
                                                fontWeight: 500,
                                                color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                                                background: isActive ? 'var(--color-bg-tertiary)' : 'transparent',
                                                transition: 'all var(--transition-fast)',
                                                justifyContent: isCollapsed ? 'center' : 'flex-start',
                                                border: isActive ? '1px solid var(--color-border)' : '1px solid transparent'
                                            }}
                                            className="sidebar-link"
                                        >
                                            <div style={{
                                                width: '32px',
                                                height: '32px',
                                                background: getColorForString(brand.name),
                                                borderRadius: 'var(--radius-sm)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '0.8125rem',
                                                fontWeight: 600,
                                                color: 'white',
                                                flexShrink: 0,
                                                boxShadow: isActive ? 'var(--shadow-sm)' : 'none'
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
                                                            fontSize: '0.6875rem',
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
                                        {!isCollapsed && (
                                            <div style={{
                                                position: 'absolute',
                                                right: '8px',
                                                top: '50%',
                                                transform: 'translateY(-50%)'
                                            }}>
                                                <DeleteBrandButton
                                                    brandId={brand.id}
                                                    brandName={brand.name}
                                                    deleteAction={deleteBrandAction}
                                                />
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Divider */}
                <div style={{
                    height: '1px',
                    background: 'var(--color-border)',
                    margin: '1rem 0'
                }} />

                {/* Add New */}
                <Link
                    href="/brands/new"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px dashed var(--color-border)',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        color: 'var(--color-text-muted)',
                        transition: 'all var(--transition-fast)',
                        height: '48px'
                    }}
                    className="add-brand-link"
                    title={isCollapsed ? "Add New Brand" : undefined}
                >
                    <span style={{
                        fontSize: '1.25rem',
                        background: 'var(--gradient-primary)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>+</span>
                    {!isCollapsed && <span>New Brand</span>}
                </Link>
            </nav>

            {/* Footer with Collapse Button */}
            <div style={{
                padding: '1rem',
                borderTop: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: isCollapsed ? 'center' : 'space-between',
                gap: '0.75rem',
                position: 'relative',
                zIndex: 1
            }}>
                {!isCollapsed && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        flex: 1,
                        minWidth: 0
                    }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: 'var(--radius-full)',
                            background: 'var(--gradient-accent)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            flexShrink: 0
                        }}>
                            U
                        </div>
                        <div style={{
                            fontSize: '0.8125rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}>
                            <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>User</div>
                            <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>Free Plan</div>
                        </div>
                    </div>
                )}
                <button
                    onClick={toggleSidebar}
                    className="btn btn-ghost btn-icon"
                    style={{
                        width: '32px',
                        height: '32px',
                        fontSize: '1rem',
                        flexShrink: 0
                    }}
                    title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                >
                    {isCollapsed ? '→' : '←'}
                </button>
            </div>

            <style>{`
                .sidebar-link:hover {
                    background: var(--color-bg-tertiary) !important;
                    color: var(--color-text-primary) !important;
                    border-color: var(--color-border) !important;
                }
                .add-brand-link:hover {
                    border-color: var(--color-accent) !important;
                    color: var(--color-accent) !important;
                    background: var(--color-accent-glow) !important;
                }
                .brand-item:hover .delete-brand-btn {
                    opacity: 1 !important;
                }
                .brand-item:hover .delete-brand-btn:hover {
                    color: var(--color-error) !important;
                    background: var(--color-error-glow) !important;
                }
            `}</style>
        </aside>
    );
}
