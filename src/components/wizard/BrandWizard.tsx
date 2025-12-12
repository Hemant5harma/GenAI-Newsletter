'use client'

import { createBrand } from "@/app/actions";
import { useFormStatus } from "react-dom";
import { useState } from "react";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button type="submit" disabled={pending} className="btn btn-primary w-full" style={{ padding: '1rem', fontSize: '1rem', marginTop: '1.5rem' }}>
            {pending ? (
                <>
                    <span className="animate-spin" style={{ display: 'inline-block' }}>⏳</span>
                    Creating Workspace...
                </>
            ) : (
                <>
                    <span>🚀</span> Launch Brand Workspace
                </>
            )}
        </button>
    );
}

export default function BrandWizard() {
    const [step, setStep] = useState(1);

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            background: 'var(--color-bg-primary)'
        }}>
            <div className="animate-in" style={{ width: '100%', maxWidth: '560px' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: '56px',
                        height: '56px',
                        margin: '0 auto 1rem',
                        background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                        borderRadius: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem'
                    }}>
                        🎨
                    </div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                        Create Your Brand
                    </h1>
                    <p className="text-secondary">
                        Configure your AI newsletter agent in just a few steps
                    </p>
                </div>

                {/* Progress */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
                    {[1, 2, 3].map(s => (
                        <div key={s} style={{
                            flex: 1,
                            height: '4px',
                            borderRadius: '2px',
                            background: s <= step ? 'var(--color-accent)' : 'var(--color-bg-tertiary)',
                            transition: 'background 0.3s'
                        }} />
                    ))}
                </div>

                {/* Form Card */}
                <div className="card">
                    <form action={createBrand}>
                        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                            {/* Brand Identity */}
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                    <span style={{ fontSize: '1.25rem' }}>🏷️</span>
                                    <span style={{ fontWeight: 600 }}>Brand Identity</span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div>
                                        <label className="label">Brand Name *</label>
                                        <input
                                            name="name"
                                            required
                                            placeholder="e.g., VoxFashionPoint"
                                            className="input"
                                            onFocus={() => setStep(1)}
                                        />
                                    </div>
                                    <div>
                                        <label className="label">Tagline</label>
                                        <input
                                            name="tagline"
                                            placeholder="A short, catchy phrase"
                                            className="input"
                                        />
                                    </div>
                                </div>
                            </div>

                            <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)' }} />

                            {/* Content Strategy */}
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                    <span style={{ fontSize: '1.25rem' }}>📝</span>
                                    <span style={{ fontWeight: 600 }}>Content Strategy</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="label">Category *</label>
                                        <input
                                            name="category"
                                            required
                                            placeholder="e.g., Fashion"
                                            className="input"
                                            onFocus={() => setStep(2)}
                                        />
                                    </div>
                                    <div>
                                        <label className="label">Tone *</label>
                                        <input
                                            name="tone"
                                            required
                                            placeholder="e.g., Energetic"
                                            className="input"
                                        />
                                    </div>
                                </div>
                                <div style={{ marginTop: '1rem' }}>
                                    <label className="label">Target Audience *</label>
                                    <textarea
                                        name="audience"
                                        required
                                        rows={2}
                                        placeholder="Describe your ideal reader (age, interests, etc.)"
                                        className="textarea"
                                    />
                                </div>
                                <div style={{ marginTop: '1rem' }}>
                                    <label className="label">Brand Mission / Description</label>
                                    <textarea
                                        name="description"
                                        rows={2}
                                        placeholder="What does your brand stand for? What value do you provide?"
                                        className="textarea"
                                    />
                                </div>
                            </div>

                            <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)' }} />

                            {/* Website */}
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                    <span style={{ fontSize: '1.25rem' }}>🌐</span>
                                    <span style={{ fontWeight: 600 }}>Website</span>
                                </div>
                                <div>
                                    <label className="label">Website URL *</label>
                                    <input
                                        name="domain"
                                        required
                                        type="url"
                                        placeholder="https://yourbrand.com"
                                        className="input"
                                        onFocus={() => setStep(3)}
                                    />
                                </div>
                            </div>

                            <SubmitButton />
                        </div>
                    </form>
                </div>

                {/* Help Text */}
                <p className="text-center text-sm text-muted" style={{ marginTop: '1.5rem' }}>
                    Fields marked with * are required. You can update these later.
                </p>
            </div>
        </div>
    );
}
