'use client'

import { useState, useTransition } from "react";
import { saveAiSettings } from "./actions";
import { Key, Cpu, Save, Check, AlertCircle, Sparkles, Zap, Brain, Info, Eye, EyeOff, ExternalLink } from "lucide-react";

interface AiSettings {
    id: string;
    googleApiKey: string | null;
    model: string;
}

interface ModelOption {
    value: string;
    label: string;
    description: string;
    badge?: string;
    badgeColor?: string;
    icon: React.ReactNode;
}

const AVAILABLE_MODELS: ModelOption[] = [
    {
        value: 'gemini-3-pro-preview',
        label: 'Gemini 3 Pro',
        description: 'Most capable model for complex tasks, advanced reasoning & coding',
        badge: 'NEW',
        badgeColor: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
        icon: <Brain size={20} />
    },
    {
        value: 'gemini-3-flash-preview',
        label: 'Gemini 3 Flash',
        description: 'Fast & intelligent for multimodal understanding',
        badge: 'Recommended',
        badgeColor: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        icon: <Zap size={20} />
    },
    {
        value: 'gemini-2.0-flash-exp',
        label: 'Gemini 2.0 Flash',
        description: 'Balanced performance for general-purpose tasks',
        icon: <Sparkles size={20} />
    },
    {
        value: 'gemini-1.5-pro',
        label: 'Gemini 1.5 Pro',
        description: 'High capability with large context window',
        icon: <Cpu size={20} />
    },
];

export default function SettingsForm({ initialSettings }: { initialSettings: AiSettings | null }) {
    const [apiKey, setApiKey] = useState(initialSettings?.googleApiKey || '');
    const [model, setModel] = useState(initialSettings?.model || 'gemini-3-flash-preview');
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
        <div className="settings-container">
            <style jsx>{`
                .settings-container {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                    max-width: 720px;
                    margin: 0 auto;
                }
                
                .settings-card {
                    background: var(--glass-bg);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border: 1px solid var(--glass-border);
                    border-radius: 16px;
                    padding: 1.5rem;
                    transition: all 0.3s ease;
                    box-shadow: var(--shadow-md);
                }
                
                .settings-card:hover {
                    border-color: var(--color-border-hover);
                    box-shadow: var(--shadow-lg);
                }
                
                .card-header {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-bottom: 1.25rem;
                }
                
                .icon-wrapper {
                    width: 48px;
                    height: 48px;
                    background: var(--gradient-primary);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 12px var(--color-accent-glow);
                }
                
                .icon-wrapper svg {
                    color: white;
                }
                
                .card-title {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: var(--color-text-primary);
                    margin-bottom: 0.25rem;
                }
                
                .card-description {
                    font-size: 0.875rem;
                    color: var(--color-text-muted);
                }
                
                .input-wrapper {
                    position: relative;
                }
                
                .api-input {
                    width: 100%;
                    padding: 0.875rem 1rem;
                    padding-right: 4.5rem;
                    background: var(--color-bg-tertiary);
                    border: 1px solid var(--color-border-custom);
                    border-radius: 10px;
                    font-size: 0.9375rem;
                    color: var(--color-text-primary);
                    transition: all 0.2s ease;
                    outline: none;
                }
                
                .api-input:focus {
                    border-color: var(--color-accent-custom);
                    box-shadow: 0 0 0 3px var(--color-accent-glow);
                }
                
                .api-input::placeholder {
                    color: var(--color-text-muted);
                }
                
                .toggle-visibility {
                    position: absolute;
                    right: 8px;
                    top: 50%;
                    transform: translateY(-50%);
                    padding: 0.5rem 0.75rem;
                    background: transparent;
                    border: none;
                    color: var(--color-text-muted);
                    cursor: pointer;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                    transition: all 0.2s ease;
                }
                
                .toggle-visibility:hover {
                    background: var(--color-bg-elevated);
                    color: var(--color-text-primary);
                }
                
                .api-hint {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-top: 0.75rem;
                    font-size: 0.8125rem;
                    color: var(--color-text-muted);
                }
                
                .api-hint a {
                    color: var(--color-accent-custom);
                    text-decoration: none;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.25rem;
                    transition: color 0.2s ease;
                }
                
                .api-hint a:hover {
                    color: var(--color-accent-hover);
                }
                
                .model-grid {
                    display: grid;
                    gap: 0.75rem;
                }
                
                .model-option {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem 1.25rem;
                    background: var(--color-bg-tertiary);
                    border: 2px solid transparent;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.25s ease;
                    position: relative;
                    overflow: hidden;
                }
                
                .model-option::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: var(--gradient-surface);
                    opacity: 0;
                    transition: opacity 0.25s ease;
                }
                
                .model-option:hover {
                    background: var(--color-bg-elevated);
                    transform: translateY(-2px);
                    box-shadow: var(--shadow-md);
                }
                
                .model-option.selected {
                    border-color: var(--color-accent-custom);
                    background: var(--color-accent-glow);
                    box-shadow: 0 0 20px var(--color-accent-glow);
                }
                
                .model-option.selected::before {
                    opacity: 1;
                }
                
                .model-icon-wrapper {
                    width: 44px;
                    height: 44px;
                    background: var(--color-bg-elevated);
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--color-text-muted);
                    transition: all 0.25s ease;
                    z-index: 1;
                }
                
                .model-option.selected .model-icon-wrapper {
                    background: var(--gradient-primary);
                    color: white;
                    box-shadow: 0 4px 12px var(--color-accent-glow);
                }
                
                .model-content {
                    flex: 1;
                    z-index: 1;
                }
                
                .model-header {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-bottom: 0.25rem;
                }
                
                .model-name {
                    font-size: 1rem;
                    font-weight: 600;
                    color: var(--color-text-primary);
                }
                
                .model-badge {
                    padding: 0.125rem 0.5rem;
                    font-size: 0.6875rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    color: white;
                    border-radius: 4px;
                }
                
                .model-description {
                    font-size: 0.8125rem;
                    color: var(--color-text-muted);
                    line-height: 1.4;
                }
                
                .radio-circle {
                    width: 22px;
                    height: 22px;
                    border: 2px solid var(--color-border-custom);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.25s ease;
                    flex-shrink: 0;
                    z-index: 1;
                }
                
                .model-option.selected .radio-circle {
                    border-color: var(--color-accent-custom);
                    background: var(--color-accent-custom);
                }
                
                .radio-inner {
                    width: 8px;
                    height: 8px;
                    background: white;
                    border-radius: 50%;
                    transform: scale(0);
                    transition: transform 0.2s ease;
                }
                
                .model-option.selected .radio-inner {
                    transform: scale(1);
                }
                
                .actions-bar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem 1.5rem;
                    background: var(--glass-bg);
                    backdrop-filter: blur(20px);
                    border: 1px solid var(--glass-border);
                    border-radius: 12px;
                    box-shadow: var(--shadow-md);
                }
                
                .status-indicator {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.875rem;
                    font-weight: 500;
                }
                
                .status-success {
                    color: var(--color-success);
                }
                
                .status-error {
                    color: var(--color-error);
                }
                
                .save-button {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.75rem 1.5rem;
                    background: var(--gradient-primary);
                    border: none;
                    border-radius: 10px;
                    font-size: 0.9375rem;
                    font-weight: 600;
                    color: white;
                    cursor: pointer;
                    transition: all 0.25s ease;
                    box-shadow: 0 4px 16px var(--color-accent-glow);
                }
                
                .save-button:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 24px var(--color-accent-glow);
                }
                
                .save-button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    transform: none;
                }
                
                .info-box {
                    display: flex;
                    gap: 0.75rem;
                    padding: 1rem 1.25rem;
                    background: var(--color-bg-tertiary);
                    border: 1px solid var(--color-border-custom);
                    border-radius: 10px;
                    font-size: 0.8125rem;
                    color: var(--color-text-secondary);
                    line-height: 1.5;
                }
                
                .info-box svg {
                    flex-shrink: 0;
                    color: var(--color-accent-custom);
                    margin-top: 2px;
                }
                
                .info-box code {
                    background: var(--color-bg-elevated);
                    padding: 0.125rem 0.375rem;
                    border-radius: 4px;
                    font-family: var(--font-mono);
                    font-size: 0.75rem;
                }
                
                input[type="radio"] {
                    display: none;
                }
            `}</style>

            {/* API Key Section */}
            <section className="settings-card">
                <div className="card-header">
                    <div className="icon-wrapper">
                        <Key size={22} />
                    </div>
                    <div>
                        <h2 className="card-title">Google API Key</h2>
                        <p className="card-description">Required for AI-powered newsletter generation</p>
                    </div>
                </div>

                <div className="input-wrapper">
                    <input
                        type={showKey ? 'text' : 'password'}
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Enter your Google AI API Key..."
                        className="api-input"
                    />
                    <button
                        type="button"
                        onClick={() => setShowKey(!showKey)}
                        className="toggle-visibility"
                    >
                        {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>

                <div className="api-hint">
                    Get your API key from{' '}
                    <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer">
                        Google AI Studio <ExternalLink size={12} />
                    </a>
                </div>
            </section>

            {/* Model Selection */}
            <section className="settings-card">
                <div className="card-header">
                    <div className="icon-wrapper" style={{ background: 'var(--gradient-accent)' }}>
                        <Cpu size={22} />
                    </div>
                    <div>
                        <h2 className="card-title">AI Model</h2>
                        <p className="card-description">Choose the model for content generation</p>
                    </div>
                </div>

                <div className="model-grid">
                    {AVAILABLE_MODELS.map((m) => (
                        <label
                            key={m.value}
                            className={`model-option ${model === m.value ? 'selected' : ''}`}
                        >
                            <input
                                type="radio"
                                name="model"
                                value={m.value}
                                checked={model === m.value}
                                onChange={(e) => setModel(e.target.value)}
                            />
                            <div className="model-icon-wrapper">
                                {m.icon}
                            </div>
                            <div className="model-content">
                                <div className="model-header">
                                    <span className="model-name">{m.label}</span>
                                    {m.badge && (
                                        <span
                                            className="model-badge"
                                            style={{ background: m.badgeColor }}
                                        >
                                            {m.badge}
                                        </span>
                                    )}
                                </div>
                                <p className="model-description">{m.description}</p>
                            </div>
                            <div className="radio-circle">
                                <div className="radio-inner" />
                            </div>
                        </label>
                    ))}
                </div>
            </section>

            {/* Actions Bar */}
            <div className="actions-bar">
                <div className="status-indicator">
                    {status === 'success' && (
                        <>
                            <Check size={18} className="status-success" />
                            <span className="status-success">Settings saved successfully!</span>
                        </>
                    )}
                    {status === 'error' && (
                        <>
                            <AlertCircle size={18} className="status-error" />
                            <span className="status-error">Failed to save settings</span>
                        </>
                    )}
                </div>
                <button
                    onClick={handleSave}
                    disabled={isPending || !apiKey}
                    className="save-button"
                >
                    <Save size={18} />
                    {isPending ? 'Saving...' : 'Save Settings'}
                </button>
            </div>

            {/* Info Box */}
            <div className="info-box">
                <Info size={16} />
                <div>
                    <strong>Note:</strong> Your API key is stored securely and used only for generating newsletters.
                    If no key is configured here, the system will fall back to the key in your <code>.env</code> file.
                </div>
            </div>
        </div>
    );
}
