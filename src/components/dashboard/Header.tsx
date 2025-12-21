'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTheme } from "@/lib/theme-context";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
    Plus,
    Bell,
    Sun,
    Moon,
    Settings,
    BookOpen,
    LogOut,
    LayoutDashboard
} from "lucide-react";

export default function Header() {
    const { theme, toggleTheme } = useTheme();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    return (
        <header className="h-20 border-b border-border flex items-center justify-between px-6 sticky top-0 z-50 bg-background/80 backdrop-blur-lg">
            {/* Left side - Title */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <LayoutDashboard size={20} className="text-primary" />
                    <span className="font-semibold text-foreground text-lg">
                        Dashboard
                    </span>
                </div>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center gap-3">
                {/* Create New Brand */}
                <Button asChild size="sm" className="gap-2 hidden sm:flex">
                    <Link href="/brands/new">
                        <Plus size={16} />
                        Create Brand
                    </Link>
                </Button>

                {/* Mobile - Plus Only */}
                <Button asChild size="icon" variant="ghost" className="sm:hidden">
                    <Link href="/brands/new">
                        <Plus size={20} />
                    </Link>
                </Button>

                {/* Notifications */}
                <Button variant="ghost" size="icon" className="relative">
                    <Bell size={18} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
                </Button>

                {/* Theme Toggle */}
                <Button variant="ghost" size="icon" onClick={toggleTheme}>
                    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </Button>

                <Separator orientation="vertical" className="h-6 hidden sm:block" />

                {/* User Menu */}
                <div className="relative">
                    <button
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className="flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-full hover:bg-accent transition-colors"
                    >
                        <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-sm font-semibold">
                                U
                            </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm hidden sm:block">User</span>
                    </button>

                    {/* Dropdown Menu */}
                    {isUserMenuOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setIsUserMenuOpen(false)}
                            />
                            <div className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-border bg-popover shadow-lg z-50 overflow-hidden animate-fade-in">
                                <div className="px-4 py-3 border-b border-border">
                                    <div className="font-semibold">User</div>
                                    <div className="text-sm text-muted-foreground">user@example.com</div>
                                </div>

                                <div className="py-1">
                                    <Link
                                        href="/settings"
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-accent transition-colors"
                                        onClick={() => setIsUserMenuOpen(false)}
                                    >
                                        <Settings size={16} className="text-muted-foreground" />
                                        <span>Settings</span>
                                    </Link>

                                    <Link
                                        href="/docs"
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-accent transition-colors"
                                        onClick={() => setIsUserMenuOpen(false)}
                                    >
                                        <BookOpen size={16} className="text-muted-foreground" />
                                        <span>Documentation</span>
                                    </Link>

                                    <Separator className="my-1" />

                                    <button
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm w-full text-left hover:bg-accent transition-colors text-destructive"
                                        onClick={() => setIsUserMenuOpen(false)}
                                    >
                                        <LogOut size={16} />
                                        <span>Log Out</span>
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
