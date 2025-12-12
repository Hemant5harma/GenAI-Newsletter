'use client'

import { useState, useTransition } from "react";
import { updateBrandSettings } from "@/app/actions";
import { useRouter } from "next/navigation";

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

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Images */}
            <section className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ fontWeight: 600, fontSize: '1.125rem' }}>📷 Images</span>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            checked={config.images.mode === 'random'}
                            onChange={(e) => setConfig({ ...config, images: { ...config.images, mode: e.target.checked ? 'random' : 'manual' } })}
                        />
                        <span className="text-sm">AI Decides</span>
                    </label>
                </div>
                <p className="text-sm text-muted" style={{ marginBottom: '1rem' }}>
                    Set default images or let AI choose from Unsplash
                </p>
                {config.images.mode === 'manual' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
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

            {/* Links Count */}
            <section className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ fontWeight: 600, fontSize: '1.125rem' }}>🔗 Links Count</span>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            checked={config.linksCount.mode === 'random'}
                            onChange={(e) => setConfig({ ...config, linksCount: { ...config.linksCount, mode: e.target.checked ? 'random' : 'manual' } })}
                        />
                        <span className="text-sm">AI Decides</span>
                    </label>
                </div>
                <p className="text-sm text-muted" style={{ marginBottom: '1rem' }}>
                    Number of content blocks per newsletter
                </p>
                {config.linksCount.mode === 'manual' && (
                    <input
                        type="number"
                        className="input"
                        min={1}
                        max={10}
                        value={config.linksCount.count}
                        onChange={(e) => setConfig({ ...config, linksCount: { ...config.linksCount, count: parseInt(e.target.value) || 4 } })}
                    />
                )}
            </section>

            {/* Categories */}
            <section className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ fontWeight: 600, fontSize: '1.125rem' }}>📂 Categories</span>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            checked={config.categories.mode === 'random'}
                            onChange={(e) => setConfig({ ...config, categories: { ...config.categories, mode: e.target.checked ? 'random' : 'manual' } })}
                        />
                        <span className="text-sm">AI Decides</span>
                    </label>
                </div>
                <p className="text-sm text-muted" style={{ marginBottom: '1rem' }}>
                    Content categories to focus on
                </p>
                {config.categories.mode === 'manual' && (
                    <>
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <input
                                className="input"
                                placeholder="Add category (e.g., 'New Arrivals')"
                                value={categoryInput}
                                onChange={(e) => setCategoryInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCategory())}
                            />
                            <button onClick={addCategory} className="btn btn-secondary">+</button>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {config.categories.list.map(cat => (
                                <span key={cat} className="badge badge-accent" style={{ cursor: 'pointer' }} onClick={() => removeCategory(cat)}>
                                    {cat} ×
                                </span>
                            ))}
                        </div>
                    </>
                )}
            </section>

            {/* Content */}
            <section className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ fontWeight: 600, fontSize: '1.125rem' }}>📝 Content Source</span>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            checked={config.content.mode === 'random'}
                            onChange={(e) => setConfig({ ...config, content: { ...config.content, mode: e.target.checked ? 'random' : 'manual' } })}
                        />
                        <span className="text-sm">AI Writes</span>
                    </label>
                </div>
                <p className="text-sm text-muted" style={{ marginBottom: '1rem' }}>
                    Provide base content or let AI generate from scratch
                </p>
                {config.content.mode === 'manual' && (
                    <textarea
                        className="textarea"
                        placeholder="Enter your content template. AI will use this as the primary source..."
                        rows={4}
                        value={config.content.text}
                        onChange={(e) => setConfig({ ...config, content: { ...config.content, text: e.target.value } })}
                    />
                )}
            </section>

            {/* Keywords - only show when content is manual */}
            {config.content.mode === 'manual' && (
                <section className="card" style={{ padding: '1.5rem' }}>
                    <div style={{ marginBottom: '1rem' }}>
                        <span style={{ fontWeight: 600, fontSize: '1.125rem' }}>🏷️ Keywords</span>
                        <span className="text-sm text-muted" style={{ marginLeft: '0.5rem' }}>(for content guidance)</span>
                    </div>
                    <p className="text-sm text-muted" style={{ marginBottom: '1rem' }}>
                        Keywords to emphasize in generated content
                    </p>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <input
                            className="input"
                            placeholder="Add keyword"
                            value={keywordInput}
                            onChange={(e) => setKeywordInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                        />
                        <button onClick={addKeyword} className="btn btn-secondary">+</button>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {config.keywords.map(kw => (
                            <span key={kw} className="badge badge-default" style={{ cursor: 'pointer' }} onClick={() => removeKeyword(kw)}>
                                {kw} ×
                            </span>
                        ))}
                    </div>
                </section>
            )}

            {/* Colors */}
            <section className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ fontWeight: 600, fontSize: '1.125rem' }}>🎨 Colors & Design</span>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            checked={config.colors.mode === 'random'}
                            onChange={(e) => setConfig({ ...config, colors: { ...config.colors, mode: e.target.checked ? 'random' : 'manual' } })}
                        />
                        <span className="text-sm">AI Decides</span>
                    </label>
                </div>
                <p className="text-sm text-muted" style={{ marginBottom: '1rem' }}>
                    Choose a color scheme for newsletters
                </p>
                {config.colors.mode === 'manual' && (
                    <>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                            {colorPresets.map(preset => (
                                <button
                                    key={preset.name}
                                    onClick={() => setConfig({
                                        ...config,
                                        colors: { ...config.colors, primary: preset.primary, secondary: preset.secondary, preset: preset.name }
                                    })}
                                    className="btn btn-ghost"
                                    style={{
                                        border: config.colors.preset === preset.name ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
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
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div>
                                <label className="label">Primary Color</label>
                                <input
                                    type="color"
                                    value={config.colors.primary}
                                    onChange={(e) => setConfig({ ...config, colors: { ...config.colors, primary: e.target.value, preset: undefined } })}
                                    style={{ width: 60, height: 40, cursor: 'pointer', border: 'none', background: 'transparent' }}
                                />
                            </div>
                            <div>
                                <label className="label">Secondary Color</label>
                                <input
                                    type="color"
                                    value={config.colors.secondary}
                                    onChange={(e) => setConfig({ ...config, colors: { ...config.colors, secondary: e.target.value, preset: undefined } })}
                                    style={{ width: 60, height: 40, cursor: 'pointer', border: 'none', background: 'transparent' }}
                                />
                            </div>
                        </div>
                    </>
                )}
            </section>

            {/* Editor Mode - Commented out for now
            <section className="card" style={{ padding: '1.5rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                    <span style={{ fontWeight: 600, fontSize: '1.125rem' }}>✏️ Editor Mode</span>
                </div>
                <p className="text-sm text-muted" style={{ marginBottom: '1rem' }}>
                    Choose how you want to edit newsletters after generation
                </p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    {[
                        { value: 'html', label: 'HTML Editor', icon: '</>', desc: 'Edit raw HTML directly. Full control over design.' },
                        { value: 'blocks', label: 'Block Editor', icon: '🧱', desc: 'Edit structured content blocks. Easier for non-technical users.' }
                    ].map(option => (
                        <label key={option.value} style={{
                            display: 'flex',
                            flexDirection: 'column',
                            flex: 1,
                            padding: '1rem',
                            border: config.editorMode === option.value ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-md)',
                            cursor: 'pointer',
                            background: config.editorMode === option.value ? 'var(--color-bg-tertiary)' : 'transparent',
                            transition: 'all 0.15s'
                        }}>
                            <input
                                type="radio"
                                name="editorMode"
                                value={option.value}
                                checked={config.editorMode === option.value}
                                onChange={(e) => setConfig({ ...config, editorMode: e.target.value as 'html' | 'blocks' })}
                                style={{ display: 'none' }}
                            />
                            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{option.icon}</div>
                            <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{option.label}</div>
                            <div className="text-sm text-muted">{option.desc}</div>
                        </label>
                    ))}
                </div>
            </section>
            */}

            {/* Content Size */}
            <section className="card" style={{ padding: '1.5rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                    <span style={{ fontWeight: 600, fontSize: '1.125rem' }}>📏 Content Size</span>
                </div>
                <p className="text-sm text-muted" style={{ marginBottom: '1rem' }}>
                    Control how much content AI generates for each newsletter
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {[
                        { value: 'small', label: 'Small', desc: 'Brief & scannable (2-3 short paragraphs per section)' },
                        { value: 'medium', label: 'Medium', desc: 'Standard depth (3-5 paragraphs, recommended)' },
                        { value: 'large', label: 'Large', desc: 'Comprehensive & detailed (5-7+ paragraphs)' }
                    ].map(option => (
                        <label key={option.value} style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '0.75rem',
                            padding: '0.75rem',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-md)',
                            cursor: 'pointer',
                            background: config.contentSize === option.value ? 'var(--color-bg-tertiary)' : 'transparent',
                            transition: 'all 0.15s'
                        }}>
                            <input
                                type="radio"
                                name="contentSize"
                                value={option.value}
                                checked={config.contentSize === option.value}
                                onChange={(e) => setConfig({ ...config, contentSize: e.target.value as 'small' | 'medium' | 'large' })}
                                style={{ marginTop: '0.25rem' }}
                            />
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 500, marginBottom: '0.25rem' }}>{option.label}</div>
                                <div className="text-sm text-muted">{option.desc}</div>
                            </div>
                        </label>
                    ))}
                </div>
            </section>

            {/* Format Info */}
            <section style={{ padding: '1.5rem', background: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--color-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 600, fontSize: '1.125rem' }}>📐 Format & Layout</span>
                    <span className="badge badge-accent">AI Decides</span>
                </div>
                <p className="text-sm text-muted">
                    Newsletter layout is always optimized by AI for best engagement based on your settings
                </p>
            </section>

            {/* Save Button */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
                <button
                    onClick={() => router.push(`/dashboard/brands/${brand.id}`)}
                    className="btn btn-secondary"
                    disabled={isPending}
                >
                    Cancel
                </button>
                <button
                    onClick={handleSave}
                    className="btn btn-primary"
                    disabled={isPending}
                >
                    {isPending ? 'Saving...' : '💾 Save Settings'}
                </button>
            </div>
        </div>
    );
}
