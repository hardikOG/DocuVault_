'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield,
    Menu,
    X,
    Moon,
    Sun,
    LogOut,
    User,
    ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui';
import { clearToken, getUserFromToken } from '@/lib/auth';
import { cn } from '@/lib/utils';

interface NavbarProps {
    showAuthButtons?: boolean;
    showUserMenu?: boolean;
}

export function Navbar({ showAuthButtons = false, showUserMenu = false }: NavbarProps) {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isDark, setIsDark] = useState(false);
    const [user, setUser] = useState<{ id: string; email: string } | null>(null);

    useEffect(() => {
        // Check for dark mode preference
        const darkMode = localStorage.getItem('darkMode') === 'true' ||
            (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches);
        setIsDark(darkMode);
        if (darkMode) {
            document.documentElement.classList.add('dark');
        }

        // Get user info
        if (showUserMenu) {
            const userInfo = getUserFromToken();
            setUser(userInfo);
        }
    }, [showUserMenu]);

    const toggleDarkMode = useCallback(() => {
        setIsDark((prev) => {
            const newValue = !prev;
            localStorage.setItem('darkMode', String(newValue));
            if (newValue) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
            return newValue;
        });
    }, []);

    const handleLogout = useCallback(() => {
        clearToken();
        router.push('/login');
    }, [router]);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#0f1629]/90 backdrop-blur-lg border-b border-gray-200 dark:border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Shield className="h-8 w-8 text-emerald-500" />
                        </motion.div>
                        <span className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                            DocuVault
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-4">
                        {/* Dark Mode Toggle */}
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 transition-colors"
                            aria-label="Toggle dark mode"
                        >
                            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </button>

                        {/* Auth buttons for landing page */}
                        {showAuthButtons && (
                            <>
                                <Link href="/login">
                                    <Button variant="ghost">Login</Button>
                                </Link>
                                <Link href="/signup">
                                    <Button>Get Started</Button>
                                </Link>
                            </>
                        )}

                        {/* User menu for dashboard */}
                        {showUserMenu && user && (
                            <div className="relative">
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                                        <User className="h-4 w-4 text-white" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 max-w-[150px] truncate">
                                        {user.email}
                                    </span>
                                    <ChevronDown className={cn(
                                        "h-4 w-4 text-gray-500 transition-transform",
                                        isUserMenuOpen && "rotate-180"
                                    )} />
                                </button>

                                <AnimatePresence>
                                    {isUserMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 py-1"
                                        >
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                            >
                                                <LogOut className="h-4 w-4" />
                                                Logout
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
                    >
                        <div className="px-4 py-4 space-y-3">
                            <button
                                onClick={toggleDarkMode}
                                className="flex items-center gap-2 w-full px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                                {isDark ? 'Light Mode' : 'Dark Mode'}
                            </button>

                            {showAuthButtons && (
                                <>
                                    <Link href="/login" className="block">
                                        <Button variant="ghost" fullWidth>Login</Button>
                                    </Link>
                                    <Link href="/signup" className="block">
                                        <Button fullWidth>Get Started</Button>
                                    </Link>
                                </>
                            )}

                            {showUserMenu && user && (
                                <>
                                    <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                                        Signed in as {user.email}
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 w-full px-4 py-2 rounded-lg text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        <LogOut className="h-5 w-5" />
                                        Logout
                                    </button>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
