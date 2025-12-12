import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
    const firstBrand = await db.brand.findFirst({
        orderBy: { createdAt: 'desc' }
    });

    if (firstBrand) {
        redirect(`/dashboard/brands/${firstBrand.id}`);
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100%',
            padding: '3rem',
            textAlign: 'center'
        }}>
            <div className="animate-in" style={{ maxWidth: '400px' }}>
                {/* Icon */}
                <div style={{
                    width: '80px',
                    height: '80px',
                    margin: '0 auto 1.5rem',
                    background: 'var(--color-bg-tertiary)',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2.5rem'
                }}>
                    📬
                </div>

                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                    Welcome to AutoNews AI
                </h2>

                <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem', lineHeight: 1.6 }}>
                    You haven't created any brand workspaces yet.
                    Create your first brand to start generating AI-powered newsletters.
                </p>

                <Link href="/brands/new" className="btn btn-primary" style={{ padding: '0.875rem 1.5rem' }}>
                    <span>🚀</span> Create Your First Brand
                </Link>
            </div>
        </div>
    );
}
