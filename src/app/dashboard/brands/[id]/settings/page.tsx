import { db } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import BrandSettingsForm from "@/components/BrandSettingsForm";

export default async function BrandSettingsPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const brand = await db.brand.findUnique({
        where: { id: params.id }
    });

    if (!brand) {
        notFound();
    }

    return (
        <div style={{ padding: '2rem' }} className="animate-in">
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                        ⚙️ Generation Settings
                    </h1>
                    <p style={{ color: 'var(--color-text-secondary)' }}>
                        Configure how AI generates newsletters for <strong>{brand.name}</strong>
                    </p>
                </div>

                <BrandSettingsForm brand={brand} />
            </div>
        </div>
    );
}
