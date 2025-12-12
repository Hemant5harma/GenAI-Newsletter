'use client'

import { useState, useTransition } from "react";
import { updateIssueJson } from "@/app/actions";
import { renderNewsletterHtml } from "@/lib/email-renderer";

interface Block {
    id: string;
    type: string;
    title: string | null;
    content: string | null;
    imageUrl: string | null;
    linkUrl: string | null;
    ctaText: string | null;
    order: number;
}

interface Issue {
    id: string;
    subject: string | null;
    preheader: string | null;
    status: string;
    brand: {
        name: string;
    };
}

export default function IssueEditor({ issue, initialBlocks, initialHtml }: {
    issue: Issue;
    initialBlocks: Block[];
    initialHtml?: string;
}) {
    const [activeTab, setActiveTab] = useState<'blocks' | 'html'>('blocks');
    const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
    const [subject, setSubject] = useState(issue.subject || "");
    const [preheader, setPreheader] = useState(issue.preheader || "");
    const [htmlContent, setHtmlContent] = useState(initialHtml || "");
    const [isPending, startTransition] = useTransition();
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

    const handleBlockChange = (index: number, field: string, value: string) => {
        const newBlocks = [...blocks];
        newBlocks[index] = { ...newBlocks[index], [field]: value };
        setBlocks(newBlocks);
        setSaveStatus('idle');
    };

    const moveBlock = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === blocks.length - 1) return;

        const newBlocks = [...blocks];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];

        // Update order
        newBlocks.forEach((block, i) => {
            block.order = i;
        });

        setBlocks(newBlocks);
        setSaveStatus('idle');
    };

    const deleteBlock = (index: number) => {
        const newBlocks = blocks.filter((_, i) => i !== index);
        newBlocks.forEach((block, i) => {
            block.order = i;
        });
        setBlocks(newBlocks);
        setSaveStatus('idle');
    };

    const regenerateHtml = () => {
        const html = renderNewsletterHtml(
            { ...issue, subject, preheader },
            blocks
        );
        setHtmlContent(html);
        setSaveStatus('idle');
    };

    const handleSave = () => {
        setSaveStatus('saving');
        startTransition(async () => {
            try {
                let finalHtml = htmlContent;

                // If on blocks tab, regenerate HTML from blocks
                if (activeTab === 'blocks') {
                    finalHtml = renderNewsletterHtml(
                        { ...issue, subject, preheader },
                        blocks
                    );
                    setHtmlContent(finalHtml);
                }

                await updateIssueJson({
                    issueId: issue.id,
                    subject,
                    preheader,
                    blocks,
                    htmlContent: finalHtml
                });

                setSaveStatus('saved');
                setTimeout(() => setSaveStatus('idle'), 2000);
            } catch {
                setSaveStatus('error');
            }
        });
    };

    const handlePreview = () => {
        window.open(`/api/preview/${issue.id}`, '_blank');
    };

    const blockTypeIcons: Record<string, string> = {
        HERO: '🎯',
        ARTICLE: '📰',
        PRODUCT: '🛍️',
        TIP: '💡',
        LINK: '🔗'
    };

    return (
        <div style={{ padding: '2rem' }} className="animate-in">
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem',
                paddingBottom: '1.5rem',
                borderBottom: '1px solid var(--color-border)'
            }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Edit Newsletter</h1>
                        <span className="badge badge-accent">{issue.brand.name}</span>
                    </div>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                        {issue.status === 'DRAFT' ? 'Draft - Not yet sent' : issue.status}
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    {saveStatus === 'saved' && (
                        <span style={{ color: 'var(--color-success)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            ✓ Saved
                        </span>
                    )}
                    {saveStatus === 'error' && (
                        <span style={{ color: 'var(--color-error)', fontSize: '0.875rem' }}>
                            Error saving
                        </span>
                    )}
                    <button onClick={handlePreview} className="btn btn-secondary">
                        <span>👁️</span> Preview HTML
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isPending}
                        className="btn btn-primary"
                    >
                        {isPending ? (
                            <>
                                <span className="animate-spin" style={{ display: 'inline-block' }}>⏳</span>
                                Saving...
                            </>
                        ) : (
                            <>💾 Save Changes</>
                        )}
                    </button>
                </div>
            </div>

            {/* Tab Switcher */}
            <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                        onClick={() => setActiveTab('blocks')}
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: activeTab === 'blocks' ? 'var(--color-bg-secondary)' : 'transparent',
                            border: 'none',
                            borderBottom: activeTab === 'blocks' ? '2px solid var(--color-accent)' : '2px solid transparent',
                            fontWeight: activeTab === 'blocks' ? 600 : 400,
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        📝 Blocks Editor
                    </button>
                    <button
                        onClick={() => setActiveTab('html')}
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: activeTab === 'html' ? 'var(--color-bg-secondary)' : 'transparent',
                            border: 'none',
                            borderBottom: activeTab === 'html' ? '2px solid var(--color-accent)' : '2px solid transparent',
                            fontWeight: activeTab === 'html' ? 600 : 400,
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        &lt;/&gt; HTML Editor
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '2rem' }}>
                {/* Left Panel - Meta */}
                <div>
                    <div className="card" style={{ position: 'sticky', top: '1rem' }}>
                        <div className="card-header">
                            <h2 style={{ fontSize: '0.875rem', fontWeight: 600 }}>📧 Email Settings</h2>
                        </div>
                        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div>
                                <label className="label">Subject Line</label>
                                <input
                                    value={subject}
                                    onChange={(e) => { setSubject(e.target.value); setSaveStatus('idle'); }}
                                    placeholder="Enter subject line..."
                                    className="input"
                                />
                                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
                                    {subject.length}/60 characters
                                </div>
                            </div>
                            <div>
                                <label className="label">Preheader Text</label>
                                <textarea
                                    value={preheader}
                                    onChange={(e) => { setPreheader(e.target.value); setSaveStatus('idle'); }}
                                    placeholder="Preview text shown in inbox..."
                                    className="textarea"
                                    rows={3}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Content */}
                <div>
                    {activeTab === 'blocks' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {blocks.map((block, index) => (
                                <div key={block.id} className="card">
                                    <div className="card-header" style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '1rem 1.5rem'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span style={{ fontSize: '1.25rem' }}>{blockTypeIcons[block.type] || '📝'}</span>
                                            <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{block.type} Block</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                            <span style={{
                                                fontSize: '0.75rem',
                                                color: 'var(--color-text-muted)',
                                                background: 'var(--color-bg-tertiary)',
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '4px'
                                            }}>
                                                #{index + 1}
                                            </span>
                                            <button
                                                onClick={() => moveBlock(index, 'up')}
                                                disabled={index === 0}
                                                className="btn btn-ghost"
                                                style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                                                title="Move Up"
                                            >
                                                ↑
                                            </button>
                                            <button
                                                onClick={() => moveBlock(index, 'down')}
                                                disabled={index === blocks.length - 1}
                                                className="btn btn-ghost"
                                                style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                                                title="Move Down"
                                            >
                                                ↓
                                            </button>
                                            <button
                                                onClick={() => deleteBlock(index)}
                                                className="btn btn-ghost"
                                                style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem', color: 'var(--color-error)' }}
                                                title="Delete Block"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>

                                    <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <div>
                                            <label className="label">Title / Headline</label>
                                            <input
                                                value={block.title || ""}
                                                onChange={(e) => handleBlockChange(index, "title", e.target.value)}
                                                placeholder="Enter title..."
                                                className="input"
                                                style={{ fontWeight: 500 }}
                                            />
                                        </div>

                                        <div>
                                            <label className="label">Content</label>
                                            <textarea
                                                value={block.content || ""}
                                                onChange={(e) => handleBlockChange(index, "content", e.target.value)}
                                                placeholder="Enter content..."
                                                className="textarea"
                                                rows={4}
                                            />
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                            <div>
                                                <label className="label">Link URL</label>
                                                <input
                                                    value={block.linkUrl || ""}
                                                    onChange={(e) => handleBlockChange(index, "linkUrl", e.target.value)}
                                                    placeholder="https://..."
                                                    className="input"
                                                />
                                            </div>
                                            {(block.type === 'HERO' || block.type === 'PRODUCT') && (
                                                <div>
                                                    <label className="label">Image URL</label>
                                                    <input
                                                        value={block.imageUrl || ""}
                                                        onChange={(e) => handleBlockChange(index, "imageUrl", e.target.value)}
                                                        placeholder="https://..."
                                                        className="input"
                                                    />
                                                </div>
                                            )}
                                            {block.type === 'HERO' && (
                                                <div>
                                                    <label className="label">CTA Button Text</label>
                                                    <input
                                                        value={block.ctaText || ""}
                                                        onChange={(e) => handleBlockChange(index, "ctaText", e.target.value)}
                                                        placeholder="e.g., Shop Now"
                                                        className="input"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'html' && (
                        <div className="card">
                            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h2 style={{ fontSize: '0.875rem', fontWeight: 600 }}>Raw HTML</h2>
                                <button
                                    onClick={regenerateHtml}
                                    className="btn btn-secondary"
                                    style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                                >
                                    🔄 Regenerate from Blocks
                                </button>
                            </div>
                            <div className="card-body">
                                <textarea
                                    value={htmlContent}
                                    onChange={(e) => { setHtmlContent(e.target.value); setSaveStatus('idle'); }}
                                    placeholder="Enter or edit HTML..."
                                    className="textarea"
                                    rows={25}
                                    style={{
                                        fontFamily: 'monospace',
                                        fontSize: '0.875rem',
                                        lineHeight: 1.6
                                    }}
                                />
                                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.75rem' }}>
                                    ⚠️ Note: Saving from Blocks tab will overwrite HTML changes.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
