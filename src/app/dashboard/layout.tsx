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
        <div style={{
            display: 'flex',
            minHeight: '100vh',
            background: 'var(--color-bg-primary)',
        }}>
            <Sidebar brands={brands} />

            {/* Main Content Area */}
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                minWidth: 0,
                position: 'relative',
            }}>
                <Header />
                <main style={{
                    flex: 1,
                    overflowY: 'auto',
                    overflowX: 'hidden',
                }}>
                    {children}
                </main>
            </div>
        </div>
    );
}
