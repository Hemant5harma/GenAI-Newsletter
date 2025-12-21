'use client'

import { useState, useTransition, useEffect } from "react";
import { updateIssueJson } from "@/app/actions";
import Editor from "@monaco-editor/react";
import { useTheme } from "@/lib/theme-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
    Mail,
    Code,
    Columns,
    Eye,
    Monitor,
    Smartphone,
    ExternalLink,
    Copy,
    Download,
    Save,
    Check,
    AlertCircle
} from "lucide-react";

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

const MOBILE_BREAKPOINT = 768;

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
    const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
    const [isMobile, setIsMobile] = useState(false);
    const { theme } = useTheme();

    // Detect mobile viewport and force preview-only mode
    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < MOBILE_BREAKPOINT;
            setIsMobile(mobile);
            if (mobile && viewMode !== 'preview') {
                setViewMode('preview');
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, [viewMode]);

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

    const handleCopyHtml = async () => {
        try {
            await navigator.clipboard.writeText(htmlContent);
            setCopyStatus('copied');
            setTimeout(() => setCopyStatus('idle'), 2000);
        } catch (err) {
            console.error('Failed to copy HTML:', err);
        }
    };

    const handleDownloadHtml = () => {
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${subject || 'newsletter'}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const previewWidth = deviceMode === 'mobile' ? '375px' : '100%';

    return (
        <div className="h-[calc(100vh-60px)] flex flex-col animate-fade-in">
            {/* Header Bar */}
            <div className={cn(
                "flex justify-between items-center border-b border-border bg-background gap-3 flex-wrap",
                isMobile ? "px-4 py-3" : "px-6 py-3"
            )}>
                {/* Left: Title & Inputs */}
                <div className="flex items-center gap-3 flex-1 min-w-[150px] flex-wrap">
                    <div className="flex items-center gap-2">
                        <Mail size={18} className="text-primary" />
                        <Badge variant="default" className="bg-primary/10 text-primary border-0">
                            {issue.brand.name}
                        </Badge>
                    </div>
                    {!isMobile && (
                        <>
                            <Input
                                value={subject}
                                onChange={(e) => { setSubject(e.target.value); setSaveStatus('idle'); }}
                                placeholder="Subject Line..."
                                className="h-9 max-w-[300px] min-w-[150px]"
                            />
                            <Input
                                value={preheader}
                                onChange={(e) => { setPreheader(e.target.value); setSaveStatus('idle'); }}
                                placeholder="Preheader..."
                                className="h-9 max-w-[250px] min-w-[120px]"
                            />
                        </>
                    )}
                </div>

                {/* Center: View Mode Toggle - Hide code options on mobile */}
                {!isMobile && (
                    <div className="flex bg-muted rounded-lg p-1 gap-1">
                        <Button
                            onClick={() => setViewMode('code')}
                            variant={viewMode === 'code' ? 'default' : 'ghost'}
                            size="sm"
                            className="h-8 px-3"
                            title="Code Only"
                        >
                            <Code size={14} />
                        </Button>
                        <Button
                            onClick={() => setViewMode('split')}
                            variant={viewMode === 'split' ? 'default' : 'ghost'}
                            size="sm"
                            className="h-8 px-3"
                            title="Split View"
                        >
                            <Columns size={14} />
                        </Button>
                        <Button
                            onClick={() => setViewMode('preview')}
                            variant={viewMode === 'preview' ? 'default' : 'ghost'}
                            size="sm"
                            className="h-8 px-3"
                            title="Preview Only"
                        >
                            <Eye size={14} />
                        </Button>
                    </div>
                )}

                {/* Mobile indicator */}
                {isMobile && (
                    <Badge className="gap-1 bg-primary/10 text-primary border-0">
                        <Eye size={12} /> Preview Only
                    </Badge>
                )}

                {/* Right: Actions */}
                <div className="flex gap-2 items-center">
                    {/* Device Toggle (only in preview/split mode on desktop) */}
                    {!isMobile && viewMode !== 'code' && (
                        <div className="flex bg-muted rounded-md p-1 gap-0.5">
                            <Button
                                onClick={() => setDeviceMode('desktop')}
                                variant="ghost"
                                size="sm"
                                className={cn("h-8 w-8 p-0", deviceMode === 'desktop' && "bg-background")}
                                title="Desktop View"
                            >
                                <Monitor size={16} />
                            </Button>
                            <Button
                                onClick={() => setDeviceMode('mobile')}
                                variant="ghost"
                                size="sm"
                                className={cn("h-8 w-8 p-0", deviceMode === 'mobile' && "bg-background")}
                                title="Mobile View"
                            >
                                <Smartphone size={16} />
                            </Button>
                        </div>
                    )}

                    <Separator orientation="vertical" className="h-6 hidden sm:block" />

                    {/* Copy HTML Button */}
                    <Button
                        onClick={handleCopyHtml}
                        variant="ghost"
                        size="icon"
                        title="Copy HTML"
                    >
                        {copyStatus === 'copied' ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                    </Button>

                    {/* Download HTML Button */}
                    <Button
                        onClick={handleDownloadHtml}
                        variant="ghost"
                        size="icon"
                        title="Download HTML"
                    >
                        <Download size={16} />
                    </Button>

                    {/* Open in New Tab */}
                    <Button asChild variant="ghost" size="icon" title="Open in New Tab">
                        <a href={`/api/preview/${issue.id}`} target="_blank" rel="noopener noreferrer">
                            <ExternalLink size={16} />
                        </a>
                    </Button>

                    {/* Save Status */}
                    {saveStatus === 'saved' && (
                        <span className="text-emerald-500 text-xs font-medium flex items-center gap-1">
                            <Check size={14} /> Saved
                        </span>
                    )}
                    {saveStatus === 'error' && (
                        <span className="text-destructive text-xs flex items-center gap-1">
                            <AlertCircle size={14} /> Error
                        </span>
                    )}

                    {/* Save Button */}
                    <Button
                        onClick={handleSave}
                        disabled={isPending}
                        size="sm"
                        className="gap-2"
                    >
                        <Save size={14} />
                        {!isMobile && (isPending ? 'Saving...' : 'Save')}
                    </Button>
                </div>
            </div>

            {/* Mobile Subject/Preheader Inputs */}
            {isMobile && (
                <div className="px-4 py-3 border-b border-border bg-muted/30 space-y-2">
                    <Input
                        value={subject}
                        onChange={(e) => { setSubject(e.target.value); setSaveStatus('idle'); }}
                        placeholder="Subject Line..."
                        className="h-9"
                    />
                    <Input
                        value={preheader}
                        onChange={(e) => { setPreheader(e.target.value); setSaveStatus('idle'); }}
                        placeholder="Preheader..."
                        className="h-9"
                    />
                </div>
            )}

            {/* Editor Area */}
            <div className="flex-1 flex overflow-hidden">
                {/* Code Editor - Hidden on mobile */}
                {!isMobile && (viewMode === 'code' || viewMode === 'split') && (
                    <div className={cn(
                        "flex flex-col min-w-0",
                        viewMode === 'split' ? "flex-1 border-r border-border" : "flex-1"
                    )}>
                        <div className="px-4 py-2 bg-muted border-b border-border text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <Code size={12} />
                            HTML Source
                        </div>
                        <div className="flex-1 relative">
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
                {(viewMode === 'preview' || viewMode === 'split' || isMobile) && (
                    <div className="flex-1 flex flex-col bg-muted min-w-0">
                        <div className="px-4 py-2 bg-card border-b border-border text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                <Eye size={12} />
                                Live Preview
                            </span>
                            <span className="font-normal">{isMobile ? '100%' : (deviceMode === 'mobile' ? '375px' : '100%')}</span>
                        </div>
                        <div className="flex-1 overflow-hidden flex justify-center items-center bg-accent/30 p-4">
                            <div
                                className={cn(
                                    "h-full bg-white shadow-xl transition-all duration-300 rounded-sm",
                                    isMobile && "w-full shadow-none"
                                )}
                                style={{ width: isMobile ? '100%' : previewWidth }}
                            >
                                <iframe
                                    srcDoc={previewContent}
                                    className="w-full h-full border-0 block bg-white"
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
