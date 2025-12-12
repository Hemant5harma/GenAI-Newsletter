'use client'

import { useState, useTransition, useEffect } from "react";
import { updateIssueJson } from "@/app/actions";
import Editor, { useMonaco } from "@monaco-editor/react";
import { useTheme } from "@/lib/theme-context";

interface Issue {
    id: string;
    subject: string | null;
    preheader: string | null;
    status: string;
    brand: {
        name: string;
    };
}

export default function IssueEditor({ issue, initialHtml }: {
    issue: Issue;
    initialBlocks: any[];
    initialHtml?: string;
}) {
    const [subject, setSubject] = useState(issue.subject || "");
    const [preheader, setPreheader] = useState(issue.preheader || "");
    const [htmlContent, setHtmlContent] = useState(initialHtml || "");
    const [isPending, startTransition] = useTransition();
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
    const [previewContent, setPreviewContent] = useState(initialHtml || "");
    const { theme, toggleTheme } = useTheme();

    // Update preview when htmlContent changes, with a small debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            setPreviewContent(htmlContent);
        }, 500);
        return () => clearTimeout(timer);
    }, [htmlContent]);

    const handleSave = () => {
        setSaveStatus('saving');
        startTransition(async () => {
            try {
                await updateIssueJson({
                    issueId: issue.id,
                    subject,
                    preheader,
                    blocks: [], // Empty blocks as we aren't using them
                    htmlContent: htmlContent
                });

                setSaveStatus('saved');
                setTimeout(() => setSaveStatus('idle'), 2000);
            } catch {
                setSaveStatus('error');
            }
        });
    };

    return (
        <div style={{ height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }} className="animate-in">
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem 2rem',
                borderBottom: '1px solid var(--color-border)',
                background: 'var(--color-bg-primary)'
            }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                        <h1 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Edit Newsletter</h1>
                        <span className="badge badge-accent">{issue.brand.name}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <input
                            value={subject}
                            onChange={(e) => { setSubject(e.target.value); setSaveStatus('idle'); }}
                            placeholder="Subject Line"
                            className="input"
                            style={{ height: '2rem', fontSize: '0.875rem', width: '300px' }}
                        />
                        <input
                            value={preheader}
                            onChange={(e) => { setPreheader(e.target.value); setSaveStatus('idle'); }}
                            placeholder="Preheader text..."
                            className="input"
                            style={{ height: '2rem', fontSize: '0.875rem', width: '300px' }}
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <button
                        onClick={toggleTheme}
                        className="btn btn-ghost"
                        title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
                        style={{ fontSize: '1.25rem', padding: '0.5rem' }}
                    >
                        {theme === 'light' ? '🌙' : '☀️'}
                    </button>
                    {saveStatus === 'saved' && (
                        <span style={{ color: 'var(--color-success)', fontSize: '0.875rem' }}>✓ Saved</span>
                    )}
                    {saveStatus === 'error' && (
                        <span style={{ color: 'var(--color-error)', fontSize: '0.875rem' }}>Error saving</span>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={isPending}
                        className="btn btn-primary"
                    >
                        {isPending ? 'Saving...' : '💾 Save Changes'}
                    </button>
                </div>
            </div>

            {/* Editor Area */}
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                {/* Code Editor */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--color-border)' }}>
                    <div style={{ padding: '0.5rem 1rem', background: 'var(--color-bg-secondary)', borderBottom: '1px solid var(--color-border)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                        HTML SOURCE
                    </div>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <Editor
                            height="100%"
                            defaultLanguage="html"
                            value={htmlContent}
                            theme={theme === 'dark' ? "vs-dark" : "light"}
                            onChange={(value) => { setHtmlContent(value || ""); setSaveStatus('idle'); }}
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                wordWrap: 'on',
                                padding: { top: 16 },
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                fontFamily: "'Fira Code', monospace",
                                fontLigatures: true,
                            }}
                        />
                    </div>
                </div>

                {/* Live Preview */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--color-bg-secondary)' }}>
                    <div style={{ padding: '0.5rem 1rem', background: 'var(--color-bg-secondary)', borderBottom: '1px solid var(--color-border)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                        <span>LIVE PREVIEW</span>
                        <span>Width: 100% (Responsive)</span>
                    </div>
                    <div style={{ flex: 1, padding: '2rem', overflow: 'auto', display: 'flex', justifyContent: 'center' }}>
                        <div style={{
                            width: '100%',
                            maxWidth: '600px',
                            background: 'white',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                            height: 'max-content',
                            minHeight: '100%'
                        }}>
                            <iframe
                                srcDoc={previewContent}
                                style={{
                                    width: '100%',
                                    height: '800px', // Min height, will need something better for dynamic height eventually
                                    border: 'none',
                                    display: 'block'
                                }}
                                title="Email Preview"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
