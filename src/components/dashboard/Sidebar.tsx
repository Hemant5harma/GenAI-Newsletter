'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
    Sparkles,
    ChevronLeft,
    ChevronRight,
    Inbox,
    Menu,
    X,
    Home,
    Plus,
    Settings,
    Crown,
    PanelLeftClose,
    PanelLeft
} from "lucide-react";

interface Brand {
    id: string;
    name: string;
    category: string | null;
}

// Generate consistent gradient based on string
function getGradientForString(str: string): string {
    const gradients = [
        'from-violet-500 to-purple-600',
        'from-blue-500 to-cyan-500',
        'from-emerald-500 to-teal-500',
        'from-orange-500 to-red-500',
        'from-pink-500 to-rose-500',
        'from-indigo-500 to-blue-600',
        'from-amber-500 to-orange-500',
        'from-fuchsia-500 to-pink-500',
    ];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return gradients[Math.abs(hash) % gradients.length];
}

const SIDEBAR_WIDTH = 260;
const SIDEBAR_COLLAPSED_WIDTH = 68;
const MOBILE_BREAKPOINT = 768;

export default function Sidebar({ brands }: { brands: Brand[] }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
            if (window.innerWidth >= MOBILE_BREAKPOINT) {
                setIsMobileOpen(false);
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (isMobile) {
            setIsMobileOpen(false);
        }
    }, [pathname, isMobile]);

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);
    const toggleMobileSidebar = () => setIsMobileOpen(!isMobileOpen);

    const sidebarWidth = isCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH;
    const showLabels = isMobile || !isCollapsed;

    // Navigation items
    const navItems = [
        { href: '/dashboard', icon: Home, label: 'Dashboard', exact: true },
        { href: '/settings', icon: Settings, label: 'Settings', exact: true },
    ];

    return (
        <>
            {/* Mobile Menu Button */}
            {isMobile && (
                <Button
                    onClick={toggleMobileSidebar}
                    variant="ghost"
                    size="icon"
                    className={cn(
                        "fixed top-4 left-4 z-[250] h-10 w-10 rounded-xl",
                        "bg-background/80 backdrop-blur-md border border-border shadow-lg",
                        "hover:bg-accent"
                    )}
                    aria-label={isMobileOpen ? "Close menu" : "Open menu"}
                >
                    {isMobileOpen ? <X size={18} /> : <Menu size={18} />}
                </Button>
            )}

            {/* Mobile Overlay */}
            {isMobile && isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[190] animate-fade-in"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed left-0 top-0 bottom-0 z-[200]",
                    "flex flex-col bg-card/95 backdrop-blur-xl",
                    "border-r border-border/50",
                    "transition-all duration-300 ease-out"
                )}
                style={{
                    width: isMobile ? `${SIDEBAR_WIDTH}px` : `${sidebarWidth}px`,
                    transform: isMobile
                        ? (isMobileOpen ? 'translateX(0)' : 'translateX(-100%)')
                        : 'translateX(0)',
                }}
            >
                {/* Edge Toggle Button - Desktop Only */}
                {!isMobile && (
                    <button
                        onClick={toggleSidebar}
                        className={cn(
                            "absolute -right-3 top-1/2 -translate-y-1/2 z-10",
                            "w-6 h-12 flex items-center justify-center",
                            "bg-card border border-border rounded-r-lg",
                            "text-muted-foreground hover:text-foreground",
                            "hover:bg-accent hover:border-primary/30",
                            "shadow-md hover:shadow-lg",
                            "transition-all duration-200",
                            "group"
                        )}
                        title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        {isCollapsed ? (
                            <ChevronRight size={14} className="group-hover:scale-110 transition-transform" />
                        ) : (
                            <ChevronLeft size={14} className="group-hover:scale-110 transition-transform" />
                        )}
                    </button>
                )}

                {/* Header */}
                <div className={cn(
                    "h-16 flex items-center shrink-0 border-b border-border/50",
                    showLabels ? "px-5 justify-start" : "px-2 justify-center"
                )}>
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <img
                            src="/newzly-logo.png"
                            alt="Newzly Logo"
                            className={cn(
                                "shrink-0 transition-transform group-hover:scale-105",
                                showLabels ? "h-9 w-auto" : "h-10 w-auto"
                            )}
                        />
                        {showLabels && (
                            <span className="font-bold text-base tracking-tight">
                                Newzly
                            </span>
                        )}
                    </Link>
                </div>

                {/* Main Navigation */}
                <div className={cn("flex-1 overflow-y-auto overflow-x-hidden", showLabels ? "p-3" : "p-2")}>
                    {/* Quick Nav */}
                    <div className="space-y-1 mb-4">
                        {navItems.map((item) => {
                            const isActive = item.exact
                                ? pathname === item.href
                                : pathname.startsWith(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-2.5 rounded-lg font-medium transition-all duration-200",
                                        showLabels ? "px-3 py-2" : "p-2.5 justify-center",
                                        isActive
                                            ? "bg-primary text-primary-foreground shadow-sm"
                                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                                    )}
                                >
                                    <item.icon size={18} className="shrink-0" />
                                    {showLabels && <span className="text-sm">{item.label}</span>}
                                </Link>
                            );
                        })}
                    </div>

                    <Separator className="my-3 opacity-50" />

                    {/* Brands Section */}
                    <div className="mb-3">
                        {showLabels && (
                            <div className="px-3 py-1.5 flex items-center justify-between">
                                <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70">
                                    Brands
                                </span>
                                <Link
                                    href="/brands/new"
                                    className="p-1 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <Plus size={14} />
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Brands List */}
                    <div className="space-y-0.5">
                        {brands.length === 0 ? (
                            showLabels && (
                                <div className="py-8 text-center">
                                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-muted/50 flex items-center justify-center">
                                        <Inbox size={20} className="text-muted-foreground/50" />
                                    </div>
                                    <p className="text-xs text-muted-foreground mb-3">No brands yet</p>
                                    <Button asChild size="sm" variant="outline" className="text-xs h-8">
                                        <Link href="/brands/new">
                                            <Plus size={12} className="mr-1" /> Create Brand
                                        </Link>
                                    </Button>
                                </div>
                            )
                        ) : (
                            brands.map((brand) => {
                                const isActive = pathname.includes(`/dashboard/brands/${brand.id}`);
                                const gradient = getGradientForString(brand.name);
                                return (
                                    <Link
                                        key={brand.id}
                                        href={`/dashboard/brands/${brand.id}`}
                                        title={brand.name}
                                        className={cn(
                                            "flex items-center gap-2.5 rounded-lg transition-all duration-200",
                                            showLabels ? "px-2.5 py-2" : "p-2 justify-center",
                                            isActive
                                                ? "bg-accent/80 text-foreground"
                                                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                                        )}
                                    >
                                        {/* Brand Avatar */}
                                        <div className={cn(
                                            "flex items-center justify-center rounded-lg text-white font-semibold shrink-0 bg-gradient-to-br shadow-sm",
                                            gradient,
                                            showLabels ? "w-8 h-8 text-xs" : "w-9 h-9 text-sm"
                                        )}>
                                            {brand.name.charAt(0).toUpperCase()}
                                        </div>
                                        {showLabels && (
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-medium truncate">{brand.name}</div>
                                                {brand.category && (
                                                    <div className="text-[10px] text-muted-foreground/70 truncate">
                                                        {brand.category}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </Link>
                                );
                            })
                        )}
                    </div>

                    {/* Add Brand Button (when collapsed) */}
                    {!showLabels && (
                        <Link
                            href="/brands/new"
                            title="Add Brand"
                            className={cn(
                                "flex items-center justify-center p-2 mt-2 rounded-lg",
                                "border border-dashed border-border/60",
                                "text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5",
                                "transition-all duration-200"
                            )}
                        >
                            <Plus size={18} />
                        </Link>
                    )}
                </div>

                {/* Footer */}
                <div className={cn(
                    "border-t border-border/50 shrink-0",
                    showLabels ? "p-3" : "p-2"
                )}>
                    {/* Pro Badge */}
                    {showLabels ? (
                        <div className="p-3 rounded-lg bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 border border-amber-500/20">
                            <div className="flex items-center gap-2 mb-1">
                                <Crown size={14} className="text-amber-500" />
                                <span className="text-xs font-semibold">Free Plan</span>
                            </div>
                            <p className="text-[10px] text-muted-foreground mb-2">Upgrade for unlimited newsletters</p>
                            <Button size="sm" className="w-full h-7 text-xs bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0">
                                Upgrade to Pro
                            </Button>
                        </div>
                    ) : (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="w-full h-10"
                            title="Upgrade to Pro"
                        >
                            <Crown size={18} className="text-amber-500" />
                        </Button>
                    )}
                </div>
            </aside>

            {/* Spacer */}
            {!isMobile && (
                <div
                    className="shrink-0 transition-all duration-300 ease-out"
                    style={{ width: `${sidebarWidth}px` }}
                />
            )}
        </>
    );
}
