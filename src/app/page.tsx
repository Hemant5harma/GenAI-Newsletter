import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Bot,
    Palette,
    BarChart3,
    Pencil,
    Mail,
    Zap,
    Building2,
    Sparkles,
    Rocket,
    Target,
    Play
} from "lucide-react";

export default function Home() {
    const features = [
        {
            icon: Bot,
            title: 'Multi-Agent AI System',
            description: 'Our AI agents work together - researching topics, writing content, and designing layouts automatically.'
        },
        {
            icon: Palette,
            title: 'Smart Brand Styling',
            description: 'Each newsletter is crafted to match your brand colors, tone, and visual identity perfectly.'
        },
        {
            icon: BarChart3,
            title: 'Real-Time Research',
            description: 'AI reads the latest news and trends to create timely, relevant content for your audience.'
        },
        {
            icon: Pencil,
            title: 'Human-Quality Writing',
            description: 'Natural, engaging copy that sounds like it was written by your best content writer.'
        },
        {
            icon: Mail,
            title: 'Email-Ready HTML',
            description: 'Export beautiful, responsive HTML that works perfectly in any email client.'
        },
        {
            icon: Zap,
            title: 'One-Click Generation',
            description: 'Go from idea to finished newsletter in minutes, not hours. Zero manual work required.'
        }
    ];

    const steps = [
        {
            number: '01',
            title: 'Create Your Brand',
            description: 'Set up your brand with name, colors, tone, and target audience.',
            icon: Building2
        },
        {
            number: '02',
            title: 'Click Generate',
            description: 'Our AI agents spring into action - researching, writing, and designing.',
            icon: Sparkles
        },
        {
            number: '03',
            title: 'Send & Grow',
            description: 'Export your polished newsletter and send it to your subscribers.',
            icon: Rocket
        }
    ];

    const stats = [
        { value: '10K+', label: 'Newsletters Generated' },
        { value: '500+', label: 'Happy Brands' },
        { value: '3min', label: 'Avg. Generation Time' },
        { value: '99%', label: 'Satisfaction Rate' }
    ];

    return (
        <div className="min-h-screen bg-background overflow-hidden">
            {/* Floating Navigation */}
            <nav className="glass-strong fixed top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full flex items-center gap-8 z-50 shadow-lg">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-md flex items-center justify-center">
                        <Sparkles size={16} className="text-white" />
                    </div>
                    <span className="font-bold text-sm">AutoNews AI</span>
                </Link>
                <div className="hidden md:flex gap-6 items-center">
                    <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</Link>
                    <Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</Link>
                </div>
                <Button asChild size="sm">
                    <Link href="/dashboard">Get Started</Link>
                </Button>
            </nav>

            {/* Hero Section */}
            <section className="min-h-screen flex items-center justify-center pt-24 pb-16 px-4 relative">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[80px] animate-float" />
                    <div className="absolute bottom-[10%] right-[5%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[100px] animate-float" style={{ animationDirection: 'reverse' }} />
                    <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] bg-pink-500/5 rounded-full blur-[60px] animate-float" />
                </div>

                <div className="container relative z-10">
                    <div className="text-center max-w-4xl mx-auto">
                        {/* Badge */}
                        <div className="animate-fade-in-up mb-6">
                            <Badge variant="secondary" className="gap-2 px-4 py-2 text-sm bg-primary/10 text-primary border-0">
                                <Rocket size={14} /> Powered by Multi-Agent AI
                            </Badge>
                        </div>

                        {/* Main Headline */}
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                            <span className="text-foreground">Generate </span>
                            <span className="gradient-text-animated">Pro-Level</span>
                            <br />
                            <span className="text-foreground">Newsletters in Seconds</span>
                        </h1>

                        {/* Subtitle */}
                        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            Our AI agents research trends, write compelling content, and design
                            beautiful newsletters tailored to your brand. Zero effort. Maximum impact.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                            <Button asChild size="lg" className="gap-2 text-base px-8">
                                <Link href="/brands/new">
                                    <Sparkles size={18} /> Start Creating Free
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="gap-2 text-base px-8">
                                <Link href="/dashboard">
                                    <Play size={18} /> View Dashboard
                                </Link>
                            </Button>
                        </div>

                        {/* Hero Visual - Newsletter Preview */}
                        <div className="relative max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                            <Card className="shadow-2xl border-border/50">
                                <CardContent className="p-6">
                                    {/* Mock Newsletter Header */}
                                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
                                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                                            <Mail size={20} className="text-white" />
                                        </div>
                                        <div className="text-left">
                                            <div className="font-semibold text-sm">Weekly Tech Digest</div>
                                            <div className="text-xs text-muted-foreground">Generated • Dec 16, 2024</div>
                                        </div>
                                        <Badge variant="success" className="ml-auto">AI Generated</Badge>
                                    </div>

                                    {/* Mock Content */}
                                    <div className="flex gap-4">
                                        <div className="flex-1 space-y-2 text-left">
                                            <div className="skeleton h-5 w-4/5" />
                                            <div className="skeleton h-3.5 w-full" />
                                            <div className="skeleton h-3.5 w-11/12" />
                                            <div className="skeleton h-3.5 w-3/4" />
                                        </div>
                                        <div className="skeleton w-28 h-20 rounded-lg" />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Floating Elements */}
                            <div className="hidden sm:flex absolute -top-5 -right-5 px-4 py-3 bg-card border border-border rounded-xl shadow-lg text-sm font-medium items-center gap-2 animate-float">
                                <Target size={16} className="text-emerald-500" /> 98% Engagement
                            </div>
                            <div className="hidden sm:flex absolute -bottom-5 -left-5 px-4 py-3 bg-card border border-border rounded-xl shadow-lg text-sm font-medium items-center gap-2 animate-float" style={{ animationDirection: 'reverse' }}>
                                <Zap size={16} className="text-amber-500" /> Generated in 2.3s
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 border-y border-border bg-muted/30">
                <div className="container">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {stats.map((stat, i) => (
                            <div key={i}>
                                <div className="text-3xl md:text-4xl font-extrabold gradient-text mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-muted-foreground font-medium">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 px-4">
                <div className="container">
                    <div className="text-center mb-16">
                        <Badge variant="secondary" className="mb-4 gap-1 bg-primary/10 text-primary border-0">
                            <Sparkles size={12} /> Features
                        </Badge>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
                            Everything You Need to
                            <span className="gradient-text"> Dominate</span> Email
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Our multi-agent AI system handles the entire newsletter creation process,
                            so you can focus on growing your audience.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, i) => (
                            <Card key={i} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                                <CardContent className="p-8 text-center">
                                    <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <feature.icon size={28} className="text-primary" />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-3">
                                        {feature.title}
                                    </h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {feature.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-24 px-4 bg-card">
                <div className="container">
                    <div className="text-center mb-16">
                        <Badge variant="secondary" className="mb-4 gap-1 bg-primary/10 text-primary border-0">
                            <Rocket size={12} /> How It Works
                        </Badge>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
                            Three Simple Steps to
                            <span className="gradient-text"> Newsletter Success</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        {steps.map((step, i) => (
                            <div key={i} className="text-center relative">
                                {/* Connector Line */}
                                {i < steps.length - 1 && (
                                    <div className="hidden md:block absolute top-[40px] left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/30 to-primary/10" />
                                )}

                                {/* Step Number */}
                                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/25 relative z-10">
                                    <step.icon size={32} className="text-white" />
                                </div>

                                <div className="text-xs font-bold text-primary mb-2 tracking-widest">
                                    STEP {step.number}
                                </div>

                                <h3 className="text-xl font-semibold mb-3">
                                    {step.title}
                                </h3>

                                <p className="text-muted-foreground">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-4 relative overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5" />

                <div className="container relative z-10">
                    <div className="text-center max-w-2xl mx-auto">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
                            Ready to Create Your First
                            <span className="gradient-text"> AI Newsletter</span>?
                        </h2>
                        <p className="text-muted-foreground text-lg mb-8">
                            Join hundreds of brands who save hours each week with our AI-powered newsletter generation.
                        </p>
                        <Button asChild size="lg" className="gap-2 text-base px-8">
                            <Link href="/brands/new">
                                <Rocket size={18} /> Get Started For Free
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-4 border-t border-border bg-card">
                <div className="container">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-md flex items-center justify-center">
                                <Sparkles size={16} className="text-white" />
                            </div>
                            <span className="font-semibold">AutoNews AI</span>
                        </div>

                        <div className="flex gap-8 text-sm text-muted-foreground">
                            <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
                            <Link href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</Link>
                            <Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
                        </div>

                        <div className="text-sm text-muted-foreground">
                            © 2024 AutoNews AI. Built with ❤️
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
