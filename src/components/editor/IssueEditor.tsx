'use client'

import { useState, useTransition, useEffect, useRef } from "react";
import { updateIssueJson } from "@/app/actions";
import Editor from "@monaco-editor/react";
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

type ViewMode = 'split' | 'code' | 'preview';
type DeviceMode = 'desktop' | 'mobile';

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
    const [viewMode, setViewMode] = useState<ViewMode>('split');
    const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
    const { theme } = useTheme();
    const iframeRef = useRef<HTMLIFrameElement>(null);

    // Update preview when htmlContent changes, with a small debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            setPreviewContent(htmlContent);
        }, 300);
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
                    blocks: [],
                    htmlContent: htmlContent
                });
                setSaveStatus('saved');
                setTimeout(() => setSaveStatus('idle'), 2000);
            } catch {
                setSaveStatus('error');
            }
        });
    };

    const previewWidth = deviceMode === 'mobile' ? '375px' : '100%';

    return (
        <div style={{ height: 'calc(100vh - 60px)', display: 'flex', flexDirection: 'column' }} className="animate-in">
            {/* Header Bar */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem 1.5rem',
                borderBottom: '1px solid var(--color-border)',
                background: 'var(--color-bg-primary)',
                gap: '1rem',
                flexWrap: 'wrap'
            }}>
                {/* Left: Title & Inputs */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: '300px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1.25rem' }}>✉️</span>
                        <span className="badge badge-accent">{issue.brand.name}</span>
                    </div>
                    <input
                        value={subject}
                        onChange={(e) => { setSubject(e.target.value); setSaveStatus('idle'); }}
                        placeholder="Subject Line..."
                        className="input"
                        style={{ height: '2.25rem', fontSize: '0.875rem', flex: 1, maxWidth: '300px' }}
                    />
                    <input
                        value={preheader}
                        onChange={(e) => { setPreheader(e.target.value); setSaveStatus('idle'); }}
                        placeholder="Preheader..."
                        className="input"
                        style={{ height: '2.25rem', fontSize: '0.875rem', flex: 1, maxWidth: '250px' }}
                    />
                </div>

                {/* Center: View Mode Toggle */}
                <div style={{
                    display: 'flex',
                    background: 'var(--color-bg-tertiary)',
                    borderRadius: '8px',
                    padding: '4px',
                    gap: '2px'
                }}>
                    <button
                        onClick={() => setViewMode('code')}
                        className={viewMode === 'code' ? 'btn btn-primary' : 'btn btn-ghost'}
                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}
                    >
                        {'</>'}
                    </button>
                    <button
                        onClick={() => setViewMode('split')}
                        className={viewMode === 'split' ? 'btn btn-primary' : 'btn btn-ghost'}
                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}
                    >
                        Split
                    </button>
                    <button
                        onClick={() => setViewMode('preview')}
                        className={viewMode === 'preview' ? 'btn btn-primary' : 'btn btn-ghost'}
                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}
                    >
                        Preview
                    </button>
                </div>

                {/* Right: Actions */}
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    {/* Device Toggle (only in preview/split mode) */}
                    {viewMode !== 'code' && (
                        <div style={{
                            display: 'flex',
                            background: 'var(--color-bg-tertiary)',
                            borderRadius: '6px',
                            padding: '3px',
                            gap: '1px'
                        }}>
                            <button
                                onClick={() => setDeviceMode('desktop')}
                                className="btn btn-ghost"
                                style={{
                                    padding: '0.35rem 0.5rem',
                                    fontSize: '0.875rem',
                                    background: deviceMode === 'desktop' ? 'var(--color-bg-primary)' : 'transparent'
                                }}
                                title="Desktop View"
                            >
                                🖥️
                            </button>
                            <button
                                onClick={() => setDeviceMode('mobile')}
                                className="btn btn-ghost"
                                style={{
                                    padding: '0.35rem 0.5rem',
                                    fontSize: '0.875rem',
                                    background: deviceMode === 'mobile' ? 'var(--color-bg-primary)' : 'transparent'
                                }}
                                title="Mobile View"
                            >
                                📱
                            </button>
                        </div>
                    )}
                    <a
                        href={`/api/preview/${issue.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-ghost"
                        title="Open in New Tab"
                        style={{ padding: '0.4rem 0.6rem', textDecoration: 'none', fontSize: '0.875rem' }}
                    >
                        ↗️
                    </a>
                    {saveStatus === 'saved' && (
                        <span style={{ color: 'var(--color-success)', fontSize: '0.75rem', fontWeight: 500 }}>✓ Saved</span>
                    )}
                    {saveStatus === 'error' && (
                        <span style={{ color: 'var(--color-error)', fontSize: '0.75rem' }}>Error</span>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={isPending}
                        className="btn btn-primary"
                        style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                    >
                        {isPending ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>

            {/* Editor Area */}
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                {/* Code Editor */}
                {(viewMode === 'code' || viewMode === 'split') && (
                    <div style={{
                        flex: viewMode === 'split' ? 1 : 1,
                        display: 'flex',
                        flexDirection: 'column',
                        borderRight: viewMode === 'split' ? '1px solid var(--color-border)' : 'none',
                        minWidth: 0
                    }}>
                        <div style={{
                            padding: '0.5rem 1rem',
                            background: 'var(--color-bg-secondary)',
                            borderBottom: '1px solid var(--color-border)',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            color: 'var(--color-text-muted)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>
                            HTML Source
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
                                    fontSize: 13,
                                    wordWrap: 'on',
                                    padding: { top: 12 },
                                    scrollBeyondLastLine: false,
                                    automaticLayout: true,
                                    fontFamily: "'Fira Code', 'Consolas', monospace",
                                    fontLigatures: true,
                                    lineNumbers: 'on',
                                    renderLineHighlight: 'line',
                                    cursorBlinking: 'smooth',
                                    smoothScrolling: true,
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* Live Preview */}
                {/* Live Preview */}
                {(viewMode === 'preview' || viewMode === 'split') && (
                    <div style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        background: '#f3f4f6',
                        minWidth: 0
                    }}>
                        <div style={{
                            padding: '0.5rem 1rem',
                            background: 'white',
                            borderBottom: '1px solid var(--color-border)',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            color: 'var(--color-text-muted)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                            zIndex: 10
                        }}>
                            <span>Live Preview</span>
                            <span style={{ fontWeight: 400 }}>{deviceMode === 'mobile' ? '375px' : '100%'}</span>
                        </div>
                        <div style={{
                            flex: 1,
                            padding: '0', // No padding for full height feel
                            overflow: 'hidden', // Disable parent scroll
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            background: '#e5e7eb'
                        }}>
                            <div style={{
                                width: previewWidth,
                                height: '100%', // Full height
                                background: 'white',
                                boxShadow: '0 0 20px rgba(0,0,0,0.1)',
                                transition: 'width 0.3s ease'
                            }}>
                                <iframe
                                    srcDoc={previewContent}
                                    style={{
                                        width: '100%',
                                        height: '100%', // Full height
                                        border: 'none',
                                        display: 'block',
                                        background: 'white'
                                    }}
                                    title="Email Preview"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

