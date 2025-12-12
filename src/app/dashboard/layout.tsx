import Link from "next/link";
import { db } from "@/lib/db";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const brands = await db.brand.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-bg-primary)' }}>
            {/* Sidebar */}
            <aside style={{
                width: '280px',
                borderRight: '1px solid var(--color-border)',
                background: 'var(--color-bg-secondary)',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {/* Logo */}
                <div style={{
                    padding: '1.5rem',
                    borderBottom: '1px solid var(--color-border)'
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
                            fontSize: '1.25rem'
                        }}>
                            ✨
                        </div>
                        <span style={{ fontWeight: 700, fontSize: '1.125rem' }}>AutoNews AI</span>
                    </Link>
                </div>

                {/* Navigation */}
                <nav style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{
                            fontSize: '0.6875rem',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            color: 'var(--color-text-muted)',
                            padding: '0.5rem 0.75rem',
                            marginBottom: '0.5rem'
                        }}>
                            Workspaces
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            {brands.length === 0 ? (
                                <div style={{
                                    padding: '1rem',
                                    textAlign: 'center',
                                    color: 'var(--color-text-muted)',
                                    fontSize: '0.875rem'
                                }}>
                                    No brands yet
                                </div>
                            ) : (
                                brands.map((brand) => (
                                    <Link
                                        key={brand.id}
                                        href={`/dashboard/brands/${brand.id}`}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            padding: '0.625rem 0.75rem',
                                            borderRadius: '8px',
                                            fontSize: '0.875rem',
                                            fontWeight: 500,
                                            color: 'var(--color-text-secondary)',
                                            transition: 'all 0.15s'
                                        }}
                                        className="sidebar-link"
                                    >
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            background: 'var(--color-bg-tertiary)',
                                            borderRadius: '8px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '0.875rem'
                                        }}>
                                            {brand.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                color: 'var(--color-text-primary)'
                                            }}>
                                                {brand.name}
                                            </div>
                                            {brand.category && (
                                                <div style={{
                                                    fontSize: '0.75rem',
                                                    color: 'var(--color-text-muted)'
                                                }}>
                                                    {brand.category}
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Add New */}
                    <Link
                        href="/brands/new"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            padding: '0.75rem',
                            borderRadius: '8px',
                            border: '1px dashed var(--color-border)',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            color: 'var(--color-text-muted)',
                            transition: 'all 0.15s'
                        }}
                        className="add-brand-link"
                    >
                        <span>+</span> New Brand
                    </Link>
                </nav>

                {/* Footer */}
                <div style={{
                    padding: '1rem 1.5rem',
                    borderTop: '1px solid var(--color-border)',
                    fontSize: '0.75rem',
                    color: 'var(--color-text-muted)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>v1.0.0</span>
                        <span className="badge badge-success">Pro</span>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, overflowY: 'auto' }}>
                {children}
            </main>

            <style>{`
                .sidebar-link:hover {
                    background: var(--color-bg-tertiary) !important;
                    color: var(--color-text-primary) !important;
                }
                .add-brand-link:hover {
                    border-color: var(--color-accent) !important;
                    color: var(--color-accent) !important;
                }
            `}</style>
        </div>
    );
}
