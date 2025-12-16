import { db } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import { generateIssueAction } from "@/app/actions";
import DeleteIssueButton from "@/components/DeleteIssueButton";
import GenerateIssueButton from "@/components/GenerateIssueButton";

interface Issue {
    id: string;
    subject: string | null;
    status: string;
    generatedAt: Date;
}

export default async function BrandDashboard(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const brand = await db.brand.findUnique({
        where: { id: params.id },
        include: {
            issues: {
                orderBy: { generatedAt: 'desc' },
                take: 20
            }
        }
    });

    if (!brand) {
        notFound();
    }

    const issues = brand.issues as Issue[];

    const statusColors: Record<string, { bg: string; color: string }> = {
        DRAFT: { bg: 'var(--color-bg-tertiary)', color: 'var(--color-text-secondary)' },
        GENERATING: { bg: 'rgba(99, 102, 241, 0.15)', color: 'var(--color-accent)' },
        APPROVED: { bg: 'rgba(34, 197, 94, 0.15)', color: 'var(--color-success)' },
        SENT: { bg: 'rgba(34, 197, 94, 0.15)', color: 'var(--color-success)' },
        FAILED: { bg: 'rgba(239, 68, 68, 0.15)', color: 'var(--color-error)' }
    };

    return (
        <div style={{ padding: '2rem' }} className="animate-in">
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '2rem'
            }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>{brand.name}</h1>
                        <span className="badge badge-accent">{brand.category}</span>
                        <Link
                            href={`/dashboard/brands/${brand.id}/settings`}
                            className="btn btn-ghost"
                            style={{ padding: '0.5rem', fontSize: '1.25rem' }}
                            title="Generation Settings"
                        >
                            ⚙️
                        </Link>
                    </div>
                    <p style={{ color: 'var(--color-text-secondary)' }}>
                        {brand.tagline || brand.audience || 'No description set'}
                    </p>
                </div>

                <GenerateIssueButton
                    brandId={brand.id}
                    generateAction={generateIssueAction}
                />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4" style={{ marginBottom: '2rem' }}>
                <div className="card" style={{ padding: '1.25rem' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                        Total Issues
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 700 }}>{issues.length}</div>
                </div>
                <div className="card" style={{ padding: '1.25rem' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                        Drafts
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 700 }}>
                        {issues.filter((i: Issue) => i.status === 'DRAFT').length}
                    </div>
                </div>
                <div className="card" style={{ padding: '1.25rem' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                        Sent
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 700 }}>
                        {issues.filter((i: Issue) => i.status === 'SENT').length}
                    </div>
                </div>
            </div>

            {/* Issues List */}
            <div className="card">
                <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '1rem', fontWeight: 600 }}>Recent Issues</h2>
                </div>

                {issues.length === 0 ? (
                    <div style={{
                        padding: '4rem 2rem',
                        textAlign: 'center',
                        color: 'var(--color-text-muted)'
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
                        <p style={{ marginBottom: '0.5rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
                            No newsletters yet
                        </p>
                        <p style={{ fontSize: '0.875rem' }}>
                            Click &quot;Generate New Issue&quot; to create your first AI newsletter
                        </p>
                    </div>
                ) : (
                    <div>
                        {issues.map((issue: Issue, index: number) => (
                            <div
                                key={issue.id}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    padding: '1rem 1.5rem',
                                    borderBottom: index < issues.length - 1 ? '1px solid var(--color-border)' : 'none',
                                    transition: 'background 0.15s'
                                }}
                                className="issue-row"
                            >
                                <Link
                                    href={`/dashboard/issues/${issue.id}`}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem',
                                        flex: 1
                                    }}
                                >
                                    <div style={{ flex: 1 }}>
                                        <div style={{
                                            fontWeight: 500,
                                            marginBottom: '0.25rem',
                                            color: issue.subject ? 'var(--color-text-primary)' : 'var(--color-text-muted)'
                                        }}>
                                            {issue.subject || 'Untitled Draft'}
                                        </div>
                                        <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                                            {issue.generatedAt.toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                    </div>
                                    <span
                                        className="badge"
                                        style={{
                                            background: statusColors[issue.status]?.bg || statusColors.DRAFT.bg,
                                            color: statusColors[issue.status]?.color || statusColors.DRAFT.color
                                        }}
                                    >
                                        {issue.status}
                                    </span>
                                    <span style={{ color: 'var(--color-text-muted)', fontSize: '1.25rem' }}>→</span>
                                </Link>
                                <DeleteIssueButton issueId={issue.id} brandId={brand.id} />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style>{`
                .issue-row:hover {
                    background: var(--color-bg-tertiary) !important;
                }
            `}</style>
        </div>
    );
}
