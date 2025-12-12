import { db } from "@/lib/db";
import IssueEditor from "@/components/editor/IssueEditor";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function IssuePage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const issue = await db.issue.findUnique({
        where: { id: params.id },
        include: {
            contentBlocks: {
                orderBy: { order: 'asc' }
            },
            brand: true,
        }
    });

    if (!issue) {
        notFound();
    }

    return (
        <div style={{ minHeight: '100%' }}>
            {/* Breadcrumb */}
            <div style={{
                padding: '1rem 2rem',
                borderBottom: '1px solid var(--color-border)',
                background: 'var(--color-bg-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem'
            }}>
                <Link href={`/dashboard/brands/${issue.brandId}`} style={{ color: 'var(--color-text-muted)' }}>
                    {issue.brand.name}
                </Link>
                <span style={{ color: 'var(--color-text-muted)' }}>/</span>
                <span style={{ color: 'var(--color-text-primary)' }}>
                    {issue.subject || 'Untitled Draft'}
                </span>
            </div>

            <IssueEditor
                issue={{
                    id: issue.id,
                    subject: issue.subject,
                    preheader: issue.preheader,
                    status: issue.status,
                    brand: {
                        name: issue.brand.name
                    }
                }}
                initialBlocks={issue.contentBlocks}
                initialHtml={issue.htmlContent || undefined}
            />
        </div>
    );
}
