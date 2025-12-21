'use client'

import { useState, useTransition } from "react";
import { saveAiSettings } from "./actions";
import { Settings, Key, Cpu, Save, Check, AlertCircle } from "lucide-react";

interface AiSettings {
    id: string;
    googleApiKey: string | null;
    model: string;
}

const AVAILABLE_MODELS = [
    { value: 'gemini-2.0-flash-exp', label: 'Gemini 2.0 Flash (Recommended)' },
    { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash' },
    { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
];

export default function SettingsForm({ initialSettings }: { initialSettings: AiSettings | null }) {
    const [apiKey, setApiKey] = useState(initialSettings?.googleApiKey || '');
    const [model, setModel] = useState(initialSettings?.model || 'gemini-2.0-flash-exp');
    const [showKey, setShowKey] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleSave = () => {
        setStatus('idle');
        startTransition(async () => {
            try {
                await saveAiSettings({ googleApiKey: apiKey, model });
                setStatus('success');
                setTimeout(() => setStatus('idle'), 3000);
            } catch {
                setStatus('error');
            }
        });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* API Key Section */}
            <section className="card" style={{ padding: '1.5rem' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '1rem'
                }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        background: 'var(--gradient-primary)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Key size={20} color="white" />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Google API Key</h2>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                            Required for AI-powered newsletter generation
                        </p>
                    </div>
                </div>

                <div style={{ position: 'relative' }}>
                    <input
                        type={showKey ? 'text' : 'password'}
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Enter your Google API Key"
                        className="input"
                        style={{ paddingRight: '5rem' }}
                    />
                    <button
                        onClick={() => setShowKey(!showKey)}
                        className="btn btn-ghost btn-sm"
                        style={{
                            position: 'absolute',
                            right: '8px',
                            top: '50%',
                            transform: 'translateY(-50%)'
                        }}
                    >
                        {showKey ? 'Hide' : 'Show'}
                    </button>
                </div>

                <p style={{
                    fontSize: '0.75rem',
                    color: 'var(--color-text-muted)',
                    marginTop: '0.5rem'
                }}>
                    Get your API key from{' '}
                    <a
                        href="https://makersuite.google.com/app/apikey"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'var(--color-accent)' }}
                    >
                        Google AI Studio
                    </a>
                </p>
            </section>

            {/* Model Selection */}
            <section className="card" style={{ padding: '1.5rem' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '1rem'
                }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        background: 'var(--gradient-accent)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Cpu size={20} color="white" />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>AI Model</h2>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                            Choose the model for content generation
                        </p>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {AVAILABLE_MODELS.map((m) => (
                        <label
                            key={m.value}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.75rem 1rem',
                                background: model === m.value ? 'var(--color-accent-glow)' : 'var(--color-bg-tertiary)',
                                border: model === m.value ? '1px solid var(--color-accent)' : '1px solid var(--color-border)',
                                borderRadius: 'var(--radius-md)',
                                cursor: 'pointer',
                                transition: 'all var(--transition-fast)'
                            }}
                        >
                            <input
                                type="radio"
                                name="model"
                                value={m.value}
                                checked={model === m.value}
                                onChange={(e) => setModel(e.target.value)}
                                style={{ accentColor: 'var(--color-accent)' }}
                            />
                            <span style={{ fontWeight: model === m.value ? 600 : 400 }}>
                                {m.label}
                            </span>
                        </label>
                    ))}
                </div>
            </section>

            {/* Save Button */}
            <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '1rem',
                alignItems: 'center'
            }}>
                {status === 'success' && (
                    <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: 'var(--color-success)',
                        fontSize: '0.875rem'
                    }}>
                        <Check size={16} /> Settings saved!
                    </span>
                )}
                {status === 'error' && (
                    <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: 'var(--color-error)',
                        fontSize: '0.875rem'
                    }}>
                        <AlertCircle size={16} /> Failed to save
                    </span>
                )}
                <button
                    onClick={handleSave}
                    disabled={isPending || !apiKey}
                    className="btn btn-primary"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                >
                    <Save size={16} />
                    {isPending ? 'Saving...' : 'Save Settings'}
                </button>
            </div>

            {/* Info Box */}
            <div style={{
                padding: '1rem',
                background: 'var(--color-bg-tertiary)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem'
                }}>
                    <Settings size={20} style={{ color: 'var(--color-text-muted)', marginTop: '2px' }} />
                    <div>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                            <strong>Note:</strong> Your API key is stored securely and used only for generating newsletters.
                            If no key is configured here, the system will fall back to the key in your <code>.env</code> file.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
