import Link from "next/link";

export default function Home() {
    const features = [
        {
            icon: '🤖',
            title: 'Multi-Agent AI System',
            description: 'Our AI agents work together - researching topics, writing content, and designing layouts automatically.'
        },
        {
            icon: '🎨',
            title: 'Smart Brand Styling',
            description: 'Each newsletter is crafted to match your brand colors, tone, and visual identity perfectly.'
        },
        {
            icon: '📊',
            title: 'Real-Time Research',
            description: 'AI reads the latest news and trends to create timely, relevant content for your audience.'
        },
        {
            icon: '✍️',
            title: 'Human-Quality Writing',
            description: 'Natural, engaging copy that sounds like it was written by your best content writer.'
        },
        {
            icon: '📧',
            title: 'Email-Ready HTML',
            description: 'Export beautiful, responsive HTML that works perfectly in any email client.'
        },
        {
            icon: '⚡',
            title: 'One-Click Generation',
            description: 'Go from idea to finished newsletter in minutes, not hours. Zero manual work required.'
        }
    ];

    const steps = [
        {
            number: '01',
            title: 'Create Your Brand',
            description: 'Set up your brand with name, colors, tone, and target audience.',
            icon: '🏢'
        },
        {
            number: '02',
            title: 'Click Generate',
            description: 'Our AI agents spring into action - researching, writing, and designing.',
            icon: '✨'
        },
        {
            number: '03',
            title: 'Send & Grow',
            description: 'Export your polished newsletter and send it to your subscribers.',
            icon: '🚀'
        }
    ];

    const stats = [
        { value: '10K+', label: 'Newsletters Generated' },
        { value: '500+', label: 'Happy Brands' },
        { value: '3min', label: 'Avg. Generation Time' },
        { value: '99%', label: 'Satisfaction Rate' }
    ];

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--color-bg-primary)',
            overflow: 'hidden'
        }}>
            {/* Floating Navigation */}
            <nav className="glass-strong" style={{
                position: 'fixed',
                top: '1rem',
                left: '50%',
                transform: 'translateX(-50%)',
                padding: '0.75rem 1.5rem',
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                gap: '2rem',
                zIndex: 1000,
                boxShadow: 'var(--shadow-lg)'
            }}>
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        background: 'var(--gradient-primary)',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1rem'
                    }}>✨</div>
                    <span style={{ fontWeight: 700, fontSize: '1rem' }}>AutoNews AI</span>
                </Link>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <Link href="#features" style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', transition: 'color var(--transition-fast)' }} className="nav-link">Features</Link>
                    <Link href="#how-it-works" style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }} className="nav-link">How It Works</Link>
                </div>
                <Link href="/dashboard" className="btn btn-primary btn-sm">
                    Get Started
                </Link>
            </nav>

            {/* Hero Section */}
            <section style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '6rem 2rem 4rem',
                position: 'relative'
            }}>
                {/* Animated Background Elements */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    overflow: 'hidden',
                    pointerEvents: 'none'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: '10%',
                        left: '5%',
                        width: '500px',
                        height: '500px',
                        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, transparent 70%)',
                        borderRadius: '50%',
                        filter: 'blur(80px)',
                        animation: 'float 8s ease-in-out infinite'
                    }} />
                    <div style={{
                        position: 'absolute',
                        bottom: '10%',
                        right: '5%',
                        width: '600px',
                        height: '600px',
                        background: 'radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%)',
                        borderRadius: '50%',
                        filter: 'blur(100px)',
                        animation: 'float 10s ease-in-out infinite reverse'
                    }} />
                    <div style={{
                        position: 'absolute',
                        top: '40%',
                        right: '20%',
                        width: '300px',
                        height: '300px',
                        background: 'radial-gradient(circle, rgba(236, 72, 153, 0.08) 0%, transparent 70%)',
                        borderRadius: '50%',
                        filter: 'blur(60px)',
                        animation: 'float 7s ease-in-out infinite'
                    }} />
                </div>

                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
                        {/* Badge */}
                        <div
                            className="animate-in"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.5rem 1rem',
                                background: 'var(--color-accent-glow)',
                                borderRadius: 'var(--radius-full)',
                                marginBottom: '1.5rem',
                                fontSize: '0.8125rem',
                                fontWeight: 500,
                                color: 'var(--color-accent)'
                            }}
                        >
                            <span>🚀</span> Powered by Multi-Agent AI
                        </div>

                        {/* Main Headline */}
                        <h1
                            className="animate-in stagger-1"
                            style={{
                                fontSize: 'clamp(2.5rem, 7vw, 5rem)',
                                fontWeight: 800,
                                lineHeight: 1.05,
                                marginBottom: '1.5rem',
                                letterSpacing: '-0.03em'
                            }}
                        >
                            <span style={{ color: 'var(--color-text-primary)' }}>Generate </span>
                            <span className="gradient-text-animated">Pro-Level</span>
                            <br />
                            <span style={{ color: 'var(--color-text-primary)' }}>Newsletters in Seconds</span>
                        </h1>

                        {/* Subtitle */}
                        <p
                            className="animate-in stagger-2"
                            style={{
                                fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                                color: 'var(--color-text-secondary)',
                                marginBottom: '2.5rem',
                                lineHeight: 1.7,
                                maxWidth: '600px',
                                margin: '0 auto 2.5rem'
                            }}
                        >
                            Our AI agents research trends, write compelling content, and design
                            beautiful newsletters tailored to your brand. Zero effort. Maximum impact.
                        </p>

                        {/* CTA Buttons */}
                        <div
                            className="animate-in stagger-3"
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                gap: '1rem',
                                flexWrap: 'wrap',
                                marginBottom: '4rem'
                            }}
                        >
                            <Link href="/brands/new" className="btn btn-primary btn-lg">
                                <span>✨</span> Start Creating Free
                            </Link>
                            <Link href="/dashboard" className="btn btn-secondary btn-lg">
                                View Dashboard
                            </Link>
                        </div>

                        {/* Hero Visual - Newsletter Preview */}
                        <div
                            className="animate-in stagger-4"
                            style={{
                                position: 'relative',
                                maxWidth: '800px',
                                margin: '0 auto'
                            }}
                        >
                            <div style={{
                                background: 'var(--color-bg-secondary)',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--radius-xl)',
                                padding: '1.5rem',
                                boxShadow: 'var(--shadow-xl), var(--shadow-glow-lg)'
                            }}>
                                {/* Mock Newsletter Header */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    marginBottom: '1rem',
                                    paddingBottom: '1rem',
                                    borderBottom: '1px solid var(--color-border)'
                                }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        background: 'var(--gradient-primary)',
                                        borderRadius: 'var(--radius-md)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>📧</div>
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Weekly Tech Digest</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Generated • Dec 16, 2024</div>
                                    </div>
                                    <span className="badge badge-success" style={{ marginLeft: 'auto' }}>AI Generated</span>
                                </div>

                                {/* Mock Content */}
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <div style={{ flex: 1 }}>
                                        <div className="skeleton" style={{ height: '20px', width: '80%', marginBottom: '0.5rem' }} />
                                        <div className="skeleton" style={{ height: '14px', width: '100%', marginBottom: '0.25rem' }} />
                                        <div className="skeleton" style={{ height: '14px', width: '90%', marginBottom: '0.25rem' }} />
                                        <div className="skeleton" style={{ height: '14px', width: '70%' }} />
                                    </div>
                                    <div className="skeleton" style={{ width: '120px', height: '80px', borderRadius: 'var(--radius-md)' }} />
                                </div>
                            </div>

                            {/* Floating Elements */}
                            <div style={{
                                position: 'absolute',
                                top: '-20px',
                                right: '-20px',
                                padding: '0.75rem 1rem',
                                background: 'var(--color-bg-secondary)',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--radius-lg)',
                                boxShadow: 'var(--shadow-lg)',
                                fontSize: '0.8125rem',
                                fontWeight: 500,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                animation: 'float 4s ease-in-out infinite'
                            }}>
                                <span>🎯</span> 98% Engagement
                            </div>
                            <div style={{
                                position: 'absolute',
                                bottom: '-20px',
                                left: '-20px',
                                padding: '0.75rem 1rem',
                                background: 'var(--color-bg-secondary)',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--radius-lg)',
                                boxShadow: 'var(--shadow-lg)',
                                fontSize: '0.8125rem',
                                fontWeight: 500,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                animation: 'float 5s ease-in-out infinite reverse'
                            }}>
                                <span>⚡</span> Generated in 2.3s
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section style={{
                padding: '4rem 2rem',
                borderTop: '1px solid var(--color-border)',
                borderBottom: '1px solid var(--color-border)',
                background: 'var(--gradient-surface)'
            }}>
                <div className="container">
                    <div className="grid grid-cols-4 gap-8" style={{ textAlign: 'center' }}>
                        {stats.map((stat, i) => (
                            <div key={i}>
                                <div style={{
                                    fontSize: 'clamp(2rem, 4vw, 3rem)',
                                    fontWeight: 800,
                                    marginBottom: '0.5rem'
                                }} className="gradient-text">
                                    {stat.value}
                                </div>
                                <div style={{
                                    fontSize: '0.875rem',
                                    color: 'var(--color-text-muted)',
                                    fontWeight: 500
                                }}>
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" style={{ padding: '6rem 2rem' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <span className="badge badge-accent" style={{ marginBottom: '1rem' }}>
                            ✨ Features
                        </span>
                        <h2 style={{
                            fontSize: 'clamp(2rem, 4vw, 3rem)',
                            fontWeight: 700,
                            marginBottom: '1rem',
                            letterSpacing: '-0.02em'
                        }}>
                            Everything You Need to
                            <span className="gradient-text"> Dominate</span> Email
                        </h2>
                        <p style={{
                            color: 'var(--color-text-secondary)',
                            fontSize: '1.125rem',
                            maxWidth: '600px',
                            margin: '0 auto'
                        }}>
                            Our multi-agent AI system handles the entire newsletter creation process,
                            so you can focus on growing your audience.
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                        {features.map((feature, i) => (
                            <div
                                key={i}
                                className="card card-interactive"
                                style={{
                                    padding: '2rem',
                                    textAlign: 'center',
                                    cursor: 'default'
                                }}
                            >
                                <div style={{
                                    width: '64px',
                                    height: '64px',
                                    margin: '0 auto 1.5rem',
                                    background: 'var(--gradient-surface)',
                                    borderRadius: 'var(--radius-lg)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '2rem'
                                }}>
                                    {feature.icon}
                                </div>
                                <h3 style={{
                                    fontSize: '1.125rem',
                                    fontWeight: 600,
                                    marginBottom: '0.75rem'
                                }}>
                                    {feature.title}
                                </h3>
                                <p style={{
                                    color: 'var(--color-text-secondary)',
                                    fontSize: '0.9375rem',
                                    lineHeight: 1.6
                                }}>
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" style={{
                padding: '6rem 2rem',
                background: 'var(--color-bg-secondary)'
            }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <span className="badge badge-accent" style={{ marginBottom: '1rem' }}>
                            🚀 How It Works
                        </span>
                        <h2 style={{
                            fontSize: 'clamp(2rem, 4vw, 3rem)',
                            fontWeight: 700,
                            marginBottom: '1rem',
                            letterSpacing: '-0.02em'
                        }}>
                            Three Simple Steps to
                            <span className="gradient-text"> Newsletter Success</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-3 gap-8">
                        {steps.map((step, i) => (
                            <div key={i} style={{ textAlign: 'center', position: 'relative' }}>
                                {/* Connector Line */}
                                {i < steps.length - 1 && (
                                    <div className="hide-mobile" style={{
                                        position: 'absolute',
                                        top: '60px',
                                        left: '60%',
                                        width: '80%',
                                        height: '2px',
                                        background: 'var(--gradient-primary)',
                                        opacity: 0.3
                                    }} />
                                )}

                                {/* Step Number */}
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    margin: '0 auto 1.5rem',
                                    background: 'var(--gradient-primary)',
                                    borderRadius: 'var(--radius-xl)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '2rem',
                                    boxShadow: 'var(--shadow-glow-lg)',
                                    position: 'relative',
                                    zIndex: 1
                                }}>
                                    {step.icon}
                                </div>

                                <div style={{
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    color: 'var(--color-accent)',
                                    marginBottom: '0.5rem',
                                    letterSpacing: '0.1em'
                                }}>
                                    STEP {step.number}
                                </div>

                                <h3 style={{
                                    fontSize: '1.25rem',
                                    fontWeight: 600,
                                    marginBottom: '0.75rem'
                                }}>
                                    {step.title}
                                </h3>

                                <p style={{
                                    color: 'var(--color-text-secondary)',
                                    fontSize: '0.9375rem',
                                    lineHeight: 1.6
                                }}>
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section style={{
                padding: '6rem 2rem',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Background gradient */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'var(--gradient-primary)',
                    opacity: 0.05
                }} />

                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{
                        textAlign: 'center',
                        maxWidth: '700px',
                        margin: '0 auto'
                    }}>
                        <h2 style={{
                            fontSize: 'clamp(2rem, 4vw, 3rem)',
                            fontWeight: 700,
                            marginBottom: '1rem',
                            letterSpacing: '-0.02em'
                        }}>
                            Ready to Create Your First
                            <span className="gradient-text"> AI Newsletter</span>?
                        </h2>
                        <p style={{
                            color: 'var(--color-text-secondary)',
                            fontSize: '1.125rem',
                            marginBottom: '2rem'
                        }}>
                            Join hundreds of brands who save hours each week with our AI-powered newsletter generation.
                        </p>
                        <Link href="/brands/new" className="btn btn-primary btn-lg">
                            <span>🚀</span> Get Started For Free
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{
                padding: '3rem 2rem',
                borderTop: '1px solid var(--color-border)',
                background: 'var(--color-bg-secondary)'
            }}>
                <div className="container">
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '1rem'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{
                                width: '32px',
                                height: '32px',
                                background: 'var(--gradient-primary)',
                                borderRadius: 'var(--radius-sm)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.875rem'
                            }}>✨</div>
                            <span style={{ fontWeight: 600 }}>AutoNews AI</span>
                        </div>

                        <div style={{
                            display: 'flex',
                            gap: '2rem',
                            fontSize: '0.875rem',
                            color: 'var(--color-text-secondary)'
                        }}>
                            <Link href="#features" className="nav-link">Features</Link>
                            <Link href="#how-it-works" className="nav-link">How It Works</Link>
                            <Link href="/dashboard" className="nav-link">Dashboard</Link>
                        </div>

                        <div style={{
                            fontSize: '0.8125rem',
                            color: 'var(--color-text-muted)'
                        }}>
                            © 2024 AutoNews AI. Built with ❤️
                        </div>
                    </div>
                </div>
            </footer>

            <style>{`
                .nav-link:hover {
                    color: var(--color-accent) !important;
                }
            `}</style>
        </div>
    );
}
