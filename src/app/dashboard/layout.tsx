import Link from "next/link";
import { db } from "@/lib/db";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";

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
            <Sidebar brands={brands} />

            {/* Main Content Area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <Header />
                <main style={{ flex: 1, overflowY: 'auto' }}>
                    {children}
                </main>
            </div>

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
