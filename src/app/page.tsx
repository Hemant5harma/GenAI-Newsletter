import Link from "next/link";

export default function Home() {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            background: 'radial-gradient(ellipse at top, #1e1b4b 0%, #09090b 50%)'
        }}>
            {/* Decorative Elements */}
            <div style={{
                position: 'absolute',
                top: '20%',
                left: '10%',
                width: '300px',
                height: '300px',
                background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(60px)',
                pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute',
                bottom: '20%',
                right: '10%',
                width: '400px',
                height: '400px',
                background: 'radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(80px)',
                pointerEvents: 'none'
            }} />

            <main className="animate-in" style={{ textAlign: 'center', maxWidth: '700px', position: 'relative', zIndex: 1 }}>
                {/* Logo */}
                <div style={{ marginBottom: '2rem' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        margin: '0 auto',
                        background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2.5rem',
                        boxShadow: '0 20px 60px rgba(99, 102, 241, 0.4)'
                    }}>
                        ✨
                    </div>
                </div>

                {/* Title */}
                <h1 style={{
                    fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                    fontWeight: 800,
                    lineHeight: 1.1,
                    marginBottom: '1.5rem',
                    letterSpacing: '-0.02em'
                }}>
                    <span className="gradient-text">AutoNewsletter</span>
                    <br />
                    <span style={{ color: '#fafafa' }}>AI Agent</span>
                </h1>

                {/* Description */}
                <p style={{
                    fontSize: '1.25rem',
                    color: 'var(--color-text-secondary)',
                    marginBottom: '3rem',
                    lineHeight: 1.7
                }}>
                    Your AI-powered newsletter team. Generate human-quality newsletters
                    daily with zero effort. Fully automated content creation.
                </p>

                {/* CTA Buttons */}
                <div className="flex gap-4" style={{ justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link href="/brands/new" className="btn btn-primary" style={{
                        padding: '1rem 2rem',
                        fontSize: '1rem',
                    }}>
                        <span>🚀</span> Get Started Free
                    </Link>
                    <Link href="/dashboard" className="btn btn-secondary" style={{
                        padding: '1rem 2rem',
                        fontSize: '1rem'
                    }}>
                        Open Dashboard
                    </Link>
                </div>

                {/* Features */}
                <div className="grid grid-cols-3 gap-6" style={{ marginTop: '5rem' }}>
                    {[
                        { icon: '🤖', title: 'AI Generation', desc: 'Powered by Gemini' },
                        { icon: '✍️', title: 'Smart Editor', desc: 'Block-based editing' },
                        { icon: '📧', title: 'Email Ready', desc: 'HTML export included' }
                    ].map((item, i) => (
                        <div key={i} className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{item.icon}</div>
                            <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{item.title}</div>
                            <div className="text-muted text-sm">{item.desc}</div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
