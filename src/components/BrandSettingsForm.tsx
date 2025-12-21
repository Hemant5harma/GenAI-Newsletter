'use client'

import { useState, useTransition } from "react";
import { updateBrandSettings } from "@/app/actions";
import { useRouter } from "next/navigation";
import ToggleSwitch from "./ui/ToggleSwitch";
import {
    Image,
    FolderOpen,
    FileText,
    Tag,
    Palette,
    Save,
    X,
    Plus,
    Sparkles
} from "lucide-react";

interface GenerationSettings {
    images: { mode: 'random' | 'manual'; urls: string[] };
    linksCount: { mode: 'random' | 'manual'; count: number };
    categories: { mode: 'random' | 'manual'; list: string[] };
    content: { mode: 'random' | 'manual'; text: string };
    keywords: string[];
    colors: { mode: 'random' | 'manual'; primary: string; secondary: string; preset?: string };
    contentSize: 'small' | 'medium' | 'large';
    editorMode: 'html' | 'blocks';
}

const colorPresets = [
    { name: 'Modern Dark', primary: '#1a1a2e', secondary: '#6366f1' },
    { name: 'Ocean Blue', primary: '#0077b6', secondary: '#00b4d8' },
    { name: 'Sunset', primary: '#ff6b6b', secondary: '#feca57' },
    { name: 'Forest', primary: '#2d6a4f', secondary: '#40916c' },
    { name: 'Minimal', primary: '#1a1a1a', secondary: '#666666' },
];

const defaultSettings: GenerationSettings = {
    images: { mode: 'random', urls: ['', '', ''] },
    linksCount: { mode: 'random', count: 4 },
    categories: { mode: 'random', list: [] },
    content: { mode: 'random', text: '' },
    keywords: [],
    colors: { mode: 'random', primary: '#1a1a2e', secondary: '#6366f1' },
    contentSize: 'medium',
    editorMode: 'html',
};

export default function BrandSettingsForm({ brand }: { brand: any }) {
    const brandSettings = brand.settings ? (brand.settings as GenerationSettings) : defaultSettings;
    const [config, setConfig] = useState<GenerationSettings>(brandSettings);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const [keywordInput, setKeywordInput] = useState('');
    const [categoryInput, setCategoryInput] = useState('');

    const addKeyword = () => {
        if (keywordInput.trim() && !config.keywords.includes(keywordInput.trim())) {
            setConfig({ ...config, keywords: [...config.keywords, keywordInput.trim()] });
            setKeywordInput('');
        }
    };

    const removeKeyword = (kw: string) => {
        setConfig({ ...config, keywords: config.keywords.filter(k => k !== kw) });
    };

    const addCategory = () => {
        if (categoryInput.trim() && !config.categories.list.includes(categoryInput.trim())) {
            setConfig({
                ...config,
                categories: { ...config.categories, list: [...config.categories.list, categoryInput.trim()] }
            });
            setCategoryInput('');
        }
    };

    const removeCategory = (cat: string) => {
        setConfig({
            ...config,
            categories: { ...config.categories, list: config.categories.list.filter(c => c !== cat) }
        });
    };

    const updateImageUrl = (index: number, url: string) => {
        const newUrls = [...config.images.urls];
        newUrls[index] = url;
        setConfig({ ...config, images: { ...config.images, urls: newUrls } });
    };

    const handleSave = () => {
        startTransition(async () => {
            await updateBrandSettings(brand.id, config);
            router.push(`/dashboard/brands/${brand.id}`);
        });
    };

    const SectionHeader = ({ icon: Icon, title, description }: { icon: any; title: string; description: string }) => (
        <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
            marginBottom: '1rem'
        }}>
            <div style={{
                width: '40px',
                height: '40px',
                background: 'var(--gradient-surface)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
            }}>
                <Icon size={20} style={{ color: 'var(--color-accent)' }} />
            </div>
            <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>{title}</h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', margin: 0 }}>{description}</p>
            </div>
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Images */}
            <section className="card" style={{ padding: '1.5rem' }}>
                <SectionHeader
                    icon={Image}
                    title="Newsletter Images"
                    description="Set default images or let AI choose from Unsplash"
                />
                <div style={{ marginBottom: '1rem' }}>
                    <ToggleSwitch
                        checked={config.images.mode === 'random'}
                        onChange={(checked) => setConfig({ ...config, images: { ...config.images, mode: checked ? 'random' : 'manual' } })}
                        label="Let AI Decide"
                        description="AI will select relevant images from Unsplash"
                    />
                </div>
                {config.images.mode === 'manual' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingLeft: '3.25rem' }}>
                        {config.images.urls.map((url, i) => (
                            <input
                                key={i}
                                className="input"
                                placeholder={`Image ${i + 1} URL (Hero, Block 1, Block 2)`}
                                value={url}
                                onChange={(e) => updateImageUrl(i, e.target.value)}
                            />
                        ))}
                    </div>
                )}
            </section>


            {/* Categories */}
            <section className="card" style={{ padding: '1.5rem' }}>
                <SectionHeader
                    icon={FolderOpen}
                    title="Content Categories"
                    description="Focus areas for newsletter content"
                />
                <div style={{ marginBottom: '1rem' }}>
                    <ToggleSwitch
                        checked={config.categories.mode === 'random'}
                        onChange={(checked) => setConfig({ ...config, categories: { ...config.categories, mode: checked ? 'random' : 'manual' } })}
                        label="Let AI Decide"
                        description="AI will choose categories based on your brand"
                    />
                </div>
                {config.categories.mode === 'manual' && (
                    <div style={{ paddingLeft: '3.25rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                            <input
                                className="input"
                                placeholder="Add category (e.g., 'New Arrivals')"
                                value={categoryInput}
                                onChange={(e) => setCategoryInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCategory())}
                                style={{ flex: 1 }}
                            />
                            <button onClick={addCategory} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <Plus size={16} /> Add
                            </button>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {config.categories.list.map(cat => (
                                <span
                                    key={cat}
                                    onClick={() => removeCategory(cat)}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        padding: '0.375rem 0.75rem',
                                        background: 'var(--color-accent-glow)',
                                        color: 'var(--color-accent)',
                                        borderRadius: 'var(--radius-full)',
                                        fontSize: '0.8125rem',
                                        fontWeight: 500,
                                        cursor: 'pointer',
                                        transition: 'all var(--transition-fast)'
                                    }}
                                >
                                    {cat}
                                    <X size={14} />
                                </span>
                            ))}
                            {config.categories.list.length === 0 && (
                                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8125rem' }}>
                                    No categories added yet
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </section>

            {/* Content */}
            <section className="card" style={{ padding: '1.5rem' }}>
                <SectionHeader
                    icon={FileText}
                    title="Newsletter Topic"
                    description="Provide a specific topic or let AI choose based on trends"
                />
                <div style={{ marginBottom: '1rem' }}>
                    <ToggleSwitch
                        checked={config.content.mode === 'random'}
                        onChange={(checked) => setConfig({ ...config, content: { ...config.content, mode: checked ? 'random' : 'manual' } })}
                        label="Let AI Decide"
                        description="AI will find trending topics for your audience"
                    />
                </div>
                {config.content.mode === 'manual' && (
                    <div style={{ paddingLeft: '3.25rem' }}>
                        <textarea
                            className="input"
                            placeholder="E.g., 'The future of AI agents' or 'Weekly fashion roundup'"
                            rows={4}
                            value={config.content.text}
                            onChange={(e) => setConfig({ ...config, content: { ...config.content, text: e.target.value } })}
                            style={{ resize: 'vertical', minHeight: '100px' }}
                        />
                    </div>
                )}
            </section>

            {/* Keywords - only show when content is manual */}
            {config.content.mode === 'manual' && (
                <section className="card" style={{ padding: '1.5rem' }}>
                    <SectionHeader
                        icon={Tag}
                        title="Keywords"
                        description="Keywords to emphasize in generated content"
                    />
                    <div style={{ paddingLeft: '3.25rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                            <input
                                className="input"
                                placeholder="Add keyword"
                                value={keywordInput}
                                onChange={(e) => setKeywordInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                                style={{ flex: 1 }}
                            />
                            <button onClick={addKeyword} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <Plus size={16} /> Add
                            </button>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {config.keywords.map(kw => (
                                <span
                                    key={kw}
                                    onClick={() => removeKeyword(kw)}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        padding: '0.375rem 0.75rem',
                                        background: 'var(--color-bg-tertiary)',
                                        color: 'var(--color-text-secondary)',
                                        borderRadius: 'var(--radius-full)',
                                        fontSize: '0.8125rem',
                                        fontWeight: 500,
                                        border: '1px solid var(--color-border)',
                                        cursor: 'pointer',
                                        transition: 'all var(--transition-fast)'
                                    }}
                                >
                                    {kw}
                                    <X size={14} />
                                </span>
                            ))}
                            {config.keywords.length === 0 && (
                                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8125rem' }}>
                                    No keywords added yet
                                </span>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* Colors */}
            <section className="card" style={{ padding: '1.5rem' }}>
                <SectionHeader
                    icon={Palette}
                    title="Colors & Design"
                    description="Choose a color scheme for newsletters"
                />
                <div style={{ marginBottom: '1rem' }}>
                    <ToggleSwitch
                        checked={config.colors.mode === 'random'}
                        onChange={(checked) => setConfig({ ...config, colors: { ...config.colors, mode: checked ? 'random' : 'manual' } })}
                        label="Let AI Decide"
                        description="AI will generate unique color palettes each time"
                    />
                </div>
                {config.colors.mode === 'manual' && (
                    <div style={{ paddingLeft: '3.25rem' }}>
                        {/* Color Preview */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            padding: '1rem',
                            background: 'var(--color-bg-tertiary)',
                            borderRadius: 'var(--radius-md)',
                            marginBottom: '1rem'
                        }}>
                            <div style={{
                                width: '80px',
                                height: '50px',
                                background: `linear-gradient(135deg, ${config.colors.primary} 0%, ${config.colors.secondary} 100%)`,
                                borderRadius: 'var(--radius-sm)',
                                boxShadow: 'var(--shadow-sm)'
                            }} />
                            <div>
                                <div style={{ fontSize: '0.8125rem', fontWeight: 500, marginBottom: '0.25rem' }}>Current Palette</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                                    {config.colors.primary} → {config.colors.secondary}
                                </div>
                            </div>
                        </div>

                        {/* Presets */}
                        <div style={{ marginBottom: '1rem' }}>
                            <div style={{ fontSize: '0.8125rem', fontWeight: 500, marginBottom: '0.5rem' }}>Quick Presets</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {colorPresets.map(preset => (
                                    <button
                                        key={preset.name}
                                        onClick={() => setConfig({
                                            ...config,
                                            colors: { ...config.colors, primary: preset.primary, secondary: preset.secondary, preset: preset.name }
                                        })}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            padding: '0.5rem 0.75rem',
                                            background: config.colors.preset === preset.name ? 'var(--color-accent-glow)' : 'var(--color-bg-primary)',
                                            border: config.colors.preset === preset.name ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                                            borderRadius: 'var(--radius-md)',
                                            cursor: 'pointer',
                                            fontSize: '0.8125rem',
                                            fontWeight: 500,
                                            transition: 'all var(--transition-fast)'
                                        }}
                                    >
                                        <div style={{ display: 'flex' }}>
                                            <div style={{ width: 16, height: 16, background: preset.primary, borderRadius: '4px 0 0 4px' }} />
                                            <div style={{ width: 16, height: 16, background: preset.secondary, borderRadius: '0 4px 4px 0' }} />
                                        </div>
                                        {preset.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Custom Colors */}
                        <div>
                            <div style={{ fontSize: '0.8125rem', fontWeight: 500, marginBottom: '0.5rem' }}>Custom Colors</div>
                            <div style={{ display: 'flex', gap: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <input
                                        type="color"
                                        value={config.colors.primary}
                                        onChange={(e) => setConfig({ ...config, colors: { ...config.colors, primary: e.target.value, preset: undefined } })}
                                        style={{ width: 40, height: 32, cursor: 'pointer', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: 0 }}
                                    />
                                    <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>Primary</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <input
                                        type="color"
                                        value={config.colors.secondary}
                                        onChange={(e) => setConfig({ ...config, colors: { ...config.colors, secondary: e.target.value, preset: undefined } })}
                                        style={{ width: 40, height: 32, cursor: 'pointer', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: 0 }}
                                    />
                                    <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>Secondary</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </section>


            {/* Save Button */}
            <div style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'flex-end',
                paddingTop: '1rem',
                borderTop: '1px solid var(--color-border)'
            }}>
                <button
                    onClick={() => router.push(`/dashboard/brands/${brand.id}`)}
                    className="btn btn-secondary"
                    disabled={isPending}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <X size={16} />
                    Cancel
                </button>
                <button
                    onClick={handleSave}
                    className="btn btn-primary"
                    disabled={isPending}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    {isPending ? (
                        <>
                            <Sparkles size={16} className="animate-pulse" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save size={16} />
                            Save Settings
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
