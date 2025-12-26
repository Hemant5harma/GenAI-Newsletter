'use client'

import { useState, useTransition } from "react";
import { updateBrandSettings } from "@/app/actions";
import { useRouter } from "next/navigation";
import ToggleSwitch from "./ui/ToggleSwitch";
import {
    Image,
    Clock,
    MessageSquare,
    Type,
    Palette,
    Save,
    X,
    Tag,
    FileText,
    Check,
    ChevronDown
} from "lucide-react";

// ============================================================================
// TYPES
// ============================================================================
interface GenerationSettings {
    images: { mode: 'random' | 'manual'; urls: string[]; count: number };
    linksCount: { mode: 'random' | 'manual'; count: number };
    categories: { mode: 'random' | 'manual'; list: string[] };
    content: { mode: 'random' | 'manual'; text: string };
    keywords: string[];
    colors: { mode: 'random' | 'manual'; primary: string; secondary: string; preset?: string };
    contentSize: 'small' | 'medium' | 'large';
    editorMode: 'html' | 'blocks';
    timeRange?: { mode: 'auto' } | { mode: 'manual'; value: '24h' | '48h' | 'week' | 'any' };
    tone?: { mode: 'auto' } | { mode: 'manual'; value: string };
    wordCount?: { mode: 'auto' } | { mode: 'manual'; value: number };
    fonts?: { mode: 'auto' } | { mode: 'manual'; value: 'sans' | 'serif' | 'mono' };
}

// ============================================================================
// CONSTANTS
// ============================================================================
const colorPresets = [
    { name: 'Indigo', primary: '#6366f1', secondary: '#8b5cf6' },
    { name: 'Emerald', primary: '#059669', secondary: '#10b981' },
    { name: 'Rose', primary: '#e11d48', secondary: '#f43f5e' },
    { name: 'Amber', primary: '#d97706', secondary: '#f59e0b' },
    { name: 'Slate', primary: '#475569', secondary: '#64748b' },
];

const wordCountOptions = [
    { value: 800, label: 'Concise (~800 words)' },
    { value: 1000, label: 'Standard (~1000 words) ✦', recommended: true },
    { value: 1500, label: 'Deep Dive (~1500 words)' },
    { value: 2000, label: 'Comprehensive (~2000 words)' },
];

const timeRangeOptions = [
    { value: '24h', label: 'Last 24 Hours' },
    { value: '48h', label: 'Last 48 Hours ✦', recommended: true },
    { value: 'week', label: 'Last 7 Days' },
    { value: 'any', label: 'Any Time' },
];

const toneOptions = [
    { value: 'professional', label: 'Professional' },
    { value: 'witty', label: 'Witty & Smart ✦', recommended: true },
    { value: 'casual', label: 'Casual & Friendly' },
    { value: 'urgent', label: 'Urgent & Direct' },
    { value: 'academic', label: 'Academic' },
];

const fontOptions = [
    { value: 'sans', label: 'Sans Serif', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', recommended: true },
    { value: 'serif', label: 'Serif', fontFamily: 'Georgia, "Times New Roman", serif' },
    { value: 'mono', label: 'Monospace', fontFamily: '"SF Mono", Monaco, "Courier New", monospace' },
];

const imageCountOptions = [
    { value: 0, label: 'No Images' },
    { value: 1, label: '1 Image' },
    { value: 2, label: '2 Images ✦', recommended: true },
    { value: 3, label: '3 Images' },
];

const defaultSettings: GenerationSettings = {
    images: { mode: 'random', urls: ['', '', ''], count: 2 },
    linksCount: { mode: 'random', count: 4 },
    categories: { mode: 'random', list: [] },
    content: { mode: 'random', text: '' },
    keywords: [],
    colors: { mode: 'random', primary: '#6366f1', secondary: '#8b5cf6' },
    contentSize: 'medium',
    editorMode: 'html',
    timeRange: { mode: 'auto' },
    tone: { mode: 'auto' },
    wordCount: { mode: 'auto' },
    fonts: { mode: 'auto' },
};

// ============================================================================
// COMPONENT
// ============================================================================
export default function BrandSettingsForm({ brand }: { brand: any }) {
    const brandSettings = brand.settings ? (brand.settings as GenerationSettings) : defaultSettings;
    const [config, setConfig] = useState<GenerationSettings>({
        ...defaultSettings,
        ...brandSettings
    });
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const [keywordInput, setKeywordInput] = useState('');

    // ========================================================================
    // HANDLERS
    // ========================================================================
    const addKeyword = () => {
        if (keywordInput.trim() && !config.keywords.includes(keywordInput.trim())) {
            setConfig({ ...config, keywords: [...config.keywords, keywordInput.trim()] });
            setKeywordInput('');
        }
    };

    const removeKeyword = (kw: string) => {
        setConfig({ ...config, keywords: config.keywords.filter(k => k !== kw) });
    };

    const updateImageUrl = (index: number, url: string) => {
        const newUrls = [...config.images.urls];
        newUrls[index] = url;
        setConfig({ ...config, images: { ...config.images, urls: newUrls } });
    };

    const setImageCount = (count: number) => {
        const newUrls = Array(count).fill('').map((_, i) => config.images.urls[i] || '');
        setConfig({ ...config, images: { ...config.images, count, urls: newUrls } });
    };

    const handleSave = () => {
        startTransition(async () => {
            await updateBrandSettings(brand.id, config);
            router.push(`/dashboard/brands/${brand.id}`);
        });
    };

    // ========================================================================
    // RENDER
    // ========================================================================
    const styles = {
        container: {
            maxWidth: '900px',
            margin: '0 auto',
            padding: '2rem',
        },
        header: {
            marginBottom: '2rem',
        },
        title: {
            fontSize: '1.75rem',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            marginBottom: '0.5rem',
        },
        subtitle: {
            fontSize: '0.9375rem',
            color: 'var(--color-text-muted)',
            lineHeight: 1.6,
        },
        section: {
            background: 'var(--color-bg-primary)',
            border: '1px solid var(--color-border-custom)',
            borderRadius: '16px',
            padding: '2rem',
            marginBottom: '1.5rem',
            boxShadow: 'var(--shadow-sm)',
            transition: 'all var(--transition-normal)',
        } as React.CSSProperties,
        sectionHeader: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '1.5rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid var(--color-border-custom)',
        } as React.CSSProperties,
        settingBlock: {
            marginBottom: '2rem',
            paddingBottom: '2rem',
            borderBottom: '1px solid var(--color-border-custom)',
        } as React.CSSProperties,
        settingBlockLast: {
            marginBottom: 0,
            paddingBottom: 0,
            borderBottom: 'none',
        } as React.CSSProperties,
        label: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.9375rem',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            marginBottom: '0.75rem',
        } as React.CSSProperties,
        description: {
            fontSize: '0.8125rem',
            color: 'var(--color-text-muted)',
            marginBottom: '1rem',
            lineHeight: 1.5,
        } as React.CSSProperties,
        select: {
            width: '100%',
            padding: '0.875rem 2.5rem 0.875rem 1rem',
            fontSize: '0.9375rem',
            background: 'var(--color-bg-secondary)',
            border: '2px solid var(--color-border-custom)',
            borderRadius: '12px',
            color: 'var(--color-text-primary)',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
            appearance: 'none' as const,
            fontWeight: 500,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 1rem center',
        } as React.CSSProperties,
        input: {
            width: '100%',
            padding: '0.875rem 1rem',
            fontSize: '0.9375rem',
            background: 'var(--color-bg-secondary)',
            border: '2px solid var(--color-border-custom)',
            borderRadius: '12px',
            color: 'var(--color-text-primary)',
            transition: 'all var(--transition-fast)',
            fontWeight: 500,
        } as React.CSSProperties,
        textarea: {
            width: '100%',
            padding: '0.875rem 1rem',
            fontSize: '0.9375rem',
            background: 'var(--color-bg-secondary)',
            border: '2px solid var(--color-border-custom)',
            borderRadius: '12px',
            color: 'var(--color-text-primary)',
            resize: 'vertical' as const,
            minHeight: '120px',
            fontFamily: 'inherit',
            lineHeight: 1.6,
            fontWeight: 500,
        } as React.CSSProperties,
        fontCard: (selected: boolean) => ({
            flex: '1 1 180px',
            padding: '1.25rem',
            background: selected ? 'var(--color-accent-glow)' : 'var(--color-bg-secondary)',
            border: selected ? '2px solid var(--color-accent-custom)' : '1px solid var(--color-border-custom)',
            borderRadius: '12px',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
            textAlign: 'left' as const,
        } as React.CSSProperties),
        tag: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 0.875rem',
            background: 'var(--color-bg-tertiary)',
            border: '1px solid var(--color-border-custom)',
            borderRadius: '20px',
            fontSize: '0.8125rem',
            fontWeight: 500,
            color: 'var(--color-text-secondary)',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
        } as React.CSSProperties,
        colorPreview: {
            width: '100%',
            height: '80px',
            borderRadius: '10px',
            marginBottom: '1rem',
            boxShadow: 'var(--shadow-sm)',
        } as React.CSSProperties,
        buttonPrimary: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.875rem 1.5rem',
            background: 'var(--gradient-primary)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '0.9375rem',
            fontWeight: 600,
            cursor: isPending ? 'not-allowed' : 'pointer',
            transition: 'all var(--transition-fast)',
            opacity: isPending ? 0.7 : 1,
        } as React.CSSProperties,
        buttonSecondary: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.875rem 1.5rem',
            background: 'var(--color-bg-secondary)',
            color: 'var(--color-text-secondary)',
            border: '1px solid var(--color-border-custom)',
            borderRadius: '10px',
            fontSize: '0.9375rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
        } as React.CSSProperties,
    };

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <h1 style={styles.title}>Newsletter Settings</h1>
                <p style={styles.subtitle}>
                    Customize how your newsletters are generated. Toggle "Auto" to let AI decide, or manually configure each setting.
                </p>
            </div>

            {/* Content Settings */}
            <div style={styles.section}>
                <div style={styles.sectionHeader}>
                    <FileText size={24} style={{ color: 'var(--color-accent-custom)' }} />
                    <div>
                        <h2 style={{ fontSize: '1.125rem', fontWeight: 600, margin: 0, color: 'var(--color-text-primary)' }}>Content</h2>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', margin: 0 }}>Configure newsletter content and sources</p>
                    </div>
                </div>

                {/* Time Range */}
                <div style={styles.settingBlock}>
                    <div style={styles.label}>
                        <Clock size={18} style={{ color: 'var(--color-text-muted)' }} />
                        News Time Range
                    </div>
                    <p style={styles.description}>How recent should the news sources be?</p>
                    <ToggleSwitch
                        checked={config.timeRange?.mode === 'auto'}
                        onChange={(checked) => setConfig({ ...config, timeRange: checked ? { mode: 'auto' } : { mode: 'manual', value: '48h' } })}
                        label="Auto (AI Decides)"
                        description="Defaults to 48 hours"
                    />
                    {config.timeRange?.mode === 'manual' && (
                        <div style={{ marginTop: '1rem' }}>
                            <select
                                value={config.timeRange.value}
                                onChange={(e) => setConfig({ ...config, timeRange: { mode: 'manual', value: e.target.value as any } })}
                                style={styles.select}
                            >
                                {timeRangeOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {/* Tone */}
                <div style={styles.settingBlock}>
                    <div style={styles.label}>
                        <MessageSquare size={18} style={{ color: 'var(--color-text-muted)' }} />
                        Tone of Voice
                    </div>
                    <p style={styles.description}>The writing style for your newsletter</p>
                    <ToggleSwitch
                        checked={config.tone?.mode === 'auto'}
                        onChange={(checked) => setConfig({ ...config, tone: checked ? { mode: 'auto' } : { mode: 'manual', value: 'witty' } })}
                        label="Auto (AI Decides)"
                        description="Adapts to your brand voice"
                    />
                    {config.tone?.mode === 'manual' && (
                        <div style={{ marginTop: '1rem' }}>
                            <select
                                value={config.tone.value}
                                onChange={(e) => setConfig({ ...config, tone: { mode: 'manual', value: e.target.value } })}
                                style={styles.select}
                            >
                                {toneOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {/* Word Count */}
                <div style={styles.settingBlock}>
                    <div style={styles.label}>
                        <FileText size={18} style={{ color: 'var(--color-text-muted)' }} />
                        Content Length
                    </div>
                    <p style={styles.description}>Target word count for the newsletter</p>
                    <ToggleSwitch
                        checked={config.wordCount?.mode === 'auto'}
                        onChange={(checked) => setConfig({ ...config, wordCount: checked ? { mode: 'auto' } : { mode: 'manual', value: 1000 } })}
                        label="Auto (Standard ~1000 Words)"
                        description="Optimized for engagement"
                    />
                    {config.wordCount?.mode === 'manual' && (
                        <div style={{ marginTop: '1rem' }}>
                            <select
                                value={config.wordCount.value}
                                onChange={(e) => setConfig({ ...config, wordCount: { mode: 'manual', value: Number(e.target.value) } })}
                                style={styles.select}
                            >
                                {wordCountOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {/* Topic */}
                <div style={styles.settingBlock}>
                    <div style={styles.label}>
                        <FileText size={18} style={{ color: 'var(--color-text-muted)' }} />
                        Newsletter Topic
                    </div>
                    <p style={styles.description}>Specific topic or let AI find trending content</p>
                    <ToggleSwitch
                        checked={config.content.mode === 'random'}
                        onChange={(checked) => setConfig({ ...config, content: { ...config.content, mode: checked ? 'random' : 'manual' } })}
                        label="Auto (AI Decides)"
                        description="Searches for trending topics"
                    />
                    {config.content.mode === 'manual' && (
                        <div style={{ marginTop: '1rem' }}>
                            <textarea
                                placeholder="e.g., The future of AI agents in business"
                                value={config.content.text}
                                onChange={(e) => setConfig({ ...config, content: { ...config.content, text: e.target.value } })}
                                style={styles.textarea}
                            />
                        </div>
                    )}
                </div>

                {/* Keywords */}
                <div style={{ ...styles.settingBlock, ...styles.settingBlockLast }}>
                    <div style={styles.label}>
                        <Tag size={18} style={{ color: 'var(--color-text-muted)' }} />
                        Focus Keywords
                    </div>
                    <p style={styles.description}>Keywords to emphasize in generated content</p>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                        <input
                            placeholder="Add keyword (e.g., 'AI', 'productivity')"
                            value={keywordInput}
                            onChange={(e) => setKeywordInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                            style={{ ...styles.input, flex: 1 }}
                        />
                        <button onClick={addKeyword} style={{ padding: '0.75rem 1.25rem', background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-custom)', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                            Add
                        </button>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {config.keywords.map(kw => (
                            <span key={kw} onClick={() => removeKeyword(kw)} style={styles.tag}>
                                {kw} <X size={14} />
                            </span>
                        ))}
                        {config.keywords.length === 0 && <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>No keywords added</span>}
                    </div>
                </div>
            </div>

            {/* Design Settings */}
            <div style={styles.section}>
                <div style={styles.sectionHeader}>
                    <Palette size={24} style={{ color: 'var(--color-accent-custom)' }} />
                    <div>
                        <h2 style={{ fontSize: '1.125rem', fontWeight: 600, margin: 0, color: 'var(--color-text-primary)' }}>Design</h2>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', margin: 0 }}>Visual appearance and branding</p>
                    </div>
                </div>

                {/* Images */}
                <div style={styles.settingBlock}>
                    <div style={styles.label}>
                        <Image size={18} style={{ color: 'var(--color-text-muted)' }} />
                        Newsletter Images
                    </div>
                    <p style={styles.description}>Add images to make your newsletter visually engaging</p>
                    <ToggleSwitch
                        checked={config.images.mode === 'random'}
                        onChange={(checked) => setConfig({ ...config, images: { ...config.images, mode: checked ? 'random' : 'manual' } })}
                        label="Auto (AI Decides)"
                        description="Finds relevant images from Unsplash"
                    />
                    <div style={{ marginTop: '1rem' }}>
                        <label style={{ fontSize: '0.8125rem', fontWeight: 500, marginBottom: '0.5rem', display: 'block', color: 'var(--color-text-secondary)' }}>
                            Number of Images
                        </label>
                        <select
                            value={config.images.count}
                            onChange={(e) => setImageCount(Number(e.target.value))}
                            style={styles.select}
                        >
                            {imageCountOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                    {config.images.mode === 'manual' && config.images.count > 0 && (
                        <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column' as const, gap: '0.5rem' }}>
                            {Array.from({ length: config.images.count }).map((_, i) => (
                                <input
                                    key={i}
                                    placeholder={`Image ${i + 1} URL`}
                                    value={config.images.urls[i] || ''}
                                    onChange={(e) => updateImageUrl(i, e.target.value)}
                                    style={styles.input}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Fonts */}
                <div style={styles.settingBlock}>
                    <div style={styles.label}>
                        <Type size={18} style={{ color: 'var(--color-text-muted)' }} />
                        Font Family
                    </div>
                    <p style={styles.description}>Choose a typeface for your newsletter</p>
                    <ToggleSwitch
                        checked={config.fonts?.mode === 'auto'}
                        onChange={(checked) => setConfig({ ...config, fonts: checked ? { mode: 'auto' } : { mode: 'manual', value: 'sans' } })}
                        label="Auto (AI Decides)"
                        description="Selects based on brand style"
                    />
                    {config.fonts?.mode === 'manual' && (
                        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' as const }}>
                            {fontOptions.map(font => {
                                const selected = config.fonts?.mode === 'manual' && config.fonts.value === font.value;
                                return (
                                    <button
                                        key={font.value}
                                        onClick={() => setConfig({ ...config, fonts: { mode: 'manual', value: font.value as any } })}
                                        style={styles.fontCard(selected)}
                                    >
                                        <div style={{ fontFamily: font.fontFamily, fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--color-text-primary)' }}>
                                            Aa
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                                            {font.label}
                                            {selected && <Check size={16} style={{ color: 'var(--color-accent-custom)', marginLeft: 'auto' }} />}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Colors */}
                <div style={{ ...styles.settingBlock, ...styles.settingBlockLast }}>
                    <div style={styles.label}>
                        <Palette size={18} style={{ color: 'var(--color-text-muted)' }} />
                        Color Palette
                    </div>
                    <p style={styles.description}>Choose a color scheme for newsletters</p>
                    <ToggleSwitch
                        checked={config.colors.mode === 'random'}
                        onChange={(checked) => setConfig({ ...config, colors: { ...config.colors, mode: checked ? 'random' : 'manual' } })}
                        label="Auto (AI Decides)"
                        description="Generates unique palettes"
                    />
                    {config.colors.mode === 'manual' && (
                        <div style={{ marginTop: '1rem' }}>
                            <div style={{ ...styles.colorPreview, background: `linear-gradient(135deg, ${config.colors.primary} 0%, ${config.colors.secondary} 100%)` }} />
                            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' as const, marginBottom: '1rem' }}>
                                {colorPresets.map(preset => (
                                    <button
                                        key={preset.name}
                                        onClick={() => setConfig({ ...config, colors: { ...config.colors, primary: preset.primary, secondary: preset.secondary, preset: preset.name } })}
                                        style={{
                                            padding: '0.625rem 1rem',
                                            background: config.colors.preset === preset.name ? 'var(--color-accent-glow)' : 'var(--color-bg-secondary)',
                                            border: config.colors.preset === preset.name ? '2px solid var(--color-accent-custom)' : '1px solid var(--color-border-custom)',
                                            borderRadius: '10px',
                                            cursor: 'pointer',
                                            fontSize: '0.8125rem',
                                            fontWeight: 600,
                                            color: 'var(--color-text-primary)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                        }}
                                    >
                                        <div style={{ width: 20, height: 20, background: `linear-gradient(135deg, ${preset.primary}, ${preset.secondary})`, borderRadius: '6px' }} />
                                        {preset.name}
                                    </button>
                                ))}
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: '0.8125rem', fontWeight: 500, marginBottom: '0.5rem', display: 'block', color: 'var(--color-text-secondary)' }}>Primary</label>
                                    <input type="color" value={config.colors.primary} onChange={(e) => setConfig({ ...config, colors: { ...config.colors, primary: e.target.value, preset: undefined } })} style={{ width: '100%', height: '44px', cursor: 'pointer', border: '1px solid var(--color-border-custom)', borderRadius: '10px' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: '0.8125rem', fontWeight: 500, marginBottom: '0.5rem', display: 'block', color: 'var(--color-text-secondary)' }}>Secondary</label>
                                    <input type="color" value={config.colors.secondary} onChange={(e) => setConfig({ ...config, colors: { ...config.colors, secondary: e.target.value, preset: undefined } })} style={{ width: '100%', height: '44px', cursor: 'pointer', border: '1px solid var(--color-border-custom)', borderRadius: '10px' }} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', paddingTop: '1rem' }}>
                <button onClick={() => router.push(`/dashboard/brands/${brand.id}`)} style={styles.buttonSecondary} disabled={isPending}>
                    <X size={18} /> Cancel
                </button>
                <button onClick={handleSave} style={styles.buttonPrimary} disabled={isPending}>
                    {isPending ? 'Saving...' : (<><Save size={18} /> Save Settings</>)}
                </button>
            </div>
        </div>
    );
}
